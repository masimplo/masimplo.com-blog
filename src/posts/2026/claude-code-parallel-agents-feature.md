---
layout: post
title: Using Claude Code's parallel agents to collaborate on a feature
author: [masimplo]
tags: [AI, Code, Tools]
image: ../../images/headers/iyr7iiiyr7iiiyr7.png
date: 2026-03-22
draft: false
---

I wrote a few weeks ago about [vibe coding and what three years of AI-assisted development actually looks like](/vibe-coding-a-developers-honest-take/). One thing I glossed over is that the single-agent model — one conversation, one task, one agent — has a ceiling. Once a feature touches more than one layer of the stack or more than one independent concern, a single agent serializes work it doesn't have to.

Claude Code's multi-agent mode lets you break that ceiling. You describe a feature, split it into independent pieces, spawn a dedicated agent per piece, and work in parallel. Done badly it creates merge conflicts and context drift. Done well it feels like pairing with a focused team — everyone working at full speed on a slice they fully own.

I should mention upfront that this feature is still experimental, and the rough edges are real — which is partly why I'm writing this up now.

## The mental shift: from author to orchestrator

In a normal Claude Code session you are the driver. You prompt, it writes, you review and steer. That loop works well for focused tasks. The problem is that a real feature — say, adding a new entity to an API, wiring up a frontend view, and writing integration tests — has three streams of work that are largely independent after the data model is settled.

Running those streams sequentially through a single agent is slow. More importantly, it is cognitively noisy: the agent carries the entire context of stream A when it starts stream B, which means instructions bleed across concerns in ways that are subtle and irritating to untangle later.

Multi-agent mode inverts the relationship. You become the architect, not the author. Your job is to define the interfaces between pieces clearly enough that independent agents can work without stepping on each other. The thinking is harder upfront. The execution is faster.

## How I actually decompose a feature

When starting a feature of any real size, I now open with a planning step before I touch code. I ask Claude Code to help me split the work into independent tasks with clear inputs and outputs. The question that forces the right decomposition is: *what does each piece need to be told, and what does it promise to produce?*

For a typical full-stack feature I end up with something like:

- Define the data model and write the database migration. Output: schema, model file, migration file.
- Implement the API endpoint and its validation logic. Input: the schema just agreed. Output: route handler, request/response types.
- Build the frontend component and wire it to the API contract. Input: the response shape from above.
- Write integration and unit tests against the completed implementation.

The first two run sequentially because the second depends on the first. Once the API contract is settled, the frontend and the tests can run without waiting for each other.

When I spawn the agents I give each one a narrowly scoped prompt — just the relevant context, not the whole feature story. Context bloat is where parallel agents lose their advantage. An agent that knows everything it does not need slows down and drifts.

## The interface document is the real deliverable

The hardest part is not the prompting. It is defining the interfaces clearly before the agents start. If the API agent assumes a `userId` field that the model agent decided to call `user_id`, you will spend the integration phase doing find-and-replace while silently questioning your life choices.

Spending twenty minutes agreeing on types, field names, and API contracts before spawning agents is the forcing function that makes the rest of it clean. I use the planning session to produce a short interface document — just the types and the API shape in pseudocode or TypeScript — that every agent gets as a shared input.

That document is effectively the thing you are actually writing. The agents write the implementation; you write the contract.

## Where it breaks down

Multi-agent mode is not a free speedup. There are a few failure modes I hit regularly enough to warn about.

Cross-cutting concerns are expensive to split. Authentication middleware, error handling patterns, logging — anything that needs to be applied consistently across every agent's output. If two agents each invent their own error response format you get a coherent-looking result that is subtly inconsistent. The answer is to include the relevant existing patterns in every agent's context, not to let each one decide for themselves.

Merge review is denser. Four parallel agents produce four bodies of code that land at once. If you do not review each one before merging, small assumptions accumulate into a system that works but that you do not fully understand — which is the failure mode I wrote about in the vibe coding post. The parallel structure does not reduce the amount of reading you have to do; it concentrates it.

Agents drift if the interface document is vague. "Returns the user object" is not a contract. A TypeScript interface is a contract. The more precise your planning artifact, the less integration work you do later.

Your hardware is again the weakest link. Running five agents simultaneously on a 24GB machine is a genuine way to discover that local tools compound. Each agent is not just holding a context window — it is spawning processes: indexing files, running type-checkers, invoking test runners, searching the repo. When five of them do that at once, you do not get five times the throughput; you get five times the I/O contention and one machine on its knees. Three concurrent agents tends to be about the real ceiling before the environment starts fighting you. Start smaller than you think you need to.

## What this actually changes

Before this workflow I would often batch smaller features into a single session and just trust the agent to keep everything consistent. It mostly worked. For anything bigger than a day's work it started to produce code I had to hold in my head rather than code that explained itself.

The parallel agent model forces something I probably should have been doing anyway: writing down what the pieces are before building them. The agents execute the plan. I write the plan. That is a better division of labour than "I direct and review whatever comes out."

The typing, as I keep saying, was always the least interesting part. Planning the seams between things — that is where the work still lives.
