(function(){
'use strict';
const A={
  "t1": "assets/images/t1.webp",
  "t2": "assets/images/t2.webp",
  "news1": "assets/images/news1.webp",
  "news2": "assets/images/news2.webp",
  "news3": "assets/images/news3.webp",
  "blog1": "assets/images/blog1.webp",
  "blog2": "assets/images/blog2.webp",
  "blog3": "assets/images/blog3.webp",
  "plane": "assets/images/plane.webp",
  "jet": "assets/images/jet.webp",
  "rocket": "assets/images/rocket.webp",
  "badges": "assets/images/badges.png",
  "logo": "assets/images/logo.png",
  "lg_forbes": "assets/logos/forbes.png",
  "lg_et": "assets/logos/et.png",
  "lg_dig": "assets/logos/dig.png",
  "lg_unite": "assets/logos/unite.png",
  "lg_bosch": "assets/logos/bosch.png",
  "lg_pwc": "assets/logos/pwc.png",
  "lg_bpcl": "assets/logos/bpcl.png",
  "lg_medtronic": "assets/logos/medtronic.png",
  "lg_wipro": "assets/logos/wipro.png",
  "lg_kaiser": "assets/logos/kaiser.png",
  "lg_everest": "assets/logos/everest.png",
  "lg_gartner": "assets/logos/gartner.png",
  "lg_forrester": "assets/logos/forrester.png",
  "lg_idc": "assets/logos/idc.png"
};
const $=s=>document.querySelector(s);
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- shared infra: one rAF ticker, debounced resize, stable viewport height ---------- */
const TICKERS=[];
const RESIZERS=[];
function onResize(fn){RESIZERS.push(fn)}
let vw=innerWidth,vh=innerHeight;
const isTouch=matchMedia('(pointer:coarse)').matches;
function setVH(){document.documentElement.style.setProperty('--vh',(vh/100)+'px')}
setVH();
let rzT=0;
addEventListener('resize',()=>{clearTimeout(rzT);rzT=setTimeout(()=>{
  const w=innerWidth,h=innerHeight;
  // mobile URL bars change height constantly — only react to real size changes
  if(w!==vw||Math.abs(h-vh)>(isTouch?160:0)){vw=w;vh=h;setVH();RESIZERS.forEach(f=>f())}
},isTouch?180:90)});
addEventListener('orientationchange',()=>setTimeout(()=>{vw=innerWidth;vh=innerHeight;setVH();RESIZERS.forEach(f=>f())},350));
/* ---------- EIQ pixel mark ("iq") ---------- */
const PIX=[[0,0],[0,2],[0,3],[0,4],[0,5],[0,6],[3,2],[4,2],[5,2],[2,3],[5,3],[2,4],[5,4],[2,5],[5,5],[3,6],[4,6],[5,6],[5,7],[5,8]];
const EIQ_MARK=['#####.###..###.','#......#..#...#','#......#..#...#','####...#..#...#','#......#..#.#.#','#......#..#..#.','#####.###..##.#'];
$('#markSvg').innerHTML=EIQ_MARK.flatMap((row,y)=>[...row].map((c,x)=>c==='#'?`<rect x="${x*10+1}" y="${y*10+1}" width="8" height="8" rx="1" style="animation-delay:${((x+y)*0.045).toFixed(3)}s"/>`:'')).join('');

/* ---------- isometric icon generator (VECTR icon style) ---------- */
function iso(boxes){
  const S=10,cx=Math.cos(Math.PI/6)*S,sy=Math.sin(Math.PI/6)*S;
  const P=(x,y,z)=>[(x-z)*cx,(x+z)*sy-y*S];
  boxes=boxes.slice().sort((a,b)=>(a[0]+a[3]+a[1]+a[4]+a[5]*.5)-(b[0]+b[3]+b[1]+b[4]+b[5]*.5)||a[5]-b[5]);
  let out='',mnx=1e9,mny=1e9,mxx=-1e9,mxy=-1e9;
  const poly=(pts,f)=>{pts.forEach(p=>{mnx=Math.min(mnx,p[0]);mxx=Math.max(mxx,p[0]);mny=Math.min(mny,p[1]);mxy=Math.max(mxy,p[1]);});out+=`<path d="M${pts.map(p=>p[0].toFixed(2)+' '+p[1].toFixed(2)).join('L')}Z" fill="${f}"/>`;};
  boxes.forEach(([x,z,w,d,h,y=0,dark])=>{
    const x1=x+w,z1=z+d,y1=y+h;
    poly([P(x,y1,z),P(x1,y1,z),P(x1,y1,z1),P(x,y1,z1)],dark?'#050419':'#fcfcfc');
    poly([P(x,y,z1),P(x1,y,z1),P(x1,y1,z1),P(x,y1,z1)],'#e6e6e8');
    poly([P(x1,y,z),P(x1,y,z1),P(x1,y1,z1),P(x1,y1,z)],'#050419');
  });
  const pad=3;
  return `<svg viewBox="${(mnx-pad).toFixed(1)} ${(mny-pad).toFixed(1)} ${(mxx-mnx+2*pad).toFixed(1)} ${(mxy-mny+2*pad).toFixed(1)}" stroke="#050419" stroke-width="1.3" stroke-linejoin="round" aria-hidden="true"><g class="ig">${out}</g></svg>`;
}
const ICONS={
  rev:[[0,0,1.6,1.6,1.6],[2.2,0,1.6,1.6,3],[4.4,0,1.6,1.6,4.6],[4.4,0,1.6,1.6,.5,5.2,1]],
  cost:[[0,0,1.6,1.6,4.6],[2.2,0,1.6,1.6,3],[4.4,0,1.6,1.6,1.4],[4.4,0,1.6,1.6,.4,1.9,1]],
  time:[[0,0,5.4,3.4,.6],[.5,.5,1.2,1.2,1.2,.6],[2.1,.5,1.2,1.2,1.2,.6,1],[3.7,.5,1.2,1.2,1.2,.6],[.5,1.8,1.2,1.2,1.2,.6],[2.1,1.8,1.2,1.2,1.2,.6],[3.7,1.8,1.2,1.2,1.2,.6]],
  prod:[[0,0,2,2,2],[2.2,0,2,2,2],[0,2.2,2,2,2],[2.2,2.2,2,2,2],[1.1,1.1,2,2,2,2.4,1]],
  agent:[[0,0,3,3,3],[.9,.9,1.2,1.2,1.2,4.2,1]],
  builder:[[0,1.3,7.4,.6,.2],[0,.7,1.8,1.8,1.8],[2.8,.7,1.8,1.8,1.8,0,1],[5.6,.7,1.8,1.8,1.8]],
  bots:[[0,0,3,3,2.6],[1.3,1.3,.4,.4,1.6,2.6],[.9,.9,1.2,1.2,1,4.2,1]],
  decide:[[0,1.2,3,.6,.2],[3,0,.6,3,.2],[3,-1.4,1.6,1.6,1.6,0,1],[3,3,1.6,1.6,1.6],[-1.6,.7,1.6,1.6,1.6]],
  data:[[0,0,3.4,3.4,.7],[0,0,3.4,3.4,.7,1.1,1],[0,0,3.4,3.4,.7,2.2],[0,0,3.4,3.4,.7,3.3]],
  react:[[0,0,5,.4,.4],[0,4.6,5,.4,.4],[0,.4,.4,4.2,.4],[4.6,.4,.4,4.2,.4],[1.7,1.7,1.6,1.6,2.4,0,1]],
  conn:[[0,0,2.2,2.2,2.2],[2.2,.8,2.4,.6,.6,.8],[4.6,0,2.2,2.2,2.2,0,1]],
  live:[[0,0,6,3.4,.5],[.6,1,.9,1.4,1.2,.5],[2,1,.9,1.4,2.4,.5,1],[3.4,1,.9,1.4,1.7,.5],[4.8,1,.9,1.4,3,.5]],
  apps:[[0,0,3.6,.5,3],[4.2,0,2,.5,2.6,0,1],[6.8,0,1,.5,1.8]]
};

/* ---------- pixel icons (the PDF's blue pixel illustration style) ---------- */
const PXI={
 rev:['........##','........##','.....##.##','.....##.##','..##.##.##','..##.##.##','##.#.##.##','##.#.##.##','++++++++++'],
 cost:['##........','##........','##.##.....','##.##.....','##.##.##..','##.##.##..','##.##.##.#','##.##.##.#','++++++++++'],
 time:['...####...','.##++++##.','.#++#+++#.','#+++#++++#','#+++###++#','#++++++++#','.#++++++#.','.##++++##.','...####...'],
 prod:['....##....','...####...','..######..','.##.++.##.','....++....','.#..++..#.','###.++.###','###.++.###','++++++++++'],
 agent:['..#.##.#..','.########.','##++++++##','.#+####+#.','##+#..#+##','.#+####+#.','##++++++##','.########.','..#.##.#..'],
 builder:['###....###','#+#++++#+#','###....###','....+.....','...###....','...#+#....','...###....','....+.....','###++++###'],
 bots:['....##....','....##....','.########.','.#++++++#.','.#+##+##+.','.#++++++#.','.########.','...#..#...','..##..##..'],
 decide:['....##....','....##....','....++....','....++....','..++++++..','..+....+..','.###..###.','.#+#..#+#.','.###..###.'],
 data:['.########.','#++++++++#','.########.','#++++++++#','.########.','#++++++++#','.########.','#++++++++#','.########.'],
 react:['......##..','.....##...','....##....','...######.','..######..','....##....','...##.....','..##......','.##.......'],
 conn:['.#..#.....','.#..#.....','######....','#++++#....','#++++#....','.####.....','..##......','..##++++##','.......###'],
 live:['##########','#++++++++#','#+++++#++#','#++++#+#+#','#+#+#+++##','#++#+++++#','##########','....##....','..######..'],
 apps:['#######...','#+++++#.##','#+++++#.#+','#+++++#.#+','#######.##','...##.....','..####....','..........','.....###..'],
 // industries
 bank:['....##....','..######..','.########.','++++++++++','.#.#..#.#.','.#.#..#.#.','.#.#..#.#.','++++++++++','##########'],
 shield:['.########.','.#++++++#.','.#+++++##.','.#++++#+#.','.#+#+#++#.','.#++#+++#.','..#++++#..','...#++#...','....##....'],
 health:['...####...','...#++#...','...#++#...','####++####','#++++++++#','####++####','...#++#...','...#++#...','...####...'],
 bulb:['...####...','..#++++#..','.#++++++#.','.#+#++#+#.','.#++##++#.','..#+##+#..','...####...','...#++#...','....##....'],
 tower:['.#......#.','#..#..#..#','#.#.##.#.#','#..#..#..#','.#..##..#.','....##....','...#..#...','..#++++#..','.#......#.'],
 bag:['...####...','..#....#..','..#....#..','.########.','.#+#++#+#.','.#++++++#.','.#++++++#.','.#++++++#.','.########.'],
 // functional domains
 gear:['....##....','.##.##.##.','.########.','..##++##..','####++####','..##++##..','.########.','.##.##.##.','....##....'],
 chat:['##########','#++++++++#','#+#++++#+#','#++++++++#','#+#++++#+#','#++####++#','##########','.##.......','.#........'],
 receipt:['.########.','.#++++++#.','.#+####+#.','.#++++++#.','.#+####+#.','.#++++++#.','.#+##+++#.','.#++++++#.','.##.##.##.'],
 funnel:['##########','#++++++++#','.########.','..#++++#..','..######..','...#++#...','...####...','....##....','....##....'],
 truck:['..........','######....','#++++####.','#++++#++#.','#++++#+++#','#++++#+++#','##########','.##....##.','.##....##.'],
 scales:['....##....','.########.','.#..##..#.','#+#.##.#+#','###.##.###','....##....','....##....','..##++##..','.########.']
};
function pix(key,delayed){
  const g=PXI[key]||PXI.agent,C=10,S=10.8;let out='',k=0;const cells=[];
  g.forEach((row,y)=>[...row].forEach((ch,x)=>{if(ch==='#'||ch==='+')cells.push([x,y,ch])}));
  // reveal order: sweep diagonally with a little noise, like pixels printing in
  cells.forEach(c=>c.push(c[0]+c[1]+((c[0]*7+c[1]*13)%5)*.35));
  const mx=Math.max(...cells.map(c=>c[3]));
  cells.forEach(([x,y,ch,o],i)=>{const f=(o/mx).toFixed(3);
    // scatter start: pixels fly in from anywhere around the icon, then snap into the grid
    const h1=Math.sin((x+1)*12.9898+(y+1)*78.233+key.length*3.1)*43758.5453,h2=Math.sin((x+1)*39.346+(y+1)*11.135+key.length*1.7)*24634.6345,h3=Math.sin((x+3)*7.13+(y+5)*3.71)*9631.7;
    const r1=h1-Math.floor(h1),r2=h2-Math.floor(h2),r3=h3-Math.floor(h3);
    const dx=((r1-.5)*300-(x*S-50)*.35).toFixed(1),dy=((r2-.5)*200-(y*S-45)*.35).toFixed(1),dl=(r3*.35).toFixed(2);
    out+=`<rect x="${x*S}" y="${y*S}" width="${C}" height="${C}" fill="${ch==='#'?'#0068de':'#bcd5f5'}" data-o="${f}" data-dx="${dx}" data-dy="${dy}" data-dl="${dl}" style="--dx:${dx}px;--dy:${dy}px;--dl:${delayed?(.1+ +dl).toFixed(2):0}s"/>`});
  return `<svg class="px" viewBox="-2 -2 ${10*S+4} ${g.length*S+4}" aria-hidden="true">${out}</svg>`;
}
/* ---------- content ---------- */
const STEPS=[
  ['Pick what to fix','Choose the process you want to make faster, cheaper, or easier. Start with one task and see exactly where it slows your team down.'],
  ['Connect your tools','Link the systems you already use by dragging and dropping — nothing to replace, and nothing to rebuild from scratch.'],
  ['Add AI that acts on its own','Bring in AI helpers and bots that make decisions and do the work for you, moving each case forward without waiting on a person.'],
  ['Watch it run','See results on a live screen, and make changes any time you need to — every step, every case, in one view.'],
  ['Grow at your own pace','Go from one process to your whole company, without switching systems. Stop after one task, or keep going.']
];
const STATS=[
  ['rev','40%','More revenue','From a new sales tool we built for a large US healthcare company.'],
  ['cost','70%','Lower costs','When a major bank moved to a new lending-rate system.'],
  ['time','<7 wks','To go live','An automated system for handling rules and insurance claims.'],
  ['prod','90%','More productive staff','After automating how one refinery manages changes.']
];
const TOOLS=[
  ['agent','AI that acts on its own','AI helpers that make decisions and take action to reach a goal you set.'],
  ['builder','Visual process builder','Design multi-step processes by dragging and connecting boxes — no coding.'],
  ['bots','Smart automated bots','Bots that fix themselves and keep working even when a screen or app changes.'],
  ['decide','Automatic decisions','Business rules that update themselves as conditions or regulations change.'],
  ['data','Connected data','See and use data from all your systems in one place — no need to move it first.'],
  ['react','Instant reactions','Respond to what\u2019s happening across your systems the moment it happens.'],
  ['conn','Connects to your tools','Works with 3,000+ common business systems, right out of the box.'],
  ['live','Reports you can see live','A live screen showing how every process is doing, with no extra setup.'],
  ['apps','Apps for any device','Build once, and get working apps for web, phone, and desktop.']
];
const IND_URL=['https://evoluteiq.com/solutions/agentic-automation-platform-for-banking-and-financial-services/','https://evoluteiq.com/solutions/agentic-automation-platform-for-insurance-solutions/','https://evoluteiq.com/solutions/agentic-automation-platform-for-healthcare-solutions/','https://evoluteiq.com/solutions/agentic-automation-platform-for-energy-and-utilities-industry/','https://evoluteiq.com/solutions/agentic-automation-platform-for-telecom-and-media/','https://evoluteiq.com/solutions/agentic-automation-platform-for-retail-and-cpg/'];
// flat white icons for the blue industries grid (no gather animation)
const MONO={
  bank:['....##....','..######..','##########','..........','.#.#..#.#.','.#.#..#.#.','.#.#..#.#.','..........','##########'],
  shield:['##########','#........#','#.######.#','#.#....#.#','#.######.#','.#......#.','..#....#..','...#..#...','....##....'],
  health:['.###..###.','##########','####..####','###....###','####..####','.########.','..######..','...####...','....##....'],
  bulb:['......##..','.....##...','....##....','...######.','..######..','....##....','...##.....','..##......','.##.......'],
  tower:['.#......#.','#..#..#..#','#.#.##.#.#','#..#..#..#','.#..##..#.','....##....','...####...','..##..##..','.##....##.'],
  bag:['...####...','..#....#..','##########','#........#','#........#','#........#','#........#','#........#','##########']
};
const mono=k=>{const g=MONO[k];let o='';g.forEach((r,y)=>[...r].forEach((c,x)=>{if(c==='#')o+=`<rect x="${x*4}" y="${y*4}" width="3.4" height="3.4"/>`}));return `<svg class="mono" viewBox="0 0 40 36" aria-hidden="true" fill="currentColor">${o}</svg>`};
const IND=[['Banking','Modern tools to help banks innovate safely and manage risk.','bank'],['Insurance','Faster, smarter handling of claims, policies, and customer questions.','shield'],['Healthcare','Simpler patient services and smoother day-to-day operations, with AI.','health'],['Energy & Utilities','Run complex operations and equipment more smoothly and safely.','bulb'],['Telecom & Media','Better customer service and smarter network management.','tower'],['Retail & CPG','More personal shopping experiences and a smoother supply chain.','bag']];
// functional domains (from evoluteiq.com → Solutions → Functional Domains)
const DOMAINS=[
  ['gear','Operational resilience','Keep work moving when a system fails, a supplier slips, or demand jumps overnight.'],
  ['chat','Customer experience','Personal, joined-up service across every channel your customers use.'],
  ['receipt','Finance & accounting','Invoices, reconciliations and month-end close, with far fewer manual checks.'],
  ['funnel','Sales & marketing','AI insights that help teams find the right leads and follow up at the right time.'],
  ['truck','Supply chain','Spot stock and shipping problems early, and reroute before customers notice.'],
  ['scales','Legal & risk','Compliance checks and approvals that keep up as rules and regulations change.']
];
const ROLES=[
  ['Business leaders','Show results,','not just plans.',['Fix things like new-employee setup, compliance checks, or claims — with automation that adjusts as things change.','See cost savings and fewer mistakes in one place, instead of five different screens.','Show real numbers to your leadership team from week one — not just a plan on a slide.']],
  ['CTOs & CIOs','One platform,','not ten tools.',['Run AI helpers, bots, rules and apps on one platform instead of stitching separate tools together.','Connect the systems you already own with 3,000+ ready-made connectors — nothing to rip out or replace.','Host it in the cloud or on your own servers, with the security and access controls your team expects.']],
  ['Enterprise architects','Compose it once,','reuse it everywhere.',['Design a process once and reuse it across teams, all running on the same engine.','Use data from all your systems where it already lives — no need to move or copy it first.','Test changes safely and roll them out step by step, with an easy way back if something goes wrong.']],
  ['IT & Automation leads','Bots that keep running','when the screen changes.',['Build by dragging and connecting boxes — no code needed for most processes.','Run bots that fix themselves and keep working when a screen or app changes.','Watch every process on a live screen, and get an alert the moment something drifts.']],
  ['Data & AI teams','Put your models to work','inside the process.',['Bring every data source into one place, then build and train AI models on it.','Put AI helpers to work on goals you set, with limits and human checkpoints you control.','Measure what the AI decides against real results, on the same screen the business already uses.']]
];
const FAQ=[
  ['Business leaders',['Fix things like new-employee setup, compliance checks, or claims — with automation that adjusts as things change.','See cost savings and fewer mistakes in one place, instead of five different screens.','Show real numbers to your leadership team from week one — not just a plan on a slide.']],
  ['CTOs & CIOs',['Run AI helpers, bots, rules and apps on one platform instead of stitching separate tools together — with 3,000+ connectors to the systems you already own.']],
  ['Enterprise architects',['Use data from all your systems without moving it first, and design processes that span every team on the same engine.']],
  ['IT & Automation leads',['Build by dragging and connecting boxes, run bots that keep working when a screen changes, and watch every process on a live screen.']],
  ['Data & AI teams',['Bring every source into one place, build AI models, and put AI helpers to work on goals you set — hosted on your own servers when you need it.']]
];
const ANALYSTS=[['everest','Leader — Process Orchestration PEAK Matrix®, 2025'],['everest','Major Contender — Agentic AI PEAK Matrix®, 2026'],['gartner','Positioned — Magic Quadrant™ for RPA, 2025'],['forrester','Featured — Digital Process Automation Landscape, Q2 2025'],['idc','Featured — Digital Process Automation Landscape, Q2 2025']];
const NEWS=[
  ['news1','Product','Enterprise AI, now native to Google Cloud','eiq360 is now live on Google Cloud, built with Gemini — describe what you need in plain English, and it builds a working app for you.','EvoluteIQ Newsroom · September 2026'],
  ['news2','Company','Doubling down on global growth','A $53M investment from Baird Capital brings two new senior leaders on board, as EvoluteIQ grows across North America, Europe, and Asia.','EvoluteIQ Newsroom · September 2026'],
  ['news3','Company','EvoluteIQ bets on agentic AI to take enterprise automation to the next level','An outside look at EvoluteIQ\u2019s move toward smarter, more independent AI — and what it means for the companies that use it.','The Economic Times']
];
const BLOGS=[
  ['blog1','Perspective','Enterprise AI, now native to Google Cloud','A look at why simple AI tools stop helping after a while, and what it really takes to grow past that.','Arun Hiremath · August 2026'],
  ['blog2','Perspective','Agentic AI is not the revolution. Agentic automation is.','Explaining the difference between AI that just chats and AI that can actually run a task from start to finish.','EvoluteIQ Editorial Team · June 2026'],
  ['blog3','Interview','From automation to autonomy: a conversation with Sameet Gupte','EvoluteIQ\u2019s CEO and co-founder talks about the difference between automating a task and letting AI truly run it.','April 2026 · via Unite.AI']
];
const PLANS=[
  ['plane','Lite','AI, bots, and process tools to automate your first tasks.',['Easy app builder — no coding needed','Unlimited automated bots','Standard web & mobile forms']],
  ['jet','Pro','Everything in Lite, plus tools to connect all your data in one place.',['Everything in EIQ Lite','Tools to connect and organize your data','Mobile tools & an AI model builder']],
  ['rocket','Enterprise','Everything in Pro, plus real-time alerts, big data tools, and advanced AI.',['Everything in EIQ Pro','Real-time alerts & big data tools','Advanced AI tools, hosted on your own servers']]
];
const ext='<svg viewBox="0 0 10 10"><path d="M1 9 9 1M3 1h6v6" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>';
const esc=s=>s.replace(/&/g,'&amp;');

$('#steps').innerHTML=STEPS.map((s,i)=>`<div class="step" data-i="${i}"><div class="step__head"><div class="step__num"><span>0${i+1}</span></div><h3 class="step__title">${s[0]}</h3></div><div class="step__body"><div><div class="step__inner"><div class="step__track"><div class="step__bar"><i></i></div></div><p class="step__desc">${s[1]}</p></div></div></div></div>`).join('');
$('#rsList').insertAdjacentHTML('beforeend',STATS.map((s,i)=>`<button class="rs__item" data-i="${i}"><span class="rs__dot">${i+1}</span><span class="rs__t"><b>${s[1].replace('<','&lt;')}</b> ${s[2].toLowerCase()}</span><span class="rs__d">${s[3]}</span></button>`).join(''));

/* ---------- pixel morph engine: squares scatter and re-form into each shape ---------- */
function pixelMorph(cv,COLS,ROWS,S,FILL,idle){
  const N=Math.max(...S.map(s=>s.length))+220;
  const ctx=cv.getContext('2d');
  const P=[];for(let i=0;i<N;i++)P.push({x:Math.random(),y:Math.random(),sx:0,sy:0,tx:Math.random(),ty:Math.random(),vx:0,vy:0,a:0,a0:0,ta:0,c0:1,c:1,tc:1,d:Math.random()*.32,px:0,py:0});
  let W=0,H=0,cell=0,ox=0,oy=0,cur=-1,start=0,dpr=1,visible=false,started=false;
  function size(){const r=cv.getBoundingClientRect();dpr=Math.min(devicePixelRatio||1,2);W=r.width;H=r.height;cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr);cell=Math.min(W/(COLS+2),H/(ROWS+2));ox=(W-cell*COLS)/2;oy=(H-cell*ROWS)/2;}
  let dirty=true;size();onResize(()=>{size();dirty=true});
  function go(i){if(i===cur)return;if(!W)size();cur=i;start=performance.now();dirty=true;const sh=S[i];
    const order=[...P.keys()].sort(()=>Math.random()-.5);
    order.forEach((pi,k)=>{const p=P[pi];p.px=p.x;p.py=p.y;p.a0=p.a;p.c0=p.c;p.sx=Math.random();p.sy=Math.random();p.d=Math.random()*.3;
      if(k<sh.length){const [gx,gy,v]=sh[k];p.tx=(ox+gx*cell)/W;p.ty=(oy+gy*cell)/H;p.ta=1;p.tc=v}
      else{p.tx=Math.random();p.ty=Math.random();p.ta=0;p.tc=idle[(Math.random()*idle.length)|0]}});
  }
  const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
  function draw(now){if(!visible||!W)return;
    const T=reduce?1:(now-start)/1500;if(T>1.05&&!dirty)return;if(T>1.05)dirty=false;
    ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,W,H);
    const sz=cell*.78;let lastC=0;
    for(const p of P){let e=reduce?1:ease(cl((T-p.d)/(1-.3)));
      const u=1-e;p.x=u*u*p.px+2*u*e*p.sx+e*e*p.tx;p.y=u*u*p.py+2*u*e*p.sy+e*e*p.ty;
      const mid=Math.sin(e*Math.PI);p.a=p.ta?Math.max(p.a0*u,e)*1:(p.a0*(1-e)+mid*.9*(1-e*e));
      if(e>.5)p.c=p.tc;
      if(p.a<.01)continue;const s=sz*(.62+.38*(p.ta?e:1-mid*.3));
      if(p.c!==lastC){ctx.fillStyle=FILL[p.c];lastC=p.c}ctx.globalAlpha=p.a>1?1:p.a;ctx.fillRect(p.x*W-s/2+cell*.5,p.y*H-s/2+cell*.5,s,s);}
    ctx.globalAlpha=1;
  }
  TICKERS.push(draw);
  new IntersectionObserver(e=>{visible=e[0].isIntersecting;dirty=true;if(visible&&!started){started=true;size();if(cur<0)go(0)}},{threshold:.05}).observe(cv);
  return {go,get cur(){return cur}};
}
/* ---------- results: pixels scatter and re-form into each stat's illustration ---------- */
const MORPH=(function(){
  // 48×34 grid (2× the old 24×17): each square is half the size and there are ~4× as many
  const COLS=48,ROWS=34;
  const line=(out,x0,y0,x1,y1,v,t=1)=>{const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0));for(let i=0;i<=n;i++){const x=Math.round(x0+(x1-x0)*i/n),y=Math.round(y0+(y1-y0)*i/n);for(let a=0;a<t;a++)for(let b=0;b<t;b++)out.set((x+a)+','+(y+b),v)}};
  const shape=fn=>{const m=new Map();fn(m);return [...m].filter(([k,v])=>v).map(([k,v])=>{const [x,y]=k.split(',').map(Number);return [x,y,v]}).filter(([x,y])=>x>=0&&y>=0&&x<COLS&&y<ROWS)};
  const rect=(m,x0,y0,x1,y1,v)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)m.set(x+','+y,v)};
  const bars=(m,list)=>list.forEach(([x,h])=>rect(m,x,33-h,x+7,32,1));
  const S=[
    // 40% more revenue: rising bars with a trend line and arrowhead
    shape(m=>{rect(m,2,33,45,33,2);line(m,2,21,12,16,2,2);line(m,12,16,22,11,2,2);line(m,22,11,32,6,2,2);line(m,32,6,42,1,2,2);
      rect(m,40,0,45,1,2);rect(m,44,0,45,5,2);bars(m,[[4,7],[14,13],[24,19],[34,25]])}),
    // 70% lower costs: falling bars with a down trend and arrowhead
    shape(m=>{rect(m,2,33,45,33,2);line(m,2,1,12,6,2,2);line(m,12,6,22,11,2,2);line(m,22,11,32,16,2,2);line(m,32,16,41,20,2,2);
      rect(m,40,21,45,22,2);rect(m,44,17,45,22,2);bars(m,[[4,25],[14,19],[24,13],[34,7]])}),
    // under 7 weeks: a clock
    shape(m=>{const cx=23.5,cy=16.5;for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){const d=Math.hypot(x-cx,y-cy);if(d<=16.4&&d>13.6)m.set(x+','+y,1);else if(d<=13.6)m.set(x+','+y,2)}
      rect(m,23,6,24,17,1);rect(m,23,16,33,17,1);rect(m,22,15,25,18,1);
      for(let k=0;k<12;k++){const a=k/12*Math.PI*2,x=Math.round(cx+Math.cos(a)*11.2),y=Math.round(cy+Math.sin(a)*11.2);m.set(x+','+y,1);if(k%3===0)m.set((x+Math.round(-Math.cos(a)))+','+(y+Math.round(-Math.sin(a))),1)}}),
    // 90% more productive staff: a big up arrow between two rising columns
    shape(m=>{for(let y=0;y<=14;y++){const w=y+.5;for(let x=0;x<COLS;x++){const d=Math.abs(x-23.5);if(d<=w)m.set(x+','+y,(d>w-1.6||(y>=13&&d>7.5))?1:2)}}
      for(let y=15;y<=33;y++)for(let x=17;x<=30;x++)m.set(x+','+y,(x<=17||x>=30||y>=33)?1:2);
      for(const [x0,x1,top] of [[2,9,22],[38,45,18]])for(let y=top;y<=33;y++)for(let x=x0;x<=x1;x++)m.set(x+','+y,(y===top||y===33||x===x0||x===x1)?1:2)})
  ];
  return pixelMorph($('#rsCanvas'),COLS,ROWS,S,{1:'#0068de',2:'#bcd5f5'},[1,2]);
})();
document.querySelectorAll('.rs__item').forEach(b=>b.addEventListener('click',()=>{const f=$('#features'),i=+b.dataset.i;window.__scrollTo(f.offsetTop+(f.offsetHeight-vh)*((i+.5)/STATS.length))}));
$('#toolGrid').innerHTML=TOOLS.map((s,i)=>`<article class="tcell reveal" style="transition-delay:${(i%3)*.08}s"><div class="ico pxg" style="--gd:${((i%3)*.12).toFixed(2)}s">${pix(s[0],true)}</div><div><h3 class="h3">${s[1]}</h3><p class="desc">${s[2]}</p></div></article>`).join('');
$('#indGrid').innerHTML=IND.map((s,i)=>`<a class="icell" href="${IND_URL[i]}" target="_blank" rel="noopener"><span class="ico">${mono(s[2])}</span><h3 class="h3">${esc(s[0])} <svg class="arr" viewBox="0 0 10 10" aria-hidden="true"><path d="M1.5 8.5 8.5 1.5M3 1.5h5.5V7" fill="none" stroke="currentColor" stroke-width="1.1"/></svg></h3><p class="desc">${s[1]}</p></a>`).join('');
$('#domGrid').innerHTML=DOMAINS.map((d,i)=>`<article class="dcell"><div class="ico pxg" style="--gd:${(i*.08).toFixed(2)}s">${pix(d[0],true)}</div><div><h3 class="h3">${esc(d[1])}</h3><p class="desc">${d[2]}</p></div></article>`).join('');
/* ---------- roles: tabs + white pixel morph ---------- */
(function roles(){
  const tabs=$('#roleTabs');if(!tabs)return;
  const COLS=40,ROWS=28;
  const line=(m,x0,y0,x1,y1,v,t=1)=>{const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0));for(let i=0;i<=n;i++){const x=Math.round(x0+(x1-x0)*i/n),y=Math.round(y0+(y1-y0)*i/n);for(let a=0;a<t;a++)for(let b=0;b<t;b++)m.set((x+a)+','+(y+b),v)}};
  const rect=(m,x0,y0,x1,y1,v)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)m.set(x+','+y,v)};
  const box=(m,x0,y0,x1,y1)=>{rect(m,x0,y0,x1,y1,2);for(let x=x0;x<=x1;x++){m.set(x+','+y0,1);m.set(x+','+y1,1)}for(let y=y0;y<=y1;y++){m.set(x0+','+y,1);m.set(x1+','+y,1)}};
  const del=(m,x0,y0,x1,y1)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)m.delete(x+','+y)};
  // texture: mid-tone squares get a few brighter / fainter neighbours, like printed pixels
  const tex=(x,y,v)=>{if(v!==2)return v;const h=Math.sin(x*12.9898+y*78.233)*43758.5453,r=h-Math.floor(h);return r<.16?1:r>.86?3:2};
  const shape=fn=>{const m=new Map();fn(m);return [...m].map(([k,v])=>{const [x,y]=k.split(',').map(Number);return [x,y,tex(x,y,v)]}).filter(([x,y])=>x>=0&&y>=0&&x<COLS&&y<ROWS)};
  const star=(m,sx,sy,r,v)=>{for(let y=-r;y<=r;y++)for(let x=-r;x<=r;x++){const ax=Math.abs(x),ay=Math.abs(y);if(ax+ay<=r&&(Math.min(ax,ay)<=Math.max(1,r/3)||ax+ay<=r*.55))m.set((sx+x)+','+(sy+y),ax+ay<=r*.3?1:v)}};
  const S=[
    // business leaders: rising bars + trend line
    shape(m=>{line(m,1,17,9,13,3,2);line(m,9,13,17,9,3,2);line(m,17,9,25,5,3,2);line(m,25,5,31,2,3,2);rect(m,29,0,33,1,3);rect(m,32,0,33,4,3);
      [[3,6],[11,10],[19,15],[27,21]].forEach(([x,h])=>rect(m,x,27-h+1,x+5,27,2));rect(m,35,23,38,27,2)}),
    // CTOs & CIOs: one platform, three stacked layers
    shape(m=>{box(m,4,20,35,26);box(m,8,12,31,18);box(m,12,4,27,10);rect(m,15,6,17,8,1);rect(m,22,6,24,8,1);
      for(const x of [10,20,29])rect(m,x,19,x+1,19,3);for(const x of [14,25])rect(m,x,11,x+1,11,3)}),
    // enterprise architects: connected building blocks
    shape(m=>{line(m,12,6,27,8,3,2);line(m,8,12,15,19,3,2);line(m,31,15,24,19,3,2);
      box(m,1,1,11,11);box(m,28,3,38,13);box(m,14,17,24,27);rect(m,4,4,8,8,3);rect(m,31,6,35,10,3);rect(m,17,20,21,24,3)}),
    // IT & automation leads: gear + robot
    shape(m=>{const cx=11.5,cy=14.5;for(let y=0;y<ROWS;y++)for(let x=0;x<24;x++){const dx=x-cx,dy=y-cy,d=Math.hypot(dx,dy),a=Math.atan2(dy,dx);
        const tooth=Math.cos(a*8)>.55;if((d>=3.2&&d<=8.2)||(tooth&&d>8.2&&d<=10.6))m.set(x+','+y,d>7||d<4.2?1:2)}
      rect(m,30,3,31,6,1);rect(m,29,2,32,2,1);box(m,25,7,36,18);del(m,28,10,29,11);del(m,32,10,33,11);rect(m,28,15,33,15,1);
      rect(m,24,11,24,14,1);rect(m,37,11,37,14,1);rect(m,27,19,29,23,2);rect(m,32,19,34,23,2);rect(m,26,24,29,25,1);rect(m,32,24,35,25,1)}),
    // data & AI teams: database + sparkles
    shape(m=>{const cx=11,rx=10,e=x=>Math.sqrt(Math.max(0,1-((x-cx)/rx)**2));
      for(let y=3;y<=26;y++)for(let x=1;x<=21;x++){const top=Math.round(5-2.4*e(x)),bot=Math.round(24+2.4*e(x));
        if(y>=top&&y<=bot){const band=y===Math.round(10+2.2*e(x))||y===Math.round(17+2.2*e(x));m.set(x+','+y,band||y===top||y>=bot-1?1:2)}}
      star(m,31,9,7,2);star(m,34,22,3,2);star(m,26,24,2,3)})
  ];
  const morph=pixelMorph($('#roleCanvas'),COLS,ROWS,S,{1:'#0068de',2:'#bcd5f5',3:'#dde9fa'},[2,3]);
  const ind=$('#roleInd'),tag=$('#roleTag'),txt=$('#roleTxt'),panel=$('#rolePanel');
  tabs.insertAdjacentHTML('afterbegin',ROLES.map((r,i)=>`<button class="roles__tab" role="tab" id="rtab${i}" aria-controls="rolePanel" aria-selected="${!i}" tabindex="${i?-1:0}">${esc(r[0])}</button>`).join(''));
  const btns=[...tabs.querySelectorAll('.roles__tab')];let cur=-1,swapT=0;
  const fill=i=>{const r=ROLES[i];tag.innerHTML=`${esc(r[1])}<br><em>${esc(r[2])}</em>`;txt.innerHTML=r[3].map(p=>`<p>${p}</p>`).join('');panel.setAttribute('aria-labelledby','rtab'+i)};
  const placeInd=()=>{const b=btns[cur<0?0:cur];if(!b)return;ind.style.width=b.offsetWidth+'px';ind.style.transform=`translate3d(${b.offsetLeft}px,0,0)`};
  function show(i,focus){if(i===cur)return;const first=cur<0;cur=i;
    btns.forEach((b,k)=>{b.classList.toggle('on',k===i);b.setAttribute('aria-selected',k===i);b.tabIndex=k===i?0:-1});
    if(focus)btns[i].focus();placeInd();
    if(first||reduce){fill(i)}else{panel.classList.add('sw');clearTimeout(swapT);swapT=setTimeout(()=>{fill(i);panel.classList.remove('sw')},260)}
    morph.go(i);
    const b=btns[i];if(tabs.scrollWidth>tabs.clientWidth)tabs.scrollTo({left:b.offsetLeft-(tabs.clientWidth-b.offsetWidth)/2,behavior:reduce?'auto':'smooth'});}
  btns.forEach((b,i)=>b.addEventListener('click',()=>show(i)));
  tabs.addEventListener('keydown',e=>{const k=e.key;if(!['ArrowRight','ArrowLeft','Home','End'].includes(k))return;e.preventDefault();
    const n=btns.length;show(k==='Home'?0:k==='End'?n-1:(cur+(k==='ArrowRight'?1:-1)+n)%n,true)});
  onResize(placeInd);document.fonts&&document.fonts.ready.then(placeInd);addEventListener('load',placeInd);
  show(0);
})();
$('#faq')&&($('#faq').innerHTML=FAQ.map((f,i)=>`<div class="qa${i?'':' open'}"><button aria-expanded="${!i}" aria-controls="qa${i}"><span class="q">${esc(f[0])}</span><span class="ic"><svg viewBox="0 0 12 12"><path d="M2 4.5 6 8.5 10 4.5" fill="none" stroke="#fcfcfc" stroke-width="1.6"/></svg></span></button><div class="a" id="qa${i}"><div>${f[1].map(p=>`<p>${p}</p>`).join('')}</div></div></div>`).join(''));
const LCLS={kaiser:'wide',et:'wide',unite:'wide',bpcl:'tall',wipro:'tall'};
$('#usedBy').insertAdjacentHTML('beforeend',['bosch','pwc','bpcl','medtronic','wipro','kaiser'].map(n=>`<div><img class="${LCLS[n]||''}" src="${A['lg_'+n]}" alt="${{bosch:'Bosch',pwc:'PwC',bpcl:'Bharat Petroleum',medtronic:'Medtronic',wipro:'Wipro',kaiser:'Kaiser Permanente'}[n]}" loading="lazy" decoding="async"></div>`).join(''));
$('#seenIn').insertAdjacentHTML('beforeend',['forbes','et','dig','unite'].map(n=>`<div><img class="${LCLS[n]||''}" src="${A['lg_'+n]}" alt="${{forbes:'Forbes',et:'The Economic Times',dig:'diginomica',unite:'Unite.AI'}[n]}" loading="lazy" decoding="async"></div>`).join(''));
$('#analysts').innerHTML=ANALYSTS.map((a,i)=>`<div class="reveal" style="transition-delay:${i*.06}s"><img src="${A['lg_'+a[0]]}" alt="${{everest:'Everest Group',gartner:'Gartner',forrester:'Forrester',idc:'IDC'}[a[0]]}" loading="lazy" decoding="async"><p>${a[1]}</p></div>`).join('');
const card=(n,i)=>`<article class="ncard reveal" style="transition-delay:${i*.08}s"><div class="ncard__img"><img src="${A[n[0]]}" alt="" loading="lazy" decoding="async"></div><p class="ncard__tag">${n[1]}</p><h3 class="h3">${n[2]}</h3><p class="desc">${n[3]}</p><div class="ncard__meta"><span>${n[4]}</span><a class="link" href="#news">Read more ${ext}</a></div></article>`;
$('#newsGrid').innerHTML=NEWS.map(card).join('');
$('#blogGrid').innerHTML=BLOGS.map(card).join('');
$('#planGrid').innerHTML=PLANS.map((p,i)=>`<article class="plan reveal${i==1?' pro':''}" style="transition-delay:${i*.08}s">${i==1?'<span class="plan__badge">Most flexible</span>':''}<h3 class="h3" style="font-size:clamp(28px,2.4vw,40px);text-align:center">EIQ <em>${p[1]}</em></h3><div class="plan__art"><img src="${A[p[0]]}" alt="" loading="lazy" decoding="async"></div><p class="desc">${p[2]}</p><ul>${p[3].map(l=>`<li>${esc(l)}</li>`).join('')}</ul><a class="pill ${i==1?'solid':'ghost'}" href="#demo"><span data-t="Explore EIQ ${p[1]}">Explore EIQ ${p[1]}</span></a></article>`).join('');
const arr='<svg viewBox="0 0 23 32"><path d="M0 0h9l14 16L9 32H0l14-16z" fill="currentColor"/></svg>';
$('#fnav').innerHTML=[['Platform','#platform'],['Solutions','#industries'],['Get a demo','#demo']].map(n=>`<a href="${n[1]}"><span>${n[0]}</span><span class="arr">${arr}${arr}</span></a>`).join('');
$('#wm').innerHTML='evolute'.split('').map((c,i)=>`<span style="transition-delay:${i*.04}s">${c}</span>`).join('')+'<span class="b" style="transition-delay:.28s">i</span><span class="b" style="transition-delay:.32s">q</span>';

