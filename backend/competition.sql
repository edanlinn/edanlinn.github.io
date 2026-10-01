-- Install in Supabase SQL Editor as project owner; not applied by this file alone.
begin;
create schema if not exists competition_private;
revoke all on schema competition_private from public;
create table if not exists competition_private.players (
 id uuid primary key references auth.users(id) on delete cascade,
 nickname text not null check (char_length(nickname) between 2 and 20),
 role text not null check (role in ('mage','paladin','ranger')),
 joined boolean not null default true,
 xp integer not null default 0 check (xp >= 0),
 chain integer not null default 0 check (chain >= 0),
 best_chain integer not null default 0 check (best_chain >= 0)
);
create table if not exists competition_private.questions (
 id text primary key,
 body jsonb not null,
 answer jsonb not null,
 explanation text not null
);
create table if not exists competition_private.attempts (
 token uuid primary key default gen_random_uuid(),
 player_id uuid not null references competition_private.players(id) on delete cascade,
 question_id text not null references competition_private.questions(id),
 day date not null,
 issued_at timestamptz not null default now(),
 expires_at timestamptz not null default now() + interval '10 minutes',
 finished boolean not null default false,
 correct boolean,
 unique(player_id, day, question_id)
);
alter table competition_private.players enable row level security;
alter table competition_private.questions enable row level security;
alter table competition_private.attempts enable row level security;
revoke all on all tables in schema competition_private from public, anon, authenticated;
create index if not exists competition_players_rank on competition_private.players(xp desc,best_chain desc,id);

-- A privileged handler is required because clients cannot read answer keys or write scores.
-- Auth identity is derived from the validated JWT, never from request payloads.
create or replace function competition_private.handle(action text, payload jsonb)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
 uid uuid := auth.uid();
 today date := (now() at time zone 'Asia/Taipei')::date;
 p competition_private.players%rowtype;
 a competition_private.attempts%rowtype;
 q competition_private.questions%rowtype;
 response jsonb; entries jsonb; my_rank bigint; actual jsonb; ok boolean;
 used integer; nick text; role_name text;
