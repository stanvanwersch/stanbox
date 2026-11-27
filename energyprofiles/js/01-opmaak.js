/* Energy Profiles 01: gedeelde toestand, taal, getalopmaak en kleurschalen. */
(function () {
  'use strict';

  const SK = window.SK = {
    taal: 'nl',
    laag: 'nu',
    maand: 6,          // 0 = januari; gebruikt als gemiddeld uit staat
    uur: 13,
    gemiddeld: true,   // standaard: gemiddelde dag over het hele jaar; false = één maand (SK.maand)
    vergelijk: [],     // gebieden in de vergelijking: { geb, gemeente }
    soort: 'netto',    // dagprofiel: netto, afname, tl (teruglevering) of gas
    gemeente: null,    // gekozen gemeente (object uit SK_GEMEENTEN)
    buurt: null,       // gekozen buurt (object uit het buurtbestand)
    buurten: {}        // geladen buurten per gemeentecode
  };

  try { const t = localStorage.getItem('sk-taal'); if (t === 'en' || t === 'nl') SK.taal = t; } catch (e) { /* geen opslag */ }

  SK.t = function (sleutel) { return window.SK_TEKST[SK.taal][sleutel]; };
  SK.laagDef = function (id) { return window.SK_LAGEN.find(l => l.id === (id || SK.laag)); };
  SK.lokaal = function () { return SK.taal === 'nl' ? 'nl-NL' : 'en-GB'; };

  /* ---- getallen */
  SK.getal = function (v, dec) {
    if (v == null || isNaN(v)) return '';
    return Number(v).toLocaleString(SK.lokaal(), { minimumFractionDigits: dec || 0, maximumFractionDigits: dec || 0 });
  };
  function schaal(v, eenheden) {
    const a = Math.abs(v);
    for (let i = eenheden.length - 1; i > 0; i--) {
      if (a >= eenheden[i][0] * 0.9995) {
        const x = v / eenheden[i][0];
        return [SK.getal(x, Math.abs(x) < 10 ? 2 : Math.abs(x) < 100 ? 1 : 0), eenheden[i][1]];
      }
    }
    return [SK.getal(v, a < 10 && a > 0 ? 1 : 0), eenheden[0][1]];
  }
  SK.kw = v => schaal(v, [[1, 'kW'], [1e3, 'MW'], [1e6, 'GW']]);
  SK.mwh = v => schaal(v, [[1, 'MWh'], [1e3, 'GWh'], [1e6, 'TWh']]);
  SK.m3 = v => schaal(v, [[1, 'm³'], [1e6, SK.taal === 'nl' ? 'mln m³' : 'mln m³'], [1e9, SK.taal === 'nl' ? 'mld m³' : 'bn m³']]);

  /* waarde van een gebied voor een kaartlaag (null = geen gegevens) */
  SK.waarde = function (geb, laagId) {
    const id = laagId || SK.laag;
    const s = geb && geb.s;
    if (!s) return null;
    if (id === 'nu') {
      if (!geb.p) return null;
      const v = SK.nuKw(geb);
      if (v >= 0) return s.pk ? v / s.pk * 100 : null;
      return s.ptl ? v / s.ptl * 100 : -100;
    }
    const v = s[id];
    return v == null ? null : v;
  };
  /* dagreeks van 24 uur: één maand, of het gemiddelde van de twaalf maanden */
  SK.dag = function (p, maand) {
    if (maand === 'gem' || (maand == null && SK.gemiddeld)) {
      const uit = [];
      for (let u = 0; u < 24; u++) { let s = 0; for (let m = 0; m < 12; m++) s += p[m * 24 + u]; uit.push(s / 12); }
      return uit;
    }
    const m = maand == null ? SK.maand : maand;
    return p.slice(m * 24, m * 24 + 24);
  };
  SK.nuKw = geb => (geb && geb.p ? SK.dag(geb.p)[SK.uur] : null);
  SK.momentTekst = () => (SK.gemiddeld ? SK.t('jaargemiddelde') : SK.t('maanden')[SK.maand]) + ', ' + String(SK.uur).padStart(2, '0') + ':00';

  SK.laagWaardeTekst = function (v, laagId) {
    const l = SK.laagDef(laagId);
    if (v == null) return SK.t('geenData');
    if (l.id === 'nu') return SK.getal(Math.abs(v), 0) + '% ' + (v < 0 ? SK.t('teruglevering') : SK.t('afname'));
    if (l.dynamisch) return SK.waardeOpmaak(v, l.soort);
    if (l.id === 'tlp') return SK.getal(v, 1) + '%';
    if (l.id === 'pf' || l.id === 'gl') return SK.getal(v, 2);
    return SK.getal(v, 0) + (l.eenheid === 'uur' ? (SK.taal === 'nl' ? ' uur' : ' h') : l.eenheid);
  };

  /* ---- kleuren: alleen huisstijlkleuren en tinten daartussen */
  const hex = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  const meng = (a, b, t) => a.map((x, i) => Math.round(x + (b[i] - x) * t));
  const rgb = c => 'rgb(' + c.join(',') + ')';
  function verloop(stops, t) {
    t = Math.max(0, Math.min(1, t));
    const n = stops.length - 1;
    const i = Math.min(n - 1, Math.floor(t * n));
    return rgb(meng(stops[i], stops[i + 1], t * n - i));
  }
  // van licht naar donker: perzik-licht, perzik, koraal-fel, koraal, zwart
  const EEN = ['#FBE3D2', '#F7C9A9', '#E5603F', '#C9452A', '#1A1A1A'].map(hex);
  // afname: wit, perzik, koraal-fel, koraal; teruglevering: wit, grijs, zwart
  const AF = ['#FFFFFF', '#F7C9A9', '#E5603F', '#C9452A'].map(hex);
  const TL = ['#FFFFFF', '#C8C2BD', '#7A7A7A', '#1A1A1A'].map(hex);

  /* schaal voor kentallen met absolute waarden: 5e tot 95e percentiel van de gebieden in beeld, logaritmisch */
  const domeinen = {};
  SK.niveau = () => (SK.gemeente && SK.buurten[SK.gemeente.id] ? 'buurt' : 'gem');
  SK.domein = function (laagId, niveau) {
    niveau = niveau || SK.niveau();
    const sleutel = laagId + '|' + niveau + '|' + (niveau === 'buurt' ? SK.gemeente.id : '');
    if (domeinen[sleutel]) return domeinen[sleutel];
    const lijst = niveau === 'buurt' ? SK.buurten[SK.gemeente.id] : window.SK_GEMEENTEN;
    const w = lijst.map(g => g.s && g.s[laagId]).filter(x => x > 0).sort((a, b) => a - b);
    if (!w.length) return (domeinen[sleutel] = [1, 10]);
    let mn = w[Math.floor(0.05 * (w.length - 1))], mx = w[Math.ceil(0.95 * (w.length - 1))];
    if (mx <= mn) mx = mn * 10;
    return (domeinen[sleutel] = [mn, mx]);
  };
  SK.waardeOpmaak = function (v, soort) {
    let g, e;
    if (soort === 'mwh') [g, e] = SK.mwh(v);
    else if (soort === 'kw') [g, e] = SK.kw(v);
    else [g, e] = SK.m3(v);
    return g + ' ' + e;
  };

  SK.kleur = function (v, laagId, niveau) {
    if (v == null) return null;
    const l = SK.laagDef(laagId);
    if (l.dynamisch) {
      if (v <= 0) return verloop(EEN, 0);
      const [mn, mx] = SK.domein(l.id, niveau);
      return verloop(EEN, (Math.log(v) - Math.log(mn)) / (Math.log(mx) - Math.log(mn)));
    }
    if (l.schaal === 'twee') {
      const t = v / (v >= 0 ? l.max : -l.min);
      return v >= 0 ? verloop(AF, t) : verloop(TL, -t);
    }
    let t = (v - l.min) / (l.max - l.min);
    if (l.omgekeerd) t = 1 - t;
    return verloop(EEN, t);
  };
  // kleur voor een waarde tussen -1 en 1 (voor het jaarbeeld)
  SK.kleurTwee = t => (t >= 0 ? verloop(AF, t) : verloop(TL, -t));
  SK.legendaKleuren = function (laagId, n) {
    const l = SK.laagDef(laagId);
    const uit = [];
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1);
      if (l.schaal === 'twee') uit.push(SK.kleurTwee(t * 2 - 1));
      else uit.push(verloop(EEN, t));
    }
    return uit;
  };

  SK.el = function (tag, cls, tekst) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (tekst != null) e.textContent = tekst;
    return e;
  };
  SK.esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
})();