/* ---------- product visual: one process, shaped per industry ---------- */
const PV=[
  ['Insurance','Claims intake',['New claim received','Reads claim documents','Checks policy rules','Updates claims system','Reviews exceptions'],'Claims handled'],
  ['Banking','Loan applications',['Application submitted','Verifies ID & income','Scores lending risk','Books the loan','Approves edge cases'],'Loans processed'],
  ['Healthcare','Patient intake',['Referral arrives','Reads patient forms','Checks coverage','Schedules the visit','Nurse reviews flags'],'Patients onboarded'],
  ['Energy','Change management',['Change requested','Assesses site impact','Applies safety rules','Updates work orders','Engineer signs off'],'Changes completed'],
  ['Telecom','Service requests',['Request logged','Diagnoses the issue','Routes by rules','Fixes the account','Handles escalations'],'Requests resolved'],
  ['Retail','Order exceptions',['Order flagged','Checks stock levels','Applies pricing rules','Reroutes the shipment','Team approves refunds'],'Orders recovered']
];
(function productVisual(){
  const wrap=$('#pvWrap');if(!wrap)return;
  const node=(x,y,w,k,i,ic)=>`<g class="node" transform="translate(${x} ${y})"><rect class="card" width="${w}" height="66" rx="2"/><rect x="12" y="13" width="22" height="22" rx="6" fill="${ic}"/><text class="k" x="42" y="28">${k}</text><text class="v sw" x="12" y="54" data-n="${i}"></text></g>`;
  const sys=['CRM','ERP','Email','Docs'];
  const chips=PV.map((p,i)=>`<g class="chip" data-i="${i}" transform="translate(${206+i*71} 344)" role="button" tabindex="0" aria-label="Show ${p[0]}"><rect width="66" height="30" rx="15"/><text x="33" y="19.5" text-anchor="middle">${p[0]}</text></g>`).join('');
  wrap.innerHTML=`<svg class="pv" viewBox="0 0 656 400" role="img" aria-label="EvoluteIQ process builder: one automated process, shaped for each industry">
  <defs><pattern id="pvDots" width="16" height="16" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.1" fill="#c3d4ea"/></pattern>
  <filter id="pvSh" x="-10%" y="-10%" width="120%" height="140%"><feDropShadow dx="0" dy="6" stdDeviation="7" flood-color="#46708f" flood-opacity=".16"/></filter></defs>
  <rect width="656" height="400" fill="#e6eef9"/><rect width="656" height="400" fill="url(#pvDots)"/>
  <g transform="translate(24 24)"><rect width="250" height="32" rx="0" fill="#fcfcfc"/><rect x="6" y="6" width="20" height="20" rx="6" fill="#0068de"/><text x="16" y="20.5" text-anchor="middle" font-size="10" font-weight="500" fill="#fcfcfc">IQ</text><text x="36" y="21" font-size="13" fill="#0068de"><tspan font-weight="500">eiq360</tspan><tspan fill="#8c8c95"> · </tspan><tspan class="sw" id="pvName"></tspan></text></g>
  <g transform="translate(562 24)"><rect width="70" height="32" rx="0" fill="#0068de"/><circle cx="18" cy="16" r="4" fill="#7fb2ff"><animate attributeName="opacity" values="1;.25;1" dur="1.4s" repeatCount="indefinite"/></circle><text x="28" y="20.5" font-size="12" fill="#fcfcfc" letter-spacing=".06em">LIVE</text></g>
  <path class="flow" d="M174 129 H206"/><path class="flow" d="M356 129 H388"/><path class="flow" d="M463 162 V214"/><path class="flow" d="M420 162 C420 196 281 182 281 214"/><path class="flow" d="M206 247 H174"/>
  ${sys.map((s,i)=>`<path class="flow" d="M538 247 C552 247 548 ${112+i*50} 562 ${112+i*50}"/>`).join('')}
  <g filter="url(#pvSh)">
   ${node(24,96,150,'Trigger',0,'#050419')}${node(206,96,150,'AI agent',1,'#0068de')}${node(388,96,150,'Decision',2,'#8fb0ff')}
   ${node(388,214,150,'Bot',3,'#0068de')}${node(206,214,150,'Person',4,'#e6e6e8')}
   ${sys.map((s,i)=>`<g transform="translate(562 ${96+i*50})"><rect width="70" height="32" rx="2" fill="#fcfcfc"/><text x="35" y="20.5" text-anchor="middle" font-size="12" fill="#585765">${s}</text></g>`).join('')}
   <g transform="translate(24 214)"><rect width="150" height="160" rx="2" fill="#fcfcfc"/><text class="k" x="14" y="26">Live screen</text><text class="v sw" x="14" y="46" id="pvRep" font-size="13"></text>
    <text x="14" y="78" font-size="26" font-weight="300" fill="#17181d" letter-spacing="-.03em" id="pvCount">0</text><text x="14" y="94" font-size="10.5" fill="#8c8c95">today</text>
    ${[0,1,2,3,4,5,6].map(i=>`<rect class="bar" data-b="${i}" x="${14+i*18}" y="148" width="12" height="0" rx="3"/>`).join('')}</g>
  </g>
  <circle r="4.5" fill="#0068de"><animateMotion dur="3.2s" repeatCount="indefinite" path="M174 129 H206 M356 129 H388 L463 129 V214"/></circle>
  <circle r="4" fill="#7fb2ff"><animateMotion dur="2.6s" begin=".8s" repeatCount="indefinite" path="M538 247 C552 247 548 162 562 162"/></circle>
  ${chips}</svg>`;
  const svg=wrap.querySelector('svg');let cur=0,count=0,timer=null,pvOn=true;
  function show(i){cur=i;const p=PV[i];
    svg.querySelectorAll('.sw').forEach(e=>e.classList.add('fade'));
    setTimeout(()=>{svg.querySelector('#pvName').textContent=p[1];svg.querySelector('#pvRep').textContent=p[3];
      svg.querySelectorAll('[data-n]').forEach(e=>e.textContent=p[2][+e.dataset.n]);
      svg.querySelectorAll('.sw').forEach(e=>e.classList.remove('fade'));},reduce?0:280);
    svg.querySelectorAll('.chip').forEach(c=>c.classList.toggle('on',+c.dataset.i===i));
    svg.querySelectorAll('.bar').forEach((b,k)=>{const h=18+((i*37+k*53)%46);b.setAttribute('height',h);b.setAttribute('y',148-h+8)});
    count=200+i*137;}
  function auto(){clearInterval(timer);if(!reduce)timer=setInterval(()=>show((cur+1)%PV.length),3600)}
  svg.querySelectorAll('.chip').forEach(c=>{const go=()=>{show(+c.dataset.i);auto()};c.addEventListener('click',go);c.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go()}})});
  setInterval(()=>{if(!pvOn)return;count+=1+Math.floor(Math.random()*3);const el=svg.querySelector('#pvCount');if(el)el.textContent=count.toLocaleString('en-US')},900);
  new IntersectionObserver(e=>{const on=e[0].isIntersecting;if(on===pvOn)return;pvOn=on;svg.classList.toggle('off',!on);
    try{on?svg.unpauseAnimations():svg.pauseAnimations()}catch(_){}
    if(on)auto();else clearInterval(timer);}).observe(wrap);
  show(0);auto();
})();
/* ---------- testimonial marquee: drifts left→right, pauses + plays on hover ---------- */
const VIDEOS=["assets/videos/testimonial-1.mp4","assets/videos/testimonial-2.mp4"];
const VOICES=[
  {img:'t1',v:0,q:'Building on EvoluteIQ gave us a genuinely domain-led automation suite — timely for enterprises reinventing themselves for a digital-only world.',n:'R. Murugesh',r:'CEO, WNS'},
  {img:'t2',v:1,q:'EvoluteIQ is our key technology partner and sits at the center of our hyper-automation strategy across financial services.',n:'Paul Nagai',r:'Managing Director, Antares'}
];
(function marquee(){
  const wrap=$('#vq'),track=$('#vqTrack');if(!wrap)return;
  const play='<svg viewBox="0 0 14 14"><path d="M3 1.5v11l9-5.5z" fill="#fff"/></svg>',pause='<svg viewBox="0 0 14 14"><path d="M3 2h3v10H3zM8 2h3v10H8z" fill="#fff"/></svg>';
  const cardHTML=v=>`<figure class="vcard"><div class="voice__img"><img src="${A[v.img]}" alt="${v.n} speaking on camera" loading="lazy" decoding="async">${VIDEOS[v.v]?`<video muted loop playsinline preload="none" poster="${A[v.img]}" data-src="${VIDEOS[v.v]}"></video>`:''}<div class="vplay"><i>${play}</i><span>Watch ${v.n.split(' ').pop()}</span></div><div class="vbar"><b></b></div></div><div class="vq">“</div><blockquote>${v.q}</blockquote><cite><b>${v.n}</b><span>${v.r}</span></cite></figure>`;
  const set=[...VOICES,...VOICES,...VOICES];
  track.innerHTML=set.map(cardHTML).join('')+set.map(cardHTML).join('');
  const cards=[...track.children];
  let setW=0,pos=0,speed=0,hovering=0,inView=false,last=performance.now();
  const measure=()=>{const c=cards[set.length];setW=c.offsetLeft-cards[0].offsetLeft;};
  measure();onResize(measure);
  new IntersectionObserver(e=>{inView=e[0].isIntersecting}).observe(wrap);
  cards.forEach(c=>{
    const vid=c.querySelector('video'),bar=c.querySelector('.vbar b'),ic=c.querySelector('.vplay i');let raf=0,start=0;
    if(vid)vid.addEventListener('error',()=>{vid.remove()},{once:true});
    const tick=()=>{const v=c.querySelector('video');const p=v&&v.classList.contains('ok')&&v.duration?(v.currentTime/v.duration):((performance.now()-start)/9000)%1;bar.style.width=(p*100).toFixed(2)+'%';raf=requestAnimationFrame(tick)};
    const on=()=>{hovering++;c.classList.add('playing');ic.innerHTML=pause;start=performance.now();const v=c.querySelector('video');
      if(v){if(!v.src){v.src=v.dataset.src;v.addEventListener('loadeddata',()=>v.classList.add('ok'),{once:true})}v.play().catch(()=>{})}
      cancelAnimationFrame(raf);tick()};
    const off=()=>{hovering=Math.max(0,hovering-1);c.classList.remove('playing');ic.innerHTML=play;const v=c.querySelector('video');if(v)v.pause();cancelAnimationFrame(raf);bar.style.width='0%'};
    c.addEventListener('pointerenter',e=>{if(e.pointerType!=='touch')on()});c.addEventListener('pointerleave',e=>{if(e.pointerType!=='touch')off()});
    c.addEventListener('focusin',on);c.addEventListener('focusout',off);c.tabIndex=0;
    c.addEventListener('touchstart',()=>{c.classList.contains('playing')?off():on()},{passive:true});
  });
  const BASE=reduce?0:42;
  TICKERS.push(now=>{const dt=Math.min(.05,(now-last)/1000);last=now;
    if(inView&&setW){const target=hovering?0:BASE;speed+=(target-speed)*Math.min(1,dt*(hovering?9:2.5));
      if(Math.abs(speed)>.01){pos=(pos+speed*dt)%setW;track.style.transform=`translate3d(${(pos-setW).toFixed(1)}px,0,0)`;}}});
  if(reduce){wrap.style.overflowX='auto';}
})();
/* faq */
document.querySelectorAll('.qa button').forEach(b=>b.addEventListener('click',()=>{
  const q=b.parentElement,open=!q.classList.contains('open');
  document.querySelectorAll('.qa').forEach(x=>{x.classList.remove('open');x.querySelector('button').setAttribute('aria-expanded','false')});
  if(open){q.classList.add('open');b.setAttribute('aria-expanded','true')}
}));
/* newsletter */
$('#nl').addEventListener('submit',e=>{e.preventDefault();const v=$('#em').value.trim();$('#nlMsg').textContent=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)?'You\u2019re on the list. Look out for the next update.':'Enter a work email like name@company.com.';});

