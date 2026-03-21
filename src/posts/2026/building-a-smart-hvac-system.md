---
layout: post
title: Building a smart HVAC system from scratch
author: [masimplo]
tags: [Smart Home, Hobbies, Technology]
image: ../../images/headers/laura-zanotti-bLuvoNtUa70-unsplash.jpg
date: 2026-02-20
draft: false
excerpt: When you build your own house you get to make all the decisions. That sounds great until you realize you also have to live with all of them.
---

When you build your own house you get to make all the decisions. That sounds great until you realize you also have to live with all of them.

I have been building a three-floor house in a suburb of Athens for the better part of several years now, and the HVAC system has been one of the most unexpectedly deep rabbit holes of the whole project. Not because it is particularly complicated in concept, but because the gap between what gets installed and what actually works well requires a lot of owner-driven tuning that nobody tells you about.

## Choosing the heat pump

After a lot of research I settled on a Daikin Monobloc as the primary heating and cooling system. Monobloc means all the refrigerant components are in one outdoor unit, with just water circuits going into the house — simpler installation, no refrigerant pipes to worry about inside. The emitters are **hydronic fan coil units** on two of the three floors — the same water loop does heating in winter and cooling in summer, which is exactly the kind of load a monobloc and buffer tank arrangement is built for.

The installer set it up, commissioned it, and left. That is where my involvement really began.

## Weather curves and why they matter

The Daikin BRC1HHDA controller exposes something called a weather compensation curve — the idea is that the system adjusts the Leaving Water Temperature (LWT) automatically based on outdoor temperature, rather than always running at full blast. A well-tuned weather curve means the system runs more continuously at lower power (much more efficient) rather than cycling on and off at high power.

The defaults the installer leaves in are almost never optimal for your house. Your insulation, glazing, room-by-room loads, orientation, and how the fan coils actually behave at different supply temperatures — all of it affects what the right curve should be. I spent a fair amount of time adjusting the curve parameters and monitoring the results, comparing electricity consumption against indoor comfort, before landing on settings that actually made sense for our house.

It is one of those things that makes a real difference to both comfort and electricity bills, and yet most people who own heat pumps have no idea it exists.

## DHW setpoints and the solar loop

Domestic hot water (DHW) was its own adventure. On this controller, **Comfort and ECO are not “on all the time” versus “on a schedule” — they are different target temperature levels** (Comfort aims higher in the tank, ECO settles for a lower setpoint and less aggressive reheating). There is also a Reheat behavior that tops the tank up when it drifts below a threshold.

The problem in practice was leaving everything biased toward the high target when a solar loop is in the mix — the heat pump was doing premium-temperature work the sun could have covered, or firing at the wrong times of day. It took iteration to align tank setpoints and timing with real shower patterns, cheap solar gain during the day, and avoiding unnecessary heat-pump runs in expensive tariff windows.

This is the kind of optimization that you simply cannot do without understanding the system. The installer has no incentive to dig into it, and the manual is not exactly a pleasure to read.

## The mystery of the unmetered loads

At some point I started noticing that my total electricity consumption did not add up. I had Shelly energy monitors on most circuits, but the numbers just did not reconcile.

It turned out there were sub-panels in the house that had been wired without Shelly monitors — basically blind spots in my energy monitoring setup. Once I tracked them all down and got monitoring on every circuit, the picture became clear. It sounds like a small thing but it genuinely bothered me that I had significant consumption I could not account for. There is something deeply satisfying about having complete visibility into your own house's energy flows.

## The solar water heater platform

Deciding to add a 200-litre thermosiphon solar water heater on top of the outdoor heat pump unit involved building a metal platform above the Daikin. I had a metalworker fabricate it, which introduced the usual dynamic of having to oversee someone else's interpretation of what you asked for.

The hydraulic integration with the existing buffer tank and 3-way valve arrangement was also a point of some disagreement with the plumber. The correct placement of the buffer tank and where the 3-way valve sits in the circuit affects how effectively the solar contribution gets used and how much the heat pump has to compensate. These are not details that most plumbers think deeply about — they tend to go with whatever they have always done — so being informed enough to have the argument is important.

## Fan coil units and thermostats

The ceiling fan coils are **Gree**. The floor-mounted cassettes come from another line — same hydronic circuit, different form factor and throw pattern. I am deliberately not listing model codes here; the important part was getting both families to behave predictably on the same supply temperatures. **Every fan coil is oversized relative to the nominal room load** — not by accident. The goal is to run **day-to-day heating and cooling on the lowest air speed** so the house stays quiet; undersized units spend their lives screaming on high fan to keep up. For control, I ended up with MOES BAC-006ALWW thermostats, which support Local Tuya — meaning they integrate directly into Home Assistant without going through any cloud service. Local-first has been a strong principle throughout the smart home setup, and it matters especially for things like heating and cooling control where you really do not want to depend on a third-party server being up.

The basement playroom still needs climate control — that will be a Toshiba Daisekai 10 split unit. The floor fan coils in some rooms are also going to get IR blasters (Broadlink RM4 Mini) for control where wired thermostats were not practical.

## What I would do differently

Start with energy monitoring from day one. Do not let any circuit get wired without a Shelly on it. The cost is negligible in the context of a build and the value of having complete visibility is enormous — both for catching inefficiencies and for having the data you need when something does not feel right.

Also: learn enough about heat pump operation to have an informed conversation with your installer before they leave. Not because they will do a bad job, but because the commissioning defaults are conservative and generic, and your specific house deserves a configuration that actually fits it.
