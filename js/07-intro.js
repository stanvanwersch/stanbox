/* Startscherm (#intro): twee afgeronde vierkanten schuiven diagonaal rond een vaste S naar elkaar
   toe. Zwart blijft boven de S en koraal eronder (wat over de S gaat, verdwijnt erachter), tot het
   beeldmerk er precies staat. Daarna vervaagt het scherm. Duur ca. 2 s; klikken slaat over.
   Eén keer per browsersessie (zie js/00-intro-vooraf.js). */
(function(){
  var intro = document.getElementById('intro');
  if(!intro) return;
  var html = document.documentElement;
  function klaar(){
    try { sessionStorage.setItem('stanbox-intro', '1'); } catch(e) {}
    html.classList.remove('intro-actief'); html.classList.add('intro-weg');
    setTimeout(function(){ if(intro.parentNode) intro.parentNode.removeChild(intro); }, 600);
  }
  if(!html.classList.contains('intro-actief')){ if(intro.parentNode) intro.parentNode.removeChild(intro); return; }

  var zwart = intro.querySelector('.intro-zwart'), koraal = intro.querySelector('.intro-koraal');
  function uit(x){ x = Math.max(0, Math.min(1, x)); return 1 - Math.pow(1 - x, 3); }
  function glad(a, b, x){ x = Math.max(0, Math.min(1, (x - a) / (b - a))); return x*x*(3 - 2*x); }
  function teken(t){
    var d = 62 * (1 - uit(t / .9)), op = glad(0, .15, t).toFixed(3);
    zwart.setAttribute('transform', 'translate(' + (-d).toFixed(2) + ' ' + (-d).toFixed(2) + ')'); zwart.style.opacity = op;
    koraal.setAttribute('transform', 'translate(' + d.toFixed(2) + ' ' + d.toFixed(2) + ')'); koraal.style.opacity = op;
  }
  var DUUR = 1300, RUST = 350, t0 = 0, gestopt = false;
  function stap(nu){
    if(gestopt) return;
    if(!t0) t0 = nu;
    var t = Math.min(1, (nu - t0) / DUUR);
    teken(t);
    if(t < 1) requestAnimationFrame(stap); else setTimeout(klaar, RUST);
  }
  teken(0);
  requestAnimationFrame(stap);
  intro.addEventListener('click', function(){ gestopt = true; teken(1); klaar(); });
})();
