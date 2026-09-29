const form=document.getElementById("intake-form");
const status=document.getElementById("form-status");
const params=new URLSearchParams(location.search);
if(["career","life","both"].includes(params.get("topic"))) form.elements.topic.value=params.get("topic");
form.addEventListener("submit",async event=>{
  event.preventDefault();
  if(!form.reportValidity()) return;
  const button=form.querySelector('button[type="submit"]');
  const values=Object.fromEntries(new FormData(form));
  const payload={...values,clarity:values.clarity?Number(values.clarity):null,consent:form.elements.consent.checked};
  button.disabled=true;button.textContent="送出中…";status.textContent="";
  try{
    const response=await fetch("https://edan-career-dialogue.edan14725836961.chatgpt.site/api/intake",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
    if(!response.ok){const result=await response.json().catch(()=>({}));throw new Error(result.error==="invalid_invite"?"邀請碼無效、過期或已使用。請向 Edan 索取新碼。":result.error==="missing_fields"?"請檢查必填欄位與邀請碼。":"暫時無法送出，請稍後再試。")}
    form.hidden=true;document.getElementById("success").hidden=false;window.scrollTo({top:0,behavior:"smooth"});
  }catch(error){status.textContent=error instanceof Error?error.message:"連線失敗，請稍後再試。";status.className="form-error";button.disabled=false;button.textContent="送出預訪表"}
});
