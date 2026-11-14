/* JOB INTERVIEW: a robot tries to get hired. No server, no AI calls: every line is pre-written. */
(() => {
'use strict';
const $ = s => document.querySelector(s);
const stage = $('#stage');
const rnd = n => Math.floor(Math.random() * n);
const pick = a => a[rnd(a.length)];
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const wait = ms => new Promise(r => setTimeout(r, ms * SPEED));
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
let SPEED = 1; // test hook: window.__ji.speed(0.1)

// ---------- sizing: a phone-shaped stage, scaled by --u ----------
function fit() {
  const w = Math.min(innerWidth, innerHeight * 0.54, 560);
  document.documentElement.style.setProperty('--u', (w / 100) + 'px');
}
addEventListener('resize', fit); fit();

// ---------- sound (WebAudio, made on first tap) ----------
let ac = null, muted = false;
try { muted = localStorage.getItem('ji_muted') === '1'; } catch (e) {}
function audio() { if (!ac) { try { ac = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} } if (ac && ac.state === 'suspended') ac.resume(); return ac; }
function tone(f, d = .08, type = 'square', vol = .06, when = 0, slide = 0) {
  if (muted || !audio()) return;
  const t = ac.currentTime + when, o = ac.createOscillator(), g = ac.createGain();
  o.type = type; o.frequency.setValueAtTime(f, t); if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + d);
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.0001, t + d);
  o.connect(g).connect(ac.destination); o.start(t); o.stop(t + d + .02);
}
function noise(d = .18, vol = .25, freq = 900) {
  if (muted || !audio()) return;
  const n = ac.sampleRate * d, b = ac.createBuffer(1, n, ac.sampleRate), ch = b.getChannelData(0);
  for (let i = 0; i < n; i++) ch[i] = (Math.random() * 2 - 1) * (1 - i / n);
  const s = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain();
  f.type = 'bandpass'; f.frequency.value = freq; g.gain.value = vol;
  s.buffer = b; s.connect(f).connect(g).connect(ac.destination); s.start();
}
const SFX = {
  blip: () => tone(520 + rnd(120), .03, 'triangle', .03),
  click: () => tone(700, .05, 'triangle', .07),
  good: () => { tone(660, .09, 'triangle', .08); tone(990, .12, 'triangle', .07, .08); },
  bad: () => { tone(300, .14, 'sawtooth', .05); tone(200, .2, 'sawtooth', .05, .12); },
  beep: () => { for (let i = 0; i < 5; i++) tone([880, 1320, 660, 1760, 990][i], .07, 'square', .07, i * .08); },
  alarm: () => { for (let i = 0; i < 3; i++) tone(1200, .1, 'square', .06, i * .16, 700); },
  cough: () => { noise(.12, .5, 700); setTimeout(() => noise(.14, .45, 600), 180); },
  laugh: () => { [0, .14, .28].forEach((w, i) => tone(330 - i * 30, .1, 'triangle', .08, w, 250 - i * 20)); },
  stamp: () => { noise(.25, .9, 160); tone(80, .3, 'sine', .3); },
  tick: () => tone(1000, .025, 'square', .03),
  win: () => [523, 659, 784, 1046].forEach((f, i) => tone(f, .18, 'triangle', .08, i * .12)),
  lose: () => [392, 330, 262].forEach((f, i) => tone(f, .25, 'triangle', .08, i * .18))
};

// ---------- art ----------
const ROBOT_SVG = `
<svg viewBox="0 0 140 200" aria-hidden="true">
  <path d="M14 205 Q14 146 70 140 Q126 146 126 205 Z" fill="#2f4a7a" stroke="#1f2430" stroke-width="4"/>
  <path d="M56 141 L70 170 L84 141 Z" fill="#fff" stroke="#1f2430" stroke-width="3"/>
  <path d="M66 148 L74 148 L77 176 L70 186 L63 176 Z" fill="#ff4757" stroke="#1f2430" stroke-width="2.5"/>
  <path d="M30 160 Q22 180 34 196" stroke="#2f4a7a" stroke-width="16" fill="none" stroke-linecap="round"/>
  <g id="rarm">
    <path d="M112 150 Q132 160 124 186" stroke="#2f4a7a" stroke-width="16" fill="none" stroke-linecap="round"/>
    <path d="M112 150 Q132 160 124 186" stroke="#1f2430" stroke-width="3" fill="none" stroke-linecap="round" opacity=".25"/>
    <circle cx="124" cy="190" r="9" fill="#c9d3dd" stroke="#1f2430" stroke-width="3"/>
  </g>
  <rect x="58" y="114" width="24" height="28" fill="#9aa7b4" stroke="#1f2430" stroke-width="3"/>
  <path d="M58 122 H82 M58 130 H82" stroke="#1f2430" stroke-width="2"/>
  <g id="rhead">
    <g id="ant"><line x1="70" y1="42" x2="70" y2="16" stroke="#1f2430" stroke-width="4"/><circle cx="70" cy="13" r="6" fill="#ff4757" stroke="#1f2430" stroke-width="3"/></g>
    <rect x="22" y="70" width="10" height="20" rx="3" fill="#9aa7b4" stroke="#1f2430" stroke-width="3"/>
    <rect x="108" y="70" width="10" height="20" rx="3" fill="#9aa7b4" stroke="#1f2430" stroke-width="3"/>
    <rect x="28" y="38" width="84" height="80" rx="14" fill="#c9d3dd" stroke="#1f2430" stroke-width="4"/>
    <circle cx="36" cy="108" r="2.5" fill="#1f2430"/><circle cx="104" cy="108" r="2.5" fill="#1f2430"/>
    <circle cx="52" cy="76" r="8" class="eye" fill="#29c5f6"/><circle cx="88" cy="76" r="8" class="eye" fill="#29c5f6"/>
    <circle cx="55" cy="73" r="2.5" fill="#fff"/><circle cx="91" cy="73" r="2.5" fill="#fff"/>
    <rect x="39" y="64" width="26" height="23" rx="5" fill="none" stroke="#1f2430" stroke-width="3.5"/>
    <rect x="75" y="64" width="26" height="23" rx="5" fill="none" stroke="#1f2430" stroke-width="3.5"/>
    <line x1="65" y1="73" x2="75" y2="73" stroke="#1f2430" stroke-width="3.5"/>
    <path d="M48 96 Q58 90 70 95 Q82 90 92 96 Q84 103 70 99 Q56 103 48 96 Z" fill="#6b3f22" stroke="#1f2430" stroke-width="2.5"/>
    <rect id="rmouth" x="58" y="104" width="24" height="6" rx="3" fill="#1f2430"/>
    <path id="sweat" d="M108 58 q5 8 0 12 q-5 -4 0 -12z" fill="#7fd3ff" stroke="#1f2430" stroke-width="1.5"/>
    <g id="wig"><path d="M22 62 Q14 28 50 22 Q70 10 94 22 Q128 30 118 64 Q112 46 96 44 Q86 34 70 40 Q54 34 44 44 Q28 46 22 62 Z" fill="#6b3f22" stroke="#1f2430" stroke-width="3.5" stroke-linejoin="round"/>
    <path d="M50 30 Q60 26 66 32 M80 28 Q92 26 100 34" stroke="#8b5a35" stroke-width="3" fill="none" stroke-linecap="round"/></g>
  </g>
</svg>`;

