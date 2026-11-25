"""Prepare local Remotion audio from the published Attention export."""
import argparse
import hashlib
import json
from pathlib import Path
import subprocess
import tempfile
import wave

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "public" / "attention"
SOURCE = (
    "https://raw.githubusercontent.com/IAMY91/hello-world/"
    "893ef33e59fc02b42ab75f385d6bb99a1ada4328/videos/AIRFLOW-Attention.mp4"
)
SOURCE_SHA256 = "ae29ac1958a6bb57fe0977594b07db19c0c7dde14ceec38f252d9052deef794c"
SAMPLE_RATE = 24000


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--video", type=Path, help="Local copy of the published Attention MP4")
    args = parser.parse_args()

    timeline = json.loads((ASSETS / "timeline.json").read_text())
    sample_count = timeline["duration"] * SAMPLE_RATE // timeline["fps"]
    output = ASSETS / "narration.wav"
    if output.exists():
        with wave.open(str(output), "rb") as existing:
            if (existing.getframerate(), existing.getnchannels(), existing.getnframes()) != (
                SAMPLE_RATE, 1, sample_count
            ):
                parser.error(f"{output} does not match the committed timeline. Move it aside before preparing media.")
        print("Attention narration is ready.")
        return

    with tempfile.TemporaryDirectory(dir=ASSETS) as scratch:
        directory = Path(scratch)
        video = args.video
        if video is None:
            video = directory / "attention.mp4"
            subprocess.run([
                "curl", "--fail", "--location", "--silent", "--show-error",
                "--max-time", "60", "--output", str(video), SOURCE,
            ], check=True)
        with video.open("rb") as handle:
            if hashlib.file_digest(handle, "sha256").hexdigest() != SOURCE_SHA256:
                parser.error("The MP4 checksum does not match the published Attention export.")

        narration = directory / "narration.wav"
        subprocess.run([
            "ffmpeg", "-nostdin", "-v", "error", "-xerror", "-i", str(video),
            "-map", "0:a:0", "-ar", str(SAMPLE_RATE), "-ac", "1", "-c:a", "pcm_s24le",
            "-af", f"aresample={SAMPLE_RATE},apad,atrim=end_sample={sample_count}",
            str(narration),
        ], check=True)
        narration.replace(output)
    print("Prepared Attention narration from the published MP4.")


if __name__ == "__main__":
    main()
