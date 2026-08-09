---
layout: post
title: AI code review is the bottleneck — writing got cheap
author: [masimplo]
tags: [AI, Opinions, Code]
image: ../../images/headers/ai-code-review-bottleneck.png
date: 2025-04-28
draft: false
excerpt: Agents fill the merge queue faster than humans can read. The constraint moved from typing to verification — and most teams still review like nothing changed.
---

I can open three pull requests in an afternoon now without breaking a sweat. A clear plan, more than one agent session, a repo that actually fails CI when types and tests are wrong — the writing side of the loop is no longer where I wait.

The waiting moved. It sits in review.

That sounds like a complaint about lazy teammates. It is not. It is Amdahl's law showing up in the merge queue. Compress the "write" stage and the next slowest stage becomes the schedule. For a lot of teams right now, that stage is a human with a finite attention budget staring at diffs that got larger, denser, and more frequent.

## The queue I keep creating for myself

When I fan a feature out across parallel agent sessions — the same instinct as [splitting work across Claude Code agents](/claude-code-parallel-agents-feature/) — the happy path is three coherent slices landing close together. The unhappy path is three coherent-looking slices landing close together. Same shape. Different cost.

I used to review my own work as I wrote it — the thinking and the typing shared a brain. Now the typing is outsourced and the thinking has to catch up *after* the code exists. That lag is the bottleneck. I am not waiting on CI. I am waiting on myself to actually understand what just showed up.

Rubber-stamping is the easy failure mode. You skim, the tests are green, the PR description is fluent, you hit approve. The dangerous bugs — the ones that pass the model-written tests and fail on the third Tuesday — love that workflow.

## What changed about the diff

AI-assisted PRs are not just more numerous. They are **harder per unit of review time**.

A human colleague leaves breadcrumbs. You know how they think. You can ask them why the retry loop sits where it sits. An agent leaves a plausible narrative and a wall of correct-looking TypeScript. There is no shared intent to lean on unless you wrote the plan down first and forced the agent to stay inside it.

Size compounds the problem. When generating is cheap, the temptation is to ship a bigger chunk "while we're here." Bigger chunks take longer to review. Longer review times encourage bigger chunks so people batch. The feedback loop is ugly.

I have started treating PR size as a hard product constraint again — the way we used to before agents made large diffs feel free. If a change needs a walkthrough video or a design doc to be reviewable, it was too big to generate in one go.

## Guardrails clear the cheap questions

[Prompt guidelines are soft constraints](/guardrails-beat-guidelines-for-ai-code/). Review is where that argument becomes operational.

Lint, types, unit tests, contract tests — those are not "nice to have" when agents are prolific. They are the only way a human reviewer stays solvent. If I am spending senior attention on missing semicolons and `any` leaks, I have already lost. The machine should have failed the PR before I opened it.

What remains for humans is the expensive stuff:

- Does this design belong in the system?
- Did we solve the right problem?
- What happens when the upstream contract changes?
- Is the failure mode loud or silent?

That is the same judgment we still have to [train juniors for](/training-juniors-critical-thinking-ai-era/). Review is where that judgment either shows up or gets outsourced to green checkmarks.

## Intent before code — or review is archaeology

The fix that helped me most was not a fancier review tool. It was refusing to generate until the plan was written somewhere durable — a short design note, an issue, a checked-in sketch of interfaces.

When the PR arrives, I review against the plan, not against vibes. *Does this implement what we said?* is a different question from *does this look like code?* The second question is how you approve technical debt that compiles.

Without that document, review becomes archaeology. You reverse-engineer intent from the diff. Agents are excellent at producing diffs that survive archaeology. That is not a compliment.

## Risk tiers, not equal scrutiny

Not every PR deserves the same depth. Auth, money, migrations, data deletion, permissions — those get the slow read. A rename with tests and a green typecheck can move faster. Pretending every change is equal is how the queue dies: either everything waits, or everything rubber-stamps.

I also run a second agent as a first pass sometimes — fresh context, "find the bugs and the missing edge cases." Useful. Not sufficient. A second model will cheerlead the first one's architecture if you let it. Treat it like a loud junior reviewer, not a merge authority.

## Where to start

If your merge queue grew when agents arrived, try the boring order:

1. Make CI mean no — types, lint, tests that encode invariants, not happy paths.
2. Cap PR size until humans can finish a review in one sitting.
3. Require a short intent note before generation on anything past a trivial fix.
4. Route high-risk paths to slower human review by policy, not by hope.
5. Measure review lead time and revert rate on agent-touched PRs — not lines shipped.

[Coding assistants stopped being autocomplete](/llms-that-actually-write-code-now/) months ago. Typing got optional. Understanding did not. The bottleneck moved to whoever still has to say yes — and on a good day, that person is you.

Writing got cheap. Attention did not. Spend it like it matters.
