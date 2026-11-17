/* ---------- 3D scenes (three.js r128) ---------- */
const S3=(function(){
const V=(x,y,z)=>new THREE.Vector3(x,y,z);
const rnd=(a,b)=>a+Math.random()*(b-a);
let seed=7; const rr=()=>{seed=(seed*16807)%2147483647; return (seed-1)/2147483646;};

/* canvas textures */
function cv(w,h,fn){const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');fn(x,w,h);const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.encoding=THREE.sRGBEncoding;t.anisotropy=8;return t;}
function noise(x,w,h,a){const d=x.getImageData(0,0,w,h);for(let i=0;i<d.data.length;i+=4){const n=(rr()-.5)*a;d.data[i]+=n;d.data[i+1]+=n;d.data[i+2]+=n;}x.putImageData(d,0,0);}
const TX={
 brick:()=>cv(512,256,(x,w,h)=>{x.fillStyle='#cbbfb1';x.fillRect(0,0,w,h);const bh=16,bw=54;for(let r=0;r<h/bh;r++){const off=(r%2)*bw/2;for(let c=-1;c<w/bw+1;c++){const l=34+rr()*14,s=40+rr()*14,hh=10+rr()*8;x.fillStyle=`hsl(${hh},${s}%,${l}%)`;x.fillRect(c*bw+off+1.5,r*bh+1.5,bw-3,bh-3);}}noise(x,w,h,18);}),
 tiles:()=>cv(256,256,(x,w,h)=>{const rh=64;for(let r=0;r<h/rh;r++){for(let c=0;c<4;c++){const off=(r%2)*32;const g=x.createLinearGradient(0,r*rh,0,r*rh+rh);g.addColorStop(0,'#5a4a42');g.addColorStop(.75,'#3f332e');g.addColorStop(1,'#2a221f');x.fillStyle=g;x.fillRect(c*64+off-64,r*rh,62,rh-2);x.fillRect(c*64+off,r*rh,62,rh-2);}}noise(x,w,h,14);}),
 planks:()=>cv(512,512,(x,w,h)=>{const pw=38;for(let i=0;i<w/pw;i++){let y=-rr()*200;while(y<h){const L=120+rr()*200;x.fillStyle=`hsl(${30+rr()*6},${38+rr()*10}%,${66+rr()*8}%)`;x.fillRect(i*pw+1,y+1,pw-2,L-2);y+=L;}}noise(x,w,h,10);}),
 pavers:()=>cv(256,256,(x,w,h)=>{x.fillStyle='#b9b3aa';x.fillRect(0,0,w,h);const bh=26,bw=52;for(let r=0;r<h/bh;r++){const off=(r%2)*bw/2;for(let c=-1;c<w/bw+1;c++){const l=70+rr()*10;x.fillStyle=`hsl(35,6%,${l}%)`;x.fillRect(c*bw+off+2,r*bh+2,bw-4,bh-4);}}noise(x,w,h,10);}),
 insul:()=>cv(128,128,(x,w,h)=>{x.fillStyle='#f0c23a';x.fillRect(0,0,w,h);for(let i=0;i<220;i++){x.strokeStyle=`rgba(${200+rr()*55},${150+rr()*60},40,.5)`;x.beginPath();const a=rr()*w,b=rr()*h;x.moveTo(a,b);x.quadraticCurveTo(a+rr()*20-10,b+rr()*20-10,a+rr()*30-15,b+rr()*30-15);x.stroke();}}),
 concrete:()=>cv(128,128,(x,w,h)=>{x.fillStyle='#d6d1c9';x.fillRect(0,0,w,h);noise(x,w,h,16);}),
 sedum:()=>cv(128,128,(x,w,h)=>{x.fillStyle='#7aa752';x.fillRect(0,0,w,h);for(let i=0;i<500;i++){x.fillStyle=`hsl(${80+rr()*40},${40+rr()*20}%,${35+rr()*25}%)`;x.beginPath();x.arc(rr()*w,rr()*h,1+rr()*2.5,0,7);x.fill();}}),
 grass:()=>cv(128,128,(x,w,h)=>{x.fillStyle='#8fb46a';x.fillRect(0,0,w,h);for(let i=0;i<900;i++){x.fillStyle=`hsl(${85+rr()*20},${35+rr()*15}%,${38+rr()*20}%)`;x.fillRect(rr()*w,rr()*h,1,3);}}),
 grille:()=>cv(128,128,(x,w,h)=>{x.fillStyle='#f4f4f2';x.fillRect(0,0,w,h);x.strokeStyle='#9a9a96';x.lineWidth=2;for(let i=6;i<w;i+=8){x.beginPath();x.moveTo(i,6);x.lineTo(i,h-6);x.stroke();}}),
 fan:()=>cv(128,128,(x,w,h)=>{x.fillStyle='#f2f2ef';x.fillRect(0,0,w,h);x.strokeStyle='#8c8c88';x.lineWidth=2;for(let r=10;r<56;r+=7){x.beginPath();x.arc(64,64,r,0,7);x.stroke();}x.beginPath();x.moveTo(8,64);x.lineTo(120,64);x.moveTo(64,8);x.lineTo(64,120);x.stroke();})
};
let T0=null;
function tex(){ if(!T0){T0={};for(const k in TX)T0[k]=TX[k]();} return T0; }
function rep(t,rx,ry){const c=t.clone();c.needsUpdate=true;c.repeat.set(rx,ry);return c;}

/* materials */
function mats(){const t=tex();return{
  brick:(w,h)=>new THREE.MeshStandardMaterial({map:rep(t.brick,w/2,h),roughness:.92}),
  tiles:(w,h)=>new THREE.MeshStandardMaterial({map:rep(t.tiles,w,h),roughness:.8}),
  planks:(w,h)=>new THREE.MeshStandardMaterial({map:rep(t.planks,w/2,h/2),roughness:.7}),
  pavers:(w,h)=>new THREE.MeshStandardMaterial({map:rep(t.pavers,w,h),roughness:.95}),
  insul:(w,h)=>new THREE.MeshStandardMaterial({map:rep(t.insul,w*1.5,h*1.5),roughness:1}),
  concrete:(w,h)=>new THREE.MeshStandardMaterial({map:rep(t.concrete,w/2,h/2),roughness:.95}),
  sedum:(w,h)=>new THREE.MeshStandardMaterial({map:rep(t.sedum,w,h),roughness:1}),
  grass:(w,h)=>new THREE.MeshStandardMaterial({map:rep(t.grass,w/2,h/2),roughness:1}),
  plaster:new THREE.MeshStandardMaterial({color:0xf6f2ec,roughness:.95}),
  white:new THREE.MeshStandardMaterial({color:0xfbfbf8,roughness:.5}),
  frame:new THREE.MeshStandardMaterial({color:0xf3efe6,roughness:.6}),
  dark:new THREE.MeshStandardMaterial({color:0x3b3d3f,roughness:.6,metalness:.2}),
  wood:new THREE.MeshStandardMaterial({color:0x8b6a4c,roughness:.8}),
  stone:new THREE.MeshStandardMaterial({color:0xcfc7bb,roughness:.9}),
  glass:new THREE.MeshPhysicalMaterial({color:0x9ec6dc,roughness:.05,metalness:.1,transparent:true,opacity:.45}),
  leaf:new THREE.MeshStandardMaterial({color:0x557f43,roughness:.9}),
  leaf2:new THREE.MeshStandardMaterial({color:0x6a9852,roughness:.9}),
  trunk:new THREE.MeshStandardMaterial({color:0x7c5d44,roughness:.9}),
  metal:new THREE.MeshStandardMaterial({color:0xc9ccce,roughness:.35,metalness:.6}),
  fabric:new THREE.MeshStandardMaterial({color:0xd9cbb7,roughness:1}),
  fabric2:new THREE.MeshStandardMaterial({color:0x9fb3a8,roughness:1}),
  grille:new THREE.MeshStandardMaterial({map:t.grille,roughness:.6}),
  fan:new THREE.MeshStandardMaterial({map:t.fan,roughness:.6})
};}

function B(g,w,h,d,mat,x,y,z,o={}){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);m.castShadow=o.cast!==false;m.receiveShadow=true;if(o.ry)m.rotation.y=o.ry;if(o.rx)m.rotation.x=o.rx;if(o.rz)m.rotation.z=o.rz;g.add(m);return m;}
function C(g,r,h,mat,x,y,z,o={}){const m=new THREE.Mesh(new THREE.CylinderGeometry(o.r2??r,r,h,o.seg||20),mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;if(o.rx)m.rotation.x=o.rx;if(o.rz)m.rotation.z=o.rz;g.add(m);return m;}
function line(g,pts,r,mat){const grp=new THREE.Group();for(let i=0;i<pts.length-1;i++){const a=pts[i],b=pts[i+1],d=b.clone().sub(a),L=d.length();const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,L,14),mat);m.position.copy(a).add(b).multiplyScalar(.5);m.quaternion.setFromUnitVectors(V(0,1,0),d.normalize());m.castShadow=true;grp.add(m);if(i>0){const s=new THREE.Mesh(new THREE.SphereGeometry(r,14,10),mat);s.position.copy(a);grp.add(s);}}g.add(grp);return grp;}
const WIN=[];
function windowM(g,M,w,h,x,y,z,ry=0,mull=true){const grp=new THREE.Group();const f=.08;WIN.push({grp,w,h});
  B(grp,w,f,.12,M.frame,0,h/2-f/2,0);B(grp,w,f,.12,M.frame,0,-h/2+f/2,0);B(grp,f,h,.12,M.frame,-w/2+f/2,0,0);B(grp,f,h,.12,M.frame,w/2-f/2,0,0);
  if(mull){B(grp,.05,h,.1,M.frame,0,0,0);B(grp,w,.05,.1,M.frame,0,h*.18,0);}
  const gl=new THREE.Mesh(new THREE.PlaneGeometry(w-f,h-f),new THREE.MeshStandardMaterial({color:0x6f8fa3,roughness:.15,metalness:.3}));grp.add(gl);
  B(grp,w+.16,.08,.22,M.stone,0,-h/2-.04,.06);
  grp.position.set(x,y,z);grp.rotation.y=ry;g.add(grp);envTag(grp,'bld');return grp;}
function tree(g,M,x,z,s=1){const grp=new THREE.Group();C(grp,.12*s,2.4*s,M.trunk,0,1.2*s,0);
  [[0,3.2,0,1.3],[-.7,2.8,.3,.9],[.7,2.9,-.2,1],[.2,3.8,.2,.9],[-.3,3.4,-.6,.85]].forEach(([a,b,c,r],i)=>{const m=new THREE.Mesh(new THREE.IcosahedronGeometry(r*s,1),i%2?M.leaf2:M.leaf);m.position.set(a*s,b*s,c*s);m.castShadow=true;grp.add(m);});
  grp.position.set(x,0,z);g.add(grp);envTag(grp,'ctx');return grp;}
function lamp(g,M,x,z){C(g,.06,3.2,M.dark,x,1.6,z);C(g,.12,.3,M.dark,x,.15,z);const l=new THREE.Mesh(new THREE.CylinderGeometry(.18,.12,.4,6),new THREE.MeshStandardMaterial({color:0xfff2c8,emissive:0x5a4a20,roughness:.4}));l.position.set(x,3.35,z);g.add(l);C(g,.22,.06,M.dark,x,3.58,z,{r2:.02,seg:6});}
function bench(g,M,x,z,ry=0){const grp=new THREE.Group();for(let i=0;i<3;i++)B(grp,1.6,.05,.12,M.wood,0,.45,-.18+i*.15);B(grp,1.6,.35,.05,M.wood,0,.72,-.26,{rx:-.15});B(grp,.08,.45,.5,M.dark,-.7,.22,0);B(grp,.08,.45,.5,M.dark,.7,.22,0);grp.position.set(x,0,z);grp.rotation.y=ry;g.add(grp);}
function bollard(g,M,x,z){C(g,.09,.7,M.dark,x,.35,z);}

/* system material set: one material per function role so we can recolour */
function sysMat(kind){return new THREE.MeshStandardMaterial({color:kind==='unit'?0xfafaf7:0xd7d3cc,roughness:kind==='unit'?.45:.35,metalness:kind==='unit'?0:.35,transparent:true,opacity:1});}
function envTag(o,hk){o.traverse(m=>{if(m.isMesh)m.userData.env=hk;});return o;}
function tag(obj,fns,hk){obj.traverse(o=>{if(o.isMesh){o.material=o.material.clone();o.material.transparent=true;if(!o.material.emissive)o.material.emissive=new THREE.Color(0);o.userData.fns=fns;o.userData.hk=hk;o.userData.sys=true;}});return obj;}

/* ---------- applied-measure effects ---------- */
function fxMats(M){return{
  awning:new THREE.MeshStandardMaterial({color:0xe07a2f,roughness:.8}),
  fin:new THREE.MeshStandardMaterial({color:0xc9a27a,roughness:.8}),
  insul:new THREE.MeshStandardMaterial({color:0xf2c230,roughness:1}),
  glass:new THREE.MeshStandardMaterial({color:0x8fd3f2,emissive:0x2a7fb0,emissiveIntensity:.25,roughness:.1,transparent:true,opacity:.85}),
  water:new THREE.MeshStandardMaterial({color:0x7cc3e6,roughness:.2}),
  green:new THREE.MeshStandardMaterial({color:0x6fa85a,roughness:.9}),
  sleeve:new THREE.MeshStandardMaterial({color:0xb48a5a,roughness:.9}),
  district:new THREE.MeshStandardMaterial({color:0xc8553d,roughness:.5}),
  dark:new THREE.MeshStandardMaterial({color:0x4a4f53,roughness:.5}),
  signal:new THREE.MeshBasicMaterial({color:0xe07a2f}),
  air:new THREE.MeshStandardMaterial({color:0x3f9be0,emissive:0x1f6fb0,emissiveIntensity:.3,roughness:.4}),
  pcm:new THREE.MeshStandardMaterial({color:0x8a6fd1,roughness:.6}),
  carpet:new THREE.MeshStandardMaterial({color:0xc8553d,roughness:1}),
  blade:new THREE.MeshStandardMaterial({color:0x6b7075,roughness:.5}),
  sedum:M.sedum(4,6)};}
function fxGroup(g,key){const grp=new THREE.Group(); grp.visible=false; grp.userData.fxKey=key; g.add(grp); return grp;}
function fxify(fx){ Object.values(fx).forEach(grp=>grp.traverse(o=>{ if(!o.isMesh) return; o.userData.fx=true; delete o.userData.env; o.raycast=()=>{};
  if(o.geometry.attributes.position.count<600){ const e=new THREE.LineSegments(new THREE.EdgesGeometry(o.geometry,25),new THREE.LineBasicMaterial({color:0x23272a,transparent:true,opacity:.9})); e.userData.edge=true; e.userData.fxEdge=true; e.raycast=()=>{}; o.add(e);} })); return fx; }
function arrow(g,F,a,b){ const d=b.clone().sub(a), L=d.length(), u=d.clone().normalize(); const sh=new THREE.Mesh(new THREE.CylinderGeometry(.12,.12,L-.5,12),F.air); sh.position.copy(a).add(u.clone().multiplyScalar((L-.4)/2)); sh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),u); g.add(sh); const hd=new THREE.Mesh(new THREE.ConeGeometry(.3,.5,16),F.air); hd.position.copy(b).sub(u.clone().multiplyScalar(.2)); hd.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),u); g.add(hd); }
function ceilFan(g,F,x,y,z){ const q=new THREE.Group(); const r=new THREE.Mesh(new THREE.CylinderGeometry(.03,.03,.5,8),F.blade); r.position.y=.25; q.add(r); for(let i=0;i<3;i++){ const bl=new THREE.Mesh(new THREE.BoxGeometry(.9,.02,.16),F.blade); bl.position.set(Math.cos(i*2.094)*.45,0,Math.sin(i*2.094)*.45); bl.rotation.y=-i*2.094; q.add(bl);} const hub=new THREE.Mesh(new THREE.CylinderGeometry(.09,.09,.08,12),F.blade); q.add(hub); q.position.set(x,y,z); g.add(q); }
function arcs(g,F,x,y,z,ry=0){const grp=new THREE.Group(); for(let i=1;i<=3;i++){const m=new THREE.Mesh(new THREE.TorusGeometry(.1*i,.018,6,24,Math.PI/2),F.signal); m.rotation.z=Math.PI/4; grp.add(m);} grp.position.set(x,y,z); grp.rotation.y=ry; g.add(grp); return grp;}

