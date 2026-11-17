/* Pagina één woning: invoer lezen, rekenkern aanroepen (01-rekenkern.js), uitkomsten en grafieken tonen.
   Teksten via DC.t() (data/teksten.js); bij wisselen van taal of thema tekent run() alles opnieuw. */
(function(){
const RK=window.DC_REKENKERN;
const {T,CATS,MX,colIdx,entry,entryWhy,parts,damage,withCurve,range}=RK;
const t=DC.t, tv=DC.tv;
const $=id=>document.getElementById(id);
const eur=v=>'€'+DC.getal(Math.round(v));
const eurK=v=>v>=1000?'€'+DC.getal(v/1000,1)+'k':'€'+Math.round(v);
const dec=(v,d=2)=>DC.getal(v,d);
const css=n=>getComputedStyle(document.documentElement).getPropertyValue(n).trim();
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
const kl=k=>t('klasse.'+k), om=k=>t('omg.'+k), cat=k=>t('cat.'+k);

const MEAS=window.DC_MAATREGELEN;
const CURVES=window.DC_CURVES; const CV=Object.fromEntries(CURVES.map(c=>[c.id,c])); const IDS=CURVES.map(c=>c.id);
// beginwaarden uit data/standaard.js (zelfde vertrekpunt als de portefeuillepagina)
const SD=(window.DC_STANDAARD||{}).pand;
const S={crawl:SD?SD.K.crawl:1,rate:SD?SD.rente:0.0225,curve:SD&&CV[SD.C.curve]?SD.C.curve:IDS[0]};
if(SD){
  const zet=(id,v)=>{const e=$(id); if(e&&v!=null) e.value=v;};
  ['h100','h250','h1000'].forEach((id,i)=>zet(id,SD.h[i])); zet('corr',SD.corr); zet('t0',SD.t0);
  ['hdr','hin','route','riool','bj','inst'].forEach(k=>zet(k,SD.K[k])); zet('area',SD.K.A); zet('kelder',String(SD.K.kelder));
  ['cvast','cdiep','dkr','dkel','drio','dinst','cind','pinb','pinbd'].forEach(k=>zet(k,SD.C[k])); zet('wlim',SD.C.W); zet('inb',SD.C.I);
  zet('hor',SD.horizon); zet('om',SD.onderhoud);
  [['crawl',S.crawl],['rate',S.rate]].forEach(([id,v])=>$(id).querySelectorAll('button').forEach(b=>b.classList.toggle('on',+b.dataset.v===+v)));
  MEAS.forEach(m=>m.on=SD.maatregelen.includes(m.id));
}

// ---- teksten die uit data komen (opnieuw bij taalwissel)
function tekenCurves(){
  $('curve').innerHTML=CURVES.map(c=>`<button type="button" class="${c.id===S.curve?'on':''}" data-v="${c.id}" title="${esc(tv(c,'naam'))}">${esc(tv(c,'kort'))}</button>`).join('');
  $('curvesrc').innerHTML=CURVES.map(c=>`<b>${esc(tv(c,'naam'))}.</b> ${tv(c,'uitleg')} <i>${tv(c,'bron')}</i>`).join('<br>');
  $('rate').querySelectorAll('button').forEach(b=>b.textContent=dec(+b.dataset.v*100)+'%');
}
function tekenMaatregelen(){
  if($('mlist').children.length) MEAS.forEach(m=>{const e=$(m.id); if(e) m.on=e.checked;});
  let lastLvl='';
  $('mlist').innerHTML=MEAS.map(m=>{let h=''; const lvl=tv(m,'lvl'); if(lvl!==lastLvl){h+=`<div class="lvlh">${esc(lvl)}</div>`;lastLvl=lvl;}
   return h+`<label class="chk" for="${m.id}"><input type="checkbox" id="${m.id}" ${m.on?'checked':''}><span><b>${esc(tv(m,'name'))}</b></span><span class="c eurin" onclick="event.preventDefault()">€<input type="number" class="numin" data-m="${m.id}" min="0" step="50" value="${m.cost}" aria-label="${esc(t('m.kostenlabel',{n:tv(m,'name')}))}"></span><span class="meta"><span class="mtag">FCAB-3 #${m.nr}</span>${m.f2?`<span class="mtag f2">${t('m.gebouwscore')}</span>`:''}<small style="color:var(--text3)">${esc(t('m.kosten',{k:t('niveau.'+m.k),c:t('cx.'+m.c),d:tv(m,'desc')}))}</small></span></label>`;}).join('');
  $('mlist').querySelectorAll('input').forEach(i=>i.addEventListener('input',run));
}
tekenCurves(); tekenMaatregelen();

function seg(id,key){ $(id).addEventListener('click',e=>{const b=e.target.closest('button'); if(!b)return;
  $(id).querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b)); const v=b.dataset.v; S[key]=isNaN(+v)?v:parseFloat(v); run();}); }
