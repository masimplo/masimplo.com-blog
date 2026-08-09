---
layout: post
title: Portfolio Ticker four months on — ROI/yr, year returns, and a real order log
author: [masimplo]
tags: [Tools, Technology, Code, Firebase, Personal]
image: ../../images/headers/portfolio-ticker-improvements.png
date: 2026-08-09
draft: false
excerpt: Living with Portfolio Ticker exposed the gaps — annualized ROI, calendar-year returns, and what happens when you sell. Here is what I added.
---

In April I [opened Portfolio Ticker](/portfolio-ticker-multi-broker-monitor/) — a small Firebase app that pulls holdings across brokers onto one screen. I have been using it as my actual dashboard since. That is the only review process that matters for a side project: does it still answer the question you built it for, or do you keep opening the brokers anyway?

I kept opening it. Then I started wanting numbers the first version refused to give me. So I added them.

## The question after "what is it worth today"

The launch app was good at *now*: live quotes, FX into EUR, daily and total P/L, a weekly value chart. After a few months the question that kept itching was different. **How does this compare to "the market does ~X% a year"?**

Total P/L in euros is the wrong shape for that. A portfolio you funded last month and one you funded in 2019 can show the same euro gain and mean completely different things. I needed an annualized rate.

So the summary row now has an **ROI / yr** card — portfolio CAGR on open holdings: current value versus cost, raised to one over years since the earliest open purchase. Same spirit as the long-term S&P figures people quote. Signed percent, one decimal, em dash when the inputs are nonsense (no buy date, zero cost, and so on). Closed lots stay out of the start date so a sold position from 2018 does not stretch the clock for money that is already gone.

No GIPS theater — just a glanceable answer to "am I even in the ballpark of the story I tell myself about equities."

## Calendar-year returns under the chart

CAGR collapses the whole life of the book into one number. Useful, and incomplete. Years are uneven — 2022 felt nothing like 2023 — and I wanted the S&P-style strip: **2023 +11.2% · 2024 −4.1% · 2026 YTD +3.1%**.

That lives under the history chart now. Each completed calendar year gets a time-weighted return; the current year is labeled **YTD** and is *not* annualized. Buys and sells from the order log are linked in as cash flows so a mid-year deposit does not pretend to be performance.

Getting TWR right on a personal book is fiddlier than the CAGR card. The weekly series alone lies if you ignore cash flows. The order log alone has no prices. You need both, and you need tests for the ugly cases — mid-year buy, mid-year sell, empty series — or you ship a number that feels profound and is wrong.

## What happens when you sell

The first version treated "delete holding" a little too much like "forget it." Fine for a typo. Bad for a real exit. I added a **permanent order log** with realized P/L for sold and deleted positions so the story of the portfolio includes what left, not only what remains.

Without that, calendar-year TWR has nothing honest to link against, and your memory of "I sold X near the top" stays a vibe. Boring UI — but it is what turns a monitor into a diary.

## Holdings without the modal tax

I also stopped making every edit a modal pilgrimage. You can manage holdings **inline on the dashboard** now — add, tweak, merge — without the constant open/close choreography that made a two-minute update feel like admin work. Side projects die from friction as often as from missing features.

Chart accuracy and column ordering got a pass in the same stretch. Nothing glamorous. The kind of fix you only notice when a line looks one week off and you cannot unsee it.

## What I did not add

Still no order placement, no news firehose, no "AI insights." Still no shared ticker cache across users (per-user cache remains simpler for security rules). Still Firebase free-tier shaped.

The temptation after four months is to turn a sharp tool into a platform. I am resisting. The ROI card and the year strip exist because I needed them while staring at my own money — not because a roadmap said so.

## If you already use it

Refresh [portfolio-ticker.web.app](https://portfolio-ticker.web.app). The new summary card and the year strip show up once you have purchase dates and enough history for the chart. The order log fills in as you sell or remove positions going forward.

If you have not tried it: sign in with Google, add a few holdings, live with it for a week. The features worth building are the ones you miss on day eight — not the ones that looked impressive on day one.

I built the first version because the brokers would not give me one screen. I improved it because one screen taught me which questions were still unanswered. That loop is the whole hobby.
