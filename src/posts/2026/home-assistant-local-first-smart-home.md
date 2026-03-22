---
layout: post
title: Home Assistant and the local-first smart home
author: [masimplo]
tags: [Smart Home, Technology, Hobbies]
image: ../../images/headers/homeassistant.png
date: 2026-01-12
draft: false
excerpt: Smart home products love to sell you convenience. What they do not mention is that most of that convenience runs through someone else's server.
---

Smart home products love to sell you convenience. What they do not mention is that most of that convenience runs through someone else's server.

When you are building a house from scratch, you get a rare opportunity — you can think about automation and monitoring from the foundations up rather than retrofitting it. I have been doing exactly that across a three-floor house in a suburb of Athens, and the spine of the whole thing is Home Assistant running local-first, with as little cloud dependency as I can manage.

## Why local-first matters

The appeal of cloud-connected devices is real — easy setup, works from anywhere, no maintenance. The cost is that you are dependent on a company continuing to run their servers, continuing to support your device, and not changing their business model in a way that affects you. There is a long and growing list of smart home products that have had their cloud services switched off, taking perfectly functional hardware with them.

For heating control, energy monitoring, and security — things that affect daily life in a real way — that dependency is a risk I do not want to take. Local-first means the system works whether or not some external service is reachable, and it works indefinitely regardless of corporate decisions made by whoever made your devices.

## The Shelly backbone

The energy monitoring foundation of the house is built on Shelly devices — at this point over 60 of them across circuits, plugs, and sub-panels. Shelly's native API supports local communication without any cloud involvement, and the Home Assistant integration is solid.

The reason I got to 60+ is partly the lesson I learned the hard way: I initially missed several sub-panels that had been wired without monitoring, and spent a while confused about why my consumption numbers did not add up. Now the rule is simple — nothing gets wired without visibility.

Having this level of monitoring granularity turns out to be genuinely useful beyond just curiosity. You can spot when something is drawing more than it should, understand how much your heat pump actually costs to run in different modes, and have real data when you want to optimize something.

## Mushroom dashboards

The default Home Assistant UI is functional but not beautiful. After going through a few dashboard approaches, I landed on Mushroom Strategy, which generates clean card-based views from your entities automatically. It is the kind of thing that makes Home Assistant feel like a finished product rather than a developer tool.

Having a dashboard that actually makes sense to everyone in the house — not just me — turned out to matter more than I initially expected.

## Local Tuya for thermostats

The Gree ceiling fan coils around the house use MOES BAC-006ALWW thermostats. These are inexpensive, capable thermostats that also support Local Tuya — a Home Assistant integration that communicates directly with Tuya-based devices over the local network, bypassing the Tuya cloud entirely.

Getting Local Tuya working requires a bit of upfront effort: you need to extract device keys during provisioning and configure each entity carefully. It is not quite as effortless as the official cloud integration. But once it is running, it is fast, reliable, and completely yours.

## Voice control experiments

I spent some time exploring LLM-based voice control via Home Assistant Cloud, using Gemini as the conversation agent. The idea of being able to talk to your house in natural language rather than remembering specific device names and automation triggers is compelling.

The results were interesting. For simple commands it works well. For anything involving context or ambiguity it is hit and miss, as you would expect from current LLMs operating with limited home context. It is a space that is moving quickly and I expect to revisit it as the tooling matures.

## Backup power for the drainage pump

One specific problem I wanted to solve: the drainage pump for the lower floor sits in an area that gets water ingress during heavy rain — exactly when you might have a power outage. Running the pump off grid power during a storm outage rather defeats the purpose.

The solution was a budget pure sine wave inverter connected to an existing car battery, with a Shelly monitoring the mains power and triggering an automation in Home Assistant to switch to battery backup when grid power drops. Pure sine wave matters for pumps — the motor does not like the modified square wave output that cheaper inverters produce.

It is not an elaborate solution but it solves a real problem cleanly, which is usually the best kind.

## Brand philosophy

Looking across the whole house, there is a pattern to what I have chosen: Shelly for monitoring and control (local API, great HA support), Daikin for HVAC (reliable, well-documented, premium), Ubiquiti for networking (prosumer, solid, no subscription nonsense), and Duravit, Alumil, AEG for the fixtures and fittings. All European, all in the premium tier of their category, all chosen because I expect them to still be working properly in twenty years.

That philosophy ends up costing more upfront. It also means significantly less frustration, less replacing things, and a system that feels coherent rather than patched together.

## What is next

Still to come: IR blasters (Broadlink RM4 Mini) for the floor fan coils where a wired thermostat was not practical, a Toshiba Daisekai 10 split for the basement playroom, and continued refinement of the energy monitoring dashboards as the picture of the whole house's consumption gets clearer.

The house is not finished and neither is the automation. But that is also part of what makes it interesting.
