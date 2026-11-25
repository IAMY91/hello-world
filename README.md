# AIRFLOW video workspace

Editable Remotion projects for Ilya Alexander Yacine’s AIRFLOW series. AIRFLOW brings flow science, biomimicry, organizational development, and AI together to explore the conditions for human and organizational flourishing. [IAMY website](https://iamy-website.vercel.app/en/#airflow)

## Open the workspace

Use Node.js 24, npm, Python 3.12, FFmpeg, curl, and Chromium. From the repository root:

```sh
npm ci
npm run studio
```

Studio prepares Attention audio from its published MP4 on first use. The source URL is pinned to a commit and the download is checked against its SHA-256. You can also prepare from a copy of that export.

```sh
npm run prepare:media -- --video /path/to/AIRFLOW-Attention.mp4
```

| Composition | Purpose | Export |
| --- | --- | --- |
| `AirflowOverview` | English introduction to AIRFLOW, how the language is derived, and how to try a pattern | `npm run render:overview` |
| `AirflowAttention` | First 45–60 second family episode. It explains the Attention icon and works through Protected Focus | `npm run render:attention` |
| `AirflowPilot` | Earlier 40-second visual pilot about AI-assisted drafting and review | `npm run render` |

These commands write MP4s to `out/`. Add `-- --browser-executable=/path/to/chromium` to use an installed browser. Remotion can also supply its own browser. English caption files live in [captions](captions/).

[Download the published Attention episode](https://github.com/IAMY91/hello-world/raw/893ef33e59fc02b42ab75f385d6bb99a1ada4328/videos/AIRFLOW-Attention.mp4)

## Develop the series

- [Series plan](docs/SERIES.md) covers the public introduction, the eight signature patterns, and a way to test viewer comprehension.
- [Production references](docs/REFERENCES.md) aligns the website, the AIRFLOW production conversation, and the three infographic sheets.
- [Pattern catalog](data/patterns.json) records all six families, 24 public pattern names, and their playbook card IDs. The overview and Attention compositions read their labels from it.
- [Overview](docs/OVERVIEW.md) and [Attention](docs/ATTENTION.md) document narration, timing, and reconstruction for each episode.

Keep original voice recordings, unpublished references, and model caches in local storage. The repo includes the synthetic overview track. For Attention, it rebuilds a local audio copy from the previously published episode.

## Repository origin

> hello-world
>
> first time first love
>
> I commit to coding diligentlly
