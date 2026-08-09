---
layout: post
title: Remove sensitive data from git history with BFG
author: [masimplo]
tags: [Security, Tools, Tips]
image: ../../images/headers/bfg.png
date: 2016-10-28
draft: false
excerpt: Accidentally pushed an API key to GitHub? Scrub it from git history with BFG Repo-Cleaner, then force-push — reverting the commit is not enough.
---

Today I accidentally pushed a commit containing an API key to github. It wasn't an important API key, but could be. Reverting the commit will have no effect, as the API key is forever stored in git history.
If you are willing to rewrite history there is a solution that is well [documented by github](https://help.github.com/articles/remove-sensitive-data/).

## Install BFG and list the secrets

It all boils down to this. Install [BFG repo cleaner](https://rtyley.github.io/bfg-repo-cleaner/) (you can use homebrew on a Mac `brew install bfg`) and then add your sensitive data into a local text file:

**sensitive.txt**
```
api_key1
password1
secret_code2
etc
```

## Replace the text and rewrite history

and run `bfg --replace-text sensitive.txt`.

After the tool is done running you will get a nice detailed output on what it found and changed and ask you to run

`git reflog expire --expire=now --all && git gc --prune=now --aggressive`

## Force-push the cleaned history

Finally the dangerous part of overwriting public history (if you already pushed the bad commit, otherwise you are fine).

`git push -f`

Related: [delete unwanted git tags in bulk](/removing-remote-and-local-git-tags/) if you are already rewriting history and need to clean tags too.
