/* Van de wereld naar de melkweg, als onderbreking van de achtergrond.
   Tijdens het scrollen door #wereld zoom je steeds verder uit:
   1. heel dichtbij: de bol vult het scherm in --perzik-licht (de paginakleur), zodat
      je vloeiend vanaf de pagina vertrekt;
   2. de hele wereldbol in de ruimte;
   3. de bol krimpt tot een stipje met een koraalrode ring ('je bent hier');
   4. de melkweg verschijnt eromheen en de camera schuift naar het midden ervan;
   5. de ruimte trekt zich terug in een zwarte cirkel die krimpt tot een stipje op de
      pagina: je bent geleidelijk terug in de gewone pagina.
   Kleuren alleen uit STIJLGIDS.md: ruimte zwart, bol perzik-licht, land koraal-fel,
   plekken zwart, sterren perzik/perzik-licht/koraal-fel. Continenten en melkweg zijn
   verzonnen (abstract). */
(function(){
  var sec = document.getElementById('wereld'), cv = document.getElementById('wereld-canvas');
  if(!sec || !cv || !cv.getContext) return;
  var ctx = cv.getContext('2d');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var C = { zwart:'#1A1A1A', perzik:'#F7C9A9', licht:'#FBE3D2', koraal:'#E5603F' };

  /* vaste toevalsreeks, zodat alles er elke keer hetzelfde uitziet */
  var seed = 7;
  function rnd(){ seed = (seed + 0x6D2B79F5) | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t ^= t + Math.imul(t ^ t >>> 7, 61 | t); return ((t ^ t >>> 14) >>> 0) / 4294967296; }
  function gauss(){ return Math.sqrt(-2 * Math.log(rnd() + 1e-9)) * Math.cos(6.283 * rnd()); }
  function vec(lat, lon){ lat *= Math.PI/180; lon *= Math.PI/180; return [Math.cos(lat)*Math.sin(lon), Math.sin(lat), Math.cos(lat)*Math.cos(lon)]; }

  /* ---------- de wereld ---------- */
  var KERNEN = [[50,10,28],[30,30,22],[5,20,26],[-20,25,18],[55,80,30],[30,100,22],[10,110,12],[-25,135,16],
                [45,-100,30],[60,-60,18],[15,-90,10],[-15,-60,24],[-40,-68,12],[72,-40,12],[-75,0,30],[-75,120,26]]
    .map(function(k){ return { v:vec(k[0],k[1]), c:Math.cos(k[2]*Math.PI/180) }; });
  function land(p){
    var best = -1;
    for(var i=0;i<KERNEN.length;i++){ var k=KERNEN[i], d=p[0]*k.v[0]+p[1]*k.v[1]+p[2]*k.v[2]-k.c; if(d>best) best=d; }
    var ruis = .045*Math.sin(9*p[0]+4*p[1])*Math.sin(8*p[2]-5*p[1]) + .03*Math.sin(17*p[1]+13*p[2]);
    return best + ruis > 0;
  }
  var N = 5200, PUNTEN = [], PLEKKEN = [], ga = Math.PI*(3-Math.sqrt(5)), i;
  for(i=0;i<N;i++){
    var yy = 1 - 2*(i+.5)/N, rr = Math.sqrt(1-yy*yy), aa = ga*i, pt = [Math.cos(aa)*rr, yy, Math.sin(aa)*rr];
    if(land(pt)) PUNTEN.push(pt);
  }
  for(i=0;i<10;i++) PLEKKEN.push(PUNTEN[Math.floor(rnd()*PUNTEN.length)]);
  /* sterren dichtbij (schermcoördinaten) */
  var STERREN = []; for(i=0;i<220;i++) STERREN.push([rnd()*2-1, rnd()*2-1, .5+rnd()*1.1, .25+rnd()*.55]);

  /* ---------- de melkweg: twee spiraalarmen en een kern (straal 1) ---------- */
  var MELKWEG = [], KANTEL = .62;
  function armHoek(r){ return Math.log(r / .04) * 2.1; }
  for(i=0;i<3400;i++){
    var arm = i % 2, r = .06 + .94 * Math.pow(rnd(), .75);
    var hoek = arm * Math.PI + armHoek(r) + gauss() * (.22 + .18 * r);
    var kleur = rnd() < .12 ? C.koraal : C.perzik;
    MELKWEG.push([r * (1 + gauss() * .05), hoek, kleur, .6 + rnd() * 1.1, .35 + rnd() * .55]);
  }
  for(i=0;i<900;i++) MELKWEG.push([Math.abs(gauss()) * .13, rnd() * 6.283, C.licht, .6 + rnd() * 1.2, .4 + rnd() * .5]);
  var ZON = [.58, armHoek(.58) + .05];   /* waar de wereld ligt: op de eerste arm */

  var W = 0, H = 0, dpr = 1;
  function maat(){
    dpr = Math.min(2, window.devicePixelRatio || 1);
    W = cv.clientWidth; H = cv.clientHeight;
    cv.width = Math.round(W*dpr); cv.height = Math.round(H*dpr);
  }
  function voortgang(){
    var r = sec.getBoundingClientRect(), bereik = sec.offsetHeight - window.innerHeight;
    return Math.max(0, Math.min(1, -r.top / Math.max(1, bereik)));
  }
  function glad(a, b, x){ x = Math.max(0, Math.min(1, (x-a)/(b-a))); return x*x*(3-2*x); }

  /* Zoomverloop: straal van de bol (log) per scrollpositie, door een paar sleutelpunten,
     vloeiend (monotone Hermite-interpolatie: geen schokken, nooit terug). */
  function zoomCurve(keys){
    var n = keys.length, m = [], d = [];
    for(var k=0;k<n-1;k++) d.push((keys[k+1][1]-keys[k][1]) / (keys[k+1][0]-keys[k][0]));
    m[0] = d[0]; m[n-1] = d[n-2];
    for(k=1;k<n-1;k++) m[k] = d[k-1]*d[k] <= 0 ? 0 : (d[k-1] + d[k]) / 2;
    return function(p){
      if(p <= keys[0][0]) return keys[0][1];
      if(p >= keys[n-1][0]) return keys[n-1][1];
      for(var k=0;k<n-1 && p > keys[k+1][0];k++);
      var h = keys[k+1][0]-keys[k][0], t = (p-keys[k][0]) / h, t2 = t*t, t3 = t2*t;
      return (2*t3-3*t2+1)*keys[k][1] + (t3-2*t2+t)*h*m[k] + (-2*t3+3*t2)*keys[k+1][1] + (t3-t2)*h*m[k+1];
    };
  }

  var draai = 0.6, kanteling = 0.38, melkDraai = 0, vorige = 0;
  function teken(nu){
    var p = voortgang();
    var dt = !reduced && vorige ? Math.min(50, nu - vorige) : 0; vorige = nu;
    draai += dt * 0.00006; melkDraai += dt * 0.000012;

    var cx = W/2, cy = H/2, halfDiag = Math.hypot(W, H)/2, kort = Math.min(W, H);
    var r0 = kort * .32, r1 = halfDiag * 6;
    var K = 320;                          /* melkwegstraal in px als de bol 1 px is */
    var Reind = kort * .42 / K;           /* melkweg past dan mooi in beeld */
    var lnR = zoomCurve([[.03, Math.log(r1)], [.26, Math.log(r0)], [.36, Math.log(r0*.7)],
                         [.58, Math.log(4)], [.84, Math.log(Reind)], [1, Math.log(Reind*.8)]])(p);
    /* Einde: de ruimte trekt zich terug in een zwarte cirkel die krimpt tot een stipje op de
       pagina (geen vervaging, dus geen mengkleuren); de melkweg krimpt mee. */
    var iris = glad(.82, .985, p), Rk = halfDiag * 1.02 * (1 - iris);
    var R = Math.exp(lnR) * (1 - iris), G = Math.exp(lnR) * K * (1 - iris);

    /* begin: vloeit in vanaf de pagina (de bol vult dan het scherm in paginakleur) */
    cv.style.opacity = Math.max(0, Math.min(1, p / .04)).toFixed(3);

    /* camera: eerst op de wereld, dan schuift hij naar het midden van de melkweg */
    var w = glad(0, 1, (Math.log(halfDiag * 3) - Math.log(G)) / (Math.log(halfDiag * 3) - Math.log(kort * .42)));
    var zh = ZON[1] + melkDraai;
    var zx = ZON[0] * Math.cos(zh), zy = ZON[0] * Math.sin(zh) * KANTEL;
    var fx = zx * (1 - w), fy = zy * (1 - w);
    var bx = cx + (zx - fx) * G, by = cy + (zy - fy) * G;   /* plek van de bol op het scherm */
    var melkZicht = glad(0, 1, (Math.log(10) - lnR) / (Math.log(10) - Math.log(2.2)));

    ctx.setTransform(dpr,0,0,dpr,0,0);
    ctx.clearRect(0,0,W,H);
    if(Rk < .5) return;   /* helemaal terug op de pagina */
    ctx.save();
    if(iris > 0){ ctx.beginPath(); ctx.arc(cx, cy, Rk, 0, 6.283); ctx.clip(); }
    ctx.fillStyle = C.zwart; ctx.fillRect(0,0,W,H);

    /* sterren dichtbij; verdwijnen als de melkweg verschijnt */
    var spreid = Math.max(.6, Math.pow(R / r0, .2));
    ctx.fillStyle = C.perzik;
    for(var s=0;s<STERREN.length;s++){
      var st = STERREN[s], sx = cx + st[0]*halfDiag*spreid, sy = cy + st[1]*halfDiag*spreid;
      if(sx<-4||sx>W+4||sy<-4||sy>H+4) continue;
      ctx.globalAlpha = st[3] * (1 - melkZicht); ctx.beginPath(); ctx.arc(sx, sy, st[2], 0, 6.283); ctx.fill();
    }

    /* melkweg */
    if(melkZicht > 0){
      for(var m=0;m<MELKWEG.length;m++){
        var ster = MELKWEG[m], h = ster[1] + melkDraai;
        var mx = cx + (ster[0]*Math.cos(h) - fx) * G, my = cy + (ster[0]*Math.sin(h)*KANTEL - fy) * G;
        if(mx < -2 || mx > W+2 || my < -2 || my > H+2) continue;
        ctx.globalAlpha = ster[4] * melkZicht; ctx.fillStyle = ster[2];
        ctx.fillRect(mx - ster[3]/2, my - ster[3]/2, ster[3], ster[3]);
      }
    }
    ctx.globalAlpha = 1;

    /* de wereld */
    if(R >= 1.5){
      ctx.strokeStyle = C.perzik; ctx.globalAlpha = .55 * glad(4, 20, R); ctx.lineWidth = Math.max(.6, R*.012);
      ctx.beginPath(); ctx.arc(bx, by, R*1.04, 0, 6.283); ctx.stroke();
      ctx.globalAlpha = 1; ctx.fillStyle = C.licht;
      ctx.beginPath(); ctx.arc(bx, by, R, 0, 6.283); ctx.fill();
      var zn = Math.max(0, Math.min(1, Math.log(R/r0) / Math.log(r1/r0)));
      var zicht = (1 - glad(.55, .85, zn)) * glad(6, 24, R);   /* land verschijnt bij het uitzoomen */
      if(zicht > 0) tekenLand(bx, by, R, zicht);
    } else {
      ctx.fillStyle = C.licht; ctx.beginPath(); ctx.arc(bx, by, 1.6, 0, 6.283); ctx.fill();
    }
    /* 'je bent hier': koraalrode ring rond het stipje, weg zodra de melkweg in beeld staat */
    var ring = melkZicht * (1 - glad(.55, 1, w));
    if(ring > 0){
      ctx.strokeStyle = C.koraal; ctx.lineWidth = 1.5; ctx.globalAlpha = ring;
      ctx.beginPath(); ctx.arc(bx, by, Math.max(R * 1.6, 8), 0, 6.283); ctx.stroke();
      ctx.globalAlpha = 1;
    }
    ctx.restore();
  }

  function tekenLand(cx, cy, R, zicht){
    var ca = Math.cos(draai), sa = Math.sin(draai), ck = Math.cos(kanteling), sk = Math.sin(kanteling);
    var stip = R * .0115;
    ctx.fillStyle = C.koraal; ctx.globalAlpha = zicht;
    for(var i=0;i<PUNTEN.length;i++){
      var q = PUNTEN[i], x = q[0]*ca + q[2]*sa, z = -q[0]*sa + q[2]*ca;
      var y = q[1]*ck - z*sk, zz = q[1]*sk + z*ck;
      if(zz <= 0) continue;
      var px = cx + x*R, py = cy - y*R;
      if(px < -stip || px > W+stip || py < -stip || py > H+stip) continue;
      ctx.beginPath(); ctx.arc(px, py, stip*(.45 + .55*zz), 0, 6.283); ctx.fill();
    }
    ctx.fillStyle = C.zwart;
    for(var k=0;k<PLEKKEN.length;k++){
      var g = PLEKKEN[k], gx = g[0]*ca + g[2]*sa, gz = -g[0]*sa + g[2]*ca;
      var gy = g[1]*ck - gz*sk, gzz = g[1]*sk + gz*ck;
      if(gzz <= .05) continue;
      ctx.beginPath(); ctx.arc(cx + gx*R, cy - gy*R, stip*1.5*(.5+.5*gzz), 0, 6.283); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  /* alleen tekenen als de sectie in beeld is */
  var zichtbaar = false, raf = 0;
  function lus(nu){ teken(nu); raf = zichtbaar && !reduced ? requestAnimationFrame(lus) : 0; }
  function start(){ if(!raf) raf = requestAnimationFrame(lus); }
  if('IntersectionObserver' in window){
    new IntersectionObserver(function(es){ zichtbaar = es[0].isIntersecting; if(zichtbaar) start(); }, { rootMargin:'100px 0px' }).observe(sec);
  } else zichtbaar = true;
  window.addEventListener('scroll', function(){ if(zichtbaar) start(); }, { passive:true });
  window.addEventListener('resize', function(){ maat(); teken(performance.now()); });
  maat(); teken(performance.now());
})();
