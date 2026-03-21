---
layout: post
title: The week coding assistants stopped pretending to be autocomplete
author: [masimplo]
tags: [Technology, AI, Code]
image: ../../images/headers/florian-olivo-4hbJ-eymZ1o-unsplash.jpg
date: 2025-03-05
draft: false
---

If you write software for a living, you develop a reflex for classifying tools. “Helpful sometimes.” “Annoying often.” “Fine for boilerplate.” For a long time, that is where AI coding assistants lived — supercharged snippets, easy to verify, easy to discard.

Claude 3.7 Sonnet, arriving late February 2025, was the first time I caught myself doing something different: **delegating context**, not lines. And once the tool is holding more context than you are willing to re-read in one sitting, you are no longer in the autocomplete universe. You are in a workflow that looks like engineering management — except the junior engineer never sleeps and occasionally hallucinates with conviction.

## What crossed the line for me

Two things moved at once.

**Reasoning-shaped behavior** — the model arguing with itself in ways that map better to real refactors than to “insert a function here.” Not perfect, but qualitatively different from “predict the next token that looks like GitHub.”

**Agent-shaped tooling** — the ecosystem around it finally stopped apologizing for touching more than one file. The product surface area shifted from “suggest” to “attempt a slice of work,” which is exactly where trust and review load spike.

GPT-4.5 showing up in the same window did not hurt the narrative either: the market was loudly experimenting with “bigger / broader” while Anthropic was pushing “better at long, messy code.” As a buyer of outcomes, that is the kind of competition you want — even if it is exhausting to keep up.

## What still breaks

**Security and secrets** did not get solved. If anything, faster authoring widens the blast radius of a bad habit — pasted credentials, over-broad permissions, “just call this API.”

**Tests lie politely.** Generated tests often encode the same misunderstanding as the generated code. Green CI is not a proof; it is a report that your misunderstanding is internally consistent.

**Org knowledge stays human.** Why we do things — the failure that created the guardrail — is not in the repo in a form the model reliably respects. You still need reviewers who know which shortcuts are forbidden for reasons that never made it into a comment.

## What I changed in practice

Smaller PRs when AI is involved, not because the model cannot do big ones — it can — but because **human review does not scale with model enthusiasm**.

Explicit “no-go” zones in prompts and in team norms: auth, billing, anything that moves money or PII, anything that is hard to roll back.

More emphasis on **architecture notes** in-repo. If the only record of intent is tribal memory, you will lose to a tool that confidently implements the wrong intent beautifully.

## The vibe-coding conversation

Early March was also when “vibe coding” stopped being a niche meme and turned into a mainstream argument: ship fast, feel the output, worry about understanding later. I get the appeal. I also know what production incidents feel like when understanding arrives at 2 a.m.

The boring take is the true one: **speed without judgement is just technical debt with better marketing.**

## What stuck

The assistants are real now — not as oracles, but as accelerants. The job shifted further toward specifying outcomes, constraining risk, and reviewing diffs with the same skepticism you would apply to a confident human contributor.

If you are still treating AI output like a fancy linter, you are under-using it. If you are treating it like an author you do not have to review, you are about to learn why the rest of us are tired.
