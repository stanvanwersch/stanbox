/* altijd openen op Klimaatrisico, bovenaan de pagina */
if('scrollRestoration' in history) history.scrollRestoration='manual';
function openStart(){
  document.querySelectorAll('.tab').forEach(x=>{const on=x.id==='tab-1';x.classList.toggle('on',on);x.setAttribute('aria-selected',on);document.getElementById(x.getAttribute('aria-controls')).hidden=!on;});
  window.scrollTo(0,0);
}
openStart();
window.addEventListener('pageshow',openStart);
