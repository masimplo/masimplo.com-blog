---
layout: post
title: Zigbee first, Matter later — radios for a local Home Assistant house
author: [masimplo]
tags: [Smart Home, Technology, Hobbies]
image: ../../images/headers/zigbee-matter-home-assistant.png
date: 2024-11-18
draft: false
excerpt: My house is Wi‑Fi and Shelly end to end. When I finally add battery sensors, I still plan Zigbee first — and Matter as a buying filter, not a rip-and-replace.
---

After [building the HVAC side from scratch](/building-a-smart-hvac-system/), the rest of the house automation is catching up on Home Assistant. What I keep glossing over in conversations is the radio question people ask the moment they open a shopping tab: Zigbee, Matter, Thread, Z-Wave, more Wi‑Fi?

Here is the honest starting point: **I do not run Zigbee.** The house is almost entirely Shelly on local Wi‑Fi, plus Local Tuya thermostats on the LAN. No mesh stick. No battery sensor fleet. Wi‑Fi only — on purpose.

The marketing answer to "what next?" is always "Matter — the future." The answer that matches how this house actually behaves is duller. **Keep Shelly on Wi‑Fi for powered gear. When I add a battery layer, start on Zigbee. Treat Matter as a purchase filter, not a religion.**

## Why Wi‑Fi won here

The network was designed for it. This is a Greek concrete-and-brick house — **τούβλα**, not plasterboard — and RF does not wander through slabs and masonry the way American drywall blogs pretend. Ubiquiti throughout: a **U7 access point on each floor** so coverage is planned, not hoped for, and **Ethernet drops in every room** so the APs, cameras, and anything that should never roam sit on copper. Shellys still talk Wi‑Fi, but they talk to a radio plan built for dense IoT on hostile walls, not a single router in a cupboard.

Shelly's local API is good. The Home Assistant integration is good. Circuit monitors, relays, and plugs sit on mains power and need to move real telemetry — Wi‑Fi is the right tool for that job *when the Wi‑Fi is this deliberate*. I got to sixty-plus devices partly by refusing to leave sub-panels blind, and that density only works because every endpoint is a boring LAN citizen on a network that can absorb them.

I am not looking for a reason to rip that out. A working Shelly fleet on a wired-backbone UniFi house is not technical debt. It is the load-bearing wall.

What Wi‑Fi is still a *bad* default for is the class of devices I have not bought yet: door contacts, leak sensors, scene buttons — anything that should last years on a coin cell and should not eat another DHCP lease or another slice of 2.4 GHz airtime, even when the U7s are doing their job.

So the open problem was never "replace Shelly with Zigbee." It is: when I finally buy that sleepy layer, which radio do I refuse to regret.

## What I would introduce for battery devices

I have not ordered the coordinator. I have opinions ready for when I do.

Zigbee is boring in the useful way — mesh, low power, a huge catalog of sensors Home Assistant people have already beaten on. When something flakes, someone has written the note. For a house this size I would run **Zigbee2MQTT** rather than ZHA: keep the radio layer inspectable, slightly decoupled from Home Assistant restarts, and easier to debug when a weird Tuya-flavoured sensor misbehaves.

ZHA is fine for a smaller install that wants fewer moving parts. My bias is operational, not doctrinal.

Coordinator placement would matter more than brand. USB extension away from the NUC, away from USB3 noise, somewhere central on the plan. A cheap stick jammed in the back of a metal rack is how you invent ghost disconnects — I would rather learn that from other people's scars than my own.

Until those sensors earn their keep, I am not inventing a second radio just to feel modern.

## What Matter is actually good for

Matter is real enough to take seriously. Cross-ecosystem portability matters if you care that a lock or a bulb might need to speak Apple and Google and HA without a proprietary bridge. The controller side in Home Assistant is improving; the device catalog is still uneven.

What Matter is *not*, in this house, is a reason to pause Shelly purchases or to wait forever before buying a leak sensor. Thread adds border-router homework. IPv6 multicast has opinions about your router. Some bulbs and plugs are fine. Other categories still mean reading the forum thread twice.

So I would use Matter as a **screen for expensive new purchases**, not a wholesale migration plan. Lock, thermostat family I might standardize on — ask whether a mature Matter path exists *and* whether local control still works when the vendor's app is gone. If the answer is fuzzy, buy Zigbee for the sleepy stuff or stick with the Shelly pattern I already trust.

Thread is infrastructure for Matter-over-Thread, not a third brand I need to collect. Border routers when the device list demands them — not because a keynote said the word Thread.

## The thermostat fork in the road

This part is concrete. The MOES BAC-006ALWW units on Local Tuya work. They also have a failure mode I have been chasing — click, flash, dead — that may end in replacing boards. One of the candidates on the shortlist is a Zigbee Beca unit that drops the Tuya cloud story entirely.

That would be the first Zigbee device in the house, and it would arrive for a boring reason: a dead thermostat, not a protocol hobby. Zigbee would sit under the same HA brain as the Shellys. The house does not need one radio. It needs one control plane.

## What I would buy next, in order

When the wireless layer grows past "more Shellys":

1. A solid Zigbee coordinator and Zigbee2MQTT — before a drawer full of battery sensors.
2. Leak sensors and door contacts on Zigbee — the devices that should survive a Wi‑Fi meltdown and a power blip on an access point.
3. A few scene buttons for rooms where a phone is the wrong interface.
4. Matter only when the specific device is mature *and* the price of being wrong is high enough to care about lock-in.

I would not "go all Matter" for sensors. I would not move circuit-level energy monitoring off Shelly onto Zigbee. Different jobs, different radios. Today that still means **Wi‑Fi only** — and that is fine.

## Local-first is a control path, not a purity test

People get religious about offline purity and about picking a single wireless religion. I got tired of both fights. Local-first, for me, means the paths that matter on a bad day — heat, pumps, alarms, "is the basement flooding" — do not depend on someone else's API staying funded. That is the same rule that shapes the rest of the [Home Assistant setup](/home-assistant-local-first-smart-home/).

Shelly on Wi‑Fi already covers the powered half of that story. Zigbee is the plan for the sleepy half when I need it. Matter can help for new multi-ecosystem hardware when the implementation is honest. Cloud voice and remote UI can sit on top without owning the switches.

The radio choice is subordinate to that rule. Buy what keeps working when the WAN light goes amber. Fashion is optional. Heat in an Athens summer is not.

Shellys stay. Zigbee when the battery layer arrives. Matter when the device earns it.
