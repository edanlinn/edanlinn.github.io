const d = window.CLOUD_SA_DATA;
const avg = Math.round(d.scores.reduce((a,b)=>a+b.score,0)/d.scores.length);
document.querySelector('#completed').textContent=d.completedDays;
document.querySelector('#avg').textContent=avg;
document.querySelector('#track').textContent=d.currentTrack;
document.querySelector('#updated').textContent=d.updatedAt;

const roadmap=document.querySelector('#roadmap');
roadmap.innerHTML=d.roadmap.map((x,i)=>`<span class="${i<5?'done':''}">${x}</span>`).join('');

function renderSkillMap(){
  const s=d.skillMap;
  document.querySelector('#skill-summary').innerHTML=s.summary.map(x=>`
    <div class="skill-summary-card"><span>${x.label}</span><b>${x.value}</b></div>`).join('');

  document.querySelector('#skill-domains').innerHTML=s.domains.map((x,i)=>`
    <div class="skill-domain">
      <div class="skill-domain-head">
        <h3>${String(i+1).padStart(2,'0')}｜${x.name}</h3>
        <span class="status-pill status-${x.status}">${x.statusLabel}</span>
      </div>
      <ul>${x.items.map(y=>`<li>${y}</li>`).join('')}</ul>
    </div>`).join('');

  const groups=[
    {key:'mastered',title:'已掌握',className:'mastered'},
    {key:'confused',title:'容易混淆',className:'confused'},
    {key:'upcoming',title:'尚未深入',className:'upcoming'}
  ];
  document.querySelector('#skill-status-groups').innerHTML=groups.map(g=>`
    <div class="skill-state-card ${g.className}">
      <h3>${g.title}</h3>
      <ul>${s[g.key].map(x=>`<li>${x}</li>`).join('')}</ul>
    </div>`).join('');

  const flow=(items,currentIndex=-1)=>items.map((x,i)=>
    `<span class="flow-node ${i===currentIndex?'current':'done'}">${x}</span>${i<items.length-1?'<span class="flow-arrow">→</span>':''}`
  ).join('');
  document.querySelector('#architecture-flow').innerHTML=flow(s.architectureFlow,s.architectureCurrentIndex);
  document.querySelector('#thinking-flow').innerHTML=flow(s.thinkingFlow,-1);
}
renderSkillMap();

function renderExamples(){
  const root=document.querySelector('#example-cases');
  root.innerHTML=d.practicalExamples.map(c=>`
    <article class="example-card">
      <div class="example-head">
        <div><h3>${c.title}</h3><div class="muted">${c.subtitle}</div></div>
        <span class="tag">${c.tag}</span>
      </div>
      <div class="example-desc">${c.description}</div>
      <div class="example-flow">
        ${c.steps.map((s,i)=>`
          <div class="example-step">
            <span class="aws">${s.aws}</span>
            <span class="real">${s.real}</span>
          </div>
          ${i<c.steps.length-1?'<div class="example-arrow">→</div>':''}
        `).join('')}
      </div>
      ${c.compare ? `
        <div class="example-compare">
          <div><b>${c.compare[0].title}</b><div class="muted">${c.compare[0].text}</div></div>
          <div><b>${c.compare[1].title}</b><div class="muted">${c.compare[1].text}</div></div>
        </div>` : ''}
      <div class="example-note"><b>你要聯想到：</b> ${c.memory}</div>
    </article>
  `).join('');
}
renderExamples();


const quizStateKey='edan-cloud-sa-quiz-progress-v1';
let quizMode='all';
let currentQuestion=null;
let answered=false;