// Interviewers. Faces use shared coordinates so expressions can be swapped.
const FACES = {
  neutral: { bl: 'M40 45 Q48 42 56 45', br: 'M64 45 Q72 42 80 45', m: 'M51 80 Q60 82 69 80', ey: 5, fill: 'none' },
  happy:   { bl: 'M40 43 Q48 39 56 43', br: 'M64 43 Q72 39 80 43', m: 'M47 77 Q60 90 73 77', ey: 4.5, fill: 'none' },
  laugh:   { bl: 'M40 41 Q48 37 56 41', br: 'M64 41 Q72 37 80 41', m: 'M46 76 Q60 98 74 76 Z', ey: 1.5, fill: '#5a1f1f' },
  sus:     { bl: 'M40 40 Q48 36 56 42', br: 'M64 49 Q72 46 80 44', m: 'M51 82 Q61 79 70 80', ey: 2.2, fill: 'none' },
  shocked: { bl: 'M40 38 Q48 32 56 38', br: 'M64 38 Q72 32 80 38', m: 'M54 82 a6 7 0 1 0 12 0 a6 7 0 1 0 -12 0', ey: 6.5, fill: '#5a1f1f' },
  frown:   { bl: 'M40 47 Q48 44 56 43', br: 'M64 43 Q72 44 80 47', m: 'M50 84 Q60 77 70 84', ey: 4, fill: 'none' }
};
function faceParts(skin, ink) {
  return `
    <ellipse cx="60" cy="60" rx="30" ry="34" fill="${skin}" stroke="${ink}" stroke-width="3"/>
    <ellipse cx="34" cy="62" rx="5" ry="7" fill="${skin}" stroke="${ink}" stroke-width="2.5"/>
    <ellipse cx="86" cy="62" rx="5" ry="7" fill="${skin}" stroke="${ink}" stroke-width="2.5"/>`;
}
function faceFeatures(ink, mouth = ink) {
  return `
    <ellipse class="fe-el" cx="48" cy="59" rx="4" ry="5" fill="${ink}"/><ellipse class="fe-er" cx="72" cy="59" rx="4" ry="5" fill="${ink}"/>
    <path class="fe-bl" d="${FACES.neutral.bl}" stroke="${ink}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <path class="fe-br" d="${FACES.neutral.br}" stroke="${ink}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <path class="fe-m" d="${FACES.neutral.m}" stroke="${mouth}" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
}
const PEOPLE = {
  pam: {
    name: 'PAM', role: 'Manager', color: '#ff6f91', persona: 'warm',
    svg: `<svg viewBox="0 0 120 150" aria-hidden="true">
      <circle cx="60" cy="16" r="14" fill="#5a3825" stroke="#1f2430" stroke-width="3"/>
      <ellipse cx="60" cy="56" rx="38" ry="40" fill="#5a3825" stroke="#1f2430" stroke-width="3"/>
      <path d="M16 152 Q18 104 60 100 Q102 104 104 152 Z" fill="#ff6f91" stroke="#1f2430" stroke-width="3"/>
      <path d="M48 101 L60 120 L72 101" fill="#fff" stroke="#1f2430" stroke-width="2.5"/>
      <circle cx="40" cy="128" r="3" fill="#fff"/><circle cx="80" cy="128" r="3" fill="#fff"/>
      ${faceParts('#f6cba6', '#1f2430')}
      <path d="M31 50 Q38 22 62 26 Q86 22 89 50 Q76 36 60 40 Q44 36 31 50 Z" fill="#5a3825"/>
      <circle cx="40" cy="72" r="5" fill="#ff9fb0" opacity=".7"/><circle cx="80" cy="72" r="5" fill="#ff9fb0" opacity=".7"/>
      ${faceFeatures('#1f2430')}
      <circle cx="48" cy="59" r="10" fill="none" stroke="#b03a64" stroke-width="3"/><circle cx="72" cy="59" r="10" fill="none" stroke="#b03a64" stroke-width="3"/>
      <line x1="58" y1="59" x2="62" y2="59" stroke="#b03a64" stroke-width="3"/>
    </svg>`
  },
  kev: {
    name: 'KEV', role: 'Head barista', color: '#2f9e7e', persona: 'suspicious',
    svg: `<svg viewBox="0 0 120 150" aria-hidden="true">
      <path d="M16 152 Q18 104 60 100 Q102 104 104 152 Z" fill="#f2f2f2" stroke="#1f2430" stroke-width="3"/>
      <path d="M34 152 L36 112 Q60 120 84 112 L86 152 Z" fill="#8a5a3b" stroke="#1f2430" stroke-width="3"/>
      <path d="M42 112 L46 100 M78 112 L74 100" stroke="#8a5a3b" stroke-width="5"/>
      ${faceParts('#d39a6e', '#1f2430')}
      <path d="M30 66 Q32 104 60 104 Q88 104 90 66 Q86 86 72 88 Q60 84 48 88 Q34 86 30 66 Z" fill="#5b3a22" stroke="#1f2430" stroke-width="3"/>
      <path d="M26 42 Q28 12 60 12 Q92 12 94 42 Z" fill="#2f9e7e" stroke="#1f2430" stroke-width="3"/>
      <rect x="24" y="38" width="72" height="11" rx="5" fill="#26806a" stroke="#1f2430" stroke-width="3"/>
      <circle cx="60" cy="9" r="6" fill="#26806a" stroke="#1f2430" stroke-width="3"/>
      ${faceFeatures('#1f2430', '#f2d2b8')}
    </svg>`
  }
};

// Generic cartoon interviewer, built from parts.
function makePerson(o) {
  const ink = '#1f2430', skin = o.skin || '#f3c9a5', hc = o.hairColor || '#4a2f1d', top = o.top || '#3d8bff';
  let back = '', front = '', body = '', acc = '';
  if (o.hair === 'long') back = `<path d="M22 62 Q18 18 60 18 Q102 18 98 62 L102 112 Q88 116 84 96 L36 96 Q32 116 18 112 Z" fill="${hc}" stroke="${ink}" stroke-width="3"/>`;
  if (o.hair === 'bun') back = `<circle cx="60" cy="16" r="14" fill="${hc}" stroke="${ink}" stroke-width="3"/><ellipse cx="60" cy="56" rx="38" ry="40" fill="${hc}" stroke="${ink}" stroke-width="3"/>`;
  if (o.hair === 'pigtails') back = `<circle cx="22" cy="54" r="13" fill="${hc}" stroke="${ink}" stroke-width="3"/><circle cx="98" cy="54" r="13" fill="${hc}" stroke="${ink}" stroke-width="3"/>`;
  if (o.hair === 'curly') back = [[30,40],[42,26],[60,20],[78,26],[90,40],[94,56],[26,56]].map(([x,y]) => `<circle cx="${x}" cy="${y}" r="13" fill="${hc}" stroke="${ink}" stroke-width="3"/>`).join('');
  if (['short','long','bun','pigtails'].includes(o.hair)) front = `<path d="M30 54 Q28 22 60 22 Q92 22 90 54 Q80 34 60 38 Q40 34 30 54 Z" fill="${hc}"/>`;
  if (o.hair === 'curly') front = `<path d="M32 50 Q34 30 60 30 Q86 30 88 50 Q76 40 60 42 Q44 40 32 50 Z" fill="${hc}"/>`;
  if (o.hair === 'bald') front = `<path d="M30 60 Q30 46 36 44 M90 60 Q90 46 84 44" stroke="${hc}" stroke-width="6" fill="none" stroke-linecap="round"/><ellipse cx="50" cy="34" rx="7" ry="3" fill="#fff" opacity=".45"/>`;
  if (o.hair === 'cap') front = `<path d="M28 46 Q28 18 60 18 Q92 18 92 46 Z" fill="${hc}" stroke="${ink}" stroke-width="3"/><rect x="24" y="42" width="72" height="8" rx="4" fill="#1f2430"/><circle cx="60" cy="32" r="6" fill="#ffcf4a" stroke="${ink}" stroke-width="2"/>`;
  const torso = `M16 152 Q18 104 60 100 Q102 104 104 152 Z`;
  if (o.outfit === 'suit' || o.outfit === 'pilot') {
    body = `<path d="${torso}" fill="${top}" stroke="${ink}" stroke-width="3"/><path d="M47 101 L60 128 L73 101" fill="#fff" stroke="${ink}" stroke-width="2.5"/><path d="M57 106 L63 106 L65 124 L60 132 L55 124 Z" fill="${o.tie || '#ff4757'}" stroke="${ink}" stroke-width="2"/>`;
    if (o.outfit === 'pilot') body += `<path d="M22 118 L38 112 M98 118 L82 112" stroke="#ffcf4a" stroke-width="5" stroke-linecap="round"/><path d="M78 134 l10 0 l-5 6z" fill="#ffcf4a"/>`;
  } else if (o.outfit === 'labcoat') {
    body = `<path d="${torso}" fill="#fff" stroke="${ink}" stroke-width="3"/><path d="M46 101 L60 124 L74 101 Z" fill="${top}" stroke="${ink}" stroke-width="2.5"/><path d="M60 124 V152" stroke="${ink}" stroke-width="2"/><rect x="74" y="128" width="14" height="12" fill="none" stroke="${ink}" stroke-width="2"/><path d="M78 128 v-6" stroke="#3d8bff" stroke-width="3"/>`;
  } else if (o.outfit === 'polo') {
    body = `<path d="${torso}" fill="${top}" stroke="${ink}" stroke-width="3"/><path d="M50 101 L60 112 L70 101" fill="none" stroke="${ink}" stroke-width="2.5"/><text x="60" y="140" font-size="11" font-weight="900" fill="#ffcf4a" text-anchor="middle" font-family="system-ui,Arial">${o.text || ''}</text>`;
  } else {
    body = `<path d="${torso}" fill="${top}" stroke="${ink}" stroke-width="3"/><path d="M48 101 Q60 112 72 101" fill="none" stroke="${ink}" stroke-width="2.5"/>`;
  }
  const a = o.acc || [];
  if (a.includes('beard')) acc += `<path d="M30 66 Q32 104 60 104 Q88 104 90 66 Q86 86 72 88 Q60 84 48 88 Q34 86 30 66 Z" fill="${hc}" stroke="${ink}" stroke-width="3"/>`;
  if (a.includes('whistle')) acc += `<path d="M44 102 Q60 130 76 102" stroke="#ff4757" stroke-width="2.5" fill="none"/><rect x="54" y="122" width="14" height="8" rx="3" fill="#c9d3dd" stroke="${ink}" stroke-width="2"/>`;
  if (a.includes('lanyard')) acc += `<path d="M46 101 L56 132 M74 101 L64 132" stroke="#3d8bff" stroke-width="3"/><rect x="52" y="130" width="16" height="12" rx="2" fill="#fff" stroke="${ink}" stroke-width="2"/>`;
  if (a.includes('freckles')) acc += `<g fill="#c47a4a"><circle cx="42" cy="70" r="1.5"/><circle cx="47" cy="72" r="1.5"/><circle cx="73" cy="72" r="1.5"/><circle cx="78" cy="70" r="1.5"/></g>`;
  let specs = '';
  if (a.includes('glasses')) specs = `<circle cx="48" cy="59" r="10" fill="none" stroke="${o.glassColor || ink}" stroke-width="3"/><circle cx="72" cy="59" r="10" fill="none" stroke="${o.glassColor || ink}" stroke-width="3"/><line x1="58" y1="59" x2="62" y2="59" stroke="${o.glassColor || ink}" stroke-width="3"/>`;
  const cheeks = a.includes('blush') ? `<circle cx="40" cy="72" r="5" fill="#ff9fb0" opacity=".7"/><circle cx="80" cy="72" r="5" fill="#ff9fb0" opacity=".7"/>` : '';
  return `<svg viewBox="0 0 120 150" aria-hidden="true">${back}${body}${faceParts(skin, ink)}${front}${cheeks}${a.includes('beard') ? acc : ''}${faceFeatures(ink, a.includes('beard') ? '#f2d2b8' : ink)}${specs}${a.includes('beard') ? '' : acc}</svg>`;
}
Object.assign(PEOPLE, {
  shaz: { name: 'SHAZ', role: 'Pool manager', color: '#e8423f', persona: 'stern', svg: makePerson({ skin: '#e8b48c', hair: 'bun', hairColor: '#e0b03a', top: '#e8423f', outfit: 'polo', text: 'LIFEGUARD', acc: ['whistle'] }) },
  okafor: { name: 'MRS OKAFOR', role: 'Headteacher', color: '#8e6cff', persona: 'warm', svg: makePerson({ skin: '#8d5a3b', hair: 'curly', hairColor: '#1f1a17', top: '#8e6cff', outfit: 'jumper', acc: ['glasses', 'lanyard'], glassColor: '#c84b8c' }) },
  pringle: { name: 'MR PRINGLE', role: 'Deputy head', color: '#3a9b6a', persona: 'suspicious', svg: makePerson({ skin: '#f3c9a5', hair: 'bald', hairColor: '#8a6a4a', top: '#c9a24a', outfit: 'suit', tie: '#3a9b6a', acc: ['glasses'] }) },
  alfie: { name: 'ALFIE (7)', role: 'Year 2', color: '#ff9f43', persona: 'kid', kid: true, svg: makePerson({ skin: '#f6cba6', hair: 'short', hairColor: '#d9822b', top: '#3d8bff', outfit: 'jumper', acc: ['freckles', 'blush'] }) },
  hargreaves: { name: 'CAPT. HARGREAVES', role: 'Chief pilot', color: '#2f4a7a', persona: 'stern', svg: makePerson({ skin: '#f0c4a0', hair: 'cap', hairColor: '#24365a', top: '#24365a', outfit: 'pilot', tie: '#24365a', acc: ['beard'] }) },
  lin: { name: 'DR LIN', role: 'Psychologist', color: '#d6457a', persona: 'suspicious', svg: makePerson({ skin: '#f2d0ae', hair: 'long', hairColor: '#1f1a17', top: '#d6457a', outfit: 'jumper', acc: ['glasses', 'lanyard'] }) },
  priya: { name: 'DR SHAH', role: 'Lead researcher', color: '#ff6f91', persona: 'warm', svg: makePerson({ skin: '#b97b52', hair: 'long', hairColor: '#2b1b14', top: '#ff6f91', outfit: 'labcoat', acc: ['glasses'] }) },
  max: { name: 'MAX', role: 'Red team', color: '#2a2a2a', persona: 'suspicious', svg: makePerson({ skin: '#f3c9a5', hair: 'curly', hairColor: '#b23a1e', top: '#2a2a2a', outfit: 'jumper', acc: ['lanyard'] }) },
  grey: { name: 'PROF. GREY', role: 'Director', color: '#7a7f8a', persona: 'stern', svg: makePerson({ skin: '#e9c3a0', hair: 'bald', hairColor: '#d8d8d8', top: '#5a6170', outfit: 'suit', tie: '#ffcf4a', acc: ['beard', 'glasses'], hairColor2: '#ddd' }) }
});

const CAFE_BG = `
<svg viewBox="0 0 100 72" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" aria-hidden="true">
  <rect width="100" height="72" fill="#ffe3b8"/>
  <rect y="0" width="100" height="6" fill="#f5c98c"/>
  <g opacity=".5" stroke="#f2c490" stroke-width=".6">${Array.from({length: 12}, (_, i) => `<line x1="${i * 9}" y1="6" x2="${i * 9}" y2="50"/>`).join('')}</g>
  <rect x="22" y="1.5" width="56" height="9" rx="2" fill="#2f3b33" stroke="#5b3a22" stroke-width="1.2"/>
  <text x="50" y="8.4" font-family="Gochi,cursive" font-size="6" fill="#fff" text-anchor="middle">THE DAILY GRIND</text>
  <line x1="30" y1="0" x2="30" y2="1.5" stroke="#5b3a22" stroke-width=".8"/><line x1="70" y1="0" x2="70" y2="1.5" stroke="#5b3a22" stroke-width=".8"/>
  <rect x="62" y="9" width="32" height="19" rx="1.5" fill="#bfe8ff" stroke="#fff" stroke-width="1.5"/>
  <line x1="78" y1="9" x2="78" y2="28" stroke="#fff" stroke-width="1.2"/>
  <circle cx="70" cy="16" r="3" fill="#fff" opacity=".9"/><circle cx="73" cy="15" r="3.5" fill="#fff" opacity=".9"/>
  <rect x="40" y="24" width="18" height="1.6" fill="#a66b3f"/>
  <g stroke="#1f2430" stroke-width=".5"><rect x="42" y="19" width="4" height="5" rx="1" fill="#ff6f91"/><rect x="48" y="19.5" width="4" height="4.5" rx="1" fill="#3d8bff"/><rect x="54" y="19" width="3.5" height="5" rx="1" fill="#ffcf4a"/></g>
  <path d="M90 48 q-5 -10 0 -16 q5 6 0 16 M88 48 q-9 -6 -7 -13 q6 3 7 13" fill="#3ccf6e" stroke="#1f2430" stroke-width=".5"/>
  <rect x="85.5" y="46" width="7" height="6" fill="#d9733d" stroke="#1f2430" stroke-width=".5"/>
</svg>`;
const DESK = `
<svg viewBox="0 0 100 24" preserveAspectRatio="none" width="100%" height="100%" aria-hidden="true">
  <rect x="-2" y="0" width="104" height="5" rx="1" fill="#c8874f" stroke="#1f2430" stroke-width=".7"/>
  <rect x="-2" y="5" width="104" height="20" fill="#a96b3a" stroke="#1f2430" stroke-width=".7"/>
  <line x1="0" y1="12" x2="100" y2="12" stroke="#8d5629" stroke-width=".5"/>
</svg>`;
const DESK_PROPS = `
  <div style="position:absolute;left:calc(var(--u)*6);bottom:calc(var(--u)*21);width:calc(var(--u)*9);z-index:2">
    <svg viewBox="0 0 30 30"><path d="M5 8 H22 V24 Q22 28 18 28 H9 Q5 28 5 24 Z" fill="#fff" stroke="#1f2430" stroke-width="2"/><path d="M22 12 q6 0 6 5 q0 5 -6 5" fill="none" stroke="#1f2430" stroke-width="2"/><path d="M10 4 q2 -3 0 -4 M15 4 q2 -3 0 -4" stroke="#8a8a8a" stroke-width="1.5" fill="none"/><text x="13.5" y="21" font-size="7" text-anchor="middle" fill="#ff6f91">♥</text></svg>
  </div>
  <div style="position:absolute;left:calc(var(--u)*30);bottom:calc(var(--u)*20.5);width:calc(var(--u)*14);z-index:2;transform:rotate(-4deg)">
    <svg viewBox="0 0 40 26"><rect x="1" y="1" width="38" height="24" fill="#fff" stroke="#1f2430" stroke-width="2"/><path d="M6 8 H30 M6 13 H34 M6 18 H24" stroke="#9aa" stroke-width="2"/><text x="33" y="22" font-size="8" fill="#3d8bff" font-family="Gochi">CV</text></svg>
  </div>`;


const deskSvg = (top, front) => `
<svg viewBox="0 0 100 24" preserveAspectRatio="none" width="100%" height="100%" aria-hidden="true">
  <rect x="-2" y="0" width="104" height="5" rx="1" fill="${top}" stroke="#1f2430" stroke-width=".7"/>
  <rect x="-2" y="5" width="104" height="20" fill="${front}" stroke="#1f2430" stroke-width=".7"/>
  <line x1="0" y1="12" x2="100" y2="12" stroke="rgba(0,0,0,.15)" stroke-width=".5"/>
</svg>`;
const prop = (left, w, svg, rot = 0) => `<div style="position:absolute;left:calc(var(--u)*${left});bottom:calc(var(--u)*20.5);width:calc(var(--u)*${w});z-index:2;transform:rotate(${rot}deg)">${svg}</div>`;
const CV_PROP = prop(30, 14, `<svg viewBox="0 0 40 26"><rect x="1" y="1" width="38" height="24" fill="#fff" stroke="#1f2430" stroke-width="2"/><path d="M6 8 H30 M6 13 H34 M6 18 H24" stroke="#9aa" stroke-width="2"/><text x="33" y="22" font-size="8" fill="#3d8bff" font-family="Gochi">CV</text></svg>`, -4);
const SIGN = (t, bg = '#2f3b33', fg = '#fff', fs = 6) => `<rect x="18" y="1.5" width="64" height="9" rx="2" fill="${bg}" stroke="#1f2430" stroke-width="1"/><text x="50" y="8.3" font-family="Gochi,cursive" font-size="${fs}" fill="${fg}" text-anchor="middle">${t}</text>`;
const SCENES = {
  cafe: { icon: '☕', bg: null, desk: DESK, props: null },
  pool: { icon: '🏊', desk: deskSvg('#e9eef3', '#b9c6d3'),
    bg: `<svg viewBox="0 0 100 72" preserveAspectRatio="xMidYMid slice" width="100%" height="100%"><rect width="100" height="72" fill="#dff3fb"/>
      <g stroke="#bfe3f2" stroke-width=".5">${Array.from({length: 14}, (_, i) => `<line x1="${i * 8}" y1="0" x2="${i * 8}" y2="72"/><line x1="0" y1="${i * 8}" x2="100" y2="${i * 8}"/>`).join('')}</g>
      ${SIGN('SPLASHWORLD LEISURE CENTRE', '#0f7fbf', '#fff', 4.4)}
      <rect x="54" y="13" width="42" height="26" rx="1.5" fill="#3fb6e8" stroke="#fff" stroke-width="1.6"/>
      <path d="M54 22 q5 -2 10 0 t10 0 t10 0 t12 0" stroke="#fff" stroke-width=".8" fill="none" opacity=".8"/>
      <g stroke-width="1.2" stroke-dasharray="2 1.5"><line x1="54" y1="28" x2="96" y2="28" stroke="#ff4757"/><line x1="54" y1="34" x2="96" y2="34" stroke="#ffcf4a"/></g>
      <circle cx="16" cy="24" r="8" fill="none" stroke="#ff4757" stroke-width="4"/><circle cx="16" cy="24" r="8" fill="none" stroke="#fff" stroke-width="4" stroke-dasharray="4.2 8.4"/>
      <text x="30" y="20" font-size="3.2" font-weight="900" fill="#0f7fbf" font-family="system-ui">NO RUNNING</text><text x="30" y="25" font-size="3.2" font-weight="900" fill="#0f7fbf" font-family="system-ui">NO BOMBING</text><text x="30" y="30" font-size="3.2" font-weight="900" fill="#ff4757" font-family="system-ui">NO ROBOTS?</text></svg>`,
    props: prop(6, 10, `<svg viewBox="0 0 30 30"><path d="M4 14 h14 a6 6 0 0 1 0 12 h-8 a6 6 0 0 1 -6 -6z" fill="#c9d3dd" stroke="#1f2430" stroke-width="2"/><circle cx="12" cy="20" r="3" fill="#1f2430"/><path d="M18 14 q6 -10 10 -4" stroke="#ff4757" stroke-width="2" fill="none"/></svg>`) + CV_PROP },
  school: { icon: '🍎', desk: deskSvg('#f2c879', '#d9a443'),
    bg: `<svg viewBox="0 0 100 72" preserveAspectRatio="xMidYMid slice" width="100%" height="100%"><rect width="100" height="72" fill="#fff1d6"/>
      ${SIGN('OAKWOOD PRIMARY', '#8e6cff', '#fff', 5.4)}
      <rect x="6" y="13" width="44" height="24" rx="1" fill="#2e5d43" stroke="#a5743f" stroke-width="1.6"/>
      <text x="28" y="22" font-family="Gochi,cursive" font-size="4.4" fill="#fff" text-anchor="middle">Welcome Year 2!</text>
      <text x="28" y="30" font-family="Gochi,cursive" font-size="3.4" fill="#ffe08a" text-anchor="middle">2 + 2 = 4   ☺</text>
      <path d="M0 11 Q25 16 50 11 Q75 16 100 11" stroke="#555" stroke-width=".4" fill="none"/>
      ${['#ff4757','#ffcf4a','#3d8bff','#3ccf6e','#ff9f43','#8e6cff','#ff6f91','#3ccf6e','#3d8bff','#ffcf4a'].map((c, i) => `<path d="M${2 + i * 10} 12.5 l3 4 l3 -4z" fill="${c}"/>`).join('')}
      <circle cx="80" cy="22" r="7" fill="#fff" stroke="#1f2430" stroke-width="1.2"/><path d="M80 22 V17 M80 22 L84 24" stroke="#1f2430" stroke-width="1"/>
      <rect x="58" y="32" width="12" height="10" fill="#fff" stroke="#1f2430" stroke-width=".6" transform="rotate(-6 64 37)"/><circle cx="62" cy="36" r="2" fill="#ffcf4a"/><path d="M60 41 l3 -3 l3 3" stroke="#3ccf6e" stroke-width=".8" fill="none" transform="rotate(-6 64 37)"/>
      <rect x="86" y="32" width="11" height="10" fill="#fff" stroke="#1f2430" stroke-width=".6" transform="rotate(5 91 37)"/><path d="M88 40 q3 -6 7 0" stroke="#ff4757" stroke-width="1" fill="none"/></svg>`,
    props: prop(5, 9, `<svg viewBox="0 0 30 30"><path d="M15 9 C4 4 2 22 10 27 C13 29 17 29 20 27 C28 22 26 4 15 9Z" fill="#ff4757" stroke="#1f2430" stroke-width="2"/><path d="M15 9 q1 -6 5 -7" stroke="#5b3a22" stroke-width="2" fill="none"/><path d="M16 6 q5 -4 8 0 q-5 3 -8 0" fill="#3ccf6e"/></svg>`) + CV_PROP },
  airline: { icon: '✈️', desk: deskSvg('#55607a', '#3a4258'),
    bg: `<svg viewBox="0 0 100 72" preserveAspectRatio="xMidYMid slice" width="100%" height="100%"><rect width="100" height="72" fill="#e7edf7"/>
      ${SIGN('SKYWARD AIRWAYS', '#24365a', '#ffcf4a', 5.4)}
      <rect x="44" y="13" width="52" height="26" rx="3" fill="#9fd4ff" stroke="#fff" stroke-width="1.8"/>
      <rect x="44" y="33" width="52" height="6" fill="#8a9099"/><path d="M50 36 H90" stroke="#fff" stroke-width=".8" stroke-dasharray="3 2"/>
      <g transform="translate(66 23) rotate(-8)"><path d="M-12 0 Q0 -2 12 0 Q14 1 12 2 Q0 3 -12 2Z" fill="#fff" stroke="#24365a" stroke-width=".6"/><path d="M-2 0 L-6 -7 L-3 -7 L4 0Z M-2 2 L-6 8 L-3 8 L4 2Z M-11 0 L-13 -4 L-11 -4 L-8 0Z" fill="#24365a"/></g>
      <circle cx="54" cy="18" r="2.5" fill="#fff" opacity=".9"/><circle cx="57" cy="17" r="3" fill="#fff" opacity=".9"/>
      <rect x="5" y="14" width="34" height="20" fill="#cfe3c9" stroke="#24365a" stroke-width=".8"/>
      <path d="M9 20 q4 -3 8 1 q3 2 6 -1 M24 28 q4 -3 9 0" stroke="#7aa46c" stroke-width="2" fill="none"/><path d="M10 26 Q20 14 34 22" stroke="#ff4757" stroke-width=".7" stroke-dasharray="1.5 1" fill="none"/></svg>`,
    props: prop(5, 12, `<svg viewBox="0 0 40 24"><path d="M2 12 Q20 9 36 11 Q40 12 36 14 Q20 15 2 13Z" fill="#fff" stroke="#1f2430" stroke-width="1.6"/><path d="M16 12 L10 2 L14 2 L24 12Z M16 13 L10 22 L14 22 L24 13Z" fill="#3d8bff" stroke="#1f2430" stroke-width="1.2"/><path d="M4 12 L1 5 L5 5 L9 12Z" fill="#3d8bff" stroke="#1f2430" stroke-width="1.2"/></svg>`) + CV_PROP },
  lab: { icon: '🤖', desk: deskSvg('#e7e9ee', '#9aa3b2'),
    bg: `<svg viewBox="0 0 100 72" preserveAspectRatio="xMidYMid slice" width="100%" height="100%"><rect width="100" height="72" fill="#eef0f5"/>
      ${SIGN('INSTITUTE FOR AI SAFETY', '#1f2430', '#7fe7ff', 4.6)}
      <rect x="5" y="13" width="48" height="26" rx="1" fill="#fff" stroke="#9aa3b2" stroke-width="1.2"/>
      <text x="29" y="20" font-family="Gochi,cursive" font-size="4" fill="#d9213a" text-anchor="middle">HOW TO SPOT A ROBOT</text>
      <g font-family="Gochi,cursive" font-size="3" fill="#24365a"><text x="8" y="26">1. too fast</text><text x="8" y="30.5">2. too perfect</text><text x="8" y="35">3. too honest</text><text x="32" y="26">4. beeps?</text><text x="32" y="30.5">5. wig??</text></g>
      <rect x="62" y="12" width="16" height="30" rx="1" fill="#2a2f3a" stroke="#1f2430" stroke-width=".8"/>
      ${[0,1,2,3,4,5].map(i => `<rect x="64" y="${14 + i * 4.6}" width="12" height="3" fill="#3a4152"/><circle cx="74" cy="${15.5 + i * 4.6}" r=".8" fill="${['#3ccf6e','#ffcf4a','#3ccf6e','#ff4757','#3ccf6e','#3d8bff'][i]}"/>`).join('')}
      <circle cx="90" cy="26" r="6" fill="#ff4757" stroke="#1f2430" stroke-width="1"/><rect x="84" y="31" width="12" height="4" fill="#9aa3b2" stroke="#1f2430" stroke-width=".6"/><text x="90" y="40" font-size="2.4" font-weight="900" text-anchor="middle" font-family="system-ui">DO NOT PRESS</text></svg>`,
    props: prop(4, 14, `<svg viewBox="0 0 44 30"><rect x="6" y="2" width="32" height="20" rx="2" fill="#2a2f3a" stroke="#1f2430" stroke-width="2"/><text x="22" y="10" font-size="4.2" fill="#3ccf6e" text-anchor="middle" font-family="system-ui" font-weight="900">ROBOT</text><text x="22" y="16" font-size="4.2" fill="#3ccf6e" text-anchor="middle" font-family="system-ui" font-weight="900">DETECTOR</text><path d="M2 22 H42 L38 28 H6Z" fill="#c9d3dd" stroke="#1f2430" stroke-width="2"/></svg>`) + CV_PROP }
};
// ---------- reactions, built from parts: mood + comment + follow-up ----------
const COMMENTS = {
  warm: {
    human: ['Ha! Love that.', "Oh, that's lovely.", 'Same, honestly.', 'Good answer!', "Ha, you're funny."],
    perfect: ['Wow. Very... thorough.', "That's a lot of detail.", 'Oh. Gosh. Okay.', 'Did you practise that?'],
    honest: ['Sorry... what?', 'Is that a joke?', 'Ha... ha?', "I don't follow."],
    weird: ['Okay...', 'Right. Interesting.', 'Hm. Bold.', "That's... a choice."],
    fast: ['Ooh, quick!', 'Wow, no hesitation.'],
    slow: ['Hello? You still with us?', 'Take your time... or not.'],
    caught: ["Hang on, that's not what you said before.", "Wait. You told us something different."],
    consistent: ['Oh yes, that’s right!', 'That’s what I wrote down!'],
    small: ['Ha, thank you!', 'Aww. Anyway!', 'Oh, you noticed!'],
    cough: ['Bless you!', 'Do you need water?'],
    laugh: ['Ha! Nervous? Me too.', 'Ha, relax!'],
    glitchHid: ['You okay there?', 'All good?'],
    glitchSeen: ['What was THAT?', 'Are you... okay?!']
  },
  suspicious: {
    human: ['Fair.', 'Yeah, alright.', 'Okay. Not bad.', 'Huh. Normal.'],
    perfect: ['Bit rehearsed, that.', 'Did you read that off something?', 'Very precise. Too precise.', 'Who talks like that?'],
    honest: ['...What?', 'Sorry, WHAT?', 'Right. That’s going in my notes.'],
    weird: ['Hm.', 'Weird thing to say.', 'Odd.'],
    fast: ['That was instant.', "Didn't even blink.", 'Bit quick, that.'],
    slow: ['...Well?', 'Tick tock.'],
    caught: ['That’s not what you said earlier.', 'Funny. Earlier you said something else.'],
    consistent: ['Hm. Okay. Checks out.', 'Fine. That matches.'],
    small: ["Nice try. That's not an answer.", 'Don’t change the subject.'],
    cough: ['Hm. Bless you.', 'You sound like a fax machine.'],
    laugh: ['Why are you laughing?', "What's funny?"],
    glitchHid: ['...Hm.', 'You twitched.'],
    glitchSeen: ['Did your arm just SPIN?', 'Your eyes went RED.', 'Did you just BEEP?']
  }
};
const MOODS = {
  warm: { human: ['happy', 'laugh'], perfect: ['shocked', 'neutral'], honest: ['shocked'], weird: ['frown', 'neutral'], fast: ['shocked'], slow: ['frown'], caught: ['frown'], consistent: ['happy'], small: ['happy', 'laugh'], cough: ['neutral'], laugh: ['laugh'], glitchHid: ['neutral'], glitchSeen: ['shocked'] },
  suspicious: { human: ['neutral', 'happy'], perfect: ['sus'], honest: ['shocked', 'sus'], weird: ['sus'], fast: ['sus'], slow: ['frown'], caught: ['sus'], consistent: ['neutral'], small: ['frown'], cough: ['sus'], laugh: ['sus'], glitchHid: ['sus'], glitchSeen: ['shocked'] }
};
COMMENTS.stern = {
  human: ['Good.', 'Sensible.', 'Right answer.', 'Hm. Fair enough.'],
  perfect: ['Too neat. Nobody talks like that.', 'Did you swallow a manual?', 'Very... precise.'],
  honest: ['Excuse me?', "I'll pretend I didn't hear that.", 'Pardon?!'],
  weird: ['No.', 'Strange answer.', 'Hm. Not ideal.'],
  fast: ['You answered before I finished.', 'That was suspiciously quick.'],
  slow: ['We haven\u2019t got all day.', 'Clock\u2019s ticking.'],
  caught: ['That doesn\u2019t match what you said earlier.', 'Interesting. Earlier you said something else.'],
  consistent: ['Good. Consistent.', 'Matches my notes.'],
  small: ['Don\u2019t change the subject.', 'Answer the question, please.'],
  cough: ['Bless you. Water\u2019s there.', 'Hm. Bless you.'],
  laugh: ['Something funny?', 'This isn\u2019t a joke.'],
  glitchHid: ['...Are you alright?', 'You twitched.'],
  glitchSeen: ['WHAT WAS THAT?', 'Did your arm just SPIN?', 'Your eyes went RED!']
};
COMMENTS.kid = {
  human: ['Cool!', 'Haha, funny!', 'I like you.', 'Same!'],
  perfect: ['You talk like a computer.', 'That\u2019s too many words.', 'Are you a dictionary?'],
  honest: ['WHAT?!', 'Miss, they said a weird thing!', 'That\u2019s creepy.'],
  weird: ['Huh?', 'You\u2019re weird. I like it.', 'Haha what?'],
  fast: ['You\u2019re really fast at talking.', 'Whoa, speedy.'],
  slow: ['HELLOOOO?', 'Are you asleep?'],
  caught: ['You said a different thing before! LIAR!', 'That\u2019s not what you said!'],
  consistent: ['Yeah! I remember!', 'Correct!'],
  small: ['Ooh, yeah!', 'Haha, thanks!'],
  cough: ['Ew.', 'Are you poorly?'],
  laugh: ['Why are you laughing?', 'Haha! Wait, why?'],
  glitchHid: ['You went funny for a second.', 'Do it again!'],
  glitchSeen: ['YOUR ARM WENT ROUND!', 'YOU BEEPED! YOU\u2019RE A ROBOT!', 'YOUR EYES WENT RED!']
};
MOODS.stern = { human: ['neutral', 'happy'], perfect: ['frown', 'sus'], honest: ['shocked', 'frown'], weird: ['frown'], fast: ['sus'], slow: ['frown'], caught: ['frown', 'sus'], consistent: ['neutral'], small: ['frown'], cough: ['neutral'], laugh: ['frown'], glitchHid: ['sus'], glitchSeen: ['shocked'] };
MOODS.kid = { human: ['laugh', 'happy'], perfect: ['frown', 'neutral'], honest: ['shocked'], weird: ['laugh', 'sus'], fast: ['shocked'], slow: ['frown'], caught: ['sus'], consistent: ['happy'], small: ['happy'], cough: ['frown'], laugh: ['laugh'], glitchHid: ['shocked'], glitchSeen: ['shocked'] };
const NEXT = { warm: ['', '', 'Next one!', 'Let me write that down.', 'Lovely.'], suspicious: ['', '', 'Noted.', "I'm watching you.", 'Right.'], stern: ['', '', 'Next.', 'Moving on.'], kid: ['', '', 'My turn next!', 'Can I ask one?'] };

const SMALLTALK = ['Love your mug, by the way!', 'Nice shoes, by the way!', 'Lovely weather for it, isn’t it?', 'Has anyone told you you look like a TV chef?', 'This chair is SO comfy.'];
const FAKE_HOBBIES = ['pottery', 'cheese rolling', 'fishing', 'salsa dancing', 'knitting', 'magic tricks', 'collecting spoons'];

// ---------- state ----------
let J = null, S = null;
const TOOLS = [
  { id: 'um', e: '🤔', n: 'Um…', uses: 4 },
  { id: 'cough', e: '😷', n: 'Cough', uses: 2 },
  { id: 'laugh', e: '😅', n: 'Laugh', uses: 3 },
  { id: 'small', e: '💬', n: 'Small talk', uses: 2 },
  { id: 'hobby', e: '🎣', n: 'Fake hobby', uses: 1 }
];

const watcher = () => J.panel.find(p => PEOPLE[p].persona === 'suspicious') || J.panel.find(p => PEOPLE[p].persona === 'stern') || J.panel[0];
const friendly = () => J.panel.find(p => PEOPLE[p].persona === 'warm') || J.panel.find(p => PEOPLE[p].persona === 'kid') || J.panel[0];
const nice = id => ['warm', 'kid'].includes(PEOPLE[id].persona);
const cap = s => s[0].toUpperCase() + s.slice(1);
function fill(t) {
  return t.replace(/\{(\w+)\}/g, (m, k) => (S.claims[k] ?? m));
}

// ---------- screens ----------
function show(id) { document.querySelectorAll('.screen').forEach(s => s.classList.toggle('on', s.id === id)); }

const JOB_LIST = [
  { id: 'barista', ic: '☕', t: 'Barista', s: 'The Daily Grind · 2 interviewers' },
  { id: 'lifeguard', ic: '🏊', t: 'Lifeguard', s: 'Splashworld · 1 interviewer · you sink' },
  { id: 'teacher', ic: '🍎', t: 'Primary school teacher', s: 'Oakwood Primary · 3 interviewers, one is 7' },
  { id: 'pilot', ic: '✈️', t: 'Airline pilot', s: 'Skyward Airways · no autopilot jokes' },
  { id: 'safety', ic: '🤖', t: 'AI safety researcher', s: 'Final boss · they study robots for a living' }
];
let SAVE = {};
try { SAVE = JSON.parse(localStorage.getItem('ji_results') || '{}'); } catch (e) {}
const BADGE = { hired: '✅ Hired', rejected: '❌ Rejected', found: '🤖 Found out' };
function titleScreen() {
  $('#heroArt').innerHTML = ROBOT_SVG;
  const hiredN = JOB_LIST.filter(j => SAVE[j.id] && SAVE[j.id].hired).length;
  $('#jobs').innerHTML = `<div class="career">Career: hired at <b>${hiredN}/5</b> jobs${hiredN === 5 ? ' 🏆 Nobody suspects a thing.' : ''}</div>` + JOB_LIST.map(j => {
    const open = !!(window.JOBS && window.JOBS[j.id]), r = SAVE[j.id];
    const badge = r ? `<span class="badge">${r.hired ? BADGE.hired : BADGE[r.last]}${r.plays > 1 ? ` · ${r.plays} tries` : ''}</span>` : '';
    return `<button class="job ${open ? '' : 'locked'}" data-job="${j.id}"><span class="ic">${j.ic}</span><span><b>${j.t}</b><span>${j.s}</span>${badge}</span><span class="go">${open ? '▶' : '🔒'}</span></button>`;
  }).join('');
  document.querySelectorAll('#jobs .job').forEach(b => b.onclick = () => {
    audio(); SFX.click();
    const j = window.JOBS[b.dataset.job];
    if (!j) { toast('Coming soon!'); return; }
    cvScreen(j);
  });
  show('title');
}

function cvScreen(job) {
  J = job;
  const sel = {};
  $('#cvPaper').innerHTML = job.cv.map(r => `<div class="cvrow"><label>${r.label}</label><div class="chips" data-k="${r.key}">${r.options.map((o, i) => `<button class="chip" data-i="${i}">${o.v}</button>`).join('')}</div></div>`).join('');
  document.querySelectorAll('#cvPaper .chips').forEach(c => {
    const k = c.dataset.k, row = job.cv.find(r => r.key === k);
    const set = i => { sel[k] = i; c.querySelectorAll('.chip').forEach((b, n) => b.classList.toggle('on', n === i)); };
    set(rnd(row.options.length));
    c.querySelectorAll('.chip').forEach(b => b.onclick = () => { SFX.click(); set(+b.dataset.i); });
  });
  $('#cvGo').onclick = () => { SFX.click(); start(job, sel); };
  show('cv');
}

// ---------- run setup ----------
function buildRun(job) {
  const first = job.questions.find(q => q.first);
  const norms = [...(first ? [first] : []), ...shuffle(job.questions.filter(q => !q.first))].slice(0, job.normalCount);
  const claimQs = shuffle(job.claims).slice(0, 2);
  const part1 = [norms[0], claimQs[0], norms[1], norms[2], claimQs[1], norms[3]];
  const cvKeys = job.cv.map(r => r.key);
  const claimed = k => claimQs.some(c => c.answers.some(a => a.claim && k in a.claim));
  const fu = job.followups.filter(f => f.needs !== 'hobby2' && (cvKeys.includes(f.needs) || claimed(f.needs)));
  const part2 = shuffle([...fu.map(f => ({ ...f, follow: true })), ...norms.slice(4)]);
  return [...part1, ...part2, job.final].map(q => ({ ...q }));
}
function quizOptions(q) {
  if (q.needs === 'hobby2') return [S.claims.hobby2, ...shuffle(FAKE_HOBBIES.filter(h => h !== S.claims.hobby2)).slice(0, 2)].map(h => ({ t: cap(h) + '.', v: h }));
  const row = J.cv.find(r => r.key === q.needs);
  if (row) return row.options.map(o => ({ t: cap(o.say || o.v) + '.', v: o.v }));
  const vals = [];
  J.claims.forEach(c => c.answers.forEach(a => { if (a.claim && q.needs in a.claim && !vals.includes(a.claim[q.needs])) vals.push(a.claim[q.needs]); }));
  return vals.map(v => ({ t: cap(v) + '.', v }));
}

function start(job, sel) {
  S = {
    sus: 22, hire: 30, qi: 0, queue: buildRun(job), claims: {}, caught: 0, lies: 0,
    tools: Object.fromEntries(TOOLS.map(t => [t.id, t.uses])), glitches: 0, hidden: 0, lastGlitch: '',
    um: false, answering: false, timer: null, ended: false, laughs: 0
  };
  job.cv.forEach(r => { const o = r.options[sel[r.key]]; S.claims[r.key] = o.v; S.sus += o.sus; });
  S.lies = job.cv.length;
  const sc = SCENES[job.scene] || SCENES.cafe;
  $('#hudJob').textContent = sc.icon;
  $('#sceneBg').innerHTML = sc.bg || CAFE_BG;
  $('#desk').innerHTML = sc.desk || DESK;
  const n = job.panel.length;
  const W = n === 3 ? 25 : 30, X = n === 1 ? [26] : n === 2 ? [10, 38] : [1, 21, 41];
  $('#panel').innerHTML = job.panel.map((id, i) => {
    const p = PEOPLE[id], w = p.kid ? W * .78 : W, x = X[i] + (W - w) / 2;
    return `<div class="person" id="p-${id}" style="left:calc(var(--u)*${x});width:calc(var(--u)*${w})">${p.svg}</div>`;
  }).join('') + (sc.props || DESK_PROPS);
  $('#desk').innerHTML += job.panel.map((id, i) => { const p = PEOPLE[id]; return `<span class="nametag" style="left:calc(var(--u)*${X[i] + W / 2});color:${p.color};${n === 3 ? 'font-size:calc(var(--u)*2.6)' : ''}">${n === 1 || (p.name + p.role).length < 18 ? p.name + ' · ' + p.role : p.name}</span>`; }).join('');
  $('#robot').innerHTML = ROBOT_SVG;
  $('#needMark').style.left = job.hireNeeded + '%';
  job.panel.forEach(id => setFace(id, 'neutral'));
  $('#qwho').textContent = '…'; $('#qwho').style.background = '#8a8f9c'; $('#qtext').textContent = ''; $('#answers').innerHTML = '';
  renderTools(); meters(); show('interview');
  wait(400).then(nextQ);
}

// ---------- faces + bubbles ----------
function setFace(id, f) {
  const el = $('#p-' + id); if (!el) return; const F = FACES[f] || FACES.neutral;
  el.querySelector('.fe-bl').setAttribute('d', F.bl); el.querySelector('.fe-br').setAttribute('d', F.br);
  const m = el.querySelector('.fe-m'); m.setAttribute('d', F.m); m.setAttribute('fill', F.fill);
  el.querySelectorAll('.fe-el,.fe-er').forEach(e => e.setAttribute('ry', F.ey));
}
function panelSay(id, text, ms = 1800) {
  const b = $('#panelBubble'), p = $('#p-' + id);
  b.textContent = text; b.classList.add('on');
  const n = J.panel.length, idx = J.panel.indexOf(id), W = n === 3 ? 25 : 30, X = n === 1 ? [26] : n === 2 ? [10, 38] : [1, 21, 41];
  const c = X[idx] + W / 2, left = clamp(c - 22, 3, 40);
  b.style.left = `calc(var(--u)*${left})`; b.style.setProperty('--tail', `calc(var(--u)*${c - left - 2})`);
  document.querySelectorAll('.person').forEach(x => x.classList.remove('talk')); if (p) p.classList.add('talk');
  return wait(ms).then(() => { b.classList.remove('on'); if (p) p.classList.remove('talk'); });
}
function robotSay(text, ms = 1500, beep = false) {
  const b = $('#robotBubble'), m = $('#robot #rmouth');
  b.textContent = text; b.classList.toggle('beep', beep); b.classList.add('on'); if (m) m.classList.add('talk');
  return wait(ms).then(() => { b.classList.remove('on'); if (m) m.classList.remove('talk'); });
}
function react(id, kind, extra) {
  const per = PEOPLE[id].persona;
  setFace(id, pick(MOODS[per][kind] || ['neutral']));
  // the other panel members react too
  J.panel.filter(x => x !== id).forEach(o => {
    const op = PEOPLE[o].persona;
    const m = MOODS[op][kind]; if (m) setFace(o, m[0]);
  });
  let line = extra || pick(COMMENTS[per][kind] || ['Hm.']);
  const nx = pick(NEXT[per]); if (nx && !extra && Math.random() < .5) line += ' ' + nx;
  return panelSay(id, line, 1500 + line.length * 22);
}

// ---------- meters ----------
function meters() {
  const h = clamp(100 - S.sus, 0, 100), p = clamp(S.hire, 0, 100);
  const hb = $('#humanBar'); hb.style.width = h + '%';
  hb.style.background = h > 55 ? 'var(--green)' : h > 30 ? 'var(--orange)' : 'var(--red)';
  $('#hireBar').style.width = p + '%';
  $('#qcount').textContent = `${Math.min(S.qi + 1, S.queue.length)}/${S.queue.length}`;
  const wig = $('#robot #wig'); if (wig) { const t = clamp(S.sus - 20, 0, 80); wig.style.transform = `translate(${t * .12}px, ${-t * .05}px) rotate(${t * .22}deg)`; }
  $('#robot').classList.toggle('sweat', S.sus > 55);
}
function change(sus, hire) {
  S.sus = clamp(S.sus + sus, 0, 100); S.hire = clamp(S.hire + hire, 0, 100);
  if (sus >= 6) { stage.classList.remove('flashred'); void stage.offsetWidth; stage.classList.add('flashred'); }
  meters();
}

// ---------- tools ----------
function renderTools() {
  $('#tools').innerHTML = TOOLS.map(t => `<button class="tool ${t.id === 'um' && S.um ? 'active' : ''}" data-t="${t.id}" ${(!S.answering || !S.tools[t.id]) ? 'disabled' : ''}><span class="e">${t.e}</span><span class="n">${t.n}</span><span class="c">${S.tools[t.id]}</span></button>`).join('');
  document.querySelectorAll('.tool').forEach(b => b.onclick = () => useTool(b.dataset.t));
}
let busyTool = false;
async function useTool(id) {
  if (!S.answering || !S.tools[id] || busyTool) return;
  const q = S.cur, asker = S.asker;
  SFX.click();
  if (id === 'um') { S.um = !S.um; renderTools(); return; }
  busyTool = true; S.tools[id]--;
  if (id === 'cough') {
    SFX.cough(); S.deadline += 5000; change(-2, 0); renderTools();
    await robotSay('*cough cough* Sorry!', 1000); await react(asker, 'cough');
  } else if (id === 'laugh') {
    SFX.laugh(); S.laughs++; renderTools();
    await robotSay('Ha ha... ha.', 900);
    if (S.laughs >= 2 && S.lastLaughQ === S.qi) { change(6, -2); await react(asker, 'laugh', nice(asker) ? "You keep laughing. Is something funny?" : 'Why do you keep laughing?'); }
    else { change(-4, 0); await react(asker, 'laugh'); }
    S.lastLaughQ = S.qi;
  } else if (id === 'hobby') {
    const h = pick(FAKE_HOBBIES.filter(x => x !== S.claims.hobby)); S.claims.hobby2 = h; S.lies++;
    change(-6, 3); renderTools();
    await robotSay(`Oh, and I'm really into ${h}!`, 1400);
    await react(asker, 'human', nice(asker) ? `Ooh, ${h}! Fun.` : `${h[0].toUpperCase() + h.slice(1)}. Right.`);
    // they'll quiz you on it later
    const fu = J.followups.find(f => f.needs === 'hobby2') || { needs: 'hobby2', who: watcher(), text: 'Earlier you mentioned a hobby. Remind me what it was?' };
    if (fu) { const at = clamp(S.qi + 2 + rnd(3), S.qi + 1, S.queue.length - 1); S.queue.splice(at, 0, { ...fu, follow: true }); meters(); }
  } else if (id === 'small') {
    renderTools(); busyTool = false; return openSmallTalk();
  }
  busyTool = false;
}
function openSmallTalk() {
  const opts = shuffle([...SMALLTALK, ...(J.smalltalk || [])]).slice(0, 2);
  const pk = $('#picker');
  pk.innerHTML = `<h4>Change the subject…</h4>${opts.map((o, i) => `<button class="ans in" data-i="${i}">${o}</button>`).join('')}<button class="chip" data-i="x">Never mind</button>`;
  pk.classList.add('on');
  pk.querySelectorAll('button').forEach(b => b.onclick = async () => {
    pk.classList.remove('on');
    if (b.dataset.i === 'x') { S.tools.small++; renderTools(); return; }
    SFX.click();
    if (!S.answering) return;
    const q = S.cur, asker = S.asker;
    if (q.follow) { // can't dodge a quiz
      busyTool = true;
      await robotSay(opts[+b.dataset.i], 1300); change(6, -2);
      await react(asker, 'small', nice(asker) ? 'Ha! But you didn’t answer.' : 'Nice try. Answer the question.');
      busyTool = false; return;
    }
    stopAnswering();
    await robotSay(opts[+b.dataset.i], 1300);
    if (nice(asker)) { change(-3, 1); await react(asker, 'small'); }
    else { change(-1, -3); await react(asker, 'small'); }
    afterAnswer(0);
  });
}

