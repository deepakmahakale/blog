---
layout: page
title: Blog
---

<div class="home">

  <h1 class="page-heading">Upcoming posts</h1>

  <ul class="post-list">
    {% for post in site.drafts %}
      <li>
        {% include post_preview.html %}
      </li>
    {% endfor %}
  </ul>

  <h1 class="page-heading">Recent posts</h1>

  <ul class="post-list">
    {% for post in site.posts %}
      <li>
        {% include post_preview.html %}
      </li>
    {% endfor %}
  </ul>
</div>
