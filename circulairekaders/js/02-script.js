(function(){
const DATA=window.CHVAC_DATA;
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const I={
 heating:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2.2 1.2-3.6 2.4-4.6.3 1.8 1.1 2.8 2.1 3.3C11 9 11 6 12 3z"/></svg>',
 cooling:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 2v20M3.3 7l17.4 10M3.3 17L20.7 7M9 4l3 2 3-2M9 20l3-2 3 2"/></svg>',
 ventilation:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M3 8h11a3 3 0 1 0-3-3M3 12h16a3 3 0 1 1-3 3M3 16h7"/></svg>',
 m:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z M12 12l8-4.5M12 12v9M12 12L4 7.5"/></svg>',
 e:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M13 2L4 14h7l-1 8 9-12h-7z"/></svg>',
 r:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M3 11l9-7 9 7M5 9.5V21h14V9.5M10 21v-6h4v6"/></svg>',
 c:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M5 21V4h10v17M15 9h4v12M3 21h18M8 7h1M11 7h1M8 10.5h1M11 10.5h1M8 14h1M11 14h1"/></svg>',
 arrow:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
 chev:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>',
 plus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
 cube:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9zM12 12l8-4.5M12 12v9M12 12L4 7.5"/></svg>',
 check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>',
 back:'<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg>',
 doc:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/></svg>'
};
const RN={context:'I',building:'II',system:'III',product:'IV',component:'V'};
const RS=['reconsider','reuse','repair_on','repair_off','repurpose'];
const HK=['ctx','bld','gen','dist','term','ctrl','gnl'];

const T={
 nl:{
  search:'Waar ben je naar op zoek?',clear:'Zoekopdracht wissen',close:'Sluiten',langBtn:'en',langTitle:'English',
  h1:'Ontdek circulaire interventies<br><em>voor klimaatinstallaties</em>',
  lead:'Kies een gebouwtype en een installatiefunctie. Klik daarna op een punt in de doorsnede om te zien welke circulaire interventies daar mogelijk zijn.',
  step1:'Kies een gebouw',step2:'Kies een functie',
  B:{r:['Woningbouw','Rijwoning of appartement'],c:['Utiliteitsbouw','Kantoorgebouw']},
  building:'Gebouw',func:'Functie',filters:'Filters',reset:'Filters herstellen',
  FN:{heating:'Verwarming',cooling:'Koeling',ventilation:'Ventilatie'},
  LV:{context:'Contextniveau',building:'Gebouwniveau',system:'Systeemniveau',product:'Productniveau',component:'Componentniveau'},
  AP:{c:'Utiliteitsbouw',r:'Woningbouw'},
  GO:{m:'Materiaalreductie',e:'Energiereductie'},
  ST:{reconsider:'Heroverwegen',reuse:'Hergebruiken',repair_on:'Repareren of reviseren op locatie',repair_off:'Repareren, reviseren of herfabriceren elders',repurpose:'Herbestemmen',d_context:'Contextniveau',d_building:'Gebouwniveau',g_design:'Algemene ontwerprichtlijnen',g_org:'Organisatorische maatregelen'},
  CO:{gen:'Opwekking',dist:'Distributie',term:'Afgifte',ctrl:'Regeling',gen_all:'Algemeen'},
  H:{ctx:['Omgeving','Schaduw, groen en zon rond het gebouw'],bld:['Gebouwschil','Isolatie, glas, zonwering en indeling'],gen:['Opwekking','Warmtepomp, ketel, WTW-unit of LBK'],dist:['Distributie','Leidingen, kanalen en pompen'],term:['Afgifte','Radiatoren, vloer, klimaatplafond en roosters'],ctrl:['Regeling','Thermostaten, sensoren en software'],gnl:['Algemeen','Ontwerprichtlijnen en afspraken met leveranciers']},
  pickF:'Kies hierboven verwarming, koeling of ventilatie om de klikbare punten te zien.',
  pickH:'Klik op een gele + of direct op een onderdeel in het gebouw om de maatregelen te zien.',
  hint:'Klik op een punt',drag:'Sleep om te draaien, scroll of knijp om te zoomen',fxTip:'Beweeg of klik om dit in het gebouw te zien',v3d:'3D-gebouw',vtab:'Tabel',allB:'Alle',allF:'Alle functies',toTable:'Of bekijk de volledige tabel',more:'Meer details',capF:'Kies verwarming, koeling of ventilatie om de punten in het gebouw te zien.',capH:'Klik op een + of op een onderdeel. Sleep om te draaien, scroll om te zoomen.',capP:'Beweeg over een maatregel om hem in het gebouw te zien. Klik om hem vast te zetten.',rStrat:'R-strategie',level:'Niveau',allCols:'Alle',pg:{systems:'Circulaire systemen',demand:'Installatiebehoefte beperken',guidelines:'Algemene richtlijnen'},fxSeen:'Zichtbaar in het gebouw',apply:'Toepassen',applied:'Toegepast',design:'Mijn ontwerp',clearAll:'Alles wissen',toastOn:'Toegepast in het gebouw',toastAdd:'Toegevoegd aan je selectie',toastOff:'Verwijderd uit je selectie',designSub:'gekozen maatregelen',designEmpty:'Nog geen maatregelen gekozen. Klik op de + naast een maatregel om hem aan je selectie toe te voegen.',info:'info',infoT:'Over dit ontwerpkader',
  fnote:'Kies eerst een <b>functie</b> in het filtervak om de punten in het gebouw te zien',
  gNote:'Algemene ontwerprichtlijnen en organisatorische maatregelen gelden voor alle gebouwen, functies en schaalniveaus. Je ziet ze daarom altijd allemaal, zonder filters.',
  IN:{lead:'Deze website biedt informatie over hoe klimaatinstallaties op een meer circulaire manier kunnen worden ontworpen. De informatie wordt op verschillende abstractie- en schaalniveaus aangeboden, zodat deze voor verschillende gebruikers relevante inzichten biedt, zoals installatieadviseurs, HVAC-fabrikanten, architecten en vastgoedeigenaren.',
   h1:'Wat vind je hier?',p1:'De website biedt zowel algemene richtlijnen voor een meer circulair ontwerp als specifieke maatregelen om de vraag naar HVAC-systemen te verminderen en om HVAC-systemen zelf meer circulair te maken.',
   types:{guidelines:'Algemene richtlijnen voor een meer circulair ontwerp, plus organisatorische maatregelen.',demand:'Maatregelen op gebouw- en contextniveau die de vraag naar klimaatinstallaties verminderen.',systems:'Maatregelen die de installatie zelf circulairder maken, volgens de R-strategieën.'},go:'Bekijk in de tabel',
   h2:'Systeemonderdelen: het FODAR-principe',p2:'Strategieën kunnen worden gefilterd op basis van verschillende systeemonderdelen, volgens het FODAR-principe. Hierbij worden de systeemonderdelen onderverdeeld in vier categorieën: opwekkingsapparaten, distributiesystemen, afgiftesystemen en regelsystemen. Deze categorieën kunnen verder worden uitgesplitst naar de functies verwarming, koeling en ventilatie.',
   fodar:[['F','Functie',['Verwarming','Koeling','Ventilatie']],['O','Opwekking',['Warmtepomp','Gasketel','Koelmachine']],['D','Distributie',['Leidingen','Pompen','Luchtkanalen']],['A','Afgifte',['Radiatoren','Vloerverwarming','Ventilatieroosters']],['R','Regeling',['Thermostaten','Sensoren','Gebouwautomatisering']]],
   h3:'Schaalniveaus',p3:'Daarnaast kunnen bij het circulair ontwerpen van HVAC-systemen verschillende schaalniveaus worden beschouwd: het systeem-, product- en componentniveau, maar ook een breder perspectief waarbij gekeken wordt naar het gebouw en de omgeving.',
   lvx:{context:['Zonnestraling','Groene omgeving','Schaduw'],building:['Isolatie','Oriëntatie en indeling','Zonwering'],system:['Samenstelling van installatieproducten'],product:['Bijv. een warmtepomp, ventilatiekanaal of radiator'],component:['Onderdelen in producten, bijv. een motor']},
   h4:'Voor wie?',p4:'Welk schaalniveau het meest relevant is, verschilt per gebruiker.',
   who:[['Installatieadviseurs','naar verwachting vooral het systeem- en productniveau.',['system','product']],['HVAC-fabrikanten','met name het componentniveau.',['component']],['Architecten','waarschijnlijk het gebouw- en contextniveau.',['building','context']],['Vastgoedeigenaren','alle schaalniveaus kunnen relevant zijn.',['*']]],
   src:'De gegevens in dit overzicht zijn verzameld door middel van interviews met experts met kennis en ervaring op het gebied van HVAC en de circulaire economie. Het overzicht wordt regelmatig bijgewerkt.'},cart:'Selectie',cartEb:'Ontwerpkader circulaire klimaatinstallaties',name:'Ontwerpkader circulaire klimaatinstallaties',add:'Toevoegen aan selectie',added:'In je selectie',addAria:'Toevoegen aan mijn selectie',rmAria:'Verwijderen uit mijn selectie',csv:'Download CSV',print:'Opslaan als PDF',toConcept:'Maak er een concept van',busy:'PDF maken…',pdfName:'mijn-selectie-circulaire-klimaatinstallaties.pdf',pg2:'Pagina',fTitle:'Filter',foldF:'Filter inklappen',hideP:'Paneel naar rechts schuiven',showP:'Paneel tonen',clearF:'Wissen',view:'Weergave',kCt:'Categorie',csvH:['Maatregel','Categorie','R-strategie / niveau','Component','Functie','Schaalniveau','Toepassing','Doel','Waarom dit helpt','Aandachtspunt','BREEAM-NL'],none:'Geen interventies bij deze filters.',
  allParts:'Alle onderdelen',interventions:'interventies',results:'Zoekresultaten',noResults:'Geen interventies gevonden.',
  tagM:'materiaal',tagE:'energie',lgLv:'schaalniveau',lgW:'bekend neveneffect',
  why:'Waarom dit helpt',watch:'Aandachtspunt',brIh:'BREEAM-NL',brIp:'BREEAM-NL is de Nederlandse beoordelingsmethode voor de duurzaamheid van gebouwen, beheerd door Dutch Green Building Council. Een gebouw verdient punten met credits in categorieën als energie, gezondheid en materialen. Het totaal bepaalt het certificeringsniveau, van Pass tot Outstanding. Er zijn aparte schema’s voor nieuwbouw en renovatie en voor bestaande gebouwen in gebruik (In-Use). Zet de knop BREEAM-NL aan om bij elke interventie te zien aan welke credits ze kan bijdragen. Dat is indicatief: of een credit wordt toegekend, bepaalt de assessor.',brT:'Relatie met BREEAM-NL',brOn:'Toon de relatie met BREEAM-NL',brOff:'Verberg de relatie met BREEAM-NL',brNone:'Geen directe relatie met BREEAM-NL gevonden.',brNote:'Indicatief: de interventie kan bijdragen aan deze credits. Of een credit wordt toegekend, bepaalt de assessor.',brNb:'Nieuwbouw en renovatie',brIu:'In-Use',brSel:'Bijdrage aan BREEAM-NL',brSelS:'Credits waaraan je selectie mogelijk bijdraagt (aantal interventies)',brCsv:'BREEAM-NL',noWhy:'Nog niet beschreven in het kader.',noNeg:'Geen neveneffecten genoemd in de interviews. Dat betekent niet dat ze er niet zijn.',
  kFn:'Functie',kLv:'Schaalniveau',kCo:'Component',kSt:'R-strategie',kCat:'Categorie',kAp:'Toepassing',kGo:'Doel',notSpec:'Niet gespecificeerd',and:' en ',
  rooms:{r:['Zolder','Slaapkamer','Woonkamer'],c:['Kantoorvloer']},
  src:'Interventies verzameld in zeven semigestructureerde interviews met acht installatieprofessionals en geordend met een analytisch model van R-strategieën (Potting, 2017), FODAR-componenten en schaalniveaus. Effectiviteit en neveneffecten zijn nog niet per project geëvalueerd. Ontwikkeld door TU Delft en Dutch Green Building Council.'
 },
 en:{
  search:'What are you looking for?',clear:'Clear search',close:'Close',langBtn:'nl',langTitle:'Nederlands',
  h1:'Explore circular interventions<br><em>for HVAC systems</em>',
  lead:'Choose a building type and an HVAC function. Then click a point in the cross-section to see which circular interventions are possible there.',
  step1:'Choose a building',step2:'Choose a function',
  B:{r:['Residential','Terraced house or apartment'],c:['Commercial','Office building']},
  building:'Building',func:'Function',filters:'Filters',reset:'Reset filters',
  FN:{heating:'Heating',cooling:'Cooling',ventilation:'Ventilation'},
  LV:{context:'Contextual level',building:'Building level',system:'System level',product:'Product level',component:'Component level'},
  AP:{c:'Commercial construction',r:'Residential construction'},
  GO:{m:'Material reduction',e:'Energy reduction'},
  ST:{reconsider:'Reconsider',reuse:'Reuse',repair_on:'Repair or refurbish on site',repair_off:'Repair, refurbish or remanufacture off-site',repurpose:'Repurpose',d_context:'Contextual level',d_building:'Building level',g_design:'General design guidelines',g_org:'Organisational interventions'},
  CO:{gen:'Generation units',dist:'Distribution',term:'Terminal units',ctrl:'Control systems',gen_all:'General'},
  H:{ctx:['Surroundings','Shade, greenery and sun around the building'],bld:['Building envelope','Insulation, glazing, shading and layout'],gen:['Generation','Heat pump, boiler, heat recovery unit or AHU'],dist:['Distribution','Pipes, ducts and pumps'],term:['Terminal units','Radiators, floors, climate ceilings and grilles'],ctrl:['Control','Thermostats, sensors and software'],gnl:['General','Design guidelines and agreements with suppliers']},
  pickF:'Choose heating, cooling or ventilation above to see the clickable points.',
  pickH:'Click a yellow + or a part of the building to see the interventions.',
  hint:'Click a point',drag:'Drag to rotate, scroll or pinch to zoom',fxTip:'Hover or click to see this in the building',v3d:'3D building',vtab:'Table',allB:'All',allF:'All functions',toTable:'Or view the full table',more:'More details',capF:'Choose heating, cooling or ventilation to see the points in the building.',capH:'Click a + or a part of the building. Drag to rotate, scroll to zoom.',capP:'Hover an intervention to see it in the building. Click to keep it in view.',rStrat:'R-strategy',level:'Level',allCols:'All',pg:{systems:'Circular systems',demand:'Reducing demand',guidelines:'General guidelines'},fxSeen:'Shown in the building',apply:'Apply',applied:'Applied',design:'My design',clearAll:'Clear all',toastOn:'Applied in the building',toastAdd:'Added to your selection',toastOff:'Removed from your selection',designSub:'chosen interventions',designEmpty:'No interventions chosen yet. Click the + next to an intervention to add it to your selection.',info:'info',infoT:'About this framework',
  fnote:'First choose a <b>function</b> in the filter panel to see the points in the building',
  gNote:'General design guidelines and organisational interventions apply to all buildings, functions and scale levels. That is why you always see all of them, without filters.',
  IN:{lead:'This website aims to provide information on how HVAC systems can be designed in a more circular manner. Information is provided on different levels of abstraction and scope, to offer different approaches that could be relevant for different stakeholders, such as installation consultants, HVAC manufacturers, architects and property owners.',
   h1:'What you will find here',p1:'The website proposes both general guidelines for more circular design, specific interventions to reduce the demand for HVAC systems, and specific interventions to make HVAC systems more circular.',
   types:{guidelines:'General guidelines for more circular design, plus organisational interventions.',demand:'Interventions at building and contextual level that reduce the demand for HVAC systems.',systems:'Interventions that make the HVAC system itself more circular, following the R-strategies.'},go:'View in the table',
   h2:'System components: the FODAR principle',p2:'It is possible to filter strategies by differentiating between different system components based on the FODAR principle: dividing system components into the four categories generation units, distribution, terminal units and control systems, which can be further separated by the functions heating, cooling and ventilation.',
   fodar:[['F','Function',['Heating','Cooling','Ventilation']],['O','Generation units',['Heat pump','Gas boiler','Cooling machine']],['D','Distribution',['Pipes','Pumps','Air ducts']],['A','Terminal units',['Radiators','Floor heating','Air vents']],['R','Control systems',['Thermostats','Sensors','Building automation']]],
   h3:'Scale levels',p3:'Also, different scale levels can be considered in circular HVAC design: including the system, product and component level, but also a more zoomed out perspective can be considered at the building and contextual level.',
   lvx:{context:['Solar radiation','Green surroundings','Shade'],building:['Insulation','Orientation and layout','Sun shading'],system:['Composition of installation products'],product:['E.g. a heat pump, ventilation duct or radiator'],component:['Parts within products, e.g. a motor']},
   h4:'Who is it for?',p4:'Which scale level is most relevant differs per stakeholder.',
   who:[['Installation consultants','the system and product level are expected to be the most relevant.',['system','product']],['HVAC manufacturers','the component level is expected to be the most relevant.',['component']],['Architects','the building and contextual level probably offer the most relevant insights.',['building','context']],['Property owners','all levels could be relevant.',['*']]],
   src:'The data in this overview is collected through interviews with experts with a background related to HVAC and circular economy and will be updated on a regular basis.'},cart:'Selection',cartEb:'Circular HVAC Design Framework',name:'Circular HVAC Design Framework',add:'Add to selection',added:'In your selection',addAria:'Add to my selection',rmAria:'Remove from my selection',csv:'Download CSV',print:'Save as PDF',toConcept:'Turn into a concept',busy:'Creating PDF…',pdfName:'my-selection-circular-hvac.pdf',pg2:'Page',fTitle:'Filter',foldF:'Collapse filter',hideP:'Slide panel to the right',showP:'Show panel',clearF:'Clear',view:'View',kCt:'Category',csvH:['Intervention','Category','R-strategy / level','Component','Function','Scale level','Applicability','Goal','Why this helps','Consideration','BREEAM-NL'],none:'No interventions match these filters.',
  allParts:'All parts',interventions:'interventions',results:'Search results',noResults:'No interventions found.',
  tagM:'material',tagE:'energy',lgLv:'scale level',lgW:'known side-effect',
  why:'Why this helps',watch:'Consideration',brIh:'BREEAM-NL',brIp:'BREEAM-NL is the Dutch method for assessing the sustainability of buildings, managed by the Dutch Green Building Council. A building earns points through credits in categories such as energy, health and materials. The total determines the certification level, from Pass to Outstanding. There are separate schemes for new construction and renovation and for existing buildings in use (In-Use). Turn on the BREEAM-NL button to see which credits each intervention can contribute to. This is indicative: whether a credit is awarded is up to the assessor.',brT:'Relation with BREEAM-NL',brOn:'Show the relation with BREEAM-NL',brOff:'Hide the relation with BREEAM-NL',brNone:'No direct relation with BREEAM-NL found.',brNote:'Indicative: the intervention can contribute to these credits. Whether a credit is awarded is up to the assessor.',brNb:'New construction and renovation',brIu:'In-Use',brSel:'Contribution to BREEAM-NL',brSelS:'Credits your selection may contribute to (number of interventions)',brCsv:'BREEAM-NL',noWhy:'Not yet described in the framework.',noNeg:'No side-effects recorded in the interviews. That does not mean there are none.',
  kFn:'Function',kLv:'Scale level',kCo:'Component',kSt:'R-strategy',kCat:'Category',kAp:'Applicability',kGo:'Goal',notSpec:'Not specified',and:' and ',
  rooms:{r:['Attic','Bedroom','Living room'],c:['Office floor']},
  src:'Interventions collected in seven semi-structured interviews with eight HVAC practitioners and structured with an analytical model of R-strategies (Potting, 2017), FODAR components and scale levels. Effectiveness and side-effects have not yet been evaluated per project. Developed by TU Delft and Dutch Green Building Council.'
 }
};

/* state */
const ALL={l:['context','building','system','product','component'],g:['m','e']};
const S={sideMin:(()=>{try{return localStorage.getItem('chvac-okside')==='1';}catch(e){return false;}})(),mode:'3d',ta:'all',tf:'all',tab:'systems',lang:'nl',b:'r',f:null,h:null,q:'',l:new Set(),g:new Set()};
try{const s=JSON.parse(localStorage.getItem('chvac-v')||'null'); if(s){if(s.lang==='en'||s.lang==='nl')S.lang=s.lang; S.br=!!s.br;}}catch(e){}
const save=()=>{try{localStorage.setItem('chvac-v',JSON.stringify({lang:S.lang,br:!!S.br}));}catch(e){}};
const L=()=>T[S.lang];
const tx=(it,k)=>S.lang==='nl'?(it[k+'2']||it[k]):it[k];

function inHot(it,h){
  if(h==='ctx') return it.s==='d_context';
  if(h==='bld') return it.s==='d_building';
  if(h==='gnl') return it.s==='g_design'||it.s==='g_org';
  return it.c===h&&RS.includes(it.s);
}
function hotOf(it){return HK.find(h=>inHot(it,h));}
const passL=it=>!S.l.size||S.l.has(it.l);
const passG=it=>!S.g.size||it.g.some(g=>S.g.has(g));
function passF(it){ return passL(it)&&passG(it); }
const matchQ=it=>{ if(S.qa){ const s=['t','w','t2','w2'].map(k=>it[k]||'').join(' ').toLowerCase(); return S.qa.some(k=>s.includes(k)); } const q=S.q.toLowerCase(); return ['t','w','n','t2','w2','n2'].map(k=>it[k]||'').join(' ').toLowerCase().includes(q);};
const isG=it=>/^g_/.test(it.s);
function pool(){return DATA.filter(it=>it.a.includes(S.b)&&it.f===S.f&&(isG(it)||passF(it)));}
function group(list){
  const m=new Map();
  list.forEach(it=>{let g=m.get(it.t); if(!g){g={t:it.t,src:it,s:it.s,c:it.c,fs:new Set(),ls:new Set(),g:new Set()};m.set(it.t,g);}
    g.fs.add(it.f);g.ls.add(it.l);it.g.forEach(x=>g.g.add(x)); if(!g.src.w&&it.w)g.src=it;});
  return [...m.values()];
}
const lvSort=a=>[...a].sort((x,y)=>ALL.l.indexOf(x)-ALL.l.indexOf(y));
const REG=[];
let MK=[]; const THUMB={}; let COVER=null; let LASTFLY=null; let APK=[]; let PANELKEY='';
const AP={r:new Set(),c:new Set()}; let HOVFX=null; let SHOWN='';
let HOVG=null;
const KIND={reuse:'reuse',repair_on:'repair',repair_off:'repair',repurpose:'repurpose',reconsider:'design',g_design:'design',g_org:'org',d_context:'env',d_building:'env'};
const FCOL={heating:0xc0392b,cooling:0x2a6fc0,ventilation:0x4bae8a};
function refreshFx(){ if(!S.b||S.mode==='table') return;
  const g=HOVG||S.pinG||null; const k=g?fxOf(g.t):null; const pk=S.pinG?fxOf(S.pinG.t):null;
  const keys=new Set([k,pk,...fxKeys(S.b)].filter(Boolean)); const sig=[...keys].sort().join(',')+'|'+(g?g.t:'');
  if(sig===SHOWN) return; const prev=new Set((SHOWN.split('|')[0]||'').split(',').filter(Boolean)); SHOWN=sig;
  S3.setEffects(S.b,keys,true); S3.setMute(S.b,!!k); keys.forEach(x=>{ if(!prev.has(x)) S3.flashFx(S.b,x); });
  if(g&&!k&&S.f){ const an=S3.anchors(S.b)[S.f]||{}; const hk=S.h||hotOf(g.src); let p=an[hk]; if(p==='fixed'||!p){ const c=S3.fxCenter?null:null; p=null; }
    S3.showIcon(KIND[g.s]||'design',L().ST[g.s],p||S3.anchors(S.b)[S.f].bld||null,FCOL[S.f]); }
  else S3.showIcon(null); }
const CART=new Set();
try{const a=JSON.parse(localStorage.getItem('chvac-cart')||'null'); if(Array.isArray(a)) a.forEach(x=>{ if(DATA.some(d=>d.t===x)) CART.add(x); });}catch(e){}
const saveAP=()=>{try{localStorage.setItem('chvac-cart',JSON.stringify([...CART]));}catch(e){}};
const FXR=[['nightvent',/night ventilation|cross ventilation|openable window|opening windows/i],['pcm',/\bPCM\b/],['carpet',/carpet/i],['fans',/ventilators to reduce/i],['trees',/tree|green environment|pond|vegetation/i],['glass',/insulating glass|glazing/i],['pipeins',/insulation (for|of) pipes|pipe insulation|insulation of pipes/i],['sedum',/sedum/i],['district',/district heating|residual heat|collective generation/i],['radfan',/fans to the radiators|forced ventilation/i],['shade',/shad|overhang|sun protection/i],['insul',/insulation to the building|thermal bridge|make the building airtight|parapet/i],['wireless',/wireless|smart control|algorithm|\bAI\b|CO2 control|weather/i]];
const fxOf=txt=>{const r=FXR.find(([k,re])=>re.test(txt)); return r?r[0]:null;};
const fxKeys=b=>new Set([...CART].filter(x=>DATA.some(d=>d.t===x&&d.a.includes(b))).map(fxOf).filter(Boolean));
let toastT=0; function toast(msg){const e=$('toast'); if(!e) return; e.textContent=msg; e.classList.add('on'); clearTimeout(toastT); toastT=setTimeout(()=>e.classList.remove('on'),2200);}
function toggleAp(txt){ const on=!CART.has(txt); on?CART.add(txt):CART.delete(txt); saveAP(); const t=L();
  const in3d=S.mode!=='table'&&S.b&&$('stage');
  if(in3d){ SHOWN=''; refreshFx(); }
  const k=fxOf(txt);
  if(on&&k&&in3d&&DATA.some(d=>d.t===txt&&d.a.includes(S.b))){ S3.flashFx(S.b,k); toast('✓ '+t.toastAdd+'. '+t.toastOn); } else toast(on?'✓ '+t.toastAdd:t.toastOff);
  cartBtn(); if(!$('cart').hidden) renderCart();
  if(S.b||S.mode==='table') update(); if(dlg.open&&DLG&&DLG.t===txt) dlgAp(); }

function frame(){ const st=$('stage'); if(!st) return; const w=st.clientWidth; MK.forEach(m=>{const e=$('mk-'+m.k); if(!e) return; const [x,y,vis]=S3.project(m.p); e.style.transform=`translate(${x}px,${y}px) translate(-50%,-50%)`; e.style.visibility=vis?'visible':'hidden'; e.classList.toggle('left',x>w*.7);}); APK.forEach(a=>{const e=$(a.id); if(!e) return; const [x,y,vis]=S3.project(a.p); e.style.transform=`translate(${x+10}px,${y-34}px)`; e.style.visibility=vis?'visible':'hidden';}); place(); }

/* views */
function draw(){
  const t=L();
  document.documentElement.lang=S.lang; document.title=t.name;
  if(window.UH) UH.sync('ok');
  $('q').placeholder=t.search; $('q').setAttribute('aria-label',t.search); $('qx').setAttribute('aria-label',t.clear);
  cartBtn(); $('infoL').textContent=t.info; brBtnUpd(); if(infoDlg&&infoDlg.open) renderInfo(); $('lang').textContent=t.langBtn; $('lang').title=t.langTitle; $('lang').setAttribute('aria-label',t.langTitle);
  $('dlg-x').setAttribute('aria-label',t.close); $('dlg-wl').textContent=t.why; $('dlg-nl').textContent=t.watch;
  let h=`<header class="phead">${LOGOS()}<div class="ptxt"><div class="pname">${t.name}</div><h1>${t.h1}</h1></div></header>`;
  if(S.mode==='table'){ drawTableShell(h); return; }
  if(!S.b){
    h+=`<div class="mhead"><div id="sslot" class="sslot"></div></div><div class="choose">`+
      ['r','c'].map(b=>`<button type="button" class="bcard" data-b="${b}"><div class="pic"><img alt="" src="${THUMB[b]||''}"></div><div class="bt"><div><div class="bn">${t.B[b][0]}</div><div class="bs">${t.B[b][1]}</div></div><span class="go">${I.arrow}</span></div></button>`).join('')+`</div>`;
    h+=`<button type="button" class="tlink" data-view="table">${t.toTable}<span style="display:flex">${I.arrow}</span></button>`;
  } else {
    h+=`<div class="layout l3d${S.sideMin?' sc':''}"><aside class="side" id="side"></aside><div class="main">
      <div class="mhead">${foldB()}${viewSeg('3d')}<div id="sslot" class="sslot"></div></div>
      <div class="explore">
        <div class="stage" id="stage"><div id="marks"></div><div class="tip" id="tip" hidden></div><div class="pop" id="pop" hidden></div><div class="hint" id="hint">${t.drag}</div><div class="fnote" id="fnote" hidden><svg class="fic" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M4 6h16M7 12h10M10 18h4"/></svg><svg class="ar" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M11 6l-6 6 6 6"/></svg><span>${t.fnote}</span></div></div>
      </div></div></div>`;
  }
  
  setApp(h);
  if(S.b){ LASTFLY=null; S3.mount($('stage'),S.b,frame); S3.setEffects(S.b,fxKeys(S.b),false); update(); }
}

const TPAGES=[
 {id:'systems',rows:['reconsider','reuse','repair_on','repair_off','repurpose'],cols:['gen','dist','term','ctrl'],colKey:'CO',rowHead:'rStrat',pick:(it,r,c)=>it.s===r&&it.c===c},
 {id:'demand',rows:['d_context','d_building'],cols:['heating','cooling','ventilation'],colKey:'FN',rowHead:'level',pick:(it,r,c)=>it.s===r&&it.f===c},
 {id:'guidelines',rows:['all'],cols:['g_design','g_org'],colKey:'ST',pick:(it,r,c)=>it.s===c}];
const TREG=[];
function setApp(h){ const sb=document.querySelector('.search'), mv=[$('cartBtn'),$('infoBtn'),$('brBtn'),$('lang'),$('beta')].filter(Boolean), foc=document.activeElement===$('q');
  $('head').appendChild(sb); mv.forEach(x=>$('head').appendChild(x)); $('app').innerHTML=h; const slot=$('sslot');
  if(slot){ slot.appendChild(sb); slot.after(...mv); } sb.hidden=!slot; mv.forEach(x=>x.hidden=!slot); if(foc&&slot) $('q').focus(); slideSeg(); }
const LOGOS=()=>`<div class="plogos">${document.querySelector('.logos').innerHTML}</div>`;
const foldB=()=>`<button type="button" class="cartb oksb" data-okunfold aria-expanded="false"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h16M7 12h10M10 18h4"/></svg><span>${L().fTitle}</span></button>`;
function okSide(){ if(!S.sideMin){ S.opw=0; const st=$('stage'); if(st) st.style.setProperty('--opw','340px'); if(typeof place==='function') place(); } if(window.EV&&EV.setSide) EV.setSide(!!S.sideMin); const l=document.querySelector('#app .layout'); if(l) l.classList.toggle('sc',!!S.sideMin); try{localStorage.setItem('chvac-okside',S.sideMin?'1':'0');}catch(e){}
  const t0=performance.now(); const f=()=>{ if($('stage')){ S3.resize(); frame(); if(typeof place==='function') place(); } if(performance.now()-t0<720) requestAnimationFrame(f); }; f(); }
let VSPREV=null;
function slideSeg(){ requestAnimationFrame(()=>requestAnimationFrame(()=>{ const v=document.querySelector('#app .vseg'); if(v) v.dataset.at=S.mode==='table'?'1':'0'; VSPREV=S.mode; })); }
const viewSeg=m=>{const t=L(); return `<div class="seg vseg" data-at="${(VSPREV||m)==='table'?1:0}" role="group" aria-label="${t.view}"><button type="button" data-view="3d" class="${m==='3d'?'on':''}">${t.v3d}</button><button type="button" data-view="table" class="${m==='table'?'on':''}">${t.vtab}</button></div>`;};
function drawTableShell(h){
  const t=L();
  h+=`<div class="layout${S.sideMin?' sc':''}"><aside class="side" id="side"></aside><div class="main">
    <div class="mhead">${foldB()}${viewSeg('table')}<div id="sslot" class="sslot"></div></div>
    <nav class="ptabs" id="ptabs"></nav><div id="tbody"></div></div></div>`;
  
  setApp(h); drawTable();
}
/* left filter column (DGBC kenniscentrum style) */
function baseItems(){ return DATA.filter(it=>{
  if(S.mode==='table'){ if(S.ta!=='all'&&!it.a.includes(S.ta)) return false; if(S.tf!=='all'&&it.f!==S.tf) return false; }
  else { if(!it.a.includes(S.b)) return false; if(S.f&&!S.q&&it.f!==S.f) return false; }
  return !S.q||matchQ(it); }); }
function side(){
  const el=$('side'); if(!el) return; const t=L(), tbl=S.mode==='table', pid=S.tab;
  const base=tbl?DATA.filter(it=>tbase(it,pid)):baseItems().filter(it=>!isG(it));
  const lvls=tbl?PGL[pid]:ALL.l, showF=!tbl||pid==='systems', gOnly=tbl&&pid==='guidelines';
  const passL=tbl?(it=>passLp(it,pid)):(it=>!S.l.size||S.l.has(it.l));
  const pill=(attr,k,lab,on,cls='')=>`<button type="button" class="pill${cls}${on?' on':''}" data-${attr}="${k}" aria-pressed="${on}">${lab}</button>`;
  const bOpts=tbl?[['all',t.allB],['r',t.B.r[0]],['c',t.B.c[0]]]:[['r',t.B.r[0]],['c',t.B.c[0]]];
  const fOpts=(tbl?[['all',t.allF]]:[]).concat(['heating','cooling','ventilation'].map(f=>[f,t.FN[f]]));
  const ck=(g,k,lab,n)=>{const on=S[g].has(k); return `<button type="button" class="ck${!n&&!on?' zero':''}" data-g="${g}" data-k="${k}" aria-pressed="${on}"><span class="bx"></span><span class="lb">${lab}</span><span class="n">(${n})</span></button>`;};
  const nL=k=>group(base.filter(it=>it.l===k&&passG(it))).length, nG=k=>group(base.filter(it=>it.g.includes(k)&&passL(it))).length;
  const nLs=tbl?selL(pid).length:S.l.size, nAct=gOnly?0:nLs+S.g.size;
  const clr=g=>(g==='l'?nLs:S[g].size)?`<button type="button" class="sclr" data-clr="${g}">${t.clearF}</button>`:'';
  el.classList.toggle('so',!!S.so);
  el.innerHTML=`<div class="sideh"><h2><button type="button" class="stog" aria-expanded="${!!S.so}">${t.fTitle}${nAct?`<span class="sn">${nAct}</span>`:''}<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg></button></h2><button type="button" class="sfold" data-okfold aria-label="${t.foldF}" title="${t.foldF}"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 15l6-6 6 6"/></svg></button></div>
    ${gOnly?`<section><p class="snote">${t.gNote}</p></section>`:`
    <section><div class="sh"><h3>${t.building}</h3></div><div class="pills">${bOpts.map(([k,l])=>pill(tbl?'ta':'b',k,l,tbl?S.ta===k:S.b===k)).join('')}</div></section>
    ${showF?`<section><div class="sh"><h3>${t.func}</h3></div><div class="pills">${fOpts.map(([k,l])=>pill(tbl?'tf':'f',k,l,tbl?S.tf===k:S.f===k,k==='all'?'':' f-'+k+(!tbl&&!S.f?' pulse':''))).join('')}</div></section>`:''}
    <section><div class="sh"><h3>${t.kLv}</h3>${clr('l')}</div><div class="cks">${lvls.map(k=>ck('l',k,t.LV[k],nL(k))).join('')}</div></section>
    <section><div class="sh"><h3>${t.kGo}</h3>${clr('g')}</div><div class="cks">${ALL.g.map(k=>ck('g',k,t.GO[k],nG(k))).join('')}</div></section>
    ${nAct?`<button class="rreset" type="button" data-reset>${t.reset}</button>`:''}`}${tbl?'':`<p class="scap" id="cap">${esc(CAPTXT)}</p>`}`;
}
const PGL={systems:['system','product','component'],demand:['context','building'],guidelines:[]};
const selL=pid=>[...S.l].filter(x=>PGL[pid].includes(x));
const passLp=(it,pid)=>{const sel=selL(pid); return !sel.length||sel.includes(it.l);};
function tbase(it,pid){ if(pgOf(it.s)!==pid) return false; if(S.q&&!matchQ(it)) return false; if(pid==='guidelines') return true;
  if(S.ta!=='all'&&!it.a.includes(S.ta)) return false; if(pid==='systems'&&S.tf!=='all'&&it.f!==S.tf) return false; return true; }
function tpassP(it,pid){ return tbase(it,pid)&&(pid==='guidelines'||(passLp(it,pid)&&passG(it))); }
function tpass(it){ return tpassP(it,pgOf(it.s)); }
function drawTable(){
  const t=L(); TREG.length=0; const vis=DATA.filter(tpass);
  $('ptabs').innerHTML=TPAGES.map(p=>{const n=group(vis.filter(it=>p.rows.some(r=>p.cols.some(c=>p.pick(it,r,c))))).length; return `<button type="button" class="ptab${S.tab===p.id?' on':''}" data-tab="${p.id}">${t.pg[p.id]}<span class="nc">${n}</span></button>`;}).join('');
  const p=TPAGES.find(x=>x.id===S.tab), head=p.rows[0]!=='all', lab=c=>t[p.colKey][c];
  let h=`<div class="tw"><table class="mx${p.cols.length<4?' single':''}"><thead><tr>${head?`<th class="rh">${t[p.rowHead]}</th>`:''}${p.cols.map(c=>`<th>${lab(c)}</th>`).join('')}</tr></thead><tbody>`;
  p.rows.forEach(r=>{ h+=`<tr>${head?`<th scope="row">${t.ST[r]}</th>`:''}`; p.cols.forEach(c=>{ const gs=group(vis.filter(it=>p.pick(it,r,c)));
    h+=`<td data-label="${esc(lab(c))}"${gs.length?'':' class="e"'}><div class="cell">${gs.length?gs.map(g=>{const id=TREG.push(g)-1, on=CART.has(g.t);
      return `<div class="trow${on?' in':''}"><button type="button" class="tiv" data-t="${id}"><span class="tx">${hx(tx(g.src,'t'))}</span></button>${addBtn('tap',id,on)}</div>`;}).join(''):'<div class="empty">—</div>'}</div></td>`; }); h+='</tr>'; });
  h+=`</tbody></table></div>`;
  $('tbody').innerHTML=h; side();
}
const addBtn=(attr,id,on)=>{const t=L(); return `<button type="button" class="apb${on?' on':''}" data-${attr}="${id}" aria-pressed="${on}" aria-label="${on?t.rmAria:t.addAria}" title="${on?t.rmAria:t.addAria}">${on?I.check:I.plus}</button>`;};
function update(){ if(S.mode==='table'){ drawTable(); return; }
  const t=L(), st=$('stage');
  if(S.f) st.dataset.f=S.f; else delete st.dataset.f;
  st.className='stage'+(S.f?' f-'+S.f:''); const fn=$('fnote'); if(fn) fn.hidden=!!S.f; const hn=$('hint'); if(hn) hn.hidden=!!S.h;
  // markers
  S3.setFn(S.b,S.f,S.h);
  MK=[]; let mk='';
  if(S.f&&!S.q){
    const P=pool(), an=S3.anchors(S.b)[S.f];
    HK.forEach(k=>{if(!an[k])return; const n=group(P.filter(it=>inHot(it,k))).length; if(!n)return;
      if(an[k]==='fixed'){ mk+=`<button type="button" class="gnl${S.h===k?' on':''}" data-h="${k}" style="pointer-events:auto"><span class="c">${I.doc}</span>${t.H[k][0]} <b>${n}</b></button>`; return; }
      MK.push({k,p:an[k]});
      mk+=`<button type="button" class="mk${S.h===k?' on':''}" data-h="${k}" id="mk-${k}" aria-label="${t.H[k][0]}: ${n} ${t.interventions}"><span class="c">${I.plus}</span><span class="n">${n}</span><span class="l">${t.H[k][0]}<b>${n}</b></span></button>`;});
  }
  APK=[];
  $('marks').innerHTML=mk; frame();
  refreshFx();
  S3.setValid(S.f&&!S.q?HK.filter(k=>MK.some(m=>m.k===k)):[]);
  const flyKey=S.b+'|'+S.f+'|'+S.h;
  if(flyKey!==LASTFLY){ const an=S.f?S3.anchors(S.b)[S.f]:{}; const p=S.h&&an[S.h]&&an[S.h]!=='fixed'?an[S.h]:null; if(LASTFLY!==null) S3.flyTo(p); LASTFLY=flyKey; }
  panel(); side(); okGrip();
}

/* ---------- BREEAM-NL (data/breeam.js, gegenereerd door breeam.py) ----------
   Per interventie en gebouwtype (r woning, c utiliteit) de credits voor twee schema's:
   nb = Nieuwbouw en renovatie, iu = In-Use. Indicatief: "kan bijdragen aan". */
const hx=s=>esc(s).replace(/CO2/g,'CO<sub>2</sub>'); // weergave: CO2 met subscript
const BR=window.CHVAC_BREEAM||null;
const brTx=x=>x?(S.lang==='nl'?(x.nl||x.en):x.en):'';
const brOf=(t,b)=>(BR&&BR.items[t]&&BR.items[t][b])||{};
const brName=(b,s,k)=>brTx(BR&&BR.credits[b+s]&&BR.credits[b+s][k]);
const brSch=(b,s)=>brTx(BR.schemas[b][s]);
function brTypes(as){ const set=new Set(as); if(S.mode!=='table'&&S.b&&set.has(S.b)) return [S.b]; if(S.mode==='table'&&S.ta!=='all'&&set.has(S.ta)) return [S.ta]; return ['r','c'].filter(b=>set.has(b)); }
function brBtnUpd(){ const b=$('brBtn'); if(!b) return; const t=L(); b.setAttribute('aria-pressed',String(!!S.br)); b.title=S.br?t.brOff:t.brOn; b.setAttribute('aria-label',b.title); }
function brCodes(t,b){ if(!BR) return ''; const o=brOf(t,b), ks=[...new Set([...(o.nb||[]),...(o.iu||[])].map(x=>x.k))]; return ks.length?`<div class="brcodes">${ks.map(k=>`<span class="brc">${k}</span>`).join('')}</div>`:''; }
// één credit: label + naam (de uitleg uit het Design Framework tonen we bewust niet)
const brItem=(b,s,k,extra='')=>`<div class="bri"><span class="brc">${k}</span><b>${hx(brName(b,s,k))}</b>${extra}</div>`;
// relatie per gebouwtype en schema; bij meer gebouwtypes eerst het gebouwtype als kopje
function brFull(t,types,compact){ if(!BR||!types.length) return ''; const tt=L(); let h='';
  types.forEach(b=>{ const o=brOf(t,b); let hb='';
    ['nb','iu'].forEach(s=>{ const l=o[s]||[]; if(l.length) hb+=`<div class="brs"><i>${hx(brSch(b,s))}</i>`+l.map(x=>brItem(b,s,x.k)).join('')+`</div>`; });
    if(hb) h+=(types.length>1?`<div class="bty">${tt.B[b][0]}</div>`:'')+hb; });
  if(!h) return '';
  return (compact?`<div class="brh"><img alt="BREEAM-NL" src="${BR.logo}"></div>`:'')+h; }
// selectie: creditcodes per interventie
function brMeta(r){ if(!BR) return ''; const ks=new Set(); brTypes(r.a.flatMap(d=>d.a)).forEach(b=>(brOf(r.t,b).nb||[]).forEach(x=>ks.add(x.k))); return ks.size?`<div class="ci-m ci-br">${[...ks].sort().map(k=>`<span class="brc">${k}</span>`).join(' ')}</div>`:''; }
// selectie en pdf: welke credits raakt de hele selectie (met aantal interventies)
function brSum(rows,pdf){ if(!BR||!rows.length) return ''; const tt=L();
  const types=['r','c'].filter(b=>rows.some(r=>r.a.some(d=>d.a.includes(b)))); let h='';
  types.forEach(b=>{ let hb='';
    ['nb','iu'].forEach(s=>{ const cnt={};
      rows.forEach(r=>{ if(!r.a.some(d=>d.a.includes(b))) return; (brOf(r.t,b)[s]||[]).forEach(x=>{ cnt[x.k]=(cnt[x.k]||0)+1; }); });
      const ks=Object.keys(cnt).sort(); if(!ks.length) return;
      hb+=`<div class="brs"><i>${hx(brSch(b,s))}</i>`+ks.map(k=>brItem(b,s,k,`<em>${cnt[k]}×</em>`)).join('')+`</div>`; });
    if(hb) h+=(types.length>1?`<div class="bty">${tt.B[b][0]}</div>`:'')+hb; });
  if(!h) return '';
  if(pdf) return `<section class="pv-brsum"><img alt="BREEAM-NL" src="${BR.logo}"><h2>${tt.brSel}</h2><p class="brnote">${tt.brSelS}</p>${h}<p class="brnote">${tt.brNote}</p></section>`;
  return `<div class="grp-t">${tt.brSel}</div><div class="brsum"><div class="brh"><img alt="BREEAM-NL" src="${BR.logo}"><small>${tt.brSelS}</small></div>${h}<p class="brnote">${tt.brNote}</p></div>`; }
// pdf: per interventie, credits onder elkaar
function brPdf(r){ if(!BR) return ''; const types=brTypes(r.a.flatMap(d=>d.a)), tt=L(); let h='';
  types.forEach(b=>{ let hb='';
    ['nb','iu'].forEach(s=>{ const l=brOf(r.t,b)[s]||[]; if(l.length) hb+=`<div class="brs"><i>${hx(brSch(b,s))}</i>`+l.map(x=>brItem(b,s,x.k)).join('')+`</div>`; });
    if(hb) h+=(types.length>1?`<div class="bty">${tt.B[b][0]}</div>`:'')+hb; });
  return h?`<div class="pv-br">${h}</div>`:''; }
// csv: platte tekst
function brPlain(r){ if(!BR) return ''; const types=brTypes(r.a.flatMap(d=>d.a)), out=[];
  types.forEach(b=>['nb','iu'].forEach(s=>{ const l=brOf(r.t,b)[s]||[]; if(l.length) out.push(brSch(b,s)+': '+l.map(x=>x.k+' '+brName(b,s,x.k)).join('; ')); }));
  return out.join(' | '); }

function ivHTML(g,showFn){
  const t=L(), id=REG.push(g)-1;
  const lv=lvSort(g.ls).map(l=>`<span class="ct lv" title="${t.LV[l]}">${RN[l]}</span>`).join('');
  const go=(g.g.has('m')?`<span class="ct m">${t.tagM}</span>`:'')+(g.g.has('e')?`<span class="ct e">${t.tagE}</span>`:'');
  const fn=showFn?[...g.fs].map(f=>`<span class="ct fn f-${f}">${t.FN[f]}</span>`).join(''):'';
  const fk=fxOf(g.t), pin=S.pin===g.t;
  let ex='';
  if(pin&&S.br&&BR){ ex=`<div class="ivx ivbr">${brFull(g.t,[S.b],true)}<button type="button" class="more" data-more="${id}">${t.more}</button></div>`; }
  else if(pin){ const w=tx(g.src,'w'), n=tx(g.src,'n');
    ex=`<div class="ivx">${w?`<div><b>${t.why}</b><p>${hx(w)}</p></div>`:''}${n?`<div><b>${t.watch}</b><p>${hx(n)}</p></div>`:''}<button type="button" class="more" data-more="${id}">${t.more}</button></div>`; }
  const on=CART.has(g.t);
  return `<div class="ivr${pin?' pin':''}${on?' in':''}" data-fx="${fk||''}"><div class="ivrow"><button type="button" class="iv" data-i="${id}" aria-expanded="${pin}"><span>${hx(tx(g.src,'t'))}</span></button>${addBtn('ap',id,on)}</div>${!pin&&S.br?brCodes(g.t,S.b):''}${ex}</div>`;
}
const legend=t=>`<div class="legend"><span><span class="ct lv">III</span>${t.lgLv}</span><span><span class="ct m">${t.tagM}</span><span class="ct e">${t.tagE}</span></span><span><span class="ct w">!</span>${t.lgW}</span></div>`;

function panel(){
  const t=L(), p=$('pop'), tip=$('tip'); REG.length=0; if(!p) return;
  const close=`<button type="button" class="px" data-h="" aria-label="${t.close}"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button>`;
  p.dataset.mode='';
  if(S.q){
    const q=S.q.toLowerCase();
    const res=DATA.filter(it=>it.a.includes(S.b)&&passF(it)&&matchQ(it));
    const gs=group(res);
    p.innerHTML=`<div class="ph"><div><h2>${t.results}</h2><p>${gs.length} ${t.interventions}</p></div></div><div class="pb">${
      gs.length?HK.map(k=>{const sub=gs.filter(g=>inHot(g.src,k)); return sub.length?`<div class="grp-t">${t.H[k][0]}</div>`+sub.map(g=>ivHTML(g,true)).join(''):'';}).join(''):`<div class="empty">${t.noResults}</div>`}</div>`;
    p.dataset.mode='search'; p.hidden=false; place(); return;
  }
  if(false){ const set=CART; const rows=DATA.filter(it=>it.a.includes(S.b)&&set.has(it.t)); const gs=group(rows);
    const st=p.scrollTop, keep=PANELKEY==='design'; PANELKEY='design';
    p.innerHTML=`<div class="ph"><div><div class="eb">${t.B[S.b][0]}</div><h2>${t.design}</h2><p>${gs.length} ${t.designSub}</p></div>${close}</div><div class="pb">${
      gs.length?HK.map(k=>{const sub=gs.filter(g=>inHot(g.src,k)); return sub.length?`<div class="grp-t">${t.H[k][0]}</div>`+sub.map(g=>ivHTML(g,true)).join(''):'';}).join('')+`<button type="button" class="clr" id="clr">${t.clearAll}</button>`:`<div class="empty">${t.designEmpty}</div>`}</div>`;
    p.dataset.mode='search'; p.hidden=false; tip.hidden=true; p.scrollTop=keep?st:0; return; }
  if(!S.f){ cap(t.capF); p.hidden=true; S3.setShift(0); return; }
  if(!S.h){ cap(t.capH); p.hidden=true; S3.setShift(0); return; }
  cap(t.capP);
  tip.hidden=true;
  const P=pool();
  const eb=`${t.B[S.b][0]}, ${t.FN[S.f]}`;
  const items=P.filter(it=>inHot(it,S.h));
  const keys=S.h==='gnl'?['g_design','g_org']:S.h==='ctx'?['d_context']:S.h==='bld'?['d_building']:RS;
  const gs=group(items);
  let body=keys.map(s=>{const sub=gs.filter(g=>g.s===s); return sub.length?`<div class="grp-t">${t.ST[s]}</div>`+sub.map(g=>ivHTML(g,false)).join(''):'';}).join('');
  p.innerHTML=`<div class="ph"><div><h2>${t.H[S.h][0]}</h2><p>${gs.length} ${t.interventions}</p></div>${close}</div><div class="pb">${body||`<div class="empty">${t.none}</div>`}</div>`;
  const pk=S.b+S.f+S.h; const keep=pk===PANELKEY?p.scrollTop:0; PANELKEY=pk;
  p.dataset.mode=S.h==='gnl'?'gnl':'mk'; p.hidden=false; p.scrollTop=keep; place();
}
function place(){ const p=$('pop'); if(!p) return; const dock=!p.hidden&&!S.popMin&&window.innerWidth>700; S3.setShift(dock?p.offsetWidth/2:0); okGrip(); }
const OKG={d:null,moved:false};
function okDrag(g){
  g.addEventListener('pointerdown',e=>{ OKG.moved=false; if(!(S.sideMin&&!S.popMin&&window.innerWidth>1000)) return; OKG.d={x:e.clientX,w:S.opw||340}; g.setPointerCapture(e.pointerId); });
  g.addEventListener('pointermove',e=>{ if(!OKG.d) return; const dx=OKG.d.x-e.clientX; if(!OKG.moved&&Math.abs(dx)<4) return; const st=$('stage'); if(!OKG.moved){ OKG.moved=true; st.classList.add('rzing'); }
    const mx=Math.max(340,Math.min(760,Math.round(st.getBoundingClientRect().width*0.62))); S.opw=Math.max(340,Math.min(mx,OKG.d.w+dx)); st.style.setProperty('--opw',S.opw+'px'); place(); });
  const end=()=>{ if(OKG.d&&OKG.moved){ const st=$('stage'); if(st) st.classList.remove('rzing'); } OKG.d=null; };
  g.addEventListener('pointerup',end); g.addEventListener('pointercancel',end); }
function okGrip(){ const st=$('stage'), p=$('pop'); if(!st||!p) return; let g=$('okgrip');
  if(!g){ g=document.createElement('button'); g.type='button'; g.id='okgrip'; g.className='pgrip'; okDrag(g); g.innerHTML='<svg class="gl" width="10" height="18" viewBox="0 0 10 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 2v14M7 2v14"/></svg><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>'; st.appendChild(g); }
  const on=!p.hidden; g.hidden=!on; st.classList.toggle('pc',on&&!!S.popMin); st.classList.toggle('rz',!!S.sideMin&&window.innerWidth>1000); st.style.setProperty('--opw',(S.opw||340)+'px'); const t=L(); g.title=(S.popMin?t.showP:t.hideP)+(!S.popMin&&S.sideMin&&window.innerWidth>1000?(S.lang==='en'?'. Drag to widen':'. Sleep om breder te maken'):''); g.setAttribute('aria-label',g.title); }
let CAPTXT=''; function cap(s){ CAPTXT=s; const c=$('cap'); if(c) c.textContent=s; }

/* events */
function closeDD(except){document.querySelectorAll('.ddb[aria-expanded="true"]').forEach(b=>{if(b===except)return; b.setAttribute('aria-expanded','false'); $(b.getAttribute('aria-controls')).hidden=true;});}
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('cart').hidden&&!document.querySelector('dialog[open]')){closeCart(); return;} if(e.key==='Escape'){closeDD(); if(S.h&&!document.querySelector('dialog[open]')){S.h=null;update();}}});
document.addEventListener('click',e=>{
  const el=e.target;
  if(el.closest&&el.closest('#ev-host,.uhead')) return;
  if(el.closest('#okgrip')){ if(OKG.moved){ OKG.moved=false; return; } S.popMin=!S.popMin; place(); return; }
  if(el.closest('[data-okfold]')){ S.sideMin=true; okSide(); return; }
  if(el.closest('.fnote')){ const unf=S.sideMin&&window.innerWidth>1000; if(unf){ S.sideMin=false; okSide(); } setTimeout(()=>{ const ps=[...document.querySelectorAll('#app .side .pill[data-f]')]; if(ps[0]&&window.innerWidth<=1000) ps[0].scrollIntoView({behavior:'smooth',block:'center'}); ps.forEach(p=>{ p.classList.remove('fflash'); void p.offsetWidth; p.classList.add('fflash'); p.addEventListener('animationend',()=>p.classList.remove('fflash'),{once:true}); }); },unf?450:0); return; }
  if(el.closest('[data-okunfold]')){ S.sideMin=false; okSide(); return; }
  if(el.closest('[data-home]')){ $('home').click(); return; }
  const db=el.closest('.ddb');
  if(db){const m=$(db.getAttribute('aria-controls')), open=db.getAttribute('aria-expanded')!=='true'; closeDD(db);
    db.setAttribute('aria-expanded',open); m.hidden=!open;
    if(open){m.classList.remove('r'); const r=m.getBoundingClientRect(); if(r.right>window.innerWidth-12) m.classList.add('r');}
    return;}
  if(!el.closest('.ddm')) closeDD();
  if(el.closest('.stog')){ S.so=!S.so; side(); return; }
  const ckb=el.closest('.ck'); if(ckb){const s=S[ckb.dataset.g],k=ckb.dataset.k; s.has(k)?s.delete(k):s.add(k); update(); return;}
  const sc=el.closest('[data-clr]'); if(sc){ const g=sc.dataset.clr; if(g==='l'&&S.mode==='table') PGL[S.tab].forEach(x=>S.l.delete(x)); else S[g].clear(); update(); return;}
  const tap=el.closest('[data-tap]'); if(tap){toggleAp(TREG[+tap.dataset.tap].t); return;}
  const fi=el.closest('.fi'); if(fi){const s=S[fi.dataset.g],k=fi.dataset.k; s.has(k)?s.delete(k):s.add(k); update(); return;}
  if(el.closest('[data-reset]')){S.l=new Set();S.g=new Set();update();return;}
  const b=el.closest('[data-b]'); if(b){ S.pin=null; S.pinG=null; SHOWN=''; const nb=b.dataset.b; if(S.b!==nb){S.b=nb;S.h=null;} draw(); window.scrollTo({top:0,behavior:'smooth'}); return;}
  const f=el.closest('[data-f]'); if(f&&f.tagName==='BUTTON'&&!f.classList.contains('ivr')){ S.pin=null; S.pinG=null;S.f=f.dataset.f; S.h=null; draw(); return;}
  const hh=el.closest('[data-h]'); if(hh){const k=hh.dataset.h||null; S.view=null; S.pin=null; S.pinG=null; S.popMin=false; S.h=(k&&S.h===k)?null:k; update(); return;}
  const ab=el.closest('[data-ap]'); if(ab){toggleAp(REG[+ab.dataset.ap].t); return;}
  if(el.closest('#design')){ S.view=S.view==='design'?null:'design'; S.h=null; update(); return;}
  if(el.closest('#clr')){ CART.clear(); saveAP(); cartBtn(); renderCart(); SHOWN=''; if(S.b&&S.mode!=='table'&&$('stage')) refreshFx(); toast(L().toastOff); if(S.b||S.mode==='table') update(); return;}
  if(el.closest('#dlg-ap')){ if(DLG) toggleAp(DLG.t); return;}
  const mo=el.closest('[data-more]'); if(mo){openDlg(REG[+mo.dataset.more]); return;}
  const tv=el.closest('.tiv'); if(tv){openDlg(TREG[+tv.dataset.t]); return;}
  const vb=el.closest('[data-view]'); if(vb){ S.mode=vb.dataset.view; if(S.mode==='3d'&&!S.b) S.b='r'; S.h=null; S.pin=null; S.pinG=null; draw(); return;}
  const ta=el.closest('[data-ta]'); if(ta){ S.ta=ta.dataset.ta; draw(); return;}
  const tf=el.closest('[data-tf]'); if(tf){ S.tf=tf.dataset.tf; draw(); return;}
  const pt=el.closest('[data-tab]'); if(pt){ S.tab=pt.dataset.tab; drawTable(); return;}
  const iv=el.closest('.iv'); if(iv){ const g=REG[+iv.dataset.i]; S.pin=S.pin===g.t?null:g.t; S.pinG=S.pin?g:null; const k=fxOf(g.t); update(); if(S.pin&&k){ const c=S3.fxCenter(S.b,k); if(c) S3.flyTo(c); } else if(!S.pin){ const an=S3.anchors(S.b)[S.f]||{}; const p=S.h&&an[S.h]&&an[S.h]!=='fixed'?an[S.h]:null; S3.flyTo(p); } return;}
});
if($('home')) $('home').addEventListener('click',()=>{S.mode='3d';S.b='r';S.f=null;S.l.clear();S.g.clear();S.h=null;S.q='';S.qa=null;$('q').value='';$('qx').hidden=true;draw();});
$('lang').addEventListener('click',()=>{S.lang=S.lang==='nl'?'en':'nl'; save(); draw();});
if($('brBtn')){ if(!BR) $('brBtn').remove(); else { $('brBtn').querySelector('img').src=BR.logo; brBtnUpd(); $('brBtn').addEventListener('click',()=>{ S.br=!S.br; save(); brBtnUpd(); if(S.b||S.mode==='table') update(); }); } }
$('q').addEventListener('input',e=>{S.qa=null; S.q=e.target.value.trim(); $('qx').hidden=!S.q; if(S.mode==='table') drawTable(); else if(S.q&&!S.b){S.b='r'; draw();} else if(S.b) update();});
$('qx').addEventListener('click',()=>{$('q').value='';S.q='';S.qa=null;$('qx').hidden=true;if(S.b||S.mode==='table')update();$('q').focus();});

