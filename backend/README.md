# Server-scored online competition

The GitHub Pages frontend includes a separate daily competition. Local practice XP and weapons remain local and are never imported into the online ranking. The competition stays explicitly offline until Supabase is connected.

## Connect a Supabase project

1. In the project SQL Editor, run `competition.sql`, then `competition-questions.sql`. These files are not automatically installed by GitHub Pages. The former creates private tables and the validated `public.cloud_competition` RPC; the latter seeds the current 54 questions.
2. Enable anonymous sign-ins in Supabase Auth. Public nicknames and server-scored results are published only after the player opts in. No email/password is required, but an anonymous account cannot recover its identity on another browser.
3. In `ranking-config.js`, set the project's `https://<ref>.supabase.co` URL and `sb_publishable_...` key. Never publish service-role/secret keys, access tokens, or database passwords. No table grants or exposed-schema settings for `competition_private` are needed: keep it outside the exposed schemas.
4. Run Supabase security advisors. Inspect the private privileged handler: empty search_path, explicit identity checks for mutations, no direct client table access, restricted EXECUTE grants. The public wrapper uses SECURITY INVOKER.
5. Verify with two independent browsers: join, answer, reload, compare rankings, and withdraw. Confirm direct table writes and answer-key reads are rejected. Verify reconnect/replay does not add points twice. The local PostgreSQL verification is not a substitute for these production integration checks.

## Rules and trust boundary

- Every player receives the same daily question ordering, using the server's Asia/Taipei date.
- At most 10 attempts per player per day, +20 XP per correct answer; no retry for extra credit.
- Questions are issued with an owner-bound attempt token and ten-minute expiry. A pending question is resumed rather than replaced. Expired questions count as wrong and reset the chain.
- Answers and correct/incorrect outcomes are compared by PostgreSQL against a private answer key. The request contains no user ID, XP, or correctness claim.
- A row lock serializes each player's changes; an attempt is finalized once. Repeated or concurrent submissions cannot award duplicate XP.
- Joining accepts only nickname and profession. Withdrawing hides a profile, retaining verified score and daily cap so withdrawal cannot reset the competition.
- Ranking orders verified XP descending, best chain descending, UUID ascending. The service returns the actual player's rank even beyond the displayed top 50. The list refreshes every 30 seconds while the page is visible.
- `rankings.sql` is a legacy self-reported-score schema and must not be used for this competition. If present, the new setup revokes client mutation grants from its table. The new website never writes or reads that legacy table.

## Limits

This prevents editing browser storage/JavaScript or submitting arbitrary XP from changing server scores. It does not prevent multiple anonymous accounts, consulting public solutions, automated answering, or account/session theft. The seed source and practice explanations are public. Use privately maintained question banks, a recoverable identity provider, and abuse controls before running high-stakes or prize competitions.

## Reproducible checks

From the repository root:

```sh
node --check arena.js
node --check drag-quiz.js
node backend/build-question-seed.cjs
npm install --no-save --package-lock=false @electric-sql/pglite@0.5.8
node backend/verify-competition.cjs
```

The verification runs the actual SQL in embedded PostgreSQL with a mocked auth schema. It covers authentication, private table denial, score injection, owner isolation, resume, correct/wrong/expired grading, replay, daily cap, and withdrawal. It does not test live Supabase Auth, PostgREST, or production advisors.
