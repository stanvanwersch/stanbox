/* Rekenmotor van het dashboard: dezelfde rekenregels als het Excel-werkboek
   (tabs Koppeling, Oppervlak TNO, Gewichten, Kentallen WEii, Weercorrectie aandeel).
   Alle invoer komt uit de instellingen; de motor wordt na elke wijziging opnieuw doorlopen. */
(function(root){
'use strict';

const isNum = v => typeof v === 'number' && isFinite(v);
const NVT = 'n.v.t.';

// Gemiddeld oppervlak per pand (m2) voor één TNO-type, één energiedrager, één jaar:
// 1) TNO-invoer (instelling) als die is ingevuld,
// 2) anders de schatting uit de oppervlakteklassen van dat jaar (aantal panden x representatief m2),
// 3) anders de schatting over alle jaren samen, 4) anders het terugvaloppervlak.
function estimateArea(raw, rows, allRows){
  const tot = (rs) => { let n = 0, a = 0; (rs||[]).forEach(r => { n += r[1]; a += r[1] * raw.classRep[r[0]]; }); return {n, a}; };
  const y = tot(rows);
  if(y.n > 0) return y.a / y.n;
  const p = tot(allRows);
  if(p.n > 0) return p.a / p.n;
  return raw.fallbackArea;
}

function compute(raw, st){
  const Y = raw.years, NY = Y.length;
  const T = raw.types;

  // --- gemiddeld oppervlak per pand en gewichten per TNO-type
  const info = T.map((t, ti) => {
    const pooled = (o) => [].concat(...Object.keys(o).map(k => o[k]));
    const allGas = pooled(t.oGas), allElek = pooled(t.oElek);
    const areaGas = [], areaElek = [], estGas = [], estElek = [];
    for(let i = 0; i < NY; i++){
      const y = String(Y[i]);
      const inG = st.oppGas && st.oppGas[ti] ? st.oppGas[ti][i] : null;
      const inE = st.oppElek && st.oppElek[ti] ? st.oppElek[ti][i] : null;
      estGas.push(estimateArea(raw, t.oGas[y], allGas));
      estElek.push(estimateArea(raw, t.oElek[y], allElek));
      areaGas.push(isNum(inG) ? inG : estGas[i]);
      areaElek.push(isNum(inE) ? inE : estElek[i]);
    }
    return {
      areaGas, areaElek, estGas, estElek,
      wGas: areaGas.map((a, i) => t.pGas[i] * a),
      wElek: areaElek.map((a, i) => t.pElek[i] * a),
      wZon: areaElek.map((a, i) => t.pZon[i] * a),     // zonnestroom weegt met het oppervlak van de elektriciteitspopulatie
    };
  });

  // --- per WEii-gebruikstype: gewogen gemiddelde van de gekoppelde TNO-types
  const out = {};
  raw.weiiTypes.forEach(w => {
    const linked = [];
    T.forEach((t, ti) => { const m = st.map[ti] || ['', '']; if(m[0] === w || m[1] === w) linked.push(ti); });
    const wa = st.weer && st.weer[w] ? st.weer[w] : {};
    const aG = isNum(wa.gas) ? wa.gas : 0, aE = isNum(wa.elek) ? wa.elek : 0;
    const series = {};
    const wavg = (valFn, wFn, i) => {
      let num = 0, den = 0;
      linked.forEach(ti => { const v = valFn(T[ti], i); const wt = wFn(info[ti], i); if(isNum(v) && isNum(wt)){ num += v * wt; den += wt; } });
      return den > 0 ? num / den : null;
    };
    for(let i = 0; i < NY; i++){
      const gasRaw  = wavg((t,k) => t.gas[k],      (f,k) => f.wGas[k],  i);
      const elek    = wavg((t,k) => t.elek[k],     (f,k) => f.wElek[k], i);
      const elekInc = wavg((t,k) => t.elekIncl[k], (f,k) => f.wElek[k], i);
      const zon     = wavg((t,k) => t.zon[k],      (f,k) => f.wZon[k],  i);
      const pv      = wavg((t,k) => t.pv[k],       (f,k) => f.wZon[k],  i);
      const f = raw.fcor[i];
      const gasCorr = gasRaw === null ? null : gasRaw * (1 + f * aG);
      const gasKwh  = gasCorr === null ? null : gasCorr * raw.gasFactor;
      const elekCorr = elek === null ? null : elek * (1 + f * aE);
      const weii = (elek === null || gasKwh === null) ? null : elekCorr + gasKwh;
      const eigen = (zon === null || elekInc === null || elek === null) ? null : elekInc - elek;
      let panden = 0, gewicht = 0;
      linked.forEach(ti => { panden += T[ti].pElek[i]; gewicht += info[ti].wElek[i]; });
      series[Y[i]] = {
        gas_kental_m3: gasCorr, gas_kental_m3_raw: gasRaw, weer_factor_verw: f,
        elek_kental_kwh: elek, elek_kental_kwh_corr: elekCorr,
        weii, weii_gas: gasKwh,
        aantal_panden: panden, gewicht_m2: gewicht,
        pv_aandeel: pv, opwek_kwh: zon, eigenverbruik_kwh: eigen,
      };
    }
    out[w] = {linked: linked.map(ti => T[ti].name), series};
  });
  return {byType: out, info};
}

root.WeiiEngine = {compute, isNum, NVT};
})(typeof window !== 'undefined' ? window : globalThis);
if(typeof module !== 'undefined') module.exports = globalThis.WeiiEngine;
