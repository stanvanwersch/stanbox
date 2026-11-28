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
    const alle = soort === 'beide' ? reeks(SK.dag(p), 'afname').concat(reeks(SK.dag(p), 'tl')) : maanden.flat().concat(dm);
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
    const kwTekst = w => { const [g, e] = SK.kw(w); return g + ' ' + e; };
    if (soort === 'beide') {
      // afname en teruglevering naast elkaar, allebei boven nul: koraal-fel met perzik vlak, zwart met grijs vlak
      const af = reeks(SK.dag(p), 'afname'), tl = reeks(SK.dag(p), 'tl');
      const pad = d => d.map((w, u) => (u ? 'L' : 'M') + x(u).toFixed(1) + ' ' + y(w).toFixed(1)).join('');
      const vlakVan = d => pad(d) + 'L' + x(23) + ' ' + y(0) + 'L' + x(0) + ' ' + y(0) + 'Z';
      s('path', { d: vlakVan(af), class: 'vlak-af' }, svg);
      s('path', { d: vlakVan(tl), class: 'vlak-tl' }, svg);
      s('path', { d: pad(af), class: 'lijn lijn-af' }, svg);
      s('path', { d: pad(tl), class: 'lijn' }, svg);
      s('line', { x1: x(SK.uur), x2: x(SK.uur), y1: T - 4, y2: H - O, class: 'cursor' }, svg);
      s('circle', { cx: x(SK.uur), cy: y(af[SK.uur]), r: groot ? 5.5 : 4.5, class: 'punt' }, svg);
      s('circle', { cx: x(SK.uur), cy: y(tl[SK.uur]), r: groot ? 5.5 : 4.5, class: 'punt punt-tl' }, svg);
      const lx = Math.min(Math.max(x(SK.uur), L + 70), B - R - 70);
      s('text', { x: lx, y: T - 10, 'text-anchor': 'middle', class: 'waarde-label' }, svg).textContent =
        SK.t('afname') + ' ' + kwTekst(af[SK.uur]) + ', ' + SK.t('teruglevering') + ' ' + kwTekst(tl[SK.uur]);
      // legenda linksboven in de grafiek
      const lg = s('g', { class: 'legenda-svg' }, svg);
      [[SK.t('afname'), 'lijn-af'], [SK.t('teruglevering'), '']].forEach(([naam, cls], i) => {
        const ly = T + 8 + i * 15;
        s('line', { x1: L + 8, x2: L + 24, y1: ly, y2: ly, class: 'lijn ' + cls }, lg);
        s('text', { x: L + 29, y: ly + 3.5 }, lg).textContent = naam;
      });
      const bw = (B - L - R) / 23;
      for (let u = 0; u < 24; u++) {
        const r = s('rect', { x: x(u) - bw / 2, y: T - 4, width: bw, height: H - O - T + 4, class: 'vang' }, svg);
        s('title', {}, r).textContent = String(u).padStart(2, '0') + ':00\n' + SK.t('afname') + ' ' + kwTekst(af[u]) + '\n' + SK.t('teruglevering') + ' ' + kwTekst(tl[u]);
        r.addEventListener('click', () => SK.zetMoment(SK.gemiddeld ? 'gem' : SK.maand, u));
      }
      return svg;
    }
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

  /* opties: { b, h } maat in px, groot = true voor de vergrote weergave.
     Boven: waarde van het vakje onder de muis (anders van het getoonde moment). Rechts: daggemiddelde per maand.
     Onder: kleurschaal met de grootste teruglevering en afname. Hoogste afname en teruglevering hebben een rand. */
  SK.jaarbeeld = function (p, opties) {
    opties = opties || {};
    // alleen afname: het deel boven nul; alleen teruglevering: het deel onder nul (blijft negatief, dus grijs)
    const soortJ = SK.soort === 'afname' || SK.soort === 'tl' ? SK.soort : 'netto';
    if (soortJ === 'afname') p = p.map(v => Math.max(0, v));
    else if (soortJ === 'tl') p = p.map(v => Math.min(0, v));
    const groot = !!opties.groot;
    const B = opties.b || 396, L = groot ? 40 : 30, R = groot ? 70 : 46, T = 22, O = groot ? 64 : 58;
    const RH = opties.h ? Math.max(10, (opties.h - T - O) / 12) : Math.max(12, B / 33);
    const H = T + 12 * RH + O, C = (B - L - R) / 24, Y0 = T + 12 * RH;
    const svg = s('svg', { viewBox: '0 0 ' + B + ' ' + H, class: 'grafiek jaarbeeld', role: 'img', width: B, height: H });
    let maxAf = 0, maxTl = 0, iAf = -1, iTl = -1;
    p.forEach((v, i) => { if (v > maxAf) { maxAf = v; iAf = i; } if (-v > maxTl) { maxTl = -v; iTl = i; } });
    const kwT = w => { const [g, e] = SK.kw(Math.abs(w)); return g + ' ' + e; };
    const soortV = v => (soortJ === 'tl' || (soortJ === 'netto' && v < 0) ? SK.t('teruglevering') : SK.t('afname'));
    const celTekst = (m, u) => {
      const v = p[m * 24 + u];
      return SK.t('maanden')[m] + ' ' + String(u).padStart(2, '0') + ':00: ' + kwT(v) + ' ' + soortV(v);
    };
    const standaard = () => {
      if (!SK.gemiddeld) return celTekst(SK.maand, SK.uur);
      const v = SK.dag(p)[SK.uur];
      return String(SK.uur).padStart(2, '0') + ':00, ' + SK.t('jaargemiddelde') + ': ' + kwT(v) + ' ' + soortV(v);
    };
    const info = s('text', { x: L, y: 13, class: 'jb-info' }, svg);
    info.textContent = standaard();
    const top = Math.max(maxAf, maxTl);
    const [deler, eenheid] = top >= 1e6 ? [1e6, 'GW'] : top >= 1e3 ? [1e3, 'MW'] : [1, 'kW'];
    const kort = w => SK.getal(w / deler, Math.abs(w / deler) < 10 ? 1 : 0);
    const metGetal = groot && C >= 34 && RH >= 20;
    for (let m = 0; m < 12; m++) {
      const yy = T + m * RH;
      s('text', { x: L - 6, y: yy + RH / 2 + 3.5, 'text-anchor': 'end' }, svg).textContent = SK.t('mnd')[m];
      for (let u = 0; u < 24; u++) {
        const v = p[m * 24 + u];
        const tt = v >= 0 ? (maxAf ? v / maxAf : 0) : (maxTl ? v / maxTl : 0);
        const r = s('rect', { x: L + u * C, y: yy, width: C + 0.3, height: RH + 0.3, fill: SK.kleurTwee(tt), class: 'cel' }, svg);
        s('title', {}, r).textContent = celTekst(m, u);
        r.addEventListener('click', () => SK.zetMoment(m, u));
        r.addEventListener('mouseenter', () => { info.textContent = celTekst(m, u); });
        r.addEventListener('mouseleave', () => { info.textContent = standaard(); });
        if (metGetal) s('text', { x: L + u * C + C / 2, y: yy + RH / 2 + 4, 'text-anchor': 'middle', class: 'jb-getal' + (Math.abs(tt) > 0.55 ? ' licht' : '') }, svg).textContent = kort(v);
      }
      // daggemiddelde van de maand
      const gem = SK.dag(p, m).reduce((x1, x2) => x1 + x2, 0) / 24;
      s('text', { x: B - 2, y: yy + RH / 2 + 3.5, 'text-anchor': 'end', class: 'jb-gem' }, svg).textContent = kort(gem);
    }
    s('text', { x: B - 2, y: T - 6, 'text-anchor': 'end', class: 'jb-kop' }, svg).textContent = SK.t('gemiddeld') + ' (' + eenheid + ')';
    // hoogste afname en hoogste teruglevering
    const rand = (i, cls) => { if (i >= 0) s('rect', { x: L + (i % 24) * C + 1, y: T + Math.floor(i / 24) * RH + 1, width: C - 2, height: RH - 2, class: cls }, svg); };
    rand(iAf, 'jb-max-af'); rand(iTl, 'jb-max-tl');
    // gekozen maand en uur; bij het jaargemiddelde de hele kolom van het uur
    if (SK.gemiddeld) s('rect', { x: L + SK.uur * C, y: T, width: C, height: 12 * RH, class: 'uur-kader' }, svg);
    else s('rect', { x: L + SK.uur * C, y: T + SK.maand * RH, width: C, height: RH, class: 'kader' }, svg);
    (groot ? [0, 3, 6, 9, 12, 15, 18, 21] : [0, 6, 12, 18]).forEach(u => { s('text', { x: L + u * C + C / 2, y: Y0 + 14, 'text-anchor': 'middle' }, svg).textContent = String(u).padStart(2, '0') + ':00'; });
    // kleurschaal
    const ly = Y0 + 26, lb = Math.min(260, B - L - R);
    const grad = 'g' + Math.random().toString(36).slice(2);
    const lg = s('linearGradient', { id: grad }, s('defs', {}, svg));
    const van = soortJ === 'afname' ? 0 : -1, tot = soortJ === 'tl' ? 0 : 1;
    for (let i = 0; i <= 10; i++) s('stop', { offset: (i * 10) + '%', 'stop-color': SK.kleurTwee(van + (tot - van) * i / 10) }, lg);
    s('rect', { x: L, y: ly, width: lb, height: 8, rx: 2, fill: 'url(#' + grad + ')' }, svg);
    s('text', { x: L, y: ly + 21 }, svg).textContent = soortJ === 'afname' ? '0' : kwT(maxTl) + ' ' + SK.t('teruglevering');
    if (soortJ === 'netto') s('text', { x: L + lb / 2, y: ly + 21, 'text-anchor': 'middle' }, svg).textContent = '0';
    s('text', { x: L + lb, y: ly + 21, 'text-anchor': 'end' }, svg).textContent = soortJ === 'tl' ? '0' : kwT(maxAf) + ' ' + SK.t('afname');
    if (L + lb + 170 < B) {
      const kx = L + lb + 20;
      s('rect', { x: kx, y: ly - 1, width: 10, height: 10, class: 'jb-max-af' }, svg);
      s('text', { x: kx + 15, y: ly + 8 }, svg).textContent = SK.t('hoogsteAfname');
      s('rect', { x: kx, y: ly + 13, width: 10, height: 10, class: 'jb-max-tl' }, svg);
      s('text', { x: kx + 15, y: ly + 22 }, svg).textContent = SK.t('hoogsteTl');
    } else {
      const kx = L;
      s('rect', { x: kx, y: ly + 28, width: 10, height: 10, class: 'jb-max-af' }, svg);
      s('text', { x: kx + 15, y: ly + 37 }, svg).textContent = SK.t('hoogsteAfname');
      s('rect', { x: kx + 130, y: ly + 28, width: 10, height: 10, class: 'jb-max-tl' }, svg);
      s('text', { x: kx + 145, y: ly + 37 }, svg).textContent = SK.t('hoogsteTl');
    }
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
