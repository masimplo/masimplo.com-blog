---
layout: post
title: 'Finding an appropriate WAF might be harder than it looks'
author: [masimplo]
tags: [Security,Technology]
image: ../images/headers/michael-dziedzic-gKyv6-Ev_TE-unsplash.jpg
date: "2023-03-11"
draft: false
---

When you deploy anything on the internet, it immediately becomes a target for cyber attacks. There are many measures that need to be taken for even a simple site to be secure, let alone SaaS, eshops, APIs and many complex systems that might need protection across multiple layers. A Web Application Firewall is a must nowadays, providing protection from DDOS, bot attacks, various malicious injection attempts, brute force attacks and more.

If you are a large company with a large infrastructure budget, then you are in luck. There are many great options out there that for the right amount of money, will give you a great solution, probably doing even more than you need. If you are a small company with a few employees and tight budgets or if you are an individual starting out in a big idea, then things might not be so clear cut for you.

Some of the most known, feature rich, but rather "expensive" Web Application Firewall providers include:

- Akamai App & API protection
- Barracuda WAF as a service
- Cloudbric
- Cloudflare
- Crowdstrike Falcon
- F5
- HAProxy Enterprize
- Imperva
- Prophaze
- Sucuri
and many more

Prices start from 4 digits per month for any meaningful WAF protection and can quickly escalate with any special requirements or support. Some companies make pricing difficult to estimate by offering prices based on metrics like endpoints or vCPU, rather than using a more straightforward metric like bandwidth or requests per minute. Cloudflare and F5 do offer some entry level packages for 25-200USD per month that if their offering covers your, you are in luck. The rest all have a call-for-quote price - we all know what this means - and through personal research found that prices are currently on 2-5k range for entry level "enterprise" packages. Some of the above come coupled with CDN, which although it kind of makes sense, it can lead to some issues.

European companies, handling European data have to abide to GDPR standards, which means that in some cases, the data they handle should not be stored outside of Europe without consent. This means that any service that provides CDN functionality, is breaking this limitation and thus might make the company liable to lawsuits and steep fines. All of the above providers, as far as I could gather, do not offer a way to be compatible with GDPR restrictions in their basic offerings and companies need to use Enterprise level packages or customized - aka expensive - solutions to implement something that should be considered standard practice.

For instance Cloudflare supports implementing GDPR as can be shown here:

https://developers.cloudflare.com/data-localization/

but all the settings that need to be toggled are part of their Enterprise offering, making any site using Cloudflare in Europe that handles user data, and is paying anything other than their top tier offering, GDPR incompatible - and there are a lot of sites using Cloudflare in Europe.

It's frustrating that GDPR and CDN are often incompatible, and there doesn't seem to be a well-documented solution available for many companies. Even when you're willing to pay high prices, you may still lose the benefits of a global CDN due to GDPR restrictions. Maybe there is a more smart solution where the data is stored encrypted in the CDN servers, thus not breaking GDPR rules but I did not come across such a solution, as SSL termination happens in the edge as far as I know. Next week I have set up some call with a few of the above companies to find out how they approach the issue technically, given there would be no budget restrictions.
