/* Data als landschap, als onderbreking van de achtergrond (#datalandschap).
   Tijdens het scrollen:
   1. vanuit het midden verschijnt een plat, isometrisch veld van stippen;
   2. de 'getallen' golven omhoog tot een heuvellandschap (hoge punten koraal, met een dun
      steeltje naar de grond, als een 3D-grafiek); het landschap beweegt zachtjes;
   3. het vlakt weer af, de stippen krimpen en er blijven dunne rasterlijnen over;
   4. die vervagen in de lijnen van de achtergrond: je bent terug op de pagina.
   Kleuren alleen uit STIJLGIDS.md; achtergrond perzik-licht (de paginakleur). */
(function(){
  var sec = document.getElementById('datalandschap'), cv = document.getElementById('data-canvas');
  if(!sec || !cv || !cv.getContext) return;
  var ctx = cv.getContext('2d');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var C = { perzik:'#F7C9A9', licht:'#FBE3D2', koraal:'#E5603F', koraalDonker:'#C9452A' };
  function glad(a, b, x){ x = Math.max(0, Math.min(1, (x-a)/(b-a))); return x*x*(3-2*x); }

  var W = 0, H = 0, dpr = 1, D = 34;   /* D: afstand tussen stippen in px */
  function maat(){
    dpr = Math.min(2, window.devicePixelRatio || 1);
    W = cv.clientWidth; H = cv.clientHeight;
    cv.width = Math.round(W*dpr); cv.height = Math.round(H*dpr);
    D = Math.max(26, Math.min(38, W / 38));
  }
  function voortgang(){
    var r = sec.getBoundingClientRect(), bereik = sec.offsetHeight - window.innerHeight;
    return Math.max(0, Math.min(1, -r.top / Math.max(1, bereik)));
  }

  /* hoogte in px op rasterpunt (i, j) op tijdstip t: golven plus een paar 'pieken' die rondzwerven */
  function hoogte(i, j, t){
    var h = 40 + 38 * Math.sin(i*.21 + t*.5) * Math.cos(j*.17 - t*.35) + 22 * Math.sin((i + j)*.11 + t*.25);
    var pieken = [[8*Math.sin(t*.13), 6*Math.cos(t*.11), 150], [-10 + 4*Math.cos(t*.09), 9, 110], [12, -9 + 5*Math.sin(t*.1), 125]];
    for(var k=0;k<pieken.length;k++){ var a = pieken[k], dx = i - a[0], dy = j - a[1]; h += a[2] * Math.exp(-(dx*dx + dy*dy) / 22); }
    return Math.max(0, h);
  }

  var tijd = 0, vorige = 0;
  function teken(nu){
    var p = voortgang();
    if(!reduced && vorige) tijd += Math.min(50, nu - vorige) / 1000;
    vorige = nu;
    cv.style.opacity = Math.max(0, Math.min(1, p / .04, (1 - p) / .08)).toFixed(3);

    var intro = glad(.0, .12, p);                       /* stippen verschijnen vanuit het midden */
    var amp = glad(.08, .42, p) * (1 - glad(.6, .8, p)); /* heuvels op en weer af */
    var lijn = glad(.74, .9, p);                         /* rasterlijnen nemen het over */
    var stip = 1 - glad(.78, .92, p);

    ctx.setTransform(dpr,0,0,dpr,0,0);
    ctx.fillStyle = C.licht; ctx.fillRect(0, 0, W, H);
    var cx = W/2, cy = H/2 + 40 * amp;
    var nu_ = Math.ceil(W / (2 * .866 * D)) + 2, nv = Math.ceil((H/2 + 260) / (.5 * D)) + 2;
    var maxR = Math.hypot(nu_, nv);

    /* rasterlijnen (zoals de achtergrond), onder de stippen */
    if(lijn > 0){
      ctx.strokeStyle = 'rgba(26,26,26,' + (.12 * lijn).toFixed(3) + ')'; ctx.lineWidth = 1;
      ctx.beginPath();
      for(var a=-nv; a<=nv; a+=2){
        /* lijnen met constante i (naar rechtsonder) en met constante j (naar linksonder) */
        ctx.moveTo(cx + (a + nv) * .866 * D, cy + (a - nv) * .5 * D); ctx.lineTo(cx + (a - nv) * .866 * D, cy + (a + nv) * .5 * D);
        ctx.moveTo(cx + (-nv - a) * .866 * D, cy + (-nv + a) * .5 * D); ctx.lineTo(cx + (nv - a) * .866 * D, cy + (nv + a) * .5 * D);
      }
      ctx.stroke();
    }

    if(stip > 0 && intro > 0){
      /* van achter naar voor: v = i + j oplopend */
      for(var v=-nv; v<=nv; v++){
        for(var u=-nu_; u<=nu_; u++){
          if((u + v) & 1) continue;
          var i = (u + v) / 2, j = (v - u) / 2;
          var bx = cx + u * .866 * D, by = cy + v * .5 * D;
          var r0 = glad(0, 1, intro * 1.6 - Math.hypot(u, v) / maxR * .6);
          if(r0 <= 0) continue;
          var h = hoogte(i, j, tijd) * amp, py = by - h;
          if(bx < -10 || bx > W + 10 || py < -10 || py > H + 10) continue;
          if(h > 18){
            ctx.strokeStyle = 'rgba(26,26,26,' + (.13 * stip).toFixed(3) + ')'; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx, py); ctx.stroke();
          }
          ctx.globalAlpha = stip;
          ctx.fillStyle = h > 120 ? C.koraalDonker : h > 55 ? C.koraal : C.perzik;
          ctx.beginPath(); ctx.arc(bx, py, (2.2 + h * .016) * r0 * (.4 + .6 * stip), 0, 6.283); ctx.fill();
          ctx.globalAlpha = 1;
        }
      }
    }
  }

  /* alleen tekenen als de sectie in beeld is; het landschap beweegt zachtjes */
  var zichtbaar = false, raf = 0;
  function lus(nu){ teken(nu); raf = zichtbaar && !reduced ? requestAnimationFrame(lus) : 0; }
  function start(){ if(!raf) raf = requestAnimationFrame(lus); }
  if('IntersectionObserver' in window){
    new IntersectionObserver(function(es){ zichtbaar = es[0].isIntersecting; if(zichtbaar) start(); else vorige = 0; }, { rootMargin:'100px 0px' }).observe(sec);
  } else zichtbaar = true;
  window.addEventListener('scroll', function(){ if(zichtbaar) start(); }, { passive:true });
  window.addEventListener('resize', function(){ maat(); teken(performance.now()); });
  maat(); teken(performance.now());
})();
