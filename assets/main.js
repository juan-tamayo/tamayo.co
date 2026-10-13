document.documentElement.classList.add('js');
const root = document.documentElement, mq = matchMedia('(prefers-color-scheme: dark)');
const pageLang = (root.lang || 'en').slice(0, 2);
const ui = pageLang === 'es' ? {
  themeLight: 'Cambiar a modo claro',
  themeDark: 'Cambiar a modo oscuro',
  localForm: 'Vista previa local: los mensajes se envían cuando el sitio está publicado en Netlify.'
} : {
  themeLight: 'Switch to light mode',
  themeDark: 'Switch to dark mode',
  localForm: 'Local preview: messages are sent once deployed on Netlify.'
};
document.querySelectorAll('[data-lang]').forEach(link => {
  link.addEventListener('click', () => { try { localStorage.setItem('tamayo-lang', link.dataset.lang); } catch {} });
});
const origins = document.querySelector('.origins');
if (origins) {
  const closeOrigins = () => origins.setAttribute('aria-expanded', 'false');
  origins.addEventListener('click', event => {
    event.stopPropagation();
    origins.setAttribute('aria-expanded', String(origins.getAttribute('aria-expanded') !== 'true'));
  });
  document.addEventListener('click', closeOrigins);
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeOrigins(); });
}
const isDark = () => (root.dataset.theme || (mq.matches ? 'dark' : 'light')) === 'dark';
const syncTheme = () => { root.dataset.mode = isDark() ? 'dark' : 'light'; const b = document.getElementById('theme'); if (b) b.setAttribute('aria-label', isDark() ? ui.themeLight : ui.themeDark); };
syncTheme(); mq.addEventListener('change', syncTheme);
document.getElementById('theme')?.addEventListener('click', () => { root.dataset.theme = isDark() ? 'light' : 'dark'; try { localStorage.setItem('theme', root.dataset.theme); } catch {} syncTheme(); });
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  const el = e.target, sibs = [...el.parentElement.children].filter(c => c.classList.contains('reveal'));
  el.style.transitionDelay = Math.min(sibs.indexOf(el), 4) * 80 + 'ms';
  el.classList.add('seen'); io.unobserve(el);
  const n = el.querySelector('[data-count]');
  if (n && !reduce) { const t = +n.dataset.count, s = performance.now();
    const f = now => { const p = Math.min((now - s) / 1200, 1); n.textContent = Math.round(t * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(f); };
    requestAnimationFrame(f); }
}), { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));
// subtle parallax on the hero portrait
const photo = document.querySelector('.hero-photo');
if (photo && !reduce) addEventListener('scroll', () => {
  const y = scrollY; if (y < innerHeight) photo.style.translate = `0 ${y * 0.18}px`;
}, { passive: true });
// highlight the dock item for the section in view
const links = [...document.querySelectorAll('.dock a[href^="#"]')];
const spy = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id)); }), { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('main [id]').forEach(s => spy.observe(s));

/* ---------- neural network background ---------- */
(() => {
  const c = document.getElementById('net'); if (!c) return;
  const x = c.getContext('2d'); let W, H, pts = [], dpr = Math.min(devicePixelRatio, 2), mx = -1e4, my = -1e4, run = true;
  const size = () => { W = c.clientWidth; H = c.clientHeight; c.width = W * dpr; c.height = H * dpr; x.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.round(Math.min(90, W * H / 16000)); pts = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .3, vy: (Math.random() - .5) * .3 })); };
  size(); addEventListener('resize', size);
  c.parentElement.addEventListener('pointermove', e => { const r = c.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; });
  new IntersectionObserver(([e]) => run = e.isIntersecting).observe(c);
  const draw = () => {
    x.clearRect(0, 0, W, H);
    for (const p of pts) { if (!reduce && run) { p.x += p.vx; p.y += p.vy; if (p.x < 0 || p.x > W) p.vx *= -1; if (p.y < 0 || p.y > H) p.vy *= -1; } }
    for (let i = 0; i < pts.length; i++) { const a = pts[i];
      for (let j = i + 1; j < pts.length; j++) { const b = pts[j], d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 140) { x.strokeStyle = `rgba(${isDark() ? '241,236,227' : '22,21,20'},${(1 - d / 140) * (isDark() ? .22 : .3)})`; x.lineWidth = 1; x.beginPath(); x.moveTo(a.x, a.y); x.lineTo(b.x, b.y); x.stroke(); } }
      const dm = Math.hypot(a.x - mx, a.y - my);
      if (dm < 180) { x.strokeStyle = `rgba(224,83,31,${(1 - dm / 180) * .7})`; x.beginPath(); x.moveTo(a.x, a.y); x.lineTo(mx, my); x.stroke(); }
      x.fillStyle = i % 7 ? (isDark() ? '#8a847d' : '#3a3633') : '#e0531f'; x.beginPath(); x.arc(a.x, a.y, 1.8, 0, 7); x.fill(); }
    if (!reduce) requestAnimationFrame(draw);
  };
  draw();
})();

