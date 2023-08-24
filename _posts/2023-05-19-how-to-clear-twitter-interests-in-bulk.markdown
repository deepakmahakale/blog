---
layout:   post
title:    How to clear Twitter interests in bulk.
description: >
  Twitter timeline messed up? In this blog we discuss how to clear Twitter interests in bulk (with the help of JS).
date:     2023-05-19 16:00:00 +0530
comments: true
tags:     [twitter, javascript]
image:    autogenerate
---

Are you getting random tweets on your timeline?

Or you clicked on a tweet and now you're getting tweets related to the same topic and can't get rid of it.

Let's see how to get rid of the interests:

<!--more-->

### Solution 1 (Manual)

- Go To:
  `More` > `Settings and Support` > `Settings and Privacy` > `Privacy and Safety` > `Content You See` > `Interests`

  OR

  Visit the <a href="https://twitter.com/settings/your_twitter_data/twitter_interests">Twitter Interests</a> page here.

  ![twitter_interests_page]({{site.baseurl}}/assets/images/posts/twitter_interests_page.png){: loading="lazy" }

- Check / Uncheck the Interests you like.

### Solution 2 (Programmatic)

For this we will need to create a bookmark in chrome

`Bookmarks` > `Bookmarks Manager` > Click the <strong>`⋮`</strong> on the top right corner > `Add new bookmark`

Enter the following details:

- Name: Clear Twitter Interests
- URL:

```javascript
javascript:(function(){ let interests = document.querySelectorAll("input:checked"); [...interests].slice(0, 50).forEach((widget) => { widget.click() }) })();
```

and hit "Save"

![create_bookmark]({{site.baseurl}}/assets/images/posts/create_bookmark.png){: loading="lazy" }

Now remember this will only uncheck 50 interests at a time.
The reason behind this is twitter show this warning

![twitter_over_capacity_error]({{site.baseurl}}/assets/images/posts/twitter_over_capacity_error.png){: loading="lazy" }

but feel free to change the number and see if it works for you.
