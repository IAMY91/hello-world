# AIRFLOW · Attention

This episode is a standalone introduction to the Attention family. It shows how the family icon’s three turquoise currents and gold focal point can express the tension between competing demands and the work that needs focus. The icon is an animated vector interpretation of the supplied family icon sheet.

The episode names the four public patterns in the family and uses Protected Focus as the worked example. The team agrees on a focus window, names a backup, sets the urgent exception, and reviews whether someone else absorbed the interruptions. The episode uses the AIRFLOW field guide’s public names and Ilya Alexander Yacine’s visual identity brief.

## Edit and render

The Remotion composition is `AirflowAttention`. The icon uses a paused GSAP timeline sampled by frame. Shot order, narration and captions follow the same timing data.

```sh
npm ci
npm run studio
npm run render:attention -- --browser-executable=/usr/bin/chromium --concurrency=2 --image-format=jpeg --crf=19
```

This produces `out/airflow-attention.mp4`. The English caption sidecar is `captions/airflow-attention.srt`. The video also includes on-screen captions. The authorized voice reference is read from a supplied local file. It is separate from the project assets.

The committed timing is in `public/attention/timeline.json`. The render command prepares the local narration WAV from the published Attention MP4 unless a matching local master is present. The source text is in `src/attention-script.json`. To regenerate, run `python scripts/attention-narration.py <original-recording>` with FFmpeg, CPU PyTorch, and `qwen-tts` 0.1.1 installed. The script selects the first spoken sentence of the original reference using its timestamps and transcript, so the trim and transcript need updating for a different recording.
