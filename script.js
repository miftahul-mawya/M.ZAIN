/* =====================================================
   Mohammad Zain — shared scripts (no external libraries)
   ===================================================== */
(() => {
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const body = document.body;
const page = body.dataset.page || 'home';
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

/* ===== 0. Inject nav + footer so every page stays in sync ===== */
const LINKS = [
  ['Home', '#/home', 'home'], ['Ride', '#/home/ride', ''], ['Gym', '#/home/gym', ''], ['Pets', '#/home/family', ''], ['Video', '#/home/videos', ''],
  ['Fishing', '#/fishing', 'fishing'], ['Boxing', '#/boxing', 'boxing'],
  ['Snow', '#/snow', 'snow'], ['Sydney', '#/sydney', 'sydney']
];
const linkHtml = LINKS.map(([t, h, k]) => `<a href="${h}" data-k="${k}" class="${k && k === page ? 'on' : ''}">${t}</a>`).join('');
body.insertAdjacentHTML('afterbegin',
  `<div id="loader"><span>M . Z A I N</span></div><div id="progress"></div><div id="cursor"></div><canvas id="bg"></canvas>
   <nav><b><a href="#/home">M. ZAIN</a></b><button id="burger" aria-label="Menu">MENU</button><div class="links">${linkHtml}</div></nav>`);
body.insertAdjacentHTML('beforeend',
  `<footer><div class="fl">${LINKS.map(([t, h]) => `<a href="${h}">${t}</a>`).join('')}</div>© 2026 MOHAMMAD ZAIN · MELBOURNE, AUSTRALIA</footer>
   <div id="lightbox"><img alt=""><p></p><small>← → to browse · ESC to close</small></div>`);
const nav = $('nav');
$('#burger').addEventListener('click', () => { nav.classList.toggle('open'); $('#burger').textContent = nav.classList.contains('open') ? 'CLOSE' : 'MENU'; });
$$('nav .links a').forEach(a => a.addEventListener('click', () => { nav.classList.remove('open'); $('#burger').textContent = 'MENU'; }));

/* ===== 1. Shared pointer + scroll state ===== */
let sy = window.scrollY, mx = 0, my = 0;
addEventListener('scroll', () => { sy = window.scrollY; }, { passive: true });
addEventListener('mousemove', e => { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; });

/* ===== 2. 3D background: starfield + wireframe solids (snow page = snowfall) ===== */
(function background() {
  const c = $('#bg'), x = c.getContext('2d');
  let acc = '125,249,255', snow = false;
  window.__setTheme = () => { acc = getComputedStyle(body).getPropertyValue('--accent-rgb').trim() || '125,249,255'; snow = body.dataset.theme === 'snow'; };
  window.__setTheme();
  let W, H, dpr;
  function size() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight;
    c.width = W * dpr; c.height = H * dpr; x.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  addEventListener('resize', size); size();

  const stars = Array.from({ length: 220 }, () => ({ x: Math.random(), y: Math.random(), z: .2 + Math.random() * .8, p: Math.random() * 6.28 }));
  const cube = { v: [[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]], e: [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]] };
  const octa = { v: [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]], e: [[0,2],[0,3],[0,4],[0,5],[1,2],[1,3],[1,4],[1,5],[2,4],[2,5],[3,4],[3,5]] };
  const shapes = Array.from({ length: 8 }, (_, i) => ({
    g: i % 2 ? cube : octa, x: Math.random(), y: Math.random(), s: 26 + Math.random() * 46,
    d: .15 + Math.random() * .5, a: Math.random() * 6, b: Math.random() * 6, r: .2 + Math.random() * .5
  }));

  function wire(s, t) {
    const a = s.a + t * s.r, b = s.b + t * s.r * .7, ca = Math.cos(a), sa = Math.sin(a), cb = Math.cos(b), sb = Math.sin(b);
    const px = s.x * W + mx * s.d * 120, py = (((s.y * H - sy * s.d * .6) % (H + 200)) + H + 200) % (H + 200) - 100;
    const pts = s.g.v.map(([vx, vy, vz]) => {
      let y1 = vy * ca - vz * sa, z1 = vy * sa + vz * ca;
      let x2 = vx * cb + z1 * sb, z2 = -vx * sb + z1 * cb;
      const k = 1 / (1 + z2 * .18);
      return [px + x2 * s.s * k, py + y1 * s.s * k];
    });
    x.beginPath();
    s.g.e.forEach(([i, j]) => { x.moveTo(pts[i][0], pts[i][1]); x.lineTo(pts[j][0], pts[j][1]); });
    x.stroke();
  }

  let t0 = performance.now();
  (function frame(now) {
    const t = (now - t0) / 1000;
    x.clearRect(0, 0, W, H);
    if (snow) {
      x.fillStyle = 'rgba(235,245,255,.85)';
      stars.forEach(s => {
        s.y += .0007 + s.z * .0016; s.p += .01;
        if (s.y > 1.02) { s.y = -.02; s.x = Math.random(); }
        const px = (s.x + Math.sin(s.p) * .012) * W + mx * s.z * 40, py = ((s.y * H - sy * s.z * .15) % H + H) % H;
        x.beginPath(); x.arc(px, py, .8 + s.z * 2.6, 0, 6.283); x.fill();
      });
    } else {
      stars.forEach(s => {
        const px = s.x * W + mx * s.z * 50, py = ((s.y * H - sy * s.z * .35) % H + H) % H;
        x.globalAlpha = .35 + .65 * (.5 + .5 * Math.sin(t * 1.5 + s.p));
        x.fillStyle = '#fff'; x.fillRect(px, py, s.z * 1.8, s.z * 1.8);
      });
      x.globalAlpha = .38; x.lineWidth = 1;
      shapes.forEach((s, i) => { x.strokeStyle = i % 2 ? `rgb(${acc})` : '#fff'; wire(s, t); });
      x.globalAlpha = 1;
    }
    requestAnimationFrame(frame);
  })(t0);
})();

