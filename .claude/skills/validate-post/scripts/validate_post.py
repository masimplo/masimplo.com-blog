#!/usr/bin/env python3
"""Mechanical spec checks for a masimplo.com post and its header image.

Usage:
  validate_post.py <post.md> [--keyword "primary phrase"] [--secondary "a" --secondary "b"]
                   [--kind opinion|technical]
  validate_post.py --all            # run over every post (calibration / regression)

Exit code 1 if any FAIL, else 0. Standard library only.
"""
import argparse
import datetime as dt
import pathlib
import re
import struct
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parents[4]
POSTS = ROOT / "src" / "posts"
HEADERS = ROOT / "src" / "images" / "headers"
TAGS_YAML = ROOT / "src" / "content" / "tag.yaml"

FIELD_ORDER = ["layout", "title", "author", "tags", "image", "date", "draft", "excerpt"]

SLOP_PHRASES = [
    "in conclusion", "in this post", "in this article", "here's the thing", "let that sink in",
    "it's worth noting", "it is worth noting", "at the end of the day", "when it comes to",
    "full stop.", "make no mistake", "let me be clear", "the truth is", "at its core",
    "in today's", "this matters because", "the implications are", "the stakes are high",
    "here's the kicker", "the real magic", "as we'll see", "but that's another post",
    "nobody tells you", "nobody mentions", "what nobody tells",
]
BANNED_WORDS = [
    "delve", "delves", "delving", "landscape", "leverage", "leveraging", "unlock", "unlocks",
    "robust", "seamless", "seamlessly", "powerful", "game-changing", "game changer",
    "revolutionary", "revolutionize", "tapestry", "testament", "realm", "deep dive",
    "crucial", "supercharge", "elevate",
]
FILLERS = ["actually", "genuinely", "honestly", "simply", "literally", "really", "basically"]
PLACEHOLDERS = re.compile(r"PLACEHOLDER|\bTODO:|\[TODO\]|\bTBD\b|\[TK\]|\bTK\b(?=[:\]])|[Ll]orem ipsum|\[citation needed\]|\bXXX\b")
EMOJI = re.compile("[\U0001F300-\U0001FAFF\U00002600-\U000027BF\U0001F000-\U0001F2FF]")
CONTRAST = re.compile(
    r"\b(?:it'?s|it is|this is|that'?s|that is|isn'?t|is not|wasn'?t|was not)\s+not?\s*[^.!?\n]{1,60}?[.;—–]\s*"
    r"(?:it'?s|it is|it was|this is|that'?s)\b",
    re.I,
)


class Report:
    def __init__(self):
        self.rows = []

    def add(self, level, check, msg):
        self.rows.append((level, check, msg))

    def ok(self, check, msg=""):
        self.add("PASS", check, msg)

    def warn(self, check, msg):
        self.add("WARN", check, msg)

    def fail(self, check, msg):
        self.add("FAIL", check, msg)

    @property
    def failed(self):
        return any(r[0] == "FAIL" for r in self.rows)

    def print(self, title, quiet=False):
        counts = {k: sum(1 for r in self.rows if r[0] == k) for k in ("FAIL", "WARN", "PASS")}
        print(f"\n== {title}  —  {counts['FAIL']} fail, {counts['WARN']} warn, {counts['PASS']} pass")
        for level in ("FAIL", "WARN", "PASS"):
            if quiet and level == "PASS":
                continue
            for lv, check, msg in self.rows:
                if lv == level:
                    print(f"  {lv:4}  {check:<22} {msg}")


def load_tags():
    return {m.group(1).strip() for m in re.finditer(r"^- id:\s*(.+)$", TAGS_YAML.read_text(), re.M)}


def split_frontmatter(text):
    m = re.match(r"^---\n(.*?)\n---\n(.*)$", text, re.S)
    if not m:
        return None, text
    return m.group(1), m.group(2)


def parse_frontmatter(block):
    fields = []
    for line in block.splitlines():
        if not line.strip():
            continue
        m = re.match(r"^([A-Za-z_]+):\s?(.*)$", line)
        if m:
            fields.append((m.group(1), m.group(2)))
        else:
            fields.append(("__continuation__", line))
    return fields


