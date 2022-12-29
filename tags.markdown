---
layout: page
title: Tag
---

{% assign posts = site.posts | concat: site.drafts %}
{% assign tags =  posts | map: 'tags' | uniq | sort %}

<div class="tag-list">
  {% for tag in tags %}
    <a class="tag" href="#{{ tag | slugify }}"> {{ tag }} ({{ site.tags[tag].size }}) </a>
  {% endfor %}
</div>

<hr>

{% for tag in tags %}

  <h2 id="{{ tag | slugify }}">
  <i class="fa fa-tag" aria-hidden="true"></i>
  {{ tag | capitalize }} ({{ site.tags[tag].size }})
  </h2>
  <ul>
    {% assign tag_posts = posts | where: 'tags', tag %}
    {% for post in tag_posts %}
      <li>
        <small>{{ post.date | date_to_string }}</small>
        <small>
        {% for post_tag in post.tags %}
          <a class="tag" href="{{ site.baseurl }}{{ site.tag_page }}#{{ post_tag | slugify }}">{{ post_tag }}</a>
        {% endfor %}
        </small>
        {% if post.draft %}
          <h5>Upcoming: {{ post.title }}</h5>
        {% else %}
          <a href="{{ post.url | prepend: site.baseurl }}">
            <h5>{{ post.title }}</h5>
          </a>
        {% endif %}
      </li>
    {% endfor %}
  </ul>
{% endfor %}
