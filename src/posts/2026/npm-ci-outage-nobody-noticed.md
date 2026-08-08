---
layout: post
title: CI was red for six weeks — and the site never noticed
author: [masimplo]
tags: [Testing, Tools, Code]
image: ../../images/headers/npm-ci-two-pipelines.png
date: 2026-08-08
draft: false
excerpt: My blog's CI has failed on every single push since June 20th. The site kept deploying fine the whole time, which is exactly the problem.
---

I sat down today to clear out some Dependabot noise on this blog — 135 vulnerabilities, the kind of number that looks alarming until you read the list. I came out the other side having learned that CI had been failing on every push for six weeks, silently, because the one thing watching it never once got run.

## The number that started it

GitHub was flagging 135 vulnerabilities on a Gatsby static site that has no server, no user input, and no runtime dependencies exposed to a browser beyond React and Emotion. That mismatch alone was worth ten minutes of investigation. `npm audit` broke it down: dev-only tooling, all of it — netlify-cli's prompt library, webpack internals, `sharp`'s bundled libvips. Nothing that ships. I ran `npm audit fix` anyway, because that's the boring, responsible first move.

It knocked the count from 121 down to 80. It also broke the production build.

## When the safe fix isn't

```
ERROR #98123  WEBPACK.BUILD-JAVASCRIPT
Generating JavaScript bundles failed
validateOptions is not a function
```

`npm audit fix` had bumped a shared webpack-tooling dependency to a version that Gatsby's pinned internals didn't expect — a classic transitive-version mismatch, invisible in the diff, only visible at build time. I reverted the lockfile change on the spot. No vulnerability count is worth shipping a blog that doesn't build, and *the fix causing the outage it claims to prevent* is not a hypothetical risk with npm's dependency tree — it's Tuesday.

## Reverting led somewhere more interesting

Putting the lockfile back and reinstalling should have been a non-event. Instead:

```
npm error code EUSAGE
npm error `npm ci` can only install packages when your package.json
and package-lock.json or npm-shrinkwrap.json are in sync.
npm error Missing: picomatch@4.0.5 from lock file
```

The *committed* lockfile — the one sitting untouched in the repo, nothing to do with my audit-fix detour — could not satisfy `npm ci`. `npm install` is lenient: it resolves what it needs and quietly patches the lockfile as it goes. `npm ci` is strict on purpose — it exists specifically to catch a lockfile that doesn't fully describe what's installed, which is exactly what a CI pipeline should be catching before anything else runs.

So I checked when this broke, expecting it to be something from today.

## It was not from today

```
completed  failure  Add article: building a second brain in Obsidian…      CI
completed  failure  Add article: using Fable 5 to write Skills…            CI
completed  failure  Update dependencies — date-fns, lodash-es, netlify-cli CI
completed  success  Add article about fermented ginger honey lemon drink   CI
```

Every push since the June 20th dependency-update commit had failed CI with that same missing-picomatch error. Six weeks. Two articles, a skills setup commit, and today's post all landed on a red pipeline, and I never saw it, because I never looked — GitHub doesn't interrupt a `git push` to tell you the thing you just pushed failed its checks unless you go check.

## Why the site never noticed either

Netlify's own build step runs `npm install`, not `npm ci`. The lockfile drift that had been failing GitHub Actions for six weeks was invisible to the one pipeline that actually puts pages in front of readers, because that pipeline uses the lenient installer. A CI badge nobody checks is a smoke detector with the battery pulled — except in this case a second smoke detector, on a different circuit, happened to be working the entire time, and I didn't know it was doing the job until I went looking for the first one.

## The actual fix, and the ones I didn't take

A clean `npm install` regenerated the lockfile correctly — `picomatch` got recorded where it belonged, `npm ci` started succeeding, and the production build I'd broken earlier came back clean. That's the entire fix: one lockfile refresh, zero package.json changes, verified against build and lint before it went anywhere near a commit.

The remaining 139 vulnerabilities are still sitting there, and I'm leaving them. Every path to closing them runs through `npm audit fix --force`, which wants to downgrade `gatsby-source-filesystem` to version 2.5.0 — five major versions and roughly six years backward — to satisfy a dependency resolver that has no concept of "this dev tool's CVE doesn't reach the browser." I've written before about [treating AI-generated guardrails as things that have to hold, not just exist](/guardrails-beat-guidelines-for-ai-code/), and the same rule applies to automated dependency tooling: a fix that trades a real, working build for a lower number on a dashboard is not a fix. It's a different bug wearing the first one's clothes.

## What I'd actually check

If you maintain anything with a CI pipeline and a separate deploy pipeline, go look at whether they run the same install command. `npm ci` and `npm install` are not interchangeable, and a lockfile can drift out of strict sync without a single line of `package.json` changing — a stale local `npm install` from some earlier session is enough. Nothing forces the two pipelines to agree with each other, and nothing will tell you they've disagreed except opening the failed run.

Six weeks of red isn't a crisis. It's just proof that a check nobody reads isn't a check — it's decoration with better production values.
