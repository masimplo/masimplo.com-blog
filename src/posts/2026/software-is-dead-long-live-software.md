---
layout: post
title: Software is dead, long live the software — notes from 30 personal apps
author: [masimplo]
tags: [Opinions, AI, Code, Technology]
image: ../../images/headers/software-is-dead-long-live-software.png
date: 2026-11-01
draft: true
excerpt: Everyone says software is dead now that anyone can build their own apps. I've built over 30 of them, and that's why I don't believe it.
---

Every week someone in my feed announces that software is dead. The argument goes like this: if anyone can describe an app to a coding agent and have it running by dinner, why would anyone pay for one again? Buy nothing, generate everything.

I'm not a neutral observer here. I have written more than 30 personal apps. Dashboards for my personal finances, a couple of investment monitors, Telegram apps, a food scanner for my kids, and a long tail of smaller things I would struggle to list from memory. That last part is the point of this post.

## The 30 apps I don't open

The believers are right about the part they can see. Building is cheap now. When my Canon printer had no Mac utility, [Claude Code reverse-engineered one in a single session](/canon-g5040-mac-printer-manager/). When my investments were scattered across brokers, I [built a ticker to see them in one place](/portfolio-ticker-multi-broker-monitor/). Each of those solved a real problem, for a real person, faster than I could have found and evaluated a product that did the same.

None of my 30 has rotted. They still run. But a finance dashboard needs a weekly or monthly look to be worth anything, and mine get neither. The investment monitors haven't learned anything since the week I wrote them. Some of them I forget I ever wrote.

**They were finished the moment they solved my problem, and nobody has touched them since.** That is the fate of almost all personal software, and I've been writing it long enough to say so with some confidence.

## What a personal app leaves out

This is where I part ways with the "software is dead" crowd. When people say anyone can build their own app now, they're counting the code. The code was never the expensive part of software.

Think about any product you've used for years. What you're paying for is everything that happened around its code:

- **Years of research**: someone figured out what the problem really was before writing a line, and kept refining that understanding after launch.
- **Years of bugs**: every crash, timezone edge case, and corrupted import that somebody else hit first, reported, and got fixed.
- **Thousands of users**: people using it in ways the authors never imagined, on devices they never tested.
- **Requirements that got filtered**: a product is as much the hundred features someone said *no* to as the ten they shipped.

A generated app gets none of that. It gets a snapshot of one person's needs on one afternoon. That's enough more often than the skeptics admit, and less often than the believers think.

## Users are the test suite

The food app I built for my kids is the one that escaped. [Prova](https://provascan.com) is in both stores now: you scan a barcode on something headed for the lunchbox and get its Nutri-Score grade, its NOVA processing group, every ingredient flagged Safe, Caution or Avoid, and a check against whichever of the 14 EU-regulated allergens you care about. If there is no barcode, you photograph the label instead. Scanning is free, there are no ads, and it works without an account.

Look at what is doing the heavy lifting, though. Most of the product data comes from open food databases like Open Food Facts, years of volunteers photographing labels and typing in ingredients, one product at a time. The grades come from Nutri-Score and NOVA, years of nutrition research and arguing about thresholds. The allergen list is EU regulation, and the ingredient flags link to published sources written by people I'll never meet. My part is the scanner, the profile, and the screens that put it all together. The valuable part of my app is software and data that other people spent years on. That's the part I couldn't have generated, and it's also why Prova is worth anything at all.

The rest of my apps don't have that to lean on, and they "work" for a simpler reason. I never step off my own happy path, because I wrote the happy path. A product with thousands of users has had every path walked, usually by someone annoyed enough to file a ticket. That accumulated annoyance is the most valuable thing a mature product owns, and **you can't vibe code your way into it**, because it isn't code. It's history.

I've written about this from the other side before: [vibe coding is real](/vibe-coding-a-developers-honest-take/), and AI takes the typing off our hands. The typing was always the cheapest part. Generating an app in an hour doesn't give you a product that has survived years of other people's mistakes.

## Maintenance is the product

Software maintenance is where personal software quietly gives up. Almost nobody schedules a monthly review of a tool they wrote for themselves. I don't, and I'm someone who enjoys this stuff.

A product that people pay for is, more than anything, a promise that someone *will* revisit it. When the broker changes its export format, someone fixes the importer. When the OS update breaks notifications, someone ships a patch before you notice. That ongoing attention is the thing you are buying, and it's exactly the thing my 30 apps are missing.

## Software is dead, long live the software

So is software dead? No. What died is the idea that every small problem needs a product.

Personal software is the new spreadsheet. It's the thing you reach for when a problem is yours alone, narrow, and short-lived: a dashboard for this year's numbers, a bot that watches one thing, an app for your own kitchen table. For those, building beats buying, and I will keep doing it. The SaaS is dead headlines are right about one slice — the thin single-feature tool that charges a monthly fee for something I can now generate in an evening is in real trouble.

Everything with history gets more valuable. Products that carry years of research, bug fixes, and filtered requirements now stand out against a flood of apps that have none. If you build software for a living, that history is the moat, and you build it by doing the unglamorous part: listening to users, fixing the edge cases, and saying no.

If you're about to replace a tool with something you generate this weekend, ask one question first: who is going to open this again in six months? If the honest answer is "probably nobody, and that's fine", build it. If the answer matters, pay the people whose job is to open it.

I'll probably write app number 31 this month. I'll probably forget about it by Christmas.
