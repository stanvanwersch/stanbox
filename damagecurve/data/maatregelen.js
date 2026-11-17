/* Maatregelen (FCAB-maatregelnummers) met kosten en effect.
   Velden: id, nr (FCAB-nr), lvl (niveau), name, k (kosten-indicatie), c (complexiteit),
   f2 (telt mee in FCAB-2 gebouwscore), cost (standaardkosten in euro), desc (effect), on (standaard aan). */
window.DC_MAATREGELEN = [
 {id:'m25',nr:25,lvl:'Gebied / perceel',name:'Tegels eruit, groen erin',k:'Laag',c:'Eenvoudig',f2:false,cost:1000,desc:'Waterdiepte −2 cm',on:false},
 {id:'m29',nr:29,lvl:'Gebied / perceel',name:'Regentuin of wadi',k:'Laag',c:'Gemiddeld',f2:false,cost:2500,desc:'Waterdiepte −3 cm',on:false},
 {id:'m32',nr:32,lvl:'Gebied / perceel',name:'Waterplein of berging op straat',k:'Hoog',c:'Complex',f2:false,cost:0,desc:'Waterdiepte −8 cm · kosten bij gemeente of waterschap',on:false},
 {id:'m76',nr:76,lvl:'Gebouw',name:'Permanente waterkering of verhoogde drempel',k:'Laag',c:'Eenvoudig',f2:true,cost:1500,desc:'Ingang +15 cm',on:true},
 {id:'m74',nr:74,lvl:'Gebouw',name:'Tijdelijke waterkering (schot)',k:'Laag',c:'Eenvoudig',f2:true,cost:600,desc:'Schot bij ingang en kelder; ingangpunten 10',on:false},
 {id:'m102',nr:102,lvl:'Gebouw',name:'Goede afdichting instroomopeningen',k:'Laag',c:'Eenvoudig',f2:true,cost:600,desc:'Overige instroompunten dicht',on:true},
 {id:'m104',nr:104,lvl:'Gebouw',name:'Anti-terugslagkleppen toilet en wastafel',k:'Laag',c:'Eenvoudig',f2:true,cost:400,desc:'Geen rioolwater via toilet',on:false},
 {id:'m75',nr:75,lvl:'Gebouw',name:'Installaties boven waterniveau',k:'Middel',c:'Eenvoudig',f2:true,cost:3500,desc:'Installaties verhoogd',on:false},
 {id:'m79',nr:79,lvl:'Gebouw',name:'Waterbestendige materialen',k:'Middel',c:'Eenvoudig',f2:false,cost:4000,desc:'Schade per m² −30% (wet-proofing)',on:false},
];