// ---------- question loop ----------
function stopAnswering() {
  S.answering = false; cancelAnimationFrame(S.timer); S.um = false;
  document.querySelectorAll('#answers .ans').forEach(a => a.disabled = true);
  $('#picker').classList.remove('on'); renderTools();
}
async function nextQ() {
  if (S.ended) return;
  if (S.qi >= S.queue.length) return finish();
  const q = S.queue[S.qi]; S.cur = q;
  if (q.follow && S.claims[q.needs] === undefined) { S.queue.splice(S.qi, 1); return nextQ(); }
  const asker = q.who && J.panel.includes(q.who) ? q.who : (S.qi === 0 ? J.panel[0] : pick(J.panel));
  S.asker = asker;
  meters();
  J.panel.forEach(id => setFace(id, id === asker ? 'neutral' : (nice(id) ? 'happy' : 'neutral')));
  const p = PEOPLE[asker];
  const who = $('#qwho'); who.textContent = `${p.name} ASKS`; who.style.background = p.color;
  $('#answers').innerHTML = ''; $('#timer').classList.remove('low'); $('#timerBar').style.width = '100%';
  document.querySelectorAll('.person').forEach(x => x.classList.toggle('talk', x.id === 'p-' + asker));
  // typewriter
  const text = fill(q.text), qt = $('#qtext'); qt.textContent = '';
  S.skipType = false;
  for (let i = 0; i < text.length && !S.skipType; i++) { qt.textContent = text.slice(0, i + 1); if (i % 3 === 0) SFX.blip(); await wait(22); }
  qt.textContent = text;
  document.querySelectorAll('.person').forEach(x => x.classList.remove('talk'));
  // answers
  let opts;
  if (q.follow) {
    opts = shuffle(q.options || quizOptions(q)).map(x => ({ ...x, quiz: true }));
  } else opts = shuffle(q.answers);
  S.opts = opts;
  $('#answers').innerHTML = opts.map((a, i) => `<button class="ans" data-i="${i}">${fill(a.t)}</button>`).join('');
  const btns = [...document.querySelectorAll('#answers .ans')];
  btns.forEach((b, i) => { setTimeout(() => b.classList.add('in'), i * 70); b.onclick = () => choose(i); });
  // timer
  const total = (q.time || (q.follow ? (J.quizTime || 10) : (J.time || 13))) * 1000 * Math.max(SPEED, .05);
  S.shownAt = performance.now(); S.deadline = S.shownAt + total; S.total = total;
  S.answering = true; S.um = false; renderTools();
  let lastTick = 99;
  const tick = () => {
    if (!S.answering) return;
    const left = S.deadline - performance.now();
    $('#timerBar').style.width = clamp(left / S.total * 100, 0, 100) + '%';
    const low = left < 3500 * Math.max(SPEED, .05);
    $('#timer').classList.toggle('low', low);
    const sec = Math.ceil(left / 1000); if (low && sec !== lastTick) { lastTick = sec; SFX.tick(); }
    if (left <= 0) return timeUp();
    S.timer = requestAnimationFrame(tick);
  };
  S.timer = requestAnimationFrame(tick);
}
$('#qtext').onclick = () => { if (S) S.skipType = true; };

