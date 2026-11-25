/* Meetlat (alleen Engels): afbeelding laden, kalibreren op een bekende maat, lijnen en vlakken meten, exporteren als png.
   Overgenomen uit de vorige meetlat.html (stanbox.nl/meetlat.html, 6-11-2026). De rekenlogica (kalibratie,
   afstand, oppervlak met de shoelace-formule, weergave in cm/m/m²/ha) is ongewijzigd. Aangepast aan de
   Stanbox-huisstijl: alleen kleuren uit de stijlgids, met een contrastrand zodat metingen op elke afbeelding
   zichtbaar blijven. */
(function(){
  const $ = id => document.getElementById(id);
  const canvas = $('stage');
  const ctx = canvas.getContext('2d');
  const canvasWrap = $('canvasWrap');
  const emptyState = $('emptyState');
  const titleBlock = $('titleBlock');
  const drawHint = $('drawHint');
  const fileInput = $('fileInput');

  const btnCalibrate = $('btnCalibrate');
  const btnLine = $('btnLine');
  const btnArea = $('btnArea');
  const btnClearAll = $('btnClearAll');
  const btnExport = $('btnExport');

  const calibBox = $('calibBox');
  const calibDot = $('calibDot');
  const calibText = $('calibText');

  const measureList = $('measureList');
  const emptyList = $('emptyList');

  const calibModal = $('calibModal');
  const calibValueInput = $('calibValue');
  const calibUnitSelect = $('calibUnit');

  /* Huisstijlkleuren (stanbox.nl/STIJLGIDS.md) */
  const C = { zwart:'#1A1A1A', perzik:'#F7C9A9', perzikLicht:'#FBE3D2', koraal:'#C9452A', koraalFel:'#E5603F', wit:'#FFFFFF' };
  const PALETTE = [C.koraalFel, C.zwart, C.perzik, C.koraal];
  const halo = color => color === C.zwart ? C.wit : C.zwart;   // contrastrand onder lijnen en punten
  const UNIT_TO_M = { mm:0.001, cm:0.01, m:1, inch:0.0254, ft:0.3048 };

  let img = null;
  let imgFilename = '';
  let shapes = [];          // {id, type:'line'|'area', points:[{x,y}], name, color}
  let shapeCounter = 0;
  let mode = null;          // null | 'calibrate' | 'line' | 'area'
  let currentPoints = [];
  let mousePos = null;
  let calibration = null;   // {pixelLength, unitsPerPixelM, unit, realValue}
  let hoveredId = null;
  let pendingCalibPoints = null;
  let exampleActive = false;  // true zolang het voorbeeld (data/02-voorbeeld.js) op het scherm staat

  // ---------- Afbeelding laden ----------
  fileInput.addEventListener('change', (e)=>{
    const file = e.target.files[0];
    if(!file) return;
    if(exampleActive) shapeCounter = 0;   // na het voorbeeld weer bij Line 1 beginnen
    exampleActive = false;
    $('exampleNote').hidden = true;
    imgFilename = file.name;
    const reader = new FileReader();
    reader.onload = (ev)=>{
      const image = new Image();
      image.onload = ()=>{ img = image; setupCanvas(); };
      image.src = ev.target.result;
    };
    reader.readAsDataURL(file);
    fileInput.value = '';   // dezelfde afbeelding opnieuw kunnen kiezen
  });

  function setupCanvas(){
    const MAX_DIM = 1800;
    let w = img.naturalWidth, h = img.naturalHeight;
    if(Math.max(w,h) > MAX_DIM){
      const scale = MAX_DIM / Math.max(w,h);
      w = Math.round(w*scale);
      h = Math.round(h*scale);
    }
    canvas.width = w;
    canvas.height = h;
    canvas.hidden = false;
    emptyState.hidden = true;
    canvasWrap.classList.remove('empty');
    titleBlock.hidden = false;

    shapes = [];
    calibration = null;
    mode = null;
    currentPoints = [];
    updateCalibStatus();
    renderList();
    setToolButtonsEnabled(true);
    updateTitleBlock();
    setMode(null);
  }

  function setToolButtonsEnabled(on){
    [btnCalibrate, btnLine, btnArea, btnClearAll, btnExport].forEach(b => b.disabled = !on);
  }

  // ---------- Gereedschap ----------
  btnCalibrate.addEventListener('click', ()=> setMode(mode==='calibrate' ? null : 'calibrate'));
  btnLine.addEventListener('click', ()=> setMode(mode==='line' ? null : 'line'));
  btnArea.addEventListener('click', ()=> setMode(mode==='area' ? null : 'area'));
  btnClearAll.addEventListener('click', ()=>{
    if(shapes.length===0 && !calibration) return;
    if(confirm('Are you sure you want to clear all measurements and the calibration?')){
      shapes = [];
      calibration = null;
      updateCalibStatus();
      renderList();
      updateTitleBlock();
      redraw();
    }
  });
  btnExport.addEventListener('click', exportImage);

  function setMode(newMode){
    mode = newMode;
    currentPoints = [];
    mousePos = null;
    btnCalibrate.classList.toggle('active', mode==='calibrate');
    btnLine.classList.toggle('active', mode==='line');
    btnArea.classList.toggle('active', mode==='area');
    [btnCalibrate, btnLine, btnArea].forEach(b => b.setAttribute('aria-pressed', b.classList.contains('active')));
    updateHint();
    redraw();
  }

  function hintButton(text, cls, disabled, onClick){
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'btn ' + cls;
    b.textContent = text;
    b.disabled = disabled;
    b.onclick = onClick;
    drawHint.appendChild(b);
  }

  function updateHint(){
    if(!mode){ drawHint.hidden = true; drawHint.innerHTML = ''; return; }
    drawHint.hidden = false;
    let text = '';
    if(mode==='calibrate') text = 'Click two points on a known dimension (e.g. the width of a door).';
    if(mode==='line') text = 'Click the start and end point of the line you want to measure.';
    if(mode==='area') text = `Click the corner points of the area (${currentPoints.length} placed). Click "Finish" when you are done.`;
    const title = mode==='calibrate' ? 'Calibrate' : mode==='line' ? 'Measure line' : 'Measure area';
    drawHint.innerHTML = `<span class="hint-txt"><strong>${title}:</strong> <span>${text}</span></span>`;

    if(mode==='area'){
      hintButton('Finish', 'primary', currentPoints.length < 3, ()=> finishShape());
      hintButton('Last point', 'subtle', currentPoints.length===0, ()=>{ currentPoints.pop(); updateHint(); redraw(); });
      hintButton('Cancel', 'subtle', false, ()=> setMode(null));
    }
  }

  // ---------- Tekenen op het vlak ----------
  function getPos(evt){
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clientX = evt.clientX !== undefined ? evt.clientX : evt.touches[0].clientX;
    const clientY = evt.clientY !== undefined ? evt.clientY : evt.touches[0].clientY;
    return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY };
  }

  canvas.addEventListener('pointerdown', (e)=>{
    if(!mode || !img) return;
    e.preventDefault();
    const pos = getPos(e);
    currentPoints.push(pos);

    if(mode==='calibrate' && currentPoints.length===2){
      pendingCalibPoints = currentPoints.slice();
      openCalibModal();
      currentPoints = [];
      mousePos = null;
      redraw();
      return;
    }
    if(mode==='line' && currentPoints.length===2){
      finishShape();
      return;
    }
    updateHint();
    redraw();
  });

  canvas.addEventListener('pointermove', (e)=>{
    if(!mode || currentPoints.length===0) return;
    mousePos = getPos(e);
    redraw();
  });

  window.addEventListener('keydown', (e)=>{
    if(!calibModal.hidden){ if(e.key==='Escape') closeCalibModal(); return; }
    if(e.key==='Escape' && mode){ setMode(null); }
    if(e.key==='Backspace' && mode==='area' && currentPoints.length>0 && !e.target.closest('input')){
      currentPoints.pop();
      updateHint();
      redraw();
    }
  });

  function finishShape(){
    if(mode==='line' && currentPoints.length===2 ||
       mode==='area' && currentPoints.length>=3){
      const color = PALETTE[shapeCounter % PALETTE.length];
      shapeCounter++;
      const shape = {
        id: 'shape_'+shapeCounter,
        type: mode,
        points: currentPoints.slice(),
        name: mode==='line' ? `Line ${shapeCounter}` : `Area ${shapeCounter}`,
        color
      };
      shapes.push(shape);
      currentPoints = [];
      setMode(null);
      renderList();
      redraw();
      // naamveld van de nieuwe meting direct selecteren om snel te hernoemen
      setTimeout(()=>{
        const input = document.querySelector(`[data-name-id="${shape.id}"]`);
        if(input){ input.focus(); input.select(); }
      }, 30);
    }
  }

  // ---------- Kalibratievenster ----------
  function openCalibModal(){
    calibValueInput.value = '';
    calibModal.hidden = false;
    setTimeout(()=>calibValueInput.focus(), 50);
  }
  function closeCalibModal(){
    calibModal.hidden = true;
    pendingCalibPoints = null;
  }
  $('calibCancel').addEventListener('click', closeCalibModal);
  calibModal.addEventListener('click', e => { if(e.target === calibModal) closeCalibModal(); });
  $('calibConfirm').addEventListener('click', ()=>{
    const val = parseFloat(calibValueInput.value);
    const unit = calibUnitSelect.value;
    if(!val || val<=0 || !pendingCalibPoints){
      calibValueInput.focus();
      return;
    }
    const [p1,p2] = pendingCalibPoints;
    const pixelLength = Math.hypot(p2.x-p1.x, p2.y-p1.y);
    calibration = {
      pixelLength,
      realValue: val,
      unit,
      unitsPerPixelM: (val*UNIT_TO_M[unit]) / pixelLength
    };
    pendingCalibPoints = null;
    calibModal.hidden = true;
    updateCalibStatus();
    updateTitleBlock();
    renderList();
    redraw();
  });
  calibValueInput.addEventListener('keydown', (e)=>{
    if(e.key==='Enter') $('calibConfirm').click();
  });

  function updateCalibStatus(){
    calibBox.classList.toggle('set', !!calibration);
    calibDot.classList.toggle('on', !!calibration);
    calibText.textContent = calibration
      ? `Calibrated: ${calibration.realValue} ${calibration.unit} = ${calibration.pixelLength.toFixed(0)} px`
      : 'Not calibrated yet, measuring in pixels';
  }

  function updateTitleBlock(){
    if(!img){ titleBlock.hidden = true; return; }
    const schaal = calibration ? `1 px = ${calibration.unitsPerPixelM.toFixed(5)} m` : 'not calibrated';
    const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
    titleBlock.innerHTML = `
      <div class="row"><span class="label">file</span><span>${imgFilename ? esc(imgFilename.slice(0,22)) : 'image'}</span></div>
      <div class="row"><span class="label">scale</span><span>${schaal}</span></div>
      <div class="row"><span class="label">date</span><span>${new Date().toLocaleDateString('en-GB')}</span></div>
    `;
  }

  // ---------- Meetkunde ----------
  function pixelDistance(points){
    return Math.hypot(points[1].x-points[0].x, points[1].y-points[0].y);
  }
  function pixelArea(points){
    let sum=0;
    for(let i=0;i<points.length;i++){
      const a = points[i], b = points[(i+1)%points.length];
      sum += a.x*b.y - b.x*a.y;
    }
    return Math.abs(sum)/2;
  }

  function formatDistance(px){
    if(!calibration) return `${px.toFixed(0)} px`;
    const m = px * calibration.unitsPerPixelM;
    if(m < 1) return `${(m*100).toFixed(1)} cm`;
    return `${m.toFixed(2)} m`;
  }
  function formatArea(px2){
    if(!calibration) return { main:`${px2.toFixed(0)} px²`, sec:'' };
    const m2 = px2 * Math.pow(calibration.unitsPerPixelM, 2);
    if(m2 < 1) return { main:`${(m2*10000).toFixed(0)} cm²`, sec:`≈ ${m2.toFixed(3)} m²` };
    return { main:`${m2.toFixed(2)} m²`, sec: m2>=10000 ? `≈ ${(m2/10000).toFixed(2)} ha` : '' };
  }

  // ---------- Tekenen ----------
  // houdt labels, punten en lijnen even groot op het scherm, hoe ver de afbeelding ook is verkleind
  function k(){ const w = canvas.getBoundingClientRect().width; return w ? Math.max(1, canvas.width / w) : 1; }

  function redraw(){
    if(!img) return;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    shapes.forEach(shape=> drawShape(shape, shape.id===hoveredId));
    if(mode && currentPoints.length>0) drawInProgress();
  }

  function tracePath(points, close){
    ctx.beginPath();
    points.forEach((p,i)=> i===0 ? ctx.moveTo(p.x,p.y) : ctx.lineTo(p.x,p.y));
    if(close) ctx.closePath();
  }

  function strokeWithHalo(color, width, dash){
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.setLineDash(dash || []);
    ctx.strokeStyle = halo(color);
    ctx.lineWidth = width + 2.5*k();
    ctx.stroke();
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
    ctx.setLineDash([]);
  }

  function drawShape(shape, highlighted){
    ctx.save();
    const width = (highlighted ? 4 : 2.5) * k();
    if(shape.type==='line'){
      tracePath(shape.points, false);
      strokeWithHalo(shape.color, width);
      shape.points.forEach(p=>drawDot(p, shape.color));
      const mid = { x:(shape.points[0].x+shape.points[1].x)/2, y:(shape.points[0].y+shape.points[1].y)/2 };
      drawLabel(mid, `${shape.name}: ${formatDistance(pixelDistance(shape.points))}`, shape.color);
    } else {
      tracePath(shape.points, true);
      ctx.fillStyle = shape.color;
      ctx.globalAlpha = 0.18;
      ctx.fill();
      ctx.globalAlpha = 1;
      strokeWithHalo(shape.color, width);
      shape.points.forEach(p=>drawDot(p, shape.color));
      const cx = shape.points.reduce((s,p)=>s+p.x,0)/shape.points.length;
      const cy = shape.points.reduce((s,p)=>s+p.y,0)/shape.points.length;
      const area = formatArea(pixelArea(shape.points));
      drawLabel({x:cx,y:cy}, `${shape.name}: ${area.main}${area.sec ? ' ('+area.sec+')' : ''}`, shape.color);
    }
    ctx.restore();
  }

  function drawInProgress(){
    ctx.save();
    const pts = mousePos ? [...currentPoints, mousePos] : currentPoints;
    tracePath(pts, mode==='area' && currentPoints.length>=2);
    strokeWithHalo(C.zwart, 2*k(), [6*k(),4*k()]);
    currentPoints.forEach(p=>drawDot(p, C.wit));

    const live = (p1, p2) => ({ x:(p1.x+p2.x)/2, y:(p1.y+p2.y)/2 });
    if(mode==='line' && currentPoints.length===1 && mousePos){
      drawLabel(live(currentPoints[0], mousePos), formatDistance(Math.hypot(mousePos.x-currentPoints[0].x, mousePos.y-currentPoints[0].y)), C.perzik);
    }
    if(mode==='calibrate' && currentPoints.length===1 && mousePos){
      drawLabel(live(currentPoints[0], mousePos), `${Math.hypot(mousePos.x-currentPoints[0].x, mousePos.y-currentPoints[0].y).toFixed(0)} px`, C.perzik);
    }
    if(mode==='area' && pts.length>=3){
      const cx = pts.reduce((s,p)=>s+p.x,0)/pts.length;
      const cy = pts.reduce((s,p)=>s+p.y,0)/pts.length;
      drawLabel({x:cx,y:cy}, formatArea(pixelArea(pts)).main, C.perzik);
    }
    ctx.restore();
  }

  function drawDot(p, color){
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 4.5*k(), 0, Math.PI*2);
    ctx.fill();
    ctx.strokeStyle = halo(color);
    ctx.lineWidth = 1.5*k();
    ctx.stroke();
    ctx.restore();
  }

  // label: zwart vlak met perzik-lichte tekst (donkere variant), rand in de kleur van de meting
  function drawLabel(pos, text, color){
    ctx.save();
    const s = k();
    ctx.font = `600 ${13*s}px Inter, system-ui, sans-serif`;
    const paddingX = 10*s, paddingY = 4*s;
    const w = ctx.measureText(text).width + paddingX*2;
    const h = 18*s + paddingY;
    const x = pos.x - w/2, y = pos.y - h/2;
    ctx.fillStyle = C.zwart;
    ctx.strokeStyle = color === C.zwart ? C.perzik : color;
    ctx.lineWidth = 1.5*s;
    roundRect(x, y, w, h, 6*s);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = C.perzikLicht;
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x+paddingX, y+h/2+1);
    ctx.restore();
  }
  function roundRect(x,y,w,h,r){
    ctx.beginPath();
    ctx.moveTo(x+r,y);
    ctx.arcTo(x+w,y,x+w,y+h,r);
    ctx.arcTo(x+w,y+h,x,y+h,r);
    ctx.arcTo(x,y+h,x,y,r);
    ctx.arcTo(x,y,x+w,y,r);
    ctx.closePath();
  }

  // ---------- Lijst met metingen ----------
  const ICON_DEL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16"/><path d="M9 7V4h6v3"/><path d="M6 7l1 13h10l1-13"/></svg>';
  function renderList(){
    measureList.innerHTML = '';
    emptyList.hidden = shapes.length > 0;
    shapes.forEach(shape=>{
      const li = document.createElement('li');
      li.addEventListener('mouseenter', ()=>{ hoveredId = shape.id; redraw(); });
      li.addEventListener('mouseleave', ()=>{ hoveredId = null; redraw(); });

      const top = document.createElement('div');
      top.className = 'm-top';

      const swatch = document.createElement('span');
      swatch.className = 'swatch';
      swatch.style.background = shape.color;

      const typeSpan = document.createElement('span');
      typeSpan.className = 'm-type';
      typeSpan.textContent = shape.type==='line' ? '／' : '▱';

      const nameInput = document.createElement('input');
      nameInput.className = 'm-name';
      nameInput.value = shape.name;
      nameInput.setAttribute('data-name-id', shape.id);
      nameInput.setAttribute('aria-label', shape.name);
      nameInput.addEventListener('input', ()=>{ shape.name = nameInput.value; redraw(); });

      const delBtn = document.createElement('button');
      delBtn.type = 'button';
      delBtn.className = 'm-del';
      delBtn.innerHTML = ICON_DEL;
      delBtn.title = 'Delete';
      delBtn.addEventListener('click', ()=>{
        shapes = shapes.filter(s=>s.id!==shape.id);
        hoveredId = null;
        renderList();
        redraw();
      });

      top.append(swatch, typeSpan, nameInput, delBtn);

      const val = document.createElement('div');
      val.className = 'm-value';
      if(shape.type==='line'){
        val.textContent = formatDistance(pixelDistance(shape.points));
      } else {
        const a = formatArea(pixelArea(shape.points));
        val.innerHTML = a.main + (a.sec ? ` <span class="sec">${a.sec}</span>` : '');
      }

      li.append(top, val);
      measureList.appendChild(li);
    });
  }

  // ---------- Exporteren ----------
  function exportImage(){
    const out = document.createElement('canvas');
    out.width = canvas.width;
    out.height = canvas.height;
    out.getContext('2d').drawImage(canvas, 0, 0);
    const link = document.createElement('a');
    link.download = (imgFilename.replace(/\.[^.]+$/,'') || 'measurement') + '_measured.png';
    link.href = out.toDataURL('image/png');
    link.click();
  }

  // ---------- Voorbeeld bij openen ----------
  // Laadt de plattegrond uit data/01-voorbeeld.js met kalibratie en metingen, via dezelfde
  // functies als een eigen afbeelding.
  function exampleSrc(){
    const V = window.MEETLAT_VOORBEELD;
    const esc = s => String(s).replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
    const labels = (V.ruimtes || []).map(r => `<text x="${r.x}" y="${r.y}">${esc(r.naam)}</text>`).join('');
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(V.svg.replace('{{RUIMTES}}', labels));
  }

  function loadExample(){
    const V = window.MEETLAT_VOORBEELD;
    if(!V) return;
    const image = new Image();
    image.onload = ()=>{
      img = image;
      exampleActive = true;
      imgFilename = V.bestand;
      setupCanvas();
      const [p1, p2] = V.kalibratie.punten;
      const pixelLength = Math.hypot(p2.x-p1.x, p2.y-p1.y);
      calibration = {
        pixelLength,
        realValue: V.kalibratie.waarde,
        unit: V.kalibratie.eenheid,
        unitsPerPixelM: (V.kalibratie.waarde*UNIT_TO_M[V.kalibratie.eenheid]) / pixelLength
      };
      V.metingen.forEach(m=>{
        const color = PALETTE[shapeCounter % PALETTE.length];
        shapeCounter++;
        shapes.push({ id:'shape_'+shapeCounter, type:m.type, points:m.punten.map(p=>({x:p.x, y:p.y})), name:m.naam, color });
      });
      $('exampleNote').hidden = false;
      updateCalibStatus();
      updateTitleBlock();
      renderList();
      redraw();
    };
    image.src = exampleSrc();
  }

  window.addEventListener('resize', redraw);
  updateHint();
  loadExample();
})();