/* ---------- HOUSE ---------- */
function house(){
  const M=mats(); const g=new THREE.Group(); const sys=[];
  // diorama base
  B(g,24,.6,18,M.stone,0,-.3,0); B(g,24,.04,7.2,M.pavers(24,7.2),0,.02,5.4);
  B(g,24,.04,10.8,M.grass(24,10.8),0,.02,-3.6);
  B(g,10,.04,2.2,M.pavers(10,2.2),5.2,.03,1.2);
  // house slab/plinth
  B(g,8.4,.35,10.4,M.stone,0,.17,0);
  const W=.32, H1=3.0, H2=2.9, y1=.35, y2=y1+H1, y3=y2+H2;
  // ground floor
  B(g,7.4,.1,9.4,M.planks(7.4,5.4),-.0,y1+.05,-2.0); // back part (z -4.7..0.7)
  B(g,3.7,.1,4,M.planks(3.7,4),-1.85,y1+.05,2.7);
  // floor heating patch (front right)
  B(g,3.7,.06,4,new THREE.MeshStandardMaterial({color:0xbab4ab,roughness:1}),1.85,y1+.02,2.7);
  // walls
  B(g,W,H1+H2,10,M.brick(10,H1+H2),-4+W/2,y1+(H1+H2)/2,0);            // left
  B(g,8,H1+H2,W,M.brick(8,H1+H2),0,y1+(H1+H2)/2,-5+W/2);              // back
  B(g,2.5,H1,W,M.brick(2.5,H1),-2.75,y1+H1/2,5-W/2);                  // front ground floor left piece
  envTag(B(g,.1,H1,W-.12,M.insul(.1,H1),-1.5+.05,y1+H1/2,5-W/2),'bld');              // cut cavity insulation
  B(g,8,H2,W,M.brick(8,H2),0,y2+H2/2,5-W/2);                          // front first floor
  B(g,W,H2,10,M.brick(10,H2),4-W/2,y2+H2/2,0);                        // right first floor
  B(g,.42,H1,.42,M.brick(.42,H1),4-.21,y1+H1/2,5-.21);              // corner pillar
  B(g,.42,H1,.42,M.brick(.42,H1),4-.21,y1+H1/2,-5+.21);
  // interior plaster ground floor
  B(g,.04,H1,9.3,M.plaster,-4+W+.02,y1+H1/2,0,{cast:false});
  B(g,7.3,H1,.04,M.plaster,0,y1+H1/2,-5+W+.02,{cast:false});
  // first floor slab (cut edge visible)
  B(g,8,.3,10,M.concrete(8,10),0,y2,0); B(g,7.36,.04,9.36,M.plaster,0,y2-.17,0,{cast:false});
  // attic floor
  B(g,8,.25,10,M.concrete(8,10),0,y3,0); B(g,7.4,.05,9.4,M.planks(7.4,9.4),0,y3+.15,0);
  // cornice
  B(g,8.5,.25,10.5,M.frame,0,y3+.05,0);
  // gables
  const rh=3.4, gs=new THREE.Shape(); gs.moveTo(-5,0);gs.lineTo(5,0);gs.lineTo(0,rh);gs.lineTo(-5,0);
  [-4+W/2].forEach(x=>{const ge=new THREE.ExtrudeGeometry(gs,{depth:W,bevelEnabled:false});const t=rep(tex().brick,.5,1);const m=new THREE.Mesh(ge,new THREE.MeshStandardMaterial({map:t,roughness:.92}));m.rotation.y=Math.PI/2;m.position.set(x-W/2,y3+.15,0);m.castShadow=m.receiveShadow=true;g.add(m);});
  // right gable cut away: show only a timber edge beam
  B(g,.2,.2,10.4,M.wood,4-.1,y3+.25,0);
  // roof
  const pitch=Math.atan2(rh,5), sl=Math.hypot(5.5,rh*1.1);
  const roofY=y3+.15+rh/2;
  function slope(sign,x0,x1,layers){const w=x1-x0, cx=(x0+x1)/2;const grp=new THREE.Group();
    if(layers.includes('tiles'))B(grp,w,.12,sl,M.tiles(w,sl),0,.16,0);
    if(layers.includes('insul'))B(grp,w,.24,sl-.4,M.insul(w,sl),0,-.02,0);
    if(layers.includes('raft'))for(let x=-w/2+.15;x<=w/2-.1;x+=1.35)B(grp,.12,.22,sl-.2,M.wood,x,-.02,0);
    if(layers.includes('panels'))for(let x=-w/2+.5;x<w/2-.3;x+=.6)B(grp,.46,.2,sl*.45,M.insul(.46,sl*.45),x,-.02,sl*.22);
    grp.rotation.x=sign*pitch; grp.position.set(cx,roofY+.1,sign*2.55); g.add(grp); return grp;}
  envTag(slope(-1,-4.3,4.3,['tiles','insul']),'bld');         // back slope
  envTag(slope(1,-4.3,.1,['tiles','insul']),'bld');           // front slope left (cut edge shows insulation)
  slope(1,.1,4.3,['raft']);            // front slope right opened
  B(g,8.8,.18,.25,M.tiles(8.8,.25),0,y3+.15+rh+.12,0); // ridge
  // windows
  [[-2.75,y1+1.55]].forEach(([x,y])=>windowM(g,M,1.2,1.7,x,y,5+.02));
  [[-2.6,y2+1.45],[0,y2+1.45],[2.6,y2+1.45]].forEach(([x,y])=>windowM(g,M,1.1,1.7,x,y,5+.02));
  [[-2.6,y2+1.45],[2.6,y2+1.45],[-2.6,y1+1.55]].forEach(([x,y])=>windowM(g,M,1.1,1.7,x,y,-5-.02,Math.PI));
  windowM(g,M,1.1,1.6,4+.02,y2+1.45,1.5,Math.PI/2); windowM(g,M,1.1,1.6,4+.02,y2+1.45,-2.2,Math.PI/2);
  // dormer-like roof window on back slope? skip. front door
  B(g,1.0,2.2,.1,new THREE.MeshStandardMaterial({color:0x2f4b44,roughness:.6}),-.7,y1+1.1,5-W/2+.12);
  // interior furniture
  B(g,2.2,.45,.9,M.fabric2,-1.6,y1+.35,-3.9); B(g,2.2,.6,.22,M.fabric2,-1.6,y1+.6,-4.35);  // sofa
  B(g,1.2,.05,.7,M.wood,-1.6,y1+.5,-2.6); B(g,.06,.4,.06,M.wood,-2.1,y1+.3,-2.3);B(g,.06,.4,.06,M.wood,-1.1,y1+.3,-2.3);B(g,.06,.4,.06,M.wood,-2.1,y1+.3,-2.9);B(g,.06,.4,.06,M.wood,-1.1,y1+.3,-2.9);
  B(g,1.8,.9,.6,M.white,-3.3,y1+.45,1.5,{ry:Math.PI/2}); B(g,1.85,.05,.65,M.stone,-3.3,y1+.92,1.5,{ry:Math.PI/2}); // kitchen
  const rug=B(g,2.4,.02,1.6,new THREE.MeshStandardMaterial({color:0xd8c6ad,roughness:1}),-1.6,y1+.11,-2.6,{cast:false});
  // attic: rafters / purlins
  B(g,8,.18,.18,M.wood,0,y3+.15+rh*.55,0);
  // surroundings
  tree(g,M,-7.6,3.8,1.15); tree(g,M,8.2,-5.5,1.0);
  lamp(g,M,-6.2,7.2); bench(g,M,2.2,7.0); bollard(g,M,-3.6,8.2); bollard(g,M,-1.6,8.2); bollard(g,M,.4,8.2);
  // planter
  B(g,.9,.4,.4,M.stone,-3.1,.2,6.0); for(let i=0;i<5;i++){const s=new THREE.Mesh(new THREE.SphereGeometry(.12,8,6),new THREE.MeshStandardMaterial({color:i%2?0xc2455a:0x7fae6a}));s.position.set(-3.45+i*.18,.48,6);g.add(s);}

  /* ---- systems ---- */
  const U=()=>sysMat('unit'), P=()=>sysMat('pipe');
  // outdoor heat pump
  const hp=new THREE.Group(); B(hp,1.1,.85,.45,U(),0,.62,0); const fan=new THREE.Mesh(new THREE.CircleGeometry(.3,32),M.fan); fan.position.set(-.15,.62,.231); hp.add(fan); B(hp,.25,.6,.01,M.grille,.33,.62,.231); B(hp,1.0,.2,.4,M.dark,0,.1,0);
  hp.position.set(5.4,0,1.6); g.add(hp); tag(hp,['h','c'],'gen'); sys.push(hp);
  // indoor unit / buffer
  const iu=new THREE.Group(); B(iu,.65,1.9,.6,U(),0,.95,0); B(iu,.3,.12,.02,new THREE.MeshStandardMaterial({color:0x2a3a44}),0,1.55,.31);
  iu.position.set(3.2,y1+.1,-4.25); g.add(iu); tag(iu,['h','c'],'gen'); sys.push(iu);
  // pipes HP → indoor unit → radiator, floor heating
  const pH=P(); const pg=new THREE.Group();
  line(pg,[V(4.9,.55,1.6),V(4.3,.55,1.6),V(3.6,y1+.18,1.6),V(3.6,y1+.18,-3.9),V(3.5,y1+.18,-4.25)],.05,pH);
  line(pg,[V(4.9,.4,1.75),V(4.3,.4,1.75),V(3.75,y1+.3,1.75),V(3.75,y1+.3,-3.7)],.05,pH);
  line(pg,[V(2.85,y1+.25,-4.5),V(-.4,y1+.25,-4.5)],.045,pH);
  g.add(pg); tag(pg,['h','c'],'dist'); sys.push(pg);
  // radiator
  const rad=new THREE.Group(); for(let i=0;i<14;i++)B(rad,.06,.65,.1,U(),-.45+i*.07,0,0); B(rad,1.0,.05,.08,U(),0,.33,0);
  rad.position.set(.2,y1+.75,-4.62); g.add(rad); tag(rad,['h'],'term'); sys.push(rad);
  // floor heating serpentine
  const fh=new THREE.Group(); const pts=[]; for(let i=0;i<9;i++){const x=.25+i*.4; pts.push(V(x,y1+.08,i%2?4.5:1.0),V(x,y1+.08,i%2?1.0:4.5));} line(fh,pts,.035,P());
  g.add(fh); tag(fh,['h','c'],'term'); sys.push(fh);
  // thermostat
  const th=new THREE.Group(); B(th,.16,.22,.04,U(),0,0,0); const d=new THREE.Mesh(new THREE.CircleGeometry(.05,20),new THREE.MeshStandardMaterial({color:0x888888})); d.position.z=.021; th.add(d);
  th.position.set(2.5,y1+1.5,-5+W+.06); g.add(th); tag(th,['h','c'],'ctrl'); sys.push(th);
  // ventilation: heat recovery unit in attic + ducts
  const wtw=new THREE.Group(); B(wtw,1.3,.6,.8,U(),0,.3,0); B(wtw,.4,.4,.01,M.grille,.25,.3,.41);
  wtw.position.set(2.3,y3+.17,.7); g.add(wtw); tag(wtw,['v'],'gen'); sys.push(wtw);
  const dg=new THREE.Group(); const dm=P();
  line(dg,[V(1.9,y3+.75,.7),V(1.9,y3+2.6,.7)],.11,dm); line(dg,[V(2.7,y3+.75,.7),V(2.7,y3+2.3,.7)],.11,dm);
  line(dg,[V(2.95,y3+.4,.7),V(3.4,y3+.4,.7),V(3.4,y3+.4,-4.4),V(3.4,y3-.2,-4.4)],.1,dm);
  line(dg,[V(3.4,y2-.15,-4.5),V(3.4,y1+2.1,-4.5),V(.9,y1+2.1,-4.5)],.1,dm);
  g.add(dg); tag(dg,['v'],'dist'); sys.push(dg);
  const vt=new THREE.Group(); B(vt,.5,.3,.05,M.grille,.55,y1+2.1,-5+W+.03); B(vt,.5,.3,.05,M.grille,-2.8,y1+2.1,-5+W+.03); line(vt,[V(.9,y1+2.1,-4.5),V(-2.5,y1+2.1,-4.5)],.08,U());
  g.add(vt); tag(vt,['v'],'term'); sys.push(vt);
  const vs=new THREE.Group(); B(vs,.12,.2,.04,U(),0,0,0); vs.position.set(2.0,y1+1.5,-5+W+.06); g.add(vs); tag(vs,['v'],'ctrl'); sys.push(vs);

  /* effects */
  const F=fxMats(M), fx={}, wins=WIN.splice(0); let e;
  e=fxGroup(g,'shade'); [-2.6,0,2.6].forEach(x=>B(e,1.5,.05,.85,F.awning,x,y2+2.32,5.4,{rx:.4})); B(e,1.6,.05,.85,F.awning,-2.75,y1+2.55,5.4,{rx:.4}); [1.5,-2.2].forEach(z=>B(e,.85,.05,1.5,F.awning,4.4,y2+2.25,z,{rz:-.4})); fx.shade=e;
  e=fxGroup(g,'trees'); tree(e,M,-7.4,-1.6,.9); tree(e,M,-5.8,-7.2,.85); tree(e,M,-9.4,1.4,.75); C(e,1.4,.05,F.water,6.4,.07,-2.6,{seg:40}); for(let i=0;i<4;i++)B(e,1.0,.7,.6,F.green,4.2+i*1.05,.35,-7.8); e.userData.anchor=V(-9.2,3.2,1.4); fx.trees=e;
  e=fxGroup(g,'sedum'); {const q=new THREE.Group(); B(q,4.3,.08,sl-.15,F.sedum,0,.27,0); q.rotation.x=pitch; q.position.set(-2.1,roofY+.1,2.55); e.add(q);} fx.sedum=e;
  e=fxGroup(g,'insul'); {const q=new THREE.Group(); for(let x=-2.1+.83;x<2.1;x+=1.35)B(q,1.15,.2,sl-.45,F.insul,x,-.02,0); q.rotation.x=pitch; q.position.set(2.2,roofY+.1,2.55); e.add(q);}
    B(e,7.6,.12,9.6,F.insul,0,y1-.03,0); B(e,.18,H1,.36,F.insul,-1.5,y1+H1/2,5-W/2); B(e,.36,H1,.18,F.insul,4-W/2,y1+H1/2,4.5); fx.insul=e;
  e=fxGroup(g,'glass'); wins.forEach(({grp,w,h})=>{const q=new THREE.Group(); q.position.copy(grp.position); q.rotation.copy(grp.rotation); const m=new THREE.Mesh(new THREE.PlaneGeometry(w-.14,h-.14),F.glass); m.position.z=.03; q.add(m); e.add(q);}); fx.glass=e;
  e=fxGroup(g,'district'); line(e,[V(-11.5,.14,8.4),V(5.6,.14,8.4),V(5.6,.14,4.9)],.09,F.district); B(e,.9,1.3,.55,F.district,5.6,.65,4.6); line(e,[V(5.1,.5,4.6),V(3.85,y1+.42,4.6),V(3.85,y1+.42,-3.6),V(3.5,y1+.42,-4.0)],.06,F.district); fx.district=e;
  e=fxGroup(g,'pipeins'); line(e,[V(4.9,.55,1.6),V(4.3,.55,1.6),V(3.6,y1+.18,1.6),V(3.6,y1+.18,-3.9)],.1,F.sleeve); line(e,[V(4.9,.4,1.75),V(4.3,.4,1.75),V(3.75,y1+.3,1.75),V(3.75,y1+.3,-3.7)],.1,F.sleeve); line(e,[V(2.85,y1+.25,-4.5),V(-.4,y1+.25,-4.5)],.09,F.sleeve); e.userData.anchor=V(3.68,y1+.25,-2.6); fx.pipeins=e;
  e=fxGroup(g,'radfan'); B(e,1.0,.14,.18,F.dark,.2,y1+.32,-4.5); [-.25,.25].forEach(x=>{const m=new THREE.Mesh(new THREE.CircleGeometry(.055,16),F.signal); m.position.set(.2+x,y1+.32,-4.4); e.add(m);}); fx.radfan=e;
  e=fxGroup(g,'wireless'); arcs(e,F,2.75,y1+1.7,-4.6); arcs(e,F,2.25,y1+1.3,-4.6); fx.wireless=e;
  e=fxGroup(g,'nightvent'); [-2.6,0,2.6].forEach(x=>arrow(e,F,V(x,y2+1.45,7.2),V(x,y2+1.45,5.4))); [1.5,-2.2].forEach(z=>arrow(e,F,V(4.4,y2+1.45,z),V(6.4,y2+1.45,z))); arrow(e,F,V(-1,y1+1.6,6.8),V(-1,y1+1.6,3.2)); fx.nightvent=e;
  e=fxGroup(g,'pcm'); B(e,7.5,.16,9.5,F.pcm,0,y2-.24,0); fx.pcm=e;
  e=fxGroup(g,'carpet'); B(e,2.8,.04,2.0,F.carpet,1.7,y1+.13,1.6); fx.carpet=e;
  e=fxGroup(g,'fans'); ceilFan(e,F,1.4,y2-.75,.6); fx.fans=e;
  fxify(fx);

  const anchors={ // marker anchor points per function
    heating:{bld:V(-1.2,y3+1.8,3.2),gen:V(5.5,1.7,1.9),dist:V(3.6,y1+.5,-2.8),term:V(.2,y1+1.35,-4.55),ctrl:V(2.5,y1+1.85,-4.6),gnl:'fixed'},
    cooling:{ctx:V(-7.6,4.6,3.8),bld:V(-1.2,y3+1.8,3.2),gen:V(5.5,1.7,1.9),dist:V(3.6,y1+.5,-2.8),term:V(2.0,y1+.3,3.4),ctrl:V(2.5,y1+1.85,-4.6)},
    ventilation:{bld:V(-1.2,y3+1.8,3.2),gen:V(2.3,y3+1.1,.7),dist:V(3.4,y3+.9,-2.2),term:V(.55,y1+2.5,-4.6),ctrl:V(2.0,y1+1.2,-4.6)}
  };
  return {group:g,sys,anchors,fx,target:V(.3,4.5,-.4),cam:V(19.5,7.4,22.5)};
}

