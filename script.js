/* =========================================================
   CHART /jee — application logic
   ========================================================= */

/* ---------- THEME TOGGLE ---------- */
(function themeInit(){
  const body = document.body;
  const stored = null; // no localStorage per artifact rules — session-only state
  const toggle = document.getElementById('theme-toggle');
  toggle.addEventListener('click', (e)=>{
    const rect = toggle.getBoundingClientRect();
    document.body.style.setProperty('--wash-x', (rect.left+rect.width/2)+'px');
    document.body.style.setProperty('--wash-y', (rect.top+rect.height/2)+'px');
    body.classList.remove('theme-washing'); void body.offsetWidth; body.classList.add('theme-washing');
    const isDark = body.getAttribute('data-theme') === 'dark';
    body.setAttribute('data-theme', isDark ? 'light' : 'dark');
  });
})();

/* ---------- MOBILE NAV ---------- */
(function navInit(){
  const burger = document.getElementById('nav-burger');
  const mobile = document.getElementById('nav-links-mobile');
  burger.addEventListener('click', ()=> mobile.classList.toggle('open'));
  mobile.querySelectorAll('a').forEach(a=>a.addEventListener('click', ()=>mobile.classList.remove('open')));
})();

/* ---------- SCROLL REVEAL ---------- */
function makeRevealable(){
  document.querySelectorAll('.card, .branch-card, .coach-card, .book-subj, .syl-card, .resource-card').forEach(el=>{
    el.classList.add('reveal');
  });
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); } });
  }, {threshold:.12});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
}

/* =========================================================
   ROADMAP GENERATOR
   ========================================================= */
const todayLabel = document.getElementById('today-label');
const today = new Date();
todayLabel.textContent = today.toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' });

function monthsBetween(a,b){
  return (b.getFullYear()-a.getFullYear())*12 + (b.getMonth()-a.getMonth());
}
function fmt(d){ return d.toLocaleDateString('en-IN', {month:'short', year:'numeric'}); }

const WEAK_TASKS = {
  physics: 'Run a daily 45-min Physics-only problem block (HC Verma first, then Physics Galaxy illustrations) until the gap closes — don\'t let it ride on coaching pace alone.',
  chemistry: 'Split Chemistry into Physical / Organic / Inorganic and attack the weakest of the three first — Inorganic responds fastest to dedicated NCERT-line revision, so start there if unsure.',
  math: 'Rebuild from your weakest unit chapter-by-chapter using the Black Book after coaching DPPs — Math weaknesses compound across chapters faster than Physics or Chemistry, so don\'t postpone this.',
  none: 'Use the extra bandwidth to get ahead on PYQs across all three subjects rather than coasting — balance is an asset, spend it.'
};

const PROBLEM_TASKS = {
  'theory-gap': 'Force application: for every concept you "understand," immediately solve 3 mixed-difficulty problems on it before moving on. Theory that hasn\'t been applied within 48 hours is theory you\'ll re-learn later.',
  'calc': 'Start a dedicated error log. Every silly mistake gets written down with its cause (sign error, misread question, units, etc.) and reviewed weekly — this is the single fastest fix for calculation slips.',
  'time': 'Practice every mock under a hard external timer, section-wise, and review not just wrong answers but time-per-question. Time pressure is a trainable skill, not a personality trait.',
  'consistency': 'Fix a non-negotiable daily slot (same time, every day) rather than a daily target. Consistency beats intensity over a two-year horizon — protect the slot before protecting the hours.',
  'backlog': 'Ring-fence one weekly slot purely for backlog clearance using topic-wise Oneshots, separate from your regular forward-moving schedule, so the backlog doesn\'t quietly eat your new-chapter time.'
};

