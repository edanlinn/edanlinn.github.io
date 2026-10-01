const {PGlite}=require(process.env.COMPETITION_PGLITE_MODULE||'@electric-sql/pglite');
const fs=require('fs'),path=require('path'),assert=require('node:assert/strict');
(async()=>{
 const db=new PGlite();
 await db.exec(`create role anon;create role authenticated;create schema auth;create table auth.users(id uuid primary key);
 create function auth.uid() returns uuid language sql as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
 grant usage on schema auth to anon,authenticated;grant execute on function auth.uid() to anon,authenticated;`);
 await db.exec(fs.readFileSync(path.join(__dirname,'competition.sql'),'utf8'));
 await db.exec(fs.readFileSync(path.join(__dirname,'competition-questions.sql'),'utf8'));
 // Test-only questions leave unused items beyond the cap; the production seed is unchanged.
 await db.exec(`insert into competition_private.questions(id,body,answer,explanation)
 select 'cap-fixture-'||n, jsonb_build_object('id','cap-fixture-'||n,'type','single','question','Daily cap fixture','options',jsonb_build_array('correct','wrong')),
 '"correct"'::jsonb,'Test fixture' from generate_series(1,101) n;`);
 const alice='00000000-0000-0000-0000-000000000001',bob='00000000-0000-0000-0000-000000000002';
 await db.query('insert into auth.users values ($1),($2)',[alice,bob]);
 async function identity(id){await db.exec('reset role');await db.query("select set_config('request.jwt.claim.sub',$1,false)",[id||'']);await db.exec('set role '+(id?'authenticated':'anon'));}
 async function call(action,payload={}){return (await db.query('select public.cloud_competition($1,$2::jsonb) result',[action,JSON.stringify(payload)])).rows[0].result;}
 async function rejects(fn){await assert.rejects(fn);}
 await identity(null);assert.deepEqual((await call('leaderboard')).rows,[]);await rejects(()=>call('join',{nickname:'Alice',role:'mage'}));
 await identity(alice);await call('join',{nickname:'Alice',role:'mage'});
 await rejects(()=>call('join',{nickname:'Alice',role:'mage',xp:999999}));
 await rejects(()=>db.query('update competition_private.players set xp=999999'));
 await rejects(()=>db.query('select * from competition_private.questions'));
 let a=await call('next');assert.equal(a.token,(await call('next')).token);assert.equal('answer' in a.question,false);assert.equal('explanation' in a.question,false);assert.ok((a.question.fields||[]).every(f=>!('answer' in f)));
 await db.exec('reset role');let answer=(await db.query('select answer from competition_private.questions where id=$1',[a.question.id])).rows[0].answer;
 await identity(alice);let result=await call('submit',{token:a.token,answer});assert.equal(result.correct,true);assert.equal(result.xp,20);
 result=await call('submit',{token:a.token,answer});assert.equal(result.xp,20);assert.equal(result.chain,1);
 await rejects(()=>call('submit',{token:a.token,answer,xp:999999}));
 await identity(bob);await call('join',{nickname:'Bob',role:'paladin'});await rejects(()=>call('submit',{token:a.token,answer}));
 await identity(alice);a=await call('next');result=await call('submit',{token:a.token,answer:'wrong'});assert.equal(result.xp,20);assert.equal(result.chain,0);
 a=await call('next');await db.exec('reset role');await db.query("update competition_private.attempts set expires_at=now()-interval '1 second' where token=$1",[a.token]);answer=(await db.query('select answer from competition_private.questions where id=$1',[a.question.id])).rows[0].answer;
 await identity(alice);result=await call('submit',{token:a.token,answer});assert.equal(result.correct,false);assert.equal(result.xp,20);
 for(let i=3;i<100;i++){a=await call('next');assert.ok(a.token,'Attempt '+(i+1)+' must be available');await call('submit',{token:a.token,answer:'wrong'});}
 assert.equal((await call('next')).done,true);assert.equal((await call('profile')).todayCount,100);
 await call('withdraw');assert.equal((await call('leaderboard')).rows.length,1);await call('join',{nickname:'Alice',role:'mage'});assert.equal((await call('profile')).xp,20);assert.equal((await call('next')).done,true);
 await identity(null);const board=await call('leaderboard');assert.equal(board.rows[0].nickname,'Alice');assert.equal(board.rows[0].xp,20);
 await db.exec('reset role');
 const types=(await db.query("select distinct on(body->>'type') id,body,answer from competition_private.questions order by body->>'type',id")).rows;
 for(let i=0;i<types.length;i++){
  const qu=types[i],id='00000000-0000-0000-0000-'+String(100+i).padStart(12,'0');
  await db.exec('reset role');await db.query('insert into auth.users values($1)',[id]);await identity(id);await call('join',{nickname:'Type '+i,role:'mage'});
  await db.exec('reset role');const token=(await db.query("insert into competition_private.attempts(player_id,question_id,day) values($1,$2,(now() at time zone 'Asia/Taipei')::date) returning token",[id,qu.id])).rows[0].token;
  await identity(id);const ans=qu.body.type==='multi'?[...qu.answer].reverse():qu.answer;const graded=await call('submit',{token,answer:ans});assert.equal(graded.correct,true,qu.body.type);assert.equal(graded.xp,20);
 }
 await db.close();console.log('PASS: SQL installation; auth; table/answer-key denial; XP injection rejected; ownership; resume; all five question types; multi ordering; server grading; replay; wrong/expired chain reset; daily cap; withdrawal preserves score/cap; public ranking.');
})().catch(e=>{console.error(e);process.exit(1)});
