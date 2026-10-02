/* Directed learning paths and local mistake locations. No scoring writes. */
const cloudRouteConfig=[
 {x:120,y:120,prerequisites:[],related:[1,6],next:1,focus:'先辨識需求、故障模式與 RTO / RPO。'},
 {x:360,y:120,prerequisites:[0],related:[3,5],next:2,focus:'先建立 VPC、Subnet 與 Security Group，再配置運算與資料庫。'},
 {x:600,y:120,prerequisites:[0],related:[3,4,5],next:3,focus:'權限是跨領域能力：EC2 Role、S3 Policy 與資料安全都會用到。'},
 {x:840,y:120,prerequisites:[1,2],related:[5],next:4,focus:'把網路與權限組成可擴展的應用層：EC2、ALB 與 ASG。'},
 {x:840,y:390,prerequisites:[2],related:[1,5],next:5,focus:'理解物件儲存、存取控制、版本與保護，銜接備份和復原。'},
 {x:600,y:390,prerequisites:[0,1,2],related:[3,4],next:6,focus:'用網路隔離與存取控制保護資料；把應用、備份與復原一起設計。'},
 {x:360,y:390,prerequisites:[0,3,4,5],related:[1,2],next:null,focus:'整合 Application、Database 與依賴服務，驗證跨區域 RTO / RPO。'}
];
function routeMissesFor(index,state=quizState()){
 const category=worldNodes[index]?.category;
 return category?quizBank.filter(q=>q.category===category&&Boolean(state.missed?.[q.id])):[];
}
function routeEdgesFor(index){
 const item=cloudRouteConfig[index];if(!item)return [];
 return [...item.prerequisites.map(from=>({from,to:index,type:'prerequisite'})),...item.related.filter(to=>!item.prerequisites.includes(to)).map(to=>({from:index,to,type:'related'}))];
}
let cloudRouteSelected=null,cloudRouteOnlyMissed=false;
function routeLabel(index){return worldNodes[index].name+' · '+d.skillMap.domains[index].name;}
function routeLine(from,to){
 const a=cloudRouteConfig[from],b=cloudRouteConfig[to],dx=b.x-a.x,dy=b.y-a.y,len=Math.hypot(dx,dy),ux=dx/len,uy=dy/len;
 // Leave clear space around the landmark and its labels.
 const pad=dy===0?61:91;
 return 'M'+(a.x+ux*pad)+' '+(a.y+uy*pad)+'L'+(b.x-ux*pad)+' '+(b.y-uy*pad);
}
function renderCloudRoutes(){
 const stage=document.querySelector('.map-stage'),layer=document.querySelector('#cloud-route-layer');if(!stage||!layer)return;
 const state=quizState(),selected=cloudRouteSelected,edges=selected===null?[]:routeEdgesFor(selected),related=new Set(edges.flatMap(e=>[e.from,e.to]));
 let html='<defs><marker id="cloud-main-arrow" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto"><path d="M0 0L9 4.5L0 9Z" fill="var(--metal,#c8d2de)"/></marker><marker id="cloud-dependency-arrow" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto"><path d="M0 0L9 4.5L0 9Z" fill="var(--accent,#a7cdef)"/></marker></defs>';
 for(let i=0;i<6;i++)html+='<path class="cloud-main-road" d="'+routeLine(i,i+1)+'" marker-end="url(#cloud-main-arrow)"/>';
 for(const e of edges)html+='<path class="cloud-dependency-road '+e.type+'" d="'+routeLine(e.from,e.to)+'" marker-end="'+(e.type==='prerequisite'?'url(#cloud-dependency-arrow)':'none')+'"/>';
 layer.innerHTML=html;
 let count=0;
 stage.querySelectorAll('[data-world-node]').forEach(button=>{
  const index=Number(button.dataset.worldNode),items=routeMissesFor(index,state);count+=items.length;
  button.classList.toggle('route-unrelated',selected!==null&&index!==selected&&!related.has(index));
  button.classList.toggle('route-related',selected!==null&&related.has(index)&&index!==selected);
  button.classList.toggle('route-missed',items.length>0);
  button.classList.toggle('route-filter-muted',cloudRouteOnlyMissed&&!items.length);
  button.setAttribute('aria-label',routeLabel(index)+'；'+(items.length?items.length+' 題待複習錯題':'沒有待複習錯題'));
  button.querySelector('.cloud-missed-badge').textContent=items.length?'! '+items.length+' 題':'';
  button.querySelector('.cloud-missed-badge').hidden=!items.length;
 });
 const summary=document.querySelector('#cloud-route-summary');summary.textContent=count?'地圖上有 '+count+' 題待複習錯題，選擇紅色標記的航站可開始複習。':'目前沒有待複習錯題；完成挑戰後，錯題會自動定位到對應航站。';
 document.querySelector('#cloud-route-missed-toggle').setAttribute('aria-pressed',String(cloudRouteOnlyMissed));
 if(selected!==null)renderCloudRouteDetail(selected);
}
function routePractice(index,missedOnly){
 const category=worldNodes[index].category;if(!category)return;
 document.querySelector('#quiz-category').value=category;document.querySelector('#quiz-type').value='all';
 closeWorldDetail();setQuizMode(missedOnly?'missed':'all');openOnlyModule('quiz',true);
}
function renderCloudRouteDetail(index){
 const config=cloudRouteConfig[index],questions=routeMissesFor(index),root=document.querySelector('#cloud-route-detail');
 if(!root)return;
 const buttons=(items)=>items.length?items.map(i=>'<button type="button" class="cloud-route-link" data-route-jump="'+i+'">'+escapeQuiz(routeLabel(i))+'</button>').join(''):'<span class="cloud-route-empty">從這裡開始建立基礎</span>';
 root.innerHTML='<p class="cloud-route-focus">'+escapeQuiz(config.focus)+'</p><div class="cloud-relation-columns"><section><h4>先備知識 · 虛線箭頭</h4>'+buttons(config.prerequisites)+'</section><section><h4>相關依賴 · 虛線</h4>'+buttons(config.related)+'</section><section><h4>下一個主線航站</h4>'+(config.next===null?'<span class="cloud-route-empty">後續主題持續擴充</span>':buttons([config.next]))+'</section></div><section class="cloud-route-errors"><h4>待複習錯題 · '+questions.length+' 題</h4>'+(questions.length?'<ul>'+questions.map(q=>'<li>'+escapeQuiz(q.question)+'</li>').join('')+'</ul><button type="button" id="cloud-route-review" class="primary-action">複習這個航站的錯題 →</button>':'<p class="cloud-route-empty">此領域目前沒有待複習錯題。這不代表已掌握全部觀念。</p>')+'</section>';
 root.querySelectorAll('[data-route-jump]').forEach(b=>b.onclick=()=>openWorldNode(Number(b.dataset.routeJump)));
 const review=root.querySelector('#cloud-route-review');if(review)review.onclick=()=>routePractice(index,true);
}
const cloudOriginalOpenNode=openWorldNode,cloudOriginalCloseNode=closeWorldDetail;
openWorldNode=function(index){if(!cloudRouteConfig[index])return;cloudRouteSelected=index;cloudOriginalOpenNode(index);renderCloudRoutes();document.querySelector('#world-detail').scrollIntoView({behavior:'smooth',block:'nearest'});};
closeWorldDetail=function(){cloudOriginalCloseNode();cloudRouteSelected=null;renderCloudRoutes();};
function initCloudRelations(){
 const map=document.querySelector('.world-map'),stage=map?.querySelector('.map-stage');if(!map||!stage)return;
 // The original decorative dotted route is replaced by a directed graph.
 stage.querySelector('.world-route')?.remove();
 stage.insertAdjacentHTML('beforeend','<svg id="cloud-route-layer" class="cloud-route-layer" viewBox="0 0 960 600" aria-hidden="true"></svg>');
 stage.querySelectorAll('[data-world-node]').forEach(button=>{
  const i=Number(button.dataset.worldNode),c=cloudRouteConfig[i];button.style.left=c.x/960*100+'%';button.style.top=c.y/600*100+'%';
  button.insertAdjacentHTML('beforeend','<span class="cloud-route-step" aria-hidden="true">'+(i+1)+'</span><span class="cloud-missed-badge" hidden></span>');
 });
 map.querySelector('.world-map-head h3').textContent='你的雲端學習主線';
 map.querySelector('.world-map-head p').textContent='沿實線箭頭前進；點選航站，查看先備知識、跨領域依賴與錯題。';
 map.querySelector('.world-map-head').insertAdjacentHTML('afterend','<div class="cloud-route-toolbar"><span><i class="cloud-line-sample"></i>學習主線 →</span><span><i class="cloud-line-sample dependency"></i>點選後顯示依賴</span><button type="button" id="cloud-route-missed-toggle" class="quiet-action" aria-pressed="false">突出錯題航站</button><button type="button" id="cloud-route-clear" class="quiet-action">返回完整主線</button><p id="cloud-route-summary" role="status" aria-live="polite"></p></div>');
 document.querySelector('#world-detail-items').insertAdjacentHTML('beforebegin','<div id="cloud-route-detail"></div>');
 map.querySelector('.map-footnote').textContent='箭頭表示建議學習順序，不是封包或資料流。虛線表示先備與關聯，不代表服務必須搭配使用。錯題來自此瀏覽器的客觀題紀錄，與每日訓練狀態分開顯示。手機可左右滑動。';
 document.querySelector('#cloud-route-missed-toggle').onclick=()=>{cloudRouteOnlyMissed=!cloudRouteOnlyMissed;renderCloudRoutes();};
 document.querySelector('#cloud-route-clear').onclick=()=>{cloudRouteOnlyMissed=false;closeWorldDetail();};
 const renderBefore=renderFantasyGame;
 renderFantasyGame=function(){renderBefore();renderCloudRoutes();};
 window.addEventListener('storage',event=>{if(event.key===quizStateKey||event.key===null)renderCloudRoutes();});
 renderCloudRoutes();
}
initCloudRelations();