/* ===== 3. Progress bar, reveal, tilt, cursor glow ===== */
const bar = $('#progress');
function prog() { bar.style.width = (sy / ((document.documentElement.scrollHeight - innerHeight) || 1)) * 100 + '%'; }
addEventListener('scroll', prog, { passive: true }); prog();

const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && e.target.classList.add('in')), { threshold: .12 });
$$('.reveal').forEach(el => io.observe(el));

$$('[data-tilt]').forEach(c => {
  c.addEventListener('mousemove', e => {
    const r = c.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
    c.style.transform = `perspective(800px) rotateY(${px * 14}deg) rotateX(${-py * 14}deg) scale(1.03)`;
  });
  c.addEventListener('mouseleave', () => c.style.transform = '');
});

const cursor = $('#cursor');
addEventListener('mousemove', e => { cursor.style.left = e.clientX + 'px'; cursor.style.top = e.clientY + 'px'; });

/* soft parallax for [data-speed] */
const para = $$('[data-speed]');
function doPara() { para.forEach(el => { const r = el.parentElement.getBoundingClientRect(); el.style.transform = `translateY(${(r.top + r.height / 2 - innerHeight / 2) * parseFloat(el.dataset.speed)}px)`; }); }
if (para.length) { addEventListener('scroll', doPara, { passive: true }); doPara(); }

