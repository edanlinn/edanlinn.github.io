-- Add cosmetic hero identity without changing competition scoring or attempts.
create table if not exists competition_private.champions (
 id text primary key
);
create table if not exists competition_private.player_champions (
 player_id uuid primary key references competition_private.players(id) on delete cascade,
 champion_id text not null references competition_private.champions(id)
);
alter table competition_private.champions enable row level security;
alter table competition_private.player_champions enable row level security;
revoke all on competition_private.champions, competition_private.player_champions from public, anon, authenticated;

insert into competition_private.champions(id) values
 ('Aatrox'),
 ('Ahri'),
 ('Akali'),
 ('Akshan'),
 ('Alistar'),
 ('Ambessa'),
 ('Amumu'),
 ('Anivia'),
 ('Annie'),
 ('Aphelios'),
 ('Ashe'),
 ('AurelionSol'),
 ('Aurora'),
 ('Azir'),
 ('Bard'),
 ('Belveth'),
 ('Blitzcrank'),
 ('Brand'),
 ('Braum'),
 ('Briar'),
 ('Caitlyn'),
 ('Camille'),
 ('Cassiopeia'),
 ('Chogath'),
 ('Corki'),
 ('Darius'),
 ('Diana'),
 ('Draven'),
 ('DrMundo'),
 ('Ekko'),
 ('Elise'),
 ('Evelynn'),
 ('Ezreal'),
 ('Fiddlesticks'),
 ('Fiora'),
 ('Fizz'),
 ('Galio'),
 ('Gangplank'),
 ('Garen'),
 ('Gnar'),
 ('Gragas'),
 ('Graves'),
 ('Gwen'),
 ('Hecarim'),
 ('Heimerdinger'),
 ('Hwei'),
 ('Illaoi'),
 ('Irelia'),
 ('Ivern'),
 ('Janna'),
 ('JarvanIV'),
 ('Jax'),
 ('Jayce'),
 ('Jhin'),
 ('Jinx'),
 ('Kaisa'),
 ('Kalista'),
 ('Karma'),
 ('Karthus'),
 ('Kassadin'),
 ('Katarina'),
 ('Kayle'),
 ('Kayn'),
 ('Kennen'),
 ('Khazix'),
 ('Kindred'),
 ('Kled'),
 ('KogMaw'),
 ('KSante'),
 ('Leblanc'),
 ('LeeSin'),
 ('Leona'),
 ('Lillia'),
 ('Lissandra'),
 ('Locke'),
 ('Lucian'),
 ('Lulu'),
 ('Lux'),
 ('Malphite'),
 ('Malzahar'),
 ('Maokai'),
 ('MasterYi'),
 ('Mel'),
 ('Milio'),
 ('MissFortune'),
 ('MonkeyKing'),
 ('Mordekaiser'),
 ('Morgana'),
 ('Naafiri'),
 ('Nami'),
 ('Nasus'),
 ('Nautilus'),
 ('Neeko'),
 ('Nidalee'),
 ('Nilah'),
 ('Nocturne'),
 ('Nunu'),
 ('Olaf'),
 ('Orianna'),
 ('Ornn'),
 ('Pantheon'),
 ('Poppy'),
 ('Pyke'),
 ('Qiyana'),
 ('Quinn'),
 ('Rakan'),
 ('Rammus'),
 ('RekSai'),
 ('Rell'),
 ('Renata'),
 ('Renekton'),
 ('Rengar'),
 ('Riven'),
 ('Rumble'),
 ('Ryze'),
 ('Samira'),
 ('Sejuani'),
 ('Senna'),
 ('Seraphine'),
 ('Sett'),
 ('Shaco'),
 ('Shen'),
 ('Shyvana'),
 ('Singed'),
 ('Sion'),
 ('Sivir'),
 ('Skarner'),
 ('Smolder'),
 ('Sona'),
 ('Soraka'),
 ('Swain'),
 ('Sylas'),
 ('Syndra'),
 ('TahmKench'),
 ('Taliyah'),
 ('Talon'),
 ('Taric'),
 ('Teemo'),
 ('Thresh'),
 ('Tristana'),
 ('Trundle'),
 ('Tryndamere'),
 ('TwistedFate'),
 ('Twitch'),
 ('Udyr'),
 ('Urgot'),
 ('Varus'),
 ('Vayne'),
 ('Veigar'),
 ('Velkoz'),
 ('Vex'),
 ('Vi'),
 ('Viego'),
 ('Viktor'),
 ('Vladimir'),
 ('Volibear'),
 ('Warwick'),
 ('Xayah'),
 ('Xerath'),
 ('XinZhao'),
 ('Yasuo'),
 ('Yone'),
 ('Yorick'),
 ('Yunara'),
 ('Yuumi'),
 ('Zaahen'),
 ('Zac'),
 ('Zed'),
 ('Zeri'),
 ('Ziggs'),
 ('Zilean'),
 ('Zoe'),
 ('Zyra')
on conflict(id) do nothing;

create or replace function competition_private.champion_handle(action text, payload jsonb)
returns jsonb language plpgsql security definer set search_path='' as $$
declare
 uid uuid:=auth.uid(); result jsonb; hero text; entries jsonb;
begin
 if action in ('join','appearance') then
  if uid is null then raise exception 'Authentication required' using errcode='42501'; end if;
  if payload is null or jsonb_typeof(payload)<>'object' or octet_length(payload::text)>16384 then raise exception 'Invalid payload'; end if;
  hero:=payload->>'champion';
  if action='appearance' and (payload-'champion')<>'{}'::jsonb then raise exception 'Unsupported appearance fields'; end if;
  if (action='appearance' or payload ? 'champion') and
    (hero is null or not exists(select 1 from competition_private.champions where id=hero)) then
   raise exception 'Unknown champion';
  end if;
  if action='appearance' then
   perform 1 from competition_private.players where id=uid and joined for update;
   if not found then raise exception 'Join competition first'; end if;
  else
   result:=competition_private.handle(action,payload-'champion');
  end if;
  if hero is not null then
   insert into competition_private.player_champions(player_id,champion_id) values(uid,hero)
    on conflict(player_id) do update set champion_id=excluded.champion_id;
  end if;
  if action='appearance' then return jsonb_build_object('champion_id',hero); end if;
 else
  result:=competition_private.handle(action,payload);
 end if;
 if action='leaderboard' then
  select coalesce(jsonb_agg(e.value || jsonb_build_object('champion_id',c.champion_id) order by e.ordinality),'[]'::jsonb)
   into entries from jsonb_array_elements(result->'rows') with ordinality e(value,ordinality)
   left join competition_private.player_champions c on c.player_id=(e.value->>'id')::uuid;
  return jsonb_set(result,'{rows}',entries);
 elsif action in ('join','profile','withdraw') then
  select champion_id into hero from competition_private.player_champions where player_id=uid;
  return result || jsonb_build_object('champion_id',hero);
 end if;
 return result;
end; $$;
revoke all on function competition_private.champion_handle(text,jsonb) from public;
grant execute on function competition_private.champion_handle(text,jsonb) to anon,authenticated;
create or replace function public.cloud_competition(action text,payload jsonb default '{}'::jsonb)
returns jsonb language sql security invoker set search_path='' as $$
 select competition_private.champion_handle(action,payload);
$$;
