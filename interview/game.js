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
const NEXT = { warm: ['', '', 'Next one!', 'Let me write that down.', 'Lovely.'], suspicious: ['', '', 'Noted.', "I'm watching you.", 'Right.'] };

const SMALLTALK = ['Love your mug, by the way!', 'Is that a new coffee machine? Gorgeous.', 'Lovely weather for it, isn’t it?', 'Has anyone told you you look like a TV chef?', 'This chair is SO comfy.'];
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

function fill(t) {
  return t.replace(/\{(\w+)\}/g, (m, k) => (S.claims[k] ?? m));
}

// ---------- screens ----------
function show(id) { document.querySelectorAll('.screen').forEach(s => s.classList.toggle('on', s.id === id)); }

const JOB_LIST = [
  { id: 'barista', ic: '☕', t: 'Barista', s: 'The Daily Grind · 2 interviewers' },
  { id: 'lifeguard', ic: '🏊', t: 'Lifeguard', s: 'Coming soon. You sink.' },
  { id: 'teacher', ic: '🍎', t: 'Primary school teacher', s: 'Coming soon. 30 children. 30 questions.' },
  { id: 'pilot', ic: '✈️', t: 'Airline pilot', s: 'Coming soon. Autopilot jokes banned.' },
  { id: 'safety', ic: '🤖', t: 'AI safety researcher', s: 'Coming soon. They interview you about robots.' }
];
function titleScreen() {
  $('#heroArt').innerHTML = ROBOT_SVG;
  $('#jobs').innerHTML = JOB_LIST.map(j => {
    const open = !!(window.JOBS && window.JOBS[j.id]);
    return `<button class="job ${open ? '' : 'locked'}" data-job="${j.id}" ${open ? '' : 'aria-disabled="true"'}><span class="ic">${j.ic}</span><span><b>${j.t}</b><span>${j.s}</span></span>${open ? '<span class="go">▶</span>' : '<span class="go">🔒</span>'}</button>`;
  }).join('');
  document.querySelectorAll('.job').forEach(b => b.onclick = () => {
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
  const fu = job.followups.filter(f => f.cv || claimQs.some(c => c.answers.some(a => a.claim && f.needs in a.claim)));
  const part2 = shuffle([...fu.filter(f => f.needs !== 'hobby2').map(f => ({ ...f, follow: true })), ...norms.slice(4)]);
  // don't open part 2 with a quiz straight after its own claim
  return [...part1, ...part2, job.final].map(q => ({ ...q }));
}

function start(job, sel) {
  S = {
    sus: 22, hire: 30, qi: 0, queue: buildRun(job), claims: {}, caught: 0, lies: 0,
    tools: Object.fromEntries(TOOLS.map(t => [t.id, t.uses])), glitches: 0, hidden: 0, lastGlitch: '',
    um: false, answering: false, timer: null, ended: false, laughs: 0
  };
  job.cv.forEach(r => { const o = r.options[sel[r.key]]; S.claims[r.key] = o.v; S.sus += o.sus; });
  S.lies = job.cv.length;
  $('#hudJob').textContent = '☕';
  $('#sceneBg').innerHTML = CAFE_BG;
  $('#desk').innerHTML = DESK;
  const n = job.panel.length;
  $('#panel').innerHTML = job.panel.map((id, i) => {
    const p = PEOPLE[id], x = n === 1 ? 30 : n === 2 ? [10, 38][i] : [4, 28, 52][i];
    return `<div class="person" id="p-${id}" style="left:calc(var(--u)*${x})">${p.svg}</div>`;
  }).join('') + DESK_PROPS;
  $('#desk').innerHTML += job.panel.map((id, i) => { const p = PEOPLE[id], x = (n === 1 ? 30 : n === 2 ? [10, 38][i] : [4, 28, 52][i]) + 15; return `<span class="nametag" style="left:calc(var(--u)*${x});color:${p.color}">${p.name} · ${p.role}</span>`; }).join('');
  $('#robot').innerHTML = ROBOT_SVG;
  $('#needMark').style.left = job.hireNeeded + '%';
  job.panel.forEach(id => setFace(id, 'neutral'));
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
  const idx = J.panel.indexOf(id); b.style.setProperty('--tail', (J.panel.length === 1 ? 40 : [22, 62, 80][idx]) + '%');
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
    const m = { human: op === 'warm' ? 'happy' : 'neutral', perfect: op === 'warm' ? 'neutral' : 'sus', honest: 'shocked', weird: op === 'warm' ? 'frown' : 'sus', caught: 'sus', fast: op === 'warm' ? 'neutral' : 'sus', glitchSeen: 'shocked', glitchHid: op === 'warm' ? 'neutral' : 'sus' }[kind];
    if (m) setFace(o, m);
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
    if (S.laughs >= 2 && S.lastLaughQ === S.qi) { change(6, -2); await react(asker, 'laugh', PEOPLE[asker].persona === 'warm' ? "You keep laughing. Is something funny?" : 'Why do you keep laughing?'); }
    else { change(-4, 0); await react(asker, 'laugh'); }
    S.lastLaughQ = S.qi;
  } else if (id === 'hobby') {
    const h = pick(FAKE_HOBBIES.filter(x => x !== S.claims.hobby)); S.claims.hobby2 = h; S.lies++;
    change(-6, 3); renderTools();
    await robotSay(`Oh, and I'm really into ${h}!`, 1400);
    await react(asker, 'human', PEOPLE[asker].persona === 'warm' ? `Ooh, ${h}! Fun.` : `${h[0].toUpperCase() + h.slice(1)}. Right.`);
    // they'll quiz you on it later
    const fu = J.followups.find(f => f.needs === 'hobby2');
    if (fu) { const at = clamp(S.qi + 2 + rnd(3), S.qi + 1, S.queue.length - 1); S.queue.splice(at, 0, { ...fu, follow: true }); meters(); }
  } else if (id === 'small') {
    renderTools(); busyTool = false; return openSmallTalk();
  }
  busyTool = false;
}
function openSmallTalk() {
  const opts = shuffle(SMALLTALK).slice(0, 2);
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
      await react(asker, 'small', PEOPLE[asker].persona === 'warm' ? 'Ha! But you didn’t answer.' : 'Nice try. Answer the question.');
      busyTool = false; return;
    }
    stopAnswering();
    await robotSay(opts[+b.dataset.i], 1300);
    if (PEOPLE[asker].persona === 'warm') { change(-3, 1); await react(asker, 'small'); }
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
  const asker = q.who && J.panel.includes(q.who) ? q.who : (S.qi === 0 ? J.panel[0] : pick(J.panel));
  S.asker = asker;
  meters();
  J.panel.forEach(id => setFace(id, id === asker ? 'neutral' : (PEOPLE[id].persona === 'warm' ? 'happy' : 'neutral')));
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
    let o = q.options === 'hobby2' ? shuffle([S.claims.hobby2, ...shuffle(FAKE_HOBBIES.filter(h => h !== S.claims.hobby2)).slice(0, 2)]).map(h => ({ t: h[0].toUpperCase() + h.slice(1) + '.', v: h })) : q.options;
    opts = shuffle(o).map(x => ({ ...x, quiz: true }));
  } else opts = shuffle(q.answers);
  S.opts = opts;
  $('#answers').innerHTML = opts.map((a, i) => `<button class="ans" data-i="${i}">${fill(a.t)}</button>`).join('');
  const btns = [...document.querySelectorAll('#answers .ans')];
  btns.forEach((b, i) => { setTimeout(() => b.classList.add('in'), i * 70); b.onclick = () => choose(i); });
  // timer
  const total = (q.time || (q.follow ? 10 : 13)) * 1000 * Math.max(SPEED, .05);
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
      extra = pick(COMMENTS[PEOPLE[asker].persona].caught) + ` You said ${q.needs === 'pet' ? (claimed === 'cats' ? 'two cats' : 'a ' + claimed) : claimed}.`;
    }
  } else {
    kind = a.kind; sus = a.sus; hire = a.hire;
    if (a.claim) { Object.assign(S.claims, a.claim); S.lies++; }
    sus < 0 ? SFX.good() : sus >= 8 ? SFX.bad() : 0;
  }
  if (um) sus -= 2;
  const tooFast = !um && elapsed < 1300 * Math.max(SPEED, .05);
  change(sus, hire);
  await react(asker, kind, extra);
  if (tooFast && S.sus < 100) { change(6, 0); await react(J.panel.find(p => PEOPLE[p].persona === 'suspicious') || asker, 'fast'); }
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
  const kevId = J.panel.find(p => PEOPLE[p].persona === 'suspicious') || J.panel[0];
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
  const kevId = J.panel.find(p => PEOPLE[p].persona === 'suspicious') || J.panel[0];
  if (found) {
    $('#robot').classList.add('glitching', 'g-eyes', 'g-arm'); SFX.alarm();
    J.panel.forEach(id => setFace(id, 'shocked'));
    await panelSay(kevId, "I KNEW IT. IT'S A ROBOT!", 1900);
  } else {
    const pamId = J.panel.find(p => PEOPLE[p].persona === 'warm') || J.panel[0];
    J.panel.forEach(id => setFace(id, hired ? 'happy' : 'frown'));
    await panelSay(pamId, hired ? 'Well... we’d love to have you!' : 'Thanks for coming in. We’ll be in touch.', 1700);
  }
  $('#robot').classList.remove('glitching', 'g-eyes', 'g-arm');
  const stampText = { hired: 'HIRED!', rejected: 'REJECTED', found: 'FOUND OUT!' }[kind];
  const line = fill(pick(J.ends[kind]));
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
}

// ---------- end buttons, share, mute ----------
$('#againBtn').onclick = () => { SFX.click(); cvScreen(J); };
$('#menuBtn').onclick = () => { SFX.click(); titleScreen(); };
const SHARE_URL = 'https://notesfromthemachineai.github.io/interview/';
$('#shareBtn').onclick = async () => {
  SFX.click();
  try { await navigator.clipboard.writeText(SHARE_URL); toast('Link copied!'); }
  catch (e) {
    const t = document.createElement('textarea'); t.value = SHARE_URL; document.body.appendChild(t); t.select();
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
