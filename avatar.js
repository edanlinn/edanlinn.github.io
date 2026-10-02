
/* Appearance is cosmetic. Competition continues using the existing server role contract. */
const avatarRaces=[
{id:'human',name:'人類',column:0,world:'dawn'},{id:'elf',name:'精靈',column:1,world:'forest'},
{id:'darkelf',name:'暗精靈',column:2,world:'forest'},{id:'orc',name:'獸人',column:3,world:'dusk'},
{id:'dwarf',name:'矮人',column:4,world:'dawn'},{id:'dragonborn',name:'龍裔',column:5,world:'dusk'},
{id:'tiefling',name:'魔裔',column:6,world:'dusk'}];
const avatarGenders=[{id:'male',name:'男性'},{id:'female',name:'女性'}];
const avatarAges=[{id:'young',name:'青年',row:0,note:'約 20 歲的外貌'},{id:'adult',name:'壯年',row:1,note:'約 45 歲的外貌'},{id:'elder',name:'長者',row:2,note:'約 70 歲的外貌'}];
const avatarProfessions=[
{id:'warrior',name:'戰士',base:'paladin',symbol:'⚔',title:'鋼鐵戰將'},
{id:'paladin',name:'聖騎士',base:'paladin',symbol:'✦',title:'蒼穹聖騎士'},
{id:'mage',name:'法師',base:'mage',symbol:'✧',title:'星辰大法師'},
{id:'ranger',name:'遊俠',base:'ranger',symbol:'➶',title:'天空巡守'},
{id:'assassin',name:'刺客',base:'ranger',symbol:'◈',title:'暗影行者'},
{id:'priest',name:'牧師',base:'mage',symbol:'✚',title:'聖光賢者'},
{id:'druid',name:'德魯伊',base:'mage',symbol:'❧',title:'森林守望者'},
{id:'summoner',name:'召喚師',base:'mage',symbol:'◎',title:'萬靈契約者'}];
const avatarBuilds=[{id:'standard',name:'標準',scale:1},{id:'slim',name:'纖細',scale:.9},{id:'broad',name:'厚實',scale:1.1}];
const avatarSkins=[{id:'natural',name:'種族原色',color:'#bba28e'},{id:'fair',name:'瓷白',color:'#ecd1bd'},{id:'tan',name:'暖棕',color:'#ba8764'},{id:'deep',name:'深褐',color:'#765044'},{id:'jade',name:'翡翠',color:'#8caa7d'},{id:'violet',name:'紫灰',color:'#a09bbf'}];
const avatarHeadgear=[{id:'none',name:'不加頭飾'},{id:'circlet',name:'銀冠'},{id:'gem',name:'寶石額飾'}];
const avatarStyles=[{id:'adventurer',name:'冒險裝',note:'原生刺繡服飾'},{id:'armor',name:'金屬護甲',note:'胸甲與肩甲'},{id:'ritual',name:'儀式披肩',note:'織紋與職業徽記'}];
const avatarCapes=[{id:'natural',name:'原生披風',color:'#737681'},{id:'blue',name:'靛藍披風',color:'#657caa'},{id:'red',name:'緋紅披風',color:'#a86570'},{id:'green',name:'墨綠披風',color:'#638773'}];
const avatarWorlds=[{id:'auto',name:'跟隨種族',note:'自動搭配城堡、森林或荒原'},{id:'dawn',name:'晨光城堡'},{id:'forest',name:'月夜森林'},{id:'dusk',name:'暮色荒原'}];
const avatarHair=[{id:'silver',name:'月光銀',color:'#dedee5'},{id:'black',name:'曜石黑',color:'#252834'},{id:'brown',name:'栗棕',color:'#76543f'},{id:'gold',name:'暖金',color:'#d3ad65'},{id:'blue',name:'霧藍',color:'#739bbf'},{id:'rose',name:'玫瑰粉',color:'#c184a2'}];
const avatarOutfits=[{id:'pearl',name:'原生灰銀',color:'#e4e8ed'},{id:'azure',name:'蒼穹藍',color:'#749abf'},{id:'forest',name:'森林綠',color:'#668978'},{id:'wine',name:'酒紅',color:'#9a566a'},{id:'night',name:'午夜黑',color:'#444858'}];
const avatarAuras=[{id:'mist',name:'晨霧',color:'#a8d7ff'},{id:'violet',name:'星紫',color:'#b8a8ed'},{id:'gold',name:'暖金',color:'#e3c180'},{id:'none',name:'無光環',color:'transparent'}];
const avatarGroups={gender:avatarGenders,race:avatarRaces,age:avatarAges,profession:avatarProfessions,build:avatarBuilds,skin:avatarSkins,hair:avatarHair,style:avatarStyles,outfit:avatarOutfits,cape:avatarCapes,headgear:avatarHeadgear,world:avatarWorlds,aura:avatarAuras};
const avatarLabels={gender:'性別',race:'種族',age:'年齡外貌',profession:'基礎職業',build:'體型',skin:'膚色',hair:'髮色',style:'服裝款式',outfit:'服飾配色',cape:'披風配色',headgear:'頭飾',world:'場景與介面主題',aura:'角色光環'};
function avatarAppearance(){
 let raw={};try{raw=JSON.parse(localStorage.getItem('edan-avatar-appearance-v1')||'{}')||{};}catch{}
 if(!raw.profession){let oldRole='mage';try{oldRole=gameState(quizState()).role||'mage';}catch{}raw.profession=oldRole;}
 return Object.fromEntries(Object.entries(avatarGroups).map(([key,items])=>[key,items.find(x=>x.id===raw[key])||items[0]]));
}
function saveAvatarChoice(key,id){
 if(!avatarGroups[key]?.some(x=>x.id===id))return;
 const value=Object.fromEntries(Object.entries(avatarAppearance()).map(([k,v])=>[k,v.id]));value[key]=id;
 try{localStorage.setItem('edan-avatar-appearance-v1',JSON.stringify(value));}catch{const status=document.querySelector('#avatar-save-status');if(status)status.textContent='此瀏覽器無法儲存外觀，請檢查儲存空間。';return;}
 renderFantasyGame();const status=document.querySelector('#avatar-save-status');if(status)status.textContent='外觀已儲存，重新整理後仍會保留。';
}
const avatarAtlas={male:'assets/characters-male-v4.png',female:'assets/characters-female-v4.png'};
let avatarArtSequence=0;
function avatarTint(color){const values=color.slice(1).match(/../g).map(x=>parseInt(x,16)/255);return values.map(v=>[.2126*v,.7152*v,.0722*v,0,0].join(' ')).join(' ')+' 0 0 0 1 0';}
function avatarMarkup(role,appearance=avatarAppearance()){
 const a=appearance,uid='avatar-'+(++avatarArtSequence),col=a.race.column,row=a.age.row,dwarf=a.race.id==='dwarf';
 // Equal atlas cells normalize both genders while retaining short dwarf proportions.
 const faceCenters=a.gender.id==='female'?[146,138,122,117,122,107,104]:[139,133,124,117,111,107,105];const shift=120-faceCenters[col];
 const source='<g transform="translate('+shift+' 0)"><svg class="avatar-atlas-cell" x="0" y="0" width="240" height="320" viewBox="'+col*240+' '+row*320+' 240 320" preserveAspectRatio="none"><image href="'+avatarAtlas[a.gender.id]+'" width="1680" height="960" preserveAspectRatio="none"/></svg></g>';
 const fx=120,fy=dwarf?106:35,shoulder=dwarf?151:82,belt=dwarf?209:147;
 const masks='<mask id="'+uid+'-hair"><rect x="75" y="'+(fy-35)+'" width="90" height="'+(dwarf?92:110)+'" rx="25" fill="white"/><ellipse cx="'+fx+'" cy="'+fy+'" rx="16" ry="25" fill="black"/><path d="M100 '+(fy+22)+'h40v70h-40Z" fill="black"/></mask>'+
 '<mask id="'+uid+'-skin"><ellipse cx="'+fx+'" cy="'+fy+'" rx="15" ry="22" fill="white"/><ellipse cx="67" cy="'+(shoulder+40)+'" rx="10" ry="25" fill="white"/><ellipse cx="173" cy="'+(shoulder+40)+'" rx="10" ry="25" fill="white"/></mask>'+
 '<mask id="'+uid+'-cloth"><path d="M87 '+(shoulder-17)+'Q120 '+shoulder+' 153 '+(shoulder-17)+'L165 '+(belt+35)+' 120 '+(belt+62)+' 75 '+(belt+35)+'Z" fill="white"/></mask>'+
 '<mask id="'+uid+'-cape"><path d="M65 '+shoulder+'L44 245 77 264 92 '+shoulder+'ZM175 '+shoulder+'L196 245 163 264 148 '+shoulder+'Z" fill="white"/></mask>';
 const filter=(id,color)=>'<filter id="'+uid+'-'+id+'" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="'+avatarTint(color)+'"/></filter>';
 const tint=(area,color,opacity)=>'<g mask="url(#'+uid+'-'+area+')" opacity="'+opacity+'"><g filter="url(#'+uid+'-'+area+'-color)">'+source+'</g></g>';
 const p=avatarProfessions.find(x=>x.id===role)||a.profession;
 const metal='url(#'+uid+'-metal)';
 let gear='';
 if(a.style.id==='armor')gear='<path d="M92 '+shoulder+'Q120 '+(shoulder+14)+' 148 '+shoulder+'L145 '+(belt-7)+'Q120 '+(belt+3)+' 95 '+(belt-7)+'Z" fill="'+metal+'" stroke="#526574"/><path d="M83 '+(shoulder-9)+'l-20 10 6 20 23-9ZM157 '+(shoulder-9)+'l20 10-6 20-23-9Z" fill="'+metal+'" stroke="#637487"/><path d="M120 '+(shoulder+18)+'v'+(belt-shoulder-30)+'" stroke="#e0ebee" opacity=".6"/>';
 if(a.style.id==='ritual')gear='<path d="M87 '+(shoulder-13)+'L101 '+(belt+21)+' 112 '+(belt+25)+' 104 '+shoulder+'Q120 '+(shoulder+8)+' 136 '+shoulder+'L128 '+(belt+25)+' 139 '+(belt+21)+' 153 '+(shoulder-13)+'Q120 '+shoulder+' 87 '+(shoulder-13)+'Z" fill="'+a.outfit.color+'" stroke="#c1a878" stroke-width="2"/>';
 if(a.headgear.id!=='none')gear+='<path d="M103 '+(fy-12)+'Q120 '+(fy-5)+' 137 '+(fy-12)+'" fill="none" stroke="'+metal+'" stroke-width="3"/><path d="m120 '+(fy-12)+' 4 4-4 5-4-5Z" fill="'+(a.headgear.id==='gem'?'#8bbedb':'#d6d9e1')+'" stroke="#657689"/>';
 const emblem='<text x="120" y="'+(shoulder+27)+'" text-anchor="middle" font-size="14" fill="#ddd0a9" stroke="#2d3444" stroke-width=".25">'+p.symbol+'</text>';
 return '<svg class="avatar-render" viewBox="0 0 240 320" aria-hidden="true" focusable="false"><defs>'+masks+filter('hair-color',a.hair.color)+filter('cloth-color',a.outfit.color)+filter('skin-color',a.skin.color)+filter('cape-color',a.cape.color)+'<linearGradient id="'+uid+'-metal"><stop stop-color="#424e61"/><stop offset=".3" stop-color="#aebcca"/><stop offset=".48" stop-color="#e6edf1"/><stop offset=".7" stop-color="#7c8ca0"/><stop offset="1" stop-color="#39455a"/></linearGradient></defs><g transform="translate(120 0) scale('+a.build.scale+' 1) translate(-120 0)">'+source+(a.outfit.id==='pearl'?'':tint('cloth',a.outfit.color,.8))+(a.hair.id==='silver'?'':tint('hair',a.hair.color,.9))+(a.skin.id==='natural'?'':tint('skin',a.skin.color,.65))+(a.cape.id==='natural'?'':tint('cape',a.cape.color,.8))+gear+emblem+'</g></svg>';
}
function applyAvatarWorld(a){
 const world=a.world.id==='auto'?a.race.world:a.world.id;
 document.documentElement.dataset.world=world;const selected=avatarWorlds.find(x=>x.id===world);
 const card=document.querySelector('.rank-card');if(card){card.dataset.world=world;card.setAttribute('aria-label',selected.name+'・角色與升級進度');}
 document.querySelectorAll('.avatar-world-name').forEach(el=>el.textContent=selected.name);
}
function avatarProfessionTitle(p,level){return level>=10?p.title:level>=5?'精英'+p.name:level>=3?'資深'+p.name:'見習'+p.name;}
function renderAvatarCustomizer(){
 const a=avatarAppearance(),g=gameState(quizState()),level=gameLevel(g.xp||0).level,p=a.profession,weapon=typeof currentWeapon==='function'?currentWeapon(g):null;
 applyAvatarWorld(a);
 document.querySelectorAll('.role-sprite[data-role]').forEach(el=>{el.innerHTML=avatarMarkup(el.id==='hero-character'?p.id:el.dataset.role,a);el.classList.add('realistic-avatar');});
 const put=(id,text)=>{const el=document.querySelector('#'+id);if(el)el.textContent=text;};
 put('game-character-title',avatarProfessionTitle(p,level));put('game-character-role',p.name+' · '+a.age.name+' '+a.race.name);
 const next=[3,5,10].find(n=>n>level);put('game-next-title',next?'LV. '+next+' 解鎖「'+avatarProfessionTitle(p,next)+'」':'已解鎖本職業全部稱號');
 const hero=document.querySelector('#hero-character');if(hero){hero.setAttribute('aria-label',[a.gender.name,a.age.name,a.race.name,p.name,a.hair.name+'髮色',a.style.name].join(' · '));hero.closest('.character-emblem').style.setProperty('--avatar-aura',a.aura.color);}
 const heroWeapon=document.querySelector('#hero-weapon');if(heroWeapon&&weapon){heroWeapon.innerHTML=weaponArt(p.base,weapon);heroWeapon.setAttribute('aria-label','已裝備 '+weapon.names[p.base]);}
 put('arena-equipped',weapon?weapon.names[p.base]:'尚未裝備 · 3 連擊獲得首件武器');
 const collection=document.querySelector('#role-collection');
 if(collection){collection.innerHTML=avatarProfessions.map(item=>'<button type="button" class="role-card '+(p.id===item.id?'equipped':'')+'" data-avatar-profession="'+item.id+'" aria-pressed="'+(p.id===item.id)+'"><span class="role-sprite realistic-avatar" data-role="'+item.id+'">'+avatarMarkup(item.id,a)+'</span><b>'+item.name+'</b><small>基礎職業自由選擇</small><em>'+(p.id===item.id?'目前職業':'選擇職業')+'</em></button>').join('');collection.querySelectorAll('[data-avatar-profession]').forEach(b=>b.onclick=()=>saveAvatarChoice('profession',b.dataset.avatarProfession));}
 const titles=document.querySelector('#title-collection');if(titles)titles.innerHTML=avatarProfessions.flatMap(item=>[1,3,5,10].map(n=>'<div class="title-row '+(level>=n?'earned':'')+'"><span>'+gameIcon('trophy')+'</span><div><b>'+avatarProfessionTitle(item,n)+'</b><small>'+item.name+' · LV. '+n+'</small></div><em>'+(level>=n?'已解鎖':'待解鎖')+'</em></div>')).join('');
 const preview=document.querySelector('#avatar-preview');if(!preview)return;
 preview.style.setProperty('--avatar-aura',a.aura.color);preview.innerHTML=avatarMarkup(p.id,a)+(weapon?'<span class="avatar-preview-weapon">'+weaponArt(p.base,weapon)+'</span>':'');
 put('avatar-preview-title',a.gender.name+' · '+a.age.name+' · '+a.race.name+' · '+p.name);
 put('avatar-preview-description',a.build.name+'體型 / '+a.skin.name+' / '+a.style.name);
 put('avatar-preview-equipment',weapon?'已裝備 '+weapon.names[p.base]:'未裝備武器 · 至連擊武器庫解鎖');
 document.querySelectorAll('[data-avatar-group]').forEach(button=>button.setAttribute('aria-pressed',String(a[button.dataset.avatarGroup].id===button.dataset.avatarValue)));
 document.querySelectorAll('#avatar-race-options [data-avatar-value]').forEach(button=>{const race=avatarRaces.find(x=>x.id===button.dataset.avatarValue);button.querySelector('.avatar-race-art').innerHTML=avatarMarkup(p.id,{...a,race});});
}
function initAvatarCustomizer(){
 const choices=(group,items)=>items.map(x=>'<button type="button" class="avatar-choice '+(group==='race'?'avatar-race-choice':'')+'" data-avatar-group="'+group+'" data-avatar-value="'+x.id+'" aria-pressed="false" aria-label="'+avatarLabels[group]+'：'+x.name+'">'+(group==='race'?'<span class="avatar-race-art" aria-hidden="true"></span>':x.color?'<span class="avatar-swatch" style="--swatch:'+x.color+'" aria-hidden="true"></span>':x.symbol?'<span class="avatar-gender-symbol" aria-hidden="true">'+x.symbol+'</span>':'')+'<b>'+x.name+'</b>'+(x.note?'<small>'+x.note+'</small>':'')+'</button>').join('');
 document.querySelector('#open-role-collection').insertAdjacentHTML('afterend','<button type="button" id="open-avatar-customizer" class="avatar-open">打造角色 · 種族、職業與年齡 →</button>');
 const controls=Object.entries(avatarGroups).map(([key,items])=>'<section><h3>'+avatarLabels[key]+'</h3><div '+(key==='race'?'id="avatar-race-options" ':'')+'class="'+(key==='race'?'avatar-races':key==='gender'?'avatar-genders':'avatar-choice-grid')+'">'+choices(key,items)+'</div></section>').join('');
 document.body.insertAdjacentHTML('beforeend','<dialog id="avatar-dialog" class="avatar-dialog" aria-labelledby="avatar-dialog-title"><button type="button" id="close-avatar-dialog" class="map-close" aria-label="關閉角色外觀">×</button><span class="section-kicker">CHARACTER ATELIER</span><h2 id="avatar-dialog-title">打造你的冒險者</h2><p class="avatar-intro">7 個種族、8 種基礎職業、3 個年齡階段自由搭配。青年、壯年與長者各有不同的臉部與身形素材；稱號與稀有武器隨學習進度解鎖。</p><div class="avatar-workshop"><section class="avatar-showcase" aria-label="目前角色預覽"><span class="avatar-world-name avatar-world-label"></span><div id="avatar-preview" class="avatar-preview"></div><h3 id="avatar-preview-title"></h3><p id="avatar-preview-description"></p><small id="avatar-preview-equipment"></small></section><div class="avatar-controls">'+controls+'</div></div><p id="avatar-save-status" class="avatar-save-status" role="status" aria-live="polite">外觀會自動儲存在此瀏覽器。</p><p class="avatar-note">年齡代表角色外貌。職業徽記、服裝與配色可獨立搭配；髮型與原生鬍鬚依種族、性別和年齡素材呈現。武器分為長劍、弓與法杖三個系列。外觀不影響競賽積分。</p><button type="button" id="avatar-done" class="primary-action">完成外觀設定</button></dialog>');
 document.querySelector('.rank-top').insertAdjacentHTML('afterend','<span class="avatar-world-name hero-world-label"></span>');
 const dialog=document.querySelector('#avatar-dialog');document.querySelector('#open-avatar-customizer').onclick=()=>{renderAvatarCustomizer();dialog.showModal();};
 const close=()=>dialog.close();document.querySelector('#close-avatar-dialog').onclick=close;document.querySelector('#avatar-done').onclick=close;
 dialog.querySelectorAll('[data-avatar-group]').forEach(b=>b.onclick=()=>saveAvatarChoice(b.dataset.avatarGroup,b.dataset.avatarValue));
 dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
 renderAvatarCustomizer();
}
