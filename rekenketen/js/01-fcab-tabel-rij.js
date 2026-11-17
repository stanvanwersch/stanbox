(function(){
const $=id=>document.getElementById(id);
const eur=v=>'€'+Math.round(v).toLocaleString('nl-NL');
const eurK=v=>v>=1000?'€'+(v/1000).toLocaleString('nl-NL',{maximumFractionDigits:1})+'k':'€'+Math.round(v);
const css=n=>getComputedStyle(document.documentElement).getPropertyValue(n).trim();
const T=[100,250,1000];
const CLS=['Geen','Zeer laag','Laag','Gemiddeld','Hoog','Zeer hoog'];
const OMG=['Geen','Zeer laag','Laag','Middel','Hoog','Zeer hoog'];
// FCAB-2 tabel 17: rij = omgevingsscore 1..5, 20 kolommen (gebouwscore 5..100). Waarde = klasse 1..5
const run_=(a)=>a.flatMap(([n,v])=>Array(n).fill(v));
const MX={5:run_([[3,1],[3,2],[3,3],[11,5]]),4:run_([[5,1],[3,2],[4,3],[5,4],[3,5]]),3:run_([[6,1],[3,2],[8,3],[3,4]]),2:run_([[8,1],[9,2],[3,3]]),1:run_([[17,1],[3,2]])};
const colIdx=g=>Math.min(19,Math.max(0,Math.ceil(g/5)-1));
const krs=(o,g)=>o===0?0:MX[o][colIdx(g)];
const omgScore=h=>h<2?0:h<=10?1:h<=15?2:h<=20?3:h<=30?4:5;

const MEAS=window.DC_MAATREGELEN;
const S={crawl:1,rate:0.0225};

let lastLvl='';
$('mlist').innerHTML=MEAS.map(m=>{let h='';if(m.lvl!==lastLvl){h+=`<div class="lvlh">${m.lvl}</div>`;lastLvl=m.lvl;}
 return h+`<label class="chk" for="${m.id}"><input type="checkbox" id="${m.id}" ${m.on?'checked':''}><span><b>${m.name}</b></span><span class="c eurin" onclick="event.preventDefault()">€<input type="number" class="numin" data-m="${m.id}" min="0" step="50" value="${m.cost}" aria-label="Kosten ${m.name}"></span><span class="meta"><span class="mtag">FCAB-3 #${m.nr}</span>${m.f2?'<span class="mtag f2">gebouwscore</span>':''}<small style="color:var(--text3)">kosten ${m.k.toLowerCase()} · ${m.c.toLowerCase()} · ${m.desc}</small></span></label>`;}).join('');

function seg(id,key){ $(id).addEventListener('click',e=>{const b=e.target.closest('button'); if(!b)return;
  $(id).querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b)); S[key]=parseFloat(b.dataset.v); run();}); }
seg('crawl','crawl'); seg('rate','rate');
const num=id=>parseFloat($(id).value);
const kn=id=>{const e=$(id+'n'); const v=e?parseFloat(String(e.value).replace(',','.')):NaN; return isNaN(v)?num(id):Math.max(0,v);};
const POSTS=[];