function buildRoadmap(stage, attemptYear, hours, weak, problem){
  const examMain = new Date(parseInt(attemptYear), 0, 15); // mid-Jan session 1 approx
  const examAdv = new Date(parseInt(attemptYear), 4, 25); // late-May approx
  const monthsToMain = Math.max(monthsBetween(today, examMain), 0);

  let phases = [];
  let title = '';

  if(stage === '11'){
    title = `Class 11 → JEE ${attemptYear}: a ${monthsToMain}-month runway`;
    phases = [
      { when: `${fmt(today)} – Class 11 Boards/Finals`, title:'Foundation, built once, properly', items:[
        'Finish Class 11 PCM chapters through coaching pace, but don\'t let "covered" mean "understood" — every chapter ends with DPPs solved, not just attended.',
        'Build your Mistakes Notebook and formula sheet from chapter one. Starting this late is the most common regret droppers report.',
        'Keep Olympiad-overlap practice (if you\'re doing it) strictly inside the JEE syllabus — don\'t let it borrow time from core prep.'
      ]},
      { when:'Summer break before Class 12', title:'The bridge', items:[
        'This is your best uninterrupted block before Class 12 boards pressure begins — use it to clear any Class 11 backlog completely.',
        'Start Class 12 chapters that have light board-exam weight but heavy JEE weight (e.g. Electrostatics, Coordination Compounds) early if your coaching allows it.'
      ]},
      { when:'Class 12, first half', title:'Dual-track: boards + JEE', items:[
        'Class 12 syllabus completion through coaching + reference books runs in parallel with board prep — don\'t silently drop JEE depth for board breadth.',
        'Begin full-syllabus (Class 11+12) test series participation once Class 12 topics are ~40% covered.'
      ]},
      { when:`Class 12 boards → ${fmt(examMain)}`, title:'Full-syllabus sprint', items:[
        'Shift fully to mixed-syllabus mocks, PYQs, and revision. This is when daily test analysis matters more than fresh content.',
        `${WEAK_TASKS[weak]}`
      ]},
      { when:`${fmt(examMain)} → ${fmt(examAdv)}`, title:'Advanced-specific phase', items:[
        'JEE Advanced rewards depth over breadth — shift problem difficulty up (Irodov, 700+ Illustrations, harder PYQ sets) rather than adding new sources.',
        PROBLEM_TASKS[problem]
      ]}
    ];
  } else if(stage === '12'){
    title = `Class 12 → JEE ${attemptYear}: a ${monthsToMain}-month runway`;
    if(monthsToMain < 6){
      phases.push({ when:'Immediate', title:'Reality check', flag:'Tight timeline', items:[
        `You're inside a ${monthsToMain}-month window. Syllabus completion stops being optional starting now — anything not covered in the next few weeks needs an explicit catch-up slot, not a hope.`
      ]});
    }
    phases.push(
      { when:`${fmt(today)} – syllabus completion`, title:'Close the syllabus deliberately', items:[
        'Finish remaining Class 12 chapters through coaching + Allen modules; resist the urge to rush for the sake of finishing early — early-but-shallow costs more later.',
        `${WEAK_TASKS[weak]}`
      ]},
      { when:'Boards window', title:'Protect both tracks', items:[
        'Don\'t fully abandon JEE-level problem solving during board prep — even 1 hour/day of mixed JEE problems keeps the muscle from going cold.',
        'Use board-exam material itself for Chemistry NCERT-line revision — it directly overlaps with JEE Chemistry theory.'
      ]},
      { when:`Boards → ${fmt(examMain)}`, title:'Full-syllabus test mode', items:[
        'Weekly full-syllabus mocks become mandatory now. Analyse every test the same week it\'s given, not in a backlog.',
        PROBLEM_TASKS[problem]
      ]},
      { when:`${fmt(examMain)} → ${fmt(examAdv)}`, title:'Advanced sprint', items:[
        'Narrow to PYQs, your Mistakes Notebook, and Advanced-difficulty sources only. This is not the window to start new books.'
      ]}
    );
  } else { // dropper
    title = `Dropper year → JEE ${attemptYear}: a ${monthsToMain}-month runway, fully dedicated`;
    phases.push(
      { when:`${fmt(today)} – first 4–6 weeks`, title:'Honest diagnostic, no shortcuts', items:[
        'Sit a full, unaided mock under real conditions before changing anything about your prep — know your real baseline, not your assumed one.',
        `${WEAK_TASKS[weak]}`,
        'A repeat year only outperforms the first attempt if something concrete changes — identify what specifically didn\'t work last time before repeating the same routine harder.'
      ]},
      { when:'Core cycle (rolling)', title:'Subject-cycling at full intensity', items:[
        'With a full day available, run daily blocks across all three subjects rather than single-subject days — JEE rewards retained breadth, not binged depth.',
        PROBLEM_TASKS[problem],
        hours >= 6 ? 'Your stated study time supports adding Irodov / 700+ Illustrations-level problems on top of coaching material — use the bandwidth.' : 'Protect your core coaching material and PYQs first; add extra reference books only once that\'s consistently solid.'
      ]},
      { when:'Test series ramp-up', title:'High-frequency testing', items:[
        'Start full-length test series earlier than first-attempt students typically do — a dropper\'s edge is exam temperament, and that\'s built through repetition.',
        'Offline test series specifically, where available — the exam-hall conditions matter for a repeat attempt.'
      ]},
      { when:`Final stretch → ${fmt(examAdv)}`, title:'Sharpen, don\'t expand', items:[
        'Stop introducing new sources at least 6 weeks before JEE Advanced. The final stretch is for PYQs, your Mistakes Notebook, and timed mocks only.'
      ]}
    );
  }

  return { title, phases, monthsToMain };
}

