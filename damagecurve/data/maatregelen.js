/* Maatregelen (FCAB-maatregelnummers) met kosten en effect.
   Velden: id, nr (FCAB-nr), lvl (niveau), name, k (kosten-indicatie), c (complexiteit),
   f2 (telt mee in FCAB-2 gebouwscore), cost (standaardkosten in euro), desc (effect in woorden), on (standaard aan),
   effect (rekenkundige werking, gebruikt door js/01-rekenkern.js):
     dh: waterdiepte bij elke bui − dh cm      hdr: ingang + hdr cm
     schot / sealed / klep: true                inst: 'hoger' (installaties verhoogd)
     f: schade binnen per m² × f                regel: tekst in het formuleblok van stap 5
   Engels: name_en, lvl_en, desc_en en effect.regel_en (k en c worden vertaald via data/teksten.js).
   Een maatregel toevoegen kan zonder codewijziging, zolang hij met deze velden te beschrijven is. */
window.DC_MAATREGELEN = [
 {id:'m25',nr:25,lvl:'Gebied / perceel',name:'Tegels eruit, groen erin',name_en:'Remove paving, add greenery',lvl_en:'Area / plot',k:'Laag',c:'Eenvoudig',f2:false,cost:1000,desc:'Waterdiepte −2 cm',desc_en:'Water depth −2 cm',on:false,
  effect:{dh:2, regel:'h(T)   − 2 cm  (#25)', regel_en:'h(T)   − 2 cm  (#25)'}},
 {id:'m29',nr:29,lvl:'Gebied / perceel',name:'Regentuin of wadi',name_en:'Rain garden or swale',lvl_en:'Area / plot',k:'Laag',c:'Gemiddeld',f2:false,cost:2500,desc:'Waterdiepte −3 cm',desc_en:'Water depth −3 cm',on:false,
  effect:{dh:3, regel:'h(T)   − 3 cm  (#29)', regel_en:'h(T)   − 3 cm  (#29)'}},
 {id:'m32',nr:32,lvl:'Gebied / perceel',name:'Waterplein of berging op straat',name_en:'Water square or storage in the street',lvl_en:'Area / plot',k:'Hoog',c:'Complex',f2:false,cost:0,desc:'Waterdiepte −8 cm · kosten bij gemeente of waterschap',desc_en:'Water depth −8 cm · costs borne by municipality or water board',on:false,
  effect:{dh:8, regel:'h(T)   − 8 cm  (#32, gebied)', regel_en:'h(T)   − 8 cm  (#32, area)'}},
 {id:'m76',nr:76,lvl:'Gebouw',name:'Permanente waterkering of verhoogde drempel',name_en:'Permanent flood barrier or raised threshold',lvl_en:'Building',k:'Laag',c:'Eenvoudig',f2:true,cost:1500,desc:'Ingang +15 cm',desc_en:'Entrance +15 cm',on:true,
  effect:{hdr:15, regel:'ingang + 15 cm (#76)', regel_en:'entrance + 15 cm (#76)'}},
 {id:'m74',nr:74,lvl:'Gebouw',name:'Tijdelijke waterkering (schot)',name_en:'Temporary flood barrier (flood board)',lvl_en:'Building',k:'Laag',c:'Eenvoudig',f2:true,cost:600,desc:'Schot bij ingang en kelder; ingangpunten 10',desc_en:'Board at entrance and basement; entrance points 10',on:false,
  effect:{schot:true, regel:'schot = ja     (#74)', regel_en:'flood board = yes (#74)'}},
 {id:'m102',nr:102,lvl:'Gebouw',name:'Goede afdichting instroomopeningen',name_en:'Proper sealing of inflow openings',lvl_en:'Building',k:'Laag',c:'Eenvoudig',f2:true,cost:600,desc:'Overige instroompunten dicht',desc_en:'Other inflow points sealed',on:true,
  effect:{sealed:true, regel:'instroompunten dicht (#102)', regel_en:'inflow points sealed (#102)'}},
 {id:'m104',nr:104,lvl:'Gebouw',name:'Anti-terugslagkleppen toilet en wastafel',name_en:'Non-return valves on toilet and washbasin',lvl_en:'Building',k:'Laag',c:'Eenvoudig',f2:true,cost:400,desc:'Geen rioolwater via toilet',desc_en:'No sewage via the toilet',on:false,
  effect:{klep:true, regel:'terugslagklep = ja (#104)', regel_en:'non-return valve = yes (#104)'}},
 {id:'m75',nr:75,lvl:'Gebouw',name:'Installaties boven waterniveau',name_en:'Building services above water level',lvl_en:'Building',k:'Middel',c:'Eenvoudig',f2:true,cost:3500,desc:'Installaties verhoogd',desc_en:'Building services raised',on:false,
  effect:{inst:'hoger', regel:'installaties verhoogd (#75)', regel_en:'services raised (#75)'}},
 {id:'m79',nr:79,lvl:'Gebouw',name:'Waterbestendige materialen',name_en:'Water-resistant materials',lvl_en:'Building',k:'Middel',c:'Eenvoudig',f2:false,cost:4000,desc:'Schade per m² −30% (wet-proofing)',desc_en:'Damage per m² −30% (wet-proofing)',on:false,
  effect:{f:0.7, regel:'c_vast, c_diep × 0,7 (#79)', regel_en:'c_fixed, c_depth × 0.7 (#79)'}},
];
