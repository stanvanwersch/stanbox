/* Rekenkern wateroverlast: de rekenketen zonder pagina.
   Geen DOM, geen opmaak: alleen getallen erin en getallen eruit. De pagina (02-pagina.js) gebruikt
   deze kern, en dezelfde kern kan een hele portefeuille panden doorrekenen.
   Gebruikt de data uit data/schadecurves.js (DC_CURVES) en data/maatregelen.js (DC_MAATREGELEN).

   Hoofdfunctie: DC_REKENKERN.bereken(invoer) → uitkomst

   invoer = {
     h:     [h100, h250, h1000]  waterdiepte (cm) t.o.v. maaiveld bij de drie buien (stap 1)
     corr:  correctie op h (cm), standaard 0
     t0:    herhalingstijd waaronder geen schade (jaar), bijv. 100
     K:     gebouwkenmerken (stap 2): {hdr, hin, A, crawl, kelder ('none' of cm), riool ('gemengd'|'gescheiden'),
            bj, inst ('onder'|'bg'|'hoger'), route ('woon'|'kruip'), schot, rooster, klep, sealed}
     C:     kentallen (stap 3): {curve, cvast, cdiep, dkr, dkel, drio, dinst, cind, W, I, pinb, pinbd, f, extra:[eigen posten]}
     maatregelen: lijst met id's die aan staan, bijv. ['m76','m102']
     kosten: optioneel {id: euro} om standaardkosten te overschrijven
     rente:  discontovoet (bijv. 0.0225), horizon: jaren, onderhoud: % van de investering per jaar
   }
   uitkomst: zie het return-object van bereken() (EAD, vermeden schade, kosten-baten, met bandbreedte
   over alle curves en uitsplitsing naar opstal, inboedel en indirect). */
