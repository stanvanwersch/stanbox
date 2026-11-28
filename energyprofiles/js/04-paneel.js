/* Energy Profiles 04: het paneel links (gebied met terugpijl, netto vermogen op het getoonde uur, dagprofiel,
   jaarbeeld, kentallen, vergelijken), de vergrote weergave over de kaart, kiezen van een gebied en zoeken. */
(function () {
  'use strict';
  const SK = window.SK;
  const $ = id => document.getElementById(id);

  SK.huidig = function () { return SK.buurt || SK.gemeente || window.SK_NEDERLAND; };

  /* ---- kiezen */
  SK.naarNederland = function () {
    SK.gemeente = null; SK.buurt = null;
    SK.toonBuurten(null);
    SK.kaartBijwerken(); SK.paneel(); SK.zoomNaar(null);
  };
  SK.kiesGemeente = function (g, buurtId) {
    const anders = !SK.gemeente || SK.gemeente.id !== g.id;
    SK.gemeente = g; SK.buurt = null;
    SK.kaartBijwerken(); SK.paneel();
    SK.zoomNaar('gemeente');
    if (anders || !SK.buurten[g.id]) {
      const t = setTimeout(() => { $('laden').hidden = false; }, 150);
      SK.laadBuurten(g.id).then(() => {
        clearTimeout(t); $('laden').hidden = true;
        if (!SK.gemeente || SK.gemeente.id !== g.id) return;
        SK.toonBuurten(g.id);
        if (buurtId) { const b = SK.buurten[g.id].find(x => x.id === buurtId); if (b) { SK.kiesBuurt(b); return; } }
        SK.paneel(true);
      }).catch(() => { clearTimeout(t); $('laden').hidden = true; });
    }
  };
  SK.kiesBuurt = function (b) {
    SK.buurt = b;
    SK.kaartBijwerken(); SK.paneel();
    if (SK.buurtOpKaart(b.id)) SK.zoomNaar('buurt');
  };
  SK.terug = function () { if (SK.buurt) SK.kiesGemeente(SK.gemeente); else if (SK.gemeente) SK.naarNederland(); };

  /* m = 0 tot 11, of 'gem' voor het jaargemiddelde */
  SK.zetMoment = function (m, u) {
    if (m === 'gem') SK.gemiddeld = true;
    else { SK.gemiddeld = false; SK.maand = m; }
    SK.uur = u;
    SK.tijdlijn(); SK.laagTekst(); SK.kaartBijwerken(); SK.paneel(true);
  };
  SK.zetSoort = function (s) { SK.soort = s; SK.paneel(true); };
  SK.uurTekst = () => String(SK.uur).padStart(2, '0') + ':00';

  /* ---- kop met terugpijl */
  function kop() {
    const k = $('gebiedKop');
    k.innerHTML = '';
    const geb = SK.huidig();
    if (SK.gemeente) {
      const terug = SK.el('button', 'ikoon-knop terug');
      terug.type = 'button';
      const naar = SK.buurt ? SK.gemeente.naam : SK.t('nederland');
      terug.setAttribute('aria-label', SK.t('terug') + ' ' + naar);
      terug.title = SK.t('terug') + ' ' + naar;
      terug.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>';
      terug.addEventListener('click', SK.terug);
      k.appendChild(terug);
    }
    const tekst = SK.el('div');
    tekst.style.minWidth = '0';
    tekst.appendChild(SK.el('h2', null, SK.gemeente ? geb.naam : SK.t('nederland')));
    let sub;
    if (SK.buurt) sub = SK.t('buurt') + (geb.wijk && geb.wijk !== geb.naam ? ' in ' + SK.t('wijk') + ' ' + geb.wijk : '') + ', ' + SK.gemeente.naam;
    else if (SK.gemeente) sub = SK.t('gemeente') + ', ' + SK.t('aantalBuurten')(geb.n);
    else sub = SK.t('aantalBuurten')(SK.getal(window.SK_ZOEK.length)) + ', ' + window.SK_GEMEENTEN.length + ' ' + (SK.taal === 'nl' ? 'gemeenten' : 'municipalities');
    tekst.appendChild(SK.el('p', 'soort', sub));
    k.appendChild(tekst);
  }

  /* ---- kentallen */
  SK.kentalWaarde = function (def, s) {
    const v = s[def.k];
    if (v == null) return null;
    let g, e = '';
    if (def.soort === 'mwh') [g, e] = SK.mwh(v);
    else if (def.soort === 'kw') [g, e] = SK.kw(v);
    else if (def.soort === 'm3') [g, e] = SK.m3(v);
    else if (def.soort === 'getal2') g = SK.getal(v, 2);
    else { g = SK.getal(v, 0); e = def.eenheid === 'uur' ? (SK.taal === 'nl' ? 'uur' : 'h') : ''; }
    if (def.extra && s[def.extra] != null) e += (e ? ', ' : '') + SK.getal(s[def.extra], def.extra === 'p90' ? 2 : 1) + '%';
    return [g, e];
  };

  function blok(titel, uitleg, knop) {
    const b = SK.el('section', 'blok');
    const k = SK.el('div', 'blok-kop');
    k.appendChild(SK.el('h3', null, titel));
    if (knop) k.appendChild(knop);
    b.appendChild(k);
    if (uitleg) b.appendChild(SK.el('p', 'uitleg', uitleg));
    return b;
  }
  function vergrootKnop(wat) {
    const b = SK.el('button', 'ikoon-knop');
    b.type = 'button';
    b.title = SK.t('vergroot');
    b.setAttribute('aria-label', SK.t('vergroot'));
    b.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7"/></svg>';
    b.addEventListener('click', () => SK.grootOpen(wat));
    return b;
  }

  /* ---- keuzes voor het dagprofiel: soort en maand als dropdown */
  function keuzes(geb) {
    const rij = SK.el('div', 'keuzes');
    const l1 = SK.el('label', null, SK.t('soortKeuze'));
    const s1 = SK.el('select', 'inp');
    const namen = SK.t('soorten');
    ['netto', 'beide', 'afname', 'tl', 'gas'].forEach(id => { const o = SK.el('option', null, namen[id]); o.value = id; s1.appendChild(o); });
    s1.value = SK.soort;
    s1.addEventListener('change', () => SK.zetSoort(s1.value));
    l1.appendChild(s1);
    rij.appendChild(l1);
    const l2 = SK.el('label', null, SK.t('maandKeuze'));
    const s2 = SK.el('select', 'inp');
    const og = SK.el('option', null, SK.t('jaargemiddelde')); og.value = 'gem'; s2.appendChild(og);
    SK.t('maanden').forEach((m, i) => { const o = SK.el('option', null, m); o.value = i; s2.appendChild(o); });
    s2.value = SK.gemiddeld ? 'gem' : String(SK.maand);
    s2.disabled = SK.soort === 'gas' || !geb.p;
    s2.addEventListener('change', () => SK.zetMoment(s2.value === 'gem' ? 'gem' : +s2.value, SK.uur));
    l2.appendChild(s2);
    rij.appendChild(l2);
    return rij;
  }

  /* soort voor het jaarbeeld: netto, alleen afname of alleen teruglevering (zelfde keuze als bij het dagprofiel) */
  function jaarKeuze() {
    const rij = SK.el('div', 'keuzes enkel');
    const l = SK.el('label');
    const s = SK.el('select', 'inp');
    s.setAttribute('aria-label', SK.t('soortKeuze'));
    const namen = SK.t('soorten');
    ['netto', 'afname', 'tl'].forEach(id => { const o = SK.el('option', null, namen[id]); o.value = id; s.appendChild(o); });
    s.value = SK.soort === 'afname' || SK.soort === 'tl' ? SK.soort : 'netto';
    s.addEventListener('change', () => SK.zetSoort(s.value));
    l.appendChild(s);
    rij.appendChild(l);
    return rij;
  }

  function gasVak(geb) {
    const d = SK.el('div', 'leeg-grafiek');
    if (geb.s && geb.s.gas != null) {
      const [g, e] = SK.m3(geb.s.gas);
      d.appendChild(SK.el('strong', null, g + ' ' + e));
      d.appendChild(SK.el('span', null, SK.t('gasJaar')));
      d.appendChild(SK.el('p', 'noot', SK.t('gasGeenProfiel')));
    } else d.textContent = SK.t('gasGeenProfiel');
    return d;
  }
  function noot() {
    if (SK.soort === 'beide') return SK.el('p', 'noot', SK.t('nootBeide'));
    if (SK.soort === 'afname') return SK.el('p', 'noot', SK.t('nootAfname'));
    if (SK.soort === 'tl') return SK.el('p', 'noot', SK.t('nootTl'));
    return null;
  }
  const maandTekst = () => (SK.gemiddeld ? SK.t('jaargemiddelde') : 'in ' + SK.t('maanden')[SK.maand]);

  /* breedte voor de grafieken: de binnenbreedte van het paneel */
  function grafiekBreedte() {
    const g = $('gebied');
    const cs = getComputedStyle(g);
    return Math.max(260, Math.round(g.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)));
  }

  /* ---- paneel opbouwen */
  SK.paneel = function (houdScroll) {
    const g = $('gebied');
    const scroll = g.scrollTop;
    kop();
    const geb = SK.huidig();
    g.innerHTML = '';
    const B = grafiekBreedte();

    if (SK.buurt && geb.s.klein) g.appendChild(SK.el('p', 'melding let', SK.t('klein')));
    if (SK.buurt && !geb.g) g.appendChild(SK.el('p', 'melding', SK.t('geenGrens')));

    // netto vermogen op het getoonde uur
    if (geb.p) {
      const kw = SK.nuKw(geb), v = SK.waarde(geb, 'nu');
      const b = blok(SK.t('nettoOm')(SK.uurTekst()), maandTekst());
      const nu = SK.el('div', 'nu');
      const stip = SK.el('span', 'stip'); stip.style.background = SK.kleur(v, 'nu') || '#fff';
      nu.appendChild(stip);
      const [gg, ee] = SK.kw(Math.abs(kw));
      nu.appendChild(SK.el('span', 'waarde', gg + ' ' + ee));
      nu.appendChild(SK.el('span', 'wat', (kw < 0 ? SK.t('teruglevering') : SK.t('afname')) + (v != null ? ', ' + SK.getal(Math.abs(v), 0) + '% ' + (SK.taal === 'nl' ? 'van de piek' : 'of peak') : '')));
      b.appendChild(nu);
      b.querySelector('.uitleg').style.marginBottom = '0';
      g.appendChild(b);
    }

    // dagprofiel
    const d = blok(SK.t('dagprofiel'), SK.soort === 'gas' ? null : SK.t('dagprofielUitleg')(maandTekst()), vergrootKnop('dag'));
    d.appendChild(keuzes(geb));
    if (SK.soort === 'gas') d.appendChild(gasVak(geb));
    else if (geb.p) { d.appendChild(SK.dagprofiel(geb.p, { b: B, h: Math.round(Math.min(420, Math.max(200, B * 0.52))) })); const n = noot(); if (n) d.appendChild(n); }
    else d.appendChild(SK.el('p', 'melding', SK.t('geenProfiel')));
    g.appendChild(d);

    // jaarbeeld
    if (geb.p) {
      const j = blok(SK.t('jaarbeeld'), SK.t('jaarbeeldUitleg'), vergrootKnop('jaar'));
      j.appendChild(jaarKeuze());
      j.appendChild(SK.jaarbeeld(geb.p, { b: B }));
      if (SK.soort === 'afname' || SK.soort === 'tl') j.appendChild(noot());
      g.appendChild(j);
    }

    // kentallen als rijen, met de knop om te vergelijken
    const kb = blok(SK.t('kentallen'));
    const ul = SK.el('ul', 'rijen');
    window.SK_KENTALLEN.forEach(def => {
      const wv = SK.kentalWaarde(def, geb.s || {});
      if (!wv) return;
      const li = SK.el('li');
      li.title = def[SK.taal][1];
      li.appendChild(SK.el('span', 'r-naam', def[SK.taal][0]));
      const w = SK.el('span', 'r-waarde', wv[0]);
      if (wv[1]) w.appendChild(SK.el('small', null, wv[1]));
      li.appendChild(w);
      ul.appendChild(li);
    });
    if (ul.children.length) kb.appendChild(ul);
    if (SK.gemeente) kb.appendChild(SK.vergelijkActie(geb));
    if (kb.children.length > 1) g.appendChild(kb);

    g.appendChild(SK.el('p', 'bron', SK.t('bron')));
    g.scrollTop = houdScroll ? scroll : 0;
    $('kaartHint').textContent = SK.gemeente ? SK.t('hintGemeente') : SK.t('hint');
    if (SK.laagKentallen) SK.laagKentallen();
    if (SK.legenda && SK.laagDef().dynamisch) SK.legenda();
    if (!$('groot').hidden) SK.grootTekenen();
  };

  /* ---- groot over de kaart: 'dag', 'jaar' of 'vergelijk' */
  let grootWat = 'dag';
  SK.grootOpen = function (wat) { grootWat = wat || 'dag'; $('groot').hidden = false; SK.grootTekenen(); $('grootSluit').focus(); };
  SK.grootDicht = function () { $('groot').hidden = true; };
  SK.grootIs = wat => !$('groot').hidden && grootWat === wat;
  SK.grootTekenen = function () {
    if (grootWat === 'vergelijk') { SK.vergelijkTekenen(); return; }
    const geb = SK.huidig();
    const naam = SK.gemeente ? geb.naam : SK.t('nederland');
    const inh = $('grootInhoud');
    inh.innerHTML = '';
    if (grootWat === 'jaar') {
      $('grootTitel').textContent = SK.t('jaarbeeld') + ': ' + naam;
      $('grootSub').textContent = SK.t('jaarbeeldUitleg');
      inh.appendChild(jaarKeuze());
      const vak = SK.el('div', 'grafiek-vak');
      inh.appendChild(vak);
      if (!geb.p) { vak.appendChild(SK.el('p', 'melding', SK.t('geenProfiel'))); return; }
      const r = vak.getBoundingClientRect();
      vak.appendChild(SK.jaarbeeld(geb.p, { b: Math.max(320, Math.round(r.width)), h: Math.max(240, Math.round(r.height)), groot: true }));
      return;
    }
    $('grootTitel').textContent = SK.t('dagprofiel') + ': ' + naam;
    $('grootSub').textContent = SK.soort === 'gas' ? SK.t('gasJaar') : SK.t('dagprofielUitleg')(maandTekst());
    inh.appendChild(keuzes(geb));
    const vak = SK.el('div', 'grafiek-vak');
    inh.appendChild(vak);
    if (SK.soort === 'gas') { vak.appendChild(gasVak(geb)); return; }
    if (!geb.p) { vak.appendChild(SK.el('p', 'melding', SK.t('geenProfiel'))); return; }
    const n = noot();
    if (n) inh.appendChild(n);
    const r = vak.getBoundingClientRect();
    vak.appendChild(SK.dagprofiel(geb.p, { b: Math.max(320, Math.round(r.width)), h: Math.max(220, Math.round(r.height)), groot: true }));
  };

  /* ---- zoeken */
  const norm = s => s.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase();
  let treffers = [], actief = -1;
  const gemPerCode = {};
  SK.zoekStart = function () {
    window.SK_GEMEENTEN.forEach(g => { gemPerCode[g.id] = g; g._z = norm(g.naam); });
    const veld = $('zoekVeld'), ul = $('zoekLijst');
    const zoekIdx = window.SK_ZOEK.map(r => [norm(r[1]), r]);
    function toon() {
      const q = norm(veld.value.trim());
      ul.innerHTML = ''; actief = -1;
      if (q.length < 2) { ul.hidden = true; return; }
      const gem = window.SK_GEMEENTEN.filter(g => g._z.includes(q)).sort((a, b) => a._z.indexOf(q) - b._z.indexOf(q) || a.naam.localeCompare(b.naam)).slice(0, 6)
        .map(g => ({ soort: 'gemeente', naam: g.naam, g: g }));
      const bu = [];
      for (const [z, r] of zoekIdx) { if (z.includes(q)) { bu.push({ soort: 'buurt', naam: r[1], id: r[0], g: gemPerCode[r[2]], s: z.indexOf(q) }); if (bu.length > 200) break; } }
      bu.sort((a, b) => a.s - b.s || a.naam.localeCompare(b.naam));
      treffers = gem.concat(bu.slice(0, 14 - gem.length));
      if (!treffers.length) { ul.appendChild(SK.el('li', 'leeg', SK.t('geenTreffers'))); ul.hidden = false; return; }
      treffers.forEach((t, i) => {
        const li = SK.el('li');
        li.setAttribute('role', 'option');
        li.appendChild(SK.el('span', null, t.naam));
        li.appendChild(SK.el('small', null, t.soort === 'gemeente' ? SK.t('gemeente') : t.g.naam));
        li.addEventListener('mousedown', e => { e.preventDefault(); kies(i); });
        ul.appendChild(li);
      });
      ul.hidden = false;
    }
    function kies(i) {
      const t = treffers[i];
      if (!t) return;
      ul.hidden = true; veld.value = ''; veld.blur();
      if (t.soort === 'gemeente') SK.kiesGemeente(t.g);
      else SK.kiesGemeente(t.g, t.id);
    }
    veld.addEventListener('input', toon);
    veld.addEventListener('focus', toon);
    veld.addEventListener('blur', () => setTimeout(() => { ul.hidden = true; }, 100));
    veld.addEventListener('keydown', e => {
      const items = ul.querySelectorAll('li:not(.leeg)');
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (!items.length) return;
        actief = (actief + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
        items.forEach((li, i) => li.classList.toggle('actief', i === actief));
      } else if (e.key === 'Enter') { kies(actief < 0 ? 0 : actief); }
      else if (e.key === 'Escape') { ul.hidden = true; veld.blur(); }
    });
  };
})();
