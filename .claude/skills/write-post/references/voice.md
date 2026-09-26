# The author's voice

Read this before drafting. Re-read the "tells" list before handing the draft to `optimize-post`.

## Calibrate on real posts first

Before drafting, read **two** existing posts close to the new topic in full. Use `ls src/posts/*/` and pick by subject. The strongest references:

| Kind of post | Read |
|---|---|
| Debugging / investigation | `2026/npm-ci-outage-nobody-noticed.md`, `2023/fear-of-the-warped-bed.md` |
| Measured tinkering / smart home | `2026/daikin-weather-compensation-curve.md`, `2026/home-assistant-local-first-smart-home.md` |
| Product / ownership verdict | `2026/fellow-aiden-coffee-maker-review.md`, `2026/owning-an-ev-what-nobody-tells-you.md` |
| Argument / opinion on AI and engineering | `2026/guardrails-beat-guidelines-for-ai-code.md`, `2026/training-juniors-critical-thinking-ai-era.md` |
| Build / project write-up | `2026/portfolio-ticker-multi-broker-monitor.md`, `2026/three-ionic-apps-one-nx-monorepo.md` |

**Anti-exemplars.** Do not imitate `2023/software-security-is-a-culture-not-a-calendar-event.md` or `2023/in-the-era-of-chatgpt.md`. They are the "In conclusion", "far-reaching implications", no-"I" register this blog has moved away from.

## Who is talking

The author is a senior engineer and tinkerer in Paiania, Attica, Greece. They build things (Voron printers, a smart HVAC system, side-project apps), measure them, and report back with numbers. The tone is warm but dry. Mistakes get admitted easily, and hype gets no patience. The writing sounds like a conversation with a colleague over coffee, not a keynote.

The `2023/fear-of-the-warped-bed.md` post is the purest sample of these instincts:
- Precise numbers carry the story: *"a deviation of only 0.004mm"*, then *"0.08mm"*, then *"To my dismay, the deviation had risen to 0.32mm."*
- The reasoning is visible, including the dead end: replacing the plate was considered and rejected on cost and lead time.
- There is a physical act: *"I got my caliper out"*.
- There is a reveal that reframes the problem: the gantry was the problem, not the bed.
- He owns the hobby: *"being a tinkerer, I couldn't just accept that this was the best I could do."*

## Signature moves (use them, don't overuse them)

- **Specifics over abstractions.** Name the tool, the version, the error text, the date, the kWh, the price. *"At roughly 11 °C outdoor, LWT was hanging around 46 °C."*
- **Em dashes** for asides and reveals. Measured house density is ~1–1.7 per 100 words. Above ~2 per 100 words it starts to read as machine prose, so convert the extras to commas, colons, parentheses, or full stops.
- **One bold phrase per section**, marking that section's thesis: *"**Your fuel cost just moved house.**"* Use it in some sections, not all of them.
- *Italics* on a single pivot word: *noticing ahead of time*, *committed*.
- **Long, then short.** A clause-heavy sentence, then a terse verdict. *"It knocked the count from 121 down to 80. It also broke the production build."*
- **Dry, deadpan asides.** *"…is not a hypothetical risk with npm's dependency tree — it's Tuesday."* Never zany. No jokey headings. No puns in headings.
- **Honesty markers.** *"I did not weigh this properly going in."*, *"I left +5 alone for too long."*, *"Probably not, and that surprised me to write down."*
- **Rhetorical questions as pivots**, at most two per post.
- **One extended analogy** per argument post. Introduce it, use it, then say where it breaks: *"Skip the analogy where it doesn't hold, though: a cron job that fails sends you a log entry."*
- **Direct address** in the prescriptive section: *"Open the controller. Note the outdoor temperature."* Second person is the exception. The spine of the post is "I".
- **Local, lived context** when relevant: Athens and Attica winters, the house, the garage, the team at work. Only use context the author has supplied or that `~/Brain` confirms.
- **No specific names** of people, the employer, clients, internal projects, or repos unless the user explicitly asks for them. Say "at work", "a teammate", "a side project". See SKILL.md step 1.

## Tells that make a post read as AI-written

These show up even in some recent posts. Do not copy them from the exemplars.

1. **Contrast formulas.** "It's not X — it's Y.", "X isn't a fix. It's a different bug…", "less X and more Y". Allow at most one per post, and only when it is the thesis. Otherwise state Y directly.
2. **"Actually" / "genuinely" / "honestly" as filler.** Target zero. Keep one only where it carries a real contrast with an expectation.
3. **"Nobody tells you / nobody mentions"** in titles and hooks. It has been used twice recently. Find another angle.
4. **The closer that restates the thesis as an aphorism built on a contrast.** Prefer a callback to a concrete detail from the opening: the caliper, the +5 offset, the 7am charge percentage.
5. **Every paragraph ending on a zinger.** Let most paragraphs end on information.
6. **Triads everywhere.** One "X, Y, and Z" rhythm per section at most.
7. **Symmetric sections.** Real posts have one long section and one two-paragraph section. Vary the length.
8. **Generic stakes.** "This matters because…", "The implications are significant". Name the consequence: the €80, the six weeks, the broken build.
9. **Hedged verdicts.** Commit: *"I landed on no."* Then give the honest exceptions.
10. **Vocabulary:** delve, landscape, leverage, unlock, robust, seamless, powerful, game-changing, navigate (figuratively), realm, tapestry, testament, crucial, "in today's fast-paced", "at the end of the day", "the real magic", "here's the kicker".
11. **Invented precision.** A number the author never gave you is a lie that looks like authenticity. Ask for it or leave it out.
12. **Explaining the basics** to this audience: what CI is, what an LLM is, what a heat pump does at a high level.

## Paragraph and sentence texture

- Paragraphs run 2–5 sentences, with the occasional one-line paragraph for a verdict.
- Contractions are used freely (it's, don't, I'd). Mixing them with the occasional formal "it is not" for emphasis is fine and matches the archive.
- British/European details appear naturally (€, °C, m², "annualisation"). Spelling is mostly US; don't police it.
- Code or terminal output shows up **as evidence**, and the prose that follows interrogates it.