seg('crawl','crawl'); seg('rate','rate'); seg('curve','curve');
const num=id=>parseFloat($(id).value);
const kn=id=>{const e=$(id+'n'); const v=e?parseFloat(String(e.value).replace(',','.')):NaN; return isNaN(v)?num(id):Math.max(0,v);};
const POSTS=[];

const eurR=([a,b])=>Math.round(a)===Math.round(b)?eur(a):eur(a)+' – '+eur(b).slice(1);
const sgn=v=>(v<0?'−':'')+eur(Math.abs(v));
function niceTicks(m){const step=m>30000?10000:m>12000?5000:m>4000?2000:1000; const a=[]; for(let v=0;v<=m+1;v+=step)a.push(v); return a;}
function axes(W,H,L,B,xmax,ymax,xlab){
  let g=''; niceTicks(ymax).forEach(v=>{const y=H-B-(v/ymax)*(H-B-12); g+=`<line class="grid" x1="${L}" x2="${W-8}" y1="${y}" y2="${y}"/><text x="${L-6}" y="${y+4}" text-anchor="end">${eurK(v)}</text>`;});
  [0,20,40,60].forEach(v=>{const x=L+v/xmax*(W-L-8); g+=`<text x="${x}" y="${H-B+15}" text-anchor="middle">${v}</text>`;});
  return g+`<text x="${(L+W)/2}" y="${H-4}" text-anchor="middle">${xlab}</text>`;
}
function pathOf(f,xmax,ymax,W,H,L,B){let d='';for(let i=0;i<=300;i++){const h=i/300*xmax;const x=L+h/xmax*(W-L-8);const y=H-B-Math.min(f(h),ymax)/ymax*(H-B-12);d+=(i?'L':'M')+x.toFixed(1)+','+y.toFixed(1);}return d;}
const chip=(k,lab,lg)=>`<span class="chip${lg?' lg':''}"><i style="background:var(--r${k})"></i>${lab}</span>`;