/* pixel gather: replays every time an icon scrolls into view */
const gatherIO=new IntersectionObserver(es=>es.forEach(e=>{
  if(e.isIntersecting&&e.intersectionRatio>=.55)e.target.classList.add('in');
  else if(!e.isIntersecting)e.target.classList.remove('in');
}),{threshold:[0,.55]});
document.querySelectorAll('.pxg').forEach(el=>gatherIO.observe(el));

/* reveals */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.15,rootMargin:'0px 0px -8% 0px'});
document.querySelectorAll('.reveal,.cta,.wordmark').forEach(el=>io.observe(el));

/* ---------- scroll-linked DOM ---------- */
const hdr=$('#hdr'),heroC=$('#heroC'),flow=$('#steps'),stage=$('#stage'),steps=[...document.querySelectorAll('.step')],rsItems=[...document.querySelectorAll('.rs__item')],rsFill=$('#rsFill'),feat=$('#features'),darks=[...document.querySelectorAll('.dark,.blue')],scrollBtn=$('#scrollBtn');
const stepBars=steps.map(el=>el.querySelector('.step__bar i'));
const cl=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
const ss=(a,b,v)=>{const t=cl((v-a)/(b-a));return t*t*(3-2*t)};
const BOUNDS=[.55,1.55,2.5,3.5,4.75,6.8];
// layout cache: measured on resize / content change, never inside the frame loop
const L={stage:0,featTop:0,featH:1,darks:[]};
function measureLayout(){const y=window.scrollY;if(window.__sbm)window.__sbm();
  L.stage=stage.getBoundingClientRect().top+y;
  const fr=feat.getBoundingClientRect();L.featTop=fr.top+y;L.featH=fr.height;
  L.darks=darks.map(d=>{const r=d.getBoundingClientRect();return [r.top+y,r.bottom+y]});}
