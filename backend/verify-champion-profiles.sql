-- Run after champion-profiles.sql. All profile changes roll back.
begin;
do $$
declare uid uuid; original jsonb; after_score jsonb; result jsonb;
begin
 select id,to_jsonb(p)-'nickname'-'role' into uid,original from competition_private.players p where joined order by id limit 1;
 if uid is null then raise exception 'An existing joined player is required for this verification'; end if;
 perform set_config('request.jwt.claim.sub',uid::text,true);
 result:=public.cloud_competition('appearance','{"champion":"Zed"}');
 if result->>'champion_id'<>'Zed' then raise exception 'Hero did not save'; end if;
 if public.cloud_competition('profile')->>'champion_id'<>'Zed' then raise exception 'Hero missing from profile'; end if;
 if not exists(select 1 from jsonb_array_elements(public.cloud_competition('leaderboard')->'rows') r where r->>'id'=uid::text and r->>'champion_id'='Zed') then raise exception 'Hero missing from leaderboard'; end if;
 perform public.cloud_competition('appearance','{"champion":"Naafiri"}');
 if public.cloud_competition('profile')->>'champion_id'<>'Naafiri' then raise exception 'Hero switch did not save'; end if;
 begin
  perform public.cloud_competition('appearance','{"champion":"not-a-champion"}');
  raise exception 'TEST_FAILED: invalid hero accepted';
 exception when others then if sqlerrm like 'TEST_FAILED:%' then raise; end if; end;
 begin
  perform public.cloud_competition('appearance','{"champion":"Zed","xp":999999}');
  raise exception 'TEST_FAILED: XP payload accepted';
 exception when others then if sqlerrm like 'TEST_FAILED:%' then raise; end if; end;
 begin
  perform public.cloud_competition('appearance','{"champion":"Zed","player_id":"00000000-0000-0000-0000-000000000000"}');
  raise exception 'TEST_FAILED: arbitrary player accepted';
 exception when others then if sqlerrm like 'TEST_FAILED:%' then raise; end if; end;
 select to_jsonb(p)-'nickname'-'role' into after_score from competition_private.players p where id=uid;
 if after_score<>original then raise exception 'Cosmetics changed competition data'; end if;
 perform set_config('request.jwt.claim.sub','',true);
 begin
  perform public.cloud_competition('appearance','{"champion":"Zed"}');
  raise exception 'TEST_FAILED: unauthenticated update accepted';
 exception when others then if sqlerrm like 'TEST_FAILED:%' then raise; end if; end;
 if has_table_privilege('authenticated','competition_private.player_champions','INSERT,UPDATE,DELETE') then raise exception 'Direct cosmetic table writes allowed'; end if;
 if has_table_privilege('authenticated','competition_private.players','INSERT,UPDATE,DELETE') then raise exception 'Direct score writes allowed'; end if;
end; $$;
select 'Hero profile, leaderboard, switching, score preservation, field whitelist, authentication and table privileges verified' as result;
rollback;
