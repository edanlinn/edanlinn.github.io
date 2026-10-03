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


## 2026-10-03 Rift visual pass

Replaces placeholder terrain with original painted forest/river/bridge art, world structures and minions with transparent original sprites, and text-only controls with champion portrait and Data Dragon skill icons from the existing pinned 16.19.1 metadata. Existing eight-direction hero sprites remain independent actors on top of the map. Original runtime simulation still handles movement, attacks, projectile collision, abilities, tower aggro and victory; terrain is a render layer, not a battle screenshot.

Live object atlas columns use inspected nonuniform source bounds: tower 0–370, nexus 385–855, melee 860–1230, caster 1235–1536; rows are blue/red halves. Source bounds scale with natural image dimensions. Defeated buildings render rubble. Structures and two rock collision anchors were aligned to the painted map; collision bodies and AI remain the existing simple prototype, not a complete collision mesh of every decorative tree. 95 gameplay/input/practice/render checks pass, including full AI matches and inspected atlas crop bounds. Map overview uses the same terrain with actual live unit positions.

The HUD adds bronze framing, icon skill slots and clearer cooldown badges; mobile keeps four skill buttons and touch aiming. Asset load failure is displayed instead of silently showing an endless loading status.

Project asset paths: `assets/moba-terrain-v3.png`, `assets/moba-world-objects-v3.png`. Both generated with the built-in imagegen tool, originals copied unchanged into the project. Prompts:

Terrain:
```
Use case: stylized-concept. Asset type: premium 2D MOBA game arena terrain background, 16:9 landscape 1536x864. A richly detailed professional handpainted fantasy battle arena seen from a fixed overhead 45-degree game camera, matching classic masked ninja / blade hound fantasy champions. Entire small map visible, no horizon, no tilted poster camera. One continuous ancient stone lane runs from southwest (8% x,83% y) to northeast (92% x,17% y), about 12% canvas-height wide, shallow curve, weathered irregular stone slabs, intricate carved runes, grass creeping through cracks, lane clear and visually playable. A clear turquoise river flows from (38%,0%) through (50%,48%) to (66%,100%), UNDER a beautiful worn stone bridge at the central crossing, gentle waterfalls/foam and translucent water with pebbles. Rich forest cliffs and shrubs clustered around the perimeter only; lush emerald grass, sculpted mossy rocks, detailed ferns, roots, flowering plants, atmospheric shafts of light, soft deep shadows, blue magic particles sparingly at map edges. Composition deliberately leaves clear open ground around gameplay anchors (28%,65%) and (72%,36%) for towers and (8%,83%) and (92%,17%) for bases, empty carved circular stone foundations there but NO buildings/crystals/units. Four prominent mossy rock clusters centered at (30%,28%, radius5%width), (70%,74%,radius5%), (52%,18%,radius3.5%), (48%,87%,radius3.5%). Accessible open ground across central lane and neighboring mid-map (38%,50%) to (56%,50%). Sophisticated painterly 3D-like materials, high detail, moody cinematic fantasy game quality, saturated but restrained teal greens and aged warm stone, NO flat triangles, NO geometric placeholder trees, NO outlines, NO grid, NO text, NO HUD, NO characters, NO minions, NO towers. Readable ground with dark soft edges and brighter central playable area, careful ambient occlusion and depth.
```
World objects:
```
Use case: stylized-concept. Asset type: transparent 2D fantasy MOBA game world object atlas. Create a premium richly detailed handpainted 3D-like game sprite sheet EXACT 4 columns by 2 rows, canvas1536x1024, each cell384x512. All individual sprites fully inside their cells with transparent margins and a consistent ground foot anchor at x192 y450. Overhead45degree game camera, no environment, no floor, no text, no grid, no shadow blobs, genuinely transparent alpha background. Column1: imposing carved ancient stone defensive tower, ornate bronze armor trim, winglike sculpted sides, glowing large crystal socket on its summit, elegant medieval game architecture, single whole building, NOT simple cylinder. Column2: magical nexus structure with a large floating crystal held by three ornate ancient stone claws on a low circular rune-ring base, full building. Column3: small armored melee minion footsoldier, big round helmet, heavy shoulder armor, sword and sturdy shield, miniature readable silhouette, facing northeast away-right; full body. Column4: ranged minion robed armored caster with hood, bright glowing staff, full body facing northeast. Row1 ALL blue allied variants: cyan crystal and blue/bronze/stone with cool glowing highlights. Row2 ALL red enemy variants: crimson crystal and red/black/bronze/stone, foot soldiers facing southwest toward-left. Preserve structures consistent shape across team variants. Tower and nexus fill approx260x400 within cell. Both minion sprites fill200x280 within cell, still foot anchor same y450 so cropped cell consumer works consistently. Fine material detail, polished fantasy game asset quality, designed to match a lush dark emerald fantasy arena and red/black ninja champions. No humanoid heroes, no background, nothing crossing cell boundaries.
```
