/* Van stad naar bouwsteen, als onderbreking van de achtergrond (#stad).
   Tijdens het scrollen:
   1. een isometrische stad groeit op uit de pagina (zelfde kubusstijl als de achtergrond);
   2. je zoomt in op één gebouw, dan op de gevel met ramen;
   3. tussen de ramen zie je de bouwstenen; één steen kleurt koraal;
   4. die steen komt naar voren en wordt een kubus zoals in de achtergrond;
   5. de rest vervaagt en je bent terug op de pagina.
   Kleuren alleen uit STIJLGIDS.md. Achtergrond = perzik-licht (de paginakleur), dus
   begin en eind vloeien zonder harde rand over in de pagina. */
(function(){
  var sec = document.getElementById('stad'), cv = document.getElementById('stad-canvas');
  if(!sec || !cv || !cv.getContext) return;
  var ctx = cv.getContext('2d');
  var C = { zwart:'#1A1A1A', perzik:'#F7C9A9', licht:'#FBE3D2', koraal:'#E5603F', koraalDonker:'#C9452A', wit:'#FFFFFF' };
  var NEUTRAAL = [C.wit, C.licht, C.perzik], ACCENT = [C.licht, C.koraal, C.koraalDonker];

  var seed = 11;
  function rnd(){ seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
  function glad(a, b, x){ x = Math.max(0, Math.min(1, (x-a)/(b-a))); return x*x*(3-2*x); }
  function iso(x, y, z){ return [(x - y) * .866, (x + y) * .5 - z]; }

  /* ---------- de stad: raster van blokken, het doelgebouw in het midden ---------- */
  var STAP = 12, GEBOUWEN = [];
  for(var i=-4;i<=4;i++) for(var j=-4;j<=4;j++){
    if(i === 0 && j === 0) continue;
    if(i + j >= 1 && i - j >= -2 && i - j <= 1) continue;   /* vrije laan vóór de gevel, zodat er niets voor staat */
    var afstand = Math.hypot(i, j);
    GEBOUWEN.push({ x:i*STAP, y:j*STAP, w:8, h:6 + Math.floor(rnd()*4)*6, kleur: rnd() < .14 ? ACCENT : NEUTRAAL, groei: afstand / 6 });
  }
  var DOEL = { x:0, y:0, w:10, h:30, kleur:NEUTRAAL, groei:0 };
  GEBOUWEN.push(DOEL);
  GEBOUWEN.sort(function(a, b){ return (a.x + a.y) - (b.x + b.y); });   /* van achter naar voor */

  /* ramen op de gevel (vlak y = 10, naar de kijker toe) */
  var RAMEN = []; for(var v=0;v<6;v++) for(var k=0;k<4;k++) RAMEN.push([1.5 + k*2.2, 4 + v*4.6, 1.4, 2.6]);
  /* bouwstenen in de muurband tussen twee raamrijen */
  var SW = .4, SH = .18, BAND = [6.6, 8.6], STENEN = [];
  for(var r=0; BAND[0] + (r+1)*SH <= BAND[1] + 1e-6; r++){
    var ofs = (r % 2) * SW / 2;
    for(var c=-1; c*SW + ofs < 10; c++){
      var x0 = Math.max(0, c*SW + ofs), x1 = Math.min(10, (c+1)*SW + ofs);
      if(x1 - x0 > .01) STENEN.push([x0, BAND[0] + r*SH, x1 - x0, SH]);
    }
  }
  var DOELSTEEN = [4.6, BAND[0] + 5*SH, SW, SH];

  function vlak(pts, vul, rand){
    ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
    for(var i=1;i<pts.length;i++) ctx.lineTo(pts[i][0], pts[i][1]);
    ctx.closePath();
    if(vul){ ctx.fillStyle = vul; ctx.fill(); }
    if(rand){ ctx.strokeStyle = rand; ctx.stroke(); }
  }
  /* blok met hoek (x,y,z), breedte w (x), diepte d (y), hoogte h (z); kleuren [boven, voor, zijkant] */
  function blok(x, y, z, w, d, h, kl, rand){
    vlak([iso(x,y+d,z+h), iso(x+w,y+d,z+h), iso(x+w,y+d,z), iso(x,y+d,z)], kl[1], rand);
    vlak([iso(x+w,y,z+h), iso(x+w,y+d,z+h), iso(x+w,y+d,z), iso(x+w,y,z)], kl[2], rand);
    vlak([iso(x,y,z+h), iso(x+w,y,z+h), iso(x+w,y+d,z+h), iso(x,y+d,z+h)], kl[0], rand);
  }
  function gevelVlak(x, z, w, h){ return [iso(x,10,z), iso(x+w,10,z), iso(x+w,10,z+h), iso(x,10,z+h)]; }

  /* monotone, vloeiende interpolatie door sleutelpunten (geen schokken) */
  function curve(keys){
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

  var W = 0, H = 0, dpr = 1, ZOOM, FX, FY;
  function maat(){
    dpr = Math.min(2, window.devicePixelRatio || 1);
    W = cv.clientWidth; H = cv.clientHeight;
    cv.width = Math.round(W*dpr); cv.height = Math.round(H*dpr);
    /* camera: zoomniveau (log) en brandpunt per scrollpositie */
    var s0 = Math.min(W / 210, H / 150), sGebouw = H * .62 / 40, sGevel = Math.min(W, H) * .9 / 9;
    var sStenen = Math.min(W, H) * .8 / 3, sSteen = Math.min(W, H) * .34 / SW;
    var stad = iso(0, 0, 8), gebouw = iso(5, 5, 15), gevel = iso(5, 10, 9.5);
    var steen = iso(DOELSTEEN[0] + SW/2, 10, DOELSTEEN[1] + SH/2), kubus = iso(DOELSTEEN[0] + SW/2, 10 + SW/2, DOELSTEEN[1] + SW/2);
    var K = [[.10, s0, stad], [.28, sGebouw, gebouw], [.44, sGevel, gevel], [.58, sStenen, steen], [.72, sSteen, steen], [.84, sSteen * .9, kubus]];
    ZOOM = curve(K.map(function(k){ return [k[0], Math.log(k[1])]; }));
    FX = curve(K.map(function(k){ return [k[0], k[2][0]]; }));
    FY = curve(K.map(function(k){ return [k[0], k[2][1]]; }));
  }
  function voortgang(){
    var r = sec.getBoundingClientRect(), bereik = sec.offsetHeight - window.innerHeight;
    return Math.max(0, Math.min(1, -r.top / Math.max(1, bereik)));
  }

  function teken(){
    var p = voortgang();
    cv.style.opacity = Math.max(0, Math.min(1, p / .04, (1 - p) / .1)).toFixed(3);
    var s = Math.exp(ZOOM(p)), lijn = 1 / s;

    ctx.setTransform(dpr,0,0,dpr,0,0);
    ctx.fillStyle = C.licht; ctx.fillRect(0, 0, W, H);
    ctx.setTransform(dpr*s, 0, 0, dpr*s, dpr*(W/2 - FX(p)*s), dpr*(H/2 - FY(p)*s));
    ctx.lineWidth = lijn; ctx.lineJoin = 'round';

    var stadZicht = 1 - glad(.74, .86, p);   /* alles behalve de steen/kubus vervaagt aan het eind */
    var groei = glad(.0, .14, p);             /* de stad groeit op uit de pagina */
    var rand = 'rgba(26,26,26,.18)';

    if(stadZicht > 0){
      ctx.globalAlpha = stadZicht;
      for(var g=0; g<GEBOUWEN.length; g++){
        var b = GEBOUWEN[g], h = b.h * glad(b.groei * .55, b.groei * .55 + .45, groei);
        if(h < .05) continue;
        blok(b.x, b.y, 0, b.w, b.w, h, b.kleur, rand);
      }
      /* ramen en bouwstenen op de gevel van het doelgebouw (groeien mee) */
      var dh = DOEL.h * glad(0, .45, groei);
      if(dh > 4){
        for(var w=0; w<RAMEN.length; w++){
          var rm = RAMEN[w]; if(rm[1] + rm[3] > dh) continue;
          vlak(gevelVlak(rm[0], rm[1], rm[2], rm[3]), w === 13 ? C.koraal : 'rgba(26,26,26,.72)');
        }
        var voeg = glad(.4, .56, p);
        if(voeg > 0 && dh >= BAND[1]){
          ctx.strokeStyle = 'rgba(26,26,26,' + (.28 * voeg).toFixed(3) + ')';
          for(var t=0; t<STENEN.length; t++){ var st = STENEN[t]; vlak(gevelVlak(st[0], st[1], st[2], st[3]), null, ctx.strokeStyle); }
        }
      }
      ctx.globalAlpha = 1;
    }

    /* de doelsteen: kleurt koraal en komt naar voren als kubus */
    var kleur = glad(.5, .6, p), uit = glad(.7, .86, p);
    if(kleur > 0){
      var x = DOELSTEEN[0], z = DOELSTEEN[1], ww = SW, hh = SH + (SW - SH) * uit, dd = SW * uit;
      ctx.globalAlpha = kleur;
      if(dd < .002) vlak(gevelVlak(x, z, ww, hh), C.koraal, 'rgba(26,26,26,.28)');
      else blok(x, 10, z, ww, dd, hh, ACCENT, 'rgba(26,26,26,.18)');
      ctx.globalAlpha = 1;
    }
  }

  /* alleen tekenen als de sectie in beeld is, en alleen als er gescrold wordt (niets beweegt vanzelf) */
  var zichtbaar = false, raf = 0;
  function lus(){ teken(); raf = 0; }
  function start(){ if(!raf) raf = requestAnimationFrame(lus); }
  if('IntersectionObserver' in window){
    new IntersectionObserver(function(es){ zichtbaar = es[0].isIntersecting; if(zichtbaar) start(); }, { rootMargin:'100px 0px' }).observe(sec);
  } else zichtbaar = true;
  window.addEventListener('scroll', function(){ if(zichtbaar) start(); }, { passive:true });
  window.addEventListener('resize', function(){ maat(); teken(); });
  maat(); teken();
})();
