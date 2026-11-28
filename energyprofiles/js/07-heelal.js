/* Energy Profiles 07: verder uitzoomen dan de kaart toelaat, naar de wereldbol en het sterrenstelsel.
   Overgenomen van de onderbreking op stanbox.nl (stanbox.nl/site/js/03-wereldbol.js), maar hier gestuurd door
   uitzoomen in plaats van scrollen: sta je op het verste zoomniveau en zoom je verder uit (scrollwiel of de
   min-knop), dan neemt een tekenvlak de kaart over: de bol vult eerst het scherm in perzik-licht, krimpt tot de hele
   wereld, wordt een stipje met een koraal ring en daarna verschijnt het sterrenstelsel. Inzoomen gaat de weg terug.
   Kleuren alleen uit de stijlgids: ruimte zwart, bol perzik-licht, land koraal-fel, sterren perzik. */
(function () {
  'use strict';
  const SK = window.SK;
  const C = { zwart: '#1A1A1A', perzik: '#F7C9A9', licht: '#FBE3D2', koraal: '#E5603F' };
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* vaste toevalsreeks, zodat alles er elke keer hetzelfde uitziet */
  let seed = 7;
  function rnd() { seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t ^= t + Math.imul(t ^ t >>> 7, 61 | t); return ((t ^ t >>> 14) >>> 0) / 4294967296; }
  function gauss() { return Math.sqrt(-2 * Math.log(rnd() + 1e-9)) * Math.cos(6.283 * rnd()); }
  function vec(lat, lon) { lat *= Math.PI / 180; lon *= Math.PI / 180; return [Math.cos(lat) * Math.sin(lon), Math.sin(lat), Math.cos(lat) * Math.cos(lon)]; }

  /* de wereld: abstracte continenten als stippen; Nederland ligt vooraan */
  const KERNEN = [[50, 10, 28], [30, 30, 22], [5, 20, 26], [-20, 25, 18], [55, 80, 30], [30, 100, 22], [10, 110, 12], [-25, 135, 16],
    [45, -100, 30], [60, -60, 18], [15, -90, 10], [-15, -60, 24], [-40, -68, 12], [72, -40, 12], [-75, 0, 30], [-75, 120, 26]]
    .map(k => ({ v: vec(k[0], k[1]), c: Math.cos(k[2] * Math.PI / 180) }));
  function land(p) {
    let best = -1;
    for (const k of KERNEN) { const d = p[0] * k.v[0] + p[1] * k.v[1] + p[2] * k.v[2] - k.c; if (d > best) best = d; }
    const ruis = 0.045 * Math.sin(9 * p[0] + 4 * p[1]) * Math.sin(8 * p[2] - 5 * p[1]) + 0.03 * Math.sin(17 * p[1] + 13 * p[2]);
    return best + ruis > 0;
  }
  const N = 5200, PUNTEN = [], ga = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < N; i++) {
    const yy = 1 - 2 * (i + 0.5) / N, rr = Math.sqrt(1 - yy * yy), aa = ga * i, pt = [Math.cos(aa) * rr, yy, Math.sin(aa) * rr];
    if (land(pt)) PUNTEN.push(pt);
  }
  const NL = vec(52.2, 5.3);   // Nederland: zwart stipje op de bol
  const STERREN = []; for (let i = 0; i < 220; i++) STERREN.push([rnd() * 2 - 1, rnd() * 2 - 1, 0.5 + rnd() * 1.1, 0.25 + rnd() * 0.55]);

  /* het sterrenstelsel: twee spiraalarmen en een kern */
  const MELKWEG = [], KANTEL = 0.62;
  const armHoek = r => Math.log(r / 0.04) * 2.1;
  for (let i = 0; i < 3400; i++) {
    const arm = i % 2, r = 0.06 + 0.94 * Math.pow(rnd(), 0.75);
    const hoek = arm * Math.PI + armHoek(r) + gauss() * (0.22 + 0.18 * r);
    MELKWEG.push([r * (1 + gauss() * 0.05), hoek, rnd() < 0.12 ? C.koraal : C.perzik, 0.6 + rnd() * 1.1, 0.35 + rnd() * 0.55]);
  }
  for (let i = 0; i < 900; i++) MELKWEG.push([Math.abs(gauss()) * 0.13, rnd() * 6.283, C.licht, 0.6 + rnd() * 1.2, 0.4 + rnd() * 0.5]);
  const ZON = [0.58, armHoek(0.58) + 0.05];

  function glad(a, b, x) { x = Math.max(0, Math.min(1, (x - a) / (b - a))); return x * x * (3 - 2 * x); }
  function zoomCurve(keys) {
    const n = keys.length, m = [], d = [];
    for (let k = 0; k < n - 1; k++) d.push((keys[k + 1][1] - keys[k][1]) / (keys[k + 1][0] - keys[k][0]));
    m[0] = d[0]; m[n - 1] = d[n - 2];
    for (let k = 1; k < n - 1; k++) m[k] = d[k - 1] * d[k] <= 0 ? 0 : (d[k - 1] + d[k]) / 2;
    return function (p) {
      if (p <= keys[0][0]) return keys[0][1];
      if (p >= keys[n - 1][0]) return keys[n - 1][1];
      let k = 0; while (k < n - 1 && p > keys[k + 1][0]) k++;
      const h = keys[k + 1][0] - keys[k][0], t = (p - keys[k][0]) / h, t2 = t * t, t3 = t2 * t;
      return (2 * t3 - 3 * t2 + 1) * keys[k][1] + (t3 - 2 * t2 + t) * h * m[k] + (-2 * t3 + 3 * t2) * keys[k + 1][1] + (t3 - t2) * h * m[k + 1];
    };
  }

  let cv, ctx, terugKnop, W = 0, H = 0, dpr = 1;
  let p = 0, doel = 0, draai = -0.09, melkDraai = 0, vorige = 0, raf = 0;
  const kanteling = 0.9;   // Nederland (52 graden noord) midden op de bol, waar het op de kaart ook stond

  function maat() {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    W = cv.clientWidth; H = cv.clientHeight;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
  }

  function teken(nu) {
    const dt = !reduced && vorige ? Math.min(50, nu - vorige) : 0; vorige = nu;
    draai += dt * 0.00004; melkDraai += dt * 0.000012;
    // voortgang van de animatie op stanbox.nl: van 0,03 (bol vult het scherm) tot 0,8 (sterrenstelsel in beeld)
    // start waar de bol net groter is dan het scherm, zodat de bolletjes ongeveer zo groot zijn als op de kaart
    const q = 0.18 + p * 0.62;
    const cx = W / 2, cy = H / 2, halfDiag = Math.hypot(W, H) / 2, kort = Math.min(W, H);
    const r0 = kort * 0.32, r1 = halfDiag * 6, K = 320, Reind = kort * 0.42 / K;
    const lnR = zoomCurve([[0.03, Math.log(r1)], [0.26, Math.log(r0)], [0.36, Math.log(r0 * 0.7)],
      [0.58, Math.log(4)], [0.84, Math.log(Reind)], [1, Math.log(Reind * 0.8)]])(q);
    const R = Math.exp(lnR), G = R * K;
    const w = glad(0, 1, (Math.log(halfDiag * 3) - Math.log(G)) / (Math.log(halfDiag * 3) - Math.log(kort * 0.42)));
    const zh = ZON[1] + melkDraai, zx = ZON[0] * Math.cos(zh), zy = ZON[0] * Math.sin(zh) * KANTEL;
    const fx = zx * (1 - w), fy = zy * (1 - w);
    const bx = cx + (zx - fx) * G, by = cy + (zy - fy) * G;
    const melkZicht = glad(0, 1, (Math.log(10) - lnR) / (Math.log(10) - Math.log(2.2)));

    cv.style.opacity = glad(0, 0.14, p).toFixed(3);   // rustig overvloeien vanaf de kaart met bolletjes
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = C.zwart; ctx.fillRect(0, 0, W, H);

    const spreid = Math.max(0.6, Math.pow(R / r0, 0.2));
    ctx.fillStyle = C.perzik;
    for (const st of STERREN) {
      const sx = cx + st[0] * halfDiag * spreid, sy = cy + st[1] * halfDiag * spreid;
      if (sx < -4 || sx > W + 4 || sy < -4 || sy > H + 4) continue;
      ctx.globalAlpha = st[3] * (1 - melkZicht); ctx.beginPath(); ctx.arc(sx, sy, st[2], 0, 6.283); ctx.fill();
    }
    if (melkZicht > 0) {
      for (const ster of MELKWEG) {
        const h = ster[1] + melkDraai;
        const mx = cx + (ster[0] * Math.cos(h) - fx) * G, my = cy + (ster[0] * Math.sin(h) * KANTEL - fy) * G;
        if (mx < -2 || mx > W + 2 || my < -2 || my > H + 2) continue;
        ctx.globalAlpha = ster[4] * melkZicht; ctx.fillStyle = ster[2];
        ctx.fillRect(mx - ster[3] / 2, my - ster[3] / 2, ster[3], ster[3]);
      }
    }
    ctx.globalAlpha = 1;
    if (R >= 1.5) {
      ctx.strokeStyle = C.perzik; ctx.globalAlpha = 0.55 * glad(4, 20, R); ctx.lineWidth = Math.max(0.6, R * 0.012);
      ctx.beginPath(); ctx.arc(bx, by, R * 1.04, 0, 6.283); ctx.stroke();
      ctx.globalAlpha = 1; ctx.fillStyle = C.licht;
      ctx.beginPath(); ctx.arc(bx, by, R, 0, 6.283); ctx.fill();
      const zn = Math.max(0, Math.min(1, Math.log(R / r0) / Math.log(r1 / r0)));
      const zicht = (1 - glad(0.55, 0.85, zn)) * glad(6, 24, R);
      if (zicht > 0) tekenLand(bx, by, R, zicht);
    } else { ctx.fillStyle = C.licht; ctx.beginPath(); ctx.arc(bx, by, 1.6, 0, 6.283); ctx.fill(); }
    const ring = melkZicht * (1 - glad(0.55, 1, w));
    if (ring > 0) {
      ctx.strokeStyle = C.koraal; ctx.lineWidth = 1.5; ctx.globalAlpha = ring;
      ctx.beginPath(); ctx.arc(bx, by, Math.max(R * 1.6, 8), 0, 6.283); ctx.stroke();
      ctx.globalAlpha = 1;
    }
  }

  function draaiPunt(q) {
    const ca = Math.cos(draai), sa = Math.sin(draai), ck = Math.cos(kanteling), sk = Math.sin(kanteling);
    const x = q[0] * ca - q[2] * sa, z = q[0] * sa + q[2] * ca;
    return [x, q[1] * ck - z * sk, q[1] * sk + z * ck];
  }
  function tekenLand(cx, cy, R, zicht) {
    const stip = R * 0.0115;
    ctx.fillStyle = C.koraal; ctx.globalAlpha = zicht;
    for (const q of PUNTEN) {
      const [x, y, zz] = draaiPunt(q);
      if (zz <= 0) continue;
      const px = cx + x * R, py = cy - y * R;
      if (px < -stip || px > W + stip || py < -stip || py > H + stip) continue;
      ctx.beginPath(); ctx.arc(px, py, stip * (0.45 + 0.55 * zz), 0, 6.283); ctx.fill();
    }
    const [nx, ny, nz] = draaiPunt(NL);
    if (nz > 0.05) { ctx.fillStyle = C.zwart; ctx.beginPath(); ctx.arc(cx + nx * R, cy - ny * R, Math.max(2.5, stip * 2.2), 0, 6.283); ctx.fill(); }
    ctx.globalAlpha = 1;
  }

  /* p loopt vloeiend naar doel; bij p = 0 is de kaart weer gewoon te gebruiken */
  let vorigeLus = 0;
  function lus(nu) {
    // tijdgestuurd: ook bij weinig beelden per seconde is de overgang binnen een halve seconde klaar
    const dt = vorigeLus ? Math.min(400, nu - vorigeLus) : 16; vorigeLus = nu;
    p += (doel - p) * (reduced ? 1 : 1 - Math.exp(-dt / 110));
    if (Math.abs(doel - p) < 0.0008) p = doel;
    const aan = p > 0.0005;
    if (aan && cv.hidden) { cv.hidden = false; maat(); }   // pas zichtbaar heeft het tekenvlak een maat
    cv.hidden = !aan; terugKnop.hidden = p < 0.25;
    document.body.classList.toggle('in-heelal', aan);
    if (aan) teken(nu);
    raf = aan || p !== doel ? requestAnimationFrame(lus) : 0;
    if (!raf) vorigeLus = 0;
  }
  function zetDoel(d) { doel = Math.max(0, Math.min(1, d)); if (!raf) { vorige = 0; raf = requestAnimationFrame(lus); } }
  SK.heelalStand = () => ({ p: p, doel: doel, raf: raf });
  const opMinimum = () => SK.leaflet && SK.leaflet.getZoom() <= SK.leaflet.getMinZoom() + 0.01;

  function start() {
    const vak = document.querySelector('.kaart-vak');
    cv = document.createElement('canvas');
    cv.className = 'heelal'; cv.hidden = true; cv.setAttribute('aria-hidden', 'true');
    vak.appendChild(cv);
    ctx = cv.getContext('2d');
    terugKnop = document.createElement('button');
    terugKnop.type = 'button'; terugKnop.className = 'heelal-terug'; terugKnop.hidden = true;
    terugKnop.textContent = SK.t('terugNaarKaart');
    terugKnop.addEventListener('click', () => zetDoel(0));
    vak.appendChild(terugKnop);
    maat();
    window.addEventListener('resize', () => { if (!cv.hidden) maat(); });

    // scrollwiel: op het verste zoomniveau verder uitzoomen gaat de ruimte in, inzoomen weer terug
    vak.addEventListener('wheel', e => {
      if (doel > 0 || (e.deltaY > 0 && opMinimum())) {
        if (doel === 0 && e.deltaY < 0) return;
        e.preventDefault(); e.stopPropagation();
        const stap = Math.max(-0.12, Math.min(0.12, e.deltaY * (e.deltaMode === 1 ? 0.03 : 0.0012)));
        zetDoel(doel + stap);
      }
    }, { capture: true, passive: false });
    // min-knop van de kaart op het verste zoomniveau: in één keer naar het sterrenstelsel
    document.addEventListener('click', e => {
      const min = e.target.closest('.leaflet-control-zoom-out'), plus = e.target.closest('.leaflet-control-zoom-in');
      if (min && opMinimum() && doel < 1) { e.preventDefault(); e.stopPropagation(); zetDoel(doel < 0.3 ? 0.35 : 1); }
      else if (plus && doel > 0) { e.preventDefault(); e.stopPropagation(); zetDoel(doel > 0.5 ? 0.35 : 0); }
    }, true);
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && doel > 0) { zetDoel(0); e.stopImmediatePropagation(); } }, true);
    SK.heelalTekst = () => { terugKnop.textContent = SK.t('terugNaarKaart'); };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(start, 0));
  else setTimeout(start, 0);
})();
