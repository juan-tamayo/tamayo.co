const root = document.documentElement;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const colorScheme = window.matchMedia('(prefers-color-scheme: dark)');
const themeButton = document.querySelector('#theme-toggle');
const motionButton = document.querySelector('#motion-toggle');
// The local static preview has no form backend. Never imply a message was sent.
const contactForm = document.querySelector('.contact-form');
if (contactForm && ['localhost', '127.0.0.1', '[::1]', ''].includes(location.hostname)) {
  contactForm.addEventListener('submit', event => {
    event.preventDefault();
    document.querySelector('#contact-status').textContent = 'This is a local preview. Messages can be sent after the site is deployed with Netlify Forms enabled.';
  });
}
// Storage can be unavailable in privacy modes or when opened directly from disk.
try {
  const theme = localStorage.getItem('tamayo-theme');
  if (theme === 'dark' || theme === 'light') root.dataset.theme = theme;
} catch {}
function updateThemeLabel() {
  const dark = root.dataset.theme ? root.dataset.theme === 'dark' : colorScheme.matches;
  themeButton.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} theme`);
}
themeButton.addEventListener('click', () => {
  const dark = root.dataset.theme ? root.dataset.theme === 'dark' : colorScheme.matches;
  root.dataset.theme = dark ? 'light' : 'dark';
  try { localStorage.setItem('tamayo-theme', root.dataset.theme); } catch {}
  updateThemeLabel();
});
colorScheme.addEventListener('change', updateThemeLabel);
updateThemeLabel();
function updateMotionButton() {
  const off = root.dataset.motion === 'off' || reducedMotion.matches;
  motionButton.querySelector('span').textContent = off ? 'Resume motion' : 'Pause motion';
  motionButton.setAttribute('aria-label', off ? 'Resume animations' : 'Pause animations');
  motionButton.querySelector('path').setAttribute('d', off ? 'm8 5 11 7-11 7Z' : 'M8 5v14M16 5v14');
  motionButton.setAttribute('aria-pressed', String(off));
  motionButton.disabled = reducedMotion.matches;
  motionButton.title = reducedMotion.matches ? 'Reduced motion follows your device preference' : off ? 'Resume animations' : 'Pause animations';
}
motionButton.addEventListener('click', () => {
  root.dataset.motion = root.dataset.motion === 'off' ? 'on' : 'off';
  updateMotionButton();
});
reducedMotion.addEventListener('change', updateMotionButton);
updateMotionButton();
// Preserve the real stats in HTML; animate each one only on its first appearance.
const activeCounters = new Set();
const counters = [...document.querySelectorAll('.impact strong, .story-result strong')]
  .filter(element => /^\d/.test(element.textContent.trim()))
  .map(element => {
    const numberNode = element.firstChild;
    const finalText = numberNode.textContent.trim();
    const target = Number(finalText);
    const decimals = finalText.includes('.') ? finalText.split('.')[1].length : 0;
    element.setAttribute('aria-label', element.textContent.trim());
    const value = document.createElement('span');
    value.className = 'stat-value';
    value.setAttribute('aria-hidden', 'true');
    value.textContent = finalText;
    numberNode.replaceWith(value);
    const suffix = value.nextElementSibling;
    if (suffix) { suffix.classList.add('stat-suffix'); suffix.setAttribute('aria-hidden', 'true'); }
    let frame;
    const counter = { element, finish() {
      cancelAnimationFrame(frame);
      value.textContent = finalText;
      activeCounters.delete(counter);
    }, start() {
      if (reducedMotion.matches || root.dataset.motion === 'off') return;
      activeCounters.add(counter);
      value.textContent = (0).toFixed(decimals);
      let started;
      const tick = time => {
        started ??= time;
        const progress = Math.min((time - started) / 1600, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        value.textContent = (target * eased).toFixed(decimals);
        if (progress < 1) frame = requestAnimationFrame(tick);
        else counter.finish();
      };
      frame = requestAnimationFrame(tick);
    } };
    return counter;
  });
if ('IntersectionObserver' in window) {
  const counterObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      counters.find(counter => counter.element === entry.target).start();
      counterObserver.unobserve(entry.target);
    }
  }, { threshold: 0.5 });
  counters.forEach(counter => counterObserver.observe(counter.element));
}
function finishCountersWhenPaused() {
  if (reducedMotion.matches || root.dataset.motion === 'off') activeCounters.forEach(counter => counter.finish());
}
motionButton.addEventListener('click', finishCountersWhenPaused);
reducedMotion.addEventListener('change', finishCountersWhenPaused);
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(element => {
    element.classList.add('ready');
    observer.observe(element);
  });
}
document.querySelector('#year').textContent = new Date().getFullYear();
// Keep the dock's current section in sync with ordinary scrolling.
if ('IntersectionObserver' in window) {
  const dockLinks = [...document.querySelectorAll('.dock-link')];
  const sectionObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      dockLinks.forEach(link => {
        if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }
  }, { rootMargin: '-15% 0px -55% 0px' });
  document.querySelectorAll('#work, #about, #contact, .hero').forEach(section => sectionObserver.observe(section));
}
// Stagger content without hiding it when scripting or motion is unavailable.
for (const group of ['.capabilities li', '.career-step', '.product-words span']) {
  document.querySelectorAll(group).forEach((element, index) => {
    element.style.setProperty('--i', index);
  });
}
