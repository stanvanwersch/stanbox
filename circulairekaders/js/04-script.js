(()=>{
const RT=document.getElementById('ev-host').attachShadow({mode:'open'});
RT.appendChild(document.getElementById('ev-tpl').content.cloneNode(true));
const $=id=>RT.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const COLORS=['#5f5b55','#3f51b5','#eb5e28','#1f7a5c','#9b2c6f','#a87700'];
const MAXC=6;
const CAT={
  circ:{nl:'Circulaire aspecten',en:'Circular aspects',hex:'#cbe8bd',t:'#2f6b2f'},
  comf:{nl:'Comfortaspecten',en:'Comfort aspects',hex:'#f7c9ad',t:'#9a4615'},
  fin:{nl:'Financiële aspecten',en:'Financial aspects',hex:'#cfd4ec',t:'#3f4a96'},
  oth:{nl:'Overige aspecten',en:'Other aspects',hex:'#e9e8e6',t:'#5f5b55'}
};
const CATS=['circ','comf','fin','oth'];
const A=[
 ['circ','Verminderen|materiaalgebruik','Reduce|material use','Hoeveel materiaal vraagt het concept over het hele tijdsframe, inclusief vervangingen? Behouden van aanwezige onderdelen telt mee.','How much material does the concept need over the whole time frame, including replacements? Keeping existing parts counts.'],
 ['circ','Selectie van lage|impact materialen','Select low-|impact materials','Hebben de toegepaste materialen een lage milieu-impact, bijvoorbeeld hergebruikt, gerecycled of biobased?','Do the materials used have a low environmental impact, e.g. reused, recycled or bio-based?'],
 ['circ','Toepassen|herbruikbare materialen','Apply reusable|materials','Kunnen onderdelen na gebruik opnieuw worden ingezet?','Can parts be used again after their first use?'],
 ['circ','Verminderen|energiegebruik','Reduce|energy use','Hoe laag is het energiegebruik in de gebruiksfase?','How low is energy use during operation?'],
 ['circ','Verbeteren|robuustheid','Improve|robustness','Hoe goed is het systeem bestand tegen slijtage, storingen en veranderend gebruik?','How well does the system withstand wear, failures and changing use?'],
 ['circ','Optimaliseren|losmaakbaarheid','Optimise|demountability','Zijn onderdelen eenvoudig en zonder schade los te maken?','Can parts be taken apart easily and without damage?'],
 ['circ','Optimaliseren|modulariteit','Optimise|modularity','Is het systeem opgebouwd uit uitwisselbare of uitbreidbare modules?','Is the system made of interchangeable or extendable modules?'],
 ['circ','Verminderen|kritieke grondstoffen','Reduce critical|raw materials','Hoe weinig kritieke grondstoffen bevat het concept?','How few critical raw materials does the concept contain?'],
 ['circ','Verminderen|transportbehoefte','Reduce|transport needs','Hoe weinig transport vragen levering, onderhoud en vervanging?','How little transport do delivery, maintenance and replacement require?'],
 ['comf','Verbeteren|thermisch comfort','Improve|thermal comfort','Hoe goed is het thermisch comfort, in winter én zomer?','How good is thermal comfort, in winter and summer?'],
 ['comf','Verbeteren akoestisch|comfort','Improve|acoustic comfort','Hoe stil is het systeem voor gebruikers en omwonenden?','How quiet is the system for occupants and neighbours?'],
 ['comf','Verbeteren|luchtkwaliteit','Improve|air quality','Hoe goed is de binnenluchtkwaliteit (ventilatie, CO₂, vocht)?','How good is indoor air quality (ventilation, CO₂, humidity)?'],
 ['fin','Verminderen|investeringskosten','Reduce|investment costs','Hoe laag zijn de investeringskosten van de ingreep?','How low is the investment cost of the intervention?'],
 ['fin','Verminderen|energiekosten','Reduce|energy costs','Hoe laag zijn de energiekosten over het tijdsframe?','How low are energy costs over the time frame?'],
 ['fin','Verminderen|onderhoudskosten','Reduce|maintenance costs','Hoe laag zijn onderhouds- en vervangingskosten over het tijdsframe?','How low are maintenance and replacement costs over the time frame?'],
 ['oth','Verhogen|onderhoudsgemak','Improve ease|of maintenance','Hoe eenvoudig zijn inspectie, onderhoud en reparatie?','How easy are inspection, maintenance and repair?'],
 ['oth','Verhogen gebruiks-|vriendelijkheid','Improve user-|friendliness','Hoe eenvoudig is het systeem in gebruik voor bewoners?','How easy is the system to use for occupants?'],
 ['oth','Aangeboden|garantie','Offered|warranty','Welke garantie biedt de leverancier op product en prestatie?','What warranty does the supplier give on product and performance?']
].map(([c,nl,en,hnl,hen],i)=>({i,c,nl,en,hnl,hen}));
const N=A.length;

const T={
 nl:{langBtn:'en',langT:'English',pname:'Evaluatiekader circulaire klimaatinstallaties',
  h1:'Vergelijk installatieconcepten <em>op circulariteit, comfort en kosten</em>',
  vRadar:'Radar',vTable:'Tabel',pnPh:'Naam van het project',ex:'voorbeeld',file:'Bestand',
  fNew:'Leeg beginnen',fNewS:'Alle invoer wissen',fEx:'Voorbeeld laden',fExS:'Het voorbeeld uit het Excel-sjabloon',fOpen:'Openen…',fOpenS:'Een opgeslagen .json-bestand laden',
  fJson:'Evaluatie opslaan (.json)',fJsonS:'Later weer te openen met ‘Openen’',fPng:'Radardiagram als PNG',fPngS:'Afbeelding met legenda, voor rapportages',fSvg:'Radardiagram als SVG',fSvgS:'Schaalbaar, voor InDesign of Illustrator',fCsv:'Scores als CSV',fCsvS:'Opent in Excel, zelfde opbouw als het sjabloon',
  filter:'Instellingen',foldS:'Instellingen inklappen',hz:'Tijdsframe',years:'jaar',other:'Anders',concepts:'Concepten',addC:'+ Concept toevoegen',aspects:'Aspecten',clear:'Wissen',catsN:'categorieën',
  inv:'Bestaande installaties',invEdit:'Bewerken',invNone:'Nog geen onderdelen ingevuld.',
  shint:'Klik op een concept bovenin om het te openen; het bolletje ervoor zet het aan of uit in het diagram. Filter op aspecten met de categorieën onderin. Met een concept geopend sleep je een punt om te scoren.',
  all:'Toon alles',ref:'Referentie',alt:'Alternatief',avgL:'gemiddeld',scored:n=>n+'/'+N+' gescoord',
  name:'Naam',desc:'Beschrijving',descPh:'Wat wordt geplaatst, behouden en hoe vaak vervangen?',keep:'Behouden aanwezige onderdelen',noInv:'Vul eerst de bestaande installaties in.',
  vsRef:'Ten opzichte van de referentie',better:'Grootste winst',worse:'Grootste verlies',noDiff:'Scoor de referentie en dit concept om de verschillen te zien.',
  rmC:'Concept verwijderen',close:'Sluiten',editC:'Naam en beschrijving bewerken',hideC:'Verbergen in diagram',showC:'Tonen in diagram',allA:'Alle aspecten',hideP:'Paneel naar rechts schuiven',showP:'Paneel tonen',
  toOK:'Bekijk interventies in het Ontwerpkader',fromOK:n=>'Gemaakt van '+n+' interventie'+(n===1?'':'s')+' uit het Ontwerpkader.',srcT:'Interventies uit het Ontwerpkader',addedC:'Concept gemaakt van je selectie',maxC:'Er kunnen maximaal 6 concepten zijn',
  aspScores:'Scores per concept',note:'Toelichting',notePh:'Waarom deze scores? Aannames, bronnen, twijfels…',
  invT:'Bestaande installaties',invS:'Wat is er aanwezig en hoelang kan het nog mee?',
  elPh:'Bijv. CV-ketel',rem:'Resterende levensduur',life:'Levensduur vervanger',yr:'jaar',replIn:(h,n)=>'Vervangen in '+h+' jaar: '+n+'×',replS:n=>n+'× vervangen',staysS:'gaat mee',rmEl:'Onderdeel verwijderen',addEl:'+ Onderdeel toevoegen',
  stays:'gaat het hele tijdsframe mee',repl:n=>n+'× vervangen',unk:'levensduur onbekend',
  tblT:'Alle concepten',tblS:'Scores van 0 (slecht of niet van toepassing) tot 5 (uitstekend). Klik op een score om hem te wijzigen.',back:'Terug naar radardiagram',avg:'Gemiddelde score',
  infoT:'Over het evaluatiekader',infoE:'',
  infoB:'<p>Met het radardiagram worden de prestaties van een klimaatinstallatie op een intuïtieve en snelle manier geëvalueerd. Het helpt installatiespecialisten en ontwerpers bij het maken van weloverwogen (circulaire) keuzes en geeft inzicht in dilemma’s bij het ontwerp.</p><p>Het radardiagram redeneert vanuit het installatiesysteem: het beoordeelt de circulariteit van het installatieconcept en niet van de ingreep. Gebruikt een concept al aanwezig materiaal of aanwezige installatieproducten, dan scoort het beter op ‘verminderen materiaalgebruik’ en ‘selectie van lage impact materialen’. Hergebruik bij de ingreep wordt zo wel beloond.</p><p>Gebruik het evaluatiekader door de volgende stappen te doorlopen:</p><ol><li>Stel vast wat zich aan installaties in het gebouw bevindt en schat hoelang deze nog mee kunnen.</li><li>Stel een tijdsframe vast voor hoe lang het gebouw na de renovatie nog gebruikt wordt, bijvoorbeeld 30 of 50 jaar.</li><li>Breng het scenario in kaart waarin het huidige installatieconcept gehandhaafd blijft. Schat de nodige vervangingen binnen het tijdsframe en ga na welke aanwezige elementen je kunt behouden.</li><li>Bedenk alternatieve installatieconcepten, met hun vervangingen en behouden elementen.</li><li>Breng de alternatieve installatieconcepten in kaart met het radardiagram.</li></ol><div class="note">Je invoer wordt automatisch in deze browser bewaard. Via ‘Bestand’ sla je een evaluatie op als bestand of exporteer je het radardiagram en de scores.</div>',
  src:'Gebaseerd op hoofdstuk 6.1 ‘Kwalitatieve evaluatie’ van het Circular HVAC-kader (TU Delft & DGBC). Invoer blijft in je eigen browser; sla een evaluatie op als bestand om hem te bewaren of te delen.',
  cNew:'Alle invoer wissen?',cEx:'Het voorbeeld vervangt je huidige invoer.',yes:'Doorgaan',no:'Annuleren',
  tSaved:'Opgeslagen',tDeclined:'Opslaan geannuleerd',tNoDl:'Downloaden is in deze weergave niet beschikbaar',tOpened:'Evaluatie geopend',tBad:'Dit bestand is geen evaluatie uit deze tool',
  refName:'Huidig concept handhaven',altName:n=>'Concept '+n,csvH:['Nr','Categorie','Aspect'],horizonL:'Tijdsframe',project:'Project',filtered:'gefilterd'},
 en:{langBtn:'nl',langT:'Nederlands',pname:'Circular HVAC Evaluation Framework',
  h1:'Compare HVAC concepts <em>on circularity, comfort and cost</em>',
  vRadar:'Radar',vTable:'Table',pnPh:'Project name',ex:'example',file:'File',
  fNew:'Start empty',fNewS:'Clear all input',fEx:'Load example',fExS:'The example from the Excel template',fOpen:'Open…',fOpenS:'Load a saved .json file',
  fJson:'Save evaluation (.json)',fJsonS:'Open it again later with ‘Open’',fPng:'Radar diagram as PNG',fPngS:'Image with legend, for reports',fSvg:'Radar diagram as SVG',fSvgS:'Scalable, for InDesign or Illustrator',fCsv:'Scores as CSV',fCsvS:'Opens in Excel, same layout as the template',
  filter:'Settings',foldS:'Collapse settings',hz:'Time frame',years:'years',other:'Other',concepts:'Concepts',addC:'+ Add concept',aspects:'Aspects',clear:'Clear',catsN:'categories',
  inv:'Existing installations',invEdit:'Edit',invNone:'No elements entered yet.',
  shint:'Click a concept at the top to open it; the dot in front turns it on or off in the diagram. Filter aspects with the categories at the bottom. With a concept open, drag a point to score it.',
  all:'Show all',ref:'Reference',alt:'Alternative',avgL:'average',scored:n=>n+'/'+N+' scored',
  name:'Name',desc:'Description',descPh:'What is installed, kept and how often replaced?',keep:'Existing elements kept',noInv:'Enter the existing installations first.',
  vsRef:'Compared with the reference',better:'Largest gains',worse:'Largest losses',noDiff:'Score the reference and this concept to see the differences.',
  rmC:'Remove concept',close:'Close',editC:'Edit name and description',hideC:'Hide in diagram',showC:'Show in diagram',allA:'All aspects',hideP:'Slide panel to the right',showP:'Show panel',
  toOK:'View interventions in the Design framework',fromOK:n=>'Made from '+n+' intervention'+(n===1?'':'s')+' in the Design framework.',srcT:'Interventions from the Design framework',addedC:'Concept created from your selection',maxC:'There can be at most 6 concepts',
  aspScores:'Scores per concept',note:'Note',notePh:'Why these scores? Assumptions, sources, doubts…',
  invT:'Existing installations',invS:'What is in the building and how long can it last?',
  elPh:'E.g. gas boiler',rem:'Remaining lifespan',life:'Replacement lifespan',yr:'years',replIn:(h,n)=>'Replaced in '+h+' years: '+n+'×',replS:n=>'replaced '+n+'×',staysS:'lasts',rmEl:'Remove element',addEl:'+ Add element',
  stays:'lasts the whole time frame',repl:n=>'replaced '+n+'×',unk:'lifespan unknown',
  tblT:'All concepts',tblS:'Scores from 0 (poor or not applicable) to 5 (excellent). Click a score to change it.',back:'Back to radar diagram',avg:'Average score',
  infoT:'About the evaluation framework',infoE:'',
  infoB:'<p>The radar diagram gives HVAC specialists and designers a quick, intuitive way to evaluate the performance of an HVAC system. It supports well-considered (circular) choices and shows the trade-offs in the design.</p><p>The diagram reasons from the installation system: it assesses the circularity of the HVAC concept, not of the intervention. A concept that uses materials or products already present scores better on ‘reduce material use’ and ‘select low-impact materials’, so reuse in the intervention is rewarded.</p><p>Use the evaluation framework by following these steps:</p><ol><li>Establish which installations are in the building and estimate how long they can still last.</li><li>Set a time frame for how long the building will be used after renovation, e.g. 30 or 50 years.</li><li>Map the scenario in which the current concept is kept. Estimate the replacements needed within the time frame and check which existing elements you can keep.</li><li>Devise alternative concepts, with their replacements and retained elements.</li><li>Map the alternative concepts with the radar diagram.</li></ol><div class="note">Your input is saved automatically in this browser. Use ‘File’ to save an evaluation as a file or to export the radar diagram and scores.</div>',
  src:'Based on section 6.1 ‘Qualitative evaluation’ of the Circular HVAC framework (TU Delft & DGBC). Input stays in your own browser; save an evaluation as a file to keep or share it.',
  cNew:'Clear all input?',cEx:'The example replaces your current input.',yes:'Continue',no:'Cancel',
  tSaved:'Saved',tDeclined:'Save cancelled',tNoDl:'Downloads are not available in this view',tOpened:'Evaluation opened',tBad:'This file is not an evaluation from this tool',
  refName:'Keep current concept',altName:n=>'Concept '+n,csvH:['No','Category','Aspect'],horizonL:'Time frame',project:'Project',filtered:'filtered'}
};

/* ---------- state ---------- */
let uid=0; const nid=()=>'x'+Date.now().toString(36)+(uid++);
function example(){
  const inv=[{id:nid(),el:'CV-ketel',rem:5,life:15},{id:nid(),el:'Leidingwerk',rem:20,life:''},{id:nid(),el:'Ventilatie systeem C',rem:'',life:''},{id:nid(),el:'Geen isolatie (bouwkundig)',rem:'',life:''}];
  return {example:true,name:'Voorbeeld: grondgebonden woning',horizon:20,inv,notes:{},concepts:[
    {id:nid(),name:'Geen ingreep (BAU)',desc:'CV-ketel 1× vervangen, leidingwerk en ventilatiesysteem C behouden.',keep:inv.map(x=>x.id),vis:true,s:[4,1,2,1,2,3,3,3,3,1,2,3,4,1,3,3,3,3]},
    {id:nid(),name:'Concept A',desc:'Spouwmuurisolatie toepassen, hybride warmtepompsysteem plaatsen, nieuw ventilatiesysteem D plaatsen, airco plaatsen.',keep:[inv[1].id],vis:true,s:[1,2,2,2,4,3,4,1,3,5,3,4,1,2,2,2,3,4]},
    {id:nid(),name:'Concept B',desc:'Biobased spouwmuurisolatie toepassen, CV-ketel hergebruiken in hybride warmtepompsysteem, ventilatiesysteem uitbreiden naar systeem D, zonwering plaatsen.',keep:[inv[0].id,inv[1].id],vis:true,s:[3,4,2,4,4,3,5,2,3,5,4,5,2,4,2,2,3,3]}]};
}
function blank(){ const t=L(); return {example:false,name:'',horizon:30,inv:[],notes:{},concepts:[
  {id:nid(),name:t.refName,desc:'',keep:[],vis:true,s:Array(N).fill(null)},{id:nid(),name:t.altName(1),desc:'',keep:[],vis:true,s:Array(N).fill(null)}]}; }
const S={editC:false,invOpen:new Set(),aspOpen:false,sideMin:false,lang:'nl',min:false,view:'radar',cats:new Set(),sel:null,hl:null,P:example()};
const KEY='chvac-eval-v1';
const valid=p=>p&&Array.isArray(p.concepts)&&p.concepts.length&&p.concepts.every(c=>Array.isArray(c.s)&&c.s.length===N)&&Array.isArray(p.inv);
try{const r=JSON.parse(localStorage.getItem(KEY)||'null'); if(r){ if(valid(r.P)) S.P=r.P; if(r.lang==='en')S.lang='en'; if(Array.isArray(r.cats)) r.cats.filter(k=>CATS.includes(k)).forEach(k=>S.cats.add(k)); if(r.view==='table')S.view='table'; if(r.sideMin)S.sideMin=true; }}catch(e){}
let saveT=0; const save=()=>{clearTimeout(saveT); saveT=setTimeout(()=>{try{localStorage.setItem(KEY,JSON.stringify({sideMin:S.sideMin,lang:S.lang,view:S.view,cats:[...S.cats],P:S.P}));}catch(e){}},250);};
const L=()=>T[S.lang], P=()=>S.P;
const C=i=>COLORS[i%COLORS.length];
const lbl=a=>(S.lang==='nl'?a.nl:a.en).replace('-|','-').replace('|',' ');
const cname=(c,i)=>c.name||(i===0?L().refName:L().altName(i));
const AX=()=>A.filter(a=>!S.cats.size||S.cats.has(a.c));
const avgOf=arr=>{const v=arr.filter(x=>x!==null&&x!==undefined); return v.length?v.reduce((a,b)=>a+b,0)/v.length:null;};
const avgC=c=>avgOf(AX().map(a=>c.s[a.i]));
const catAvg=(c,k)=>avgOf(A.filter(a=>a.c===k).map(a=>c.s[a.i]));
const fmt=v=>v===null?'–':v.toLocaleString(S.lang==='nl'?'nl-NL':'en-GB',{minimumFractionDigits:1,maximumFractionDigits:1});
const sgn=v=>(v>0?'+':v<0?'−':'±')+fmt(Math.abs(v));
function reps(el){const hz=+P().horizon||0, r=parseFloat(el.rem), l=parseFloat(el.life); if(!(r>=0)) return null; if(r>=hz) return 0; if(!(l>0)) return null; return Math.ceil((hz-r)/l);}
function shortRep(el){const n=reps(el), t=L(); if(n===null) return {t:'–',k:'u'}; if(n===0) return {t:t.staysS,k:'z'}; return {t:t.replS(n),k:''};}
function sideRep(el){const n=reps(el), t=L(); if(n===null) return {t:t.unk,k:'u'}; if(n===0) return {t:t.stays,k:'z'}; return {t:t.replIn(+P().horizon,n),k:''};}
function repTxt(el){const n=reps(el), t=L(); if(n===null) return {t:t.unk,k:'u'}; if(n===0) return {t:t.stays,k:'z'}; return {t:t.repl(n),k:''};}
function touch(){ if(P().example){P().example=false;} save(); }

/* ---------- icons ---------- */
const I={
 x:'<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
 poly:'<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l8.5 6.2-3.2 10H6.7L3.5 8.2z"/></svg>',
 grid:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M9 4v16M15 4v16"/></svg>',
 radar:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M12 2.5l9 6.5-3.4 10.5H6.4L3 9z" opacity=".45"/><path d="M12 7l4.5 3.5-2 5.5h-4.5L8 10.5z" fill="currentColor" fill-opacity=".25"/><path d="M12 2.5V12M21 9l-9 3M17.6 19.5L12 12M6.4 19.5L12 12M3 9l9 3" opacity=".45"/></svg>',
 chev:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>',
 pen:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13 7l4 4"/></svg>',
 house:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-7 9 7"/><path d="M5 9.5V20h14V9.5"/></svg>',
 plus:'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>'
};

/* ---------- radar ---------- */
const G={w:760,h:640,cx:380,cy:318,R:198};
function geo(){ const ax=AX(), n=ax.length, step=360/n; return {ax,n,step,ang:k=>(-90+k*step)*Math.PI/180}; }
function radarSVG(o={}){
  const {mode='full',font='Poppins, Arial, sans-serif',forExport=false}=o;
  const p=P(), g=geo(), sel=!forExport&&S.sel&&S.sel.t==='c'?S.sel.i:null, ahl=forExport?null:(S.sel&&S.sel.t==='a'?S.sel.i:S.hl);
  const pt=(k,r)=>[G.cx+r*Math.cos(g.ang(k)),G.cy+r*Math.sin(g.ang(k))];
  let s='';
  // category sectors
  CATS.forEach(k=>{ const ks=g.ax.map((a,j)=>a.c===k?j:-1).filter(j=>j>=0); if(!ks.length) return;
    const r=G.R+14, st=-90+ks[0]*g.step-g.step/2, en=-90+ks[ks.length-1]*g.step+g.step/2, rad=d=>d*Math.PI/180;
    if(en-st>=359.9){ s+=`<circle cx="${G.cx}" cy="${G.cy}" r="${r}" fill="${CAT[k].hex}"/>`; return; }
    s+=`<path d="M${G.cx},${G.cy}L${(G.cx+r*Math.cos(rad(st))).toFixed(1)},${(G.cy+r*Math.sin(rad(st))).toFixed(1)}A${r},${r} 0 ${en-st>180?1:0} 1 ${(G.cx+r*Math.cos(rad(en))).toFixed(1)},${(G.cy+r*Math.sin(rad(en))).toFixed(1)}Z" fill="${CAT[k].hex}" stroke="#fff" stroke-width="3"/>`; });
  for(let r=1;r<=5;r++) s+=`<circle cx="${G.cx}" cy="${G.cy}" r="${G.R*r/5}" fill="none" stroke="#b4ada3" stroke-width="${r===5?1:.7}"/>`;
  g.ax.forEach((a,k)=>{const [x,y]=pt(k,G.R+14), on=ahl===a.i; s+=`<line x1="${G.cx}" y1="${G.cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="${on?'#252422':'#b4ada3'}" stroke-width="${on?1.5:.7}"/>`;});
  for(let r=1;r<=5;r++) s+=`<text x="${G.cx+4}" y="${G.cy-G.R*r/5+11}" font-size="10" fill="#7d776d" font-family="${font}">${r}</text>`;
  // polygons
  let order=p.concepts.map((c,i)=>i).filter(i=>p.concepts[i].vis||i===sel);
  if(sel!==null) order=order.filter(i=>i!==sel).concat(sel);
  order.forEach(ci=>{
    const c=p.concepts[ci], col=C(ci), act=ci===sel, dim=sel!==null&&!act;
    const pts=g.ax.map((a,k)=>pt(k,G.R*(c.s[a.i]||0)/5).map(n=>n.toFixed(1)).join(',')).join(' ');
    s+=`<polygon data-ci="${ci}" points="${pts}" fill="${col}" fill-opacity="${dim?.08:(ci===0?.28:.24)}" stroke="${col}" stroke-opacity="${dim?.45:1}" stroke-width="${act?2.4:1.6}" ${ci&&!act?'stroke-dasharray="3 3"':''} stroke-linejoin="round"/>`;
    if(act) g.ax.forEach((a,k)=>{const v=c.s[a.i]; const [x,y]=pt(k,G.R*(v||0)/5); s+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${v===null?4:6}" fill="${v===null?'#fff':col}" stroke="${v===null?col:'#fff'}" stroke-width="${v===null?1.6:2}"/>`;});
  });
  // labels
  g.ax.forEach((a,k)=>{
    const an=g.ang(k), cs=Math.cos(an), sn=Math.sin(an), on=ahl===a.i;
    if(mode==='num'){ const [x,y]=pt(k,G.R+40); s+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="17" fill="${CAT[a.c].hex}" ${on?'stroke="#252422" stroke-width="1.5"':''}/><text x="${x.toFixed(1)}" y="${(y+6).toFixed(1)}" text-anchor="middle" font-size="16" font-weight="700" fill="${CAT[a.c].t}" font-family="${font}">${a.i+1}</text>`; return; }
    const [x,y]=pt(k,G.R+26), lines=(S.lang==='nl'?a.nl:a.en).split('|'), lh=15;
    const anc=cs>.2?'start':cs<-.2?'end':'middle';
    const y0=sn<-.6?y-(lines.length-1)*lh:sn>.6?y+10:y-((lines.length-1)*lh)/2+4;
    s+=`<text text-anchor="${anc}" font-size="12.5" font-weight="${on?700:600}" fill="${on?'#252422':'#4f4b45'}" font-family="${font}">`+lines.map((t,j)=>`<tspan x="${x.toFixed(1)}" y="${(y0+j*lh).toFixed(1)}">${esc(t)}</tspan>`).join('')+`</text>`;
  });
  return s;
}
let lblMode='full';
function drawRadar(){
  $('rwrap').innerHTML=`<svg id="rsvg" viewBox="0 0 ${G.w} ${G.h}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${esc(L().vRadar)}">${radarSVG({mode:lblMode})}</svg>`;
  $('rwrap').classList.toggle('drag',!!(S.sel&&S.sel.t==='c'));
}
new ResizeObserver(es=>{const r=es[0].contentRect; const sc=Math.min(r.width/G.w,r.height/G.h||9); const m=sc<.62?'num':'full'; if(m!==lblMode){lblMode=m; drawRadar();}}).observe($('rwrap'));

/* pointer on radar */
let drag=null, down=null;
function svgPt(e){const sv=$('rsvg'); const q=sv.createSVGPoint(); q.x=e.clientX;q.y=e.clientY; return q.matrixTransform(sv.getScreenCTM().inverse());}
function hit(e){const q=svgPt(e), g=geo(), dx=q.x-G.cx, dy=q.y-G.cy, d=Math.hypot(dx,dy); let a=Math.atan2(dy,dx)*180/Math.PI+90; if(a<0)a+=360; const k=Math.round(a/g.step)%g.n; return {k,a:g.ax[k],d,q,g};}
function inPoly(q,ci){ const c=P().concepts[ci], g=geo(); const pts=g.ax.map((a,k)=>[G.cx+G.R*(c.s[a.i]||0)/5*Math.cos(g.ang(k)),G.cy+G.R*(c.s[a.i]||0)/5*Math.sin(g.ang(k))]); let ins=false; for(let i=0,j=pts.length-1;i<pts.length;j=i++){const [xi,yi]=pts[i],[xj,yj]=pts[j]; if(((yi>q.y)!==(yj>q.y))&&(q.x<(xj-xi)*(q.y-yi)/(yj-yi)+xi)) ins=!ins;} return ins; }
const RW=$('rwrap');
RW.addEventListener('pointerdown',e=>{
  if(e.button>0||!$('rsvg')) return; const h=hit(e);
  if(S.sel&&S.sel.t==='c'&&h.d<=G.R+24){ e.preventDefault(); drag={k:h.k,id:e.pointerId}; RW.setPointerCapture(e.pointerId); setDrag(e); return; }
  down={x:e.clientX,y:e.clientY};
});
RW.addEventListener('pointermove',e=>{
  if(drag&&e.pointerId===drag.id){setDrag(e);return;}
  if(e.pointerType==='touch'||!$('rsvg')) return;
  const h=hit(e), ni=h.d<=G.R+80?h.a.i:null;
  if(ni!==S.hl){S.hl=ni; drawRadar(); markRows();}
  showTip(e,ni);
});
RW.addEventListener('pointerleave',()=>{ if(drag) return; S.hl=null; drawRadar(); markRows(); $('tip').hidden=true; });
RW.addEventListener('pointerup',e=>{
  if(drag){ drag=null; renderChips(); renderSide(); if(S.sel) renderPop(); return; }
  if(!down) return; const moved=Math.hypot(e.clientX-down.x,e.clientY-down.y)>6; down=null; if(moved) return;
  const h=hit(e); if(h.d>G.R+90){ closePop(); return; }
  if(h.d<=G.R){ const p=P(); const cand=p.concepts.map((c,i)=>i).filter(i=>p.concepts[i].vis).reverse().find(i=>inPoly(h.q,i)); if(cand!==undefined&&h.d<G.R*0.85){ openSel({t:'c',i:cand}); return; } }
  openSel({t:'a',i:h.a.i});
});
RW.addEventListener('pointercancel',()=>{drag=null;down=null;});
function setDrag(e){
  const q=svgPt(e), g=geo(), k=drag.k, an=g.ang(k); const proj=(q.x-G.cx)*Math.cos(an)+(q.y-G.cy)*Math.sin(an);
  const v=Math.max(0,Math.min(5,Math.round(proj/G.R*5))), ci=S.sel.i, c=P().concepts[ci], ai=g.ax[k].i;
  if(c.s[ai]!==v){ c.s[ai]=v; touch(); drawRadar(); updPips(ci,ai); updHead(); }
  S.hl=ai; showTip(e,ai);
}
function showTip(e,ai){
  const tip=$('tip'); if(ai===null||ai===undefined||S.view==='table'){tip.hidden=true;return;}
  const p=P(), a=A[ai];
  tip.innerHTML=`<b>${ai+1}. ${esc(lbl(a))}</b>`+p.concepts.map((c,ci)=>`<div><i style="background:${C(ci)}"></i><span>${esc(cname(c,ci))}</span><em>${c.s[ai]===null?'–':c.s[ai]}</em></div>`).join('');
  tip.hidden=false;
  const box=$('stage').getBoundingClientRect(); let x=e.clientX-box.left+16, y=e.clientY-box.top+16;
  const lim=box.width-(S.sel&&!S.min&&innerWidth>700?PW:0); if(x+tip.offsetWidth>lim) x=e.clientX-box.left-tip.offsetWidth-12; if(y+tip.offsetHeight>box.height) y=box.height-tip.offsetHeight-8;
  tip.style.left=Math.max(4,x)+'px'; tip.style.top=Math.max(4,y)+'px';
}

/* ---------- render: header, side, chips ---------- */
function renderStatic(){
  const t=L();
  $('seg').innerHTML=`<button type="button" data-view="radar" class="${S.view==='radar'?'on':''}">${t.vRadar}</button><button type="button" data-view="table" class="${S.view==='table'?'on':''}">${t.vTable}</button>`;
  $('pn').placeholder=t.pnPh; $('pn').setAttribute('aria-label',t.project); $('pn').value=P().name||'';
  
  $('fileL').textContent=t.file;
  const it=(k,a,b)=>`<button type="button" data-f="${k}">${a}<small>${b}</small></button>`;
  $('fileM').innerHTML=it('new',t.fNew,t.fNewS)+it('ex',t.fEx,t.fExS)+it('open',t.fOpen,t.fOpenS)+'<hr>'+it('json',t.fJson,t.fJsonS)+it('png',t.fPng,t.fPngS)+it('svg',t.fSvg,t.fSvgS)+it('csv',t.fCsv,t.fCsvS);
  $('lang').textContent=t.langBtn; $('lang').title=t.langT; $('lang').setAttribute('aria-label',t.langT);
  $('cats').innerHTML=catBtns();
}
function catBtns(){ const t=L(); return CATS.map(k=>`<button type="button" class="cf ${S.cats.size&&!S.cats.has(k)?'off':''} ${S.cats.has(k)?'on':''}" data-cat="${k}" aria-pressed="${S.cats.has(k)}"><i style="background:${CAT[k].hex}"></i>${CAT[k][S.lang]} <small>(${A.filter(a=>a.c===k).length})</small></button>`).join('')+(S.cats.size?`<button type="button" class="cf clr" data-catclr="1">${t.allA}</button>`:''); }
function applySide(){ RT.querySelector('.layout').classList.toggle('sc',S.sideMin); if(!S.sideMin) setPW(340); $('stage').classList.toggle('rz',S.sideMin); $('sideBL').textContent=L().filter; }
function renderSide(){
  const t=L(), p=P();
  const hz=[20,30,35,50].map(y=>`<button type="button" class="pill ${+p.horizon===y?'on':''}" data-hz="${y}">${y}</button>`).join('');
  const invs=p.inv.filter(e=>e.el);
  const inv=invs.length?invs.map(e=>{const r=repTxt(e); return `<div><span>${esc(e.el)}</span><span class="${r.k==='z'?'z':''}">${esc(r.t)}</span></div>`;}).join(''):`<div><span style="color:var(--text3)">${t.invNone}</span></div>`;
  const invEd=p.inv.map(el=>{const r=sideRep(el), op=S.invOpen.has(el.id), sh=shortRep(el);
    return `<div class="inv si ${op?'open':''}" data-id="${el.id}"><button type="button" class="ivh" data-invx="${el.id}" aria-expanded="${op}"><span class="nm">${esc(el.el)||'<i>'+esc(t.elPh)+'</i>'}</span><span class="rs ${sh.k}">${esc(sh.t)}</span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg></button>`+
    (op?`<div class="ivb"><div class="r1"><input data-f="el" value="${esc(el.el)}" placeholder="${esc(t.elPh)}" aria-label="${esc(t.inv)}"><button type="button" class="px" data-rm="${el.id}" aria-label="${esc(t.rmEl)}" title="${esc(t.rmEl)}">${I.x}</button></div><div class="r2"><label for="rem-${el.id}">${t.rem}</label><input id="rem-${el.id}" data-f="rem" type="number" min="0" value="${esc(el.rem)}"><span>${t.yr}</span></div><div class="r2"><label for="life-${el.id}">${t.life}</label><input id="life-${el.id}" data-f="life" type="number" min="1" value="${esc(el.life)}"><span>${t.yr}</span></div><div class="rep ${r.k}">${esc(r.t)}</div></div>`:'')+`</div>`;}).join('');
  $('side').innerHTML=`<div class="sideh"><h2>${t.filter}</h2><button type="button" class="sfold" data-fold="1" title="${esc(t.foldS)}" aria-label="${esc(t.foldS)}" aria-expanded="true"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 15l6-6 6 6"/></svg></button></div>
    <section><div class="sh"><h3>${t.hz}</h3><span style="font-size:11.5px;color:var(--text3)">${t.years}</span></div><div class="pills sm">${hz}</div>
      <label class="hzo">${t.other}: <input id="hz" type="number" min="1" max="200" step="1" value="${esc(p.horizon)}" aria-label="${esc(t.hz)}"> ${t.years}</label></section>
    <section><div class="sh"><h3>${t.inv}</h3></div><div class="sinv">${invEd}</div><button type="button" class="lnk" id="addEl">${t.addEl}</button></section>`;
}
function renderChips(){
  const t=L(), p=P(), sel=S.sel&&S.sel.t==='c'?S.sel.i:null;
  $('chips').innerHTML=p.concepts.map((c,i)=>`<span class="gnl gc ${sel===i?'on':''} ${c.vis?'':'off'}" style="--cc:${C(i)}"><button type="button" class="vt" data-vis="${i}" aria-pressed="${c.vis}" title="${esc(c.vis?t.hideC:t.showC)}" aria-label="${esc((c.vis?t.hideC:t.showC)+': '+cname(c,i))}"><span class="c">${I.poly}</span></button><button type="button" class="op" data-c="${i}"><span class="t">${esc(cname(c,i))}</span><b>${fmt(avgC(c))}</b></button></span>`).join('')
    +(p.concepts.length<MAXC?`<button type="button" class="gnl add" data-add="1" title="${esc(t.addC)}">${I.plus}</button>`:'')
    +`<button type="button" class="gnl all" data-view="table"><span class="c" style="background:var(--accent)">${I.grid}</span><span class="t">${t.all}</span></button>`;
}

/* ---------- panel ---------- */
function pipsHTML(ci,ai){
  const v=P().concepts[ci].s[ai]; let h=`<div class="pips" style="--pc:${C(ci)}" data-pc="${ci}" data-pa="${ai}">`;
  for(let k=0;k<=5;k++) h+=`<button type="button" class="pip ${v===k?'on':(v!==null&&k<v?'below':'')}" data-v="${k}" aria-label="${k}" aria-pressed="${v===k}">${k}</button>`;
  return h+'</div>';
}
function updPips(ci,ai){ RT.querySelectorAll(`.pips[data-pc="${ci}"][data-pa="${ai}"]`).forEach(el=>{el.outerHTML=pipsHTML(ci,ai);}); }
function updHead(){
  // refresh averages shown in panel header, table header and chips without re-rendering inputs
  const p=P(); renderChips();
  RT.querySelectorAll('[data-avg]').forEach(el=>{const c=p.concepts[+el.dataset.avg]; if(c) el.textContent=fmt(avgC(c));});
  RT.querySelectorAll('[data-cavg]').forEach(el=>{const [ci,k]=el.dataset.cavg.split(':'); const c=p.concepts[+ci]; if(c) el.textContent=fmt(catAvg(c,k));});
  RT.querySelectorAll('[data-prog]').forEach(el=>{const c=p.concepts[+el.dataset.prog]; if(c) el.textContent=L().scored(c.s.filter(v=>v!==null).length);});
  if(S.sel&&S.sel.t==='c'&&S.sel.i>0){ const d=$('dil'); if(d) d.innerHTML=dilHTML(S.sel.i); }
  RT.querySelectorAll('.side .ck[data-vis] .n').forEach((el,i)=>{ if(p.concepts[i]) el.textContent=fmt(avgC(p.concepts[i])); });
}
function dilHTML(ci){
  const t=L(), p=P(), c=p.concepts[ci], ref=p.concepts[0];
  if(!ref.s.some(v=>v!==null)||!c.s.some(v=>v!==null)) return `<p class="muted">${t.noDiff}</p>`;
  const chips=CATS.filter(k=>!S.cats.size||S.cats.has(k)).map(k=>{const a=catAvg(c,k),b=catAvg(ref,k); if(a===null||b===null) return ''; const d=Math.round((a-b)*10)/10; return `<span class="dchip ${d>0?'p':d<0?'n':'z'}">${CAT[k][S.lang].replace(/ ?aspecten| aspects/,'')} ${sgn(d)}</span>`;}).join('');
  const diffs=AX().map(a=>({a,d:(c.s[a.i]!==null&&ref.s[a.i]!==null)?c.s[a.i]-ref.s[a.i]:null})).filter(x=>x.d);
  const up=diffs.filter(x=>x.d>0).sort((x,y)=>y.d-x.d).slice(0,3), dn=diffs.filter(x=>x.d<0).sort((x,y)=>x.d-y.d).slice(0,3);
  const li=(arr,cls)=>arr.map(x=>`<b class="${cls}">${x.d>0?'+':'−'}${Math.abs(x.d)}</b><span>${esc(lbl(x.a))}</span>`).join('');
  return `<div class="dchips">${chips}</div>`+(up.length?`<div class="grp-t">${t.better}</div><div class="dl">${li(up,'p')}</div>`:'')+(dn.length?`<div class="grp-t">${t.worse}</div><div class="dl">${li(dn,'n')}</div>`:'');
}
function renderPop(){
  const pop=$('pop'), t=L(), p=P();
  const gr=$('pgrip');
  if(!S.sel){ pop.hidden=true; gr.hidden=true; S.min=false; $('stage').classList.remove('po','pc'); return; }
  pop.hidden=false; $('stage').classList.add('po'); $('stage').classList.toggle('pc',S.min);
  gr.hidden=false; const gc=S.sel.t==='c'?C(S.sel.i):'transparent'; gr.innerHTML='<svg class="gl" width="10" height="18" viewBox="0 0 10 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 2v14M7 2v14"/></svg>'+I.chev+`<i style="background:${gc}"></i>`; gr.title=(S.min?t.showP:t.hideP)+(S.sideMin&&!S.min&&innerWidth>1000?(S.lang==='nl'?'. Sleep om breder te maken':'. Drag to widen'):''); gr.setAttribute('aria-label',gr.title); gr.setAttribute('aria-expanded',String(!S.min));
  const x=`<button type="button" class="px" data-close="1" aria-label="${t.close}">${I.x}</button>`;
  let h='';
  if(S.sel.t==='c'){
    const i=S.sel.i, c=p.concepts[i], col=C(i);
    const groups=CATS.filter(k=>!S.cats.size||S.cats.has(k)).map(k=>`<div class="grp-t"><span><i class="sq" style="background:${CAT[k].hex}"></i>${CAT[k][S.lang]}</span><b data-cavg="${i}:${k}">${fmt(catAvg(c,k))}</b></div>`+
      A.filter(a=>a.c===k).map(a=>`<div class="arow ${S.hl===a.i?'hl':''}" data-row="${a.i}"><button type="button" class="an" data-asp="${a.i}">${esc(lbl(a))}</button>${pipsHTML(i,a.i)}</div>`).join('')).join('');
    const invs=p.inv.filter(e=>e.el);
    const keeps=invs.length?invs.map(e=>{const on=c.keep.includes(e.id); return `<button type="button" class="kp" data-keep="${e.id}" aria-pressed="${on}" style="--kc:${col}"><span class="bx"></span><span>${esc(e.el)}${on?` <small>(${esc(repTxt(e).t)})</small>`:''}</span></button>`;}).join(''):`<p class="muted">${t.noInv}</p>`;
    h=`<div class="ph"><div><h2 class="cnh"><span id="popT">${esc(cname(c,i))}</span><button type="button" class="pen ${S.editC?'on':''}" data-cedit="1" title="${esc(t.editC)}" aria-label="${esc(t.editC)}" aria-pressed="${!!S.editC}">${I.pen}</button></h2><p class="pm"><span><span data-avg="${i}">${fmt(avgC(c))}</span> ${t.avgL}${S.cats.size?' ('+t.filtered+')':''}</span><span data-prog="${i}">${t.scored(c.s.filter(v=>v!==null).length)}</span></p></div>${x}</div>
      <div class="pb">${S.editC?`<div class="fx"><label for="cName">${t.name}</label><input id="cName" data-cf="name" value="${esc(c.name)}"><label for="cDesc">${t.desc}</label><textarea id="cDesc" data-cf="desc" placeholder="${esc(t.descPh)}">${esc(c.desc)}</textarea></div>${i>0?`<div class="pact" style="padding-top:8px"><button type="button" class="cbtn del" data-rmc="${i}">${t.rmC}</button></div>`:''}`:(c.desc?`<p class="cdesc">${esc(c.desc)}</p>`:'')}
      ${c.src&&c.src.length?`<div class="grp-t">${t.srcT}</div>`+c.src.map(k=>`<button type="button" class="kp srci" data-okitem="${esc(k)}"><span class="dot"></span><span>${esc(window.OK&&OK.itemName?OK.itemName(k):k)}</span></button>`).join(''):''}
      ${groups}
      <div class="grp-t">${t.keep}</div>${keeps}
      ${i>0?`<div class="grp-t">${t.vsRef}</div><div id="dil">${dilHTML(i)}</div>`:''}</div>`;
  }
  if(S.sel.t==='a'){
    const a=A[S.sel.i];
    h=`<div class="ph"><div><div class="eb" style="color:${CAT[a.c].t}">${CAT[a.c][S.lang]}</div><h2>${esc(lbl(a))}</h2><p>${esc(S.lang==='nl'?a.hnl:a.hen)}</p></div>${x}</div>
      <div class="pb">${window.OK&&OK.openFor?`<div class="pact" style="padding-top:2px"><button type="button" class="cbtn pri" data-okfor="${a.i}">${I.house} ${t.toOK}</button></div>`:''}<div class="grp-t">${t.aspScores}</div>`+p.concepts.map((c,ci)=>`<div class="arow"><span class="cn"><i style="background:${C(ci)}"></i><span>${esc(cname(c,ci))}</span></span>${pipsHTML(ci,a.i)}</div>`).join('')+
      `<div class="fx" style="padding-top:14px"><label for="aNote">${t.note}</label><textarea id="aNote" data-nt="${a.i}" placeholder="${esc(t.notePh)}">${esc(p.notes[a.i]||'')}</textarea></div></div>`;
  }
  if(S.sel.t==='inv'){
    const rows=p.inv.map(el=>{const r=repTxt(el); return `<div class="inv" data-id="${el.id}"><div class="r1"><input data-f="el" value="${esc(el.el)}" placeholder="${esc(t.elPh)}" aria-label="${esc(t.elPh)}"><button type="button" class="px" data-rm="${el.id}" aria-label="×">${I.x}</button></div>
      <div class="r2">${t.rem} <input data-f="rem" type="number" min="0" value="${esc(el.rem)}" aria-label="${t.rem}"> ${t.yr}&ensp;${t.life} <input data-f="life" type="number" min="1" value="${esc(el.life)}" aria-label="${t.life}"> ${t.yr}<span class="rep ${r.k}">${esc(r.t)}</span></div></div>`;}).join('');
    h=`<div class="ph"><div><div class="eb">${t.hz}: ${p.horizon} ${t.years}</div><h2>${t.invT}</h2><p>${t.invS}</p></div>${x}</div>
      <div class="pb">${rows}<div class="pact" style="padding-top:12px"><button type="button" class="cbtn" id="addEl">${t.addEl}</button></div></div>`;
  }
  const st=pop.scrollTop; pop.innerHTML=h; pop.scrollTop=st;
}
function markRows(){ RT.querySelectorAll('.arow[data-row]').forEach(r=>r.classList.toggle('hl',+r.dataset.row===S.hl)); }
const KW=[
 ['material','reuse','overdimension','second life','repurpose'],
 ['biobased','low-impact','recycled','renewable','natural refrigerant'],
 ['reuse','disassembl','detachable','dismantl','take-back','standardi'],
 ['energy','insulat','heat recovery','efficien','airtight'],
 ['robust','wear','failure','lifespan','premature'],
 ['disassembl','detachable','dismantl','compression connection','dry underfloor'],
 ['modul','standardi','cascade','adaptive','adaptable'],
 ['critical raw','permanent magnet','three-phase','local control'],
 ['transport','take-back'],
 ['comfort','shad','cooling load','insulat','airtight','thermal bridge'],
 ['noise','acoustic'],
 ['air quality','ventilation','co2','filter'],
 ['as a service','rented','overdimension','second-hand','cost'],
 ['energy','heat recovery','insulat','smart control','weather'],
 ['maintenance','predictive','repair','cost'],
 ['maintenance','repair','clean','dismantling','instructions','product passport'],
 ['user','controllab','thermostat','interaction'],
 ['warranty','software support']];
function addConcept(pl){
  const t=L(), p=P(), n=p.concepts.length; if(n>=MAXC){ toast(t.maxC); return false; }
  const names=pl.items.map(k=>window.OK&&OK.itemName?OK.itemName(k):k);
  p.concepts.push({id:nid(),name:t.altName(n),desc:t.fromOK(names.length),keep:[],vis:true,s:Array(N).fill(null),src:pl.items.slice()});
  touch(); S.sel={t:'c',i:n}; S.min=false; S.view='radar'; save(); renderAll(); toast(t.addedC); return true;
}
function openSel(sel){ S.editC=false; const same=S.sel&&sel&&S.sel.t===sel.t&&S.sel.i===sel.i; S.sel=same&&!S.min?null:sel; S.min=false; if(S.sel&&S.sel.t==='c') P().concepts[S.sel.i].vis=true; $('pop').scrollTop=0; renderChips(); renderSide(); renderPop(); drawRadar(); }
function closePop(){ if(!S.sel) return; S.sel=null; renderChips(); renderPop(); drawRadar(); }

/* ---------- table view ---------- */
function aspDrop(){
  const t=L(), sel=CATS.filter(k=>S.cats.has(k));
  const lab=!sel.length?t.allA:sel.length===1?CAT[sel[0]][S.lang]:sel.length+' '+t.catsN;
  const items=CATS.map(k=>`<button type="button" class="fi" data-cat="${k}" aria-pressed="${S.cats.has(k)}"><span class="bx"></span><i style="background:${CAT[k].hex}"></i><span class="fl">${CAT[k][S.lang]}</span><span class="fn">${A.filter(a=>a.c===k).length}</span></button>`).join('');
  return `<div class="adrop"><span class="al">${t.aspects}</span><button type="button" class="ddb ${sel.length?'act':''}" id="aspB" data-aspdd="1" aria-expanded="${S.aspOpen}"><span>${esc(lab)}</span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg></button><div class="ddm am" ${S.aspOpen?'':'hidden'}>${items}${sel.length?`<hr><button type="button" class="fi clr" data-catclr="1">${t.allA}</button>`:''}</div></div>`;
}
function renderTable(){
  const tb=$('tbl'), t=L(), p=P();
  $('stage').classList.toggle('tv',S.view==='table');
  if(S.view!=='table'){ tb.hidden=true; return; }
  tb.hidden=false;
  const cats=CATS.filter(k=>!S.cats.size||S.cats.has(k));
  const VC=p.concepts.map((c,i)=>[c,i]).filter(([c])=>c.vis);
  const W=250+VC.length*200, colg=`<colgroup><col style="width:250px">${VC.map(()=>'<col style="width:200px">').join('')}</colgroup>`;
  let h=`<div class="tbh"><div><h2>${t.tblT}</h2><p>${t.tblS}</p></div><button type="button" class="cbtn" data-view="radar">${I.radar} ${t.back}</button></div>
   <div class="thd" id="thd"><table class="cmp" style="width:${W}px">${colg}<thead><tr><th class="a ah">${aspDrop()}</th>`+VC.map(([c,i])=>`<th class="ch"><button type="button" class="nm" data-c="${i}"><i style="background:${C(i)}"></i>${esc(cname(c,i))}</button><div class="ds">${esc(c.desc)}</div><div class="av" style="color:${C(i)}"><span data-avg="${i}">${fmt(avgC(c))}</span><small>${t.avgL}</small></div></th>`).join('')+`</tr></thead></table></div>
   <div class="tsc" id="tsc"><table class="cmp" style="width:${W}px">${colg}<tbody>`;
  cats.forEach(k=>{
    h+=`<tr class="cat"><td class="a"><span style="background:${CAT[k].hex};color:${CAT[k].t}">${CAT[k][S.lang]}</span></td>`+VC.map(([c,i])=>`<td><span class="cv" data-cavg="${i}:${k}">${fmt(catAvg(c,k))}</span></td>`).join('')+`</tr>`;
    A.filter(a=>a.c===k).forEach(a=>{ h+=`<tr class="r"><td class="a"><button type="button" class="an" data-asp="${a.i}"><span class="nb" style="background:${CAT[k].hex};color:${CAT[k].t}">${a.i+1}</span>${esc(lbl(a))}</button></td>`+VC.map(([c,i])=>`<td>${pipsHTML(i,a.i)}</td>`).join('')+`</tr>`; });
  });
  h+=`</tbody><tfoot><tr><td class="a">${t.avg}</td>`+VC.map(([c,i])=>`<td style="color:${C(i)}" data-avg="${i}">${fmt(avgC(c))}</td>`).join('')+`</tr></tfoot></table></div>`;
  const o=$('tsc'), sl=o?o.scrollLeft:0, st=o?o.scrollTop:0; tb.innerHTML=h;
  const n=$('tsc'), hd=$('thd'); n.scrollLeft=sl; n.scrollTop=st; hd.scrollLeft=sl;
  n.addEventListener('scroll',()=>{ hd.scrollLeft=n.scrollLeft; placeAsp(); },{passive:true});
  // the aspect menu lives on the table layer so the header's clipping does not cut it off
  const m=tb.querySelector('.adrop .ddm'); if(m){ tb.appendChild(m); m.classList.add('am2'); placeAsp(); }
}
function placeAsp(){ const m=RT.querySelector('#tbl .am2'), b=$('aspB'); if(!m||!b) return; const tr=$('tbl').getBoundingClientRect(), r=b.getBoundingClientRect(); m.style.left=(r.left-tr.left)+'px'; m.style.top=(r.bottom-tr.top+6)+'px'; }

function renderAll(){ if(S.sel&&S.sel.t==='c'&&S.sel.i>=P().concepts.length) S.sel=null; renderStatic(); applySide(); renderSide(); renderChips(); drawRadar(); renderPop(); renderTable(); }

/* ---------- events ---------- */
let pending=null;
function ask(msg,fn){ pending=fn; const t=L(); $('confirm').innerHTML=`<div class="confirm" role="alert"><span>${esc(msg)}</span><button class="cbtn pri" type="button" data-ok="1">${t.yes}</button><button class="cbtn" type="button" data-ok="0">${t.no}</button></div>`; }
function closeFile(){ $('fileM').hidden=true; $('fileB').setAttribute('aria-expanded','false'); }
/* panel width: drag the grip to widen the panel, only while Instellingen is folded */
let PW=340, gDrag=null, gMoved=false;
function setPW(w){ PW=w; $('stage').style.setProperty('--pw',w+'px'); }
function pwMax(){ return Math.max(340,Math.min(760,Math.round($('stage').getBoundingClientRect().width*0.62))); }
const GRP=$('pgrip');
GRP.addEventListener('pointerdown',e=>{ gMoved=false; if(!(S.sideMin&&S.sel&&!S.min&&innerWidth>1000)) return; gDrag={x:e.clientX,w:PW}; GRP.setPointerCapture(e.pointerId); });
GRP.addEventListener('pointermove',e=>{ if(!gDrag) return; const dx=gDrag.x-e.clientX; if(!gMoved&&Math.abs(dx)<4) return; if(!gMoved){ gMoved=true; $('stage').classList.add('rzing'); } setPW(Math.max(340,Math.min(pwMax(),gDrag.w+dx))); });
const gEnd=()=>{ if(gDrag&&gMoved) $('stage').classList.remove('rzing'); gDrag=null; };
GRP.addEventListener('pointerup',gEnd); GRP.addEventListener('pointercancel',gEnd);
RT.addEventListener('click',e=>{
  const b=e.target.closest('button'); if(!e.target.closest('.dd')) closeFile();
  if(S.aspOpen&&!e.target.closest('.adrop')&&!e.target.closest('.am2')){ S.aspOpen=false; const m=RT.querySelector('#tbl .am2'); if(m) m.hidden=true; $('aspB')?.setAttribute('aria-expanded','false'); }
  if(e.target.id==='modal'){ $('modal').hidden=true; return; }
  if(!b) return; const p=P(), t=L(), d=b.dataset;
  if(d.aspdd){ S.aspOpen=!S.aspOpen; renderTable(); return; }
  if(b.id==='lang'){S.lang=S.lang==='nl'?'en':'nl'; save(); renderAll(); if(window.OK) OK.setLang(S.lang); if(window.UH) UH.sync('ev'); return;}
  if(b.id==='infoB'){ $('modal').innerHTML=`<div class="mbox" role="dialog" aria-modal="true" aria-labelledby="mT"><div class="ph"><div>${t.infoE?`<div class="eb">${t.infoE}</div>`:''}<h2 id="mT">${t.infoT}</h2></div><button type="button" class="px" data-mclose="1" aria-label="${t.close}">${I.x}</button></div><div class="mb">${t.infoB}</div></div>`; $('modal').hidden=false; return; }
  if(d.mclose){ $('modal').hidden=true; return; }
  if(b.id==='fileB'){ const m=$('fileM'); m.hidden=!m.hidden; b.setAttribute('aria-expanded',!m.hidden); return; }
  if(d.f){ closeFile(); const f=d.f;
    if(f==='new') return ask(t.cNew,()=>{S.P=blank(); S.sel=null; save(); renderAll();});
    if(f==='ex') return ask(t.cEx,()=>{S.P=example(); S.sel=null; save(); renderAll();});
    if(f==='open') return $('file').click();
    return doExport(f); }
  if(d.ok!==undefined){ const fn=pending; pending=null; $('confirm').innerHTML=''; if(d.ok==='1'&&fn) fn(); return; }
  if(d.view){ S.view=d.view; save(); renderStatic(); renderTable(); if(S.view==='radar') drawRadar(); return; }
  if(b.id==='pgrip'){ if(gMoved){ gMoved=false; return; } S.min=!S.min; renderPop(); return; }
  if(d.close){ closePop(); return; }
  if(d.c!==undefined){ if(S.view==='table'){S.view='radar'; save(); renderStatic(); renderTable();} openSel({t:'c',i:+d.c}); return; }
  if(d.asp!==undefined){ if(S.view==='table'){S.view='radar'; save(); renderStatic(); renderTable();} openSel({t:'a',i:+d.asp}); return; }
  if(d.fold){ S.sideMin=true; applySide(); save(); if(window.OK&&OK.setSide) OK.setSide(true); return; }
  if(d.unfold){ S.sideMin=false; applySide(); save(); if(window.OK&&OK.setSide) OK.setSide(false); return; }
  if(d.okfor!==undefined){ if(window.OK&&OK.openFor){ const i=+d.okfor; OK.openFor(lbl(A[i]),KW[i]); if(window.UH&&UH.show) UH.show('ok'); } return; }
  if(d.okitem){ if(window.OK&&OK.openItem) OK.openItem(d.okitem); return; }
  if(d.cedit){ S.editC=!S.editC; renderPop(); if(S.editC) setTimeout(()=>$('cName')?.focus(),20); return; }
  if(d.inv){ openSel({t:'inv',i:0}); return; }
  if(d.hz){ p.horizon=+d.hz; touch(); renderSide(); renderPop(); return; }
  if(d.vis!==undefined){ const c=p.concepts[+d.vis]; c.vis=!c.vis; if(!c.vis&&S.sel&&S.sel.t==='c'&&S.sel.i===+d.vis) S.sel=null; save(); renderSide(); renderChips(); drawRadar(); renderPop(); renderTable(); return; }
  if(d.cat){ S.cats.has(d.cat)?S.cats.delete(d.cat):S.cats.add(d.cat); if(S.cats.size===CATS.length) S.cats.clear(); if(S.sel&&S.sel.t==='a'&&S.cats.size&&!S.cats.has(A[S.sel.i].c)) S.sel=null; save(); renderAll(); return; }
  if(d.catclr){ S.cats.clear(); save(); renderAll(); return; }
  if(d.add){ const n=p.concepts.length; p.concepts.push({id:nid(),name:t.altName(n),desc:'',keep:[],vis:true,s:Array(N).fill(null)}); touch(); S.sel={t:'c',i:n}; S.view='radar'; renderAll(); setTimeout(()=>$('cName')?.select(),30); return; }
  if(d.rmc){ const i=+d.rmc; ask(t.rmC+': '+cname(p.concepts[i],i)+'?',()=>{ p.concepts.splice(i,1); S.sel=null; touch(); renderAll(); }); return; }
  if(b.classList.contains('pip')){ const w=b.closest('.pips'), ci=+w.dataset.pc, ai=+w.dataset.pa, v=+b.dataset.v, c=p.concepts[ci]; c.s[ai]=c.s[ai]===v?null:v; touch(); updPips(ci,ai); RT.querySelector(`.pips[data-pc="${ci}"][data-pa="${ai}"] [data-v="${v}"]`)?.focus(); updHead(); drawRadar(); return; }
  if(d.keep){ const c=p.concepts[S.sel.i]; c.keep=c.keep.includes(d.keep)?c.keep.filter(x=>x!==d.keep):[...c.keep,d.keep]; touch(); renderPop(); return; }
  if(d.invx){ S.invOpen.has(d.invx)?S.invOpen.delete(d.invx):S.invOpen.add(d.invx); renderSide(); return; }
  if(b.id==='addEl'){ const ni={id:nid(),el:'',rem:'',life:''}; p.inv.push(ni); S.invOpen.add(ni.id); touch(); renderPop(); renderSide(); const ins=RT.querySelectorAll('#side .inv input[data-f="el"]'); ins[ins.length-1]?.focus(); return; }
  if(d.rm){ p.inv=p.inv.filter(x=>x.id!==d.rm); p.concepts.forEach(c=>c.keep=c.keep.filter(k=>k!==d.rm)); touch(); renderPop(); renderSide(); return; }
});
RT.addEventListener('keydown',e=>{ if(e.key==='Escape'){ if(!$('modal').hidden){$('modal').hidden=true;return;} closeFile(); if(S.view==='table'){S.view='radar'; save(); renderStatic(); renderTable(); drawRadar(); return;} closePop(); } });
RT.addEventListener('input',e=>{
  const el=e.target, p=P(), d=el.dataset;
  if(el.id==='pn'){ p.name=el.value; touch(); return; }
  if(el.id==='hz'){ const v=parseInt(el.value,10); if(v>0&&v<=200){ p.horizon=v; touch(); RT.querySelectorAll('.pill[data-hz]').forEach(x=>x.classList.toggle('on',+x.dataset.hz===v)); refreshInvText(); } return; }
  if(d.f){ const id=el.closest('.inv').dataset.id, it=p.inv.find(x=>x.id===id); it[d.f]=el.type==='number'?(el.value===''?'':+el.value):el.value; touch(); const r=(el.closest('#side')?sideRep:repTxt)(it), sp=el.closest('.inv').querySelector('.rep'); sp.textContent=r.t; sp.className='rep '+r.k; const row=el.closest('.inv'), rs=row.querySelector('.rs'), nm=row.querySelector('.ivh .nm'); if(rs){ const q=shortRep(it); rs.textContent=q.t; rs.className='rs '+q.k; } if(nm&&d.f==='el') nm.innerHTML=esc(it.el)||'<i>'+esc(L().elPh)+'</i>'; if(S.sel&&S.sel.t==='c'&&d.f==='el'||d.f!=='el'&&S.sel&&S.sel.t==='c') renderPop(); return; }
  if(d.cf){ const i=S.sel.i, c=p.concepts[i]; c[d.cf]=el.value; touch(); if(d.cf==='name'){ $('popT').textContent=cname(c,i); renderChips(); refreshInvSide(true); } return; }
  if(d.nt!==undefined){ const i=+d.nt; if(el.value) p.notes[i]=el.value; else delete p.notes[i]; touch(); return; }
});
function refreshInvText(){ const h=$('hz'); const st=h&&RT.activeElement===h; const pos=st?h.selectionStart:null; renderSide(); if(st){const n=$('hz'); n.focus(); try{n.setSelectionRange(pos,pos);}catch(e){}} renderPop(); }
function refreshInvSide(){ const a=RT.activeElement, id=a&&a.id; if(id==='hz') return; renderSide(); }
$('file').addEventListener('change',async e=>{
  const f=e.target.files[0]; e.target.value=''; if(!f) return;
  try{ const dta=JSON.parse(await f.text()); const p=dta.P||dta; if(!valid(p)) throw 0; p.concepts.forEach(c=>{c.keep=c.keep||[]; c.vis=c.vis!==false;}); p.notes=p.notes||{}; p.example=false; S.P=p; S.sel=null; save(); renderAll(); toast(L().tOpened); }catch(err){ toast(L().tBad); }
});

/* ---------- export ---------- */
const slug=()=>(P().name||'evaluatie').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,60)||'evaluatie';
function wrapText(s,max){const w=String(s||'').split(/\s+/), out=[]; let l=''; w.forEach(x=>{ if((l+' '+x).trim().length>max){ if(l) out.push(l); l=x; } else l=(l+' '+x).trim(); }); if(l) out.push(l); return out;}
function exportSVG(){
  const t=L(), p=P(), font="Poppins, 'Segoe UI', Arial, sans-serif", W=1400;
  const inner=radarSVG({mode:'full',font,forExport:true});
  let lg='', y=150; const lx=900;
  p.concepts.forEach((c,i)=>{ if(!c.vis) return; const col=C(i);
    lg+=`<rect x="${lx}" y="${y-13}" width="22" height="22" rx="3" fill="${col}" fill-opacity=".25" stroke="${col}" stroke-width="1.6" ${i?'stroke-dasharray="3 3"':''}/>`;
    lg+=`<text x="${lx+36}" y="${y+4}" font-size="16" font-weight="600" fill="#252422" font-family="${font}">${esc(cname(c,i))} <tspan dx="10" font-weight="400" fill="#7d776d">${fmt(avgC(c))}</tspan></text>`;
    y+=24; wrapText(c.desc,58).slice(0,5).forEach(l=>{ lg+=`<text x="${lx+36}" y="${y}" font-size="13" fill="#4f4b45" font-family="${font}">${esc(l)}</text>`; y+=19; }); y+=22; });
  const cs=CATS.filter(k=>!S.cats.size||S.cats.has(k));
  y+=6; cs.forEach((k,j)=>{ lg+=`<rect x="${lx}" y="${y+j*26-12}" width="16" height="16" rx="2" fill="${CAT[k].hex}"/><text x="${lx+26}" y="${y+j*26+1}" font-size="13" fill="#4f4b45" font-family="${font}">${CAT[k][S.lang]}</text>`; });
  const H=Math.max(880,y+cs.length*26+40);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" fill="#ffffff"/>
   <text x="48" y="62" font-size="26" font-weight="600" fill="#252422" font-family="${font}">${esc(p.name||t.vRadar)}</text>
   <text x="48" y="92" font-size="15" fill="#7d776d" font-family="${font}">${t.horizonL}: ${p.horizon} ${t.years}</text>
   <text x="${W-48}" y="62" text-anchor="end" font-size="14" fill="#7d776d" font-family="${font}">${t.pname}</text>
   <svg x="30" y="116" width="${G.w*1.12}" height="${G.h*1.12}" viewBox="0 0 ${G.w} ${G.h}">${inner}</svg>${lg}</svg>`;
}
function csv(){
  const t=L(), p=P(), q=v=>{const s=String(v??''); return /[";\n]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s;};
  const rows=[[...t.csvH,...p.concepts.map((c,i)=>cname(c,i)),t.note]];
  A.forEach(a=>rows.push([a.i+1,CAT[a.c][S.lang],lbl(a),...p.concepts.map(c=>c.s[a.i]??''),p.notes[a.i]||'']));
  const f2=v=>v===null?'':(S.lang==='nl'?v.toFixed(2).replace('.',','):v.toFixed(2));
  rows.push(['','',t.avg,...p.concepts.map(c=>f2(avgOf(c.s))),'']);
  rows.push([]); rows.push([t.project,p.name||'']); rows.push([t.horizonL,p.horizon+' '+t.years]);
  rows.push([]); rows.push([t.inv,t.rem+' ('+t.years+')',t.life+' ('+t.years+')','']); p.inv.filter(e=>e.el).forEach(e=>rows.push([e.el,e.rem,e.life,repTxt(e).t]));
  rows.push([]); p.concepts.forEach((c,i)=>rows.push([cname(c,i),c.desc,t.keep+': '+p.inv.filter(e=>c.keep.includes(e.id)&&e.el).map(e=>e.el).join(', ')]));
  return '﻿'+rows.map(r=>r.map(q).join(';')).join('\r\n');
}
function svgToPng(svg){ return new Promise((res,rej)=>{const img=new Image(); img.onload=()=>{const c=document.createElement('canvas'); c.width=img.width*2; c.height=img.height*2; const x=c.getContext('2d'); x.scale(2,2); x.drawImage(img,0,0); c.toBlob(b=>b?res(b):rej(),'image/png');}; img.onerror=rej; img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);}); }
let DL; const dlP=(async()=>{ try{ DL=window.claude?.use?await window.claude.use('downloads'):null; }catch(e){DL=null;} return DL; })();
async function doExport(k){
  const t=L(), base=slug(); let filename, data;
  try{
    if(k==='png'){filename=base+'-radardiagram.png'; data=await svgToPng(exportSVG());}
    if(k==='svg'){filename=base+'-radardiagram.svg'; data=exportSVG();}
    if(k==='csv'){filename=base+'-scores.csv'; data=csv();}
    if(k==='json'){filename=base+'.json'; data=JSON.stringify({tool:'circular-hvac-evaluatiekader',version:1,P:P()},null,2);}
  }catch(e){ toast(t.tNoDl); return; }
  const dl=DL!==undefined?DL:await Promise.race([dlP,new Promise(r=>setTimeout(()=>r(null),1500))]);
  if(dl&&dl.save){ try{ await dl.save({filename,data}); toast(t.tSaved+': '+filename); }catch(err){ toast(err&&err.code==='declined'?t.tDeclined:t.tNoDl); } return; }
  try{ const blob=data instanceof Blob?data:new Blob([data],{type:'application/octet-stream'}); const u=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=u; a.download=filename; document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(u),2000); }catch(e){ toast(t.tNoDl); }
}
let toastT=0; function toast(m){const e=$('toast'); e.textContent=m; e.classList.add('on'); clearTimeout(toastT); toastT=setTimeout(()=>e.classList.remove('on'),2600);}

window.EV={addConcept:pl=>addConcept(pl),radar:()=>`<svg viewBox="0 0 ${G.w} ${G.h}" role="img" aria-hidden="true">${radarSVG({mode:'num',forExport:true})}</svg>`,side:()=>!!S.sideMin,setSide:v=>{ if(!!S.sideMin!==!!v){ S.sideMin=!!v; applySide(); save(); } },lang:()=>S.lang,setLang:l=>{ if(S.lang!==l){ S.lang=l; save(); renderAll(); } },h1:()=>L().h1,name:()=>L().pname,refresh:()=>{ drawRadar(); renderTable(); }};
renderAll();
})();
