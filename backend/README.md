# Shared leaderboard setup

The weapon system works immediately with the existing local quiz state. Global rankings stay visibly offline until a real shared service is configured. No fake player records are supplied.

## Enable the shared service

1. Create or select a Supabase project under the owner's account.
2. Run `backend/rankings.sql` once in the Supabase SQL Editor. The table uses Row Level Security: anyone can read deliberately published aliases and game scores; an authenticated player can modify or withdraw only their own entry.
3. Enable anonymous sign-ins in Authentication settings. Anonymous players do not need to provide an email or password. Plan rate limiting / CAPTCHA before opening the service broadly; CAPTCHA would require adding a token widget to the sign-in flow.
4. Set the project's HTTPS URL and **publishable** key in `ranking-config.js`. This implementation accepts `https://<project-ref>.supabase.co` and `sb_publishable_...`. Do not put a secret key, service-role key, database password, or access token into GitHub or the browser.
5. Publish the config change, then verify with two independent browsers: opt into publishing two distinct nicknames; reload each list; each should see both scores. Updating or withdrawing player A must not change player B's entry. Verify logged-out and different-user writes are rejected through RLS.

The browser lazily loads Supabase JS 2.57.4 from jsDelivr only when the config is present. Rank order is XP descending, highest correct chain descending, UUID ascending for stable ties. Only the first 50 are shown, so players outside that list receive no guessed rank. Uploads are opt-in and manually initiated through “加入／更新排名”. A browser's anonymous identity does not provide cross-device account recovery. Daily puzzle missions count combo, vocabulary matching and ordering questions. Local XP, weapons and practice history remain local; the shared table is a public score summary.

## Verification limitations

No project URL / publishable key was available during implementation, so live persistence and RLS checks must run after the owner connects a project. Scores are self-reported by the browser. This is a learning/community leaderboard, not a server-verified competitive score system. Real competitive anti-cheat requires server-side question delivery and grading; never treat these client uploads as verified results.

## Weapon rules

- New objective correct answers add one to the chain; the same question may count only once per local calendar day.
- Any wrong objective answer resets the chain; retries of a question already counted that day do not add it again.
- Every current game question is automatically graded. Legacy short-answer self-assessments are kept in historical storage but are no longer offered in the game.
- Chains survive navigation, refresh and a change of day. Rewards start tracking at this release; prior correct totals are not interpreted as a historical chain.
- At 3 / 5 / 10 / 20, unlock mist / frost / sky / star weapons permanently in that browser. Players can equip any earned tier. Each tier appears as a staff, sword or bow according to their current profession.
- Resetting local practice history also resets local equipment; it does not withdraw an already published ranking. Use “退出排名” separately.

Official references: https://supabase.com/docs/guides/auth/auth-anonymous ; https://supabase.com/docs/guides/database/postgres/row-level-security ; https://supabase.com/docs/guides/getting-started/api-keys
