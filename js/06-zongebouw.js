/* Kleine gimmick: een isometrisch gebouwtje op de pagina. Terwijl het door beeld scrolt,
   draait de zon eromheen: opkomen in het oosten, middag (een paar ramen kleuren koraal:
   te warm binnen), naar het westen. Het is al uit beeld voordat het donker kan worden.
   Er kunnen er meerdere zijn: js/01-… zet er één in elke tussenruimte tussen de visuals
   en daarna af en toe nog één, via window.maakZongebouw(top, kant). */
(function(){
  var C = { perzik:'#F7C9A9', licht:'#FBE3D2', koraal:'#E5603F', wit:'#FFFFFF' };
  var laag = document.getElementById('drift-layer') || document.body;
  var gebouwen = [];
  function glad(a, b, x){ x = Math.max(0, Math.min(1, (x-a)/(b-a))); return x*x*(3-2*x); }
  function iso(x, y, z){ return [(x - y) * .866, (x + y) * .5 - z]; }

  /* nieuw gebouwtje op 'top' (px vanaf de bovenkant van de pagina), kant 'links' of 'rechts' */
  window.maakZongebouw = function(top, kant){
    var el = document.createElement('div');
    el.className = 'zongebouw zongebouw-' + (kant === 'links' ? 'links' : 'rechts');
    el.setAttribute('aria-hidden', 'true');
    el.style.top = Math.round(top) + 'px';
    var cv = document.createElement('canvas'); el.appendChild(cv);
    laag.appendChild(el);
    var g = { el:el, cv:cv, ctx:cv.getContext('2d'), W:0, H:0, dpr:1 };
    maat(g); gebouwen.push(g); teken(g);
    return el;
  };

  function maat(g){
    g.dpr = Math.min(2, window.devicePixelRatio || 1);
    g.W = g.cv.clientWidth; g.H = g.cv.clientHeight;
    g.cv.width = Math.round(g.W * g.dpr); g.cv.height = Math.round(g.H * g.dpr);
  }

  function teken(g){
    var r = g.el.getBoundingClientRect(), vh = window.innerHeight;
    if(r.bottom < -50 || r.top > vh + 50) return;
    var ctx = g.ctx, W = g.W, H = g.H;
    function vlak(pts, vul, rand){
      ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
      for(var i=1;i<pts.length;i++) ctx.lineTo(pts[i][0], pts[i][1]);
      ctx.closePath(); if(vul){ ctx.fillStyle = vul; ctx.fill(); } if(rand){ ctx.strokeStyle = rand; ctx.stroke(); }
    }
    /* 0 = komt onderin beeld, 1 = verdwijnt bovenin: zonsopkomst tot laat in de middag */
    var t = Math.max(0, Math.min(1, (vh - r.top) / (vh + r.height)));
    var hoek = .08 + t * 2.4;                 /* nooit tot zonsondergang (π) */
    var hoog = Math.sin(hoek);

    ctx.setTransform(g.dpr,0,0,g.dpr,0,0); ctx.clearRect(0, 0, W, H);
    var s = W / 64;
    ctx.save(); ctx.translate(W/2, H * .66); ctx.scale(s, s); ctx.lineWidth = 1 / s; ctx.lineJoin = 'round';

    /* zon: beschrijft een boog over het gebouw van oost naar west (koraal als hij hoog staat) */
    var zx = -Math.cos(hoek) * 26, zy = -14 - hoog * 18;
    ctx.fillStyle = hoog > .75 ? C.koraal : C.perzik; ctx.beginPath(); ctx.arc(zx, zy, 3.2, 0, 6.283); ctx.fill();

    /* grond en schaduw (schaduw valt van de zon af, korter als de zon hoog staat) */
    vlak([iso(-11,-11,0), iso(11,-11,0), iso(11,11,0), iso(-11,11,0)], C.perzik);
    var lx = Math.cos(hoek), lengte = Math.min(16, 4.5 / Math.max(.28, hoog));
    var sx = lx * lengte, sy = .55 * lengte;
    vlak([iso(-4,-4,0), iso(4,-4,0), iso(4 + sx,-4 + sy,0), iso(4 + sx,4 + sy,0), iso(-4 + sx,4 + sy,0), iso(-4,4,0)], 'rgba(26,26,26,.16)');

    /* het gebouw */
    var rand = 'rgba(26,26,26,.2)';
    vlak([iso(-4,4,16), iso(4,4,16), iso(4,4,0), iso(-4,4,0)], C.licht, rand);
    vlak([iso(4,-4,16), iso(4,4,16), iso(4,4,0), iso(4,-4,0)], C.perzik, rand);
    vlak([iso(-4,-4,16), iso(4,-4,16), iso(4,4,16), iso(-4,4,16)], C.wit, rand);
    /* ramen: rond het middaguur worden er een paar koraal (te warm binnen) */
    var heet = glad(.62, .85, hoog);
    for(var v=0; v<3; v++) for(var k=0; k<2; k++){
      var x0 = -3 + k*3.6, z0 = 2.5 + v*4.4;
      var warm = heet > .5 && (v + k) % 2 === 0;
      vlak([iso(x0,4,z0), iso(x0+2.4,4,z0), iso(x0+2.4,4,z0+2.6), iso(x0,4,z0+2.6)], warm ? C.koraal : 'rgba(26,26,26,.72)');
    }
    ctx.restore();
  }

  var raf = 0;
  function alles(){ raf = 0; gebouwen.forEach(teken); }
  window.addEventListener('scroll', function(){ if(!raf) raf = requestAnimationFrame(alles); }, { passive:true });
  window.addEventListener('resize', function(){ gebouwen.forEach(maat); alles(); });
})();
