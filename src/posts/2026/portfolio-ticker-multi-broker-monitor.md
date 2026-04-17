---
layout: post
title: Portfolio Ticker — a tiny monitor for investments scattered across brokers
author: [masimplo]
tags: [Technology, Code, Firebase, Tools, Personal]
image: ../../images/headers/portfolio-ticker-header.png
date: 2026-04-17
draft: false
excerpt: I had stocks and ETFs across three platforms and no single place to see them. So I built one, and left it open for anyone else to use.
---

I had investments scattered across three different brokers and no single place to see what was actually going on. Each platform shows you its own slice, in its own currency, with its own definition of "daily change". Switching between them to mentally sum everything up was annoying on good days and misleading on bad ones.

So I built a small web app that pulls all of it into one screen. It is live at [portfolio-ticker.web.app](https://portfolio-ticker.web.app) and anyone with a Google account can use it. No ads, no tracking beyond the bare minimum, no pitch to upgrade. I wrote it for myself and then realised there was no real reason not to share it.

## What it actually does

You add your holdings — ticker, shares, average price, currency, purchase date, optionally which platform you hold them on. The app then:

- Fetches real-time quotes from Yahoo Finance every 60 seconds.
- Converts everything into a single base currency so the totals mean something.
- Shows daily and total P/L per position and portfolio-wide.
- Draws a weekly historical value chart with markers where your purchases happened.
- Highlights the best and worst performers of the day so you do not have to hunt for them.

It is not a trading tool. There is no order placement, no options chain, no news feed. It does one thing: tell you where your portfolio stands right now and how it got there.

## The stack, and why

I started with a single-file Flask prototype. Python, `yfinance`, a SQLite file, an HTML template with some JavaScript sprinkled on top. That version still exists in the repo as a museum piece. It worked for me on localhost for about a year.

What pushed me to rewrite it was wanting to access the thing from my phone without running a laptop at home, and — honestly — wanting to let a few friends use it without handing out SSH keys. Once you say "multi-user, accessible from anywhere", you are building a web app, not a script.

The rewrite went to Firebase:

- **Vue 3 + TypeScript + Vite** for the frontend. I picked Vue because I wanted single-file components and a small surface area. No SSR, no routing gymnastics.
- **Pinia** for state. Auth, portfolio, holdings, history — four stores, clean boundaries.
- **Firebase Hosting + Auth + Firestore + Cloud Functions**. One vendor, one CLI, one deploy command.
- **`yahoo-finance2`** running inside a Cloud Function. The free Yahoo endpoints are not meant to be called from a browser directly — CORS, rate limits, ToS. A small backend solves all three.
- **TradingView Lightweight Charts** for the historical value chart. Tiny, fast, exactly one kind of chart, which is all I needed.

The whole thing fits on the Firebase free tier for a handful of users. If that changes I will deal with it then.

## Multi-currency, or: why totals are harder than they look

Half of my holdings are in USD and half are in EUR. Summing them naively gives you a number that is wrong in two different ways at once. So every price that comes back from Yahoo goes through an FX conversion before anything gets totalled. The base currency is EUR for me; the repo makes it configurable.

The tricky bit is not the conversion itself — it is deciding *when* to convert. For the current portfolio value you use the current FX rate. For the daily P/L you need yesterday's close in the original currency converted at yesterday's rate, compared to today's price at today's rate, and the difference is what matters. It is easy to accidentally mix frames and end up with a P/L that moves when the euro moves even though nothing in your portfolio did.

This kind of thing is exactly why I wanted pure, testable logic on the backend. The `domain/portfolio` and `domain/history` modules have no Firebase imports and no network calls. They are just functions that take inputs and return numbers, and they have unit tests. Everything else — the Firestore wiring, the HTTP handlers, the auth middleware — is a thin shell around them.

## The history cache

Pulling weekly closes for a dozen tickers every time someone loads the dashboard would be slow and would get me rate-limited fast. So historical data gets cached in Firestore under `users/{uid}/ticker_cache/{ticker}`. The Cloud Function checks the cache first, only fetches what is missing or stale, and writes back. The portfolio value series is then computed on the fly from the cached closes plus the user's purchase events.

The nice property of this is that the cache is shaped around *tickers*, not *users*. If two people hold AAPL, Yahoo gets called once and both benefit — at least in principle; right now it is still scoped per user because that was simpler to reason about for security rules. Flattening it into a shared cache is on the list.

## Auth and isolation

Firebase Auth handles sign-in. Google or email/password, whichever you prefer. Every Firestore path is scoped under `users/{uid}/...` and the security rules reject anything that does not match the authenticated UID. The Cloud Functions verify the Firebase ID token on every request and attach the UID to the handler context. There is no admin panel, no impersonation, no shared state between users.

This matters because I opened the app to the public. "Hopefully won't be abused" is not a security model. The security model is: each user's holdings are readable and writable only by them, period. If the functions get hammered I can add rate limiting or quotas; the data isolation is structural.

## Small touches that made it feel finished

The thing that separates a side project you demo once from a side project you actually use is the small stuff. A few things I am glad I spent time on:

**Ticker auto-lookup in the add-holding form.** You type a company name, it suggests tickers. Without this you are tabbing back to Yahoo constantly.

**Undo.** Deleting a holding pushes the previous state onto a small in-memory stack, and there is an undo button. I have hit it more than once.

**Merge duplicate purchases.** If you bought the same ticker on the same platform twice, the UI lets you collapse them into one row with a weighted-average price. Otherwise the table turns into a wall over time.

**Purchase markers on the chart.** Tiny triangles on the historical chart where you actually bought. Context is everything when you are looking at a drawdown.

**A proper mobile layout.** The desktop view is a sortable table. On mobile it switches to a card layout because a table scrolled sideways is not useful. Same data, different shape.

**Market-status awareness.** A small composable knows which exchange a ticker trades on and whether that market is currently open. If it is closed, the "daily change" is the last session's change, not a meaningless flatline.

## If you want to use it

Just go to [portfolio-ticker.web.app](https://portfolio-ticker.web.app), sign in with Google, and start adding holdings. Your data is yours. You can delete your account and everything goes with it.

This was one of those projects where the journey from "I wish someone made this" to "I guess I will make this" was shorter than I expected. If you have a similar little itch that three weekends could scratch, my advice is the usual: just start. Nothing beats how easy it is to iterate on something once the boring plumbing is already in place.
