/* ==========================================================
   FENALS INTERNACIONAL — interacciones
   Ola de entrada, interruptor día / noche (vídeo, colores y
   propuesta del día), calculadora de arroces, carta con
   buscador, carrusel en forma de ola e historias en vídeo.
   ========================================================== */
(() => {
'use strict';

const $  = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const eur = (n) => n.toFixed(2).replace('.', ',');

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasGSAP = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
const motion = hasGSAP && !reduced;
if (hasGSAP) gsap.registerPlugin(ScrollTrigger);
// si el navegador congela los frames (pestaña oculta), se completa la animación
const watchdog = (tl, ms) => { setTimeout(() => { if (tl.progress() < 1) tl.progress(1); }, ms); return tl; };
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
const root = document.documentElement;

/* ----------------------------------------------------------
   DATOS
   ---------------------------------------------------------- */
const OPEN = [540, 1380]; // todos los días, 9:00 – 23:00

const MENU = [
  { id: 'entrantes', t: 'Entrantes', items: [
    ['Gazpacho', '8,95'], ['Ensalada mixta', '11,65'], ['Ensalada templada de canónigos con queso de cabra', '15,90'], ['Ensalada de aguacate con tostadas de jamón ibérico', '17,95'],
    ['Ensalada de tomate con mozzarella fresca de búfala', '14,90'], ['Melón con jamón', '16,65'], ['Surtido de quesos con frutos secos', '18,90'], ['Camembert frito con mousse de arándanos', '13,95'],
    ['Jamón ibérico (Guijuelo, Salamanca)', '23,95'], ['Carpaccio de buey con parmesano y rúcula', '15,90'], ['Erizos rellenos (4 u.)', '20,95'], ['Salmón ahumado con tostadas y mantequilla', '18,90'],
    ['Sopa de pescado', '18,90'], ['Calamares a la andaluza', '16,90'], ['Chipirones fritos', '16,95'], ['Mejillones a la marinera', '13,40'], ['Mejillones de roca al vapor', '12,90'],
    ['Almejas en su salsa', '16,95'], ['Ostras (unidad)', '4,95'], ['Zamburiñas (6 u.)', '17,90'], ['Tallarinas con ajo y perejil', '16,90'], ['Surtido de tapas', '24,00']
  ] },
  { id: 'arroces', t: 'Arroces y pastas', items: [
    ['Paella mixta', '17,95'], ['Paella marinera', '19,95'], ['Arroz negro', '17,95'], ['Arroz con bogavante (mín. 2, por persona)', '28,90'], ['Risotto de setas con parmesano', '19,95'], ['Fideuá', '16,95'],
    ['Espaguetis carbonara', '14,95'], ['Espaguetis marinera', '18,95'], ['Raviolis de setas con jamón ibérico', '19,95'], ['Canelón de confit de pato con foie', '14,95'], ['Fettuccine al funghi', '16,90'],
    ['Espaguetis a la boloñesa o macarrones', '13,90'], ['Espaguetis a la napolitana', '11,95']
  ] },
  { id: 'pescados', t: 'Pescados', items: [
    ['Gambas al ajillo (8 u.)', '22,00'], ['Sepia a la plancha', '18,95'], ['Pulpo a la gallega', '25,95'], ['Dorada al horno', '26,90'], ['Dorada a la sal (500 g)', '34,50'],
    ['Merluza de Blanes a la plancha con verdura', '18,90'], ['Bacalao gratinado a la miel', '25,90'], ['Rape a la plancha con verdura', '27,95'], ['Calamares a la plancha con guarnición', '20,95'],
    ['Parrillada de pescado (2 personas)', '125,90'], ['Salmón a la plancha', '20,90'], ['Bogavante a la plancha (500 g)', '47,90'], ['Rodaballo a la meunière', '25,95'], ['Pulpo a la plancha', '27,95'],
    ['Lenguado a la plancha con verduras', '25,95'], ['Lenguado a la meunière con verduras', '26,95'], ['Fritura de pescado mediterránea', '22,00'], ['Boquerones fritos', '8,95']
  ] },
  { id: 'carnes', t: 'Carnes', items: [
    ['Pechuga de pollo a la plancha', '14,50'], ['Entrecot con guarnición', '23,95'], ['Magret de pato al oporto con verduritas', '26,40'], ['Solomillo de ternera de Girona con guarnición', '28,90'],
    ['Solomillo de ternera con foie', '31,95'], ['Cordero al horno con patatas panadera', '26,90'], ['Entrecot a la piedra (600 g)', '29,95'], ['Pluma de cerdo ibérico', '22,90'],
    ['Costillas de cordero a la plancha', '19,90'], ['Parrillada de carne', '26,00'], ['Salsas (roquefort, pimienta)', '4,90'], ['Ración de patatas', '5,20'], ['Pan con tomate', '2,95'], ['Pan', '0,80']
  ] },
  { id: 'pizzas', t: 'Pizzas', items: [
    ['Fenals · tomate, mozzarella, bacon, jamón', '13,95'], ['Margarita', '12,40'], ['Siciliana · ajo y perejil', '13,50'], ['Napolitana · anchoas y olivas', '14,50'], ['Salami', '13,95'],
    ['Rocafort', '14,50'], ['Vesubio · jamón', '14,45'], ['Calzone · jamón y huevo', '14,95'], ['Caprichosa · cebolla y pimiento', '13,95'], ['Siete mares · atún, gambas, mejillones', '17,95'],
    ['Cuatro estaciones', '15,95'], ['Hawaii · jamón y piña', '14,85'], ['Pizza a la boloñesa', '14,50'], ['Cuatro quesos', '14,95'], ['Pepperoni', '13,95']
  ] },
  { id: 'sugerencias', t: 'Sugerencias', items: [
    ['Chuletón de ternera de Bilbao (1 kg)', '49,90'], ['Surtido de marisco de concha', '29,90'], ['Hamburguesa ibérica premium 200 g', '13,50'],
    ['Carpaccio de magret de pato con mango y parmesano', '14,50'], ['Burrata de búfala con mermelada de tomate y rúcula', '12,90'], ['Arroz meloso con centollo (mín. 2, por persona)', '23,00']
  ] }
];

const RICES = [
  { n: 'Paella mixta', p: 17.95, fill: 'rg', top: 'mixta' },
  { n: 'Paella marinera', p: 19.95, fill: 'rg', top: 'marisco' },
  { n: 'Arroz negro', p: 17.95, fill: 'rgBlack', top: 'negro' },
  { n: 'Fideuá', p: 16.95, fill: 'rgFid', top: 'fideua' },
  { n: 'Arroz con bogavante', p: 28.90, min: 2, fill: 'rg', top: 'bogavante' },
  { n: 'Arroz meloso con centollo', p: 23.00, min: 2, fill: 'rg', top: 'centollo' }
];

const PHOTOS = [
  ['ostras-0.jpg', 'Ostras y vino blanco'], ['lenguado-0.jpg', 'Lenguado a la plancha con verduras'], ['marisco.jpg', 'Todo el sabor del mar en una bandeja'],
  ['paella-chef.jpg', 'Nuestro arroz, para compartir'], ['chuleton-mesa.jpg', 'Chuletón a la piedra'], ['servicio.jpg', 'Chuletón con patatas, recién servido'],
  ['ostras-2.jpg', 'Ostras con limón'], ['paella.jpg', 'Paella de marisco'], ['lenguado-2.jpg', 'El lenguado, de cerca'], ['chuleton-tabla.jpg', 'Chuletón en tabla'],
  ['comedor.jpg', 'El comedor, con cristaleras'], ['paella-sarten.jpg', 'Paella marinera'], ['marisco-2.jpg', 'Marisco de concha'], ['spaghetti.jpg', 'Espaguetis con vino blanco']
];

/* ----------------------------------------------------------
   HORA DE LLORET
   ---------------------------------------------------------- */
function madridNow() {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Madrid', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date());
  const get = (t) => parts.find((p) => p.type === t).value;
  return { h: +get('hour') % 24, m: +get('minute'), min: (+get('hour') % 24) * 60 + +get('minute') };
}
const hhmm = (m) => `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`;
function paintStatus() {
  const { min, h, m } = madridNow();
  let st, txt;
  if (min >= OPEN[0] && min < OPEN[1]) [st, txt] = OPEN[1] - min <= 30 ? ['soon', `Cierra pronto · ${hhmm(OPEN[1])}`] : ['open', `Abierto ahora · hasta las ${hhmm(OPEN[1])}`];
  else [st, txt] = ['closed', `Cerrado · abre ${min < OPEN[0] ? 'hoy' : 'mañana'} a las ${hhmm(OPEN[0])}`];
  $$('[data-status]').forEach((el) => { el.dataset.state = st; $('b', el).textContent = txt; });
  $('#clock').textContent = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}
paintStatus();
setInterval(paintStatus, 30000);

/* ----------------------------------------------------------
   SCROLL + NAV
   ---------------------------------------------------------- */
let lenis = null;
if (motion && window.Lenis) {
  lenis = new Lenis({ lerp: 0.1 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}
const nav = $('#nav'), links = $('#navLinks'), burger = $('#burger');
let lastY = 0;
addEventListener('scroll', () => {
  const y = scrollY;
  nav.classList.toggle('is-solid', y > innerHeight * 0.75);
  nav.classList.toggle('is-hidden', y > lastY && y > 900 && !links.classList.contains('is-open'));
  lastY = y;
}, { passive: true });
burger.addEventListener('click', () => {
  const open = !links.classList.contains('is-open');
  links.classList.toggle('is-open', open);
  burger.setAttribute('aria-expanded', String(open));
});
$$('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
  const id = a.getAttribute('href');
  const target = id.length > 1 ? $(id) : document.body;
  if (!target) return;
  e.preventDefault();
  links.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false');
  if (lenis) lenis.scrollTo(target, { offset: id === '#top' ? 0 : -60, duration: 1.5 });
  else target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
}));

/* ----------------------------------------------------------
   DÍA / NOCHE
   ---------------------------------------------------------- */
const vDay = $('.hero__v--day'), vNight = $('.hero__v--night');
const meta = $('meta[name="theme-color"]');
let heroVisible = true;
function ensure(v) { if (!v.getAttribute('src')) v.src = v.dataset.src; if (!reduced && heroVisible) v.play().catch(() => {}); }
function setMode(mode, animate = true) {
  root.dataset.mode = mode;
  const night = mode === 'night';
  $$('.dn').forEach((b) => { b.setAttribute('aria-pressed', String(night)); b.setAttribute('aria-label', night ? 'Cambiar a modo día' : 'Cambiar a modo noche'); });
  $('#modeName').textContent = night ? 'de noche' : 'de día';
  meta.setAttribute('content', night ? '#08161F' : '#0E5A6B');
  const on = night ? vNight : vDay, off = night ? vDay : vNight;
  ensure(on);
  setTimeout(() => off.pause(), 1400);
  if (animate && motion) {
    gsap.fromTo('.hoy__grid > *, .hoy__head > *', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'expo.out', stagger: 0.05, clearProps: 'transform,opacity' });
    ScrollTrigger.refresh();
  }
}
const want = new URLSearchParams(location.search).get('mode');
const { min: nowMin } = madridNow();
setMode(want === 'night' || want === 'day' ? want : (nowMin >= 1170 || nowMin < 420 ? 'night' : 'day'), false);
$$('.dn').forEach((b) => b.addEventListener('click', () => setMode(root.dataset.mode === 'night' ? 'day' : 'night')));
new IntersectionObserver(([e]) => {
  heroVisible = e.isIntersecting;
  const v = root.dataset.mode === 'night' ? vNight : vDay;
  if (heroVisible) ensure(v); else { vDay.pause(); vNight.pause(); }
}, { threshold: 0.05 }).observe($('.hero'));

/* vídeos perezosos (historias) */
const fine = matchMedia('(pointer: fine)').matches;
const vio = new IntersectionObserver((entries) => entries.forEach((e) => {
  const v = e.target;
  if (e.isIntersecting) { if (!v.getAttribute('src')) v.src = v.dataset.src; if (!reduced && !fine) v.play().catch(() => {}); }
  else v.pause();
}), { rootMargin: '250px 0px', threshold: 0.01 });
$$('video[data-auto]').forEach((v) => vio.observe(v));

/* ----------------------------------------------------------
   INTRO · la ola
   ---------------------------------------------------------- */
function heroIn() {
  if (!motion) return;
  return watchdog(gsap.timeline({ defaults: { ease: 'expo.out' } })
    .from('.hero__media', { scale: 1.15, duration: 2.4 })
    .from('.hero__kicker, .hero__title, .hero__cta, .hero__switch', { y: 40, opacity: 0, duration: 1.2, stagger: 0.1, clearProps: 'transform,opacity' }, 0.2), 4500);
}
const tide = $('#tide');
let seen = false;
try { seen = sessionStorage.getItem('fenals-intro') === '1'; sessionStorage.setItem('fenals-intro', '1'); } catch (e) { /* sin storage */ }
if (!motion || seen) { tide.remove(); heroIn(); }
else {
  document.body.classList.add('is-locked');
  const wave = $('#tideWave');
  const swell = gsap.to(wave, { attr: { d: 'M0 60 Q360 120 720 60 T1440 60 V120 H0 Z' }, duration: 0.9, ease: 'sine.inOut', repeat: -1, yoyo: true });
  const tl = gsap.timeline({ onComplete: () => { swell.kill(); tide.remove(); document.body.classList.remove('is-locked'); } });
  watchdog(tl, 8000);
  tl.from('.tide .shell--xl', { scale: 0.4, rotation: -30, opacity: 0, duration: 1, ease: 'back.out(2)' })
    .from('.tide__name', { y: 30, opacity: 0, duration: 1, ease: 'expo.out' }, 0.2)
    .from('.tide__sub', { opacity: 0, duration: 0.8 }, 0.6)
    .to('.tide__body > *', { y: -40, opacity: 0, duration: 0.6, ease: 'power2.in', stagger: 0.05 }, '+=0.5')
    .to(tide, { yPercent: 110, duration: 1.3, ease: 'power3.inOut' }, '-=0.2')
    .add(heroIn, '-=0.9');
  tide.addEventListener('click', () => tl.progress(1));
}

/* ----------------------------------------------------------
   ARROCES · calculadora
   ---------------------------------------------------------- */
const SV = 'http://www.w3.org/2000/svg';
const sEl = (tag, attrs, parent) => { const e = document.createElementNS(SV, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); parent.appendChild(e); return e; };
function rng(seed) { let s = seed * 9301 + 49297; return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; }; }
function spots(n, R, rMax, minD) {
  const pts = []; let tries = 0;
  while (pts.length < n && tries++ < n * 80) {
    const a = R() * Math.PI * 2, r = Math.sqrt(R()) * rMax;
    const p = { x: Math.cos(a) * r, y: Math.sin(a) * r, a: R() * 360 };
    if (pts.every((q) => Math.hypot(q.x - p.x, q.y - p.y) > minD)) pts.push(p);
  }
  return pts;
}
const TOP = {
  shrimp(g, R, n) { spots(n, R, 74, 26).forEach((p) => { const t = `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${p.a.toFixed(0)})`; sEl('path', { d: 'M9 -7 A11 11 0 1 0 9 7', fill: 'none', stroke: '#E8643A', 'stroke-width': 6, 'stroke-linecap': 'round', transform: t }, g); sEl('path', { d: 'M9 -7 A11 11 0 1 0 9 7', fill: 'none', stroke: '#F6B08E', 'stroke-width': 1.2, 'stroke-dasharray': '2 3', transform: t }, g); }); },
  mussel(g, R, n) { spots(n, R, 78, 22).forEach((p) => sEl('ellipse', { cx: p.x, cy: p.y, rx: 12, ry: 6.5, fill: '#24202E', stroke: '#5E5675', 'stroke-width': 1.6, transform: `rotate(${p.a.toFixed(0)} ${p.x.toFixed(1)} ${p.y.toFixed(1)})` }, g)); },
  lemon(g, R, n) { spots(n, R, 60, 40).forEach((p) => { const t = `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${p.a.toFixed(0)})`; sEl('path', { d: 'M-12 0 A12 12 0 0 1 12 0 Z', fill: '#F6D54A', stroke: '#E0B21E', 'stroke-width': 1.5, transform: t }, g); sEl('path', { d: 'M-8 -1 L0 -9 M0 -1 V-10 M8 -1 L0 -9', stroke: '#FFF3B0', 'stroke-width': 1, transform: t }, g); }); },
  peas(g, R, n) { spots(n, R, 84, 8).forEach((p) => sEl('circle', { cx: p.x, cy: p.y, r: 3.4, fill: '#6FA83A', stroke: '#4E7D25', 'stroke-width': .8 }, g)); },
  beans(g, R, n) { spots(n, R, 80, 16).forEach((p) => sEl('rect', { x: -9, y: -2.5, width: 18, height: 5, rx: 2.5, fill: '#5E9A3A', transform: `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${p.a.toFixed(0)})` }, g)); },
  chicken(g, R, n) { spots(n, R, 74, 22).forEach((p) => sEl('rect', { x: -8, y: -6, width: 16, height: 12, rx: 5, fill: '#E7B97A', stroke: '#B98547', 'stroke-width': 1.2, transform: `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${p.a.toFixed(0)})` }, g)); },
  rings(g, R, n) { spots(n, R, 78, 18).forEach((p) => sEl('circle', { cx: p.x, cy: p.y, r: 7, fill: 'none', stroke: '#F2EADB', 'stroke-width': 3.4 }, g)); },
  noodles(g, R, n) { spots(n, R, 86, 6).forEach((p) => sEl('path', { d: 'M-5 0 Q0 -3 5 0', fill: 'none', stroke: '#F7D58C', 'stroke-width': 2.2, 'stroke-linecap': 'round', transform: `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${p.a.toFixed(0)})` }, g)); },
  aioli(g) { sEl('path', { d: 'M-16 -4 Q-14 -18 0 -16 Q16 -16 14 -2 Q12 12 -2 12 Q-18 10 -16 -4 Z', fill: '#FFF8E8', stroke: '#E8DCC0', 'stroke-width': 1.5, transform: 'translate(0 0)' }, g); },
  lobster(g) {
    [[-38, -6, 15], [34, 10, -165]].forEach(([x, y, r]) => {
      const t = `translate(${x} ${y}) rotate(${r})`;
      sEl('path', { d: 'M-34 0 Q-30 -12 -10 -11 L26 -8 Q36 -6 38 0 Q36 6 26 8 L-10 11 Q-30 12 -34 0 Z', fill: '#C8321F', stroke: '#8F1E10', 'stroke-width': 2, transform: t }, g);
      sEl('path', { d: 'M-20 -9 V9 M-6 -10 V10 M8 -9 V9 M20 -8 V8', stroke: '#8F1E10', 'stroke-width': 1.5, transform: t }, g);
      sEl('path', { d: 'M-34 0 Q-22 -2 -10 -4 L26 -2 Q32 0 26 2 L-10 4 Q-22 2 -34 0 Z', fill: '#F5E6D6', opacity: .8, transform: t }, g);
    });
  },
  crab(g) {
    for (let k = 0; k < 6; k++) {
      const a = k * 60 + 15;
      sEl('path', { d: 'M0 0 L46 0 L62 10', fill: 'none', stroke: '#D9572C', 'stroke-width': 7, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', transform: `rotate(${a})` }, g);
      sEl('path', { d: 'M12 0 L44 0', fill: 'none', stroke: '#F3A07A', 'stroke-width': 1.5, 'stroke-dasharray': '3 4', transform: `rotate(${a})` }, g);
    }
    sEl('ellipse', { rx: 26, ry: 20, fill: '#C8461F', stroke: '#8F2A10', 'stroke-width': 2 }, g);
  }
};
const RICE_TOPS = {
  mixta: (g, R) => { TOP.beans(g, R, 12); TOP.chicken(g, R, 7); TOP.shrimp(g, R, 4); TOP.mussel(g, R, 4); TOP.lemon(g, R, 2); },
  marisco: (g, R) => { TOP.mussel(g, R, 9); TOP.shrimp(g, R, 7); TOP.rings(g, R, 5); TOP.lemon(g, R, 2); },
  negro: (g, R) => { TOP.rings(g, R, 10); TOP.shrimp(g, R, 3); TOP.aioli(g, R); TOP.lemon(g, R, 2); },
  fideua: (g, R) => { TOP.noodles(g, R, 160); TOP.shrimp(g, R, 6); TOP.mussel(g, R, 4); TOP.lemon(g, R, 2); },
  bogavante: (g, R) => { TOP.peas(g, R, 20); TOP.mussel(g, R, 5); TOP.lobster(g, R); },
  centollo: (g, R) => { TOP.peas(g, R, 16); TOP.crab(g, R); TOP.shrimp(g, R, 3); }
};
const riceBox = $('#rice'), panRice = $('#panRice'), panTops = $('#panTops'), panSlices = $('#panSlices');
let rIdx = 0, people = 2;
riceBox.innerHTML = RICES.map((r, i) => `<button type="button" role="radio" aria-checked="${i === 0}" data-i="${i}">${r.n}<small>${eur(r.p)} €</small></button>`).join('');
const rBtns = $$('button', riceBox);
function drawPan(animate) {
  const r = RICES[rIdx];
  panRice.setAttribute('fill', `url(#${r.fill})`);
  panTops.innerHTML = '';
  RICE_TOPS[r.top](panTops, rng(rIdx * 31 + 7));
  if (animate && motion) gsap.fromTo(panTops.children, { scale: 0, opacity: 0, transformOrigin: '50% 50%' }, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2)', stagger: { each: 0.004, from: 'random' } });
}
function drawSlices() {
  panSlices.innerHTML = '';
  if (people < 2) return;
  for (let k = 0; k < people; k++) {
    const a = (k / people) * Math.PI * 2 - Math.PI / 2;
    sEl('path', { d: `M0 0 L${(Math.cos(a) * 96).toFixed(1)} ${(Math.sin(a) * 96).toFixed(1)}` }, panSlices);
  }
  if (motion) gsap.from(panSlices.children, { attr: { d: 'M0 0 L0 0' }, duration: 0.6, ease: 'expo.out', stagger: 0.03 });
}
let totalTween = null, shown = 0;
function paintTotal() {
  const r = RICES[rIdx];
  const minP = r.min || 1;
  if (people < minP) people = minP;
  $('#pCount').textContent = people;
  $('#pMinus').disabled = people <= minP;
  $('#pPlus').disabled = people >= 12;
  const total = r.p * people;
  $('#tNote').textContent = `· ${eur(r.p)} € por persona${r.min ? ' · mínimo 2' : ''}`;
  if (totalTween) totalTween.kill();
  if (!motion) { $('#tTotal').textContent = eur(total); shown = total; return; }
  const o = { v: shown };
  totalTween = gsap.to(o, { v: total, duration: 0.6, ease: 'expo.out', onUpdate: () => { $('#tTotal').textContent = eur(o.v); shown = o.v; } });
  clearTimeout(paintTotal.t);
  paintTotal.t = setTimeout(() => { $('#tTotal').textContent = eur(total); shown = total; }, 900);
}
rBtns.forEach((b) => b.addEventListener('click', () => {
  rIdx = +b.dataset.i;
  rBtns.forEach((x) => x.setAttribute('aria-checked', String(x === b)));
  drawPan(true); paintTotal(); drawSlices();
}));
$('#pMinus').addEventListener('click', () => { people = Math.max(1, people - 1); paintTotal(); drawSlices(); });
$('#pPlus').addEventListener('click', () => { people = Math.min(12, people + 1); paintTotal(); drawSlices(); });
drawPan(false); paintTotal(); drawSlices();

/* ----------------------------------------------------------
   CARTA · pestañas + buscador
   ---------------------------------------------------------- */
const ctabs = $('#ctabs'), clist = $('#clist'), q = $('#q');
let cId = 'entrantes';
ctabs.innerHTML = MENU.map((c) => `<button role="tab" type="button" aria-selected="${c.id === cId}" data-id="${c.id}">${c.t}<span>${c.items.length}</span></button>`).join('');
const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
function mark(txt, term) {
  if (!term) return txt;
  const i = norm(txt).indexOf(term);
  return i < 0 ? txt : `${txt.slice(0, i)}<mark>${txt.slice(i, i + term.length)}</mark>${txt.slice(i + term.length)}`;
}
function renderCarta(animate = true) {
  const term = norm(q.value.trim());
  let rows = [];
  if (term) MENU.forEach((c) => c.items.forEach(([n, p]) => { if (norm(n).includes(term)) rows.push({ n, p, c: c.t }); }));
  else rows = MENU.find((c) => c.id === cId).items.map(([n, p]) => ({ n, p }));
  ctabs.style.opacity = term ? '.4' : '';
  clist.innerHTML = rows.length ? rows.map((r) => `<li><span class="n">${r.c ? `<small>${r.c}</small>` : ''}${mark(r.n, term)}</span><i></i><b>${r.p} €</b></li>`).join('') : `<li class="empty">No encontramos “${q.value}”. Prueba con paella, lenguado u ostras.</li>`;
  if (animate && motion) gsap.from($$('li', clist), { y: 16, opacity: 0, duration: 0.5, ease: 'expo.out', stagger: 0.015 });
}
$$('button', ctabs).forEach((b) => b.addEventListener('click', () => {
  cId = b.dataset.id; q.value = '';
  $$('button', ctabs).forEach((x) => x.setAttribute('aria-selected', String(x === b)));
  renderCarta();
}));
let qT;
q.addEventListener('input', () => { clearTimeout(qT); qT = setTimeout(() => renderCarta(), 120); });
renderCarta(false);

/* ----------------------------------------------------------
   MAREA · carrusel que sigue una ola
   ---------------------------------------------------------- */
const wave = $('#wave');
const wCards = PHOTOS.map(([f, c], i) => {
  const el = document.createElement('figure');
  el.className = 'wcard'; el.dataset.i = i;
  el.innerHTML = `<img src="assets/img/${f}" alt="${c}" loading="lazy" draggable="false">`;
  wave.appendChild(el);
  return el;
});
let off = 0, wVel = 0, wDrag = false, wVisible = false, t0 = performance.now(), auto = !reduced;
function wFrame(now) {
  const W = wave.clientWidth, H = wave.clientHeight;
  const cw = wCards[0].offsetWidth, G = cw * 1.12, total = G * wCards.length;
  const A = H * 0.16, L = Math.max(W * 0.75, 700);
  const t = (now - t0) / 1000;
  if (!wDrag) { if (Math.abs(wVel) > 0.05) { off += wVel; wVel *= 0.95; } else if (auto) off -= 0.5; }
  wCards.forEach((c, i) => {
    let x = ((i * G + off) % total + total) % total - G;
    const ph = (x / L) * Math.PI * 2 + t * 0.6;
    const y = Math.sin(ph) * A;
    const rot = Math.cos(ph) * A * (Math.PI * 2 / L) * 57.3 * 0.6;
    c.style.transform = `translate3d(${(x + cw / 2).toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${rot.toFixed(2)}deg)`;
  });
  if (wVisible) requestAnimationFrame(wFrame);
}
new IntersectionObserver(([e]) => { wVisible = e.isIntersecting; if (wVisible) requestAnimationFrame(wFrame); }, { threshold: 0.02 }).observe(wave);
let wx = 0, wMoved = 0;
wave.addEventListener('pointerdown', (e) => { wDrag = true; wMoved = 0; wx = e.clientX; wVel = 0; auto = false; wave.classList.add('is-drag'); wave.setPointerCapture(e.pointerId); });
wave.addEventListener('pointermove', (e) => { if (!wDrag) return; const dx = e.clientX - wx; wx = e.clientX; wMoved += Math.abs(dx); off += dx; wVel = dx; });
function wUp(e) {
  if (!wDrag) return;
  wDrag = false; wave.classList.remove('is-drag');
  if (wMoved < 6) { const hit = document.elementFromPoint(e.clientX, e.clientY)?.closest('.wcard'); if (hit) openLB('img', `assets/img/${PHOTOS[+hit.dataset.i][0]}`, PHOTOS[+hit.dataset.i][1]); wVel = 0; }
  setTimeout(() => { auto = !reduced; }, 4000);
}
wave.addEventListener('pointerup', wUp);
wave.addEventListener('pointercancel', wUp);
wave.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') { wVel = -14; auto = false; } if (e.key === 'ArrowLeft') { wVel = 14; auto = false; } });

/* ----------------------------------------------------------
   HISTORIAS
   ---------------------------------------------------------- */
$$('.pebble').forEach((p) => {
  const v = $('video', p);
  if (fine) {
    p.addEventListener('pointerenter', () => { if (!v.getAttribute('src')) v.src = v.dataset.src; if (!reduced) v.play().catch(() => {}); });
    p.addEventListener('pointerleave', () => v.pause());
  }
  p.addEventListener('click', () => openLB('video', v.dataset.src, p.dataset.title));
});

/* ----------------------------------------------------------
   LIGHTBOX
   ---------------------------------------------------------- */
const lb = $('#lb'), lbMedia = $('.lb__media', lb);
function openLB(kind, src, cap) {
  lbMedia.innerHTML = kind === 'img' ? `<img src="${src}" alt="${cap}">` : `<video src="${src}" controls autoplay playsinline></video>`;
  $('.lb__cap', lb).textContent = cap;
  lb.hidden = false; lenis?.stop();
  $('.lb__close', lb).focus();
  if (motion) gsap.fromTo(lbMedia.firstElementChild, { scale: 0.94, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: 'expo.out' });
}
function closeLB() { lbMedia.innerHTML = ''; lb.hidden = true; lenis?.start(); }
$('.lb__close', lb).addEventListener('click', closeLB);
lb.addEventListener('click', (e) => { if (e.target === lb) closeLB(); });
addEventListener('keydown', (e) => { if (e.key === 'Escape' && !lb.hidden) closeLB(); });

/* ----------------------------------------------------------
   REVEALS
   ---------------------------------------------------------- */
if (motion) {
  const reveal = (sel, trig, vars = {}) => gsap.from(sel, { y: 46, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: 0.08, ...vars, scrollTrigger: { trigger: trig || sel, start: 'top 84%' } });
  reveal('.hoy__head > *', '.hoy');
  gsap.from('.clip, .sugg', { y: 90, rotation: -4, opacity: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.hoy__grid', start: 'top 80%' } });
  gsap.from('.hoy__photo', { clipPath: 'inset(100% 0 0 0 round 999px 999px 24px 24px)', duration: 1.6, ease: 'expo.inOut', scrollTrigger: { trigger: '.hoy__grid', start: 'top 75%' } });
  reveal('.arroz__copy > *', '.arroz', { stagger: 0.06 });
  gsap.from('#pan', { rotation: -120, scale: 0.7, opacity: 0, duration: 1.8, ease: 'expo.out', scrollTrigger: { trigger: '.arroz', start: 'top 70%' } });
  reveal('.carta__head > *', '.carta');
  reveal('.marea__head > *', '.marea');
  reveal('.historias__head > *', '.historias');
  gsap.from('.pebble', { y: 120, opacity: 0, duration: 1.5, ease: 'expo.out', stagger: 0.1, scrollTrigger: { trigger: '.pebbles', start: 'top 85%' } });
  reveal('.orilla > .h2, .orilla > .lead', '.orilla');
  reveal('.quotes figure', '.quotes', { stagger: 0.1 });
  reveal('.reservar__info > *', '.reservar', { stagger: 0.04 });
  gsap.from('.reservar__map', { clipPath: 'inset(0 0 100% 0 round 28px)', duration: 1.5, ease: 'expo.inOut', scrollTrigger: { trigger: '.reservar', start: 'top 75%' } });
  gsap.from('.foot__big', { yPercent: 40, opacity: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.foot', start: 'top 88%' } });
  addEventListener('load', () => ScrollTrigger.refresh());
}
})();
