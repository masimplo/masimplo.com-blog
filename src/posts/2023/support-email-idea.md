---
layout: post
title: Help the Helpdesk! Send Info.
author: [masimplo]
tags: [Tips]
image: ../../images/headers/markus-winkler-Lp4jsVg8gpY-unsplash.jpg
date: 2023-03-05
draft: false
---

Mobile apps are a crucial part of our daily lives, but when something goes wrong, it's important to have a quick and easy way to contact support. Most mobile apps provide a "Contact support" link, but have you ever thought about the information you're providing in the support request? In this article, I'll share my personal experience of needing support for an app and how it led me to discover the importance of providing device and user information in support requests.

A couple of days ago, I had to get support for an app I've been using for some time now. I noticed something really simple, but cool and effective. Clicking the get support mailto link, had added device and user information in the body of the email, along with the typical subject being like "Support request from {AppName}". This might sound like a minor detail, but I believe it makes a huge difference for the support team. When they receive a support request, they not only know it came from within the app, but also get all the information they would have to subsequently request from the user.

This experience made me realize the importance of providing device and user information in support requests.

In my first iteration, I went for something really simple like:

```
username: {username}
app version: {version}
device: {manufacturer} {model} {os} {osVersion} {uuid}
```

I included this information because it's what the support team would need to know straight away to move forward with the support response. However, it's also important to provide additional information that can help support teams diagnose issues quickly. This can include details like the user's location, network connection, and any error messages they may have received.

> hot tip: if you need to add new lines to the mailto link body section you can use `%0D%0A` for a newline as explained [here](https://stackoverflow.com/questions/22765834/insert-a-line-break-in-mailto-body)

Next time you implement a "Contact support" link in your app, take some time to consider what information would make support easier for both your users and the support team. Providing device and user information can help support teams diagnose and resolve issues quickly, leading to happier customers and a better user experience overall. So, give it a try and see the difference it can make!
