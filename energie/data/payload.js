/* Dashboarddata (TNO-kentallen, WEii-klassen, labels). */
window.PAYLOAD_DATA = {
  "meta": {
    "years": [2020, 2021, 2022, 2023, 2024],
    "bron": "TNO Energiekentallen Utiliteitsbouw 2020–2024 (i.o.v. RVO)",
    "protocol": "WEii-protocol versie 3.1, januari 2026 (TVVL/DGBC)",
    "generated": "2026-10-05",
    "weging": "oppervlak (geschat), conform tab Aannames van het V1-werkboek",
    "weercorrectie": "uit (aandeel ruimteverwarming 0%); handmatig in te schakelen via tab Weercorrectie aandeel",
    "crrem": "CRREM Global Pathways v2.01 (11-01-2023), NL, 1,5°C",
    "gas_factor_kwh_per_m3": 9.77,
    "gas_weegfactor": 1.0,
    "elek_weegfactor": 1.0
  },
  "klasse_order": ["WENG", "Paris Proof", "Zeer zuinig", "Zuinig", "Gemiddeld", "Onzuinig", "Zeer onzuinig"],
  "klasse_color": {
    "WENG": "#002e73",
    "Paris Proof": "#3b2881",
    "Zeer zuinig": "#77238e",
    "Zuinig": "#b21d9c",
    "Gemiddeld": "#bf1368",
    "Onzuinig": "#cc0a34",
    "Zeer onzuinig": "#d90000"
  },
  "aggregate": {
    "2020": {
      "weii": 121.6,
      "weii_gas": 67.3,
      "opwek_kwh": 4.436,
      "eigenverbruik_kwh": 2.497,
      "aantal_panden": 109871,
      "gewicht_m2": 167524535.0,
      "n_categories": 14
    },
    "2021": {
      "weii": 126.7,
      "weii_gas": 74.0,
      "opwek_kwh": 5.563,
      "eigenverbruik_kwh": 2.578,
      "aantal_panden": 110228,
      "gewicht_m2": 169861420.0,
      "n_categories": 14
    },
    "2022": {
      "weii": 113.7,
      "weii_gas": 61.1,
      "opwek_kwh": 8.109,
      "eigenverbruik_kwh": 3.52,
      "aantal_panden": 112027,
      "gewicht_m2": 172703670.0,
      "n_categories": 14
    },
    "2023": {
      "weii": 108.0,
      "weii_gas": 56.4,
      "opwek_kwh": 9.026,
      "eigenverbruik_kwh": 4.529,
      "aantal_panden": 110962,
      "gewicht_m2": 173530555.0,
      "n_categories": 14
    },
    "2024": {
      "weii": 101.1,
      "weii_gas": 50.5,
      "opwek_kwh": 9.739,
      "eigenverbruik_kwh": 4.272,
      "aantal_panden": 116448,
      "gewicht_m2": 179736025.0,
      "n_categories": 14
    }
  },
  "aggregate_besparing_2024": 16.9,
  "categories": [
    {
      "id": "Bedrijfshal",
      "label": "Bedrijfshal",
      "weii_type": "Bedrijfshal",
      "sources": ["Bedrijfshal algemeen (geen LISA-informatie)", "Bedrijfshal algemeen (met LISA-informatie)", "Bedrijfshal met logistieke activiteiten", "Groothandel op bedrijventerrein"],
      "weer_aandeel": {"gas": 0, "elek": 0},
      "thresholds": [0, -25, -10, 20, 70, 115, null],
      "series": {
        "2020": {
          "gas_kental_m3": 4.461,
          "gas_kental_m3_raw": 4.461,
          "weer_factor_verw": 0.102,
          "elek_kental_kwh": 44.402,
          "elek_kental_kwh_corr": 44.402,
          "weii": 88.0,
          "weii_gas": 43.6,
          "aantal_panden": 36686,
          "gewicht_m2": 65741190,
          "pv_aandeel": 0.154,
          "opwek_kwh": 5.515,
          "eigenverbruik_kwh": 2.752,
          "klasse": "Onzuinig",
          "besparing_pct": 0.0
        },
        "2021": {
          "gas_kental_m3": 4.968,
          "gas_kental_m3_raw": 4.968,
          "weer_factor_verw": -0.064,
          "elek_kental_kwh": 43.594,
          "elek_kental_kwh_corr": 43.594,
          "weii": 92.1,
          "weii_gas": 48.5,
          "aantal_panden": 37217,
          "gewicht_m2": 66917595,
          "pv_aandeel": 0.189,
          "opwek_kwh": 7.665,
          "eigenverbruik_kwh": 3.103,
          "klasse": "Onzuinig",
          "besparing_pct": -4.7
        },
        "2022": {
          "gas_kental_m3": 3.886,
          "gas_kental_m3_raw": 3.886,
          "weer_factor_verw": 0.075,
          "elek_kental_kwh": 41.91,
          "elek_kental_kwh_corr": 41.91,
          "weii": 79.9,
          "weii_gas": 38.0,
          "aantal_panden": 38367,
          "gewicht_m2": 68867975,
          "pv_aandeel": 0.207,
          "opwek_kwh": 11.523,
          "eigenverbruik_kwh": 4.317,
          "klasse": "Onzuinig",
          "besparing_pct": 9.2
        },
        "2023": {
          "gas_kental_m3": 3.371,
          "gas_kental_m3_raw": 3.371,
          "weer_factor_verw": 0.111,
          "elek_kental_kwh": 40.836,
          "elek_kental_kwh_corr": 40.836,
          "weii": 73.8,
          "weii_gas": 32.9,
          "aantal_panden": 38418,
          "gewicht_m2": 70120960,
          "pv_aandeel": 0.266,
          "opwek_kwh": 13.334,
          "eigenverbruik_kwh": 6.106,
          "klasse": "Onzuinig",
          "besparing_pct": 16.1
        },
        "2024": {
          "gas_kental_m3": 2.993,
          "gas_kental_m3_raw": 2.993,
          "weer_factor_verw": 0.126,
          "elek_kental_kwh": 39.636,
          "elek_kental_kwh_corr": 39.636,
          "weii": 68.9,
          "weii_gas": 29.2,
          "aantal_panden": 41738,
          "gewicht_m2": 74173740,
          "pv_aandeel": 0.303,
          "opwek_kwh": 14.534,
          "eigenverbruik_kwh": 5.59,
          "klasse": "Gemiddeld",
          "besparing_pct": 21.7
        }
      }
    },
    {
      "id": "Onderwijs (po/vo)",
      "label": "Onderwijs (po/vo)",
      "weii_type": "Basis/voortgezet onderwijs",
      "sources": ["Basisschool", "Middelbare school", "School voor speciaal onderwijs", "Schoolverzamelgebouw"],
      "weer_aandeel": {"gas": 0, "elek": 0},
      "thresholds": [0, 60, 85, 120, 165, 290, null],
      "series": {
        "2020": {
          "gas_kental_m3": 7.271,
          "gas_kental_m3_raw": 7.271,
          "weer_factor_verw": 0.102,
          "elek_kental_kwh": 29.515,
          "elek_kental_kwh_corr": 29.515,
          "weii": 100.6,
          "weii_gas": 71.0,
          "aantal_panden": 6408,
          "gewicht_m2": 20909825,
          "pv_aandeel": 0.289,
          "opwek_kwh": 4.175,
          "eigenverbruik_kwh": 2.811,
          "klasse": "Zuinig",
          "besparing_pct": 0.0
        },
        "2021": {
          "gas_kental_m3": 8.516,
          "gas_kental_m3_raw": 8.516,
          "weer_factor_verw": -0.064,
          "elek_kental_kwh": 29.616,
          "elek_kental_kwh_corr": 29.616,
          "weii": 112.8,
          "weii_gas": 83.2,
          "aantal_panden": 6471,
          "gewicht_m2": 21579325,
          "pv_aandeel": 0.329,
          "opwek_kwh": 4.421,
          "eigenverbruik_kwh": 2.717,
          "klasse": "Zuinig",
          "besparing_pct": -12.1
        },
        "2022": {
          "gas_kental_m3": 7.041,
          "gas_kental_m3_raw": 7.041,
          "weer_factor_verw": 0.075,
          "elek_kental_kwh": 29.318,
          "elek_kental_kwh_corr": 29.318,
          "weii": 98.1,
          "weii_gas": 68.8,
          "aantal_panden": 6542,
          "gewicht_m2": 21865050,
          "pv_aandeel": 0.361,
          "opwek_kwh": 5.822,
          "eigenverbruik_kwh": 3.53,
          "klasse": "Zuinig",
          "besparing_pct": 2.5
        },
        "2023": {
          "gas_kental_m3": 6.624,
          "gas_kental_m3_raw": 6.624,
          "weer_factor_verw": 0.111,
          "elek_kental_kwh": 28.859,
          "elek_kental_kwh_corr": 28.859,
          "weii": 93.6,
          "weii_gas": 64.7,
          "aantal_panden": 6568,
          "gewicht_m2": 22015850,
          "pv_aandeel": 0.388,
          "opwek_kwh": 5.887,
          "eigenverbruik_kwh": 3.689,
          "klasse": "Zuinig",
          "besparing_pct": 7.0
        },
        "2024": {
          "gas_kental_m3": 5.901,
          "gas_kental_m3_raw": 5.901,
          "weer_factor_verw": 0.126,
          "elek_kental_kwh": 28.601,
          "elek_kental_kwh_corr": 28.601,
          "weii": 86.3,
          "weii_gas": 57.7,
          "aantal_panden": 6682,
          "gewicht_m2": 22589700,
          "pv_aandeel": 0.432,
          "opwek_kwh": 5.784,
          "eigenverbruik_kwh": 3.46,
          "klasse": "Zuinig",
          "besparing_pct": 14.2
        }
      }
    },
    {
      "id": "Bijeenkomst (overig)",
      "label": "Bijeenkomst (overig)",
      "weii_type": "Overig (bijeenkomstfunctie)",
      "sources": ["Bijeenkomstgebouw (niet nader ingedeeld)", "Gebedshuis", "Overig gebouw met maatschappelijke functie", "Overig gebouw met recreatiefunctie"],
      "weer_aandeel": {"gas": 0, "elek": 0},
      "thresholds": [0, 70, 90, 130, 245, 415, null],
      "series": {
        "2020": {
          "gas_kental_m3": 8.669,
          "gas_kental_m3_raw": 8.669,
          "weer_factor_verw": 0.102,
          "elek_kental_kwh": 36.653,
          "elek_kental_kwh_corr": 36.653,
          "weii": 121.3,
          "weii_gas": 84.7,
          "aantal_panden": 14022,
          "gewicht_m2": 10809835,
          "pv_aandeel": 0.112,
          "opwek_kwh": 2.103,
          "eigenverbruik_kwh": 1.696,
          "klasse": "Zuinig",
          "besparing_pct": 0.0
        },
        "2021": {
          "gas_kental_m3": 8.913,
          "gas_kental_m3_raw": 8.913,
          "weer_factor_verw": -0.064,
          "elek_kental_kwh": 35.967,
          "elek_kental_kwh_corr": 35.967,
          "weii": 123.0,
          "weii_gas": 87.1,
          "aantal_panden": 13755,
          "gewicht_m2": 10746395,
          "pv_aandeel": 0.13,
          "opwek_kwh": 2.637,
          "eigenverbruik_kwh": 1.444,
          "klasse": "Zuinig",
          "besparing_pct": -1.4
        },
        "2022": {
          "gas_kental_m3": 7.584,
          "gas_kental_m3_raw": 7.584,
          "weer_factor_verw": 0.075,
          "elek_kental_kwh": 39.309,
          "elek_kental_kwh_corr": 39.309,
          "weii": 113.4,
          "weii_gas": 74.1,
          "aantal_panden": 14052,
          "gewicht_m2": 10900965,
          "pv_aandeel": 0.165,
          "opwek_kwh": 3.912,
          "eigenverbruik_kwh": 2.046,
          "klasse": "Zuinig",
          "besparing_pct": 6.5
        },
        "2023": {
          "gas_kental_m3": 6.851,
          "gas_kental_m3_raw": 6.851,
          "weer_factor_verw": 0.111,
          "elek_kental_kwh": 39.364,
          "elek_kental_kwh_corr": 39.364,
          "weii": 106.3,
          "weii_gas": 66.9,
          "aantal_panden": 13879,
          "gewicht_m2": 10811140,
          "pv_aandeel": 0.206,
          "opwek_kwh": 4.762,
          "eigenverbruik_kwh": 2.675,
          "klasse": "Zuinig",
          "besparing_pct": 12.4
        },
        "2024": {
          "gas_kental_m3": 6.321,
          "gas_kental_m3_raw": 6.321,
          "weer_factor_verw": 0.126,
          "elek_kental_kwh": 40.485,
          "elek_kental_kwh_corr": 40.485,
          "weii": 102.2,
          "weii_gas": 61.8,
          "aantal_panden": 14350,
          "gewicht_m2": 11052520,
          "pv_aandeel": 0.247,
          "opwek_kwh": 5.336,
          "eigenverbruik_kwh": 2.832,
          "klasse": "Zuinig",
          "besparing_pct": 15.7
        }
      }
    },
    {
      "id": "Kantoor",
      "label": "Kantoor",
      "weii_type": "Kantoor",
      "sources": ["Kantoorpand algemeen"],
      "weer_aandeel": {"gas": 0, "elek": 0},
      "thresholds": [0, 70, 100, 150, 230, 330, null],
      "series": {
        "2020": {
          "gas_kental_m3": 7.317,
          "gas_kental_m3_raw": 7.317,
          "weer_factor_verw": 0.102,
          "elek_kental_kwh": 57.203,
          "elek_kental_kwh_corr": 57.203,
          "weii": 128.7,
          "weii_gas": 71.5,
          "aantal_panden": 20777,
          "gewicht_m2": 29155080,
          "pv_aandeel": 0.107,
          "opwek_kwh": 3.156,
          "eigenverbruik_kwh": 1.736,
          "klasse": "Zuinig",
          "besparing_pct": 0.0
        },
        "2021": {
          "gas_kental_m3": 7.939,
          "gas_kental_m3_raw": 7.939,
          "weer_factor_verw": -0.064,
          "elek_kental_kwh": 52.858,
          "elek_kental_kwh_corr": 52.858,
          "weii": 130.4,
          "weii_gas": 77.6,
          "aantal_panden": 20814,
          "gewicht_m2": 29699090,
          "pv_aandeel": 0.132,
          "opwek_kwh": 3.63,
          "eigenverbruik_kwh": 1.668,
          "klasse": "Zuinig",
          "besparing_pct": -1.3
        },
        "2022": {
          "gas_kental_m3": 6.52,
          "gas_kental_m3_raw": 6.52,
          "weer_factor_verw": 0.075,
          "elek_kental_kwh": 53.42,
          "elek_kental_kwh_corr": 53.42,
          "weii": 117.1,
          "weii_gas": 63.7,
          "aantal_panden": 20883,
          "gewicht_m2": 29705620,
          "pv_aandeel": 0.174,
          "opwek_kwh": 5.115,
          "eigenverbruik_kwh": 2.375,
          "klasse": "Zuinig",
          "besparing_pct": 9.0
        },
        "2023": {
          "gas_kental_m3": 5.975,
          "gas_kental_m3_raw": 5.975,
          "weer_factor_verw": 0.111,
          "elek_kental_kwh": 53.018,
          "elek_kental_kwh_corr": 53.018,
          "weii": 111.4,
          "weii_gas": 58.4,
          "aantal_panden": 20471,
          "gewicht_m2": 29287575,
          "pv_aandeel": 0.229,
          "opwek_kwh": 5.896,
          "eigenverbruik_kwh": 3.3,
          "klasse": "Zuinig",
          "besparing_pct": 13.4
        },
        "2024": {
          "gas_kental_m3": 5.354,
          "gas_kental_m3_raw": 5.354,
          "weer_factor_verw": 0.126,
          "elek_kental_kwh": 52.019,
          "elek_kental_kwh_corr": 52.019,
          "weii": 104.3,
          "weii_gas": 52.3,
          "aantal_panden": 21054,
          "gewicht_m2": 29849365,
          "pv_aandeel": 0.272,
          "opwek_kwh": 6.123,
          "eigenverbruik_kwh": 3.031,
          "klasse": "Zuinig",
          "besparing_pct": 19.0
        }
      }
    },
    {
      "id": "Winkel",
      "label": "Winkel",
      "weii_type": "Winkel zonder warenkoeling",
      "sources": ["Winkelpand", "Tuincentrum"],
      "weer_aandeel": {"gas": 0, "elek": 0},
      "thresholds": [0, 80, 100, 165, 290, 520, null],
      "series": {
        "2020": {
          "gas_kental_m3": 5.783,
          "gas_kental_m3_raw": 5.783,
          "weer_factor_verw": 0.102,
          "elek_kental_kwh": 78.289,
          "elek_kental_kwh_corr": 78.289,
          "weii": 134.8,
          "weii_gas": 56.5,
          "aantal_panden": 21381,
          "gewicht_m2": 21252030,
          "pv_aandeel": null,
          "opwek_kwh": null,
          "eigenverbruik_kwh": null,
          "klasse": "Zuinig",
          "besparing_pct": 0.0
        },
        "2021": {
          "gas_kental_m3": 6.247,
          "gas_kental_m3_raw": 6.247,
          "weer_factor_verw": -0.064,
          "elek_kental_kwh": 74.185,
          "elek_kental_kwh_corr": 74.185,
          "weii": 135.2,
          "weii_gas": 61.0,
          "aantal_panden": 21328,
          "gewicht_m2": 21802805,
          "pv_aandeel": null,
          "opwek_kwh": null,
          "eigenverbruik_kwh": null,
          "klasse": "Zuinig",
          "besparing_pct": -0.3
        },
        "2022": {
          "gas_kental_m3": 5.034,
          "gas_kental_m3_raw": 5.034,
          "weer_factor_verw": 0.075,
          "elek_kental_kwh": 74.097,
          "elek_kental_kwh_corr": 74.097,
          "weii": 123.3,
          "weii_gas": 49.2,
          "aantal_panden": 21352,
          "gewicht_m2": 21940055,
          "pv_aandeel": null,
          "opwek_kwh": null,
          "eigenverbruik_kwh": null,
          "klasse": "Zuinig",
          "besparing_pct": 8.5
        },
        "2023": {
          "gas_kental_m3": 4.467,
          "gas_kental_m3_raw": 4.467,
          "weer_factor_verw": 0.111,
          "elek_kental_kwh": 71.803,
          "elek_kental_kwh_corr": 71.803,
          "weii": 115.4,
          "weii_gas": 43.6,
          "aantal_panden": 20862,
          "gewicht_m2": 21733115,
          "pv_aandeel": 0.13,
          "opwek_kwh": 7.82,
          "eigenverbruik_kwh": 3.665,
          "klasse": "Zuinig",
          "besparing_pct": 14.4
        },
        "2024": {
          "gas_kental_m3": 4.027,
          "gas_kental_m3_raw": 4.027,
          "weer_factor_verw": 0.126,
          "elek_kental_kwh": 70.544,
          "elek_kental_kwh_corr": 70.544,
          "weii": 109.9,
          "weii_gas": 39.3,
          "aantal_panden": 21541,
          "gewicht_m2": 22095315,
          "pv_aandeel": 0.15,
          "opwek_kwh": 7.943,
          "eigenverbruik_kwh": 3.563,
          "klasse": "Zuinig",
          "besparing_pct": 18.5
        }
      }
    },
    {
      "id": "Kinderopvang",
      "label": "Kinderopvang",
      "weii_type": "Kinderopvang",
      "sources": ["Kinderopvang (gebouw)"],
      "weer_aandeel": {"gas": 0, "elek": 0},
      "thresholds": [0, 50, 80, 130, 195, 285, null],
      "series": {
        "2020": {
          "gas_kental_m3": 10.236,
          "gas_kental_m3_raw": 10.236,
          "weer_factor_verw": 0.102,
          "elek_kental_kwh": 30.95,
          "elek_kental_kwh_corr": 30.95,
          "weii": 131.0,
          "weii_gas": 100.0,
          "aantal_panden": 1520,
          "gewicht_m2": 1104155,
          "pv_aandeel": null,
          "opwek_kwh": null,
          "eigenverbruik_kwh": null,
          "klasse": "Gemiddeld",
          "besparing_pct": 0.0
        },
        "2021": {
          "gas_kental_m3": 11.603,
          "gas_kental_m3_raw": 11.603,
          "weer_factor_verw": -0.064,
          "elek_kental_kwh": 30.149,
          "elek_kental_kwh_corr": 30.149,
          "weii": 143.5,
          "weii_gas": 113.4,
          "aantal_panden": 1530,
          "gewicht_m2": 1115175,
          "pv_aandeel": 0.105,
          "opwek_kwh": 2.666,
          "eigenverbruik_kwh": 1.32,
          "klasse": "Gemiddeld",
          "besparing_pct": -9.5
        },
        "2022": {
          "gas_kental_m3": 9.838,
          "gas_kental_m3_raw": 9.838,
          "weer_factor_verw": 0.075,
          "elek_kental_kwh": 30.974,
          "elek_kental_kwh_corr": 30.974,
          "weii": 127.1,
          "weii_gas": 96.1,
          "aantal_panden": 1544,
          "gewicht_m2": 1122370,
          "pv_aandeel": 0.126,
          "opwek_kwh": 3.95,
          "eigenverbruik_kwh": 1.92,
          "klasse": "Zuinig",
          "besparing_pct": 3.0
        },
        "2023": {
          "gas_kental_m3": 9.349,
          "gas_kental_m3_raw": 9.349,
          "weer_factor_verw": 0.111,
          "elek_kental_kwh": 30.855,
          "elek_kental_kwh_corr": 30.855,
          "weii": 122.2,
          "weii_gas": 91.3,
          "aantal_panden": 1528,
          "gewicht_m2": 1110565,
          "pv_aandeel": 0.18,
          "opwek_kwh": 4.51,
          "eigenverbruik_kwh": 2.204,
          "klasse": "Zuinig",
          "besparing_pct": 6.7
        },
        "2024": {
          "gas_kental_m3": 8.838,
          "gas_kental_m3_raw": 8.838,
          "weer_factor_verw": 0.126,
          "elek_kental_kwh": 30.494,
          "elek_kental_kwh_corr": 30.494,
          "weii": 116.8,
          "weii_gas": 86.3,
          "aantal_panden": 1567,
          "gewicht_m2": 1144105,
          "pv_aandeel": 0.214,
          "opwek_kwh": 5.577,
          "eigenverbruik_kwh": 2.806,
          "klasse": "Zuinig",
          "besparing_pct": 10.8
        }
      }
    },
    {
      "id": "Onderwijs (mbo/hbo/wo)",
      "label": "Onderwijs (mbo/hbo/wo)",
      "weii_type": "MBO/HBO/Universiteit",
      "sources": ["Campusgebouw", "MBO-gebouw"],
      "weer_aandeel": {"gas": 0, "elek": 0},
      "thresholds": [0, 70, 90, 125, 225, 380, null],
      "series": {
        "2020": {
          "gas_kental_m3": 10.017,
          "gas_kental_m3_raw": 10.017,
          "weer_factor_verw": 0.102,
          "elek_kental_kwh": 77.802,
          "elek_kental_kwh_corr": 77.802,
          "weii": 175.7,
          "weii_gas": 97.9,
          "aantal_panden": 126,
          "gewicht_m2": 1043950,
          "pv_aandeel": 0.229,
          "opwek_kwh": 3.014,
          "eigenverbruik_kwh": 2.586,
          "klasse": "Gemiddeld",
          "besparing_pct": 0.0
        },
        "2021": {
          "gas_kental_m3": 8.483,
          "gas_kental_m3_raw": 8.483,
          "weer_factor_verw": -0.064,
          "elek_kental_kwh": 66.774,
          "elek_kental_kwh_corr": 66.774,
          "weii": 149.6,
          "weii_gas": 82.9,
          "aantal_panden": 121,
          "gewicht_m2": 1008050,
          "pv_aandeel": 0.248,
          "opwek_kwh": 2.541,
          "eigenverbruik_kwh": 2.301,
          "klasse": "Gemiddeld",
          "besparing_pct": 14.9
        },
        "2022": {
          "gas_kental_m3": 7.151,
          "gas_kental_m3_raw": 7.151,
          "weer_factor_verw": 0.075,
          "elek_kental_kwh": 70.371,
          "elek_kental_kwh_corr": 70.371,
          "weii": 140.2,
          "weii_gas": 69.9,
          "aantal_panden": 125,
          "gewicht_m2": 1037300,
          "pv_aandeel": 0.275,
          "opwek_kwh": 2.988,
          "eigenverbruik_kwh": 2.59,
          "klasse": "Gemiddeld",
          "besparing_pct": 20.2
        },
        "2023": {
          "gas_kental_m3": 7.595,
          "gas_kental_m3_raw": 7.595,
          "weer_factor_verw": 0.111,
          "elek_kental_kwh": 76.899,
          "elek_kental_kwh_corr": 76.899,
          "weii": 151.1,
          "weii_gas": 74.2,
          "aantal_panden": 130,
          "gewicht_m2": 1055800,
          "pv_aandeel": 0.281,
          "opwek_kwh": 3.487,
          "eigenverbruik_kwh": 3.161,
          "klasse": "Gemiddeld",
          "besparing_pct": 14.0
        },
        "2024": {
          "gas_kental_m3": 6.005,
          "gas_kental_m3_raw": 6.005,
          "weer_factor_verw": 0.126,
          "elek_kental_kwh": 72.312,
          "elek_kental_kwh_corr": 72.312,
          "weii": 131.0,
          "weii_gas": 58.7,
          "aantal_panden": 131,
          "gewicht_m2": 1052550,
          "pv_aandeel": 0.374,
          "opwek_kwh": 2.948,
          "eigenverbruik_kwh": 2.584,
          "klasse": "Gemiddeld",
          "besparing_pct": 25.4
        }
      }
    },
    {
      "id": "Zorg met overnachting",
      "label": "Zorg met overnachting",
      "weii_type": "Tehuis met overnachting",
      "sources": ["Woonzorgcomplex", "Zorg met bed"],
      "weer_aandeel": {"gas": 0, "elek": 0},
      "thresholds": [0, 80, 115, 160, 285, 455, null],
      "series": {
        "2020": {
          "gas_kental_m3": 12.589,
          "gas_kental_m3_raw": 12.589,
          "weer_factor_verw": 0.102,
          "elek_kental_kwh": 54.881,
          "elek_kental_kwh_corr": 54.881,
          "weii": 177.9,
          "weii_gas": 123.0,
          "aantal_panden": 1920,
          "gewicht_m2": 6212500,
          "pv_aandeel": 0.143,
          "opwek_kwh": 2.193,
          "eigenverbruik_kwh": 1.83,
          "klasse": "Gemiddeld",
          "besparing_pct": 0.0
        },
        "2021": {
          "gas_kental_m3": 14.995,
          "gas_kental_m3_raw": 14.995,
          "weer_factor_verw": -0.064,
          "elek_kental_kwh": 58.464,
          "elek_kental_kwh_corr": 58.464,
          "weii": 205.0,
          "weii_gas": 146.5,
          "aantal_panden": 1959,
          "gewicht_m2": 5849645,
          "pv_aandeel": 0.177,
          "opwek_kwh": 2.882,
          "eigenverbruik_kwh": 2.09,
          "klasse": "Gemiddeld",
          "besparing_pct": -15.2
        },
        "2022": {
          "gas_kental_m3": 12.606,
          "gas_kental_m3_raw": 12.606,
          "weer_factor_verw": 0.075,
          "elek_kental_kwh": 56.754,
          "elek_kental_kwh_corr": 56.754,
          "weii": 179.9,
          "weii_gas": 123.2,
          "aantal_panden": 2026,
          "gewicht_m2": 6001175,
          "pv_aandeel": 0.227,
          "opwek_kwh": 4.252,
          "eigenverbruik_kwh": 3.019,
          "klasse": "Gemiddeld",
          "besparing_pct": -1.1
        },
        "2023": {
          "gas_kental_m3": 12.225,
          "gas_kental_m3_raw": 12.225,
          "weer_factor_verw": 0.111,
          "elek_kental_kwh": 55.339,
          "elek_kental_kwh_corr": 55.339,
          "weii": 174.8,
          "weii_gas": 119.4,
          "aantal_panden": 2051,
          "gewicht_m2": 6083170,
          "pv_aandeel": 0.265,
          "opwek_kwh": 4.148,
          "eigenverbruik_kwh": 2.951,
          "klasse": "Gemiddeld",
          "besparing_pct": 1.7
        },
        "2024": {
          "gas_kental_m3": 11.089,
          "gas_kental_m3_raw": 11.089,
          "weer_factor_verw": 0.126,
          "elek_kental_kwh": 54.623,
          "elek_kental_kwh_corr": 54.623,
          "weii": 163.0,
          "weii_gas": 108.3,
          "aantal_panden": 2107,
          "gewicht_m2": 6135580,
          "pv_aandeel": 0.313,
          "opwek_kwh": 4.27,
          "eigenverbruik_kwh": 3.034,
          "klasse": "Gemiddeld",
          "besparing_pct": 8.4
        }
      }
    },
    {
      "id": "Hotel",
      "label": "Hotel",
      "weii_type": "Hotel",
      "sources": ["Hotel (of ander groot logiesgebouw)"],
      "weer_aandeel": {"gas": 0, "elek": 0},
      "thresholds": [0, 110, 140, 210, 375, 640, null],
      "series": {
        "2020": {
          "gas_kental_m3": 11.105,
          "gas_kental_m3_raw": 11.105,
          "weer_factor_verw": 0.102,
          "elek_kental_kwh": 72.939,
          "elek_kental_kwh_corr": 72.939,
          "weii": 181.4,
          "weii_gas": 108.5,
          "aantal_panden": 2440,
          "gewicht_m2": 6226595,
          "pv_aandeel": null,
          "opwek_kwh": null,
          "eigenverbruik_kwh": null,
          "klasse": "Zuinig",
          "besparing_pct": 0.0
        },
        "2021": {
          "gas_kental_m3": 10.823,
          "gas_kental_m3_raw": 10.823,
          "weer_factor_verw": -0.064,
          "elek_kental_kwh": 68.646,
          "elek_kental_kwh_corr": 68.646,
          "weii": 174.4,
          "weii_gas": 105.7,
          "aantal_panden": 2439,
          "gewicht_m2": 6406975,
          "pv_aandeel": 0.101,
          "opwek_kwh": 1.806,
          "eigenverbruik_kwh": 1.199,
          "klasse": "Zuinig",
          "besparing_pct": 3.9
        },
        "2022": {
          "gas_kental_m3": 9.901,
          "gas_kental_m3_raw": 9.901,
          "weer_factor_verw": 0.075,
          "elek_kental_kwh": 75.472,
          "elek_kental_kwh_corr": 75.472,
          "weii": 172.2,
          "weii_gas": 96.7,
          "aantal_panden": 2495,
          "gewicht_m2": 6468700,
          "pv_aandeel": 0.138,
          "opwek_kwh": 2.597,
          "eigenverbruik_kwh": 1.256,
          "klasse": "Zuinig",
          "besparing_pct": 5.1
        },
        "2023": {
          "gas_kental_m3": 9.868,
          "gas_kental_m3_raw": 9.868,
          "weer_factor_verw": 0.111,
          "elek_kental_kwh": 75.701,
          "elek_kental_kwh_corr": 75.701,
          "weii": 172.1,
          "weii_gas": 96.4,
          "aantal_panden": 2499,
          "gewicht_m2": 6542550,
          "pv_aandeel": 0.18,
          "opwek_kwh": 2.041,
          "eigenverbruik_kwh": 1.49,
          "klasse": "Zuinig",
          "besparing_pct": 5.1
        },
        "2024": {
          "gas_kental_m3": 9.057,
          "gas_kental_m3_raw": 9.057,
          "weer_factor_verw": 0.126,
          "elek_kental_kwh": 76.255,
          "elek_kental_kwh_corr": 76.255,
          "weii": 164.7,
          "weii_gas": 88.5,
          "aantal_panden": 2600,
          "gewicht_m2": 6706375,
          "pv_aandeel": 0.214,
          "opwek_kwh": 2.925,
          "eigenverbruik_kwh": 1.604,
          "klasse": "Zuinig",
          "besparing_pct": 9.2
        }
      }
    },
    {
      "id": "Koel/vrieshuis",
      "label": "Koel/vrieshuis",
      "weii_type": "Koel/vrieshuis",
      "sources": ["Koelhuis"],
      "weer_aandeel": {"gas": 0, "elek": 0},
      "thresholds": [0, 15, 35, 80, 165, 275, null],
      "series": {
        "2020": {
          "gas_kental_m3": 3.188,
          "gas_kental_m3_raw": 3.188,
          "weer_factor_verw": 0.102,
          "elek_kental_kwh": 239.751,
          "elek_kental_kwh_corr": 239.751,
          "weii": 270.9,
          "weii_gas": 31.1,
          "aantal_panden": 96,
          "gewicht_m2": 1023750,
          "pv_aandeel": 0.271,
          "opwek_kwh": 13.748,
          "eigenverbruik_kwh": 10.634,
          "klasse": "Onzuinig",
          "besparing_pct": 0.0
        },
        "2021": {
          "gas_kental_m3": 3.821,
          "gas_kental_m3_raw": 3.821,
          "weer_factor_verw": -0.064,
          "elek_kental_kwh": 238.562,
          "elek_kental_kwh_corr": 238.562,
          "weii": 275.9,
          "weii_gas": 37.3,
          "aantal_panden": 95,
          "gewicht_m2": 1029000,
          "pv_aandeel": 0.337,
          "opwek_kwh": 21.716,
          "eigenverbruik_kwh": 12.45,
          "klasse": "Zeer onzuinig",
          "besparing_pct": -1.8
        },
        "2022": {
          "gas_kental_m3": 3.43,
          "gas_kental_m3_raw": 3.43,
          "weer_factor_verw": 0.075,
          "elek_kental_kwh": 235.382,
          "elek_kental_kwh_corr": 235.382,
          "weii": 268.9,
          "weii_gas": 33.5,
          "aantal_panden": 95,
          "gewicht_m2": 1026750,
          "pv_aandeel": 0.347,
          "opwek_kwh": 24.004,
          "eigenverbruik_kwh": 12.838,
          "klasse": "Onzuinig",
          "besparing_pct": 0.7
        },
        "2023": {
          "gas_kental_m3": 3.057,
          "gas_kental_m3_raw": 3.057,
          "weer_factor_verw": 0.111,
          "elek_kental_kwh": 227.546,
          "elek_kental_kwh_corr": 227.546,
          "weii": 257.4,
          "weii_gas": 29.9,
          "aantal_panden": 93,
          "gewicht_m2": 999250,
          "pv_aandeel": 0.376,
          "opwek_kwh": 25.208,
          "eigenverbruik_kwh": 16.156,
          "klasse": "Onzuinig",
          "besparing_pct": 5.0
        },
        "2024": {
          "gas_kental_m3": 2.087,
          "gas_kental_m3_raw": 2.087,
          "weer_factor_verw": 0.126,
          "elek_kental_kwh": 226.067,
          "elek_kental_kwh_corr": 226.067,
          "weii": 246.5,
          "weii_gas": 20.4,
          "aantal_panden": 95,
          "gewicht_m2": 1029000,
          "pv_aandeel": 0.432,
          "opwek_kwh": 29.735,
          "eigenverbruik_kwh": 16.786,
          "klasse": "Onzuinig",
          "besparing_pct": 9.0
        }
      }
    },
    {
      "id": "Cellengebouw",
      "label": "Cellengebouw",
      "weii_type": "Cellengebouw",
      "sources": ["Penitentiaire inrichting"],
      "weer_aandeel": {"gas": 0, "elek": 0},
      "thresholds": [0, 100, 130, 200, 340, 590, null],
      "series": {
        "2020": {
          "gas_kental_m3": 16.753,
          "gas_kental_m3_raw": 16.753,
          "weer_factor_verw": 0.102,
          "elek_kental_kwh": 104.474,
          "elek_kental_kwh_corr": 104.474,
          "weii": 268.2,
          "weii_gas": 163.7,
          "aantal_panden": 25,
          "gewicht_m2": 25000,
          "pv_aandeel": null,
          "opwek_kwh": null,
          "eigenverbruik_kwh": null,
          "klasse": "Gemiddeld",
          "besparing_pct": 0.0
        },
        "2021": {
          "gas_kental_m3": 23.914,
          "gas_kental_m3_raw": 23.914,
          "weer_factor_verw": -0.064,
          "elek_kental_kwh": 131.076,
          "elek_kental_kwh_corr": 131.076,
          "weii": 364.7,
          "weii_gas": 233.6,
          "aantal_panden": 24,
          "gewicht_m2": 24000,
          "pv_aandeel": null,
          "opwek_kwh": null,
          "eigenverbruik_kwh": null,
          "klasse": "Onzuinig",
          "besparing_pct": -36.0
        },
        "2022": {
          "gas_kental_m3": 20.58,
          "gas_kental_m3_raw": 20.58,
          "weer_factor_verw": 0.075,
          "elek_kental_kwh": 127.803,
          "elek_kental_kwh_corr": 127.803,
          "weii": 328.9,
          "weii_gas": 201.1,
          "aantal_panden": 25,
          "gewicht_m2": 25000,
          "pv_aandeel": null,
          "opwek_kwh": null,
          "eigenverbruik_kwh": null,
          "klasse": "Gemiddeld",
          "besparing_pct": -22.6
        },
        "2023": {
          "gas_kental_m3": 19.282,
          "gas_kental_m3_raw": 19.282,
          "weer_factor_verw": 0.111,
          "elek_kental_kwh": 125.107,
          "elek_kental_kwh_corr": 125.107,
          "weii": 313.5,
          "weii_gas": 188.4,
          "aantal_panden": 25,
          "gewicht_m2": 25000,
          "pv_aandeel": null,
          "opwek_kwh": null,
          "eigenverbruik_kwh": null,
          "klasse": "Gemiddeld",
          "besparing_pct": -16.9
        },
        "2024": {
          "gas_kental_m3": 16.701,
          "gas_kental_m3_raw": 16.701,
          "weer_factor_verw": 0.126,
          "elek_kental_kwh": 126.801,
          "elek_kental_kwh_corr": 126.801,
          "weii": 290.0,
          "weii_gas": 163.2,
          "aantal_panden": 25,
          "gewicht_m2": 25000,
          "pv_aandeel": null,
          "opwek_kwh": null,
          "eigenverbruik_kwh": null,
          "klasse": "Gemiddeld",
          "besparing_pct": -8.1
        }
      }
    },
    {
      "id": "Restaurant/café",
      "label": "Restaurant/café",
      "weii_type": "Restaurant",
      "sources": ["Restaurant of cafégebouw"],
      "weer_aandeel": {"gas": 0, "elek": 0},
      "thresholds": [0, 200, 270, 415, 695, 1075, null],
      "series": {
        "2020": {
          "gas_kental_m3": 20.069,
          "gas_kental_m3_raw": 20.069,
          "weer_factor_verw": 0.102,
          "elek_kental_kwh": 170.071,
          "elek_kental_kwh_corr": 170.071,
          "weii": 366.1,
          "weii_gas": 196.1,
          "aantal_panden": 3876,
          "gewicht_m2": 1614685,
          "pv_aandeel": null,
          "opwek_kwh": null,
          "eigenverbruik_kwh": null,
          "klasse": "Zuinig",
          "besparing_pct": 0.0
        },
        "2021": {
          "gas_kental_m3": 19.138,
          "gas_kental_m3_raw": 19.138,
          "weer_factor_verw": -0.064,
          "elek_kental_kwh": 164.399,
          "elek_kental_kwh_corr": 164.399,
          "weii": 351.4,
          "weii_gas": 187.0,
          "aantal_panden": 3882,
          "gewicht_m2": 1612955,
          "pv_aandeel": null,
          "opwek_kwh": null,
          "eigenverbruik_kwh": null,
          "klasse": "Zuinig",
          "besparing_pct": 4.0
        },
        "2022": {
          "gas_kental_m3": 17.704,
          "gas_kental_m3_raw": 17.704,
          "weer_factor_verw": 0.075,
          "elek_kental_kwh": 187.166,
          "elek_kental_kwh_corr": 187.166,
          "weii": 360.1,
          "weii_gas": 173.0,
          "aantal_panden": 3917,
          "gewicht_m2": 1630335,
          "pv_aandeel": null,
          "opwek_kwh": null,
          "eigenverbruik_kwh": null,
          "klasse": "Zuinig",
          "besparing_pct": 1.6
        },
        "2023": {
          "gas_kental_m3": 17.492,
          "gas_kental_m3_raw": 17.492,
          "weer_factor_verw": 0.111,
          "elek_kental_kwh": 188.162,
          "elek_kental_kwh_corr": 188.162,
          "weii": 359.1,
          "weii_gas": 170.9,
          "aantal_panden": 3837,
          "gewicht_m2": 1615840,
          "pv_aandeel": null,
          "opwek_kwh": null,
          "eigenverbruik_kwh": null,
          "klasse": "Zuinig",
          "besparing_pct": 1.9
        },
        "2024": {
          "gas_kental_m3": 15.752,
          "gas_kental_m3_raw": 15.752,
          "weer_factor_verw": 0.126,
          "elek_kental_kwh": 184.683,
          "elek_kental_kwh_corr": 184.683,
          "weii": 338.6,
          "weii_gas": 153.9,
          "aantal_panden": 3939,
          "gewicht_m2": 1674830,
          "pv_aandeel": null,
          "opwek_kwh": null,
          "eigenverbruik_kwh": null,
          "klasse": "Zuinig",
          "besparing_pct": 7.5
        }
      }
    },
    {
      "id": "Zwembad",
      "label": "Zwembad",
      "weii_type": "Zwembad",
      "sources": ["Zwembad"],
      "weer_aandeel": {"gas": 0, "elek": 0},
      "thresholds": [0, 210, 300, 430, 765, 1365, null],
      "series": {
        "2020": {
          "gas_kental_m3": 32.887,
          "gas_kental_m3_raw": 32.887,
          "weer_factor_verw": 0.102,
          "elek_kental_kwh": 115.932,
          "elek_kental_kwh_corr": 115.932,
          "weii": 437.2,
          "weii_gas": 321.3,
          "aantal_panden": 478,
          "gewicht_m2": 1374140,
          "pv_aandeel": 0.232,
          "opwek_kwh": 6.605,
          "eigenverbruik_kwh": 4.885,
          "klasse": "Gemiddeld",
          "besparing_pct": 0.0
        },
        "2021": {
          "gas_kental_m3": 36.647,
          "gas_kental_m3_raw": 36.647,
          "weer_factor_verw": -0.064,
          "elek_kental_kwh": 115.138,
          "elek_kental_kwh_corr": 115.138,
          "weii": 473.2,
          "weii_gas": 358.0,
          "aantal_panden": 482,
          "gewicht_m2": 1379160,
          "pv_aandeel": 0.249,
          "opwek_kwh": 7.153,
          "eigenverbruik_kwh": 5.691,
          "klasse": "Gemiddeld",
          "besparing_pct": -8.2
        },
        "2022": {
          "gas_kental_m3": 35.156,
          "gas_kental_m3_raw": 35.156,
          "weer_factor_verw": 0.075,
          "elek_kental_kwh": 125.576,
          "elek_kental_kwh_corr": 125.576,
          "weii": 469.1,
          "weii_gas": 343.5,
          "aantal_panden": 491,
          "gewicht_m2": 1422075,
          "pv_aandeel": 0.287,
          "opwek_kwh": 9.589,
          "eigenverbruik_kwh": 7.602,
          "klasse": "Gemiddeld",
          "besparing_pct": -7.3
        },
        "2023": {
          "gas_kental_m3": 35.48,
          "gas_kental_m3_raw": 35.48,
          "weer_factor_verw": 0.111,
          "elek_kental_kwh": 123.175,
          "elek_kental_kwh_corr": 123.175,
          "weii": 469.8,
          "weii_gas": 346.6,
          "aantal_panden": 487,
          "gewicht_m2": 1406490,
          "pv_aandeel": 0.329,
          "opwek_kwh": 9.826,
          "eigenverbruik_kwh": 7.791,
          "klasse": "Gemiddeld",
          "besparing_pct": -7.5
        },
        "2024": {
          "gas_kental_m3": 32.08,
          "gas_kental_m3_raw": 32.08,
          "weer_factor_verw": 0.126,
          "elek_kental_kwh": 124.474,
          "elek_kental_kwh_corr": 124.474,
          "weii": 437.9,
          "weii_gas": 313.4,
          "aantal_panden": 502,
          "gewicht_m2": 1457645,
          "pv_aandeel": 0.394,
          "opwek_kwh": 10.067,
          "eigenverbruik_kwh": 7.856,
          "klasse": "Gemiddeld",
          "besparing_pct": -0.2
        }
      }
    },
    {
      "id": "Ziekenhuis",
      "label": "Ziekenhuis",
      "weii_type": "Ziekenhuis",
      "sources": ["Ziekenhuis"],
      "weer_aandeel": {"gas": 0, "elek": 0},
      "thresholds": [0, 100, 135, 185, 315, 500, null],
      "series": {
        "2020": {
          "gas_kental_m3": 27.409,
          "gas_kental_m3_raw": 27.409,
          "weer_factor_verw": 0.102,
          "elek_kental_kwh": 224.23,
          "elek_kental_kwh_corr": 224.23,
          "weii": 492.0,
          "weii_gas": 267.8,
          "aantal_panden": 116,
          "gewicht_m2": 1031800,
          "pv_aandeel": 0.181,
          "opwek_kwh": null,
          "eigenverbruik_kwh": null,
          "klasse": "Onzuinig",
          "besparing_pct": 0.0
        },
        "2021": {
          "gas_kental_m3": 55.569,
          "gas_kental_m3_raw": 55.569,
          "weer_factor_verw": -0.064,
          "elek_kental_kwh": 389.22,
          "elek_kental_kwh_corr": 389.22,
          "weii": 932.1,
          "weii_gas": 542.9,
          "aantal_panden": 111,
          "gewicht_m2": 691250,
          "pv_aandeel": 0.171,
          "opwek_kwh": null,
          "eigenverbruik_kwh": null,
          "klasse": "Zeer onzuinig",
          "besparing_pct": -89.5
        },
        "2022": {
          "gas_kental_m3": 44.818,
          "gas_kental_m3_raw": 44.818,
          "weer_factor_verw": 0.075,
          "elek_kental_kwh": 362.997,
          "elek_kental_kwh_corr": 362.997,
          "weii": 800.9,
          "weii_gas": 437.9,
          "aantal_panden": 113,
          "gewicht_m2": 690300,
          "pv_aandeel": 0.204,
          "opwek_kwh": null,
          "eigenverbruik_kwh": null,
          "klasse": "Zeer onzuinig",
          "besparing_pct": -62.8
        },
        "2023": {
          "gas_kental_m3": 47.348,
          "gas_kental_m3_raw": 47.348,
          "weer_factor_verw": 0.111,
          "elek_kental_kwh": 351.72,
          "elek_kental_kwh_corr": 351.72,
          "weii": 814.3,
          "weii_gas": 462.6,
          "aantal_panden": 114,
          "gewicht_m2": 723250,
          "pv_aandeel": 0.211,
          "opwek_kwh": null,
          "eigenverbruik_kwh": null,
          "klasse": "Zeer onzuinig",
          "besparing_pct": -65.5
        },
        "2024": {
          "gas_kental_m3": 45.171,
          "gas_kental_m3_raw": 45.171,
          "weer_factor_verw": 0.126,
          "elek_kental_kwh": 361.273,
          "elek_kental_kwh_corr": 361.273,
          "weii": 802.6,
          "weii_gas": 441.3,
          "aantal_panden": 117,
          "gewicht_m2": 750300,
          "pv_aandeel": 0.274,
          "opwek_kwh": null,
          "eigenverbruik_kwh": null,
          "klasse": "Zeer onzuinig",
          "besparing_pct": -63.1
        }
      }
    }
  ],
  "pp_pathway": {
    "Kantoor": {"2020": 173.57, "2025": 150, "2030": 100, "2040": 70, "2050": 70},
    "Onderwijs (po/vo)": {"2020": 161.55, "2025": 120, "2030": 85, "2040": 60, "2050": 60},
    "Onderwijs (mbo/hbo/wo)": {"2020": 170.81, "2025": 125, "2030": 90, "2040": 70, "2050": 70},
    "Kinderopvang": {"2020": 157.54, "2025": 130, "2030": 80, "2040": 50, "2050": 50},
    "Ziekenhuis": {"2020": 247.46, "2025": 185, "2030": 135, "2040": 100, "2050": 100},
    "Zorg met overnachting": {"2020": 190, "2025": 160, "2030": 115, "2040": 80, "2050": 80},
    "Winkel": {"2020": 150.71, "2025": 156.43, "2030": 100, "2040": 80, "2050": 80},
    "Restaurant/café": {"2020": 605.07, "2025": 415, "2030": 270, "2040": 200, "2050": 200},
    "Hotel": {"2020": 274.29, "2025": 210, "2030": 140, "2040": 110, "2050": 110},
    "Bedrijfshal": {"2020": 55, "2025": 20, "2030": -10, "2040": -25, "2050": -25},
    "Koel/vrieshuis": {"2020": 144, "2025": 80, "2030": 35, "2040": 15, "2050": 15},
    "Cellengebouw": {"2020": 295.14, "2025": 200, "2030": 130, "2040": 100, "2050": 100},
    "Zwembad": {"2020": 567.36, "2025": 430, "2030": 300, "2040": 210, "2050": 210},
    "Bijeenkomst (overig)": {"2020": 208.64, "2025": 130, "2030": 90, "2040": 70, "2050": 70},
    "Café": {"2020": 215, "2025": 140, "2030": 90, "2040": 70, "2050": 70},
    "Sauna": {"2020": 420.31, "2025": 300, "2030": 200, "2040": 160, "2050": 160},
    "Medische (groeps) praktijk": {"2020": 203.16, "2025": 150, "2030": 110, "2040": 80, "2050": 80},
    "Opvang zonder overnachting": {"2020": 229.17, "2025": 170, "2030": 115, "2040": 90, "2050": 90},
    "Garage/showroom": {"2020": 180, "2025": 140, "2030": 90, "2040": 70, "2050": 70},
    "Vakantiepark": {"2020": 196.1, "2025": 140, "2030": 90, "2040": 70, "2050": 70},
    "Sportaccommodatie binnen": {"2020": 191.2, "2025": 140, "2030": 90, "2040": 70, "2050": 70},
    "Sportaccommodatie buiten": {"2020": 213.71, "2025": 160, "2030": 95, "2040": 80, "2050": 80},
    "Winkel met warenkoeling": {"2020": 342.86, "2025": 300, "2030": 175, "2040": 150, "2050": 150},
    "Grondgebonden woningen": {"2020": 131, "2025": 90, "2030": 55, "2040": 35, "2050": 35},
    "Appartementen": {"2020": 141, "2025": 100, "2030": 65, "2040": 45, "2050": 45}
  },
  "crrem_pathway": {
    "Kantoor": {
      "type": "OFF",
      "type_label": "Office",
      "approx": false,
      "kwh": {
        "2020": 183.0,
        "2021": 173.25,
        "2022": 164.01,
        "2023": 155.27,
        "2024": 146.99,
        "2025": 139.16,
        "2026": 131.74,
        "2027": 124.72,
        "2028": 118.07,
        "2029": 111.78,
        "2030": 105.82,
        "2031": 100.18,
        "2032": 94.84,
        "2033": 89.79,
        "2034": 85.0,
        "2035": 85,
        "2036": 85,
        "2037": 85,
        "2038": 85,
        "2039": 85,
        "2040": 85,
        "2041": 85,
        "2042": 85,
        "2043": 85,
        "2044": 85,
        "2045": 85,
        "2046": 85,
        "2047": 85,
        "2048": 85,
        "2049": 85,
        "2050": 85
      },
      "co2": {
        "2020": 57.498,
        "2021": 53.664,
        "2022": 49.224,
        "2023": 44.97,
        "2024": 40.914,
        "2025": 37.206,
        "2026": 33.429,
        "2027": 30.0,
        "2028": 26.778,
        "2029": 23.759,
        "2030": 20.844,
        "2031": 18.387,
        "2032": 16.007,
        "2033": 13.791,
        "2034": 11.73,
        "2035": 9.823,
        "2036": 8.039,
        "2037": 6.406,
        "2038": 5.025,
        "2039": 3.923,
        "2040": 3.044,
        "2041": 2.554,
        "2042": 2.185,
        "2043": 1.863,
        "2044": 1.585,
        "2045": 1.327,
        "2046": 1.142,
        "2047": 0.965,
        "2048": 0.811,
        "2049": 0.67,
        "2050": 0.536
      }
    },
    "Ziekenhuis": {
      "type": "HEC",
      "type_label": "Healthcare",
      "approx": false,
      "kwh": {
        "2020": 230.52,
        "2021": 218.65,
        "2022": 207.4,
        "2023": 196.72,
        "2024": 186.6,
        "2025": 176.99,
        "2026": 167.88,
        "2027": 159.24,
        "2028": 151.04,
        "2029": 143.27,
        "2030": 135.89,
        "2031": 128.9,
        "2032": 122.26,
        "2033": 115.97,
        "2034": 110.0,
        "2035": 110,
        "2036": 110,
        "2037": 110,
        "2038": 110,
        "2039": 110,
        "2040": 110,
        "2041": 110,
        "2042": 110,
        "2043": 110,
        "2044": 110,
        "2045": 110,
        "2046": 110,
        "2047": 110,
        "2048": 110,
        "2049": 110,
        "2050": 110
      },
      "co2": {
        "2020": 68.548,
        "2021": 63.983,
        "2022": 58.696,
        "2023": 53.629,
        "2024": 48.8,
        "2025": 44.384,
        "2026": 39.886,
        "2027": 35.803,
        "2028": 31.966,
        "2029": 28.37,
        "2030": 24.899,
        "2031": 21.973,
        "2032": 19.14,
        "2033": 16.501,
        "2034": 14.047,
        "2035": 11.775,
        "2036": 9.651,
        "2037": 7.706,
        "2038": 6.061,
        "2039": 4.749,
        "2040": 3.702,
        "2041": 3.119,
        "2042": 2.68,
        "2043": 2.296,
        "2044": 1.965,
        "2045": 1.658,
        "2046": 1.437,
        "2047": 1.227,
        "2048": 1.043,
        "2049": 0.875,
        "2050": 0.716
      }
    },
    "Hotel": {
      "type": "HOT",
      "type_label": "Hotel",
      "approx": false,
      "kwh": {
        "2020": 300.0,
        "2021": 279.2,
        "2022": 259.83,
        "2023": 241.82,
        "2024": 225.05,
        "2025": 209.44,
        "2026": 194.92,
        "2027": 181.4,
        "2028": 168.82,
        "2029": 157.11,
        "2030": 146.22,
        "2031": 136.08,
        "2032": 126.64,
        "2033": 117.86,
        "2034": 109.69,
        "2035": 102.08,
        "2036": 95.0,
        "2037": 95,
        "2038": 95,
        "2039": 95,
        "2040": 95,
        "2041": 95,
        "2042": 95,
        "2043": 95,
        "2044": 95,
        "2045": 95,
        "2046": 95,
        "2047": 95,
        "2048": 95,
        "2049": 95,
        "2050": 95
      },
      "co2": {
        "2020": 100.727,
        "2021": 93.987,
        "2022": 86.184,
        "2023": 78.705,
        "2024": 71.576,
        "2025": 65.057,
        "2026": 58.418,
        "2027": 52.391,
        "2028": 46.728,
        "2029": 41.42,
        "2030": 36.296,
        "2031": 31.977,
        "2032": 27.794,
        "2033": 23.899,
        "2034": 20.276,
        "2035": 16.924,
        "2036": 13.788,
        "2037": 10.917,
        "2038": 8.488,
        "2039": 6.552,
        "2040": 5.006,
        "2041": 4.146,
        "2042": 3.497,
        "2043": 2.932,
        "2044": 2.442,
        "2045": 1.989,
        "2046": 1.663,
        "2047": 1.353,
        "2048": 1.081,
        "2049": 0.833,
        "2050": 0.599
      }
    },
    "Koel/vrieshuis": {
      "type": "DWC",
      "type_label": "Distribution warehouse (cold)",
      "approx": false,
      "kwh": {
        "2020": 132.0,
        "2021": 125.0,
        "2022": 118.37,
        "2023": 112.09,
        "2024": 106.15,
        "2025": 100.52,
        "2026": 95.19,
        "2027": 90.14,
        "2028": 85.36,
        "2029": 80.83,
        "2030": 76.54,
        "2031": 72.48,
        "2032": 68.64,
        "2033": 65.0,
        "2034": 65,
        "2035": 65,
        "2036": 65,
        "2037": 65,
        "2038": 65,
        "2039": 65,
        "2040": 65,
        "2041": 65,
        "2042": 65,
        "2043": 65,
        "2044": 65,
        "2045": 65,
        "2046": 65,
        "2047": 65,
        "2048": 65,
        "2049": 65,
        "2050": 65
      },
      "co2": {
        "2020": 42.955,
        "2021": 40.287,
        "2022": 37.129,
        "2023": 34.078,
        "2024": 31.145,
        "2025": 28.449,
        "2026": 25.668,
        "2027": 23.128,
        "2028": 20.723,
        "2029": 18.45,
        "2030": 16.235,
        "2031": 14.36,
        "2032": 12.527,
        "2033": 10.804,
        "2034": 9.187,
        "2035": 7.678,
        "2036": 6.252,
        "2037": 4.934,
        "2038": 3.811,
        "2039": 2.909,
        "2040": 2.185,
        "2041": 1.784,
        "2042": 1.481,
        "2043": 1.215,
        "2044": 0.983,
        "2045": 0.766,
        "2046": 0.611,
        "2047": 0.461,
        "2048": 0.329,
        "2049": 0.207,
        "2050": 0.09
      }
    },
    "Zorg met overnachting": {
      "type": "HEC",
      "type_label": "Healthcare",
      "approx": true,
      "kwh": {
        "2020": 230.52,
        "2021": 218.65,
        "2022": 207.4,
        "2023": 196.72,
        "2024": 186.6,
        "2025": 176.99,
        "2026": 167.88,
        "2027": 159.24,
        "2028": 151.04,
        "2029": 143.27,
        "2030": 135.89,
        "2031": 128.9,
        "2032": 122.26,
        "2033": 115.97,
        "2034": 110.0,
        "2035": 110,
        "2036": 110,
        "2037": 110,
        "2038": 110,
        "2039": 110,
        "2040": 110,
        "2041": 110,
        "2042": 110,
        "2043": 110,
        "2044": 110,
        "2045": 110,
        "2046": 110,
        "2047": 110,
        "2048": 110,
        "2049": 110,
        "2050": 110
      },
      "co2": {
        "2020": 68.548,
        "2021": 63.983,
        "2022": 58.696,
        "2023": 53.629,
        "2024": 48.8,
        "2025": 44.384,
        "2026": 39.886,
        "2027": 35.803,
        "2028": 31.966,
        "2029": 28.37,
        "2030": 24.899,
        "2031": 21.973,
        "2032": 19.14,
        "2033": 16.501,
        "2034": 14.047,
        "2035": 11.775,
        "2036": 9.651,
        "2037": 7.706,
        "2038": 6.061,
        "2039": 4.749,
        "2040": 3.702,
        "2041": 3.119,
        "2042": 2.68,
        "2043": 2.296,
        "2044": 1.965,
        "2045": 1.658,
        "2046": 1.437,
        "2047": 1.227,
        "2048": 1.043,
        "2049": 0.875,
        "2050": 0.716
      }
    },
    "Winkel": {
      "type": "RHS",
      "type_label": "Retail high street",
      "approx": true,
      "kwh": {
        "2020": 263.0,
        "2021": 248.15,
        "2022": 234.14,
        "2023": 220.92,
        "2024": 208.45,
        "2025": 196.68,
        "2026": 185.58,
        "2027": 175.1,
        "2028": 165.22,
        "2029": 155.89,
        "2030": 147.09,
        "2031": 138.79,
        "2032": 130.95,
        "2033": 123.56,
        "2034": 116.58,
        "2035": 110.0,
        "2036": 110,
        "2037": 110,
        "2038": 110,
        "2039": 110,
        "2040": 110,
        "2041": 110,
        "2042": 110,
        "2043": 110,
        "2044": 110,
        "2045": 110,
        "2046": 110,
        "2047": 110,
        "2048": 110,
        "2049": 110,
        "2050": 110
      },
      "co2": {
        "2020": 83.518,
        "2021": 77.943,
        "2022": 71.488,
        "2023": 65.302,
        "2024": 59.405,
        "2025": 54.013,
        "2026": 48.521,
        "2027": 43.535,
        "2028": 38.85,
        "2029": 34.46,
        "2030": 30.221,
        "2031": 26.649,
        "2032": 23.189,
        "2033": 19.966,
        "2034": 16.97,
        "2035": 14.197,
        "2036": 11.603,
        "2037": 9.228,
        "2038": 7.219,
        "2039": 5.617,
        "2040": 4.339,
        "2041": 3.627,
        "2042": 3.09,
        "2043": 2.622,
        "2044": 2.218,
        "2045": 1.843,
        "2046": 1.573,
        "2047": 1.317,
        "2048": 1.092,
        "2049": 0.887,
        "2050": 0.693
      }
    },
    "Bedrijfshal": {
      "type": "DWW",
      "type_label": "Distribution warehouse (warm)",
      "approx": true,
      "kwh": {
        "2020": 55.0,
        "2021": 51.99,
        "2022": 49.14,
        "2023": 46.45,
        "2024": 43.91,
        "2025": 41.5,
        "2026": 39.23,
        "2027": 37.08,
        "2028": 35.05,
        "2029": 33.13,
        "2030": 31.32,
        "2031": 29.6,
        "2032": 27.98,
        "2033": 26.45,
        "2034": 25.0,
        "2035": 25,
        "2036": 25,
        "2037": 25,
        "2038": 25,
        "2039": 25,
        "2040": 25,
        "2041": 25,
        "2042": 25,
        "2043": 25,
        "2044": 25,
        "2045": 25,
        "2046": 25,
        "2047": 25,
        "2048": 25,
        "2049": 25,
        "2050": 25
      },
      "co2": {
        "2020": 17.898,
        "2021": 16.703,
        "2022": 15.32,
        "2023": 13.995,
        "2024": 12.731,
        "2025": 11.576,
        "2026": 10.399,
        "2027": 9.331,
        "2028": 8.327,
        "2029": 7.386,
        "2030": 6.478,
        "2031": 5.713,
        "2032": 4.971,
        "2033": 4.281,
        "2034": 3.639,
        "2035": 3.044,
        "2036": 2.489,
        "2037": 1.98,
        "2038": 1.549,
        "2039": 1.206,
        "2040": 0.932,
        "2041": 0.78,
        "2042": 0.665,
        "2043": 0.565,
        "2044": 0.478,
        "2045": 0.397,
        "2046": 0.34,
        "2047": 0.285,
        "2048": 0.237,
        "2049": 0.193,
        "2050": 0.151
      }
    },
    "Zwembad": {
      "type": "LEI",
      "type_label": "Leisure/lodging",
      "approx": true,
      "kwh": {
        "2020": 223.0,
        "2021": 210.58,
        "2022": 198.86,
        "2023": 187.79,
        "2024": 177.33,
        "2025": 167.46,
        "2026": 158.14,
        "2027": 149.33,
        "2028": 141.02,
        "2029": 133.17,
        "2030": 125.75,
        "2031": 118.75,
        "2032": 112.14,
        "2033": 105.9,
        "2034": 100.0,
        "2035": 100,
        "2036": 100,
        "2037": 100,
        "2038": 100,
        "2039": 100,
        "2040": 100,
        "2041": 100,
        "2042": 100,
        "2043": 100,
        "2044": 100,
        "2045": 100,
        "2046": 100,
        "2047": 100,
        "2048": 100,
        "2049": 100,
        "2050": 100
      },
      "co2": {
        "2020": 63.511,
        "2021": 59.279,
        "2022": 54.379,
        "2023": 49.683,
        "2024": 45.206,
        "2025": 41.113,
        "2026": 36.943,
        "2027": 33.159,
        "2028": 29.602,
        "2029": 26.269,
        "2030": 23.052,
        "2031": 20.34,
        "2032": 17.713,
        "2033": 15.267,
        "2034": 12.992,
        "2035": 10.887,
        "2036": 8.918,
        "2037": 7.115,
        "2038": 5.59,
        "2039": 4.374,
        "2040": 3.404,
        "2041": 2.863,
        "2042": 2.456,
        "2043": 2.101,
        "2044": 1.794,
        "2045": 1.509,
        "2046": 1.304,
        "2047": 1.11,
        "2048": 0.939,
        "2049": 0.783,
        "2050": 0.636
      }
    },
    "Winkel met warenkoeling": {
      "type": "RHS",
      "type_label": "Retail high street",
      "approx": true,
      "kwh": {
        "2020": 263.0,
        "2021": 248.15,
        "2022": 234.14,
        "2023": 220.92,
        "2024": 208.45,
        "2025": 196.68,
        "2026": 185.58,
        "2027": 175.1,
        "2028": 165.22,
        "2029": 155.89,
        "2030": 147.09,
        "2031": 138.79,
        "2032": 130.95,
        "2033": 123.56,
        "2034": 116.58,
        "2035": 110.0,
        "2036": 110,
        "2037": 110,
        "2038": 110,
        "2039": 110,
        "2040": 110,
        "2041": 110,
        "2042": 110,
        "2043": 110,
        "2044": 110,
        "2045": 110,
        "2046": 110,
        "2047": 110,
        "2048": 110,
        "2049": 110,
        "2050": 110
      },
      "co2": {
        "2020": 83.518,
        "2021": 77.943,
        "2022": 71.488,
        "2023": 65.302,
        "2024": 59.405,
        "2025": 54.013,
        "2026": 48.521,
        "2027": 43.535,
        "2028": 38.85,
        "2029": 34.46,
        "2030": 30.221,
        "2031": 26.649,
        "2032": 23.189,
        "2033": 19.966,
        "2034": 16.97,
        "2035": 14.197,
        "2036": 11.603,
        "2037": 9.228,
        "2038": 7.219,
        "2039": 5.617,
        "2040": 4.339,
        "2041": 3.627,
        "2042": 3.09,
        "2043": 2.622,
        "2044": 2.218,
        "2045": 1.843,
        "2046": 1.573,
        "2047": 1.317,
        "2048": 1.092,
        "2049": 0.887,
        "2050": 0.693
      }
    },
    "Medische (groeps) praktijk": {
      "type": "HEC",
      "type_label": "Healthcare",
      "approx": true,
      "kwh": {
        "2020": 230.52,
        "2021": 218.65,
        "2022": 207.4,
        "2023": 196.72,
        "2024": 186.6,
        "2025": 176.99,
        "2026": 167.88,
        "2027": 159.24,
        "2028": 151.04,
        "2029": 143.27,
        "2030": 135.89,
        "2031": 128.9,
        "2032": 122.26,
        "2033": 115.97,
        "2034": 110.0,
        "2035": 110,
        "2036": 110,
        "2037": 110,
        "2038": 110,
        "2039": 110,
        "2040": 110,
        "2041": 110,
        "2042": 110,
        "2043": 110,
        "2044": 110,
        "2045": 110,
        "2046": 110,
        "2047": 110,
        "2048": 110,
        "2049": 110,
        "2050": 110
      },
      "co2": {
        "2020": 68.548,
        "2021": 63.983,
        "2022": 58.696,
        "2023": 53.629,
        "2024": 48.8,
        "2025": 44.384,
        "2026": 39.886,
        "2027": 35.803,
        "2028": 31.966,
        "2029": 28.37,
        "2030": 24.899,
        "2031": 21.973,
        "2032": 19.14,
        "2033": 16.501,
        "2034": 14.047,
        "2035": 11.775,
        "2036": 9.651,
        "2037": 7.706,
        "2038": 6.061,
        "2039": 4.749,
        "2040": 3.702,
        "2041": 3.119,
        "2042": 2.68,
        "2043": 2.296,
        "2044": 1.965,
        "2045": 1.658,
        "2046": 1.437,
        "2047": 1.227,
        "2048": 1.043,
        "2049": 0.875,
        "2050": 0.716
      }
    }
  },
  "model": {
    "years": [2020, 2021, 2022, 2023, 2024],
    "types": [
      {
        "name": "Asielzoekerscentrum",
        "gas": [16.783758, 15.157084, 13.943501, 14.726476, 15.333722],
        "elek": [53.85005, 51.76276, 57.465017, 61.476917, 72.299584],
        "elekIncl": [54.503506, 52.390233, 58.898103, 63.093153, 74.861023],
        "zon": [null, null, null, null, 3.16559],
        "pv": [null, null, null, null, 0.173],
        "pGas": [66, 66, 66, 64, 67],
        "pElek": [62, 63, 65, 72, 75],
        "pZon": [62, 63, 65, 72, 75],
        "oGas": {
          "2024": [
            [14, 16],
            [6, 20],
            [8, 13],
            [20, 18]
          ]
        },
        "oElek": {
          "2024": [
            [14, 22],
            [6, 23],
            [8, 13],
            [20, 17]
          ]
        },
        "k1": "n.v.t.",
        "k2": ""
      },
      {
        "name": "Basisschool",
        "gas": [7.517422, 8.535343, 7.52263, 7.177813, 6.670815],
        "elek": [26.046239, 26.149116, 26.100161, 25.833002, 25.684712],
        "elekIncl": [28.891336, 28.53326, 29.370597, 29.346041, 28.961781],
        "zon": [3.690263, 4.098537, 5.67558, 5.835629, 5.799547],
        "pv": [0.266, 0.3, 0.334, 0.37, 0.417],
        "pGas": [4433, 4449, 4442, 4403, 4421],
        "pElek": [4730, 4773, 4828, 4847, 4930],
        "pZon": [4730, 4773, 4828, 4847, 4930],
        "oGas": {
          "2020": [
            [12, 13],
            [3, 107],
            [4, 864],
            [6, 2598],
            [8, 667],
            [10, 152],
            [21, 32]
          ],
          "2021": [
            [12, 14],
            [3, 107],
            [4, 859],
            [6, 2576],
            [8, 692],
            [10, 164],
            [21, 37]
          ],
          "2022": [
            [12, 11],
            [3, 111],
            [4, 851],
            [6, 2575],
            [8, 695],
            [10, 162],
            [21, 37]
          ],
          "2023": [
            [13, 118],
            [4, 843],
            [6, 2550],
            [8, 696],
            [10, 159],
            [21, 37]
          ],
          "2024": [
            [12, 11],
            [3, 107],
            [4, 837],
            [6, 2552],
            [8, 717],
            [10, 160],
            [21, 37]
          ]
        },
        "oElek": {
          "2020": [
            [12, 19],
            [3, 111],
            [4, 888],
            [6, 2771],
            [8, 751],
            [10, 161],
            [21, 29]
          ],
          "2021": [
            [12, 17],
            [3, 111],
            [4, 901],
            [6, 2756],
            [8, 778],
            [10, 176],
            [21, 34]
          ],
          "2022": [
            [12, 15],
            [3, 112],
            [4, 909],
            [6, 2789],
            [8, 789],
            [10, 180],
            [21, 34]
          ],
          "2023": [
            [12, 16],
            [3, 110],
            [4, 907],
            [6, 2799],
            [8, 804],
            [10, 177],
            [21, 34]
          ],
          "2024": [
            [12, 17],
            [3, 110],
            [4, 910],
            [6, 2838],
            [8, 841],
            [10, 179],
            [21, 35]
          ]
        },
        "k1": "Basis/ Voorgezet onderwijs",
        "k2": ""
      },
      {
        "name": "Bedrijfshal algemeen (geen LISA-informatie)",
        "gas": [4.59284, 5.095571, 3.887204, 3.29642, 2.924718],
        "elek": [45.330182, 44.663059, 41.534493, 39.883314, 37.870124],
        "elekIncl": [47.84099, 47.341825, 45.403374, 45.513556, 43.024716],
        "zon": [null, null, 11.094811, 12.677894, 14.081695],
        "pv": [null, null, 0.131, 0.18, 0.219],
        "pGas": [18052, 18048, 17891, 17441, 18137],
        "pElek": [18243, 18438, 19086, 19457, 22285],
        "pZon": [18243, 18438, 19086, 19457, 22285],
        "oGas": {
          "2020": [
            [0, 175],
            [1, 1239],
            [2, 4494],
            [3, 3662],
            [4, 3551],
            [6, 3102],
            [8, 1112],
            [10, 479],
            [21, 238]
          ],
          "2021": [
            [0, 171],
            [1, 1227],
            [2, 4506],
            [3, 3667],
            [4, 3564],
            [6, 3096],
            [8, 1097],
            [10, 487],
            [21, 233]
          ],
          "2022": [
            [0, 179],
            [1, 1211],
            [2, 4469],
            [3, 3631],
            [4, 3526],
            [6, 3071],
            [8, 1072],
            [10, 498],
            [21, 234]
          ],
          "2023": [
            [0, 167],
            [1, 1152],
            [2, 4358],
            [3, 3534],
            [4, 3442],
            [6, 3016],
            [8, 1054],
            [10, 482],
            [21, 236]
          ],
          "2024": [
            [0, 159],
            [1, 1221],
            [2, 4589],
            [3, 3672],
            [4, 3540],
            [6, 3112],
            [8, 1087],
            [10, 511],
            [21, 246]
          ]
        },
        "oElek": {
          "2020": [
            [0, 491],
            [1, 1693],
            [2, 4801],
            [3, 3491],
            [4, 3278],
            [6, 2792],
            [8, 1003],
            [10, 450],
            [21, 244]
          ],
          "2021": [
            [0, 578],
            [1, 1789],
            [2, 4827],
            [3, 3489],
            [4, 3279],
            [6, 2780],
            [8, 994],
            [10, 454],
            [21, 248]
          ],
          "2022": [
            [0, 672],
            [1, 1951],
            [2, 5047],
            [3, 3516],
            [4, 3330],
            [6, 2820],
            [8, 999],
            [10, 483],
            [21, 268]
          ],
          "2023": [
            [0, 619],
            [1, 2002],
            [2, 5171],
            [3, 3517],
            [4, 3370],
            [6, 2920],
            [8, 1052],
            [10, 512],
            [21, 294]
          ],
          "2024": [
            [0, 692],
            [1, 2391],
            [2, 6152],
            [3, 3902],
            [4, 3730],
            [6, 3336],
            [8, 1168],
            [10, 580],
            [21, 334]
          ]
        },
        "k1": "Bedrijfshal",
        "k2": ""
      },
      {
        "name": "Bedrijfshal algemeen (met LISA-informatie)",
        "gas": [4.584272, 5.19575, 4.199997, 3.743278, 3.321404],
        "elek": [48.554887, 47.399384, 46.458156, 46.540239, 45.738201],
        "elekIncl": [51.628759, 50.820338, 51.237618, 53.214576, 51.750546],
        "zon": [6.145356, 8.357272, 13.318211, 14.54837, 16.221066],
        "pv": [0.125, 0.153, 0.2, 0.259, 0.296],
        "pGas": [11182, 11230, 11184, 10863, 11155],
        "pElek": [12071, 12238, 12613, 12346, 12743],
        "pZon": [12071, 12238, 12613, 12346, 12743],
        "oGas": {
          "2020": [
            [0, 38],
            [1, 370],
            [2, 1911],
            [3, 1924],
            [4, 2597],
            [6, 2579],
            [8, 1008],
            [10, 472],
            [21, 283]
          ],
          "2021": [
            [0, 35],
            [1, 363],
            [2, 1936],
            [3, 1939],
            [4, 2606],
            [6, 2583],
            [8, 1000],
            [10, 479],
            [21, 289]
          ],
          "2022": [
            [0, 40],
            [1, 363],
            [2, 1932],
            [3, 1928],
            [4, 2569],
            [6, 2569],
            [8, 1013],
            [10, 480],
            [21, 290]
          ],
          "2023": [
            [0, 39],
            [1, 339],
            [2, 1861],
            [3, 1847],
            [4, 2479],
            [6, 2533],
            [8, 999],
            [10, 478],
            [21, 288]
          ],
          "2024": [
            [0, 37],
            [1, 357],
            [2, 1932],
            [3, 1901],
            [4, 2545],
            [6, 2598],
            [8, 1008],
            [10, 484],
            [21, 293]
          ]
        },
        "oElek": {
          "2020": [
            [0, 68],
            [1, 522],
            [2, 2250],
            [3, 2049],
            [4, 2694],
            [6, 2696],
            [8, 1033],
            [10, 489],
            [21, 270]
          ],
          "2021": [
            [0, 79],
            [1, 551],
            [2, 2284],
            [3, 2059],
            [4, 2719],
            [6, 2718],
            [8, 1037],
            [10, 500],
            [21, 291]
          ],
          "2022": [
            [0, 84],
            [1, 586],
            [2, 2381],
            [3, 2100],
            [4, 2777],
            [6, 2800],
            [8, 1068],
            [10, 518],
            [21, 299]
          ],
          "2023": [
            [0, 81],
            [1, 557],
            [2, 2306],
            [3, 2042],
            [4, 2702],
            [6, 2770],
            [8, 1060],
            [10, 524],
            [21, 304]
          ],
          "2024": [
            [0, 84],
            [1, 583],
            [2, 2410],
            [3, 2102],
            [4, 2788],
            [6, 2857],
            [8, 1071],
            [10, 535],
            [21, 313]
          ]
        },
        "k1": "Bedrijfshal",
        "k2": ""
      },
      {
        "name": "Bedrijfshal met logistieke activiteiten",
        "gas": [3.993181, 4.341446, 3.382158, 2.941363, 2.60037],
        "elek": [41.887917, 41.469776, 40.331147, 38.625123, 37.97006],
        "elekIncl": [44.793674, 44.943003, 45.029864, 45.335846, 44.1881],
        "zon": [5.385051, 7.700623, 11.162986, 14.213513, 14.952176],
        "pv": [0.185, 0.227, 0.287, 0.358, 0.405],
        "pGas": [4911, 4940, 4936, 4852, 4929],
        "pElek": [5360, 5497, 5612, 5585, 5661],
        "pZon": [5360, 5497, 5612, 5585, 5661],
        "oGas": {
          "2020": [
            [11, 25],
            [2, 181],
            [3, 333],
            [4, 766],
            [6, 1710],
            [8, 1057],
            [10, 529],
            [21, 310]
          ],
          "2021": [
            [11, 25],
            [2, 184],
            [3, 339],
            [4, 771],
            [6, 1740],
            [8, 1041],
            [10, 523],
            [21, 317]
          ],
          "2022": [
            [11, 24],
            [2, 181],
            [3, 331],
            [4, 778],
            [6, 1732],
            [8, 1048],
            [10, 524],
            [21, 318]
          ],
          "2023": [
            [11, 21],
            [2, 175],
            [3, 317],
            [4, 755],
            [6, 1713],
            [8, 1030],
            [10, 517],
            [21, 324]
          ],
          "2024": [
            [11, 26],
            [2, 179],
            [3, 322],
            [4, 769],
            [6, 1733],
            [8, 1053],
            [10, 523],
            [21, 324]
          ]
        },
        "oElek": {
          "2020": [
            [11, 37],
            [2, 226],
            [3, 357],
            [4, 842],
            [6, 1869],
            [8, 1151],
            [10, 562],
            [21, 316]
          ],
          "2021": [
            [11, 41],
            [2, 239],
            [3, 372],
            [4, 854],
            [6, 1954],
            [8, 1140],
            [10, 569],
            [21, 328]
          ],
          "2022": [
            [11, 42],
            [2, 240],
            [3, 364],
            [4, 878],
            [6, 2005],
            [8, 1172],
            [10, 573],
            [21, 338]
          ],
          "2023": [
            [11, 41],
            [2, 242],
            [3, 357],
            [4, 863],
            [6, 2007],
            [8, 1150],
            [10, 574],
            [21, 351]
          ],
          "2024": [
            [11, 41],
            [2, 248],
            [3, 366],
            [4, 871],
            [6, 2027],
            [8, 1173],
            [10, 579],
            [21, 356]
          ]
        },
        "k1": "Bedrijfshal",
        "k2": ""
      },
      {
        "name": "Bedrijfshal met maakindustrie en andere economische activiteiten",
        "gas": [5.479876, 6.131739, 4.934044, 4.22591, 3.793506],
        "elek": [53.351467, 50.913392, 50.576688, 48.61218, 47.652182],
        "elekIncl": [56.570743, 54.247349, 55.292381, 54.226438, 53.216129],
        "zon": [5.626213, 6.657889, 9.781147, 11.187284, 11.318324],
        "pv": [0.163, 0.205, 0.272, 0.339, 0.39],
        "pGas": [4548, 4569, 4558, 4456, 4544],
        "pElek": [4813, 4886, 4985, 4928, 5028],
        "pZon": [4813, 4886, 4985, 4928, 5028],
        "oGas": {
          "2020": [
            [11, 43],
            [2, 251],
            [3, 415],
            [4, 1059],
            [6, 1672],
            [8, 709],
            [10, 271],
            [21, 128]
          ],
          "2021": [
            [11, 40],
            [2, 246],
            [3, 410],
            [4, 1085],
            [6, 1680],
            [8, 691],
            [10, 278],
            [21, 139]
          ],
          "2022": [
            [11, 41],
            [2, 240],
            [3, 413],
            [4, 1067],
            [6, 1673],
            [8, 703],
            [10, 280],
            [21, 141]
          ],
          "2023": [
            [11, 38],
            [2, 236],
            [3, 386],
            [4, 1049],
            [6, 1635],
            [8, 705],
            [10, 270],
            [21, 137]
          ],
          "2024": [
            [11, 38],
            [2, 244],
            [3, 403],
            [4, 1064],
            [6, 1666],
            [8, 714],
            [10, 279],
            [21, 136]
          ]
        },
        "oElek": {
          "2020": [
            [11, 54],
            [2, 272],
            [3, 461],
            [4, 1137],
            [6, 1776],
            [8, 716],
            [10, 264],
            [21, 133]
          ],
          "2021": [
            [11, 55],
            [2, 274],
            [3, 452],
            [4, 1171],
            [6, 1798],
            [8, 720],
            [10, 273],
            [21, 143]
          ],
          "2022": [
            [11, 57],
            [2, 283],
            [3, 467],
            [4, 1184],
            [6, 1833],
            [8, 729],
            [10, 285],
            [21, 147]
          ],
          "2023": [
            [11, 52],
            [2, 276],
            [3, 448],
            [4, 1174],
            [6, 1800],
            [8, 742],
            [10, 285],
            [21, 151]
          ],
          "2024": [
            [11, 53],
            [2, 285],
            [3, 462],
            [4, 1190],
            [6, 1840],
            [8, 760],
            [10, 288],
            [21, 150]
          ]
        },
        "k1": "n.v.t.",
        "k2": ""
      },
      {
        "name": "Bedrijfshal met maakindustrie en logistieke activiteiten",
        "gas": [4.330462, 4.862627, 3.836934, 3.505302, 2.995231],
        "elek": [54.475915, 53.770092, 52.109587, 50.51565, 49.65584],
        "elekIncl": [57.824291, 57.557627, 57.574436, 57.40826, 55.901457],
        "zon": [7.043036, 9.309682, 13.691437, 14.814943, 15.8005],
        "pv": [0.13, 0.159, 0.21, 0.273, 0.31],
        "pGas": [9644, 9692, 9655, 9414, 9659],
        "pElek": [10335, 10463, 10676, 10515, 10761],
        "pZon": [10335, 10463, 10676, 10515, 10761],
        "oGas": {
          "2020": [
            [0, 18],
            [1, 141],
            [2, 796],
            [3, 1257],
            [4, 2030],
            [6, 2954],
            [8, 1414],
            [10, 690],
            [21, 344]
          ],
          "2021": [
            [0, 16],
            [1, 142],
            [2, 814],
            [3, 1254],
            [4, 2044],
            [6, 2945],
            [8, 1431],
            [10, 701],
            [21, 345]
          ],
          "2022": [
            [0, 20],
            [1, 139],
            [2, 813],
            [3, 1242],
            [4, 2022],
            [6, 2936],
            [8, 1425],
            [10, 701],
            [21, 357]
          ],
          "2023": [
            [0, 19],
            [1, 133],
            [2, 786],
            [3, 1178],
            [4, 1977],
            [6, 2879],
            [8, 1410],
            [10, 683],
            [21, 349]
          ],
          "2024": [
            [0, 18],
            [1, 140],
            [2, 832],
            [3, 1208],
            [4, 2030],
            [6, 2947],
            [8, 1426],
            [10, 699],
            [21, 359]
          ]
        },
        "oElek": {
          "2020": [
            [0, 24],
            [1, 192],
            [2, 950],
            [3, 1331],
            [4, 2151],
            [6, 3081],
            [8, 1476],
            [10, 747],
            [21, 383]
          ],
          "2021": [
            [0, 27],
            [1, 200],
            [2, 955],
            [3, 1347],
            [4, 2173],
            [6, 3092],
            [8, 1514],
            [10, 763],
            [21, 392]
          ],
          "2022": [
            [0, 28],
            [1, 212],
            [2, 980],
            [3, 1356],
            [4, 2210],
            [6, 3153],
            [8, 1548],
            [10, 781],
            [21, 408]
          ],
          "2023": [
            [0, 29],
            [1, 202],
            [2, 979],
            [3, 1316],
            [4, 2163],
            [6, 3116],
            [8, 1541],
            [10, 767],
            [21, 402]
          ],
          "2024": [
            [0, 27],
            [1, 218],
            [2, 1033],
            [3, 1328],
            [4, 2229],
            [6, 3181],
            [8, 1559],
            [10, 772],
            [21, 414]
          ]
        },
        "k1": "n.v.t.",
        "k2": ""
      },
      {
        "name": "Bedrijfshal uitsluitend maakindustrie",
        "gas": [9.125597, 10.052046, 8.312173, 7.654541, 6.453918],
        "elek": [93.257323, 92.133695, 87.841183, 85.666349, 79.83267],
        "elekIncl": [97.335373, 96.021702, 93.289096, 92.371111, 86.479202],
        "zon": [6.601779, 7.642595, 10.843461, 12.286387, 12.543],
        "pv": [0.134, 0.165, 0.214, 0.279, 0.32],
        "pGas": [17803, 17857, 17755, 17325, 17641],
        "pElek": [18777, 19004, 19303, 19013, 19454],
        "pZon": [18777, 19004, 19303, 19013, 19454],
        "oGas": {
          "2020": [
            [0, 38],
            [1, 371],
            [2, 2029],
            [3, 3132],
            [4, 4321],
            [6, 4908],
            [8, 1792],
            [10, 815],
            [21, 397]
          ],
          "2021": [
            [0, 35],
            [1, 373],
            [2, 2020],
            [3, 3159],
            [4, 4312],
            [6, 4926],
            [8, 1805],
            [10, 808],
            [21, 419]
          ],
          "2022": [
            [0, 42],
            [1, 365],
            [2, 2002],
            [3, 3116],
            [4, 4272],
            [6, 4915],
            [8, 1810],
            [10, 808],
            [21, 425]
          ],
          "2023": [
            [0, 44],
            [1, 339],
            [2, 1960],
            [3, 3009],
            [4, 4161],
            [6, 4805],
            [8, 1779],
            [10, 804],
            [21, 424]
          ],
          "2024": [
            [0, 38],
            [1, 358],
            [2, 2027],
            [3, 3077],
            [4, 4226],
            [6, 4888],
            [8, 1796],
            [10, 808],
            [21, 423]
          ]
        },
        "oElek": {
          "2020": [
            [0, 73],
            [1, 493],
            [2, 2272],
            [3, 3275],
            [4, 4492],
            [6, 5037],
            [8, 1868],
            [10, 849],
            [21, 418]
          ],
          "2021": [
            [0, 75],
            [1, 505],
            [2, 2316],
            [3, 3325],
            [4, 4494],
            [6, 5102],
            [8, 1888],
            [10, 847],
            [21, 452]
          ],
          "2022": [
            [0, 94],
            [1, 516],
            [2, 2366],
            [3, 3355],
            [4, 4559],
            [6, 5168],
            [8, 1930],
            [10, 857],
            [21, 458]
          ],
          "2023": [
            [0, 89],
            [1, 480],
            [2, 2348],
            [3, 3250],
            [4, 4479],
            [6, 5128],
            [8, 1907],
            [10, 867],
            [21, 465]
          ],
          "2024": [
            [0, 86],
            [1, 504],
            [2, 2431],
            [3, 3363],
            [4, 4546],
            [6, 5248],
            [8, 1923],
            [10, 882],
            [21, 471]
          ]
        },
        "k1": "n.v.t.",
        "k2": ""
      },
      {
        "name": "Bedrijfswoning",
        "gas": [7.702092, 8.692748, 6.609388, 5.773756, 5.403847],
        "elek": [50.149978, 49.80336, 47.626091, 46.43927, 45.976228],
        "elekIncl": [60.622879, 57.833919, 59.892335, 61.493521, 62.230678],
        "zon": [19.650446, 25.255814, 39.205825, 44.467042, 51.154355],
        "pv": [0.239, 0.281, 0.359, 0.454, 0.496],
        "pGas": [64092, 64226, 64004, 62179, 63374],
        "pElek": [67633, 67855, 67482, 65594, 67198],
        "pZon": [67633, 67855, 67482, 65594, 67198],
        "oGas": {
          "2020": [
            [0, 258],
            [1, 2415],
            [2, 28307],
            [3, 18312],
            [4, 9407],
            [6, 4884],
            [8, 418],
            [10, 60],
            [21, 31]
          ],
          "2021": [
            [0, 168],
            [1, 2193],
            [2, 28459],
            [3, 18791],
            [4, 9405],
            [6, 4781],
            [8, 352],
            [10, 49],
            [21, 28]
          ],
          "2022": [
            [0, 151],
            [1, 2058],
            [2, 28320],
            [3, 19091],
            [4, 9305],
            [6, 4666],
            [8, 337],
            [10, 47],
            [21, 29]
          ],
          "2023": [
            [0, 140],
            [1, 1967],
            [2, 28171],
            [3, 18630],
            [4, 8645],
            [6, 4239],
            [8, 315],
            [10, 41],
            [21, 31]
          ],
          "2024": [
            [0, 124],
            [1, 1936],
            [2, 28602],
            [3, 19172],
            [4, 8866],
            [6, 4289],
            [8, 311],
            [10, 44],
            [21, 30]
          ]
        },
        "oElek": {
          "2020": [
            [0, 345],
            [1, 2629],
            [2, 30774],
            [3, 19651],
            [4, 9369],
            [6, 4417],
            [8, 377],
            [10, 50],
            [21, 21]
          ],
          "2021": [
            [0, 241],
            [1, 2397],
            [2, 30938],
            [3, 20160],
            [4, 9386],
            [6, 4354],
            [8, 314],
            [10, 40],
            [21, 25]
          ],
          "2022": [
            [0, 216],
            [1, 2227],
            [2, 30880],
            [3, 20492],
            [4, 9151],
            [6, 4156],
            [8, 295],
            [10, 39],
            [21, 26]
          ],
          "2023": [
            [0, 200],
            [1, 2163],
            [2, 30784],
            [3, 19954],
            [4, 8427],
            [6, 3729],
            [8, 278],
            [10, 33],
            [21, 26]
          ],
          "2024": [
            [0, 190],
            [1, 2154],
            [2, 31349],
            [3, 20651],
            [4, 8722],
            [6, 3798],
            [8, 277],
            [10, 32],
            [21, 25]
          ]
        },
        "k1": "n.v.t.",
        "k2": ""
      },
      {
        "name": "Bijeenkomstgebouw (niet nader ingedeeld)",
        "gas": [9.201146, 9.234148, 8.040152, 7.506789, 6.927852],
        "elek": [45.14891, 43.480275, 48.028236, 48.164568, 49.241456],
        "elekIncl": [47.175501, 45.124152, 50.381424, 51.293722, 52.509167],
        "zon": [2.488009, 3.144957, 4.385129, 5.546468, 6.13313],
        "pv": [0.113, 0.129, 0.162, 0.211, 0.252],
        "pGas": [9178, 9255, 9270, 9150, 9331],
        "pElek": [9131, 8946, 9205, 9153, 9530],
        "pZon": [9131, 8946, 9205, 9153, 9530],
        "oGas": {
          "2020": [
            [0, 116],
            [1, 729],
            [2, 2844],
            [3, 2627],
            [4, 1687],
            [6, 884],
            [8, 193],
            [10, 67],
            [21, 31]
          ],
          "2021": [
            [0, 115],
            [1, 732],
            [2, 2869],
            [3, 2657],
            [4, 1689],
            [6, 889],
            [8, 199],
            [10, 76],
            [21, 29]
          ],
          "2022": [
            [0, 117],
            [1, 743],
            [2, 2879],
            [3, 2643],
            [4, 1707],
            [6, 878],
            [8, 198],
            [10, 77],
            [21, 28]
          ],
          "2023": [
            [0, 119],
            [1, 735],
            [2, 2837],
            [3, 2608],
            [4, 1690],
            [6, 867],
            [8, 191],
            [10, 75],
            [21, 28]
          ],
          "2024": [
            [0, 118],
            [1, 750],
            [2, 2896],
            [3, 2675],
            [4, 1726],
            [6, 871],
            [8, 193],
            [10, 75],
            [21, 27]
          ]
        },
        "oElek": {
          "2020": [
            [0, 182],
            [1, 835],
            [2, 2807],
            [3, 2572],
            [4, 1619],
            [6, 838],
            [8, 199],
            [10, 56],
            [21, 23]
          ],
          "2021": [
            [0, 192],
            [1, 826],
            [2, 2738],
            [3, 2506],
            [4, 1572],
            [6, 835],
            [8, 189],
            [10, 63],
            [21, 25]
          ],
          "2022": [
            [0, 199],
            [1, 872],
            [2, 2827],
            [3, 2564],
            [4, 1616],
            [6, 842],
            [8, 196],
            [10, 64],
            [21, 25]
          ],
          "2023": [
            [0, 214],
            [1, 885],
            [2, 2781],
            [3, 2537],
            [4, 1607],
            [6, 843],
            [8, 195],
            [10, 65],
            [21, 26]
          ],
          "2024": [
            [0, 216],
            [1, 943],
            [2, 2896],
            [3, 2654],
            [4, 1665],
            [6, 865],
            [8, 200],
            [10, 64],
            [21, 27]
          ]
        },
        "k1": "Overig",
        "k2": ""
      },
      {
        "name": "Campusgebouw",
        "gas": [10.09119, 8.525602, 7.197372, 7.635279, 6.031244],
        "elek": [78.123518, 66.80105, 70.478153, 77.101932, 72.494543],
        "elekIncl": [80.734496, 69.120344, 73.088686, 80.292844, 75.08946],
        "zon": [3.014174, 2.540882, 2.98796, 3.487329, 2.947956],
        "pv": [0.229, 0.248, 0.275, 0.281, 0.374],
        "pGas": [103, 99, 96, 95, 98],
        "pElek": [109, 105, 109, 114, 115],
        "pZon": [109, 105, 109, 114, 115],
        "oGas": {
          "2020": [
            [14, 14],
            [6, 11],
            [8, 17],
            [10, 23],
            [21, 38]
          ],
          "2021": [
            [14, 17],
            [6, 12],
            [8, 16],
            [10, 20],
            [21, 34]
          ],
          "2022": [
            [14, 15],
            [6, 13],
            [8, 15],
            [10, 19],
            [21, 34]
          ],
          "2023": [
            [14, 15],
            [6, 13],
            [8, 14],
            [10, 21],
            [21, 32]
          ],
          "2024": [
            [14, 16],
            [6, 12],
            [8, 15],
            [10, 21],
            [21, 34]
          ]
        },
        "oElek": {
          "2020": [
            [14, 17],
            [6, 11],
            [8, 16],
            [10, 29],
            [21, 36]
          ],
          "2021": [
            [14, 18],
            [6, 10],
            [8, 17],
            [10, 24],
            [21, 36]
          ],
          "2022": [
            [14, 18],
            [6, 11],
            [8, 19],
            [10, 24],
            [21, 37]
          ],
          "2023": [
            [14, 18],
            [6, 13],
            [8, 21],
            [10, 25],
            [21, 37]
          ],
          "2024": [
            [14, 18],
            [6, 14],
            [8, 19],
            [10, 28],
            [21, 36]
          ]
        },
        "k1": "Universiteit/HBO/MBO",
        "k2": ""
      },
      {
        "name": "Cultuurhuis",
        "gas": [7.859205, 7.273284, 6.259687, 5.873447, 5.136984],
        "elek": [60.562378, 47.7502, 55.867166, 55.508009, 53.9969],
        "elekIncl": [62.166638, 49.255695, 57.788347, 57.475114, 55.91128],
        "zon": [2.449906, 2.285166, 2.693078, 2.667289, 2.673689],
        "pv": [0.142, 0.158, 0.186, 0.212, 0.235],
        "pGas": [536, 540, 541, 537, 542],
        "pElek": [563, 568, 569, 570, 575],
        "pZon": [563, 568, 569, 570, 575],
        "oGas": {
          "2020": [
            [12, 23],
            [3, 66],
            [4, 117],
            [6, 165],
            [8, 90],
            [10, 52],
            [21, 23]
          ],
          "2021": [
            [12, 22],
            [3, 61],
            [4, 119],
            [6, 161],
            [8, 87],
            [10, 49],
            [21, 41]
          ],
          "2022": [
            [12, 20],
            [3, 62],
            [4, 120],
            [6, 162],
            [8, 89],
            [10, 48],
            [21, 40]
          ],
          "2023": [
            [12, 20],
            [3, 59],
            [4, 118],
            [6, 163],
            [8, 88],
            [10, 48],
            [21, 41]
          ],
          "2024": [
            [12, 21],
            [3, 60],
            [4, 117],
            [6, 164],
            [8, 89],
            [10, 50],
            [21, 41]
          ]
        },
        "oElek": {
          "2020": [
            [12, 31],
            [3, 66],
            [4, 120],
            [6, 160],
            [8, 92],
            [10, 62],
            [21, 32]
          ],
          "2021": [
            [12, 30],
            [3, 64],
            [4, 120],
            [6, 156],
            [8, 89],
            [10, 59],
            [21, 50]
          ],
          "2022": [
            [12, 28],
            [3, 67],
            [4, 117],
            [6, 159],
            [8, 89],
            [10, 59],
            [21, 50]
          ],
          "2023": [
            [12, 28],
            [3, 66],
            [4, 118],
            [6, 161],
            [8, 89],
            [10, 57],
            [21, 51]
          ],
          "2024": [
            [12, 29],
            [3, 67],
            [4, 118],
            [6, 162],
            [8, 88],
            [10, 60],
            [21, 51]
          ]
        },
        "k1": "n.v.t.",
        "k2": ""
      },
      {
        "name": "Datacenter",
        "gas": [4.042275, 5.099738, 4.256724, 3.963185, 3.246022],
        "elek": [1325.020085, 1569.131332, 1556.421462, 1387.441945, 1771.085465],
        "elekIncl": [1327.497615, 1572.477509, 1560.248118, 1391.050052, 1773.208955],
        "zon": [2.78428, 4.228674, 5.314813, 4.279072, 2.837758],
        "pv": [0.119, 0.15, 0.22, 0.212, 0.224],
        "pGas": [56, 57, 53, 51, 52],
        "pElek": [84, 80, 82, 80, 85],
        "pZon": [84, 80, 82, 80, 85],
        "oGas": {},
        "oElek": {},
        "k1": "n.v.t.",
        "k2": ""
      },
      {
        "name": "Gebedshuis",
        "gas": [7.218626, 7.923332, 6.50977, 5.491528, 5.133445],
        "elek": [16.358586, 15.721261, 16.375603, 16.314085, 16.567463],
        "elekIncl": [17.643682, 16.640706, 17.848055, 18.022641, 18.53106],
        "zon": [1.503764, 1.845719, 3.0362, 3.481652, 4.20627],
        "pv": [0.111, 0.129, 0.168, 0.225, 0.27],
        "pGas": [4243, 4269, 4268, 4217, 4259],
        "pElek": [3598, 3527, 3564, 3468, 3530],
        "pZon": [3598, 3527, 3564, 3468, 3530],
        "oGas": {
          "2020": [
            [11, 35],
            [2, 411],
            [3, 1054],
            [4, 1367],
            [6, 1081],
            [8, 185],
            [10, 77],
            [21, 33]
          ],
          "2021": [
            [11, 35],
            [2, 417],
            [3, 1068],
            [4, 1350],
            [6, 1090],
            [8, 200],
            [10, 74],
            [21, 35]
          ],
          "2022": [
            [11, 33],
            [2, 416],
            [3, 1061],
            [4, 1365],
            [6, 1084],
            [8, 200],
            [10, 73],
            [21, 36]
          ],
          "2023": [
            [11, 34],
            [2, 422],
            [3, 1046],
            [4, 1340],
            [6, 1075],
            [8, 194],
            [10, 71],
            [21, 35]
          ],
          "2024": [
            [11, 31],
            [2, 424],
            [3, 1054],
            [4, 1376],
            [6, 1073],
            [8, 197],
            [10, 68],
            [21, 36]
          ]
        },
        "oElek": {
          "2020": [
            [11, 39],
            [2, 388],
            [3, 955],
            [4, 1208],
            [6, 861],
            [8, 101],
            [10, 32],
            [21, 14]
          ],
          "2021": [
            [11, 39],
            [2, 386],
            [3, 924],
            [4, 1168],
            [6, 858],
            [8, 103],
            [10, 35],
            [21, 14]
          ],
          "2022": [
            [11, 42],
            [2, 397],
            [3, 942],
            [4, 1193],
            [6, 833],
            [8, 103],
            [10, 38],
            [21, 16]
          ],
          "2023": [
            [11, 41],
            [2, 399],
            [3, 914],
            [4, 1150],
            [6, 806],
            [8, 106],
            [10, 36],
            [21, 16]
          ],
          "2024": [
            [11, 40],
            [2, 394],
            [3, 919],
            [4, 1196],
            [6, 820],
            [8, 111],
            [10, 34],
            [21, 16]
          ]
        },
        "k1": "Overig",
        "k2": ""
      },
      {
        "name": "Gebouw bij militaire inrichting",
        "gas": [162.769971, 195.827184, 181.016162, 177.992597, 174.500073],
        "elek": [439.130966, 518.485461, 525.097085, 568.508249, 595.18111],
        "elekIncl": [439.130966, 518.485461, 525.097085, 568.508249, 599.797652],
        "zon": [null, null, null, null, null],
        "pv": [null, null, null, null, null],
        "pGas": [18, 18, 19, 19, 19],
        "pElek": [12, 13, 13, 13, 13],
        "pZon": [12, 13, 13, 13, 13],
        "oGas": {},
        "oElek": {},
        "k1": "n.v.t.",
        "k2": ""
      },
      {
        "name": "Gebouw bij spooremplacement",
        "gas": [6.918216, 8.275198, 6.573031, 7.415582, 6.469965],
        "elek": [48.786643, 54.510063, 57.132201, 53.228625, 55.425133],
        "elekIncl": [49.154643, 55.011722, 57.550119, 54.345554, 56.850267],
        "zon": [null, null, null, null, null],
        "pv": [null, null, null, null, 0.183],
        "pGas": [84, 84, 83, 84, 87],
        "pElek": [69, 67, 67, 69, 71],
        "pZon": [69, 67, 67, 69, 71],
        "oGas": {
          "2020": [
            [13, 15],
            [4, 17],
            [6, 13],
            [9, 21],
            [21, 18]
          ],
          "2021": [
            [13, 14],
            [4, 20],
            [6, 12],
            [9, 20],
            [21, 18]
          ],
          "2022": [
            [13, 15],
            [4, 19],
            [6, 11],
            [9, 19],
            [21, 19]
          ],
          "2023": [
            [13, 18],
            [4, 17],
            [6, 11],
            [9, 19],
            [21, 19]
          ],
          "2024": [
            [13, 19],
            [4, 18],
            [6, 10],
            [9, 20],
            [21, 20]
          ]
        },
        "oElek": {
          "2020": [
            [13, 19],
            [5, 21],
            [8, 12],
            [20, 17]
          ],
          "2021": [
            [13, 19],
            [4, 12],
            [6, 10],
            [9, 14],
            [21, 12]
          ],
          "2022": [
            [13, 18],
            [4, 13],
            [7, 20],
            [20, 16]
          ],
          "2023": [
            [13, 18],
            [5, 20],
            [9, 17],
            [21, 14]
          ],
          "2024": [
            [13, 18],
            [5, 22],
            [8, 14],
            [20, 17]
          ]
        },
        "k1": "n.v.t.",
        "k2": ""
      },
      {
        "name": "Gebouw bij vliegveld of luchthaven",
        "gas": [8.053177, 8.119826, 6.284814, 5.756256, 5.489164],
        "elek": [64.842257, 63.305664, 66.297136, 42.09417, 64.207088],
        "elekIncl": [66.377285, 68.321386, 87.561341, 44.308339, 67.06001],
        "zon": [null, null, null, null, null],
        "pv": [0.124, 0.161, 0.201, 0.233, 0.268],
        "pGas": [163, 167, 167, 165, 171],
        "pElek": [137, 143, 149, 129, 157],
        "pZon": [137, 143, 149, 129, 157],
        "oGas": {
          "2020": [
            [12, 17],
            [3, 26],
            [4, 36],
            [6, 41],
            [8, 25],
            [20, 18]
          ],
          "2021": [
            [12, 19],
            [3, 27],
            [4, 38],
            [6, 41],
            [8, 24],
            [20, 18]
          ],
          "2022": [
            [12, 19],
            [3, 25],
            [4, 41],
            [6, 39],
            [8, 24],
            [20, 19]
          ],
          "2023": [
            [12, 19],
            [3, 26],
            [4, 39],
            [6, 40],
            [8, 25],
            [20, 16]
          ],
          "2024": [
            [12, 19],
            [3, 25],
            [4, 42],
            [6, 40],
            [8, 24],
            [20, 21]
          ]
        },
        "oElek": {
          "2020": [
            [12, 17],
            [3, 19],
            [4, 31],
            [6, 34],
            [8, 17],
            [20, 19]
          ],
          "2021": [
            [12, 17],
            [3, 16],
            [4, 37],
            [6, 35],
            [8, 19],
            [20, 19]
          ],
          "2022": [
            [12, 19],
            [3, 18],
            [4, 37],
            [6, 34],
            [8, 21],
            [10, 10],
            [21, 10]
          ],
          "2023": [
            [12, 19],
            [3, 18],
            [4, 33],
            [6, 30],
            [8, 17],
            [20, 12]
          ],
          "2024": [
            [12, 21],
            [3, 19],
            [4, 40],
            [6, 34],
            [8, 23],
            [10, 10],
            [21, 10]
          ]
        },
        "k1": "n.v.t.",
        "k2": ""
      },
      {
        "name": "Gebouw in landelijk gebied voor industrie (geen landbouwactiviteiten geregistreerd)",
        "gas": [5.814286, 6.299259, 4.785844, 4.237166, 3.613142],
        "elek": [53.27355, 50.083763, 46.744731, 47.028863, 45.738521],
        "elekIncl": [60.179849, 58.383443, 56.631463, 60.377707, 58.50652],
        "zon": [12.688609, 21.821571, 32.096336, 33.866317, 35.242928],
        "pv": [0.181, 0.222, 0.282, 0.352, 0.394],
        "pGas": [3703, 3736, 3737, 3662, 3759],
        "pElek": [4646, 4808, 4823, 4785, 5053],
        "pZon": [4646, 4808, 4823, 4785, 5053],
        "oGas": {
          "2020": [
            [0, 22],
            [1, 125],
            [2, 570],
            [3, 779],
            [4, 823],
            [6, 865],
            [8, 336],
            [10, 124],
            [21, 59]
          ],
          "2021": [
            [0, 24],
            [1, 128],
            [2, 589],
            [3, 791],
            [4, 814],
            [6, 868],
            [8, 330],
            [10, 133],
            [21, 59]
          ],
          "2022": [
            [0, 24],
            [1, 129],
            [2, 582],
            [3, 788],
            [4, 814],
            [6, 874],
            [8, 329],
            [10, 138],
            [21, 59]
          ],
          "2023": [
            [0, 19],
            [1, 126],
            [2, 564],
            [3, 773],
            [4, 800],
            [6, 859],
            [8, 324],
            [10, 138],
            [21, 59]
          ],
          "2024": [
            [0, 17],
            [1, 128],
            [2, 581],
            [3, 798],
            [4, 821],
            [6, 877],
            [8, 339],
            [10, 139],
            [21, 59]
          ]
        },
        "oElek": {
          "2020": [
            [0, 86],
            [1, 242],
            [2, 813],
            [3, 971],
            [4, 1004],
            [6, 988],
            [8, 343],
            [10, 144],
            [21, 55]
          ],
          "2021": [
            [0, 102],
            [1, 253],
            [2, 889],
            [3, 982],
            [4, 1024],
            [6, 1013],
            [8, 337],
            [10, 157],
            [21, 51]
          ],
          "2022": [
            [0, 106],
            [1, 254],
            [2, 881],
            [3, 986],
            [4, 1030],
            [6, 1013],
            [8, 339],
            [10, 162],
            [21, 52]
          ],
          "2023": [
            [0, 101],
            [1, 255],
            [2, 868],
            [3, 972],
            [4, 1017],
            [6, 1029],
            [8, 332],
            [10, 165],
            [21, 46]
          ],
          "2024": [
            [0, 102],
            [1, 281],
            [2, 940],
            [3, 991],
            [4, 1090],
            [6, 1074],
            [8, 360],
            [10, 165],
            [21, 50]
          ]
        },
        "k1": "n.v.t.",
        "k2": ""
      },
      {
        "name": "Gebouw in stedelijk gebied met industriefunctie",
        "gas": [6.672027, 7.077394, 5.761336, 5.050681, 4.41117],
        "elek": [59.195989, 54.441225, 54.360898, 54.414093, 53.089438],
        "elekIncl": [61.420981, 56.542932, 57.466585, 58.433246, 57.803669],
        "zon": [3.667814, 4.249706, 8.74898, 7.842992, 10.282849],
        "pv": [0.102, 0.124, 0.166, 0.22, 0.254],
        "pGas": [12358, 12503, 12416, 12076, 12388],
        "pElek": [13083, 13354, 13357, 13069, 13663],
        "pZon": [13083, 13354, 13357, 13069, 13663],
        "oGas": {
          "2020": [
            [0, 285],
            [1, 985],
            [2, 3063],
            [3, 2912],
            [4, 2399],
            [6, 1758],
            [8, 573],
            [10, 243],
            [21, 140]
          ],
          "2021": [
            [0, 295],
            [1, 981],
            [2, 3123],
            [3, 2920],
            [4, 2424],
            [6, 1783],
            [8, 565],
            [10, 258],
            [21, 154]
          ],
          "2022": [
            [0, 288],
            [1, 970],
            [2, 3092],
            [3, 2916],
            [4, 2404],
            [6, 1774],
            [8, 561],
            [10, 259],
            [21, 152]
          ],
          "2023": [
            [0, 279],
            [1, 943],
            [2, 3015],
            [3, 2837],
            [4, 2335],
            [6, 1716],
            [8, 547],
            [10, 256],
            [21, 148]
          ],
          "2024": [
            [0, 292],
            [1, 969],
            [2, 3096],
            [3, 2917],
            [4, 2391],
            [6, 1778],
            [8, 551],
            [10, 248],
            [21, 146]
          ]
        },
        "oElek": {
          "2020": [
            [0, 516],
            [1, 1359],
            [2, 3279],
            [3, 2978],
            [4, 2309],
            [6, 1689],
            [8, 556],
            [10, 251],
            [21, 146]
          ],
          "2021": [
            [0, 521],
            [1, 1347],
            [2, 3341],
            [3, 3011],
            [4, 2361],
            [6, 1736],
            [8, 583],
            [10, 276],
            [21, 178]
          ],
          "2022": [
            [0, 578],
            [1, 1334],
            [2, 3311],
            [3, 2993],
            [4, 2361],
            [6, 1744],
            [8, 575],
            [10, 279],
            [21, 182]
          ],
          "2023": [
            [0, 530],
            [1, 1314],
            [2, 3281],
            [3, 2927],
            [4, 2284],
            [6, 1711],
            [8, 566],
            [10, 274],
            [21, 182]
          ],
          "2024": [
            [0, 580],
            [1, 1356],
            [2, 3468],
            [3, 3065],
            [4, 2374],
            [6, 1794],
            [8, 564],
            [10, 285],
            [21, 177]
          ]
        },
        "k1": "n.v.t.",
        "k2": ""
      },
      {
        "name": "Gebouw op snelwegverzorgingsplaats",
        "gas": [18.592594, 17.688335, 15.860469, 15.480359, 11.544351],
        "elek": [320.169219, 346.743924, 363.256765, 390.791549, 430.339216],
        "elekIncl": [329.898053, 363.053611, 371.745037, 407.650113, 436.033968],
        "zon": [null, null, null, null, 7.062754],
        "pv": [null, null, 0.144, 0.132, 0.184],
        "pGas": [62, 62, 61, 58, 63],
        "pElek": [123, 128, 132, 144, 152],
        "pZon": [123, 128, 132, 144, 152],
        "oGas": {},
        "oElek": {},
        "k1": "n.v.t.",
        "k2": ""
      },
      {
        "name": "Gebouw op vakantiepark",
        "gas": [10.702158, 12.266615, 9.838354, 8.918693, 8.723565],
        "elek": [32.967202, 35.402702, 33.192158, 31.219917, 31.757036],
        "elekIncl": [36.499681, 38.898168, 36.968454, 35.377603, 36.542598],
        "zon": [null, null, 11.147675, 9.830904, 11.661644],
        "pv": [null, null, 0.135, 0.187, 0.225],
        "pGas": [34901, 35673, 36605, 37098, 38109],
        "pElek": [34545, 35406, 36863, 37975, 39605],
        "pZon": [34545, 35406, 36863, 37975, 39605],
        "oGas": {
          "2020": [
            [0, 3018],
            [1, 23118],
            [2, 7795],
            [3, 501],
            [4, 285],
            [6, 153],
            [19, 31]
          ],
          "2021": [
            [0, 2941],
            [1, 23241],
            [2, 8511],
            [3, 494],
            [4, 305],
            [6, 152],
            [19, 29]
          ],
          "2022": [
            [0, 2944],
            [1, 23730],
            [2, 8957],
            [3, 498],
            [4, 303],
            [6, 144],
            [19, 29]
          ],
          "2023": [
            [0, 2882],
            [1, 24472],
            [2, 8749],
            [3, 521],
            [4, 298],
            [6, 151],
            [19, 25]
          ],
          "2024": [
            [0, 2963],
            [1, 25142],
            [2, 8962],
            [3, 550],
            [4, 311],
            [6, 154],
            [19, 27]
          ]
        },
        "oElek": {
          "2020": [
            [0, 3238],
            [1, 22492],
            [2, 7831],
            [3, 487],
            [4, 305],
            [6, 160],
            [8, 22],
            [20, 10]
          ],
          "2021": [
            [0, 3151],
            [1, 22633],
            [2, 8605],
            [3, 502],
            [4, 324],
            [6, 161],
            [8, 20],
            [20, 10]
          ],
          "2022": [
            [0, 3132],
            [1, 23482],
            [2, 9224],
            [3, 521],
            [4, 319],
            [6, 152],
            [8, 22],
            [20, 11]
          ],
          "2023": [
            [0, 3213],
            [1, 24519],
            [2, 9222],
            [3, 538],
            [4, 300],
            [6, 156],
            [8, 17],
            [20, 10]
          ],
          "2024": [
            [0, 3383],
            [1, 25627],
            [2, 9535],
            [3, 562],
            [4, 312],
            [6, 156],
            [19, 30]
          ]
        },
        "k1": "Vakantiepark",
        "k2": ""
      },
      {
        "name": "Gebouw voor landbouwactiviteiten",
        "gas": [67.315254, 85.894571, 62.928224, 61.145816, 60.851979],
        "elek": [72.51125, 81.917058, 80.802706, 80.153195, 82.198463],
        "elekIncl": [78.273863, 89.522013, 90.72169, 91.683929, 93.234484],
        "zon": [11.256942, 16.580443, 23.379403, 26.169716, 28.389293],
        "pv": [0.239, 0.283, 0.356, 0.436, 0.47],
        "pGas": [2101, 2101, 2143, 2093, 2143],
        "pElek": [2360, 2403, 2459, 2388, 2455],
        "pZon": [2360, 2403, 2459, 2388, 2455],
        "oGas": {
          "2020": [
            [0, 25],
            [1, 63],
            [2, 800],
            [3, 291],
            [4, 256],
            [6, 305],
            [8, 142],
            [10, 101],
            [21, 118]
          ],
          "2021": [
            [0, 20],
            [1, 65],
            [2, 819],
            [3, 288],
            [4, 254],
            [6, 312],
            [8, 143],
            [10, 100],
            [21, 100]
          ],
          "2022": [
            [0, 19],
            [1, 68],
            [2, 852],
            [3, 293],
            [4, 256],
            [6, 307],
            [8, 144],
            [10, 103],
            [21, 101]
          ],
          "2023": [
            [0, 21],
            [1, 61],
            [2, 841],
            [3, 280],
            [4, 251],
            [6, 295],
            [8, 140],
            [10, 106],
            [21, 98]
          ],
          "2024": [
            [0, 21],
            [1, 57],
            [2, 863],
            [3, 297],
            [4, 259],
            [6, 299],
            [8, 141],
            [10, 102],
            [21, 104]
          ]
        },
        "oElek": {
          "2020": [
            [0, 26],
            [1, 84],
            [2, 863],
            [3, 343],
            [4, 319],
            [6, 381],
            [8, 162],
            [10, 87],
            [21, 95]
          ],
          "2021": [
            [0, 23],
            [1, 86],
            [2, 885],
            [3, 351],
            [4, 322],
            [6, 401],
            [8, 164],
            [10, 91],
            [21, 80]
          ],
          "2022": [
            [0, 23],
            [1, 86],
            [2, 916],
            [3, 358],
            [4, 321],
            [6, 404],
            [8, 171],
            [10, 95],
            [21, 85]
          ],
          "2023": [
            [0, 25],
            [1, 82],
            [2, 900],
            [3, 340],
            [4, 311],
            [6, 390],
            [8, 171],
            [10, 94],
            [21, 75]
          ],
          "2024": [
            [0, 25],
            [1, 85],
            [2, 929],
            [3, 348],
            [4, 320],
            [6, 403],
            [8, 177],
            [10, 93],
            [21, 75]
          ]
        },
        "k1": "n.v.t.",
        "k2": ""
      },
      {
        "name": "Groothandel op bedrijventerrein",
        "gas": [3.520042, 3.943133, 3.184248, 2.72261, 2.420176],
        "elek": [27.236993, 27.307366, 27.189701, 26.078969, 25.946504],
        "elekIncl": [28.807048, 29.017183, 29.18769, 28.262063, 28.235355],
        "zon": [2.674644, 3.742285, 5.889074, 5.909008, 5.882399],
        "pv": [0.163, 0.195, 0.273, 0.351, 0.387],
        "pGas": [552, 568, 565, 559, 566],
        "pElek": [569, 589, 596, 581, 591],
        "pZon": [569, 589, 596, 581, 591],
        "oGas": {
          "2020": [
            [13, 24],
            [4, 51],
            [6, 183],
            [8, 162],
            [10, 94],
            [21, 38]
          ],
          "2021": [
            [13, 26],
            [4, 54],
            [6, 190],
            [8, 160],
            [10, 96],
            [21, 42]
          ],
          "2022": [
            [13, 25],
            [4, 54],
            [6, 188],
            [8, 161],
            [10, 96],
            [21, 41]
          ],
          "2023": [
            [13, 22],
            [4, 57],
            [6, 183],
            [8, 157],
            [10, 98],
            [21, 42]
          ],
          "2024": [
            [13, 22],
            [4, 59],
            [6, 186],
            [8, 156],
            [10, 100],
            [21, 43]
          ]
        },
        "oElek": {
          "2020": [
            [13, 26],
            [4, 52],
            [6, 196],
            [8, 165],
            [10, 92],
            [21, 38]
          ],
          "2021": [
            [13, 28],
            [4, 52],
            [6, 205],
            [8, 168],
            [10, 93],
            [21, 43]
          ],
          "2022": [
            [13, 27],
            [4, 58],
            [6, 203],
            [8, 169],
            [10, 96],
            [21, 43]
          ],
          "2023": [
            [13, 22],
            [4, 59],
            [6, 198],
            [8, 165],
            [10, 93],
            [21, 44]
          ],
          "2024": [
            [13, 23],
            [4, 60],
            [6, 202],
            [8, 165],
            [10, 96],
            [21, 45]
          ]
        },
        "k1": "Bedrijfshal",
        "k2": ""
      },
      {
        "name": "Hotel (of ander groot logiesgebouw)",
        "gas": [11.104869, 10.823191, 9.900865, 9.868295, 9.057429],
        "elek": [72.938985, 68.645744, 75.471754, 75.701339, 76.254597],
        "elekIncl": [73.879755, 69.8447, 76.728111, 77.191082, 77.858503],
        "zon": [null, 1.80612, 2.597097, 2.040819, 2.925497],
        "pv": [null, 0.101, 0.138, 0.18, 0.214],
        "pGas": [2380, 2374, 2386, 2380, 2449],
        "pElek": [2440, 2439, 2495, 2499, 2600],
        "pZon": [2440, 2439, 2495, 2499, 2600],
        "oGas": {
          "2020": [
            [12, 215],
            [3, 628],
            [4, 556],
            [6, 475],
            [8, 234],
            [10, 159],
            [21, 113]
          ],
          "2021": [
            [12, 213],
            [3, 659],
            [4, 548],
            [6, 459],
            [8, 227],
            [10, 148],
            [21, 120]
          ],
          "2022": [
            [12, 215],
            [3, 671],
            [4, 546],
            [6, 459],
            [8, 228],
            [10, 149],
            [21, 118]
          ],
          "2023": [
            [12, 203],
            [3, 668],
            [4, 556],
            [6, 451],
            [8, 234],
            [10, 150],
            [21, 118]
          ],
          "2024": [
            [12, 207],
            [3, 682],
            [4, 575],
            [6, 470],
            [8, 239],
            [10, 154],
            [21, 122]
          ]
        },
        "oElek": {
          "2020": [
            [11, 12],
            [2, 215],
            [3, 616],
            [4, 553],
            [6, 500],
            [8, 250],
            [10, 172],
            [21, 122]
          ],
          "2021": [
            [12, 224],
            [3, 647],
            [4, 542],
            [6, 476],
            [8, 249],
            [10, 165],
            [21, 136]
          ],
          "2022": [
            [12, 228],
            [3, 672],
            [4, 552],
            [6, 492],
            [8, 250],
            [10, 164],
            [21, 137]
          ],
          "2023": [
            [12, 212],
            [3, 686],
            [4, 550],
            [6, 482],
            [8, 262],
            [10, 170],
            [21, 137]
          ],
          "2024": [
            [12, 225],
            [3, 705],
            [4, 584],
            [6, 503],
            [8, 272],
            [10, 172],
            [21, 139]
          ]
        },
        "k1": "Hotel",
        "k2": ""
      },
      {
        "name": "IJsbaan",
        "gas": [6.948678, 6.825271, 5.453944, 2.6705, 2.012394],
        "elek": [95.025308, 69.032767, 67.887973, 46.854106, 77.004135],
        "elekIncl": [96.066642, 69.426023, 69.700091, 48.996344, 83.042534],
        "zon": [1.412456, 0.995635, 2.969799, 4.355493, 14.85202],
        "pv": [0.156, 0.152, 0.21, 0.24, 0.272],
        "pGas": [121, 120, 118, 122, 121],
        "pElek": [96, 105, 100, 100, 114],
        "pZon": [96, 105, 100, 100, 114],
        "oGas": {
          "2020": [
            [11, 34],
            [2, 61],
            [16, 26]
          ],
          "2021": [
            [11, 35],
            [2, 60],
            [16, 25]
          ],
          "2022": [
            [11, 36],
            [2, 58],
            [16, 24]
          ],
          "2023": [
            [11, 37],
            [2, 62],
            [16, 23]
          ],
          "2024": [
            [11, 39],
            [2, 58],
            [16, 24]
          ]
        },
        "oElek": {
          "2020": [
            [11, 28],
            [2, 49],
            [16, 19]
          ],
          "2021": [
            [11, 37],
            [2, 50],
            [16, 18]
          ],
          "2022": [
            [11, 37],
            [2, 47],
            [16, 16]
          ],
          "2023": [
            [11, 37],
            [2, 48],
            [16, 15]
          ],
          "2024": [
            [11, 44],
            [2, 53],
            [16, 17]
          ]
        },
        "k1": "n.v.t.",
        "k2": ""
      },
      {
        "name": "Kantoorpand algemeen",
        "gas": [7.316926, 7.939016, 6.520368, 5.974766, 5.354351],
        "elek": [57.202975, 52.857872, 53.419828, 53.018255, 52.019291],
        "elekIncl": [58.938921, 54.526205, 55.794996, 56.31796, 55.049982],
        "zon": [3.155508, 3.62953, 5.114933, 5.89614, 6.122585],
        "pv": [0.107, 0.132, 0.174, 0.229, 0.272],
        "pGas": [19858, 19929, 19758, 19239, 19634],
        "pElek": [20777, 20814, 20883, 20471, 21054],
        "pZon": [20777, 20814, 20883, 20471, 21054],
        "oGas": {
          "2020": [
            [0, 190],
            [1, 955],
            [2, 4117],
            [3, 4584],
            [4, 4076],
            [6, 3619],
            [8, 1445],
            [10, 606],
            [21, 266]
          ],
          "2021": [
            [0, 184],
            [1, 948],
            [2, 4140],
            [3, 4656],
            [4, 4074],
            [6, 3589],
            [8, 1426],
            [10, 632],
            [21, 280]
          ],
          "2022": [
            [0, 187],
            [1, 950],
            [2, 4124],
            [3, 4610],
            [4, 4027],
            [6, 3541],
            [8, 1436],
            [10, 609],
            [21, 274]
          ],
          "2023": [
            [0, 184],
            [1, 939],
            [2, 4028],
            [3, 4453],
            [4, 3935],
            [6, 3462],
            [8, 1386],
            [10, 591],
            [21, 261]
          ],
          "2024": [
            [0, 183],
            [1, 949],
            [2, 4084],
            [3, 4539],
            [4, 4038],
            [6, 3538],
            [8, 1426],
            [10, 617],
            [21, 260]
          ]
        },
        "oElek": {
          "2020": [
            [0, 296],
            [1, 1123],
            [2, 4282],
            [3, 4673],
            [4, 4175],
            [6, 3753],
            [8, 1507],
            [10, 652],
            [21, 316]
          ],
          "2021": [
            [0, 278],
            [1, 1098],
            [2, 4303],
            [3, 4725],
            [4, 4151],
            [6, 3753],
            [8, 1498],
            [10, 670],
            [21, 338]
          ],
          "2022": [
            [0, 289],
            [1, 1128],
            [2, 4307],
            [3, 4731],
            [4, 4170],
            [6, 3749],
            [8, 1509],
            [10, 661],
            [21, 339]
          ],
          "2023": [
            [0, 290],
            [1, 1113],
            [2, 4168],
            [3, 4604],
            [4, 4113],
            [6, 3697],
            [8, 1496],
            [10, 658],
            [21, 332]
          ],
          "2024": [
            [0, 303],
            [1, 1150],
            [2, 4288],
            [3, 4735],
            [4, 4253],
            [6, 3794],
            [8, 1529],
            [10, 670],
            [21, 332]
          ]
        },
        "k1": "Kantoor",
        "k2": ""
      },
      {
        "name": "Kinderopvang (gebouw)",
        "gas": [10.235519, 11.603132, 9.837897, 9.348572, 8.838269],
        "elek": [30.950436, 30.149472, 30.973627, 30.855154, 30.493834],
        "elekIncl": [32.727461, 31.469446, 32.893992, 33.059422, 33.299784],
        "zon": [null, 2.665823, 3.950131, 4.509677, 5.577297],
        "pv": [null, 0.105, 0.126, 0.18, 0.214],
        "pGas": [1481, 1498, 1499, 1477, 1500],
        "pElek": [1520, 1530, 1544, 1528, 1567],
        "pZon": [1520, 1530, 1544, 1528, 1567],
        "oGas": {
          "2020": [
            [11, 21],
            [2, 253],
            [3, 450],
            [4, 509],
            [6, 221],
            [19, 27]
          ],
          "2021": [
            [11, 23],
            [2, 257],
            [3, 449],
            [4, 519],
            [6, 219],
            [19, 31]
          ],
          "2022": [
            [11, 24],
            [2, 258],
            [3, 450],
            [4, 516],
            [6, 218],
            [19, 33]
          ],
          "2023": [
            [11, 24],
            [2, 252],
            [3, 446],
            [4, 509],
            [6, 213],
            [19, 33]
          ],
          "2024": [
            [11, 24],
            [2, 265],
            [3, 449],
            [4, 510],
            [6, 218],
            [19, 34]
          ]
        },
        "oElek": {
          "2020": [
            [11, 38],
            [2, 260],
            [3, 463],
            [4, 517],
            [6, 220],
            [19, 22]
          ],
          "2021": [
            [11, 40],
            [2, 263],
            [3, 462],
            [4, 520],
            [6, 222],
            [19, 23]
          ],
          "2022": [
            [11, 42],
            [2, 262],
            [3, 472],
            [4, 525],
            [6, 219],
            [19, 24]
          ],
          "2023": [
            [11, 44],
            [2, 261],
            [3, 464],
            [4, 518],
            [6, 217],
            [19, 24]
          ],
          "2024": [
            [11, 43],
            [2, 273],
            [3, 472],
            [4, 531],
            [6, 222],
            [19, 26]
          ]
        },
        "k1": "Kinderopvang",
        "k2": ""
      },
      {
        "name": "Koelhuis",
        "gas": [3.187792, 3.821034, 3.429535, 3.056727, 2.086515],
        "elek": [239.75142, 238.56185, 235.381866, 227.545545, 226.066547],
        "elekIncl": [250.385026, 251.011998, 248.219654, 243.701401, 242.852721],
        "zon": [13.747757, 21.716068, 24.003808, 25.207577, 29.7352],
        "pv": [0.271, 0.337, 0.347, 0.376, 0.432],
        "pGas": [87, 86, 85, 85, 83],
        "pElek": [96, 95, 95, 93, 95],
        "pZon": [96, 95, 95, 93, 95],
        "oGas": {
          "2020": [
            [15, 18],
            [8, 13],
            [10, 23],
            [21, 33]
          ],
          "2021": [
            [15, 15],
            [8, 16],
            [10, 24],
            [21, 31]
          ],
          "2022": [
            [15, 15],
            [8, 16],
            [10, 24],
            [21, 30]
          ],
          "2023": [
            [15, 15],
            [8, 16],
            [10, 25],
            [21, 29]
          ],
          "2024": [
            [15, 14],
            [8, 16],
            [10, 25],
            [21, 28]
          ]
        },
        "oElek": {
          "2020": [
            [15, 15],
            [8, 15],
            [10, 30],
            [21, 36]
          ],
          "2021": [
            [15, 11],
            [8, 18],
            [10, 30],
            [21, 36]
          ],
          "2022": [
            [15, 12],
            [8, 17],
            [10, 30],
            [21, 36]
          ],
          "2023": [
            [15, 12],
            [8, 17],
            [10, 29],
            [21, 35]
          ],
          "2024": [
            [15, 11],
            [8, 18],
            [10, 30],
            [21, 36]
          ]
        },
        "k1": "Koel/vrieshuis",
        "k2": ""
      },
      {
        "name": "MBO-gebouw",
        "gas": [3.147344, 4.515236, 2.954318, 4.055304, 3.533531],
        "elek": [58.374856, 65.076792, 63.533818, 63.725673, 60.471046],
        "elekIncl": [59.43127, 66.274819, 64.829246, 64.945011, 62.37861],
        "zon": [null, null, null, null, null],
        "pv": [null, null, null, null, null],
        "pGas": [11, 10, 10, 10, 10],
        "pElek": [17, 16, 16, 16, 16],
        "pZon": [17, 16, 16, 16, 16],
        "oGas": {},
        "oElek": {},
        "k1": "Universiteit/HBO/MBO",
        "k2": ""
      },
      {
        "name": "Meergezinswoning met andere functie of combinatie van functies",
        "gas": [8.431639, 9.458588, 7.410937, 6.571803, 6.46952],
        "elek": [38.737592, 38.344908, 37.97685, 36.301575, 37.12111],
        "elekIncl": [40.455658, 39.583423, 39.857389, 38.501067, 39.698231],
        "zon": [2.31749, 2.885447, 4.810612, 5.571606, 6.399772],
        "pv": [0.1, 0.121, 0.159, 0.203, 0.238],
        "pGas": [17323, 17489, 17537, 17428, 17624],
        "pElek": [17513, 17654, 17700, 17590, 17949],
        "pZon": [17513, 17654, 17700, 17590, 17949],
        "oGas": {
          "2020": [
            [11, 93],
            [2, 3372],
            [3, 6996],
            [4, 4849],
            [6, 1689],
            [8, 226],
            [10, 65],
            [21, 33]
          ],
          "2021": [
            [11, 102],
            [2, 3465],
            [3, 7100],
            [4, 4782],
            [6, 1700],
            [8, 233],
            [10, 67],
            [21, 40]
          ],
          "2022": [
            [11, 94],
            [2, 3454],
            [3, 7178],
            [4, 4805],
            [6, 1662],
            [8, 235],
            [10, 68],
            [21, 41]
          ],
          "2023": [
            [11, 80],
            [2, 3414],
            [3, 7166],
            [4, 4784],
            [6, 1647],
            [8, 231],
            [10, 66],
            [21, 40]
          ],
          "2024": [
            [11, 87],
            [2, 3467],
            [3, 7260],
            [4, 4815],
            [6, 1663],
            [8, 229],
            [10, 63],
            [21, 40]
          ]
        },
        "oElek": {
          "2020": [
            [11, 117],
            [2, 3461],
            [3, 7110],
            [4, 4899],
            [6, 1629],
            [8, 204],
            [10, 63],
            [21, 30]
          ],
          "2021": [
            [11, 126],
            [2, 3548],
            [3, 7206],
            [4, 4806],
            [6, 1660],
            [8, 211],
            [10, 60],
            [21, 37]
          ],
          "2022": [
            [11, 108],
            [2, 3543],
            [3, 7276],
            [4, 4841],
            [6, 1621],
            [8, 216],
            [10, 58],
            [21, 37]
          ],
          "2023": [
            [11, 98],
            [2, 3488],
            [3, 7289],
            [4, 4814],
            [6, 1594],
            [8, 213],
            [10, 59],
            [21, 35]
          ],
          "2024": [
            [11, 99],
            [2, 3563],
            [3, 7428],
            [4, 4929],
            [6, 1625],
            [8, 211],
            [10, 60],
            [21, 34]
          ]
        },
        "k1": "n.v.t.",
        "k2": ""
      },
      {
        "name": "Meergezinswoning met cafe of restaurant",
        "gas": [13.137442, 14.361005, 12.01886, 11.067207, 11.017056],
        "elek": [77.046187, 71.951972, 77.771405, 77.980818, 80.567007],
        "elekIncl": [77.615231, 72.430166, 78.442736, 78.849129, 81.710356],
        "zon": [null, null, null, null, 1.9641],
        "pv": [null, null, null, null, 0.101],
        "pGas": [6315, 6293, 6296, 6245, 6320],
        "pElek": [6307, 6274, 6268, 6227, 6339],
        "pZon": [6307, 6274, 6268, 6227, 6339],
        "oGas": {
          "2020": [
            [11, 35],
            [2, 1368],
            [3, 3201],
            [4, 1417],
            [6, 261],
            [19, 33]
          ],
          "2021": [
            [11, 34],
            [2, 1437],
            [3, 3185],
            [4, 1355],
            [6, 248],
            [19, 34]
          ],
          "2022": [
            [11, 36],
            [2, 1420],
            [3, 3200],
            [4, 1362],
            [6, 246],
            [19, 32]
          ],
          "2023": [
            [11, 33],
            [2, 1385],
            [3, 3194],
            [4, 1352],
            [6, 250],
            [19, 31]
          ],
          "2024": [
            [11, 30],
            [2, 1396],
            [3, 3237],
            [4, 1370],
            [6, 252],
            [19, 35]
          ]
        },
        "oElek": {
          "2020": [
            [11, 40],
            [2, 1363],
            [3, 3218],
            [4, 1408],
            [6, 255],
            [19, 23]
          ],
          "2021": [
            [11, 32],
            [2, 1439],
            [3, 3181],
            [4, 1346],
            [6, 250],
            [19, 26]
          ],
          "2022": [
            [11, 32],
            [2, 1423],
            [3, 3190],
            [4, 1350],
            [6, 248],
            [19, 25]
          ],
          "2023": [
            [11, 28],
            [2, 1394],
            [3, 3194],
            [4, 1336],
            [6, 251],
            [19, 24]
          ],
          "2024": [
            [11, 29],
            [2, 1404],
            [3, 3268],
            [4, 1359],
            [6, 253],
            [19, 26]
          ]
        },
        "k1": "n.v.t.",
        "k2": ""
      },
      {
        "name": "Meergezinswoning met winkel",
        "gas": [8.834326, 9.961521, 7.661734, 6.717655, 6.753277],
        "elek": [50.985326, 49.795983, 48.840342, 46.25489, 47.885293],
        "elekIncl": [51.530222, 50.283857, 49.54687, 47.126839, 48.944969],
        "zon": [null, null, null, null, 1.955161],
        "pv": [null, null, null, null, 0.124],
        "pGas": [22272, 22274, 22330, 22217, 22394],
        "pElek": [22262, 22180, 22202, 22101, 22455],
        "pZon": [22262, 22180, 22202, 22101, 22455],
        "oGas": {
          "2020": [
            [11, 108],
            [2, 4970],
            [3, 10457],
            [4, 5174],
            [6, 1437],
            [8, 102],
            [10, 11],
            [21, 13]
          ],
          "2021": [
            [11, 136],
            [2, 5103],
            [3, 10463],
            [4, 4937],
            [6, 1494],
            [8, 118],
            [10, 12],
            [21, 11]
          ],
          "2022": [
            [0, 10],
            [1, 121],
            [2, 5079],
            [3, 10546],
            [4, 4948],
            [6, 1479],
            [8, 122],
            [10, 14],
            [21, 11]
          ],
          "2023": [
            [0, 11],
            [1, 113],
            [2, 5007],
            [3, 10531],
            [4, 4947],
            [6, 1463],
            [8, 122],
            [20, 23]
          ],
          "2024": [
            [11, 123],
            [2, 5057],
            [3, 10598],
            [4, 5020],
            [6, 1448],
            [8, 126],
            [20, 22]
          ]
        },
        "oElek": {
          "2020": [
            [0, 18],
            [1, 135],
            [2, 5053],
            [3, 10453],
            [4, 5158],
            [6, 1339],
            [8, 90],
            [20, 16]
          ],
          "2021": [
            [0, 17],
            [1, 154],
            [2, 5166],
            [3, 10401],
            [4, 4918],
            [6, 1406],
            [8, 102],
            [20, 16]
          ],
          "2022": [
            [0, 16],
            [1, 135],
            [2, 5145],
            [3, 10487],
            [4, 4917],
            [6, 1379],
            [8, 108],
            [20, 15]
          ],
          "2023": [
            [0, 17],
            [1, 124],
            [2, 5076],
            [3, 10485],
            [4, 4915],
            [6, 1359],
            [8, 110],
            [20, 15]
          ],
          "2024": [
            [0, 13],
            [1, 125],
            [2, 5175],
            [3, 10636],
            [4, 5013],
            [6, 1366],
            [8, 112],
            [20, 15]
          ]
        },
        "k1": "n.v.t.",
        "k2": ""
      },
      {
        "name": "Meergezinswoning met winkels en horeca",
        "gas": [8.663803, 9.108319, 7.378336, 6.623645, 6.560452],
        "elek": [55.298153, 55.658292, 55.921033, 52.806319, 54.828427],
        "elekIncl": [56.010868, 56.223448, 56.726641, 53.846584, 56.171982],
        "zon": [null, null, 1.543173, 1.948621, 2.585348],
        "pv": [null, null, 0.125, 0.168, 0.202],
        "pGas": [2494, 2507, 2506, 2498, 2524],
        "pElek": [2533, 2548, 2556, 2551, 2590],
        "pZon": [2533, 2548, 2556, 2551, 2590],
        "oGas": {
          "2020": [
            [12, 200],
            [3, 772],
            [4, 976],
            [6, 465],
            [8, 60],
            [10, 10],
            [21, 11]
          ],
          "2021": [
            [12, 211],
            [3, 783],
            [4, 973],
            [6, 455],
            [8, 62],
            [20, 23]
          ],
          "2022": [
            [12, 204],
            [3, 789],
            [4, 963],
            [6, 465],
            [8, 62],
            [20, 23]
          ],
          "2023": [
            [12, 196],
            [3, 777],
            [4, 973],
            [6, 469],
            [8, 59],
            [20, 24]
          ],
          "2024": [
            [12, 207],
            [3, 772],
            [4, 985],
            [6, 477],
            [8, 60],
            [20, 23]
          ]
        },
        "oElek": {
          "2020": [
            [12, 208],
            [3, 794],
            [4, 985],
            [6, 470],
            [8, 57],
            [20, 19]
          ],
          "2021": [
            [12, 223],
            [3, 796],
            [4, 984],
            [6, 463],
            [8, 61],
            [20, 21]
          ],
          "2022": [
            [12, 218],
            [3, 802],
            [4, 980],
            [6, 474],
            [8, 61],
            [20, 21]
          ],
          "2023": [
            [12, 205],
            [3, 790],
            [4, 997],
            [6, 481],
            [8, 56],
            [20, 22]
          ],
          "2024": [
            [12, 218],
            [3, 790],
            [4, 1012],
            [6, 491],
            [8, 59],
            [20, 20]
          ]
        },
        "k1": "n.v.t.",
        "k2": ""
      },
      {
        "name": "Meergezinswoning met woonzorgeenheden",
        "gas": [10.004328, 11.742458, 9.410168, 9.015389, 8.819744],
        "elek": [37.786649, 36.163866, 34.499861, 33.587039, 33.141654],
        "elekIncl": [40.697924, 38.519145, 37.721019, 37.498785, 36.523977],
        "zon": [3.015041, 3.701381, 5.581155, 7.388117, 7.125822],
        "pv": [0.162, 0.188, 0.256, 0.307, 0.343],
        "pGas": [248, 252, 262, 260, 274],
        "pElek": [278, 282, 297, 296, 321],
        "pZon": [278, 282, 297, 296, 321],
        "oGas": {
          "2020": [
            [12, 68],
            [3, 96],
            [4, 56],
            [18, 28]
          ],
          "2021": [
            [11, 11],
            [2, 68],
            [3, 92],
            [4, 53],
            [18, 28]
          ],
          "2022": [
            [11, 10],
            [2, 76],
            [3, 90],
            [4, 60],
            [18, 26]
          ],
          "2023": [
            [12, 83],
            [3, 92],
            [4, 60],
            [18, 25]
          ],
          "2024": [
            [12, 84],
            [3, 99],
            [4, 64],
            [18, 27]
          ]
        },
        "oElek": {
          "2020": [
            [11, 10],
            [2, 74],
            [3, 104],
            [4, 64],
            [18, 26]
          ],
          "2021": [
            [11, 12],
            [2, 83],
            [3, 100],
            [4, 60],
            [18, 27]
          ],
          "2022": [
            [11, 11],
            [2, 89],
            [3, 102],
            [4, 69],
            [18, 26]
          ],
          "2023": [
            [11, 11],
            [2, 88],
            [3, 103],
            [4, 68],
            [18, 26]
          ],
          "2024": [
            [11, 11],
            [2, 92],
            [3, 115],
            [4, 74],
            [18, 29]
          ]
        },
        "k1": "n.v.t.",
        "k2": ""
      },
      {
        "name": "Middelbare school",
        "gas": [6.848512, 8.387821, 6.382162, 5.832353, 4.900465],
        "elek": [33.260202, 33.968766, 33.269535, 32.483176, 32.014334],
        "elekIncl": [36.268207, 37.297152, 37.289427, 36.464063, 35.710668],
        "zon": [5.071439, 5.139814, 6.290887, 6.140709, 5.889654],
        "pv": [0.34, 0.388, 0.415, 0.43, 0.466],
        "pGas": [1057, 1063, 1059, 1054, 1065],
        "pElek": [1080, 1088, 1096, 1102, 1127],
        "pZon": [1080, 1088, 1096, 1102, 1127],
        "oGas": {
          "2020": [
            [14, 24],
            [6, 145],
            [8, 274],
            [10, 411],
            [21, 203]
          ],
          "2021": [
            [14, 27],
            [6, 139],
            [8, 267],
            [10, 408],
            [21, 222]
          ],
          "2022": [
            [14, 26],
            [6, 138],
            [8, 268],
            [10, 405],
            [21, 222]
          ],
          "2023": [
            [14, 25],
            [6, 138],
            [8, 270],
            [10, 400],
            [21, 221]
          ],
          "2024": [
            [14, 26],
            [6, 139],
            [8, 269],
            [10, 407],
            [21, 224]
          ]
        },
        "oElek": {
          "2020": [
            [14, 24],
            [6, 146],
            [8, 283],
            [10, 426],
            [21, 201]
          ],
          "2021": [
            [14, 27],
            [6, 145],
            [8, 276],
            [10, 422],
            [21, 218]
          ],
          "2022": [
            [14, 26],
            [6, 144],
            [8, 280],
            [10, 422],
            [21, 224]
          ],
          "2023": [
            [14, 24],
            [6, 147],
            [8, 279],
            [10, 424],
            [21, 228]
          ],
          "2024": [
            [14, 26],
            [6, 149],
            [8, 281],
            [10, 433],
            [21, 238]
          ]
        },
        "k1": "Basis/ Voorgezet onderwijs",
        "k2": ""
      },
      {
        "name": "Nutsgebouw (elektriciteit)",
        "gas": [3.6891, 5.239369, 5.277177, 5.57516, 5.047716],
        "elek": [145.685103, 125.773762, 120.48263, 77.035583, 134.110576],
        "elekIncl": [177.526866, 130.421798, 125.490308, 118.709757, 168.552535],
        "zon": [null, null, null, null, null],
        "pv": [0.128, 0.167, 0.161, 0.123, 0.185],
        "pGas": [57, 58, 58, 56, 58],
        "pElek": [141, 144, 143, 122, 173],
        "pZon": [141, 144, 143, 122, 173],
        "oGas": {
          "2020": [
            [14, 25],
            [6, 17],
            [19, 15]
          ],
          "2021": [
            [13, 10],
            [4, 15],
            [6, 17],
            [19, 16]
          ],
          "2022": [
            [13, 10],
            [4, 15],
            [6, 17],
            [19, 16]
          ],
          "2024": [
            [13, 11],
            [4, 14],
            [6, 18],
            [19, 15]
          ]
        },
        "oElek": {
          "2020": [
            [12, 27],
            [3, 26],
            [4, 33],
            [6, 27],
            [8, 15],
            [20, 13]
          ],
          "2021": [
            [12, 27],
            [3, 31],
            [4, 29],
            [6, 30],
            [8, 16],
            [20, 11]
          ],
          "2022": [
            [12, 26],
            [3, 29],
            [4, 33],
            [6, 29],
            [8, 16],
            [20, 10]
          ],
          "2024": [
            [12, 39],
            [3, 30],
            [4, 44],
            [6, 33],
            [8, 15],
            [20, 12]
          ]
        },
        "k1": "n.v.t.",
        "k2": ""
      },
      {
        "name": "Nutsgebouw (water)",
        "gas": [9.218556, 10.344757, 9.037128, 5.98943, 6.219518],
        "elek": [403.927786, 421.445479, 343.32769, 309.963455, 315.896493],
        "elekIncl": [444.337793, 543.66486, 492.63682, 427.808523, 405.757131],
        "zon": [null, null, null, null, null],
        "pv": [null, null, 0.197, 0.226, 0.239],
        "pGas": [246, 247, 238, 232, 233],
        "pElek": [59, 60, 61, 62, 71],
        "pZon": [59, 60, 61, 62, 71],
        "oGas": {
          "2020": [
            [0, 13],
            [1, 21],
            [2, 70],
            [3, 57],
            [4, 37],
            [6, 28],
            [8, 10],
            [20, 10]
          ],
          "2021": [
            [0, 11],
            [1, 22],
            [2, 72],
            [3, 57],
            [4, 37],
            [6, 28],
            [19, 20]
          ],
          "2022": [
            [11, 30],
            [2, 75],
            [3, 54],
            [4, 35],
            [6, 25],
            [19, 19]
          ],
          "2023": [
            [11, 28],
            [2, 71],
            [3, 54],
            [4, 35],
            [6, 25],
            [19, 19]
          ],
          "2024": [
            [11, 28],
            [2, 67],
            [3, 54],
            [4, 37],
            [6, 29],
            [19, 18]
          ]
        },
        "oElek": {
          "2020": [
            [11, 15],
            [2, 13],
            [3, 10],
            [4, 10],
            [18, 11]
          ],
          "2021": [
            [11, 16],
            [17, 22]
          ],
          "2022": [
            [11, 17],
            [2, 13],
            [3, 10],
            [17, 21]
          ],
          "2023": [
            [11, 16],
            [2, 14],
            [3, 10],
            [4, 11],
            [18, 11]
          ],
          "2024": [
            [11, 18],
            [2, 17],
            [3, 10],
            [4, 12],
            [18, 14]
          ]
        },
        "k1": "n.v.t.",
        "k2": ""
      },
      {
        "name": "Overig gebouw met maatschappelijke functie",
        "gas": [11.173909, 10.35744, 8.909654, 8.292945, 7.458755],
        "elek": [51.832779, 49.768784, 55.357415, 56.885366, 58.826026],
        "elekIncl": [52.934998, 51.693251, 57.363022, 59.75532, 61.317283],
        "zon": [null, null, null, 4.1623, 3.749098],
        "pv": [null, null, null, 0.101, 0.129],
        "pGas": [1570, 1573, 1573, 1556, 1580],
        "pElek": [1221, 1207, 1208, 1182, 1208],
        "pZon": [1221, 1207, 1208, 1182, 1208],
        "oGas": {
          "2020": [
            [0, 34],
            [1, 111],
            [2, 457],
            [3, 402],
            [4, 298],
            [6, 169],
            [8, 58],
            [10, 23],
            [21, 18]
          ],
          "2021": [
            [0, 32],
            [1, 109],
            [2, 455],
            [3, 411],
            [4, 306],
            [6, 171],
            [8, 52],
            [10, 22],
            [21, 15]
          ],
          "2022": [
            [0, 35],
            [1, 106],
            [2, 453],
            [3, 412],
            [4, 308],
            [6, 171],
            [8, 53],
            [10, 21],
            [21, 14]
          ],
          "2023": [
            [0, 34],
            [1, 111],
            [2, 448],
            [3, 402],
            [4, 307],
            [6, 167],
            [8, 51],
            [10, 22],
            [21, 14]
          ],
          "2024": [
            [0, 35],
            [1, 109],
            [2, 457],
            [3, 407],
            [4, 316],
            [6, 168],
            [8, 52],
            [10, 22],
            [21, 14]
          ]
        },
        "oElek": {
          "2020": [
            [0, 52],
            [1, 89],
            [2, 345],
            [3, 320],
            [4, 223],
            [6, 126],
            [8, 38],
            [10, 13],
            [21, 15]
          ],
          "2021": [
            [0, 49],
            [1, 90],
            [2, 342],
            [3, 311],
            [4, 228],
            [6, 126],
            [8, 32],
            [10, 15],
            [21, 14]
          ],
          "2022": [
            [0, 50],
            [1, 87],
            [2, 344],
            [3, 310],
            [4, 224],
            [6, 132],
            [8, 35],
            [10, 13],
            [21, 13]
          ],
          "2023": [
            [0, 52],
            [1, 90],
            [2, 336],
            [3, 302],
            [4, 217],
            [6, 124],
            [8, 33],
            [10, 14],
            [21, 14]
          ],
          "2024": [
            [0, 58],
            [1, 94],
            [2, 345],
            [3, 308],
            [4, 221],
            [6, 122],
            [8, 32],
            [10, 15],
            [21, 13]
          ]
        },
        "k1": "Overig",
        "k2": ""
      },
      {
        "name": "Overig gebouw met recreatiefunctie",
        "gas": [13.103219, 17.648689, 15.100962, 14.95355, 12.972938],
        "elek": [113.286573, 167.582343, 172.56407, 140.414994, 154.44514],
        "elekIncl": [117.207062, 171.102963, 177.496935, 147.851369, 163.770495],
        "zon": [null, null, 7.648566, 9.859707, 12.425827],
        "pv": [null, 0.173, 0.187, 0.263, 0.317],
        "pGas": [75, 78, 80, 80, 82],
        "pElek": [72, 75, 75, 76, 82],
        "pZon": [72, 75, 75, 76, 82],
        "oGas": {
          "2020": [
            [13, 24],
            [4, 16],
            [6, 16],
            [19, 19]
          ],
          "2021": [
            [13, 26],
            [4, 16],
            [6, 17],
            [19, 19]
          ],
          "2022": [
            [13, 28],
            [4, 16],
            [6, 17],
            [19, 19]
          ],
          "2023": [
            [13, 28],
            [4, 16],
            [6, 17],
            [19, 19]
          ],
          "2024": [
            [12, 10],
            [3, 20],
            [4, 16],
            [6, 17],
            [19, 19]
          ]
        },
        "oElek": {
          "2020": [
            [13, 26],
            [4, 11],
            [6, 21],
            [19, 14]
          ],
          "2021": [
            [13, 29],
            [4, 11],
            [6, 20],
            [19, 15]
          ],
          "2022": [
            [13, 28],
            [4, 11],
            [6, 20],
            [19, 16]
          ],
          "2023": [
            [13, 28],
            [4, 11],
            [6, 20],
            [19, 17]
          ],
          "2024": [
            [12, 10],
            [3, 21],
            [4, 12],
            [6, 21],
            [19, 18]
          ]
        },
        "k1": "Overig",
        "k2": ""
      },
      {
        "name": "Overig onderwijsgebouw",
        "gas": [8.253555, 9.288873, 7.696234, 7.134099, 6.437351],
        "elek": [35.895231, 36.065141, 35.921643, 35.052554, 34.942183],
        "elekIncl": [37.179225, 37.41376, 37.68517, 36.911131, 36.939433],
        "zon": [1.893757, 2.547638, 3.366591, 3.320634, 3.60103],
        "pv": [0.112, 0.136, 0.156, 0.179, 0.214],
        "pGas": [3096, 3149, 3132, 3077, 3087],
        "pElek": [3067, 3087, 3100, 3094, 3143],
        "pZon": [3067, 3087, 3100, 3094, 3143],
        "oGas": {
          "2020": [
            [11, 17],
            [2, 154],
            [3, 401],
            [4, 784],
            [6, 1112],
            [8, 331],
            [10, 200],
            [21, 97]
          ],
          "2021": [
            [11, 20],
            [2, 152],
            [3, 409],
            [4, 788],
            [6, 1088],
            [8, 376],
            [10, 194],
            [21, 122]
          ],
          "2022": [
            [11, 19],
            [2, 151],
            [3, 403],
            [4, 779],
            [6, 1085],
            [8, 385],
            [10, 192],
            [21, 118]
          ],
          "2023": [
            [11, 18],
            [2, 146],
            [3, 393],
            [4, 770],
            [6, 1068],
            [8, 375],
            [10, 186],
            [21, 121]
          ],
          "2024": [
            [11, 18],
            [2, 149],
            [3, 406],
            [4, 773],
            [6, 1061],
            [8, 371],
            [10, 192],
            [21, 117]
          ]
        },
        "oElek": {
          "2020": [
            [11, 21],
            [2, 165],
            [3, 391],
            [4, 755],
            [6, 1129],
            [8, 320],
            [10, 185],
            [21, 101]
          ],
          "2021": [
            [11, 22],
            [2, 161],
            [3, 388],
            [4, 761],
            [6, 1087],
            [8, 351],
            [10, 188],
            [21, 129]
          ],
          "2022": [
            [11, 22],
            [2, 164],
            [3, 394],
            [4, 754],
            [6, 1085],
            [8, 367],
            [10, 188],
            [21, 126]
          ],
          "2023": [
            [11, 22],
            [2, 158],
            [3, 390],
            [4, 758],
            [6, 1083],
            [8, 363],
            [10, 191],
            [21, 129]
          ],
          "2024": [
            [11, 21],
            [2, 163],
            [3, 409],
            [4, 765],
            [6, 1099],
            [8, 366],
            [10, 193],
            [21, 127]
          ]
        },
        "k1": "n.v.t.",
        "k2": ""
      },
      {
        "name": "Overig overheidsgebouw",
        "gas": [8.275281, 8.442092, 6.686124, 6.015011, 5.325738],
        "elek": [80.226792, 67.087453, 65.553785, 64.716979, 64.82022],
        "elekIncl": [82.251479, 69.037482, 67.769163, 66.943164, 66.929032],
        "zon": [2.444737, 2.406607, 2.822222, 2.759218, 2.658789],
        "pv": [0.224, 0.254, 0.269, 0.283, 0.312],
        "pGas": [1072, 1072, 1065, 1053, 1054],
        "pElek": [790, 810, 817, 819, 827],
        "pZon": [790, 810, 817, 819, 827],
        "oGas": {
          "2020": [
            [12, 67],
            [3, 100],
            [4, 143],
            [6, 250],
            [8, 248],
            [10, 168],
            [21, 96]
          ],
          "2021": [
            [12, 68],
            [3, 104],
            [4, 141],
            [6, 246],
            [8, 241],
            [10, 162],
            [21, 110]
          ],
          "2022": [
            [12, 63],
            [3, 102],
            [4, 142],
            [6, 246],
            [8, 234],
            [10, 163],
            [21, 115]
          ],
          "2023": [
            [12, 61],
            [3, 102],
            [4, 138],
            [6, 246],
            [8, 233],
            [10, 157],
            [21, 116]
          ],
          "2024": [
            [12, 62],
            [3, 101],
            [4, 139],
            [6, 244],
            [8, 233],
            [10, 159],
            [21, 116]
          ]
        },
        "oElek": {
          "2020": [
            [12, 25],
            [3, 38],
            [4, 73],
            [6, 172],
            [8, 216],
            [10, 158],
            [21, 108]
          ],
          "2021": [
            [12, 25],
            [3, 42],
            [4, 72],
            [6, 175],
            [8, 216],
            [10, 153],
            [21, 127]
          ],
          "2022": [
            [12, 25],
            [3, 42],
            [4, 77],
            [6, 177],
            [8, 208],
            [10, 158],
            [21, 130]
          ],
          "2023": [
            [12, 24],
            [3, 44],
            [4, 76],
            [6, 176],
            [8, 209],
            [10, 155],
            [21, 135]
          ],
          "2024": [
            [12, 27],
            [3, 45],
            [4, 77],
            [6, 174],
            [8, 211],
            [10, 157],
            [21, 136]
          ]
        },
        "k1": "n.v.t.",
        "k2": ""
      },
      {
        "name": "Overig sportgebouw",
        "gas": [7.612458, 8.077965, 7.217253, 6.701383, 5.974158],
        "elek": [49.870066, 46.891774, 52.189827, 51.854222, 51.531116],
        "elekIncl": [54.196014, 50.343957, 56.955777, 59.433699, 57.294581],
        "zon": [7.857679, 9.154196, 11.740345, 15.030076, 11.87865],
        "pv": [0.227, 0.257, 0.298, 0.361, 0.407],
        "pGas": [7914, 7996, 8001, 7901, 8027],
        "pElek": [7133, 7181, 7335, 7312, 7574],
        "pZon": [7133, 7181, 7335, 7312, 7574],
        "oGas": {
          "2020": [
            [0, 32],
            [1, 252],
            [2, 1334],
            [3, 2292],
            [4, 1705],
            [6, 1470],
            [8, 547],
            [10, 194],
            [21, 88]
          ],
          "2021": [
            [0, 30],
            [1, 251],
            [2, 1364],
            [3, 2334],
            [4, 1732],
            [6, 1467],
            [8, 536],
            [10, 189],
            [21, 93]
          ],
          "2022": [
            [0, 28],
            [1, 254],
            [2, 1356],
            [3, 2337],
            [4, 1736],
            [6, 1474],
            [8, 540],
            [10, 185],
            [21, 91]
          ],
          "2023": [
            [0, 26],
            [1, 250],
            [2, 1352],
            [3, 2296],
            [4, 1718],
            [6, 1453],
            [8, 532],
            [10, 185],
            [21, 89]
          ],
          "2024": [
            [0, 27],
            [1, 250],
            [2, 1365],
            [3, 2340],
            [4, 1759],
            [6, 1474],
            [8, 546],
            [10, 184],
            [21, 82]
          ]
        },
        "oElek": {
          "2020": [
            [0, 54],
            [1, 265],
            [2, 1313],
            [3, 1908],
            [4, 1511],
            [6, 1340],
            [8, 486],
            [10, 185],
            [21, 71]
          ],
          "2021": [
            [0, 57],
            [1, 279],
            [2, 1334],
            [3, 1899],
            [4, 1545],
            [6, 1323],
            [8, 486],
            [10, 180],
            [21, 78]
          ],
          "2022": [
            [0, 60],
            [1, 287],
            [2, 1357],
            [3, 1934],
            [4, 1586],
            [6, 1352],
            [8, 498],
            [10, 182],
            [21, 79]
          ],
          "2023": [
            [0, 57],
            [1, 297],
            [2, 1340],
            [3, 1926],
            [4, 1575],
            [6, 1356],
            [8, 501],
            [10, 183],
            [21, 77]
          ],
          "2024": [
            [0, 58],
            [1, 321],
            [2, 1371],
            [3, 1994],
            [4, 1630],
            [6, 1401],
            [8, 543],
            [10, 182],
            [21, 74]
          ]
        },
        "k1": "Sportaccommodatie binnen",
        "k2": ""
      },
      {
        "name": "Overig zorggebouw",
        "gas": [9.660668, 10.475035, 9.167394, 8.550772, 7.600904],
        "elek": [59.696915, 61.323365, 61.293085, 59.16413, 56.777935],
        "elekIncl": [62.067374, 63.586395, 64.444982, 63.058811, 60.960891],
        "zon": [2.920269, 3.191283, 4.674047, 5.76238, 6.307419],
        "pv": [0.132, 0.158, 0.202, 0.275, 0.318],
        "pGas": [3239, 3279, 3261, 3188, 3257],
        "pElek": [3423, 3463, 3459, 3420, 3567],
        "pZon": [3423, 3463, 3459, 3420, 3567],
        "oGas": {
          "2020": [
            [0, 30],
            [1, 196],
            [2, 671],
            [3, 715],
            [4, 648],
            [6, 586],
            [8, 223],
            [10, 112],
            [21, 58]
          ],
          "2021": [
            [0, 30],
            [1, 202],
            [2, 679],
            [3, 719],
            [4, 679],
            [6, 597],
            [8, 207],
            [10, 110],
            [21, 56]
          ],
          "2022": [
            [0, 29],
            [1, 199],
            [2, 664],
            [3, 727],
            [4, 677],
            [6, 587],
            [8, 208],
            [10, 113],
            [21, 57]
          ],
          "2023": [
            [0, 30],
            [1, 188],
            [2, 643],
            [3, 723],
            [4, 652],
            [6, 576],
            [8, 208],
            [10, 111],
            [21, 57]
          ],
          "2024": [
            [0, 29],
            [1, 190],
            [2, 657],
            [3, 742],
            [4, 667],
            [6, 599],
            [8, 207],
            [10, 109],
            [21, 57]
          ]
        },
        "oElek": {
          "2020": [
            [0, 40],
            [1, 199],
            [2, 679],
            [3, 724],
            [4, 703],
            [6, 666],
            [8, 229],
            [10, 120],
            [21, 63]
          ],
          "2021": [
            [0, 40],
            [1, 201],
            [2, 674],
            [3, 729],
            [4, 736],
            [6, 694],
            [8, 208],
            [10, 116],
            [21, 65]
          ],
          "2022": [
            [0, 41],
            [1, 196],
            [2, 660],
            [3, 738],
            [4, 732],
            [6, 696],
            [8, 215],
            [10, 116],
            [21, 65]
          ],
          "2023": [
            [0, 42],
            [1, 187],
            [2, 646],
            [3, 725],
            [4, 726],
            [6, 691],
            [8, 219],
            [10, 116],
            [21, 68]
          ],
          "2024": [
            [0, 43],
            [1, 196],
            [2, 674],
            [3, 762],
            [4, 761],
            [6, 725],
            [8, 223],
            [10, 113],
            [21, 70]
          ]
        },
        "k1": "Opvang zonder overnachting",
        "k2": ""
      },
      {
        "name": "Overige utiliteitsbouw",
        "gas": [11.018254, 11.685904, 10.638013, 8.263384, 6.201428],
        "elek": [66.451521, 60.525226, 58.7433, 59.094331, 57.331068],
        "elekIncl": [68.42454, 62.235868, 61.517615, 62.551528, 60.335644],
        "zon": [null, null, null, null, null],
        "pv": [null, 0.103, 0.137, 0.169, 0.189],
        "pGas": [3013, 2977, 2888, 2752, 2816],
        "pElek": [4075, 4107, 4010, 3853, 4013],
        "pZon": [4075, 4107, 4010, 3853, 4013],
        "oGas": {
          "2020": [
            [0, 314],
            [1, 533],
            [2, 822],
            [3, 497],
            [4, 375],
            [6, 302],
            [8, 94],
            [10, 53],
            [21, 23]
          ],
          "2021": [
            [0, 303],
            [1, 536],
            [2, 817],
            [3, 480],
            [4, 374],
            [6, 293],
            [8, 102],
            [10, 47],
            [21, 25]
          ],
          "2022": [
            [0, 279],
            [1, 511],
            [2, 802],
            [3, 474],
            [4, 366],
            [6, 288],
            [8, 99],
            [10, 45],
            [21, 24]
          ],
          "2023": [
            [0, 224],
            [1, 488],
            [2, 784],
            [3, 464],
            [4, 354],
            [6, 278],
            [8, 95],
            [10, 43],
            [21, 22]
          ],
          "2024": [
            [0, 243],
            [1, 507],
            [2, 795],
            [3, 472],
            [4, 355],
            [6, 285],
            [8, 94],
            [10, 43],
            [21, 22]
          ]
        },
        "oElek": {
          "2020": [
            [0, 817],
            [1, 807],
            [2, 991],
            [3, 547],
            [4, 416],
            [6, 320],
            [8, 95],
            [10, 56],
            [21, 26]
          ],
          "2021": [
            [0, 847],
            [1, 829],
            [2, 972],
            [3, 556],
            [4, 417],
            [6, 298],
            [8, 108],
            [10, 51],
            [21, 29]
          ],
          "2022": [
            [0, 787],
            [1, 808],
            [2, 957],
            [3, 555],
            [4, 409],
            [6, 301],
            [8, 113],
            [10, 47],
            [21, 33]
          ],
          "2023": [
            [0, 708],
            [1, 782],
            [2, 940],
            [3, 546],
            [4, 402],
            [6, 292],
            [8, 104],
            [10, 47],
            [21, 32]
          ],
          "2024": [
            [0, 758],
            [1, 839],
            [2, 973],
            [3, 566],
            [4, 397],
            [6, 300],
            [8, 103],
            [10, 46],
            [21, 31]
          ]
        },
        "k1": "n.v.t.",
        "k2": ""
      },
      {
        "name": "Pand met winkel en kantoor- en/of bijeenkomstfunctie",
        "gas": [5.332794, 5.215517, 4.367317, 3.978155, 3.610273],
        "elek": [61.97523, 59.128008, 61.60929, 60.711059, 60.911023],
        "elekIncl": [63.22228, 60.873707, 63.574899, 62.78945, 63.236708],
        "zon": [null, null, 3.53995, 3.810933, 4.109793],
        "pv": [null, null, 0.112, 0.14, 0.175],
        "pGas": [1357, 1375, 1374, 1355, 1379],
        "pElek": [1446, 1461, 1469, 1453, 1476],
        "pZon": [1446, 1461, 1469, 1453, 1476],
        "oGas": {
          "2020": [
            [11, 21],
            [2, 166],
            [3, 264],
            [4, 302],
            [6, 347],
            [8, 139],
            [10, 68],
            [21, 50]
          ],
          "2021": [
            [11, 20],
            [2, 169],
            [3, 280],
            [4, 303],
            [6, 343],
            [8, 135],
            [10, 68],
            [21, 57]
          ],
          "2022": [
            [11, 21],
            [2, 169],
            [3, 275],
            [4, 306],
            [6, 345],
            [8, 131],
            [10, 68],
            [21, 59]
          ],
          "2023": [
            [11, 22],
            [2, 158],
            [3, 279],
            [4, 296],
            [6, 340],
            [8, 133],
            [10, 68],
            [21, 59]
          ],
          "2024": [
            [11, 23],
            [2, 159],
            [3, 278],
            [4, 303],
            [6, 354],
            [8, 136],
            [10, 67],
            [21, 59]
          ]
        },
        "oElek": {
          "2020": [
            [11, 29],
            [2, 177],
            [3, 274],
            [4, 306],
            [6, 369],
            [8, 152],
            [10, 77],
            [21, 62]
          ],
          "2021": [
            [11, 27],
            [2, 177],
            [3, 281],
            [4, 315],
            [6, 363],
            [8, 150],
            [10, 80],
            [21, 68]
          ],
          "2022": [
            [11, 24],
            [2, 176],
            [3, 283],
            [4, 314],
            [6, 371],
            [8, 146],
            [10, 82],
            [21, 73]
          ],
          "2023": [
            [11, 21],
            [2, 166],
            [3, 284],
            [4, 309],
            [6, 371],
            [8, 149],
            [10, 83],
            [21, 70]
          ],
          "2024": [
            [11, 22],
            [2, 163],
            [3, 277],
            [4, 325],
            [6, 383],
            [8, 151],
            [10, 86],
            [21, 69]
          ]
        },
        "k1": "n.v.t.",
        "k2": ""
      },
      {
        "name": "Penitentiaire inrichting",
        "gas": [16.753391, 23.914479, 20.579936, 19.282452, 16.701427],
        "elek": [104.473567, 131.075679, 127.803194, 125.106786, 126.800717],
        "elekIncl": [104.613383, 131.264543, 129.182516, 128.060762, 129.861718],
        "zon": [null, null, null, null, null],
        "pv": [null, null, null, null, null],
        "pGas": [24, 22, 23, 25, 25],
        "pElek": [25, 24, 25, 25, 25],
        "pZon": [25, 24, 25, 25, 25],
        "oGas": {},
        "oElek": {},
        "k1": "Cellengebouw",
        "k2": ""
      },
      {
        "name": "Praktijk- of zorgwoning",
        "gas": [11.261586, 12.339039, 9.533528, 8.580291, 8.121174],
        "elek": [33.206674, 33.080304, 31.18332, 30.779255, 31.14898],
        "elekIncl": [36.93376, 35.874939, 34.608617, 34.881435, 36.051604],
        "zon": [4.261542, 5.105236, 7.030558, 8.572508, 10.09813],
        "pv": [0.239, 0.288, 0.353, 0.441, 0.487],
        "pGas": [4813, 4835, 4885, 4800, 4924],
        "pElek": [4918, 4984, 5077, 5023, 5203],
        "pZon": [4918, 4984, 5077, 5023, 5203],
        "oGas": {
          "2020": [
            [0, 38],
            [1, 184],
            [2, 2346],
            [3, 1656],
            [4, 415],
            [6, 144],
            [8, 19],
            [20, 11]
          ],
          "2021": [
            [0, 39],
            [1, 168],
            [2, 2316],
            [3, 1735],
            [4, 413],
            [6, 141],
            [19, 23]
          ],
          "2022": [
            [0, 35],
            [1, 161],
            [2, 2331],
            [3, 1777],
            [4, 419],
            [6, 144],
            [19, 18]
          ],
          "2023": [
            [0, 31],
            [1, 164],
            [2, 2271],
            [3, 1763],
            [4, 412],
            [6, 143],
            [19, 16]
          ],
          "2024": [
            [0, 30],
            [1, 167],
            [2, 2332],
            [3, 1808],
            [4, 425],
            [6, 146],
            [19, 16]
          ]
        },
        "oElek": {
          "2020": [
            [0, 45],
            [1, 238],
            [2, 2380],
            [3, 1654],
            [4, 420],
            [6, 148],
            [8, 22],
            [20, 11]
          ],
          "2021": [
            [0, 43],
            [1, 236],
            [2, 2370],
            [3, 1741],
            [4, 424],
            [6, 149],
            [19, 21]
          ],
          "2022": [
            [0, 35],
            [1, 250],
            [2, 2386],
            [3, 1796],
            [4, 427],
            [6, 167],
            [19, 16]
          ],
          "2023": [
            [0, 33],
            [1, 251],
            [2, 2349],
            [3, 1788],
            [4, 412],
            [6, 175],
            [19, 15]
          ],
          "2024": [
            [0, 31],
            [1, 247],
            [2, 2434],
            [3, 1848],
            [4, 437],
            [6, 190],
            [19, 16]
          ]
        },
        "k1": "Medische (groeps) praktijk",
        "k2": ""
      },
      {
        "name": "Productie-installatie",
        "gas": [785.590292, 919.90446, 704.972719, 726.805943, 759.187553],
        "elek": [1209.710208, 1811.358703, 1917.571809, 1801.666851, 2027.88735],
        "elekIncl": [1212.843914, 1817.255101, 1925.011999, 1809.079358, 2037.174638],
        "zon": [null, null, null, null, null],
        "pv": [null, null, 0.108, 0.133, 0.196],
        "pGas": [97, 97, 101, 103, 100],
        "pElek": [96, 101, 102, 105, 112],
        "pZon": [96, 101, 102, 105, 112],
        "oGas": {
          "2020": [
            [13, 12],
            [4, 15],
            [6, 29],
            [8, 14],
            [20, 27]
          ],
          "2021": [
            [13, 12],
            [4, 14],
            [6, 30],
            [8, 14],
            [20, 27]
          ],
          "2022": [
            [13, 12],
            [4, 16],
            [6, 31],
            [8, 14],
            [20, 28]
          ],
          "2023": [
            [13, 12],
            [4, 17],
            [6, 31],
            [8, 16],
            [20, 27]
          ],
          "2024": [
            [13, 11],
            [4, 17],
            [6, 31],
            [8, 16],
            [20, 25]
          ]
        },
        "oElek": {
          "2020": [
            [13, 12],
            [4, 14],
            [6, 29],
            [8, 12],
            [20, 29]
          ],
          "2021": [
            [13, 13],
            [4, 13],
            [6, 30],
            [8, 13],
            [10, 21],
            [21, 11]
          ],
          "2022": [
            [13, 12],
            [4, 14],
            [6, 29],
            [8, 13],
            [10, 23],
            [21, 11]
          ],
          "2023": [
            [13, 10],
            [4, 16],
            [6, 32],
            [8, 14],
            [10, 23],
            [21, 10]
          ],
          "2024": [
            [13, 19],
            [4, 16],
            [6, 34],
            [8, 13],
            [20, 30]
          ]
        },
        "k1": "n.v.t.",
        "k2": ""
      },
      {
        "name": "Restaurant of cafégebouw",
        "gas": [20.068705, 19.137846, 17.703756, 17.492258, 15.751958],
        "elek": [170.071314, 164.399147, 187.16639, 188.162403, 184.682579],
        "elekIncl": [170.999243, 165.34747, 188.564031, 190.35881, 187.322831],
        "zon": [null, null, null, null, null],
        "pv": [null, null, null, null, null],
        "pGas": [3708, 3737, 3741, 3665, 3767],
        "pElek": [3876, 3882, 3917, 3837, 3939],
        "pZon": [3876, 3882, 3917, 3837, 3939],
        "oGas": {
          "2020": [
            [0, 108],
            [1, 505],
            [2, 1349],
            [3, 986],
            [4, 541],
            [6, 183],
            [19, 36]
          ],
          "2021": [
            [0, 104],
            [1, 504],
            [2, 1380],
            [3, 972],
            [4, 545],
            [6, 194],
            [19, 38]
          ],
          "2022": [
            [0, 114],
            [1, 500],
            [2, 1377],
            [3, 977],
            [4, 545],
            [6, 190],
            [19, 38]
          ],
          "2023": [
            [0, 109],
            [1, 487],
            [2, 1343],
            [3, 961],
            [4, 536],
            [6, 193],
            [19, 36]
          ],
          "2024": [
            [0, 109],
            [1, 499],
            [2, 1387],
            [3, 984],
            [4, 556],
            [6, 195],
            [8, 27],
            [20, 10]
          ]
        },
        "oElek": {
          "2020": [
            [0, 117],
            [1, 539],
            [2, 1435],
            [3, 999],
            [4, 554],
            [6, 194],
            [19, 38]
          ],
          "2021": [
            [0, 116],
            [1, 541],
            [2, 1458],
            [3, 972],
            [4, 559],
            [6, 200],
            [19, 36]
          ],
          "2022": [
            [0, 117],
            [1, 533],
            [2, 1467],
            [3, 997],
            [4, 566],
            [6, 201],
            [19, 36]
          ],
          "2023": [
            [0, 113],
            [1, 521],
            [2, 1430],
            [3, 979],
            [4, 557],
            [6, 199],
            [19, 38]
          ],
          "2024": [
            [0, 116],
            [1, 533],
            [2, 1470],
            [3, 1001],
            [4, 575],
            [6, 205],
            [8, 29],
            [20, 10]
          ]
        },
        "k1": "Restaurant",
        "k2": "Café"
      },
      {
        "name": "School voor speciaal onderwijs",
        "gas": [8.675087, 9.28932, 7.941596, 7.855584, 6.977927],
        "elek": [29.581909, 26.808833, 26.785589, 27.14522, 26.715285],
        "elekIncl": [31.452094, 28.452439, 29.484908, 30.549718, 30.272328],
        "zon": [2.842359, 2.844046, 4.500346, 5.098472, 5.506139],
        "pv": [0.179, 0.217, 0.255, 0.289, 0.342],
        "pGas": [475, 477, 479, 476, 476],
        "pElek": [496, 506, 514, 516, 518],
        "pZon": [496, 506, 514, 516, 518],
        "oGas": {
          "2020": [
            [14, 32],
            [6, 257],
            [8, 135],
            [20, 51]
          ],
          "2021": [
            [14, 30],
            [6, 255],
            [8, 132],
            [20, 60]
          ],
          "2022": [
            [14, 30],
            [6, 259],
            [8, 130],
            [20, 60]
          ],
          "2023": [
            [14, 31],
            [6, 257],
            [8, 129],
            [20, 59]
          ],
          "2024": [
            [14, 28],
            [6, 260],
            [8, 129],
            [20, 59]
          ]
        },
        "oElek": {
          "2020": [
            [14, 32],
            [6, 271],
            [8, 139],
            [20, 54]
          ],
          "2021": [
            [14, 32],
            [6, 271],
            [8, 140],
            [10, 53],
            [21, 10]
          ],
          "2022": [
            [14, 32],
            [6, 277],
            [8, 142],
            [10, 53],
            [21, 10]
          ],
          "2023": [
            [14, 33],
            [6, 276],
            [8, 143],
            [10, 54],
            [21, 10]
          ],
          "2024": [
            [14, 28],
            [6, 278],
            [8, 148],
            [10, 53],
            [21, 11]
          ]
        },
        "k1": "Basis/ Voorgezet onderwijs",
        "k2": ""
      },
      {
        "name": "Schoolverzamelgebouw",
        "gas": [5.962286, 8.067415, 6.495538, 5.999672, 5.307587],
        "elek": [34.377662, 33.124324, 33.499358, 32.163256, 33.032456],
        "elekIncl": [36.300473, 35.561473, 36.62414, 35.400258, 35.937057],
        "zon": [3.151701, 3.786804, 5.095352, 5.215717, 4.779132],
        "pv": [0.245, 0.288, 0.337, 0.35, 0.411],
        "pGas": [99, 96, 94, 94, 94],
        "pElek": [102, 104, 104, 103, 107],
        "pZon": [102, 104, 104, 103, 107],
        "oGas": {
          "2020": [
            [15, 24],
            [8, 30],
            [10, 31],
            [21, 14]
          ],
          "2021": [
            [15, 25],
            [8, 29],
            [10, 29],
            [21, 13]
          ],
          "2022": [
            [15, 23],
            [8, 29],
            [10, 29],
            [21, 13]
          ],
          "2023": [
            [15, 23],
            [8, 29],
            [10, 29],
            [21, 13]
          ],
          "2024": [
            [15, 24],
            [8, 28],
            [10, 29],
            [21, 13]
          ]
        },
        "oElek": {
          "2020": [
            [15, 27],
            [8, 32],
            [10, 30],
            [21, 13]
          ],
          "2021": [
            [15, 27],
            [8, 32],
            [10, 31],
            [21, 14]
          ],
          "2022": [
            [15, 27],
            [8, 32],
            [10, 31],
            [21, 14]
          ],
          "2023": [
            [15, 27],
            [8, 31],
            [10, 31],
            [21, 14]
          ],
          "2024": [
            [15, 29],
            [8, 31],
            [10, 33],
            [21, 14]
          ]
        },
        "k1": "Basis/ Voorgezet onderwijs",
        "k2": ""
      },
      {
        "name": "Tuincentrum",
        "gas": [7.249896, 8.38878, 6.201156, 5.231846, 4.840595],
        "elek": [35.04697, 31.506758, 29.661892, 29.121719, 28.420155],
        "elekIncl": [36.95535, 33.946177, 33.083495, 33.447029, 33.007043],
        "zon": [3.469668, 4.651234, 7.043841, 7.958381, 8.258377],
        "pv": [0.151, 0.191, 0.254, 0.327, 0.373],
        "pGas": [440, 440, 446, 439, 436],
        "pElek": [443, 455, 460, 449, 458],
        "pZon": [443, 455, 460, 449, 458],
        "oGas": {
          "2020": [
            [12, 65],
            [3, 49],
            [4, 50],
            [6, 98],
            [8, 73],
            [10, 63],
            [21, 42]
          ],
          "2021": [
            [12, 66],
            [3, 49],
            [4, 50],
            [6, 97],
            [8, 71],
            [10, 66],
            [21, 41]
          ],
          "2022": [
            [12, 69],
            [3, 52],
            [4, 48],
            [6, 97],
            [8, 71],
            [10, 65],
            [21, 44]
          ],
          "2023": [
            [12, 68],
            [3, 52],
            [4, 48],
            [6, 94],
            [8, 69],
            [10, 65],
            [21, 43]
          ],
          "2024": [
            [12, 71],
            [3, 52],
            [4, 50],
            [6, 89],
            [8, 69],
            [10, 61],
            [21, 44]
          ]
        },
        "oElek": {
          "2020": [
            [11, 10],
            [2, 69],
            [3, 52],
            [4, 51],
            [6, 89],
            [8, 66],
            [10, 62],
            [21, 44]
          ],
          "2021": [
            [12, 86],
            [3, 59],
            [4, 50],
            [6, 90],
            [8, 65],
            [10, 63],
            [21, 42]
          ],
          "2022": [
            [12, 85],
            [3, 62],
            [4, 49],
            [6, 92],
            [8, 66],
            [10, 63],
            [21, 43]
          ],
          "2023": [
            [12, 86],
            [3, 58],
            [4, 46],
            [6, 90],
            [8, 66],
            [10, 60],
            [21, 43]
          ],
          "2024": [
            [12, 87],
            [3, 60],
            [4, 49],
            [6, 90],
            [8, 65],
            [10, 60],
            [21, 47]
          ]
        },
        "k1": "Winkel zonder warenkoeling",
        "k2": "Winkel met warenkoeling"
      },
      {
        "name": "Vakantiewoning buiten vakantiepark",
        "gas": [11.104237, 13.094256, 10.60584, 9.808498, 9.65122],
        "elek": [35.550529, 36.934935, 35.764101, 36.052054, 37.320875],
        "elekIncl": [38.134539, 38.830536, 38.579749, 39.607194, 41.624451],
        "zon": [null, 4.439237, 6.632134, 8.228863, 10.270555],
        "pv": [null, 0.111, 0.149, 0.192, 0.248],
        "pGas": [4579, 4652, 4701, 4718, 4872],
        "pElek": [5045, 5241, 5400, 5618, 6034],
        "pZon": [5045, 5241, 5400, 5618, 6034],
        "oGas": {
          "2020": [
            [0, 444],
            [1, 2215],
            [2, 1672],
            [3, 155],
            [4, 45],
            [18, 48]
          ],
          "2021": [
            [0, 474],
            [1, 2199],
            [2, 1746],
            [3, 152],
            [4, 44],
            [6, 27],
            [19, 10]
          ],
          "2022": [
            [0, 461],
            [1, 2232],
            [2, 1790],
            [3, 148],
            [4, 34],
            [6, 25],
            [19, 11]
          ],
          "2023": [
            [0, 463],
            [1, 2264],
            [2, 1771],
            [3, 152],
            [4, 35],
            [6, 22],
            [19, 11]
          ],
          "2024": [
            [0, 472],
            [1, 2350],
            [2, 1825],
            [3, 154],
            [4, 38],
            [6, 22],
            [19, 11]
          ]
        },
        "oElek": {
          "2020": [
            [0, 635],
            [1, 2446],
            [2, 1709],
            [3, 161],
            [4, 45],
            [6, 38],
            [19, 11]
          ],
          "2021": [
            [0, 676],
            [1, 2450],
            [2, 1863],
            [3, 163],
            [4, 44],
            [6, 31],
            [19, 14]
          ],
          "2022": [
            [0, 718],
            [1, 2509],
            [2, 1935],
            [3, 157],
            [4, 40],
            [6, 29],
            [19, 12]
          ],
          "2023": [
            [0, 777],
            [1, 2599],
            [2, 1994],
            [3, 162],
            [4, 44],
            [6, 30],
            [19, 12]
          ],
          "2024": [
            [0, 840],
            [1, 2796],
            [2, 2132],
            [3, 174],
            [4, 47],
            [6, 33],
            [19, 12]
          ]
        },
        "k1": "n.v.t.",
        "k2": ""
      },
      {
        "name": "Winkelpand",
        "gas": [5.782861, 6.247264, 5.034455, 4.466941, 4.026755],
        "elek": [78.289387, 74.18454, 74.096681, 71.802646, 70.544233],
        "elekIncl": [80.950759, 76.150814, 77.130513, 75.467587, 74.106786],
        "zon": [null, null, null, 7.820384, 7.943013],
        "pv": [null, null, null, 0.13, 0.15],
        "pGas": [19751, 19796, 19597, 18975, 19496],
        "pElek": [21381, 21328, 21352, 20862, 21541],
        "pZon": [21381, 21328, 21352, 20862, 21541],
        "oGas": {
          "2020": [
            [0, 543],
            [1, 2279],
            [2, 5576],
            [3, 3861],
            [4, 2964],
            [6, 2914],
            [8, 1099],
            [10, 354],
            [21, 161]
          ],
          "2021": [
            [0, 537],
            [1, 2240],
            [2, 5667],
            [3, 3859],
            [4, 2949],
            [6, 2913],
            [8, 1092],
            [10, 375],
            [21, 164]
          ],
          "2022": [
            [0, 536],
            [1, 2215],
            [2, 5616],
            [3, 3812],
            [4, 2923],
            [6, 2868],
            [8, 1086],
            [10, 373],
            [21, 168]
          ],
          "2023": [
            [0, 531],
            [1, 2173],
            [2, 5431],
            [3, 3678],
            [4, 2819],
            [6, 2751],
            [8, 1061],
            [10, 365],
            [21, 166]
          ],
          "2024": [
            [0, 546],
            [1, 2253],
            [2, 5627],
            [3, 3809],
            [4, 2872],
            [6, 2785],
            [8, 1062],
            [10, 373],
            [21, 169]
          ]
        },
        "oElek": {
          "2020": [
            [0, 801],
            [1, 2719],
            [2, 5949],
            [3, 3940],
            [4, 3016],
            [6, 3247],
            [8, 1145],
            [10, 401],
            [21, 163]
          ],
          "2021": [
            [0, 776],
            [1, 2632],
            [2, 5955],
            [3, 3910],
            [4, 3024],
            [6, 3269],
            [8, 1158],
            [10, 427],
            [21, 177]
          ],
          "2022": [
            [0, 781],
            [1, 2623],
            [2, 5978],
            [3, 3872],
            [4, 3021],
            [6, 3302],
            [8, 1166],
            [10, 430],
            [21, 179]
          ],
          "2023": [
            [0, 778],
            [1, 2578],
            [2, 5801],
            [3, 3748],
            [4, 2936],
            [6, 3245],
            [8, 1168],
            [10, 426],
            [21, 182]
          ],
          "2024": [
            [0, 813],
            [1, 2685],
            [2, 6026],
            [3, 3878],
            [4, 3018],
            [6, 3332],
            [8, 1177],
            [10, 431],
            [21, 181]
          ]
        },
        "k1": "Winkel zonder warenkoeling",
        "k2": "Winkel met warenkoeling"
      },
      {
        "name": "Woning met andere functie of combinatie van functies",
        "gas": [8.582576, 9.376959, 7.471962, 6.622006, 6.102835],
        "elek": [46.744788, 45.524141, 45.525379, 44.603006, 44.051558],
        "elekIncl": [49.881656, 47.971576, 48.99199, 48.695051, 48.45801],
        "zon": [4.194084, 5.12756, 7.316016, 8.857651, 13.472793],
        "pv": [0.193, 0.232, 0.298, 0.378, 0.423],
        "pGas": [13308, 13588, 13770, 13682, 14149],
        "pElek": [13538, 13820, 14098, 14010, 14585],
        "pZon": [13538, 13820, 14098, 14010, 14585],
        "oGas": {
          "2020": [
            [0, 49],
            [1, 550],
            [2, 4433],
            [3, 4088],
            [4, 2469],
            [6, 1341],
            [8, 253],
            [10, 80],
            [21, 45]
          ],
          "2021": [
            [0, 44],
            [1, 529],
            [2, 4607],
            [3, 4205],
            [4, 2512],
            [6, 1335],
            [8, 234],
            [10, 79],
            [21, 43]
          ],
          "2022": [
            [0, 45],
            [1, 522],
            [2, 4686],
            [3, 4288],
            [4, 2556],
            [6, 1320],
            [8, 231],
            [10, 80],
            [21, 42]
          ],
          "2023": [
            [0, 39],
            [1, 497],
            [2, 4682],
            [3, 4303],
            [4, 2525],
            [6, 1292],
            [8, 227],
            [10, 76],
            [21, 41]
          ],
          "2024": [
            [0, 42],
            [1, 507],
            [2, 4867],
            [3, 4482],
            [4, 2596],
            [6, 1319],
            [8, 224],
            [10, 70],
            [21, 42]
          ]
        },
        "oElek": {
          "2020": [
            [0, 59],
            [1, 571],
            [2, 4616],
            [3, 4217],
            [4, 2433],
            [6, 1289],
            [8, 232],
            [10, 72],
            [21, 49]
          ],
          "2021": [
            [0, 56],
            [1, 550],
            [2, 4781],
            [3, 4337],
            [4, 2485],
            [6, 1273],
            [8, 219],
            [10, 73],
            [21, 46]
          ],
          "2022": [
            [0, 61],
            [1, 542],
            [2, 4909],
            [3, 4450],
            [4, 2528],
            [6, 1274],
            [8, 216],
            [10, 74],
            [21, 44]
          ],
          "2023": [
            [0, 52],
            [1, 512],
            [2, 4908],
            [3, 4488],
            [4, 2482],
            [6, 1241],
            [8, 213],
            [10, 71],
            [21, 43]
          ],
          "2024": [
            [0, 51],
            [1, 532],
            [2, 5123],
            [3, 4698],
            [4, 2577],
            [6, 1285],
            [8, 211],
            [10, 64],
            [21, 44]
          ]
        },
        "k1": "n.v.t.",
        "k2": ""
      },
      {
        "name": "Woning met cafe of restaurant",
        "gas": [15.428901, 15.940694, 13.515859, 12.589985, 11.95018],
        "elek": [86.856411, 79.814298, 86.334144, 86.048404, 86.04129],
        "elekIncl": [88.093529, 81.278211, 88.213517, 88.633274, 89.371144],
        "zon": [null, null, 3.468009, 4.551609, 5.852067],
        "pv": [null, null, 0.103, 0.152, 0.184],
        "pGas": [11033, 11140, 11114, 10860, 11246],
        "pElek": [11034, 11035, 11021, 10728, 11088],
        "pZon": [11034, 11035, 11021, 10728, 11088],
        "oGas": {
          "2020": [
            [0, 33],
            [1, 432],
            [2, 4472],
            [3, 4084],
            [4, 1583],
            [6, 378],
            [8, 41],
            [20, 10]
          ],
          "2021": [
            [0, 30],
            [1, 417],
            [2, 4503],
            [3, 4183],
            [4, 1580],
            [6, 381],
            [19, 46]
          ],
          "2022": [
            [0, 32],
            [1, 406],
            [2, 4454],
            [3, 4218],
            [4, 1577],
            [6, 383],
            [19, 44]
          ],
          "2023": [
            [0, 27],
            [1, 389],
            [2, 4349],
            [3, 4145],
            [4, 1531],
            [6, 381],
            [19, 38]
          ],
          "2024": [
            [0, 30],
            [1, 401],
            [2, 4475],
            [3, 4320],
            [4, 1594],
            [6, 386],
            [19, 40]
          ]
        },
        "oElek": {
          "2020": [
            [0, 32],
            [1, 424],
            [2, 4519],
            [3, 4061],
            [4, 1593],
            [6, 361],
            [19, 44]
          ],
          "2021": [
            [0, 31],
            [1, 419],
            [2, 4501],
            [3, 4125],
            [4, 1559],
            [6, 362],
            [19, 38]
          ],
          "2022": [
            [0, 28],
            [1, 398],
            [2, 4469],
            [3, 4166],
            [4, 1561],
            [6, 364],
            [19, 35]
          ],
          "2023": [
            [0, 18],
            [1, 389],
            [2, 4348],
            [3, 4069],
            [4, 1518],
            [6, 353],
            [19, 33]
          ],
          "2024": [
            [0, 23],
            [1, 388],
            [2, 4480],
            [3, 4244],
            [4, 1555],
            [6, 366],
            [19, 32]
          ]
        },
        "k1": "n.v.t.",
        "k2": ""
      },
      {
        "name": "Woning met winkel",
        "gas": [9.49477, 10.950846, 8.293063, 7.105715, 6.889624],
        "elek": [51.136229, 49.040054, 47.117056, 44.554487, 44.423276],
        "elekIncl": [52.775026, 50.342503, 48.83677, 46.994693, 47.432716],
        "zon": [null, 2.209221, 3.33027, 4.759455, 5.807081],
        "pv": [null, 0.114, 0.157, 0.215, 0.246],
        "pGas": [31866, 32091, 32172, 31655, 32590],
        "pElek": [31548, 31641, 31708, 31125, 32023],
        "pZon": [31548, 31641, 31708, 31125, 32023],
        "oGas": {
          "2020": [
            [0, 166],
            [1, 1626],
            [2, 15858],
            [3, 10718],
            [4, 2790],
            [6, 646],
            [8, 46],
            [20, 16]
          ],
          "2021": [
            [0, 118],
            [1, 1558],
            [2, 16126],
            [3, 10852],
            [4, 2727],
            [6, 642],
            [8, 55],
            [20, 13]
          ],
          "2022": [
            [0, 105],
            [1, 1538],
            [2, 16206],
            [3, 10878],
            [4, 2755],
            [6, 620],
            [8, 56],
            [20, 14]
          ],
          "2023": [
            [0, 104],
            [1, 1489],
            [2, 16014],
            [3, 10688],
            [4, 2701],
            [6, 594],
            [8, 52],
            [20, 13]
          ],
          "2024": [
            [0, 106],
            [1, 1519],
            [2, 16518],
            [3, 10998],
            [4, 2775],
            [6, 612],
            [8, 49],
            [20, 13]
          ]
        },
        "oElek": {
          "2020": [
            [0, 244],
            [1, 1696],
            [2, 15846],
            [3, 10517],
            [4, 2624],
            [6, 572],
            [19, 49]
          ],
          "2021": [
            [0, 167],
            [1, 1640],
            [2, 16030],
            [3, 10598],
            [4, 2584],
            [6, 561],
            [8, 50],
            [20, 11]
          ],
          "2022": [
            [0, 154],
            [1, 1596],
            [2, 16142],
            [3, 10631],
            [4, 2583],
            [6, 539],
            [8, 51],
            [20, 12]
          ],
          "2023": [
            [0, 148],
            [1, 1539],
            [2, 15928],
            [3, 10404],
            [4, 2531],
            [6, 518],
            [8, 45],
            [20, 12]
          ],
          "2024": [
            [0, 145],
            [1, 1564],
            [2, 16413],
            [3, 10710],
            [4, 2598],
            [6, 539],
            [8, 42],
            [20, 12]
          ]
        },
        "k1": "n.v.t.",
        "k2": ""
      },
      {
        "name": "Wooncomplex met andere functie of combinatie van functies",
        "gas": [7.163086, 8.133703, 6.541141, 6.183684, 5.919969],
        "elek": [42.80156, 43.867831, 42.721312, 40.836169, 42.006417],
        "elekIncl": [43.437927, 44.497341, 43.690233, 41.867242, 43.045203],
        "zon": [0.752238, 0.98183, 1.562393, 1.68585, 1.805874],
        "pv": [0.15, 0.178, 0.225, 0.256, 0.303],
        "pGas": [8052, 8250, 8257, 8252, 8279],
        "pElek": [9135, 9420, 9581, 9753, 9947],
        "pZon": [9135, 9420, 9581, 9753, 9947],
        "oGas": {
          "2020": [
            [13, 61],
            [4, 565],
            [6, 2447],
            [8, 2328],
            [10, 1721],
            [21, 930]
          ],
          "2021": [
            [13, 71],
            [4, 607],
            [6, 2496],
            [8, 2389],
            [10, 1749],
            [21, 938]
          ],
          "2022": [
            [13, 65],
            [4, 606],
            [6, 2502],
            [8, 2416],
            [10, 1734],
            [21, 934]
          ],
          "2023": [
            [13, 64],
            [4, 600],
            [6, 2503],
            [8, 2434],
            [10, 1736],
            [21, 915]
          ],
          "2024": [
            [13, 59],
            [4, 604],
            [6, 2514],
            [8, 2460],
            [10, 1732],
            [21, 910]
          ]
        },
        "oElek": {
          "2020": [
            [13, 72],
            [4, 613],
            [6, 2694],
            [8, 2562],
            [10, 2024],
            [21, 1170]
          ],
          "2021": [
            [13, 82],
            [4, 652],
            [6, 2757],
            [8, 2678],
            [10, 2051],
            [21, 1200]
          ],
          "2022": [
            [13, 77],
            [4, 649],
            [6, 2817],
            [8, 2732],
            [10, 2081],
            [21, 1225]
          ],
          "2023": [
            [13, 76],
            [4, 651],
            [6, 2867],
            [8, 2795],
            [10, 2120],
            [21, 1244]
          ],
          "2024": [
            [13, 73],
            [4, 669],
            [6, 2913],
            [8, 2856],
            [10, 2173],
            [21, 1263]
          ]
        },
        "k1": "n.v.t.",
        "k2": ""
      },
      {
        "name": "Wooncomplex met winkels en/of horeca",
        "gas": [7.342214, 8.29488, 6.559036, 5.999583, 5.876569],
        "elek": [54.626489, 54.78363, 53.696904, 50.904312, 51.979382],
        "elekIncl": [55.308393, 55.331623, 54.639387, 51.928104, 52.997597],
        "zon": [0.795054, 0.961927, 1.642791, 1.814693, 1.944584],
        "pv": [0.127, 0.149, 0.19, 0.218, 0.258],
        "pGas": [3982, 4048, 4052, 4057, 4075],
        "pElek": [4275, 4376, 4463, 4538, 4631],
        "pZon": [4275, 4376, 4463, 4538, 4631],
        "oGas": {
          "2020": [
            [13, 41],
            [4, 446],
            [6, 1690],
            [8, 1243],
            [10, 452],
            [21, 110]
          ],
          "2021": [
            [13, 56],
            [4, 450],
            [6, 1753],
            [8, 1243],
            [10, 445],
            [21, 101]
          ],
          "2022": [
            [13, 56],
            [4, 453],
            [6, 1752],
            [8, 1246],
            [10, 448],
            [21, 97]
          ],
          "2023": [
            [13, 54],
            [4, 449],
            [6, 1771],
            [8, 1232],
            [10, 455],
            [21, 96]
          ],
          "2024": [
            [13, 52],
            [4, 448],
            [6, 1772],
            [8, 1249],
            [10, 460],
            [21, 94]
          ]
        },
        "oElek": {
          "2020": [
            [12, 11],
            [3, 39],
            [4, 467],
            [6, 1795],
            [8, 1316],
            [10, 522],
            [21, 125]
          ],
          "2021": [
            [13, 58],
            [4, 485],
            [6, 1869],
            [8, 1328],
            [10, 517],
            [21, 119]
          ],
          "2022": [
            [13, 61],
            [4, 502],
            [6, 1896],
            [8, 1360],
            [10, 524],
            [21, 120]
          ],
          "2023": [
            [13, 60],
            [4, 502],
            [6, 1939],
            [8, 1364],
            [10, 545],
            [21, 128]
          ],
          "2024": [
            [13, 59],
            [4, 518],
            [6, 1972],
            [8, 1399],
            [10, 555],
            [21, 128]
          ]
        },
        "k1": "n.v.t.",
        "k2": ""
      },
      {
        "name": "Woonzorgcomplex",
        "gas": [12.452212, 14.879299, 12.528629, 12.252873, 11.100053],
        "elek": [53.661294, 58.029138, 56.410131, 54.936138, 54.22745],
        "elekIncl": [55.354852, 59.979928, 59.288102, 57.750109, 57.039455],
        "zon": [2.034129, 2.703231, 4.012503, 3.959769, 4.019711],
        "pv": [0.144, 0.181, 0.233, 0.272, 0.321],
        "pGas": [1386, 1403, 1423, 1432, 1459],
        "pElek": [1524, 1551, 1607, 1631, 1684],
        "pZon": [1524, 1551, 1607, 1631, 1684],
        "oGas": {
          "2020": [
            [12, 92],
            [3, 178],
            [4, 304],
            [6, 341],
            [8, 198],
            [10, 193],
            [21, 80]
          ],
          "2021": [
            [11, 10],
            [2, 85],
            [3, 198],
            [4, 294],
            [6, 356],
            [8, 210],
            [10, 186],
            [21, 64]
          ],
          "2022": [
            [12, 99],
            [3, 202],
            [4, 299],
            [6, 370],
            [8, 204],
            [10, 183],
            [21, 66]
          ],
          "2023": [
            [12, 104],
            [3, 207],
            [4, 296],
            [6, 374],
            [8, 208],
            [10, 178],
            [21, 65]
          ],
          "2024": [
            [11, 10],
            [2, 96],
            [3, 213],
            [4, 304],
            [6, 373],
            [8, 214],
            [10, 184],
            [21, 65]
          ]
        },
        "oElek": {
          "2020": [
            [11, 10],
            [2, 90],
            [3, 181],
            [4, 324],
            [6, 399],
            [8, 226],
            [10, 199],
            [21, 95]
          ],
          "2021": [
            [11, 12],
            [2, 90],
            [3, 200],
            [4, 323],
            [6, 419],
            [8, 234],
            [10, 200],
            [21, 73]
          ],
          "2022": [
            [11, 15],
            [2, 96],
            [3, 210],
            [4, 330],
            [6, 448],
            [8, 232],
            [10, 200],
            [21, 76]
          ],
          "2023": [
            [11, 12],
            [2, 100],
            [3, 221],
            [4, 328],
            [6, 460],
            [8, 233],
            [10, 199],
            [21, 78]
          ],
          "2024": [
            [11, 13],
            [2, 105],
            [3, 234],
            [4, 342],
            [6, 466],
            [8, 245],
            [10, 202],
            [21, 77]
          ]
        },
        "k1": "Tehuis met overnachting",
        "k2": ""
      },
      {
        "name": "Ziekenhuis",
        "gas": [27.408745, 55.569303, 44.817853, 47.348045, 45.170641],
        "elek": [224.2297, 389.219685, 362.997192, 351.720326, 361.27263],
        "elekIncl": [226.268946, 395.267969, 369.388649, 357.736271, 367.095391],
        "zon": [null, null, null, null, null],
        "pv": [0.181, 0.171, 0.204, 0.211, 0.274],
        "pGas": [112, 104, 104, 105, 105],
        "pElek": [116, 111, 113, 114, 117],
        "pZon": [116, 111, 113, 114, 117],
        "oGas": {
          "2020": [
            [13, 13],
            [4, 12],
            [6, 12],
            [8, 20],
            [10, 18],
            [21, 37]
          ],
          "2021": [
            [13, 14],
            [4, 13],
            [6, 13],
            [8, 23],
            [10, 21],
            [21, 20]
          ],
          "2022": [
            [13, 15],
            [4, 12],
            [6, 12],
            [8, 24],
            [10, 21],
            [21, 20]
          ],
          "2023": [
            [13, 15],
            [4, 12],
            [6, 14],
            [8, 23],
            [10, 21],
            [21, 20]
          ],
          "2024": [
            [13, 15],
            [4, 12],
            [6, 13],
            [8, 25],
            [10, 18],
            [21, 22]
          ]
        },
        "oElek": {
          "2020": [
            [14, 23],
            [6, 16],
            [8, 20],
            [10, 18],
            [21, 39]
          ],
          "2021": [
            [13, 15],
            [4, 11],
            [6, 22],
            [8, 22],
            [10, 21],
            [21, 20]
          ],
          "2022": [
            [13, 16],
            [4, 11],
            [6, 22],
            [8, 21],
            [10, 24],
            [21, 19]
          ],
          "2023": [
            [13, 15],
            [4, 12],
            [6, 22],
            [8, 21],
            [10, 23],
            [21, 21]
          ],
          "2024": [
            [13, 16],
            [4, 11],
            [6, 22],
            [8, 23],
            [10, 23],
            [21, 22]
          ]
        },
        "k1": "Ziekenhuis",
        "k2": ""
      },
      {
        "name": "Zorg met bed",
        "gas": [13.270636, 15.526409, 12.953737, 12.10352, 11.03802],
        "elek": [61.65931, 60.722861, 58.507861, 57.3773, 56.693674],
        "elekIncl": [64.249759, 63.537536, 62.245468, 61.01933, 60.891358],
        "zon": [3.079565, 3.808352, 5.476158, 5.097885, 5.579905],
        "pv": [0.136, 0.157, 0.196, 0.229, 0.272],
        "pGas": [382, 391, 398, 398, 398],
        "pElek": [396, 408, 419, 420, 423],
        "pZon": [396, 408, 419, 420, 423],
        "oGas": {
          "2020": [
            [12, 13],
            [3, 53],
            [4, 90],
            [6, 146],
            [8, 41],
            [10, 27],
            [21, 12]
          ],
          "2021": [
            [12, 14],
            [3, 54],
            [4, 98],
            [6, 143],
            [8, 40],
            [10, 30],
            [21, 12]
          ],
          "2022": [
            [12, 14],
            [3, 53],
            [4, 101],
            [6, 145],
            [8, 44],
            [10, 28],
            [21, 13]
          ],
          "2023": [
            [12, 15],
            [3, 53],
            [4, 97],
            [6, 148],
            [8, 43],
            [10, 28],
            [21, 14]
          ],
          "2024": [
            [12, 12],
            [3, 55],
            [4, 99],
            [6, 149],
            [8, 42],
            [10, 28],
            [21, 13]
          ]
        },
        "oElek": {
          "2020": [
            [12, 16],
            [3, 55],
            [4, 95],
            [6, 153],
            [8, 38],
            [10, 27],
            [21, 12]
          ],
          "2021": [
            [12, 17],
            [3, 57],
            [4, 100],
            [6, 155],
            [8, 38],
            [10, 31],
            [21, 10]
          ],
          "2022": [
            [12, 19],
            [3, 53],
            [4, 104],
            [6, 160],
            [8, 42],
            [10, 30],
            [21, 11]
          ],
          "2023": [
            [12, 18],
            [3, 53],
            [4, 102],
            [6, 164],
            [8, 41],
            [10, 30],
            [21, 12]
          ],
          "2024": [
            [12, 17],
            [3, 57],
            [4, 105],
            [6, 163],
            [8, 40],
            [10, 30],
            [21, 11]
          ]
        },
        "k1": "Tehuis met overnachting",
        "k2": ""
      },
      {
        "name": "Zorginstelling",
        "gas": [21.752302, 27.408857, 24.669533, 23.05026, 22.391111],
        "elek": [138.689082, 92.091996, 97.331854, 101.17832, 95.984976],
        "elekIncl": [143.552399, 101.382694, 108.496035, 112.940818, 106.235985],
        "zon": [7.75958, 13.935906, 16.983658, 17.138918, 14.184026],
        "pv": [0.176, 0.197, 0.227, 0.251, 0.301],
        "pGas": [160, 162, 158, 157, 159],
        "pElek": [170, 173, 172, 175, 173],
        "pZon": [170, 173, 172, 175, 173],
        "oGas": {
          "2020": [
            [12, 20],
            [3, 36],
            [4, 27],
            [6, 39],
            [8, 19],
            [20, 19]
          ],
          "2021": [
            [12, 21],
            [3, 39],
            [4, 28],
            [6, 37],
            [8, 20],
            [20, 17]
          ],
          "2022": [
            [12, 20],
            [3, 35],
            [4, 28],
            [6, 40],
            [8, 19],
            [20, 16]
          ],
          "2023": [
            [12, 19],
            [3, 35],
            [4, 28],
            [6, 42],
            [8, 18],
            [20, 15]
          ],
          "2024": [
            [12, 19],
            [3, 34],
            [4, 29],
            [6, 42],
            [8, 19],
            [20, 16]
          ]
        },
        "oElek": {
          "2020": [
            [12, 16],
            [3, 37],
            [4, 31],
            [6, 41],
            [8, 24],
            [20, 21]
          ],
          "2021": [
            [12, 18],
            [3, 38],
            [4, 33],
            [6, 39],
            [8, 26],
            [20, 19]
          ],
          "2022": [
            [12, 18],
            [3, 35],
            [4, 34],
            [6, 42],
            [8, 25],
            [20, 18]
          ],
          "2023": [
            [12, 19],
            [3, 35],
            [4, 34],
            [6, 44],
            [8, 25],
            [20, 18]
          ],
          "2024": [
            [12, 16],
            [3, 34],
            [4, 35],
            [6, 45],
            [8, 25],
            [20, 18]
          ]
        },
        "k1": "Opvang zonder overnachting",
        "k2": ""
      },
      {
        "name": "Zorgpraktijk",
        "gas": [9.163655, 10.867884, 8.84787, 8.027182, 7.438738],
        "elek": [51.013974, 51.062126, 50.816244, 47.10153, 45.372452],
        "elekIncl": [54.486774, 54.096482, 54.764813, 52.105611, 51.378313],
        "zon": [3.975366, 4.770752, 6.602615, 8.578753, 10.420916],
        "pv": [0.139, 0.166, 0.217, 0.303, 0.354],
        "pGas": [2302, 2304, 2295, 2249, 2281],
        "pElek": [2452, 2461, 2477, 2446, 2488],
        "pZon": [2452, 2461, 2477, 2446, 2488],
        "oGas": {
          "2020": [
            [0, 17],
            [1, 184],
            [2, 965],
            [3, 692],
            [4, 303],
            [6, 110],
            [8, 20],
            [20, 11]
          ],
          "2021": [
            [0, 19],
            [1, 175],
            [2, 988],
            [3, 696],
            [4, 296],
            [6, 99],
            [8, 19],
            [20, 12]
          ],
          "2022": [
            [0, 20],
            [1, 170],
            [2, 978],
            [3, 700],
            [4, 294],
            [6, 101],
            [8, 20],
            [20, 12]
          ],
          "2023": [
            [0, 21],
            [1, 165],
            [2, 959],
            [3, 681],
            [4, 290],
            [6, 100],
            [8, 21],
            [20, 12]
          ],
          "2024": [
            [0, 23],
            [1, 168],
            [2, 969],
            [3, 695],
            [4, 290],
            [6, 104],
            [8, 20],
            [20, 12]
          ]
        },
        "oElek": {
          "2020": [
            [0, 28],
            [1, 202],
            [2, 1003],
            [3, 743],
            [4, 334],
            [6, 112],
            [8, 20],
            [20, 10]
          ],
          "2021": [
            [0, 31],
            [1, 191],
            [2, 1019],
            [3, 748],
            [4, 333],
            [6, 108],
            [8, 20],
            [20, 11]
          ],
          "2022": [
            [0, 29],
            [1, 190],
            [2, 1021],
            [3, 754],
            [4, 338],
            [6, 114],
            [8, 20],
            [20, 11]
          ],
          "2023": [
            [0, 29],
            [1, 188],
            [2, 1006],
            [3, 736],
            [4, 338],
            [6, 118],
            [8, 20],
            [20, 11]
          ],
          "2024": [
            [0, 30],
            [1, 184],
            [2, 1017],
            [3, 762],
            [4, 343],
            [6, 122],
            [8, 19],
            [20, 11]
          ]
        },
        "k1": "Medische (groeps) praktijk",
        "k2": ""
      },
      {
        "name": "Zwembad",
        "gas": [32.886905, 36.646852, 35.156078, 35.480148, 32.080442],
        "elek": [115.932453, 115.137573, 125.575701, 123.175339, 124.473975],
        "elekIncl": [120.817046, 120.828122, 133.177303, 130.966426, 132.32955],
        "zon": [6.605334, 7.153226, 9.589221, 9.825802, 10.066625],
        "pv": [0.232, 0.249, 0.287, 0.329, 0.394],
        "pGas": [487, 491, 491, 485, 482],
        "pElek": [478, 482, 491, 487, 502],
        "pZon": [478, 482, 491, 487, 502],
        "oGas": {
          "2020": [
            [11, 29],
            [2, 57],
            [3, 54],
            [4, 55],
            [6, 98],
            [8, 108],
            [10, 72],
            [21, 14]
          ],
          "2021": [
            [11, 29],
            [2, 58],
            [3, 56],
            [4, 55],
            [6, 100],
            [8, 108],
            [10, 71],
            [21, 14]
          ],
          "2022": [
            [11, 30],
            [2, 58],
            [3, 54],
            [4, 56],
            [6, 96],
            [8, 111],
            [10, 72],
            [21, 14]
          ],
          "2023": [
            [11, 26],
            [2, 60],
            [3, 53],
            [4, 52],
            [6, 97],
            [8, 110],
            [10, 72],
            [21, 15]
          ],
          "2024": [
            [11, 28],
            [2, 61],
            [3, 52],
            [4, 55],
            [6, 95],
            [8, 107],
            [10, 68],
            [21, 16]
          ]
        },
        "oElek": {
          "2020": [
            [11, 34],
            [2, 57],
            [3, 57],
            [4, 56],
            [6, 85],
            [8, 108],
            [10, 70],
            [21, 11]
          ],
          "2021": [
            [11, 36],
            [2, 55],
            [3, 59],
            [4, 57],
            [6, 85],
            [8, 109],
            [10, 70],
            [21, 11]
          ],
          "2022": [
            [11, 40],
            [2, 56],
            [3, 57],
            [4, 56],
            [6, 88],
            [8, 110],
            [10, 72],
            [21, 12]
          ],
          "2023": [
            [11, 39],
            [2, 58],
            [3, 58],
            [4, 54],
            [6, 86],
            [8, 109],
            [10, 71],
            [21, 12]
          ],
          "2024": [
            [11, 42],
            [2, 60],
            [3, 61],
            [4, 57],
            [6, 88],
            [8, 108],
            [10, 72],
            [21, 14]
          ]
        },
        "k1": "Zwembad",
        "k2": ""
      }
    ],
    "weiiTypes": ["Restaurant", "Café", "Kinderopvang", "Sauna", "Overig", "Cellengebouw", "Ziekenhuis", "Tehuis met overnachting", "Medische (groeps) praktijk", "Opvang zonder overnachting", "Bedrijfshal", "Koel/vrieshuis", "Garage/showroom", "Kantoor", "Hotel", "Vakantiepark", "Basis/ Voorgezet onderwijs", "Universiteit/HBO/MBO", "Sportaccommodatie binnen", "Sportaccommodatie buiten", "Zwembad", "Winkel met warenkoeling", "Winkel zonder warenkoeling", "Grondgebonden woningen", "Appartementen"],
    "classLabels": ["tot 50 m2", "50 tot 100 m2", "100 tot 250 m2", "250 tot 500 m2", "500 tot 1000 m2", "500 tot 2500 m2", "1000 tot 2500 m2", "1000 tot 5000 m2", "2500 tot 5000 m2", "2500 tot 10000 m2", "5000 tot 10000 m2", "tot 100 m2", "tot 250 m2", "tot 500 m2", "tot 1000 m2", "tot 2500 m2", "vanaf 250 m2", "vanaf 500 m2", "vanaf 1000 m2", "vanaf 2500 m2", "vanaf 5000 m2", "vanaf 10000 m2"],
    "classRep": [30, 75, 175, 375, 750, 1500, 1750, 3000, 3750, 6250, 7500, 60, 150, 300, 600, 1500, 500, 1000, 2000, 5000, 10000, 20000],
    "fallbackArea": 1000,
    "fcor": [0.102, -0.064, 0.075, 0.111, 0.126],
    "gasFactor": 9.77,
    "co2gas": [1.884, 2.085, 2.079, 2.134, 2.134],
    "co2elek": [0.475, 0.427, 0.337, 0.328, 0.268]
  },
  "weii_info": {
    "Restaurant": {
      "partial": false,
      "thr": [200, 270, 415, 695, 1075]
    },
    "Café": {
      "partial": true,
      "thr": [70, 90, 140, null, null]
    },
    "Kinderopvang": {
      "partial": false,
      "thr": [50, 80, 130, 195, 285]
    },
    "Sauna": {
      "partial": true,
      "thr": [160, 200, 300, null, null]
    },
    "Overig": {
      "partial": false,
      "thr": [70, 90, 130, 245, 415]
    },
    "Cellengebouw": {
      "partial": false,
      "thr": [100, 130, 200, 340, 590]
    },
    "Ziekenhuis": {
      "partial": false,
      "thr": [100, 135, 185, 315, 500]
    },
    "Tehuis met overnachting": {
      "partial": false,
      "thr": [80, 115, 160, 285, 455]
    },
    "Medische (groeps) praktijk": {
      "partial": true,
      "thr": [80, 110, 150, null, null]
    },
    "Opvang zonder overnachting": {
      "partial": true,
      "thr": [90, 115, 170, null, null]
    },
    "Bedrijfshal": {
      "partial": false,
      "thr": [-25, -10, 20, 70, 115]
    },
    "Koel/vrieshuis": {
      "partial": false,
      "thr": [15, 35, 80, 165, 275]
    },
    "Garage/showroom": {
      "partial": true,
      "thr": [70, 90, 140, null, null]
    },
    "Kantoor": {
      "partial": false,
      "thr": [70, 100, 150, 230, 330]
    },
    "Hotel": {
      "partial": false,
      "thr": [110, 140, 210, 375, 640]
    },
    "Vakantiepark": {
      "partial": true,
      "thr": [70, 90, 140, null, null]
    },
    "Basis/ Voorgezet onderwijs": {
      "partial": false,
      "thr": [60, 85, 120, 165, 290]
    },
    "Universiteit/HBO/MBO": {
      "partial": false,
      "thr": [70, 90, 125, 225, 380]
    },
    "Sportaccommodatie binnen": {
      "partial": true,
      "thr": [70, 90, 140, null, null]
    },
    "Sportaccommodatie buiten": {
      "partial": true,
      "thr": [80, 95, 160, null, null]
    },
    "Zwembad": {
      "partial": false,
      "thr": [210, 300, 430, 765, 1365]
    },
    "Winkel met warenkoeling": {
      "partial": true,
      "thr": [150, 175, 300, null, null]
    },
    "Winkel zonder warenkoeling": {
      "partial": false,
      "thr": [80, 100, 165, 290, 520]
    },
    "Grondgebonden woningen": {
      "partial": true,
      "thr": [35, 55, 90, null, null]
    },
    "Appartementen": {
      "partial": true,
      "thr": [45, 65, 100, null, null]
    }
  },
  "cat_weii": {
    "Kantoor": "Kantoor",
    "Onderwijs (po/vo)": "Basis/ Voorgezet onderwijs",
    "Onderwijs (mbo/hbo/wo)": "Universiteit/HBO/MBO",
    "Kinderopvang": "Kinderopvang",
    "Ziekenhuis": "Ziekenhuis",
    "Zorg met overnachting": "Tehuis met overnachting",
    "Winkel": "Winkel zonder warenkoeling",
    "Restaurant/café": "Restaurant",
    "Hotel": "Hotel",
    "Bedrijfshal": "Bedrijfshal",
    "Koel/vrieshuis": "Koel/vrieshuis",
    "Cellengebouw": "Cellengebouw",
    "Zwembad": "Zwembad",
    "Bijeenkomst (overig)": "Overig"
  }
};