const dlg=$('dlg');
let DLG=null;
function dlgAp(){ const t=L(), on=CART.has(DLG.t), b=$('dlg-ap'); b.className='dlap'+(on?' on':''); b.setAttribute('aria-pressed',on); b.innerHTML=(on?I.check:I.plus)+(on?t.added:t.add); }
/* ---------- my selection (cart) ---------- */
const CREG=[];
const pgOf=s=>RS.includes(s)?'systems':/^d_/.test(s)?'demand':'guidelines';
function cartBtn(){ const t=L(), n=CART.size; $('cartL').textContent=t.cart; $('cartN').textContent=n; $('cartBtn').classList.toggle('has',n>0); $('cartBtn').setAttribute('aria-label',`${t.cart}: ${n} ${t.designSub}`); }
function cartRows(){ return [...CART].map(x=>{const a=DATA.filter(d=>d.t===x); return a.length?{t:x,g:group(a)[0],a}:null;}).filter(Boolean); }
function renderCart(){
  const t=L(), rows=cartRows(); CREG.length=0;
  $('cart-e').textContent=t.cartEb; $('cart-t').textContent=t.cart; $('cart-s').textContent=`${rows.length} ${t.designSub}`;
  $('cart-x').setAttribute('aria-label',t.close);
  if(!rows.length){ $('cart-b').innerHTML=`<div class="empty">${t.designEmpty}</div>`; $('cart-f').innerHTML=''; return; }
  $('cart-b').innerHTML=TPAGES.map(p=>{ const sub=rows.filter(r=>pgOf(r.g.s)===p.id); if(!sub.length) return '';
    return `<div class="grp-t">${t.pg[p.id]} <span>${sub.length}</span></div>`+sub.map(r=>{ const id=CREG.push(r)-1;
      const fs=[...new Set(r.a.map(d=>d.f))].map(f=>t.FN[f]).join(', '), as=[...new Set(r.a.flatMap(d=>d.a))].sort().map(b=>t.B[b][0]).join(', ');
      const cat=r.g.c&&r.g.c!=='gen_all'&&RS.includes(r.g.s)?`${t.ST[r.g.s]}, ${t.CO[r.g.c]}`:t.ST[r.g.s];
      return `<div class="ci"><div class="ci-c"><button type="button" class="ci-t" data-copen="${id}">${hx(tx(r.g.src,'t'))}</button><div class="ci-m">${esc(cat)}</div><div class="ci-m">${esc(fs)}</div><div class="ci-m">${esc(as)}</div>${brMeta(r)}</div><button type="button" class="ci-x" data-crm="${id}" aria-label="${t.rmAria}" title="${t.rmAria}"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>`; }).join(''); }).join('')+brSum(rows,false);
  $('cart-f').innerHTML=(window.EV&&EV.addConcept?`<button type="button" class="cbtn pri" id="ctoev">${t.toConcept}</button>`:'')+`<button type="button" class="cbtn" id="cprint">${t.print}</button><button type="button" class="cbtn" id="ccsv">${t.csv}</button><button type="button" class="clr" id="clr">${t.clearAll}</button>`;
}
let CARTRET=null;
function openCart(){ CARTRET=document.activeElement; renderCart(); $('cart').hidden=false; $('cartBg').hidden=false; document.body.classList.add('cart-open'); $('cart-x').focus(); }
function closeCart(){ $('cart').hidden=true; $('cartBg').hidden=true; document.body.classList.remove('cart-open'); if(CARTRET&&CARTRET.focus) CARTRET.focus(); }
async function okSave(filename,blob){
  try{ const dl=window.claude&&window.claude.use?await window.claude.use('downloads'):null; if(dl&&dl.save){ await dl.save({filename,data:blob}); return; } }catch(e){ if(e&&e.code==='declined') return; }
  const u=URL.createObjectURL(blob), a=document.createElement('a'); a.href=u; a.download=filename; document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(u),2000); }
