const d = window.CLOUD_SA_DATA;
const avg = Math.round(d.scores.reduce((a,b)=>a+b.score,0)/d.scores.length);
document.querySelector('#completed').textContent=d.completedDays;
document.querySelector('#avg').textContent=avg;
document.querySelector('#track').textContent=d.currentTrack;
document.querySelector('#updated').textContent=d.updatedAt;

const roadmap=document.querySelector('#roadmap');
roadmap.innerHTML=d.roadmap.map((x,i)=>`<span class="${i<5?'done':''}">${x}</span>`).join('');

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