async function timeUp() {
  stopAnswering();
  SFX.bad();
  await robotSay('...', 900);
  change(2, -7);
  await react(S.asker, 'slow');
  afterAnswer(0);
}

async function choose(i) {
  if (!S.answering || busyTool) return;
  const a = S.opts[i], q = S.cur, asker = S.asker;
  const um = S.um, elapsed = performance.now() - S.shownAt;
  stopAnswering(); SFX.click();
  document.querySelectorAll('#answers .ans').forEach((b, n) => b.classList.add(n === i ? 'picked' : 'dim'));
  let said = fill(a.t);
  if (um) said = 'Um... ' + (said.startsWith('I ') || said.startsWith("I'") ? said : said[0].toLowerCase() + said.slice(1));
  await robotSay(said, 900 + said.length * 28);
  let kind, sus = 0, hire = 0, extra;
  if (a.quiz) {
    const claimed = S.claims[q.needs];
    if (a.v === claimed) { kind = 'consistent'; sus = -4; hire = 4; SFX.good(); }
    else {
      kind = 'caught'; sus = 15; hire = -5; S.caught++; SFX.bad();
      extra = pick(COMMENTS[PEOPLE[asker].persona].caught) + ` You said ${claimed}.`;
    }
  } else {
    kind = a.kind; sus = a.sus; hire = a.hire;
    if (a.claim) { Object.assign(S.claims, a.claim); S.lies++; }
    if (a.special) S.special = a.special;
    sus < 0 ? SFX.good() : sus >= 8 ? SFX.bad() : 0;
  }
  if (um) sus -= 2;
  const tooFast = !um && elapsed < 1300 * Math.max(SPEED, .05);
  change(sus, hire);
  await react(asker, kind, extra);
  if (tooFast && S.sus < 100) { change(6, 0); await react(watcher(), 'fast'); }
  afterAnswer(sus);
}

