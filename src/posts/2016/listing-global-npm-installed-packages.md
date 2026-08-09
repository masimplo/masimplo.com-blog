---
layout: post
title: List globally installed npm packages with versions
author: [masimplo]
tags: [Tips, Tools]
image: ../../images/headers/weekly-header-boxes-retina.png
date: 2016-10-14
draft: false
excerpt: One command lists every globally installed npm package and its version — useful when migrating globals to yarn or a new machine.
---

Now that [yarn](https://yarnpkg.com/) is all the hype, I am guessing a lot of people would want to reinstall their global packages using yarn. In order to find the package names and versions of globally installed packages all you need to do is:

## The command

`npm ls -g --depth=0`

That prints the global tree with versions and no nested dependencies. Copy the names you care about and reinstall them wherever you are moving next — yarn global, a fresh Node install, or [nvm](/nvm-is-hands-down-the-best-way-to-install-nodejs/) with `--reinstall-packages-from`.
