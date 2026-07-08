---
layout: post
title: Let the big model write the manual — using Fable 5 to make smaller models better
author: [masimplo]
tags: [AI, Code, Tools]
image: ../../images/headers/fable-5-writing-manual.png
date: 2026-07-07
draft: false
excerpt: I stopped pointing the frontier model at my backlog and started using it to write the Skills and guidelines my cheaper models read.
---

I got access to Fable 5 a couple of weeks ago — the first of Anthropic's Claude 5 family, the new tier that sits above Opus — and I did what everyone does with a new frontier model: I pointed it at the ugliest items in my backlog. It handled them, no complaints there. But the thing that changed my day-to-day was something smaller. I started using it to write the documents my *cheaper* models read.

Some background on my setup. I spend most of my working day inside Claude Code, and most of that time I am not running the biggest model available. Routine work — bug fixes, small features, support-ticket triage, dependency upgrades, blog posts like this one — goes to smaller, cheaper, faster models. The economics only make sense if their output is usable without constant babysitting, and the biggest lever you have over that sits outside the model picker entirely: the instructions the model reads before it starts — the repo's `CLAUDE.md` and a library of **Skills**.

If you have not come across Skills yet, they are markdown documents that get loaded into the model's context when a task matches their description — onboarding docs for an infinitely forgetful contractor. I have accumulated a few dozen of them over the past year: writing posts in my own voice, triaging support logs for our apps, upgrading Capacitor plugins across major versions, App Store listing work. Together with each repo's `CLAUDE.md`, they are the difference between a model that behaves like a team member and one that behaves like a very confident stranger.

For a long time I wrote those documents by hand, the way I would write onboarding docs for a junior developer. They were fine. Then I asked Fable 5 to rewrite one of them, ran the result through a smaller model on a real task, and the difference was embarrassing enough that I spent the next week redoing the whole library.

## Pay for the judgment once

The economics are what sold me. Frontier-model tokens are expensive at runtime but cheap at compile time. A skill gets written once and read hundreds of times — by models that cost a fraction as much per token. If the expensive model spends twenty minutes producing a document that makes every future cheap-model session ten percent better, that cost is amortized across months of work. It is hands down the best token-for-token trade I have found.

The ML crowd has a name for the general shape of this: distillation. You use a big teacher model to train a small student model, and the student punches above its weight on the narrow thing it was taught. What I am describing is the same idea, except nothing touches the weights. The distilled knowledge lives in markdown, in your repo, versioned in git, readable and editable by you.

The point is where the intelligence gets spent. Small models are good at *following* instructions and mediocre at *deciding* what the instructions should be. Big models are good at both, but you only need the deciding once.

## Why the big model writes a better manual

I expected Fable 5 to write more polished prose than I do. I did not expect it to write *different* documents — structurally different, in ways that matter to a weaker reader.

The biggest one: it writes decision boundaries instead of encyclopedias. When I asked a mid-tier model to draft a skill for support-log triage, I got generic advice — "examine the logs carefully", "consider possible root causes" — the kind of thing that reads well and changes nothing. Fable 5 wrote things like: *if the session ends with this specific error code, it is the sync race condition, go check the retry queue; if you see this pattern, stop — it is a duplicate of a known issue, link it and close.* Concrete branches, not vibes. A small model can execute a branch. It cannot execute "consider carefully".

The second thing it does is anticipate misreadings. A frontier model has a decent internal picture of how a weaker model will mangle an ambiguous sentence, the same way a senior developer can predict which line of the spec the new hire will misunderstand. It plugs those holes preemptively — adding the one example that pins down the edge case, renaming a term that collides with something else in the repo.

There is one prompt detail that makes all of this work, and I want to call it out because it is the whole trick: **tell the big model who the document is for.** Not "write me a skill for X" but "write this so that a much weaker model, with no memory of this conversation and no access to me, cannot misinterpret it". The audience changes everything about how it writes — the same way you write differently for a principal engineer than for a first-week intern.

