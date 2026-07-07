---
layout: post
title: Listing global npm installed packages
author: [masimplo]
tags: [Tips, Tools]
image: ../../images/headers/weekly-header-boxes-retina.png
date: 2016-10-14
draft: false
excerpt: If you are moving your global packages over to yarn, a single npm command lists every globally installed package with its version.
---

Now that [yarn](https://yarnpkg.com/) is all the hype, I am guessing a lot of people would want to reinstall their global packages using yarn. In order to find the package names and versions of globally installed packages all you need to do is:

`npm ls -g --depth=0`
