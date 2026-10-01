const fs=require('fs'),vm=require('vm'),path=require('path');
const root=path.join(__dirname,'..');
const context={window:{}};vm.createContext(context);vm.runInContext(fs.readFileSync(path.join(root,'data.js'),'utf8'),context);
const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
const extended=vm.runInContext(app.slice(app.indexOf('const extendedQuizBank ='),app.indexOf('const quizBank ='))+';extendedQuizBank',context);
const bank=[...context.window.CLOUD_SA_DATA.quizBank,...extended];
const quote=s=>"'"+s.replaceAll("'","''")+"'";
const rows=bank.map(q=>{
 const type=q.type||'single',body={id:q.id,type,question:q.question,category:q.category};
 for(const key of ['options','items','labels'])if(q[key])body[key]=q[key];
 if(q.fields)body.fields=q.fields.map(({label,options})=>({label,options}));
 let answer=type==='combo'?q.fields.map(f=>f.answer):q.answer;
 if(type==='multi')answer=[...answer].sort((a,b)=>a-b);
 return '('+[quote(q.id),quote(JSON.stringify(body))+'::jsonb',quote(JSON.stringify(answer))+'::jsonb',quote(q.explanation)].join(',')+')';
});
fs.writeFileSync(path.join(__dirname,'competition-questions.sql'),'-- Current practice question seed for server scoring. Answers are not sent by the question API.\n-- This source is public; server scoring does not prevent consulting published solutions.\nbegin;\ninsert into competition_private.questions(id,body,answer,explanation) values\n'+rows.join(',\n')+'\non conflict(id) do update set body=excluded.body,answer=excluded.answer,explanation=excluded.explanation;\ncommit;\n');
console.log('Seeded '+rows.length+' questions; payloads contain no answer or explanation.');
