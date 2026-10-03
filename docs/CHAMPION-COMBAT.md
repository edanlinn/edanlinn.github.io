> Updated 2026-10-03: the shared sprite presentation described below has been replaced by exact selected hero/skin artwork with animated illustration effects. See [HERO-IDENTITY.md](HERO-IDENTITY.md) for current rendering and ladder synchronization.

# Original champion combat showcase

All 173 champion labels and metadata remain available. The arena now uses original generated animation artwork, not official combat sprites: three prototypes (light mage, armored swordsman, fox mage), each with ready, walk, wind-up, release, hit and defeated poses. Other champions map to a prototype and the UI explicitly explains that individual hero models and skin outfits are not reproduced.

Canvas animates movement, basic attacks, 12 archetype skills, projectiles, shields, rooted targets, hit effects, floating damage, camera shake, HP and defeat. Free exhibition mode opens all skills; learning mode follows level locks. Automatic combat only selects allowed skills. Animation HP and damage live only in the simulator and never change quiz answers, learning XP, individual ladder or team scores. Keyboard shortcuts only apply when canvas is focused. Hidden or offscreen stages pause simulation; reduced-motion disables camera shake.

Assets made with built-in image generation:
- assets/champion-combat-atlas-v1.png: transparent 1536×1024, six columns and three rows.
- assets/champion-arena-v1.png: original enchanted forest training courtyard.

Generation prompt set: polished hand-painted 3D-render-style original fantasy MOBA art; one light sorceress, one armored knight, one fox sorceress, six full-body animation poses each, consistent equipment and scale, right-facing, transparent, no UI or text. Arena prompt: original enchanted forest mossy stone training plaza, three-quarter side camera, open foreground for two fighters, rich cinematic lighting, no characters, text or HUD. Neither asset is an extracted official League combat resource.

Validation: JavaScript syntax and 63 simulation assertions for all 12 skills, cooldown and busy guards, shields, bounded HP, death, reset, movement and roots, allowed auto patterns and absence of persistent score writes. Live browser validation is performed after deployment.