(function(G){
const T=[100,250,1000];
const CATS=[['opstal','Opstal','--phase2'],['inboedel','Inboedel','--phase1'],['indirect','Indirect','--text3']];  // naam voor weergave: DC.t('cat.<sleutel>')
const curves=()=>G.DC_CURVES||[];
const cv=id=>curves().find(c=>c.id===id)||curves()[0];
const ids=()=>curves().map(c=>c.id);

// ---- stap 1 en 2: FCAB-2 klimaatrisicoscore
// gebouwscore(): rijen [kenmerk, punten, situatie] als sleutels; de teksten staan in data/teksten.js ('gs.<kenmerk>', 'gs.<kenmerk>.<situatie>')
// FCAB-2 tabel 17: rij = omgevingsscore 1..5, 20 kolommen (gebouwscore 5..100). Waarde = klasse 1..5
const run_=(a)=>a.flatMap(([n,v])=>Array(n).fill(v));
const MX={5:run_([[3,1],[3,2],[3,3],[11,5]]),4:run_([[5,1],[3,2],[4,3],[5,4],[3,5]]),3:run_([[6,1],[3,2],[8,3],[3,4]]),2:run_([[8,1],[9,2],[3,3]]),1:run_([[17,1],[3,2]])};
const colIdx=g=>Math.min(19,Math.max(0,Math.ceil(g/5)-1));
const krs=(o,g)=>o===0?0:MX[o][colIdx(g)];
const omgScore=h=>h<2?0:h<=10?1:h<=15?2:h<=20?3:h<=30?4:5;
function gebouwscore(K){
  const rows=[];
  let p1; if(K.schot) p1=[10,'schot']; else if(K.hdr<=0) p1=[40,'0']; else if(K.hdr<=15) p1=[28,'1-15']; else p1=[4,'15+'];
  rows.push(['ingang',...p1]);
  let p2; if(K.kelder==='none') p2=[0,'geen']; else if(K.rooster||K.schot||K.kelder>15) p2=[6,K.kelder>15?'15+':'schot']; else if(K.kelder<=0) p2=[15,'0']; else p2=[10.5,'1-15'];
  rows.push(['kelder',...p2]);
  let p3; if(K.sealed||K.hin>15) p3=[0,'geen']; else if(K.schot) p3=[8,'schot']; else p3=[20,'laag'];
  rows.push(['instroom',...p3]);
  const veilig=K.riool==='gescheiden'||K.klep||K.bj>1981;
  rows.push(['riool',veilig?0:5,veilig?(K.riool==='gescheiden'?'gescheiden':K.klep?'klep':'ontlastput'):'gemengd']);
  let p5; if(K.inst==='onder') p5=[20,'onder']; else if(K.inst==='bg'&&K.hdr<=0&&!K.schot) p5=[14,'bg0']; else p5=[0,K.inst==='bg'?'bg':'hoger'];
  rows.push(['inst',...p5]);
  return {rows,total:rows.reduce((s,r)=>s+r[1],0)};
}

// ---- stap 3: schade bij waterdiepte h (cm t.o.v. maaiveld), per categorie
// waterdiepte waarop water de woonruimte bereikt: de laagste opening (ingang of, als dat instroompunt
// naar de woonruimte leidt en niet is afgedicht, het instroompunt). Schot telt alleen bij de ingang.
function entry(K){ const d=K.hdr+(K.schot?15:0); return (K.route==='woon'&&!K.sealed)?Math.min(d,K.hin):d; }
const entryWhy=K=>entry(K)<K.hdr+(K.schot?15:0)?'instroom':'ingang';  // sleutel, tekst in data/teksten.js
function parts(h,K,C){
  const d={opstal:0,inboedel:0,indirect:0}; if(h<=0) return d;
  if(K.crawl && !K.sealed && h>=K.hin) d.opstal+=C.dkr;
  const rioolRisk=K.riool==='gemengd'&&!K.klep&&K.bj<=1981; if(rioolRisk && h>=10) d.opstal+=C.drio;
  if(K.kelder!=='none'){const hk=(K.rooster||K.schot)?Math.max(K.kelder,15):K.kelder; if(h>=hk){d.opstal+=C.dkel; if(K.inst==='onder') d.opstal+=C.dinst;}}
  const hdr=entry(K);
  if(h>=hdr){ d.opstal+=binnen(h-hdr,K.A,C); d.inboedel+=inboedel(h-hdr,C); d.indirect+=C.cind; if(K.inst==='bg') d.opstal+=C.dinst; }
  (C.extra||[]).forEach(p=>{ if(p.mode==='binnen'?h>=hdr:p.mode==='instroom'?(!K.sealed&&h>=K.hin):h>=p.cm) d[p.cat||'opstal']+=p.amt; });
  return d;
}
function damage(h,K,C){ const d=parts(h,K,C); return d.opstal+d.inboedel+d.indirect; }
// schade binnen het pand volgens de gekozen curve (data/schadecurves.js); x = cm boven ingang/vloer
function interp(pts,x){ if(x<=pts[0][0]) return pts[0][1]; for(let i=1;i<pts.length;i++){ if(x<=pts[i][0]){const [x0,y0]=pts[i-1],[x1,y1]=pts[i]; return y0+(y1-y0)*(x-x0)/(x1-x0);} } return pts[pts.length-1][1]; }
function binnen(x,A,C){
  const cu=cv(C.curve);
  if(cu.type==='punten') return A*C.f*cu.maxPerM2*interp(cu.punten,x);
  if(cu.type==='wortel') return A*C.f*C.W*Math.min(1,cu.a+cu.b*Math.sqrt(Math.max(0,x)));
  return A*C.f*(C.cvast+C.cdiep*Math.min(x,30));
}
function inboedel(x,C){
  const ib=cv(C.curve).inboedel||{type:'inbegrepen'};
  if(ib.type==='wortel') return C.I*Math.min(1,ib.a+ib.b*Math.sqrt(Math.max(0,x)));
  if(ib.type==='kentallen') return C.I*Math.min(1,(C.pinb+C.pinbd*Math.min(x,30))/100);
  return 0;
}
const withCurve=(C,id)=>({...C,curve:id});

// ---- stap 4: jaarlijks verwachte schade (trapeziumregel over de kansen), optioneel één categorie
function ead(hs,K,C,t0,cat){
  const f=cat?h=>parts(h,K,C)[cat]:h=>damage(h,K,C);
  const pts=[[1/t0,0]].concat(T.map((t,i)=>[1/t,f(hs[i])]));
  let s=0; for(let i=0;i<pts.length-1;i++) s+=(pts[i][0]-pts[i+1][0])*(pts[i][1]+pts[i+1][1])/2;
  return s+pts[pts.length-1][0]*pts[pts.length-1][1];
}

// ---- stap 5: maatregelen toepassen (effect uit data/maatregelen.js)
function metMaatregelen(hs,K,C,aan,kosten){
  const K2={...K}, C2={...C}; let dh=0, cost=0; const regels=[];
  const on=new Set(aan||[]);
  (G.DC_MAATREGELEN||[]).forEach(m=>{ if(!on.has(m.id)) return;
    const e=m.effect||{};
    if(e.dh) dh+=e.dh;
    if(e.hdr) K2.hdr=K2.hdr+e.hdr;
    ['schot','sealed','klep','rooster'].forEach(k=>{ if(e[k]) K2[k]=true; });
    if(e.inst) K2.inst=e.inst;
    if(e.f!=null) C2.f=C2.f*e.f;
    if(e.regel) regels.push(e.regel);
    cost+=(kosten&&kosten[m.id]!=null)?kosten[m.id]:m.cost;
  });
  return {hs2:hs.map(h=>Math.max(0,h-dh)),K2,C2,dh,regels,cost};
}

// ---- stap 6: annuïteitenfactor
const ann=(r,N)=>(1-Math.pow(1+r,-N))/r;
const range=o=>{const v=ids().map(id=>o[id]); return [Math.min(...v),Math.max(...v)];};

// ---- de hele keten voor één pand
function bereken(inv){
  const IDS=ids(), per=f=>Object.fromEntries(IDS.map(id=>[id,f(id)]));
  const corr=inv.corr||0, t0=inv.t0;
  const hs=inv.h.map(h=>Math.max(0,h+corr));
  const K={schot:false,rooster:false,klep:false,sealed:false,route:'woon',...inv.K};
  const C={f:1,extra:[],...inv.C}; C.curve=C.curve||IDS[0];
  const O=omgScore(hs[0]), Gs=gebouwscore(K), R=krs(O,Gs.total);
  const {hs2,K2,C2,dh,regels,cost}=metMaatregelen(hs,K,C,inv.maatregelen,inv.kosten);
  const O2=omgScore(hs2[0]), Gs2=gebouwscore(K2), R2=krs(O2,Gs2.total);
  const E=ead(hs,K,C,t0), E2=ead(hs2,K2,C2,t0), dE=E-E2;
  const a=ann(inv.rente,inv.horizon), cwB=dE*a, cwK=cost+cost*(inv.onderhoud||0)/100*a, NCW=cwB-cwK;
  // bandbreedte: dezelfde berekening met elke curve
  const Ec=per(id=>ead(hs,K,withCurve(C,id),t0)), dEc=per(id=>Ec[id]-ead(hs2,K2,withCurve(C2,id),t0));
  const EcCat=Object.fromEntries(CATS.map(([k])=>[k,per(id=>ead(hs,K,withCurve(C,id),t0,k))]));
  const dECat=Object.fromEntries(CATS.map(([k])=>[k,ead(hs,K,C,t0,k)-ead(hs2,K2,C2,t0,k)]));
  const NCWc=per(id=>dEc[id]*a-cwK), BKc=per(id=>cwK>0?dEc[id]*a/cwK:0);
  return {hs,hs2,K,K2,C,C2,dh,regels,cost,t0,
    O,O2,gebouw:Gs,gebouw2:Gs2,R,R2, instap:entry(K), instap2:entry(K2),
    E,E2,dE,a,cwB,cwK,NCW, BK:cwK>0?cwB/cwK:null,
    Ec,dEc,EcCat,dECat,NCWc,BKc,
    marge:{E:range(Ec),dE:range(dEc),NCW:range(NCWc),BK:range(BKc)}};
}

// ---- een portefeuille: dezelfde keten per pand, opgeteld (aantal = gelijke panden)
function berekenPortefeuille(panden){
  const r=panden.map(p=>({naam:p.naam,aantal:p.aantal!=null?p.aantal:1,uitkomst:bereken(p)}));
  const som=f=>r.reduce((s,x)=>s+x.aantal*f(x.uitkomst),0);
  const somC=key=>Object.fromEntries(ids().map(id=>[id,som(u=>u[key][id])]));
  const Ec=somC('Ec'), dEc=somC('dEc'), NCWc=somC('NCWc');
  return {panden:r, totaal:{aantal:r.reduce((s,x)=>s+x.aantal,0), E:som(u=>u.E), dE:som(u=>u.dE),
    cwB:som(u=>u.cwB), cwK:som(u=>u.cwK), NCW:som(u=>u.NCW), Ec,dEc,NCWc,
    marge:{E:range(Ec),dE:range(dEc),NCW:range(NCWc)}}};
}

G.DC_REKENKERN={T,CATS,MX,colIdx,krs,omgScore,gebouwscore,entry,entryWhy,parts,damage,binnen,inboedel,
  withCurve,ead,metMaatregelen,ann,range,bereken,berekenPortefeuille};
})(typeof window!=='undefined'?window:globalThis);
