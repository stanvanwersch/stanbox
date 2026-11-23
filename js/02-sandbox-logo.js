/* Hover op de dichte sandbox: de bak vormt zich om tot het Stanbox-beeldmerk.
   - Het zwarte blok groeit uit de lucht (bovenkant van de bak).
   - Het terracotta blok rijst op uit de donkere golf (zand) en vloeit bij het
     weggaan precies terug in die golf; daarna verschijnt de lichte golf langzaam weer.
   De eindvorm gebruikt exact de paden uit assets/img/stanbox-beeldmerk.svg,
   alleen geschaald en gecentreerd. */
(function(){
  var box = document.getElementById('sandbox');
  var svg = box && box.querySelector('.sandbox-logo');
  if(!svg) return;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var p1 = svg.querySelector('.b1'), p2 = svg.querySelector('.b2');
  var golf = box.querySelector('.dunes .d2'), tag = box.querySelector('.sandbox-tag');

  /* Tekenvlak = binnenkant van de bak (260x178 min 2x6 px rand). */
  var W = 248, H = 166, R = 6, Y1 = 92, MID = W / 2;
  var S = 1.36, OX = (W - 100 * S) / 2, OY = (H - 100 * S) / 2;

  /* ---------- zwart blok: vorm-morph op basis van padopdrachten ---------- */
  function L(segs){   /* beeldmerk-coördinaten (0-100) naar het tekenvlak */
    return segs.map(function(s){
      var c = s[0];
      if(c === 'M') return ['M', OX + S*s[1], OY + S*s[2]];
      if(c === 'H') return ['H', OX + S*s[1]];
      if(c === 'V') return ['V', OY + S*s[1]];
      return ['A', S*s[1], s[2], OX + S*s[3], OY + S*s[4]];
    });
  }
  var LOGO1 = L([['M',15,0],['H',67.5],['A',15,1,82.5,15],['V',34],['H',55],['A',20,0,35,54],['V',58.5],['A',10,1,25,68.5],['H',15],['A',15,1,0,53.5],['V',15],['A',15,1,15,0]]);
  var BOX1 = [['M',R,0],['H',W-R],['A',R,1,W,R],['V',Y1],['H',MID],['A',0,0,MID,Y1],['V',Y1],['A',0,1,MID,Y1],['H',0],['A',0,1,0,Y1],['V',R],['A',R,1,R,0]];
  function f(v){ return Math.round(v * 100) / 100; }
  function d(a, b, t){
    return a.map(function(s, i){
      var e = b[i], m = function(k){ return f(s[k] + (e[k] - s[k]) * t); };
      if(s[0] === 'A'){ var r = m(1); return 'A' + r + ' ' + r + ' 0 0 ' + s[2] + ' ' + m(3) + ' ' + m(4); }
      return s[0] + (s[0] === 'M' ? m(1) + ' ' + m(2) : m(1));
    }).join(' ') + 'Z';
  }

  /* ---------- terracotta blok: punt-voor-punt morph tussen golf en beeldmerk ----------
     Beide omtrekken worden in vier delen gelijk bemonsterd (boven, rechts, onder, links),
     zodat de hoeken netjes op elkaar aansluiten. */
  var N = [60, 30, 40, 40];
  function bemonster(dd, n){   /* n punten langs een SVG-pad, eindpunt niet meegeteld */
    var p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    p.setAttribute('d', dd); p.style.visibility = 'hidden'; svg.appendChild(p);
    var len = p.getTotalLength(), uit = [];
    for(var i = 0; i < n; i++){ var q = p.getPointAtLength(len * i / n); uit.push([OX + S*q.x, OY + S*q.y]); }
    svg.removeChild(p); return uit;
  }
  var LOGO2 = [].concat(
    bemonster('M55 44 H85', N[0]),
    bemonster('M85 44 A15 15 0 0 1 100 59 V85 A15 15 0 0 1 85 100', N[1]),
    bemonster('M85 100 H30.5 A15 15 0 0 1 15.5 85', N[2]),
    bemonster('M15.5 85 V78.5 H25 A20 20 0 0 0 45 58.5 V54 A10 10 0 0 1 55 44', N[3]));

  /* De donkere golf (.d2 in index.html): 'M0 94 C120 84 240 84 360 96 S560 108 800 94 ...'
     in een vlak van 1600x150. Als lijst punten, zodat we y bij elke x kunnen opzoeken. */
  var GOLF = (function(){
    var c = [[0,94, 120,84, 240,84, 360,96], [360,96, 480,108, 560,108, 800,94],
             [800,94, 920,84, 1040,84, 1160,96], [1160,96, 1280,108, 1360,108, 1600,94]], uit = [];
    c.forEach(function(k){
      for(var i = 0; i < 60; i++){
        var t = i / 60, u = 1 - t, a = u*u*u, b = 3*u*u*t, cc = 3*u*t*t, dd = t*t*t;
        uit.push([a*k[0] + b*k[2] + cc*k[4] + dd*k[6], a*k[1] + b*k[3] + cc*k[5] + dd*k[7]]);
      }
    });
    uit.push([1600, 94]); return uit;
  })();
  /* actuele golf (hij drijft voortdurend opzij) omgerekend naar het tekenvlak */
  function golfFunctie(){
    var g = golf.getBoundingClientRect(), s = svg.getBoundingClientRect();
    var kx = W / s.width, ky = H / s.height;
    var pts = GOLF.map(function(q){ return [(g.left + q[0] / 1600 * g.width - s.left) * kx, (g.top + q[1] / 150 * g.height - s.top) * ky]; });
    return function(x){
      var lo = 0, hi = pts.length - 1;
      while(hi - lo > 1){ var m = (lo + hi) >> 1; if(pts[m][0] <= x) lo = m; else hi = m; }
      var a = pts[lo], b = pts[hi], t = b[0] === a[0] ? 0 : (x - a[0]) / (b[0] - a[0]);
      return a[1] + (b[1] - a[1]) * t;
    };
  }
  function golfVorm(){   /* de donkere golf binnen de bak, als omtrek met dezelfde vier delen */
    var y = golfFunctie(), uit = [], i, a, hoek = Math.PI / 2 * R;
    for(i = 0; i < N[0]; i++){ var x = W * i / N[0]; uit.push([x, y(x)]); }
    var rechts = (H - R) - y(W);
    for(i = 0; i < N[1]; i++){ var l = (rechts + hoek) * i / N[1];
      if(l < rechts) uit.push([W, y(W) + l]); else { a = (l - rechts) / R; uit.push([W - R + R*Math.cos(a), H - R + R*Math.sin(a)]); } }
    var onder = W - 2*R;
    for(i = 0; i < N[2]; i++){ var m = (onder + hoek) * i / N[2];
      if(m < onder) uit.push([W - R - m, H]); else { a = Math.PI/2 + (m - onder) / R; uit.push([R + R*Math.cos(a), H - R + R*Math.sin(a)]); } }
    var links = (H - R) - y(0);
    for(i = 0; i < N[3]; i++) uit.push([0, H - R - links * i / N[3]]);
    return uit;
  }
  function blok2(e){
    var van = golfVorm();
    return 'M' + van.map(function(p, i){ var q = LOGO2[i]; return f(p[0] + (q[0] - p[0]) * e) + ' ' + f(p[1] + (q[1] - p[1]) * e); }).join('L') + 'Z';
  }

  /* ---------- alles hangt aan één waarde e (0 = bak, 1 = beeldmerk) ---------- */
  function mix(a, b, e){ return 'rgb(' + a.map(function(v, i){ return Math.round(v + (b[i] - v) * e); }).join(',') + ')'; }
  var LICHT = [251,227,210], ZWART = [26,26,26], KORAAL_FEL = [229,96,63], KORAAL = [201,69,42];
  function draw(e){
    if(e <= 0){   /* rust: CSS bepaalt weer alles; de echte golf neemt het over */
      ['border-color','background-color','box-shadow'].forEach(function(k){ box.style.removeProperty(k); });
      svg.style.opacity = golf.style.opacity = tag.style.opacity = '';
      return;
    }
    p1.setAttribute('d', d(BOX1, LOGO1, e));
    p2.setAttribute('d', blok2(e));
    var rest = 1 - e, weg = Math.max(0, 1 - e * 2.5);
    p1.style.fill = mix(LICHT, ZWART, e); p2.style.fill = mix(KORAAL_FEL, KORAAL, e);
    box.style.borderColor = 'rgba(26,26,26,' + rest.toFixed(3) + ')';
    box.style.backgroundColor = 'rgba(251,227,210,' + rest.toFixed(3) + ')';
    box.style.boxShadow = '0 8px 24px -12px rgba(26,26,26,' + (.28 * rest).toFixed(3) + ')';
    svg.style.opacity = 1; golf.style.opacity = 0; tag.style.opacity = weg;
  }

  /* Kritisch gedempte veer: reageert meteen, loopt zacht uit en keert zonder schok om. */
  var e = 0, v = 0, target = 0, last = 0, raf = 0, K = 160, DEMP = 2 * Math.sqrt(160);
  function step(now){
    var dt = Math.min(1/30, Math.max(0, (now - last) / 1000)); last = now;
    v += (K * (target - e) - DEMP * v) * dt; e += v * dt;
    if(Math.abs(target - e) < .002 && Math.abs(v) < .02){ e = target; v = 0; }
    draw(Math.max(0, Math.min(1, e)));
    /* lichte golf al laten opgroeien terwijl de donkere golf nog gevormd wordt (ca. 0,2 s na weggaan) */
    if(target === 0 && e < .3) box.classList.remove('golf-weg');
    if(e !== target){ raf = requestAnimationFrame(step); return; }
    raf = 0;
    if(e === 0) box.classList.remove('morphing');
  }
  function go(to){
    if(box.classList.contains('expanded') || box.classList.contains('closing')) to = 0;
    target = to;
    if(to === 1) box.classList.add('morphing', 'golf-weg');
    if(reduced){ e = to; v = 0; draw(e); if(!to) box.classList.remove('morphing', 'golf-weg'); return; }
    if(!raf){ last = performance.now(); raf = requestAnimationFrame(step); }
  }
  box.addEventListener('mouseenter', function(){ go(1); });
  box.addEventListener('mouseleave', function(){ go(0); });
  box.addEventListener('focus', function(){ if(box.matches(':focus-visible') && !box.classList.contains('closing')) go(1); });
  box.addEventListener('blur', function(){ go(0); });
  /* bij openen meteen terug naar de gewone bak */
  box.addEventListener('click', function(){ cancelAnimationFrame(raf); raf = 0; e = target = v = 0; draw(0); box.classList.remove('morphing', 'golf-weg'); }, true);
})();
