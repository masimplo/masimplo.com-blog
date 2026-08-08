---
layout: post
title: Building a second brain in Obsidian — and telling my AI agents what not to write there
author: [masimplo]
tags: [AI, Tools, Tips]
image: ../../images/headers/obsidian-second-brain.png
date: 2026-08-08
draft: false
excerpt: I finally built an Obsidian second brain that stuck — by writing down what my AI agents are and aren't allowed to put in it.
---

I have started a second brain three times before this one. Notion, then a folder of dated Markdown files, then a paid app with a mascot I have since forgotten the name of. All three died the same way — a burst of enthusiasm, a week of dutiful notes, then silence, because the thing I actually needed was not a place to write. It was a rule for what was worth writing down.

This time it stuck. The tool is Obsidian. The reason it stuck has almost nothing to do with Obsidian and everything to do with the rule I finally wrote — with help from the AI agents I already run all day — about what belongs in it and what doesn't.

## The tool barely matters

Obsidian's whole pitch is that it gets out of the way: a vault is just a folder of plain Markdown files on disk, with an `.obsidian` config directory for plugins and themes sitting next to your notes, not wrapping them. No proprietary format, no server you're renting access to. A developer should expect no less of a knowledge base than of a codebase — you would not accept one you couldn't `grep`, so why accept one you can't either.

I installed it with `brew install --cask obsidian`, pointed it at a fresh folder — mine lives at `~/Brain` — and put that folder under git the same day. Committing markdown is not a novel idea, but it's an underrated one: your notes get history, diffs, and a restore path with zero extra tooling. If your sync story is "iCloud Drive" or "Dropbox," fine, that works too. I wanted `git log` on my own thinking.

## PARA, but I stopped arguing with it

Every second-brain writeup will eventually make you choose between PARA (Projects, Areas, Resources, Archives — organize by *actionability*) and Zettelkasten (atomic, densely cross-linked notes — organize by *idea*). I read enough of both to conclude the argument is mostly unproductive. My vault is PARA-shaped at the top — `Projects/`, `Areas/`, `Reference/`, plus a `Companies/` folder because a chunk of what I need to remember is per-client — and Zettelkasten-flavored inside individual notes, which link to each other liberally instead of nesting into a folder tree six levels deep.

The folders answer "where does this go." The links answer "what does this connect to." You need both questions answered, and neither method alone answers both.

## Bootstrapping it with agents, not by hand

Starting a second brain from a blank vault is the same failure mode as starting a novel from a blank page — the emptiness itself is what kills momentum. So I didn't start from blank. I pointed Claude Code subagents at everything I already had lying around — old project skill files, a folder of company reference docs, prior working sessions — and had them mine that material into a first pass of hub notes and reference pages, one subagent per source, running in parallel.

Was the output perfect? No — some of it needed a second look, and a few generated notes were more summary than insight. But *editing* an overeager first draft is a completely different task from *generating* one from nothing, and it's the task I'm actually good at. An afternoon of agent-assisted mining got me further than three previous solo attempts combined.

## The rule that made it stick

The part that mattered came next. I already run [claude-mem](/using-fable-5-to-write-skills-for-smaller-models/) to capture what happens in every coding session — decisions, bugs, discoveries, all of it, automatically, timestamped, searchable. My first instinct was to have the vault do the same job. That instinct was wrong, and I only noticed because I wrote the rule down and then had to defend it to myself:

> Don't duplicate session work logs into the vault — claude-mem captures those automatically. The vault is for curated knowledge a human would want to read later.

That one sentence is doing more work than every folder structure I tried before it. A session log answers "what happened." A vault note answers "what do I now believe, and why." Those are different documents with different shelf lives, and conflating them is exactly how my earlier attempts turned into unread archives of noise nobody — human or agent — ever revisits. The vault holds the twenty things worth remembering out of the two thousand things that happened this month. Everything else has a home already; it doesn't need a second one.

## Where I said no to the AI

Once agents can write to your vault, the obvious next move is to give them standing write access — a live MCP server sitting between Claude and your notes, updating them as you work, no human in the loop. Tools like this exist and some people are already running multi-agent setups where a design-focused agent and a coding agent share memory through exactly this kind of server.

I looked at it and passed, at least for now. A vault an agent can write to unsupervised is a vault whose signal-to-noise ratio degrades at the speed of your prompt volume — and I had *just* fixed that problem with the curation rule above. So agents mine and draft, on request, in a session I'm watching. I commit. The distinction is small mechanically and large in practice: it's the difference between an intern handing you a memo and an intern with a key to the filing cabinet. The memo you can ignore if it's wrong. The filing cabinet, you find out it was wrong three months later, when you go looking for something that isn't there anymore.

## Where to start

If you're a developer who has bounced off note-taking apps before, skip the theory debate and do three things: install Obsidian, put the vault under git, and write one sentence — like mine above — about what does and doesn't belong in it. If you already run coding agents, [kepano's obsidian-skills](https://github.com/kepano/obsidian-skills) will teach them to write clean Markdown, Bases, and Canvas files instead of guessing at your formatting conventions. Then let a subagent mine one existing folder of docs into a handful of notes, and edit what comes out instead of writing it from scratch.

The app was never the missing piece. The missing piece was a rule short enough to actually follow.
