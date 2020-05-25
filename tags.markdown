---
layout: page
title: Tag
---
{% assign posts = site.posts | concat: site.drafts %}
{% assign tags =  posts | map: 'tags' | join: ','  | split: ','  | group_by: tag.name | sort: 'size' | reverse %}

<div class="tag-list">
  {% for tag in tags %}
    <a class="tag" href="#{{ tag.name | slugify }}"> {{ tag.name }}&nbsp;({{ tag.size }}) </a>
  {% endfor %}
</div>

<hr>

{% for tag in tags %}
  <h2 id="{{ tag.name | slugify }}">
  <i class="fa fa-tag" aria-hidden="true"></i>
  {{ tag.name | capitalize }}&nbsp;({{ tag.size }})
  </h2>
  <ul>
    {% for post in posts %}
      {% if post.tags contains tag.name %}
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
      {% endif %}
    {% endfor %}
  </ul>
{% endfor %}
