---
layout: post
title: Three similar Ionic apps, one Nx monorepo, and a lot of AI-assisted glue work
author: [masimplo]
tags: [Ionic, Technology, AI, Code, Personal]
image: ../../images/headers/photo-1563696629964-8c3ce077cf3e-unsplash.jpg
date: 2026-03-26
draft: false
excerpt: How we merged three Ionic/Angular/Capacitor codebases into a single Nx workspace so a small team could stop maintaining the same code in three places.
---

I fell from a step ladder while doing electrical work in the garage of our new house. Nothing dramatic, just a sore knee and elbow, but enough that ladders and cable runs are off limits for a bit. So instead of climbing back up I sat down and finally wrote up this migration that has been living in scattered notes for a week.

We have three mobile apps built on the same stack: Ionic, Angular, Capacitor, TypeScript. They were never the same app, but they shared a shocking amount of DNA. Same HTTP interceptors, same logging setup, same analytics dispatcher, same build scripts, same CI pipeline shape — all copy-pasted across three repos with minor differences. For a small team this is painful. You fix a bug once in your head and then go fix it two more times in code. Three CI pipelines to babysit. Three sets of release scripts that slowly drift apart.

We wanted to stop doing that.

## Get the versions aligned first

Before we touched the monorepo idea at all, we upgraded all three apps to the same framework versions in their own repos. Same Angular, same Ionic, same Capacitor, same TypeScript. This was deliberate. Trying to merge codebases *and* reconcile version skew at the same time is a recipe for losing weeks fighting the build system instead of doing the actual migration. Once everything matched, the merge was mostly about moving files and fixing import paths.

## What we were aiming for

- One workspace, one `package.json` at the root, one lockfile. No guessing which install is stale.
- Shared libraries for all the code that had been duplicated with only path differences.
- Shared build tooling: shell scripts, Fastlane, CI config.
- Native projects (`ios/`, `android/`) staying under each app. Hoisting those would be asking for trouble.

Nx gave us the structure: apps in `apps/`, libraries in `libs/`, workspace commands so nobody has to remember which directory to `cd` into.

## The duplication was everywhere

HTTP interceptors for URL prefixing, content types, headers, retries, auth. A logging stack with console and remote sinks. A multi-provider analytics dispatcher that talks to Mixpanel, Firebase, Facebook, AppsFlyer and others. Small directives and helpers. Even some identical UI components. And then the build side: three `config.yml` files with the same executor definitions, the same caching commands, the same job structure.

None of this code is clever. It is expensive because it is wide. One conceptual change, three actual changes.

## How AI fit into this

I have written before about [using AI agents for development](/vibe-coding-a-developers-honest-take/) and how the workflow has changed. This migration was a perfect case for it. The work is high-context and repetitive: read three codebases at once, spot what is the same, make the same structural edit across hundreds of files, chase build errors from cryptic stack traces. Tedious stuff that an agent with good context handles well.

We ran it as a series of focused sessions, each with one clear goal. Before any code changed, we had the agent produce a design document: folder layout, which libraries to extract, path aliases, risks. That document became the reference for every session after. Without it, every new chat would start by re-discovering the architecture and making slightly different decisions each time.

The rough sequence was:

1. **Planning** — library boundaries, migration order, what could go wrong. No code yet.
2. **Scaffold and move** — create the Nx workspace, bring the three apps in using `git subtree` to keep the full commit history from each repo. The first build broke immediately: wrong import paths, missing SCSS includes, a gitignored `index.html` that the build actually needed, and a shared dependency bump that forced an API migration across all three apps at once. Fixed in one batch.
3. **Extract shared libraries** — the big mechanical pass. Pull out shared HTTP, logging, analytics, and core utilities into `libs/`. Wire up `tsconfig` path aliases. Update imports across hundreds of files. This is where the agent earned its keep. Consistency over hundreds of files matters more than creativity.
4. **Lint consolidation** — kill per-app ESLint configs, one config at the root, fix whatever it complained about.
5. **CI consolidation** — replace three CircleCI projects with one, using path filtering so changes to app A do not trigger builds for B and C. The actual hard part was not the YAML. It was cataloguing all the secrets and context variables that used to live in three different places and figuring out which ones are shared and which are per-app. We also wrote a short runbook for whoever has to operate this six months from now.

I am skipping the blow-by-blow of every build failure. The pattern is simple: big structural change across hundreds of files and three products. If you cannot batch that atomically, you are paying merge tax forever.

## Decisions that worked out

**Single root `package.json`** — per-app manifests still exist for metadata but dependencies live at the root. One install, no ambiguity about which lockfile is real.

**Abstract base classes where apps actually diverge** — the auth interceptor, for instance, has the same shape in all three apps but each one gets its auth token from a different source. The shared library has the base class; each app extends it with its own wiring.

**Configurable providers instead of forks** — analytics is a good example. One `provideAnalytics(config)` call that accepts which vendors to enable, instead of three copies of the same dispatcher with slightly different flags.

**Native projects stay per-app** — Nx targets wrap `cap sync` and friends so the developer experience feels unified even though `ios/` and `android/` live under each app.

**History preservation** — `git subtree` import means `git log --follow` still works on individual files. You can trace a file back through the original repo. This matters when you are debugging something that was introduced before the merge.

## Things that bit us

**Builder and output path mismatch** — one of the apps was on an older Angular builder that put web assets in a different directory. Capacitor config had to match. Easy to miss when you fix "the build" on one app and assume the others work the same way.

**Gitignored files that the build needs** — one app generated its `index.html` from environment variants and had it in `.gitignore`. CI builds from a clean clone, so it just was not there. Only showed up when CI ran for the first time.

**Shared dependency bumps** — one `package.json` means one version of everything. A breaking change in something like a carousel library forces a coordinated migration across all three apps in one commit. Honestly this is still better than discovering later that the three repos each applied a different workaround.

**CI secret sprawl** — three apps, two platforms, multiple environments, multiple vendors. That is a lot of context variables. We ended up writing a checklist document just to track what goes where during the cutover. Without it you get a green pipeline that cannot actually sign a build.

## Where we landed

One repo, three apps on identical dependency versions. Four shared libraries used across hundreds of app files. One ESLint config. One CI entry point with path-filtered workflows. The remaining work is extracting the last bits of duplicated UI and parameterizing the per-app build scripts so they truly live in one place. Normal post-merge cleanup.

## Why this kind of work suits AI agents

The judgment calls — what to extract, what stays app-specific, when to stop an automated refactor that is heading in the wrong direction — those are still human decisions. But the volume work, reading three codebases in parallel, making consistent edits across hundreds of files, diagnosing test failures from wall-of-text stack traces, that is where agents shine if you give them enough context.

Two things made the biggest difference: having the design document written up front so the agent had a stable target across sessions, and scoping each session narrowly ("extract these two libraries", "produce a single CI config with path filtering") so there was a clear finish line.

If you are considering the same move: get your versions aligned before you start, preserve git history if you can, treat CI and secrets as a first-class workstream, and batch cross-app dependency upgrades so you do not end up fixing the same breaking change three times.

Related: [migrating a single Ionic app to Angular standalone components](/migrating-ionic-to-angular-standalone-components/), and [using parallel AI agents when one conversation is not enough](/claude-code-parallel-agents-feature/).

Was any of this easy? No. Was it *falling off a ladder* hard? Also no.
