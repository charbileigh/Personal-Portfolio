// Mobile nav toggle
const toggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('site-nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });
}
// Year
const y = document.getElementById('year');
if (y) y.textContent = new Date().getFullYear();


// --- Scroll cue ---
const cue = document.querySelector('.scroll-cue');
if (cue){
  // Click scrolls to next section
  cue.addEventListener('click', () => {
    const next = document.querySelector('#about') || document.querySelector('[id]');
    if (next) next.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });



// --- THEME TOGGLE ---
const THEME_KEY = 'theme';       // 'light' | 'dark'
const root = document.documentElement;
const btn = document.querySelector('.theme-toggle');

// 1) Initial: read saved theme or system preference
(function initTheme(){
  const saved = localStorage.getItem(THEME_KEY);
  const systemIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved || (systemIsDark ? 'dark' : 'light');  // default to system
  applyTheme(theme);
})();

// 2) Click to toggle
if (btn){
  btn.addEventListener('click', () => {
    const next = (root.dataset.theme === 'light') ? 'dark' : 'light';
    applyTheme(next, true);
  });
}

function applyTheme(theme, save=false){
  // Set attribute for CSS to react
  if (theme === 'light') {
    root.setAttribute('data-theme','light');
  } else {
    root.removeAttribute('data-theme'); // falls back to dark :root
  }

  // Update button state/label/icon
  if (btn){
    const isLight = theme === 'light';
    btn.setAttribute('aria-pressed', String(isLight));
    const icon = btn.querySelector('.theme-icon');
    const text = btn.querySelector('.theme-text');
    if (icon) icon.textContent = isLight ? '☀️' : '🌙';
    if (text) text.textContent = isLight ? 'Light' : 'Dark';
  }

  // Update browser UI color (nice on mobile)
  const meta = document.querySelector('meta[name="theme-color"]') || (() => {
    const m = document.createElement('meta'); m.name = 'theme-color'; document.head.appendChild(m); return m;
  })();
  const colors = getComputedStyle(document.documentElement);
  meta.setAttribute('content', colors.getPropertyValue('--bg').trim());

  if (save) localStorage.setItem(THEME_KEY, theme);
}

(function(){
  try{
    var saved = localStorage.getItem('theme');
    var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var theme = saved || (systemDark ? 'dark' : 'light');
    if (theme === 'light') document.documentElement.setAttribute('data-theme','light');
  }catch(e){}
})}; 


// Circular pointer
const cursor = document.querySelector('.custom-cursor');

document.addEventListener('mousemove', e => {
  cursor.style.top = `${e.clientY}px`;
  cursor.style.left = `${e.clientX}px`;
});

// Optional: grow cursor on interactive elements
document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
});





// UFO Section
document.addEventListener('DOMContentLoaded', () => {
  const root = document.querySelector('#ufo-anim');
  if (!root || !window.gsap) return;

  const $  = (sel) => root.querySelector(sel);
  const $$ = (sel) => root.querySelectorAll(sel);

  const ship            = $('.ship');
  const shipRotation    = $('.shipRotation');
  const beam            = $('.beam');
  const spotlight       = $('.spotlight');
  const spotlightHover  = $('.spotlightHover');
  const lines           = $$('.speedLineGroup line');
  const cow             = $('.cow');
  const glowAlpha       = $('#glowAlpha');
  const lights          = $$('.light');

  // Transform origins for SVG shapes
  gsap.set([ship, shipRotation, beam, spotlight, spotlightHover], { transformOrigin: '50% 50%' });

  // Floaty hover
  gsap.to(ship, { y: '+=13', duration: 0.8, yoyo: true, repeat: -1, ease: 'sine.inOut' });

  // Gentle rocking
  gsap.fromTo(shipRotation, { rotate: -4 }, { rotate: 4, duration: 1.3, yoyo: true, repeat: -1, ease: 'sine.inOut' });

  // Blink lights (uses your theme accent if available)
  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent')?.trim() || '#E5023B';
  if (lights.length) {
    gsap.to(lights, { fill: accent, duration: 0.76, repeat: -1, yoyo: true, ease: 'none', stagger: 0.16 });
  }

  // Spotlight hover pulse
  if (spotlightHover) {
    gsap.from(spotlightHover, { scaleX: 0.9, duration: 0.8, yoyo: true, repeat: -1, ease: 'sine.inOut' });
  }

  // ----- Speed lines (no plugin) -----
  // Simulate "draw" effect with dasharray/offset
  const speedLineTL = gsap.timeline({ repeat: 21 }).timeScale(9);

  lines.forEach((line, i) => {
    const x1 = line.x1.baseVal.value, y1 = line.y1.baseVal.value;
    const x2 = line.x2.baseVal.value, y2 = line.y2.baseVal.value;
    const len = Math.hypot(x2 - x1, y2 - y1) || 1;

    // Setup stroke dash
    line.style.strokeDasharray = `${len}`;
    line.style.strokeDashoffset = `${len}`;

    const t = gsap.timeline();
    t.to(line, { strokeDashoffset: len * 0.8, duration: 0.2, ease: 'none' })
     .to(line, { strokeDashoffset: 0,        duration: 1.0, ease: 'none' })
     .to(line, { opacity: 0,                  duration: 0.2, ease: 'none' })
     .set(line, { strokeDashoffset: len, opacity: 1 });

    speedLineTL.add(t, (i + 1) / 1.83);
  });

  // ----- Main story timeline -----
  const tl = gsap.timeline({ repeat: -1 });

  tl.from(ship, { x: 400, rotation: -53, duration: 4, ease: 'elastic.out(1.7, 0.8)' })
    .fromTo(cow, { x: -800 }, { x: 0, duration: 1, ease: 'expo.out' }, '<')
    .from(beam, { scaleX: 0, duration: 1.2, ease: 'expo.out', delay: 1 }, '-=3')
    .from(spotlight, { attr: { rx: 0, ry: 0 }, duration: 1.2, ease: 'expo.out', delay: 1 }, '-=3')
    .to(glowAlpha, { attr: { 'flood-opacity': 1 }, duration: 1 })
    .to(cow, { y: '-=160', x: 0, rotation: -65, fill: '#B8A310', duration: 2, ease: 'power2.in' }, '-=1')
    .set(cow, { autoAlpha: 0 })
    .to(beam, { scaleX: 0, duration: 1.2, ease: 'expo.in' })
    .to(spotlight, { attr: { rx: 0, ry: 0 }, duration: 1.2, ease: 'expo.in' }, '-=1.2')
    .to(ship, { rotation: -54, duration: 2, ease: 'power2.inOut' })
    .to(ship, { x: -1800, duration: 2, ease: 'back.in(0.8)' }, '-=2')
    .add(speedLineTL, 0);
});