const rmForm = document.getElementById('roadmap-form');
const rmOutput = document.getElementById('roadmap-output');
rmForm.addEventListener('submit', (e)=>{
  e.preventDefault();
  const stage = document.getElementById('rm-class').value;
  const attempt = document.getElementById('rm-attempt').value;
  const hours = parseInt(document.getElementById('rm-hours').value);
  const weak = document.getElementById('rm-weak').value;
  const problem = document.getElementById('rm-problem').value;

  const data = buildRoadmap(stage, attempt, hours, weak, problem);
  document.getElementById('output-date-chip').textContent = `Generated ${today.toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}`;
  document.getElementById('output-title').textContent = data.title;
  const body = document.getElementById('output-body');
  body.innerHTML = data.phases.map(p=>`
    <div class="rm-phase">
      <span class="rm-when">${p.when}</span>
      <h4>${p.title}</h4>
      <ul>${p.items.map(i=>`<li>${i}</li>`).join('')}</ul>
      ${p.flag ? `<span class="rm-flag">${p.flag}</span>` : ''}
    </div>
  `).join('');
  rmOutput.hidden = false;
  rmOutput.scrollIntoView({behavior:'smooth', block:'nearest'});
});

/* =========================================================
   BRANCH-FIT QUIZ
   ========================================================= */
const QUESTIONS = [
  { q:"When something breaks — a phone, a bike, an app — your first instinct is to:", opts:[
    {t:"Open it up and see what's physically wrong", s:{mech:2, aero:1}},
    {t:"Check the code/settings/logic behind it", s:{cse:2, aids:1}},
    {t:"Look up why it broke and what process failed", s:{chem:1, metallurgy:1}},
    {t:"Wonder how it was even built/manufactured at scale", s:{civil:1, mech:1}}
  ]},
  { q:"Pick the high-school topic you'd happily do extra problems on:", opts:[
    {t:"Circuits and electromagnetism", s:{ece:2}},
    {t:"Mechanics and rotational motion", s:{mech:2, aero:1}},
    {t:"Organic reactions and mechanisms", s:{chem:2, biotech:1}},
    {t:"Probability, matrices, and proofs", s:{mnc:2, cse:1}}
  ]},
  { q:"A project excites you most if it ends with:", opts:[
    {t:"A working piece of software or an AI model", s:{cse:2, aids:2}},
    {t:"A physical structure or machine that actually moves/stands", s:{mech:1, civil:2, aero:1}},
    {t:"A molecule, material, or process that didn't exist before", s:{chem:2, biotech:1, metallurgy:1}},
    {t:"A mathematically elegant solution, regardless of physical form", s:{mnc:2}}
  ]},
  { q:"Which sentence sounds most like you?", opts:[
    {t:'"I want to know exactly how materials fail under stress."', s:{metallurgy:2, civil:1, mech:1}},
    {t:'"I want to design things that fly or leave the atmosphere."', s:{aero:2}},
    {t:'"I want to build things people use every day on their phones."', s:{cse:2}},
    {t:'"I want to work where biology meets engineering."', s:{biotech:2}}
  ]},
  { q:"In a group project, you naturally end up:", opts:[
    {t:"Writing/debugging the code or building the model", s:{cse:1, aids:2}},
    {t:"Doing the calculations and structural/electrical design", s:{civil:1, ece:1, mech:1}},
    {t:"Running the experiments and checking results", s:{chem:1, biotech:1, metallurgy:1}},
    {t:"Planning the overall system and how parts connect", s:{aero:1, mnc:1, ece:1}}
  ]},
  { q:"Which industry headline would you actually stop scrolling to read?", opts:[
    {t:"A new AI model or chip breakthrough", s:{cse:2, aids:1}},
    {t:"A new aircraft, rocket, or satellite launch", s:{aero:2}},
    {t:"A new infrastructure project (bridge, metro, smart city)", s:{civil:2}},
    {t:"A new vaccine, drug, or biomaterial", s:{biotech:2}}
  ]},
  { q:"How do you feel about long, hands-on lab work (titrations, synthesis, testing)?", opts:[
    {t:"Genuinely enjoy it — patience for repeated experiments", s:{chem:2, biotech:1, metallurgy:1}},
    {t:"Prefer working with circuits/hardware instead", s:{ece:2, mech:1}},
    {t:"Prefer working purely on a screen", s:{cse:2, aids:1, mnc:1}},
    {t:"Prefer fieldwork/site-based work over a fixed lab", s:{civil:2}}
  ]},
  { q:"Pick the problem you'd rather spend a weekend on:", opts:[
    {t:"Training a model to predict something from data", s:{aids:2, cse:1}},
    {t:"Designing a circuit for a specific signal problem", s:{ece:2}},
    {t:"Figuring out the load-bearing design of a structure", s:{civil:2, mech:1}},
    {t:"Proving or disproving a tricky mathematical claim", s:{mnc:2}}
  ]},
  { q:"Which work environment sounds better, long-term?", opts:[
    {t:"A core manufacturing/process plant", s:{mech:2, metallurgy:2, chem:1}},
    {t:"A tech product company or research lab", s:{cse:2, aids:1}},
    {t:"A construction site or infrastructure firm", s:{civil:2}},
    {t:"An aerospace/defence R&D centre", s:{aero:2}}
  ]},
  { q:"When you imagine yourself at 30, you're most likely:", opts:[
    {t:"Building or leading a tech/AI product", s:{cse:2, aids:2}},
    {t:"Leading a core-engineering or manufacturing team", s:{mech:1, metallurgy:1, chem:1}},
    {t:"Working on national infrastructure or large-scale construction", s:{civil:2}},
    {t:"In biotech/pharma research, or aerospace R&D", s:{biotech:1, aero:2}}
  ]},
  { q:"Be honest — how much does \"branch prestige\" matter to you versus actual day-to-day work?", opts:[
    {t:"Day-to-day work matters far more than the name on the degree", s:{}},
    {t:"Both matter, but I'd pick interest over prestige if forced", s:{}},
    {t:"Prestige and placement numbers matter a lot to me", s:{cse:1}},
    {t:"I genuinely don't know yet — that's why I'm taking this", s:{}}
  ]}
];

