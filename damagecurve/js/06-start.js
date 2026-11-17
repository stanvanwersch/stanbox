/* Startpagina: de twee kaarten tekenen met echte uitkomsten van de rekenkern (standaardinvoer). */
(function(){
const RK=window.DC_REKENKERN, SD=window.DC_STANDAARD, CURVES=window.DC_CURVES;
const $=id=>document.getElementById(id);
const css=n=>getComputedStyle(document.documentElement).getPropertyValue(n).trim();
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');
const eurK=v=>'€'+(v>=1000?DC.getal(v/1000,1)+'k':DC.getal(v));

function curve(){
  const P=SD.pand, K={schot:false,rooster:false,klep:false,sealed:false,...P.K}, C={f:1,extra:[],...P.C};
  const W=320,H=200,L=42,R=10,T=34,B=30,xmax=60;
  const fs=CURVES.map(c=>h=>RK.damage(h,K,{...C,curve:c.id}));
  const ymax=Math.ceil(Math.max(...fs.map(f=>f(xmax)))/10000)*10000||10000;
  const X=h=>L+h/xmax*(W-L-R), Y=v=>H-B-Math.min(v,ymax)/ymax*(H-B-T);
  const pad=f=>{let d='';for(let i=0;i<=120;i++){const h=i/120*xmax;d+=(i?'L':'M')+X(h).toFixed(1)+','+Y(f(h)).toFixed(1);}return d;};
  let g='';
  for(let v=0;v<=ymax;v+=ymax/2) g+=`<line x1="${L}" x2="${W-R}" y1="${Y(v)}" y2="${Y(v)}" stroke="${css('--grid')}"/><text x="${L-6}" y="${Y(v)+4}" text-anchor="end">${eurK(v)}</text>`;
  [0,20,40,60].forEach(v=>g+=`<text x="${X(v)}" y="${H-B+15}" text-anchor="middle">${v}</text>`);
  g+=`<text x="${(L+W)/2}" y="${H-3}" text-anchor="middle">${DC.t('kaart.as.diepte')}</text>`;
  const lo=pad(h=>Math.min(...fs.map(f=>f(h)))), hi=pad(h=>Math.max(...fs.map(f=>f(h))));
  const rev=lo.split(/(?=[ML])/).reverse().map(s=>'L'+s.slice(1)).join('');
  g+=`<path d="${hi}${rev}Z" fill="${css('--phase2')}" fill-opacity=".10"/>`;
  CURVES.slice().reverse().forEach((c,i)=>{const on=c.id===P.C.curve;
    g+=`<path d="${pad(fs[CURVES.indexOf(c)])}" fill="none" stroke="${css(c.kleur)}" stroke-width="${on?2.6:1.5}"${on?'':' stroke-dasharray="5 4"'} stroke-linejoin="round"/>`;});
  let lx=L; CURVES.forEach(c=>{const nm=DC.tv(c,'kort'); g+=`<rect x="${lx}" y="10" width="12" height="3" fill="${css(c.kleur)}"/><text x="${lx+16}" y="15" class="lab">${esc(nm)}</text>`; lx+=16+nm.length*6.4+16;});
  $('cv-curve').innerHTML=g; $('cv-curve').setAttribute('aria-label',DC.t('kaart.pand.sub'));
}
function portefeuille(){
  const P=SD.pand;
  const U=RK.berekenPortefeuille(SD.portefeuille.map(r=>({...r,corr:0,t0:P.t0,C:P.C,rente:P.rente,horizon:P.horizon,onderhoud:P.onderhoud})));
  const W=320,H=200,L=118,R=40,top=12,rh=(H-top-18)/U.panden.length, cur=P.C.curve;
  const rows=U.panden.map((p,i)=>({naam:DC.tv(SD.portefeuille[i],'naam'),cat:RK.CATS.map(([k])=>p.aantal*p.uitkomst.EcCat[k][cur])}));
  const xmax=Math.max(...rows.map(r=>r.cat.reduce((a,b)=>a+b,0)))*1.05, X=v=>L+v/xmax*(W-L-R);
  let g='';
  rows.forEach((r,i)=>{const y=top+i*rh+5, bh=rh-12; let acc=0;
    const nm=r.naam.length>19?r.naam.slice(0,18)+'…':r.naam;
    g+=`<text class="lab" x="${L-8}" y="${y+bh/2+4}" text-anchor="end">${esc(nm)}</text>`;
    r.cat.forEach((v,k)=>{ if(v<=0) return; g+=`<rect x="${X(acc)}" y="${y}" width="${Math.max(1,X(acc+v)-X(acc))}" height="${bh}" rx="2" fill="${css(RK.CATS[k][2])}"/>`; acc+=v;});
    g+=`<text x="${X(acc)+5}" y="${y+bh/2+4}">${eurK(acc)}</text>`;});
  g+=`<line x1="${L}" x2="${L}" y1="${top}" y2="${H-14}" stroke="${css('--border2')}"/>`;
  $('cv-pf').innerHTML=g; $('cv-pf').setAttribute('aria-label',DC.t('kaart.portefeuille.sub'));
}
function teken(){ curve(); portefeuille(); }
document.addEventListener('dc-weergave',teken);
teken();
})();
