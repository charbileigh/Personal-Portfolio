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

