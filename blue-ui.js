/* Fantasy professions and an explorable map; learning states remain sourced from d. */
const fantasyRoles=[
 {id:'mage',name:'法師',unlock:1,description:'以知識與推理，解開架構謎題。',titles:[{level:1,name:'見習法師'},{level:3,name:'雲端法師'},{level:5,name:'元素法師'},{level:10,name:'星辰大法師'}]},
 {id:'paladin',name:'聖騎士',unlock:3,description:'守護系統可用性與資料安全。',titles:[{level:3,name:'見習聖騎士'},{level:5,name:'守護聖騎士'},{level:10,name:'蒼穹聖騎士'}]},
 {id:'ranger',name:'遊俠',unlock:5,description:'穿越網路與雲端，探索新的路線。',titles:[{level:5,name:'雲境遊俠'},{level:10,name:'天空巡守'}]}
];
function availableRole(level,requested){return fantasyRoles.find(r=>r.id===requested&&level>=r.unlock)||fantasyRoles[0];}
function fantasyTitle(role,level){return [...role.titles].reverse().find(t=>level>=t.level)||role.titles[0];}
function renderFantasyGame(){
 const g=gameState(quizState()),level=gameLevel(g.xp||0).level,role=availableRole(level,g.role),title=fantasyTitle(role,level);
 const sprite=document.querySelector('#hero-character');if(sprite){sprite.dataset.role=role.id;sprite.setAttribute('aria-label',role.name+'角色');}
 const titleEl=document.querySelector('#game-character-title');if(titleEl)titleEl.textContent=title.name;
 const roleEl=document.querySelector('#game-character-role');if(roleEl)roleEl.textContent=role.name+' · 職業稱號隨等級成長';
 const next=role.titles.find(t=>t.level>level),sub=document.querySelector('#game-next-title');if(sub)sub.textContent=next?'LV. '+next.level+' 解鎖「'+next.name+'」':'已解鎖本職業全部稱號';
 const collection=document.querySelector('#role-collection');if(collection){collection.innerHTML=fantasyRoles.map(r=>{const unlocked=level>=r.unlock;return '<button class="role-card '+(r.id===role.id?'equipped':'')+'" data-select-role="'+r.id+'" '+(!unlocked?'disabled':'')+'><span class="role-sprite" data-role="'+r.id+'" aria-hidden="true"></span><b>'+r.name+'</b><small>'+r.description+'</small><em>'+(unlocked?(r.id===role.id?'目前職業':'選擇職業'):'LV. '+r.unlock+' 解鎖')+'</em></button>';}).join('');collection.querySelectorAll('[data-select-role]').forEach(b=>b.onclick=()=>{const s=quizState(),g=gameState(s);g.role=b.dataset.selectRole;s.game=g;saveQuizState(s);renderFantasyGame();});}
 if(typeof renderArena==='function')renderArena();
 if(typeof renderAvatarCustomizer==='function')renderAvatarCustomizer();
 const titles=document.querySelector('#title-collection');if(titles)titles.innerHTML=fantasyRoles.flatMap(r=>r.titles.map(t=>'<div class="title-row '+(level>=t.level?'earned':'')+'"><span>'+gameIcon('trophy')+'</span><div><b>'+t.name+'</b><small>'+r.name+' · LV. '+t.level+'</small></div><em>'+(level>=t.level?'已解鎖':'待解鎖')+'</em></div>')).join('');
}
const worldNodes=[
 {x:142,y:182,name:'架構之城',icon:'skill-map',category:'Architecture'},
 {x:397,y:133,name:'網路港灣',icon:'dashboard',category:'Networking'},
 {x:706,y:183,name:'守護聖殿',icon:'shield',category:'IAM'},
 {x:224,y:383,name:'運算高地',icon:'quiz',category:'Compute'},
 {x:485,y:318,name:'儲存森林',icon:'glossary',category:'Storage'},
 {x:735,y:399,name:'資料水晶城',icon:'examples',category:'Database'},
 {x:866,y:527,name:'未來之門',icon:'arrow',category:null}
];
function worldTerrain(){return `<svg class="world-terrain" viewBox="0 0 960 600" aria-hidden="true">
 <defs><linearGradient id="map-sea" x2="0" y2="1"><stop stop-color="#deefff"/><stop offset="1" stop-color="#beddf7"/></linearGradient><linearGradient id="map-land" x2="0" y2="1"><stop stop-color="#f4fbff"/><stop offset="1" stop-color="#d1e5f5"/></linearGradient><filter id="island-shadow" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="14" stdDeviation="8" flood-color="#6a9fc2" flood-opacity=".19"/></filter></defs>
 <rect width="960" height="600" rx="22" fill="url(#map-sea)"/>
 <g fill="none" stroke="#a3cbea" stroke-opacity=".35"><path d="M0 90Q200 40 390 80T960 70M0 125Q230 65 400 110T960 100M0 530Q250 480 490 540T960 560M0 564Q240 525 475 576T960 590"/></g>
 <path d="M79 140Q93 72 195 86L293 75Q346 42 426 67L572 98Q667 54 765 106Q851 129 867 218L909 306Q929 378 871 427L789 479Q694 506 607 471L473 487Q386 518 291 475L173 456Q82 446 62 356L46 257Q33 194 79 140Z" fill="url(#map-land)" stroke="#fff" stroke-width="8" filter="url(#island-shadow)"/>
 <path d="M99 170Q170 101 274 119T449 110T655 134T816 200M89 275Q149 170 297 174T503 161T841 280M118 374Q213 410 341 387T550 430T819 399" fill="none" stroke="#b3cfe4" stroke-width="1.3" opacity=".55"/>
 <path d="M352 76Q293 170 353 240T569 349Q619 421 687 470" fill="none" stroke="#b1d5ef" stroke-width="24" stroke-linecap="round"/><path d="M352 76Q293 170 353 240T569 349Q619 421 687 470" fill="none" stroke="#e4f5ff" stroke-width="7" stroke-linecap="round"/>
 <g fill="#b1cfe3" stroke="#f3faff" stroke-width="3"><path d="m120 340 38-59 34 59Z"/><path d="m166 340 32-46 28 46Z"/><path d="m167 345 45-74 43 74Z"/></g>
 <g fill="#a3c6de" opacity=".7"><path d="m444 300 13-30 13 30Z"/><path d="m523 326 14-33 14 33Z"/><path d="m470 360 13-30 13 30Z"/><path d="m559 310 12-26 12 26Z"/><path d="m428 346 12-26 12 26Z"/></g>
 <g fill="#fff" opacity=".75"><path d="M57 70a15 15 0 0 1 18-16 22 22 0 0 1 42-7 16 16 0 0 1 13 31H63a8 8 0 0 1-6-8Z"/><path d="M798 61a16 16 0 0 1 21-15 23 23 0 0 1 42-6 17 17 0 0 1 14 32h-69a9 9 0 0 1-8-11Z"/><path d="M71 519a16 16 0 0 1 19-16 22 22 0 0 1 43-4 16 16 0 0 1 12 30H79a8 8 0 0 1-8-10Z"/></g>
 <path d="M819 486Q862 470 899 496L918 542Q901 577 863 575L823 560Q806 533 819 486Z" fill="#e3eff8" stroke="#fff" stroke-width="5"/>
 <path class="world-route" d="M142 182Q244 108 397 133T706 183Q573 214 485 318T224 383Q460 445 735 399L866 527" fill="none" stroke="#739bbd" stroke-width="3" stroke-dasharray="5 9" stroke-linecap="round"/>
 <g transform="translate(904 64)" stroke="#6894b6" fill="none"><circle r="22" stroke-opacity=".35"/><path d="m0-17 6 17-6 17-6-17Z"/><path d="M-17 0h34"/></g><text x="904" y="32" text-anchor="middle" fill="#6287a2" font-size="10" font-family="sans-serif">N</text>
 <text x="95" y="574" fill="#6a91ad" font-size="10" letter-spacing="3" font-family="sans-serif">CLOUD ATLAS · SEASON 01</text>
 </svg>`;}
