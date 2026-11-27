/* Energy Profiles 06: kaartlaag met legenda, tijdlijn (gemiddeld + 12 maanden met een dunne lijn, dikker waar het
   getoonde moment is), afspelen, taal via het wereldbolletje, paneel breder slepen, toetsen en starten.
   De tool begint altijd op Nederland, gemiddeld over het jaar. */
(function () {
  'use strict';
  const SK = window.SK;
  const $ = id => document.getElementById(id);
  const VAKKEN = 13; // gemiddeld + 12 maanden, elk 24 uur

  /* ---- vaste teksten in de pagina */
  function teksten() {
    document.documentElement.lang = SK.taal;
    document.querySelectorAll('[data-t]').forEach(e => { e.textContent = SK.t(e.dataset.t); });
    document.querySelectorAll('[data-t-ph]').forEach(e => { e.placeholder = SK.t(e.dataset.tPh); });
    $('taalKnop').setAttribute('aria-label', SK.taal === 'nl' ? 'Taal' : 'Language');
    $('taalKnop').title = SK.taal === 'nl' ? 'Taal' : 'Language';
    $('taalMenu').querySelectorAll('button').forEach(b => b.setAttribute('aria-checked', b.dataset.taal === SK.taal));
    $('laagKeuze').setAttribute('aria-label', SK.t('laag'));
    $('grootSluit').setAttribute('aria-label', SK.t('sluiten'));
    $('greep').setAttribute('aria-label', SK.t('sleep'));
    $('greep').title = SK.t('sleep');
    const sel = $('laagKeuze');
    sel.innerHTML = '';
    window.SK_LAGEN.forEach(l => { const o = SK.el('option', null, l[SK.taal].naam); o.value = l.id; sel.appendChild(o); });
    sel.value = SK.laag;
    const tm = $('tijdMaanden');
    tm.innerHTML = '';
    tm.appendChild(SK.el('span', null, SK.t('gemiddeld')));
    SK.t('mnd').forEach(m => tm.appendChild(SK.el('span', null, m)));
    SK.vergelijkKnopBijwerken();
  }

  /* ---- kentallen van het gekozen gebied in het kader van de kaartlaag; een kental met een kaartlaag is aan te klikken */
  SK.laagKentallen = function () {
    const vak = $('laagKentallen');
    vak.innerHTML = '';
    const geb = SK.huidig();
    let dicht = false;
    try { dicht = localStorage.getItem('sk-kentallen') === 'dicht'; } catch (e) { /* geen opslag */ }
    const kop = SK.el('button', 'lk-kop');
    kop.type = 'button';
    kop.setAttribute('aria-expanded', String(!dicht));
    kop.title = dicht ? SK.t('uitklappen') : SK.t('inklappen');
    kop.appendChild(SK.el('span', null, SK.t('kentallenVan')(SK.gemeente ? geb.naam : SK.t('nederland'))));
    const pijl = SK.el('span', 'lk-pijl');
    pijl.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>';
    kop.appendChild(pijl);
    kop.addEventListener('click', () => {
      try { localStorage.setItem('sk-kentallen', dicht ? 'open' : 'dicht'); } catch (e) { /* geen opslag */ }
      SK.laagKentallen();
    });
    vak.appendChild(kop);
    vak.classList.toggle('dicht', dicht);
    const ul = SK.el('ul');
    window.SK_KENTALLEN.forEach(def => {
      const wv = SK.kentalWaarde(def, geb.s || {});
      if (!wv) return;
      const li = SK.el('li');
      li.title = def[SK.taal][1];
      const naam = SK.el('span', 'lk-naam', def[SK.taal][0]);
      const w = SK.el('span', 'lk-waarde', wv[0]);
      if (wv[1]) w.appendChild(SK.el('small', null, wv[1]));
      if (def.laag) {
        const b = SK.el('button', 'lk-knop' + (SK.laag === def.laag ? ' aan' : ''));
        b.type = 'button';
        b.title = SK.t('kentalOpKaart');
        b.setAttribute('aria-pressed', SK.laag === def.laag);
        b.appendChild(naam); b.appendChild(w);
        b.addEventListener('click', () => SK.zetLaag(def.laag));
        li.appendChild(b);
      } else { li.appendChild(naam); li.appendChild(w); }
      ul.appendChild(li);
    });
    vak.appendChild(ul);
  };

  /* ---- kaartlaag: welk moment, legenda en uitleg */
  SK.laagTekst = function () {
    const l = SK.laagDef();
    $('laagMoment').textContent = l.tijd ? SK.uurTekst() + ', ' + (SK.gemiddeld ? SK.t('jaargemiddelde') : SK.t('maanden')[SK.maand]) : '';
    $('laagMoment').hidden = !l.tijd;
  };
  SK.legenda = legenda;
  function legenda() {
    const l = SK.laagDef();
    $('laagUitleg').textContent = l[SK.taal].uitleg;
    SK.laagTekst();
    const lg = $('legenda');
    lg.innerHTML = '';
    const balk = SK.el('div', 'balk');
    SK.legendaKleuren(l.id, 24).forEach(k => { const s = SK.el('span'); s.style.background = k; balk.appendChild(s); });
    const getal = v => (l.id === 'pf' || l.id === 'gl' ? SK.getal(v, 1) : SK.getal(v, 0)) + (l.eenheid === '%' ? '%' : '');
    const rij = SK.el('div', 'rij');
    if (l.schaal === 'twee') ['100%', '0', '100%'].forEach(t => rij.appendChild(SK.el('span', null, t)));
    else if (l.dynamisch) {
      const [mn, mx] = SK.domein(l.id);
      rij.appendChild(SK.el('span', null, SK.waardeOpmaak(mn, l.soort)));
      rij.appendChild(SK.el('span', null, SK.waardeOpmaak(mx, l.soort)));
    } else {
      rij.appendChild(SK.el('span', null, getal(l.omgekeerd ? l.max : l.min)));
      rij.appendChild(SK.el('span', null, getal(l.omgekeerd ? l.min : l.max) + (l.eenheid === 'uur' ? (SK.taal === 'nl' ? ' uur' : ' h') : '')));
    }
    const namen = SK.el('div', 'rij namen');
    namen.appendChild(SK.el('span', null, l[SK.taal].laag));
    namen.appendChild(SK.el('span', null, l[SK.taal].hoog));
    lg.appendChild(namen);
    lg.appendChild(balk);
    lg.appendChild(rij);
    const geen = SK.el('div', 'geen');
    geen.appendChild(SK.el('i'));
    geen.appendChild(SK.el('span', null, l.alleenGemeente ? SK.t('alleenGemeenten') : SK.t('geenData')));
    lg.appendChild(geen);
  }

  /* ---- tijdlijn */
  const vak = () => (SK.gemiddeld ? 0 : SK.maand + 1);
  // het vak 'gemiddeld' is twee keer zo breed als een maand: samen 14 eenheden
  const vakMaat = v => (v === 0 ? [0, 2 / 14] : [(v + 1) / 14, 1 / 14]);
  SK.tijdlijn = function () {
    $('tijdLabel').textContent = SK.uurTekst() + ', ' + (SK.gemiddeld ? SK.t('jaargemiddelde') : SK.t('maanden')[SK.maand]);
    $('tijdSub').textContent = SK.t('moment');
    const v = vak();
    $('tijdMaanden').querySelectorAll('span').forEach((s, i) => s.classList.toggle('aan', i === v));
    const [begin, breed] = vakMaat(v);
    $('tijdMaand').style.left = (begin * 100) + '%';
    $('tijdMaand').style.width = (breed * 100) + '%';
    $('tijdUur').style.left = ((begin + breed * (SK.uur + 0.5) / 24) * 100) + '%';
    const as = $('tijdAs');
    as.setAttribute('aria-valuenow', v * 24 + SK.uur);
    as.setAttribute('aria-valuetext', $('tijdLabel').textContent);
    $('tijdlijn').classList.toggle('uit', !SK.laagDef().tijd);
  };
  function zetStap(stap) {
    stap = (stap + VAKKEN * 24) % (VAKKEN * 24);
    const v = Math.floor(stap / 24), u = stap % 24;
    SK.zetMoment(v === 0 ? 'gem' : v - 1, u);
  }
  function tijdAsKoppelen() {
    const as = $('tijdAs');
    let slepen = false;
    const zet = e => {
      const r = as.getBoundingClientRect();
      const t = Math.max(0, Math.min(0.9999, (e.clientX - r.left) / r.width)) * 14;
      const v = t < 2 ? 0 : Math.floor(t - 1);
      const [begin, breed] = vakMaat(v);
      const stap = v * 24 + Math.min(23, Math.floor((t / 14 - begin) / breed * 24));
      if (stap !== vak() * 24 + SK.uur) zetStap(stap);
    };
    as.addEventListener('pointerdown', e => { slepen = true; as.setPointerCapture(e.pointerId); speel(false); zet(e); });
    as.addEventListener('pointermove', e => { if (slepen) zet(e); });
    as.addEventListener('pointerup', () => { slepen = false; });
    as.addEventListener('pointercancel', () => { slepen = false; });
    as.addEventListener('keydown', e => {
      const nu = vak() * 24 + SK.uur;
      const stap = { ArrowRight: 1, ArrowLeft: -1, ArrowUp: 24, PageUp: 24, ArrowDown: -24, PageDown: -24 }[e.key];
      if (!stap) return;
      e.preventDefault();
      zetStap(nu + stap);
    });
  }

  /* afspelen: bij het jaargemiddelde de uren van de dag rond, anders door de maanden heen */
  let speler = null;
  function speel(aan) {
    const k = $('speelKnop');
    if (speler) { clearInterval(speler); speler = null; }
    if (aan) {
      if (SK.laag !== 'nu') { SK.laag = 'nu'; $('laagKeuze').value = 'nu'; legenda(); }
      speler = setInterval(() => {
        let u = SK.uur + 1, m = SK.maand;
        if (u > 23) { u = 0; if (!SK.gemiddeld) m = (m + 1) % 12; }
        SK.zetMoment(SK.gemiddeld ? 'gem' : m, u);
      }, 600);
    }
    k.classList.toggle('aan', !!aan);
    k.setAttribute('aria-label', aan ? SK.t('pauze') : SK.t('afspelen'));
    k.title = aan ? SK.t('pauze') : SK.t('afspelen');
  }

  /* ---- paneel breder of smaller slepen; grafieken tekenen opnieuw op de nieuwe breedte */
  const MIN = 360;
  const maxBreed = () => Math.max(MIN, Math.round(window.innerWidth * 0.65));
  function zetBreedte(px, bewaar) {
    px = Math.max(MIN, Math.min(maxBreed(), Math.round(px)));
    document.documentElement.style.setProperty('--paneel', px + 'px');
    if (bewaar) { try { localStorage.setItem('sk-paneel', px); } catch (e) { /* geen opslag */ } }
  }
  let hertekenen;
  function naBreedte() {
    SK.kaartFormaat();
    clearTimeout(hertekenen);
    hertekenen = setTimeout(() => SK.paneel(true), 60);
  }
  function greepKoppelen() {
    const g = $('greep');
    try { const b = +localStorage.getItem('sk-paneel'); if (b) zetBreedte(b); } catch (e) { /* geen opslag */ }
    g.addEventListener('pointerdown', e => {
      g.setPointerCapture(e.pointerId);
      g.classList.add('bezig'); document.body.classList.add('slepen');
    });
    g.addEventListener('pointermove', e => {
      if (!g.classList.contains('bezig')) return;
      zetBreedte(e.clientX, false); naBreedte();
    });
    const klaar = e => {
      if (!g.classList.contains('bezig')) return;
      g.classList.remove('bezig'); document.body.classList.remove('slepen');
      zetBreedte(e.clientX, true); naBreedte();
    };
    g.addEventListener('pointerup', klaar);
    g.addEventListener('pointercancel', klaar);
    g.addEventListener('keydown', e => {
      const nu = $('paneel').getBoundingClientRect().width;
      if (e.key === 'ArrowRight') zetBreedte(nu + 40, true);
      else if (e.key === 'ArrowLeft') zetBreedte(nu - 40, true);
      else return;
      e.preventDefault(); naBreedte();
    });
  }

  /* ---- taal via het wereldbolletje */
  function taalKoppelen() {
    const knop = $('taalKnop'), menu = $('taalMenu');
    const dicht = () => { menu.hidden = true; knop.setAttribute('aria-expanded', 'false'); };
    knop.addEventListener('click', e => { e.stopPropagation(); menu.hidden = !menu.hidden; knop.setAttribute('aria-expanded', String(!menu.hidden)); });
    document.addEventListener('click', e => { if (!e.target.closest('.taal')) dicht(); });
    menu.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
      dicht();
      if (b.dataset.taal === SK.taal) return;
      SK.taal = b.dataset.taal;
      try { localStorage.setItem('sk-taal', SK.taal); } catch (e) { /* geen opslag */ }
      teksten(); legenda(); SK.tijdlijn(); SK.kaartBijwerken(); SK.paneel(true);
      speel(!!speler);
    }));
  }

  function start() {
    if (!window.L) { document.getElementById('kaart').textContent = 'De kaart kon niet laden (Leaflet).'; return; }
    // altijd op Nederland beginnen, ook als er nog een oud adres (#GM...) in de adresregel staat
    if (location.hash) { try { history.replaceState(null, '', location.pathname + location.search); } catch (e) { /* file:// */ } }
    greepKoppelen();
    teksten();
    SK.kaartStart();
    SK.zoekStart();
    legenda();
    SK.tijdlijn();
    tijdAsKoppelen();
    taalKoppelen();
    SK.paneel();

    SK.zetLaag = function (id) {
      SK.laag = id;
      $('laagKeuze').value = id;
      if (SK.laag !== 'nu') speel(false);
      legenda(); SK.tijdlijn(); SK.kaartBijwerken(); SK.paneel(true);
    };
    $('laagKeuze').addEventListener('change', e => SK.zetLaag(e.target.value));
    $('speelKnop').addEventListener('click', () => speel(!speler));
    $('grootSluit').addEventListener('click', SK.grootDicht);
    $('vergelijkKnop').addEventListener('click', () => SK.grootOpen('vergelijk'));
    document.addEventListener('keydown', e => {
      if (e.target.closest('input,select,textarea')) return;
      if (e.key === 'Escape') { if (!$('taalMenu').hidden) $('taalMenu').hidden = true; else if (!$('groot').hidden) SK.grootDicht(); else SK.terug(); }
      if (e.key === ' ' && !e.target.closest('button,[role=slider],[role=separator]')) { e.preventDefault(); speel(!speler); }
    });
    let wacht;
    window.addEventListener('resize', () => {
      SK.kaartFormaat();
      clearTimeout(wacht);
      wacht = setTimeout(() => { SK.paneel(true); }, 150);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
