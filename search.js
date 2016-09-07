---
layout: null
permalink: /assets/js/search.js
---
window.store = {
  {% for item in site.projects %}
    "{{ item.url | slugify }}": {
      "title": {{ item.title | xml_escape | jsonify }},
      "description": {{ item.description | xml_escape | jsonify }},
      "content1": {{ item.content | join: ' ' | strip_html | strip_newlines | jsonify }},
      "content2": {{ item.left.paragraphs | join: ' ' | strip_html | strip_newlines | jsonify }},
      "content3": {{ item.right.paragraphs | join: ' ' | strip_html | strip_newlines | jsonify }},
      "url": {{ item.url | xml_escape | jsonify }},
      "lang": {{ item.lang | jsonify }},
    },
  {% endfor %}
  {% for item in site.products %}
    "{{ item.url | slugify }}": {
      "title": {{ item.title | xml_escape | jsonify }},
      "description": {{ item.description | xml_escape | jsonify }},
      "content1": {{ item.content | join: ' ' | strip_html | strip_newlines | jsonify }},
      "content2": {{ item.paragraphs | join: ' ' | strip_html | strip_newlines | jsonify }},
      "content3": {{ item.bullet_points | join: ' ' | strip_html | strip_newlines | jsonify }},
      "url": {{ item.url | xml_escape | jsonify }},
      "lang": {{ item.lang | jsonify }},
    },
  {% endfor %}
  {% for item in site.jobs %}
    "{{ item.url | slugify }}": {
      "title": {{ item.title | xml_escape | jsonify }},
      "description": {{ item.description | xml_escape | jsonify }},
      "content1": {{ item.content | join: ' ' | strip_html | strip_newlines | jsonify }},
      "content2": "",
      "content3": "",
      "url": {{ item.url | xml_escape | jsonify }},
      "lang": {{ item.lang | jsonify }},
    },
  {% endfor %}
  {% for item in site.pages %}
    {% case item.layout %}
      {% when null %}
      {% when 'partners' %}
        {% for section in item.sections %}
          "{{ item.url | append: forloop.index0 | slugify }}": {
            "title": {{ section.title | xml_escape | jsonify }},
            "description": "",
            "content1": {{ section.description | strip_html | strip_newlines | jsonify }},
            "content2": "",
            "content3": "",
            "url": {{ item.url | xml_escape | jsonify }},
            "lang": {{ item.lang | jsonify }},
          },
        {% endfor %}
      {% when 'team' %}
        {% for member in site.data.members %}
          "{{ item.url | append: forloop.index0 | slugify }}": {
            "title": {{ item.title | xml_escape | jsonify }},
            "description": "",
            "content1": {{ member.name | strip_html | strip_newlines | jsonify }},
            "content2": {{ member.position | strip_html | strip_newlines | jsonify }},
            "content3": {{ item.content | strip_html | strip_newlines | jsonify }},
            "url": {{ item.url | xml_escape | jsonify }},
            "lang": {{ item.lang | jsonify }},
          },
        {% endfor %}
      {% when 'contact' %}
      {% else %}
        {% if item.ref != 'index' %}
          "{{ item.url | append: forloop.index0 | slugify }}": {
            "title": {{ item.title | xml_escape | jsonify }},
            "description": {{ item.description | strip_html | strip_newlines | jsonify }},
            "content1": {{ item.content | strip_html | strip_newlines | jsonify }},
            "content2": "",
            "content3": "",
            "url": {{ item.url | xml_escape | jsonify }},
            "lang": {{ item.lang | jsonify }},
          },
        {% endif %}
    {% endcase %}
  {% endfor %}
};

function displaySearchResults(results, store) {
  var searchResults = document.getElementById('searchResults');

  if (results.length) {
    var appendString = '';
    var displayed = [];
    for (var i = 0; i < results.length && displayed.length <= 12; i++) {
      var item = store[results[i].ref];
      if (displayed.indexOf(item.url) === -1) {
        appendString += '<li><span class="search-result-lang">' + item.lang + '</span> <a href="' + item.url + '">' + item.title + '</a></li>';
        displayed.push(item.url);
      }
    }

    searchResults.innerHTML = appendString;
  } else {
    searchResults.innerHTML = '<li>No results found</li>';
  }
}

function onSearchType() {
  var searchTerm = $(this).val().trim();
  if (searchTerm) {
    var idx = lunr(function () {
      this.field('id');
      this.field('id');
      this.field('title', { boost: 10 });
      this.field('description', { boost: 5 });
      this.field('content1');
      this.field('content2');
      this.field('content3');
      this.field('lang');
      this.field('url');
    });

    for (var key in window.store) {
      idx.add({
        'id': key,
        'title': window.store[key].title,
        'description': window.store[key].description,
        'content1': window.store[key].content1,
        'content2': window.store[key].content2,
        'content3': window.store[key].content3,
        'lang': window.store[key].lang,
        'url': window.store[key].url,
      });

      var results = idx.search(searchTerm);
      displaySearchResults(results, window.store);
    }
  }
}


$('#search').keyup(event, onSearchType);
$('#searchForm').submit(function () {
  return false
});
$('#searchForm').mouseout(function () {
  $('#searchResults').html('');
  $('#search').val('');
});