// FCAB-2 gebouwscore
function gebouwscore(K){
  const rows=[];
  let p1; if(K.schot) p1=[10,'waterkering aanwezig']; else if(K.hdr<=0) p1=[40,'ingang ≤ 0 cm']; else if(K.hdr<=15) p1=[28,'ingang 1–15 cm']; else p1=[4,'ingang > 15 cm'];
  rows.push(['Hoogte ingang',...p1]);
  let p2; if(K.kelder==='none') p2=[0,'geen kelder']; else if(K.rooster||K.schot||K.kelder>15) p2=[6,K.kelder>15?'drempel > 15 cm':'schot of rooster']; else if(K.kelder<=0) p2=[15,'drempel ≤ 0 cm']; else p2=[10.5,'drempel 1–15 cm'];
  rows.push(['Kelder of ondergrondse ruimte',...p2]);
  let p3; if(K.sealed||K.hin>15) p3=[0,'geen binnen 15 cm']; else if(K.schot) p3=[8,'schot bij instroompunt']; else p3=[20,'binnen 15 cm boven maaiveld'];
  rows.push(['Overige instroompunten',...p3]);
  const veilig=K.riool==='gescheiden'||K.klep||K.bj>1981;
  rows.push(['Ontlastput of terugslagklep',veilig?0:5,veilig?(K.riool==='gescheiden'?'gescheiden riool':K.klep?'terugslagklep':'na 1981: ontlastput'):'gemengd, geen voorziening']);
  let p5; if(K.inst==='onder') p5=[20,'onder straatniveau']; else if(K.inst==='bg'&&K.hdr<=0&&!K.schot) p5=[14,'op BG en ingang 0 cm']; else p5=[0,K.inst==='bg'?'op BG, ingang hoger':'verhoogd'];
  rows.push(['Vaste installaties',...p5]);
  return {rows,total:rows.reduce((s,r)=>s+r[1],0)};
}
// damage model
function damage(h,K,C){
  if(h<=0) return 0; let d=0;
  if(K.crawl && !K.sealed && h>=K.hin) d+=C.dkr;
  const rioolRisk=K.riool==='gemengd'&&!K.klep&&K.bj<=1981; if(rioolRisk && h>=10) d+=C.drio;
  if(K.kelder!=='none'){const hk=(K.rooster||K.schot)?Math.max(K.kelder,15):K.kelder; if(h>=hk){d+=C.dkel; if(K.inst==='onder') d+=C.dinst;}}
  const hdr=K.hdr+(K.schot?15:0);
  if(h>=hdr){ d+=K.A*C.cvast*C.f+K.A*C.cdiep*C.f*Math.min(h-hdr,30)+C.cind; if(K.inst==='bg') d+=C.dinst; }
  (C.extra||[]).forEach(p=>{ if(p.mode==='binnen'?h>=hdr:p.mode==='instroom'?(!K.sealed&&h>=K.hin):h>=p.cm) d+=p.amt; });
  return d;
}
function wss(h,A){ const x=h-15; if(x<=0) return 0; const f=x<1?0.1*x:x<5?0.1+0.4*(x-1)/4:x<15?0.5+0.5*(x-5)/10:1; return f*271*A; }
function ead(hs,K,C,t0){
  const pts=[[1/t0,0]].concat(T.map((t,i)=>[1/t,damage(hs[i],K,C)]));
  let s=0; for(let i=0;i<pts.length-1;i++) s+=(pts[i][0]-pts[i+1][0])*(pts[i][1]+pts[i+1][1])/2;
  return s+pts[pts.length-1][0]*pts[pts.length-1][1];
}
const ann=(r,N)=>(1-Math.pow(1+r,-N))/r;
function niceTicks(m){const step=m>30000?10000:m>12000?5000:m>4000?2000:1000; const a=[]; for(let v=0;v<=m+1;v+=step)a.push(v); return a;}
function axes(W,H,L,B,xmax,ymax,xlab){
  let g=''; niceTicks(ymax).forEach(v=>{const y=H-B-(v/ymax)*(H-B-12); g+=`<line class="grid" x1="${L}" x2="${W-8}" y1="${y}" y2="${y}"/><text x="${L-6}" y="${y+4}" text-anchor="end">${eurK(v)}</text>`;});
  [0,20,40,60].forEach(v=>{const x=L+v/xmax*(W-L-8); g+=`<text x="${x}" y="${H-B+15}" text-anchor="middle">${v}</text>`;});
  return g+`<text x="${(L+W)/2}" y="${H-4}" text-anchor="middle">${xlab}</text>`;
}
function pathOf(f,xmax,ymax,W,H,L,B){let d='';for(let i=0;i<=300;i++){const h=i/300*xmax;const x=L+h/xmax*(W-L-8);const y=H-B-Math.min(f(h),ymax)/ymax*(H-B-12);d+=(i?'L':'M')+x.toFixed(1)+','+y.toFixed(1);}return d;}
const chip=(k,lab,lg)=>`<span class="chip${lg?' lg':''}"><i style="background:var(--r${k})"></i>${lab}</span>`;

