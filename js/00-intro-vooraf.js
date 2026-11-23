/* Laadt in <head>, vóór de pagina zichtbaar is: het startscherm (#intro) toon je één keer per
   browsersessie. Al gezien (of minder beweging gewenst)? Dan krijgt <html> de klasse
   'intro-klaar' en verbergt CSS het startscherm meteen, zonder flits. */
(function(){
  var gezien = false;
  try { gezien = sessionStorage.getItem('stanbox-intro') === '1'; } catch(e) {}
  var rustig = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add(gezien || rustig ? 'intro-klaar' : 'intro-actief');
})();
