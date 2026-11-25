# AIRFLOW motion series

Lead with a situation the viewer can recognize. Give them enough time to see where work, authority, or feedback gets stuck. Then show one proposed change, the boundary that makes it workable, and how the people involved could tell whether it helped. Viewers should leave able to choose a first move for their own situation.

## What the sources support

The public Field Guide v0.4 defines the names, six families and short descriptions used on screen. The attached Playbook v0.3 provides the fuller tensions, mechanisms, boundaries, sources and example plays. All 28 playbook IDs are covered exactly once by the 24 public entries. The light and dark pattern sheets match the public labels, and the family sheet matches the six family names. The v0.4 field guide links to a v0.4 playbook that was absent from the attachments. The mapping below was checked against v0.3. Check it against the v0.4 playbook before publishing deep links.

| Public label | Playbook v0.3 cards |
| --- | --- |
| A Meaningful Horizon | 01 Name the Contribution + 02 A Clear Horizon |
| Make Local Agency Real | 09 Decide Near the Knowledge + 10 Make the Mandate Real |
| Many Eyes, One Question | 13 Many Eyes, One Question + 14 Invite the Contradiction |
| Make Room for Discovery | 25 Follow the Question + 26 Room to Play |

The public families also move **Make Room for No** from Direction to Agency and **Capacity Before Commitment** from Renewal to Direction. Use the public family in titles and navigation. Preserve the original card IDs in the production notes. **Practise Repair** is a restricted discussion topic. Cover structural responsibility and appropriate formal routes if it appears in the series.

## Release sequence

The first release can be an explainer and eight short episodes. Use two or three minutes per episode as a starting length. The signatures can stand alone, with one optional link to a useful neighbour. The six family collections can follow when viewers want more examples. Introduce the 3–6–9 framework in the explainer or a companion navigation card after the viewer has seen how to use a pattern.

| Episode | Work situation | What the motion shows |
| --- | --- | --- |
| How to use AIRFLOW | An AI-assisted draft is faster while checking takes longer | The same report travels from drafting to acceptance. An active feedback pattern and a balancing judgement pattern change the proposed workflow. |
| Keep the Why | A team inherits a decision and keeps reopening it | The rationale and review trigger travel with the decision in a Decision Record. |
| Make Local Agency Real | A local team waits for permission on a recurring decision | A Mandate Card puts one decision near the people with relevant knowledge and keeps an escalation path visible. |
| Protected Focus | A colleague doing demanding work gets interrupted by urgent requests | Routine work is queued, coverage takes urgent requests, and both paths reconnect. Show what the backup person absorbs. |
| Keep Useful Friction | A team wants to eliminate a slow checkpoint | A Fence Audit distinguishes a duplicate step from the check that protects a consequential outcome. |
| Keep Judgement in Practice | An AI-assisted report contains a plausible unsupported claim | A reviewer inspects the source, corrects the claim or pauses acceptance. The scene shows the time and authority that make each option possible. |
| Small Bets, Protected Downside | A team tries a new handover for one class of work | An Experiment Card limits the scope and shows who can stop it and where work goes if the trial stops. |
| Return the Gains | A meeting change appears to recover time | A comparison includes preparation and follow-up. The people involved decide where a verified gain goes. |
| Count the Wider Cost | A local improvement creates extra work downstream | The frame widens from the original team to the receiving team and their additional work. |

Use the public AI and work-conditions entry point alongside examples about focus, curiosity and shared creation. **Make Room for Discovery** paired with **Capacity Before Commitment** is a natural follow-up when teaching the deeper flourishing invitation. Show workplace conditions and subjective flow experiences in distinct scenes. Use biomimicry where a specific function helps pose a design question. Label the observed mechanism and its proposed transfer separately.

## Pilot and follow-through

The 40-second, silent prototype uses the public worked opening and Playbook v0.3 cards **07** and **12** (Play B). It tests a full visual explanation in miniature.

| Time | Beat |
| --- | --- |
| 00:00–00:06 | The first draft falls from 30 to 10 minutes. |
| 00:06–00:13 | Verification, correction and handover bring total effort from 50 to 55 minutes. |
| 00:13–00:22 | **Feedback Within Reach** brings a qualified reviewer and the source material into the process while a small sample can still be changed. |
| 00:22–00:31 | **Keep Judgement in Practice** gives the reviewer a credible correction and pause route. |
| 00:31–00:40 | Compare comparable work at the same quality bar and ask whose workload changed. |

In a full lesson, pause on the incident and ask what changed in **Capacity** (time for competent checking), **Agency** (who can pause acceptance) and **Behavioral Architecture** (when the review happens). Then reveal the two pattern names against the same workflow so viewers can see what each changes.

The figures describe a hypothetical incident. The redesigned workflow has no result assigned to it. For a full episode, complete the Verification Budget with the reviewer, the required checks and the time they actually need. Stop or narrow scope if those checks cannot be done. Close by asking the viewer to map one incident, inspect two or three relevant design fields, choose one active pattern, and say what would be reviewed or stopped. Bring in a balancing pattern where the first move shifts a burden or creates a risk.

Show the pilot to a few intended viewers and ask them to explain in their own words why the report took more work, what the team would change, and when the reviewer should pause. Give them a fresh incident to see whether they can suggest a pattern and name a boundary without copying the report example. Use those responses to revise pacing and wording. Assessing whether a proposed pattern helps in practice requires a separate, permissioned trial with affected roles and observations about quality, workload and alternative explanations.

## What to reuse in Remotion

Keep scene order, narration, captions and source IDs with each episode. Reuse the timeline, chart, decision card, typography and palette. Reuse the family icons for navigation and the pattern icons at the moment a pattern is named. The pilot recreates two supplied motifs as vectors. A full asset pass would use the approved masters for the signet and remaining icons, with the dark and light sheets as visual references. Use readable labels alongside colors and icons. Time final scenes to the recorded voiceover, provide captions and a transcript, and check type and charts at phone viewing size.

The pilot lives in this workspace alongside the overview and Attention episode. The lockfile pins Remotion and its dependencies.

```sh
npm ci
npm run studio
npm run render -- --browser-executable=/usr/bin/chromium --concurrency=2
```

The composition is `AirflowPilot` and the render goes to `out/airflow-pilot.mp4`. On another machine, use its installed Chromium path or let Remotion provision its default browser. The render here used Bitstream Charter and DejaVu Sans from the cloud image, with CSS fallbacks for systems without those fonts.

Source documents: *AIRFLOW — 24-Pattern Field Guide*, v0.4, and *AIRFLOW Playbook and Pattern Language*, v0.3, by Ilya Alexander Yacine. See the guide’s worked opening and Play B and Appendix B in the playbook. [Remotion source repository](https://github.com/remotion-dev/remotion).
