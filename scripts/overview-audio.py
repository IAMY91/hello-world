"""Build a timed narration track and captions from the overview script."""
import json
import math
from pathlib import Path
import subprocess
import tempfile
import textwrap
import wave

ROOT = Path(__file__).resolve().parents[1]
FPS = 24
RATE = 24000
FRAME_BYTES = RATE // FPS * 2
ASSETS = ROOT / "public" / "overview"
ASSETS.mkdir(parents=True, exist_ok=True)
(ROOT / "captions").mkdir(exist_ok=True)


def silence(frames):
    return bytes(frames * FRAME_BYTES)


def stamp(frames):
    ms = round(frames * 1000 / FPS)
    whole_seconds, remainder = divmod(ms, 1000)
    minutes, seconds = divmod(whole_seconds, 60)
    return f"{minutes // 60:02}:{minutes % 60:02}:{seconds:02},{remainder:03}"


def synthesize(text, scratch):
    source = scratch / "line.txt"
    source.write_text(text.replace("AIRFLOW", "Airflow").replace("AI", "A. I."))
    return subprocess.check_output([
        "ffmpeg", "-nostdin", "-v", "error", "-f", "lavfi", "-i",
        f"flite=textfile={source}:voice=slt",
        "-af", "highpass=f=80,acompressor=threshold=0.1:ratio=2:makeup=1.4,atempo=1.10",
        "-ar", str(RATE), "-ac", "1", "-f", "s16le", "pipe:1",
    ])


scenes = json.loads((ROOT / "src/overview-script.json").read_text())
subtitles = []
cursor = 0
with tempfile.TemporaryDirectory() as tmp, wave.open(str(ASSETS / "narration.wav"), "wb") as audio:
    audio.setparams((1, 2, RATE, 0, "NONE", "not compressed"))
    for scene in scenes:
        scene["from"] = cursor
        scene["captions"] = []
        audio.writeframes(silence(18))
        cursor += 18
        for line in scene.pop("cues"):
            speech = synthesize(line, Path(tmp))
            frames = math.ceil(len(speech) / FRAME_BYTES)
            audio.writeframes(speech.ljust(frames * FRAME_BYTES, b"\x00"))
            end = cursor + frames + 2
            caption = {"from": cursor, "to": end, "text": line}
            scene["captions"].append(caption)
            subtitles.append(f"{len(subtitles) + 1}\n{stamp(cursor)} --> {stamp(end)}\n"
                             + textwrap.fill(line, width=72))
            audio.writeframes(silence(6))
            cursor += frames + 6
        audio.writeframes(silence(17))
        cursor += 17
        scene["duration"] = cursor - scene["from"]

(ROOT / "src/overview-timeline.json").write_text(
    json.dumps({"fps": FPS, "duration": cursor, "scenes": scenes}, ensure_ascii=False, indent=2) + "\n"
)
(ROOT / "captions/airflow-overview.srt").write_text("\n\n".join(subtitles) + "\n")
print(f"{len(scenes)} scenes, {len(subtitles)} cues, {cursor / FPS:.2f} seconds")
