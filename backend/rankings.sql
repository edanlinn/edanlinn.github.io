-- Run once in your own Supabase project's SQL editor.
-- Only aliases and deliberately published, self-reported game stats are stored.
begin;
create table public.cloud_rankings (
 id uuid primary key references auth.users(id) on delete cascade,
 nickname text not null check (char_length(trim(nickname)) between 2 and 20),
 xp integer not null default 0 check (xp between 0 and 100000000),
 best_chain integer not null default 0 check (best_chain between 0 and 1000000),
 role text not null default 'mage' check (role in ('mage','paladin','ranger'))
);
alter table public.cloud_rankings enable row level security;
revoke all on public.cloud_rankings from anon, authenticated;
grant select on public.cloud_rankings to anon, authenticated;
grant insert, update, delete on public.cloud_rankings to authenticated;
create policy "Read public aliases and scores" on public.cloud_rankings
 for select to anon, authenticated using (true);
create policy "Publish own entry" on public.cloud_rankings
 for insert to authenticated with check ((select auth.uid()) = id);
create policy "Update own entry" on public.cloud_rankings
 for update to authenticated using ((select auth.uid()) = id)
 with check ((select auth.uid()) = id);
create policy "Withdraw own entry" on public.cloud_rankings
 for delete to authenticated using ((select auth.uid()) = id);
create index cloud_rankings_order on public.cloud_rankings(xp desc, best_chain desc, id asc);
commit;