function run(){
  const set=(id,t)=>{const e=$(id+'v'); if(e) e.textContent=t;};
  ['h100','h250','h1000'].forEach(k=>set(k,num(k)+' cm'));
  set('corr',(num('corr')>0?'+':'')+num('corr')+' cm');
  set('hin',num('hin')+' cm'); set('hdr',num('hdr')+' cm'); set('area',num('area')+' m²'); set('bj',num('bj'));
  ['dkr','dkel','drio','dinst','cind','cvast'].forEach(k=>set(k,eur(num(k)))); set('cdiep','€'+num('cdiep').toLocaleString('nl-NL'));
  set('t0','1/'+num('t0')); set('hor',num('hor')+' jaar'); set('om',num('om').toLocaleString('nl-NL')+'%');
  const M=Object.fromEntries(MEAS.map(m=>[m.id,$(m.id).checked]));

  // ---- base
  const corr=num('corr');
  const hs=[num('h100'),num('h250'),num('h1000')].map(h=>Math.max(0,h+corr));
  const kv=$('kelder').value;
  const K={hdr:num('hdr'),hin:num('hin'),A:num('area'),crawl:S.crawl,kelder:kv==='none'?'none':parseFloat(kv),riool:$('riool').value,bj:num('bj'),inst:$('inst').value,schot:false,rooster:false,klep:false,sealed:false};
  const C={cvast:kn('cvast'),cdiep:kn('cdiep'),dkr:kn('dkr'),dkel:kn('dkel'),drio:kn('drio'),dinst:kn('dinst'),cind:kn('cind'),f:1,extra:POSTS.filter(p=>p.amt>0)};
  const O=omgScore(hs[0]); const G=gebouwscore(K); const R=krs(O,G.total);

  // ---- with measures
  const K2={...K}; const C2={...C}; let dh=0; const lines=[]; let cost=0;
  if(M.m25){dh+=2;lines.push('h(T)   − 2 cm  (#25)');}
  if(M.m29){dh+=3;lines.push('h(T)   − 3 cm  (#29)');}
  if(M.m32){dh+=8;lines.push('h(T)   − 8 cm  (#32, gebied)');}
  if(M.m76){K2.hdr=K.hdr+15;lines.push('ingang + 15 cm (#76)');}
  if(M.m74){K2.schot=true;lines.push('schot = ja     (#74)');}
  if(M.m102){K2.sealed=true;lines.push('instroompunten dicht (#102)');}
  if(M.m104){K2.klep=true;lines.push('terugslagklep = ja (#104)');}
  if(M.m75){K2.inst='hoger';lines.push('installaties verhoogd (#75)');}
  if(M.m79){C2.f=0.7;lines.push('c_vast, c_diep × 0,7 (#79)');}
  MEAS.forEach(m=>{const e=document.querySelector('[data-m="'+m.id+'"]'); if(e) m.cost=Math.max(0,parseFloat(e.value)||0); if(M[m.id])cost+=m.cost;});
  const hs2=hs.map(h=>Math.max(0,h-dh));
  const O2=omgScore(hs2[0]); const G2=gebouwscore(K2); const R2=krs(O2,G2.total);
  $('f5').textContent=lines.length?lines.join('\n'):'geen maatregelen gekozen';

  const t0=num('t0');
  const E=ead(hs,K,C,t0), E2=ead(hs2,K2,C2,t0), dE=E-E2;
  const a=ann(S.rate,num('hor')); const cwB=dE*a, cwK=cost+cost*num('om')/100*a, NCW=cwB-cwK;
  const c=k=>css(k);

  // ---- step 1 chart
  { const W=360,H=170,L=34,B=34,Rr=92, ymax=Math.max(60,Math.ceil(Math.max(...hs,K.hdr)/10)*10+10);
    const y=v=>H-B-v/ymax*(H-B-14); let g='';
    [0,ymax/2,ymax].forEach(v=>g+=`<line class="grid" x1="${L}" x2="${W-Rr}" y1="${y(v)}" y2="${y(v)}"/><text x="${L-6}" y="${y(v)+4}" text-anchor="end">${Math.round(v)}</text>`);
    const cols=[c('--water1'),c('--water2'),c('--water3')];
    hs.forEach((h,i)=>{const x=L+14+i*76,w=50; g+=`<rect x="${x}" y="${y(h)}" width="${w}" height="${y(0)-y(h)}" rx="5" fill="${cols[i]}"/><text class="lab" x="${x+w/2}" y="${y(h)-6}" text-anchor="middle">${h} cm</text><text x="${x+w/2}" y="${H-B+15}" text-anchor="middle">1× per ${T[i]}</text>`;});
    const ly=[y(K.hin),y(K.hdr)]; if(Math.abs(ly[0]-ly[1])<13) ly[1]=ly[0]-13;
    [[K.hin,'instroompunt'],[K.hdr,'ingang']].forEach(([v,t],k)=>{g+=`<line x1="${L}" x2="${W-Rr+4}" y1="${y(v)}" y2="${y(v)}" stroke="${c('--phase2')}" stroke-dasharray="4 4" stroke-width="1.2"/><text x="${W-Rr+8}" y="${ly[k]+4}" style="fill:${c('--phase2')};font-weight:600">${t} ${v}</text>`;});
    g+=`<text x="${(L+W-Rr)/2}" y="${H-4}" text-anchor="middle">cm t.o.v. maaiveld</text>`;
    $('c1').innerHTML=g; }
  $('o1').innerHTML=chip(O,'Wateroverlast: '+OMG[O],true)+`<small>70 mm in 1 uur, P99 ${hs[0]} cm in buffer van 0,5 m</small>`;

  // ---- step 2
  $('t2').innerHTML=`<tr><th>Kenmerk</th><th>Situatie</th><th class="r">Punten</th></tr>`+G.rows.map(r=>`<tr><td>${r[0]}</td><td style="color:var(--text3)">${r[2]}</td><td class="r">${String(r[1]).replace('.',',')}</td></tr>`).join('')+`<tr class="tot"><td>Gebouwscore</td><td></td><td class="r">${String(G.total).replace('.',',')}</td></tr>`;
  let mx=''; for(let o=5;o>=0;o--){ mx+=`<tr><th>${o?OMG[o].toLowerCase():'geen'}</th>`; for(let ci=0;ci<20;ci++){const k=o===0?0:MX[o][ci]; const me=(o===O&&ci===colIdx(G.total)); const me2=(o===O2&&ci===colIdx(G2.total))&&!me&&(lines.length>0); mx+=`<td style="background:var(--r${k})" class="${me?'me':''}${me2?' me2':''}" title="omgeving ${OMG[o]}, gebouwscore ${(ci+1)*5}: ${CLS[k]}"></td>`;} mx+='</tr>'; }
  $('mx').innerHTML=mx;
  $('o2').innerHTML=chip(R,'Klimaatrisicoscore: '+CLS[R].toLowerCase(),true)+`<small>omgeving ${OMG[O].toLowerCase()} × gebouwscore ${String(G.total).replace('.',',')}</small>`;

  // ---- step 3
  { const W=320,H=190,L=40,B=34,xmax=60; const ymax=Math.max(10000,Math.ceil(Math.max(damage(60,K,C),wss(60,K.A))/5000)*5000);
    let g=axes(W,H,L,B,xmax,ymax,'waterdiepte t.o.v. maaiveld (cm)'); const X=h=>L+h/xmax*(W-L-8);
    g+=`<path d="${pathOf(h=>wss(h,K.A),xmax,ymax,W,H,L,B)}" fill="none" stroke="${c('--text3')}" stroke-width="1.8" stroke-dasharray="5 4"/>`;
    g+=`<path d="${pathOf(h=>damage(h,K,C),xmax,ymax,W,H,L,B)}" fill="none" stroke="${c('--phase2')}" stroke-width="2.6" stroke-linejoin="round"/>`;
    [[K.hin,'instroom'],[K.hdr,'ingang']].forEach(([v,t],k)=>g+=`<line x1="${X(v)}" x2="${X(v)}" y1="14" y2="${H-B}" stroke="${c('--text3')}" stroke-dasharray="3 3"/><text x="${X(v)+3}" y="${22+k*12}">${t}</text>`);
    const yv=v=>H-B-(Math.min(v,ymax)/ymax)*(H-B-12);
    g+=`<text class="lab" x="${W-10}" y="${Math.max(12,yv(damage(60,K,C))-8)}" text-anchor="end" style="fill:${c('--phase2')}">pandspecifiek</text>`;
    g+=`<text x="${W-10}" y="${Math.min(H-B-6,yv(wss(60,K.A))+16)}" text-anchor="end">generiek (WSS)</text>`;
    $('c3').innerHTML=g; }
  $('o3').textContent='De drempels in deze curve komen uit dezelfde kenmerken als de FCAB-2 gebouwscore: ingang, instroompunten, kelder, riool en installaties.';

  // ---- step 4
  { const W=320,H=160,B=30; const ds=hs.map(h=>damage(h,K,C)); const ymax=Math.max(5000,...ds)*1.18; const y=v=>H-B-v/ymax*(H-B-10); let g='';
    ds.forEach((d,i)=>{const x=36+i*92,w=64; g+=`<rect x="${x}" y="${y(d)}" width="${w}" height="${Math.max(1,y(0)-y(d))}" rx="5" fill="${c('--phase2')}"/><text class="lab" x="${x+w/2}" y="${y(d)-6}" text-anchor="middle">${eur(d)}</text><text x="${x+w/2}" y="${H-B+14}" text-anchor="middle">1× per ${T[i]} jr</text><text x="${x+w/2}" y="${H-B+27}" text-anchor="middle" style="font-size:10px">${hs[i]} cm</text>`;});
    g+=`<line x1="20" x2="${W-10}" y1="${y(0)}" y2="${y(0)}" stroke="${c('--border2')}"/>`; $('c4').innerHTML=g; }
  $('o4').innerHTML=`≈ ${eur(E)} <small>verwachte schade per jaar bij niets doen</small>`;

  // ---- step 5
  $('t5').innerHTML=`<tr><th>Kenmerk</th><th class="r">Zonder</th><th class="r">Met</th></tr>
   <tr><td>Ingang t.o.v. maaiveld</td><td class="r">${K.hdr} cm</td><td class="r">${K2.hdr+(K2.schot?15:0)} cm${K2.schot?' *':''}</td></tr>
   <tr><td>Overige instroompunten</td><td class="r">${K.hin<=15?'open':'hoog'}</td><td class="r">${K2.sealed||K2.hin>15?'dicht':'open'}</td></tr>
   <tr><td>Waterdiepte 1/100 (cm)</td><td class="r">${hs[0]}</td><td class="r">${hs2[0]}</td></tr>
   <tr><td>Omgevingsscore</td><td class="r">${OMG[O].toLowerCase()}</td><td class="r">${OMG[O2].toLowerCase()}</td></tr>
   <tr><td>Gebouwscore</td><td class="r">${String(G.total).replace('.',',')}</td><td class="r">${String(G2.total).replace('.',',')}</td></tr>`;
  $('o5s').innerHTML=chip(R,CLS[R].toLowerCase())+'<span aria-hidden="true">→</span>'+chip(R2,CLS[R2].toLowerCase(),true)+(K2.schot?'<small>* schot gerekend als 15 cm</small>':'');
  $('o5').innerHTML=`${eur(cost)} <small>investering eigenaar</small>`;

  // ---- step 6
  { const W=320,H=190,L=40,B=34,xmax=60; const ymax=Math.max(10000,Math.ceil(damage(60,K,C)/5000)*5000);
    let g=`<defs><pattern id="ht" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="7" height="7" fill="${c('--hatch-bg')}"/><line x1="0" y1="0" x2="0" y2="7" stroke="${c('--hatch')}" stroke-width="2.2"/></pattern></defs>`;
    g+=axes(W,H,L,B,xmax,ymax,'waterdiepte bij de kaart-bui (cm)');
    const f1=h=>damage(h,K,C), f2=h=>damage(Math.max(0,h-dh),K2,C2);
    const p1=pathOf(f1,xmax,ymax,W,H,L,B), p2=pathOf(f2,xmax,ymax,W,H,L,B);
    const rev=p2.split(/(?=[ML])/).reverse().map(s=>'L'+s.slice(1)).join('');
    g+=`<path d="${p1}${rev}Z" fill="url(#ht)"/><path d="${p1}" fill="none" stroke="${c('--phase2')}" stroke-width="2" stroke-dasharray="6 4"/><path d="${p2}" fill="none" stroke="${c('--phase3')}" stroke-width="2.6" stroke-linejoin="round"/>`;
    const yv=v=>H-B-(Math.min(v,ymax)/ymax)*(H-B-12);
    g+=`<text class="lab" x="${L+6}" y="24">zonder maatregelen</text><text class="lab" x="${W-10}" y="${Math.min(H-B-4,yv(f2(60))+18)}" text-anchor="end" style="fill:${c('--phase3')}">met maatregelen</text>`;
    $('c6').innerHTML=g; }
  $('t6').innerHTML=`<tr><td>Vermeden schade per jaar</td><td class="r">${eur(dE)}</td></tr>
   <tr><td>Contante waarde baten</td><td class="r">${eur(cwB)}</td></tr>
   <tr><td>Contante waarde kosten</td><td class="r">${eur(cwK)}</td></tr>
   <tr><td>Baten / kosten</td><td class="r">${cwK>0?(cwB/cwK).toLocaleString('nl-NL',{maximumFractionDigits:2}):'–'}</td></tr>`;
  const ok=NCW>=0;
  $('o6').innerHTML=`<div class="big num" style="margin-top:6px;color:${ok?'var(--phase3)':'var(--phase2)'}">${NCW<0?'−':''}${eur(Math.abs(NCW))} <small>netto contante waarde</small></div><span class="pill ${ok?'ok':'warn'}">${ok?'Baten hoger dan kosten':'Kosten hoger dan baten'}</span>`;

}
document.querySelectorAll('input,select').forEach(i=>i.addEventListener('input',run));
document.querySelectorAll('.tab').forEach(t=>t.addEventListener('click',()=>{
  document.querySelectorAll('.tab').forEach(x=>{const on=x===t;x.classList.toggle('on',on);x.setAttribute('aria-selected',on);$(x.getAttribute('aria-controls')).hidden=!on;});
}));
document.querySelectorAll('.info').forEach(btn=>btn.addEventListener('click',()=>{const st=btn.closest('.step');const on=!st.classList.contains('show-proc');st.classList.toggle('show-proc',on);btn.setAttribute('aria-expanded',on);}));
$('theme').addEventListener('click',()=>{const r=document.documentElement;const dark=r.dataset.theme?r.dataset.theme==='dark':matchMedia('(prefers-color-scheme: dark)').matches;r.dataset.theme=dark?'light':'dark';try{localStorage.setItem('rk-theme',r.dataset.theme)}catch(e){};run();});
try{const t=localStorage.getItem('rk-theme');if(t)document.documentElement.dataset.theme=t;}catch(e){}
const mq=matchMedia('(prefers-color-scheme: dark)'); if(mq.addEventListener) mq.addEventListener('change',run);