measureLayout();onResize(measureLayout);
if('ResizeObserver' in window){let mT=0;new ResizeObserver(()=>{clearTimeout(mT);mT=setTimeout(measureLayout,60)}).observe(document.body)}
addEventListener('load',measureLayout);
const W$=new Map();function setS(el,prop,val){const k=el;let m=W$.get(k);if(!m){m={};W$.set(k,m)}if(m[prop]!==val){m[prop]=val;el.style[prop]=val}}
let lastStep=-1,lastRs=-1,flowOn=null,hdrDark=null;
function domTick(y){
  const s=cl((y-L.stage)/vh,0,6.8);
  {const h=cl(s/0.9);
    setS(heroC,'transform',`translate3d(0,${(-h*18).toFixed(2)}vh,0) rotateX(${(h*62).toFixed(1)}deg) scale(${(1-h*.25).toFixed(3)})`);
    setS(heroC,'opacity',(1-ss(.35,.85,s)).toFixed(3));
    if(READY)setS(scrollBtn,'opacity',(1-ss(0,.2,s)).toFixed(2));}
  const fo=s>.45&&s<6.75;if(fo!==flowOn){flow.classList.toggle('on',fo);flowOn=fo}
  if(y<L.stage+vh*7.9){
    let a=0;for(let i=0;i<5;i++)if(s>=BOUNDS[i])a=i;
    if(a!==lastStep){steps.forEach((el,i)=>el.classList.toggle('on',i===a));lastStep=a}
    stepBars.forEach((b,i)=>setS(b,'transform',`scaleY(${cl((s-BOUNDS[i])/(BOUNDS[i+1]-BOUNDS[i])).toFixed(3)})`));
  }
  // results: list progress + pixel morph
  const rt=L.featTop-y;
  if(rt<vh&&rt+L.featH>0){const fp=cl(-rt/(L.featH-vh));const n=rsItems.length,c=fp*n;const a=Math.min(n-1,Math.floor(c));
    if(a!==lastRs){rsItems.forEach((el,i)=>{el.classList.toggle('on',i===a);el.classList.toggle('done',i<a)});lastRs=a}
    setS(rsFill,'transform',`scaleY(${cl((c-.5)/(n-1)).toFixed(3)})`);
    if(rt<vh*.6)MORPH.go(a);}
  // header inversion over dark sections
  let dk=false;const hy=y+40;for(const d of L.darks){if(d[0]<=hy&&d[1]>=hy){dk=true;break}}
  if(dk!==hdrDark){hdr.classList.toggle('dark',dk);hdrDark=dk}
  return s;
}