def image_size(path):
    with open(path, "rb") as f:
        head = f.read(26)
        if head[:8] == b"\x89PNG\r\n\x1a\n":
            w, h = struct.unpack(">II", head[16:24])
            return w, h
        if head[:2] == b"\xff\xd8":
            f.seek(2)
            while True:
                marker = f.read(2)
                if len(marker) < 2 or marker[0] != 0xFF:
                    return None
                if marker[1] in (0xC0, 0xC1, 0xC2, 0xC3, 0xC5, 0xC6, 0xC7, 0xC9, 0xCA, 0xCB, 0xCD, 0xCE, 0xCF):
                    f.read(3)
                    h, w = struct.unpack(">HH", f.read(4))
                    return w, h
                (seg_len,) = struct.unpack(">H", f.read(2))
                f.seek(seg_len - 2, 1)
        if head[:4] == b"RIFF" and head[8:12] == b"WEBP":
            return None  # rare here; dimensions checked by eye
    return None


def strip_code(body):
    body = re.sub(r"```.*?```", "", body, flags=re.S)
    return body


def prose_text(body):
    t = strip_code(body)
    t = re.sub(r"`[^`]*`", "code", t)
    t = re.sub(r"\]\([^)]*\)", "]", t)
    return t


def words(t):
    return re.findall(r"[A-Za-z0-9€°%][\w'’€°%.-]*", t)


def sections(body):
    """Split body into (heading, text) chunks by H2; first chunk heading is None (the hook)."""
    parts = re.split(r"^## +(.+)$", strip_code(body), flags=re.M)
    out = [(None, parts[0])]
    for i in range(1, len(parts), 2):
        out.append((parts[i].strip(), parts[i + 1] if i + 1 < len(parts) else ""))
    return out


