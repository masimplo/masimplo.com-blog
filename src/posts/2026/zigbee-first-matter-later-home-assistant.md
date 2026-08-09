---
layout: post
title: Zigbee first, Matter later — radios for a local Home Assistant house
author: [masimplo]
tags: [Smart Home, Technology, Hobbies]
image: ../../images/headers/zigbee-matter-home-assistant.png
date: 2026-08-09
draft: false
excerpt: For a local-first Home Assistant house I would still start on Zigbee for sensors and buttons — and treat Matter as a buying filter, not a wholesale replacement.
---

I already wrote about [why the house runs local-first on Home Assistant](/home-assistant-local-first-smart-home/) and about [building the HVAC side from scratch](/building-a-smart-hvac-system/). What I glossed over both times is the radio question people ask the moment they open a shopping tab: Zigbee, Matter, Thread, Z-Wave, more Wi‑Fi?

The marketing answer is always "Matter — the future." The answer that matches how this house actually behaves is duller. **Zigbee first for the battery layer. Wi‑Fi where power and bandwidth already live. Matter later, as a purchase filter.**

## What the house already settled

The energy spine is Shelly over local Wi‑Fi — sixty-plus devices, native API, no cloud required. The thermostats talk Local Tuya on the LAN. Ubiquiti owns the network. That stack is not temporary scaffolding. It is the load-bearing wall.

Wi‑Fi was the right call for plugs, relays, and circuit monitors that sit on mains power and need to move real telemetry. It is a bad default for a door sensor that should last two years on a coin cell, or a button that should not eat another DHCP lease and another 2.4 GHz contention slot.

So the open problem was never "replace Shelly with Zigbee." It was: what do I buy for the *next* class of devices — contacts, leak sensors, remotes, maybe a thermostat swap if a MOES board dies — without painting myself into a cloud corner.

## Zigbee as the local device layer

Zigbee is boring in the useful way. Mesh, low power, huge catalog of sensors that have been beaten on by Home Assistant people for years. When something flakes, someone has already written the note.

I care less about the brand wars than about the integration path. For a house this size I would run **Zigbee2MQTT** rather than ZHA. I already live in MQTT for other pieces of the stack, I want the Zigbee network to survive a Home Assistant restart without taking the coordinator's brain with it, and when a weird Tuya-flavoured sensor misbehaves I want logs that are not hiding inside a single integration's UI.

ZHA is fine for a smaller install that wants fewer moving parts. My bias is operational: keep the radio layer inspectable and slightly decoupled from the automation brain.

Coordinator choice matters more than people admit. Put it on USB extension away from the Pi or NUC, away from USB3 noise, somewhere central on a three-floor plan. A cheap stick jammed in the back of a metal rack is how you invent ghost disconnects.

## What Matter is actually good for

Matter is real. Home Assistant's Matter server work in 2025–26 made the controller side less of a science project. Cross-ecosystem portability is a genuine feature if you care that a lock or a bulb might need to speak Apple and Google and HA without a proprietary bridge.

What Matter is *not*, in my house, is a reason to rip out a working Zigbee mesh or a working Shelly fleet. Thread adds border-router homework. IPv6 multicast has opinions about your router. Device maturity is uneven by category — great for some bulbs and plugs, still "read the forum thread twice" for others.

So I use Matter as a **screen for new purchases**, not a religion. If I am buying something expensive and long-lived — a lock, a thermostat family I might standardize on — I ask whether a mature Matter path exists *and* whether local control still works when the vendor's app is gone. If the answer is fuzzy, I buy Zigbee or stick with the Shelly pattern I already trust.

Thread is infrastructure for Matter-over-Thread, not a third competing "smart home brand" I need to collect. I will add border-router capacity when the device list demands it — not because a keynote said the word Thread.

## The thermostat fork in the road

This is not theoretical for me. The MOES BAC-006ALWW units on Local Tuya work. They also have a failure mode I have been chasing in the HVAC notes — click, flash, dead — that may end in replacing boards. The candidates on my shortlist include Zigbee Beca units that drop the Tuya cloud story entirely.

That is the pattern I trust: when something dies, upgrade the *radio and the local story*, not the dashboard aesthetics. Zigbee thermostats would sit on the same HA brain as the Shellys. The house does not need one protocol. It needs one control plane.

## What I would buy next, in order

If I were starting the wireless layer tomorrow:

1. A solid Zigbee coordinator and Zigbee2MQTT, before any more battery sensors.
2. Leak sensors and door contacts on Zigbee — the devices that should survive a Wi‑Fi meltdown and a power blip on the access point.
3. A few scene buttons for rooms where a phone is the wrong interface.
4. Matter only when the specific device is mature *and* the price of being wrong is high enough to care about lock-in.

I would not "go all Matter" for sensors. I would not put circuit-level energy monitoring on Zigbee when Shelly already owns that job on Ethernet-adjacent Wi‑Fi. Different jobs, different radios.

## Local-first is a control path, not a purity test

People get religious about offline purity. I got tired of that fight. Local-first, for me, means the paths that matter on a bad day — heat, pumps, alarms, "is the basement flooding" — do not depend on someone else's API staying funded.

Zigbee helps that story for sleepy devices. Shelly helps it for powered ones. Matter can help it for new multi-ecosystem hardware when the implementation is honest. Cloud voice and remote UI can sit on top without owning the switches.

The radio choice is subordinate to that rule. Buy the mesh that keeps working when the WAN light goes amber. Fashion is optional. Heat in an Athens summer is not.

Zigbee first. Matter when the device earns it. Leave the Shellys alone — they already paid rent.
