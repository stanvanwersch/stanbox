/* Portefeuillepagina: lijst panden/typologieën invoeren, doorrekenen met de rekenkern
   (DC_REKENKERN.berekenPortefeuille) en optellen. Rekent zelf niets uit dat niet in de kern zit.
   Teksten via DC.t() (data/teksten.js, sleutels 'pf.*'); bij taal- of themawissel alles opnieuw tekenen. */
(function(){
const RK=window.DC_REKENKERN, SD=window.DC_STANDAARD, MEAS=window.DC_MAATREGELEN, CURVES=window.DC_CURVES;
const {CATS,range}=RK;
const t=DC.t, tv=DC.tv;
const $=id=>document.getElementById(id);
const eur=v=>'€'+DC.getal(Math.round(v));
const eurK=v=>Math.abs(v)>=1e6?'€'+DC.getal(v/1e6,2)+t('pf.mln'):Math.abs(v)>=1000?'€'+DC.getal(v/1000,1)+'k':eur(v);
const sgn=v=>(v<0?'−':'')+eur(Math.abs(v));
const sgnK=v=>(v<0?'−':'')+eurK(Math.abs(v));
const eurR=([a,b])=>Math.round(a)===Math.round(b)?eur(a):eur(a)+' – '+eur(b).slice(1);
const nl=(v,d=2)=>DC.getal(v,d);
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
const css=n=>getComputedStyle(document.documentElement).getPropertyValue(n).trim();
const clone=o=>JSON.parse(JSON.stringify(o));
const cat=k=>t('cat.'+k);

// ---- toestand: regels + gedeelde uitgangspunten (bewaard in deze browser)
const OPSLAG='dc-portefeuille';
const voorbeeld=()=>({rows:clone(SD.portefeuille).map(r=>{const n=tv(r,'naam'); delete r.naam_en; r.naam=n; return r;}),
  P:{C:clone(SD.pand.C),t0:SD.pand.t0,rente:SD.pand.rente,horizon:SD.pand.horizon,onderhoud:SD.pand.onderhoud,
     kosten:Object.fromEntries(MEAS.map(m=>[m.id,m.cost]))}});
let st; try{st=JSON.parse(localStorage.getItem(OPSLAG));}catch(e){}
if(!st||!Array.isArray(st.rows)||!st.P) st=voorbeeld();
const bewaar=()=>{try{localStorage.setItem(OPSLAG,JSON.stringify(st));}catch(e){}};
const nieuweRegel=()=>({naam:t('pf.nieuw'),aantal:10,h:clone(SD.pand.h),K:clone(SD.pand.K),maatregelen:[]});

// ---- 1. invoertabel
const KOL=[ // [sleutel, kop (tekstsleutel), klein, soort, opties [waarde, tekstsleutel]]
 ['naam','pf.k.naam','','text'],['aantal','pf.k.aantal','pf.k.aantal.s','num'],
 ['h.0','1/100','cm','num'],['h.1','1/250','cm','num'],['h.2','1/1000','cm','num'],
 ['K.hdr','pf.k.ingang','cm','num'],['K.hin','pf.k.instroom','cm','num'],
 ['K.route','pf.k.route','','sel',[['woon','pf.o.woon'],['kruip','pf.o.kruip']]],
 ['K.A','pf.k.vloer','m²','num'],['K.crawl','pf.k.kruip','','sel',[[1,'ja'],[0,'nee']]],
 ['K.kelder','pf.k.kelder','pf.k.kelder.s','sel',[['none','opt.kelder.none'],[0,'≤ 0 cm'],[10,'1–15 cm'],[20,'> 15 cm']]],
 ['K.riool','pf.k.riool','','sel',[['gemengd','opt.riool.gemengd'],['gescheiden','opt.riool.gescheiden']]],
 ['K.bj','pf.k.bj','','num'],
 ['K.inst','pf.k.inst','','sel',[['bg','pf.o.bg'],['onder','pf.o.onder'],['hoger','pf.o.hoger']]],
];
const get=(r,k)=>k.split('.').reduce((o,p)=>o[p],r);
const put=(r,k,v)=>{const ps=k.split('.'); const last=ps.pop(); ps.reduce((o,p)=>o[p],r)[last]=v;};
function tekenRegels(){
  const kop=`<tr><th></th><th></th><th class="grp-h" colspan="3">${t('pf.kop.diepte')}</th><th class="grp-h" colspan="9">${t('pf.kop.kenmerken')}</th><th class="grp-h">${t('pf.kop.maatregelen')}</th><th></th></tr>
   <tr>${KOL.map(([,k,s,soort])=>`<th${soort==='num'?' class="r"':''}>${t(k)}${s?`<small>${t(s)}</small>`:''}</th>`).join('')}<th>${t('pf.kop.pakket')}</th><th></th></tr>`;
  $('rows').innerHTML=kop+st.rows.map((r,i)=>`<tr data-i="${i}">${KOL.map(([k,kt,,soort,opt])=>{const v=get(r,k), lab=`aria-label="${esc(t(kt))} (${esc(r.naam)})"`;
      if(soort==='text') return `<td><input class="nm" data-k="${k}" value="${esc(v)}" ${lab}></td>`;
      if(soort==='num') return `<td><input type="number" data-k="${k}" value="${v}" min="${k==='K.bj'?1800:0}" step="1" ${lab}></td>`;
      return `<td><select data-k="${k}" ${lab}>${opt.map(([ov,ot])=>`<option value="${ov}"${String(ov)===String(v)?' selected':''}>${t(ot)}</option>`).join('')}</select></td>`;}).join('')}
    <td><div class="mchips">${MEAS.map(m=>`<button type="button" data-m="${m.id}" class="${r.maatregelen.includes(m.id)?'on':''}" title="${esc(tv(m,'name'))} (${esc(tv(m,'desc'))})" aria-pressed="${r.maatregelen.includes(m.id)}">#${m.nr}</button>`).join('')}</div></td>
    <td><button type="button" class="del" title="${t('pf.deltitel')}" aria-label="${esc(t('pf.del',{n:r.naam}))}">×</button></td></tr>`).join('')
    +(st.rows.length?'':`<tr><td colspan="${KOL.length+2}" class="note" style="padding:12px 4px">${t('pf.leeg')}</td></tr>`);
}
function waarde(k,raw){
  if(k==='naam') return raw;
  if(k==='K.kelder') return raw==='none'?'none':parseFloat(raw);
  if(k==='K.crawl') return +raw;
  if(['K.route','K.riool','K.inst'].includes(k)) return raw;
  const v=parseFloat(String(raw).replace(',','.')); return isNaN(v)?0:Math.max(0,v);
}
$('rows').addEventListener('input',e=>{const el=e.target, tr=el.closest('tr[data-i]'); if(!tr||!el.dataset.k) return;
  put(st.rows[+tr.dataset.i],el.dataset.k,waarde(el.dataset.k,el.value)); reken();});
$('rows').addEventListener('click',e=>{const tr=e.target.closest('tr[data-i]'); if(!tr) return; const r=st.rows[+tr.dataset.i];
  const mb=e.target.closest('[data-m]');
  if(mb){ const id=mb.dataset.m; r.maatregelen=r.maatregelen.includes(id)?r.maatregelen.filter(x=>x!==id):MEAS.map(m=>m.id).filter(x=>x===id||r.maatregelen.includes(x));
    mb.classList.toggle('on'); mb.setAttribute('aria-pressed',r.maatregelen.includes(id)); reken(); }
  if(e.target.closest('.del')){ st.rows.splice(+tr.dataset.i,1); tekenRegels(); reken(); }});
$('add').addEventListener('click',()=>{st.rows.push(nieuweRegel()); tekenRegels(); reken(); const n=$('rows').querySelectorAll('input.nm'); n[n.length-1].focus(); n[n.length-1].select();});
$('example').addEventListener('click',()=>{st=voorbeeld(); tekenAlles();});
$('clear').addEventListener('click',()=>{st.rows=[]; tekenRegels(); reken();});

// ---- plakken uit / kopiëren naar Excel (kolomnamen en codes zijn in beide talen gelijk)
const CSV=['naam','aantal','h100','h250','h1000','ingang','instroompunt','instroom_naar','vloer_bg_m2','kruipruimte','kelder','riool','bouwjaar','installaties','maatregelen'];
$('cols').textContent=CSV.join(' ; ');
const nrNaarId=Object.fromEntries(MEAS.map(m=>[String(m.nr),m.id]));
const SYN={yes:'ja',no:'nee',none:'geen'}; // Engelse invoer ook goed
function naarRegel(c,nr){
  const fout=[], n=s=>{const v=parseFloat(String(s||'').replace(',','.')); if(isNaN(v)) fout.push(t('pf.f.getal',{n:nr,s:s||''})); return isNaN(v)?0:Math.max(0,v);};
  const kies=(s,toegestaan,veld)=>{s=String(s||'').trim().toLowerCase(); s=SYN[s]||s; if(!toegestaan.includes(s)){fout.push(t('pf.f.onbekend',{n:nr,veld:t(veld).toLowerCase(),s})); return toegestaan[0];} return s;};
  const kel=kies(c[10],['geen','0','10','20'],'pf.k.kelder');
  const mt=String(c[14]||'').split(/[\s,]+/).filter(Boolean).map(x=>x.replace('#',''));
  mt.filter(x=>!nrNaarId[x]).forEach(x=>fout.push(t('pf.f.maatregel',{n:nr,s:x})));
  return {fout, r:{naam:String(c[0]||'').trim()||t('pf.regel',{n:nr}), aantal:n(c[1]), h:[n(c[2]),n(c[3]),n(c[4])],
    K:{hdr:n(c[5]),hin:n(c[6]),route:kies(c[7],['woon','kruip'],'pf.k.route'),A:n(c[8]),crawl:kies(c[9],['ja','nee'],'pf.k.kruip')==='ja'?1:0,
       kelder:kel==='geen'?'none':+kel,riool:kies(c[11],['gemengd','gescheiden'],'pf.k.riool'),bj:n(c[12]),inst:kies(c[13],['bg','onder','hoger'],'pf.k.inst')},
    maatregelen:MEAS.map(m=>m.id).filter(id=>mt.some(x=>nrNaarId[x]===id))}};
}
$('read').addEventListener('click',()=>{
  const regels=$('paste').value.split(/\r?\n/).filter(l=>l.trim()); const uit=[], fout=[];
  regels.forEach((l,i)=>{const c=l.split(l.includes('\t')?'\t':';').map(s=>s.trim()); if(i===0&&['naam','name'].includes(c[0].toLowerCase())) return;
    const x=naarRegel(c,i+1); uit.push(x.r); fout.push(...x.fout);});
  if(!uit.length){ $('pastemsg').textContent=t('pf.geen'); return; }
  st.rows=uit; tekenRegels(); reken();
  $('pastemsg').textContent=t('pf.ingelezen',{n:uit.length})+(fout.length?t('pf.letop',{f:fout.slice(0,4).join('; ')+(fout.length>4?t('pf.meer',{n:fout.length-4}):'')}):'');
});
$('copy').addEventListener('click',()=>{
  const nrs=Object.fromEntries(MEAS.map(m=>[m.id,m.nr])), d=DC.taal()==='nl'?',':'.';
  $('paste').value=[CSV.join('\t')].concat(st.rows.map(r=>[r.naam,r.aantal,...r.h,r.K.hdr,r.K.hin,r.K.route,r.K.A,r.K.crawl?'ja':'nee',r.K.kelder==='none'?'geen':r.K.kelder,r.K.riool,r.K.bj,r.K.inst,r.maatregelen.map(id=>nrs[id]).join(' ')].map(v=>String(v).replace('.',d)).join('\t'))).join('\n');
  $('paste').select(); $('pastemsg').textContent=t('pf.gekopieerd');
});

// ---- 2. uitgangspunten
const KEN=[['cvast','€',' /m²'],['cdiep','€',' /m²·cm'],['W','€',' /m²'],['I','€',''],['pinb','','%'],['pinbd','','%'],
 ['dkr','€',''],['dkel','€',''],['drio','€',''],['dinst','€',''],['cind','€','']];
const FIN=[['t0','','pf.eenh.jaar'],['horizon','','pf.eenh.jaar'],['onderhoud','','pf.eenh.onderhoud']];
const veld=(grp,k,lab,pre,suf,v)=>`<label for="${grp}-${k}">${esc(lab)}</label><span class="eurin">${pre}<input type="number" class="numin" id="${grp}-${k}" data-g="${grp}" data-k="${k}" min="0" step="any" value="${v}">${suf?`<span class="unit">${suf}</span>`:''}</span>`;
function tekenUitgangspunten(){
  $('curve').innerHTML=CURVES.map(c=>`<button type="button" data-v="${c.id}" class="${c.id===st.P.C.curve?'on':''}" title="${esc(tv(c,'naam'))}">${esc(tv(c,'kort'))}</button>`).join('');
  $('curvenote').textContent=tv(CURVES.find(c=>c.id===st.P.C.curve)||CURVES[0],'uitleg')+t('pf.curvenote');
  $('kentallen').innerHTML=KEN.map(([k,p,s])=>veld('C',k,t('pf.ken.'+k),p,s,st.P.C[k])).join('');
  $('fin').innerHTML=FIN.map(([k,p,s])=>veld('P',k,t('pf.fin.'+k),p,' '+t(s),st.P[k])).join('');
  $('mkosten').innerHTML=MEAS.map(m=>veld('M',m.id,`#${m.nr} ${tv(m,'name')}`,'€','',st.P.kosten[m.id]!=null?st.P.kosten[m.id]:m.cost)).join('');
  $('rate').querySelectorAll('button').forEach(b=>{b.classList.toggle('on',+b.dataset.v===st.P.rente); b.textContent=nl(+b.dataset.v*100)+'%';});
}
document.querySelector('#p2').addEventListener('input',e=>{const el=e.target; if(!el.dataset.g) return;
  const v=Math.max(0,parseFloat(String(el.value).replace(',','.'))||0);
  if(el.dataset.g==='C') st.P.C[el.dataset.k]=v; else if(el.dataset.g==='M') st.P.kosten[el.dataset.k]=v; else st.P[el.dataset.k]=el.dataset.k==='t0'?Math.max(1,v):v;
  reken();});
$('curve').addEventListener('click',e=>{const b=e.target.closest('button'); if(!b) return; st.P.C.curve=b.dataset.v; tekenUitgangspunten(); reken();});
$('rate').addEventListener('click',e=>{const b=e.target.closest('button'); if(!b) return; st.P.rente=+b.dataset.v; tekenUitgangspunten(); reken();});

// ---- 3. rekenen en uitkomsten
function reken(){
  bewaar();
  const P=st.P, cur=CURVES.find(c=>c.id===P.C.curve)||CURVES[0], curK=tv(cur,'kort');
  const U=RK.berekenPortefeuille(st.rows.map(r=>({naam:r.naam,aantal:r.aantal,h:r.h,corr:0,t0:P.t0,K:r.K,C:P.C,
    maatregelen:r.maatregelen,kosten:P.kosten,rente:P.rente,horizon:P.horizon,onderhoud:P.onderhoud})));
  const T=U.totaal, inv=U.panden.reduce((s,p)=>s+p.aantal*p.uitkomst.cost,0);
  const [n0,n1]=T.marge.NCW, ok=T.NCW>=0;
  const pill=!inv?['',t('f5.geen')]:n0>=0?['ok',t('pill.ok.alle')]:n1<0?['warn',t('pill.warn.alle')]:[ok?'ok':'warn',t(ok?'pill.ok.hangt':'pill.warn.hangt')];
  const kpi=(l,v,m,kl)=>`<div class="kpi${kl?' '+kl:''}"><div class="l">${l}</div><div class="v num">${v}</div><div class="m">${m}</div></div>`;
  $('kpis').innerHTML=
    kpi(t('pf.kpi.E'),eurK(T.E),t('pf.kpi.E.m',{n:nl(T.aantal,0),a:eurK(T.marge.E[0]),b:eurK(T.marge.E[1]).slice(1)}))+
    kpi(t('pf.kpi.dE'),eurK(T.dE),t('pf.kpi.dE.m',{a:eurK(T.marge.dE[0]),b:eurK(T.marge.dE[1]).slice(1)}))+
    kpi(t('pf.kpi.inv'),eurK(inv),t('pf.kpi.inv.m',{o:nl(P.onderhoud),k:eurK(T.cwK)}))+
    kpi(t('pf.kpi.ncw'),sgnK(T.NCW),t('pf.kpi.ncw.m',{h:P.horizon,r:nl(P.rente*100),a:sgnK(n0),b:sgnK(n1)})+`<br><span class="pill ${pill[0]}" style="margin-top:4px">${pill[1]}</span>`,ok&&inv?'good':'');

  // grafiek: verwachte schade per regel, gestapeld naar categorie, met marge over de curves
  { const rows=U.panden, W=720, L=210, R=70, rh=30, top=8, H=top+Math.max(1,rows.length)*rh+22;
    const per=rows.map(p=>({p, cat:CATS.map(([k])=>p.aantal*p.uitkomst.EcCat[k][cur.id]), m:range(p.uitkomst.Ec).map(v=>v*p.aantal)}));
    const xmax=Math.max(1000,...per.map(x=>x.m[1]))*1.02, X=v=>L+v/xmax*(W-L-R); let g='';
    const step=[1000,2000,5000,10000,20000,50000,100000,200000,500000,1e6].find(s=>xmax/s<=6)||1e6;
    for(let v=0;v<=xmax;v+=step) g+=`<line x1="${X(v)}" x2="${X(v)}" y1="${top}" y2="${H-20}" stroke="${css('--grid')}"/><text x="${X(v)}" y="${H-6}" text-anchor="middle">${eurK(v)}</text>`;
    per.forEach(({p,cat:cs,m},i)=>{const y=top+i*rh+6, bh=rh-12; let acc=0;
      const nm=p.naam.length>30?p.naam.slice(0,29)+'…':p.naam;
      g+=`<text class="lab" x="${L-10}" y="${y+bh/2+4}" text-anchor="end">${esc(nm)}<title>${esc(p.naam)}</title></text>`;
      cs.forEach((v,k)=>{ if(v<=0) return; g+=`<rect x="${X(acc)}" y="${y}" width="${Math.max(1,X(acc+v)-X(acc))}" height="${bh}" fill="${css(CATS[k][2])}"><title>${cat(CATS[k][0])}: ${eur(v)}</title></rect>`; acc+=v; });
      if(m[1]-m[0]>1) g+=`<path d="M${X(m[0])},${y+bh/2}H${X(m[1])}M${X(m[0])},${y+3}v${bh-6}M${X(m[1])},${y+3}v${bh-6}" stroke="${css('--text')}" stroke-width="1.2" fill="none"/>`;
      g+=`<text x="${Math.max(X(acc),X(m[1]))+6}" y="${y+bh/2+4}">${eurK(acc)}</text>`;});
    $('chart').setAttribute('viewBox',`0 0 ${W} ${H}`); $('chart').innerHTML=g; }
  $('legend').innerHTML=CATS.map(([k,,c])=>`<span><i style="background:var(${c})"></i>${cat(k)}</span>`).join('')+`<span><i style="background:none;border-top:1.5px solid var(--text);height:0;border-radius:0;margin-top:6px"></i>${t('pf.marge')}</span>`;

  // tabel
  const rk=R=>`<span class="rk"><i style="background:var(--r${R})"></i>${t('klasse.'+R).toLowerCase()}</span>`, tot=t('pf.tot');
  $('res').innerHTML=`<tr><th>${t('pf.t.regel')}</th><th class="r">${t('pf.t.woningen')}</th><th>${t('pf.t.risico')}</th><th class="r">${t('pf.t.perwoning')}</th><th class="r">${t('pf.t.totaal')}</th><th class="r">${t('pf.t.vermeden')}</th><th class="r">${t('pf.t.inv')}</th><th class="r">${t('pf.t.ncw')}</th><th class="r">${t('pf.t.bk')}</th></tr>`+
    U.panden.map(({naam,aantal,uitkomst:u})=>`<tr><td>${esc(naam)}</td><td class="r">${nl(aantal,0)}</td><td>${rk(u.R)} → ${rk(u.R2)}</td>
      <td class="r">${eur(u.E)}<br><small>${eurR(u.marge.E)}</small></td><td class="r">${eur(aantal*u.E)}</td><td class="r">${eur(aantal*u.dE)}</td>
      <td class="r">${eur(aantal*u.cost)}</td><td class="r">${sgn(aantal*u.NCW)}<br><small>${sgn(aantal*u.marge.NCW[0])} ${tot} ${sgn(aantal*u.marge.NCW[1])}</small></td>
      <td class="r">${u.BK==null?'–':nl(u.BK)}</td></tr>`).join('')+
    `<tr class="tot"><td>${t('totaal')}</td><td class="r">${nl(T.aantal,0)}</td><td></td><td></td><td class="r">${eur(T.E)}</td><td class="r">${eur(T.dE)}</td><td class="r">${eur(inv)}</td><td class="r">${sgn(T.NCW)}</td><td class="r">${T.cwK>0?nl(T.cwB/T.cwK):'–'}</td></tr>`;
  $('resnote').textContent=t('pf.noot',{c:curK,lijst:CURVES.map(c=>tv(c,'kort')).join(', ')});
}

function tekenAlles(){ tekenRegels(); tekenUitgangspunten(); reken(); }
// taal of thema gewisseld (js/00-site.js)
document.addEventListener('dc-weergave',tekenAlles);
tekenAlles();
})();
