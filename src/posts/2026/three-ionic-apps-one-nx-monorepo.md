---
layout: post
title: Three similar Ionic apps, one Nx monorepo, and a lot of AI-assisted glue work
author: [masimplo]
tags: [Ionic, Technology, AI, Code]
image: ../../images/headers/photo-1563696629964-8c3ce077cf3e-unsplash.jpg
date: 2026-03-26
draft: false
excerpt: How we merged three Ionic/Angular/Capacitor codebases into a single Nx workspace so a small team could maintain them together—after aligning versions on purpose, and with AI agents doing most of the mechanical work.
---

We run three mobile apps built the same way: Ionic, Angular, Capacitor, TypeScript. They were never identical, but they rhymed—same kinds of interceptors, logging, analytics plumbing, shared-looking components, and the same release scripts copied into three repositories. For a small team, that duplication is not “reuse”; it is three places to fix the same bug and three CI pipelines to keep in sync.

This is a short notes-from-the-field post: what we aimed for, what we actually did, and why leaning on AI for execution mattered more than any specific Nx trick.

## The one non-negotiable prerequisite

Before anyone said “monorepo,” we upgraded **all three apps to the same framework stack** in their original repos—same Angular, Ionic, Capacitor, and TypeScript lines. That was deliberate. Migrating *and* reconciling version skew at the same time is how you lose weeks arguing with the build. Once the stacks matched, merging became mostly structure and imports, not archaeology across incompatible majors.

## What “done” looked like

We wanted:

- **One workspace** with a single dependency graph at the root (one install, one lockfile).
- **Shared libraries** for code that had been copy-pasted with only path and config differences.
- **Shared tooling** where it had been triplicated: shell scripts, Fastlane layout, CI.
- **Per-app native trees** where it still makes sense—`ios/` and `android/` stay under each app, not hoisted into fantasy land.

Nx was the umbrella: apps under `apps/`, libraries under `libs/`, tasks wired so developers run workspace commands instead of memorizing three different `cd` dances.

## The duplication problem, in one breath

Across the three codebases we kept seeing the same shapes: HTTP interceptors (prefixing, headers, retries, auth), a logging stack with console vs. remote sinks, a multi-provider analytics dispatcher, small directives and helpers, even identical UI islands (think QR and NFC entry points). Build and CI were the same story—near-copy `config.yml` files, the same cache keys and job shapes, three times over.

None of that is interesting code. It is expensive because it is **wide**: touch it once conceptually, touch it three times in practice.

## How we used AI (without turning the repo into a prompt dump)

The migration ran as a series of **scoped sessions**, each with a single success condition. An upfront **design doc**—folder layout, which libraries to extract first, path aliases, risks—became the spec every later session executed against. That sounds bureaucratic; in practice it stopped the agent from re-deriving architecture every time the chat reset.

Rough phases, all heavily agent-driven:

1. **Planning** — structure, library boundaries, migration order, mitigations. No code yet.
2. **Scaffold and move** — Nx workspace, bring the three apps in with **git subtree** so file history stays traceable across the old repos. First build broke in predictable ways (paths, SCSS include paths, generated files that were gitignored but the new pipeline expected committed, a dependency bump that forced a coordinated API change across every app). We fixed those in tight batches instead of three parallel long-lived branches.
3. **Extract shared libraries** — the large mechanical pass: carve out shared HTTP, logging, analytics, and core utilities; wire `tsconfig` path aliases; repoint imports across hundreds of files. This is the kind of edit where consistency matters more than brilliance—exactly what a well-instructed agent is good at.
4. **Lint unification** — one ESLint config at the root, apps pointed at it, fix the fallout once.
5. **CI consolidation** — one pipeline project with **path filtering** so a change that only touches app A does not rebuild B and C. The boring hard part was not YAML syntax; it was cataloguing contexts and secrets that used to live in three places and mapping them into a sane shared vs. per-app layout, plus a short runbook for humans who will operate it six months from now.

I am deliberately not turning this into a play-by-play of every failure mode. The pattern is: **big structural change + hundreds of files + three products** → if your process cannot batch work atomically, you pay merge tax forever.

## Technical decisions that aged well

A few choices paid off quickly:

- **Single `package.json` at the root** for real dependencies. Per-app manifests can linger for metadata, but the team should not wonder which lockfile is lying.
- **Abstract bases where apps genuinely diverge** — for example, auth-aware HTTP behavior that shares shape but not token source. The library owns the skeleton; each app extends and wires specifics.
- **One configurable provider for cross-cutting concerns** — analytics is a good example: a single `provideAnalytics(config)`-style entry point beats three forks that only differ by which vendor is on.
- **Capacitor native projects stay per-app** — Nx targets wrap `cap sync` and friends so the developer experience is unified even when the folders are not.
- **History preservation** — subtree import meant `git log --follow` still tells a story on individual files. That matters when you are debugging something introduced “before the merge.”

## Challenges worth naming once

- **Generated artifacts and `.gitignore`** — when CI is the first environment that builds clean from a fresh clone, surprises you never saw locally show up immediately.
- **Shared dependency bumps** — one shared `package.json` means one version of shared UI libraries; a breaking minor in something like a carousel/slider package can force a coordinated migration across all apps in one go. That is actually a *win* compared to discovering the three repos drifted three different fixes.
- **CI secret sprawl** — three apps × mobile × environments × vendors stacks into a lot of context variables. Consolidation without a checklist is how you ship a green pipeline that cannot sign a build.

## Outcomes

We ended up with one repository, three apps on identical toolchain versions, several shared libraries referenced from a large slice of the application code, one ESLint configuration, and one CI entry point with path-based workflows. Remaining work is mostly “finish extracting the last duplicated functionality" and “parameterize the last per-app scripts so they truly live in one place”—the sort of backlog you expect after the big merge lands.

## Why AI helped here

This work is **high context, low novelty**: compare three trees, apply the same structural edit hundreds of times, reconcile CI semantics, chase down build errors from stack traces. Humans are indispensable for judgment calls—what to extract, what must stay app-specific, when to stop a bad automated refactor. Agents are strong at **volume and consistency** once that spec exists.

The two practices that mattered most were the **written plan** (stable target across sessions) and **narrow session goals** (“single CI config with path filtering,” “libraries X and Y extracted and imported”) so autonomous runs had a clear finish line.

If you are considering the same move: align versions first, preserve history if you can, treat CI and secrets as a first-class migration workstream, and batch cross-app dependency upgrades so you do not relive the same breaking change three times. Everything else is patience and good diffs.

Related reading on this blog: [migrating a single Ionic app toward modern Angular patterns](/migrating-ionic-to-angular-standalone-components/), and [how I use parallel AI agents when one conversation is not enough](/claude-code-parallel-agents-feature/).
