---
layout: post
title: Daikin weather compensation — 21% less heat from one offset
author: [masimplo]
tags: [Smart Home, Tips, Hobbies]
image: ../../images/headers/daikin-weather-compensation.png
date: 2026-03-28
draft: false
excerpt: Installer left the weather-compensation offset at +5. Dropping it to 0 cut heat-pump energy about 21% — same house, same week of March, Shelly numbers.
---

When I [wrote up the HVAC build](/building-a-smart-hvac-system/), I waved at weather compensation and moved on. That was the polite version. The useful version is uglier: the installer left a curve that heated Athens like it was Munich, I spent a winter paying for it, and one offset change in March cut heat-pump electricity by roughly a fifth.

No new hardware. No firmware flash. Just the Daikin BRC1HHDA, a week of Shelly charts, and the willingness to touch a setting nobody explains at handover.

## What weather compensation actually does

A heat pump does not have to push the same Leaving Water Temperature every day. Weather compensation (WD on the Daikin controller) maps outdoor temperature to target LWT — colder outside, hotter water; milder outside, cooler water. The point is continuous, lower-power running instead of short, angry cycles at a fixed high LWT.

On an air-to-water monobloc feeding oversized fan coils, that map is most of the efficiency story. The emitters were sized on purpose so day-to-day heating can sit on low fan and modest water temperatures. A curve that still asks for radiator-era LWT throws that investment away.

The controller will not tune itself to your envelope. It will run whatever conservative shape survived commissioning.

## The default that quietly costs money

Our house is ~230 m², A++, concrete and brick, Attica winters that mostly live in the 5–15 °C outdoor band. Design-day studies assume near-freezing. Reality rarely does. The heat pump is essentially never thermally stressed here — real-world COP in that band sits around 4.5–5.5 when the hydraulics cooperate.

Against that climate, the commissioned weather-compensation offset sat at **+5**. At roughly 11 °C outdoor, LWT was hanging around **46 °C**. Fine if you have undersized emitters and a cold climate. Wrong for fan coils that are happy in the high thirties, and wrong for a house that barely notices an 8 °C night.

I had been staring at Shelly totals that felt high for how mild the weeks were. Comfort was fine — which is exactly how bad curves survive. Nobody complains when the rooms are warm. The bill just gets a little thicker every month.

## One change, measured

On 11 March 2026 I dropped the offset from +5 to **0**. Same outdoor conditions in the days around the change. At ~11 °C outdoor, LWT fell from ~46 °C to ~**38 °C**.

Shelly on the heat-pump circuit told the rest:

- Occupied house, pre-tune (8–11 Mar): heat pump ~**20.7 kWh/day**
- Occupied house, post-tune (12–20 Mar): heat pump ~**16.3 kWh/day**

That is about **21% less heat-pump energy per day**. Rough annualisation for the heating season lands near **€80/year** saved on that circuit alone — not life-changing money, but real money for touching one number. Whole-house daily draw fell from ~40 kWh to ~33 kWh in the same window; the heat pump was most of the move.

Comfort did not collapse. Rooms still reached setpoint. Fan coils stayed quiet on low speed. If anything the system felt less frantic — longer, calmer runs, which is what the textbooks promise when LWT stops being theatrical.

## Why the installer will not do this for you

Commissioning defaults are defensive. Leave water hot enough and nobody calls about cold rooms in January. Leave it efficient and you own the complaint if week three of a cold snap feels marginal.

The installer also leaves. They do not live inside your Shelly dashboards. They do not know that your fan coils are oversized for noise reasons, or that Paiania's "cold" is someone else's mild spring. [Local-first monitoring](/home-assistant-local-first-smart-home/) is what makes the argument possible — without circuit-level kWh you are tuning by vibe, and vibe always votes for hotter water.

I am not angry at the handover. I am annoyed that the manual treats weather compensation like a footnote, and that "the system is commissioned" gets treated as "the system is finished."

## What I would still change

Offset 0 is not the final curve. I still want to walk LWT further down on mild days — something like ~33 °C at 11 °C outdoor and ~30 °C at 20 °C — once I am sure comfort holds through a colder stretch. One zone on the Daikin ("Main zone") keeps the map simple; I am not chasing Zone 2 complexity for sport.

I would also not tune without a week of baseline and a week of after. One warm afternoon proves nothing. Compare similar outdoor temperatures, occupied patterns, and the same meters.

And I would still start energy monitoring on day one of a build. You cannot defend a curve change in an argument with yourself if the only evidence is "it felt cheaper."

## Who this is for

If you own an air-to-water heat pump on weather compensation and you have never opened the WD settings since install, you are probably paying an installer-shaped tax. Especially in a mild climate with a tight envelope and emitters that can run low LWT.

Open the controller. Note the outdoor temperature and the current LWT. Ask whether that water temperature is doing work your house actually needs — or just making the compressor feel important.

The expensive setting is the one nobody told you was optional. I left +5 alone for too long. Zero was waiting the whole time.
