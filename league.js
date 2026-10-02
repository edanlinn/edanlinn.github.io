
/* League learning mode: cosmetic progression and study actions, never score mutation. */
const leagueVersion='16.19.1',leagueCDN='https://ddragon.leagueoflegends.com';
const leagueChampions=[
{id:'Lux',name:'拉克絲',title:'光之少女',world:'forest',color:'#c6a3ff',skills:['光明束縛','稜光障壁','光明異點','終極閃光'],skinNames:['經典拉克絲','魔法少女 拉克絲','法術盜賊 拉克絲','魔鬼司令 拉克絲']},
{id:'Garen',name:'蓋倫',title:'蒂瑪西亞之力',world:'dawn',color:'#e6c983',skills:['致命打擊','勇氣','審判','蒂瑪西亞制裁'],skinNames:['經典蓋倫','血色精銳 蓋倫','沙漠風暴 蓋倫','特種部隊 蓋倫']},
{id:'Ashe',name:'艾希',title:'冰霜射手',world:'dusk',color:'#8cdef5',skills:['射手專注','萬箭齊發','鷹擊長空','魔法水晶箭'],skinNames:['經典艾希','極地獵人 艾希','紫晶艾希','冰原狙擊 艾希']}
];
const leagueMeta={},leagueUnlocks=[1,3,5,10],leagueSkillLevels=[1,3,5,10];
const leagueActions=['查看知識庫','複習到期題','定位錯題航站','啟動錯題挑戰'];
let leagueCastTimer=null,leagueCoolingUntil=0,leagueLastArt=null,leagueLastLevel=null,leagueMetaFailed=false;
function leagueConfig(){let raw={};try{raw=JSON.parse(localStorage.getItem('edan-league-v1')||'{}')||{};}catch{}return {enabled:raw.enabled!==false,champion:leagueChampions.some(c=>c.id===raw.champion)?raw.champion:'Lux',skin:Number.isInteger(raw.skin)?raw.skin:0,auto:raw.auto!==false};}
function leagueSave(patch){const next={...leagueConfig(),...patch};try{localStorage.setItem('edan-league-v1',JSON.stringify(next));}catch{document.querySelector('#league-status').textContent='無法儲存設定。';return;}renderFantasyGame();}
function leagueLevel(){return gameLevel(gameState(quizState()).xp||0).level;}
function leagueSkins(champion){
 const metadata=leagueMeta[champion.id];
 if(metadata?.skins)return metadata.skins.map((skin,i)=>({num:skin.num,name:skin.name==='default'?champion.skinNames[0]:skin.name,need:i===0?1:i===1?3:i===2?5:10}));
 return champion.skinNames.map((name,i)=>({num:i,name:i===0?name:champion.name+' · 造型 '+i,need:leagueUnlocks[i]}));
}
function leagueSelected(){
 const config=leagueConfig(),champion=leagueChampions.find(c=>c.id===config.champion),skins=leagueSkins(champion),level=leagueLevel();
 const unlocked=skins.filter(s=>level>=s.need);
 // Auto transformation uses the first four canonical skins, avoiding jumps to arbitrary future additions.
 const automatic=skins.slice(0,4).filter(s=>level>=s.need).at(-1)||skins[0];
 const skin=config.auto?automatic:unlocked.find(s=>s.num===config.skin)||skins[0];
 return {config,champion,skins,skin,level};
}
function leagueArt(champion,skin,kind='loading'){return leagueCDN+'/cdn/img/champion/'+kind+'/'+champion.id+'_'+skin.num+'.jpg';}
function leagueImage(champion,skin,extra=''){return '<img class="league-portrait '+extra+'" src="'+leagueArt(champion,skin)+'" alt="'+escapeQuiz(champion.name+' · '+skin.name)+'" loading="lazy" referrerpolicy="no-referrer" data-league-fallback="'+champion.id+'">';}
function leagueImageFallbacks(){document.querySelectorAll('[data-league-fallback]').forEach(img=>img.onerror=()=>{img.onerror=null;img.src=leagueCDN+'/cdn/img/champion/loading/'+img.dataset.leagueFallback+'_0.jpg';const status=document.querySelector('#league-status');if(status)status.textContent='部分造型圖片暫時無法載入，已顯示經典造型。';});}
function renderLeague(){
 const {config,champion,skins,skin,level}=leagueSelected();
 document.documentElement.dataset.league=String(config.enabled);
 const bar=document.querySelector('#league-skill-bar');if(bar)bar.hidden=!config.enabled;
 if(!config.enabled){const t=document.querySelector('#fantasy-dialog-title');t.textContent='選擇你的冒險職業';t.nextElementSibling.textContent='8 種基礎職業自由選擇，進階稱號隨等級解鎖。';return;}
 document.documentElement.dataset.world=champion.world;
 document.documentElement.style.setProperty('--league-color',champion.color);
 document.documentElement.style.setProperty('--league-splash','url("'+leagueArt(champion,skin,'splash')+'")');
 const hero=document.querySelector('#hero-character');hero.innerHTML=leagueImage(champion,skin);hero.setAttribute('aria-label',champion.name+' · '+skin.name);
 document.querySelector('#hero-weapon').hidden=true;
 document.querySelector('#game-character-title').textContent=champion.name+' · '+champion.title;
 document.querySelector('#game-character-role').textContent=skin.name+' · '+(config.auto?'等級自動變身':'手動造型');
 const next=skins.slice(0,4).find(s=>s.need>level);document.querySelector('#game-next-title').textContent=next?'LV. '+next.need+' 解鎖造型「'+next.name+'」':'進階造型與終極技能已解鎖';
 document.querySelector('#open-avatar-customizer').textContent='LOL 英雄與造型 →';
 document.querySelectorAll('.hero-world-label').forEach(el=>el.textContent='LEAGUE LEARNING · '+champion.name);
 document.querySelector('#arena-equipped').textContent='技能於 LV. 1 / 3 / 5 / 10 解鎖';
 const gallery=document.querySelector('#role-collection');gallery.innerHTML=leagueChampions.map(c=>'<button class="role-card" type="button" data-league-champion="'+c.id+'" aria-pressed="'+(champion.id===c.id)+'">'+leagueImage(c,leagueSkins(c)[0])+'<b>'+c.name+'</b><small>'+c.title+'</small><em>'+(champion.id===c.id?'目前英雄':'選擇英雄')+'</em></button>').join('');
 gallery.querySelectorAll('[data-league-champion]').forEach(b=>b.onclick=()=>leagueSave({champion:b.dataset.leagueChampion,skin:0}));
 const fantasyTitle=document.querySelector('#fantasy-dialog-title');fantasyTitle.textContent='選擇你的 LOL 英雄';fantasyTitle.nextElementSibling.textContent='英雄自由選擇，造型與技能隨本機學習等級解鎖。';
 const titleCollection=document.querySelector('#title-collection');titleCollection.innerHTML=leagueSkillLevels.map((n,i)=>'<div class="title-row '+(level>=n?'earned':'')+'"><div><b>'+['Q','W','E','R'][i]+' · '+champion.skills[i]+'</b><small>LV. '+n+' · '+leagueActions[i]+'</small></div><em>'+(level>=n?'已解鎖':'待解鎖')+'</em></div>').join('');
 const preview=document.querySelector('#league-preview');preview.innerHTML=leagueImage(champion,skin);document.querySelector('#league-preview-name').textContent=champion.name+' · '+skin.name;
 document.querySelector('#league-champion').value=champion.id;document.querySelector('#league-auto').checked=config.auto;
 document.querySelector('#league-skins').innerHTML=skins.map(s=>'<button type="button" class="league-skin '+(s.num===skin.num?'selected':'')+'" data-league-skin="'+s.num+'" '+(level<s.need?'disabled':'')+' aria-pressed="'+(s.num===skin.num)+'">'+leagueImage(champion,s)+'<b>'+escapeQuiz(s.name)+'</b><small>'+(level>=s.need?'已解鎖':'LV. '+s.need+' 解鎖')+'</small></button>').join('');
 document.querySelectorAll('[data-league-skin]').forEach(b=>b.onclick=()=>leagueSave({skin:Number(b.dataset.leagueSkin),auto:false}));
 bar.innerHTML=leagueSkillLevels.map((need,i)=>'<button type="button" class="league-skill" data-league-skill="'+i+'" '+(level<need||Date.now()<leagueCoolingUntil?'disabled':'')+' aria-label="'+['Q','W','E','R'][i]+' '+champion.skills[i]+'，'+(level<need?'LV. '+need+' 解鎖':leagueActions[i])+'"><kbd>'+['Q','W','E','R'][i]+'</kbd><b>'+champion.skills[i]+'</b><small>'+(level<need?'LV. '+need+' 解鎖':Date.now()<leagueCoolingUntil?'冷卻中':leagueActions[i])+'</small></button>').join('');
 bar.querySelectorAll('[data-league-skill]').forEach(b=>b.onclick=()=>castLeagueSkill(Number(b.dataset.leagueSkill)));
 const key=champion.id+'_'+skin.num;
 if(leagueLastLevel!==null&&level>leagueLastLevel&&key!==leagueLastArt){const card=document.querySelector('.rank-card');card.classList.add('league-transform');setTimeout(()=>card.classList.remove('league-transform'),1200);document.querySelector('#league-cast-status').textContent='升級變身！已切換至 '+skin.name;}
 leagueLastArt=key;leagueLastLevel=level;
 leagueImageFallbacks();
}
function castLeagueSkill(index){
 if(!Number.isInteger(index)||index<0||index>3)return;
 const {config,champion,level}=leagueSelected();if(!config.enabled||level<leagueSkillLevels[index]||Date.now()<leagueCoolingUntil)return;
 leagueCoolingUntil=Date.now()+8000;
 const stage=document.querySelector('#league-effect');stage.className='league-effect champion-'+champion.id.toLowerCase()+' effect-'+index;stage.innerHTML='<i></i><i></i><i></i><span>'+escapeQuiz(champion.skills[index])+'</span>';
 document.querySelector('#league-cast-status').textContent='施放 '+champion.skills[index]+' · '+leagueActions[index]+' · 冷卻 8 秒';
 renderLeague();clearTimeout(leagueCastTimer);leagueCastTimer=setTimeout(()=>{stage.className='league-effect';stage.innerHTML='';},1400);
 setTimeout(()=>{if(Date.now()>=leagueCoolingUntil)renderLeague();},8100);
 setTimeout(()=>{
 if(index===0)openOnlyModule('glossary',true);
 if(index===1)startGamePractice('all','due');
 if(index===2){openOnlyModule('skill-map',true);const state=quizState(),scores=worldNodes.map((n,i)=>({i,count:quizBank.filter(q=>q.category===n.category&&state.missed?.[q.id]).length})).sort((a,b)=>b.count-a.count);if(scores[0]?.count)openWorldNode(scores[0].i);}
 if(index===3)startGamePractice('all','missed');
 },900);
}
async function fetchLeagueMeta(){
 await Promise.allSettled(leagueChampions.map(async c=>{
  const root=leagueCDN+'/cdn/'+leagueVersion+'/data/';
  for(const locale of ['zh_TW','en_US']){
   const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),6000);
   try{const response=await fetch(root+locale+'/'+c.id+'.json',{signal:controller.signal});
    if(!response.ok)continue;
    const data=await response.json();if(!Array.isArray(data.data?.[c.id]?.skins)||!data.data[c.id].skins.length)continue;
    leagueMeta[c.id]=data.data[c.id];return;
   }catch{}finally{clearTimeout(timer);}
  }
  throw Error('Metadata unavailable');
 }));
 leagueMetaFailed=leagueChampions.some(c=>!leagueMeta[c.id]);renderFantasyGame();
 document.querySelector('#league-status').textContent=leagueMetaFailed?'部分英雄資料暫時無法連線，使用內建基本造型。':'英雄與造型資料已由 Riot Data Dragon 更新。';
}
function initLeague(){
 const button=document.querySelector('#open-avatar-customizer'),oldOpen=button.onclick;
 document.body.insertAdjacentHTML('beforeend','<dialog id="league-dialog" class="avatar-dialog league-dialog" aria-labelledby="league-dialog-title"><button class="map-close" id="league-close" aria-label="關閉">×</button><span class="section-kicker">LEAGUE LEARNING</span><h2 id="league-dialog-title">英雄、造型與升級變身</h2><p class="avatar-intro">英雄自由選擇；LV. 3、5、10 解鎖進階造型與技能。造型採用官方插畫，角色身形、性別與裝備依英雄原設定呈現。</p><div class="league-workshop"><div><div id="league-preview"></div><h3 id="league-preview-name"></h3><label>英雄<select id="league-champion">'+leagueChampions.map(c=>'<option value="'+c.id+'">'+c.name+'</option>').join('')+'</select></label><label class="league-auto-label"><input id="league-auto" type="checkbox"> 隨等級自動切換造型</label><button id="league-custom-mode" class="quiet-action">切回自訂宇宙角色</button></div><div><h3>造型收藏</h3><div id="league-skins"></div></div></div><p id="league-status" role="status">正在載入英雄與造型資料。</p><p class="avatar-note">非官方粉絲學習專案。角色與造型插畫屬於 Riot Games；技能為學習功能與網頁特效，不是原遊戲戰鬥系統。學習技能不修改個人、陣營、公會競賽分數。</p></dialog>');
 const card=document.querySelector('.rank-card');card.insertAdjacentHTML('beforeend','<div id="league-skill-bar" class="league-skill-bar"></div><p id="league-cast-status" class="league-cast-status" role="status" aria-live="polite"></p><div id="league-effect" class="league-effect" aria-hidden="true"></div>');
 document.querySelector('#league-close').onclick=()=>document.querySelector('#league-dialog').close();
 document.querySelector('#league-champion').onchange=e=>leagueSave({champion:e.target.value,skin:0});
 document.querySelector('#league-auto').onchange=e=>leagueSave({auto:e.target.checked});
 document.querySelector('#league-custom-mode').onclick=()=>{leagueSave({enabled:false});document.querySelector('#league-dialog').close();oldOpen();};
 button.onclick=()=>{leagueSave({enabled:true});document.querySelector('#league-dialog').showModal();};
 const dialog=document.querySelector('#league-dialog');dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
 const oldRender=renderAvatarCustomizer;renderAvatarCustomizer=function(){oldRender();document.querySelector('#hero-weapon').hidden=false;renderLeague();};
 renderFantasyGame();fetchLeagueMeta();
}
initLeague();