## The workflow I ended up with

Nothing fancy, four steps.

1. **Do the task once with Fable 5, interactively.** Correct it as you go, the way you would pair with someone new. Those corrections are the raw material — each one is a rule that was missing.
2. **Ask it to extract a skill from the session.** Explicitly for a weaker model, per above. Ask it to include what the task is *not*, not only what it is.
3. **Run the skill on a real task with the small model.** Do not skip this. The skill that reads perfectly to you will still fail in ways neither of you predicted.
4. **Feed the failures back to Fable 5 and tighten.** Two or three rounds is usually enough for the small-model output to stop needing correction on that task type.

For `CLAUDE.md` files the loop is even simpler: I hand Fable 5 a few transcripts of small-model sessions in that repo and ask one question — *what rule would have prevented each correction I had to make?* The answers go straight into the file. It is the same instinct as adding a lint rule after a code review comment, which regular readers will recognize as [a hobby horse of mine](/guardrails-beat-guidelines-for-ai-code/).

## A before and after

Skill *descriptions* turned out to matter as much as skill bodies, because the description is the routing layer — a small model decides which skill to load based on it. This is one of mine before Fable 5 got to it:

```yaml
description: Helps with analyzing support logs for the scanner app.
```

Reasonable, right? In practice the model loaded it for analytics questions, for the wrong app's support cases, and once for a question about log *retention*. Here is what Fable 5 replaced it with:

```yaml
description: Investigate scanner-app support cases via New Relic application
  logs — find traces, errors, crashes, and session data to diagnose a
  reported bug. Use for scanner bug / crash / unexpected-behaviour reports.
  NOT for the CRM app's cases (use crm-logs-analyst) and NOT for product
  analytics or funnel questions (use scan-data-analyst).
```

Notice the NOT clauses. I did not ask for them. Fable 5 added them because it knows how models misroute: the description now defines the negative space around the skill, not just the skill itself. Misfires on that skill went from weekly to roughly never, and this one change — adding explicit "NOT for X, use Y instead" boundaries — improved routing across the entire library more than anything else I did.

The other surprise pointed the same direction: the rewritten documents came back *shorter*. My hand-written skills had grown by accretion, a paragraph added after each incident, and I assumed more detail meant more reliability. Fable 5 deleted about a third of every document I gave it. Its reasoning, when I asked, was that in a small model's context window every rule competes with the actual task for attention — a rule that rarely fires is not free, it is noise that dilutes the rules that matter. Big models cut. Insecure writers, and mid-tier models, pad.

## Where this stops working

Fair warning before you rebuild your setup around this.

Skills encode *repeatable* judgment. A novel problem — a design decision, a gnarly architectural trade-off, a bug nobody has seen before — still needs the big model live, because there is no manual to write yet. I think of the split as: Fable 5 for problems, small models plus skills for patterns.

The documents also go stale. A skill that references a module you refactored last month is worse than no skill, because the small model will follow it confidently off a cliff. Treat these files like code: they live in the repo, they get reviewed when the things they describe change.

And they are still guidelines — words, advisory, exactly the soft constraint I have [warned about before](/guardrails-beat-guidelines-for-ai-code/). A better manual reduces how often the small model drifts; it does not catch the drift that still happens. The linters, the type checker, and the test suite remain the things that say no. This post is about making the contractor better trained. You still lock the doors.

The instinct with a new frontier model is to use it as a better worker. The higher-leverage move, at least for me, has been to use it as the person who writes the training material — spend the expensive intelligence at compile time, and let the cheap models cash it in at runtime, hundreds of sessions over.

Next time you get access to a model a tier above your daily driver, before you point it at the backlog, hand it your `CLAUDE.md` and your worst-performing skill and ask it to rewrite them for a weaker audience. Give it a shot — you can thank me later.
