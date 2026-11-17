(function(){
'use strict';

const YEARS = DATA.meta.years;
const KLASSE_ORDER = DATA.klasse_order;
const KLASSE_COLOR = DATA.klasse_color;
const CATS = DATA.categories;

// Alle 25 WEii-gebruikstypen zijn te selecteren. De 14 typen die er oorspronkelijk
// waren komen uit de payload; de overige 11 worden hier toegevoegd, met de
// klassegrenzen uit DATA.weii_info. Hun kentallen komen (net als die van de
// andere typen) uit recompute(). Het landelijk gemiddelde blijft berekend over
// de oorspronkelijke 14 typen (AGG_IDS): TNO-gebouwtypen die aan twee
// gebruikstypen zijn gekoppeld (bv. Winkelpand, Zorginstelling) zouden anders
// dubbel meetellen.
const AGG_IDS = new Set(CATS.map(c=>c.id));
// Samengevoegde gebruikstypen. TNO publiceert voor "winkel met en zonder
// warenkoeling" en voor "café en restaurant" geen afzonderlijke kentallen: het
// is dezelfde data. Deze paren worden daarom als één gebruikstype getoond, met
// gewogen klassegrenzen (weging naar oppervlak uit de routekaarten: 20% met /
// 80% zonder warenkoeling, 23% café / 77% restaurant). parts[0] is het
// gebruikstype waarvan het kental komt; parts[1] wordt niet apart getoond.
const MERGED = [
  {id:'Winkel', label:'Winkel*', parts:['Winkel zonder warenkoeling','Winkel met warenkoeling'], ppKeys:['Winkel','Winkel met warenkoeling'], w:[0.8,0.2],
   thr:[94,115,192,337,601],
   note:'* Samenvoeging van de gebruikstypen winkel met en winkel zonder warenkoeling; er is geen afzonderlijke data. De WEii-klassegrenzen zijn gebaseerd op het gewogen gemiddelde van beide gebruikstypen (20% met, 80% zonder warenkoeling).',
   short:'* Winkel met en zonder warenkoeling samengevoegd; gewogen klassegrenzen.'},
  {id:'Restaurant/café', label:'Café/restaurant**', parts:['Restaurant','Café'], ppKeys:['Restaurant/café','Café'], w:[0.77,0.23],
   thr:[170,229,352,593,931],
   note:'** Samenvoeging van de gebruikstypen café en restaurant; er is geen afzonderlijke data. De WEii-klassegrenzen zijn gebaseerd op het gewogen gemiddelde van beide gebruikstypen (23% café, 77% restaurant).',
   short:'** Café en restaurant samengevoegd; gewogen klassegrenzen.'}
];
const MERGED_SECOND = new Set(MERGED.map(m=>m.parts[1]));
const MERGED_BY_FIRST = {}; MERGED.forEach(m=>{ MERGED_BY_FIRST[m.parts[0]] = m; });
(function addExtraCats(){
  // gewogen Paris Proof-pad voor de samengevoegde gebruikstypen (zelfde weging als de klassegrenzen)
  MERGED.forEach(m=>{
    const a = DATA.pp_pathway[m.ppKeys[0]], b = DATA.pp_pathway[m.ppKeys[1]];
    if(!a || !b) return;
    const o = {};
    Object.keys(a).forEach(y=>{ o[y] = Math.round((m.w[0]*a[y] + m.w[1]*b[y])*100)/100; });
    DATA.pp_pathway[m.id] = o;
  });
  CATS.forEach(c=>{
    const m = MERGED.find(x=>x.id===c.id);
    if(m){ c.label = m.label; c.thresholds = [0].concat(m.thr, [null]); c.partial = false; c.merged = true; }
  });
  const have = new Set(Object.keys(DATA.cat_weii).map(k=>DATA.cat_weii[k]));
  Object.keys(DATA.weii_info).forEach(w=>{
    if(have.has(w) || MERGED_SECOND.has(w)) return;
    const info = DATA.weii_info[w];
    DATA.cat_weii[w] = w;
    CATS.push({id:w, label:w, weii_type:w, sources:[], weer_aandeel:{gas:0, elek:0},
      thresholds:[0].concat(info.thr, [null]), partial:!!info.partial, extra:true, series:{}});
  });
})();
const SELECTABLE_CATS = CATS;

// Vaste, niet-gecyclede kleurvolgorde voor de vergelijking van meerdere
// gebouwtypen (identiteit van een gebouwtype in de grafiek, los van de
// WEii-klassekleuren die daar al een andere betekenis hebben). Kleuren
// komen uit de WEii EnergieKompas grafiekkleuren (huisstijlrichtlijnen
// 8.4): Donkerblauw, Vermiljoen, Purper, hun 50%-tinten en de overdruk-
// mengkleuren, in die volgorde voor maximaal onderscheid vooraan.
const CMP_COLORS = ['#002e73','#d90000','#b21d9c','#8097b9','#ec8080','#d88ecd','#000546','#970000'];
const MAX_CHART_SERIES = 8;

// ---------- indicatoren: metadata voor de "meerdere indicatoren in één
// grafiek"-weergave ----------
// Elke indicator heeft een vaste eenheid ("group"). Per de dataviz-regel dat
// een grafiek nooit twee assen/eenheden door elkaar toont, worden geselec-
// teerde indicatoren per eenheid gegroepeerd getekend: één paneel per
// eenheid die voorkomt in de selectie (kWh/m², kg CO2/m² of %), met daarin
// een lijn per combinatie van indicator x onderwerp (landelijk gemiddelde
// en/of het geselecteerde gebouwtype). Zo blijft elke as intern vergelijk-
// baar, ook als de gebruiker bijvoorbeeld WEii + WEii-CO2 + dekkingsgraad
// tegelijk aanvinkt.
const METRICS = [
  {key:'weii', label:'WEii', unit:'kWh/m²', group:'kwh', color:'#002e73',
   title:'De hoofdmeter-gebaseerde WEii-score (exclusief eigenverbruik zonnestroom) waarop de klassegrenzen (WENG t/m Zeer onzuinig, incl. Paris Proof) zijn gedefinieerd.'},
  {key:'finaal', label:'WEii-finaal', unit:'kWh/m²', group:'kwh', color:'#1d5fa8',
   title:'Overige indicator uit het protocol (§8.1): het finale energiegebruik, WEii plus de lokale zonopwek per m². Ontbreekt voor gebouwtypen/jaren zonder betrouwbaar zonopwek-kental.'},
  {key:'gas', label:'WEii-gas', unit:'kWh/m²', group:'kwh', color:'#0f8b8d', title:''},
  {key:'zon', label:'Zonne-opwek', unit:'kWh/m²', group:'kwh', color:'#c98a00',
   title:'Gewogen gemiddelde zonnestroomproductie per m² uit de TNO-kentallenset. Voor sommige gebouwtypen/jaren ontbreekt een betrouwbaar kental omdat te weinig panden in de steekproef zonnestroom hadden.'},
  {key:'co2', label:'WEii-CO₂', unit:'kg CO₂/m²', group:'co2', color:'#4a5568',
   title:'Overige indicator uit het protocol (§8.3): de CO₂-emissie per m² die hoort bij het werkelijke energiegebruik. Berekend met de jaarlijks vastgestelde CO₂-emissiefactoren voor aardgas en elektriciteit (WEii.nl) - deze dalen van jaar op jaar doordat de elektriciteitsmix schoner wordt.'},
  {key:'dekkingsgraad', label:'WEii-dekkingsgraad', unit:'%', group:'pct', color:'#1a6e3c',
   title:'Overige indicator uit het protocol (§8.5): het aandeel van het finale energiegebruik dat wordt gedekt door zelf opgewekte en direct verbruikte zonnestroom (eigenverbruik ÷ WEii-finaal x 100%). Ontbreekt voor gebouwtypen/jaren zonder betrouwbaar zonopwek-kental.'},
  {key:'benuttingsfactor', label:'WEii-benuttingsfactor', unit:'%', group:'pct', color:'#8a6d00',
   title:'Overige indicator uit het protocol (§8.6): het aandeel van de lokaal opgewekte zonnestroom dat direct zelf wordt verbruikt in plaats van teruggeleverd (eigenverbruik ÷ zonopwek x 100%). Ontbreekt voor gebouwtypen/jaren zonder betrouwbaar zonopwek-kental.'},
];
const METRIC_BY_KEY = {};
METRICS.forEach(m=>{ METRIC_BY_KEY[m.key] = m; });
const GROUP_LABEL = {kwh:'kWh/m²', co2:'kg CO₂/m²', pct:'%'};
const GROUP_ORDER = ['kwh','co2','pct'];

const LATEST_YEAR = YEARS[YEARS.length-1];

// CO2-emissiefactoren, PER JAAR - niet één vaste waarde. Het protocol is
// hier expliciet over (§8.3): "De emissiefactoren worden per jaar
// vastgesteld (...) omdat verduurzaming van de energiedragers de
// emissiefactor doet veranderen. De jaarlijks geactualiseerde
// emissiefactoren worden gegeven op WEii.nl." De elektriciteitsmix is in
// 2020-2024 flink schoner geworden, dus een vaste factor voor alle jaren
// zou zowel de absolute WEii-CO2-waarden als de dalende trend verkeerd
// weergeven. Bron: WEii.nl, "CO2-emissiefactoren" (zelf weer gebaseerd op
// CO2emissiefactoren.nl, WTW).
const CO2_FACTOR_GAS = {2020:1.884, 2021:2.085, 2022:2.079, 2023:2.134, 2024:2.134};   // kg CO2 / m3 aardgas
const CO2_FACTOR_ELEK = {2020:0.475, 2021:0.427, 2022:0.337, 2023:0.328, 2024:0.268};  // kg CO2 / kWh elektriciteit

// Paris Proof-pad: het VOLLEDIGE officiële DGBC-pad ("Paris Proof paden
// energie - prognose 2025"), per gebouwtype 5 ankerjaren: 2020 (routekaart-
// basisjaar), 2025 (Zuinig), 2030 (Zeer zuinig), 2040 (Paris Proof), vlak
// t/m 2050. Het pad is piecewise-lineair tussen deze ankers (empirisch
// geverifieerd tegen de volledige 2013-2050 brondata), dus deze 5 punten per
// gebouwtype tekenen het hele pad exact - zie DATA.pp_pathway (gevuld door
// extract_pp_pathway.py) en process_final4.py.
// Let op: het routekaart-basisjaar 2020 van dit officiële pad is NIET
// hetzelfde getal als de werkelijke, uit de TNO-kentallen berekende WEii
// voor 2020 die verder in dit dashboard wordt getoond (voor de meeste
// gebouwtypen ligt de routekaart-2020-waarde hoger/ongunstiger dan het
// TNO-gemeten 2020-gemiddelde) - vermoedelijk een verschil in onderliggende
// bronmethodiek tussen de DGBC-routekaart en de TNO-benchmark. Zie de
// toelichting in de methodiek-sectie.
const PP_ANCHOR_YEARS = [2020, 2025, 2030, 2040, 2050];
const PP_ANCHOR_LABEL = {2025:'Zuinig', 2030:'Zeer zuinig', 2040:'Paris Proof'};
const PP_FINAL_YEAR = 2050;

const state = {
  year: YEARS[YEARS.length-1],
  // Geen tabs meer: één grafiekveld. Start met het totaalbeeld (landelijk
  // gemiddelde), zonder vooraf geselecteerde gebouwtypen - de gebruiker voegt
  // die er zelf aan toe.
  selectedIds: new Set(),
  mode: 'staaf', // 'lijn' (trendlijn, incl. landelijk gemiddelde) of 'staaf' (staafdiagram per jaar)
  search: '', // zoekterm in de gebouwtype-dropdown
  // meerdere indicatoren tegelijk selecteerbaar (zie METRICS hierboven); de
  // trendlijn tekent een apart paneel per eenheid die in deze set voorkomt.
  // Standaard alleen WEii, zodat de eerste weergave ongewijzigd blijft.
  metrics: new Set(['weii']),
  showParisProof: false,
  showCrrem: false,
  // Landelijk gemiddelde: in de trendlijn standaard aan, in het staafdiagram per jaar
  // standaard uit. Elke weergave onthoudt zijn eigen keuze; de dropdown wijzigt die
  // van de actieve weergave.
  showLandelijkLijn: true,
  showLandelijkStaaf: false,
  get showLandelijk(){ return this.mode==='staaf' ? this.showLandelijkStaaf : this.showLandelijkLijn; },
  set showLandelijk(v){ if(this.mode==='staaf') this.showLandelijkStaaf = v; else this.showLandelijkLijn = v; },
};

// ---------- helpers ----------
function nlInt(v){ return Math.round(v).toLocaleString('nl-NL'); }
function nl1(v){ return v.toLocaleString('nl-NL', {minimumFractionDigits:1, maximumFractionDigits:1}); }
function klasseColor(k){ return KLASSE_COLOR[k] || 'var(--text3)'; }
function catById(id){ return CATS.find(c=>c.id===id); }
function catHasData(cat){ return YEARS.some(y=>{ const s = cat.series[String(y)]; return s && hasVal(s.weii); }); }
function seriesAt(cat, year){ return cat.series[String(year)]; }

// Voor de meeste indicatoren is een DALING een verbetering ("besparing": minder
// energiegebruik, CO2-uitstoot of zonopwek-afhankelijkheid). Voor
// WEii-dekkingsgraad en WEii-benuttingsfactor geldt het omgekeerde: een
// STIJGING is de verbetering (een groter deel van het energiegebruik wordt
// gedekt door eigen zonnestroom, resp. een groter deel van de zonopwek wordt
// zelf benut). trendText() hieronder houdt hier voor elke indicator-key
// rekening mee - zowel in het label ("Besparing" vs "Toename") als in de
// kleur (groen/rood): de pijl zelf toont altijd de werkelijke richting
// (↑ bij toename, ↓ bij afname), de kleur toont of die richting goed is.
const HIGHER_IS_BETTER = {dekkingsgraad:true, benuttingsfactor:true};
function trendLabelFor(key){ return HIGHER_IS_BETTER[key] ? 'Toename' : 'Besparing'; }
function trendText(v0, vLast, key){
  if(!hasVal(v0) || !hasVal(vLast) || v0===0) return {text:'–', cls:''};
  const changePct = (vLast/v0 - 1)*100; // werkelijke verandering, positief = toename
  const higherBetter = !!HIGHER_IS_BETTER[key];
  const isGood = higherBetter ? changePct>=0 : changePct<=0;
  const arrow = changePct>=0 ? '↑' : '↓';
  return {text: arrow+' '+nl1(Math.abs(changePct))+'%', cls: isGood?'good':'bad'};
}
const CHECK_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';

// ---------- weergave-metric: WEii / WEii-finaal / WEii-gas / WEii-CO2 / Zonne-opwek ----------
// Eén plek die bepaalt welk getal er wordt getoond, zodat grafiek, tabel,
// tooltips en de staafdiagramsortering altijd hetzelfde laten zien.
//
// Let op het onderscheid uit het WEii-protocol (§3 Symbolen, §6.1 Vergelijking 2,
// §8.1): "WEii" is de hoofdmeter-gebaseerde indicator (het werkelijke
// energiegebruik, exclusief eigenverbruik van lokaal opgewekte zonnestroom) -
// dit is de score waarop de klassegrenzen (WENG t/m Zeer onzuinig, en dus ook
// Paris Proof) zijn gedefinieerd. "WEii-finaal" is een aparte, in hoofdstuk 8
// als "overige indicator" beschreven grootheid: het finale energiegebruik,
// dat de energie afgenomen van het net plus de lokale opwek omvat (dus vóór
// aftrek van eigenverbruik zon-pv). Uit Vergelijking 2/Figuur 2 van het
// protocol volgt exact: WEii-finaal = WEii + lokale zonopwek per m² (de P uit
// E_finaal = E + P - T, met WEii = (E-T)/Ag). De TNO-kentallen die dit
// dashboard gebruikt zijn zelf al hoofdmeter-gebaseerd (exclusief
// eigenverbruik zonnestroom), dus de kentallen-WEii ligt vast en WEii-finaal
// wordt hieruit afgeleid door de zonopwek-kentallen erbij op te tellen.

// Tabel in de Methodiek: koppeling dashboard-gebouwtype -> CRREM-pandtype
function renderCrremMap(){
  const wrap = document.getElementById('crrem-map-wrap');
  if(!wrap) return;
  const rows = DATA.categories.slice().sort((a,b)=>a.label.localeCompare(b.label,'nl')).map(c=>{
    const x = crremFor(c);
    const v = (k,y)=> x && x[k] && x[k][String(y)]!==undefined ? nlInt(x[k][String(y)]) : '–';
    return '<tr><td>'+c.label+'</td><td>'+(x ? x.type_label+(x.approx?' (benadering)':'') : 'geen vergelijkbaar type')+'</td><td>'+v('kwh',2030)+'</td><td>'+v('kwh',2050)+'</td></tr>';
  }).join('');
  wrap.innerHTML = '<div class="wa-scroll"><table class="wa-table"><thead><tr><th>Gebouwtype</th><th>CRREM-pandtype</th><th>2030 (kWh/m²)</th><th>2050 (kWh/m²)</th></tr></thead><tbody>'+rows+'</tbody></table></div>';
}

function hasVal(v){ return v!==null && v!==undefined && !Number.isNaN(v); }
// Let op: WEii-CO2 gebruikt bewust het RUWE (niet-weerscorrigeerde) gaskental
// (s.gas_kental_m3_raw), niet het weerscorrigeerde s.gas_kental_m3 dat WEii/
// WEii-gas/WEii-finaal gebruiken. Het protocol is hier expliciet over (§8.3):
// "De correcties voor weersomstandigheden worden niet betrokken in de
// berekening van WEii_CO2."
function co2Value(s, year){
  const fGas = CO2_FACTOR_GAS[year], fElek = CO2_FACTOR_ELEK[year];
  if(!hasVal(s.gas_kental_m3_raw) || !hasVal(s.elek_kental_kwh) || fGas===undefined || fElek===undefined) return null;
  return s.gas_kental_m3_raw*fGas + s.elek_kental_kwh*fElek;
}
function weiiFinaalValue(s){ return (hasVal(s.weii) && hasVal(s.opwek_kwh)) ? s.weii + s.opwek_kwh : null; }
// WEii_dekkingsgraad en WEii_benuttingsfactor (protocol §8.5/8.6, Vergelijking
// 14/15): beide zijn uit te drukken in P (lokale zonopwek, = s.opwek_kwh) en
// het "eigenverbruik" van die zonopwek (P-T, het deel dat in het gebouw zelf
// wordt benut i.p.v. teruggeleverd). s.eigenverbruik_kwh is dat eigenverbruik,
// afgeleid uit het verschil tussen de TNO-elektriciteitskentallen inclusief en
// exclusief eigenverbruik zonnestroom (zie process3.py) - beide al met
// pandoppervlak resp. aantal panden gewogen, dus deze aftrekking is zelf ook
// een gewogen-gemiddelde grootheid.
//   dekkingsgraad     = (P-T) / (E+P-T) * 100%  =  eigenverbruik / WEii-finaal * 100%
//   benuttingsfactor  = (P-T) / P       * 100%  =  eigenverbruik / P * 100%
function dekkingsgraadValue(s){
  const finaal = weiiFinaalValue(s);
  return (hasVal(s.eigenverbruik_kwh) && hasVal(finaal) && finaal>0) ? s.eigenverbruik_kwh/finaal*100 : null;
}
function benuttingsfactorValue(s){
  return (hasVal(s.eigenverbruik_kwh) && hasVal(s.opwek_kwh) && s.opwek_kwh>0) ? s.eigenverbruik_kwh/s.opwek_kwh*100 : null;
}
// ---------- generieke, per-indicator (key) waarde/label/eenheid/notatie ----------
// Eén plek die bepaalt welk getal er per indicator wordt getoond, zodat
// grafiekpanelen, tabellen, tooltips en de staafdiagramsortering altijd
// hetzelfde laten zien - nu geparametriseerd op de indicator-key in plaats
// van op één globale state.metric, zodat meerdere indicatoren tegelijk
// getoond kunnen worden.
function metricValueForKey(cat, year, key){
  const s = seriesAt(cat, year);
  if(cat.id === '__agg__') return s.values[key];
  if(key === 'gas') return s.weii_gas;
  if(key === 'co2') return co2Value(s, year);
  // Zonne-opwek (kWh/m²) ontbreekt voor gebouwtypen/jaren met te weinig
  // panden met zonnestroom voor een betrouwbaar kental (privacyregels TNO) -
  // dan is s.opwek_kwh null, en toont de UI een streepje in plaats van 0.
  if(key === 'zon') return hasVal(s.opwek_kwh) ? s.opwek_kwh : null;
  if(key === 'finaal') return weiiFinaalValue(s);
  if(key === 'dekkingsgraad') return dekkingsgraadValue(s);
  if(key === 'benuttingsfactor') return benuttingsfactorValue(s);
  return s.weii;
}
function metricUnitForKey(key){ return (METRIC_BY_KEY[key]||METRIC_BY_KEY.weii).unit; }
function metricLabelForKey(key){ return (METRIC_BY_KEY[key]||METRIC_BY_KEY.weii).label; }
function formatValueForKey(key, v){
  if(!hasVal(v)) return '–';
  return (key==='co2' || key==='zon' || key==='dekkingsgraad' || key==='benuttingsfactor') ? nl1(v) : nlInt(v);
}
// Landelijk gemiddelde per indicator: voor WEii ligt dit al vast (DATA.aggregate,
// zelf al een naar geschat gebouwoppervlak gewogen gemiddelde over de 14 gebouwtypen).
// Voor WEii-finaal, WEii-gas, CO2, zonne-opwek, dekkingsgraad en
// benuttingsfactor is er geen apart landelijk kental gepubliceerd, dus wordt
// dat (bij benadering) herleid als het naar geschat gebouwoppervlak gewogen gemiddelde
// over de gebouwtypen die voor dat jaar een waarde hebben (niet alle 14
// gebouwtypen hebben elk jaar een betrouwbaar zonopwek-kental, en
// dekkingsgraad/benuttingsfactor zijn daarom net als WEii-finaal alleen
// gedefinieerd waar dat wel het geval is).
const _aggCache = {};
function aggMetricValuesForKey(key){
  if(_aggCache[key]) return _aggCache[key];
  const out = YEARS.map(y=>{
    if(key === 'weii') return DATA.aggregate[String(y)].weii;
    let num = 0, den = 0;
    CATS.forEach(cat=>{
      if(!AGG_IDS.has(cat.id)) return;
      const s = seriesAt(cat, y);
      const v = key==='gas' ? s.weii_gas
        : key==='co2' ? co2Value(s, y)
        : key==='finaal' ? weiiFinaalValue(s)
        : key==='dekkingsgraad' ? dekkingsgraadValue(s)
        : key==='benuttingsfactor' ? benuttingsfactorValue(s)
        : (hasVal(s.opwek_kwh) ? s.opwek_kwh : null);
      const wgt = hasVal(s.gewicht_m2) && s.gewicht_m2>0 ? s.gewicht_m2 : s.aantal_panden;
      if(hasVal(v) && wgt){ num += v*wgt; den += wgt; }
    });
    return den ? num/den : null;
  });
  _aggCache[key] = out;
  return out;
}
// Vaste volgorde van geselecteerde indicatoren (onafhankelijk van de klikvolgorde
// in de dropdown), gebruikt om her en der een "hoofdindicator" te kiezen
// (staafdiagram, gebouwtype-dropdown-sortering) zonder dat alle call-sites
// meerdere indicatoren tegelijk hoeven te verwerken.
function selectedMetricKeys(){ return METRICS.filter(m=>state.metrics.has(m.key)).map(m=>m.key); }
function primaryMetricKey(){ const ks = selectedMetricKeys(); return ks.length ? ks[0] : 'weii'; }
// Compat-wrappers op de hoofdindicator, voor plekken die maar één getal per
// gebouwtype/jaar tonen (staafdiagram, gebouwtype-dropdown-lijst).
function metricValue(cat, year){ return metricValueForKey(cat, year, primaryMetricKey()); }
function metricUnit(){ return metricUnitForKey(primaryMetricKey()); }
function metricLabel(){ return metricLabelForKey(primaryMetricKey()); }
function formatMetricValue(v){ return formatValueForKey(primaryMetricKey(), v); }
function aggMetricValues(){ return aggMetricValuesForKey(primaryMetricKey()); }

// ---------- tooltip ----------
const ttEl = document.getElementById('tooltip');
function showTooltip(x, y, html){
  ttEl.innerHTML = html;
  ttEl.classList.add('show');
  const rect = ttEl.getBoundingClientRect();
  let left = x + 14, top = y - rect.height/2;
  if(left + rect.width > window.innerWidth - 10) left = x - rect.width - 14;
  if(top < 10) top = 10;
  if(top + rect.height > window.innerHeight - 10) top = window.innerHeight - rect.height - 10;
  ttEl.style.left = left+'px';
  ttEl.style.top = top+'px';
}
function hideTooltip(){ ttEl.classList.remove('show'); }

// ---------- SVG helpers ----------
const SVGNS = 'http://www.w3.org/2000/svg';
function svgEl(tag, attrs){
  const el = document.createElementNS(SVGNS, tag);
  for(const k in attrs) el.setAttribute(k, attrs[k]);
  return el;
}

// ---------- year tabs (inline jaarkiezer, alleen zichtbaar in staafdiagram-modus) ----------
function renderYearTabs(){
  document.querySelectorAll('.year-tabs').forEach(wrap=>{
    wrap.innerHTML = '';
    YEARS.forEach(y=>{
      const b = document.createElement('button');
      b.className = 'year-tab' + (y===state.year ? ' on' : '');
      b.textContent = y;
      b.type = 'button';
      b.addEventListener('click', ()=>{ state.year = y; renderAll(); });
      wrap.appendChild(b);
    });
  });
}

// sorteerwaarde voor het vergelijken van (mogelijk) ontbrekende kentallen:
// gebouwtypen zonder waarde (bv. zonne-opwek zonder betrouwbaar kental)
// zakken onderin de lijst i.p.v. de sortering te breken.
function sortVal(v){ return hasVal(v) ? v : Infinity; }

// ---------- dropdown: gebouwtypen toevoegen (vervangt de linker balk/lijst) ----------
function sortedFilteredCats(){
  const q = state.search.trim().toLowerCase();
  const list = SELECTABLE_CATS.filter(c=> !q || c.label.toLowerCase().includes(q) || c.weii_type.toLowerCase().includes(q));
  const y = state.year;
  return list.slice().sort((a,b)=>sortVal(metricValue(a,y)) - sortVal(metricValue(b,y)));
}

function toggleSelect(id){
  if(state.selectedIds.has(id)) state.selectedIds.delete(id);
  else state.selectedIds.add(id);
  renderCatDropdownList();
  updateCatDropdownButtonLabel();
  updatePathwayControlsState();
  renderChart();
  renderTable();
}

function updateCatDropdownButtonLabel(){
  const label = document.getElementById('cat-dropdown-label');
  if(label) label.textContent = 'Selecteer gebouwtype';
}

function renderCatDropdownList(){
  const listWrap = document.getElementById('cat-dropdown-list');
  const list = sortedFilteredCats();
  listWrap.innerHTML = '';
  if(list.length===0 && !('landelijk gemiddelde'.includes(state.search.trim().toLowerCase()))){
    listWrap.innerHTML = '<div class="cat-dropdown-empty">Geen gebouwtypen gevonden.</div>';
    return;
  }
  const q0 = state.search.trim().toLowerCase();
  if(!q0 || 'landelijk gemiddelde'.includes(q0)){
    const aggVal = aggMetricValuesForKey(primaryMetricKey())[YEARS.indexOf(state.year)];
    const it = document.createElement('div');
    it.className = 'cat-dropdown-item' + (state.showLandelijk ? ' active' : '');
    it.innerHTML =
      '<span class="ci-check">'+(state.showLandelijk?CHECK_SVG:'')+'</span>'+
      '<span class="ci-dot" style="background:transparent"></span>'+
      '<span class="cdi-name">Landelijk gemiddelde</span>'+
      '<span class="cdi-val">'+formatMetricValue(aggVal)+'</span>';
    it.addEventListener('click', (e)=>{
      e.stopPropagation();
      state.showLandelijk = !state.showLandelijk;
      renderCatDropdownList(); updateCatDropdownButtonLabel(); renderChart(); renderTable();
    });
    listWrap.appendChild(it);
  }
  list.forEach(cat=>{
    const s = seriesAt(cat, state.year);
    const isActive = state.selectedIds.has(cat.id);
    const item = document.createElement('div');
    item.className = 'cat-dropdown-item' + (isActive ? ' active' : '');
    item.innerHTML =
      '<span class="ci-check">'+(isActive?CHECK_SVG:'')+'</span>'+
      '<span class="ci-dot" style="background:'+klasseColor(s.klasse)+'"></span>'+
      '<span class="cdi-name">'+cat.label+(catHasData(cat) ? '' : ' <span class="cdi-tag">geen TNO-data</span>')+'</span>'+
      '<span class="cdi-val">'+formatMetricValue(metricValue(cat, state.year))+'</span>';
    // stopPropagation: dit item wordt bij toggleSelect() meteen opnieuw
    // getekend (innerHTML-vervanging), zodat e.target los van de boom komt
    // te staan vóór de klik omhoog bubbelt - zonder stopPropagation zou de
    // documentbrede "klik-buiten-sluit-dropdown"-listener dat verkeerd als
    // een klik buiten de dropdown interpreteren en het paneel dus sluiten.
    item.addEventListener('click', (e)=>{ e.stopPropagation(); toggleSelect(cat.id); });
    listWrap.appendChild(item);
  });
  MERGED.filter(m=>list.some(c=>c.id===m.id)).forEach(m=>{
    const f = document.createElement('div');
    f.className = 'cat-dropdown-empty';
    f.style.cssText = 'padding:6px 8px 0;font-size:11px;line-height:1.35;';
    f.textContent = m.short;
    listWrap.appendChild(f);
  });
}

// ---------- grafiekveld: modus-schakelaar (trendlijn / staafdiagram) ----------
// Eén grafiekveld voor het hele dashboard: renderChart() tekent afhankelijk
// van state.mode een trendlijn (landelijk gemiddelde + zelf toegevoegde
// gebouwtypen) of een staafdiagram (alle gebouwtypen in één jaar, gekleurd
// naar WEii-klasse). renderChartLegend() vult de legenda die daarbij past.
function renderChartLegend(){
  // beide modi tekenen hun legenda per paneel (naast de paneeltitel), dus de
  // gedeelde legenda-balk boven het grafiekveld blijft leeg.
  const wrap = document.getElementById('chart-legend');
  wrap.innerHTML = '';
}

function renderChart(){
  const holder = document.getElementById('chart-wrap');
  const noteEl = document.getElementById('chart-note');
  holder.innerHTML = '';
  noteEl.textContent = '';
  renderChartLegend();
  if(state.mode === 'staaf') renderBarPanels(holder, noteEl);
  else renderTrendPanels(holder, noteEl);
  // voetnoten bij samengevoegde gebruikstypen (Winkel*, Café/restaurant**) die in beeld zijn
  let shown;
  if(state.mode === 'staaf'){ const ks = selectedMetricKeys(); shown = sortedBarSubjects(ks, ks.length>1); }
  else shown = Array.from(state.selectedIds).map(catById).filter(Boolean);
  MERGED.filter(m=>shown.some(c=>c.id===m.id)).forEach(m=>{
    const d = document.createElement('div');
    d.className = 'merged-note';
    d.style.marginTop = '6px';
    d.textContent = m.note;
    noteEl.appendChild(d);
  });
}

// ---------- staafdiagram per jaar: alle gebouwtypen van één jaar, gerangschikt ----------
// Eén balk per gebouwtype in het gekozen jaar (jaartabs), laagste waarde bovenaan.
// Zonder selectie staan alle gebouwtypen met kentallen in beeld; met een selectie
// alleen de gekozen gebouwtypen. Bij één indicator kleurt elke balk naar de
// WEii-klasse van dat gebouwtype (de klassegrenzen zijn op WEii gedefinieerd).
// Bij meerdere indicatoren staat alles van één gebouwtype bij elkaar: per
// gebouwtype een balk per indicator, met een eigen schaal per eenheid.
const AGG_BAR_FILL = 'var(--text2)';
// withAgg: het landelijk gemiddelde (als aangevinkt) als extra onderwerp meenemen.
// In het staafdiagram met één indicator is dat een stippellijn, geen balk; in de
// tabel en bij meerdere indicatoren is het een eigen rij/groep.
function sortedBarSubjects(keys, withAgg){
  const sel = Array.from(state.selectedIds).map(catById).filter(Boolean);
  const types = sel.length ? sel : SELECTABLE_CATS.filter(catHasData);
  const first = keys[0];
  const rank = c => { const v = metricValueForKey(c, state.year, first); return hasVal(v) ? v : Infinity; };
  const list = (withAgg && state.showLandelijk) ? types.concat([aggPseudoCat()]) : types;
  return list.map((c,i)=>({c:c, i:i, v:rank(c)})).sort((a,b)=>{
    if(a.v===b.v) return a.i-b.i;
    return a.v<b.v ? -1 : 1;
  }).map(o=>o.c);
}
function niceScale(xMax){
  if(!(xMax>0)) xMax = 1;
  const rawStep = xMax/4;
  const mag = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const step = [1,2,2.5,5,10].map(m=>m*mag).find(st=>st>=rawStep) || mag*10;
  return {xMax: Math.ceil(xMax*1.02/step)*step, step: step};
}
function legendItemHTML(color, text, extra){
  return '<span class="legend-item"><span class="dot" style="background:'+color+(extra||'')+'"></span>'+text+'</span>';
}
function barTooltipHTML(cat, keys){
  const y = state.year;
  const sy = seriesAt(cat, y);
  let h = '<div class="tt-title">'+cat.label+' · '+y+'</div>';
  keys.forEach(key=>{
    const m = METRIC_BY_KEY[key];
    const v = metricValueForKey(cat, y, key);
    h += '<div class="tt-row"><span>'+m.label+'</span><span class="tt-strong">'+(hasVal(v) ? formatValueForKey(key, v)+' '+m.unit : 'geen kental beschikbaar')+'</span></div>';
  });
  if(sy && sy.klasse && keys.includes('weii')) h += '<div class="tt-row"><span>Klasse</span><span class="tt-strong">'+sy.klasse+'</span></div>';
  if(sy && hasVal(sy.gas_kental_m3)) h += '<div class="tt-row"><span>Gas</span><span class="tt-strong">'+nl1(sy.gas_kental_m3)+' m³/m²</span></div>';
  if(sy && hasVal(sy.elek_kental_kwh)) h += '<div class="tt-row"><span>Elektriciteit</span><span class="tt-strong">'+nl1(sy.elek_kental_kwh)+' kWh/m²</span></div>';
  keys.forEach(key=>{
    const t = trendText(metricValueForKey(cat, YEARS[0], key), metricValueForKey(cat, y, key), key);
    if(t.text!=='–' && y!==YEARS[0]) h += '<div class="tt-row"><span>'+(keys.length>1 ? metricLabelForKey(key)+' ' : '')+trendLabelFor(key).toLowerCase()+' vs '+YEARS[0]+'</span><span class="tt-strong">'+t.text+'</span></div>';
  });
  return h;
}
function renderBarPanels(holder, noteEl){
  const keys = selectedMetricKeys();
  const multi = keys.length>1;
  const subjects = sortedBarSubjects(keys, multi);
  const aggLine = (!multi && state.showLandelijk) ? aggPseudoCat() : null;
  const y = state.year;
  const notes = [];
  if(subjects.length===0) notes.push('Er zijn geen gebouwtypen met kentallen om te tonen. Voeg een gebouwtype toe of vink het landelijk gemiddelde aan.');
  if(multi) notes.push('Alles van één gebouwtype staat bij elkaar. Elke indicator heeft een eigen schaal (kWh/m², kg CO₂/m² of %); indicatoren met dezelfde eenheid delen één schaal.' + (keys.includes('weii') ? ' De WEii-balken hebben de kleur van de WEii-klasse; de andere indicatoren hebben elk een eigen kleur, omdat alleen WEii in klassen is ingedeeld.' : ''));
  else if(keys[0]!=='weii') notes.push('Alleen WEii heeft klassen (WENG t/m Zeer onzuinig). Bij deze indicator hebben alle balken daarom dezelfde kleur.');
  if(keys.some(k=>k==='zon' || k==='finaal' || k==='dekkingsgraad' || k==='benuttingsfactor')){
    notes.push('Een gestippeld streepje aan de basislijn betekent dat TNO voor dat jaar/gebouwtype geen betrouwbaar zonopwek-kental publiceert (te weinig panden met zonnestroom), waardoor WEii-finaal, WEii-dekkingsgraad en WEii-benuttingsfactor daar dan ook niet te berekenen zijn.');
  }
  if(keys.includes('finaal')){
    notes.push('Het landelijk gemiddelde voor WEii-finaal is berekend over alleen de gebouwtypen met een zonopwek-kental in dat jaar.');
  }
  const leeg = subjects.filter(c=>c.id!=='__agg__' && !catHasData(c)).map(c=>c.label);
  if(leeg.length) notes.push('Voor ' + leeg.join(', ') + ' is geen TNO-gebouwtype gekoppeld, dus er zijn geen kentallen. Koppel er een onder Settings.');
  noteEl.textContent = notes.join(' ');

  // legenda boven het diagram
  const legendEl = document.getElementById('chart-legend');
  legendEl.innerHTML = '';
  if(multi || keys[0]!=='weii'){
    keys.forEach(k=>{
      const m = METRIC_BY_KEY[k];
      if(k==='weii'){
        // WEii heeft klassen: de balken krijgen de kleur van de WEii-klasse
        legendEl.insertAdjacentHTML('beforeend', '<span class="legend-item" style="font-weight:500"><span>WEii <span style="color:var(--text3);font-weight:400">('+m.unit+')</span>:</span></span>');
        KLASSE_ORDER.forEach(kl=>legendEl.insertAdjacentHTML('beforeend', legendItemHTML(klasseColor(kl), kl)));
        if(subjects.some(c=>{ const sc = seriesAt(c, y); return sc && sc.klasse==='Onbekend'; })) legendEl.insertAdjacentHTML('beforeend', legendItemHTML(klasseColor('Onbekend'), 'Onbekend'));
      } else legendEl.insertAdjacentHTML('beforeend', legendItemHTML(m.color, m.label+' <span style="color:var(--text3)">('+m.unit+')</span>', ';border-radius:2px'));
    });
  } else {
    KLASSE_ORDER.forEach(k=>legendEl.insertAdjacentHTML('beforeend', legendItemHTML(klasseColor(k), k)));
    if(subjects.some(c=>{ const s = seriesAt(c, y); return s && s.klasse==='Onbekend'; })){
      legendEl.insertAdjacentHTML('beforeend', legendItemHTML(klasseColor('Onbekend'), 'Onbekend'));
    }
  }
  if(aggLine){
    legendEl.insertAdjacentHTML('beforeend', '<span class="legend-item"><span class="legend-line" style="border-top:2px dashed var(--text2)"></span>Landelijk gemiddelde</span>');
  }
  if(subjects.length===0) return;

  // schaal per eenheid, gedeeld over alle gebouwtypen in het gekozen jaar
  const units = GROUP_ORDER.filter(g=>keys.some(k=>METRIC_BY_KEY[k].group===g));
  const scales = {};
  units.forEach(g=>{
    let xMax = 0;
    subjects.forEach(c=>keys.forEach(k=>{ if(METRIC_BY_KEY[k].group!==g) return; const v = metricValueForKey(c, y, k); if(hasVal(v) && v>xMax) xMax = v; }));
    scales[g] = niceScale(xMax);
  });

  const W = Math.max(300, holder.clientWidth || 900);
  const narrow = W < 560;
  const stack = narrow;   // smal scherm: naam boven de balk(en) i.p.v. ernaast
  const padL = stack ? 4 : Math.min(250, Math.round(W*0.27));
  const padR = multi ? (narrow ? 84 : 96) : (narrow ? 40 : 56);
  const plotW = W - padL - padR;
  const barH = multi ? 14 : 20, barGap = 3, rowGap = multi ? 16 : 14;
  const labelH = stack ? 17 : 0;
  const groupH = labelH + (multi ? keys.length*barH + (keys.length-1)*barGap : barH);
  const aggV = aggLine ? metricValueForKey(aggLine, y, keys[0]) : null;
  const showAgg = aggLine && hasVal(aggV);
  const top = showAgg ? 24 : 6, axisRowH = stack ? 34 : 22;
  const bodyH = subjects.length*groupH + (subjects.length-1)*rowGap;
  const height = top + bodyH + 12 + units.length*axisRowH;
  const baseX = padL;

  const svg = svgEl('svg', {width:'100%', height:height, viewBox:'0 0 '+W+' '+height, style:'max-width:100%;display:block;'});
  const maxChars = stack ? 60 : Math.max(8, Math.floor((padL-12)/6.4));

  // raster (alleen bij één eenheid; bij meerdere eenheden zijn de schalen verschillend)
  if(units.length===1){
    const sc = scales[units[0]];
    for(let v=0; v<=sc.xMax+1e-9; v+=sc.step){
      const x = baseX + v/sc.xMax*plotW;
      svg.appendChild(svgEl('line', {x1:x, x2:x, y1:top-4, y2:top+bodyH+4, class:'grid-line'}));
    }
  }
  // landelijk gemiddelde als stippellijn (alleen bij één indicator)
  if(showAgg){
    const sc = scales[METRIC_BY_KEY[keys[0]].group];
    const ax = baseX + Math.min(aggV, sc.xMax)/sc.xMax*plotW;
    const txt = 'Landelijk gemiddelde ' + formatValueForKey(keys[0], aggV);
    const anchor = ax > W - 150 ? 'end' : 'start';
    svg.appendChild(svgEl('line', {x1:ax, x2:ax, y1:top-12, y2:top+bodyH+4, stroke:'var(--text2)', 'stroke-width':1.5, 'stroke-dasharray':'5,4'}));
    const lt = svgEl('text', {x:ax+(anchor==='end'?-6:6), y:top-9, class:'axis-label', 'text-anchor':anchor, style:'fill:var(--text2);font-weight:500;'});
    lt.textContent = txt;
    svg.appendChild(lt);
  }
  // as-labels: één rij per eenheid onder de balken
  units.forEach((g,gi)=>{
    const sc = scales[g];
    const ay = top + bodyH + 18 + gi*axisRowH;
    const ul = svgEl('text', {x:4, y:stack ? ay+14 : ay, class:'axis-label', style:'font-weight:500;'});
    ul.textContent = GROUP_LABEL[g];
    svg.appendChild(ul);
    for(let v=0; v<=sc.xMax+1e-9; v+=sc.step){
      const x = baseX + v/sc.xMax*plotW;
      const t = svgEl('text', {x:x, y:ay, class:'axis-label', 'text-anchor':'middle'});
      t.textContent = (g==='kwh' ? nlInt(v) : nl1(v).replace(/,0$/,''));
      svg.appendChild(t);
    }
  });

  subjects.forEach((cat, si)=>{
    const gy = top + si*(groupH+rowGap);
    const isAgg = cat.id==='__agg__';
    const sy = seriesAt(cat, y);
    const g = svgEl('g', {'class':'bar-col-group'});
    // naam links, verticaal gecentreerd bij het gebouwtype
    const nm = svgEl('text', {x:4, y:stack ? gy+11 : gy+groupH/2+4, class:'bar-name', style:'paint-order:stroke;stroke:var(--white);stroke-width:3px;stroke-linejoin:round;'+(isAgg ? 'font-weight:600;fill:var(--text);' : '')});
    nm.textContent = cat.label.length>maxChars ? cat.label.slice(0, maxChars-1)+'…' : cat.label;
    g.appendChild(nm);
    keys.forEach((key, ki)=>{
      const m = METRIC_BY_KEY[key];
      const sc = scales[m.group];
      const v = metricValueForKey(cat, y, key);
      const by = gy + labelH + ki*(barH+barGap);
      const fill = isAgg ? (multi ? m.color : AGG_BAR_FILL) : (key==='weii' ? klasseColor(sy && sy.klasse) : m.color);
      if(hasVal(v)){
        const w = Math.max(3, v/sc.xMax*plotW);
        g.appendChild(svgEl('rect', {x:baseX, y:by, width:w, height:barH, rx:Math.min(5, barH/2), fill:fill, 'fill-opacity':isAgg&&!multi ? 0.85 : 1, class:'bar-rect'}));
        const t = svgEl('text', {x:baseX+w+8, y:by+barH/2+4, class:'bar-label', style:'paint-order:stroke;stroke:var(--white);stroke-width:3px;stroke-linejoin:round;'});
        t.textContent = formatValueForKey(key, v);
        if(multi){
          const tn = svgEl('tspan', {dx:6, style:'font-weight:400;fill:var(--text3);font-size:10.5px;'});
          tn.textContent = m.label.replace(/^WEii-?/,'') || 'WEii';
          t.appendChild(tn);
        }
        g.appendChild(t);
      } else {
        g.appendChild(svgEl('line', {x1:baseX+1.5, x2:baseX+1.5, y1:by+2, y2:by+barH-2, stroke:'var(--text3)', 'stroke-width':2, 'stroke-dasharray':'2,2'}));
      }
    });
    const hit = svgEl('rect', {x:0, y:gy-rowGap/2, width:W, height:groupH+rowGap, fill:'transparent', class:'bar-col-hit'});
    hit.addEventListener('pointerenter', (e)=>{ showTooltip(e.clientX, e.clientY, barTooltipHTML(cat, keys)); });
    hit.addEventListener('pointermove', (e)=>{ showTooltip(e.clientX, e.clientY, ttEl.innerHTML); });
    hit.addEventListener('pointerleave', hideTooltip);
    g.appendChild(hit);
    svg.appendChild(g);
  });
  svg.appendChild(svgEl('line', {x1:baseX, x2:baseX, y1:top-4, y2:top+bodyH+4, stroke:'var(--border2)', 'stroke-width':1}));
  holder.appendChild(svg);
}

// ---------- tabel onder het grafiekveld: altijd zichtbaar, toont de
// besparing 2020→laatste jaar per gebouwtype (alle 14 als er niets is
// geselecteerd, anders alleen de geselecteerde gebouwtypen) ----------
function buildCompareTable(cats, metricKey){
  const tableWrap = document.createElement('div');
  tableWrap.className = 'table-wrap';
  const table = document.createElement('table');
  const lastYear = YEARS[YEARS.length-1];
  let thead = '<thead><tr><th class="l">Gebouwtype</th>';
  YEARS.forEach(y=>{ thead += '<th>'+y+'</th>'; });
  thead += '<th>'+trendLabelFor(metricKey)+' 2020→'+lastYear+'</th></tr></thead>';
  table.innerHTML = thead;
  const tbody = document.createElement('tbody');
  cats.forEach(cat=>{
    const tr = document.createElement('tr');
    let row = '<td>'+cat.label+'</td>';
    YEARS.forEach(y=>{
      const s = seriesAt(cat,y);
      const val = metricValueForKey(cat, y, metricKey);
      // De klassekleur-stip is altijd op de WEii-klassegrenzen gebaseerd
      // (die zijn immers op WEii gedefinieerd), ongeacht welke indicator in
      // deze kolom getoond wordt - identiek aan het oorspronkelijke gedrag.
      const dot = (s.klasse && metricKey==='weii') ? ' <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:'+klasseColor(s.klasse)+';margin-left:4px;"></span>' : '';
      row += '<td>'+formatValueForKey(metricKey, val)+dot+'</td>';
    });
    const v0 = metricValueForKey(cat, YEARS[0], metricKey), vLast = metricValueForKey(cat, lastYear, metricKey);
    const trend = trendText(v0, vLast, metricKey);
    row += '<td class="'+trend.cls+'">'+trend.text+'</td>';
    tr.innerHTML = row;
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  tableWrap.appendChild(table);
  return tableWrap;
}

// Landelijk gemiddelde als "pseudo-gebouwtype", zodat het met dezelfde
// buildCompareTable()-rij getoond kan worden als de gebouwtypen. Bouwt de
// waarde voor ELKE indicator ineens op (series[year].values[key]), zodat
// metricValueForKey(cat, year, key) dit voor een willekeurige geselecteerde
// indicator kan opvragen - niet alleen de hoofdindicator.
function aggPseudoCat(){
  const perKey = {};
  METRICS.forEach(m=>{ perKey[m.key] = aggMetricValuesForKey(m.key); });
  const series = {};
  YEARS.forEach((y,i)=>{
    const values = {};
    METRICS.forEach(m=>{ values[m.key] = perKey[m.key][i]; });
    series[String(y)] = {values: values, klasse: undefined};
  });
  return {id:'__agg__', label:'Landelijk gemiddelde', series: series};
}

// De tabel toont precies wat er ook in het grafiekveld te zien is: in
// trendlijn-modus het landelijk gemiddelde plus de (eventueel afgekapte)
// geselecteerde gebouwtypen; in staafdiagram-modus de selecteerbare
// gebouwtypen (zie SELECTABLE_CATS hierboven).
function renderTable(){
  const titleEl = document.getElementById('detail-title');
  const bodyEl = document.getElementById('table-body');
  bodyEl.innerHTML = '';

  let cats, title;
  if(state.mode === 'staaf'){
    cats = sortedBarSubjects(selectedMetricKeys(), true);
    const aggIdx = cats.findIndex(c=>c.id==='__agg__');
    if(aggIdx>0) cats.unshift(cats.splice(aggIdx,1)[0]);
    const nT = cats.filter(c=>c.id!=='__agg__').length;
    if(state.selectedIds.size===0) title = state.showLandelijk ? 'Landelijk gemiddelde + alle gebouwtypen' : 'Alle gebouwtypen';
    else title = (state.showLandelijk ? 'Landelijk gemiddelde + ' : '') + nT + ' gebouwtype' + (nT>1?'n':'');
  } else {
    const selected = Array.from(state.selectedIds).map(catById).filter(Boolean).slice(0, MAX_CHART_SERIES-1);
    cats = (state.showLandelijk ? [aggPseudoCat()] : []).concat(selected);
    if(!state.showLandelijk && selected.length===0){
      title = 'Geen gebouwtype geselecteerd';
    } else if(!state.showLandelijk){
      title = selected.length + ' gebouwtype' + (selected.length>1?'n':'');
    } else {
      title = selected.length===0
        ? 'Landelijk gemiddelde'
        : 'Landelijk gemiddelde + ' + selected.length + ' gebouwtype' + (selected.length>1?'n':'');
    }
  }

  // In beide modi staat er één tabel per geselecteerde indicator onder
  // elkaar, elk met een eigen kop (behalve als er maar 1 is geselecteerd -
  // dan staat de eenheid gewoon in de paginatitel, zoals voorheen).
  const keys = selectedMetricKeys();
  titleEl.textContent = keys.length===1 ? (title + ' · ' + metricLabelForKey(keys[0]) + ' (' + metricUnitForKey(keys[0]) + ')') : title;

  keys.forEach(key=>{
    if(keys.length>1){
      const h = document.createElement('div');
      h.className = 'table-metric-heading';
      h.textContent = metricLabelForKey(key) + ' (' + metricUnitForKey(key) + ')';
      bodyEl.appendChild(h);
    }
    bodyEl.appendChild(buildCompareTable(cats, key));
  });
}

// ---------- Paris Proof-pad: het volledige officiële doelpad per gebouwtype ----------
// Leest de 5 ankerjaren rechtstreeks uit DATA.pp_pathway (de officiële DGBC-
// routekaart) - zie de toelichting bij PP_ANCHOR_YEARS hierboven. Geen eigen
// herberekening of afvlakking meer: dit is exact "het hele Paris Proof pad".
function ppPathwayValues(cat){
  const p = DATA.pp_pathway ? DATA.pp_pathway[cat.id] : null;
  if(!p) return [];
  return PP_ANCHOR_YEARS.map(y=>({year:y, value:p[String(y)], label:PP_ANCHOR_LABEL[y]}));
}

// ---------- CRREM-pad (1,5°C, Nederland) ----------
// CRREM Global Pathways v2.01 (11-01-2023): per CRREM-pandtype een jaarlijks pad
// 2020-2050 in kWh/m² (energie) en kg CO2/m². Elk dashboard-gebouwtype is aan het
// meest verwante CRREM-pandtype gekoppeld (DATA.crrem_pathway, zie Methodiek);
// gebouwtypen zonder vergelijkbaar CRREM-type hebben geen pad.
const CRREM_COLOR = '#0f8b8d';
const CRREM_MILESTONES = [2030, 2040, 2050];
function crremFor(cat){ return DATA.crrem_pathway ? (DATA.crrem_pathway[cat.id] || null) : null; }
function crremValues(cat, group){
  const c = crremFor(cat);
  if(!c) return null;
  const src = group==='co2' ? c.co2 : c.kwh;
  return Object.keys(src).map(Number).sort((a,b)=>a-b).map(y=>({year:y, value:src[String(y)]}));
}
function crremGroupForKeys(keys){
  if(keys.length!==1) return null;
  return keys[0]==='finaal' ? 'kwh' : keys[0]==='co2' ? 'co2' : null;
}

// ---------- trendlijn: landelijk gemiddelde + zelf toegevoegde gebouwtypen ----------
// Eén paneel per eenheid (kWh/m², kg CO2/m², %) die voorkomt in de
// geselecteerde indicatoren (state.metrics) - zie METRICS/GROUP_ORDER
// hierboven en de dataviz-regel tegen assen met gemengde eenheden. Bij
// precies 1 geselecteerde indicator is er precies 1 paneel, en oogt dit
// identiek aan de oorspronkelijke enkelvoudige trendlijn.
function renderTrendPanels(holder, noteEl){
  const selectedCats = Array.from(state.selectedIds).map(catById).filter(Boolean);
  const shownCats = selectedCats.slice(0, MAX_CHART_SERIES-1);
  const keys = selectedMetricKeys();
  const onlyWeii = keys.length===1 && keys[0]==='weii';
  const ppActive = state.showParisProof && onlyWeii && shownCats.length>0;
  const crremGroup = crremGroupForKeys(keys);
  const crActive = state.showCrrem && !!crremGroup && shownCats.length>0;

  const groups = GROUP_ORDER
    .map(g=>({group:g, keys: keys.filter(k=>METRIC_BY_KEY[k].group===g)}))
    .filter(g=>g.keys.length>0);
  // Alle eenheden delen één grafiek: de eerste eenheid (kWh/m² als die er is) staat op de
  // linkeras, de tweede (kg CO₂/m²) op een eigen as rechts en de derde (%) op een tweede as rechts.
  if(groups.length>1){
    const main = groups[0];
    main.secKeys = groups[1].keys; main.secGroup = groups[1].group;
    if(groups[2]){ main.terKeys = groups[2].keys; main.terGroup = groups[2].group; }
    groups.length = 1;
  }

  const notes = [];
  if(!state.showLandelijk && shownCats.length===0){
    notes.push('Vink het landelijk gemiddelde aan of voeg minstens één gebouwtype toe om een lijn te zien.');
  }
  if(selectedCats.length > shownCats.length){
    notes.push('Er worden maximaal ' + (MAX_CHART_SERIES-1) + ' gebouwtypen tegelijk getoond; de eerst geselecteerde ' + shownCats.length + ' zijn hier zichtbaar.');
  }
  if(state.showParisProof && !onlyWeii){
    notes.push('Het Paris Proof-pad is alleen te tonen wanneer uitsluitend WEii als indicator is geselecteerd (de klassegrenzen uit het protocol zijn op deze hoofdmeter-gebaseerde indicator gedefinieerd, niet op de overige indicatoren).');
  } else if(state.showParisProof && onlyWeii && shownCats.length===0){
    notes.push('Selecteer minstens één gebouwtype om het Paris Proof-pad te tonen (het landelijk gemiddelde heeft geen eigen klassegrens).');
  }
  if(state.showCrrem && !crremGroup){
    notes.push('Het CRREM-pad is alleen te tonen wanneer uitsluitend WEii-finaal (kWh/m²) of uitsluitend WEii-CO₂ (kg CO₂/m²) is geselecteerd.');
  } else if(state.showCrrem && shownCats.length===0){
    notes.push('Selecteer minstens één gebouwtype om het CRREM-pad te tonen (het landelijk gemiddelde heeft geen eigen CRREM-pad).');
  } else if(crActive){
    const zonder = shownCats.filter(c=>!crremFor(c)).map(c=>c.label);
    if(zonder.length) notes.push('Voor ' + zonder.join(', ') + ' is geen vergelijkbaar CRREM-pandtype beschikbaar, dus daar wordt geen CRREM-pad getoond.');
  }
  const leeg = shownCats.filter(c=>!catHasData(c)).map(c=>c.label);
  if(leeg.length) notes.push('Voor ' + leeg.join(', ') + ' is geen TNO-gebouwtype gekoppeld, dus er zijn geen kentallen. Koppel er een onder Settings.');
  if(ppActive){
    const zonderPP = shownCats.filter(c=>ppPathwayValues(c).length===0).map(c=>c.label);
    if(zonderPP.length) notes.push('Voor ' + zonderPP.join(', ') + ' is geen Paris Proof-pad uit de DGBC-routekaart beschikbaar.');
  }
  if(keys.some(k=>k==='zon' || k==='finaal' || k==='dekkingsgraad' || k==='benuttingsfactor')){
    notes.push('De gestippelde markering geeft aan dat TNO voor dat jaar/gebouwtype geen betrouwbaar zonopwek-kental publiceert (te weinig panden met zonnestroom voor een representatief gemiddelde), waardoor WEii-finaal, WEii-dekkingsgraad en WEii-benuttingsfactor daar dan ook niet te berekenen zijn.');
  }
  if(keys.includes('finaal')){
    notes.push('Het landelijk gemiddelde voor WEii-finaal is berekend over alleen de gebouwtypen met een zonopwek-kental in dat jaar; gebouwtypen zonder kental (zoals Ziekenhuis, Onderwijs mbo/hbo/wo, Restaurant en Cellengebouw) tellen daarin niet mee, in tegenstelling tot bij WEii.');
  }
  noteEl.textContent = notes.join(' ');

  groups.forEach(g=>{
    const panelWrap = document.createElement('div');
    panelWrap.className = 'trend-panel';
    holder.appendChild(panelWrap);
    renderOnePanel(panelWrap, g, shownCats, ppActive && g.group==='kwh', crActive && g.group===crremGroup);
  });
}

// Eén paneel: alle geselecteerde indicatoren binnen dezelfde eenheidsgroep,
// elk voor de landelijk-gemiddelde reeks en/of de zelf toegevoegde
// gebouwtypen. Kleur codeert de indicator (vaste kleur per METRICS-item);
// streepjeslijn vs. volle lijn codeert het onderwerp (landelijk gemiddelde
// resp. gebouwtype) - bij >1 indicator staat het onderwerp bovendien
// letterlijk in het legenda-label, zodat de betekenis niet alleen van de
// lijnstijl afhangt.
function renderOnePanel(panelWrap, groupObj, shownCats, showPP, showCR){
  const groupKeys = groupObj.keys;
  const unit = GROUP_LABEL[groupObj.group];

  const head = document.createElement('div');
  head.className = 'trend-panel-head';
  const titleEl = document.createElement('span');
  titleEl.className = 'trend-panel-title';
  const secKeys = groupObj.secKeys || null;
  const terKeys = groupObj.terKeys || null;
  titleEl.textContent = secKeys
    ? groupKeys.map(metricLabelForKey).join(' · ') + ' (' + unit + ', linker as) · ' + secKeys.map(metricLabelForKey).join(' · ') + ' (' + GROUP_LABEL[groupObj.secGroup] + ', rechter as)'
      + (terKeys ? ' · ' + terKeys.map(metricLabelForKey).join(' · ') + ' (' + GROUP_LABEL[groupObj.terGroup] + ', 2e rechter as)' : '')
    : groupKeys.map(metricLabelForKey).join(' · ') + ' (' + unit + ')';
  head.appendChild(titleEl);
  const legend = document.createElement('div');
  legend.className = 'trend-panel-legend';
  head.appendChild(legend);
  panelWrap.appendChild(head);

  const chartHolder = document.createElement('div');
  panelWrap.appendChild(chartHolder);
  const panelNoteEl = document.createElement('div');
  panelNoteEl.className = 'trend-panel-note';
  panelWrap.appendChild(panelNoteEl);

  const width = Math.max(560, panelWrap.clientWidth || 900);
  const height = 300;
  const padL = 54, padR = terKeys ? 136 : secKeys ? 58 : 24, padT = secKeys ? 34 : 24, padB = 32;
  const plotW = width-padL-padR, plotH = height-padT-padB;

  const series = [];
  const allKeys = groupKeys.concat(secKeys || [], terKeys || []);
  const multi = allKeys.length>1;
  const axisOf = key => (secKeys && secKeys.indexOf(key)>=0) ? 'r' : (terKeys && terKeys.indexOf(key)>=0) ? 'r2' : 'l';
  const rSuffix = key => axisOf(key)==='r' ? ' (rechter as)' : axisOf(key)==='r2' ? ' (2e rechter as)' : '';
  if(state.showLandelijk){
    allKeys.forEach(key=>{
      const values = aggMetricValuesForKey(key);
      series.push({
        key: key, axis: axisOf(key),
        label: multi ? (metricLabelForKey(key)+' · Landelijk gemiddelde'+rSuffix(key)) : 'Landelijk gemiddelde',
        color: METRIC_BY_KEY[key].color,
        dashed: true,
        isAgg: true,
        values: values,
        trendAt: (i)=> i===0 ? null : trendText(values[0], values[i], key),
      });
    });
  }
  shownCats.forEach((cat,ci)=>{
    if(!catHasData(cat)) return;   // zonder gekoppeld TNO-type geen reeks (zie melding onder de grafiek)
    allKeys.forEach(key=>{
      const values = YEARS.map(y=>metricValueForKey(cat, y, key));
      series.push({
        key: key, axis: axisOf(key),
        label: multi ? (metricLabelForKey(key)+' · '+cat.label+rSuffix(key)) : cat.label,
        color: multi ? METRIC_BY_KEY[key].color : CMP_COLORS[ci % CMP_COLORS.length],
        dashed: false,
        cat: cat,
        values: values,
        trendAt: (i2)=> trendText(values[0], values[i2], key),
        klasseAt: (i2)=> seriesAt(cat, YEARS[i2]).klasse,
      });
    });
  });

  // legenda: bij precies 1 indicator identiek aan voorheen (kleur = onderwerp);
  // bij meerdere indicatoren kleurt elke entry naar de indicator en staat het
  // onderwerp in de tekst zelf (dashed/volle lijn blijft ook zichtbaar als
  // stijl in de grafiek, maar is dan niet meer de enige aanwijzing).
  series.forEach(s=>{
    const el = document.createElement('span');
    el.className = 'legend-item';
    el.innerHTML = '<span class="dot" style="background:'+s.color+(s.dashed?';opacity:.7':'')+'"></span>'+s.label;
    legend.appendChild(el);
  });
  if(series.length===0){
    const el = document.createElement('span');
    el.className = 'legend-note';
    el.textContent = 'Geen reeks te tonen.';
    legend.appendChild(el);
  }

  const ppByCat = showPP ? shownCats.map(ppPathwayValues) : [];
  const crByCat = showCR ? shownCats.map(c=>({cat:c, pts:crremValues(c, groupObj.group)})).filter(o=>o.pts) : [];
  const showPath = showPP || crByCat.length>0;
  if(crByCat.length){
    const el = document.createElement('span');
    el.className = 'legend-item';
    el.innerHTML = '<span class="legend-line" style="border-top:2.5px dashed '+CRREM_COLOR+'"></span>CRREM 1,5°C-pad';
    legend.appendChild(el);
  }
  // Formattering voor de y-as en het PP-pad: gebaseerd op de eerste
  // geselecteerde indicator van dit paneel (bij >1 indicator in dezelfde
  // eenheidsgroep verschilt de notatie hooguit in aantal decimalen, niet in
  // eenheid - dat blijft immers de paneel-eenheid). Het PP-pad is sowieso
  // alleen actief als groupKeys hier exact ['weii'] is.
  const fmtAxis = (v)=> formatValueForKey(groupKeys[0], v);

  const allVals = [];
  series.filter(s=>s.axis==='l').forEach(s=>s.values.forEach(v=>{ if(hasVal(v)) allVals.push(v); }));
  ppByCat.forEach(pts=>pts.forEach(p=>{ if(hasVal(p.value)) allVals.push(p.value); }));
  crByCat.forEach(o=>o.pts.forEach(p=>{ if(hasVal(p.value)) allVals.push(p.value); }));
  if(allVals.length===0) allVals.push(0,1);
  let yMin = Math.min.apply(null, allVals), yMax = Math.max.apply(null, allVals);
  const span = yMax-yMin || 1;
  yMin -= span*0.14; yMax += span*0.14;
  if(yMin<0) yMin = 0;

  // x-as: normaal gesproken de 5 dataset-jaren op gelijke afstand; met een
  // actief Paris Proof-pad wordt de as verlengd tot 2050 en op werkelijke
  // jaartallen geschaald (de tussenpozen 2024-2025-2030-2040-2050 zijn niet
  // gelijk).
  const domainMin = YEARS[0];
  // 2025 (eerste mijlpaal) wordt niet als losse asaanduiding getoond: dat
  // jaar ligt maar één jaar na het laatste dataset-jaar (2024), dus zou het
  // as-label anders altijd overlappen met "2024". De 2025-mijlpaal is al af
  // te lezen aan het "Zuinig"-label op het pad zelf.
  const extraYears = showPath ? PP_ANCHOR_YEARS.filter(y=>y!==2020 && y!==2025) : [];
  const domainMax = showPath ? PP_FINAL_YEAR : YEARS[YEARS.length-1];
  const xAt = yr => padL + (yr-domainMin)/((domainMax-domainMin)||1)*plotW;
  const yAt = v => padT + plotH - (v-yMin)/(yMax-yMin)*plotH;
  // rechter assen (als er meerdere eenheden in één grafiek staan): elk een eigen schaal
  function sideScale(axisName){
    const rv = [];
    series.filter(q=>q.axis===axisName).forEach(q=>q.values.forEach(v=>{ if(hasVal(v)) rv.push(v); }));
    if(rv.length===0) rv.push(0,1);
    let lo = Math.min.apply(null, rv), hi = Math.max.apply(null, rv);
    const sp = hi-lo || 1;
    lo -= sp*0.14; hi += sp*0.14;
    if(lo<0) lo = 0;
    return {lo:lo, hi:hi, at: v => padT + plotH - (v-lo)/(hi-lo)*plotH};
  }
  const scR = secKeys ? sideScale('r') : null;
  const scR2 = terKeys ? sideScale('r2') : null;
  const yFor = s => (s.axis==='r' ? scR.at : s.axis==='r2' ? scR2.at : yAt);

  const svg = svgEl('svg', {width:'100%', height:height, viewBox:'0 0 '+width+' '+height, style:'max-width:100%;display:block;'});

  const niceStep0 = Math.pow(10, Math.floor(Math.log10((yMax-yMin)/4)));
  let step = niceStep0;
  if((yMax-yMin)/step > 8) step*=2;
  for(let v = Math.ceil(yMin/step)*step; v<=yMax; v+=step){
    const y = yAt(v);
    svg.appendChild(svgEl('line', {x1:padL, x2:padL+plotW, y1:y, y2:y, class:'grid-line'}));
    const t = svgEl('text', {x:padL-10, y:y+4, class:'axis-label', 'text-anchor':'end'});
    t.textContent = fmtAxis(v);
    svg.appendChild(t);
  }
  function drawSideAxis(sc, keys, grp, x, anchor){
    let stepR = Math.pow(10, Math.floor(Math.log10((sc.hi-sc.lo)/4)));
    if((sc.hi-sc.lo)/stepR > 8) stepR*=2;
    for(let v = Math.ceil(sc.lo/stepR)*stepR; v<=sc.hi; v+=stepR){
      const tr = svgEl('text', {x:x, y:sc.at(v)+4, class:'axis-label', 'text-anchor':'start'});
      tr.textContent = formatValueForKey(keys[0], v);
      svg.appendChild(tr);
    }
    const tR = svgEl('text', {x:x, y:padT-14, class:'axis-label', 'text-anchor':'start', style:'font-weight:600;'});
    tR.textContent = GROUP_LABEL[grp];
    svg.appendChild(tR);
  }
  if(secKeys){
    drawSideAxis(scR, secKeys, groupObj.secGroup, padL+plotW+10);
    if(terKeys) drawSideAxis(scR2, terKeys, groupObj.terGroup, padL+plotW+78);
    const tL = svgEl('text', {x:padL-10, y:padT-14, class:'axis-label', 'text-anchor':'start', style:'font-weight:600;'});
    tL.textContent = unit;
    svg.appendChild(tL);
  }
  // Met een actief Paris Proof-pad wordt de as tot 2050 doorgetrokken; de 5
  // dataset-jaren staan dan dicht opeengepakt in het eerste stukje van de as,
  // dus wordt alleen het eerste en laatste dataset-jaar gelabeld (plus de
  // mijlpaaljaren) om overlappende jaartallen te voorkomen.
  const yearsToLabel = showPath ? [YEARS[0], YEARS[YEARS.length-1]] : YEARS;
  yearsToLabel.forEach(y=>{
    const t = svgEl('text', {x:xAt(y), y:height-8, class:'axis-label', 'text-anchor':'middle'});
    t.textContent = y;
    svg.appendChild(t);
  });
  extraYears.forEach(y=>{
    const t = svgEl('text', {x:xAt(y), y:height-8, class:'axis-label', 'text-anchor':'middle'});
    t.textContent = y;
    svg.appendChild(t);
  });

  // vlakvulling onder de lijn alleen wanneer het totaalbeeld de enige serie is
  if(series.length===1){
    const defs = svgEl('defs', {});
    const gradId = 'lineGrad';
    const grad = svgEl('linearGradient', {id:gradId, x1:'0', y1:'0', x2:'0', y2:'1'});
    grad.appendChild(svgEl('stop', {offset:'0%', 'stop-color':'var(--accent)', 'stop-opacity':'0.18'}));
    grad.appendChild(svgEl('stop', {offset:'100%', 'stop-color':'var(--accent)', 'stop-opacity':'0'}));
    defs.appendChild(grad);
    svg.appendChild(defs);
    const vals = series[0].values;
    const validIdx = YEARS.map((y,i)=>i).filter(i=>hasVal(vals[i]));
    if(validIdx.length>1){
      let areaD = 'M'+xAt(YEARS[validIdx[0]]).toFixed(1)+' '+yAt(vals[validIdx[0]]).toFixed(1)+' ';
      validIdx.slice(1).forEach(i=>{ areaD += 'L'+xAt(YEARS[i]).toFixed(1)+' '+yAt(vals[i]).toFixed(1)+' '; });
      const first = validIdx[0], last = validIdx[validIdx.length-1];
      areaD += 'L'+xAt(YEARS[last]).toFixed(1)+' '+(padT+plotH).toFixed(1)+' L'+xAt(YEARS[first]).toFixed(1)+' '+(padT+plotH).toFixed(1)+' Z';
      svg.appendChild(svgEl('path', {d:areaD, fill:'url(#'+gradId+')', stroke:'none'}));
    }
  }

  const crosshair = svgEl('line', {class:'crosshair', x1:0,x2:0,y1:padT,y2:padT+plotH, style:'display:none;'});
  svg.appendChild(crosshair);

  // Paris Proof-pad: getekend in de eigen, herkenbare Paris Proof-oranje
  // kleur (zoals in de officiële DGBC-routekaartafbeelding), los van de
  // navy/purper/vermiljoen-huisstijl van de rest van het dashboard - dit is
  // bewust, om het pad als hetzelfde herkenbare "Paris Proof"-element te
  // laten lezen. Labels en het "Paris Proof"-baken worden alleen bij de
  // eerst getoonde reeks gezet, zodat het bij meerdere gebouwtypen niet vol
  // raakt.
  const PP_COLOR = '#ec7a1a';
  ppByCat.forEach((pts,idx)=>{
    let d = '';
    pts.forEach((p,i)=>{ d += (i===0?'M':'L') + xAt(p.year).toFixed(1) + ' ' + yAt(p.value).toFixed(1) + ' '; });
    svg.appendChild(svgEl('path', {d:d, fill:'none', stroke:PP_COLOR, 'stroke-width':2.5, 'stroke-linecap':'round', 'stroke-linejoin':'round'}));
    pts.forEach(p=>{
      const cx = xAt(p.year), cy = yAt(p.value);
      svg.appendChild(svgEl('circle', {cx:cx, cy:cy, r:3, fill:'var(--white)', stroke:PP_COLOR, 'stroke-width':1.6}));
      if(idx===0 && p.label){
        const t = svgEl('text', {x:cx, y:cy-11, class:'axis-label', 'text-anchor':'middle', style:'fill:'+PP_COLOR+';font-weight:600;'});
        t.textContent = p.label+' · '+fmtAxis(p.value);
        svg.appendChild(t);
      }
      if(idx===0 && p.year===2040){
        const badgeCy = cy+26;
        svg.appendChild(svgEl('circle', {cx:cx, cy:badgeCy, r:19, fill:PP_COLOR}));
        const btStyle = 'font-size:6px;font-weight:700;letter-spacing:.2px;fill:#fff;font-family:var(--sans);';
        const bt1 = svgEl('text', {x:cx, y:badgeCy-1, 'text-anchor':'middle', style:btStyle});
        bt1.textContent = 'PARIS';
        svg.appendChild(bt1);
        const bt2 = svgEl('text', {x:cx, y:badgeCy+7, 'text-anchor':'middle', style:btStyle});
        bt2.textContent = 'PROOF';
        svg.appendChild(bt2);
      }
    });
  });

  // CRREM 1,5°C-pad: gestreepte lijn in eigen kleur (teal), jaarlijks 2020-2050.
  // Mijlpaalpunten (2030/2040/2050) hebben een tooltip; bij het eerste gebouwtype
  // staat de waarde ook als label onder de lijn (PP-labels staan erboven).
  crByCat.forEach((o,idx)=>{
    let d = '';
    o.pts.forEach((p,i)=>{ d += (i===0?'M':'L') + xAt(p.year).toFixed(1) + ' ' + yAt(p.value).toFixed(1) + ' '; });
    svg.appendChild(svgEl('path', {d:d, fill:'none', stroke:CRREM_COLOR, 'stroke-width':2.5, 'stroke-dasharray':'7,4', 'stroke-linecap':'round', 'stroke-linejoin':'round'}));
    CRREM_MILESTONES.forEach(y=>{
      const p = o.pts.find(q=>q.year===y);
      if(!p) return;
      const cx = xAt(y), cy = yAt(p.value);
      svg.appendChild(svgEl('circle', {cx:cx, cy:cy, r:3.2, fill:'var(--white)', stroke:CRREM_COLOR, 'stroke-width':1.8}));
      // bij actief Paris Proof-pad alleen het eindlabel (2050), anders botsen de labels
      if(idx===0 && (!showPP || y===PP_FINAL_YEAR)){
        const t = svgEl('text', {x:cx, y:(cy+17 > padT+plotH-2 ? cy-9 : cy+17), class:'axis-label', 'text-anchor': y===PP_FINAL_YEAR ? 'end' : 'middle', style:'fill:'+CRREM_COLOR+';font-weight:600;'});
        t.textContent = 'CRREM · '+fmtAxis(p.value);
        svg.appendChild(t);
      }
      const hitC = svgEl('circle', {cx:cx, cy:cy, r:12, class:'trend-dot-hit'});
      hitC.addEventListener('pointerenter', (e)=>{
        showTooltip(e.clientX, e.clientY,
          '<div class="tt-title">CRREM 1,5°C-pad · '+y+'</div>'+
          '<div class="tt-row"><span>'+o.cat.label+'</span><span class="tt-strong">'+fmtAxis(p.value)+' '+unit+'</span></div>'+
          '<div class="tt-row"><span>CRREM-type</span><span class="tt-strong">'+crremFor(o.cat).type_label+'</span></div>'
        );
      });
      hitC.addEventListener('pointermove', (e)=>{ showTooltip(e.clientX, e.clientY, ttEl.innerHTML); });
      hitC.addEventListener('pointerleave', hideTooltip);
      svg.appendChild(hitC);
    });
  });

  series.forEach((s,sIdx)=>{
    // Lijn met gaten: bij een ontbrekende waarde (bijv. onderdrukte
    // zonopwek-kentallen voor kleine steekproeven) wordt de lijn onderbroken
    // in plaats van foutief doorgetrokken of naar 0 getrokken.
    let d = ''; let penDown = false;
    YEARS.forEach((y,i)=>{
      if(!hasVal(s.values[i])){ penDown = false; return; }
      d += (penDown?'L':'M') + xAt(y).toFixed(1) + ' ' + yFor(s)(s.values[i]).toFixed(1) + ' ';
      penDown = true;
    });
    svg.appendChild(svgEl('path', {d:d, fill:'none', stroke:s.color, 'stroke-width':s.isAgg?2.5:2, 'stroke-linecap':'round', 'stroke-linejoin':'round', 'stroke-dasharray':s.dashed?'6,5':'none'}));

    YEARS.forEach((y,i)=>{
      if(!hasVal(s.values[i])){
        // Geen kental bekend voor dit jaar (privacy-onderdrukking bij TNO) -
        // toon een duidelijk herkenbaar "geen data"-markertje in plaats van
        // een punt op een verkeerde plek. Per serie een eigen rij (verticaal
        // verspringend), zodat meerdere series die in hetzelfde jaar geen
        // data hebben niet exact over elkaar heen vallen.
        const cx = xAt(y), cy = padT + plotH - 6 - sIdx*9;
        const g = svgEl('g', {});
        const hit2 = svgEl('circle', {cx:cx, cy:cy, r:10, class:'trend-dot-hit'});
        hit2.addEventListener('pointerenter', (e)=>{
          showTooltip(e.clientX, e.clientY,
            '<div class="tt-title">'+s.label+' · '+y+'</div>'+
            '<div class="tt-row"><span>'+metricLabelForKey(s.key)+'</span><span class="tt-strong">geen kental beschikbaar</span></div>'
          );
        });
        hit2.addEventListener('pointermove', (e)=>{ showTooltip(e.clientX, e.clientY, ttEl.innerHTML); });
        hit2.addEventListener('pointerleave', ()=>{ hideTooltip(); });
        g.appendChild(svgEl('circle', {cx:cx, cy:cy, r:3.5, fill:'none', stroke:s.color, 'stroke-width':1.4, 'stroke-dasharray':'2,2', opacity:'0.6'}));
        g.appendChild(hit2);
        svg.appendChild(g);
        return;
      }
      const cx = xAt(y), cy = yFor(s)(s.values[i]);
      svg.appendChild(svgEl('circle', {cx:cx, cy:cy, r:s.isAgg?5:4.5, fill:s.color, stroke:'var(--white)', 'stroke-width':1.5}));
      const hit = svgEl('circle', {cx:cx, cy:cy, r:14, class:'trend-dot-hit'});
      hit.addEventListener('pointerenter', (e)=>{
        crosshair.setAttribute('x1', cx); crosshair.setAttribute('x2', cx);
        crosshair.style.display='block';
        const trend = s.trendAt(i);
        showTooltip(e.clientX, e.clientY,
          '<div class="tt-title">'+s.label+' · '+y+'</div>'+
          '<div class="tt-row"><span>'+metricLabelForKey(s.key)+'</span><span class="tt-strong">'+formatValueForKey(s.key, s.values[i])+' '+metricUnitForKey(s.key)+'</span></div>'+
          (s.klasseAt ? '<div class="tt-row"><span>Klasse</span><span class="tt-strong">'+s.klasseAt(i)+'</span></div>' : '') +
          (!trend ? '' : '<div class="tt-row"><span>'+trendLabelFor(s.key)+' vs 2020</span><span class="tt-strong">'+trend.text+'</span></div>')
        );
      });
      hit.addEventListener('pointermove', (e)=>{ showTooltip(e.clientX, e.clientY, ttEl.innerHTML); });
      hit.addEventListener('pointerleave', ()=>{ hideTooltip(); crosshair.style.display='none'; });
      svg.appendChild(hit);
    });
  });

  chartHolder.appendChild(svg);
  // Panel-specifieke kanttekeningen (bijv. "geen reeks") staan desgewenst
  // hier; de gedeelde, indicator-overstijgende meldingen (max. aantal
  // gebouwtypen, Paris Proof-voorwaarden, ontbrekende zonopwek-kentallen)
  // staan al in het gezamenlijke chart-note-blok (zie renderTrendPanels).
  panelNoteEl.textContent = series.length===0 ? 'Geen reeks te tonen in dit paneel.' : '';
}

// ---------- wiring ----------
function renderAll(){
  renderYearTabs();
  renderCatDropdownList();
  updateCatDropdownButtonLabel();
  renderIndicatorDropdownList();
  updateIndicatorDropdownButtonLabel();
  updatePathwayControlsState();
  renderChart();
  renderTable();
}

// ---------- dropdown: gebouwtypen toevoegen ----------
const catDropdown = document.getElementById('cat-dropdown');
const catDropdownBtn = document.getElementById('cat-dropdown-btn');
const catDropdownPanel = document.getElementById('cat-dropdown-panel');
function setCatDropdownOpen(open){
  catDropdownPanel.hidden = !open;
  catDropdown.classList.toggle('open', open);
  catDropdownBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
}
catDropdownBtn.addEventListener('click', (e)=>{
  e.stopPropagation();
  setCatDropdownOpen(catDropdownPanel.hidden);
});
document.addEventListener('click', (e)=>{
  if(!catDropdown.contains(e.target)) setCatDropdownOpen(false);
});
document.getElementById('cat-dropdown-search-input').addEventListener('input', (e)=>{
  state.search = e.target.value;
  renderCatDropdownList();
});
window.addEventListener('resize', renderChart);

// ---------- modus-schakelaar: trendlijn / staafdiagram per jaar ----------
// Geen hoofdtabs meer: één doorlopend grafiekveld waarvan de inhoud met deze
// knoppen wordt aangepast. De jaarkiezer is alleen relevant (en zichtbaar)
// in de staafdiagram-modus, omdat dat een momentopname van één jaar is. De
// tabel volgt de modus mee, want die toont exact wat in de grafiek te zien is.
const modeBtns = document.querySelectorAll('.mode-btn');
const yearTabsWrap = document.getElementById('year-tabs-weii-wrap');
const pathwayTogglesWrap = document.getElementById('pathway-toggles');
function setMode(mode){
  state.mode = mode;
  modeBtns.forEach(b=> b.classList.toggle('on', b.dataset.mode===mode));
  if(yearTabsWrap) yearTabsWrap.hidden = mode !== 'staaf'; // jaartabs alleen bij het staafdiagram per jaar
  renderCatDropdownList();
  // de doelpaden (Paris Proof / CRREM) zijn tijdreeks-concepten en horen
  // alleen bij de trendlijn, niet bij het staafdiagram van één jaar
  if(pathwayTogglesWrap) pathwayTogglesWrap.hidden = mode !== 'lijn';
  updatePathwayControlsState();
  renderChart();
  renderTable();
}
modeBtns.forEach(b=>{
  b.addEventListener('click', ()=> setMode(b.dataset.mode));
});

// ---------- dropdown: indicatoren selecteren (meerdere tegelijk) ----------
// Vervangt de vroegere enkelvoudige <select>: een aankruislijst (dezelfde
// cat-dropdown-opmaak als de gebouwtype-kiezer hierboven), zodat de
// gebruiker meerdere WEii-indicatoren tegelijk kan tonen. Minstens 1
// indicator moet altijd aanblijven - de trendlijn/staafdiagram/tabel hebben
// anders niets om te tekenen.
const indicatorDropdown = document.getElementById('indicator-dropdown');
const indicatorDropdownBtn = document.getElementById('indicator-dropdown-btn');
const indicatorDropdownPanel = document.getElementById('indicator-dropdown-panel');
const indicatorDropdownLabel = document.getElementById('indicator-dropdown-label');
const indicatorDropdownList = document.getElementById('indicator-dropdown-list');

function setIndicatorDropdownOpen(open){
  if(!indicatorDropdownPanel) return;
  indicatorDropdownPanel.hidden = !open;
  indicatorDropdown.classList.toggle('open', open);
  indicatorDropdownBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
}
if(indicatorDropdownBtn){
  indicatorDropdownBtn.addEventListener('click', (e)=>{
    e.stopPropagation();
    setIndicatorDropdownOpen(indicatorDropdownPanel.hidden);
  });
  document.addEventListener('click', (e)=>{
    if(!indicatorDropdown.contains(e.target)) setIndicatorDropdownOpen(false);
  });
}

function toggleMetric(key){
  if(state.metrics.has(key)){
    if(state.metrics.size<=1) return; // minstens 1 indicator blijft altijd geselecteerd
    state.metrics.delete(key);
  } else {
    state.metrics.add(key);
  }
  renderIndicatorDropdownList();
  updateIndicatorDropdownButtonLabel();
  updatePathwayControlsState();
  renderChart();
  renderTable();
}

function renderIndicatorDropdownList(){
  if(!indicatorDropdownList) return;
  indicatorDropdownList.innerHTML = '';
  METRICS.forEach(m=>{
    const isActive = state.metrics.has(m.key);
    const item = document.createElement('div');
    item.className = 'cat-dropdown-item' + (isActive ? ' active' : '');
    if(m.title) item.title = m.title;
    item.innerHTML =
      '<span class="ci-check">'+(isActive?CHECK_SVG:'')+'</span>'+
      '<span class="ci-dot" style="background:'+m.color+'"></span>'+
      '<span class="cdi-name">'+m.label+'</span>'+
      '<span class="cdi-val">'+m.unit+'</span>';
    // stopPropagation om dezelfde reden als bij de gebouwtype-lijst
    // hierboven: dit item wordt bij toggleMetric() direct opnieuw getekend.
    item.addEventListener('click', (e)=>{ e.stopPropagation(); toggleMetric(m.key); });
    indicatorDropdownList.appendChild(item);
  });
}

function updateIndicatorDropdownButtonLabel(){
  if(!indicatorDropdownLabel) return;
  const keys = selectedMetricKeys();
  indicatorDropdownLabel.textContent = keys.length===1 ? metricLabelForKey(keys[0]) : keys.length + ' indicatoren geselecteerd';
}

const ppToggle = document.getElementById('pp-toggle');
const ppToggleLabel = document.getElementById('pp-toggle-label');
const crremToggle = document.getElementById('crrem-toggle');

function renderPathwayInfo(){}

// Het Paris Proof-pad kan alleen getekend worden bij WEii (de klassegrenzen
// in de dataset zijn op deze hoofdmeter-gebaseerde indicator gedefinieerd,
// niet op WEii-finaal, -gas, -CO2 of zonne-opwek) en als er minstens één
// gebouwtype is geselecteerd (het landelijk gemiddelde heeft geen eigen
// klassegrens). Buiten die voorwaarden wordt de checkbox uitgeschakeld en,
// als hij aanstond, weer uitgezet.
function updatePathwayControlsState(){
  if(!ppToggle) return;
  const allowed = state.mode==='lijn' && state.metrics.size===1 && state.metrics.has('weii') && state.selectedIds.size>0;
  ppToggle.disabled = !allowed;
  if(ppToggleLabel) ppToggleLabel.classList.toggle('disabled', !allowed);
  if(!allowed && state.showParisProof){
    state.showParisProof = false;
    ppToggle.checked = false;
  }
  // CRREM-pad: bij uitsluitend WEii-finaal of uitsluitend WEii-CO2, en minstens één gebouwtype
  const crAllowed = state.mode==='lijn' && state.metrics.size===1 && (state.metrics.has('finaal') || state.metrics.has('co2')) && state.selectedIds.size>0;
  if(crremToggle){
    crremToggle.disabled = !crAllowed;
    crremToggle.setAttribute('aria-disabled', String(!crAllowed));
    const crLabel = document.getElementById('crrem-toggle-label');
    if(crLabel) crLabel.classList.toggle('disabled', !crAllowed);
    if(!crAllowed && state.showCrrem){ state.showCrrem = false; crremToggle.checked = false; }
  }
  renderPathwayInfo();
}

if(ppToggle) ppToggle.addEventListener('change', ()=>{
  state.showParisProof = ppToggle.checked;
  renderChart();
});
if(crremToggle) crremToggle.addEventListener('change', ()=>{
  state.showCrrem = crremToggle.checked;
  renderPathwayInfo();
  renderChart();
});

// =====================================================================
// Settings en rekenmotor
// De kentallen per gebruikstype worden live berekend met WeiiEngine
// (zelfde rekenregels als het Excelbestand) uit de instellingen hieronder:
// koppeling TNO-type met WEii-gebruikstype, oppervlak per pand en
// weercorrectie-aandeel. De weging is vast: altijd op oppervlak.
// =====================================================================
const MODEL = DATA.model;
const WEII_INFO = DATA.weii_info;
const CAT_WEII = DATA.cat_weii;
const WEII_TYPES = MODEL.weiiTypes;
const NVT = 'n.v.t.';
const NVT_LABEL = 'n.v.t. (niet meenemen)';
const SKEY = 'weii-dashboard-settings-v1';
const XLSX_NAME = 'Kentallen_per_WEii-gebruikstype_2020-2024.xlsx';
let storageOK = true;

function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function defaultSettings(){
  return {
    map: MODEL.types.map(t=>[t.k1, t.k2]),
    oppGas: MODEL.types.map(()=>YEARS.map(()=>null)),
    oppElek: MODEL.types.map(()=>YEARS.map(()=>null)),
    weer: {},
  };
}
const DEFAULT_JSON = JSON.stringify(defaultSettings());
function sanitizeSettings(o){
  try{
    if(!o || !Array.isArray(o.map) || o.map.length !== MODEL.types.length) return null;
    const d = defaultSettings();
    o.map.forEach((m,i)=>{
      if(!Array.isArray(m)) throw 0;
      const a = m[0], b = m[1] || '';
      if(!(a===NVT || WEII_TYPES.indexOf(a)>=0)) throw 0;
      if(!(b==='' || WEII_TYPES.indexOf(b)>=0)) throw 0;
      d.map[i] = [a, a===NVT ? '' : b];
    });
    ['oppGas','oppElek'].forEach(k=>{
      if(!Array.isArray(o[k])) return;
      o[k].forEach((row,i)=>{ if(Array.isArray(row) && d[k][i]) row.forEach((v,j)=>{ if(j<YEARS.length && typeof v==='number' && isFinite(v) && v>0) d[k][i][j] = v; }); });
    });
    if(o.weer && typeof o.weer==='object'){
      Object.keys(o.weer).forEach(w=>{
        if(WEII_TYPES.indexOf(w)<0) return;
        const g = o.weer[w] && o.weer[w].gas, e = o.weer[w] && o.weer[w].elek;
        const ok = v => typeof v==='number' && isFinite(v) && v>0 && v<=1;
        if(ok(g) || ok(e)) d.weer[w] = {gas: ok(g)?g:0, elek: ok(e)?e:0};
      });
    }
    return d;
  }catch(e){ return null; }
}
function loadSettings(){
  try{
    const raw = window.localStorage.getItem(SKEY);
    if(raw){ const s = sanitizeSettings(JSON.parse(raw)); if(s) return s; }
  }catch(e){ storageOK = false; }
  return defaultSettings();
}
function saveSettings(){
  try{ window.localStorage.setItem(SKEY, JSON.stringify(SETTINGS)); }catch(e){ storageOK = false; }
}
let SETTINGS = loadSettings();
function settingsAreDefault(){ return JSON.stringify(SETTINGS) === DEFAULT_JSON; }
function weerAandeel(w){ const a = SETTINGS.weer[w] || {}; return {gas: a.gas || 0, elek: a.elek || 0}; }
function weerIsOn(){ return Object.keys(SETTINGS.weer).some(w=>{ const a = SETTINGS.weer[w]; return a && (a.gas>0 || a.elek>0); }); }

let LAST_MODEL_RESULT = null;
function klasseForValue(v, thr){
  if(v === null || v === undefined) return null;
  for(let i=0;i<6;i++){
    if(thr[i]===null || thr[i]===undefined) return 'Onbekend';   // grenzen deels bekend: boven de laatste grens is de klasse onbekend
    if(v<=thr[i]) return KLASSE_ORDER[i];
  }
  return KLASSE_ORDER[6];
}
const r1 = v => v===null ? null : Math.round(v*10)/10;
const r3 = v => v===null ? null : Math.round(v*1000)/1000;
function recompute(){
  const res = WeiiEngine.compute(MODEL, SETTINGS);
  LAST_MODEL_RESULT = res;
  CATS.forEach(cat=>{
    const w = CAT_WEII[cat.id];
    const r = res.byType[w];
    cat.sources = r.linked;
    cat.weer_aandeel = weerAandeel(w);
    const series = {};
    YEARS.forEach(y=>{
      const s = r.series[y];
      series[String(y)] = {
        gas_kental_m3: r3(s.gas_kental_m3), gas_kental_m3_raw: r3(s.gas_kental_m3_raw), weer_factor_verw: s.weer_factor_verw,
        elek_kental_kwh: r3(s.elek_kental_kwh), elek_kental_kwh_corr: r3(s.elek_kental_kwh_corr),
        weii: r1(s.weii), weii_gas: r1(s.weii_gas),
        aantal_panden: s.aantal_panden, gewicht_m2: Math.round(s.gewicht_m2),
        pv_aandeel: r3(s.pv_aandeel), opwek_kwh: r3(s.opwek_kwh), eigenverbruik_kwh: r3(s.eigenverbruik_kwh),
      };
    });
    const base = series[String(YEARS[0])].weii;
    YEARS.forEach(y=>{
      const s = series[String(y)];
      s.klasse = klasseForValue(s.weii, cat.thresholds);
      s.besparing_pct = (base && s.weii!==null) ? Math.round((1 - s.weii/base)*1000)/10 : null;
    });
    cat.series = series;
  });
  CATS.sort((a,b)=>{
    const x = a.series[String(LATEST_YEAR)].weii, z = b.series[String(LATEST_YEAR)].weii;
    return (x===null?1e9:x) - (z===null?1e9:z);
  });
  // landelijk gemiddelde: gewogen op oppervlak over de oorspronkelijke 14 gebruikstypen (AGG_IDS)
  const agg = {};
  YEARS.forEach(y=>{
    let nW=0,dW=0,nG=0,dG=0,nZ=0,dZ=0,nE=0,dE=0,n=0,pand=0;
    CATS.forEach(c=>{
      if(!AGG_IDS.has(c.id)) return;
      const s = c.series[String(y)];
      const g = s.gewicht_m2;
      if(s.weii!==null && g){ nW += s.weii*g; dW += g; n++; pand += s.aantal_panden; }
      if(s.weii_gas!==null && g){ nG += s.weii_gas*g; dG += g; }
      if(s.opwek_kwh!==null && g){ nZ += s.opwek_kwh*g; dZ += g; }
      if(s.eigenverbruik_kwh!==null && g){ nE += s.eigenverbruik_kwh*g; dE += g; }
    });
    agg[String(y)] = {weii: dW? r1(nW/dW):null, weii_gas: dG? r1(nG/dG):null, opwek_kwh: dZ? r3(nZ/dZ):null,
      eigenverbruik_kwh: dE? r3(nE/dE):null, aantal_panden: pand, gewicht_m2: dW, n_categories: n};
  });
  DATA.aggregate = agg;
  const a0 = agg[String(YEARS[0])].weii, a1 = agg[String(LATEST_YEAR)].weii;
  DATA.aggregate_besparing_2024 = (a0 && a1) ? Math.round((1 - a1/a0)*1000)/10 : null;
  Object.keys(_aggCache).forEach(k=>{ delete _aggCache[k]; });
}

// ---------- weergave: tabel in de Methodiek met de actieve weercorrectie-aandelen
function renderWeerAandeel(){
  const wrap = document.getElementById('weer-aandeel-wrap');
  if(!wrap) return;
  const pct = v => hasVal(v) ? Math.round(v*100)+'%' : '–';
  const rows = CATS.slice().sort((a,b)=>a.label.localeCompare(b.label,'nl')).map(c=>{
    const a = c.weer_aandeel || {};
    return '<tr><td>'+esc(c.label)+'</td><td>'+pct(a.gas)+'</td><td>'+pct(a.elek)+'</td></tr>';
  }).join('');
  wrap.innerHTML = '<div class="wa-scroll"><table class="wa-table"><thead><tr><th>Gebouwtype</th><th>Aandeel gas naar ruimteverwarming</th><th>Aandeel elektriciteit naar ruimteverwarming</th></tr></thead><tbody>'+rows+'</tbody></table></div>';
}

// ---------- Excelbestand downloaden
function xlsxBlob(){
  const bin = atob(XLSX_B64);
  const u8 = new Uint8Array(bin.length);
  for(let i=0;i<bin.length;i++) u8[i] = bin.charCodeAt(i);
  return new Blob([u8], {type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
}
async function downloadExcel(){
  const blob = xlsxBlob();
  try{
    if(window.claude && typeof window.claude.use === 'function'){
      const d = await window.claude.use('downloads');
      if(d){ await d.save({filename: XLSX_NAME, data: blob}); return; }
    }
  }catch(e){ if(e && e.code === 'declined') return; }
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = XLSX_NAME; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(()=>URL.revokeObjectURL(url), 4000);
}

// ---------- Settings-weergave
const viewDash = document.getElementById('view-dashboard');
const viewSet = document.getElementById('view-settings');
const viewBtns = document.querySelectorAll('.view-btn');
const viewBtnSettings = document.getElementById('view-btn-settings');
let settingsBuilt = false, dashDirty = false, oppMode = 'gas', resetArmed = null;

function countLinked(){ return SETTINGS.map.filter(m=>m[0]!==NVT).length; }
function weiiOptions(selected, withBlank){
  let h = withBlank ? '<option value="">—</option>' : '';
  WEII_TYPES.forEach(w=>{ h += '<option value="'+esc(w)+'"'+(w===selected?' selected':'')+'>'+esc(w)+'</option>'; });
  if(!withBlank) h += '<option value="'+NVT+'"'+(selected===NVT?' selected':'')+'>'+NVT_LABEL+'</option>';
  return h;
}
function nvtFirstOptions(selected){
  // n.v.t. staat bovenaan de keuzelijst van het eerste gebruikstype
  let h = '<option value="'+NVT+'"'+(selected===NVT?' selected':'')+'>'+NVT_LABEL+'</option>';
  WEII_TYPES.forEach(w=>{ h += '<option value="'+esc(w)+'"'+(w===selected?' selected':'')+'>'+esc(w)+'</option>'; });
  return h;
}
function koppelingRows(){
  return MODEL.types.map((t,i)=>{
    const m = SETTINGS.map[i], nvt = m[0]===NVT;
    return '<tr class="'+(nvt?'nvt':'')+'"><td>'+esc(t.name)+'</td>'
      + '<td><select class="set-select'+(nvt?' nvt':'')+'" data-map="'+i+'" data-slot="0" aria-label="WEii-gebruikstype voor '+esc(t.name)+'">'+nvtFirstOptions(m[0])+'</select></td>'
      + '<td><select class="set-select" data-map="'+i+'" data-slot="1"'+(nvt?' disabled':'')+' aria-label="2e gebruikstype voor '+esc(t.name)+'">'+weiiOptions(m[1], true)+'</select></td>'
      + '<td class="num">'+nlInt(t.pElek[YEARS.length-1])+'</td></tr>';
  }).join('');
}
function weerRows(){
  const typesShown = WEII_TYPES.filter(w=>Object.keys(CAT_WEII).some(c=>CAT_WEII[c]===w));
  return typesShown.map(w=>{
    const a = SETTINGS.weer[w] || {};
    const f = v => (v && v>0) ? String(Math.round(v*1000)/10) : '';
    const mg = MERGED_BY_FIRST[w];
    return '<tr><td>'+esc(mg ? mg.label : w)+'</td>'
      + '<td><span class="set-pct"><input type="number" class="set-input'+(a.gas>0?' filled':'')+'" min="0" max="100" step="1" placeholder="0" data-weer="'+esc(w)+'" data-kind="gas" value="'+f(a.gas)+'" aria-label="Aandeel gas voor ruimteverwarming, '+esc(w)+'"><span>%</span></span></td>'
      + '<td><span class="set-pct"><input type="number" class="set-input'+(a.elek>0?' filled':'')+'" min="0" max="100" step="1" placeholder="0" data-weer="'+esc(w)+'" data-kind="elek" value="'+f(a.elek)+'" aria-label="Aandeel elektriciteit voor ruimteverwarming, '+esc(w)+'"><span>%</span></span></td></tr>';
  }).join('');
}
function klasseRows(){
  const fmt = v => (v===null||v===undefined) ? '–' : nlInt(v);
  return WEII_TYPES.filter(w=>!MERGED_SECOND.has(w)).map(w=>{
    const mg = MERGED_BY_FIRST[w];
    const info = mg ? {thr:mg.thr, partial:false} : WEII_INFO[w];
    const set = mg ? mg.parts : [w];
    const names = []; MODEL.types.forEach((t,i)=>{ const m = SETTINGS.map[i]; if(set.indexOf(m[0])>=0 || set.indexOf(m[1])>=0) names.push(t.name); });
    return '<tr><td>'+esc(mg ? mg.label : w)+(info.partial?'<span class="set-tag">grenzen deels</span>':'')+'</td>'
      + '<td class="num" data-count-for="'+esc(w)+'" title="'+esc(names.join('\n'))+'">'+names.length+'</td>'
      + info.thr.map(v=>'<td class="num">'+fmt(v)+'</td>').join('')+'</tr>';
  }).join('');
}
function oppRows(){
  const k = oppMode==='gas' ? 'oppGas' : 'oppElek';
  const est = oppMode==='gas' ? 'estGas' : 'estElek';
  const info = LAST_MODEL_RESULT.info;
  return MODEL.types.map((t,i)=>{
    return '<tr><td>'+esc(t.name)+'</td>' + YEARS.map((y,j)=>{
      const v = SETTINGS[k][i][j];
      return '<td class="num"><input type="number" class="set-input'+(v?' filled':'')+'" min="1" step="any" data-opp="'+k+'" data-t="'+i+'" data-y="'+j+'" placeholder="'+Math.round(info[i][est][j])+'" value="'+(v||'')+'" aria-label="Gemiddeld oppervlak per pand, '+esc(t.name)+', '+y+'"></td>';
    }).join('') + '</tr>';
  }).join('');
}
function statusHtml(){
  return '<strong>'+countLinked()+'</strong> van <strong>'+MODEL.types.length+'</strong> TNO-gebouwtypen gekoppeld · weging: <strong>oppervlak</strong> · weercorrectie: <strong>'+(weerIsOn()?'aan':'uit')+'</strong>'
    + (storageOK ? '' : ' · <span style="color:var(--text3)">wijzigingen kunnen in deze omgeving niet worden bewaard</span>');
}
function buildSettings(){
  const f = LAST_MODEL_RESULT.info;
  const fac = MODEL.fcor.map((v,i)=>YEARS[i]+': '+(v>=0?'+':'−')+(Math.abs(v)*100).toLocaleString('nl-NL',{minimumFractionDigits:1,maximumFractionDigits:1})+'%').join(', ');
  viewSet.innerHTML =
    '<div class="kader"><div class="set-h">Settings</div>'
    + '<p class="set-sub">Hier bepaal je hoe de '+MODEL.types.length+' TNO-gebouwtypen worden samengevoegd tot de WEii-gebruiksfuncties. Wijzigingen worden direct doorgerekend in het dashboard en in deze browser bewaard.</p>'
    + '<div class="set-status" id="set-status">'+statusHtml()+'</div>'
    + '<div class="set-toolbar"><button type="button" class="set-btn" id="set-reset">Herstel standaardinstellingen</button></div></div>'

    + '<div class="kader"><div class="set-h">Excelbestand achter het dashboard</div>'
    + '<p class="set-sub">Het dashboard rekent met de gegevens uit het Excelbestand "Kentallen per WEii-gebruikstype 2020-2024": de kentallen per TNO-gebouwtype, de aantallen panden, het oppervlak per pand, de koppeling en de weercorrectie- en CO₂-factoren. Download het Excelbestand om de berekening in Excel na te lopen. Het bestand bevat de standaardinstellingen; wijzigingen die je hier maakt zitten er niet in.</p>'
    + '<div class="set-source">Gegevensbron: ingebouwd Excelbestand <strong>'+XLSX_NAME+'</strong> ('+new Date(DATA.meta.generated).toLocaleDateString('nl-NL',{day:'numeric',month:'long',year:'numeric'})+').</div>'
    + '<div class="set-toolbar" style="margin-top:10px;"><button type="button" class="set-btn primary" id="set-download">Download Excelbestand</button></div></div>'

    + '<div class="kader"><div class="set-h">1. Koppeling TNO-gebouwtype met WEii-gebruikstype</div>'
    + '<p class="set-sub">Kies per TNO-gebouwtype de WEii-gebruiksfunctie. Gebruik de tweede kolom alleen als één TNO-type bij twee gebruiksfuncties hoort (bijvoorbeeld Restaurant én Café): beide krijgen dan hetzelfde kental. "n.v.t." betekent dat het type niet meetelt. Het landelijk gemiddelde in het dashboard is het naar oppervlak gewogen gemiddelde over 14 gebruikstypen (alle gebruikstypen behalve Sauna, Medische (groeps) praktijk, Opvang zonder overnachting, Garage/showroom, Vakantiepark, Sportaccommodatie binnen en buiten, Grondgebonden woningen en Appartementen). Zo tellen TNO-gebouwtypen die aan twee gebruikstypen zijn gekoppeld niet dubbel mee. In grafieken en tabellen worden Winkel met en zonder warenkoeling samen getoond als Winkel* en Café en Restaurant samen als Café/restaurant**: TNO publiceert daarvoor geen afzonderlijke kentallen.</p>'
    + '<div class="set-scroll"><table class="set-table"><thead><tr><th>TNO-gebouwtype</th><th>WEii-gebruikstype</th><th>2e gebruikstype (optioneel)</th><th class="num">Panden '+LATEST_YEAR+'</th></tr></thead><tbody id="set-kop-body">'+koppelingRows()+'</tbody></table></div></div>'

    + '<div class="kader"><div class="set-h">2. Weercorrectie: aandeel ruimteverwarming</div>'
    + '<p class="set-sub">De weercorrectie (WEii-protocol §6.3.1) geldt alleen voor het deel van het energiegebruik dat naar ruimteverwarming gaat. Vul per gebruikstype het aandeel in van het gas- en het elektriciteitsverbruik dat naar ruimteverwarming gaat. Leeg of 0% betekent geen weercorrectie, en dat is de standaard. De weerfactoren (De Bilt, WEii.nl) zijn: '+fac+'. Een correctie werkt door in WEii, WEii-gas en WEii-finaal, nooit in WEii-CO₂ of het eigenverbruik van zonnestroom.</p>'
    + '<div class="set-scroll nomax"><table class="set-table"><thead><tr><th>WEii-gebruikstype</th><th>Aandeel gas</th><th>Aandeel elektriciteit</th></tr></thead><tbody id="set-weer-body">'+weerRows()+'</tbody></table></div></div>'

    + '<div class="kader"><div class="set-h">3. WEii-gebruikstypen en klassegrenzen (kWh/m², alleen-lezen)</div>'
    + '<p class="set-sub">Bovengrens per klasse (WEii ≤ grens). De grenzen liggen vast. Voor 14 gebruikstypen komen ze uit protocol Tabel 4. Bij gebruikstypen met het label "grenzen deels" zijn Paris Proof, Zeer zuinig en Zuinig overgenomen uit de routekaart (2040, 2030 en 2025); boven Zuinig is de klasse daar "onbekend". De kolom "TNO" toont hoeveel TNO-gebouwtypen gekoppeld zijn (beweeg eroverheen voor de namen). Winkel* en Café/restaurant** zijn samengevoegde gebruikstypen met gewogen klassegrenzen; zie de voetnoten onder de tabel.</p>'
    + '<div class="set-scroll nomax"><table class="set-table"><thead><tr><th>WEii-gebruikstype</th><th class="num">TNO</th>'+['Paris Proof','Zeer zuinig','Zuinig','Gemiddeld','Onzuinig'].map(h=>'<th class="num">'+h+'</th>').join('')+'</tr></thead><tbody id="set-klasse-body">'+klasseRows()+'</tbody></table></div>'
    + '<div class="set-notes" style="margin-top:10px;font-size:12px;line-height:1.45;color:var(--text3);">'+MERGED.map(m=>'<p style="margin:0 0 4px;">'+esc(m.note)+'</p>').join('')+'</div></div>'

    + '<div class="kader"><div class="set-h">4. Gemiddeld oppervlak per pand (m²)</div>'
    + '<p class="set-sub">Vul het gemiddelde gebruiksoppervlak per pand in dat TNO per gebouwtype en jaar opgeeft. Een lege cel betekent dat de schatting uit de TNO-oppervlakteklassen wordt gebruikt (grijs weergegeven). Ingevulde waarden kleuren groen. Heeft TNO een totaaloppervlak gegeven? Deel dat dan door het aantal panden. Dit oppervlak bepaalt, samen met het aantal panden, hoe zwaar elk TNO-gebouwtype meeweegt. Voor zonnestroom wordt het oppervlak van de elektriciteitspopulatie gebruikt.</p>'
    + '<div class="set-tab" id="set-opp-tab"><button type="button" data-opp-mode="gas" class="'+(oppMode==='gas'?'on':'')+'">Gas</button><button type="button" data-opp-mode="elek" class="'+(oppMode==='elek'?'on':'')+'">Elektriciteit</button></div>'
    + '<div class="set-scroll"><table class="set-table"><thead><tr><th>TNO-gebouwtype</th>'+YEARS.map(y=>'<th class="num">'+y+'</th>').join('')+'</tr></thead><tbody id="set-opp-body">'+oppRows()+'</tbody></table></div></div>';
  makeSettingsCollapsible();
  settingsBuilt = true;
}
// Hoofdstukken 1 t/m 4 in Settings zijn individueel uit- en inklapbaar; standaard ingeklapt.
function makeSettingsCollapsible(){
  // alleen de genummerde hoofdstukken 1 t/m 4 klappen; de intro- en Excelbestand-kaart blijven open
  const cards = Array.from(viewSet.querySelectorAll(':scope > .kader')).filter(c=>/^\d\./.test(c.querySelector('.set-h').textContent));
  cards.forEach(card=>{
    const h = card.querySelector('.set-h');
    const body = document.createElement('div');
    body.className = 'set-sec-body';
    Array.from(card.children).forEach(ch=>{ if(ch!==h) body.appendChild(ch); });
    const btn = document.createElement('button');
    btn.type = 'button'; btn.className = 'set-sec-head'; btn.setAttribute('aria-expanded','false');
    btn.innerHTML = '<span></span><span class="set-sec-chev">›</span>';
    btn.firstChild.textContent = h.textContent;
    h.replaceWith(btn);
    card.appendChild(body);
    card.classList.add('set-sec');
    btn.addEventListener('click', ()=>{ const on = card.classList.toggle('on'); btn.setAttribute('aria-expanded', String(on)); syncSetAll(); });
  });
  const tb = viewSet.querySelector('.set-toolbar');
  if(tb && !document.getElementById('set-all')){
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'set-btn'; b.id = 'set-all'; b.textContent = 'Alles uitklappen';
    tb.appendChild(b);
    b.addEventListener('click', ()=>{
      const secs = viewSet.querySelectorAll('.set-sec');
      const open = !Array.from(secs).every(x=>x.classList.contains('on'));
      secs.forEach(x=>{ x.classList.toggle('on', open); x.querySelector('.set-sec-head').setAttribute('aria-expanded', String(open)); });
      syncSetAll();
    });
  }
}
function syncSetAll(){
  const b = document.getElementById('set-all'); if(!b) return;
  const secs = Array.from(viewSet.querySelectorAll('.set-sec'));
  b.textContent = secs.every(x=>x.classList.contains('on')) ? 'Alles inklappen' : 'Alles uitklappen';
}
function refreshSettingsDynamic(){
  const st = document.getElementById('set-status'); if(st) st.innerHTML = statusHtml();
  const kb = document.getElementById('set-klasse-body'); if(kb) kb.innerHTML = klasseRows();
  const wb = document.getElementById('set-weer-body');
  if(viewBtnSettings) viewBtnSettings.classList.toggle('changed', !settingsAreDefault());
}
function afterSettingsChange(){
  saveSettings();
  recompute();
  dashDirty = true;
  refreshSettingsDynamic();
}
function flushDashboard(){
  renderWeerAandeel();
  renderAll();
  updatePathwayControlsState();
  dashDirty = false;
}
function showView(v){
  const set = v === 'settings';
  viewBtns.forEach(b=>{ const on = b.dataset.view === v; b.classList.toggle('on', on); b.setAttribute('aria-selected', String(on)); });
  if(set){
    if(!settingsBuilt) buildSettings();
    viewDash.hidden = true; viewSet.hidden = false;
  } else {
    viewSet.hidden = true; viewDash.hidden = false;
    flushDashboard();
  }
  const sc = document.querySelector('.page-scroll'); if(sc) sc.scrollTop = 0;
}
viewBtns.forEach(b=>b.addEventListener('click', ()=>showView(b.dataset.view)));

viewSet.addEventListener('change', e=>{
  const t = e.target;
  if(t.matches('select[data-map]')){
    const i = +t.dataset.map, slot = +t.dataset.slot;
    const m = SETTINGS.map[i].slice();
    m[slot] = t.value;
    if(m[0] === NVT) m[1] = '';
    if(m[1] && m[1] === m[0]) m[1] = '';
    SETTINGS.map[i] = m;
    // alleen deze rij bijwerken (de scrollpositie blijft behouden)
    const tr = t.closest('tr');
    tr.classList.toggle('nvt', m[0]===NVT);
    const s0 = tr.querySelector('select[data-slot="0"]'), s1 = tr.querySelector('select[data-slot="1"]');
    s0.classList.toggle('nvt', m[0]===NVT);
    s1.disabled = m[0]===NVT; s1.value = m[1];
    afterSettingsChange();
  } else if(t.matches('input[data-weer]')){
    const w = t.dataset.weer, kind = t.dataset.kind;
    let v = parseFloat(String(t.value).replace(',','.'));
    v = (isFinite(v) && v > 0) ? Math.min(v, 100)/100 : 0;
    const cur = SETTINGS.weer[w] || {gas:0, elek:0};
    cur[kind] = v;
    if(cur.gas>0 || cur.elek>0) SETTINGS.weer[w] = cur; else delete SETTINGS.weer[w];
    t.value = v>0 ? String(Math.round(v*1000)/10) : '';
    t.classList.toggle('filled', v>0);
    afterSettingsChange();
  } else if(t.matches('input[data-opp]')){
    const k = t.dataset.opp, i = +t.dataset.t, j = +t.dataset.y;
    let v = parseFloat(String(t.value).replace(',','.'));
    v = (isFinite(v) && v > 0) ? v : null;
    SETTINGS[k][i][j] = v;
    t.value = v===null ? '' : String(v);
    t.classList.toggle('filled', v!==null);
    afterSettingsChange();
  }
});
viewSet.addEventListener('click', e=>{
  const b = e.target.closest('button'); if(!b) return;
  if(b.id === 'set-download'){ downloadExcel(); return; }
  if(b.id === 'set-reset'){
    if(!resetArmed){
      b.textContent = 'Zeker weten? Klik nogmaals'; b.classList.add('warn');
      resetArmed = setTimeout(()=>{ resetArmed = null; b.textContent = 'Herstel standaardinstellingen'; b.classList.remove('warn'); }, 4000);
      return;
    }
    clearTimeout(resetArmed); resetArmed = null;
    SETTINGS = defaultSettings();
    afterSettingsChange();
    buildSettings();
    return;
  }
  if(b.dataset.oppMode){
    oppMode = b.dataset.oppMode;
    viewSet.querySelectorAll('#set-opp-tab button').forEach(x=>x.classList.toggle('on', x.dataset.oppMode===oppMode));
    document.getElementById('set-opp-body').innerHTML = oppRows();
  }
});

recompute();
if(viewBtnSettings) viewBtnSettings.classList.toggle('changed', !settingsAreDefault());


updatePathwayControlsState();
const genDateEl = document.getElementById('gen-date');
if(genDateEl) genDateEl.textContent = new Date(DATA.meta.generated).toLocaleDateString('nl-NL', {day:'numeric', month:'long', year:'numeric'});

// ---------- uitklapmenu (methodiek en bronnen): één samengevouwen blok ----------
function initMlist(){
  renderWeerAandeel();
  renderCrremMap();
  document.querySelectorAll('.mrow').forEach(row=>{
    const head = row.querySelector('.mrow-head');
    if(head && !head.querySelector('.mrow-chev')){
      const chev = document.createElement('span');
      chev.className = 'mrow-chev';
      chev.textContent = '›';
      head.appendChild(chev);
    }
    if(head && !head.dataset.mrowInit){
      head.dataset.mrowInit = '1';
      const toggle = ()=>{ const on = row.classList.toggle('on'); head.setAttribute('aria-expanded', String(on)); };
      head.addEventListener('click', toggle);
      head.addEventListener('keydown', e=>{ if(e.key==='Enter' || e.key===' '){ e.preventDefault(); toggle(); } });
    }
  });
  // uitklapbare kopjes binnen Methodiek en bronnen
  const secs = Array.from(document.querySelectorAll('.msec'));
  const allBtn = document.getElementById('msec-all');
  const syncAll = ()=>{ if(allBtn) allBtn.textContent = secs.every(x=>x.classList.contains('on')) ? 'Alles inklappen' : 'Alles uitklappen'; };
  secs.forEach(sec=>{
    const b = sec.querySelector('.msec-head');
    b.addEventListener('click', ()=>{ const on = sec.classList.toggle('on'); b.setAttribute('aria-expanded', String(on)); syncAll(); });
  });
  if(allBtn) allBtn.addEventListener('click', ()=>{
    const open = !secs.every(x=>x.classList.contains('on'));
    secs.forEach(x=>{ x.classList.toggle('on', open); x.querySelector('.msec-head').setAttribute('aria-expanded', String(open)); });
    syncAll();
  });
}
initMlist();

renderAll();
})();