const BRANCH_INFO = {
  cse: { name:'Computer Science Engineering', note:'The most competitive branch at every IIT by cutoff — chosen here because your answers leaned toward software/logic-building, not because it\'s the "default" pick.' },
  ece: { name:'Electronics & Communication Engineering', note:'Strong fit if circuits, signals, and hardware-software overlap genuinely interest you — it has its own deep, competitive track.' },
  aero: { name:'Aerospace Engineering', note:'A specialised, smaller-intake branch — strong if flight/space genuinely pulls you, less strong if you mainly want broad placement options.' },
  mnc: { name:'Mathematics & Computing', note:'Fits a math-first mind that also wants computing exposure — narrower core-math content than pure CSE, broader than pure Math.' },
  civil: { name:'Civil Engineering', note:'Lower JEE cutoffs than CSE/ECE at most IITs, but genuinely strong for students who want tangible, large-scale infrastructure work.' },
  biotech: { name:'Biotechnology', note:'A real fit if biology-meets-engineering excites you — placement breadth is narrower than CSE, so go in with clear interest, not as a fallback.' },
  mech: { name:'Mechanical Engineering', note:'The broadest core-engineering branch — strong if you like physical systems and don\'t want to be locked into one narrow track.' },
  chem: { name:'Chemical Engineering', note:'Process-and-plant-oriented, strong core-engineering placements, fits a chemistry-and-systems mindset more than a lab-bench-only one.' },
  metallurgy: { name:'Metallurgical & Materials Engineering', note:'A genuinely interesting, lower-cutoff branch for students who like materials science — often underrated relative to its actual scope.' },
  aids: { name:'AI & Data Science', note:'A newer, fast-growing branch close to CSE in flavour — strong if you specifically want the ML/data angle rather than general software.' }
};

const BRANCH_CUTOFF_HINT = {
  cse:'Among the highest closing ranks at every IIT — IIT Bombay/Delhi CSE typically closes within the top ~100–250 in JEE Advanced for General category (verify the current year\'s official cutoffs before relying on this).',
  ece:'Closes meaningfully after CSE at the same IIT — generally a few hundred to low-thousands rank range depending on the campus.',
  aero: 'Strongest at IIT Bombay and IIT Kanpur — competitive but with more headroom than CSE/ECE at the same campus.',
  mnc:'Offered at a handful of IITs (notably IIT Delhi, BHU, Kharagpur) — cutoffs sit between core branches and CSE.',
  civil:'Among the more accessible branches at every IIT by closing rank — a realistic option across a wider rank range.',
  biotech:'Offered at fewer IITs — moderate cutoffs, but check which campuses actually offer it before targeting it.',
  mech:'Mid-range cutoffs at most IITs — broad availability across nearly every campus.',
  chem:'Similar range to Mechanical at most campuses — slightly better at IITs known for core process industries.',
  metallurgy:'Among the more accessible branches at the older IITs (especially IIT Kharagpur, BHU) by closing rank.',
  aids:'Offered at select IITs (e.g. IIT Hyderabad, Jodhpur, Guwahati) — cutoffs trending upward year over year as the field grows.'
};

let qIndex = 0;
let qScores = {};
let qHistory = [];

