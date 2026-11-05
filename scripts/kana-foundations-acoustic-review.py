#!/usr/bin/env python3
"""Evidence-only acoustic analysis of the five hashed Commons originals.

NO APP ASSETS. Generates temporary reviewer candidates, not approved phonemes.
Requires FFmpeg/FFprobe, Python stdlib; no audio is uploaded or committed by this script.
"""
from __future__ import annotations

import argparse
import array
import datetime as dt
import hashlib
import json
import math
import re
import subprocess
import sys
import wave
from pathlib import Path

THRESHOLDS_DBFS = (-50, -45, -40, -35)
REFERENCE_THRESHOLD = -45
SILENCE_MIN_SECONDS = 0.15
TARGET_PEAK_DBFS = -12.0
LEAD_SECONDS = 0.035
TAIL_SECONDS = 0.055
REVIEW_ONLY = "UNAPPROVED_REVIEW_DERIVATIVE_NOT_FOR_TEACHING"

def shell(args: list[str], *, binary: bool = False) -> subprocess.CompletedProcess:
    result = subprocess.run(args, capture_output=True, text=not binary, timeout=40)
    if result.returncode:
        stderr = result.stderr if not binary else result.stderr.decode("utf-8", errors="replace")
        raise RuntimeError("command failed: " + " ".join(args[:5]) + " :: " + stderr[-800:])
    return result

def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()

def ffprobe(path: Path) -> dict:
    x = shell(["ffprobe", "-v", "error", "-show_streams", "-show_format",
               "-of", "json", str(path)])
    return json.loads(x.stdout)

def pcm_decode(path: Path) -> tuple[array.array, int, int]:
    probe = ffprobe(path)
    tracks = [s for s in probe["streams"] if s.get("codec_type") == "audio"]
    if len(tracks) != 1:
        raise RuntimeError("Expected exactly one original audio track")
    stream = tracks[0]
    if stream.get("codec_name") != "vorbis":
        raise RuntimeError("Unexpected original codec")
    channels = int(stream["channels"])
    sample_rate = int(stream["sample_rate"])
    if channels != 2 or sample_rate != 44100:
        raise RuntimeError("Unexpected original channel or sample rate")
    raw = shell(["ffmpeg", "-nostdin", "-hide_banner", "-v", "error",
                 "-i", str(path), "-map", "0:a:0", "-f", "f32le",
                 "-acodec", "pcm_f32le", "-ar", str(sample_rate),
                 "-ac", str(channels), "pipe:1"], binary=True).stdout
    values = array.array("f")
    values.frombytes(raw)
    if sys.byteorder != "little":
        values.byteswap()
    if len(values) % channels:
        raise RuntimeError("Invalid frame alignment")
    if not values:
        raise RuntimeError("Decoded PCM empty")
    if not all(math.isfinite(v) for v in values):
        raise RuntimeError("Non-finite PCM sample detected")
    return values, sample_rate, channels

def silence_intervals(path: Path, threshold: int) -> list[dict]:
    r = shell(["ffmpeg", "-nostdin", "-hide_banner", "-v", "info",
               "-i", str(path), "-af",
               f"silencedetect=n={threshold}dB:d={SILENCE_MIN_SECONDS}",
               "-f", "null", "-"])
    lines = r.stderr.splitlines()
    starts, intervals = [], []
    for line in lines:
        start = re.search(r"silence_start:\s*([\d.]+)", line)
        end = re.search(r"silence_end:\s*([\d.]+)", line)
        if start:
            starts.append(float(start.group(1)))
        if end:
            if not starts:
                raise RuntimeError("Silence end without start")
            a, b = starts.pop(0), float(end.group(1))
            if b < a:
                raise RuntimeError("Reverse silence interval")
            intervals.append({"start_seconds": round(a, 6), "end_seconds": round(b, 6)})
    if starts:
        raise RuntimeError("Unclosed silence interval(s)")
    return intervals

def active_complement(silences: list[dict], duration: float) -> list[dict]:
    active, cursor = [], 0.0
    for silence in silences:
        start = min(duration, silence["start_seconds"])
        if start > cursor + 0.02:
            active.append({"start_seconds": round(cursor, 6),
                           "end_seconds": round(start, 6)})
        cursor = min(duration, silence["end_seconds"])
    if duration > cursor + 0.02:
        active.append({"start_seconds": round(cursor, 6), "end_seconds": round(duration, 6)})
    return active

