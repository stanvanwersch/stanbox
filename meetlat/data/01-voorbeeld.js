/* Meetlat: voorbeeld waarmee de tool opent.
   Een eenvoudige plattegrond van 10,4 bij 6,4 m (1 px = 1 cm), al gekalibreerd op de onderste gevel,
   met drie metingen. De plattegrond is een SVG die als data-URI wordt geladen, zodat exporteren ook
   werkt als de tool lokaal (file://) wordt geopend. Coördinaten zijn in pixels van de plattegrond. */
window.MEETLAT_VOORBEELD = {
  bestand: 'example-floor-plan',
  breedte: 1200,
  hoogte: 800,
  svg:
    '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">' +
      '<rect width="1200" height="800" fill="#ffffff"/>' +
      '<g fill="none" stroke="#1A1A1A" stroke-linecap="square">' +
        /* buitenmuren */
        '<rect x="80" y="80" width="1040" height="640" stroke-width="14"/>' +
        /* binnenmuren met deuropeningen */
        '<path stroke-width="8" d="M680 80V300M680 380V450"/>' +
        '<path stroke-width="8" d="M80 450H300M380 450H760M840 450H1120"/>' +
        '<path stroke-width="8" d="M480 450V720"/>' +
      '</g>' +
      /* deuren (draairichting) */
      '<g fill="none" stroke="#7A7A7A" stroke-width="2">' +
        '<path d="M300 450A80 80 0 0 1 380 370"/><path d="M300 450L380 370" stroke-dasharray="4 4"/>' +
        '<path d="M760 450A80 80 0 0 0 840 530"/><path d="M760 450L840 530" stroke-dasharray="4 4"/>' +
        '<path d="M680 300A80 80 0 0 1 600 380"/><path d="M680 300L600 380" stroke-dasharray="4 4"/>' +
      '</g>' +
      /* ramen in de gevel */
      '<g stroke="#7A7A7A" stroke-width="3">' +
        '<path d="M200 80H440M800 80H1000M1120 220V360M200 720H380"/>' +
      '</g>' +
      /* keukenblok */
      '<rect x="700" y="100" width="400" height="60" fill="#F6ECE4" stroke="#7A7A7A" stroke-width="2"/>' +
      /* ruimtenamen */
      '<g font-family="Arial, Helvetica, sans-serif" font-size="26" fill="#7A7A7A">{{RUIMTES}}</g>' +
    '</svg>',

  /* ruimtenamen in de tekening (worden op {{RUIMTES}} ingevuld) */
  ruimtes: [
    { x:250, y:230, naam:'Living room' },
    { x:830, y:270, naam:'Kitchen' },
    { x:190, y:600, naam:'Bedroom' },
    { x:700, y:610, naam:'Bathroom and hall' }
  ],

  /* kalibratie: onderste gevel, 1040 px = 10,4 m */
  kalibratie: { punten: [{x:80, y:760}, {x:1120, y:760}], waarde: 10.4, eenheid: 'm' },

  metingen: [
    { type: 'area', naam: 'Living room',
      punten: [{x:80, y:80}, {x:680, y:80}, {x:680, y:450}, {x:80, y:450}] },
    { type: 'line', naam: 'Kitchen width',
      punten: [{x:680, y:200}, {x:1120, y:200}] },
    { type: 'area', naam: 'Bedroom',
      punten: [{x:80, y:450}, {x:480, y:450}, {x:480, y:720}, {x:80, y:720}] }
  ]
};
