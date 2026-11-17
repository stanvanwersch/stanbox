/* Standaardinvoer: de vertrekpunten van de pandpagina (index.html) en de portefeuillepagina
   (portefeuille.html). Alle waarden zijn voorbeeldwaarden, te bepalen in de pilotcasus.
   Velden zoals in js/01-rekenkern.js (invoer van bereken()).
   - pand: invoer voor één pand (pandpagina)
   - portefeuille: voorbeeldtypologieën (naam en naam_en) met aantal woningen op de begane grond; overige velden komen uit 'pand' */
window.DC_STANDAARD = {
 pand:{
  h:[18,28,45], corr:0, t0:50,
  K:{hdr:15, hin:5, route:'woon', A:50, crawl:1, kelder:'none', riool:'gemengd', bj:1935, inst:'bg'},
  C:{curve:'pand', cvast:280, cdiep:8, W:1806, I:45000, pinb:10, pinbd:0.5,
     dkr:1500, dkel:5000, drio:1500, dinst:3000, cind:2500},
  maatregelen:['m76','m102'],
  rente:0.0225, horizon:30, onderhoud:1
 },
 portefeuille:[
  {naam:'Portiekflat jaren 60, begane grond', naam_en:'1960s walk-up flat, ground floor', aantal:24, h:[18,28,45],
   K:{hdr:5, hin:5, route:'woon', A:60, crawl:1, kelder:'none', riool:'gemengd', bj:1962, inst:'bg'}, maatregelen:['m76','m102']},
  {naam:'Rijwoning jaren 70', naam_en:'1970s terraced house', aantal:80, h:[12,20,32],
   K:{hdr:15, hin:10, route:'kruip', A:45, crawl:1, kelder:'none', riool:'gemengd', bj:1975, inst:'bg'}, maatregelen:['m104']},
  {naam:'Rijwoning jaren 90', naam_en:'1990s terraced house', aantal:60, h:[8,14,25],
   K:{hdr:20, hin:20, route:'kruip', A:50, crawl:1, kelder:'none', riool:'gescheiden', bj:1995, inst:'hoger'}, maatregelen:[]},
  {naam:'Galerijflat met souterrain', naam_en:'Gallery flat with semi-basement', aantal:12, h:[25,35,55],
   K:{hdr:10, hin:0, route:'kruip', A:55, crawl:0, kelder:0, riool:'gemengd', bj:1970, inst:'onder'}, maatregelen:['m74','m75']},
 ]
};