def stats(values: array.array, channels: int, sample_rate: int,
          start_seconds: float, end_seconds: float) -> dict:
    low = max(0, round(start_seconds * sample_rate) * channels)
    high = min(len(values), round(end_seconds * sample_rate) * channels)
    part = values[low:high]
    if not part:
        raise RuntimeError("Empty detected activity window")
    maximum = max(abs(v) for v in part)
    rms = math.sqrt(sum(v*v for v in part) / len(part))
    return {
        "duration_seconds": round((high - low) / (sample_rate * channels), 6),
        "peak_dbfs": round(20 * math.log10(maximum), 2) if maximum else None,
        "rms_dbfs": round(20 * math.log10(rms), 2) if rms else None,
    }

def write_wav(path: Path, floats: array.array, rate: int,
              channels: int, gain: float = 1.0) -> dict:
    samples = array.array("h")
    clipped = 0
    for value in floats:
        transformed = value * gain
        if abs(transformed) > 1.0:
            clipped += 1
        samples.append(max(-32768, min(32767, round(transformed * 32767))))
    if sys.byteorder != "little":
        samples.byteswap()
    path.parent.mkdir(parents=True, exist_ok=True)
    with wave.open(str(path), "wb") as writer:
        writer.setnchannels(channels)
        writer.setsampwidth(2)
        writer.setframerate(rate)
        writer.writeframes(samples.tobytes())
    return {"sha256": sha256(path), "byte_size": path.stat().st_size,
            "clipped_input_float_samples": clipped,
            "wav_codec": "pcm_s16le", "channels": channels, "sample_rate_hz": rate}

