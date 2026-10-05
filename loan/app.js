
let data,records=[],active='全部',selected=null,view='work';
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const cls=s=>s==='已取消'?'cancel':s==='有效'?'valid':s==='移交其他主題'?'transfer':'pending';
const list=xs=>'<ul>'+xs.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>';
const section=(title,body)=>'<section class="section"><h3>'+esc(title)+'</h3>'+body+'</section>';
async function init(){
 const response=await fetch('./data.json',{cache:'no-store'});if(!response.ok)throw Error('資料讀取失敗');data=await response.json();records=data.records;
 $('#updated').textContent='更新 · '+data.updated_at.slice(0,10);$('#coverage').textContent=data.coverage_note;
 for(const [id,values] of [['topic',[...new Set(records.map(r=>r.topic))]],['source',[...new Set(records.flatMap(r=>r.source_types||[r.source_type]))]]]){
  $( '#'+id).innerHTML='<option value="">全部'+(id==='topic'?'主題':'來源')+'</option>'+values.map(v=>'<option>'+esc(v)+'</option>').join('');
  $('#'+id).onchange=()=>{selected=null;render()};
 }
 const hash=decodeURIComponent(location.hash.slice(1));if(records.some(r=>r.id===hash))selected=hash;
 drawFilters();render();
}
function drawFilters(){
 $('#filters').innerHTML=['全部','有效','已取消','移交其他主題','歷史參考','待確認／衝突'].map(x=>'<button class="chip '+(x===active?'active':'')+'" data-f="'+x+'">'+x+'</button>').join('');
 document.querySelectorAll('[data-f]').forEach(b=>b.onclick=()=>{active=b.dataset.f;selected=null;drawFilters();render()});
}
function filtered(){
 const q=$('#q').value.trim().toLowerCase(),topic=$('#topic').value,source=$('#source').value;
 return records.filter(r=>(active==='全部'||r.rule_status===active||(active==='待確認／衝突'&&['待確認','衝突','待後續定案'].includes(r.evidence_status)))&&(!topic||r.topic===topic)&&(!source||(r.source_types||[r.source_type]).includes(source))&&(!q||JSON.stringify(r).toLowerCase().includes(q)));
}
function render(){
 const rs=filtered();if(!rs.some(r=>r.id===selected))selected=rs[0]?.id||null;
 $('#summary').innerHTML=[['知識項目',records.length],['SSR/FSD來源項目',records.filter(r=>(r.source_types||[]).some(s=>['SSR明載','FSD明載'].includes(s))).length],['待確認／衝突',records.filter(r=>['待確認','衝突','待後續定案'].includes(r.evidence_status)).length],['L6已追溯',records.filter(r=>r.l6_ids?.length).length]].map(([a,b])=>'<div class="metric"><strong>'+b+'</strong><span>'+a+'</span></div>').join('');
 $('#list').innerHTML=rs.length?rs.map(r=>'<button class="item '+(r.id===selected?'active':'')+'" data-id="'+esc(r.id)+'"><div class="item-id">'+esc(r.id)+' · '+esc(r.category)+'</div><div class="item-title">'+esc(r.title)+'</div><div class="tags"><span class="tag '+cls(r.rule_status)+'">'+esc(r.rule_status)+'</span><span class="tag">'+esc(r.evidence_status)+'</span><span class="tag">'+esc(r.topic)+'</span></div></button>').join(''):'<div class="empty">找不到符合條件的知識</div>';
 document.querySelectorAll('[data-id]').forEach(b=>b.onclick=()=>show(b.dataset.id));$('#result-count').textContent=rs.length+' 筆結果';
 if(selected)show(selected);else $('#detail').innerHTML='<div class="empty">沒有符合條件的知識，請調整搜尋或篩選。</div>';
}
function show(id){
 selected=id;const r=records.find(x=>x.id===id);if(!r)return;history.replaceState(null,'','#'+encodeURIComponent(id));
 document.querySelectorAll('[data-id]').forEach(b=>b.classList.toggle('active',b.dataset.id===id));
 const kv=rows=>'<div class="kv">'+rows.map(([a,b])=>'<div class="k">'+esc(a)+'</div><div>'+esc(b)+'</div>').join('')+'</div>';
 const provenance=section('來源與追溯',r.sources.map(s=>'<div class="source"><b>'+esc(s.document)+'</b>'+esc(s.location)+'</div>').join('')+kv([['本次核讀',r.verification],['Requirement',r.requirement_ids?.join('、')||'尚未核實對應；不代表不存在'],['L6',r.l6_ids?.join('、')||'尚未核實對應；不代表不存在']]));
 let body='';
 if(view==='learn'){
  body=section('白話理解','<p>'+esc(r.plain_language)+'</p>')+section('條件判斷',kv([['什麼時候',r.trigger],['需要條件',r.conditions.join('；')],['得到結果',r.result],['例外／邊界',r.exceptions?.join('；')||'來源未載明']]))+section('易錯觀念與待確認',list(r.notes||[]))+provenance;
 }else if(view==='review'){
  body=section('本次變更',kv([['更新時間',r.updated_at],['變更摘要',r.change_summary],['原狀態',r.legacy_rule_status||'未改規則狀態／新增項目'],['同步狀態',r.sync_status],['相關知識',r.related_ids?.join('、')||'—']]))+section('複核事項',list(r.notes||[]))+provenance;
 }else{
  body=section('條件與結果',kv([['業務目的',r.goal],['觸發事件',r.trigger],['處理結果',r.result],['代碼',r.codes?.join('、')||'—'],['適用產品',r.product],['幣別',r.currency?.join('、')||'来源未限定／未確認'],['系統',r.system],['適用期間',r.period]]))+section('適用條件',list(r.conditions))+section('例外與邊界',list(r.exceptions||[]))+provenance+section('易錯觀念與待確認',list(r.notes||[]));
 }
 $('#detail').innerHTML='<div class="item-id">'+esc(r.id)+' · '+esc(r.topic)+' · '+esc(r.category)+'</div><h2>'+esc(r.title)+'</h2><div class="tags"><span class="tag '+cls(r.rule_status)+'">規則：'+esc(r.rule_status)+'</span><span class="tag">確認：'+esc(r.evidence_status)+'</span><span class="tag">'+esc(r.source_type)+'</span></div><p class="lead">'+esc(r.plain_language)+'</p>'+body;
}
$('#q').addEventListener('input',()=>{selected=null;render()});
document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>{view=b.dataset.view;document.querySelectorAll('[data-view]').forEach(x=>x.classList.toggle('active',x===b));if(selected)show(selected)});
window.addEventListener('hashchange',()=>{const id=decodeURIComponent(location.hash.slice(1));if(records.some(r=>r.id===id)){active='全部';$('#q').value='';$('#topic').value='';$('#source').value='';selected=id;drawFilters();render()}});
init().catch(()=>$('#detail').innerHTML='<div class="empty">知識資料載入失敗，請重新整理。</div>');
