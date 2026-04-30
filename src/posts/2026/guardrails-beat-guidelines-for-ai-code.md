---
layout: post
title: Guardrails beat guidelines — how to keep AI-generated code honest
author: [masimplo]
tags: [AI, Code, Testing, Opinions]
image: ../../images/headers/guardrails-ai-code.png
date: 2026-04-30
draft: false
---

I have been shipping AI-assisted code in production for a while now, and the failure mode I keep seeing is not the obvious one. It is not a model hallucinating an API that does not exist — that gets caught the second you try to run the thing. The dangerous bugs are the ones where the code compiles, the tests the model wrote pass, the PR description sounds reasonable, and the function quietly does the wrong thing on the third Tuesday of the month.

You cannot prompt your way out of that. You can write the most beautiful `AGENTS.md` in the world, paste in your style guide, beg the model to "follow our conventions," and it will still drift the moment the task gets ambiguous. Words are advisory. The model is allowed to disagree with them, and sometimes does.

What actually works is the same thing that has always worked with humans new to a codebase: **guardrails that say no.**

## The "guidelines" trap

Every team I have talked to in the last year has the same instinct. The AI is producing inconsistent code, so they write a document. "Always use named exports." "Prefer composition over inheritance." "No `any` in TypeScript." "Tests must mock at the boundary, not the function under test."

The document grows. The model reads it (mostly). The output gets a little better. Then someone hits a tricky task, the prompt context gets crowded, and one of those rules quietly slips. Nobody notices because nobody reads PRs line by line anymore.

The extreme version of this instinct is the joke that circulates among vibe coders: open your prompt with "you are a very experienced senior developer — make absolutely no mistakes." The laugh track writes itself. But the failure mode it describes is real: you are trying to solve a reliability problem by asking the unreliable thing to try harder.

The problem is not that guidelines are bad. The problem is that **guidelines are a soft constraint enforced by the very thing you do not fully trust.** It is like asking a contractor to inspect their own work and grade themselves honestly. They might. They probably will. But you would not run a building code that way.

## What junior developers taught us

Think back to how you onboarded a new hire ten years ago. You did not hand them a binder labeled "Our Conventions" and hope. You gave them the binder *and*:

- A linter that yelled at them when their PR opened.
- A type checker that refused to compile bad assumptions.
- A unit test suite that turned red when they broke an invariant they did not know existed.
- An end-to-end suite that caught the cross-system mistakes the unit tests could not.
- A code review where a senior asked "what happens if this is null?"

The binder mattered. But the **automated, deterministic, no-hard-feelings tooling** is what actually stopped bad code from reaching production. The junior could not argue with the linter. The CI did not care about their feelings. They learned the rules by bumping into the walls until the walls stopped moving.

AI is the same kind of contributor. A fast, confident, occasionally overconfident new hire who has never seen your business logic before. Treat it like one.

## What guardrails actually look like

There is nothing exotic here. The point is precisely that there is nothing exotic — the tools have existed for years and we already trust them on human-written code. The shift is using them as the **primary** quality gate for AI output, not the secondary one.

A reasonable starting set, in rough order of how cheap they are to add:

1. **A strict linter and formatter.** ESLint with sensible rules, Prettier, `tsc --noEmit` for TypeScript, `ruff` for Python, `clippy` for Rust. Run on pre-commit *and* in CI so neither the human nor the AI can skip it.
2. **A type system used seriously.** Strict mode on. No implicit `any`. Discriminated unions for state. The compiler is the cheapest reviewer you will ever hire.
3. **Unit tests for invariants.** Not "test that the function returns something." Test the rule the function is supposed to embody — boundary conditions, error paths, the case the spec mentions in passing.
4. **Integration or contract tests at module seams.** Where two services or two layers meet, verify the shape of what crosses. This is where AI-generated code most often hides assumptions.
5. **End-to-end tests for critical user flows.** Slow, expensive, worth it. If "user can log in and pay" is broken, nothing else matters.
6. **A reviewer who reads the diff.** Still required. The guardrails catch what they were designed to catch — the human catches the unknown unknowns.

