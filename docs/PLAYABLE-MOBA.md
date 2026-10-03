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
