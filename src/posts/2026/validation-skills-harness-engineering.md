---
layout: post
title: Validation skills — the part of harness engineering that let me stop babysitting agents
author: [masimplo]
tags: [AI, Tools, Code, Opinions]
image: ../../images/headers/validation-skills-harness-engineering.png
date: 2026-09-26
draft: false
excerpt: Harness engineering gets agents doing the work. Validation skills are what let me trust that work enough to stop watching every run.
---

This morning I added one more piece of harness engineering to this blog: a validator, a small script plus a checklist that grades a post against the house style before it ships. Then, out of curiosity, I pointed it at the posts already published.

Seven of them failed. Two had header images so wide that the page crops the subject off both sides. One still contained "this matters because", a phrase I have banned in three separate places. Every one of them was drafted with an agent and reviewed by me, line by line.

Most of what gets written about harness engineering is about getting coding agents to do more. The piece that changed my week the most is the one that checks the work afterwards. I had been the validator all along, and I was not a very good one.

## The agent that grades its own homework

The obvious first move is to add "verify your work against the spec" to the prompt. I did that for months. The agent reports that it checked, and it usually believes it. But the context that produced the mistake is the same context grading it: it already decided the header looked fine, so it reports that the header looks fine. People do this too, which is why we don't approve our own pull requests.

What worked was splitting the maker from the checker. **A validation skill is a separate, read-only step** with one job: take the output and the spec, and return PASS or FAIL with evidence. It is not allowed to fix anything. Once a checker can edit, it quietly edits until it passes, and you are back to an agent grading its own homework with extra steps.

## Script first, judgment second

Every validator I have built since has two halves. The first is a boring script: frontmatter fields in the right order, every tag in the vocabulary, an image that exists and is not a four-hundred-byte failed generation, internal links that resolve. The script does not skim, which on the fortieth review of the week I absolutely do.

The second half is a checklist the agent works through with judgment. Does the hook land in two sentences? Is every personal claim sourced? Does the image show the idea or just the keyword? Each item needs evidence, a quote or a line number, not a feeling.

I have written before about [guardrails that say no](/guardrails-beat-guidelines-for-ai-code/) for code: linters, types, failing tests. Validation skills are the same idea one level up. They guard the things a compiler has no opinion on — whether a translation still fits its button, whether a page matches its design, whether a post sounds like the person whose name is on it.

## Calibrating it is the actual craft

The first draft of every validator I write is wrong in both directions. The blog one flagged a sentence *about* TODO lists as a leftover TODO. It complained that bolded numbers in a bullet list were too much emphasis. While I was writing this post, it failed the draft for using the word "placeholders" in a sentence about translations.

So before I trust a validator, I run it against work I already trust. Every false positive is a rule that is too broad. Every real hit in "good" work is a rule I did not know I needed. Then I check the checker: one deploy guard at work ships with a mutation script that breaks the thing it protects and confirms the guard goes red. A validator that has never failed is one you have not tested.

**False positives are the expensive part.** A validator that cries wolf gets ignored, and an ignored validator is worse than none, because it looks like coverage. I learned that the slow way when [CI was red for six weeks](/npm-ci-outage-nobody-noticed/) and the site never noticed.

## Trust is what turns into throughput

At work we ship an app in well over a dozen languages. Agents translate new strings in seconds, and for a long time I still reviewed every batch by hand, because the one time I did not, a Dutch label came back almost three times the length of the English and pushed a button off the screen on small phones. The translation was correct. It just did not fit.

The validator we built checks length ratios, placeholders, and glossary terms. Its first run found zero errors and roughly a thousand warnings nobody had looked at.

That is the pattern everywhere. Agents were fast and I was the bottleneck, because my attention was the only way to know a result was right. Once the validator gates the work — the agent runs it, fixes until PASS, and only then opens the PR — review changes shape. I stop hunting for a missing field and start reading for the things no checklist can see. Twenty minutes per PR becomes five.

In the spring I was merging around a dozen pull requests a month. This month I am on track for close to two hundred. Validation is not the whole story; better models, more agents in parallel, and a couple of new projects all played a part. But validation is why I let those agents run unattended. Without it, two hundred PRs would have meant two hundred babysitting sessions. With it, the number of things I had to roll back stayed flat while the volume went up.

## Validators go stale too

Specs change, and a validator that does not change with them either fails good work or enforces rules nobody wants anymore. A few habits keep mine honest:

- Every rule traces back to a real failure. The "no images wider than 2:1" rule exists because two headers got cropped.
- When the spec changes, the validator changes in the same PR.
- The skills themselves get validated. At work, a structural grader checks every skill package: referenced files exist, required sections are present, scripts still expose the interface the instructions promise. It caught a skill pointing at a script nobody had written yet.

This is the part that is an art, and it never finishes. The first version takes an afternoon. Keeping it honest is a standing chore, like tending a test suite, and it pays back like one: every hour spent on a validator gets multiplied by every agent run that no longer needs me.

## Where harness engineering still needs a human

A validator checks what you can specify. It cannot tell you the feature was the wrong feature, or that the code will be miserable to change in six months. As one essay on software factories put it: if a model could reliably tell good code from bad, it would have written the good version in the first place.

So I still read architecture, product decisions, and anything that touches money or user data. I have the attention for it now, because the validator spends its attention on everything else.

Seven of my own posts failed a checklist I would have sworn they passed. This one went through the same checklist before you saw it. I make a poor validator. The script is better, and it does not mind doing the job two hundred times a month.
