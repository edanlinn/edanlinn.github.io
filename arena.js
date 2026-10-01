/* Rewards are local; global scores require the configured shared service. */
const weaponTiers=[
 {id:'mist',need:3,rarity:'初階',color:'#8eacc3',names:{mage:'晨霧法杖',paladin:'晨霧長劍',ranger:'晨霧長弓'}},
 {id:'frost',need:5,rarity:'稀有',color:'#639ed1',names:{mage:'冰晶法杖',paladin:'冰晶聖劍',ranger:'冰晶長弓'}},
 {id:'sky',need:10,rarity:'史詩',color:'#8576bb',names:{mage:'蒼穹權杖',paladin:'蒼穹聖劍',ranger:'蒼穹戰弓'}},
 {id:'star',need:20,rarity:'傳說',color:'#b39255',names:{mage:'星辰之杖',paladin:'星辰裁決',ranger:'星辰神弓'}}
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
function weaponArt(role,tier){
 const body=role==='paladin'?'<path d="M35 55 33 20 40 7 47 20 45 55Z" fill="url(#metal)"/><path d="M25 56h30l-5 6H30Z"/><path d="M37 63h6v19h-6z"/><circle cx="40" cy="86" r="5"/>':role==='ranger'?'<path d="M36 8C69 22 69 65 36 85L44 67 49 47 44 26Z" fill="url(#metal)"/><path d="M36 8v77M21 48h44m-6-5 6 5-6 5" fill="none" stroke-width="2"/>':'<path d="M37 34h6v53h-6z" fill="url(#metal)"/><path d="m40 5 15 17-15 17-15-17Z" fill="url(#metal)"/><path d="m40 12 8 10-8 10-8-10Z" fill="currentColor"/><path d="M27 34h26l-5 6H32Z"/>';
 const gradient='weapon-metal-'+role+'-'+tier.id;
 return ('<svg viewBox="0 0 80 96" role="img" aria-label="'+escapeQuiz(tier.names[role])+'" style="color:'+tier.color+'"><defs><linearGradient id="metal"><stop stop-color="#f6fcff"/><stop offset=".5" stop-color="#cee4f5"/><stop offset="1" stop-color="#9fbcd5"/></linearGradient></defs><circle cx="40" cy="46" r="31" fill="currentColor" opacity=".08"/><g stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" fill="currentColor">'+body+'</g><path d="m17 15 2 5 5 2-5 2-2 5-2-5-5-2 5-2Z" fill="currentColor" opacity=".6"/></svg>').replaceAll('id="metal"','id="'+gradient+'"').replaceAll('url(#metal)','url(#'+gradient+')');
}
function renderArena(){
 const s=quizState(),g=gameState(s),role=availableRole(gameLevel(g.xp||0).level,g.role).id,weapon=currentWeapon(g),owned=g.weapons||[];
 const put=(id,v)=>{const e=document.querySelector('#'+id);if(e)e.textContent=v;};
 put('arena-chain',(g.chain||0)+' 連擊');put('arena-best','最高 '+(g.bestChain||0)+' 連擊');put('arena-owned',owned.filter(id=>weaponTiers.some(w=>w.id===id)).length+' / 4');
 const next=weaponTiers.find(w=>!owned.includes(w.id));put('arena-next',next?'再 '+Math.max(0,next.need-(g.chain||0))+' 題，解鎖「'+next.names[role]+'」':'全套武器已收藏');
 const meter=document.querySelector('#arena-chain-meter');if(meter)meter.style.width=(next?Math.min(100,(g.chain||0)/next.need*100):100)+'%';
 const equip=document.querySelector('#hero-weapon');if(equip){equip.innerHTML=weapon?weaponArt(role,weapon):gameIcon('shield');equip.setAttribute('aria-label',weapon?'已裝備 '+weapon.names[role]:'尚未裝備武器');equip.classList.toggle('armed',Boolean(weapon));}
 put('ranking-local-score',(g.xp||0)+' XP · 最高 '+(g.bestChain||0)+' 連擊');
 put('arena-equipped',weapon?weapon.names[role]:'尚未裝備 · 3 連擊獲得首件武器');
 const cards=document.querySelector('#weapon-cards');if(cards){cards.innerHTML=weaponTiers.map(w=>{const unlocked=owned.includes(w.id);return '<article class="weapon-card '+(unlocked?'unlocked':'locked')+'" style="--rarity:'+w.color+'"><span class="weapon-rarity">'+w.rarity+'</span>'+weaponArt(role,w)+'<h4>'+w.names[role]+'</h4><p>連續答對 '+w.need+' 題解鎖</p><button data-equip="'+w.id+'" '+(!unlocked?'disabled':'')+'>'+(weapon?.id===w.id?'已裝備':unlocked?'裝備':'尚未解鎖')+'</button></article>';}).join('');cards.querySelectorAll('[data-equip]').forEach(b=>b.onclick=()=>{const s=quizState(),g=gameState(s);if(!(g.weapons||[]).includes(b.dataset.equip))return;g.equippedWeapon=b.dataset.equip;s.game=g;saveQuizState(s);renderArena();});}
}
let arenaClient=null,arenaBusy=false;
function rankingConfigured(){const c=window.CLOUD_RANKING_CONFIG;return Boolean(c&&/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(c.url)&&/^sb_publishable_[A-Za-z0-9_-]+$/.test(c.publishableKey));}
function rankingMessage(text){const el=document.querySelector('#ranking-status');if(el)el.textContent=text;}
async function rankingClient(){
 if(!rankingConfigured())throw Error('尚未連接排行榜資料庫');
 if(!arenaClient){const {createClient}=await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.57.4/+esm');const c=window.CLOUD_RANKING_CONFIG;arenaClient=createClient(c.url,c.publishableKey);}
 return arenaClient;
}
function renderRankingRows(rows,myId){
 const body=document.querySelector('#ranking-rows');body.innerHTML=rows.map((r,i)=>{const role=fantasyRoles.find(x=>x.id===r.role)||fantasyRoles[0];return '<tr class="'+(r.id===myId?'ranking-me':'')+'"><td><span class="rank-place rank-'+(i+1)+'">'+(i+1)+'</span></td><td><b>'+escapeQuiz(r.nickname)+'</b>'+(r.id===myId?'<small>你</small>':'')+'</td><td>'+role.name+'</td><td>'+Number(r.xp).toLocaleString()+'</td><td>'+Number(r.best_chain)+' 連擊</td></tr>';}).join('');
 document.querySelector('#ranking-empty').hidden=rows.length>0;document.querySelector('#ranking-table').hidden=!rows.length;
 document.querySelector('#ranking-mine').textContent=myId?(rows.some(r=>r.id===myId)?'你的排名：第 '+(rows.findIndex(r=>r.id===myId)+1)+' 名':'本裝置未上榜，或排名在前 50 名以外'):'輸入暱稱，選擇加入排名後顯示你的名次';
}
async function refreshRanking(){
 if(arenaBusy)return;arenaBusy=true;rankingMessage('正在讀取線上排名…');
 try{const client=await rankingClient();const {data,error}=await client.from('cloud_rankings').select('id,nickname,xp,best_chain,role').order('xp',{ascending:false}).order('best_chain',{ascending:false}).order('id',{ascending:true}).limit(50);if(error)throw error;const session=await client.auth.getSession();if(session.error)throw session.error;renderRankingRows(data||[],session.data.session?.user.id);rankingMessage('已更新 · '+new Date().toLocaleTimeString('zh-TW')+' · 前 50 名');}
 catch(e){rankingMessage('排名暫時無法讀取，請稍後重試。');}
 finally{arenaBusy=false;}
}
async function publishRanking(){
 const nick=document.querySelector('#ranking-nickname').value.trim();if([...nick].length<2||[...nick].length>20){rankingMessage('請輸入 2～20 字的公開暱稱。');return;}
 if(!document.querySelector('#ranking-consent').checked){rankingMessage('勾選同意公開暱稱與成績後，才能加入排名。');return;}
 if(arenaBusy)return;let published=false;arenaBusy=true;document.querySelector('#ranking-join').disabled=true;rankingMessage('正在同步成績…');
 try{const client=await rankingClient();let {data,error}=await client.auth.getSession();if(error)throw error;let user=data.session?.user;if(!user){const login=await client.auth.signInAnonymously();if(login.error)throw login.error;user=login.data.user;}if(!user)throw Error('No user');
 const s=quizState(),g=gameState(s),role=availableRole(gameLevel(g.xp||0).level,g.role).id;
 const result=await client.from('cloud_rankings').upsert({id:user.id,nickname:nick,xp:Math.min(100000000,Math.max(0,Math.floor(g.xp||0))),best_chain:Math.min(1000000,Math.max(0,Math.floor(g.bestChain||0))),role});if(result.error)throw result.error;
 published=true;localStorage.setItem('edan-ranking-profile-v1',JSON.stringify({nickname:nick,joined:true}));document.querySelector('#ranking-withdraw').hidden=false;rankingMessage('已加入排名。練習後可按「加入／更新排名」同步最新成績。');
 }catch(e){rankingMessage('同步失敗。請確認網路與排行榜服務設定，再重試。');}
 finally{arenaBusy=false;document.querySelector('#ranking-join').disabled=!rankingConfigured();}
 if(published)await refreshRanking();
}
function localRankingProfile(){try{return JSON.parse(localStorage.getItem('edan-ranking-profile-v1')||'{}')||{};}catch{return {};}}
async function withdrawRanking(){
 if(arenaBusy)return;arenaBusy=true;rankingMessage('正在退出排名…');
 try{const client=await rankingClient(),session=await client.auth.getSession();if(session.error)throw session.error;const user=session.data.session?.user;if(user){const result=await client.from('cloud_rankings').delete().eq('id',user.id);if(result.error)throw result.error;}
 localStorage.removeItem('edan-ranking-profile-v1');document.querySelector('#ranking-consent').checked=false;document.querySelector('#ranking-withdraw').hidden=true;rankingMessage('已退出排名，本機練習與武器仍保留。');
 }catch{rankingMessage('退出失敗，請稍後重試。');}
 finally{arenaBusy=false;}
 if(!localRankingProfile().joined)await refreshRanking();
}
function initArena(){
 const hero=document.querySelector('.character-emblem');hero.insertAdjacentHTML('beforeend','<span id="hero-weapon" class="hero-weapon"></span>');
 document.querySelector('#open-role-collection').insertAdjacentHTML('afterend','<small id="arena-equipped" class="arena-equipped"></small>');
 const root=document.createElement('section');root.id='arena';root.className='arena-grid';root.innerHTML=`
 <article class="dash-panel armory-panel"><div class="panel-head"><h3>連擊武器庫</h3><small id="arena-owned">0 / 4</small></div><p class="panel-sub">讓每一次正確判斷，鍛造成你的冒險裝備。</p><div class="chain-summary"><strong id="arena-chain">0 連擊</strong><span id="arena-best">最高 0 連擊</span></div><div class="chain-meter"><i id="arena-chain-meter"></i></div><p id="arena-next" class="arena-next"></p><div id="weapon-cards" class="weapon-cards"></div><p class="arena-rule">客觀題答錯重置連擊；短答自評不計入。同題同日只累加一次，連擊可跨日延續。已獲得的武器永久保留在此瀏覽器，換職業會改變武器外觀。</p></article>
 <article class="dash-panel ranking-panel"><div class="panel-head"><h3>雲端冒險者排名</h3><span class="ranking-badge" id="ranking-badge">尚未連線</span></div><p class="panel-sub">以累積 XP 排序，同分比較最高連擊。顯示前 50 名。</p><div class="ranking-local"><span>你的冒險成績</span><b id="ranking-local-score"></b></div><p id="ranking-status" role="status">共用排行榜資料庫尚未設定，目前不會上傳成績。</p><div class="ranking-form"><label>公開暱稱<input id="ranking-nickname" minlength="2" maxlength="20" placeholder="例如：蒼穹法師" autocomplete="nickname"></label><label class="ranking-consent"><input type="checkbox" id="ranking-consent"><span>同意公開暱稱、職業、XP 與最高連擊</span></label><div class="ranking-buttons"><button class="primary-action" id="ranking-join">加入／更新排名</button><button class="quiet-action" id="ranking-refresh">更新榜單</button><button class="quiet-action" id="ranking-withdraw" hidden>退出排名</button></div></div><div class="ranking-scroll"><table id="ranking-table" hidden><thead><tr><th>名次</th><th>冒險者</th><th>職業</th><th>XP</th><th>最高連擊</th></tr></thead><tbody id="ranking-rows"></tbody></table></div><p id="ranking-empty" class="ranking-empty">尚無可顯示的線上排名</p><p id="ranking-mine" class="arena-rule"></p><p class="arena-rule">成績由本機上傳，屬於學習交流排名，尚無伺服器防作弊驗證。匿名身分保存在此瀏覽器，換裝置或清除資料會視為新玩家。</p></article>`;
 document.querySelector('.path-panel').insertAdjacentElement('beforebegin',root);
 const ready=rankingConfigured(),profile=localRankingProfile();document.querySelector('#ranking-nickname').value=profile.nickname||'';document.querySelector('#ranking-consent').checked=Boolean(profile.joined);document.querySelector('#ranking-withdraw').hidden=!profile.joined||!ready;
 ['ranking-nickname','ranking-consent','ranking-join','ranking-refresh'].forEach(id=>document.querySelector('#'+id).disabled=!ready);
 document.querySelector('#ranking-join').onclick=publishRanking;document.querySelector('#ranking-refresh').onclick=refreshRanking;document.querySelector('#ranking-withdraw').onclick=withdrawRanking;
 if(ready){document.querySelector('#ranking-badge').textContent='線上榜單';refreshRanking();}
 renderArena();
}
initArena();
