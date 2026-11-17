(()=>{
const $=id=>document.getElementById(id);
const LBL={nl:['Ontwerpkader','Evaluatiekader'],en:['Design','Evaluation']};
const CV={nl:{h:'Ontwerp en evalueer <em>circulaire klimaatinstallaties</em>',p:'Ontdek welke circulaire interventies er zijn voor verwarming, koeling en ventilatie, en vergelijk installatieconcepten op circulariteit, comfort en kosten.',b1:'Open het Ontwerpkader',b2:'Open het Evaluatiekader',c1t:'Ontwerpkader',fx:{sedum:'Sedumdak',shade:'Zonwering',trees:'Bomen en groen',pipeins:'Leidingisolatie'},c1s:'Interventies in het gebouw',c2t:'Evaluatiekader',c2s:'Concepten in een radardiagram',foot:'Deze interactieve tool is ontwikkeld door TU Delft en Dutch Green Building Council en is bedoeld om te leren en verkennen.'},
 en:{h:'Design and evaluate <em>circular HVAC systems</em>',p:'Explore circular interventions for heating, cooling and ventilation, and compare HVAC concepts on circularity, comfort and cost.',b1:'Open the Design framework',b2:'Open the Evaluation framework',c1t:'Design framework',fx:{sedum:'Sedum roof',shade:'Sun shading',trees:'Trees and greenery',pipeins:'Pipe insulation'},c1s:'Interventions in the building',c2t:'Evaluation framework',c2s:'Concepts in a radar diagram',foot:'This interactive tool was developed by TU Delft and Dutch Green Building Council and is intended for learning and exploration.'}};
const ARR='<svg viewBox="17 11 20 20" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 27.6Q27 23.4 34 14.3M25.4 15.1C28.4 14.6 31.3 14.3 34.3 14.1C34.2 17.1 34 19.9 33.7 22.8"/></svg>';
function paintCover(){ const l=lang(), c=CV[l]||CV.nl;
  $('cv-h').innerHTML=c.h; $('cv-p').textContent=c.p; const AR='<svg viewBox="17 11 20 20" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 27.6Q27 23.4 34 14.3M25.4 15.1C28.4 14.6 31.3 14.3 34.3 14.1C34.2 17.1 34 19.9 33.7 22.8"/></svg>'; $('cv-b1').innerHTML=c.b1+AR; $('cv-b2').innerHTML=c.b2+AR; $('cv-foot').textContent=c.foot;
  $('cv-c1t').textContent=c.c1t; $('cv-c2t').textContent=c.c2t;
  const cv=window.OK&&OK.cover?OK.cover():null, th=cv?cv.u:(window.OK?OK.thumb('r'):'');
  $('cv-c1v').innerHTML=th?`<img src="${th}" alt="">`+(cv?Object.entries(cv.pts).filter(([k,[x,y]])=>x>.04&&x<.9&&y>.06&&y<.94).map(([k,[x,y]])=>`<span class="cvm" style="left:${(x*100).toFixed(1)}%;top:${(y*100).toFixed(1)}%"><i>+</i><b>${c.fx[k]||k}</b></span>`).join(''):''):''; $('cv-c2v').innerHTML=window.EV?EV.radar():'';
  const lb=$('cv-lang'); lb.textContent=l==='nl'?'en':'nl'; lb.title=l==='nl'?'English':'Nederlands'; lb.setAttribute('aria-label',lb.title); }
function home(){ $('cover').hidden=false; document.body.classList.add('cv-open'); paintCover(); $('cover').scrollTop=0; document.title='Circular HVAC Framework'; }
function enter(t){ $('cover').hidden=true; document.body.classList.remove('cv-open'); show(t); window.scrollTo(0,0); }
let tool='ok', placed=false; try{ if(localStorage.getItem('chvac-tool')==='ev') tool='ev'; }catch(e){}
// logos double as the way home
const src=document.querySelector('.head .logos');
$('ulogos').innerHTML=src?src.innerHTML:'';

function lang(){ return window.OK?OK.lang():'nl'; }
function paint(){
  const l=lang(), L=LBL[l]||LBL.nl;
  $('tsw-ok').textContent=L[0]; $('tsw-ev').textContent=L[1];
  ['ok','ev'].forEach(k=>{ const b=$('tsw-'+k); b.classList.toggle('on',tool===k); b.setAttribute('aria-selected',String(tool===k)); });
  const ab=$('tsw-'+tool), ti=$('tind'); if(!placed) ti.classList.add('now'); ti.style.left=ab.offsetLeft+'px'; ti.style.width=ab.offsetWidth+'px'; if(!placed){ void ti.offsetWidth; ti.classList.remove('now'); placed=true; }
  $('uh1').innerHTML=tool==='ok'?(window.OK?OK.h1():''):(window.EV?EV.h1():'');
  document.title=tool==='ok'?(window.OK?OK.name():''):(window.EV?EV.name():'');
  document.documentElement.lang=l;
}
function show(t){
  tool=t; try{ localStorage.setItem('chvac-tool',t); }catch(e){}
  $('app').hidden=t!=='ok'; $('evwrap').hidden=t!=='ev';
  paint();
  requestAnimationFrame(()=>{ if(t==='ok'&&window.OK) OK.refresh(); if(t==='ev'&&window.EV) EV.refresh(); });
}
window.UH={show:t=>{ if(!$('cover').hidden){ $('cover').hidden=true; document.body.classList.remove('cv-open'); } show(t); window.scrollTo(0,0); },sync(from){ const l=from==='ev'&&window.EV?EV.lang():lang(); if(window.EV&&EV.lang()!==l) EV.setLang(l); if(window.OK&&OK.lang()!==l) OK.setLang(l); paint(); if(!$('cover').hidden) paintCover(); }};
$('tsw').addEventListener('click',e=>{ const b=e.target.closest('[data-tool]'); if(!b) return; if(b.dataset.tool==='home'){ home(); return; } if(b.dataset.tool!==tool) show(b.dataset.tool); });

$('cv-logos').innerHTML=src?src.innerHTML:'';
$('cover').addEventListener('click',e=>{ const g=e.target.closest('[data-go]'); if(g){ enter(g.dataset.go); return; }
  if(e.target.closest('#cv-lang')){ if(window.OK) OK.setLang(lang()==='nl'?'en':'nl'); UH.sync('ok'); paintCover(); } });
if(window.EV&&window.OK&&EV.lang()!==OK.lang()) EV.setLang(OK.lang());
if(window.EV&&window.OK){ if(tool==='ev') OK.setSide(EV.side()); else EV.setSide(OK.side()); }
show(tool);
home();
})();
