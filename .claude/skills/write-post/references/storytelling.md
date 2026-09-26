# Storytelling for masimplo.com posts

People keep reading a post when they sense they don't yet know how it ends. Each post needs a question the reader wants answered, and specifics that make them trust the answer.

## Pick one shape

Every strong post in the archive fits one of these. Choose one before outlining.

**1. The investigation**: small annoyance → pull the thread → a worse discovery → root cause → fix, plus the fixes you refused.
*Examples: `npm-ci-outage-nobody-noticed`, `fear-of-the-warped-bed`.*
The tension comes from each section revealing that the problem is bigger or different than the last one suggested. Headings can track the escalation: "The number that started it" → "When the safe fix isn't" → "It was not from today".

**2. The measured change**: default everyone accepts → why it's wrong for you → one change → the numbers before and after → why nobody does this → who should.
*Example: `daikin-weather-compensation-curve`.*
The tension is whether the number moves. Put the baseline number early and hold the result until the middle.

**3. Expectation vs. ownership**: what the pitch promised → what living with it was like → the thing that surprised you → an honest verdict with a clear "who it's for".
*Examples: `owning-an-ev-what-nobody-tells-you`, `fellow-aiden-coffee-maker-review`, `voron-build-vs-maintenance`.*
The tension comes from the reader wondering whether to buy or do it. Deliver a verdict they can act on.

**4. The argument**: a common belief → a concrete incident that broke it → the extended analogy → where the analogy breaks → what you do now → where it stops working.
*Examples: `guardrails-beat-guidelines-for-ai-code`, `training-juniors-critical-thinking-ai-era`.*
The tension is the opposing view. State it fairly, then take it apart with evidence from your own work.

**5. The build log**: the itch → constraints → the key decisions and one wrong turn → what it does now → what I'd change.
*Examples: `portfolio-ticker-multi-broker-monitor`, `three-ionic-apps-one-nx-monorepo`.*
The tension sits in the decisions. Show the alternative you rejected and why.

## Beat outline template

```
Shape: <1–5>
Reader question: <the one thing a searcher wants answered>
Hook (2–4 short paras, no heading): <concrete scene or setup→subversion; primary keyword in first 100 words>
Stakes: <what it cost / could cost — a number, a date, a consequence>
## <heading 1> — job: … — carried by: <specific detail/number/output>
## <heading 2> — job: … — carried by: …
…(4–7 total, varied lengths; at least one heading carries the topic phrase naturally)
Turn: <where the reader's expectation flips — must happen before 60% of the way through>
Verdict / "who this is for": <committed position + honest exceptions>
Closer: <callback to a concrete detail from the hook>
```

## Hooks that work here

- **Scene in motion:** *"I sat down today to clear out some Dependabot noise on this blog — 135 vulnerabilities…"* It starts with a mundane action and ends the paragraph on the real discovery.
- **Setup, then subversion:** *"Smart home products love to sell you convenience. What they do not mention is…"* Don't repeat the "nobody mentions" phrasing. The move is to name the pitch and then name what it hides.
- **Callback to an earlier post:** *"When I wrote up the HVAC build, I waved at weather compensation and moved on. That was the polite version."* This builds continuity and an internal link at the same time.
- **A personal incident**: *"I fell from a step ladder while doing electrical work…"*

Hooks to avoid: a definition, a statistic about the industry, a question to the reader, "In this post", or any sentence that could open someone else's post.

## Keeping tension through the middle

- End sections on an open loop when you can: *"So I checked when this broke, expecting it to be something from today."* The next heading then pays it off.
- Delay the key number or verdict until it has been earned, but never past the middle. The turn needs room to land.
- Include one wrong turn or rejected option. It proves the author did the work, and readers trust someone who shows the dead end.
- Cut any section whose job you can't state in one line.

## Value checklist (the anti-slop test)

Before drafting, the outline must promise at least three of these:

- A number, output, or measurement a reader couldn't get elsewhere
- A mistake the author made and what it cost
- A decision with the rejected alternative and the reason
- A concrete "do this / check this" the reader can act on today
- A clear "who this is *not* for"
- A contrarian position backed by the author's own evidence

If the outline promises fewer than three, the post isn't ready. Go back to the author for material (SKILL.md step 1). Don't pad with generic advice.
