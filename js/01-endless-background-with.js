(function(){
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var NEWEST_FIRST = TOOLS.slice().reverse();
  function $(id){ return document.getElementById(id); }
  function rand(a, b){ return Math.random() * (b - a) + a; }
  function pick(arr){ return arr[Math.floor(Math.random() * arr.length)]; }
  $('dlg-logo').src = GEBOUW_LOGO;

  /* =========================================================
     1. Endless background, with a tool washing up now and then
     ========================================================= */
  var bgScene = $('bg-scene'), driftLayer = $('drift-layer');
  var panelCount = 1, MAX_PANELS = 600;
  /* Flat colours from the Stanbox style guide (no gradients). Mostly light cubes,
     now and then one with a coral side. */
  var PALETTES = [
    { top:"#FFFFFF", front:"#FBE3D2", side:"#F7C9A9" },
    { top:"#FFFFFF", front:"#FBE3D2", side:"#F7C9A9" },
    { top:"#FBE3D2", front:"#FFFFFF", side:"#FBE3D2" },
    { top:"#FBE3D2", front:"#E5603F", side:"#C9452A" }
  ];
  var DOT_COLORS = ["#C9452A","#E5603F","#1A1A1A"];
  var DIAMOND_COLORS = ["#E5603F","#C9452A"];
  function n0(v){ return v.toFixed(0); } function n1(v){ return v.toFixed(1); }
  function cube(cx, topY, hw, hh, h, p){
    var lx=cx-hw, ly=topY+hh, rx=cx+hw, ry=topY+hh, bx=cx, by=topY+2*hh;
    return '<path d="M'+n0(lx)+' '+n0(ly)+'L'+n0(cx)+' '+n0(topY)+'L'+n0(rx)+' '+n0(ry)+'L'+n0(bx)+' '+n0(by)+'Z" class="face" fill="'+p.top+'"/>'+
           '<path d="M'+n0(lx)+' '+n0(ly)+'V'+n0(ly+h)+'L'+n0(bx)+' '+n0(by+h)+'V'+n0(by)+'Z" class="face" fill="'+p.front+'"/>'+
           '<path d="M'+n0(bx)+' '+n0(by)+'V'+n0(by+h)+'L'+n0(rx)+' '+n0(ry+h)+'V'+n0(ry)+'Z" class="face" fill="'+p.side+'"/>';
  }
  function buildPanel(index){
    var W=1536, H=Math.round(W*(window.innerHeight/window.innerWidth)), body='';
    var nC=Math.floor(rand(2,4.999));
    for(var i=0;i<nC;i++){
      var hw=rand(45,85);
      body+='<g class="cluster" style="animation-name:'+(i%2?'floatB':'floatA')+';animation-duration:'+n1(rand(6,11))+'s;animation-delay:-'+n1(rand(0,8))+'s;">'+cube(rand(.1,.9)*W, rand(.1,.6)*H, hw, hw*rand(.42,.52), hw*rand(1.1,1.6), pick(PALETTES))+'</g>';
    }
    var g=''; for(var k=0;k<Math.floor(rand(4,8));k++){ var x1=rand(0,W), y1=rand(0,H); g+='<path d="M'+n0(x1)+' '+n0(y1)+'L'+n0(x1+rand(-260,260))+' '+n0(y1+rand(80,220))+'"/>'; }
    body+='<g class="grid-lines" fill="none" stroke="#1A1A1A" stroke-width="1" opacity=".14">'+g+'</g>';
    var d=''; for(var m=0;m<Math.floor(rand(3,6));m++){ var dx=rand(0,W), dy=rand(0,H*.6); d+='<path d="M'+n0(dx)+' '+n0(dy)+'V'+n0(dy+rand(120,260))+'"/>'; }
    body+='<g class="dash-lines" fill="none" stroke="#1A1A1A" stroke-width="1" stroke-dasharray="6 7" opacity=".08">'+d+'</g>';
    for(var q=0;q<Math.floor(rand(4,8));q++) body+='<circle class="dot" style="animation-duration:'+n1(rand(4.5,7.4))+'s;animation-delay:-'+n1(rand(0,4))+'s" cx="'+n0(rand(.12,.88)*W)+'" cy="'+n0(rand(.15,.85)*H)+'" r="'+n1(rand(1.8,3.4))+'" fill="'+pick(DOT_COLORS)+'"/>';
    if(Math.random()<.7){ var px=rand(.32,.68)*W, py=rand(.2,.8)*H, s=rand(7,11);
      body+='<path class="diamond" style="animation-delay:-'+n1(rand(0,3))+'s;transform-origin:'+n0(px)+'px '+n0(py)+'px" d="M'+n0(px-s)+' '+n0(py)+'L'+n0(px)+' '+n0(py-s*.7)+'L'+n0(px+s)+' '+n0(py)+'L'+n0(px)+' '+n0(py+s*.7)+'Z" fill="'+pick(DIAMOND_COLORS)+'"/>'; }
    var el=document.createElement('div'); el.className='bg-panel';
    el.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+W+' '+H+'" preserveAspectRatio="xMidYMid slice"><g class="scene-drift" style="animation-duration:'+n0(rand(34,52))+'s;animation-delay:-'+n0(rand(0,20))+'s;">'+body+'</g></svg>';
    return el;
  }

  /* A tool washes up roughly every one and a half screens. The first ones come in a
     fixed order (FIRST_DRIFTS, by tool id); after that they are random, never the
     same one twice in a row. */
  var FIRST_DRIFTS = ['ontwerpkader', 'energie', 'damagecurve', 'sri', 'wateroverlast', 'watercalculator'];
  var driftCount = 0, lastDrift = null, driftIO = null;
  if(!reduced && 'IntersectionObserver' in window){
    driftIO = new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); driftIO.unobserve(e.target); } }); }, { threshold:.2 });
  }
  function nextDriftTool(){
    var fixed = null;
    while(!fixed && driftCount < FIRST_DRIFTS.length){
      var id = FIRST_DRIFTS[driftCount++];
      fixed = TOOLS.filter(function(x){ return x.id === id; })[0] || null;
    }
    if(fixed) return fixed;
    var pool = TOOLS.filter(function(x){ return x !== lastDrift; });
    return pick(pool);
  }
  /* Onderbrekingen (wereldbol, datalandschap, stad) en het zongebouwtje: daar mag geen tool overheen. */
  /* ---------- waar tools (en zongebouwtjes) mogen komen ----------
     Visuals (wereldbol, datalandschap, stad): daar komt niets overheen.
     Tussen twee visuals: vaste indeling met twee tools en een zongebouwtje (indelenTussenruimtes).
     Na de laatste visual: af en toe een tool, met ruimte ertussen, en heel soms een zongebouwtje. */
  function visuals(){
    return [].map.call(document.querySelectorAll('.wereld, .visual'), function(w){
      var top = w.getBoundingClientRect().top + window.scrollY;
      return [top, top + w.offsetHeight];
    }).sort(function(a, b){ return a[0] - b[0]; });
  }
  function eindeVisuals(){ return visuals().reduce(function(m, b){ return Math.max(m, b[1]); }, 0); }
  var KAART_H = function(){ return window.innerWidth < 700 ? 190 : 240; };
  var laatsteKaart = -1e9, laatsteZon = -1e9;

  function maakDrift(top, links){
    var t = nextDriftTool(); lastDrift = t;
    var vw = window.innerWidth;
    var card = document.createElement('button');
    card.type = 'button'; card.className = 'drift';
    card.setAttribute('aria-label', 'Open ' + t.name);
    var w = vw < 700 ? 150 : 190;
    var side = links ? rand(.06, .26) : rand(.62, .84);
    card.style.left = Math.max(12, Math.min(vw - w - 12, side * vw)) + 'px';
    card.style.top = top + 'px';
    card.style.setProperty('--rot', rand(-4, 4).toFixed(1) + 'deg');
    card.style.setProperty('--dur', rand(5, 8).toFixed(1) + 's');
    card.style.setProperty('--delay', (-rand(0, 5)).toFixed(1) + 's');
    card.innerHTML = '<img alt="" loading="lazy" src="' + IMAGES[t.id] + '"><span class="cap"><b></b><i><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M8 7h9v9"/></svg></i></span>';
    card.querySelector('b').textContent = t.name;
    card.addEventListener('click', function(){ openBox(card.getBoundingClientRect(), t); });
    driftLayer.appendChild(card);
    if(driftIO) driftIO.observe(card); else card.classList.add('in');
    laatsteKaart = Math.max(laatsteKaart, top);
  }
  function maakZon(top, links){
    if(!window.maakZongebouw) return;
    window.maakZongebouw(top, links ? 'links' : 'rechts');
    laatsteZon = Math.max(laatsteZon, top);
  }

  /* tussen elke twee visuals: tool – zongebouwtje (andere kant) – tool, op ruime afstand */
  function indelenTussenruimtes(){
    var v = visuals();
    for(var i = 0; i < v.length - 1; i++){
      var van = v[i][1], tot = v[i+1][0], L = tot - van;
      if(L < KAART_H() * 3) continue;
      var links = Math.random() < .5;
      maakDrift(van + L * .12, links);
      maakZon(van + L * .5 - 105, !links);
      maakDrift(van + L * .88 - KAART_H(), links);
    }
  }

  /* na de laatste visual: per achtergrondscherm */
  function maybeDrift(index){
    if(index < 1) return;
    var vh = window.innerHeight, start = index * vh;
    if(start < eindeVisuals() + vh * .3) return;   /* daarvoor zorgt indelenTussenruimtes */
    var top = start + rand(.15, .6) * vh;
    if(top - laatsteKaart < vh * 1.1) return;      /* ruimte tussen de tools */
    if(Math.random() < .12 && top - laatsteZon > vh * 4 && top - laatsteKaart > vh * 1.4){
      maakZon(top, Math.random() < .5); return;   /* heel soms een zongebouwtje */
    }
    if(Math.random() > .7) return;
    maakDrift(top, Math.random() < .5);
  }
  function appendPanels(n){
    for(var i=0;i<n && panelCount<MAX_PANELS;i++){ bgScene.appendChild(buildPanel(panelCount)); maybeDrift(panelCount); panelCount++; }
  }
  var bgTick=false;
  window.addEventListener('scroll', function(){
    if(bgTick) return; bgTick=true;
    requestAnimationFrame(function(){
      if(window.scrollY + window.innerHeight*2 >= document.documentElement.scrollHeight) appendPanels(2);
      $('scroll-cue').classList.toggle('gone', window.scrollY > 120);
      bgTick=false;
    });
  }, { passive:true });
  appendPanels(3);
  /* De visuals maken de pagina lang: maak de achtergrond (en de tools) meteen tot voorbij de
     laatste visual aan, anders blijven de stukken ertussen leeg. Na het laden, zodat ook het
     zongebouwtje (js/06-…) al zijn plek heeft. */
  window.addEventListener('load', function(){
    indelenTussenruimtes();
    var eind = eindeVisuals() + window.innerHeight * 2;
    while(panelCount * window.innerHeight < eind && panelCount < MAX_PANELS) appendPanels(1);
  });

  /* =========================================================
     2. The sandbox: wanders as you scroll, opens into all tools
     ========================================================= */
  var box = $('sandbox'), inside = $('inside'), frame = $('frame'), iframe = $('frame-iframe');
  var backdrop = $('backdrop'), controls = $('controls');
  var BOX_W = 260, BOX_H = 178;
  var expanded = false, animating = false, currentTool = null, lastX = 0, lastY = 0;
  function sizeBox(){ var small = window.innerWidth < 700; BOX_W = small ? 196 : 260; BOX_H = small ? 134 : 178; }
  sizeBox();
  var ph = { x1:rand(0,6.28), x2:rand(0,6.28), y1:rand(0,6.28), y2:rand(0,6.28) };
  function rx(t){ return .55*Math.sin(t*.0011+ph.x1) + .45*Math.sin(t*.002+ph.x2); }
  function ry(t){ return .5*Math.sin(t*.0014+ph.y1) + .5*Math.sin(t*.00077+ph.y2); }
  var rx0 = rx(0), ry0 = ry(0);
  function wanderPos(){
    var t = window.scrollY, vw = window.innerWidth, vh = window.innerHeight;
    var minL = 16, maxL = Math.max(minL, vw - BOX_W - 16);
    var heroBottom = document.querySelector(".hero").getBoundingClientRect().bottom + 24;   /* niet over de introtekst */
    var minT = Math.min(Math.max(Math.min(300, vh * .42), heroBottom), vh - BOX_H - 24), maxT = Math.max(minT, vh - BOX_H - 90);
    var xN = (rx(t) - rx0) / 2, yN = (ry(t) - ry0) / 2;
    return { x: minL + ((xN + 1) / 2) * (maxL - minL), y: minT + Math.max(0, Math.min(1, .2 + yN * .5)) * (maxT - minT) };
  }
  function wander(){
    if(animating || expanded) return;
    var p = wanderPos(); lastX = p.x; lastY = p.y;
    box.style.left = lastX + 'px'; box.style.top = lastY + 'px';
    box.style.width = BOX_W + 'px'; box.style.height = BOX_H + 'px';
  }
  var wTick=false;
  window.addEventListener('scroll', function(){ if(wTick) return; wTick=true; requestAnimationFrame(function(){ wander(); wTick=false; }); }, { passive:true });
  window.addEventListener('resize', function(){ sizeBox(); if(expanded) layoutOpen(); else wander(); });
  wander();

  function openRect(){
    var m = Math.max(16, Math.min(56, Math.min(innerWidth, innerHeight) * .06));
    var top = Math.max(m, 74);
    return { left:m, top:top, width:innerWidth - m*2, height:innerHeight - top - m };
  }
  function placeControls(r){
    var w = controls.offsetWidth || 150;
    controls.style.left = Math.max(10, r.left + r.width - w) + 'px';
    controls.style.top = Math.max(10, (r.top - 42) / 2) + 'px';
  }
  function layoutOpen(){
    var r = openRect();
    box.style.left = r.left+'px'; box.style.top = r.top+'px'; box.style.width = r.width+'px'; box.style.height = r.height+'px';
    placeControls(r);
  }
  function animateBox(from, to, done){
    animating = true;
    var a = box.animate([
      { left:from.left+'px', top:from.top+'px', width:from.width+'px', height:from.height+'px' },
      { left:to.left+'px', top:to.top+'px', width:to.width+'px', height:to.height+'px' }
    ], { duration: reduced ? 1 : 520, easing:'cubic-bezier(.22,.9,.32,1)' });
    box.style.left = to.left+'px'; box.style.top = to.top+'px'; box.style.width = to.width+'px'; box.style.height = to.height+'px';
    a.onfinish = function(){ animating = false; if(done) done(); };
  }

  function openBox(fromRect, tool){
    if(expanded){ if(tool) openTool(tool); return; }
    if(tool && tool.modal){ openDialog(); return; }
    expanded = true;
    zetVast(inside, null); zetVast(frame, null);   /* voor als je snel na het sluiten weer opent */
    document.documentElement.classList.add('no-scroll'); document.body.classList.add('no-scroll');
    var from = fromRect ? { left:fromRect.left, top:fromRect.top, width:fromRect.width, height:fromRect.height }
                        : { left:lastX, top:lastY, width:BOX_W, height:BOX_H };
    box.classList.add('expanded'); backdrop.classList.add('open');
    var to = openRect();
    renderTiles(); showPreview(NEWEST_FIRST[0]);
    animateBox(from, to, function(){
      placeControls(to); controls.classList.add('show');
      if(tool) openTool(tool); else { inside.classList.add('active'); }
    });
  }
  /* Sluiten: alles gebeurt tegelijk met het krimpen (rand, duinen, schaduw via CSS-overgangen),
     de inhoud houdt zijn maat zodat er tijdens het krimpen niets opnieuw wordt opgemaakt,
     en de tool wordt pas na afloop afgesloten. */
  function zetVast(el, r){
    if(r){ el.style.right = el.style.bottom = 'auto'; el.style.width = r.width + 'px'; el.style.height = r.height + 'px'; }
    else { el.style.right = el.style.bottom = el.style.width = el.style.height = ''; }
  }
  function closeBox(){
    if(!expanded || animating) return;
    var from = openRect();
    zetVast(inside, from); zetVast(frame, from);
    frame.classList.remove('active','loaded'); inside.classList.remove('active');
    controls.classList.remove('show'); backdrop.classList.remove('open');
    box.classList.add('closing'); box.classList.remove('expanded');
    currentTool = null;
    var p = wanderPos(); lastX = p.x; lastY = p.y;
    var to = { left:lastX, top:lastY, width:BOX_W, height:BOX_H };
    animateBox(from, to, function(){
      /* zwaardere opruimklussen pas als alles stil staat */
      setTimeout(function(){ if(expanded) return; iframe.src = 'about:blank'; zetVast(inside, null); zetVast(frame, null); }, 250);
      expanded = false;
      document.documentElement.classList.remove('no-scroll'); document.body.classList.remove('no-scroll');
      box.focus({ preventScroll:true });
      box.classList.remove('closing');
    });
  }
  box.addEventListener('click', function(e){ if(!expanded && !animating) openBox(null, null); });
  box.addEventListener('keydown', function(e){ if(!expanded && (e.key === 'Enter' || e.key === ' ')){ e.preventDefault(); openBox(null, null); } });
  backdrop.addEventListener('click', closeBox);
  $('btn-close').addEventListener('click', closeBox);
  $('btn-back').addEventListener('click', backToTiles);

  /* tiles + preview inside the open sandbox */
  var previewTool = null;
  function renderTiles(){
    var wrap = $('tiles'); if(wrap.childElementCount) return;
    NEWEST_FIRST.forEach(function(t){
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'tile'; b.dataset.id = t.id;
      b.innerHTML = '<span class="img"><img alt="" src="' + IMAGES[t.id] + '"></span><span></span>';
      b.lastChild.textContent = t.name;
      b.addEventListener('mouseenter', function(){ showPreview(t); });
      b.addEventListener('focus', function(){ showPreview(t); });
      b.addEventListener('click', function(){ openTool(t); });
      wrap.appendChild(b);
    });
  }
  function showPreview(t){
    previewTool = t;
    $('preview-img').src = IMAGES[t.id];
    $('preview-name').textContent = t.name;
    $('preview-desc').textContent = t.desc || '';
    [].forEach.call($('tiles').children, function(el){ el.classList.toggle('on', el.dataset.id === t.id); });
  }
  $('preview').addEventListener('click', function(){ if(previewTool) openTool(previewTool); });
  $('preview').addEventListener('keydown', function(e){ if(e.key === 'Enter' && previewTool) openTool(previewTool); });
  $('preview-open').addEventListener('click', function(){ if(previewTool) openTool(previewTool); });
  $('search').addEventListener('input', function(){
    var q = this.value.trim().toLowerCase(), first = null, any = false;
    [].forEach.call($('tiles').children, function(el){
      var t = TOOLS.filter(function(x){ return x.id === el.dataset.id; })[0];
      var hit = !q || (t.name + ' ' + (t.desc || '')).toLowerCase().indexOf(q) !== -1;
      el.hidden = !hit; if(hit){ any = true; if(!first) first = t; }
    });
    $('empty').style.display = any ? 'none' : 'block';
    if(first) showPreview(first);
  });

  function openTool(t){
    if(t.modal){ openDialog(); return; }
    if(!t.url) return;
    currentTool = t;
    $('frame-cover').style.backgroundImage = 'url("' + IMAGES[t.id] + '")';
    frame.classList.remove('loaded'); frame.classList.add('active');
    inside.classList.remove('active');
    iframe.src = t.url;
    $('btn-back').hidden = false; $('btn-ext').hidden = false; $('btn-ext').href = t.url;
    placeControls(openRect());
  }
  iframe.addEventListener('load', function(){ if(currentTool && iframe.src.indexOf('about:blank') === -1) frame.classList.add('loaded'); });
  function backToTiles(){
    currentTool = null; iframe.src = 'about:blank';
    frame.classList.remove('active','loaded'); inside.classList.add('active');
    $('btn-back').hidden = true; $('btn-ext').hidden = true;
    placeControls(openRect());
  }

  /* restricted dialog (Het Gebouw) */
  var dialog = $('dialog'), dlgInput = $('dlg-input'), dlgErr = $('dlg-err');
  function openDialog(){ dlgInput.value=''; dlgErr.classList.remove('show'); dialog.classList.add('open'); setTimeout(function(){ dlgInput.focus(); }, 100); }
  function closeDialog(){ dialog.classList.remove('open'); }
  function tryCode(){ dlgErr.classList.add('show'); dlgInput.value=''; dlgInput.focus(); }
  $('dlg-close').addEventListener('click', closeDialog);
  $('dlg-submit').addEventListener('click', tryCode);
  dlgInput.addEventListener('keydown', function(e){ if(e.key === 'Enter') tryCode(); });
  dialog.addEventListener('click', function(e){ if(e.target === dialog) closeDialog(); });

  document.addEventListener('keydown', function(e){
    if(e.key !== 'Escape') return;
    if(dialog.classList.contains('open')) closeDialog();
    else if(expanded && currentTool) backToTiles();
    else if(expanded) closeBox();
  });
})();