Notice that this list is not "AI-specific." It is the test pyramid your CTO has been gently nagging about for years. The AI just makes the cost of *not* having it much higher, much faster.

## Why this works better than prompts

The advantages compound on each other, but the first one is foundational: guardrails are deterministic. A linter run produces the same result every time. A failing unit test is a failing unit test. A prompt that says "be careful about null" is interpreted differently by every model release, every context window, every time of day. You cannot build a quality system on probability.

The second advantage is that guardrails do not need to be re-stated. Once `noImplicitAny` is on, it is on for every PR forever. Every time you add a rule to your prompt, you are paying tokens, and that rule competes with the actual task description for the model's attention. Push the rule into tooling and the prompt gets to be about the *interesting* part of the task.

The third — and this is the one I keep coming back to — is that guardrails catch what specs miss. The spec for a feature is always incomplete. The author did not think of the empty list case, or the timezone edge, or the user who has been logged in since 2019. The AI faithfully implements the incomplete spec, and the bug ships. A unit test that asserts the invariant ("the total is always non-negative") catches it even when nobody thought to write it down in English. Tests encode the things humans forget to say.

## A concrete example

Here is a small one. Suppose you ask the AI to add a discount calculation to a cart. The spec says: "apply a 10% discount when total exceeds €100."

The model produces something like:

```typescript
function applyDiscount(total: number): number {
  if (total > 100) {
    return total * 0.9;
  }
  return total;
}
```

It is not wrong. It compiles. It probably even has a passing test the model wrote, something like `expect(applyDiscount(150)).toBe(135)`. Ship it.

Except the cart total can be negative when refunds are applied. The function happily returns a negative number unchanged. There is no rounding, so floating-point gives you `134.99999...` on certain inputs. The boundary at exactly `100` is excluded — was that intentional? Nobody said.

A reviewer might catch one of those. Three guardrails would catch all of them:

```typescript
test('never returns a negative total', () => {
  expect(applyDiscount(-50)).toBeGreaterThanOrEqual(0);
});

test('rounds to two decimal places', () => {
  expect(applyDiscount(123.45)).toBe(111.11);
});

test('boundary at 100 is documented', () => {
  expect(applyDiscount(100)).toBe(100); // or 90 — pick and lock it
});
```

Notice that those tests are not about the AI. They are about the **business invariants** that should hold regardless of who wrote the function. Once they exist, any future AI-generated rewrite of `applyDiscount` is automatically held to the same standard. The guardrail outlives the contributor.

## The reviewer is still in the loop

I am not arguing that automation removes humans. The opposite — guardrails free reviewers to do the work only humans can do. If the linter, the type checker, and the test suite have already said yes, the reviewer can stop checking trivia and start asking real questions. *Does this design make sense? Is this the right abstraction? What happens when the team that owns the upstream service deprecates this endpoint?*

That is where the senior judgment lives. AI is not close to replacing it. But spending senior attention on missing semicolons and ESLint warnings, when the machine would happily do that for free, is a waste of the most expensive resource on the team.

## Where to start

If your codebase has weak guardrails today, the order of operations is roughly:

- Turn on the strictest version of the tooling you already have. Strict TypeScript. Lint with `--max-warnings 0`. Make CI fail loudly.
- Add tests for the invariants you most fear breaking — the things that would page someone at 3am.
- Add an end-to-end test for the one flow that, if broken, makes the product useless.
- *Then* think about prompts and guidelines. They are the icing, not the cake.

None of this is AI-specific. Guardrails are just good engineering — it is the AI that removes the option of pretending you can get by without them.

The model is not going to grade itself. The reviewer is not going to read every line. The spec is not going to mention every edge case. Something has to hold the line — and the things best suited for that job have been sitting in your repo, switched off or half-configured, the whole time.

Turn them on. Then let the AI cook.
