---
layout: post
title: One AGENTS.md for every coding agent — stop maintaining three rule files
author: [masimplo]
tags: [AI, Tools, Tips]
image: ../../images/headers/agents-md-one-file.png
date: 2026-07-18
draft: false
excerpt: Put shared project rules in AGENTS.md, keep a thin CLAUDE.md that imports it, and leave Skills for verbs — so Cursor, Claude Code, and Codex stop drifting apart.
---

I spent a year maintaining the same instructions in three places. A `CLAUDE.md` for Claude Code. Cursor rules for Cursor. Occasional paste-jobs into whatever Codex or Gemini was reading that week. They drifted within a month. One said "never invent tests." Another still begged for coverage. The agents disagreed with each other more than they disagreed with me.

The fix is boring enough that I resisted it. **One shared file. Tool-specific wrappers stay thin. Skills handle the verbs.**

## The drift problem

Every agent invented a config filename. Claude Code wants `CLAUDE.md`. Cursor grew `.cursor/rules`. Codex popularized `AGENTS.md`. Copilot and friends have their own cousins. The *content* is ninety percent identical — build commands, architecture map, what not to touch, how commits and PRs work here.

Duplicating that ninety percent is how you get config drift. You fix a landmine in one repo's Claude file after a bad session. Cursor never hears about it. Two weeks later the other agent recreates the landmine and you blame the model.

I have written before about [guardrails beating guidelines](/guardrails-beat-guidelines-for-ai-code/) and about [using a frontier model to write Skills](/using-fable-5-to-write-skills-for-smaller-models/). Those only help if every agent reads the same brief.

## What goes in AGENTS.md

`AGENTS.md` at the repo root (or a home-level file agents can see) is the shared briefing. Tool-agnostic. Always-on.

Mine holds things like:

- Where durable knowledge lives, and what must *not* be written there
- How git commits are phrased — no AI co-author trailers
- How trackable work gets filed (issues before PRs, acceptance criteria, branch names)
- Project landmines and hard constraints that survive model upgrades

If a rule is true for Cursor *and* Claude Code *and* a terminal agent, it belongs here. If it only makes sense inside one product's hooks or permission model, it does not.

Keep it short enough that a weaker model will still notice the important lines. A novel-length `AGENTS.md` becomes wallpaper. When a section grows into a procedure — "how to upgrade Capacitor," "how to write a blog post in my voice" — that is a Skill, not another chapter of always-on context.

## Thin CLAUDE.md, not a second bible

Claude Code still gets a `CLAUDE.md`. Mine for this blog points at project facts and defers the reusable workflows to Skills. Across tools, the pattern that stopped the drift is:

```markdown
# Project agent notes

Shared rules live in AGENTS.md — read that first.

@AGENTS.md

Claude-specific notes only below this line.
```

Symlinking `CLAUDE.md` → `AGENTS.md` works if you want zero duplication and no Claude-only addenda. I prefer the import form when Claude needs a few product-specific lines — which commands to prefer, which Skills are mandatory for content work — without forcing Cursor to parse Claude jargon.

Cursor can read `AGENTS.md` natively now. Keep `.cursor/rules` only for glob-scoped quirks that the shared file cannot express. Do not paste the same architecture essay into both.

## Skills are verbs — AGENTS.md is the employee handbook

Skills load on demand when the task matches. `AGENTS.md` loads every session. Mixing them is how files bloat.

Handbook: "We use GitHub issues, not markdown TODO lists."  
Skill: "Here is how to open the right issue type and set the project status."

Handbook: "The Obsidian vault is for durable facts."  
Skill: "Here is the schema for a Decision note."

I [drew that line hard for the second brain](/obsidian-second-brain-setup/) — session logs stay out of the vault. The same line belongs in `AGENTS.md` so every agent hears it, not only the one that wrote the blog post.

## A starter shape that survives contact with a team

If you are starting from scratch:

1. Write `AGENTS.md` with build/dev commands, architecture in one screen, hard don'ts, and the PR/commit norms.
2. Delete or shrink duplicate Cursor rules until they only hold Cursor-specific globs.
3. Make `CLAUDE.md` import `AGENTS.md` and add only Claude-only behavior.
4. Move any "how to do X" chapters into Skills. Point the handbook at them in one line each.
5. After a painful agent session, ask: *which shared rule was missing?* Add it once — in `AGENTS.md` — not three times.

When the handbook and the Skills disagree, the handbook wins until you fix the Skill. One source of truth beats a polite democracy of markdown files.

## Who this is for

Anyone bouncing between Cursor and Claude Code — or watching a teammate use a different agent on the same repo — and wondering why the "same" instructions produce different messes.

The models will keep changing. The filenames will keep multiplying. The only stable move is to stop copying prose into every vendor's pet file.

One `AGENTS.md`. Thin wrappers. Skills for the verbs. Then let the agents argue with the work, not with each other's briefing docs.
