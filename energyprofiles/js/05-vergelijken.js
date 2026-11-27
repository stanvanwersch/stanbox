/* Energy Profiles 05: buurten (en gemeenten) vergelijken op de kentallen. Tot vijf gebieden; de vergelijking
   opent groot over de kaart met een tabel (kentallen naast elkaar) en de dagprofielen als deel van de eigen piek. */
(function () {
  'use strict';
  const SK = window.SK;
  const $ = id => document.getElementById(id);
  const MAX = 5;
  // lijnen in huisstijlkleuren; zwart en koraal-fel ook gestippeld, zodat vijf lijnen uit elkaar te houden zijn
  const STIJLEN = [
    { kleur: '#1A1A1A', stippel: false }, { kleur: '#E5603F', stippel: false }, { kleur: '#7A7A7A', stippel: false },
    { kleur: '#1A1A1A', stippel: true }, { kleur: '#E5603F', stippel: true }
  ];

  const zit = id => SK.vergelijk.findIndex(v => v.geb.id === id);

  SK.vergelijkWissel = function (geb) {
    const i = zit(geb.id);
    if (i >= 0) SK.vergelijk.splice(i, 1);
    else {
      if (SK.vergelijk.length >= MAX) return;
      SK.vergelijk.push({ geb: geb, gemeente: SK.buurt ? SK.gemeente.naam : null });
    }
    SK.vergelijkKnopBijwerken();
    SK.paneel(true);
  };

  /* knop in het paneel, onder de kentallen */
  SK.vergelijkActie = function (geb) {
    const binnen = zit(geb.id) >= 0;
    if (!binnen && SK.vergelijk.length >= MAX) return SK.el('p', 'noot', SK.t('vergelijkMax'));
    const b = SK.el('button', 'btn ' + (binnen ? 'subtle' : 'primary') + ' vergelijk-actie');
    b.type = 'button';
    b.innerHTML = binnen
      ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 12h12"/></svg>'
      : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 6v12M6 12h12"/></svg>';
    b.appendChild(document.createTextNode(binnen ? SK.t('haalWeg') : SK.t('voegToe')));
    b.addEventListener('click', () => {
      SK.vergelijkWissel(geb);
      if (zit(geb.id) >= 0 && SK.vergelijk.length > 1) SK.grootOpen('vergelijk');
    });
    return b;
  };

  /* knop rechts boven in de kaart */
  SK.vergelijkKnopBijwerken = function () {
    const k = $('vergelijkKnop');
    k.hidden = SK.vergelijk.length === 0;
    k.textContent = SK.t('vergelijk') + ' (' + SK.vergelijk.length + ')';
    if (SK.grootIs('vergelijk')) SK.vergelijkTekenen();
  };

  SK.vergelijkTekenen = function () {
    $('grootTitel').textContent = SK.t('vergelijkTitel');
    $('grootSub').textContent = SK.t('vergelijkSub');
    const inh = $('grootInhoud');
    inh.innerHTML = '';
    if (!SK.vergelijk.length) { inh.appendChild(SK.el('p', 'melding', SK.t('vergelijkLeeg'))); return; }

    // gekozen gebieden, met kruisje om weg te halen
    const rij = SK.el('div', 'v-gebieden');
    SK.vergelijk.forEach((v, i) => {
      const c = SK.el('span', 'v-gebied');
      const lijn = SK.el('i', STIJLEN[i].stippel ? 'stippel' : '');
      lijn.style.borderTopColor = STIJLEN[i].kleur;
      c.appendChild(lijn);
      c.appendChild(document.createTextNode(v.geb.naam));
      const x = SK.el('button');
      x.type = 'button';
      x.setAttribute('aria-label', SK.t('haalWeg') + ': ' + v.geb.naam);
      x.title = SK.t('haalWeg');
      x.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>';
      x.addEventListener('click', () => SK.vergelijkWissel(v.geb));
      c.appendChild(x);
      rij.appendChild(c);
    });
    inh.appendChild(rij);
    if (SK.vergelijk.length === 1) inh.appendChild(SK.el('p', 'melding', SK.t('vergelijkLeeg')));

    // tabel met kentallen
    const vak = SK.el('div', 'v-tabel-vak');
    const tabel = SK.el('table', 'v-tabel');
    const kop = SK.el('thead'), kr = SK.el('tr');
    kr.appendChild(SK.el('th', null, SK.t('kental')));
    SK.vergelijk.forEach(v => {
      const th = SK.el('th', null, v.geb.naam);
      th.appendChild(SK.el('small', null, v.gemeente ? SK.t('buurt') + ', ' + v.gemeente : SK.t('gemeente')));
      kr.appendChild(th);
    });
    kop.appendChild(kr); tabel.appendChild(kop);
    const body = SK.el('tbody');
    window.SK_KENTALLEN.forEach(def => {
      const waarden = SK.vergelijk.map(v => (v.geb.s || {})[def.k]);
      if (waarden.every(w => w == null)) return;
      const max = Math.max(1e-9, ...waarden.map(w => Math.abs(w || 0)));
      const tr = SK.el('tr');
      const th = SK.el('td', null, def[SK.taal][0]);
      th.title = def[SK.taal][1];
      tr.appendChild(th);
      SK.vergelijk.forEach((v, i) => {
        const td = SK.el('td');
        const wv = SK.kentalWaarde(def, v.geb.s || {});
        if (wv) {
          td.appendChild(SK.el('b', null, wv[0]));
          if (wv[1]) td.appendChild(SK.el('small', null, wv[1]));
          const balk = SK.el('div', 'v-balk'), vul = SK.el('span');
          vul.style.width = Math.max(2, Math.abs(waarden[i]) / max * 100) + '%';
          balk.appendChild(vul); td.appendChild(balk);
        } else td.textContent = '';
        tr.appendChild(td);
      });
      body.appendChild(tr);
    });
    tabel.appendChild(body);
    vak.appendChild(tabel);
    inh.appendChild(vak);

    // dagprofielen als deel van de eigen piek
    const metProfiel = SK.vergelijk.map((v, i) => ({ v: v, i: i })).filter(o => o.v.geb.p && o.v.geb.s && o.v.geb.s.pk);
    if (metProfiel.length) {
      const sec = SK.el('section', 'v-profiel');
      sec.appendChild(SK.el('h3', null, SK.t('vergelijkProfiel')));
      sec.appendChild(SK.el('p', 'uitleg', SK.t('vergelijkProfielUitleg')((SK.gemiddeld ? SK.t('jaargemiddelde') : 'in ' + SK.t('maanden')[SK.maand]) + ', ' + SK.uurTekst())));
      const gv = SK.el('div', 'grafiek-vak');
      sec.appendChild(gv);
      inh.appendChild(sec);
      const breedte = Math.max(320, Math.round(gv.getBoundingClientRect().width));
      gv.appendChild(SK.vergelijkGrafiek(metProfiel.map(o => ({
        naam: o.v.geb.naam,
        dag: SK.dag(o.v.geb.p).map(x => x / o.v.geb.s.pk * 100),
        kleur: STIJLEN[o.i].kleur, stippel: STIJLEN[o.i].stippel
      })), { b: breedte, h: 320 }));
    }
  };
})();
