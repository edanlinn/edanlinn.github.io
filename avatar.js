/* Cosmetic appearance is device-local and never participates in competition scoring. */
const avatarRaces=[{id:'human',name:'人類',note:'沉穩、細緻的冒險者',row:0},{id:'elf',name:'精靈',note:'尖耳與修長輪廓',row:1},{id:'orc',name:'獸人',note:'獠牙與厚實輪廓',row:2}];
const avatarHair=[{id:'silver',name:'月光銀',color:'#dedee5'},{id:'black',name:'曜石黑',color:'#252834'},{id:'brown',name:'栗棕',color:'#76543f'},{id:'gold',name:'暖金',color:'#d3ad65'},{id:'blue',name:'霧藍',color:'#739bbf'},{id:'rose',name:'玫瑰粉',color:'#c184a2'}];
const avatarOutfits=[{id:'pearl',name:'珍珠白',color:'#e4e8ed'},{id:'azure',name:'蒼穹藍',color:'#749abf'},{id:'forest',name:'森林綠',color:'#668978'},{id:'wine',name:'酒紅',color:'#9a566a'},{id:'night',name:'午夜黑',color:'#444858'}];
const avatarAuras=[{id:'mist',name:'晨霧',color:'#a8d7ff'},{id:'violet',name:'星紫',color:'#b8a8ed'},{id:'gold',name:'暖金',color:'#e3c180'},{id:'none',name:'無光環',color:'transparent'}];
function avatarAppearance(){
 let raw={};try{raw=JSON.parse(localStorage.getItem('edan-avatar-appearance-v1')||'{}')||{};}catch{}
 const pick=(items,id)=>items.find(x=>x.id===id)||items[0];
 return {race:pick(avatarRaces,raw.race),hair:pick(avatarHair,raw.hair),outfit:pick(avatarOutfits,raw.outfit),aura:pick(avatarAuras,raw.aura)};
}
function saveAvatarChoice(key,id){
 const groups={race:avatarRaces,hair:avatarHair,outfit:avatarOutfits,aura:avatarAuras};if(!groups[key]?.some(x=>x.id===id))return;
 const current=avatarAppearance(),value=Object.fromEntries(Object.entries(current).map(([k,v])=>[k,v.id]));value[key]=id;
 try{localStorage.setItem('edan-avatar-appearance-v1',JSON.stringify(value));}catch{document.querySelector('#avatar-save-status').textContent='此瀏覽器無法儲存外觀，請檢查儲存空間。';return;}
 renderFantasyGame();document.querySelector('#avatar-save-status').textContent='外觀已儲存，重新整理後仍會保留。';
}
let avatarArtSequence=0;
function avatarTint(color){const values=color.slice(1).match(/../g).map(x=>parseInt(x,16)/255);return values.map(v=>[.2126*v,.7152*v,.0722*v,0,0].join(' ')).join(' ')+' 0 0 0 1 0';}
function avatarMarkup(role,appearance=avatarAppearance()){
 const column={mage:0,paladin:1,ranger:2}[role]??0,row=appearance.race.row,uid='avatar-'+(++avatarArtSequence),cx=[230,211,199][column],faceY=row===2?39:43;
 const source='<image href="assets/adventurers-realistic-v2.webp" x="'+(-column*418)+'" y="'+(-row*418)+'" width="1254" height="1254"/>';
 const hairMask='<mask id="'+uid+'-hair" maskUnits="userSpaceOnUse" x="0" y="0" width="418" height="418"><rect x="'+(cx-48)+'" y="0" width="96" height="105" rx="28" fill="white"/><ellipse cx="'+cx+'" cy="'+(faceY+4)+'" rx="'+(row===2?25:17)+'" ry="22" fill="black"/><ellipse cx="'+cx+'" cy="91" rx="23" ry="19" fill="black"/></mask>';
 const clothMask='<mask id="'+uid+'-cloth" maskUnits="userSpaceOnUse" x="0" y="0" width="418" height="418"><path d="M'+(cx-49)+' 92 Q'+cx+' 110 '+(cx+49)+' 92 L'+(cx+92)+' 177 '+(cx+79)+' 235 '+(cx+62)+' 220 '+(cx+53)+' 275 '+(cx+93)+' 350 Q'+cx+' 395 '+(cx-94)+' 350 L'+(cx-51)+' 275 '+(cx-65)+' 220 '+(cx-78)+' 235 '+(cx-92)+' 177Z" fill="white"/><ellipse cx="'+cx+'" cy="100" rx="25" ry="19" fill="black"/></mask>';
 const filter=(id,color)=>'<filter id="'+uid+'-'+id+'" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="'+avatarTint(color)+'"/></filter>';
 return '<svg class="avatar-render" viewBox="80 0 275 418" aria-hidden="true" focusable="false"><defs>'+hairMask+clothMask+filter('hair-color',appearance.hair.color)+filter('cloth-color',appearance.outfit.color)+'</defs>'+source+(appearance.outfit.id==='pearl'?'':'<g mask="url(#'+uid+'-cloth)" opacity=".78"><g filter="url(#'+uid+'-cloth-color)">'+source+'</g></g>')+(appearance.hair.id==='silver'?'':'<g mask="url(#'+uid+'-hair)"><g filter="url(#'+uid+'-hair-color)">'+source+'</g></g>')+'</svg>';
}
function renderAvatarCustomizer(){
 const a=avatarAppearance(),g=gameState(quizState()),role=availableRole(gameLevel(g.xp||0).level,g.role),weapon=typeof currentWeapon==='function'?currentWeapon(g):null;
 document.querySelectorAll('.role-sprite[data-role]').forEach(el=>{el.innerHTML=avatarMarkup(el.dataset.role,a);el.classList.add('realistic-avatar');});
 const hero=document.querySelector('#hero-character');if(hero){hero.setAttribute('aria-label',a.race.name+' '+role.name+' · '+a.hair.name+'髮色 · '+a.outfit.name+'服飾');hero.closest('.character-emblem').style.setProperty('--avatar-aura',a.aura.color);}
 const preview=document.querySelector('#avatar-preview');if(!preview)return;
 preview.style.setProperty('--avatar-aura',a.aura.color);preview.innerHTML=avatarMarkup(role.id,a)+(weapon?'<span class="avatar-preview-weapon">'+weaponArt(role.id,weapon)+'</span>':'');
 document.querySelector('#avatar-preview-title').textContent=a.race.name+' · '+role.name;
 document.querySelector('#avatar-preview-description').textContent=a.hair.name+'髮色 / '+a.outfit.name+'服飾';
 document.querySelector('#avatar-preview-equipment').textContent=weapon?'已裝備 '+weapon.names[role.id]:'未裝備武器 · 可至連擊武器庫解鎖';
 document.querySelectorAll('[data-avatar-group]').forEach(button=>{const chosen=a[button.dataset.avatarGroup].id===button.dataset.avatarValue;button.setAttribute('aria-pressed',String(chosen));});
 document.querySelector('#avatar-race-options').querySelectorAll('[data-avatar-value]').forEach(button=>{const race=avatarRaces.find(x=>x.id===button.dataset.avatarValue);button.querySelector('.avatar-race-art').innerHTML=avatarMarkup(role.id,{...a,race});});
}
function initAvatarCustomizer(){
 const choices=(group,items)=>items.map(x=>'<button type="button" class="avatar-choice '+(group==='race'?'avatar-race-choice':'')+'" data-avatar-group="'+group+'" data-avatar-value="'+x.id+'" aria-pressed="false" aria-label="'+({race:'種族',hair:'髮色',outfit:'服飾',aura:'光環'}[group])+'：'+x.name+'">'+(group==='race'?'<span class="avatar-race-art" aria-hidden="true"></span>':'<span class="avatar-swatch" style="--swatch:'+x.color+'" aria-hidden="true"></span>')+'<b>'+x.name+'</b>'+(x.note?'<small>'+x.note+'</small>':'')+'</button>').join('');
 document.querySelector('#open-role-collection').insertAdjacentHTML('afterend','<button type="button" id="open-avatar-customizer" class="avatar-open">角色外觀 · 種族與服飾 →</button>');
 document.body.insertAdjacentHTML('beforeend','<dialog id="avatar-dialog" class="avatar-dialog" aria-labelledby="avatar-dialog-title"><button type="button" id="close-avatar-dialog" class="map-close" aria-label="關閉角色外觀">×</button><span class="section-kicker">CHARACTER ATELIER</span><h2 id="avatar-dialog-title">打造你的冒險者</h2><p class="avatar-intro">選擇種族、髮色與服飾配色，即時預覽你的角色。</p><div class="avatar-workshop"><section class="avatar-showcase" aria-label="目前角色預覽"><div id="avatar-preview" class="avatar-preview"></div><h3 id="avatar-preview-title"></h3><p id="avatar-preview-description"></p><small id="avatar-preview-equipment"></small></section><div class="avatar-controls"><section><h3>種族</h3><div id="avatar-race-options" class="avatar-races">'+choices('race',avatarRaces)+'</div></section><section><h3>髮色</h3><div class="avatar-choice-grid">'+choices('hair',avatarHair)+'</div></section><section><h3>服飾配色</h3><div class="avatar-choice-grid">'+choices('outfit',avatarOutfits)+'</div></section><section><h3>角色光環</h3><div class="avatar-choice-grid">'+choices('aura',avatarAuras)+'</div></section></div></div><p id="avatar-save-status" class="avatar-save-status" role="status" aria-live="polite">外觀會自動儲存在此瀏覽器。</p><p class="avatar-note">種族與配色只改變外觀，不影響能力或競賽積分。服飾款式依職業變化：法師長袍、聖騎士鎧甲、遊俠皮革裝。</p><button type="button" id="avatar-done" class="primary-action">完成外觀設定</button></dialog>');
 const dialog=document.querySelector('#avatar-dialog');document.querySelector('#open-avatar-customizer').onclick=()=>{renderAvatarCustomizer();dialog.showModal();};
 const close=()=>dialog.close();document.querySelector('#close-avatar-dialog').onclick=close;document.querySelector('#avatar-done').onclick=close;
 dialog.querySelectorAll('[data-avatar-group]').forEach(b=>b.onclick=()=>saveAvatarChoice(b.dataset.avatarGroup,b.dataset.avatarValue));
 dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
 renderAvatarCustomizer();
}
