> Updated 2026-10-03: the illustration arena below has now been replaced by the playable sprite MOBA described in [PLAYABLE-MOBA.md](PLAYABLE-MOBA.md). Ladder synchronization remains unchanged. This document records the prior identity repair.

# Hero identity correction

The previous arena mapped all 173 champions to three generated character sheets. This made Zed appear as a fox sorceress and Naafiri as an armored human. The arena now renders the selected champion's exact Data Dragon loading artwork and selected canonical skin number. The opponent renders its own classic artwork. Switching either identity resets the simulated duel. Missing images show a load error instead of substituting another character. Late image responses cannot replace the current selection.

Artwork moves and reacts to casts and hits; projectiles, damage, shields and cooldowns remain original demo effects. This is an animated illustration display, not champion-specific skeletal animation or original League combat mechanics. The old generated atlas is no longer used by the arena.

Champion selection includes an explicit apply button so a single filtered search result can be selected even when the native select change event does not fire.

## Ladder

Apply `backend/champion-profiles.sql` after the existing competition backend. It adds a private 173-ID champion allowlist and a private cosmetic profile table. Existing scoring and question functions are unchanged. The public RPC delegates through a private, authenticated cosmetic wrapper; appearance writes permit only a validated champion ID for `auth.uid()`, and require an existing joined player. They accept no XP or arbitrary player ID. Both new tables have RLS and no client table privileges.

The ladder shows the saved hero instead of the legacy cosmic class. Existing players without a saved hero display “尚未設定英雄” until they return and their local choice syncs. Joined players' hero changes sync automatically, including on profile resume; joining sends the selected hero. Manual refresh retries failed synchronization. Existing ranks, XP, best chains, daily 100-question limit and team contributions are preserved.

## Verification

- `node site/verify-hero-identity.cjs`: 14 checks for player/opponent artwork, skin URL, stale loads, errors, legacy rows, escaping and score display.
- `node site/verify-battle.cjs`: 63 existing combat logic checks.
- `backend/verify-champion-profiles.sql`: transaction rolls back all test profile changes; verifies saved champion, leaderboard switching, score preservation, ID allowlist, payload whitelist, authentication and revoked table writes.
