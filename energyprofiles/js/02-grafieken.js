/* Energy Profiles 02: grafieken in het zijpaneel (SVG, zonder bibliotheek).
   dagprofiel: 24 uur van de gekozen maand, met de andere maanden dun erachter.
   jaarbeeld: 12 maanden x 24 uur als raster in de kleuren van afname en teruglevering. */
(function () {
  'use strict';
  const SK = window.SK;
  const NS = 'http://www.w3.org/2000/svg';
  function s(tag, attr, ouder) {
    const e = document.createElementNS(NS, tag);
    for (const k in attr) e.setAttribute(k, attr[k]);
    if (ouder) ouder.appendChild(e);
    return e;
  }
  function rondeStap(bereik) {
    const ruw = bereik / 4;
    const mag = Math.pow(10, Math.floor(Math.log10(ruw || 1)));
    const f = ruw / mag;
    return (f < 1.5 ? 1 : f < 3 ? 2 : f < 7 ? 5 : 10) * mag;
  }

  /* reeks voor de gekozen soort: netto zoals in de bron, afname = deel boven nul, teruglevering = deel onder nul (positief) */
  function reeks(dag, soort) {
    if (soort === 'afname') return dag.map(v => Math.max(0, v));
    if (soort === 'tl') return dag.map(v => Math.max(0, -v));
    return dag;
  }

  /* opties: { b, h } maat in px (standaard voor het paneel), groot = true voor de vergrote weergave */
  SK.dagprofiel = function (p, opties) {
    opties = opties || {};
    const soort = SK.soort === 'gas' ? 'netto' : SK.soort;
    const groot = !!opties.groot;
    const B = opties.b || 396, H = opties.h || 210, L = groot ? 58 : 46, R = groot ? 16 : 8, T = 22, O = 24;
    const svg = s('svg', { viewBox: '0 0 ' + B + ' ' + H, class: 'grafiek', role: 'img', width: B, height: H });
    const maanden = [];
    for (let m = 0; m < 12; m++) maanden.push(reeks(SK.dag(p, m), soort));
    const dm = reeks(SK.dag(p), soort);
    const alle = maanden.flat().concat(dm);
    let mn = Math.min(0, ...alle), mx = Math.max(0, ...alle);
    if (mx === mn) mx = mn + 1;
    const stap = rondeStap(mx - mn);
    mn = Math.floor(mn / stap) * stap; mx = Math.ceil(mx / stap) * stap;
    const x = u => L + (B - L - R) * u / 23;
    const y = v => T + (H - T - O) * (mx - v) / (mx - mn);
    // rasterlijnen en as, in één eenheid (kW, MW of GW) voor de hele as
    const grootst = Math.max(Math.abs(mn), Math.abs(mx));
    const [deler, eenheid] = grootst >= 1e6 ? [1e6, 'GW'] : grootst >= 1e3 ? [1e3, 'MW'] : [1, 'kW'];
    const dec = stap / deler < 1 ? (stap / deler < 0.1 ? 2 : 1) : 0;
    s('text', { x: L - 8, y: T - 10, 'text-anchor': 'end' }, svg).textContent = eenheid;
    for (let v = mn; v <= mx + stap / 2; v += stap) {
      const nul = Math.abs(v) < stap / 2;
      s('line', { x1: L, x2: B - R, y1: y(v), y2: y(v), class: nul ? 'nul' : 'as' }, svg);
      s('text', { x: L - 8, y: y(v) + 3.5, 'text-anchor': 'end' }, svg).textContent = nul ? '0' : SK.getal(v / deler, dec);
    }
    const uren = groot ? [0, 3, 6, 9, 12, 15, 18, 21, 23] : [0, 6, 12, 18, 23];
    uren.forEach(u => { s('text', { x: x(u), y: H - 6, 'text-anchor': 'middle' }, svg).textContent = String(u).padStart(2, '0') + ':00'; });
    // de maanden dun erachter (in de vergrote weergave met naam bij het uiteinde)
    maanden.forEach((d, m) => {
      if (!SK.gemiddeld && m === SK.maand) return;
      s('path', { d: d.map((v, u) => (u ? 'L' : 'M') + x(u).toFixed(1) + ' ' + y(v).toFixed(1)).join(''), class: 'rest' }, svg);
    });
    // gekozen maand of jaargemiddelde, met vlak voor afname (boven nul) en teruglevering (onder nul)
    const lijn = dm.map((v, u) => (u ? 'L' : 'M') + x(u).toFixed(1) + ' ' + y(v).toFixed(1)).join('');
    const clipId = 'c' + Math.random().toString(36).slice(2);
    const defs = s('defs', {}, svg);
    const c1 = s('clipPath', { id: clipId + 'a' }, defs); s('rect', { x: 0, y: 0, width: B, height: y(0) }, c1);
    const c2 = s('clipPath', { id: clipId + 'b' }, defs); s('rect', { x: 0, y: y(0), width: B, height: H }, c2);
    const vlak = lijn + 'L' + x(23) + ' ' + y(0) + 'L' + x(0) + ' ' + y(0) + 'Z';
    s('path', { d: vlak, class: soort === 'tl' ? 'vlak-tl' : 'vlak-af', 'clip-path': 'url(#' + clipId + 'a)' }, svg);
    s('path', { d: vlak, class: 'vlak-tl', 'clip-path': 'url(#' + clipId + 'b)' }, svg);
    s('path', { d: lijn, class: 'lijn' }, svg);
    // gekozen uur
    const v = dm[SK.uur];
    s('line', { x1: x(SK.uur), x2: x(SK.uur), y1: T - 4, y2: H - O, class: 'cursor' }, svg);
    s('circle', { cx: x(SK.uur), cy: y(v), r: groot ? 5.5 : 4.5, class: 'punt' }, svg);
    const [g, e] = SK.kw(v);
    const lx = Math.min(Math.max(x(SK.uur), L + 34), B - R - 34);
    s('text', { x: lx, y: T - 10, 'text-anchor': 'middle', class: 'waarde-label' }, svg).textContent = g + ' ' + e;
    // klikvlakken per uur
    const bw = (B - L - R) / 23;
    for (let u = 0; u < 24; u++) {
      const r = s('rect', { x: x(u) - bw / 2, y: T - 4, width: bw, height: H - O - T + 4, class: 'vang' }, svg);
      const [gg, ee] = SK.kw(dm[u]);
      s('title', {}, r).textContent = String(u).padStart(2, '0') + ':00  ' + gg + ' ' + ee;
      r.addEventListener('click', () => SK.zetMoment(SK.gemiddeld ? 'gem' : SK.maand, u));
    }
    return svg;
  };

  /* opties: { b, h } maat in px, groot = true voor de vergrote weergave */
  SK.jaarbeeld = function (p, opties) {
    opties = opties || {};
    const groot = !!opties.groot;
    const B = opties.b || 396, L = groot ? 40 : 30, T = 4, O = groot ? 22 : 18;
    const RH = opties.h ? Math.max(10, (opties.h - T - O) / 12) : Math.max(12, B / 33);
    const H = T + 12 * RH + O, C = (B - L) / 24;
    const svg = s('svg', { viewBox: '0 0 ' + B + ' ' + H, class: 'grafiek', role: 'img', width: B, height: H });
    let maxAf = 0, maxTl = 0;
    p.forEach(v => { if (v > maxAf) maxAf = v; if (-v > maxTl) maxTl = -v; });
    for (let m = 0; m < 12; m++) {
      s('text', { x: L - 6, y: T + m * RH + RH / 2 + 3.5, 'text-anchor': 'end' }, svg).textContent = SK.t('mnd')[m];
      for (let u = 0; u < 24; u++) {
        const v = p[m * 24 + u];
        const t = v >= 0 ? (maxAf ? v / maxAf : 0) : (maxTl ? v / maxTl : 0);
        const r = s('rect', { x: L + u * C, y: T + m * RH, width: C + 0.3, height: RH + 0.3, fill: SK.kleurTwee(t), class: 'cel' }, svg);
        const [g, e] = SK.kw(v);
        s('title', {}, r).textContent = SK.t('maanden')[m] + ' ' + String(u).padStart(2, '0') + ':00  ' + g + ' ' + e;
        r.addEventListener('click', () => SK.zetMoment(m, u));
      }
    }
    // gekozen maand en uur; bij het jaargemiddelde de hele kolom van het uur
    if (SK.gemiddeld) s('rect', { x: L + SK.uur * C, y: T, width: C, height: 12 * RH, class: 'uur-kader' }, svg);
    else s('rect', { x: L + SK.uur * C, y: T + SK.maand * RH, width: C, height: RH, class: 'kader' }, svg);
    (groot ? [0, 3, 6, 9, 12, 15, 18, 21] : [0, 6, 12, 18]).forEach(u => { s('text', { x: L + u * C + C / 2, y: H - 5, 'text-anchor': 'middle' }, svg).textContent = String(u).padStart(2, '0') + ':00'; });
    return svg;
  };

  /* vergelijken: per gebied een lijn met het netto vermogen als % van de eigen piek afname.
     reeksen: [{ naam, dag: [24], kleur, stippel }] */
  SK.vergelijkGrafiek = function (reeksen, opties) {
    const B = opties.b, H = opties.h, L = 46, R = 14, T = 16, O = 24;
    const svg = s('svg', { viewBox: '0 0 ' + B + ' ' + H, class: 'grafiek', role: 'img', width: B, height: H });
    const alle = reeksen.flatMap(r => r.dag);
    let mn = Math.min(0, ...alle), mx = Math.max(10, ...alle);
    const stap = rondeStap(mx - mn);
    mn = Math.floor(mn / stap) * stap; mx = Math.ceil(mx / stap) * stap;
    const x = u => L + (B - L - R) * u / 23;
    const y = v => T + (H - T - O) * (mx - v) / (mx - mn);
    for (let v = mn; v <= mx + stap / 2; v += stap) {
      const nul = Math.abs(v) < stap / 2;
      s('line', { x1: L, x2: B - R, y1: y(v), y2: y(v), class: nul ? 'nul' : 'as' }, svg);
      s('text', { x: L - 8, y: y(v) + 3.5, 'text-anchor': 'end' }, svg).textContent = nul ? '0' : SK.getal(v, 0) + '%';
    }
    [0, 3, 6, 9, 12, 15, 18, 21, 23].forEach(u => { s('text', { x: x(u), y: H - 6, 'text-anchor': 'middle' }, svg).textContent = String(u).padStart(2, '0') + ':00'; });
    s('line', { x1: x(SK.uur), x2: x(SK.uur), y1: T - 4, y2: H - O, class: 'cursor' }, svg);
    reeksen.forEach(r => {
      const pad = s('path', { d: r.dag.map((v, u) => (u ? 'L' : 'M') + x(u).toFixed(1) + ' ' + y(v).toFixed(1)).join(''), class: 'v-lijn', stroke: r.kleur }, svg);
      if (r.stippel) pad.setAttribute('stroke-dasharray', '6 4');
      s('title', {}, pad).textContent = r.naam;
    });
    const bw = (B - L - R) / 23;
    for (let u = 0; u < 24; u++) {
      const rr = s('rect', { x: x(u) - bw / 2, y: T - 4, width: bw, height: H - O - T + 4, class: 'vang' }, svg);
      s('title', {}, rr).textContent = String(u).padStart(2, '0') + ':00\n' + reeksen.map(r => r.naam + ': ' + SK.getal(r.dag[u], 0) + '%').join('\n');
      rr.addEventListener('click', () => SK.zetMoment(SK.gemiddeld ? 'gem' : SK.maand, u));
    }
    return svg;
  };
})();