function loadQuizState(){
  try{
    return JSON.parse(localStorage.getItem(quizStateKey)) || {attempts:0,correct:0,missed:{}};
  }catch(e){
    return {attempts:0,correct:0,missed:{}};
  }
}
function saveQuizState(state){
  localStorage.setItem(quizStateKey,JSON.stringify(state));
}
function quizState(){
  return loadQuizState();
}
function renderQuizStats(){
  const s=quizState();
  document.querySelector('#quiz-bank-count').textContent=d.quizBank.length+' 題';
  document.querySelector('#quiz-attempts').textContent=s.attempts;
  document.querySelector('#quiz-accuracy').textContent=s.attempts?Math.round((s.correct/s.attempts)*100)+'%':'-';
  document.querySelector('#quiz-missed').textContent=Object.keys(s.missed||{}).length;
  document.querySelector('#quiz-difficulty').textContent=currentQuestion?currentQuestion.difficulty:'-';
}
function setupQuizCategories(){
  const select=document.querySelector('#quiz-category');
  const cats=[...new Set(d.quizBank.map(q=>q.category))];
  cats.forEach(c=>{
    const op=document.createElement('option');
    op.value=c;op.textContent=c;select.appendChild(op);
  });
  select.addEventListener('change',()=>nextQuizQuestion());
}
function quizCandidates(){
  const category=document.querySelector('#quiz-category').value;
  const s=quizState();
  let items=d.quizBank.filter(q=>category==='all'||q.category===category);
  if(quizMode==='missed') items=items.filter(q=>s.missed&&s.missed[q.id]);
  return items;
}
function nextQuizQuestion(){
  const items=quizCandidates();
  const result=document.querySelector('#quiz-result');
  result.className='quiz-result';
  result.innerHTML='';
  document.querySelector('#quiz-next').disabled=true;
  answered=false;

  if(!items.length){
    currentQuestion=null;
    document.querySelector('#quiz-category-label').textContent='';
    document.querySelector('#quiz-number').textContent='';
    document.querySelector('#quiz-question').textContent=quizMode==='missed'?'目前沒有符合條件的錯題。':'這個分類目前還沒有題目。';
    document.querySelector('#quiz-options').innerHTML='';
    renderQuizStats();
    return;
  }
  let pool=items.filter(q=>!currentQuestion||q.id!==currentQuestion.id);
  if(!pool.length) pool=items;
  currentQuestion=pool[Math.floor(Math.random()*pool.length)];
  document.querySelector('#quiz-category-label').textContent=currentQuestion.category;
  document.querySelector('#quiz-number').textContent='題號 '+currentQuestion.id;
  document.querySelector('#quiz-question').textContent=currentQuestion.question;
  document.querySelector('#quiz-options').innerHTML=currentQuestion.options.map((o,i)=>`
    <button class="quiz-option" data-index="${i}">
      <span class="letter">${String.fromCharCode(65+i)}.</span> ${o}
    </button>`).join('');
  document.querySelectorAll('.quiz-option').forEach(btn=>btn.addEventListener('click',()=>answerQuiz(Number(btn.dataset.index))));
  renderQuizStats();
}
function answerQuiz(selected){
  if(answered||!currentQuestion)return;
  answered=true;
  const correct=currentQuestion.answer;
  const ok=selected===correct;
  const state=quizState();
  state.attempts=(state.attempts||0)+1;
  if(ok){
    state.correct=(state.correct||0)+1;
    if(state.missed) delete state.missed[currentQuestion.id];
  }else{
    state.missed=state.missed||{};
    state.missed[currentQuestion.id]=(state.missed[currentQuestion.id]||0)+1;
  }
  saveQuizState(state);

  document.querySelectorAll('.quiz-option').forEach((btn,i)=>{
    btn.disabled=true;
    if(i===correct) btn.classList.add('correct');
    if(i===selected&&!ok) btn.classList.add('wrong');
  });

  const result=document.querySelector('#quiz-result');
  result.className='quiz-result show '+(ok?'correct':'wrong');
  result.innerHTML=`
    <div class="quiz-result-title">${ok?'✓ 答對了':'✕ 答錯了'}</div>
    <p><b>正確答案：</b>${String.fromCharCode(65+correct)}. ${currentQuestion.options[correct]}</p>
    <p class="quiz-explain"><b>解析：</b>${currentQuestion.explanation}</p>
    ${currentQuestion.memory?'<p class="quiz-explain"><b>記憶點：</b>'+currentQuestion.memory+'</p>':''}
  `;
  document.querySelector('#quiz-next').disabled=false;
  renderQuizStats();
}
document.querySelector('#quiz-next').addEventListener('click',nextQuizQuestion);
document.querySelector('#quiz-random').addEventListener('click',()=>{
  quizMode='all';
  document.querySelector('#quiz-random').classList.add('active');
  document.querySelector('#quiz-missed-only').classList.remove('active');
  nextQuizQuestion();
});
document.querySelector('#quiz-missed-only').addEventListener('click',()=>{
  quizMode='missed';
  document.querySelector('#quiz-missed-only').classList.add('active');
  document.querySelector('#quiz-random').classList.remove('active');
  nextQuizQuestion();
});
document.querySelector('#quiz-reset').addEventListener('click',()=>{
  if(confirm('確定要清除這台裝置的答題紀錄嗎？')){
    localStorage.removeItem(quizStateKey);
    quizMode='all';
    document.querySelector('#quiz-random').classList.add('active');
    document.querySelector('#quiz-missed-only').classList.remove('active');
    nextQuizQuestion();
  }
});
setupQuizCategories();
nextQuizQuestion();

const root=document.querySelector('#days');
function render(filter='all',q=''){
  const query=q.trim().toLowerCase();
  const items=d.days.filter(day=>{
    const txt=JSON.stringify(day).toLowerCase();
    const filterOk=filter==='all' || (filter==='mistakes'&&day.corrections.length) || (filter==='mastered'&&day.mastered.length);
    return filterOk && (!query || txt.includes(query));
  });
  root.innerHTML=items.map(day=>`
    <article class="day" data-day="${day.day}">
      <div class="day-head" tabindex="0">
        <div class="day-num">DAY<b>${day.day}</b></div>
        <div><h2>${day.topic}</h2><div class="muted">${day.date} · ${day.status==='completed'?'已完成':'進行中'}</div></div>
        <div class="score ${day.score>=90?'high':'mid'}">${day.score}/100</div>
      </div>
      <div class="day-body">
        <div class="chips">${day.mastered.map(x=>`<span class="chip">已掌握 · ${x}</span>`).join('')}</div>
        <h3>需要持續修正</h3>
        ${day.corrections.map(c=>`<div class="correction"><div class="box bad"><b>容易混淆</b><div>${c[0]}</div></div><div class="box good"><b>正確 SA 思維</b><div>${c[1]}</div></div></div>`).join('')}
        <div class="memory"><b>必背</b><ul>${day.memory.map(x=>`<li>${x}</li>`).join('')}</ul></div>
      </div>
    </article>`).join('');
  document.querySelector('#empty').style.display=items.length?'none':'block';
  bindDays();
}
function bindDays(){
  document.querySelectorAll('.day-head').forEach(h=>{
    const toggle=()=>h.parentElement.classList.toggle('open');
    h.onclick=toggle;h.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle();}};
  });
}
render();

document.querySelector('#search').addEventListener('input',e=>render(document.querySelector('.filter .active').dataset.filter,e.target.value));
document.querySelectorAll('.filter button').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('.filter button').forEach(x=>x.classList.remove('active'));b.classList.add('active');render(b.dataset.filter,document.querySelector('#search').value);
}));
document.querySelector('#expand').onclick=()=>document.querySelectorAll('.day').forEach(x=>x.classList.add('open'));
document.querySelector('#collapse').onclick=()=>document.querySelectorAll('.day').forEach(x=>x.classList.remove('open'));