/* ---------- 3D world ---------- */
const T=window.THREE, cv=$('#gl');
let gl3=null;
try{ if(T){ gl3=build3D(); } }catch(err){ console.warn('3D disabled',err); }

function build3D(){
  const devDPR=devicePixelRatio||1;
  const LOW=isTouch||innerWidth<900||(navigator.hardwareConcurrency||8)<=4||(navigator.deviceMemory||8)<=4;
  const renderer=new T.WebGLRenderer({canvas:cv,antialias:devDPR<2,powerPreference:'high-performance',stencil:false,alpha:false});
  const MAXDPR=Math.min(devDPR,LOW?1.5:2);let DPR=MAXDPR;
  renderer.setPixelRatio(DPR);
  renderer.shadowMap.enabled=true; renderer.shadowMap.type=LOW?T.PCFShadowMap:T.PCFSoftShadowMap;
  let ctxLost=false;
  cv.addEventListener('webglcontextlost',e=>{e.preventDefault();ctxLost=true},false);
  cv.addEventListener('webglcontextrestored',()=>{ctxLost=false},false);
  const SKY=0xe2ecf8;
  renderer.setClearColor(SKY,1);
  const scene=new T.Scene(); scene.fog=new T.Fog(SKY,70,170);
  const camera=new T.PerspectiveCamera(28,1,1,600);
  scene.add(new T.HemisphereLight(0xf6faff,0xa4bedc,.9));
  const sun=new T.DirectionalLight(0xffffff,.42); sun.castShadow=true;
  sun.shadow.mapSize.set(LOW?1536:2048,LOW?1536:2048); const sc=sun.shadow.camera; sc.left=-95;sc.right=95;sc.top=95;sc.bottom=-95;sc.near=1;sc.far=320; sun.shadow.bias=-.0006; sun.shadow.radius=6;
  scene.add(sun); scene.add(sun.target);
  const fill=new T.DirectionalLight(0xdfeaf3,.22); fill.position.set(40,30,-30); scene.add(fill);

  const W=new T.Group(); W.rotation.y=.62; scene.add(W);

  // ground: shadow-only so the sky colour stays exact
  const ground=new T.Mesh(new T.PlaneGeometry(900,900),new T.ShadowMaterial({opacity:.2,color:new T.Color(0x2c5a8e)}));
  ground.rotation.x=-Math.PI/2; ground.receiveShadow=true; W.add(ground);

  // textures
  function cvTex(w,h,draw){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);const t=new T.CanvasTexture(c);t.anisotropy=4;return t}
  const blobTex=cvTex(128,128,(g,w,h)=>{const r=g.createRadialGradient(64,64,4,64,64,64);r.addColorStop(0,'rgba(30,70,130,.42)');r.addColorStop(.55,'rgba(30,70,130,.16)');r.addColorStop(1,'rgba(30,70,130,0)');g.fillStyle=r;g.fillRect(0,0,w,h)});
  const glowTex=cvTex(128,128,(g)=>{const r=g.createRadialGradient(64,64,0,64,64,64);r.addColorStop(0,'rgba(255,255,255,1)');r.addColorStop(.2,'rgba(170,225,255,.8)');r.addColorStop(.5,'rgba(80,170,255,.25)');r.addColorStop(1,'rgba(60,140,255,0)');g.fillStyle=r;g.fillRect(0,0,128,128)});
  const smokeTex=cvTex(64,64,(g)=>{const r=g.createRadialGradient(32,32,0,32,32,32);r.addColorStop(0,'rgba(255,255,255,.95)');r.addColorStop(.6,'rgba(255,255,255,.35)');r.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=r;g.fillRect(0,0,64,64)});
  const winTex=cvTex(128,128,(g)=>{g.fillStyle='#f3f7fa';g.fillRect(0,0,128,128);g.fillStyle='#cfdde8';for(let y=10;y<128;y+=32)for(let x=8;x<128;x+=32)g.fillRect(x,y,18,16);});
  winTex.wrapS=winTex.wrapT=T.RepeatWrapping;
  const ribTex=cvTex(64,64,(g)=>{g.fillStyle='#f3f7fa';g.fillRect(0,0,64,64);g.fillStyle='#d5e2eb';g.fillRect(24,0,10,64);});
  ribTex.wrapS=ribTex.wrapT=T.RepeatWrapping;
  const EIQ=['#####.###..###.','#......#..#...#','#......#..#...#','####...#..#...#','#......#..#.#.#','#......#..#..#.','#####.###..##.#'];
  const logoTex=cvTex(512,456,(g,w,h)=>{g.fillStyle='#f6f9fb';g.fillRect(0,0,w,h);const c=26,gap=4,cols=15,rows=7,ox=(w-cols*(c+gap))/2,oy=(h-rows*(c+gap))/2;
    EIQ.forEach((row,y)=>[...row].forEach((ch,x)=>{if(ch!=='#')return;const px=ox+x*(c+gap),py=oy+y*(c+gap);const gr=g.createLinearGradient(px,py,px,py+c);gr.addColorStop(0,'#3c74ff');gr.addColorStop(1,'#1c44d8');g.fillStyle=gr;g.beginPath();g.rect(px,py,c,c);g.fill();}));
    g.font='500 30px Roboto, Arial, sans-serif';g.fillStyle='#8aa0b4';g.textAlign='center';g.fillText('Absolute . Automation',w/2,oy+rows*(c+gap)+48);});

  const M=(c=0xe2ecf4,o={})=>new T.MeshStandardMaterial(Object.assign({color:c,roughness:.92,metalness:0},o));
  const mW=M(), mW2=M(0xe4edf3), mDark=M(0xcbdae5);
  const mWin=(w,h)=>{const t=winTex.clone();t.needsUpdate=true;t.repeat.set(Math.max(1,Math.round(w/1.4)),Math.max(1,Math.round(h/1.5)));return M(0xffffff,{map:t})};
  const mRib=(w,h)=>{const t=ribTex.clone();t.needsUpdate=true;t.repeat.set(Math.max(1,Math.round(w/.9)),1);return M(0xffffff,{map:t})};

  const all=[];
  function mesh(geo,mat,x,y,z,parent=W){const m=new T.Mesh(geo,mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m}
  function box(w,h,d,x,y,z,mat=mW,parent=W){return mesh(new T.BoxGeometry(w,h,d),mat,x,y+h/2,z,parent)}
  const blobGeo=new T.PlaneGeometry(1,1),blobMat=new T.MeshBasicMaterial({map:blobTex,transparent:true,depthWrite:false});
  function blob(x,z,w,d,parent=W){const m=new T.Mesh(blobGeo,blobMat);m.rotation.x=-Math.PI/2;m.scale.set(w,d,1);m.position.set(x,.03,z);m.renderOrder=-1;parent.add(m);return m}

  // ---- building kit ----
  function banded(x,z,w,d,floors){
    for(let i=0;i<floors;i++){box(w-.5,1.25,d-.5,x,i*1.5,z,mRib(w,1));box(w,.25,d,x,i*1.5+1.25,z)}
    const top=floors*1.5; box(w,.35,d,x,top-.1,z); box(w*.5,.5,d*.5,x-w*.12,top+.2,z-d*.12,mW2);
    blob(x+1,z+1,w*2.1,d*2.1);
  }
  function block(x,z,w,d,h){
    const mw=mWin(w,h); box(w,h,d,x,0,z,[mw,mw,mW,mW,mw,mw]);
    box(w,.35,d,x,h,z); box(w*.62,.45,d*.62,x,h+.3,z,mW2); box(w-.5,.1,d-.5,x,h+.35,z,mDark);
    blob(x+1,z+1,w*2,d*2);
  }
  function stepped(x,z){
    const hs=[6.5,8.5,10.5];hs.forEach((h,i)=>{const mr=mRib(2.8,h);box(2.8,h,3,x+i*2.6,0,z-i*.7,[mr,mr,mW,mW,mr,mr]);box(1,.35,1,x+i*2.6-.5,h,z-i*.7-.4,mW2);box(1,.35,1,x+i*2.6+.6,h,z-i*.7+.6,mW2)});
    blob(x+3,z,11,7);
  }
  function warehouse(x,z,w,d){
    box(w,3,d,x,0,z); box(w*.35,1,d*.3,x-w*.2,3,z-d*.15,mW2); box(w*.2,.7,d*.2,x-w*.2,3,z+d*.2,mW2);
    const roof=new T.Mesh(new T.CylinderGeometry(1.4,1.4,w*.35,3,1),mW); roof.rotation.z=Math.PI/2; roof.position.set(x+w*.22,3.2,z);roof.castShadow=true;W.add(roof);
    for(let i=0;i<3;i++)box(1.2,2.2,.8,x-w/2+1+i*1.6,0,z+d/2+.4,mW2);
    blob(x+1,z+1,w*1.7,d*2);
  }
  function house(x,z){box(2.2,1.8,2.2,x,0,z);box(1.6,1,1.6,x+.2,1.8,z-.2,mW2);box(1,.6,1,x-.7,0,z+1.4);blob(x,z,5,5)}
  const turbines=[];
  function turbine(x,z,s=1){
    const g=new T.Group();g.position.set(x,0,z);W.add(g);
    mesh(new T.CylinderGeometry(.08*s,.26*s,7*s,10),mW,0,3.5*s,0,g);
    const hub=new T.Group();hub.position.set(0,7*s,.2);g.add(hub);
    mesh(new T.BoxGeometry(.35*s,.35*s,.8*s),mW,0,0,-.2,g).position.set(0,7*s,-.1);
    for(let i=0;i<3;i++){const b=mesh(new T.BoxGeometry(.12*s,2.6*s,.04),mW,0,1.6*s,0,new T.Group());const p=b.parent;p.rotation.z=i*Math.PI*2/3;hub.add(p);}
    g.rotation.y=-.9+Math.random()*.2; hub.rotation.z=Math.random()*6; turbines.push(hub); blob(x,z,2.4,2.4);
  }
  const people=[];
  function person(x,z,range=3,hat=true){
    const g=new T.Group();g.position.set(x,0,z);W.add(g);
    mesh(new T.CylinderGeometry(.18,.22,.75,8),mW,0,.38,0,g);
    mesh(new T.SphereGeometry(.17,10,8),mW2,0,.93,0,g);
    if(hat)mesh(new T.CylinderGeometry(.2,.2,.08,10),mW,0,1.07,0,g);
    people.push({g,x,z,range,ph:Math.random()*6,sp:.25+Math.random()*.25,ax:Math.random()<.5}); blob(x,z,1.2,1.2,g).position.set(0,.03,0);
  }
  const smokes=[];
  function smoke(x,y,z,n=6,scale=1){
    const mat=new T.SpriteMaterial({map:smokeTex,transparent:true,depthWrite:false,opacity:.9,fog:true});
    for(let i=0;i<n;i++){const s=new T.Sprite(mat.clone());W.add(s);smokes.push({s,x,y,z,t:i/n,scale});}
  }
  function cooling(x,z){
    const pts=[];for(let i=0;i<=12;i++){const t=i/12;const r=2.2+1.3*Math.pow(Math.abs(t-.72)/.72,2);pts.push(new T.Vector2(r,t*8));}
    const m=mesh(new T.LatheGeometry(pts,28),M(0xeef4f8,{side:T.DoubleSide}),x,0,z);
    const rim=mesh(new T.CylinderGeometry(2.25,2.25,.05,24),mDark,x,7.6,z);
    smoke(x,8.5,z,7,2.4); blob(x,z,9,9);
  }
  function factory(x,z){
    box(4,3.5,5,x,0,z); const roof=new T.Mesh(new T.CylinderGeometry(1.6,1.6,5,3,1),mW);roof.rotation.x=Math.PI/2;roof.rotation.y=0;roof.rotation.z=Math.PI/2;roof.position.set(x,3.5,z);roof.castShadow=true;roof.scale.set(.8,1,1.25);W.add(roof);
    mesh(new T.CylinderGeometry(.4,.6,3.5,12),mW,x+1,5,z-1.4); smoke(x+1,7,z-1.4,5,1.5);
    box(1.4,2,1,x-1,0,z+2.9,mW2); blob(x+1,z+1,8,9);
  }
  function shed(x,z,w=3,l=5,rot=0){
    const g=new T.Group();g.position.set(x,0,z);g.rotation.y=rot;W.add(g);
    box(w,1.6,l,0,0,0,mW,g); const r=mesh(new T.CylinderGeometry(w/2,w/2,l,16,1,false,0,Math.PI),mW,0,1.6,0,g); r.rotation.x=Math.PI/2;r.rotation.y=Math.PI/2;
    blob(x+.5,z+.5,w*2,l*1.6);
  }
  function hangar(x,z){for(let i=0;i<3;i++)shed(x+i*3.4,z,3.4,10);box(10.4,.5,10.2,x+3.4,0,z,mW2)}
  function containers(x,z,cols=3,rows=4,lv=2){
    const geo=new T.BoxGeometry(1.1,1,2.4);const im=new T.InstancedMesh(geo,M(0xe8f0f6,{map:ribTex}),cols*rows*lv);im.castShadow=im.receiveShadow=true;let k=0;const d=new T.Object3D();
    for(let l=0;l<lv;l++)for(let c=0;c<cols;c++)for(let r=0;r<rows;r++){d.position.set(x+c*1.25,.5+l*1.02,z+r*2.55);d.updateMatrix();im.setMatrixAt(k++,d.matrix)}
    W.add(im);blob(x+cols*.6,z+rows*1.2,cols*2.4,rows*4);
  }
  function waterTower(x,z){
    for(const [a,b] of [[-1,-1],[1,-1],[-1,1],[1,1]])mesh(new T.CylinderGeometry(.08,.12,6,6),mW,x+a*1.2,3,z+b*1.2);
    mesh(new T.CylinderGeometry(2,2,2.4,24),mW,x,7.2,z);mesh(new T.CylinderGeometry(1.1,1.1,.2,24),mDark,x,8.45,z);blob(x,z,6,6);
  }
  function tree(x,z,s=1){mesh(new T.CylinderGeometry(.06,.08,1*s,5),mW,x,.5*s,z);mesh(new T.SphereGeometry(.5*s,10,8),mW,x,1.25*s,z);blob(x,z,1.6*s,1.6*s)}

  // ---- city (step 1) ----
  banded(-7,2,5,5,6);
  stepped(-6,-9);
  block(6,3,7,7,7);
  block(-5,11,4.5,4.5,4);
  house(-17,4);house(-19,7.5);
  warehouse(11,-13,10,6);
  [[15,-2],[19,-4],[23,-6],[17,3],[21,1],[25,-1],[19,8],[23,6],[27,4],[29,-3]].forEach(p=>turbine(p[0],p[1],1));
  person(-2,-1);person(3,10);person(10,-4);person(-10,7);person(14,5);

  // ---- HQ (step 2) ----
  const HQ=new T.Vector3(34,0,30);
  box(9,8,8,HQ.x,0,HQ.z,[mWin(9,8),mWin(9,8),mW,mW,M(0xffffff,{map:logoTex}),mWin(9,8)]);
  box(9.4,.4,8.4,HQ.x,8,HQ.z);box(5,1.4,4,HQ.x,8.3,HQ.z,mW2);box(3.4,.3,2.6,HQ.x,9.7,HQ.z,mDark);
  block(HQ.x-7.5,HQ.z+1,6,7,5); block(HQ.x+7.5,HQ.z+1,6,7,5);
  const logoMat=new T.MeshBasicMaterial({color:0x2a5cff,transparent:true,opacity:0});
  const logoGlow=new T.Mesh(new T.PlaneGeometry(9,8),new T.MeshBasicMaterial({map:glowTex,transparent:true,opacity:0,blending:T.AdditiveBlending,depthWrite:false}));logoGlow.position.set(HQ.x,4.5,HQ.z+4.2);W.add(logoGlow);
  for(let i=0;i<6;i++)tree(HQ.x-8+i*3.2,HQ.z+7.5,1.1);
  person(HQ.x-3,HQ.z+6);person(HQ.x+4,HQ.z+6.5);person(HQ.x+10,HQ.z+8);
  blob(HQ.x,HQ.z,24,18);

  // ---- industry (step 3) ----
  cooling(47,24);cooling(54,31);
  containers(24,40,3,3,2);containers(62,26,3,4,1);
  waterTower(40,52);
  hangar(54,57);
  shed(46,63,3,5,0);shed(50,68,3,5,0);shed(42,68,3,5,.2);shed(66,66,3,5,0);shed(70,70,3,5,0);
  factory(70,40);factory(76,38);factory(82,36);
  containers(90,48,3,2,2);
  [[30,50],[34,60],[28,58],[36,68]].forEach(p=>turbine(p[0],p[1],.9));
  person(60,46);person(74,46);person(44,46);person(86,56);person(64,60);

  // ---- tiles (step 4) ----
  const G=new T.Vector3(100,0,70);
  const rs=new T.Shape();{const s=3.1,r=.5,h=s/2;rs.moveTo(-h+r,-h);rs.lineTo(h-r,-h);rs.quadraticCurveTo(h,-h,h,-h+r);rs.lineTo(h,h-r);rs.quadraticCurveTo(h,h,h-r,h);rs.lineTo(-h+r,h);rs.quadraticCurveTo(-h,h,-h,h-r);rs.lineTo(-h,-h+r);rs.quadraticCurveTo(-h,-h,-h+r,-h);}
  const tileGeo=new T.ExtrudeGeometry(rs,{depth:.25,bevelEnabled:true,bevelThickness:.12,bevelSize:.12,bevelSegments:3,curveSegments:6});tileGeo.rotateX(-Math.PI/2);
  const tiles=[];
  for(let i=-5;i<=5;i++)for(let j=-5;j<=5;j++){if(Math.abs(i)+Math.abs(j)>7||Math.hypot(i,j)>5.6)continue;const m=new T.Mesh(tileGeo,M(0xf1f6fa,{emissive:new T.Color(0x7fd3ff),emissiveIntensity:0}));m.position.set(G.x+i*3.7,.12,G.z+j*3.7);m.castShadow=m.receiveShadow=true;W.add(m);tiles.push({m,i,j,d:Math.hypot(i,j)});}
  const centerTile=tiles.find(t=>t.i===0&&t.j===0);
  // control tower: orchestrates every agent on the grid
  const tower=new T.Group();tower.position.set(G.x,0,G.z);W.add(tower);
  const beamMat=M(0xeaf1f7,{emissive:new T.Color(0x3a6bff),emissiveIntensity:0});
  mesh(new T.CylinderGeometry(1.45,1.6,.8,24),mW,0,.4,0,tower);
  mesh(new T.CylinderGeometry(.62,.95,9,20),mW,0,5.2,0,tower);
  for(let k=0;k<4;k++){const f=mesh(new T.BoxGeometry(.18,7.6,.5),mW2,0,4.8,0,tower);f.position.set(Math.cos(k*Math.PI/2)*.78,4.8,Math.sin(k*Math.PI/2)*.78);f.rotation.y=-k*Math.PI/2;}
  mesh(new T.CylinderGeometry(2.3,1.7,.7,28),mW,0,9.9,0,tower);
  const deck=mesh(new T.CylinderGeometry(2.25,2.25,.9,28,1,true),beamMat,0,10.7,0,tower);deck.material.side=T.DoubleSide;
  mesh(new T.CylinderGeometry(1.2,2.4,.6,28),mW,0,11.45,0,tower);
  mesh(new T.CylinderGeometry(.05,.08,2.6,6),mW,0,13,0,tower);
  const beacon=new T.Sprite(new T.SpriteMaterial({map:glowTex,transparent:true,blending:T.AdditiveBlending,depthWrite:false,opacity:0}));beacon.position.set(0,14.4,0);beacon.scale.set(4,4,1);tower.add(beacon);
  const deckGlow=new T.Sprite(new T.SpriteMaterial({map:glowTex,transparent:true,blending:T.AdditiveBlending,depthWrite:false,opacity:0}));deckGlow.position.set(0,10.7,0);deckGlow.scale.set(9,9,1);tower.add(deckGlow);
  blob(G.x+1,G.z+1,9,9);
  // AI agents on the tiles
  const visorMat=new T.MeshBasicMaterial({color:0x9ad8ff});
  const agents=[];
  const agentSpots=tiles.filter(o=>o.d>1.2&&o.d<5.3&&((o.i*3+o.j*5)%4+4)%4===0);
  agentSpots.forEach((o,k)=>{
    const g=new T.Group();g.position.set(o.m.position.x,.5,o.m.position.z);W.add(g);
    mesh(new T.CylinderGeometry(.34,.44,.8,14),mW,0,.4,0,g);
    mesh(new T.SphereGeometry(.34,14,10),mW,0,1.02,0,g);
    const vm=visorMat.clone();const v=mesh(new T.TorusGeometry(.35,.075,8,24),vm,0,1.04,0,g);v.rotation.x=Math.PI/2;v.castShadow=false;
    mesh(new T.CylinderGeometry(.025,.025,.45,5),mW,0,1.5,0,g);
    const tip=mesh(new T.SphereGeometry(.08,8,6),vm,0,1.75,0,g);tip.castShadow=false;
    const arm=mesh(new T.BoxGeometry(1.05,.14,.14),mW,0,.55,0,g);
    g.rotation.y=Math.atan2(G.x-o.m.position.x,G.z-o.m.position.z);g.scale.setScalar(1.75);
    // link arc from tower deck to agent
    const a=new T.Vector3(G.x,10.7,G.z),b=new T.Vector3(o.m.position.x,3.4,o.m.position.z);
    const mid=a.clone().lerp(b,.5);mid.y=10.5;
    const curve=new T.QuadraticBezierCurve3(a,mid,b);
    const lm=new T.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{uA:{value:0},uT:{value:0},uO:{value:k*.37}},
      vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
      fragmentShader:'varying vec2 vUv;uniform float uA,uT,uO;void main(){float p=fract(uT*.45+uO);float d=abs(vUv.x-p);float pulse=smoothstep(.12,0.,d);float a=uA*(.42+1.1*pulse);gl_FragColor=vec4(mix(vec3(.2,.42,1.),vec3(.6,.85,1.),pulse),min(a,.95));}'});
    const link=new T.Mesh(new T.TubeGeometry(curve,40,.11,6,false),lm);link.renderOrder=4;W.add(link);
    agents.push({g,vm,lm,k,y0:.5,tile:o});
  });
  tiles.forEach(o=>{o.agent=agents.some(a=>a.tile===o)});
  const gridGlow=new T.Sprite(new T.SpriteMaterial({map:glowTex,transparent:true,blending:T.AdditiveBlending,depthWrite:false,opacity:0}));gridGlow.position.set(G.x,1,G.z);gridGlow.scale.set(30,30,1);W.add(gridGlow);
  person(G.x-16,G.z+4);person(G.x+14,G.z-8);containers(G.x-26,G.z-6,2,3,2);
  // the road to scale: satellite agent pads + systems along the final run
  function pad(x,z,n=2){for(let a=0;a<n;a++)for(let b=0;b<n;b++){const m=new T.Mesh(tileGeo,M(0xf1f6fa));m.position.set(x+a*3.7,.12,z+b*3.7);m.receiveShadow=m.castShadow=true;W.add(m);}
    const g=new T.Group();g.position.set(x+1.85*(n-1),.5,z+1.85*(n-1));g.scale.setScalar(1.75);W.add(g);mesh(new T.CylinderGeometry(.34,.44,.8,14),mW,0,.4,0,g);mesh(new T.SphereGeometry(.34,14,10),mW,0,1.02,0,g);const v=mesh(new T.TorusGeometry(.35,.075,8,24),visorMat,0,1.04,0,g);v.rotation.x=Math.PI/2;blob(x+2,z+2,n*5,n*5);}
  pad(113,88);pad(129,74);pad(138,104,2);pad(150,86,2);
  containers(122,96,2,2,2);containers(140,78,3,2,1);containers(156,98,2,3,2);
  [[110,100],[114,106],[118,112],[146,114],[151,119]].forEach(p=>turbine(p[0],p[1],.9));
  block(128,62,5,5,5);block(135,58,4,4,3.5);banded(162,94,4,4,4);
  person(118,80);person(134,92);person(146,94);person(154,106);person(126,104);

  // ---- arrow + cubes (step 5) ----
  const AR=new T.Vector3(166,0,116);
  const arrowG=new T.Group();arrowG.position.copy(AR);arrowG.rotation.y=-.62;W.add(arrowG);
  const as=new T.Shape();as.moveTo(-6,5.5);as.lineTo(-2.2,5.5);as.lineTo(3.6,0);as.lineTo(-2.2,-5.5);as.lineTo(-6,-5.5);as.lineTo(-.2,0);as.lineTo(-6,5.5);
  const aGeo=new T.ExtrudeGeometry(as,{depth:.9,bevelEnabled:true,bevelThickness:.3,bevelSize:.25,bevelSegments:3});aGeo.rotateX(-Math.PI/2);
  const arrowMat=M(0xf1f6fa,{emissive:new T.Color(0x2340ff),emissiveIntensity:0});
  const arrow=mesh(aGeo,arrowMat,-1,0,0,arrowG);
  const inner=new T.Shape();inner.moveTo(-4.9,4.6);inner.lineTo(-2.6,4.6);inner.lineTo(2.3,0);inner.lineTo(-2.6,-4.6);inner.lineTo(-4.9,-4.6);inner.lineTo(-.9,0);inner.lineTo(-4.9,4.6);
  const iGeo=new T.ExtrudeGeometry(inner,{depth:.2,bevelEnabled:false});iGeo.rotateX(-Math.PI/2);mesh(iGeo,arrowMat,-1,1.25,0,arrowG);
  const cubes=[];[[4,-6.5,0],[8,-4,1],[9.5,0,0],[8,4,1],[4,6.5,0]].forEach(([x,z,dia],k)=>{const g=new T.Group();g.position.set(x,0,z);arrowG.add(g);const c=mesh(new T.BoxGeometry(2,2,2),arrowMat,0,1,0,g);mesh(new T.BoxGeometry(1.2,.1,1.2),M(0xdfe8ef),0,2.05,0,g);if(dia)g.rotation.y=Math.PI/4;cubes.push({g,k,base:g.rotation.y});});
  blob(AR.x,AR.z,26,22);

  // ---- red rails ----
  function rounded(pts,r){const cp=new T.CurvePath();let prev=pts[0].clone();
    for(let i=1;i<pts.length-1;i++){const a=pts[i-1],b=pts[i],c=pts[i+1];const d1=b.clone().sub(a).normalize(),d2=c.clone().sub(b).normalize();const rr=Math.min(r,b.distanceTo(a)/2,b.distanceTo(c)/2);const p1=b.clone().addScaledVector(d1,-rr),p2=b.clone().addScaledVector(d2,rr);cp.add(new T.LineCurve3(prev,p1));cp.add(new T.QuadraticBezierCurve3(p1,b.clone(),p2));prev=p2;}
    cp.add(new T.LineCurve3(prev,pts[pts.length-1].clone()));return cp;}
  const railPts=[[1,-5],[1,17],[20,17],[27,23],[33,23],[33,25.6]];
  function offsetPts(off){const v=railPts.map(p=>new T.Vector3(p[0],.18,p[1]));return v.map((p,i)=>{const a=v[Math.max(0,i-1)],b=v[Math.min(v.length-1,i+1)];const d=b.clone().sub(a).normalize();const n=new T.Vector3(-d.z,0,d.x);let k=1;if(i>0&&i<v.length-1){const d1=p.clone().sub(v[i-1]).normalize(),d2=v[i+1].clone().sub(p).normalize();const n1=new T.Vector3(-d1.z,0,d1.x);k=1/Math.max(.5,n.dot(n1));}return p.clone().addScaledVector(n,off*k)})}
  const railMat=new T.MeshBasicMaterial({color:0x0068de});
  const rails=[-.6,0,.6].map(o=>{const c=rounded(offsetPts(o),3.2);const geo=new T.TubeGeometry(c,360,.1,6,false);const m=new T.Mesh(geo,railMat);W.add(m);return {m,geo,n:geo.index.count};});
  const railMid=rounded(offsetPts(0),3.2);
  const railHead=new T.Sprite(new T.SpriteMaterial({map:glowTex,color:0x5c9dff,transparent:true,blending:T.AdditiveBlending,depthWrite:false,depthTest:false}));railHead.scale.set(5,5,1);W.add(railHead);
  // pulse running along rails
  const pulse=new T.Sprite(new T.SpriteMaterial({map:glowTex,color:0x8fbcff,transparent:true,blending:T.AdditiveBlending,depthWrite:false,depthTest:false,opacity:0}));pulse.scale.set(3,3,1);W.add(pulse);

  // ---- blue trail ----
  const trailPts=[[34,.5,35.5],[38,.5,41],[46,.5,45],[58,.5,49],[70,.5,52],[82,.5,57.5],[90,.5,63],[100,.5,70],[108,.5,76],[118,.5,81.5],[128,.5,85],[136,.5,90],[143,.5,97],[150,.5,103.5],[157,.5,109.5],[163.8,.5,114.5]].map(p=>new T.Vector3(...p));
  const trail=new T.CatmullRomCurve3(trailPts,false,'centripetal',.5);
  let uGrid=0;{let best=1e9;for(let i=0;i<=400;i++){const u=i/400;const d=trail.getPointAt(u).distanceTo(new T.Vector3(G.x,.5,G.z));if(d<best){best=d;uGrid=u}}}
  const trailGeo=new T.TubeGeometry(trail,600,.32,10,false);
  const trailMat=new T.ShaderMaterial({transparent:true,depthWrite:false,blending:T.AdditiveBlending,uniforms:{uHead:{value:0},uTail:{value:.16},uT:{value:0}},
    vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader:'varying vec2 vUv;uniform float uHead,uTail,uT;void main(){float u=vUv.x;if(u>uHead)discard;float k=smoothstep(uHead-uTail,uHead,u);float a=mix(.38,1.,k);float edge=1.-abs(vUv.y-.5)*2.;vec3 c=mix(vec3(0.,.41,.87),vec3(.82,.93,1.),pow(k,3.));float flick=.9+.1*sin(u*300.-uT*8.);gl_FragColor=vec4(c*a*flick,a);}'});
  const trailMesh=new T.Mesh(trailGeo,trailMat);trailMesh.renderOrder=3;W.add(trailMesh);
  const head=new T.Sprite(new T.SpriteMaterial({map:glowTex,transparent:true,blending:T.AdditiveBlending,depthWrite:false,depthTest:false}));head.scale.set(9,9,1);W.add(head);


  // ---- dot field ----
  const DS=LOW?1.25:.95;const dp=[];for(let x=28;x<=178;x+=DS)for(let z=26;z<=128;z+=DS)dp.push(x,.06,z);
  const dGeo=new T.BufferGeometry();dGeo.setAttribute('position',new T.Float32BufferAttribute(dp,3));
  const dMat=new T.ShaderMaterial({transparent:true,depthWrite:false,blending:T.AdditiveBlending,uniforms:{uHead:{value:new T.Vector3()},uAmt:{value:0},uPx:{value:DPR*(LOW?1.25:1)},uT:{value:0},uR:{value:15}},
    vertexShader:'uniform vec3 uHead;uniform float uAmt,uPx,uT,uR;varying float vA;float h(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}void main(){vec4 mv=modelViewMatrix*vec4(position,1.);float d=distance(position.xz,uHead.xz);float f=1.-smoothstep(0.,uR,d);float n=h(floor(position.xz));f*=.55+.45*sin(uT*2.+n*6.28);vA=f*uAmt;gl_PointSize=(1.2+7.5*f)*uPx*(80./-mv.z);gl_Position=projectionMatrix*mv;}',
    fragmentShader:'varying float vA;void main(){vec2 c=gl_PointCoord-.5;float r=length(c);if(r>.5)discard;float a=smoothstep(.5,.3,r)*vA;gl_FragColor=vec4(vec3(.45,.8,1.)*a,a);}'});
  const dots=new T.Points(dGeo,dMat);dots.renderOrder=2;W.add(dots);

  // ---- camera choreography ----
  const Wm=()=>{W.updateMatrixWorld();return W.matrixWorld};
  const toWorld=v=>v.clone().applyMatrix4(Wm());
  const cityC=toWorld(new T.Vector3(2,0,0));
  const heroT=cityC.clone().add(new T.Vector3(-2,0,-24));
  const key=(K,s)=>{if(s<=K[0][0])return K[0][1];for(let i=1;i<K.length;i++){if(s<=K[i][0]){const a=K[i-1],b=K[i];const t=ss(a[0],b[0],s);return a[1]+(b[1]-a[1])*t}}return K[K.length-1][1]};
  const DIST=[[0,100],[1,96],[2.1,92],[2.6,92],[3.2,96],[3.8,62],[4.6,62],[5.2,88],[6.0,88],[6.5,76],[6.8,76]];
  const ELEV=[[0,49],[1,54],[2.6,54],[3.2,54],[3.8,58],[4.6,62],[5.2,56],[6.0,58],[6.5,64],[6.8,64]];
  function tMap(s){ // trail progress
    if(s<2.45)return 0; if(s<3.5)return ss(2.45,3.5,s)*uGrid*.86;
    if(s<4.75)return uGrid*.86+ss(3.5,4.6,s)*uGrid*.14; return Math.min(1,uGrid+ (s-4.75)/1.55*(1-uGrid));
  }
  const cur={t:heroT.clone(),dist:DIST[0][1],el:ELEV[0][1]};
  let intro=reduce?0:1, introStart=0, sm=0;
  function aim(s){
    const r=cl((s-.35)/1.35);
    let tgt=heroT.clone();
    const rp=toWorld(railMid.getPointAt(Math.max(0,r-.04)));
    tgt.lerp(rp,ss(.15,1,s));
    tgt.lerp(toWorld(new T.Vector3(HQ.x,0,HQ.z+3)),ss(1.7,2.35,s));
    const tp=tMap(s);const trp=toWorld(trail.getPointAt(Math.max(0,tp-.012)));
    tgt.lerp(trp,ss(2.45,2.95,s));
    tgt.lerp(toWorld(new T.Vector3(G.x,4,G.z)),ss(3.55,3.85,s)*(1-ss(4.6,4.95,s)));
    tgt.lerp(toWorld(new T.Vector3(AR.x+2,0,AR.z)),ss(6.2,6.55,s));
    return {tgt,r,tp};
  }
  // pixel budget: a 4K TV at DPR 1 or a 1440p laptop at DPR 2 would otherwise render 8M+ pixels per frame
  const BUDGET=LOW?2.1e6:4.2e6;
  function effDPR(w,h){return Math.max(.6,Math.min(DPR,Math.sqrt(BUDGET/Math.max(1,w*h))))}
  function resize(){const w=cv.clientWidth,h=cv.clientHeight;renderer.setPixelRatio(effDPR(w,h));renderer.setSize(w,h,false);camera.aspect=w/h;camera.fov=w<h?40:28;camera.updateProjectionMatrix()}
  resize();onResize(resize);

  let visible=true;new IntersectionObserver(e=>{visible=e[0].isIntersecting}).observe(stage);
  const clock=new T.Clock();
  // adaptive resolution: keep frame time under budget, recover when there is headroom
  let fAcc=0,fN=0,lastAdj=0,fCount=0;
  function adapt(dt,now){fAcc+=dt;fN++;if(fN<45)return;const avg=fAcc/fN;fAcc=0;fN=0;
    if(now-lastAdj<1500)return;
    if(avg>1/42&&DPR>.75){DPR=Math.max(.75,DPR-.25);lastAdj=now;resize();}
    else if(avg<1/58&&DPR<MAXDPR){DPR=Math.min(MAXDPR,DPR+.25);lastAdj=now;resize();}}
  function frame(s){
    if(ctxLost)return;
    const dt=Math.min(clock.getDelta(),.05),time=clock.elapsedTime;
    adapt(dt,performance.now());
    if(LOW){fCount++;renderer.shadowMap.autoUpdate=(fCount%2===0);}
    sm+= (s-sm)*(reduce?1:Math.min(1,dt*9));
    const S=sm;
    const {tgt,r,tp}=aim(S);
    const k=reduce?1:Math.min(1,dt*5.5);
    cur.t.lerp(tgt,k);cur.dist+=(key(DIST,S)-cur.dist)*k;cur.el+=(key(ELEV,S)-cur.el)*k;
    let dist=cur.dist;
    if(intro>0&&introStart){const p=cl((performance.now()-introStart)/2200);const e=1-Math.pow(1-p,3);dist+=70*(1-e);if(p>=1)intro=0}
    else if(intro>0)dist+=70;
    const el=cur.el*Math.PI/180,sway=reduce?0:Math.sin(time*.18)*.035;
    const yaw=sway;
    camera.position.set(cur.t.x+Math.sin(yaw)*Math.cos(el)*dist,cur.t.y+Math.sin(el)*dist,cur.t.z+Math.cos(yaw)*Math.cos(el)*dist);
    camera.lookAt(cur.t);
    scene.fog.near=dist*1.05;scene.fog.far=dist*2.6;
    sun.position.set(cur.t.x-30,cur.t.y+110,cur.t.z+40);sun.target.position.copy(cur.t);

    // rails
    rails.forEach(o=>o.geo.setDrawRange(0,Math.floor(o.n*r/3)*3));
    railHead.material.opacity=r>0&&r<1?1:0;railHead.position.copy(railMid.getPointAt(Math.max(.001,r)));railHead.position.y=.4;
    if(r>=1){const pu=(time*.22)%1;pulse.material.opacity=.9*Math.sin(pu*Math.PI);pulse.position.copy(railMid.getPointAt(pu));pulse.position.y=.4}else if(S<.35){const pu=(time*.12)%1;pulse.material.opacity=0}else pulse.material.opacity=0;
    // HQ light up
    const hq=ss(1.45,2.2,S);logoGlow.material.opacity=hq*.9*(.85+.15*Math.sin(time*3));
    // trail
    trailMat.uniforms.uHead.value=tp>0?tp:-.01;trailMat.uniforms.uT.value=time;
    const hp=trail.getPointAt(Math.max(0,Math.min(1,tp)));
    head.position.copy(hp);head.material.opacity=tp>0.001?1:0;head.scale.setScalar(8+Math.sin(time*6)*.6);

    dMat.uniforms.uHead.value.copy(hp);dMat.uniforms.uAmt.value=ss(2.45,2.7,S);dMat.uniforms.uT.value=time;
    dMat.uniforms.uR.value=14+ss(3.5,3.9,S)*6*(1-ss(4.6,5,S));
    // tiles
    const gOn=ss(3.55,3.95,S)*(1-ss(4.8,5.3,S)*.55);
    tiles.forEach(o=>{const w=Math.max(0,1-o.d/5.5);const wave=.5+.5*Math.sin(time*2.2-o.d*1.1);o.m.material.emissiveIntensity=gOn*w*w*(.12+.4*wave);o.m.position.y=.12+gOn*w*.25*wave;});
    const ct=ss(3.85,4.2,S);
    beamMat.emissiveIntensity=ct*(.7+.25*Math.sin(time*3));beamMat.color.setRGB(.92-.7*ct,.95-.55*ct,.98-.05*ct);
    beacon.material.opacity=ct*(.6+.4*Math.sin(time*4));deckGlow.material.opacity=ct*.35;
    agents.forEach(a=>{const on=ss(3.9+a.k*.02,4.2+a.k*.02,S);a.lm.uniforms.uA.value=on*(1-ss(4.9,5.4,S)*.5);a.lm.uniforms.uT.value=time;
      a.vm.color.setRGB(.6-.45*on,.85-.45*on,1);a.g.position.y=a.y0+on*(.12+.12*Math.sin(time*2.4+a.k));a.g.rotation.y+=on*dt*.4*Math.sin(time*.5+a.k);});
    gridGlow.material.opacity=gOn*.2;
    // arrow
    const ar=ss(6.15,6.55,S);arrowMat.color.setRGB(.95-.78*ar,.97-.66*ar,.99-.05*ar);arrowMat.emissiveIntensity=ar*.55;
    cubes.forEach(c=>{c.g.position.y=ar*(.6+.4*Math.sin(time*1.6+c.k));c.g.rotation.y=c.base+ar*Math.sin(time*.8+c.k)*.25});
    // ambient life
    turbines.forEach((h,i)=>h.rotation.z-=dt*(.9+i%3*.15));
    people.forEach(p=>{const t=time*p.sp+p.ph;const o=Math.sin(t)*p.range;p.g.position.set(p.x+(p.ax?o:0),Math.abs(Math.sin(t*6))*.05,p.z+(p.ax?0:o));p.g.rotation.y=(p.ax?Math.PI/2:0)+(Math.cos(t)<0?Math.PI:0);});
    smokes.forEach(o=>{o.t=(o.t+dt*.12)%1;const e=o.t;o.s.position.set(o.x+e*1.6,o.y+e*5,o.z-e*.8);o.s.scale.setScalar(o.scale*(.6+e*1.8));o.s.material.opacity=.85*Math.sin(e*Math.PI)});
    renderer.render(scene,camera);
  }
  return {frame,start(){introStart=performance.now()},get visible(){return visible},renderer};
}