def validate(path, keyword=None, secondary=(), kind=None, calibrate=False):
    r = Report()
    path = path.resolve()
    text = path.read_text()
    tags_known = load_tags()

    # --- location & slug
    try:
        rel = path.relative_to(POSTS)
    except ValueError:
        r.fail("location", f"not under src/posts/: {path}")
        rel = None
    slug = path.stem
    if rel and len(rel.parts) == 2 and re.fullmatch(r"\d{4}", rel.parts[0]):
        r.ok("location", str(rel))
    elif rel:
        r.fail("location", f"expected src/posts/<year>/<slug>.md, got {rel}")
    if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", slug):
        r.fail("slug", f"'{slug}' is not lowercase kebab-case")
    elif re.match(r"\d{4}-\d{2}", slug):
        r.fail("slug", f"'{slug}' starts with a date — URLs are permanent, keep dates out")
    elif not 2 <= len(slug.split("-")) <= 9:
        r.warn("slug", f"'{slug}' has {len(slug.split('-'))} words (aim 3–7, keyword-bearing)")
    else:
        r.ok("slug", f"/{slug}/")

    # --- frontmatter
    block, body = split_frontmatter(text)
    if block is None:
        r.fail("frontmatter", "missing or malformed --- block")
        return r
    fields = parse_frontmatter(block)
    keys = [k for k, _ in fields]
    fm = dict(fields)
    if "__continuation__" in keys:
        r.fail("frontmatter", "multi-line / unparseable line in frontmatter — keep every field on one line")
    if "permalink" in fm:
        r.fail("frontmatter", "`permalink` is not used on this site — remove it")
    if keys != FIELD_ORDER:
        missing = [k for k in FIELD_ORDER if k not in fm]
        extra = [k for k in keys if k not in FIELD_ORDER]
        msg = f"order/keys {keys} != {FIELD_ORDER}"
        if missing:
            msg += f"; missing {missing}"
        if extra:
            msg += f"; unexpected {extra}"
        r.fail("frontmatter", msg)
    else:
        r.ok("frontmatter", "all 8 fields, house order")

    if fm.get("layout") != "post":
        r.fail("layout", f"must be `post`, got {fm.get('layout')!r}")
    if fm.get("author") != "[masimplo]":
        r.fail("author", f"must be `[masimplo]`, got {fm.get('author')!r}")

    title = fm.get("title", "")
    raw_title = title
    if title.startswith('"') and title.endswith('"'):
        title = title[1:-1]
    elif ": " in title or title.endswith(":"):
        r.fail("title", "contains a colon but is unquoted — YAML will break")
    elif raw_title.startswith("'"):
        r.warn("title", "single-quoted; house style is unquoted (double quotes only when a colon is present)")
    if not title:
        r.fail("title", "empty")
    elif len(title) > 110:
        r.warn("title", f"{len(title)} chars — long for <title>/og:title; front-load the searchable phrase")
    else:
        r.ok("title", f"{len(title)} chars")

    tags_raw = fm.get("tags", "")
    m = re.fullmatch(r"\[(.*)\]", tags_raw.strip())
    if not m:
        r.fail("tags", f"must be an inline array like [AI, Code], got {tags_raw!r}")
        tags = []
    else:
        tags = [t.strip() for t in m.group(1).split(",") if t.strip()]
        unknown = [t for t in tags if t not in tags_known]
        if unknown:
            r.fail("tags", f"not in src/content/tag.yaml (exact TitleCase ids): {unknown}")
        elif not 2 <= len(tags) <= 5:
            r.warn("tags", f"{len(tags)} tags (house range 2–5)")
        else:
            r.ok("tags", f"{tags}  (tags[0]={tags[0]!r} drives meta + related posts)")
        if tags and not re.fullmatch(r"\[[^,\]]+(?:, [^,\]]+)*\]", tags_raw.strip()):
            r.warn("tags", "format as `[A, B, C]` — comma + single space")

    date_raw = fm.get("date", "").strip().strip('"')
    try:
        d = dt.date.fromisoformat(date_raw)
        if rel and len(rel.parts) == 2 and rel.parts[0] != str(d.year):
            r.warn("date", f"{date_raw} but file is in {rel.parts[0]}/ (fine if backdated on purpose)")
        elif d > dt.date.today():
            r.warn("date", f"{date_raw} is in the future")
        else:
            r.ok("date", date_raw)
    except ValueError:
        r.fail("date", f"must be ISO YYYY-MM-DD, got {date_raw!r}")

    if fm.get("draft") == "false":
        r.ok("draft", "false")
    elif fm.get("draft") == "true":
        r.warn("draft", "true — post is excluded from pages, sitemap, and RSS")
    else:
        r.fail("draft", f"must be true/false, got {fm.get('draft')!r}")

    excerpt = fm.get("excerpt", "").strip().strip('"')
    if not excerpt:
        r.fail("excerpt", "missing — Gatsby will auto-truncate the first ~140 chars as meta description")
    elif not 100 <= len(excerpt) <= 165:
        r.warn("excerpt", f"{len(excerpt)} chars (aim ~120–155 for the meta description)")
    else:
        r.ok("excerpt", f"{len(excerpt)} chars")
    if ": " in fm.get("excerpt", "") and not fm.get("excerpt", "").startswith('"'):
        r.fail("excerpt", "contains ': ' unquoted — YAML will break or truncate it")

    # --- header image
    img = fm.get("image", "")
    if PLACEHOLDERS.search(img):
        r.fail("image", f"placeholder path {img!r}")
    img_path = (path.parent / img).resolve() if img else None
    if not img:
        r.fail("image", "missing — no header, no og:image/twitter:image")
    elif not img.startswith("../../images/headers/"):
        r.fail("image", f"must be ../../images/headers/<file>, got {img!r}")
    elif not img_path.exists():
        r.fail("image", f"file not found: {img_path.relative_to(ROOT) if ROOT in img_path.parents else img_path} "
               "(build will NOT fail — the post silently ships without header/social card)")
    else:
        size = img_path.stat().st_size
        dims = image_size(img_path)
        name = img_path.name
        if size < 50_000:
            r.fail("image", f"{name} is {size} bytes — likely a failed generation")
        elif size > 4_000_000:
            r.warn("image", f"{name} is {size/1e6:.1f} MB — heavy; sharp will resize but the repo carries it")
        if dims:
            w, h = dims
            ratio = w / h
            if ratio > 2.0:
                r.fail("image-aspect", f"{w}×{h} ({ratio:.2f}:1) — too wide; 800px-tall cover crop loses the sides. Target 16:9")
            elif ratio < 1.3:
                r.warn("image-aspect", f"{w}×{h} ({ratio:.2f}:1) — too tall/square for a header; target 16:9 (3:2 ok)")
            elif w < 1200:
                r.warn("image-size", f"{w}×{h} — under 1200px wide, soft on large screens")
            else:
                r.ok("image", f"{name} {w}×{h} ({ratio:.2f}:1), {size//1000} KB")
        else:
            r.warn("image", f"{name}: could not read dimensions — check by eye")
        if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*\.(png|jpe?g|webp)", name) and not calibrate:
            r.warn("image-name", f"{name} — use a descriptive kebab-case, keyword-bearing filename")
        reused = [str(q.relative_to(POSTS)) for q in POSTS.glob("*/*.md")
                  if q.resolve() != path and f"headers/{name}" in q.read_text()]
        if reused and not calibrate:
            r.warn("image-reuse", f"{name} is also the header of {reused} — each post gets its own image")
        ignored = subprocess.run(["git", "check-ignore", "-q", str(img_path)], cwd=ROOT).returncode == 0
        if ignored:
            r.fail("image-git", f"{name} is gitignored — it will never be deployed")
    if (ROOT / "nanobanana-output").exists() and not calibrate:
        r.warn("leftovers", "nanobanana-output/ still exists — copy the chosen image to headers/ and delete it")

    # --- body structure
    code_free = strip_code(body)
    if re.search(r"^#{3,} ", code_free, re.M):
        r.fail("headings", "uses ### or deeper — H2 only")
    if re.search(r"^# ", code_free, re.M):
        r.fail("headings", "H1 in body — the title is the only H1")
    h2s = re.findall(r"^## +(.+)$", code_free, re.M)
    if not 4 <= len(h2s) <= 7:
        r.warn("headings", f"{len(h2s)} H2 sections (house range 4–7)")
    else:
        r.ok("headings", f"{len(h2s)} H2 sections")
    first_block = code_free.lstrip().split("\n", 1)[0]
    if first_block.startswith("## "):
        r.fail("hook", "post opens with a heading — needs 2–4 un-headed hook paragraphs first")

    if re.search(r"!\[[^\]]*\]\(", code_free):
        r.fail("inline-images", "body contains inline images — header image only")
    if re.search(r"^\|.*\|\s*$\n^\|[\s:|-]+\|\s*$", code_free, re.M):
        r.warn("tables", "contains a table — only OK when comparing options with identical attributes")
    if EMOJI.search(text):
        r.fail("emoji", f"emoji found: {sorted(set(EMOJI.findall(text)))}")
    ph = PLACEHOLDERS.findall(body)
    if ph:
        r.fail("placeholders", f"found {sorted(set(ph))}")

    # --- links
    links = re.findall(r"\]\(([^)\s]+)\)", code_free)
    internal = [l for l in links if l.startswith("/")]
    bad = []
    for l in internal:
        target = l.split("#")[0]
        if not target.endswith("/"):
            bad.append(f"{l} (needs trailing slash)")
            continue
        s = target.strip("/")
        if "/" in s:
            if not s.startswith(("tags/", "author/")):
                bad.append(f"{l} (no such route shape)")
            continue
        if not list(POSTS.glob(f"*/{s}.md")) and s not in ("about",):
            bad.append(f"{l} (no src/posts/*/{s}.md)")
    self_abs = [l for l in links if re.match(r"https?://(www\.)?masimplo\.com", l)]
    if bad:
        r.fail("internal-links", "; ".join(bad))
    elif not internal:
        r.warn("internal-links", "none — add 1–3 root-relative links to related posts")
    else:
        r.ok("internal-links", f"{len(internal)} resolve")
    if self_abs:
        r.warn("internal-links", f"absolute masimplo.com links — use root-relative /slug/: {self_abs}")

    # --- length
    prose = prose_text(body)
    wc = len(words(prose))
    has_code = "```" in body
    kind = kind or ("technical" if has_code else "opinion")
    lo, hi = (700, 1600) if kind == "technical" else (700, 1200)
    if wc < 550 or wc > hi + 300:
        r.fail("length", f"{wc} words — far outside {kind} range {lo}–{hi}")
    elif not lo <= wc <= hi:
        r.warn("length", f"{wc} words — outside {kind} range {lo}–{hi}")
    else:
        r.ok("length", f"{wc} words ({kind} range {lo}–{hi})")

    # --- slop & voice heuristics
    low = prose.lower()
    # quoted text is a mention, not a use ("a phrase I banned: \"this matters because\"")
    used = re.sub(r'"[^"\n]{1,80}"|“[^”\n]{1,80}”', '""', prose).lower()
    slop = [p for p in SLOP_PHRASES if p in used]
    if slop:
        r.fail("slop-phrases", f"{slop}")
    else:
        r.ok("slop-phrases", "none")
    banned = sorted({w for w in BANNED_WORDS if re.search(rf"\b{re.escape(w)}\b", used)})
    if banned:
        r.fail("banned-words", f"{banned} (a quoted product name/error string is fine — justify it)")
    else:
        r.ok("banned-words", "none")
    filler_counts = {w: len(re.findall(rf"\b{w}\b", low)) for w in FILLERS}
    filler_counts = {w: c for w, c in filler_counts.items() if c}
    total_filler = sum(filler_counts.values())
    if total_filler > 3 or filler_counts.get("actually", 0) > 1:
        r.warn("fillers", f"{filler_counts} — cut the ones not doing real contrast work")
    else:
        r.ok("fillers", f"{filler_counts or 'none'}")
    dashes = prose.count("—")
    density = dashes * 100 / max(wc, 1)
    if density > 2.0:
        r.warn("em-dashes", f"{dashes} ({density:.1f}/100 words) — house is ~1–1.7; convert extras to commas/colons/periods")
    else:
        r.ok("em-dashes", f"{dashes} ({density:.1f}/100 words)")
    contrasts = CONTRAST.findall(prose)
    if len(contrasts) > 1:
        r.warn("contrast-formula", f"{len(contrasts)} 'it's not X — it's Y' constructions (max 1, and only as thesis)")
    questions = len(re.findall(r"\?(?=\s|$)", prose))
    if questions > 3:
        r.warn("questions", f"{questions} question marks — rhetorical questions are pivots, max ~2")
    def prose_bold(t):  # bold inside bullet lists (e.g. bolded numbers) is fine
        return sum(len(re.findall(r"\*\*[^*]+\*\*", ln)) for ln in t.splitlines()
                   if not re.match(r"\s*([-*]|\d+\.)\s", ln))
    bold_heavy = [h or "(hook)" for h, t in sections(body) if prose_bold(t) > 1]
    if bold_heavy:
        r.warn("bold", f"more than one bold phrase in: {bold_heavy}")
    paras = [p.strip() for p in re.split(r"\n\s*\n", strip_code(body)) if p.strip() and not p.strip().startswith(("#", "-", "*", "|", ">"))]
    if paras:
        last = paras[-1]
        if len(words(last)) > 70:
            r.warn("closer", f"final paragraph is {len(words(last))} words — closer should be 1–3 sentences")

    # --- keywords
    if keyword:
        kw = keyword.lower()
        hook = " ".join(words(prose)[:100]).lower()
        checks = {
            "title": kw in title.lower(),
            "excerpt": kw in excerpt.lower(),
            "first-100-words": kw in hook,
            "an-H2": any(kw in h.lower() for h in h2s),
        }
        toks = [t for t in re.findall(r"[a-z0-9]+", kw) if len(t) > 2]
        slug_hits = sum(t in slug.split("-") for t in toks)
        checks["slug"] = slug_hits >= max(1, len(toks) // 2)
        missing = [k for k, v in checks.items() if not v]
        if missing:
            r.warn("keyword", f"'{keyword}' missing from {missing} (variants OK — confirm by eye)")
        else:
            r.ok("keyword", f"'{keyword}' in title, excerpt, hook, an H2, slug")
        n = low.count(kw)
        if n > max(6, wc // 150):
            r.warn("keyword-stuffing", f"'{keyword}' appears {n}× in the body — reads written-for-Google")
    for s in secondary:
        n = low.count(s.lower())
        if n == 0:
            r.warn("secondary-kw", f"'{s}' not in body (fine if it didn't fit naturally — say so)")
        elif n > max(5, wc // 120):
            r.warn("secondary-kw", f"'{s}' appears {n}× — reads stuffed unless it's the literal subject")
        else:
            r.ok("secondary-kw", f"'{s}' ×{n}")

    return r


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("post", nargs="?")
    ap.add_argument("--keyword")
    ap.add_argument("--secondary", action="append", default=[])
    ap.add_argument("--kind", choices=["opinion", "technical"])
    ap.add_argument("--all", action="store_true", help="validate every post, show only FAIL/WARN")
    ap.add_argument("--since", type=int, default=2025, help="with --all: only year folders >= this (default 2025)")
    a = ap.parse_args()
    if a.all:
        failed = 0
        for p in sorted(q for q in POSTS.glob("*/*.md") if int(q.parent.name) >= a.since):
            rep = validate(p, calibrate=True)
            failed += rep.failed
            rep.print(str(p.relative_to(ROOT)), quiet=True)
        print(f"\n{failed} post(s) with FAIL")
        sys.exit(1 if failed else 0)
    if not a.post:
        ap.error("post path required (or --all)")
    rep = validate(pathlib.Path(a.post), a.keyword, a.secondary, a.kind)
    rep.print(a.post)
    print("\nRESULT:", "FAIL" if rep.failed else "PASS (mechanical) — now do the judgment review")
    sys.exit(1 if rep.failed else 0)


if __name__ == "__main__":
    main()
