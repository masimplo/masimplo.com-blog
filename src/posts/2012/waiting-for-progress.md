---
layout: post
title: Waiting for progress
author: [masimplo]
tags: [Code]
image: ../../images/headers/ben-white-292680-unsplash.jpg
date: 2012-11-22
draft: false
---

When an application has many time-consuming processes then a progressbar in the central form is necessary, so that there are not 200 progressbars left and right.
Okay, let's put the progressbar on the main form, but I'm 15 forms and 20 classes away and I'm doing a time-consuming calculation, what do I do?
I've seen people make the progressbar public, access it via static, and even pass it everywhere as a parameter. It can't be… There has to be a non-kangaroo way I thought. And then it came to me…

A class named StatusNotifier consisting of:

- an event delegate
```csharp
  public delegate void StatusChangedEventHandler(object sender, StatusEventArgs e);
```
- an event
```csharp
  public static event StatusChangedEventHandler StatusChanged;
```

and 1 method
```csharp
  if (StatusChanged == null) return; // Make sure there are methods to execute
  StatusChanged(sender, new StatusEventArgs(status, percentageDone)); // Raise the event
```

Anyone who wants to notify about the status of a time-consuming process simply needs to do
```csharp
  StatusNotifier.SetStatus(this, "Processing universal parameters of chaos...", 10);
```

On the other side, in the mainForm of the application which has the statusbar, it is enough to register the statusChanged event
```csharp
  StatusNotifier.StatusChanged += StatusNotifier_StatusChanged;
```

and write what we want to be done with the data that came to us through the event
```csharp
  void StatusNotifier_StatusChanged(object sender, StatusEventArgs e) {
    var percentageDone = e.PercentageDone;
    var statusText = e.status;

    if (percentageDone == -1) {
      progressBar.EditValue = 0;
      progressStatusLabel.Caption = string.Empty;
      progressBar.Visibility = BarItemVisibility.Never;
    } else {
      progressBar.Visibility = BarItemVisibility.Always;
      progressBar.EditValue = percentageDone;
      progressBar.Refresh();
    }
    progressStatusLabel.Caption = statusText;
    progressStatusLabel.Refresh();
  }

```
