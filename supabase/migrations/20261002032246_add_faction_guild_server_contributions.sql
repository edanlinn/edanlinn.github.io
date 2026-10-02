
create table competition_private.factions (
 id text primary key,
 name text not null unique,
 description text not null
);
insert into competition_private.factions(id,name,description) values
 ('dawn','晨曦盟約','以秩序與守護建立穩健架構'),
 ('forest','月影守望','以探索與智慧連結雲端世界'),
 ('ember','灰燼誓約','以韌性與突破迎接艱難挑戰');
create table competition_private.guilds (
 id uuid primary key default gen_random_uuid(),
 name text not null check(char_length(btrim(name)) between 2 and 20),
 created_by uuid not null references competition_private.players(id),
 created_at timestamptz not null default now()
);
create unique index guilds_name_ci on competition_private.guilds(lower(btrim(name)));
alter table competition_private.players
 add column faction_id text references competition_private.factions(id),
 add column guild_id uuid references competition_private.guilds(id),
 add column faction_changed_at timestamptz,
 add column guild_changed_at timestamptz;
alter table competition_private.attempts
 add column faction_id text references competition_private.factions(id),
 add column guild_id uuid references competition_private.guilds(id);
create table competition_private.team_contributions (
 attempt_token uuid primary key references competition_private.attempts(token),
 player_id uuid not null references competition_private.players(id),
 faction_id text references competition_private.factions(id),
 guild_id uuid references competition_private.guilds(id),
 points integer not null default 20 check(points=20),
 credited_at timestamptz not null default now()
);
create index team_contributions_faction on competition_private.team_contributions(faction_id);
create index team_contributions_guild on competition_private.team_contributions(guild_id);
create index team_contributions_player on competition_private.team_contributions(player_id);
alter table competition_private.factions enable row level security;
alter table competition_private.guilds enable row level security;
alter table competition_private.team_contributions enable row level security;
revoke all on competition_private.factions,competition_private.guilds,competition_private.team_contributions from public,anon,authenticated;

create function competition_private.snapshot_team() returns trigger
 language plpgsql security definer set search_path='' as $body$
begin
 select faction_id,guild_id into new.faction_id,new.guild_id
 from competition_private.players where id=new.player_id;
 return new;
end $body$;
create trigger attempt_team_snapshot before insert on competition_private.attempts
 for each row execute function competition_private.snapshot_team();

create function competition_private.credit_team() returns trigger
 language plpgsql security definer set search_path='' as $body$
begin
 if not old.finished and new.finished and new.correct then
  insert into competition_private.team_contributions(attempt_token,player_id,faction_id,guild_id)
  values(new.token,new.player_id,new.faction_id,new.guild_id)
  on conflict(attempt_token) do nothing;
 end if;
 return new;
end $body$;
create trigger attempt_team_credit after update of finished on competition_private.attempts
 for each row execute function competition_private.credit_team();
revoke all on function competition_private.snapshot_team(),competition_private.credit_team() from public,anon,authenticated;

create function public.cloud_teams(action text,payload jsonb default '{}'::jsonb) returns jsonb
 language plpgsql security definer set search_path='' as $body$
declare
 uid uuid:=auth.uid();
 p competition_private.players%rowtype;
 gid uuid; faction text; guild_name text; search_term text;
 factions jsonb; guilds jsonb; guild_profile jsonb; mine jsonb;