/* ---------- OFFICE ---------- */
function office(){
  const M=mats(); const g=new THREE.Group(); const sys=[];
  B(g,30,.6,22,M.stone,0,-.3,0); B(g,30,.04,8,M.pavers(30,8),0,.02,7); B(g,30,.04,14,M.grass(30,14),0,.02,-4);
  const X=6.5, Z=4.5, FH=3.4, N=4, y0=.3;
  B(g,2*X+.6,.3,2*Z+.6,M.stone,0,.15,0);
  const glassBack=new THREE.MeshPhysicalMaterial({color:0xa9c9d9,roughness:.08,metalness:.1,transparent:true,opacity:.55});
  const mull=new THREE.MeshStandardMaterial({color:0x4a4f53,roughness:.5,metalness:.4});
  // core
  B(g,2.4,FH*N,2.2,M.concrete(2.4,FH*N),-2.2,y0+FH*N/2,-2.9);
  for(let i=0;i<N;i++){const y=y0+i*FH;
    // slab
    B(g,2*X,.32,2*Z,M.concrete(2*X,2*Z),0,y+FH-.0,0);
    B(g,2*X-.4,.04,2*Z-.4,new THREE.MeshStandardMaterial({color:0xc4bcb0,roughness:1}),0,y+.02,0,{cast:false});
    // back facade glazing + mullions
    envTag(B(g,2*X,FH-.32,.04,glassBack,0,y+FH/2,-Z,{cast:false}),'bld');
    for(let x=-X;x<=X+.01;x+=1.6)B(g,.08,FH-.32,.12,mull,x,y+FH/2,-Z);
    // left (front-left) facade: glazing on x<0 half of front
    envTag(B(g,X,FH-.32,.04,glassBack,-X/2,y+FH/2,Z,{cast:false}),'bld');
    for(let x=-X;x<=0.01;x+=1.6)B(g,.08,FH-.32,.12,mull,x,y+FH/2,Z);
    B(g,X,.14,.16,mull,-X/2,y+FH-.25,Z);
    // shading fins
    for(let k=0;k<3;k++)envTag(B(g,X,.04,.5,new THREE.MeshStandardMaterial({color:0xb7b0a5,roughness:.6}),-X/2,y+FH-.55-k*.18,Z+.3),'bld');
    // left facade (x=-X)
    envTag(B(g,.04,FH-.32,2*Z,glassBack,-X,y+FH/2,0,{cast:false}),'bld');
    // desks
    [[1.5,-1.5],[3.6,-1.5],[1.5,1.6],[3.6,1.6],[-4.5,1.8]].forEach(([x,z])=>{B(g,1.6,.05,.8,M.white,x,y+.75,z);B(g,.05,.72,.05,M.dark,x-.75,y+.38,z-.35);B(g,.05,.72,.05,M.dark,x+.75,y+.38,z-.35);B(g,.05,.72,.05,M.dark,x-.75,y+.38,z+.35);B(g,.05,.72,.05,M.dark,x+.75,y+.38,z+.35);B(g,.5,.32,.03,M.dark,x,y+.95,z-.2);B(g,.45,.45,.45,M.fabric2,x,y+.45,z+.7);});
  }
  // roof: sedum + parapet
  const top=y0+FH*N;
  envTag(B(g,2*X-.3,.1,2*Z-.3,M.sedum(2*X,2*Z),0,top+.21,0),'bld');
  B(g,2*X+.2,.5,.2,M.concrete(2*X,.5),0,top+.4,Z+.0); B(g,2*X+.2,.5,.2,M.concrete(2*X,.5),0,top+.4,-Z); B(g,.2,.5,2*Z,M.concrete(2*Z,.5),X,top+.4,0); B(g,.2,.5,2*Z,M.concrete(2*Z,.5),-X,top+.4,0);
  // surroundings
  tree(g,M,-9.5,4.5,1.25); tree(g,M,10,4.2,1.1); tree(g,M,-10,-5,1.1); lamp(g,M,7.5,8.5); bench(g,M,-6,7.6); bench(g,M,3.5,8.2);
  for(let i=0;i<4;i++)bollard(g,M,-2+i*1.6,9.6);

  const U=()=>sysMat('unit'), P=()=>sysMat('pipe');
  // AHU on roof
  const ahu=new THREE.Group(); B(ahu,4.2,1.5,1.8,U(),0,.75,0); [-1.2,0,1.2].forEach(x=>B(ahu,.9,.9,.01,M.grille,x,.8,.91)); ahu.position.set(-2.6,top+.26,-1.8); g.add(ahu); tag(ahu,['v'],'gen'); sys.push(ahu);
  // heat pump on roof
  const hp=new THREE.Group(); B(hp,2.6,1.1,1.5,U(),0,.55,0); [-.6,.6].forEach(x=>{const f=new THREE.Mesh(new THREE.CircleGeometry(.45,32),M.fan);f.rotation.x=-Math.PI/2;f.position.set(x,1.11,0);hp.add(f);}); B(hp,2.4,.12,1.3,M.dark,0,.06,0);
  hp.position.set(3.4,top+.26,-2.2); g.add(hp); tag(hp,['h','c'],'gen'); sys.push(hp);
  // risers (outside the core, visible)
  const rg=new THREE.Group(), pm=P();
  line(rg,[V(2.1,top+.8,-2.2),V(.4,top+.8,-2.2),V(.4,y0+.6,-2.2)],.08,pm); line(rg,[V(2.1,top+.6,-2.45),V(.65,top+.6,-2.45),V(.65,y0+.6,-2.45)],.08,pm);
  g.add(rg); tag(rg,['h','c'],'dist'); sys.push(rg);
  const dr=new THREE.Group(), dm=P(); line(dr,[V(-.5,top+1.0,-1.8),V(-.3,top+1.0,-1.8),V(-.3,y0+FH-.6,-1.8)],.22,dm);
  for(let i=0;i<N;i++){const y=y0+i*FH+FH-.55; line(dr,[V(-.3,y,-1.8),V(5.6,y,-1.8)],.16,dm); line(dr,[V(-.3,y,-.4),V(-.3,y,-1.8)],.12,dm); line(dr,[V(-.3,y,-.4),V(5.6,y,-.4)],.12,dm);}
  g.add(dr); tag(dr,['v'],'dist'); sys.push(dr);
  // diffusers (v), climate ceiling panels (c,h), convectors (h)
  const df=new THREE.Group(), cc=new THREE.Group(), cv=new THREE.Group(), cp=new THREE.Group(); const pp=P();
  for(let i=0;i<N;i++){const y=y0+i*FH;
    [1.2,3.0,4.8].forEach(x=>{const m=new THREE.Mesh(new THREE.CylinderGeometry(.22,.16,.12,20),U());m.position.set(x,y+FH-.72,-1.8);df.add(m);});
    for(let k=0;k<3;k++)B(cc,1.5,.06,1.1,U(),1.4+k*1.8,y+FH-.85,1.6,{cast:false});
    for(let k=0;k<3;k++){const u=new THREE.Group();B(u,1.2,.45,.22,U(),0,0,0);B(u,1.1,.04,.18,M.grille,0,.23,0);u.position.set(1.2+k*1.9,y+.3,-Z+.25);cv.add(u);}
    line(cp,[V(.4,y+.15,-2.2),V(.4,y+.15,-Z+.45),V(6,y+.15,-Z+.45)],.04,pp);
    line(cp,[V(.65,y+FH-.8,-2.45),V(.65,y+FH-.8,1.6),V(.75,y+FH-.8,1.6)],.04,pp);
  }
  g.add(df); tag(df,['v'],'term'); sys.push(df);
  g.add(cc); tag(cc,['c','h'],'term'); sys.push(cc);
  g.add(cv); tag(cv,['h'],'term'); sys.push(cv);
  g.add(cp); tag(cp,['h','c'],'dist'); sys.push(cp);
  // sensors on core wall, every floor
  const sn=new THREE.Group(); for(let i=0;i<N;i++){B(sn,.14,.2,.04,U(),-1.0+.02,y0+i*FH+1.5,-1.78);} g.add(sn); tag(sn,['h','c','v'],'ctrl'); sys.push(sn);

  const F=fxMats(M), fx={}; WIN.splice(0); let e;
  e=fxGroup(g,'shade'); for(let x=-X+.3;x<-.1;x+=.8)B(e,.07,FH*N-.4,.55,F.fin,x,y0+FH*N/2,Z+.55); B(e,X+.6,.12,1.3,F.fin,-X/2,top+.5,Z+.6); fx.shade=e;
  e=fxGroup(g,'trees'); tree(e,M,-13,6.5,.9); tree(e,M,9.5,-3,1); tree(e,M,-12,.8,.9); C(e,1.6,.05,F.water,10,.07,-7,{seg:40}); for(let i=0;i<6;i++)B(e,1.0,.7,.6,F.green,-13+i*1.05,.35,-9); fx.trees=e;
  e=fxGroup(g,'sedum'); for(let i=0;i<10;i++){const m=new THREE.Mesh(new THREE.IcosahedronGeometry(.35,0),F.green); m.position.set(-5.6+i*1.25,top+.5,Z-.7); e.add(m);} fx.sedum=e;
  e=fxGroup(g,'insul'); B(e,2*X-.4,.22,2*Z-.4,F.insul,0,top+.04,0); for(let i=1;i<=N;i++)B(e,X,.32,.14,F.insul,-X/2,y0+i*FH,Z+.1); fx.insul=e;
  e=fxGroup(g,'glass'); for(let i=0;i<N;i++)B(e,X-.1,FH-.45,.03,F.glass,-X/2,y0+i*FH+FH/2,Z+.05,{cast:false}); fx.glass=e;
  e=fxGroup(g,'district'); line(e,[V(-14,.14,10),V(8.5,.14,10),V(8.5,.14,5.6)],.11,F.district); B(e,1.1,1.5,.7,F.district,8.5,.75,5.2); line(e,[V(7.9,.6,5.0),V(6.2,y0+.35,3.6),V(.4,y0+.35,3.6),V(.4,y0+.35,-2.0)],.08,F.district); fx.district=e;
  e=fxGroup(g,'pipeins'); line(e,[V(2.1,top+.8,-2.2),V(.4,top+.8,-2.2),V(.4,y0+.6,-2.2)],.15,F.sleeve); line(e,[V(2.1,top+.6,-2.45),V(.65,top+.6,-2.45),V(.65,y0+.6,-2.45)],.15,F.sleeve); fx.pipeins=e;
  e=fxGroup(g,'radfan'); for(let i=0;i<N;i++)for(let k=0;k<3;k++)B(e,.5,.12,.2,F.dark,1.2+k*1.9,y0+i*FH+.6,-Z+.25); fx.radfan=e;
  e=fxGroup(g,'wireless'); for(let i=0;i<N;i++)arcs(e,F,-.98,y0+i*FH+1.85,-1.74); fx.wireless=e;
  e=fxGroup(g,'nightvent'); for(let i=0;i<N;i++){ arrow(e,F,V(-4.5,y0+i*FH+1.6,Z+2.4),V(-4.5,y0+i*FH+1.6,Z-.6)); arrow(e,F,V(-1.8,y0+i*FH+1.6,Z+2.4),V(-1.8,y0+i*FH+1.6,Z-.6)); } fx.nightvent=e;
  e=fxGroup(g,'pcm'); for(let i=1;i<=N;i++)B(e,X-.2,.14,2*Z-.3,F.pcm,X/2,y0+i*FH-.25,0); fx.pcm=e;
  e=fxGroup(g,'carpet'); fx.carpet=e;
  e=fxGroup(g,'fans'); for(let i=0;i<N;i++)ceilFan(e,F,3.2,y0+i*FH+FH-.75,.3); fx.fans=e;
  fxify(fx);
  const F2=y0+FH*2;
  const anchors={
    heating:{bld:V(-3.2,F2+2.6,Z+.4),gen:V(3.4,top+1.8,-2.2),dist:V(.5,F2+2.2,-2.3),term:V(3.1,F2-FH+.8,-Z+.3),ctrl:V(-.98,y0+1.9,-1.75),gnl:'fixed'},
    cooling:{ctx:V(-9.5,5.4,4.5),bld:V(-3.2,F2+2.6,Z+.4),gen:V(3.4,top+1.8,-2.2),dist:V(.5,F2+2.2,-2.3),term:V(3.2,y0+4*FH-.85,1.6),ctrl:V(-.98,y0+1.9,-1.75)},
    ventilation:{bld:V(-3.2,F2+2.6,Z+.4),gen:V(-2.6,top+2.2,-1.8),dist:V(-.3,F2+1.0,-1.8),term:V(3.0,F2-.65,-1.8),ctrl:V(-.98,y0+1.9,-1.75)}
  };
  return {group:g,sys,anchors,fx,target:V(.3,7.4,0),cam:V(24,18.5,29)};
}