/* ===== 4. Lightbox with prev / next ===== */
const lb = $('#lightbox'), lbImg = $('img', lb), lbCap = $('p', lb);
let lbList = [], lbI = 0;
function lbShow() {
  const el = lbList[lbI];
  lbImg.src = el.dataset.src || $('img', el).src;
  lbCap.textContent = (el.dataset.cap || '').toUpperCase();
}
$$('[data-lb],.food').forEach(el => el.addEventListener('click', () => {
  lbList = $$('[data-lb],.food').filter(n => n.closest('section') === el.closest('section'));
  lbI = lbList.indexOf(el); lbShow(); lb.classList.add('open');
}));
lb.addEventListener('click', () => lb.classList.remove('open'));
addEventListener('keydown', e => {
  if (e.key === 'Escape') lb.classList.remove('open');
  if (!lb.classList.contains('open')) return;
  if (e.key === 'ArrowRight') { lbI = (lbI + 1) % lbList.length; lbShow(); }
  if (e.key === 'ArrowLeft') { lbI = (lbI - 1 + lbList.length) % lbList.length; lbShow(); }
});

/* ===== 5. 3D photo rings — they spin as you scroll the mouse wheel ===== */
const rings = $$('.pin').map(pin => {
  const ring = $('.ring', pin), panels = $$('.panel', ring), n = panels.length, step = 360 / n;
  const cap = $('.ring-cap', pin), dots = $('.dots', pin);
  if (dots) dots.innerHTML = panels.map(() => '<i></i>').join('');
  const st = { cur: 0, target: 0, idx: -1, R: 0 };
  function layout() {
    const w = ring.offsetWidth;
    st.R = Math.round(w / 2 / Math.tan(Math.PI / n) + w * .5);
    panels.forEach((p, i) => p.style.transform = `rotateY(${i * step}deg) translateZ(${st.R}px)`);
  }
  addEventListener('resize', layout); layout();
  return { pin, ring, panels, n, step, cap, dots, st, layout };
});
function ringFrame(t) {
  rings.forEach(({ pin, ring, panels, n, step, cap, dots, st }) => {
    if (!pin.offsetParent) return;
    const r = pin.getBoundingClientRect();
    if (r.bottom < -100 || r.top > innerHeight + 100) return;
    const p = clamp(-r.top / ((r.height - innerHeight) || 1), 0, 1);
    st.target = p * (360 - step);
    st.cur += (st.target - st.cur) * .09;
    const tiltX = -5 + Math.sin(t / 1400) * 1.6 - my * 9, tiltY = mx * 12;
    ring.style.transform = `translateZ(${-st.R}px) rotateX(${tiltX}deg) rotateY(${-st.cur + tiltY}deg)`;
    const idx = ((Math.round(st.cur / step) % n) + n) % n;
    if (idx !== st.idx) {
      st.idx = idx;
      if (dots) $$('i', dots).forEach((d, i) => d.classList.toggle('on', i === idx));
      if (cap) { cap.style.opacity = 0; setTimeout(() => { cap.innerHTML = `<b>${String(idx + 1).padStart(2, '0')}</b> / ${String(n).padStart(2, '0')} — ${panels[idx].dataset.cap || ''}`; cap.style.opacity = 1; }, 160); }
    }
    const bg = $('.pin-bg', pin);
    if (bg) bg.style.transform = `translateX(${(-p * 14 + 7) * 1}vw)`;
  });
  requestAnimationFrame(ringFrame);
}
if (rings.length) requestAnimationFrame(ringFrame);

