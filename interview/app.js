const buttons=[...document.querySelectorAll("[data-view]")];
const sections=[...document.querySelectorAll(".view")];
const menu=document.getElementById("mobile-nav");
const toggle=document.getElementById("menu-toggle");
function show(view, updateHash=true){
  if(!sections.some(s=>s.id===view)) view="start";
  sections.forEach(s=>{const current=s.id===view;s.hidden=!current;s.classList.toggle("current",current)});
  buttons.forEach(b=>{const current=b.dataset.view===view;b.classList.toggle("active",current);if(b.classList.contains("nav"))b.setAttribute("aria-current",current?"page":"false")});
  if(updateHash) history.replaceState(null,"","#"+view);
  menu.hidden=true;toggle.setAttribute("aria-expanded","false");
  window.scrollTo({top:0,behavior:"smooth"});
}
buttons.forEach(b=>b.addEventListener("click",()=>show(b.dataset.view)));
toggle.addEventListener("click",()=>{menu.hidden=!menu.hidden;toggle.setAttribute("aria-expanded",String(!menu.hidden))});
window.addEventListener("hashchange",()=>show(location.hash.slice(1),false));
show(location.hash.slice(1)||"start",false);