/* ---------- viewer ---------- */
let R=null, cam=null, ctl=null, scene=null, cur=null, host=null, onFrame=null;
function base(){
  const sc=new THREE.Scene();
  sc.add(new THREE.HemisphereLight(0xffffff,0xd8ccb8,.75));
  const d=new THREE.DirectionalLight(0xfff1dd,1.15); d.position.set(14,24,16); d.castShadow=true; d.shadow.mapSize.set(2048,2048);
  const s=d.shadow.camera; s.left=-20;s.right=20;s.top=20;s.bottom=-20;s.near=1;s.far=70; d.shadow.bias=-.0004; d.shadow.radius=4; sc.add(d);
  const f=new THREE.DirectionalLight(0xdfe9ff,.35); f.position.set(-16,10,6); sc.add(f);
  return sc;
}
function ensureR(){
  if(R) return R;
  R=new THREE.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true});
  R.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
  R.outputEncoding=THREE.sRGBEncoding; R.toneMapping=THREE.ACESFilmicToneMapping; R.toneMappingExposure=.97;
  R.shadowMap.enabled=true; R.shadowMap.type=THREE.PCFSoftShadowMap;
  cam=new THREE.PerspectiveCamera(28,1.6,.5,200);
  return R;
}
const built={};
function get(b){ if(!built[b]){const sc=base(); const d=b==='r'?house():office(); sc.add(d.group); built[b]={sc,...d}; restyle(b,'line');} return built[b]; }
function thumb(b,w,h,f){ensureR(); const d=get(b); R.setSize(w,h,false); cam.aspect=w/h; cam.position.copy(d.cam); cam.lookAt(d.target); cam.updateProjectionMatrix(); setFn(b,f||null,null); R.setClearColor(0xf2eee7,1); R.render(d.sc,cam); const u=R.domElement.toDataURL('image/jpeg',.9); R.setClearColor(0x000000,0); return u;}
function mount(el,b,frameCb){
  ensureR(); host=el; cur=b; onFrame=frameCb; const d=get(b); scene=d.sc;
  el.prepend(R.domElement); R.domElement.style.width='100%'; R.domElement.style.height='100%'; R.domElement.style.display='block'; R.domElement.style.touchAction='pan-y';
  cam.position.copy(d.cam);
  if(ctl) ctl.dispose();
  ctl=new THREE.OrbitControls(cam,R.domElement); ctl.target.copy(d.target); ctl.enablePan=false; ctl.enableDamping=true; ctl.dampingFactor=.08;
  ctl.minPolarAngle=.35; ctl.maxPolarAngle=1.35; const az=Math.atan2(d.cam.x-d.target.x,d.cam.z-d.target.z); ctl.minAzimuthAngle=az-.75; ctl.maxAzimuthAngle=az+.55;
  const dist=d.cam.distanceTo(d.target); ctl.minDistance=dist*.55; ctl.maxDistance=dist*1.15; ctl.enableZoom=true; ctl.zoomSpeed=.6; ctl.rotateSpeed=.6;
  if(icon){icon.parent&&icon.parent.remove(icon); icon=null;}
  ctl.addEventListener('start',()=>{goal=null;}); bindPick(); hovKey=null;
  ctl.update(); resize(); loop();
}
let shT=0, shC=0;
function applyShift(){ if(!host) return; const w=host.clientWidth,h=host.clientHeight; if(Math.abs(shC)>.5) cam.setViewOffset(w,h,shC,0,w,h); else cam.clearViewOffset(); cam.updateProjectionMatrix(); }
function setShift(px){ shT=px; }
function stepShift(){ const d=shT-shC; if(Math.abs(d)<.5){ if(shC!==shT){shC=shT; applyShift();} return; } shC+=d*.14; applyShift(); }
function resize(){ if(!host) return; const w=host.clientWidth, h=host.clientHeight; const c=R.domElement, pr=R.getPixelRatio(); if(c.width!==Math.floor(w*pr)||c.height!==Math.floor(h*pr)){ R.setSize(w,h,false); cam.aspect=w/h; applyShift(); if(scene) R.render(scene,cam); } else { cam.aspect=w/h; applyShift(); } }
let raf=0; function loop(){ cancelAnimationFrame(raf); const tick=()=>{ raf=requestAnimationFrame(tick); if(!host||!document.body.contains(host)){cancelAnimationFrame(raf);return;} stepFly(); stepShift(); ctl.update(); t+=.016; pulse(); animFx(); animIcon(); R.render(scene,cam); if(onFrame)onFrame(); }; tick(); }
let t=0, selKey=null, selFn=null;
const COL={h:0xc0392b,c:0x2a6fc0,v:0x4bae8a};
const FK={heating:'h',cooling:'c',ventilation:'v'};
const GHOST=new THREE.MeshBasicMaterial({color:0xf4f2ee,transparent:true,opacity:.16,depthWrite:false});
const HLM={}; function hlMat(k,soft){const key=k+(soft?'s':''); if(!HLM[key]) HLM[key]=new THREE.MeshStandardMaterial({color:COL[k],emissive:COL[k],emissiveIntensity:soft?.25:.5,roughness:.5,transparent:true,opacity:soft?.9:1,toneMapped:false}); return HLM[key];}
let hovKey=null, valid=new Set(), mute=false;
function f2k(f){return f?FK[f]:null;}
function isMatch(o,k,hk){ if(!hk||!o) return false; if(o.userData.sys) return o.userData.hk===hk&&o.userData.fns.includes(k); return o.userData.env===hk; }
function clearHalo(sc){ const rm=[]; sc.traverse(o=>{if(o.userData.halo)rm.push(o);}); rm.forEach(o=>o.parent.remove(o)); }
function setFn(b,f,hk){ selFn=f; selKey=hk; apply(b); }
function apply(b){ const d=get(b); const k=f2k(selFn); clearHalo(d.sc);
  const focus=k?(selKey||hovKey):null, soft=!selKey&&!!hovKey;
  const halos=[];
  d.sc.traverse(o=>{
    if(o.isLineSegments&&o.userData.edge){ if(o.userData.fxEdge) return; const mt=focus&&isMatch(o.parent,k,focus); o.material.opacity=focus&&selKey?(mt?1:.1):1; o.material.color.setHex(mt?COL[k]:0x23272a); return; }
    if(!o.isMesh||o.userData.halo||o.userData.fx||o.userData.flash) return;
    if(o.userData.sys){
      if(!o.userData.sysMat) o.userData.sysMat=o.material;
      const m=o.userData.sysMat; if(m.userData.orig===undefined) m.userData.orig=m.color.getHex();
      const on=k&&o.userData.fns.includes(k), isPipe=m.metalness>.2;
      if(focus&&!mute&&isMatch(o,k,focus)){ o.material=hlMat(k,soft); if(!soft) halos.push(o); o.castShadow=true; return; }
      o.material=m; m.color.setHex(on&&isPipe?COL[k]:m.userData.orig);
      m.opacity=!k?1:on?(selKey?.3:1):(selKey?.04:.12); m.depthWrite=m.opacity>.5; o.castShadow=m.opacity>.5; return;
    }
    if(!o.userData.styled) o.userData.styled=o.material;
    if(focus&&!mute&&isMatch(o,k,focus)){ o.material=hlMat(k,soft); if(!soft) halos.push(o); return; }
    o.material=(selKey||mute)?GHOST:o.userData.styled;
  });
  halos.forEach(o=>halo(o,k));
}
function halo(o,k){ const h=new THREE.Mesh(o.geometry,new THREE.MeshBasicMaterial({color:COL[k],transparent:true,opacity:.35,side:THREE.BackSide,depthWrite:false})); if(!o.geometry.boundingSphere)o.geometry.computeBoundingSphere(); const r=o.geometry.boundingSphere.radius||1; h.userData.base=Math.min(.14,.12/r); h.scale.setScalar(1+h.userData.base); h.userData.halo=true; h.raycast=()=>{}; o.add(h); }
function pulse(){ if(!cur||!selKey) return; const a=(Math.sin(t*3.2)+1)/2; get(cur).sc.traverse(o=>{ if(o.userData.halo){ o.material.opacity=.18+.35*a; o.scale.setScalar(1+o.userData.base*(.6+.8*a));} }); }
/* camera flight */
let goal=null;
function flyTo(p){ if(!ctl||!cur) return; const d=get(cur); if(!p){ goal={t:d.target.clone(),c:d.cam.clone()}; return; }
  const dir=cam.position.clone().sub(ctl.target).normalize(); const dist=d.cam.distanceTo(d.target)*.86;
  const tgt=d.target.clone().lerp(p,.5); goal={t:tgt,c:tgt.clone().add(dir.multiplyScalar(dist))}; }