begin
 if action = 'leaderboard' then
  select coalesce(jsonb_agg(to_jsonb(r)), '[]'::jsonb) into entries from
  (select row_number() over(order by xp desc,best_chain desc,id) as rank,
   id,nickname,role,xp,best_chain from competition_private.players where joined
   order by xp desc,best_chain desc,id limit 50) r;
  select r.rank into my_rank from
   (select id,row_number() over(order by xp desc,best_chain desc,id) as rank
    from competition_private.players where joined) r where r.id=uid;
  return jsonb_build_object('rows',entries,'myRank',my_rank);
 end if;
 if uid is null then raise exception 'Authentication required' using errcode='42501'; end if;
 if jsonb_typeof(payload) <> 'object' or payload is null or octet_length(payload::text)>16384 then raise exception 'Invalid payload'; end if;
 if action='join' then
  if (payload - 'nickname' - 'role') <> '{}'::jsonb then raise exception 'Unsupported profile fields'; end if;
  nick:=btrim(payload->>'nickname'); role_name:=payload->>'role';
  if nick is null or char_length(nick) not between 2 and 20 or role_name is null or role_name not in ('mage','paladin','ranger') then raise exception 'Invalid profile'; end if;
  insert into competition_private.players(id,nickname,role) values(uid,nick,role_name)
   on conflict(id) do update set nickname=excluded.nickname,role=excluded.role,joined=true;
 end if;
 select * into p from competition_private.players where id=uid for update;
 if not found then raise exception 'Join competition first'; end if;
 if action='withdraw' then
  if payload<>'{}'::jsonb then raise exception 'Invalid withdrawal'; end if;
  update competition_private.players set joined=false where id=uid;
 elsif action='next' then
  if payload<>'{}'::jsonb then raise exception 'Invalid question request'; end if;
  if not p.joined then raise exception 'Join competition first'; end if;
  -- Resuming a live attempt returns the same question; abandoning cannot reveal another.
  select * into a from competition_private.attempts where player_id=uid and not finished
   order by issued_at limit 1 for update;
  if found and a.expires_at <= now() then
   update competition_private.attempts set finished=true,correct=false where token=a.token;
   update competition_private.players set chain=0 where id=uid;
   a.token:=null;
  end if;
  if a.token is null then
   select count(*) into used from competition_private.attempts where player_id=uid and day=today;
   if used>=10 then return jsonb_build_object('done',true,'message','今日 10 題競賽已完成'); end if;
   -- Every player gets the same daily question order, decided by the server clock.
   select qu.* into q from competition_private.questions qu where not exists
    (select 1 from competition_private.attempts atp where atp.player_id=uid and atp.day=today and atp.question_id=qu.id)
    order by md5(qu.id||today::text),qu.id limit 1;
   if not found then return jsonb_build_object('done',true,'message','今日題目已完成'); end if;
   insert into competition_private.attempts(player_id,question_id,day) values(uid,q.id,today) returning * into a;
  else
   select * into q from competition_private.questions where id=a.question_id;
  end if;
  return jsonb_build_object('token',a.token,'question',q.body,'expiresAt',a.expires_at);
 elsif action='submit' then
  if (payload - 'token' - 'answer')<>'{}'::jsonb or not (payload ? 'answer') then raise exception 'Invalid answer fields'; end if;
  select * into a from competition_private.attempts where token=(payload->>'token')::uuid and player_id=uid for update;
  if not found then raise exception 'Unknown attempt' using errcode='42501'; end if;
  select * into q from competition_private.questions where id=a.question_id;
  if not a.finished then
   actual:=payload->'answer';
   if q.body->>'type'='multi' and jsonb_typeof(actual)='array' then
    select coalesce(jsonb_agg(v order by v),'[]'::jsonb) into actual from jsonb_array_elements(actual) v;
   end if;
   ok:=a.expires_at>now() and coalesce(actual=q.answer,false);
   update competition_private.attempts set finished=true,correct=ok where token=a.token;
   update competition_private.players set xp=xp+case when ok then 20 else 0 end,
    chain=case when ok then chain+1 else 0 end,
    best_chain=greatest(best_chain,case when ok then chain+1 else 0 end) where id=uid;
   a.correct:=ok;
  end if;
  select * into p from competition_private.players where id=uid;
  return jsonb_build_object('correct',a.correct,'answer',q.answer,'explanation',q.explanation,'xp',p.xp,'chain',p.chain,'bestChain',p.best_chain);
 elsif action not in ('join','profile','withdraw') then
  raise exception 'Unknown action';
 end if;
 select * into p from competition_private.players where id=uid;
 select count(*) into used from competition_private.attempts where player_id=uid and day=today;
 return jsonb_build_object('nickname',p.nickname,'role',p.role,'joined',p.joined,'xp',p.xp,'chain',p.chain,'bestChain',p.best_chain,'todayCount',used,'day',today);
end; $$;
revoke all on function competition_private.handle(text,jsonb) from public;
grant usage on schema competition_private to anon, authenticated;
grant execute on function competition_private.handle(text,jsonb) to anon, authenticated;
-- This public invoker wrapper exposes only the validated handler, never the private tables.
create or replace function public.cloud_competition(action text,payload jsonb default '{}'::jsonb)
returns jsonb language sql security invoker set search_path = '' as $$
 select competition_private.handle(action,payload);
$$;
revoke all on function public.cloud_competition(text,jsonb) from public;
grant execute on function public.cloud_competition(text,jsonb) to anon, authenticated;
-- Disable the legacy endpoint if it was installed earlier: it accepts arbitrary client XP.
do $$ begin
 if to_regclass('public.cloud_rankings') is not null then
  execute 'revoke insert,update,delete on public.cloud_rankings from anon,authenticated';
 end if;
end $$;
commit;
