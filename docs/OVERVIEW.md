# AIRFLOW overview

This 16:9 explainer introduces AIRFLOW, shows how the four perspectives inform a pattern, and gives viewers a way to try the language on a specific workplace incident. It introduces the names of the six families. The planned 45–60 second family episodes can then animate and explain their icons individually.

| Chapter | Approximate start |
| --- | --- |
| What AIRFLOW is | 0:00 |
| Why a faster task can move the bottleneck | 0:14 |
| The four perspectives | 0:30 |
| How a pattern is derived | 0:50 |
| Protected Focus in practice | 1:14 |
| How to use the language | 1:32 |
| The six families | 1:52 |
| Closing question and next episodes | 2:02 |

The voiceover is English and synthesized locally with Flite. The MP4 includes open captions and the separate SRT is available for editing or distribution. The narration text and scene titles live in `src/overview-script.json`. The chapter times follow the generated narration. The composition uses the brief's Living Intelligence palette, Playfair Display and Inter, and animated paths with gold focal points. The identity treatment uses the AIRFLOW wordmark.

## Rebuild

Run these commands from the project directory. Rebuilding the narration requires Python 3 and FFmpeg with the `flite` filter. The generated narration and timing data are already included for preview and render. Run `python3 scripts/overview-audio.py` to regenerate them after editing the script.

```sh
npm ci
npm run render:overview -- --browser-executable=/usr/bin/chromium --concurrency=2 --image-format=jpeg --crf=19
```

Use the local Chromium path, or omit the browser flag to use Remotion's default browser. In Remotion Studio, choose `AirflowOverview`. The earlier `AirflowPilot` remains a separate composition.

The story draws from Ilya Alexander Yacine's *AIRFLOW — Purpose and Framework* v1.0, *AIRFLOW — Visual Identity & Design System* v2.0, *24-Pattern Field Guide* v0.4, and *Playbook and Pattern Language* v0.3. The report and Protected Focus situations are illustrations of proposed arrangements.
