#!/usr/bin/env python3
"""Ephemeral Wikimedia Commons original-audio evidence collector.

Collects original candidate bytes ONLY into a CI/temp review folder. No
application/audio asset paths, Account, FSRS or learner data are touched.
"""
from __future__ import annotations

import argparse
import datetime as dt
import hashlib
import html
import json
import re
import subprocess
import urllib.parse
import urllib.request
from pathlib import Path

SOURCES = [
    ("あ", "a", "Ja-A.oga"),
    ("い", "i", "Japanese_I.ogg"),
    ("う", "u", "Japanese_U.ogg"),
    ("え", "e", "Ja-E.oga"),
    ("お", "o", "Japanese_O.ogg"),
]
BASE = "https://commons.wikimedia.org/w/api.php"
HEADERS = {
    "User-Agent": "KanaFoundationsEvidence/1.0 (https://github.com/thiepn/japanese; original audio attribution audit)",
    "Accept": "application/json, audio/ogg;q=0.9, */*;q=0.8",
}
REVIEW_STATUS = "UNAPPROVED_FOR_TEACHING_OR_SHIPPING"

def fetch(url: str, limit: int = 2_000_000) -> bytes:
    request = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(request, timeout=40) as response:
        result = response.read(limit + 1)
        if len(result) > limit:
            raise ValueError("Downloaded response exceeded size limit")
        return result

def json_url(params: dict[str, str]) -> dict:
    url = BASE + "?" + urllib.parse.urlencode(params)
    return json.loads(fetch(url).decode("utf-8"))

def text_value(v: object) -> str:
    if isinstance(v, dict):
        v = v.get("value", "")
    return html.unescape(re.sub("<[^>]*>", "", str(v or ""))).strip()

def command_json(command: list[str]) -> dict:
    p = subprocess.run(command, capture_output=True, text=True, check=True, timeout=30)
    return json.loads(p.stdout)

def audio_metrics(path: Path) -> dict:
    probe = command_json([
        "ffprobe", "-v", "error", "-show_streams", "-show_format",
        "-of", "json", str(path),
    ])
    streams = [s for s in probe.get("streams", []) if s.get("codec_type") == "audio"]
    if len(streams) != 1:
        raise RuntimeError("Expected exactly one decodable audio stream")
    stream = streams[0]
    duration = float(probe["format"].get("duration", 0))
    if not 0.5 < duration < 10.0:
        raise RuntimeError("Unexpected recorded duration")
    if stream.get("codec_name") != "vorbis":
        raise RuntimeError("Unexpected codec; expected original Ogg Vorbis")
    sample_rate = int(stream.get("sample_rate", 0))
    if sample_rate < 8000:
        raise RuntimeError("Unexpected sample rate")
    # Decode every frame; do not treat successful decoding as pronunciation approval.
    decode = subprocess.run(
        ["ffmpeg", "-hide_banner", "-nostdin", "-v", "error",
         "-i", str(path), "-f", "null", "-"],
        capture_output=True, text=True, timeout=30,
    )
    if decode.returncode != 0 or decode.stderr.strip():
        raise RuntimeError("Audio decoder reported an error: " + decode.stderr[:400])
    volume = subprocess.run(
        ["ffmpeg", "-hide_banner", "-nostdin", "-i", str(path),
         "-af", "volumedetect", "-f", "null", "-"],
        capture_output=True, text=True, timeout=30,
    )
    if volume.returncode != 0:
        raise RuntimeError("Volume analysis failed")
    v = volume.stderr
    mean = re.search(r"mean_volume:\s*(-?[\d.]+)\s*dB", v)
    peak = re.search(r"max_volume:\s*(-?[\d.]+)\s*dB", v)
    silence = subprocess.run(
        ["ffmpeg", "-hide_banner", "-nostdin", "-i", str(path),
         "-af", "silencedetect=n=-45dB:d=0.15", "-f", "null", "-"],
        capture_output=True, text=True, timeout=30,
    )
    return {
        "codec": stream.get("codec_name"),
        "channels": stream.get("channels"),
        "sample_rate_hz": sample_rate,
        "duration_seconds": round(duration, 6),
        "bit_rate_bps": int(probe["format"].get("bit_rate", 0)),
        "mean_volume_dbfs": float(mean.group(1)) if mean else None,
        "peak_volume_dbfs": float(peak.group(1)) if peak else None,
        "silence_intervals_detected": len(re.findall("silence_start:", silence.stderr)),
        "full_ffmpeg_decode": "PASS",
        "pronunciation_quality": "NOT_REVIEWED",
        "clipping_auditory_judgment": "NOT_REVIEWED",
    }

