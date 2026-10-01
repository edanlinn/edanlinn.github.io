/* Native desktop drag, plus tap / keyboard placement for every device. */
function placeQuizToken(assignments,slot,token){
 const next=[...assignments],old=next.indexOf(token),displaced=next[slot];
 if(old!==-1&&old!==slot)next[old]=displaced;
 next[slot]=token;return next;
}
function renderDragQuestion(q,root){
 let assignments=q.items.map(()=>-1),selected=null;
 const labels=q.type==='match'?q.labels:q.items.map((_,i)=>'第 '+(i+1)+' 步');
 const shuffled=q.items.map((_,i)=>i);for(let i=shuffled.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[shuffled[i],shuffled[j]]=[shuffled[j],shuffled[i]];}
 root.innerHTML='<p class="drag-instruction">拖曳詞彙到對應位置，或先點選詞彙、再點位置。每個詞彙只能使用一次；放到已填位置會交換。鍵盤可用 Tab 與 Enter 操作。</p><div class="drag-token-bank" aria-label="可使用的詞彙">'+shuffled.map(i=>'<button type="button" class="drag-token" data-token="'+i+'" draggable="true" aria-pressed="false">'+escapeQuiz(q.items[i])+'</button>').join('')+'</div><div class="drag-drop-list">'+labels.map((label,i)=>'<div class="drag-drop-row"><span class="drop-number">'+(i+1)+'</span><div><b>'+escapeQuiz(label)+'</b><button type="button" class="drag-slot" data-drop-slot="'+i+'" data-answer="" aria-label="'+escapeQuiz(label)+'：尚未放入詞彙">放入詞彙</button></div></div>').join('')+'</div><div class="drag-bottom"><p id="drag-status" role="status" aria-live="polite">已填 0 / '+labels.length+' 項</p><button type="button" id="drag-reset" class="quiz-action">清空配對</button></div>';
 const tokens=[...root.querySelectorAll('[data-token]')],slots=[...root.querySelectorAll('[data-drop-slot]')];
 const sync=()=>{tokens.forEach(b=>{const index=Number(b.dataset.token);b.classList.toggle('placed',assignments.includes(index));b.classList.toggle('selected',selected===index);b.setAttribute('aria-pressed',String(selected===index));});slots.forEach((b,i)=>{const filled=assignments[i]!==-1;b.dataset.answer=filled?String(assignments[i]):'';b.textContent=filled?q.items[assignments[i]]:'放入詞彙';b.classList.toggle('filled',filled);b.setAttribute('aria-label',labels[i]+'：'+(filled?q.items[assignments[i]]:'尚未放入詞彙'));});root.querySelector('#drag-status').textContent='已填 '+assignments.filter(v=>v!==-1).length+' / '+labels.length+' 項'+(selected!==null?' · 已選「'+q.items[selected]+'」，請選擇位置':'');};
 const place=(slot,token)=>{if(answered||!Number.isInteger(token)||token<0||token>=q.items.length)return;assignments=placeQuizToken(assignments,slot,token);selected=null;sync();};
 tokens.forEach(b=>{b.onclick=()=>{if(answered)return;selected=Number(b.dataset.token);sync();};b.ondragstart=e=>{if(answered){e.preventDefault();return;}selected=Number(b.dataset.token);e.dataTransfer.setData('text/plain',String(selected));e.dataTransfer.effectAllowed='move';sync();};});
 slots.forEach((b,i)=>{b.onclick=()=>{if(answered)return;if(selected===null){root.querySelector('#drag-status').textContent='先選一個詞彙，再選擇放入的位置。';return;}place(i,selected);};b.ondragover=e=>{if(answered)return;e.preventDefault();e.dataTransfer.dropEffect='move';b.classList.add('drag-over');};b.ondragleave=()=>b.classList.remove('drag-over');b.ondrop=e=>{e.preventDefault();b.classList.remove('drag-over');const raw=e.dataTransfer.getData('text/plain');if(raw==='')return;place(i,Number(raw));};});
 root.querySelector('#drag-reset').onclick=()=>{if(answered)return;assignments=q.items.map(()=>-1);selected=null;sync();};
}