begin
 if payload is null or jsonb_typeof(payload)<>'object' or octet_length(payload::text)>1024 then raise exception 'Invalid payload'; end if;
 if action not in ('leaderboard','profile','join_faction','create_guild','join_guild','leave_guild') then raise exception 'Unknown action'; end if;
 if action='leaderboard' then
  if (payload-'search')<>'{}'::jsonb or length(coalesce(payload->>'search',''))>40 then raise exception 'Invalid search'; end if;
 elsif action in ('profile','leave_guild') then
  if payload<>'{}'::jsonb then raise exception 'Invalid fields'; end if;
 elsif action='join_faction' then
  if (payload-'factionId')<>'{}'::jsonb then raise exception 'Invalid fields'; end if;
 elsif action='create_guild' then
  if (payload-'name')<>'{}'::jsonb then raise exception 'Invalid fields'; end if;
 elsif action='join_guild' then
  if (payload-'guildId')<>'{}'::jsonb then raise exception 'Invalid fields'; end if;
 end if;
 if action<>'leaderboard' then
  if uid is null then raise exception '請先加入個人天梯' using errcode='42501'; end if;
  select * into p from competition_private.players where id=uid for update;
  if not found or not p.joined then raise exception '請先加入個人天梯'; end if;
  if action='join_faction' then
   faction:=payload->>'factionId';
   if not exists(select 1 from competition_private.factions where id=faction) then raise exception '陣營不存在'; end if;
   if p.faction_id is distinct from faction then
    if p.faction_changed_at>now()-interval '7 days' then raise exception '更換陣營需間隔 7 天'; end if;
    update competition_private.players set faction_id=faction,faction_changed_at=now() where id=uid;
   end if;
  elsif action='create_guild' then
   if p.guild_id is not null then raise exception '請先離開目前公會'; end if;
   if p.guild_changed_at>now()-interval '24 hours' then raise exception '加入或建立公會需間隔 24 小時'; end if;
   guild_name:=btrim(payload->>'name');
   if guild_name is null or char_length(guild_name) not between 2 and 20 then raise exception '公會名稱需 2 至 20 字'; end if;
   if exists(select 1 from competition_private.guilds where lower(btrim(name))=lower(guild_name)) then raise exception '公會名稱已使用'; end if;
   insert into competition_private.guilds(name,created_by) values(guild_name,uid) returning id into gid;
   update competition_private.players set guild_id=gid,guild_changed_at=now() where id=uid;
  elsif action='join_guild' then
   gid:=(payload->>'guildId')::uuid;
   if p.guild_id is distinct from gid then
    if p.guild_id is not null then raise exception '請先離開目前公會'; end if;
    if p.guild_changed_at>now()-interval '24 hours' then raise exception '加入或建立公會需間隔 24 小時'; end if;
    perform 1 from competition_private.guilds where id=gid for update;
    if not found then raise exception '公會不存在'; end if;
    if (select count(*) from competition_private.players where guild_id=gid)>=50 then raise exception '公會已達 50 人上限'; end if;
    update competition_private.players set guild_id=gid,guild_changed_at=now() where id=uid;
   end if;
  elsif action='leave_guild' then
   update competition_private.players set guild_id=null where id=uid;
  end if;
 end if;
 select coalesce(jsonb_agg(to_jsonb(r) order by r.rank),'[]'::jsonb) into factions from (
  select f.id,f.name,f.description,
   coalesce(c.points,0) as points,coalesce(m.members,0) as members,
   row_number() over(order by coalesce(c.points,0) desc,f.id) as rank
  from competition_private.factions f
  left join (select faction_id,sum(points) as points from competition_private.team_contributions group by faction_id)c on c.faction_id=f.id
  left join (select faction_id,count(*) as members from competition_private.players where joined group by faction_id)m on m.faction_id=f.id
 )r;
 search_term:=coalesce(payload->>'search','');
 select coalesce(jsonb_agg(to_jsonb(r) order by r.rank),'[]'::jsonb) into guilds from (
  select ranked.* from (
   select g.id,g.name,coalesce(c.points,0) as points,coalesce(m.members,0) as members,
    row_number() over(order by coalesce(c.points,0) desc,g.created_at,g.id) as rank
   from competition_private.guilds g
   left join (select guild_id,sum(points) as points from competition_private.team_contributions group by guild_id)c on c.guild_id=g.id
   left join (select guild_id,count(*) as members from competition_private.players group by guild_id)m on m.guild_id=g.id
  ) ranked where search_term='' or strpos(lower(ranked.name),lower(search_term))>0
  order by ranked.rank limit 50
 )r;
 select * into p from competition_private.players where id=uid;
 if found and p.guild_id is not null then
  select jsonb_build_object('id',g.id,'name',g.name,'points',
   (select coalesce(sum(points),0) from competition_private.team_contributions where guild_id=g.id),
   'members',(select count(*) from competition_private.players where guild_id=g.id))
  into guild_profile from competition_private.guilds g where g.id=p.guild_id;
 end if;
 mine:=jsonb_build_object('joined',coalesce(p.joined,false),'factionId',p.faction_id,'guild',guild_profile,
  'factionChangeAt',case when p.faction_changed_at is not null then p.faction_changed_at+interval '7 days' end,
  'guildChangeAt',case when p.guild_changed_at is not null then p.guild_changed_at+interval '24 hours' end,
  'factionContribution',(select coalesce(sum(points),0) from competition_private.team_contributions where player_id=uid and faction_id=p.faction_id),
  'guildContribution',(select coalesce(sum(points),0) from competition_private.team_contributions where player_id=uid and guild_id=p.guild_id));
 return jsonb_build_object('factions',factions,'guilds',guilds,'profile',mine);
end $body$;
revoke all on function public.cloud_teams(text,jsonb) from public;
grant execute on function public.cloud_teams(text,jsonb) to anon,authenticated;