function stepFly(){ if(!goal) return; ctl.target.lerp(goal.t,.08); cam.position.lerp(goal.c,.08); if(ctl.target.distanceTo(goal.t)<.02&&cam.position.distanceTo(goal.c)<.05) goal=null; }
/* picking */
const ray=new THREE.Raycaster(), ptr=new THREE.Vector2(); let onPick=null,onHover=null;
function pickAt(ev){ const r=R.domElement.getBoundingClientRect(); ptr.set((ev.clientX-r.left)/r.width*2-1,-(ev.clientY-r.top)/r.height*2+1); ray.setFromCamera(ptr,cam);
  const k=f2k(selFn); if(!k) return null; const hits=ray.intersectObjects(scene.children,true);
  for(const h of hits){ const o=h.object; if(!o.isMesh||o.userData.halo||o.userData.fx||o.userData.flash) continue;
    const hk=o.userData.sys?(o.userData.fns.includes(k)?o.userData.hk:null):o.userData.env;
    if(hk&&valid.has(hk)) return hk;
    const m=o.material; if(m&&m.transparent&&m.opacity<.5) continue; if(o.userData.sys) continue;
    return null; }
  return null; }
function bindPick(){ const el=R.domElement; let down=null;
  el.onpointerdown=e=>{down=[e.clientX,e.clientY];};
  el.onpointerup=e=>{ if(!down) return; const moved=Math.hypot(e.clientX-down[0],e.clientY-down[1]); down=null; if(moved>6) return; if(onPick) onPick(pickAt(e)); };
  el.onpointermove=e=>{ if(e.buttons||e.pointerType==='touch') return; const hk=pickAt(e); el.style.cursor=hk?'pointer':''; if(hk!==hovKey){ hovKey=hk; apply(cur); if(onHover) onHover(hk);} };
  el.onpointerleave=()=>{ if(hovKey){hovKey=null; apply(cur); if(onHover) onHover(null);} el.style.cursor=''; };
}

