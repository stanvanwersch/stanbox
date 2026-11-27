/* Tools, oldest first. Add a new tool at the bottom: it becomes the newest. */
var TOOLS = [
  {"id": "kaartviewer", "name": "FCAB Map Viewer", "url": "kaartviewer.html"},
  {"id": "gebouw", "name": "Het Gebouw", "url": null, "modal": true},
  {"id": "timebox", "name": "Timebox", "url": "https://stanbox.nl/timebox"},
  {"id": "meetlat", "name": "Meetlat", "url": "https://stanbox.nl/meetlat"},
  {"id": "watercalculator", "name": "Water Calculator", "url": "https://stanbox.nl/watercalculator"},
  {"id": "damagecurve", "name": "Damage Curve", "desc": "Make generic damage curves building-specific", "url": "https://stanbox.nl/damagecurve"},
  {"id": "energie", "name": "Paris Proof Dashboard", "desc": "Energy performance based on the WEii (actual energy intensity indicator)", "url": "https://stanbox.nl/energie"},
  {"id": "ontwerpkader", "name": "Circular Design Framework", "desc": "Designing circular climate installations in building renovations", "url": "https://stanbox.nl/ontwerpkader"},
  {"id": "wateroverlast", "name": "FCAB Extreme Rainfall", "desc": "FCAB scores for flooding caused by short, extreme rainfall", "url": "https://stanbox.nl/wateroverlast"},
  {"id": "sri", "name": "Smart Readiness Indicator", "desc": "How well a building’s technology supports its users, saves energy and responds to the grid", "url": "https://stanbox.nl/sri"},
  {"id": "energyprofiles", "name": "Energy Profiles", "desc": "Electricity per municipality and neighbourhood, hour by hour", "url": "https://stanbox.nl/energyprofiles"}
];

/* Afbeelding per tool-id (bestanden in assets/img/). */
var IMAGES = {
  "kaartviewer": "assets/img/kaartviewer.webp",
  "gebouw": "assets/img/gebouw.webp",
  "timebox": "assets/img/timebox.webp",
  "meetlat": "assets/img/meetlat.webp",
  "watercalculator": "assets/img/watercalculator.webp",
  "damagecurve": "assets/img/damagecurve.webp",
  "energie": "assets/img/energie.webp",
  "ontwerpkader": "assets/img/ontwerpkader.webp",
  "wateroverlast": "assets/img/wateroverlast.webp",
  "sri": "assets/img/sri.webp",
  "energyprofiles": "assets/img/energyprofiles.webp"
};
var GEBOUW_LOGO = "assets/img/gebouw-logo.webp";
