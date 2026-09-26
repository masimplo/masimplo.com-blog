# Keyword research

Goal: find the phrases real people are searching for **right now** around this post's topic, and weave the relevant ones in so the post ranks, without a reader ever noticing. This is a personal blog with modest domain authority. It wins on **specific, experience-heavy, long-tail queries**, not head terms.

Spend about 10 minutes here. The output is the research brief described in SKILL.md step 2.

## 1. Seed terms

Write 3–5 seeds from the author's material: the product or tool name, the problem, and the outcome. For example, for the Daikin post: `weather compensation heat pump`, `daikin weather dependent`, `heat pump LWT`, `heat pump energy saving`.

## 2. Autocomplete: what people type

Google Autocomplete is free, needs no key, and reflects current search demand. Expand each seed with modifiers:

```bash
q() { curl -s "https://suggestqueries.google.com/complete/search?client=firefox&q=$(python3 -c 'import sys,urllib.parse;print(urllib.parse.quote(sys.argv[1]))' "$1")" \
  | python3 -c 'import json,sys; [print(s) for s in json.load(sys.stdin)[1]]'; }
for m in "" " vs" " how to" " not working" " worth it" " 2026" " for" " without" " best"; do q "<seed>$m"; done | sort -u
```

Look for question and problem phrasings ("X not working", "X vs Y", "is X worth it"). Those match the author's experience-driven format.

## 3. Hotness: what developers are talking about

Hacker News search via Algolia, free and without a key, shows whether a topic is current in the developer crowd:

```bash
since=$(( $(date +%s) - 90*86400 ))   # last 90 days
curl -s -g "https://hn.algolia.com/api/v1/search?query=<url-encoded seed>&tags=story&numericFilters=created_at_i%3E$since&hitsPerPage=10" \
  | python3 -c 'import json,sys; d=json.load(sys.stdin); print(d["nbHits"],"hits"); [print(h["points"], h["created_at"][:10], h["title"]) for h in d["hits"]]'
```

High-point recent stories reveal the vocabulary in use, such as "AGENTS.md", "vibe coding", "Skills". A term trending there is worth using if it fits.

For non-developer topics (EVs, coffee, heat pumps, 3D printing), use **WebSearch** instead. Load it via ToolSearch (`select:WebSearch,WebFetch`) and query `<seed>` plus `<seed> reddit` / `<seed> forum` to see how enthusiasts phrase it. Reddit's JSON API blocks unauthenticated requests from this machine, so don't bother with curl there.

## 4. The competition: what already ranks

WebSearch the 1–2 best candidate phrases. WebFetch the top 3–5 results and note:
- What they all cover. The post can mention this briefly or skip it.
- What none of them has: real numbers, a failure, a verdict from ownership. **That gap is the post's reason to exist**, and it goes in the brief.
- Terms they all use that the draft hasn't used yet. These are semantic keywords that search engines expect on the page.
- Facts to verify: specs, prices, versions, release dates. Record the source URL.

## 5. Avoid cannibalizing your own posts

```bash
grep -ril "<primary keyword>" src/posts/ | head
```

If an existing post already targets the same phrase, either pick a different primary angle or link to the old post and differentiate clearly. Also note 1–3 related posts for internal links.

## 6. Choose

- **Primary keyword**: one long-tail phrase, 3–6 words, with evidence of demand, that the author's experience answers well. Example: `heat pump weather compensation curve`.
- **Secondary keywords**: 2–4 related phrases or synonyms, such as `daikin weather dependent setting` and `lower flow temperature`.
- **Discard** anything the author has no experience with, even if it's hot.

## Placement rules (natural, never stuffed)

| Where | How |
|---|---|
| Title | Primary phrase, or a close variant, in the front half. Keep the editorial voice. |
| Slug | Built from the primary phrase. |
| Excerpt | Contains the primary phrase and reads as a hook, ~120–155 chars. |
| First ~100 words | Primary phrase appears once, inside the story, not as a definition. |
| One `##` heading | Carries a primary or secondary phrase, still wry and voice-forward. |
| Body | Each secondary keyword appears once or twice where the author would naturally say it. Use exact product names, error strings, and version numbers, which are long-tail keywords in their own right. |
| Image filename | Descriptive and keyword-bearing: `daikin-weather-compensation.png`. |

**The out-of-place test:** read each keyword sentence aloud. If it sounds like it was written for Google, such as "When it comes to heat pump weather compensation curve settings…", rewrite it or remove the keyword. A missing secondary keyword costs almost nothing. A sentence that smells of SEO costs the reader's trust.

## Brief format

```
Reader question: …
Primary: <phrase>  (evidence: autocomplete ✓ / HN n stories, top Xpts / SERP)
Secondary: <phrase> (evidence), …
Rejected: <phrase> — why (no author experience / cannibalizes /slug/ / off-topic)
Top results cover: …
Gap this post fills: …
Verified facts: <fact> — <source URL>
Internal links: /slug-a/, /slug-b/
Proposed slug: <slug>   Proposed title: <title>
```