/* ===== 6. Videos — real sound, one at a time ===== */
const eq = $('#eq');
if (eq) for (let i = 0; i < 24; i++) {
  const b = document.createElement('i');
  b.style.animationDelay = (Math.random() * .8).toFixed(2) + 's';
  b.style.animationDuration = (.6 + Math.random() * .8).toFixed(2) + 's';
  eq.appendChild(b);
}
if (eq) eq.classList.add('paused');
const vids = $$('.vcard video');
const siteAudio = $('#siteAudio');
const cornerPlayer = $('#cornerPlayer'), musicOrb = $('#musicOrb'), closePlayer = $('#closePlayer');
musicOrb?.addEventListener('click', () => cornerPlayer?.classList.add('open'));
closePlayer?.addEventListener('click', () => cornerPlayer?.classList.remove('open'));
const trackButtons = $$('[data-track]');
function playTrack(key){
  if(!siteAudio || !V[key]) return;
  if(siteAudio.dataset.track!==key){
    siteAudio.src = V[key];
    siteAudio.dataset.track = key;
  }
  vids.forEach(v=>v.pause());
  siteAudio.play();
  trackButtons.forEach(b=>b.classList.toggle('on',b.dataset.track===key));
}
trackButtons.forEach(b=>b.addEventListener('click',()=>playTrack(b.dataset.track)));
siteAudio?.addEventListener('ended',()=>trackButtons.forEach(b=>b.classList.remove('on')));
vids.forEach(v => {
  const card = v.closest('.vcard'), btn = $('.vplay', card);
  v.muted = false; v.volume = 1;
  const start = () => { v.muted = false; v.volume = 1; const pr = v.play(); if (pr && pr.catch) pr.catch(() => { v.controls = true; }); };
  btn.addEventListener('click', start);
  v.addEventListener('play', () => {
    if(siteAudio) siteAudio.pause(); trackButtons.forEach(b=>b.classList.remove('on'));
    card.classList.add('started', 'playing'); v.controls = true;
    vids.forEach(o => { if (o !== v) o.pause(); });
    if (eq) eq.classList.remove('paused');
  });
  const stop = () => { card.classList.remove('playing'); if (eq && vids.every(o => o.paused)) eq.classList.add('paused'); };
  v.addEventListener('pause', stop); v.addEventListener('ended', () => { stop(); card.classList.remove('started'); v.controls = false; });
  v.addEventListener('error', () => card.classList.add('err'));
  const lastSrc = $$('source', v).pop(); if (lastSrc) lastSrc.addEventListener('error', () => card.classList.add('err'));
});


/* ===== 6b. Tiny hash router: every "page" lives in this one file ===== */
const pages = $$('.page'); let curPage = null;
function route() {
  const parts = location.hash.replace(/^#\/?/, '').split('/');
  const name = pages.some(p => p.id === 'page-' + parts[0]) ? parts[0] : 'home', anchor = parts[1];
  if (name !== curPage) {
    pages.forEach(p => p.classList.toggle('active', p.id === 'page-' + name));
    curPage = name; body.dataset.page = name; body.dataset.theme = name; window.__setTheme();
    $$('nav .links a').forEach(a => a.classList.toggle('on', a.dataset.k === name));
    window.scrollTo({ top: 0, behavior: 'instant' }); sy = 0;
    rings.forEach(r => r.layout()); prog();
  }
  nav.classList.remove('open'); $('#burger').textContent = 'MENU';
  const el = anchor && document.getElementById(anchor);
  if (el) setTimeout(() => window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY, behavior: 'smooth' }), 60);
}
addEventListener('hashchange', route); route();

/* ===== 7. Hide loader ===== */
const hide = () => setTimeout(() => $('#loader').classList.add('done'), 500);
if (document.readyState === 'complete') hide(); else addEventListener('load', hide);
setTimeout(() => $('#loader').classList.add('done'), 3500);
})();



/* water ripples that follow the mouse / finger */
(() => {
  const c = document.getElementById('ripples'), x = c.getContext('2d'); let W, H, rip = [], last = 0;
  const size = () => { W = c.width = innerWidth; H = c.height = innerHeight; }; addEventListener('resize', size); size();
  function add(px, py, big) { rip.push({ x: px, y: py, r: 2, a: big ? .8 : .45, v: big ? 2.2 : 1.4 }); }
  addEventListener('mousemove', e => { const n = performance.now(); if (n - last > 90) { add(e.clientX, e.clientY); last = n; } });
  addEventListener('touchmove', e => { const t = e.touches[0], n = performance.now(); if (n - last > 90) { add(t.clientX, t.clientY); last = n; } }, { passive: true });
  addEventListener('click', e => add(e.clientX, e.clientY, true));
  (function f() {
    x.clearRect(0, 0, W, H); x.lineWidth = 1.5;
    rip = rip.filter(r => r.a > .01);
    rip.forEach(r => { r.r += r.v; r.a *= .965; x.strokeStyle = `rgba(94,234,212,${r.a})`; x.beginPath(); x.ellipse(r.x, r.y, r.r, r.r * .45, 0, 0, 6.283); x.stroke(); });
    requestAnimationFrame(f);
  })();
})();