function project(p){ const v=p.clone().project(cam); const w=host.clientWidth,h=host.clientHeight; return [(v.x+1)/2*w,(1-v.y)/2*h,v.z<1]; }

/* ---------- style variants ---------- */
function avgColor(m){ if(m.map&&m.map.image&&m.map.image.getContext){const c=m.map.image,x=c.getContext('2d'),d=x.getImageData(0,0,c.width,c.height).data;let r=0,g=0,b=0,n=0;for(let i=0;i<d.length;i+=64){r+=d[i];g+=d[i+1];b+=d[i+2];n++;}return new THREE.Color(r/n/255,g/n/255,b/n/255).convertSRGBToLinear();} return m.color?m.color.clone():new THREE.Color(1,1,1); }
function restyle(b,style){ const d=get(b); const add=[];
  d.sc.traverse(o=>{ if(o.userData.fxEdge) return; if(o.userData.edge){add.push(['rm',o]);return;} if(!o.isMesh||o.userData.fx) return; if(o.userData.base===undefined) o.userData.base=o.material;
    const base=o.userData.base; if(o.userData.sys){ return; }
    const glass=base.transparent&&!o.userData.sys;
    if(style==='real'){ o.material=base; return; }
    const col=avgColor(base); const hsl={}; col.getHSL(hsl);
    if(style==='clay'){ const v=glass?new THREE.MeshStandardMaterial({color:0xdfe8ec,transparent:true,opacity:.35,roughness:.2}):new THREE.MeshStandardMaterial({color:new THREE.Color().setHSL(.08,.10,Math.min(.82,.52+hsl.l*.45)),roughness:1}); o.material=v; }
    if(style==='toon'){ const c=new THREE.Color().setHSL(hsl.h,Math.min(.7,hsl.s*1.5+.05),Math.min(.72,hsl.l*.8+.08)); o.material=glass?new THREE.MeshToonMaterial({color:0x7fb8d6,transparent:true,opacity:.55}):new THREE.MeshToonMaterial({color:c}); if(o.geometry.attributes.position.count<400) add.push(['edge',o,0x4a3d33,.55]); }
    if(style==='line'){ o.material=glass?new THREE.MeshBasicMaterial({color:0xe6f0f4,transparent:true,opacity:.5}):new THREE.MeshLambertMaterial({color:new THREE.Color().setHSL(hsl.h,hsl.s*.25,Math.min(.97,.86+hsl.l*.1))}); if(o.geometry.attributes.position.count<400) add.push(['edge',o,0x23272a,1]); }
  });
  d.sc.traverse(o=>{if(o.isMesh&&!o.userData.sys&&!o.userData.halo&&!o.userData.fx)o.userData.styled=o.material;});
  add.forEach(([k,o,c,a])=>{ if(k==='rm'){o.parent.remove(o);return;} const e=new THREE.LineSegments(new THREE.EdgesGeometry(o.geometry,25),new THREE.LineBasicMaterial({color:c,transparent:true,opacity:a})); e.userData.edge=true; o.add(e); });
  const L=d.sc.children.filter(x=>x.isLight); L.forEach(l=>{ if(l.isHemisphereLight) l.intensity=style==='line'?1.0:style==='toon'?.7:.75; if(l.isDirectionalLight&&l.castShadow) l.intensity=style==='clay'?1.35:1.15; });
}
function setEffects(b,keys,animate){ const d=get(b); Object.entries(d.fx).forEach(([k,grp])=>{ const on=keys.has(k);
    if(on&&!grp.visible){ grp.visible=true; if(animate){ grp.userData.t0=t; grp.traverse(o=>{ if(o.isMesh) o.scale.setScalar(.01); }); } }
    if(!on&&grp.visible){ grp.visible=false; } }); }
