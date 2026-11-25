"""Generate the Attention episode's narration, captions, and Remotion timing."""
import argparse
import json
import math
import os
from pathlib import Path
import re
import subprocess
import tempfile
import wave

ROOT = Path(__file__).resolve().parents[1]
FPS = 24
RATE = 24000
SAMPLES_PER_FRAME = RATE // FPS
MODEL = "Qwen/Qwen3-TTS-12Hz-0.6B-Base"
REVISION = "5d83992436eae1d760afd27aff78a71d676296fc"
REFERENCE_TEXT = (
    "Airflow is a framework for designing the conditions in which people, "
    "collective intelligence, and organizations can flourish together."
)


def ffmpeg(*args):
    return subprocess.check_output(["ffmpeg", "-nostdin", "-v", "error", *map(str, args)])


def stamp(frame):
    seconds, milliseconds = divmod(round(frame * 1000 / FPS), 1000)
    minutes, seconds = divmod(seconds, 60)
    return f"00:{minutes:02}:{seconds:02},{milliseconds:03}"


def master(source, output):
    chain = (
        "highpass=f=65,equalizer=f=360:t=o:w=1.6:g=-3.5,"
        "equalizer=f=2650:t=o:w=1.9:g=5,highshelf=f=4350:t=o:w=1:g=6,"
        "acompressor=threshold=0.126:ratio=1.5:attack=12:release=100,"
        "loudnorm=I=-17:TP=-1.5:LRA=7"
    )
    report = subprocess.run(
        ["ffmpeg", "-nostdin", "-i", str(source), "-af", chain + ":print_format=json", "-f", "null", "-"],
        check=True, capture_output=True, text=True,
    )
    measures = json.loads(re.findall(r"\{[^{}]+\}", report.stderr)[-1])
    fields = ["I", "TP", "LRA", "thresh"]
    measured = "".join(f":measured_{key}={measures['input_' + key.lower()]}" for key in fields)
    measured += ":offset=" + measures["target_offset"] + ":linear=true"
    ffmpeg("-y", "-i", source, "-af", chain + measured, "-ar", RATE, "-ac", 1, "-c:a", "pcm_s24le", output)


def write_timeline(scenes, cursor, assets):
    (assets / "timeline.json").write_text(
        json.dumps({"fps": FPS, "duration": cursor, "scenes": scenes}, indent=2, ensure_ascii=False) + "\n"
    )
    subtitles = []
    for scene in scenes:
        for cue in scene["captions"]:
            subtitles.append(
                f"{len(subtitles) + 1}\n{stamp(cue['from'])} --> {stamp(cue['to'])}\n{cue['text']}"
            )
    (ROOT / "captions").mkdir(exist_ok=True)
    (ROOT / "captions/airflow-attention.srt").write_text("\n\n".join(subtitles) + "\n")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("reference", type=Path, help="Author's original opening recording")
    args = parser.parse_args()
    os.environ.setdefault("HF_HOME", str(ROOT / ".cache-voice"))

    import numpy as np
    import soundfile as sf
    import torch
    from huggingface_hub import snapshot_download
    from qwen_tts import Qwen3TTSModel

    torch.set_num_threads(4)
    torch.manual_seed(4173)
    path = snapshot_download(
        MODEL, revision=REVISION, allow_patterns=["*.json", "*.txt", "*.safetensors"],
    )
    model = Qwen3TTSModel.from_pretrained(path, device_map="cpu", dtype=torch.float32, attn_implementation="sdpa")
    scenes = json.loads((ROOT / "src/attention-script.json").read_text())
    assets = ROOT / "public/attention"
    assets.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as work:
        reference = Path(work) / "reference.wav"
        ffmpeg("-ss", "1.42", "-t", "7.75", "-i", args.reference.resolve(), "-af",
               "highpass=f=70,volume=7dB", "-ar", RATE, "-ac", 1, reference)
        prompt = model.create_voice_clone_prompt(ref_audio=str(reference), ref_text=REFERENCE_TEXT)
        segments = []
        for start in range(0, len(scenes), 2):
            batch = [cue for scene in scenes[start:start + 2] for cue in scene["cues"]]
            text = [line.replace("AIRFLOW", "Airflow") for line in batch]
            with torch.inference_mode():
                wavs, rate = model.generate_voice_clone(
                    text=text, language=["English"] * len(text),
                    voice_clone_prompt=prompt * len(text), max_new_tokens=180,
                )
            if rate != RATE or len(wavs) != len(text):
                raise ValueError("Unexpected voice output format")
            segments.extend(wavs)
            print(f"Generated {len(segments)} cues", flush=True)

        cursor = 0
        index = 0
        pieces = []
        for scene, min_frames in zip(scenes, [150, 195, 225, 192, 222, 225], strict=True):
            scene["from"] = cursor
            scene["captions"] = []
            lead = 16
            cursor += lead
            pieces.append(np.zeros(lead * SAMPLES_PER_FRAME, dtype=np.float32))
            for line in scene.pop("cues"):
                audio = segments[index]
                index += 1
                if not np.isfinite(audio).all() or len(audio) < RATE // 2:
                    raise ValueError(f"Invalid audio for cue {index}")
                frames = math.ceil(len(audio) / SAMPLES_PER_FRAME)
                pieces.append(np.pad(audio, (0, (frames + 7) * SAMPLES_PER_FRAME - len(audio))))
                scene["captions"].append({"from": cursor, "to": cursor + frames + 2, "text": line})
                cursor += frames + 7
            tail = max(15, min_frames - (cursor - scene["from"]))
            pieces.append(np.zeros(tail * SAMPLES_PER_FRAME, dtype=np.float32))
            cursor += tail
            scene["duration"] = cursor - scene["from"]

        if not FPS * 45 <= cursor <= FPS * 60:
            raise ValueError(f"Episode duration {cursor / FPS:.2f}s is outside 45–60s")
        raw = Path(work) / "raw.wav"
        sf.write(raw, np.concatenate(pieces), RATE, subtype="FLOAT")
        master(raw, assets / "narration.wav")
        write_timeline(scenes, cursor, assets)
        print(f"Attention runs {cursor / FPS:.2f}s with {index} cues", flush=True)


if __name__ == "__main__":
    main()