let selectedWorldNode=null;
function closeWorldDetail(){const card=document.querySelector('#world-detail');if(card)card.hidden=true;document.querySelectorAll('.world-node').forEach(b=>{b.classList.remove('selected');b.setAttribute('aria-expanded','false');});if(selectedWorldNode!==null){const btn=document.querySelector('[data-world-node="'+selectedWorldNode+'"]');if(btn)btn.focus();}selectedWorldNode=null;}
function openWorldNode(index){
 const domain=d.skillMap.domains[index],node=worldNodes[index];if(!domain||!node)return;selectedWorldNode=index;
 document.querySelectorAll('.world-node').forEach(b=>{const on=Number(b.dataset.worldNode)===index;b.classList.toggle('selected',on);b.setAttribute('aria-expanded',String(on));});
 const card=document.querySelector('#world-detail');card.hidden=false;document.querySelector('#world-detail-name').textContent=node.name;document.querySelector('#world-detail-domain').textContent=domain.name;document.querySelector('#world-detail-status').textContent=domain.statusLabel;
 document.querySelector('#world-detail-items').innerHTML=domain.items.map(item=>'<li>'+escapeQuiz(item)+'</li>').join('');
 const questions=quizBank.filter(q=>q.category===node.category);
 document.querySelector('#world-detail-count').textContent=questions.length?questions.length+' 題相關練習':'下一階段規劃，尚未收錄題目';
 const practice=document.querySelector('#world-detail-practice');practice.hidden=!questions.length;practice.onclick=()=>{document.querySelector('#quiz-type').value='all';document.querySelector('#quiz-category').value=node.category;setQuizMode('all');closeWorldDetail();openOnlyModule('quiz',true);};
 document.querySelector('#world-detail-glossary').onclick=()=>{closeWorldDetail();openOnlyModule('glossary',true);const term=['HA','VPC','IAM','EC2','S3','Aurora',''][index]||'';glossarySearch.value=term;renderGlossary(term);};
 const firstButton=document.querySelector('#world-detail-close');firstButton.focus();
}
function initWorldMap(){
 const section=document.querySelector('#skill-map .module-content'),anchor=document.querySelector('#skill-domains');
 const map=document.createElement('div');map.className='world-map';map.innerHTML='<div class="world-map-head"><div><span class="section-kicker">CLOUD ATLAS</span><h3>你的雲端冒險地圖</h3><p>點選島上的關卡，展開學習內容與練習入口。</p></div><div class="map-legend"><span class="stable">基礎穩定</span><span class="current">學習中</span><span class="strengthen">待強化</span><span class="next">下一階段</span></div></div><div class="world-map-body"><div class="map-scroll" tabindex="0" aria-label="雲端能力島嶼地圖，手機可左右滑動"><div class="map-stage">'+worldTerrain()+d.skillMap.domains.slice(0,worldNodes.length).map((domain,i)=>{const n=worldNodes[i];return '<button class="world-node '+domain.status+'" data-world-node="'+i+'" style="left:'+n.x/960*100+'%;top:'+n.y/600*100+'%" aria-expanded="false" aria-controls="world-detail"><span class="world-marker">'+gameIcon(n.icon)+'</span><span class="world-node-label"><b>'+n.name+'</b><small>'+escapeQuiz(domain.name)+'</small><em>'+escapeQuiz(domain.statusLabel)+'</em></span></button>';}).join('')+'</div></div><section id="world-detail" class="world-detail" role="dialog" aria-modal="false" aria-labelledby="world-detail-name" hidden><button id="world-detail-close" class="map-close" aria-label="關閉關卡詳情">×</button><span id="world-detail-status" class="map-status"></span><h3 id="world-detail-name"></h3><p id="world-detail-domain"></p><ul id="world-detail-items"></ul><small id="world-detail-count"></small><div class="map-detail-actions"><button id="world-detail-practice" class="primary-action">挑戰這個主題 →</button><button id="world-detail-glossary" class="quiet-action">查看知識庫</button></div></section></div><p class="map-footnote">地圖呈現學習路線；關卡狀態依每日訓練整理。手機可左右滑動探索。</p>';
 section.insertBefore(map,anchor);map.querySelectorAll('[data-world-node]').forEach(b=>b.onclick=()=>openWorldNode(Number(b.dataset.worldNode)));document.querySelector('#world-detail-close').onclick=closeWorldDetail;
 map.addEventListener('keydown',e=>{if(e.key==='Escape')closeWorldDetail();});
 const details=document.createElement('details');details.className='map-course-list';details.innerHTML='<summary>查看完整能力清單</summary>';anchor.replaceWith(details);details.appendChild(anchor);
 // Dashboard landmarks jump to the same interactive map and select the relevant node.
 document.querySelectorAll('[data-path]').forEach(b=>b.onclick=()=>{openOnlyModule('skill-map',true);openWorldNode(Number(b.dataset.path));});
}
function initFantasyGame(){
 document.querySelector('.rank-emblem').outerHTML='<div class="rank-emblem character-emblem"><div id="hero-character" class="role-sprite" data-role="mage" role="img" aria-label="法師角色"></div></div>';
 document.querySelector('.rank-title').id='game-character-title';document.querySelector('.rank-subtitle').id='game-character-role';
 document.querySelector('.rank-foot').insertAdjacentHTML('afterend','<p id="game-next-title" class="next-title"></p><button id="open-role-collection" class="title-collection-toggle">職業與稱號收藏 →</button>');
 document.body.insertAdjacentHTML('beforeend','<dialog id="fantasy-dialog" class="fantasy-dialog" aria-labelledby="fantasy-dialog-title"><button id="close-fantasy-dialog" class="map-close" aria-label="關閉職業與稱號">×</button><span class="section-kicker">CHARACTER GALLERY</span><h2 id="fantasy-dialog-title">選擇你的冒險職業</h2><p>每 200 XP 升一級。法師 LV. 1、聖騎士 LV. 3、遊俠 LV. 5 解鎖。</p><div id="role-collection" class="role-collection"></div><h3>稱號收藏</h3><div id="title-collection" class="title-collection"></div><small class="title-disclaimer">職業與稱號是練習獎勵，不代表專業資格或能力認證。</small></dialog>');
 const dialog=document.querySelector('#fantasy-dialog');document.querySelector('#open-role-collection').onclick=()=>{renderFantasyGame();dialog.showModal();};document.querySelector('#close-fantasy-dialog').onclick=()=>dialog.close();
 dialog.addEventListener('click',e=>{if(e.target===dialog){const box=dialog.getBoundingClientRect();if(e.clientX<box.left||e.clientX>box.right||e.clientY<box.top||e.clientY>box.bottom)dialog.close();}});
 if(typeof initAvatarCustomizer==='function')initAvatarCustomizer();
 initWorldMap();renderFantasyGame();
}
initFantasyGame();
