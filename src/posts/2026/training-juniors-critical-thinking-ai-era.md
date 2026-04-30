---
layout: post
title: Training juniors in the AI era — judgment, struggle, and why the field still needs new data
author: [masimplo]
tags: [Opinions, Code, Technology]
image: ../../images/headers/sb7rkosb7rkosb7r.png
date: 2026-03-21
draft: false
---

I wrote separately about [how day-to-day coding with AI has changed the job](/vibe-coding-a-developers-honest-take/). That story is mostly about people who already have a mental model of systems, failure modes, and when to be suspicious. Juniors are in a different position — and if we get how we train them wrong, we do not only hollow out the next decade of engineering. We also starve the future of the very thing models will need next: **fresh human judgment, edge cases nobody tokenized yet, and mistakes honest enough to learn from.**

This post is about how I think we should treat and train junior developers so we keep critical thinking alive — and so the profession keeps producing signal worth learning from.

## Why "faster juniors" is the wrong goal

Throughput is easy to measure. Lines merged, tickets closed, time to first PR. AI makes those numbers seductive — a junior with a strong assistant can look productive on week two in a way that was impossible before.

Productivity is not the same as formation. A junior's job in their first years is not to match a mid-level's output. It is to **build the reflexes** that never show up on a dashboard: forming a hypothesis, invalidating it with evidence, reading a stack trace without flinching, knowing when "it works on my machine" is a lie.

If we optimize for speed alone, we get people who can steer an AI to plausible code but cannot defend it under pressure — and we get teams that cannot explain their own systems. That is a training failure, not a tooling win.

## Protect unassisted struggle — on purpose

Some problems should still be solved with the assistant closed. Not every problem — that would be performative — but enough that muscle memory actually forms.

I mean the boring kind of struggle: reading the framework docs, tracing a call path by hand, reproducing a bug with a minimal example, writing a failing test before you reach for a fix. The hours that feel inefficient are often the hours that **encode the shape of the system** into your head.

Mentors should assign and defend that space. If every task is "prompt until green," the junior never pays the tuition that buys real debugging skill. The uncomfortable truth is that **confusion is data**. Skipping it trades away depth for a short-term velocity graph.

## Use AI as a tutor, not a substitute for thinking

There is a useful role for models in training — just not as an author of first resort.

Using the model to explain an error message in plain language, suggest what to search for, compare two approaches, generate examples you then pick apart, or quiz you on what a snippet does — that is closer to a patient senior in chat form. It is actually pretty good at that.

What goes wrong is when the model becomes upstream of thinking rather than a tool inside it: "generate the ticket" as the default first step, pasting opaque code into the repo because it passed CI, skipping the step where you could explain the solution to another human. When understanding never has to catch up, it does not.

My rule of thumb for juniors: you can use the tool when you can already state **what you are trying to learn** from it. If you cannot phrase the goal without jargon, you are not ready to outsource the thinking — you are ready to read slower.

## What seniors and leads owe in the loop

Training does not scale by goodwill alone. Teams need explicit structure.

Reviews should actually teach. Not only "request changes," but *why* — link to docs, sketch the failure mode, ask "what breaks if X?" If the only feedback is style nits, the junior learns politics, not systems.

Real ownership slices matter more than fake tasks. Not things that disappear into someone else's merge — vertical slices where they touch behavior, tests, and at least one sharp edge. Ownership is where accountability forms.

Psychological safety to be wrong is not a nice-to-have. If people hide mistakes because velocity is sacred, you lose the incidents that would have trained everyone — and you lose the stories models cannot invent. And then there is time, which is the scarcest input of all. If your calendar has no room for pairing, you are not training; you are staffing.

## The "new data" argument — why this matters beyond your team

Models learn from traces of human work — code, diffs, discussions, fixes. If the next generation's work is mostly "approve AI output," the corpus collapses toward **average answers to average prompts**. The weird bugs, the inspired hacks, the hard-won refactors — the stuff that used to come from friction — thin out.

I am not claiming juniors owe the industry their mistakes for dataset reasons. I am saying the **same habit** that keeps your team sharp — thinking clearly, testing honestly, admitting when something is not understood — is what produces the novel, grounded signal systems will need to improve. Training for critical thinking is not nostalgia. It is investing in the supply chain of good questions.

## What I would tell a junior directly

You are not behind because you type fewer characters than the tool. Your job is to become someone who can **steer** powerful automation without being steered by it — who knows what "done" means in context, who can say no to a plausible patch, who can sleep after a deploy because you actually know what shipped.

And what I would tell a lead: measure formation, not just output. If your juniors only ever move fast, you might be borrowing speed from their future — and from everyone downstream who will rely on their judgment later. Who sets the bar matters. I would rather it be the team than the default path the UI suggests.
