/* Rewards are local; global scores require the configured shared service. */
const weaponTiers=[
 {id:'mist',need:3,rarity:'初階',color:'#8eacc3',names:{mage:'星塵量子杖',paladin:'星塵光刃',ranger:'星塵脈衝弓'}},
 {id:'frost',need:5,rarity:'稀有',color:'#639ed1',names:{mage:'離子量子杖',paladin:'離子光刃',ranger:'離子脈衝弓'}},
 {id:'sky',need:10,rarity:'史詩',color:'#8576bb',names:{mage:'星軌量子核心',paladin:'星軌光刃',ranger:'星軌粒子弓'}},
 {id:'star',need:20,rarity:'傳說',color:'#b39255',names:{mage:'星核控制器',paladin:'星核裁決光刃',ranger:'星核躍遷弓'}}
];
function trackCorrectChain(g,q,ok,self,today){
 if(self)return [];
 g.chain=Math.max(0,Number(g.chain)||0);g.bestChain=Math.max(g.chain,Number(g.bestChain)||0);g.weapons=Array.isArray(g.weapons)?g.weapons:[];
 if(g.chainDay!==today){g.chainDay=today;g.chainSeen=[];}
 g.chainSeen=Array.isArray(g.chainSeen)?g.chainSeen:[];
 if(!ok){g.chain=0;return [];}
 if(g.chainSeen.includes(q.id))return [];
 g.chainSeen.push(q.id);g.chain++;g.bestChain=Math.max(g.bestChain,g.chain);
 const earned=weaponTiers.filter(w=>g.chain>=w.need&&!g.weapons.includes(w.id));earned.forEach(w=>g.weapons.push(w.id));
 if(earned.length&&!g.equippedWeapon)g.equippedWeapon=earned.at(-1).id;
 return earned;
}
function currentWeapon(g){return weaponTiers.find(w=>w.id===g.equippedWeapon&&Array.isArray(g.weapons)&&g.weapons.includes(w.id))||null;}
let weaponArtSequence=0;
function weaponArt(role,tier){
 const uid='weapon-detail-'+(++weaponArtSequence),color=tier.color,ornate=tier.need>=10;
 const defs='<defs><linearGradient id="'+uid+'-metal"><stop stop-color="#526674"/><stop offset=".25" stop-color="#d9e9f0"/><stop offset=".48" stop-color="#fff"/><stop offset=".55" stop-color="#afc5d4"/><stop offset="1" stop-color="#486171"/></linearGradient><linearGradient id="'+uid+'-gem" x2=".8" y2="1"><stop stop-color="#e4faff"/><stop offset=".32" stop-color="'+color+'"/><stop offset="1" stop-color="#263e67"/></linearGradient><linearGradient id="'+uid+'-leather"><stop stop-color="#2f3541"/><stop offset=".5" stop-color="#667183"/><stop offset="1" stop-color="#222936"/></linearGradient></defs>';
 const metal='url(#'+uid+'-metal)',gem='url(#'+uid+'-gem)',leather='url(#'+uid+'-leather)';
 let body;
 if(role==='paladin')body='<path d="M40 5 49 24 46 112H34L31 24Z" fill="'+metal+'" stroke="#526b80" stroke-width=".8"/><path d="M40 8v103" stroke="#f5fbff" stroke-width="1.2"/><path d="m35 30 5-6 5 6-5 14Z" fill="'+gem+'"/><path d="M13 109q12-9 22-4h10q10-5 22 4l-3 8q-15-8-24-4-9-4-24 4Z" fill="'+metal+'" stroke="#516878"/><path d="M36 115h8v32h-8Z" fill="'+leather+'"/><path d="M36 121h8m-8 6h8m-8 6h8m-8 6h8" stroke="#b6c5d7" stroke-width="1.3"/><path d="m40 144 8 8-8 9-8-9Z" fill="'+metal+'"/><path d="m40 147 4 5-4 5-4-5Z" fill="'+gem+'"/>';
 else if(role==='ranger')body='<path d="M35 7Q73 39 54 73L48 83l6 10q19 34-19 62l5-16q26-27 9-48l-8-8 8-8q17-21-9-48Z" fill="'+metal+'" stroke="#526b80"/><path d="M35 7 40 83 35 155" fill="none" stroke="#b6cddd" stroke-width=".9"/><path d="M44 72h8v23h-8Z" fill="'+leather+'"/><path d="m49 43 6-9 4 8-6 9Z" fill="'+gem+'"/><path d="m49 121 6 9 4-8-6-9Z" fill="'+gem+'"/><path d="M11 83h54m-8-5 10 5-10 5M14 78l9 5-9 5" fill="none" stroke="#a1b4c2" stroke-width="1.4"/>';
 else body='<path d="M37 49h6v105h-6Z" fill="'+leather+'"/><path d="M39 49h2v100h-2Z" fill="'+metal+'"/><path d="M27 43q-7-17 1-29l6 11-5 15 11 8 11-8-5-15 6-11q8 12 1 29l-13 12Z" fill="'+metal+'" stroke="#546d83"/><path d="m40 3 12 20-12 22-12-22Z" fill="'+gem+'" stroke="#b7d0e8"/><path d="m40 6 2 16-2 18-7-17Z" fill="#e5f8ff" opacity=".52"/><path d="M34 64h12v5H34Zm1 66h10v5H35Z" fill="'+metal+'"/><path d="m40 149 6 7-6 8-6-8Z" fill="'+gem+'"/>';
 const tech='<path d="M40 14v30M38 75v28M37 133v10" stroke="'+color+'" stroke-width="3"/><circle cx="40" cy="48" r="4" fill="'+color+'"/><path d="M25 20h5m20 0h5" stroke="'+color+'" stroke-width="2"/>';
 const decoration=ornate?'<path d="M23 36 14 26l4 21 11 9m28-20 9-10-4 21-11 9" fill="none" stroke="'+color+'" stroke-width="2"/><path d="m15 7 1 5 5 1-5 1-1 5-1-5-5-1 5-1Z" fill="'+color+'" opacity=".6"/>':'';
 return '<svg viewBox="0 0 80 168" role="img" aria-label="'+escapeQuiz(tier.names[role])+'">'+defs+'<ellipse cx="40" cy="80" rx="27" ry="66" fill="'+color+'" opacity=".055"/>'+body+tech+decoration+'</svg>';
}
function renderArena(){
 const s=quizState(),g=gameState(s),role=avatarAppearance().profession.base,weapon=currentWeapon(g),owned=g.weapons||[];
 const put=(id,v)=>{const e=document.querySelector('#'+id);if(e)e.textContent=v;};
 put('arena-chain',(g.chain||0)+' 連擊');put('arena-best','最高 '+(g.bestChain||0)+' 連擊');put('arena-owned',owned.filter(id=>weaponTiers.some(w=>w.id===id)).length+' / 4');
 const next=weaponTiers.find(w=>!owned.includes(w.id));put('arena-next',next?'再 '+Math.max(0,next.need-(g.chain||0))+' 題，解鎖「'+next.names[role]+'」':'全套武器已收藏');
 const meter=document.querySelector('#arena-chain-meter');if(meter)meter.style.width=(next?Math.min(100,(g.chain||0)/next.need*100):100)+'%';
 const equip=document.querySelector('#hero-weapon');if(equip){equip.innerHTML=weapon?weaponArt(role,weapon):gameIcon('shield');equip.setAttribute('aria-label',weapon?'已裝備 '+weapon.names[role]:'尚未裝備武器');equip.classList.toggle('armed',Boolean(weapon));}
 put('ranking-local-score',(g.xp||0)+' XP · 最高 '+(g.bestChain||0)+' 連擊');
 put('arena-equipped',weapon?weapon.names[role]:'尚未裝備 · 3 連擊獲得首件武器');
 const cards=document.querySelector('#weapon-cards');if(cards){cards.innerHTML=weaponTiers.map(w=>{const unlocked=owned.includes(w.id);return '<article class="weapon-card '+(unlocked?'unlocked':'locked')+'" style="--rarity:'+w.color+'"><span class="weapon-rarity">'+w.rarity+'</span>'+weaponArt(role,w)+'<h4>'+w.names[role]+'</h4><p>連續答對 '+w.need+' 題解鎖</p><button data-equip="'+w.id+'" '+(!unlocked?'disabled':'')+'>'+(weapon?.id===w.id?'已裝備':unlocked?'裝備':'尚未解鎖')+'</button></article>';}).join('');cards.querySelectorAll('[data-equip]').forEach(b=>b.onclick=()=>{const s=quizState(),g=gameState(s);if(!(g.weapons||[]).includes(b.dataset.equip))return;g.equippedWeapon=b.dataset.equip;s.game=g;saveQuizState(s);renderArena();if(typeof renderAvatarCustomizer==='function')renderAvatarCustomizer();});}
}
let arenaClient=null,arenaBusy=false,competitionAttempt=null,competitionLocked=false;
function rankingConfigured(){const c=window.CLOUD_RANKING_CONFIG;return Boolean(c&&/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(c.url)&&/^sb_publishable_[A-Za-z0-9_-]+$/.test(c.publishableKey));}
function rankingMessage(text){const el=document.querySelector('#ranking-status');if(el)el.textContent=text;}
async function rankingClient(){
 if(!rankingConfigured())throw Error('排行榜服務尚未連接');
 if(!arenaClient){const {createClient}=await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.57.4/+esm');const c=window.CLOUD_RANKING_CONFIG;arenaClient=createClient(c.url,c.publishableKey);}
 return arenaClient;
}
async function competitionCall(action,payload={}){
 const client=await rankingClient();const {data,error}=await client.rpc('cloud_competition',{action,payload});
 if(error)throw error;return data;
}
function rankingHeroName(id){return typeof leagueChampions!=='undefined'?leagueChampions.find(c=>c.id===id)?.name||'尚未設定英雄':'尚未設定英雄';}
function renderRankingRows(rows,myId,myRank){
 document.querySelector('#ranking-rows').innerHTML=rows.map(r=>'<tr class="'+(r.id===myId?'ranking-me':'')+'"><td><span class="rank-place">'+Number(r.rank)+'</span></td><td><b>'+escapeQuiz(r.nickname)+'</b>'+(r.id===myId?'<small>你</small>':'')+'</td><td>'+escapeQuiz(rankingHeroName(r.champion_id))+'</td><td>'+Number(r.xp).toLocaleString()+'</td><td>'+Number(r.best_chain)+' 連擊</td></tr>').join('');
 document.querySelector('#ranking-empty').hidden=rows.length>0;document.querySelector('#ranking-table').hidden=!rows.length;
 document.querySelector('#ranking-mine').textContent=myRank?'你的線上排名：第 '+Number(myRank)+' 名':'加入競賽後顯示你的線上名次';
}
async function refreshRanking(){
 if(arenaBusy||!rankingConfigured())return;arenaBusy=true;
 try{const data=await competitionCall('leaderboard');const client=await rankingClient(),session=await client.auth.getSession();renderRankingRows(data.rows||[],session.data.session?.user.id,data.myRank);rankingMessage('線上榜單已更新 · '+new Date().toLocaleTimeString('zh-TW'));}
 catch{rankingMessage('線上競賽服務尚未就緒或連線失敗；本機練習可正常使用。');}
 finally{arenaBusy=false;}
}
function localRankingProfile(){try{return JSON.parse(localStorage.getItem('edan-ranking-profile-v1')||'{}')||{};}catch{return {};}}
let rankingHeroJoined=false,rankingHeroSaved=null,rankingHeroSyncing=false,rankingHeroTimer=null;
function syncRankingHero(){clearTimeout(rankingHeroTimer);if(!rankingHeroJoined||typeof leagueConfig!=='function')return;rankingHeroTimer=setTimeout(flushRankingHero,250);}
async function flushRankingHero(){
 if(!rankingHeroJoined||rankingHeroSyncing)return;
 const champion=leagueConfig().champion;if(champion===rankingHeroSaved)return;rankingHeroSyncing=true;
 try{await competitionCall('appearance',{champion});rankingHeroSaved=champion;rankingMessage('英雄已同步至天梯。');}
 catch{rankingMessage('英雄同步失敗；請按更新榜單重試。');}
 finally{rankingHeroSyncing=false;}
 if(leagueConfig().champion!==champion)syncRankingHero();else if(rankingHeroSaved===champion)await refreshRanking();
}
function competitionMessage(text){document.querySelector('#competition-status').textContent=text;}
function renderCompetitionProfile(p){
 rankingHeroJoined=Boolean(p.joined);
 document.querySelector('#competition-score').textContent=p.xp+' 競賽 XP · 目前 '+p.chain+' 連擊 · 最高 '+p.bestChain+' 連擊';
 document.querySelector('#competition-next').disabled=!p.joined;
 document.querySelector('#ranking-withdraw').hidden=!p.joined;
}
async function publishRanking(){
 const nickname=document.querySelector('#ranking-nickname').value.trim();
 if([...nickname].length<2||[...nickname].length>20){rankingMessage('請輸入 2～20 字的公開暱稱。');return;}
 if(!document.querySelector('#ranking-consent').checked){rankingMessage('勾選同意公開暱稱與競賽成績後，才能加入。');return;}
 if(arenaBusy)return;arenaBusy=true;document.querySelector('#ranking-join').disabled=true;
 try{
  const client=await rankingClient();let session=await client.auth.getSession();if(session.error)throw session.error;
  if(!session.data.session){const login=await client.auth.signInAnonymously();if(login.error)throw login.error;}
  const role=avatarAppearance().profession.base;
  const champion=leagueConfig().champion;
  const profile=await competitionCall('join',{nickname,role,champion});rankingHeroSaved=profile.champion_id;renderCompetitionProfile(profile);syncRankingHero();
  localStorage.setItem('edan-ranking-profile-v1',JSON.stringify({nickname,joined:true}));
  competitionMessage('已加入。每天最多 100 題，每題答對 +20 競賽 XP；採台灣時間換日。');
 }catch{rankingMessage('加入失敗：請確認共用服務與匿名登入設定。');}
 finally{arenaBusy=false;document.querySelector('#ranking-join').disabled=!rankingConfigured();}
 await refreshRanking();
}
async function withdrawRanking(){
 if(arenaBusy)return;arenaBusy=true;
 try{const p=await competitionCall('withdraw');renderCompetitionProfile(p);localStorage.removeItem('edan-ranking-profile-v1');document.querySelector('#ranking-consent').checked=false;competitionAttempt=null;document.querySelector('#competition-question').hidden=true;competitionMessage('已退出公開排名；後端成績保留，重新加入不會重置每日題數。');}
 catch{rankingMessage('退出失敗，請稍後重試。');}
 finally{arenaBusy=false;}await refreshRanking();
}
async function nextCompetition(){
 const button=document.querySelector('#competition-next');if(!document.querySelector('#competition-submit').hidden&&competitionAttempt)return;button.disabled=true;
 try{
  const data=await competitionCall('next');
  if(data.done){competitionMessage(data.message+'，明天再來挑戰！');document.querySelector('#competition-question').hidden=true;return;}
  competitionAttempt=data;competitionLocked=false;renderCompetitionQuestion(data.question);
  competitionMessage('本題限時 10 分鐘；逾時視為答錯。重新整理後可接續尚未完成的題目。');
 }catch{competitionMessage('無法取得競賽題目。請先加入並確認網路，再重試。');}
 finally{button.disabled=false;}
}
function renderCompetitionQuestion(q){
 const panel=document.querySelector('#competition-question'),options=document.querySelector('#competition-options');panel.hidden=false;
 document.querySelector('#competition-title').textContent=q.question;
 document.querySelector('#competition-result').textContent='';
 const type=q.type||'single';
 if(type==='single'||type==='multi')options.innerHTML=q.options.map((o,i)=>'<label class="quiz-check"><input type="'+(type==='single'?'radio':'checkbox')+'" name="competition-answer" value="'+i+'"><span>'+String.fromCharCode(65+i)+'. '+escapeQuiz(o)+'</span></label>').join('');
 else if(type==='combo')options.innerHTML=q.fields.map((f,i)=>'<label class="quiz-field">'+escapeQuiz(f.label)+'<select data-field="'+i+'"><option value="">請選擇</option>'+f.options.map((o,j)=>'<option value="'+j+'">'+escapeQuiz(o)+'</option>').join('')+'</select></label>').join('');
 else if(type==='match'||type==='order')renderDragQuestion(q,options,()=>competitionLocked);
 document.querySelector('#competition-submit').hidden=false;document.querySelector('#competition-submit').disabled=false;
 document.querySelector('#competition-next').hidden=true;
}
function competitionAnswer(q){
 const root=document.querySelector('#competition-options'),type=q.type||'single';
 if(type==='single'||type==='multi'){const values=[...root.querySelectorAll('input:checked')].map(x=>Number(x.value));return values.length?(type==='single'?values[0]:values):undefined;}
 const fields=[...root.querySelectorAll(type==='combo'?'select':'[data-drop-slot]')];
 const values=fields.map(x=>type==='combo'?x.value:x.dataset.answer);
 return values.some(v=>v==='')?undefined:values.map(Number);
}
function competitionCorrectText(q,answer){
 const type=q.type||'single';if(type==='single')return q.options[answer];
 if(type==='multi')return answer.map(i=>q.options[i]).join('；');
 if(type==='combo')return q.fields.map((f,i)=>f.label+' → '+f.options[answer[i]]).join('\n');
 if(type==='match')return q.labels.map((label,i)=>label+' → '+q.items[answer[i]]).join('\n');
 return answer.map((v,i)=>(i+1)+'. '+q.items[v]).join('\n');
}
async function submitCompetition(){
 if(!competitionAttempt||competitionLocked)return;
 const q=competitionAttempt.question,answer=competitionAnswer(q);
 if(answer===undefined){competitionMessage('請先完成所有選擇或配對。');return;}
 competitionLocked=true;const submit=document.querySelector('#competition-submit');submit.disabled=true;
 try{
  const data=await competitionCall('submit',{token:competitionAttempt.token,answer});
  document.querySelector('#competition-result').textContent=(data.correct?'答對 +20 競賽 XP':'答錯或逾時 · +0 競賽 XP')+'\n正確答案：'+competitionCorrectText(q,data.answer)+'\n'+data.explanation;
  document.querySelectorAll('#competition-options input,#competition-options select,#competition-options button').forEach(x=>x.disabled=true);
  submit.hidden=true;document.querySelector('#competition-next').hidden=false;
  renderCompetitionProfile({joined:true,...data});competitionMessage('後端已確認成績，重送同一答案不會重複加分。');
  await refreshRanking();
 }catch{competitionLocked=false;submit.disabled=false;competitionMessage('提交未確認。請重試，重送不會重複加分。');}
}
async function resumeCompetitionProfile(){
 try{const p=await competitionCall('profile');rankingHeroSaved=p.champion_id;renderCompetitionProfile(p);document.querySelector('#ranking-nickname').value=p.nickname;document.querySelector('#ranking-consent').checked=p.joined;syncRankingHero();}
 catch{/* No registered profile yet; joining is explicit. */}
}
function initArena(){
 const hero=document.querySelector('.character-emblem');hero.insertAdjacentHTML('beforeend','<span id="hero-weapon" class="hero-weapon"></span>');
 document.querySelector('#open-role-collection').insertAdjacentHTML('afterend','<small id="arena-equipped" class="arena-equipped"></small>');
 const root=document.createElement('section');root.id='arena';root.className='arena-grid';root.innerHTML=`
 <article class="dash-panel armory-panel"><div class="panel-head"><h3>連擊武器庫</h3><small id="arena-owned">0 / 4</small></div><p class="panel-sub">讓每一次正確判斷，鍛造成你的冒險裝備。</p><div class="chain-summary"><strong id="arena-chain">0 連擊</strong><span id="arena-best">最高 0 連擊</span></div><div class="chain-meter"><i id="arena-chain-meter"></i></div><p id="arena-next" class="arena-next"></p><div id="weapon-cards" class="weapon-cards"></div><p class="arena-rule">客觀題答錯重置連擊；所有遊戲題型自動判分。同題同日只累加一次，連擊可跨日延續。已獲得的武器永久保留在此瀏覽器，換職業會改變武器外觀。</p></article>
 <article class="dash-panel ranking-panel"><div class="panel-head"><h3>天梯 · 個人排名</h3><span class="ranking-badge" id="ranking-badge">尚未連線</span></div><p class="panel-sub">以後端認定的競賽 XP 排序，同分比較最高連擊。顯示前 50 名。英雄切換會自動同步；舊玩家回到網站後才會補上英雄資料。</p><div class="ranking-local"><span>本機練習成績（不計入排名）</span><b id="ranking-local-score"></b></div><p id="ranking-status" role="status">競賽後端尚未連接，目前只提供本機練習。</p><div class="ranking-form"><label>公開暱稱<input id="ranking-nickname" minlength="2" maxlength="20" placeholder="例如：峽谷學習者" autocomplete="nickname"></label><label class="ranking-consent"><input type="checkbox" id="ranking-consent"><span>同意公開暱稱、英雄、競賽 XP 與最高連擊</span></label><div class="ranking-buttons"><button class="primary-action" id="ranking-join">加入／更新英雄與暱稱</button><button class="quiet-action" id="ranking-refresh">更新榜單</button><button class="quiet-action" id="ranking-withdraw" hidden>退出排名</button></div></div><div class="competition-play"><h4>每日公平挑戰</h4><p id="competition-score">尚未加入線上競賽</p><p id="competition-status" role="status" aria-live="polite">每人每天最多 100 題，答案由後端判分。</p><button id="competition-next" class="primary-action" disabled>開始／接續競賽</button><div id="competition-question" hidden><h4 id="competition-title"></h4><div id="competition-options"></div><button id="competition-submit" class="primary-action">提交競賽答案</button><p id="competition-result" style="white-space:pre-wrap" role="status"></p></div></div><div class="ranking-scroll"><table id="ranking-table" hidden><thead><tr><th>名次</th><th>冒險者</th><th>英雄</th><th>XP</th><th>最高連擊</th></tr></thead><tbody id="ranking-rows"></tbody></table></div><p id="ranking-empty" class="ranking-empty">尚無可顯示的線上排名</p><p id="ranking-mine" class="arena-rule"></p><p class="arena-rule">競賽成績由後端判分與累加，本機 XP 不會上傳。匿名身分保存在此瀏覽器，換裝置或清除資料會視為新玩家；此機制防止直接改分與重送刷分，尚不防止多帳號、查答案或自動答題。</p></article>`;
 document.querySelector('.path-panel').insertAdjacentElement('beforebegin',root);
 const ready=rankingConfigured(),profile=localRankingProfile();document.querySelector('#ranking-nickname').value=profile.nickname||'';document.querySelector('#ranking-consent').checked=Boolean(profile.joined);document.querySelector('#ranking-withdraw').hidden=!profile.joined||!ready;
 ['ranking-nickname','ranking-consent','ranking-join','ranking-refresh'].forEach(id=>document.querySelector('#'+id).disabled=!ready);
 document.querySelector('#ranking-join').onclick=publishRanking;document.querySelector('#ranking-refresh').onclick=async()=>{await flushRankingHero();await refreshRanking();};document.querySelector('#ranking-withdraw').onclick=withdrawRanking;
 document.querySelector('#competition-next').onclick=nextCompetition;document.querySelector('#competition-submit').onclick=submitCompetition;
 if(ready){document.querySelector('#ranking-badge').textContent='後端競賽';refreshRanking();resumeCompetitionProfile();setInterval(()=>{if(!document.hidden)refreshRanking();},30000);}
 renderArena();
}
initArena();