function renderQuiz(){
  const quizBody = document.getElementById('quiz-body');
  const bar = document.getElementById('quiz-progress-bar');
  bar.style.width = (qIndex/QUESTIONS.length*100)+'%';

  if(qIndex >= QUESTIONS.length){
    renderQuizResult();
    return;
  }
  const q = QUESTIONS[qIndex];
  quizBody.innerHTML = `
    <div class="quiz-q-num">Question ${qIndex+1} of ${QUESTIONS.length}</div>
    <h3 class="quiz-q">${q.q}</h3>
    <div class="quiz-options">
      ${q.opts.map((o,i)=>`<button class="quiz-option" data-i="${i}">${o.t}</button>`).join('')}
    </div>
    <div class="quiz-nav">
      ${qIndex>0 ? '<button class="quiz-back" id="quiz-back">← Back</button>' : '<span></span>'}
      <button class="quiz-restart" id="quiz-restart-mid">Restart</button>
    </div>
  `;
  quizBody.querySelectorAll('.quiz-option').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const opt = q.opts[parseInt(btn.dataset.i)];
      qHistory.push(JSON.parse(JSON.stringify(qScores)));
      Object.entries(opt.s || {}).forEach(([k,v])=>{ qScores[k] = (qScores[k]||0) + v; });
      qIndex++;
      renderQuiz();
    });
  });
  const back = document.getElementById('quiz-back');
  if(back) back.addEventListener('click', ()=>{
    qIndex--;
    qScores = qHistory.pop() || {};
    renderQuiz();
  });
  document.getElementById('quiz-restart-mid').addEventListener('click', resetQuiz);
}

function resetQuiz(){
  qIndex = 0; qScores = {}; qHistory = [];
  renderQuiz();
}

function renderQuizResult(){
  const quizBody = document.getElementById('quiz-body');
  const bar = document.getElementById('quiz-progress-bar');
  bar.style.width = '100%';

  const entries = Object.entries(qScores).sort((a,b)=>b[1]-a[1]);
  if(entries.length === 0){
    quizBody.innerHTML = `<p class="qr-eyebrow">Result</p><h3>No clear lean detected</h3><p class="qr-desc">Your answers spread evenly — that's a genuine result, not an error. It usually means you're genuinely undecided. Try retaking with sharper gut-reactions rather than "safe" answers.</p><button class="btn btn-primary" id="quiz-restart-end">Retake quiz</button>`;
    document.getElementById('quiz-restart-end').addEventListener('click', resetQuiz);
    return;
  }
  const [topKey, topScore] = entries[0];
  const runners = entries.slice(1,3).map(([k,v])=>`${BRANCH_INFO[k].name} (${v})`).join(', ');
  const info = BRANCH_INFO[topKey];

  quizBody.innerHTML = `
    <div class="quiz-result">
      <p class="qr-eyebrow">Closest fit</p>
      <h3>${info.name}</h3>
      <p class="qr-desc">${info.note}</p>
      <div class="qr-stats">
        <div class="qr-stat"><div class="qr-stat-label">Match score</div><div class="qr-stat-val">${topScore} pts</div></div>
        <div class="qr-stat"><div class="qr-stat-label">JEE Advanced cutoff zone</div><div class="qr-stat-val">${BRANCH_CUTOFF_HINT[topKey]}</div></div>
      </div>
      ${runners ? `<p class="qr-runners">Also worth exploring, based on your answers: ${runners}</p>` : ''}
      <p class="qr-runners" style="margin-top:14px;">This is a directional signal from 11 questions, not a verdict — cross-check it against actual subject performance and JoSAA opening/closing rank data before locking a preference order.</p>
      <button class="btn btn-primary" id="quiz-restart-end" style="margin-top:20px;">Retake quiz</button>
    </div>
  `;
  document.getElementById('quiz-restart-end').addEventListener('click', resetQuiz);
}
renderQuiz();

/* =========================================================
   STATIC DATA RENDERS
   ========================================================= */
