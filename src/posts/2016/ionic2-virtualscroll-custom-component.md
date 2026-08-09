---
layout: post
title: Ionic VirtualScroll with custom components — wrap in a div
author: [masimplo]
tags: [Ionic, Tips]
image: ../../images/headers/ionicrc0.png
date: 2016-10-18
draft: false
excerpt: Ionic2 VirtualScroll would not render custom item components — wrap the component in a plain div with *virtualItem until the framework catches up.
---

Simply put virtual scroll is a performance related technique to have a scrollable list of a vast amounts of records that does not impact performance by rendering too many DOM elements. What it does to accomplish that is render just a few items and replace the item contents while scrolling in such a fashion so that the user perceives it as she/he is actually scrolling a large list of items. This has a major impact on performance and is paramount for any app handling large amounts of data to function correctly.

## The Ionic2 VirtualScroll custom component bug

In current version of [Ionic2 (rc1)](http://ionicframework.com/) it is not yet possible to use a custom component as the item to be used by virtual scroll leading to a template that has to be defined in place rather than abstracted away in its own components. There is a currently [open issue](https://github.com/driftyco/ionic/issues/6881) for that. Until that issue is resolved there is a quick workaround you can use.

Say we have a list of contacts and each contact is rendered by a component called MyContactListItem we would normally do:
```html
<ion-list [virtualScroll]="contacts">
    <my-contact-list-item
                *virtualItem="let contact"
                [contact]="contact"
                (onSelect)="selected($event)"
                (onEdit)="updateContact($event)">
    </my-contact-list-item>
</ion-list>
```

This will not render anything due to the existing issue.

## Workaround: wrap the custom component in a div

What we can do instead is wrap our custom element in a div element which happens to work with virtualScroll (normally we would use a ion-item but this is going to mess our template at this point).

```html
<ion-list [virtualScroll]="contacts" approxItemHeight="100px">
  <div *virtualItem="let contact" class="full-width">
    <cv-contact-list-item  [contact]="contact"
                          (onSelect)="selected($event)"
                          (onEdit)="updateContact($event)">
    </cv-contact-list-item>
  </div>
</ion-list>
```

And this will have to do for now.

Related: [Ionic Angular standalone migration](/migrating-ionic-to-angular-standalone-components/) · [Ionic environment config with NODE_ENV](/using-environment-config-in-ionic2/).
