# Bank cross-Region DR learning campaign

Six stages: disaster scope, strategy matching, dependencies, planned cutover ordering, RPO/RTO arithmetic, integrated architecture. Each has a distinct remedial question. Objective controls only: single/multiple choice, field matching, reorder by drag or keyboard-accessible up/down buttons. Explanation must be acknowledged before advancing. Wrong answers remain at the same defense and require the alternate scenario.

Questions register in the existing local quizBank under Architecture with stable DR-WAR-* IDs. recordQuizResult supplies shared local XP, errors and spaced review; same-question/day reward rules remain unchanged. Map node 0 (Architecture) locates campaign errors. Correcting a related scenario does not delete the original error; existing cross-day success rules apply. Local checkpoints persist in edan-dr-campaign-v1 and survive reload and hero changes.

Learning mode is the default arena mode. Reading freezes the battlefield and player combat inputs are blocked. Accepted correct answers play the corresponding hero skill and lower story defense health; wrong answers play a defense effect. Animation has a wall-clock completion fallback, so background throttling cannot lock the Next button. Generation tokens prevent delayed effects from affecting a restarted campaign. AI match and practice dummy remain available as separate modes. No multiplayer combat is introduced.

This is a LOCAL practice campaign. It never calls competitionCall or RPC, grants no cloud/individual/faction/guild score, and does not change server daily issuance limits (100). Existing online Fair Challenge remains server validated. Story defense damage is presentation, not score. Saved local progress is not anti-cheat protected and never uploaded.

Sources checked 2026-10-04: https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html ; https://aws.amazon.com/blogs/architecture/disaster-recovery-dr-architecture-on-aws-part-iii-pilot-light-and-warm-standby/ . Strategy names do not promise RTO/RPO. Ordering tasks explicitly concern the stated approved planned-cutover Runbook, not all outage procedures.

Validation: node site/verify-campaign.cjs (84 model/content/lifecycle checks); node site/verify-moba.cjs (95 gameplay/render checks). Live browser QA covers start, wrong/remedial flow, matching, ordering, final completion, checkpoint reload, shared error record and restoring normal arena controls.
