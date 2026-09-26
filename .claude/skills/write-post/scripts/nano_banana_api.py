#!/usr/bin/env python3
"""Nano Banana via the Gemini API directly, for when the aspect ratio must be guaranteed.

The Gemini CLI's /generate and /edit have no aspect-ratio control (an /edit of a 3:1 image
comes back 3:1). This calls the same models with generationConfig.imageConfig.aspectRatio.

Usage:
  nano_banana_api.py "<prompt>" out.png                       # generate
  nano_banana_api.py "<prompt>" out.png --input existing.png  # edit / recompose
Options: --aspect 16:9 (default)  --model gemini-2.5-flash-image (default, cheapest)

Reads GEMINI_API_KEY (or GOOGLE_API_KEY) from the environment; never pass the key as an argument.
"""
import argparse
import base64
import json
import mimetypes
import os
import sys
import urllib.error
import urllib.request

ap = argparse.ArgumentParser()
ap.add_argument("prompt")
ap.add_argument("out")
ap.add_argument("--input", help="existing image to edit/recompose")
ap.add_argument("--aspect", default="16:9")
ap.add_argument("--model", default=os.environ.get("NANOBANANA_MODEL", "gemini-2.5-flash-image"))
a = ap.parse_args()

key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
if not key:
    sys.exit("GEMINI_API_KEY / GOOGLE_API_KEY not set — ask the user to export it")

parts = []
if a.input:
    mime = mimetypes.guess_type(a.input)[0] or "image/png"
    parts.append({"inlineData": {"mimeType": mime, "data": base64.b64encode(open(a.input, "rb").read()).decode()}})
parts.append({"text": a.prompt})
body = {
    "contents": [{"parts": parts}],
    "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": a.aspect}},
}
req = urllib.request.Request(
    f"https://generativelanguage.googleapis.com/v1beta/models/{a.model}:generateContent",
    data=json.dumps(body).encode(),
    headers={"Content-Type": "application/json", "x-goog-api-key": key},
)
try:
    resp = json.load(urllib.request.urlopen(req, timeout=180))
except urllib.error.HTTPError as e:
    sys.exit(f"HTTP {e.code}: {e.read().decode()[:400]}")
for cand in resp.get("candidates", []):
    for p in cand.get("content", {}).get("parts", []):
        if "inlineData" in p:
            with open(a.out, "wb") as f:
                f.write(base64.b64decode(p["inlineData"]["data"]))
            print(f"wrote {a.out} ({a.model}, {a.aspect})")
            sys.exit(0)
sys.exit("no image returned: " + json.dumps(resp)[:400])
