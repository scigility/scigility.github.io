# How to modify this website

## Steps

1. Clone this repo or pull
2. Change the content of the `.md` or `.yml` files
3. Commit and push. It's that simple.

## What is where?

`/pages` contains all the pages. Most of them pull content from *collections*.

### Generalities:

* One file per content per language.
* Make sure to read and understand the [frontmatter](https://jekyllrb.com/docs/frontmatter/) of every file you touch! You will have to chose the language, the permalink (beware of conflicts), the `ref` tying languages together, etc.

### Files and Directories

* `_data/contacts.yml` contains the contact info of the footer and is used by the "contact" page
* `_data/in_the_news.yml` contains the content of the "media" page
* `_data/members.yml` contains the members of the "team" page
* `_jobs/` contains the job openings.
* `_products/`: the different products
* `_projects/`: the different projects
* `_config.yml`: A bunch of configuration options, string translations, menu items, etc. Read it!
