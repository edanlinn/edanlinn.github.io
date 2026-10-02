# League 2D showcase

Roster snapshot: all 173 champions in Riot Data Dragon 16.19.1 zh_TW champion.json. All can be selected and searched in Chinese or English; opponent selector includes the same roster.

Champion details load lazily at /data/{locale}/champion/{id}.json, with zh_TW/en_US fallback and six-second timeouts. Skin IDs are taken from metadata, never guessed. Classic plus the last three nonclassic metadata skins are shown with levels 1/3/5/10; ordering is metadata order, not verified release dates. Skills use actual spell names when metadata is available.

The stage is a stylized SVG paper puppet, using champion portraits and role-based weapons, not extracted official combat sprites or a reproduction of champion animations. New skins change portrait selection and stage accent hue. Q/W/E/R demonstrate projectile, shield, area and ultimate effects, hit response and counterattack. Automatic presentation pauses when the tab is hidden. No HP, combat winner, competitive rewards, answer changes or score mutations. Practice buttons are separate from animation controls.

Original cosmic customization UI, renderers and character atlas assets are removed. The avatar adapter only preserves the existing three backend role enum values, without migrating competition data.

Validation: Node syntax and 20 stubbed DOM/logic checks covering full unique roster, real recent skin IDs, thresholds, locked casts, score immutability, cancellation and removal of the cosmic toggle. Live browser QA follows deployment.