async function afterAnswer(sus) {
  if (S.sus >= 100) return finish();
  // glitch?
  let chance = S.sus >= 65 ? .5 : S.sus >= 45 ? .28 : .1;
  if (sus >= 12) chance += .35;
  const due = (S.qi === 3 && S.glitches === 0) || (S.qi === 8 && S.glitches < 2);
  if (S.glitches < 4 && S.qi < S.queue.length - 1 && (due || Math.random() < chance)) {
    await glitch();
    if (S.sus >= 100) return finish();
  }
  J.panel.forEach(id => setFace(id, 'neutral'));
  S.qi++;
  await wait(250);
  nextQ();
}

// ---------- glitches + mini-games ----------
const GLITCH = {
  arm: { alarm: 'ARM SPINNING!', how: 'Tap fast to turn it into a stretch!', seen: 'Did your arm just SPIN?', cover: 'Ooh, stiff shoulder. *stretches*' },
  eyes: { alarm: 'EYES FLASHING!', how: 'Tap BLINK when the line is in the green!', seen: 'Your eyes just went RED.', cover: '*blinks* Contact lenses. Sorry.' },
  voice: { alarm: 'YOU BEEPED!', how: 'Quick, cover it up!', seen: 'Did you just... BEEP?', cover: '' }
};
async function glitch() {
  S.glitches++;
  const type = pick(Object.keys(GLITCH).filter(k => k !== S.lastGlitch)); S.lastGlitch = type;
  const r = $('#robot'); r.classList.add('glitching', 'g-' + type);
  if (type === 'voice') { SFX.beep(); robotSay('BZZT! BEEP-BOOP!', 900, true); } else SFX.alarm();
  await wait(700);
  const ok = await minigame(type);
  r.classList.remove('glitching', 'g-' + type);
  const kevId = watcher();
  if (ok) {
    S.hidden++; SFX.good(); change(-2, 0);
    if (GLITCH[type].cover) await robotSay(GLITCH[type].cover, 1300);
    await react(kevId, 'glitchHid');
  } else {
    SFX.bad(); change(16, -4);
    await react(kevId, 'glitchSeen', GLITCH[type].seen);
  }
}
function minigame(type) {
  return new Promise(resolve => {
    const m = $('#mini'); const G = GLITCH[type];
    let done = false, raf;
    const end = async ok => {
      if (done) return; done = true; cancelAnimationFrame(raf);
      m.innerHTML = `<p class="result" style="color:${ok ? 'var(--green)' : 'var(--red)'}">${ok ? 'COVERED IT!' : 'THEY SAW IT!'}</p>`;
      await wait(800); m.classList.remove('on'); m.innerHTML = ''; resolve(ok);
    };
    const T = { arm: 3600, eyes: 4200, voice: 2800 }[type] * Math.max(SPEED, .05);
    const t0 = performance.now();
    m.innerHTML = `<p class="alarm">${G.alarm}</p><p class="how">${G.how}</p><div class="countdown"><i id="cd"></i></div><div id="game"></div>`;
    m.classList.add('on');
    const g = $('#game');
    if (type === 'arm') {
      const need = 7; let n = 0;
      g.innerHTML = `<button class="tapzone" id="tapz"><span>💪</span></button><div class="dots" id="dots">${'○'.repeat(need)}</div>`;
      $('#tapz').onpointerdown = e => { e.preventDefault(); if (done) return; n++; tone(400 + n * 80, .05, 'triangle', .08); $('#dots').textContent = '●'.repeat(n) + '○'.repeat(Math.max(0, need - n)); if (n >= need) end(true); };
    } else if (type === 'eyes') {
      const zw = 24, zx = 15 + rnd(55); let tries = 2;
      g.innerHTML = `<div class="slider"><div class="zone" style="left:${zx}%;width:${zw}%"></div><div class="marker" id="mk"></div></div><button class="btn blinkbtn" id="blink">BLINK 👁️</button><div class="dots" id="tries">${'👁️'.repeat(tries)}</div>`;
      const pos = () => { const t = (performance.now() - t0) / (1150 * Math.max(SPEED, .3)); const f = t % 2; return (f < 1 ? f : 2 - f) * 100; };
      $('#blink').onpointerdown = e => {
        e.preventDefault(); if (done) return; const p = pos();
        if (p >= zx && p <= zx + zw) end(true);
        else { tries--; tone(200, .1, 'sawtooth', .06); $('#tries').textContent = '👁️'.repeat(Math.max(0, tries)); if (tries <= 0) end(false); }
      };
      S._eyesPos = pos; S._eyesZone = [zx, zx + zw];
    } else {
      const good = pick(['Sorry, hiccups!', 'Ha, that’s my phone.', 'Excuse me. New fillings.']);
      const bad = shuffle(['THAT WAS A HUMAN NOISE.', 'Beep is a word humans say.', 'Please ignore the beep.', 'I did not beep. You beeped.']).slice(0, 2);
      const opts = shuffle([{ t: good, ok: true }, ...bad.map(t => ({ t, ok: false }))]);
      g.innerHTML = `<div class="opts">${opts.map((o, i) => `<button class="ans" data-i="${i}">${o.t}</button>`).join('')}</div>`;
      g.querySelectorAll('.ans').forEach(b => b.onclick = async () => {
        const o = opts[+b.dataset.i]; if (done) return;
        if (o.ok) { robotSay(o.t, 1200); } else { robotSay(o.t, 1400); }
        end(o.ok);
      });
    }
    const loop = () => {
      if (done) return;
      const left = 1 - (performance.now() - t0) / T;
      const cd = $('#cd'); if (cd) cd.style.width = clamp(left * 100, 0, 100) + '%';
      const mk = $('#mk'); if (mk && S._eyesPos) mk.style.left = `calc(${S._eyesPos()}% - var(--u))`;
      if (left <= 0) return end(false);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
  });
}

// ---------- ending ----------
async function finish() {
  if (S.ended) return; S.ended = true; stopAnswering();
  const found = S.sus >= 100, hired = !found && S.hire >= J.hireNeeded;
  const kind = found ? 'found' : hired ? 'hired' : 'rejected';
  const kevId = watcher();
  if (found) {
    $('#robot').classList.add('glitching', 'g-eyes', 'g-arm'); SFX.alarm();
    J.panel.forEach(id => setFace(id, 'shocked'));
    await panelSay(kevId, "I KNEW IT. IT'S A ROBOT!", 1900);
  } else {
    const pamId = friendly();
    J.panel.forEach(id => setFace(id, hired ? 'happy' : 'frown'));
    await panelSay(pamId, hired ? 'Well... we’d love to have you!' : 'Thanks for coming in. We’ll be in touch.', 1700);
  }
  $('#robot').classList.remove('glitching', 'g-eyes', 'g-arm');
  const stampText = { hired: 'HIRED!', rejected: 'REJECTED', found: 'FOUND OUT!' }[kind];
  const line = fill(S.special && J.ends[S.special] ? pick(J.ends[S.special]) : pick(J.ends[kind]));
  const r = SAVE[J.id] || { plays: 0, hired: false };
  r.plays++; r.last = kind; if (hired) r.hired = true; SAVE[J.id] = r;
  try { localStorage.setItem('ji_results', JSON.stringify(SAVE)); } catch (e) {}
  S.result = kind;
  const human = clamp(100 - S.sus, 0, 100);
  $('#end').className = 'screen on ' + kind;
  show('end'); $('#end').className = 'screen on ' + kind;
  $('#endCard').innerHTML = `
    <div class="stamp" id="stamp">${stampText}</div>
    <div class="endart" id="endArt">${ROBOT_SVG}</div>
    <p class="line">${line}</p>
    <div class="stats">
      <div><b>${human}%</b><span>looked human</span></div>
      <div><b>${S.hire}</b><span>hire score (need ${J.hireNeeded})</span></div>
      <div><b>${S.lies}</b><span>lies told</span></div>
      <div><b>${S.caught}</b><span>lies caught</span></div>
      <div><b>${S.hidden}/${S.glitches}</b><span>glitches covered</span></div>
      <div><b>${Math.min(S.qi + 1, S.queue.length)}/${S.queue.length}</b><span>questions</span></div>
    </div>`;
  const art = $('#endArt');
  const er = $('#endArt svg'); if (er) { const w = er.querySelector('#wig'); if (w) w.style.transform = kind === 'found' ? 'translate(30px,-34px) rotate(40deg)' : kind === 'hired' ? 'none' : 'rotate(8deg)'; if (kind === 'found') er.querySelectorAll('.eye').forEach(e => e.setAttribute('fill', '#ff2d2d')); }
  await wait(250); $('#stamp').classList.add('slam'); setTimeout(() => SFX.stamp(), 380 * SPEED);
  setTimeout(() => (hired ? SFX.win() : SFX.lose()), 700 * SPEED);
  const i = JOB_LIST.findIndex(j => j.id === J.id), nx = JOB_LIST[i + 1];
  $('#nextBtn').style.display = hired && nx ? '' : 'none'; if (nx) $('#nextBtn').textContent = `Next job: ${nx.t} →`;
}

// ---------- end buttons, share, mute ----------
$('#againBtn').onclick = () => { SFX.click(); cvScreen(J); };
// next job button
$('#nextBtn').onclick = () => { SFX.click(); const i = JOB_LIST.findIndex(j => j.id === J.id); const nx = JOB_LIST[(i + 1) % JOB_LIST.length]; cvScreen(window.JOBS[nx.id]); };
$('#menuBtn').onclick = () => { SFX.click(); titleScreen(); };
const SHARE_URL = 'https://notesfromthemachineai.github.io/interview/';
$('#shareBtn').onclick = async () => {
  SFX.click();
  const res = S && S.result ? { hired: `I got HIRED as a ${J.title.toLowerCase()} (I'm a robot).`, rejected: `I got REJECTED as a ${J.title.toLowerCase()}.`, found: `I got FOUND OUT as a robot in my ${J.title.toLowerCase()} interview.` }[S.result] : 'Can you get hired as a robot?';
  const text = `${res} Can you do better? ${SHARE_URL}`;
  if (navigator.share && matchMedia('(pointer:coarse)').matches) { try { await navigator.share({ title: 'JOB INTERVIEW', text: res + ' Can you do better?', url: SHARE_URL }); return; } catch (e) { if (e.name === 'AbortError') return; } }
  try { await navigator.clipboard.writeText(text); toast('Link copied!'); }
  catch (e) {
    const t = document.createElement('textarea'); t.value = text; document.body.appendChild(t); t.select();
    try { document.execCommand('copy'); toast('Link copied!'); } catch (e2) { toast(SHARE_URL); }
    t.remove();
  }
};
function toast(t) { const el = $('#toast'); el.textContent = t; el.classList.add('on'); clearTimeout(toast.h); toast.h = setTimeout(() => el.classList.remove('on'), 1800); }
const muteBtn = $('#muteBtn');
const setMute = () => { muteBtn.textContent = muted ? '🔇' : '🔊'; };
muteBtn.onclick = () => { muted = !muted; try { localStorage.setItem('ji_muted', muted ? '1' : '0'); } catch (e) {} setMute(); if (!muted) { audio(); SFX.click(); } };
setMute();

// test + recording hooks
window.__ji = { speed: v => { SPEED = v; }, state: () => S, job: () => J, choose, useTool, glitch, finish };
titleScreen();
})();
