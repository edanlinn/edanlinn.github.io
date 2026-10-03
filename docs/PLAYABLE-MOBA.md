# Playable MOBA prototype

This replaces the previous animated artwork/card arena. The combat canvas uses a transparent 8-column × 4-row generated sprite atlas, `assets/moba-zed-naafiri-v1.png`, with idle, two run poses, wind-up, strike, cast, hit and death frames in front/back orientations for classic Zed and Naafiri. Sprites are newly generated fan art, not Riot engine/model assets. Unsupported collection heroes display a gate; they are never mapped to a different champion. Additional skins remain collection artwork until their own battle animation assets exist.

## Controls and match

- Select Zed or Naafiri and press Start. Right click moves; left click an enemy attacks and chases into range. Touch uses ground/enemy taps.
- QWER buttons/keys select a skill. The next click confirms the aimed point or hero target; Esc cancels. A selects attack move, S stops, D targets Flash, F heals, B channels recall, Space pauses. Keyboard commands are scoped to the focused canvas.
- Real time position, collision, projectile segment tests, resources, wind-ups and cooldowns determine outcomes. Rock obstacles use a small A* navigation grid. Unit separation prevents stacks. Leaving the stage or hiding the tab pauses the match.
- Minion waves spawn every 12 seconds, attack enemy units, then towers/nexuses. Towers prioritize minions/hounds until a nearby hero damages their allied champion. Nexus damage is blocked until its tower dies. Destroy the enemy nexus to win.
- Last hits grant local gold, experience and CS. Match levels increase HP/attack; the base heals and supports a three-item shop. Hero deaths respawn after seven seconds. The AI farms, fights, casts and retreats; auto demonstration delegates the player's controls to AI.

## Champion mechanics

Zed has piercing shurikens from his body and existing shadows; W places a temporary shadow and can swap positions; E applies nearby damage/slow from the body/shadows; R targets a hero, briefly becomes untargetable, relocates and applies a delayed mark based on accumulated damage. Low health attacks gain a periodic passive bonus.

Naafiri has a recastable bleeding dagger (second hit amplifies damage), temporary pack empowerment/untargetability, a directional dash that recalls/heals packmates, and a targeted channeled pursuit with a kill-triggered recast and second-cast shield. Packmates follow and attack her targets.

Skill naming/order follows the pinned Data Dragon 16.19.1 champion metadata; Naafiri's W is pack empowerment and R is targeted pursuit. The champion web page may show older W/R ordering. Damage, resource costs, ranges, cooldowns, movement, levels and items are deliberately simplified for this prototype; this is not a reproduction of Riot's engine or competitive balance.

## Fair scoring boundary

The simulation is local single player versus AI. Combat gold, XP and wins exist only within the current match. There is no combat multiplayer server or combat leaderboard. Existing server-validated learning competition, daily 100-question limit and team score functions are not touched. `moba.js` contains no local storage, quiz state writes or competition RPCs.

## Validation

`node site/verify-moba.cjs` verifies skill hits/misses, cooldowns/resource guards, shadow swaps/expiry, mark accumulation/explosion, hound recasts/bleed/untargetability, dashes, tower aggro, nexus protection/victory, death/respawn, pathfinding, waves, last hits, shop, recall cancellation, pause and two complete AI matches. Browser QA verifies asset rendering and UI controls after deployment.

## Asset prompt

Built-in imagegen generated a transparent 1536 × 1024 atlas with 8 columns and 4 rows: recognizable classic masked armored Zed in rows 1–2 and quadrupedal blade hound Naafiri in rows 3–4; southeast/northwest orientation per pair; columns idle, run-left, run-right, wind-up, attack, cast, hurt, defeated. Full bodies, equal safe cells, no portrait cards, scenery, letters or grid lines. The original generated PNG is preserved and copied unchanged to the project asset path.


## 2026-10-03 controls and practice update

Desktop QWER and D quick-cast toward the pointer by default. Shift+skill previews for click confirmation; disabling quick cast restores normal aiming. Touch skill buttons retain click-to-aim. Commands require focused canvas and ignore repeat/control/meta/alt events.

Practice mode resets the match, disables enemy AI, minion waves and tower attacks, and places a stationary 10,000-HP champion dummy. R can target it. Actual hits, bleed, marks and player-owned pack damage count toward cumulative damage/hit events. DPS divides damage by simulation seconds since first hit (minimum one second), including idle time. Death refills the dummy without awarding gold, XP or kills. Reset clears statistics and transient effects while preserving run/pause state. Optional unlimited resource/cooldown applies only in practice. Switching modes creates a fresh match. Simulation is still local and never writes learning or ladder scores.

`assets/moba-directions-v2.png` is an original, transparent 8-by-8 generated atlas. Columns: E, SE, S, SW, W, NW, N, NE. Rows: Zed idle/run-left/run-right/cast, then Naafiri same. Canvas uses actual image width/height divided by eight (1254 square), not assumed prompt pixels. Directional idle, walking and cast/attack poses use this atlas; the previous atlas is retained for defeated poses. Only two stride frames per direction, not original League animation fidelity.

Generated with the built-in imagegen tool using the existing classic-character atlas as identity reference. Final prompt:

```
Use case: identity-preserve. Create a transparent GAME TURNAROUND / WALK SPRITE SHEET. Reference only character design from attached sheet: masked red black steel ninja Zed and quadrupedal red black blade dog Naafiri. IMPORTANT change layout completely: EXACT 8 columns and EXACT 8 rows =64 individual isolated full body sprites. Canvas1536x1536 square. Every cell192x192, foot center(96,170) within cell, full body occupies only140x145 for margin. COLUMN DIRECTION, consistent for EVERY ROW: column1 EAST looking RIGHT in side profile; column2 SOUTHEAST looking down-right; column3 SOUTH facing FRONT toward viewer; column4 SOUTHWEST looking down-left; column5 WEST looking LEFT in side profile; column6 NORTHWEST looking up-left rear-three-quarter; column7 NORTH BACK fully away from viewer; column8 NORTHEAST looking up-right rear-three-quarter. Eight DIFFERENT headings, no duplicated front/back angles. Exact ROW ACTION: row1 Zed standing idle; row2 Zed walk stride left leg forward; row3 Zed walk stride right leg forward; row4 Zed crouched casting forearm blade; row5 Naafiri standing idle; row6 Naafiri running forelegs forward; row7 Naafiri running hindlegs forward; row8 Naafiri crouched pouncing attack. Fixed overhead45degree camera, same character scale for all poses. Each entire sprite fully INSIDE its own square. No border, no grid lines, no labels, no shadow, no environment, no gradient, true transparent alpha background. Handpainted detailed game art. Zed is humanoid steel masked armor red scarf, Naafiri is FOUR LEGGED blade hound. Turn the ENTIRE torso AND head AND legs to correct heading, not just head. This is a rigid 8x8 game atlas, not a poster.
```