def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", required=True, type=Path)
    args = parser.parse_args()
    out = args.output.resolve()
    originals = out / "review-only-originals"
    originals.mkdir(parents=True, exist_ok=True)
    records = []
    for kana, romaji, filename in SOURCES:
        title = "File:" + filename
        payload = json_url({
            "action": "query",
            "format": "json",
            "formatversion": "2",
            "prop": "imageinfo",
            "iiprop": "url|size|sha1|mime|timestamp|user|extmetadata|canonicaltitle",
            "titles": title,
            "iilimit": "1",
        })
        pages = payload["query"]["pages"]
        if len(pages) != 1 or not pages[0].get("imageinfo"):
            raise RuntimeError("Missing exact original file imageinfo: " + title)
        page = pages[0]
        image = page["imageinfo"][0]
        if str(page.get("title", "")).replace("_", " ") != title.replace("_", " "):
            raise RuntimeError("Unexpected filename redirect: " + str(page.get("title")))
        user = image.get("user")
        if user != "Hakatanoshio117117":
            raise RuntimeError("Different uploaded original author: " + str(user))
        url = image["url"]
        parsed = urllib.parse.urlparse(url)
        if parsed.scheme != "https" or parsed.hostname != "upload.wikimedia.org":
            raise RuntimeError("Not an original Wikimedia host URL")
        if not parsed.path.endswith("/" + filename):
            raise RuntimeError("Imageinfo URL filename mismatch")
        ext = image.get("extmetadata", {})
        license_name = text_value(ext.get("LicenseShortName"))
        license_uri = text_value(ext.get("LicenseUrl"))
        # License status is a record of the Commons file-page declaration,
        # not a legal opinion or proof of source ownership.
        if "public domain" not in license_name.casefold() and "pd" != license_name.casefold():
            raise RuntimeError("No public-domain Commons metadata: " + str(license_name))
        binary = fetch(url)
        local = originals / filename
        local.write_bytes(binary)
        if len(binary) != int(image["size"]):
            raise RuntimeError("Original size mismatches imageinfo for " + filename)
        digest = hashlib.sha1(binary).hexdigest()
        commons_sha = image["sha1"].lower()
        if not (commons_sha == digest or
                (re.fullmatch("[0-9a-z]+", commons_sha) and int(commons_sha, 36) == int(digest, 16))):
            raise RuntimeError("Original SHA-1 mismatches imageinfo: " + filename)
        analysis = audio_metrics(local)
        records.append({
            "kana": kana, "romaji": romaji, "filename": filename,
            "description_page": "https://commons.wikimedia.org/wiki/File:" + filename,
            "source_original_url": url,
            "uploaded_at": image.get("timestamp"),
            "original_uploader": user,
            "commons_sha1": commons_sha,
            "computed_sha1_hex": digest,
            "computed_sha256_hex": hashlib.sha256(binary).hexdigest(),
            "byte_size": len(binary),
            "mime_type": image.get("mime"),
            "commons_license_short_name": license_name,
            "commons_license_url": license_uri,
            "published_license_claim": "public-domain dedication by named uploader",
            "license_and_ownership_independently_adjudicated": False,
            "audio": analysis,
            "approval": REVIEW_STATUS,
        })
        print(f"ORIGINAL_VERIFIED {kana} {filename} bytes={len(binary)} sha256={records[-1]['computed_sha256_hex']}", flush=True)
    manifest = {
        "purpose": "review-only independent audio source evidence; not app assets",
        "retrieval_utc": dt.datetime.now(dt.timezone.utc).isoformat(),
        "source": "Wikimedia Commons MediaWiki imageinfo current original upload",
        "candidate_count": len(records),
        "source_bytes_sha1_checked_against_commons": True,
        "human_auditory_approval": "PENDING",
        "legal_rights_signoff": "PENDING",
        "production_integration": "PROHIBITED_BEFORE_REVIEW",
        "items": records,
    }
    (out / "verified-audio-manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    with (out / "sha256sums.txt").open("w", encoding="utf-8") as file:
        for rec in records:
            file.write(rec["computed_sha256_hex"] + "  review-only-originals/" + rec["filename"] + "\n")
    (out / "READ_BEFORE_REVIEW.txt").write_text(
        "Original unmodified files acquired from Commons for *human REVIEW only*.\n"
        "Do not copy, embed, release, deploy or auto-grade from this bundle.\n"
        "Each file's technical metadata and Commons uploader hash are documented in "
        "verified-audio-manifest.json. No Japanese phonetic approval exists.\n",
        encoding="utf-8"
    )
    (out / "index.html").write_text(
        "<!doctype html><html><head><meta charset='utf-8'></head>"
        "<body><h1>Isolated audio review — NO APPROVAL</h1>"
        "<p>Files are for compatibility/provenance checks only.</p></body></html>\n",
        encoding="utf-8"
    )
    print("ALL_FIVE_ORIGINAL_BYTES_VERIFIED", flush=True)

if __name__ == "__main__":
    main()