function cartCSV(){
  const t=L(), q=v=>'"'+String(v==null?'':v).replace(/"/g,'""')+'"';
  const lines=[t.csvH.map(q).join(';')].concat(cartRows().map(r=>{ const g=r.g, a=r.a;
    const fs=[...new Set(a.map(d=>t.FN[d.f]))].join(', '), ls=lvSort(new Set(a.map(d=>d.l))).map(l=>t.LV[l]).join(', '), as=[...new Set(a.flatMap(d=>d.a))].sort().map(x=>t.AP[x]).join(', '), gl=[...new Set(a.flatMap(d=>d.g))].map(x=>t.GO[x]).join(t.and);
    return [tx(g.src,'t'),t.pg[pgOf(g.s)],t.ST[g.s],t.CO[g.c]||'',fs,ls,as,gl,tx(g.src,'w')||'',tx(g.src,'n')||'',brPlain(r)].map(q).join(';'); }));
  const blob=new Blob(['\ufeff'+lines.join('\r\n')],{type:'text/csv;charset=utf-8'});
  okSave((S.lang==='nl'?'mijn-selectie-circulaire-klimaatinstallaties':'my-selection-circular-hvac')+'.csv',blob);
}
function cartDoc(){
  const t=L(), rows=cartRows(), nl=S.lang==='nl';
  const logos=[...document.querySelectorAll('.logos img')].map(i=>`<img src="${i.src}" alt="${esc(i.parentNode.title||'')}">`).join('');
  const date=new Date().toLocaleDateString(nl?'nl-NL':'en-GB',{day:'numeric',month:'long',year:'numeric'});
  let n=0;
  const body=TPAGES.map(p=>{ const sub=rows.filter(r=>pgOf(r.g.s)===p.id); if(!sub.length) return '';
    return `<section class="pv-sec"><h2>${t.pg[p.id]}</h2>`+sub.map(r=>{ n++; const g=r.g,a=r.a;
      const fs=[...new Set(a.map(d=>d.f))], ls=lvSort(new Set(a.map(d=>d.l))), as=[...new Set(a.flatMap(d=>d.a))].sort(), gl=[...new Set(a.flatMap(d=>d.g))];
      const cat=g.c&&g.c!=='gen_all'&&RS.includes(g.s)?`${t.ST[g.s]}, ${t.CO[g.c]}`:t.ST[g.s];
      const w=tx(g.src,'w'), ng=tx(g.src,'n');
      const kv=[[t.kFn,fs.map(f=>t.FN[f]).join(', ')],[t.kLv,ls.map(l=>t.LV[l]).join(', ')],[t.kAp,as.map(x=>t.AP[x]).join(', ')]];
      if(gl.length) kv.push([t.kGo,gl.map(x=>t.GO[x]).join(t.and)]);
      return `<article class="pv-it"><div class="pv-c">
        <div class="pv-eb">${esc(cat)}</div><h3>${hx(tx(g.src,'t'))}</h3>
        <dl class="pv-kv">${kv.map(([k,v])=>`<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
        ${w||ng?`<div class="pv-notes">${w?`<div class="pv-pos"><b>${t.why}</b>${hx(w)}</div>`:''}${ng?`<div class="pv-neg"><b>${t.watch}</b>${hx(ng)}</div>`:''}</div>`:''}
        ${brPdf(r)}
      </div></article>`; }).join('')+`</section>`; }).join('');
  const d=document.createElement('div'); d.className='pvdoc'; d.lang=S.lang;
  d.innerHTML=`<header class="pv-top"><span></span><div class="pv-name">${t.name}</div><div class="pv-logos">${logos}</div></header>
    <div class="pv-hero"><div class="pv-date">${date}</div><h1>${t.cart}</h1><p>${nl?'Circulaire interventies voor klimaatinstallaties':'Circular interventions for HVAC systems'}</p></div>
    ${body}${brSum(rows,true)}<footer class="pv-foot">${t.src}</footer>`;
  return d;
}
let H2P=null;
const loadH2P=()=>H2P||(H2P=new Promise((ok,no)=>{ if(window.html2pdf) return ok(); const sc=document.createElement('script');
  sc.src='https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js'; sc.onload=()=>ok(); sc.onerror=()=>{H2P=null;no();}; document.head.appendChild(sc); }));
function printFallback(doc){ $('printv').innerHTML=''; $('printv').appendChild(doc); document.body.classList.add('pcart');
  const done=()=>{document.body.classList.remove('pcart'); removeEventListener('afterprint',done);}; addEventListener('afterprint',done); setTimeout(()=>window.print(),80); }
async function printCart(){
  const t=L(), b=$('cprint'); if(b.disabled) return; const lab=b.textContent; b.disabled=true; b.textContent=t.busy;
  const doc=cartDoc();
  try{
    await loadH2P(); if(document.fonts&&document.fonts.ready) await document.fonts.ready;
    const pdf=await window.html2pdf().set({margin:[14,15,16,15],filename:t.pdfName,image:{type:'jpeg',quality:.96},
      html2canvas:{scale:2,useCORS:true,backgroundColor:'#ffffff',scrollX:0,scrollY:0},jsPDF:{unit:'mm',format:'a4',orientation:'portrait'},
      pagebreak:{mode:['css','legacy'],avoid:['.pv-it','.pv-hero','.pv-top']}}).from(doc).toPdf().get('pdf');
    const N=pdf.internal.getNumberOfPages(); for(let i=1;i<=N;i++){ pdf.setPage(i); pdf.setFontSize(8); pdf.setTextColor(125,119,109);
      pdf.text(`${t.pg2} ${i} / ${N}`,195,289,{align:'right'}); }
    await okSave(t.pdfName,pdf.output('blob'));
  }catch(e){ printFallback(doc); }
  finally{ b.disabled=false; b.textContent=lab; }
}
const IIC=window.CHVAC_ICONS;
function renderInfo(){
  const t=L(), N=t.IN, RNx={context:'I',building:'II',system:'III',product:'IV',component:'V'};
  $('info-e').textContent=t.name; $('info-t').textContent=t.infoT; $('info-x').setAttribute('aria-label',t.close);
  const order=['guidelines','demand','systems'];
  $('info-b').innerHTML=`<p class="inf-lead">${N.lead}</p>
    <section class="inf-s"><h3>${N.h1}</h3><p>${N.p1}</p>
      <div class="inf-types">${order.map(id=>`<button type="button" class="inf-type" data-itab="${id}"><b>${t.pg[id]}</b><span>${N.types[id]}</span><em>${N.go} ${I.arrow}</em></button>`).join('')}</div></section>
    <section class="inf-s"><h3>${N.h2}</h3><p>${N.p2}</p>
      <div class="inf-grid">${N.fodar.map(([k,n,ex])=>`<div class="inf-card"><div class="inf-l">${k}</div><div class="inf-img"><img src="${IIC[k]}" alt=""></div><b>${n}</b><ul>${ex.map(x=>`<li>${x}</li>`).join('')}</ul></div>`).join('')}</div></section>
    <section class="inf-s"><h3>${N.h3}</h3><p>${N.p3}</p>
      <div class="inf-grid">${ALL.l.map(k=>`<div class="inf-card lv"><div class="inf-l">${RNx[k]}</div><div class="inf-img"><img src="${IIC[k]}" alt=""></div><b>${t.LV[k]}</b><ul>${N.lvx[k].map(x=>`<li>${x}</li>`).join('')}</ul></div>`).join('')}</div></section>
    <section class="inf-s"><h3>${N.h4}</h3><p>${N.p4}</p>
      <div class="inf-who">${N.who.map(([r,txt,lv])=>`<div class="inf-w"><b>${r}</b><span>${txt}</span></div>`).join('')}</div></section>
    ${BR?`<section class="inf-s"><h3>${t.brIh}</h3><img class="inf-br" alt="BREEAM-NL" src="${BR.logo}"><p>${t.brIp}</p></section>`:''}
    <p class="inf-src">${N.src}</p>`;
}
const infoDlg=$('info');
function openInfo(){ renderInfo(); $('info-b').scrollTop=0; if(infoDlg.showModal) infoDlg.showModal(); else infoDlg.setAttribute('open',''); }
$('infoBtn').addEventListener('click',openInfo);
$('info-x').addEventListener('click',()=>infoDlg.close());
infoDlg.addEventListener('click',e=>{ if(e.target===infoDlg){ infoDlg.close(); return; }
  const tb=e.target.closest('[data-itab]'); if(tb){ infoDlg.close(); S.mode='table'; S.tab=tb.dataset.itab; S.h=null; S.pin=null; S.pinG=null; draw(); window.scrollTo({top:0,behavior:'smooth'}); } });
$('cartBtn').addEventListener('click',openCart);
$('cart-x').addEventListener('click',closeCart);
$('cartBg').addEventListener('click',closeCart);
$('cart').addEventListener('click',e=>{ const el=e.target;
  const o=el.closest('[data-copen]'); if(o){ openDlg(CREG[+o.dataset.copen].g); return; }
  const r=el.closest('[data-crm]'); if(r){ toggleAp(CREG[+r.dataset.crm].t); return; }
  if(el.closest('#ccsv')){ cartCSV(); return; }
  if(el.closest('#cprint')){ printCart(); return; }
  if(el.closest('#ctoev')){ const keys=cartRows().map(r=>r.t); if(keys.length&&window.EV&&EV.addConcept(keys.length?{items:keys}:null)){ closeCart(); if(window.UH&&UH.show) UH.show('ev'); } return; } });
function openDlg(g){
  const t=L(), it=g.src; DLG=g;
  const strat=t.ST[g.s];
  $('dlg-e').textContent=g.c&&g.c!=='gen_all'?`${strat}, ${t.CO[g.c]}`:strat;
  $('dlg-t').innerHTML=hx(tx(it,'t'));
  { const im=$('dlg-img'), src=(window.CHVAC_IMG||{})[g.t]; im.hidden=!src; if(src){ im.href=src; const i=im.firstChild; i.src=src; i.alt=tx(it,'t'); } }
  const a=DATA.filter(x=>x.t===g.t); const fs=new Set(a.map(x=>x.f)), ls=new Set(a.map(x=>x.l)), as=new Set(a.flatMap(x=>x.a)), gl=new Set(a.flatMap(x=>x.g));
  if($('dlg-m')) $('dlg-m').innerHTML=lvSort(ls).map(l=>`<span class="ct lv">${RN[l]}, ${t.LV[l]}</span>`).join('')+(gl.has('m')?`<span class="ct m">${t.tagM}</span>`:'')+(gl.has('e')?`<span class="ct e">${t.tagE}</span>`:'');
  const w=tx(it,'w'), n=tx(it,'n');
  $('dlg-w').innerHTML=hx(w||''); $('dlg-w').parentNode.hidden=!w;
  $('dlg-n').innerHTML=hx(n||''); $('dlg-n').parentNode.hidden=!n;
  const rows=[[t.kFn,[...fs].map(f=>t.FN[f]).join(', ')],[t.kLv,lvSort(ls).map(l=>t.LV[l]).join(', ')],[t.kCo,t.CO[g.c]],
    [/^[dg]_/.test(g.s)?t.kCat:t.kSt,strat],[t.kAp,[...as].sort().map(x=>t.AP[x]).join(', ')],[t.kGo,[...gl].map(x=>t.GO[x]).join(t.and)||t.notSpec]];
  { const bx=$('dlg-br'), h=BR?brFull(g.t,brTypes(a.flatMap(x=>x.a)),false):''; bx.innerHTML=h; bx.hidden=!h; }
  $('dlg-kv').innerHTML=rows.map(([k,v])=>`<tr><th scope="row">${k}</th><td>${esc(v)}</td></tr>`).join('');
  dlgAp();
  if(dlg.showModal) dlg.showModal(); else dlg.setAttribute('open','');
}
$('dlg-x').addEventListener('click',()=>dlg.close());
dlg.addEventListener('click',e=>{if(e.target===dlg) dlg.close();});

S3.onPick(hk=>{ if(!S.f){ const fn=$('fnote'); if(fn){ fn.classList.remove('nudge'); void fn.offsetWidth; fn.classList.add('nudge'); } document.querySelectorAll('.pill[data-f]').forEach(b=>{b.classList.remove('pulse'); void b.offsetWidth; b.classList.add('pulse');}); return; } S.view=null; S.pin=null; S.pinG=null; if(hk){ S.h=(S.h===hk)?null:hk; } else if(S.h){ S.h=null; } else return; update(); });
S3.onHover(hk=>{ document.querySelectorAll('.mk.hov').forEach(e=>e.classList.remove('hov')); if(hk){const e=$('mk-'+hk); if(e) e.classList.add('hov');} });
document.addEventListener('mouseover',e=>{ const r=e.target.closest&&e.target.closest('.ivr'); const ng=r?REG[+r.querySelector('.iv').dataset.i]:null; if(ng!==HOVG){ HOVG=ng; refreshFx(); }
const m=e.target.closest&&e.target.closest('.mk,.gnl'); if(m&&m.dataset.h&&m.dataset.h!=='gnl') S3.hover(m.dataset.h);});
document.addEventListener('mouseout',e=>{const m=e.target.closest&&e.target.closest('.mk'); if(m&&!(e.relatedTarget&&m.contains(e.relatedTarget))) S3.hover(null);});
try{THUMB.r=S3.thumb('r',960,600);THUMB.c=S3.thumb('c',960,600);}catch(e){}
try{COVER=S3.thumbFx('r',960,600,['sedum','shade','trees','pipeins'],'heating');}catch(e){}
window.OK={itemName:k=>{ const a=DATA.filter(d=>d.t===k); return a.length?tx(group(a)[0].src,'t'):k; },openItem:k=>{ const a=DATA.filter(d=>d.t===k); if(a.length) openDlg(group(a)[0]); },openFor:(label,kw)=>{ S.mode='3d'; if(!S.b) S.b='r'; S.qa=kw; S.q=label; $('q').value=label; $('qx').hidden=false; S.h=null; S.pin=null; S.pinG=null; draw(); },cover:()=>COVER,thumb:k=>THUMB[k]||'',side:()=>!!S.sideMin,setSide:v=>{ if(!!S.sideMin!==!!v){ S.sideMin=!!v; okSide(); } },lang:()=>S.lang,setLang:l=>{ if(S.lang!==l){ S.lang=l; save(); draw(); } },h1:()=>L().h1,name:()=>L().name,home:()=>$('home').click(),refresh:()=>{ if($('stage')){ S3.resize(); frame(); } }};
draw();
addEventListener('resize',()=>{S3.resize();frame();});
const setH=()=>document.documentElement.style.setProperty('--head-h',($('head').offsetHeight+8)+'px');
setH(); addEventListener('resize',setH);
if(document.fonts&&document.fonts.ready) document.fonts.ready.then(setH);
})();
