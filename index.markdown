---
layout: page
title: Blog
---

<div class="home">

  {% if site.drafts.size > 0 %}
  <h1 id="upcoming-posts" class="page-heading">Upcoming posts</h1>

  <ul class="post-list">
    {% for post in site.drafts %}
      <li class="no-style post-preview">
        {% include post_preview.html %}
      </li>
    {% endfor %}
  </ul>
  {% endif %}

  <h1 id="recent-posts" class="page-heading">Recent posts</h1>

  <ul class="post-list">
    {% for post in site.posts %}
      <li class="no-style post-preview">
        {% include post_preview.html %}
      </li>
    {% endfor %}
  </ul>
</div>