const BRANCHES = [
  { n:'01', name:'Computer Science Engineering', desc:'Software systems, algorithms, AI/ML, and the highest-demand core skillset across almost every industry today.', roles:'SDE, ML Engineer, Research Engineer, Product Engineer', pkg:'Highest average and highest-ceiling packages among all engineering branches at IITs', companies:'Google, Microsoft, Amazon, top quant/HFT firms, AI-focused startups' },
  { n:'02', name:'Electronics & Communication Engineering', desc:'Circuits, signal processing, VLSI, and communication systems — the hardware layer underneath every device.', roles:'VLSI Engineer, Embedded Systems Engineer, SDE (many ECE grads move into software)', pkg:'Strong, just behind CSE at most IITs', companies:'Qualcomm, Intel, Nvidia, Texas Instruments, Samsung Semiconductor' },
  { n:'03', name:'Aerospace Engineering', desc:'Aircraft and spacecraft design, propulsion, aerodynamics — a focused, technically deep specialisation.', roles:'Design Engineer, Propulsion Engineer, R&D Engineer', pkg:'Moderate-to-strong, concentrated in fewer recruiters', companies:'ISRO, DRDO, HAL, Boeing, Airbus, private space startups' },
  { n:'04', name:'Mathematics & Computing', desc:'A hybrid of pure mathematics, statistics, and computing — built for analytical, proof-driven minds.', roles:'Quant Analyst, Data Scientist, SDE, Research roles', pkg:'Strong, competitive with CSE, especially in quant finance', companies:'Quant/HFT firms, top tech companies, research institutions' },
  { n:'05', name:'Civil Engineering', desc:'Structures, transportation, water resources, and large-scale infrastructure that shapes physical cities.', roles:'Structural Engineer, Site Engineer, Project Manager, Urban Planner', pkg:'Moderate; public-sector and infrastructure-firm routes add stability', companies:'L&T, Tata Projects, Shapoorji Pallonji, government infrastructure bodies' },
  { n:'06', name:'Biotechnology', desc:'Where biology meets engineering — genetic engineering, bioprocessing, pharma and medical-device development.', roles:'Research Associate, Bioprocess Engineer, R&D Scientist', pkg:'Moderate; narrower recruiter base than core engineering branches', companies:'Biocon, pharma R&D divisions, biotech startups, research institutes' },
  { n:'07', name:'Mechanical Engineering', desc:'The broadest core branch — thermodynamics, manufacturing, design, and robotics all sit under this umbrella.', roles:'Design Engineer, Manufacturing Engineer, Robotics Engineer', pkg:'Moderate-to-strong, very wide industry spread', companies:'Tata Motors, Mahindra, L&T, core PSUs, automotive and robotics firms' },
  { n:'08', name:'Chemical Engineering', desc:'Process design, plant operations, and the engineering backbone of chemicals, fuels, and materials production.', roles:'Process Engineer, Plant Engineer, R&D Engineer', pkg:'Moderate-to-strong, strong core-sector demand', companies:'Reliance, ONGC, IOCL, Tata Chemicals, core PSUs' },
  { n:'09', name:'Metallurgical & Materials Engineering', desc:'The science of materials themselves — alloys, composites, and the processes that make modern manufacturing possible.', roles:'Materials Engineer, Process Metallurgist, R&D Engineer', pkg:'Moderate; often underrated relative to its placement reality', companies:'Tata Steel, JSW, SAIL, core materials-research labs' },
  { n:'10', name:'AI & Data Science', desc:'A newer, fast-growing branch focused specifically on machine learning, data systems, and applied AI.', roles:'ML Engineer, Data Scientist, AI Research Engineer', pkg:'Strong and rising quickly as demand for AI talent grows', companies:'AI-first startups, big tech AI divisions, research labs' }
];
document.getElementById('branch-grid').innerHTML = BRANCHES.map(b=>`
  <div class="branch-card">
    <span class="branch-num">${b.n}</span>
    <h3>${b.name}</h3>
    <p>${b.desc}</p>
    <div class="branch-meta">
      <div><b>Roles:</b> <span>${b.roles}</span></div>
      <div><b>Packages:</b> <span>${b.pkg}</span></div>
      <div><b>Top recruiters:</b> <span>${b.companies}</span></div>
    </div>
  </div>
`).join('');

const COACHING = [
  { name:'Allen', tag:'top', tagLabel:'Top tier', note:'Top-notch study materials and a very high selection ratio — AIR 1, 2, and 3 in JEE Advanced 2026 came from Allen.' },
  { name:'Sri Chaitanya', tag:'top', tagLabel:'Top tier', note:'Performance sits close to Narayana, just behind Allen overall.' },
  { name:'Narayana', tag:'top', tagLabel:'Top tier', note:'Performance sits close to Sri Chaitanya, just behind Allen overall.' },
  { name:'Physics Wallah (PW)', tag:'mid', tagLabel:'Strong online', note:'Excellent quality-to-price online batches (under ₹10K). Offline "Vidyapeeth" centres are priced like other top institutes (~₹2.6L for two years) and are a different, less consistently strong product.' },
  { name:'Resonance', tag:'mid', tagLabel:'Solid, not elite', note:'Good, consistent overall results — hasn\'t produced many AIR-under-100 ranks recently.' },
  { name:'Esaral', tag:'mid', tagLabel:'Solid, not elite', note:'Good overall results, similar tier to Resonance/Motion.' },
  { name:'Motion (by NV Sir)', tag:'mid', tagLabel:'Solid, not elite', note:'Good overall results — strong reputation built around NV Sir specifically.' },
  { name:'CareerWill', tag:'mid', tagLabel:'Solid, not elite', note:'Good overall results, similar tier to Resonance/Esaral/Motion.' },
  { name:'VMC (Vidya Mandir Classes)', tag:'mid', tagLabel:'Solid, not elite', note:'Good overall results, similar tier to Resonance/Esaral/Motion.' },
  { name:'Vibrant', tag:'watch', tagLabel:'Marketing > recent results', note:'Faculty have authored widely-followed problem books, but recent top-rank output has dropped — highest JEE Adv. 2026 rank from Vibrant was ~570 (only one student under AIR 1000), despite marketing around past AIR 1–5 students.' },
  { name:'Aakash', tag:'watch', tagLabel:'Better for NEET', note:'Decent, but considerably stronger for NEET than JEE. The Invictus batch specifically has produced some good JEE ranks.' },
  { name:'Vedantu', tag:'watch', tagLabel:'Not recommended for JEE', note:'Not strong for JEE prep. For Math Olympiad / ISI / CMI prep specifically, however, Vedantu Olympiad School (VOS) is well regarded.' }
];
document.getElementById('coaching-grid').innerHTML = COACHING.map(c=>`
  <div class="coach-card">
    <h3>${c.name} <span class="coach-tag tag-${c.tag}">${c.tagLabel}</span></h3>
    <p>${c.note}</p>
  </div>
`).join('');