function flashFx(b,k){ const d=get(b), grp=d.fx[k]; if(!grp) return; grp.traverse(o=>{ if(!o.isMesh||o.userData.flash) return; const h=new THREE.Mesh(o.geometry,new THREE.MeshBasicMaterial({color:0xe07a2f,transparent:true,opacity:.5,side:THREE.BackSide,depthWrite:false})); h.userData.flash=t+2.6; h.raycast=()=>{}; h.scale.setScalar(1.08); o.add(h); }); }
function fxCenter(b,k){ const grp=get(b).fx[k]; if(!grp) return null; if(grp.userData.anchor) return grp.userData.anchor.clone(); const box=new THREE.Box3().setFromObject(grp); return box.isEmpty()?null:box.getCenter(new THREE.Vector3()); }
function animFx(){ if(!cur) return; const d=get(cur); const ease=x=>{const c1=1.70158,c3=c1+1;return 1+c3*Math.pow(x-1,3)+c1*Math.pow(x-1,2);};
  Object.values(d.fx).forEach(grp=>{ if(grp.userData.t0==null) return; const p=Math.min(1,(t-grp.userData.t0)/.7); const s=Math.max(.01,ease(p)); grp.traverse(o=>{ if(o.isMesh&&!o.userData.flash) o.scale.setScalar(s); }); if(p>=1) grp.userData.t0=null; });
  const rm=[]; d.sc.traverse(o=>{ if(o.userData.flash){ const left=o.userData.flash-t; if(left<=0) rm.push(o); else { const a=(Math.sin(t*6)+1)/2; o.material.opacity=Math.min(1,left)*(.25+.4*a); } } }); rm.forEach(o=>o.parent.remove(o)); }
