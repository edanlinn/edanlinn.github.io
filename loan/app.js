
let data,documents={},records=[],active='全部',selected=null,view='work',category='全部';
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const cls=s=>s==='已取消'?'cancel':s==='有效'?'valid':s==='移交其他主題'?'transfer':'pending';
const list=xs=>'<ul>'+xs.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>';
const section=(title,body)=>'<section class="section"><h3>'+esc(title)+'</h3>'+body+'</section>';
async function init(){
 const responses=await Promise.all([fetch('./data.json',{cache:'no-store'}),fetch('./documents.json',{cache:'no-store'})]);if(responses.some(r=>!r.ok))throw Error('資料讀取失敗');[data,documents]=await Promise.all(responses.map(r=>r.json()));records=data.records;
 $('#updated').textContent='更新 · '+data.updated_at.slice(0,10);$('#coverage').textContent=data.coverage_note;
 for(const [id,values] of [['topic',[...new Set(records.map(r=>r.topic))]],['source',[...new Set(records.flatMap(r=>r.source_types||[r.source_type]))]]]){
  $( '#'+id).innerHTML='<option value="">全部'+(id==='topic'?'主題':'來源')+'</option>'+values.map(v=>'<option>'+esc(v)+'</option>').join('');
  $('#'+id).onchange=()=>{selected=null;render()};
 }
 const hash=decodeURIComponent(location.hash.slice(1));if(records.some(r=>r.id===hash))selected=hash;
 drawFilters();drawCategories();render();
}
function drawCategories(){
 $('#categories').innerHTML=['全部','業務知識','SSR／FSD文件','網路放款知識','L6撰寫與依據'].map(x=>'<button class="chip '+(x===category?'active':'')+'" data-category="'+esc(x)+'">'+esc(x)+'</button>').join('');
 document.querySelectorAll('[data-category]').forEach(b=>b.onclick=()=>{category=b.dataset.category;selected=null;drawCategories();render()});
}
function inCategory(r){return category==='全部'||(category==='業務知識'&&!['SSR／FSD文件','網路放款知識','L6撰寫規範','L6案例依據'].includes(r.category))||(category==='L6撰寫與依據'&&['L6撰寫規範','L6案例依據'].includes(r.category))||r.category===category;}
function drawFilters(){
 $('#filters').innerHTML=['全部','有效','已取消','移交其他主題','歷史參考','待確認／衝突'].map(x=>'<button class="chip '+(x===active?'active':'')+'" data-f="'+x+'">'+x+'</button>').join('');
 document.querySelectorAll('[data-f]').forEach(b=>b.onclick=()=>{active=b.dataset.f;selected=null;drawFilters();render()});
}
function filtered(){
 const q=$('#q').value.trim().toLowerCase(),topic=$('#topic').value,source=$('#source').value;
 return records.filter(r=>inCategory(r)&&(active==='全部'||r.rule_status===active||(active==='待確認／衝突'&&['待確認','衝突','待後續定案'].includes(r.evidence_status)))&&(!topic||r.topic===topic)&&(!source||(r.source_types||[r.source_type]).includes(source))&&(!q||JSON.stringify(r).toLowerCase().includes(q)||(r.document_key&&documents[r.document_key]?.text.toLowerCase().includes(q))));
}
function render(){
 const rs=filtered();if(!rs.some(r=>r.id===selected))selected=rs[0]?.id||null;
 $('#summary').innerHTML=[['知識與案例',records.length],['SSR／FSD文件',Object.keys(documents).length],['待確認／衝突',records.filter(r=>['待確認','衝突','待後續定案'].includes(r.evidence_status)).length],['L6編號已核對',records.filter(r=>r.l6_ids?.length).length]].map(([a,b])=>'<div class="metric"><strong>'+b+'</strong><span>'+a+'</span></div>').join('');
 $('#list').innerHTML=rs.length?rs.map(r=>'<button class="item '+(r.id===selected?'active':'')+'" data-id="'+esc(r.id)+'"><div class="item-id">'+esc(r.id)+' · '+esc(r.category)+'</div><div class="item-title">'+esc(r.title)+'</div><div class="tags"><span class="tag '+cls(r.rule_status)+'">'+esc(r.rule_status)+'</span><span class="tag">'+esc(r.evidence_status)+'</span><span class="tag">'+esc(r.topic)+'</span></div></button>').join(''):'<div class="empty">找不到符合條件的知識</div>';
 document.querySelectorAll('[data-id]').forEach(b=>b.onclick=()=>show(b.dataset.id));$('#result-count').textContent=rs.length+' 筆結果';
 if(selected)show(selected);else $('#detail').innerHTML='<div class="empty">沒有符合條件的知識，請調整搜尋或篩選。</div>';
}
function show(id){
 selected=id;const r=records.find(x=>x.id===id);if(!r)return;history.replaceState(null,'','#'+encodeURIComponent(id));
 document.querySelectorAll('[data-id]').forEach(b=>b.classList.toggle('active',b.dataset.id===id));
 const kv=rows=>'<div class="kv">'+rows.map(([a,b])=>'<div class="k">'+esc(a)+'</div><div>'+esc(b)+'</div>').join('')+'</div>';
 const provenance=section('來源與追溯',r.sources.map(s=>'<div class="source"><b>'+esc(s.document)+'</b>'+esc(s.location)+(s.url&&/^https:\/\//.test(s.url)?'<br><a href="'+esc(s.url)+'" target="_blank" rel="noopener noreferrer">閱讀官方來源 ↗</a>':'')+(s.retrieved_at?'<br>查核日期：'+esc(s.retrieved_at.slice(0,10)):'')+'</div>').join('')+kv([['本次核讀',r.verification],['Requirement',r.requirement_ids?.join('、')||'尚未核實對應；不代表不存在'],['L6',r.l6_ids?.join('、')||'尚未核實對應；不代表不存在']]));
 let body='';
 if(view==='learn'){
  body=section('白話理解','<p>'+esc(r.plain_language)+'</p>')+section('條件判斷',kv([['什麼時候',r.trigger],['需要條件',r.conditions.join('；')],['得到結果',r.result],['例外／邊界',r.exceptions?.join('；')||'來源未載明']]))+section('易錯觀念與待確認',list(r.notes||[]))+provenance;
 }else if(view==='review'){
  body=section('本次變更',kv([['更新時間',r.updated_at],['變更摘要',r.change_summary],['原狀態',r.legacy_rule_status||'未改規則狀態／新增項目'],['同步狀態',r.sync_status],['相關知識',r.related_ids?.join('、')||'—']]))+section('複核事項',list(r.notes||[]))+provenance;
 }else{
  body=section('條件與結果',kv([['業務目的',r.goal],['觸發事件',r.trigger],['處理結果',r.result],['代碼',r.codes?.join('、')||'—'],['適用產品',r.product],['幣別',r.currency?.join('、')||'来源未限定／未確認'],['系統',r.system],['適用期間',r.period]]))+section('適用條件',list(r.conditions))+section('例外與邊界',list(r.exceptions||[]))+provenance+section('易錯觀念與待確認',list(r.notes||[]));
 }
 let appendix='';
 if(r.case){const c=r.case;appendix=section('L6撰寫與依據',kv([['Requirement實體對應',c.trace_verified?'編號對應已核實；業務覆蓋仍依下列判斷':'對應待確認'],['一致性',c.comparison_status],['Requirement內容',c.requirement_description],['最終方案／comply',String(c.solution||'待確認')+'／'+String(c.requirement_comply||'待確認')],['L6實體情境',c.scenario],['L6預期結果',c.expected||'來源未填寫'],['關鍵公式／數值',c.formula],['SSR依據',c.ssr_evidence],['FSD／其他依據',c.fsd_evidence],['判斷理由',c.reason],['原L6待確認內容',c.original_notes||'—']]))}
 if(r.document_key&&documents[r.document_key]){const d=documents[r.document_key],q=$('#q').value.trim();let lines=d.text.split('\n');if(q){const hits=lines.map((t,i)=>t.toLowerCase().includes(q.toLowerCase())?i:-1).filter(i=>i>=0);if(hits.length)appendix+=section('原文搜尋命中',hits.slice(0,12).map(i=>'<div class="source">'+esc(lines.slice(Math.max(0,i-1),i+3).join('\n'))+'</div>').join(''));}appendix+=section('收錄文件文字','<p>'+esc(d.extraction_note)+'</p><details><summary>展開 '+esc(d.kind)+' '+esc(d.version)+' 收錄文字</summary><pre class="document-text">'+esc(d.text)+'</pre></details>');}
 if(r.related_ids?.length)appendix+=section('相關知識與文件',r.related_ids.filter(id=>records.some(x=>x.id===id)).map(id=>'<p><a href="#'+encodeURIComponent(id)+'">'+esc(records.find(x=>x.id===id).title)+'</a></p>').join(''));
 $('#detail').innerHTML='<div class="item-id">'+esc(r.id)+' · '+esc(r.topic)+' · '+esc(r.category)+'</div><h2>'+esc(r.title)+'</h2><div class="tags"><span class="tag '+cls(r.rule_status)+'">規則：'+esc(r.rule_status)+'</span><span class="tag">確認：'+esc(r.evidence_status)+'</span><span class="tag">'+esc(r.source_type)+'</span></div><p class="lead">'+esc(r.plain_language)+'</p>'+appendix+body;
}
$('#q').addEventListener('input',()=>{selected=null;render()});
document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>{view=b.dataset.view;document.querySelectorAll('[data-view]').forEach(x=>x.classList.toggle('active',x===b));if(selected)show(selected)});
window.addEventListener('hashchange',()=>{const id=decodeURIComponent(location.hash.slice(1));if(records.some(r=>r.id===id)){active='全部';category='全部';$('#q').value='';$('#topic').value='';$('#source').value='';selected=id;drawFilters();drawCategories();render()}});
init().catch(()=>$('#detail').innerHTML='<div class="empty">知識資料載入失敗，請重新整理。</div>');