/* click-to-punch */
(() => {
  const hit = document.getElementById('hit'), cnt = document.getElementById('cnt'); let n = 0;
  const words = ['POW!', 'JAB!', 'HOOK!', 'BAM!', 'CROSS!'];
  hit.addEventListener('click', e => {
    cnt.textContent = ++n; hit.classList.remove('shake'); void hit.offsetWidth; hit.classList.add('shake');
    const p = document.createElement('div'); p.className = 'pow'; p.textContent = words[n % words.length];
    p.style.left = e.clientX - 24 + 'px'; p.style.top = e.clientY - 20 + 'px'; document.body.appendChild(p); setTimeout(() => p.remove(), 700);
  });
})();
/* rotating lines */
(() => {
  const L = ['Discipline beats motivation.', 'Hit hard. Stay humble.', 'Sweat now, shine later.', 'Be the calm in the storm.', 'One more round. Always.'], el = document.getElementById('rot'); let i = 0;
  setInterval(() => { el.style.opacity = 0; setTimeout(() => { el.textContent = L[i = (i + 1) % L.length]; el.style.opacity = 1; }, 400); }, 3200);
  el.style.transition = 'opacity .4s';
})();
/* round timer */
(() => {
  const box = document.getElementById('timer'), tt = document.getElementById('tt'), tm = document.getElementById('tm'), bs = document.getElementById('ts'), br = document.getElementById('tr');
  let round = 1, rest = false, left = 180, id = null, ac;
  const fmt = s => Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
  function beep(f, d) { try { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); const o = ac.createOscillator(), g = ac.createGain(); o.frequency.value = f; o.connect(g); g.connect(ac.destination); g.gain.setValueAtTime(.2, ac.currentTime); g.gain.exponentialRampToValueAtTime(.001, ac.currentTime + d); o.start(); o.stop(ac.currentTime + d); } catch (e) {} }
  function draw() { tt.textContent = fmt(left); tm.textContent = rest ? 'Rest' : 'Round ' + round + ' · Fight'; box.classList.toggle('rest', rest); }
  function tick() {
    if (--left <= 0) { if (rest) { rest = false; round++; left = 180; } else { rest = true; left = 60; } beep(rest ? 520 : 880, .8); }
    draw();
  }
  bs.addEventListener('click', () => { if (id) { clearInterval(id); id = null; bs.textContent = 'Resume'; } else { id = setInterval(tick, 1000); bs.textContent = 'Pause'; beep(880, .5); } });
  br.addEventListener('click', () => { clearInterval(id); id = null; round = 1; rest = false; left = 180; bs.textContent = 'Start'; draw(); });
  draw();
})();

/* Dimensional pointer response is only active for a mouse and stops during playback. */
(() => {
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 document.querySelectorAll('[data-film]').forEach(card=>{
  const reset=()=>{card.style.setProperty('--rx','0deg');card.style.setProperty('--ry','0deg');};
  card.addEventListener('pointermove',e=>{
   if(e.pointerType!=='mouse'||reduced.matches||card.classList.contains('playing'))return;
   const r=card.getBoundingClientRect();
   card.style.setProperty('--rx',((.5-(e.clientY-r.top)/r.height)*5).toFixed(2)+'deg');
   card.style.setProperty('--ry',(((e.clientX-r.left)/r.width-.5)*7).toFixed(2)+'deg');
  });
  card.addEventListener('pointerleave',reset);
  card.querySelector('video').addEventListener('play',reset);
 });
})();
