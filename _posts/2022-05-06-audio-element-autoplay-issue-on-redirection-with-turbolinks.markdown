---
layout:   post
title:    Audio element autoplay issue on redirection with turbolinks.
description: >
  Audio element autoplay issue on redirection with turbolinks. Fixing the autoplay issue with Stimulus JS
date:     2022-05-06 08:00:00 +0530
comments: true
tags:     [rails, stimulusjs, turbolinks]
image:
---

## Background of the issue

Recently, we were working on a feature where we wanted to autoplay the audio.

So like a normal developer we did the following:

```html
<audio autoplay data-audio-target="audioElement">
  <source src="https://www.xyz/...">
</audio>
```

Since this is a rails project and we have turbolinks on,
we came across an interesting issue.

Whenever we were navigating from the page with the audio element to any other page the audio from the previous page used to play.

We tried to search the same and came across few issue in the turbolinks repository.

- [turbolinks/turbolinks#157](https://github.com/turbolinks/turbolinks/issues/157){:target="_blank"}
- [turbolinks/turbolinks#177](https://github.com/turbolinks/turbolinks/issues/177){:target="_blank"}

We found few solutions but since we were using stimulus js we solved it with the following approach

<!--more-->

## The solution

We removed the `autoplay` from the `<audio>` element.

```html
<audio data-audio-target="audioElement">
  <source src="https://www.xyz/...">
</audio>
```

We added this on `connect()` in our stimulus controller. So whenever the controller is connected we play the audio.

```javascript
import { Controller } from "stimulus";

export default class extends Controller {
  //...

  connect() {
    this.audioElementTarget.play();
  }

  //...
}
```

This resolved our issue and gave us more control over the audio element.