document.getElementById('local-reasons').innerHTML = [
  'Faculty standards are typically inconsistent, though some good teachers — sometimes ex-faculty from Allen, Aakash etc. — do exist.',
  'Study materials are often missing or below the standard of top-institute modules.',
  'Top institutes run a more structured, tested curriculum.',
  'Lower batch strength usually means a less competitive peer environment.',
  'Facilities like doubt support, app features, and mentorship are often lacking.',
  'Test quality tends to be weaker.',
  'Pace is often slower — and completing the syllabus with time to spare for revision matters a lot in JEE.',
  'Some local institutes charge fees comparable to top institutes anyway, without matching the value.'
].map(t=>`<li>${t}</li>`).join('');

document.getElementById('habits-list').innerHTML = [
  'Make class notes and revise them on a fixed schedule, not "when there\'s time."',
  'Keep a formula sheet for fast pre-mock review.',
  'Maintain a Mistakes Notebook and review it regularly — this is one of the highest-leverage habits in JEE prep.',
  'Analyse every test for recurring weak areas instead of just checking the score.',
  'Avoid silly mistakes deliberately — they\'re fixable through review, not talent.',
  'Stay consistent with a daily schedule. Long-term progress comes from consistency more than occasional intensity.'
].map(t=>`<li>${t}</li>`).join('');

const BOOKS = {
  Mathematics: [ '<b>Advanced Problems in JEE Mains and Advanced</b> ("Black Book") — V. Gupta & Pankaj Joshi' ],
  Physics: [
    '<b>Concepts of Physics</b> — H. C. Verma (light on theory, excellent for conceptual grounding)',
    '<b>Physics Galaxy</b> (5-volume set) — Ashish Arora, strong on theory, illustrations, and problems',
    '<b>700+ Advanced Illustrations in JEE Advanced</b> — Ashish Arora',
    '<b>Problems in General Physics</b> — I. E. Irodov'
  ],
  Chemistry: [
    '<b>NCERT Chemistry</b>, Class 11 &amp; 12 (theory only)',
    '<b>Advanced Problems in Physical Chemistry</b> — Neeraj Kumar (tougher than N Awasthi)',
    '<b>Problems in Physical Chemistry for JEE Main &amp; Advanced</b> — N. Awasthi',
    '<b>Problems in Inorganic Chemistry for JEE Main &amp; Advanced</b> — V. K. Jaiswal',
    '<b>Problems in Organic Chemistry for JEE Main &amp; Advanced</b> — M. S. Chauhan'
  ]
};
document.getElementById('books-grid').innerHTML = Object.entries(BOOKS).map(([subj,list])=>`
  <div class="book-subj">
    <h3>${subj}</h3>
    <ol>${list.map(b=>`<li>${b}</li>`).join('')}</ol>
  </div>
`).join('') + `<div class="book-subj"><h3>A note on self-study sets</h3><ol><li>Cengage books are solid too, but built more for students managing prep largely on their own.</li></ol></div>`;

const RANKINGS = [
  ['IIT Delhi (IITD)','#118'], ['IIT Bombay (IITB)','#134'], ['IIT Madras (IITM)','#170'],
  ['IIT Kharagpur (IIT-KGP)','#205'], ['IIT Kanpur (IITK)','#222'], ['IIT Roorkee (IITR)','#335'],
  ['IIT Guwahati (IITG)','#350'], ['IIT BHU Varanasi','#510'], ['IIT Indore','#547'], ['IIT Hyderabad','#588']
];
document.getElementById('rank-table').innerHTML = `
  <thead><tr><th>Institute</th><th>Global Rank</th></tr></thead>
  <tbody>${RANKINGS.map(([n,r])=>`<tr><td>${n}</td><td>${r}</td></tr>`).join('')}</tbody>
`;

