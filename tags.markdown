---
layout: page
title: Tag
---

{% assign rawtags = "" %}
{% for post in site.posts %}
  {% assign ttags = post.tags | join:'|' | append:'|' %}
  {% assign rawtags = rawtags | append:ttags %}
{% endfor %}
{% assign rawtags = rawtags | split:'|' | sort %}

{% assign tags = "" %}
{% for tag in rawtags %}
  {% if tag != "" %}
    {% if tags == "" %}
      {% assign tags = tag | split:'|' %}
    {% endif %}
    {% unless tags contains tag %}
      {% assign tags = tags | join:'|' | append:'|' | append:tag | split:'|' %}
    {% endunless %}
  {% endif %}
{% endfor %}

<div class="tag-list">
{% for tag in tags %}
  <a class="tag" href="#{{ tag | slugify }}"> {{ tag }} </a>
{% endfor %}
</div>
<hr>

{% for tag in tags %}
  <h2 id="{{ tag | slugify }}">{{ tag | capitalize }}</h2>
  <ul>
   {% for post in site.posts %}
     {% if post.tags contains tag %}
     <li>
     <h5>
     <a href="{{ post.url | prepend: site.baseurl }}">
     {{ post.title }}
     </a>
     <small>{{ post.date | date_to_string }}</small>
     <!-- {% for tag in post.tags %}
       <a class="tag" href="/blog/tag/#{{ tag | slugify }}">{{ tag }}</a>
     {% endfor %} -->
     </h5>
     </li>
     {% endif %}
   {% endfor %}
  </ul>
{% endfor %}
