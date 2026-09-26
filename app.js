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