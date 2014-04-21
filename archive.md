---
layout: page
title: Archive
---

{% capture current-year %}{{ site.time | date: '%Y' }}{% endcapture %}

{% assign post_list = site.posts %}

{% for node in post_list %}

{% if prev-year == null or prev-year != node.year %}
{% if prev-year != null and prev-year != node.year %}
------
{% endif %}
## **{{ node.year }}**
{% assign prev-month = null %}
{% endif %}
{% assign prev-year = node.year %}

{% if prev-month == null or prev-month != node.month %}
### {{ node.month }}
{% endif %}
{% assign prev-month = node.month %}
* [{{ node.title }}]({{ node.url }})
{% endfor %}