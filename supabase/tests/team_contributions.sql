
begin;
do $test$
declare
 test_uid uuid:=gen_random_uuid(); profile jsonb; attempt jsonb; answer jsonb; result jsonb; test_gid uuid; test_token uuid; faction_points bigint; guild_points bigint; rejected boolean:=false;
begin
 insert into auth.users(id,aud,role,created_at,updated_at) values(test_uid,'authenticated','authenticated',now(),now());
 perform set_config('request.jwt.claim.sub',test_uid::text,true);
 perform set_config('request.jwt.claims',jsonb_build_object('sub',test_uid,'role','authenticated')::text,true);
 perform public.cloud_competition('join',jsonb_build_object('nickname','團體測試','role','mage'));
 perform public.cloud_teams('join_faction','{"factionId":"dawn"}'::jsonb);
 profile:=public.cloud_teams('create_guild',jsonb_build_object('name','測試'||substr(test_uid::text,1,8)));
 test_gid:=(profile->'profile'->'guild'->>'id')::uuid;
 attempt:=public.cloud_competition('next','{}'::jsonb);
 test_token:=(attempt->>'token')::uuid;
 select q.answer into answer from competition_private.questions q join competition_private.attempts a on a.question_id=q.id where a.token=test_token;
 update competition_private.players set faction_id='forest',guild_id=null where id=test_uid;
 result:=public.cloud_competition('submit',jsonb_build_object('token',test_token,'answer',answer));
 if result->>'correct'<>'true' or (result->>'xp')::int<>20 then raise exception 'Personal scoring regression'; end if;
 select sum(points) into faction_points from competition_private.team_contributions where player_id=test_uid and faction_id='dawn';
 select sum(points) into guild_points from competition_private.team_contributions where player_id=test_uid and guild_id=test_gid;
 if faction_points is distinct from 20::bigint or guild_points is distinct from 20::bigint then raise exception 'Team snapshot credit failed'; end if;
 result:=public.cloud_competition('submit',jsonb_build_object('token',test_token,'answer',answer));
 if (select count(*) from competition_private.team_contributions where player_id=test_uid)<>1 or (result->>'xp')::int<>20 then raise exception 'Duplicate credit'; end if;
 attempt:=public.cloud_competition('next','{}'::jsonb);test_token:=(attempt->>'token')::uuid;
 perform public.cloud_competition('submit',jsonb_build_object('token',test_token,'answer','"invalid"'::jsonb));
 if (select count(*) from competition_private.team_contributions where player_id=test_uid)<>1 then raise exception 'Wrong answer credited'; end if;
 begin perform public.cloud_teams('join_faction','{"factionId":"ember","xp":99999}'::jsonb); exception when others then rejected:=true; end;
 if not rejected then raise exception 'Injected points accepted'; end if;
 rejected:=false;
 begin perform public.cloud_teams('join_faction','{"factionId":"ember"}'::jsonb); exception when others then rejected:=true; end;
 if not rejected then raise exception 'Faction cooldown bypass'; end if;
 if (select xp from competition_private.players where id=test_uid)<>20 then raise exception 'Team mutation changed personal score'; end if;
 if pg_get_functiondef('competition_private.handle(text,jsonb)'::regprocedure) not like '%used>=100%' then raise exception 'Daily limit regression'; end if;
 if exists(select 1 from information_schema.role_table_grants where table_schema='competition_private' and table_name='team_contributions' and grantee in ('anon','authenticated')) then raise exception 'Client table access'; end if;
end $test$;
rollback;
select 'PASS: correct/incorrect answers, duplicate submit, team snapshot, separate personal XP, payload rejection, cooldown, private tables and daily limit; test data rolled back' as checks;