/* fit wordmark to width */
function fitWM(){const w=$('#wm');w.style.fontSize='100px';const box=w.clientWidth;let tw=0;w.querySelectorAll('span').forEach(s=>tw+=s.getBoundingClientRect().width);if(tw>0)w.style.fontSize=(100*box/tw*.955).toFixed(2)+'px';}
fitWM();onResize(fitWM);document.fonts&&document.fonts.ready.then(fitWM);
/* ---------- smooth scroll + single loop + boot ---------- */
let READY=false;
const lenis=(!reduce&&window.Lenis)?new Lenis({lerp:.095,smoothWheel:true,wheelMultiplier:1,touchMultiplier:1.4,syncTouch:false}):null;
if(lenis)document.documentElement.classList.add('lenis');
// in-page links glide with Lenis
document.addEventListener('click',e=>{const a=e.target.closest('a[href^="#"]');if(!a)return;const id=a.getAttribute('href');if(id.length<2&&id!=='#')return;
  const el=id==='#top'?document.body:document.querySelector(id);if(!el)return;e.preventDefault();
  if(lenis)lenis.scrollTo(el===document.body?0:el,{duration:1.4});else el.scrollIntoView({behavior:reduce?'auto':'smooth'})});
window.__scrollTo=(y)=>{lenis?lenis.scrollTo(y,{duration:1.2}):scrollTo({top:y,behavior:reduce?'auto':'smooth'})};
/* ---------- minimal scrollbar (native one is hidden) ---------- */
const SB=(function(){
  const bar=$('#sbar'),th=$('#sthumb');if(!bar)return {tick(){},measure(){}};
  const M=4;let docH=1,maxY=1,trackH=1,thH=48,lastY=-1,lastMove=0,on=false,dk=null,drag=null;
  function measure(){docH=document.documentElement.scrollHeight;maxY=Math.max(1,docH-vh);trackH=vh-M*2;
    thH=Math.round(Math.max(isTouch?32:44,Math.min(trackH*.5,trackH*vh/docH)));th.style.height=thH+'px';lastY=-1;
    bar.style.display=docH<=vh+2?'none':''}
  function tick(y,now){
    if(Math.abs(y-lastY)>.3){lastY=y;lastMove=now;
      const t=M+(trackH-thH)*cl(y/maxY);th.style.transform=`translate3d(0,${t.toFixed(1)}px,0)`;
      const cy=y+t+thH/2;let d=false;for(const r of L.darks){if(r[0]<=cy&&r[1]>=cy){d=true;break}}
      if(d!==dk){bar.classList.toggle('dk',d);dk=d}}
    const act=!!drag||now-lastMove<(isTouch?700:1100);if(act!==on){bar.classList.toggle('on',act);on=act}
  }
  th.addEventListener('pointerdown',e=>{if(e.pointerType==='touch')return;e.preventDefault();th.setPointerCapture(e.pointerId);
    drag={y0:e.clientY,s0:lenis?lenis.targetScroll:window.scrollY};bar.classList.add('drag');document.documentElement.classList.add('sbdrag')});
  th.addEventListener('pointermove',e=>{if(!drag)return;const ny=cl(drag.s0+(e.clientY-drag.y0)*maxY/Math.max(1,trackH-thH),0,maxY);
    lenis?lenis.scrollTo(ny,{lerp:.35,force:true}):window.scrollTo(0,ny)});
  const end=e=>{if(!drag)return;drag=null;bar.classList.remove('drag');document.documentElement.classList.remove('sbdrag');try{th.releasePointerCapture(e.pointerId)}catch(_){}};
  th.addEventListener('pointerup',end);th.addEventListener('pointercancel',end);
  measure();window.__sbm=measure;return {tick,measure};
})();
function loop(now){
  if(lenis)lenis.raf(now);
  const y=lenis?lenis.animatedScroll:window.scrollY;
  const s=domTick(y);
  SB.tick(y,now);
  if(gl3&&gl3.visible)gl3.frame(s);
  for(let i=0;i<TICKERS.length;i++)TICKERS[i](now);
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
if(lenis)lenis.stop();
const minWait=new Promise(r=>setTimeout(r,reduce?200:1900));
const fonts=document.fonts?document.fonts.ready.catch(()=>{}):Promise.resolve();
Promise.all([minWait,fonts]).then(()=>{
  const ld=$('#loader');ld.classList.add('out');document.body.classList.remove('is-loading');setTimeout(()=>ld.remove(),1200);
  measureLayout();fitWM();if(lenis){lenis.resize();lenis.start();}
  setTimeout(()=>{document.body.classList.add('ready');READY=true;gl3&&gl3.start()},250);
});
})();
