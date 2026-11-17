/* Site: taal (NL/EN), gedeelde kop met navigatie, licht/donker. Eerste script op elke pagina,
   direct na data/teksten.js. Pagina's luisteren naar het event 'dc-weergave' (taal of thema
   gewisseld) om zelf opnieuw te tekenen.
   - <body data-pagina="pand|portefeuille|methode|start"> bepaalt titel en actieve navigatie
   - <header class="uhead" id="uhead"></header> wordt hier gevuld
   - teksten: data-t / data-t-attr (zie data/teksten.js) en blokken met data-lang="nl"/"en" */
(function(){
const TX=window.DC_TEKSTEN||{nl:{},en:{}}, TALEN=['nl','en'];
function beginTaal(){
  const q=new URLSearchParams(location.search).get('lang'); if(TALEN.includes(q)) return q;
  try{const s=localStorage.getItem('dc-taal'); if(TALEN.includes(s)) return s;}catch(e){}
  return 'nl';
}
let taal=beginTaal();
const t=(k,vars)=>{
  let s=(TX[taal]&&TX[taal][k]!=null)?TX[taal][k]:(TX.nl[k]!=null?TX.nl[k]:k);
  if(vars) s=String(s).replace(/\{(\w+)\}/g,(m,n)=>vars[n]!=null?vars[n]:m);
  return s;
};
// veld met taalvariant: o.naam (nl) en o.naam_en (en)
const tv=(o,k)=>o?(taal==='en'&&o[k+'_en']!=null?o[k+'_en']:o[k]):'';
const getal=(v,d=0)=>Number(v).toLocaleString(taal==='en'?'en-GB':'nl-NL',{maximumFractionDigits:d});

function pasToe(root){
  root=root||document;
  document.documentElement.lang=taal;
  root.querySelectorAll('[data-t]').forEach(e=>{e.innerHTML=t(e.dataset.t);});
  root.querySelectorAll('[data-t-attr]').forEach(e=>e.dataset.tAttr.split(';').forEach(p=>{const i=p.indexOf(':'); if(i>0) e.setAttribute(p.slice(0,i).trim(),t(p.slice(i+1).trim()));}));
  const pg=document.body.dataset.pagina; if(pg) document.title=t('titel.'+pg);
}

// ---- gedeelde kop
const HUIS='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v10h13V10"/></svg>';
const MAAN='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
const NAV=[['pand','pand.html'],['portefeuille','portefeuille.html'],['methode','methode.html']];
function kop(){
  const h=document.getElementById('uhead'); if(!h) return;
  const pg=document.body.dataset.pagina;
  h.innerHTML=`<nav class="tsw" aria-label="Site"><a class="thome" href="index.html" data-t-attr="title:nav.home;aria-label:nav.home">${HUIS}</a>`+
    NAV.map(([k,u])=>`<a href="${u}" class="${k===pg?'on':''}"${k===pg?' aria-current="page"':''} data-t="nav.${k}"></a>`).join('')+`</nav>
    <h1 data-t="h1.${pg}"></h1>
    <div class="uknop"><span class="badge" data-t="indicatief" data-t-attr="title:indicatief.titel"></span>
      <button type="button" class="sq" id="dc-taal" data-t="knop.taal" data-t-attr="title:knop.taal.titel;aria-label:knop.taal.titel"></button>
      <button type="button" class="sq" id="dc-thema" data-t-attr="title:knop.thema;aria-label:knop.thema">${MAAN}</button></div>`;
}

// ---- thema
try{const th=localStorage.getItem('rk-theme'); if(th) document.documentElement.dataset.theme=th;}catch(e){}
const meld=()=>document.dispatchEvent(new CustomEvent('dc-weergave',{detail:{taal}}));
function wisselThema(){
  const r=document.documentElement, dark=r.dataset.theme?r.dataset.theme==='dark':matchMedia('(prefers-color-scheme: dark)').matches;
  r.dataset.theme=dark?'light':'dark'; try{localStorage.setItem('rk-theme',r.dataset.theme);}catch(e){}
  meld();
}
function zetTaal(l){
  if(!TALEN.includes(l)||l===taal) return; taal=l;
  try{localStorage.setItem('dc-taal',l);}catch(e){}
  const u=new URL(location.href); if(u.searchParams.has('lang')){u.searchParams.set('lang',l); history.replaceState(null,'',u);}
  pasToe(); meld();
}
document.addEventListener('click',e=>{
  if(e.target.closest('#dc-taal')) zetTaal(taal==='nl'?'en':'nl');
  if(e.target.closest('#dc-thema')) wisselThema();
});
const mq=matchMedia('(prefers-color-scheme: dark)'); if(mq.addEventListener) mq.addEventListener('change',meld);

window.DC={taal:()=>taal,t,tv,getal,pasToe,zetTaal};
document.documentElement.lang=taal;
document.addEventListener('DOMContentLoaded',()=>{kop(); pasToe();});
})();