/* ---------- rigid layered parallax portrait (no warping) ---------- */
(() => {
  const ph = document.querySelector('.hero-photo'), hero = document.querySelector('.hero'), title = document.querySelector('.hero-title');
  if (!ph || reduce) return;
  let tx = 0, ty = 0, cx = 0, cy = 0; const t0 = performance.now();
  addEventListener('pointermove', e => { tx = e.clientX / innerWidth - .5; ty = e.clientY / innerHeight - .5; }, { passive: true });
  const loop = now => { const t = (now - t0) / 1000;
    cx += (tx - cx) * .06; cy += (ty - cy) * .06;
    const fy = Math.sin(t * 1.1) * 6, fx = Math.sin(t * .55) * 4, rot = Math.sin(t * .7) * 1.1 + cx * 2;
    ph.style.setProperty('--px', (cx * 26 + fx).toFixed(2) + 'px'); ph.style.setProperty('--py', (cy * 14 + fy).toFixed(2) + 'px'); ph.style.setProperty('--rot', rot.toFixed(3) + 'deg');
    hero.style.setProperty('--gx', (-cx * 40).toFixed(1) + 'px'); hero.style.setProperty('--gy', (-cy * 24 - fy * .5).toFixed(1) + 'px');
    title.style.setProperty('--tx', (-cx * 18).toFixed(1) + 'px'); title.style.setProperty('--ty', (-cy * 10).toFixed(1) + 'px');
    requestAnimationFrame(loop); };
  requestAnimationFrame(loop);
})();

/* ---------- scramble headings ---------- */
(() => {
  if (reduce) return;
  const chars = '01<>/{}[]#$%&*+=?';
  const so = new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting) return; so.unobserve(e.target);
    const nodes = [...e.target.childNodes].filter(n => n.nodeType === 3 || n.nodeName === 'EM');
    nodes.forEach(n => { const el = n.nodeType === 3 ? n : n.firstChild; if (!el) return; const final = el.textContent; let f = 0;
      const tick = () => { f++; el.textContent = [...final].map((ch, i) => ch === ' ' || i < f / 1.5 ? ch : chars[(Math.random() * chars.length) | 0]).join('');
        if (f / 1.5 < final.length) requestAnimationFrame(tick); else el.textContent = final; };
      tick(); });
  }), { threshold: .5 });
  document.querySelectorAll('.scramble').forEach(h => so.observe(h));
})();

/* ---------- terminal demo ---------- */
(() => {
  const out = document.getElementById('term-out'); if (!out) return;
  const lines = pageLang === 'es' ? [
    ['p', '> Envía a cada contacto del portal del cliente un reporte semanal de horas, en cola, con reintentos.'],
    ['a', '● Leyendo app/Models/TimeEntry.php, app/Models/Project.php, routes/console.php'],
    ['a', '● Cambio propuesto: app/Jobs/SendWeeklyTimeReport.php'],
    ['add', '+    Schedule::job(new SendWeeklyTimeReport)->weeklyOn(1, \'08:00\');'],
    ['add', '+    $project->client->portalUsers->each(fn ($u) =>'],
    ['add', '+        Mail::to($u)->queue(new WeeklyTimeReport($project)));'],
    ['add', '+    public $tries = 3;  public $backoff = [60, 300];'],
    ['a', '● Corriendo php artisan test --filter=WeeklyTimeReport'],
    ['ok', '  PASS  Tests\\Feature\\WeeklyTimeReportTest  ✓ 4 passed'],
    ['p', '$ git diff --stat   # revisado línea por línea antes del merge'],
  ] : [
    ['p', '> Email each client portal contact a weekly time report, queued, with retries.'],
    ['a', '● Reading app/Models/TimeEntry.php, app/Models/Project.php, routes/console.php'],
    ['a', '● Proposed change: app/Jobs/SendWeeklyTimeReport.php'],
    ['add', '+    Schedule::job(new SendWeeklyTimeReport)->weeklyOn(1, \'08:00\');'],
    ['add', '+    $project->client->portalUsers->each(fn ($u) =>'],
    ['add', '+        Mail::to($u)->queue(new WeeklyTimeReport($project)));'],
    ['add', '+    public $tries = 3;  public $backoff = [60, 300];'],
    ['a', '● Running php artisan test --filter=WeeklyTimeReport'],
    ['ok', '  PASS  Tests\\Feature\\WeeklyTimeReportTest  ✓ 4 passed'],
    ['p', '$ git diff --stat   # reviewed line by line before merge'],
  ];
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const full = () => { out.innerHTML = lines.map(([c, t]) => `<span class="${c}">${esc(t)}</span>`).join('\n'); };
  if (reduce) return full();
  let started = false;
  new IntersectionObserver(([e]) => { if (!e.isIntersecting || started) return; started = true;
    let li = 0, ci = 0, html = '';
    const step = () => {
      if (li >= lines.length) { out.innerHTML = html + '<span class="cur"></span>'; setTimeout(() => { html = ''; li = 0; ci = 0; step(); }, 4000); return; }
      const [c, t] = lines[li]; ci += c === 'p' ? 1 : 4;
      out.innerHTML = html + `<span class="${c}">${esc(t.slice(0, ci))}</span><span class="cur"></span>`;
      if (ci >= t.length) { html += `<span class="${c}">${esc(t)}</span>\n`; li++; ci = 0; setTimeout(step, c === 'p' ? 500 : 180); }
      else setTimeout(step, c === 'p' ? 28 : 12);
    };
    step();
  }, { threshold: .4 }).observe(out);
})();

const cf = document.querySelector('.contact-form');
if (cf && ['localhost','127.0.0.1',''].includes(location.hostname)) cf.addEventListener('submit', e => { e.preventDefault(); document.getElementById('contact-status').textContent = ui.localForm; });

/* magnetic CTAs */
if (!reduce && matchMedia('(hover:hover)').matches) document.querySelectorAll('.magnetic').forEach(el => {
  el.addEventListener('pointermove', e => { const r = el.getBoundingClientRect(); el.style.setProperty('--mx', ((e.clientX - r.left - r.width / 2) * .18).toFixed(1) + 'px'); el.style.setProperty('--my', ((e.clientY - r.top - r.height / 2) * .3).toFixed(1) + 'px'); });
  el.addEventListener('pointerleave', () => { el.style.setProperty('--mx', '0px'); el.style.setProperty('--my', '0px'); });
});