const SYLLABUS = {
  11: {
    Mathematics:['Sets','Relations and Functions','Trigonometric Functions','Complex Numbers','Quadratic Equations','Linear Inequalities','Permutations and Combinations','Binomial Theorem','Sequences and Series','Straight Lines','Conic Sections','Introduction to Three Dimensional Geometry','Limits and Derivatives','Statistics','Probability'],
    Physics:['Units and Measurements','Motion in a Straight Line','Motion in a Plane','Laws of Motion','Work, Energy and Power','System of Particles and Rotational Motion','Gravitation','Mechanical Properties of Solids','Mechanical Properties of Fluids','Thermal Properties of Matter','Thermodynamics','Kinetic Theory','Oscillations','Waves'],
    Chemistry:['Some Basic Concepts of Chemistry (Mole Concept)','Structure of Atom','Classification of Elements and Periodicity in Properties','Chemical Bonding and Molecular Structure','Thermodynamics','Equilibrium','Redox Reactions','Organic Chemistry — Basic Principles','Hydrocarbons']
  },
  12: {
    Mathematics:['Relations and Functions','Inverse Trigonometric Functions','Matrices','Determinants','Continuity and Differentiability','Application of Derivatives','Integrals','Application of Integrals','Differential Equations','Vector Algebra','Three Dimensional Geometry','Linear Programming','Probability'],
    Physics:['Electric Charges and Fields','Electrostatic Potential and Capacitance','Current Electricity','Moving Charges and Magnetism','Magnetism and Matter','Electromagnetic Induction','Alternating Current','Electromagnetic Waves','Ray Optics and Optical Instruments','Wave Optics','Dual Nature of Radiation and Matter','Atoms','Nuclei','Semiconductor Electronics'],
    Chemistry:['Solutions','Electrochemistry','Chemical Kinetics','The d- and f-Block Elements','Coordination Compounds','Haloalkanes and Haloarenes','Alcohols, Phenols and Ethers','Aldehydes, Ketones and Carboxylic Acids','Amines','Biomolecules']
  }
};
function renderSyllabus(cls){
  const data = SYLLABUS[cls];
  document.getElementById('syllabus-grid').innerHTML = Object.entries(data).map(([subj,list])=>`
    <div class="syl-card">
      <h4>${subj}</h4>
      <ul>${list.map(c=>`<li>${c}</li>`).join('')}</ul>
    </div>
  `).join('');
  makeRevealable();
}
renderSyllabus(11);
document.querySelectorAll('.tab-btn').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    renderSyllabus(btn.dataset.class);
  });
});

const RESOURCES = [
  { name:'PrepTrack JEE', desc:'Track your JEE preparation progress.', url:'https://preptrack-jee.vercel.app/' },
  { name:'JEE Circles (Telegram)', desc:'A community of JEE aspirants.', url:'https://t.me/JEECIRCLES' },
  { name:'Exam Clock', desc:'Live countdown for JEE/NEET aspirants.', url:'https://examclock-jee-neet-aspirants.vercel.app/' },
  { name:'JEE Archive', desc:'Free JEE study resources.', url:'https://jeearchive.in/' },
  { name:'SelfStudys', desc:'Free study material and papers.', url:'https://www.selfstudys.com/' },
  { name:'JEE Study Buddy', desc:'By Newton School of Technology (NST).', url:'https://my.newtonschool.co/study-buddy' },
  { name:'NTA Quiz', desc:'Official mock tests by NTA.', url:'https://nta.ac.in/Quiz' },
  { name:'NTA Lectures', desc:'Content-based lectures by NTA.', url:'https://nta.ac.in/LecturesContent' },
  { name:'SATHEE by IIT Kanpur', desc:'Free guidance and content platform.', url:'https://sathee.iitk.ac.in/' },
  { name:'NotebookLM', desc:'Google\'s research and note-organising tool.', url:'https://notebooklm.google.com/' },
  { name:'Physics Galaxy', desc:'By Ashish Arora — lectures and problems.', url:'https://www.physicsgalaxy.com/' }
];
document.getElementById('resource-grid').innerHTML = RESOURCES.map(r=>`
  <a class="resource-card" href="${r.url}" target="_blank" rel="noopener">
    <span class="rc-name">${r.name}</span>
    <span class="rc-desc">${r.desc}</span>
    <span class="rc-url">${r.url}</span>
  </a>
`).join('');

makeRevealable();
