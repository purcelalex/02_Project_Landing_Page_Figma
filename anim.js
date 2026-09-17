/* Animated AI-automation "video" — pure canvas, no external assets.
   ~20s looping timeline: flowing data streams, pulsing AI core, network
   nodes/packets, cycling motivational lines, and an optional ambient synth. */
(function () {
  var wrap = document.getElementById('autoAnim');
  if (!wrap) return;

  var canvas = wrap.querySelector('.aa-canvas');
  var ctx = canvas.getContext('2d');
  var lines = Array.prototype.slice.call(wrap.querySelectorAll('.aa-line'));
  var bar = wrap.querySelector('.aa-bar');
  var timeEl = wrap.querySelector('.aa-time');
  var playBtn = wrap.querySelector('.aa-play');
  var soundBtn = wrap.querySelector('.aa-sound');

  var LOOP = 20000; // 20 seconds
  var W = 0, H = 0, DPR = 1;
  var elapsed = 0, last = 0, playing = true, curLine = -1;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var COLORS = ['#19B5F1', '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#22D3EE'];

  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    var r = canvas.getBoundingClientRect();
    W = r.width; H = r.height;
    canvas.width = Math.max(1, Math.round(W * DPR));
    canvas.height = Math.max(1, Math.round(H * DPR));
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  window.addEventListener('resize', resize);

  // Streams fan out from a focal point (right) toward the upper-left.
  var streams = [];
  for (var i = 0; i < 26; i++) {
    var s = (i / 25 - 0.5);
    streams.push({
      exf: 0.02 + Math.random() * 0.42,
      eyf: 0.5 + s * 1.15,
      bow: s,
      color: COLORS[i % COLORS.length],
      speed: 0.5 + Math.random() * 0.9,
      dots: 2 + (i % 3),
      phase: Math.random()
    });
  }

  // Network nodes scattered across the left/upper field.
  var nodePos = [
    [0.12, 0.30], [0.24, 0.55], [0.18, 0.78], [0.34, 0.38],
    [0.30, 0.72], [0.44, 0.58], [0.40, 0.24], [0.52, 0.44],
    [0.58, 0.70], [0.50, 0.86]
  ];
  var edges = [[0,3],[3,6],[3,1],[1,4],[4,2],[1,5],[5,7],[7,6],[5,8],[8,9],[4,8],[7,9]];

  // Drifting particles / bits.
  var bits = [];
  for (var b = 0; b < 34; b++) {
    bits.push({ x: Math.random(), y: Math.random(), sp: 0.2 + Math.random() * 0.6,
      sz: Math.random() < 0.5 ? 1 : 2, a: 0.2 + Math.random() * 0.5 });
  }

  function bez(t, p0, p1, p2, p3) {
    var u = 1 - t;
    return u*u*u*p0 + 3*u*u*t*p1 + 3*u*t*t*p2 + t*t*t*p3;
  }

  function draw(now) {
    var fx = W * 0.80, fy = H * 0.62;
    ctx.clearRect(0, 0, W, H);

    // faint perspective grid
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(90,130,220,0.06)';
    ctx.beginPath();
    for (var gx = 0; gx <= W; gx += W / 16) { ctx.moveTo(gx, 0); ctx.lineTo(gx, H); }
    for (var gy = 0; gy <= H; gy += H / 9) { ctx.moveTo(0, gy); ctx.lineTo(W, gy); }
    ctx.stroke();

    ctx.globalCompositeOperation = 'lighter';

    // streams
    for (var i = 0; i < streams.length; i++) {
      var st = streams[i];
      var ex = W * st.exf, ey = H * st.eyf;
      var c1x = fx - W * 0.22, c1y = fy - st.bow * H * 0.06;
      var c2x = ex + W * 0.18, c2y = ey + H * 0.04;
      // curve
      ctx.beginPath();
      ctx.moveTo(fx, fy);
      ctx.bezierCurveTo(c1x, c1y, c2x, c2y, ex, ey);
      ctx.strokeStyle = st.color;
      ctx.globalAlpha = 0.14;
      ctx.lineWidth = 1.2;
      ctx.stroke();
      // travelling glow dots
      ctx.globalAlpha = 1;
      for (var d = 0; d < st.dots; d++) {
        var t = (now * 0.00004 * st.speed + st.phase + d / st.dots) % 1;
        var px = bez(t, fx, c1x, c2x, ex);
        var py = bez(t, fy, c1y, c2y, ey);
        var rad = 2.6 * (1 - t) + 0.6;
        var g = ctx.createRadialGradient(px, py, 0, px, py, rad * 5);
        g.addColorStop(0, st.color);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.globalAlpha = 0.9 * (1 - t) + 0.1;
        ctx.beginPath(); ctx.arc(px, py, rad * 5, 0, 6.283); ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    // node connections
    ctx.lineWidth = 1;
    for (var e = 0; e < edges.length; e++) {
      var a = nodePos[edges[e][0]], c = nodePos[edges[e][1]];
      ctx.strokeStyle = 'rgba(120,160,255,0.16)';
      ctx.beginPath();
      ctx.moveTo(a[0]*W, a[1]*H); ctx.lineTo(c[0]*W, c[1]*H); ctx.stroke();
      // packet along edge
      var pt = (now * 0.00012 + e * 0.13) % 1;
      var mx = a[0]*W + (c[0]-a[0])*W*pt, my = a[1]*H + (c[1]-a[1])*H*pt;
      ctx.fillStyle = '#8fd6ff';
      ctx.globalAlpha = 0.8;
      ctx.beginPath(); ctx.arc(mx, my, 1.8, 0, 6.283); ctx.fill();
      ctx.globalAlpha = 1;
    }
    // nodes
    for (var n = 0; n < nodePos.length; n++) {
      var nx = nodePos[n][0]*W, ny = nodePos[n][1]*H;
      var pulse = 3 + Math.sin(now * 0.003 + n) * 1.4;
      var ng = ctx.createRadialGradient(nx, ny, 0, nx, ny, pulse * 4);
      ng.addColorStop(0, 'rgba(120,190,255,0.9)');
      ng.addColorStop(1, 'rgba(120,190,255,0)');
      ctx.fillStyle = ng;
      ctx.beginPath(); ctx.arc(nx, ny, pulse * 4, 0, 6.283); ctx.fill();
      ctx.fillStyle = '#dff1ff';
      ctx.beginPath(); ctx.arc(nx, ny, 2, 0, 6.283); ctx.fill();
    }

    // drifting bits
    for (var k = 0; k < bits.length; k++) {
      var bt = bits[k];
      var bx = (bt.x - now * 0.00002 * bt.sp) % 1; if (bx < 0) bx += 1;
      var by = (bt.y - now * 0.00003 * bt.sp) % 1; if (by < 0) by += 1;
      ctx.fillStyle = 'rgba(150,190,255,' + bt.a + ')';
      ctx.fillRect(bx * W, by * H, bt.sz, bt.sz);
    }

    // central AI core
    var corePulse = 1 + Math.sin(now * 0.0025) * 0.12;
    var halo = ctx.createRadialGradient(fx, fy, 0, fx, fy, 90 * corePulse);
    halo.addColorStop(0, 'rgba(80,150,255,0.35)');
    halo.addColorStop(1, 'rgba(80,150,255,0)');
    ctx.fillStyle = halo;
    ctx.beginPath(); ctx.arc(fx, fy, 90 * corePulse, 0, 6.283); ctx.fill();
    for (var ring = 0; ring < 3; ring++) {
      ctx.globalAlpha = 0.5 - ring * 0.12;
      ctx.strokeStyle = ['#19B5F1', '#8B5CF6', '#EC4899'][ring];
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(fx, fy, (16 + ring * 12) * corePulse, now * 0.0006 * (ring % 2 ? 1 : -1),
        now * 0.0006 * (ring % 2 ? 1 : -1) + 4.6);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#eaf4ff';
    ctx.beginPath(); ctx.arc(fx, fy, 5 * corePulse, 0, 6.283); ctx.fill();

    ctx.globalCompositeOperation = 'source-over';
  }

  function setLine(idx) {
    if (idx === curLine) return;
    curLine = idx;
    for (var i = 0; i < lines.length; i++) lines[i].classList.toggle('active', i === idx);
  }

  function fmt(ms) {
    var s = Math.floor(ms / 1000);
    return '0:' + (s < 10 ? '0' + s : s);
  }

  function frame(now) {
    if (!last) last = now;
    var dt = now - last; last = now;
    if (playing) elapsed = (elapsed + dt) % LOOP;

    draw(reduce ? LOOP * 0.3 : elapsed);

    var p = elapsed / LOOP;
    bar.style.width = (p * 100).toFixed(2) + '%';
    timeEl.textContent = fmt(elapsed) + ' / 0:20';
    setLine(Math.min(lines.length - 1, Math.floor(p * lines.length)));

    requestAnimationFrame(frame);
  }

  playBtn.addEventListener('click', function () {
    playing = !playing;
    playBtn.innerHTML = playing ? '&#10074;&#10074;' : '&#9658;';
  });

  /* ---- optional uplifting synth: pad + bass + melodic arpeggio ---- */
  var actx = null, master = null, filter = null, delaySend = null, soundOn = false;
  var schedTimer = null, step = 0, nextTime = 0;
  var STEP = 0.3333; // eighth note @ ~90 BPM

  // I–V–vi–IV in C: C  G  Am  F  (the "uplifting" progression)
  var CHORDS = [[60,64,67],[55,59,62],[57,60,64],[53,57,60]];
  var BASS = [36, 31, 33, 29];
  // 32-step melody in C major pentatonic — a flowing, rising arpeggio (null = rest)
  var MEL = [76,79,81,79, 76,74,76,null,  74,76,79,81, 79,76,74,null,
             76,79,81,84, 81,79,76,null,  81,79,76,74, 76,79,81,null];

  function m2f(m) { return 440 * Math.pow(2, (m - 69) / 12); }

  function pluck(midi, t) {
    if (midi == null) return;
    var o = actx.createOscillator(); o.type = 'triangle'; o.frequency.value = m2f(midi);
    var g = actx.createGain(); g.gain.value = 0.0001;
    o.connect(g); g.connect(filter); g.connect(delaySend);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.16, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
    o.start(t); o.stop(t + 0.55);
  }
  function bass(midi, t, dur) {
    var o = actx.createOscillator(); o.type = 'sine'; o.frequency.value = m2f(midi);
    var g = actx.createGain(); g.gain.value = 0.0001;
    o.connect(g); g.connect(filter);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.16, t + 0.04);
    g.gain.setValueAtTime(0.16, t + dur - 0.12);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.start(t); o.stop(t + dur + 0.05);
  }
  function pad(chord, t, dur) {
    chord.forEach(function (m) {
      var o = actx.createOscillator(); o.type = 'sine'; o.frequency.value = m2f(m + 12);
      var g = actx.createGain(); g.gain.value = 0.0001;
      o.connect(g); g.connect(filter); g.connect(delaySend);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.045, t + 0.45);
      g.gain.setValueAtTime(0.045, t + dur - 0.5);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.start(t); o.stop(t + dur + 0.05);
    });
  }
  function scheduler() {
    while (nextTime < actx.currentTime + 0.15) {
      var s = step % 32, chord = Math.floor(s / 8);
      if (s % 8 === 0) {                 // new chord every 8 eighths (4 beats)
        pad(CHORDS[chord], nextTime, STEP * 8);
        bass(BASS[chord], nextTime, STEP * 8);
      }
      pluck(MEL[s], nextTime);
      nextTime += STEP; step++;
    }
  }
  function startAudio() {
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    actx = new AC();
    master = actx.createGain();
    master.gain.setValueAtTime(0.0001, actx.currentTime);
    master.gain.exponentialRampToValueAtTime(0.55, actx.currentTime + 2);
    filter = actx.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = 2600;
    filter.connect(master);
    // feedback delay for a little shimmer/space
    var delay = actx.createDelay(); delay.delayTime.value = STEP * 1.5;
    var fb = actx.createGain(); fb.gain.value = 0.30;
    var wet = actx.createGain(); wet.gain.value = 0.32;
    delaySend = actx.createGain(); delaySend.gain.value = 0.5;
    delaySend.connect(delay); delay.connect(fb); fb.connect(delay); delay.connect(wet); wet.connect(master);
    master.connect(actx.destination);
    step = 0; nextTime = actx.currentTime + 0.12;
    scheduler();
    schedTimer = setInterval(scheduler, 25);
  }
  function stopAudio() {
    if (!actx) return;
    if (schedTimer) { clearInterval(schedTimer); schedTimer = null; }
    try { master.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + 0.7); } catch (e) {}
    var a = actx; actx = null;
    setTimeout(function () { try { a.close(); } catch (e) {} }, 900);
  }
  soundBtn.addEventListener('click', function () {
    soundOn = !soundOn;
    if (soundOn) { startAudio(); soundBtn.innerHTML = '&#128266;'; soundBtn.title = 'Mute'; }
    else { stopAudio(); soundBtn.innerHTML = '&#128263;'; soundBtn.title = 'Enable ambient sound'; }
  });

  resize();
  requestAnimationFrame(frame);
})();
