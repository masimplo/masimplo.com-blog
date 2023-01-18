---
layout: post
title: Entity Framework Proxy GetType() mess
author: [masimplo]
tags: [.Net]
image: ../../images/headers/jake-hills-36605-unsplash.jpg
date: 2011-07-07
draft: false
---

Working with the Entity Framework of .NET and having implemented a Repository Pattern with generics, I found myself in the position of having to make a Repository of an unknown type until runtime, so I did something like:

...

As long as I was creating new entities, this chunk worked fine. But as soon as I started to pick up entities from the framework for editing, the exceptions did not stop. The problem was created by the fact that the entities returned by EF are proxies that inherit the type of the respective entity and not the entity type.

My first thought was if Microsoft would have buried the entity type somewhere in the properties of the dynamic proxies. But nowhere, except for the expected base type which, however, created other problems if some entities have more than one level of inheritance like mine.

After a lot of searching, since searches of the style: "dynamic proxies getType originating type" laughed in my face, I found a sweet static method inside the ObjectContext that showed the Entity Type for Dynamic proxy entities but didn't complain to POCOs either, so it was what I needed to make the problematic chunk exception-free (at least that particular one :P).

```
public static bool IsProxy(object type) {
   return type != null && ObjectContext.GetObjectType(type.GetType()) != type.GetType();
}
```
