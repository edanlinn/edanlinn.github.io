# Team competition

The cloud_teams RPC manages factions and public guilds (maximum 50 members). Its leaderboard returns independent faction and guild totals, plus the caller's current memberships and contributions.

A before-insert attempt trigger snapshots memberships when the server issues a question. An after-update trigger credits 20 points exactly once for each newly completed, correct server attempt. Credits stay with the original teams. Historical attempts are not backfilled. Personal scores, grading and the 100-attempt Taiwan-day limit remain in the original competition handler.

Faction changes require seven days between changes; joining or creating a guild requires 24 hours between joins. Guild departure keeps prior credits and does not reset the join cooldown. Each account can belong to one faction and one guild.

All tables remain in the private schema with RLS enabled and no anon/authenticated table grants. Clients cannot upload contribution amounts. Public names are escaped when rendered.

The rollback-only regression SQL checks grading, duplicate submission, membership snapshots, independent XP, rejected score fields and cooldown enforcement. It creates a temporary test identity within a transaction and rolls everything back. The live migration was applied with the matching migration version above.

The browser identity remains anonymous; this does not prevent creation of multiple accounts.