// ---- stap 3: kentallen zelf invullen
['cvast','cdiep','dkr','dkel','drio','dinst','cind'].forEach(id=>{
  const r=$(id), v=$(id+'v'); if(!r||!v) return;
  const w=document.createElement('span'); w.className='val eurin';
  w.innerHTML='€<input type="number" class="numin" id="'+id+'n" min="0" step="'+r.step+'" value="'+r.value+'" aria-label="'+(r.labels&&r.labels[0]?r.labels[0].textContent:id)+'">';
  v.replaceWith(w); const n=$(id+'n');
  const fill=()=>{const mn=+r.min,mx=+r.max; r.style.setProperty('--v',Math.min(100,(r.value-mn)/(mx-mn)*100)+'%');};
  n.addEventListener('input',()=>{const x=parseFloat(n.value); if(!isNaN(x)){ if(x>+r.max) r.max=x; r.value=x; fill(); } run();});
  r.addEventListener('input',()=>{ n.value=r.value; });
});
// ---- stap 3: eigen schadeposten
function drawPosts(){
  $('ownlist').innerHTML=POSTS.map((p,i)=>`<div class="post" data-i="${i}">
    <input type="text" class="pn-name" value="${p.name.replace(/"/g,'&quot;')}" aria-label="Naam schadepost">
    <span class="eurin">€<input type="number" class="numin pn-amt" min="0" step="100" value="${p.amt}" aria-label="Bedrag"></span>
    <button type="button" class="del" aria-label="Verwijder schadepost" title="Verwijderen">×</button>
    <div class="post-when"><select class="pn-mode" aria-label="Wanneer treedt de schade op">
      <option value="binnen"${p.mode==='binnen'?' selected':''}>zodra water binnen is</option>
      <option value="instroom"${p.mode==='instroom'?' selected':''}>vanaf laagste instroompunt</option>
      <option value="cm"${p.mode==='cm'?' selected':''}>vanaf eigen waterdiepte</option></select>
      <span class="pn-cmw"${p.mode==='cm'?'':' hidden'}><input type="number" class="numin pn-cm" min="0" max="100" step="1" value="${p.cm}" aria-label="Waterdiepte in cm"> cm</span></div>
  </div>`).join('');
}
$('addpost').addEventListener('click',()=>{POSTS.push({name:'Nieuwe schadepost',amt:1000,mode:'binnen',cm:20}); drawPosts(); run(); const l=$('ownlist').querySelectorAll('.pn-name'); const f=l[l.length-1]; f.focus(); f.select();});
$('ownlist').addEventListener('input',e=>{const row=e.target.closest('.post'); if(!row) return; const p=POSTS[+row.dataset.i];
  if(e.target.classList.contains('pn-name')) p.name=e.target.value;
  if(e.target.classList.contains('pn-amt')) p.amt=Math.max(0,parseFloat(e.target.value)||0);
  if(e.target.classList.contains('pn-cm')) p.cm=Math.max(0,parseFloat(e.target.value)||0);
  if(e.target.classList.contains('pn-mode')){ p.mode=e.target.value; row.querySelector('.pn-cmw').hidden=p.mode!=='cm'; }
  run();});
$('ownlist').addEventListener('change',e=>{ if(e.target.classList.contains('pn-mode')) $('ownlist').dispatchEvent(new Event('input')); });
$('ownlist').addEventListener('click',e=>{const b=e.target.closest('.del'); if(!b) return; POSTS.splice(+b.closest('.post').dataset.i,1); drawPosts(); run();});
run();
})();