function run(){
  const set=(id,s)=>{const e=$(id+'v'); if(e) e.textContent=s;};
  ['h100','h250','h1000'].forEach(k=>set(k,num(k)+' cm'));
  set('corr',(num('corr')>0?'+':'')+num('corr')+' cm');
  set('hin',num('hin')+' cm'); set('hdr',num('hdr')+' cm'); set('area',num('area')+' m²'); set('bj',num('bj'));
  ['dkr','dkel','drio','dinst','cind','cvast','wlim','inb'].forEach(k=>set(k,eur(num(k))));
  set('pinb',dec(num('pinb'))+'%'); set('pinbd',dec(num('pinbd'))+'%'); set('cdiep','€'+dec(num('cdiep')));
  set('t0','1/'+num('t0')); set('hor',num('hor')+' '+t('eenheid.jaar')); set('om',dec(num('om'))+'%');
  // ---- invoer → rekenkern
  const kv=$('kelder').value;
  MEAS.forEach(m=>{const e=document.querySelector('[data-m="'+m.id+'"]'); if(e) m.cost=Math.max(0,parseFloat(e.value)||0);});
  const U=RK.bereken({
    h:[num('h100'),num('h250'),num('h1000')], corr:num('corr'), t0:num('t0'),
    K:{hdr:num('hdr'),hin:num('hin'),A:num('area'),crawl:S.crawl,kelder:kv==='none'?'none':parseFloat(kv),riool:$('riool').value,bj:num('bj'),inst:$('inst').value,route:$('route').value},
    C:{cvast:kn('cvast'),cdiep:kn('cdiep'),dkr:kn('dkr'),dkel:kn('dkel'),drio:kn('drio'),dinst:kn('dinst'),cind:kn('cind'),extra:POSTS.filter(p=>p.amt>0),curve:S.curve,W:kn('wlim'),I:kn('inb'),pinb:num('pinb'),pinbd:num('pinbd')},
    maatregelen:MEAS.filter(m=>$(m.id).checked).map(m=>m.id),
    rente:S.rate, horizon:num('hor'), onderhoud:num('om')});
  const {hs,hs2,K,K2,C,C2,dh,O,O2,R,R2,E,dE,cwB,cwK,NCW,Ec,dEc,EcCat,dECat,NCWc,BKc,cost}=U, G=U.gebouw, G2=U.gebouw2;
  const lines=MEAS.filter(m=>$(m.id).checked&&m.effect&&m.effect.regel).map(m=>tv(m.effect,'regel'));
  $('f5').textContent=lines.length?lines.join('\n'):t('f5.geen');
  const per=f=>Object.fromEntries(IDS.map(id=>[id,f(id)]));
  const bandTxt=t('band.over',{lijst:CURVES.map(x=>tv(x,'kort')).join(', ')});
  const cur=CV[S.curve], curK=tv(cur,'kort');
  const c=k=>css(k), via=K=>t('via.'+entryWhy(K));

  // ---- step 1 chart
  { const W=360,H=170,L=34,B=34,Rr=92, ymax=Math.max(60,Math.ceil(Math.max(...hs,K.hdr)/10)*10+10);
    const y=v=>H-B-v/ymax*(H-B-14); let g='';
    [0,ymax/2,ymax].forEach(v=>g+=`<line class="grid" x1="${L}" x2="${W-Rr}" y1="${y(v)}" y2="${y(v)}"/><text x="${L-6}" y="${y(v)+4}" text-anchor="end">${Math.round(v)}</text>`);
    const cols=[c('--water1'),c('--water2'),c('--water3')];
    hs.forEach((h,i)=>{const x=L+14+i*76,w=50; g+=`<rect x="${x}" y="${y(h)}" width="${w}" height="${y(0)-y(h)}" rx="5" fill="${cols[i]}"/><text class="lab" x="${x+w/2}" y="${y(h)-6}" text-anchor="middle">${h} cm</text><text x="${x+w/2}" y="${H-B+15}" text-anchor="middle">${t('c1.per',{t:T[i]})}</text>`;});
    const ly=[y(K.hin),y(K.hdr)]; if(Math.abs(ly[0]-ly[1])<13) ly[1]=ly[0]-13;
    [[K.hin,t('c1.instroom')],[K.hdr,t('c1.ingang')]].forEach(([v,s],k)=>{g+=`<line x1="${L}" x2="${W-Rr+4}" y1="${y(v)}" y2="${y(v)}" stroke="${c('--phase2')}" stroke-dasharray="4 4" stroke-width="1.2"/><text x="${W-Rr+8}" y="${ly[k]+4}" style="fill:${c('--phase2')};font-weight:600">${s} ${v}</text>`;});
    g+=`<text x="${(L+W-Rr)/2}" y="${H-4}" text-anchor="middle">${t('c1.as')}</text>`;
    $('c1').innerHTML=g; }
  $('o1').innerHTML=chip(O,t('o1.label',{k:om(O)}),true)+`<small>${t('o1.sub',{h:hs[0]})}</small>`;

  // ---- step 2
  $('t2').innerHTML=`<tr><th>${t('t2.kenmerk')}</th><th>${t('t2.situatie')}</th><th class="r">${t('t2.punten')}</th></tr>`+G.rows.map(r=>`<tr><td>${t('gs.'+r[0])}</td><td style="color:var(--text3)">${t('gs.'+r[0]+'.'+r[2])}</td><td class="r">${dec(r[1],1)}</td></tr>`).join('')+`<tr class="tot"><td>${t('t2.totaal')}</td><td></td><td class="r">${dec(G.total,1)}</td></tr>`;
  let mx=''; for(let o=5;o>=0;o--){ mx+=`<tr><th>${om(o).toLowerCase()}</th>`; for(let ci=0;ci<20;ci++){const k=o===0?0:MX[o][ci]; const me=(o===O&&ci===colIdx(G.total)); const me2=(o===O2&&ci===colIdx(G2.total))&&!me&&(lines.length>0); mx+=`<td style="background:var(--r${k})" class="${me?'me':''}${me2?' me2':''}" title="${esc(t('mx.cel',{o:om(o),g:(ci+1)*5,k:kl(k)}))}"></td>`;} mx+='</tr>'; }
  $('mx').innerHTML=mx;
  $('o2b').innerHTML=t('o2b',{h:entry(K),via:via(K)});
  $('o2').innerHTML=chip(R,t('o2.label',{k:kl(R).toLowerCase()}),true)+`<small>${t('o2.sub',{o:om(O).toLowerCase(),g:dec(G.total,1)})}</small>`;

  // ---- step 3
  { const W=320,H=190,L=40,B=34,xmax=60;
    const fs=IDS.map(id=>{const Cc=withCurve(C,id); return h=>damage(h,K,Cc);});
    const ymax=Math.max(10000,Math.ceil(Math.max(...fs.map(f=>f(xmax)))/5000)*5000);
    let g=axes(W,H,L,B,xmax,ymax,t('c3.as')); const X=h=>L+h/xmax*(W-L-8);
    const lo=pathOf(h=>Math.min(...fs.map(f=>f(h))),xmax,ymax,W,H,L,B), hi=pathOf(h=>Math.max(...fs.map(f=>f(h))),xmax,ymax,W,H,L,B);
    const rev=lo.split(/(?=[ML])/).reverse().map(s=>'L'+s.slice(1)).join('');
    g+=`<path d="${hi}${rev}Z" fill="${c(cur.kleur)}" fill-opacity=".10"/>`;
    [[K.hin,t('c3.instroom')],[K.hdr,t('c3.ingang')]].forEach(([v,s],k)=>g+=`<line x1="${X(v)}" x2="${X(v)}" y1="14" y2="${H-B}" stroke="${c('--text3')}" stroke-dasharray="3 3"/><text x="${X(v)+3}" y="${22+k*12}">${s}</text>`);
    CURVES.filter(x=>x.id!==S.curve).concat(cur).forEach(x=>{const on=x.id===S.curve, f=fs[IDS.indexOf(x.id)];
      g+=`<path d="${pathOf(f,xmax,ymax,W,H,L,B)}" fill="none" stroke="${c(x.kleur)}" stroke-width="${on?2.6:1.5}" ${on?'':'stroke-dasharray="5 4"'} stroke-linejoin="round"/>`;});
    $('c3').innerHTML=g; }
  $('o3').innerHTML=`<div class="legend" style="margin-bottom:6px">${CURVES.map(x=>`<span${x.id===S.curve?' style="font-weight:600;color:var(--text)"':''}><i style="background:var(${x.kleur})"></i>${esc(tv(x,'kort'))}${x.id===S.curve?' '+t('gekozen'):''}</span>`).join('')}<span><i style="background:var(${cur.kleur});opacity:.25"></i>${t('bandbreedte')}</span></div>${t('o3.tekst',{h:entry(K),via:via(K)})}`;

  // ---- step 4
  { const W=320,H=160,B=30; const ds=hs.map(h=>damage(h,K,C)); const rs=hs.map(h=>range(per(id=>damage(h,K,withCurve(C,id)))));
    const ymax=Math.max(5000,...ds,...rs.map(r=>r[1]))*1.18; const y=v=>H-B-v/ymax*(H-B-10); let g='';
    ds.forEach((d,i)=>{const x=36+i*92,w=64,[r0,r1]=rs[i],xm=x+w/2; const pp=parts(hs[i],K,C); let acc=0; CATS.forEach(([k,,col])=>{const v=pp[k]; if(v<=0) return; g+=`<rect x="${x}" y="${y(acc+v)}" width="${w}" height="${Math.max(1,y(acc)-y(acc+v))}" fill="${c(col)}"><title>${cat(k)}: ${eur(v)}</title></rect>`; acc+=v;});
      if(r1-r0>1) g+=`<path d="M${xm},${y(r0)}V${y(r1)}M${xm-7},${y(r0)}h14M${xm-7},${y(r1)}h14" stroke="${c('--text')}" stroke-width="1.3" fill="none"/>`;
      g+=`<text class="lab" x="${x+w/2}" y="${Math.min(y(d),y(r1))-6}" text-anchor="middle">${eur(d)}</text><text x="${x+w/2}" y="${H-B+14}" text-anchor="middle">${t('c4.per',{t:T[i]})}</text><text x="${x+w/2}" y="${H-B+27}" text-anchor="middle" style="font-size:10px">${hs[i]} cm</text>`;});
    g+=`<line x1="20" x2="${W-10}" y1="${y(0)}" y2="${y(0)}" stroke="${c('--border2')}"/>`; $('c4').innerHTML=g; }
  $('o4').innerHTML=`≈ ${eur(E)} <small>${t('o4.big',{c:esc(curK)})}</small><div class="note" style="margin-top:4px;font-family:var(--sans);font-weight:400">${t('o4.marge',{r:eurR(range(Ec)),band:bandTxt})}</div>`;
  $('o4l').innerHTML=CATS.map(([k,,col])=>`<span><i style="background:var(${col})"></i>${cat(k)}</span>`).join('');
  $('t4').innerHTML=`<tr><th>${t('t4.kop')}</th><th class="r">${esc(curK)}</th><th class="r">${t('t4.band')}</th></tr>`+
    CATS.map(([k])=>`<tr><td>${cat(k)}</td><td class="r">${eur(EcCat[k][S.curve])}</td><td class="r" style="color:var(--text3)">${eurR(range(EcCat[k]))}</td></tr>`).join('')+
    `<tr class="tot"><td>${t('totaal')}</td><td class="r">${eur(E)}</td><td class="r">${eurR(range(Ec))}</td></tr>`+
    (cur.inboedel&&cur.inboedel.type==='inbegrepen'?`<tr><td colspan="3" style="color:var(--text3);font-size:11.5px">${tv(cur.inboedel,'uitleg')}</td></tr>`:'');

  // ---- step 5
  $('t5').innerHTML=`<tr><th>${t('t2.kenmerk')}</th><th class="r">${t('t5.zonder')}</th><th class="r">${t('t5.met')}</th></tr>
   <tr><td>${t('t5.ingang')}</td><td class="r">${K.hdr} cm</td><td class="r">${K2.hdr+(K2.schot?15:0)} cm${K2.schot?' *':''}</td></tr>
   <tr><td>${t('t5.woon')}</td><td class="r">${entry(K)} cm</td><td class="r">${entry(K2)} cm</td></tr>
   <tr><td>${t('t5.instroom')}</td><td class="r">${K.hin<=15?t('open'):t('hoog')}</td><td class="r">${K2.sealed||K2.hin>15?t('dicht'):t('open')}</td></tr>
   <tr><td>${t('t5.diepte')}</td><td class="r">${hs[0]}</td><td class="r">${hs2[0]}</td></tr>
   <tr><td>${t('t5.omg')}</td><td class="r">${om(O).toLowerCase()}</td><td class="r">${om(O2).toLowerCase()}</td></tr>
   <tr><td>${t('t2.totaal')}</td><td class="r">${dec(G.total,1)}</td><td class="r">${dec(G2.total,1)}</td></tr>`;
  $('o5s').innerHTML=chip(R,kl(R).toLowerCase())+'<span aria-hidden="true">→</span>'+chip(R2,kl(R2).toLowerCase(),true)+(K2.schot?`<small>${t('o5s.schot')}</small>`:'');
  $('o5').innerHTML=`${eur(cost)} <small>${t('o5')}</small>`;

  // ---- step 6
  { const W=320,H=190,L=40,B=34,xmax=60; const ymax=Math.max(10000,Math.ceil(damage(60,K,C)/5000)*5000);
    let g=`<defs><pattern id="ht" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="7" height="7" fill="${c('--hatch-bg')}"/><line x1="0" y1="0" x2="0" y2="7" stroke="${c('--hatch')}" stroke-width="2.2"/></pattern></defs>`;
    g+=axes(W,H,L,B,xmax,ymax,t('c6.as'));
    const f1=h=>damage(h,K,C), f2=h=>damage(Math.max(0,h-dh),K2,C2);
    const p1=pathOf(f1,xmax,ymax,W,H,L,B), p2=pathOf(f2,xmax,ymax,W,H,L,B);
    const rev=p2.split(/(?=[ML])/).reverse().map(s=>'L'+s.slice(1)).join('');
    g+=`<path d="${p1}${rev}Z" fill="url(#ht)"/><path d="${p1}" fill="none" stroke="${c('--phase2')}" stroke-width="2" stroke-dasharray="6 4"/><path d="${p2}" fill="none" stroke="${c('--phase3')}" stroke-width="2.6" stroke-linejoin="round"/>`;
    const yv=v=>H-B-(Math.min(v,ymax)/ymax)*(H-B-12);
    g+=`<text class="lab" x="${L+6}" y="24">${t('c6.zonder')}</text><text class="lab" x="${W-10}" y="${Math.min(H-B-4,yv(f2(60))+18)}" text-anchor="end" style="fill:${c('--phase3')}">${t('c6.met')}</text>`;
    $('c6').innerHTML=g; }
  const [b0,b1]=range(BKc), [n0,n1]=range(NCWc);
  const sub=s=>`<br><small style="color:var(--text3);font-weight:400">${s}</small>`;
  $('t6').innerHTML=`<tr><td>${t('t6.vermeden')}</td><td class="r">${eur(dE)}${sub(eurR(range(dEc)))}</td></tr>
   ${CATS.map(([k])=>`<tr><td style="padding-left:14px;color:var(--text3)">${t('t6.waarvan',{c:cat(k).toLowerCase()})}</td><td class="r" style="color:var(--text3)">${eur(dECat[k])}</td></tr>`).join('')}
   <tr><td>${t('t6.cwb')}</td><td class="r">${eur(cwB)}</td></tr>
   <tr><td>${t('t6.cwk')}</td><td class="r">${eur(cwK)}</td></tr>
   <tr><td>${t('t6.bk')}</td><td class="r">${cwK>0?dec(cwB/cwK)+sub(b0.toFixed(2)===b1.toFixed(2)?dec(b0):dec(b0)+' – '+dec(b1)):'–'}</td></tr>`;
  const ok=NCW>=0, pill=n0>=0?['ok',t('pill.ok.alle')]:n1<0?['warn',t('pill.warn.alle')]:[ok?'ok':'warn',t(ok?'pill.ok.hangt':'pill.warn.hangt')];
  $('o6').innerHTML=`<div class="big num" style="margin-top:6px;color:${ok?'var(--phase3)':'var(--phase2)'}">${sgn(NCW)} <small>${t('o6.ncw',{c:esc(curK)})}</small></div><div class="note" style="margin:2px 0 6px">${t('o6.marge',{a:sgn(n0),b:sgn(n1),band:bandTxt})}</div><span class="pill ${pill[0]}">${pill[1]}</span>`;

}
document.querySelectorAll('input,select').forEach(i=>i.addEventListener('input',run));
document.querySelectorAll('.tab').forEach(tb=>tb.addEventListener('click',()=>{
  document.querySelectorAll('.tab').forEach(x=>{const on=x===tb;x.classList.toggle('on',on);x.setAttribute('aria-selected',on);$(x.getAttribute('aria-controls')).hidden=!on;});
}));
document.querySelectorAll('.info').forEach(btn=>btn.addEventListener('click',()=>{const st=btn.closest('.step');const on=!st.classList.contains('show-proc');st.classList.toggle('show-proc',on);btn.setAttribute('aria-expanded',on);}));
// taal of thema gewisseld (js/00-site.js)
const labelTekst=r=>r.labels&&r.labels[0]?(r.labels[0].querySelector('[data-lang="'+DC.taal()+'"]')||r.labels[0]).textContent:r.id;
document.addEventListener('dc-weergave',()=>{
  tekenCurves(); tekenMaatregelen(); drawPosts();
  document.querySelectorAll('.numin[id$="n"]').forEach(n=>{const r=$(n.id.slice(0,-1)); if(r) n.setAttribute('aria-label',labelTekst(r));});
  run();});

