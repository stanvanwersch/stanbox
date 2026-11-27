/* Energy Profiles 03: de kaart (Leaflet). Gemeenten altijd, buurten van de gekozen gemeente erbovenop.
   Buurtbestanden (data/buurten/<code>.js) worden pas geladen als je een gemeente kiest. */
(function () {
  'use strict';
  const SK = window.SK;
  const TEGELS = 'https://service.pdok.nl/brt/achtergrondkaart/wmts/v2_0/grijs/EPSG:3857/{z}/{x}/{y}.png';
  const NL_GRENS = [[50.75, 3.36], [53.56, 7.23]];
  let kaart, gemLaag, buurtLaag = null, buurtLaagCode = null;
  const gemLagen = {};      // gemeentecode -> Leaflet-laag
  let buurtLagen = {};      // buurtcode -> Leaflet-laag
  let zweef = null;         // laag onder de muis

  const feature = (geb, soort) => ({ type: 'Feature', properties: { id: geb.id, soort: soort }, geometry: { type: 'MultiPolygon', coordinates: geb.g }, geb: geb });

  function tipTekst(geb) {
    const v = SK.waarde(geb);
    let extra = '';
    if (SK.laag === 'nu' && geb.p) { const [g, e] = SK.kw(SK.nuKw(geb)); extra = ' (' + g + ' ' + e + ')'; }
    if (SK.laagDef().alleenGemeente && !geb.n) return '<b>' + SK.esc(geb.naam) + '</b><br><span>' + SK.esc(SK.t('alleenGemeenten')) + '</span>';
    return '<b>' + SK.esc(geb.naam) + '</b><br><span>' + SK.esc(SK.laagWaardeTekst(v)) + extra + '</span>';
  }

  function stijlGemeente(geb) {
    const gekozen = SK.gemeente && SK.gemeente.id === geb.id;
    const kleur = SK.kleur(SK.waarde(geb));
    if (gekozen) return { stroke: true, color: '#1A1A1A', weight: 2.5, fill: false, fillOpacity: 0 };
    return {
      stroke: true, color: '#FFFFFF', weight: SK.gemeente ? 0.6 : 0.8, opacity: 1,
      fill: true, fillColor: kleur || '#FFFFFF', fillOpacity: kleur ? (SK.gemeente ? 0.35 : 0.88) : 0.4
    };
  }
  function stijlBuurt(geb) {
    const gekozen = SK.buurt && SK.buurt.id === geb.id;
    const kleur = SK.laagDef().alleenGemeente ? null : SK.kleur(SK.waarde(geb));
    return {
      stroke: true, color: gekozen ? '#1A1A1A' : '#FFFFFF', weight: gekozen ? 3 : 0.7, opacity: 1,
      fill: true, fillColor: kleur || '#FFFFFF', fillOpacity: kleur ? 0.9 : 0.55
    };
  }

  function koppel(laag, soort) {
    laag.on('mouseover', function (e) {
      zweef = e.layer || laag;
      zweef.setStyle({ weight: soort === 'buurt' ? 2 : 2, color: '#1A1A1A' });
      zweef.bringToFront();
      if (SK.buurt && buurtLagen[SK.buurt.id]) buurtLagen[SK.buurt.id].bringToFront();
    });
    laag.on('mouseout', function () {
      if (!zweef) return;
      zweef.setStyle(soort === 'buurt' ? stijlBuurt(zweef.feature.geb) : stijlGemeente(zweef.feature.geb));
      zweef = null;
    });
  }

  SK.kaartStart = function () {
    kaart = L.map('kaart', { preferCanvas: true, zoomControl: false, minZoom: 6, maxZoom: 16, zoomSnap: 0.25, attributionControl: true });
    L.control.zoom({ position: 'topright' }).addTo(kaart);
    kaart.attributionControl.setPrefix(false);
    L.tileLayer(TEGELS, { maxZoom: 19, attribution: '© <a href="https://www.kadaster.nl">Kadaster</a> (PDOK), CBS' }).addTo(kaart);
    kaart.createPane('buurten').style.zIndex = 420;
    kaart.createPane('gemeenteRand').style.zIndex = 430;
    kaart.fitBounds(NL_GRENS, nlRand());

    gemLaag = L.geoJSON({ type: 'FeatureCollection', features: window.SK_GEMEENTEN.map(g => feature(g, 'gemeente')) }, {
      style: f => stijlGemeente(f.geb),
      onEachFeature: (f, laag) => {
        gemLagen[f.geb.id] = laag;
        laag.bindTooltip(() => tipTekst(f.geb), { sticky: true, className: 'sk-tip', direction: 'top', offset: [0, -8] });
        laag.on('click', () => { laag.closeTooltip(); SK.kiesGemeente(f.geb); });
      }
    }).addTo(kaart);
    koppel(gemLaag, 'gemeente');
  };

  /* buurtbestand laden met een script-tag (werkt ook via file://) */
  const wacht = {};
  window.SK_BUURTEN_LADEN = function (code, items) {
    SK.buurten[code] = items;
    if (wacht[code]) { wacht[code].forEach(f => f(items)); delete wacht[code]; }
  };
  SK.laadBuurten = function (code) {
    if (SK.buurten[code]) return Promise.resolve(SK.buurten[code]);
    return new Promise((ok, fout) => {
      if (wacht[code]) { wacht[code].push(ok); return; }
      wacht[code] = [ok];
      const sc = document.createElement('script');
      sc.src = 'data/buurten/' + code + '.js';
      sc.onerror = () => { delete wacht[code]; fout(new Error('laden mislukt: ' + code)); };
      document.body.appendChild(sc);
    });
  };

  SK.toonBuurten = function (code) {
    if (buurtLaag) { kaart.removeLayer(buurtLaag); buurtLaag = null; buurtLagen = {}; buurtLaagCode = null; }
    if (!code || !SK.buurten[code]) return;
    const items = SK.buurten[code].filter(b => b.g);
    buurtLaag = L.geoJSON({ type: 'FeatureCollection', features: items.map(b => feature(b, 'buurt')) }, {
      pane: 'buurten',
      style: f => stijlBuurt(f.geb),
      onEachFeature: (f, laag) => {
        buurtLagen[f.geb.id] = laag;
        laag.bindTooltip(() => tipTekst(f.geb), { sticky: true, className: 'sk-tip', direction: 'top', offset: [0, -8] });
        laag.on('click', e => { L.DomEvent.stopPropagation(e); laag.closeTooltip(); SK.kiesBuurt(f.geb); });
      }
    }).addTo(kaart);
    buurtLaagCode = code;
    koppel(buurtLaag, 'buurt');
  };

  SK.kaartBijwerken = function () {
    if (!gemLaag) return;
    gemLaag.eachLayer(l => l.setStyle(stijlGemeente(l.feature.geb)));
    if (buurtLaag) buurtLaag.eachLayer(l => l.setStyle(stijlBuurt(l.feature.geb)));
    if (SK.gemeente && gemLagen[SK.gemeente.id]) gemLagen[SK.gemeente.id].bringToFront();
    if (SK.buurt && buurtLagen[SK.buurt.id]) buurtLagen[SK.buurt.id].bringToFront();
    // open tooltips bijwerken
    kaart.eachLayer(l => { if (l.getTooltip && l.getTooltip() && l.isTooltipOpen && l.isTooltipOpen()) l.getTooltip().setContent(tipTekst(l.feature.geb)); });
  };

  // ruimte voor de kaartlaag en de legenda links op de kaart
  function nlRand() { return window.innerWidth < 820 ? { paddingTopLeft: [10, 60], paddingBottomRight: [10, 90] } : { paddingTopLeft: [290, 60], paddingBottomRight: [10, 100] }; }
  SK.zoomNaar = function (wat) {
    const smal = window.innerWidth < 820;
    const opties = { paddingTopLeft: smal ? [20, 70] : [330, 80], paddingBottomRight: smal ? [20, 110] : [50, 130], maxZoom: 15 };
    if (!wat) { kaart.flyToBounds(NL_GRENS, Object.assign(nlRand(), { duration: 0.8 })); return; }
    const laag = wat === 'buurt' ? buurtLagen[SK.buurt && SK.buurt.id] : gemLagen[SK.gemeente && SK.gemeente.id];
    if (!laag) return;
    // een buurt die al helemaal in beeld is: niet verspringen
    if (wat === 'buurt' && kaart.getBounds().pad(-0.15).contains(laag.getBounds())) return;
    if (wat === 'buurt') opties.maxZoom = Math.max(13, Math.min(14, kaart.getZoom()));
    kaart.flyToBounds(laag.getBounds(), Object.assign(opties, { duration: 0.8 }));
  };
  SK.buurtOpKaart = id => !!buurtLagen[id];
  SK.kaartFormaat = () => kaart && kaart.invalidateSize();
})();
