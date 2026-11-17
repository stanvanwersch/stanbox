/* Schadecurves voor de schade binnen het pand (stap 3).
   Elke curve geeft de schade zodra water binnen is, als functie van x = waterdiepte boven de
   ingang/vloer (cm). Drempels (ingang, instroompunten, kelder) en de vaste posten (kruipruimte,
   kelder, riool, installaties, indirect, eigen posten) zijn voor alle curves gelijk.
   Samen geven de curves een bandbreedte (expertgesprekken fase 1, KIN: "meerdere curve-opties").

   Velden: id, naam, kort (label in de keuzeknop), kleur (CSS-variabele), uitleg, bron (Engels: naam_en, kort_en, uitleg_en, bron_en), en per type:
   - type 'kentallen': c_vast + c_diep·min(x, 30) per m² (invoer in stap 3)
   - type 'punten':    max €/m² × relatieve schade, lineair tussen de knikpunten [x in cm, fractie]
   - type 'wortel':    herbouwwaarde €/m² × min(1, a + b·√x)  (x in cm boven de begane-grondvloer)

   Schade wordt gesplitst in opstal, inboedel en indirect (expertgesprekken: "opstal, inboedel en
   indirecte schade apart"). Bovenstaande is de opstal; 'inboedel' per curve:
   - type 'kentallen':  inboedelwaarde × min(1, p_vast + p_diep·min(x, 30))  (invoer in stap 3)
   - type 'wortel':     inboedelwaarde × min(1, a + b·√x)
   - type 'inbegrepen': de curve kent geen aparte inboedel; die zit in de opstalcurve */
window.DC_CURVES = [
 {id:'pand', naam:'Pandspecifiek', kort:'Pandspecifiek', naam_en:'Building-specific', kort_en:'Building-specific', kleur:'--phase2', type:'kentallen',
  uitleg:'Vaste schade per m² zodra water binnen is, plus extra schade per cm tot 30 cm. Kentallen in te vullen.',
  uitleg_en:'Fixed damage per m² once water is inside, plus extra damage per cm up to 30 cm. Unit costs can be entered.',
  bron:'Eigen kentallen (voorbeeldwaarden, te bepalen in de pilotcasus).',
  bron_en:'Own unit costs (example values, to be determined in the pilot case).',
  inboedel:{type:'kentallen', uitleg:'Deel van de inboedelwaarde dat beschadigd raakt zodra water binnen is, plus een deel per cm tot 30 cm.',
   uitleg_en:'Share of the contents value damaged once water is inside, plus a share per cm up to 30 cm.'}},
 {id:'wss', naam:'WaterSchadeSchatter (WSS)', kort:'WSS', kleur:'--text3', type:'punten',
  maxPerM2:271, punten:[[0,0],[1,0.1],[5,0.5],[15,1]],
  uitleg:'Generieke curve voor ondiep water: halve schade bij 5 cm, maximaal bij 15 cm boven de vloer (€271/m²).',
  uitleg_en:'Generic curve for shallow water: half the damage at 5 cm, maximum at 15 cm above the floor (€271/m²).',
  bron:'WaterSchadeSchatter, zoals in FCAB-2 figuur 8. Prijspeil 2015, incl. btw. STOWA 2024-14: de €271/m² dekt het vervangen van vloerbedekking, stuc- en schilderwerk, keukenkastjes en bank, dus opstal en inboedel samen.',
  bron_en:'WaterSchadeSchatter, as in FCAB-2 figure 8. 2015 prices, incl. VAT. STOWA 2024-14: the €271/m² covers replacing floor covering, plaster and paintwork, kitchen units and sofa, i.e. structure and contents combined.',
  inboedel:{type:'inbegrepen', uitleg:'Bij de WSS zit de inboedel in de €271/m² en is niet apart te tonen.', uitleg_en:'In the WSS, contents are included in the €271/m² and cannot be shown separately.'}},
 {id:'limburg', naam:'Limburg 2021 (Endendijk)', kort:'Limburg', kleur:'--water2', type:'wortel',
  a:0.238, b:0.015, herbouwwaarde:1806,
  naam_en:'Limburg 2021 (Endendijk)',
  uitleg:'Empirische curve uit de enquête na de overstroming in Limburg (juli 2021): schaderatio opstal = 0,238 + 0,015·√x, maal de herbouwwaarde.',
  uitleg_en:'Empirical curve from the survey after the Limburg flood (July 2021): structural damage ratio = 0.238 + 0.015·√x, times the rebuilding value.',
  bron:'Endendijk e.a. (2023), Water Resources Research 59(8), e2022WR034192; proefschrift Endendijk (VU, 2025) hfst. 4, tabel 4.7. '+
       'a = gemiddelde van de modellen voor nood- en structurele maatregelen (zonder maatregel), ingevuld met de steekproefgemiddelden (tabel 4.1). '+
       'Rivieroverstroming met gemiddeld 51 cm water: voor ondiepe wateroverlast waarschijnlijk een bovengrens. Herbouwwaarde €1.806/m² (BMVV).',
  bron_en:'Endendijk et al. (2023), Water Resources Research 59(8), e2022WR034192; Endendijk PhD thesis (VU, 2025) ch. 4, table 4.7. '+
       'a = mean of the models for emergency and structural measures (without measure), filled in with the sample means (table 4.1). '+
       'River flood with a mean depth of 51 cm: for shallow pluvial flooding probably an upper bound. Rebuilding value €1,806/m² (BMVV).',
  inboedel:{type:'wortel', a:0.446, b:0.0155,
   uitleg:'Schaderatio inboedel = 0,446 + 0,0155·√x, maal de inboedelwaarde (zelfde bron, tabel 4.7). In de studie was de inboedelwaarde een vervangingswaarde van gemiddeld €78.787; het landelijk gemiddelde is €45.000.',
   uitleg_en:'Contents damage ratio = 0.446 + 0.0155·√x, times the contents value (same source, table 4.7). In the study the contents value was a replacement value averaging €78,787; the national average is €45,000.'}},
];