// ---- stap 3: kentallen zelf invullen
['cvast','cdiep','dkr','dkel','drio','dinst','cind','wlim','inb'].forEach(id=>{
  const r=$(id), v=$(id+'v'); if(!r||!v) return;
  const w=document.createElement('span'); w.className='val eurin';
  w.innerHTML='€<input type="number" class="numin" id="'+id+'n" min="0" step="'+r.step+'" value="'+r.value+'" aria-label="'+esc(labelTekst(r))+'">';
  v.replaceWith(w); const n=$(id+'n');
  const fill=()=>{const mn=+r.min,mx=+r.max; r.style.setProperty('--v',Math.min(100,(r.value-mn)/(mx-mn)*100)+'%');};
  n.addEventListener('input',()=>{const x=parseFloat(n.value); if(!isNaN(x)){ if(x>+r.max) r.max=x; r.value=x; fill(); } run();});
  r.addEventListener('input',()=>{ n.value=r.value; });
});
// ---- stap 3: eigen schadeposten
function drawPosts(){
  $('ownlist').innerHTML=POSTS.map((p,i)=>`<div class="post" data-i="${i}">
    <input type="text" class="pn-name" value="${esc(p.name)}" aria-label="${t('post.naam')}">
    <span class="eurin">€<input type="number" class="numin pn-amt" min="0" step="100" value="${p.amt}" aria-label="${t('post.bedrag')}"></span>
    <button type="button" class="del" aria-label="${t('post.del')}" title="${t('post.del')}">×</button>
    <div class="post-when"><select class="pn-mode" aria-label="${t('post.wanneer')}">
      <option value="binnen"${p.mode==='binnen'?' selected':''}>${t('post.binnen')}</option>
      <option value="instroom"${p.mode==='instroom'?' selected':''}>${t('post.instroom')}</option>
      <option value="cm"${p.mode==='cm'?' selected':''}>${t('post.cm')}</option></select>
      <select class="pn-cat" aria-label="${t('post.soort')}">${CATS.map(([k])=>`<option value="${k}"${(p.cat||'opstal')===k?' selected':''}>${cat(k).toLowerCase()}</option>`).join('')}</select>
      <span class="pn-cmw"${p.mode==='cm'?'':' hidden'}><input type="number" class="numin pn-cm" min="0" max="100" step="1" value="${p.cm}" aria-label="${t('post.cmlabel')}"> cm</span></div>
  </div>`).join('');
}
$('addpost').addEventListener('click',()=>{POSTS.push({name:t('post.nieuw'),amt:1000,mode:'binnen',cm:20,cat:'opstal'}); drawPosts(); run(); const l=$('ownlist').querySelectorAll('.pn-name'); const f=l[l.length-1]; f.focus(); f.select();});
$('ownlist').addEventListener('input',e=>{const row=e.target.closest('.post'); if(!row) return; const p=POSTS[+row.dataset.i];
  if(e.target.classList.contains('pn-name')) p.name=e.target.value;
  if(e.target.classList.contains('pn-amt')) p.amt=Math.max(0,parseFloat(e.target.value)||0);
  if(e.target.classList.contains('pn-cm')) p.cm=Math.max(0,parseFloat(e.target.value)||0);
  if(e.target.classList.contains('pn-cat')) p.cat=e.target.value;
  if(e.target.classList.contains('pn-mode')){ p.mode=e.target.value; row.querySelector('.pn-cmw').hidden=p.mode!=='cm'; }
  run();});
$('ownlist').addEventListener('change',e=>{ if(e.target.classList.contains('pn-mode')) $('ownlist').dispatchEvent(new Event('input')); });
$('ownlist').addEventListener('click',e=>{const b=e.target.closest('.del'); if(!b) return; POSTS.splice(+b.closest('.post').dataset.i,1); drawPosts(); run();});
run();
})();