function setMute(b,v){ if(mute===v) return; mute=v; apply(b); }
/* strategy icon shown at a component */
let icon=null;
function glyph(x,kind){ x.strokeStyle='#fff'; x.fillStyle='#fff'; x.lineWidth=9; x.lineCap='round'; x.lineJoin='round'; x.beginPath();
  if(kind==='reuse'){ x.arc(0,0,30,-2.2,1.2); x.stroke(); x.beginPath(); x.moveTo(30*Math.cos(1.2)+12,30*Math.sin(1.2)-4); x.lineTo(30*Math.cos(1.2),30*Math.sin(1.2)); x.lineTo(30*Math.cos(1.2)-2,30*Math.sin(1.2)-14); x.stroke(); x.beginPath(); x.arc(0,0,30,1.9,3.6); x.stroke(); }
  else if(kind==='repair'){ x.save(); x.rotate(-.8); x.fillRect(-7,-6,14,46); x.beginPath(); x.arc(0,-22,18,0,7); x.fill(); x.globalCompositeOperation='destination-out'; x.fillRect(-6,-46,12,22); x.restore(); }
  else if(kind==='repurpose'){ x.arc(0,4,26,Math.PI,0); x.stroke(); x.beginPath(); x.moveTo(14,-2); x.lineTo(26,10); x.lineTo(38,-2); x.stroke(); x.beginPath(); x.moveTo(-26,4); x.lineTo(-26,28); x.stroke(); }
  else if(kind==='org'){ x.lineWidth=7; x.strokeRect(-22,-30,44,60); x.beginPath(); x.moveTo(-12,-12); x.lineTo(12,-12); x.moveTo(-12,2); x.lineTo(12,2); x.moveTo(-12,16); x.lineTo(4,16); x.stroke(); }
  else if(kind==='env'){ x.moveTo(-30,4); x.lineTo(0,-24); x.lineTo(30,4); x.moveTo(-20,-4); x.lineTo(-20,28); x.lineTo(20,28); x.lineTo(20,-4); x.stroke(); }
  else { x.save(); x.rotate(.75); x.fillRect(-8,-34,16,50); x.beginPath(); x.moveTo(-8,18); x.lineTo(8,18); x.lineTo(0,34); x.fill(); x.restore(); } }
function showIcon(kind,label,pos,col){ const sc=scene; if(icon){ icon.parent&&icon.parent.remove(icon); icon=null; } if(!kind||!pos||!sc) return;
  const c=document.createElement('canvas'); c.width=640; c.height=160; const x=c.getContext('2d'); x.font='600 44px Inter, system-ui, sans-serif';
  const tw=Math.min(440,x.measureText(label).width); const W=150+tw+40;
  x.fillStyle='rgba(255,255,255,.96)'; x.beginPath(); x.roundRect?x.roundRect(4,20,W-8,120,60):x.rect(4,20,W-8,120); x.fill(); x.strokeStyle='rgba(0,0,0,.08)'; x.lineWidth=3; x.stroke();
  x.fillStyle='#'+col.toString(16).padStart(6,'0'); x.beginPath(); x.arc(80,80,52,0,7); x.fill();
  x.save(); x.translate(80,80); glyph(x,kind); x.restore();
  x.fillStyle='#1c1a17'; x.textBaseline='middle'; x.fillText(label,150,82,440);
  const tex=new THREE.CanvasTexture(c); tex.encoding=THREE.sRGBEncoding; tex.anisotropy=4;
  const m=new THREE.SpriteMaterial({map:tex,depthTest:false,transparent:true,toneMapped:false}); const sp=new THREE.Sprite(m);
  const h=1.15, w=h*c.width/c.height; sp.center.set(64/640*0+.0,0.5); sp.center.set(.06,.5); sp.userData.full=[w,h]; sp.scale.set(.01,.01,1); sp.position.copy(pos).add(new THREE.Vector3(0,1.25,0)); sp.renderOrder=999; sp.userData.t0=t; sc.add(sp); icon=sp; }
function animIcon(){ if(!icon||icon.userData.t0==null) return; const p=Math.min(1,(t-icon.userData.t0)/.45); const e=1-Math.pow(1-p,3); const [w,h]=icon.userData.full; icon.scale.set(w*e,h*e,1); if(p>=1) icon.userData.t0=null; }
function thumbFx(b,w,h,keys,f){ ensureR(); setEffects(b,new Set(keys),false); const u=thumb(b,w,h,f); const pts={};
  keys.forEach(k=>{ const c=fxCenter(b,k); if(c){ const v=c.clone().project(cam); pts[k]=[(v.x+1)/2,(1-v.y)/2]; } }); setEffects(b,new Set(),false); return {u,pts}; }
function hover(hk){ if(hk===hovKey) return; hovKey=hk; if(cur) apply(cur); }
return {thumbFx,thumb,mount,setFn,project,resize,get,restyle,flyTo,hover,setEffects,flashFx,fxCenter,setMute,setShift,showIcon,setValid:v=>{valid=new Set(v);},onPick:f=>{onPick=f;},onHover:f=>{onHover=f;},anchors:b=>get(b).anchors};
})();
