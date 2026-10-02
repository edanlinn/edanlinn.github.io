
/* Team scores are computed exclusively from validated server attempts. */
let teamBusy=false,teamState=null;
function teamStatus(message){document.querySelector('#team-status').textContent=message;}
async function teamCall(action,payload={}){const client=await rankingClient();const {data,error}=await client.rpc('cloud_teams',{action,payload});if(error)throw error;return data;}
function renderTeams(data){
 teamState=data;const profile=data.profile||{},joined=Boolean(profile.joined),guild=profile.guild;
 document.querySelector('#team-my-membership').textContent=(profile.factionId?(data.factions.find(f=>f.id===profile.factionId)?.name||'已加入陣營'):'尚未選擇陣營')+' · '+(guild?guild.name:'尚未加入公會');
 document.querySelector('#team-my-contribution').textContent='目前陣營貢獻 '+Number(profile.factionContribution||0).toLocaleString()+' 分 · 目前公會貢獻 '+Number(profile.guildContribution||0).toLocaleString()+' 分';
 const factionCooldown=profile.factionChangeAt&&new Date(profile.factionChangeAt)>new Date();
 document.querySelector('#faction-list').innerHTML=(data.factions||[]).map(f=>'<article class="faction-card '+(profile.factionId===f.id?'selected':'')+'"><span>第 '+Number(f.rank)+' 名</span><h4>'+escapeQuiz(f.name)+'</h4><p>'+escapeQuiz(f.description)+'</p><strong>'+Number(f.points).toLocaleString()+' <small>陣營分</small></strong><p>'+Number(f.members)+' 位成員</p><button class="quiet-action" data-join-faction="'+escapeQuiz(f.id)+'" '+(!joined||factionCooldown||profile.factionId===f.id?'disabled':'')+'>'+(profile.factionId===f.id?'目前陣營':factionCooldown?'等待更換期限':'加入陣營')+'</button></article>').join('');
 const guildCooldown=profile.guildChangeAt&&new Date(profile.guildChangeAt)>new Date();
 document.querySelector('#guild-rows').innerHTML=(data.guilds||[]).map(g=>'<tr><td>'+Number(g.rank)+'</td><td><b>'+escapeQuiz(g.name)+'</b></td><td>'+Number(g.members)+' / 50</td><td>'+Number(g.points).toLocaleString()+'</td><td><button class="quiet-action" data-join-guild="'+escapeQuiz(g.id)+'" '+(!joined||guild||guildCooldown||g.members>=50?'disabled':'')+'>'+(guild?.id===g.id?'已加入':'加入')+'</button></td></tr>').join('');
 document.querySelector('#guild-empty').hidden=Boolean(data.guilds?.length);
 document.querySelector('#guild-create').disabled=!joined||Boolean(guild)||Boolean(guildCooldown);
 document.querySelector('#guild-leave').hidden=!guild;
 const timing=[];
 if(factionCooldown)timing.push('陣營可更換時間：'+new Date(profile.factionChangeAt).toLocaleString('zh-TW'));
 if(!guild&&guildCooldown)timing.push('公會可加入時間：'+new Date(profile.guildChangeAt).toLocaleString('zh-TW'));
 document.querySelector('#team-cooldown').textContent=timing.join('。');
 document.querySelectorAll('[data-join-faction]').forEach(b=>b.onclick=()=>changeTeam('join_faction',{factionId:b.dataset.joinFaction}));
 document.querySelectorAll('[data-join-guild]').forEach(b=>b.onclick=()=>changeTeam('join_guild',{guildId:b.dataset.joinGuild}));
}
async function refreshTeams(){
 if(teamBusy||!rankingConfigured())return;teamBusy=true;
 try{const search=document.querySelector('#guild-search').value.trim();const data=await teamCall('leaderboard',{search});renderTeams(data);teamStatus(data.profile?.joined?'團體天梯已更新；貢獻由後端計分。':'先在個人天梯加入線上競賽，即可選擇陣營、建立或加入公會。');}
 catch{teamStatus('團體天梯連線失敗，請稍後重試。');}
 finally{teamBusy=false;}
}
async function changeTeam(action,payload){
 if(teamBusy)return;teamBusy=true;
 try{renderTeams(await teamCall(action,payload));teamStatus('團體設定已更新，新的競賽題目會記錄你的貢獻。');}
 catch(error){teamStatus(error.message||'設定失敗，請稍後重試。');}
 finally{teamBusy=false;}
}
function showLadder(view='personal',scroll=true){
 const ladder=document.querySelector('#ladder');ladder.querySelectorAll('[data-ladder-view]').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.ladderView===view)));
 ladder.querySelectorAll('[data-ladder-panel]').forEach(p=>p.hidden=p.dataset.ladderPanel!==view);
 if(scroll){document.querySelectorAll('.side-link').forEach(b=>b.classList.toggle('active',b.dataset.section==='ladder'));ladder.scrollIntoView({behavior:'smooth',block:'start'});history.replaceState(null,'','#ladder');}
 if(view==='personal')refreshRanking();else refreshTeams();
}
function initLadder(){
 const ranking=document.querySelector('.ranking-panel'),arena=document.querySelector('#arena');
 const ladder=document.createElement('section');ladder.id='ladder';ladder.className='ladder-section';
 ladder.innerHTML='<div class="section-kicker">COMPETITIVE LADDER</div><h2>天梯</h2><p class="panel-sub">個人成就、陣營榮耀與公會貢獻，各自累積、各自排名。</p><div class="ladder-tabs" role="tablist" aria-label="天梯榜單"><button type="button" id="tab-personal" role="tab" aria-controls="ladder-personal" aria-selected="true" data-ladder-view="personal">個人天梯</button><button type="button" id="tab-factions" role="tab" aria-controls="ladder-factions" aria-selected="false" data-ladder-view="factions">陣營天梯</button><button type="button" id="tab-guilds" role="tab" aria-controls="ladder-guilds" aria-selected="false" data-ladder-view="guilds">公會天梯</button></div><div id="ladder-personal" role="tabpanel" aria-labelledby="tab-personal" data-ladder-panel="personal"></div><div class="dash-panel team-summary"><b id="team-my-membership">尚未選擇陣營 · 尚未加入公會</b><p id="team-my-contribution">目前陣營貢獻 0 分 · 目前公會貢獻 0 分</p><p id="team-status" role="status" aria-live="polite">先加入個人天梯，再選擇陣營或公會。</p><p id="team-cooldown" class="arena-rule"></p><p class="arena-rule">競賽答對：個人 +20 XP、領取題目時所屬陣營 +20 分、公會 +20 分。三本積分帳獨立計算，舊分數保留於原團體；入團前的成績不回補。每人每天仍最多 100 題，更換陣營間隔 7 天，加入或建立公會間隔 24 小時。</p></div><div id="ladder-factions" class="dash-panel" role="tabpanel" aria-labelledby="tab-factions" data-ladder-panel="factions" hidden><h3>選擇你的陣營</h3><div id="faction-list" class="faction-list"></div></div><div id="ladder-guilds" class="dash-panel" role="tabpanel" aria-labelledby="tab-guilds" data-ladder-panel="guilds" hidden><div class="panel-head"><h3>公會競賽</h3><button id="guild-refresh" class="quiet-action">更新</button></div><div class="guild-controls"><label>搜尋公會<input id="guild-search" maxlength="40" placeholder="輸入公會名稱"></label><button id="guild-search-button" class="quiet-action">搜尋</button></div><div class="guild-controls"><label>建立公會<input id="guild-name" minlength="2" maxlength="20" placeholder="2～20 字的公開名稱"></label><button id="guild-create" class="primary-action" disabled>建立並加入</button><button id="guild-leave" class="quiet-action" hidden>離開目前公會</button></div><p class="arena-rule">公會公開招募，最多 50 人。離開後，已累積的貢獻會保留在原公會。</p><div class="ranking-scroll"><table class="guild-table"><thead><tr><th>名次</th><th>公會</th><th>成員</th><th>公會分</th><th>操作</th></tr></thead><tbody id="guild-rows"></tbody></table></div><p id="guild-empty">尚無公會，你可以建立第一個公會。</p></div>';
 arena.insertAdjacentElement('afterend',ladder);ladder.querySelector('#ladder-personal').appendChild(ranking);
 ranking.querySelector('h3').textContent='個人天梯';arena.classList.add('armory-only');
 const nav=document.querySelector('[data-section="ladder"]');nav.onclick=()=>showLadder('personal');
 nav.querySelector('[data-icon]').innerHTML=gameIcon('trophy');
 ladder.querySelectorAll('[data-ladder-view]').forEach(b=>b.onclick=()=>showLadder(b.dataset.ladderView,false));
 const tabs=[...ladder.querySelectorAll('[role="tab"]')];tabs.forEach((b,i)=>b.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const n=e.key==='Home'?0:e.key==='End'?tabs.length-1:(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;tabs[n].focus();showLadder(tabs[n].dataset.ladderView,false);}));
 document.querySelector('#guild-refresh').onclick=refreshTeams;document.querySelector('#guild-search-button').onclick=refreshTeams;
 document.querySelector('#guild-search').onkeydown=e=>{if(e.key==='Enter')refreshTeams();};
 document.querySelector('#guild-create').onclick=()=>{const name=document.querySelector('#guild-name').value.trim();if([...name].length<2||[...name].length>20){teamStatus('公會名稱需 2～20 字。');return;}changeTeam('create_guild',{name});};
 document.querySelector('#guild-leave').onclick=()=>changeTeam('leave_guild',{});
 const oldPublish=publishRanking;publishRanking=async function(){await oldPublish();await refreshTeams();};
 const oldWithdraw=withdrawRanking;withdrawRanking=async function(){await oldWithdraw();await refreshTeams();};
 const oldSubmit=submitCompetition;submitCompetition=async function(){await oldSubmit();await refreshTeams();};
 document.querySelector('#ranking-join').onclick=publishRanking;document.querySelector('#ranking-withdraw').onclick=withdrawRanking;document.querySelector('#competition-submit').onclick=submitCompetition;
 if(rankingConfigured()){refreshTeams();setInterval(()=>{if(!document.hidden)refreshTeams();},30000);}
 if(location.hash==='#ladder')setTimeout(()=>showLadder('personal'),0);
}
initLadder();