def periodicity_proxy(values: array.array, channels: int, rate: int,
                      start: float, end: float) -> dict:
    """Energy-selected 30ms autocorrelation; proxy ONLY, not voice detection.

    Time-domain autocorrelation of downmixed, 4:1 box-filtered PCM at 11025 Hz.
    The reported periodicity can come from sources other than human phonation.
    It cannot identify the Japanese vowel or prove multiple utterances match.
    """
    downrate = rate // 4
    first = max(0, round(start * rate))
    final = min(len(values) // channels, round(end * rate))
    downmixed = []
    for frame in range(first, final - 3, 4):
        total = 0.0
        for k in range(4):
            for ch in range(channels):
                total += values[(frame + k) * channels + ch]
        downmixed.append(total / (4 * channels))
    window = round(0.030 * downrate)
    stride = max(1, round(0.005 * downrate))
    if len(downmixed) < window:
        return {"status": "INSUFFICIENT_WINDOW", "speech_identity": "UNVERIFIED"}
    best_energy, chosen = -1.0, None
    for pos in range(0, len(downmixed) - window + 1, stride):
        candidate = downmixed[pos:pos + window]
        energy = sum(v*v for v in candidate)
        if energy > best_energy:
            best_energy, chosen = energy, candidate
    if chosen is None or best_energy < 1e-12:
        return {"status": "NO_MEASURABLE_PERIODICITY", "speech_identity": "UNVERIFIED"}
    center = sum(chosen) / len(chosen)
    centered = [v - center for v in chosen]
    periodicity, frequency = -1.0, None
    for lag in range(round(downrate / 330), round(downrate / 70) + 1):
        left, right = centered[:-lag], centered[lag:]
        denom = math.sqrt(sum(v*v for v in left) * sum(v*v for v in right))
        if denom <= 1e-14:
            continue
        score = sum(v*w for v,w in zip(left,right)) / denom
        if score > periodicity:
            periodicity, frequency = score, downrate / lag
    return {
        "status": "PERIODICITY_PROXY_AVAILABLE" if frequency is not None else "NO_MEASURABLE_PERIODICITY",
        "normalized_autocorrelation_peak": round(periodicity, 3),
        "periodic_frequency_hz_approx": round(frequency, 1) if frequency else None,
        "analysis_window_seconds": 0.030,
        "search_frequency_range_hz": [70,330],
        "speech_identity": "UNVERIFIED",
        "caveat": "Periodicity != verified voiced human speech, phoneme or repeated same utterance",
    }

def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--review-root", required=True, type=Path,
                        help="Output from scripts/kana-foundations-audio-evidence.py")
    args = parser.parse_args()
    root = args.review_root.resolve()
    meta = json.loads((root / "verified-audio-manifest.json").read_text(encoding="utf-8"))
    if meta.get("candidate_count") != 5 or len(meta.get("items", [])) != 5:
        raise RuntimeError("Must have five verified original sources")
    outputs = root / "acoustic-forensics-review-only"
    originals = root / "review-only-originals"
    outputs.mkdir(parents=True, exist_ok=True)
    measures = []
    derivative_hashes = []
    ffmpeg_version = shell(["ffmpeg", "-version"]).stdout.splitlines()[0]
    for item in meta["items"]:
        source = originals / item["filename"]
        assert sha256(source) == item["computed_sha256_hex"], "Original changed after retrieval"
        floats, rate, channels = pcm_decode(source)
        duration = float(item["audio"]["duration_seconds"])
        measured_duration = len(floats) / (channels * rate)
        if abs(duration - measured_duration) > 0.02:
            raise RuntimeError("PCM/ffprobe timebase mismatch " + item["filename"])
        traces = {}
        for threshold in THRESHOLDS_DBFS:
            gaps = silence_intervals(source, threshold)
            active = active_complement(gaps, duration)
            quiet = sum(x["end_seconds"]-x["start_seconds"] for x in gaps)
            traces[str(threshold)] = {
                "silence_intervals": gaps,
                "activity_windows": active,
                "quiet_fraction": round(quiet / duration, 4),
                "silence_min_seconds": SILENCE_MIN_SECONDS,
                "threshold_dbfs": threshold,
            }
        baseline = traces[str(REFERENCE_THRESHOLD)]
        prior = item["audio"]["detected_silence_intervals"]
        if len(baseline["silence_intervals"]) != len(prior):
            raise RuntimeError("Could not reproduce prior original silence analysis")
        for actual, original in zip(baseline["silence_intervals"], prior):
            if abs(actual["start_seconds"]-original["start_seconds"]) > 0.015 or \
               abs(actual["end_seconds"]-original["end_seconds"]) > 0.015:
                raise RuntimeError("Original measured silence intervals changed")
        windows = baseline["activity_windows"]
        if len(windows) != 3:
            raise RuntimeError("Expected exactly three visible signal-activity windows; review algorithm")
        burst_records = []
        for i, window in enumerate(windows, 1):
            start, end = window["start_seconds"], window["end_seconds"]
            # Crop on sample-frame boundaries with guard bands. These are reviewer
            # listening segments, NOT automatically validated vowel utterances.
            crop_start = max(0.0, start - LEAD_SECONDS)
            crop_end = min(duration, end + TAIL_SECONDS)
            lo = round(crop_start * rate)
            hi = round(crop_end * rate)
            name = f"{item['romaji']}-activity-{i:02d}-UNAPPROVED.wav"
            path = outputs / "audition-segments" / name
            result = write_wav(path, floats[lo*channels:hi*channels], rate, channels)
            record = {"window": i,
                      "source_activity_start_seconds": start,
                      "source_activity_end_seconds": end,
                      "source_activity_duration_seconds": round(end-start, 6),
                      "guarded_crop_start_seconds": round(lo / rate, 6),
                      "guarded_crop_end_seconds": round(hi / rate, 6),
                      "signal_metrics": stats(floats, channels, rate, start, end),
                      "periodicity_proxy": periodicity_proxy(floats, channels, rate, start, end),
                      "derivative_path": "audition-segments/" + name,
                      **result, "review_only": True, "approval": REVIEW_ONLY}
            burst_records.append(record)
            derivative_hashes.append(record["sha256"] + "  " + record["derivative_path"])
        peak = max(abs(v) for v in floats)
        peak_db = 20 * math.log10(peak)
        # This demo does NOT remove silence or equalize perceived loudness.
        # Output is for A/B evaluation only, explicitly pending human approval.
        gain_db = TARGET_PEAK_DBFS - peak_db
        gain_factor = 10 ** (gain_db / 20)
        gain_path = outputs / "peak-comparison" / (item["romaji"] + "-full-peak-minus12dBFS-UNAPPROVED.wav")
        gain_result = write_wav(gain_path, floats, rate, channels, gain_factor)
        if gain_result["clipped_input_float_samples"]:
            raise RuntimeError("Peak comparison clipped")
        derivative_hashes.append(gain_result["sha256"] + "  peak-comparison/" + gain_path.name)
        intervals = [round(windows[j+1]["start_seconds"]-windows[j]["start_seconds"],6)
                     for j in range(len(windows)-1)]
        result = {
            "kana": item["kana"], "romaji": item["romaji"],
            "original_filename": item["filename"],
            "source_sha256_hex": item["computed_sha256_hex"],
            "duration_seconds": duration,
            "silence_sensitivity": traces,
            "activity_intervals_at_minus45": burst_records,
            "activity_start_spacings_seconds": intervals,
            "repetition_like_spacing": (all(0.7 < x < 1.3 for x in intervals)),
            "same_phoneme_or_repetition_identity_verified": False,
            "possible_onset_truncation": "UNKNOWN",
            "source_peak_dbfs": round(peak_db, 2),
            "source_mean_dbfs": item["audio"]["mean_volume_dbfs"],
            "gain_comparison": {
                "review_only_path": "peak-comparison/" + gain_path.name,
                "peak_target_dbfs": TARGET_PEAK_DBFS,
                "gain_db": round(gain_db, 3),
                "gain_linear": round(gain_factor, 7),
                **gain_result, "approval": REVIEW_ONLY,
            },
            "human_listening_result": "NOT_PERFORMED",
        }
        measures.append(result)
        print("REVIEW_SEGMENTS " + item["kana"] + " active=" +
              ",".join(f"{v['source_activity_duration_seconds']:.3f}s" for v in burst_records) +
              f" silence={baseline['quiet_fraction']:.1%} gain_preview={gain_db:+.2f}dB", flush=True)
        if sha256(source) != item["computed_sha256_hex"]:
            raise RuntimeError("Original source changed during derivative creation")
    out = {
        "purpose": "temporary acoustic measurement and audition-only derivatives; not teaching audio",
        "analyzed_utc": dt.datetime.now(dt.timezone.utc).isoformat(),
        "ffmpeg_version": ffmpeg_version,
        "python_version": sys.version.split()[0],
        "input_manifest": "verified-audio-manifest.json",
        "candidate_count": len(measures),
        "activity_definition": "complement of ffmpeg silencedetect intervals; NOT validated voiced speech",
        "silence_thresholds_dbfs": THRESHOLDS_DBFS,
        "minimum_silence_seconds": SILENCE_MIN_SECONDS,
        "crop_recipe": "PCM f32le original decoded at 44.1 kHz stereo, crop using round(seconds*44100) frames, add 35ms lead and 55ms tail, quantize nearest-even to PCM16 with 32767 scaling; write deterministic WAV via Python wave",
        "gain_recipe": "full-length PCM f32le original peak align to -12.0dBFS, linear gain=10**((-12-original_peak_dbfs)/20); PCM16 nearest-even 32767 scaling; no silence trimming; this is a reviewer A/B example only",
        "no_deployment_or_learner_writes": True,
        "release_approved": False,
        "qualified_japanese_approval": "PENDING",
        "independent_rights_approval": "PENDING",
        "items": measures,
    }
    (outputs / "acoustic-measurements.json").write_text(json.dumps(out,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    (outputs / "review-derivative-sha256sums.txt").write_text("\n".join(derivative_hashes)+"\n",encoding="utf-8")
    (outputs / "HOLD-NOT-FOR-APP.txt").write_text(
        "This entire folder contains unapproved, review-only audition segments and peak-matched A/B previews.\n"
        "The signal-activity windows are NOT verified as speech, let alone correct Japanese phonemes.\n"
        "Never integrate, publish as teaching audio, or migrate these into the product.\n"
        "Original Commons files are unchanged under the parent review-only-originals directory.\n",
        encoding="utf-8"
    )
    if len(derivative_hashes) != 20:
        raise RuntimeError("Expected exactly 15 audition segments plus 5 A/B peak files")
    print("ACOUSTIC_REVIEW_ONLY_DERIVATIVES=20 ORIGINAL_FILES_UNCHANGED=5", flush=True)

if __name__ == "__main__":
    main()
