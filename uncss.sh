#!/bin/zsh
cat assets/css/main.css.bak > assets/css/main.css
wc -l assets/css/main.css
read -q "READY?(y/n)"
if [[ $READY =~ '^[^y]' ]]; then
    return 13;
fi
uncss \
-m 'print' \
--stylesheets=http://localhost:4000/assets/css/main.css \
-t 10000 \
http://localhost:4000/ \
http://localhost:4000/de/architektur-konzeption/ \
http://localhost:4000/de/impressum/ \
http://localhost:4000/de/kontakt/ \
http://localhost:4000/de/offene-stellen/ \
http://localhost:4000/de/partners/ \
http://localhost:4000/de/projects/project-name \
http://localhost:4000/de/projects/project-name2 \
http://localhost:4000/de/projekte/ \
http://localhost:4000/en/ \
http://localhost:4000/en/architecture-conception/ \
http://localhost:4000/en/contact/ \
http://localhost:4000/en/projects/project-name \
http://localhost:4000/feed-de.xml \
http://localhost:4000/feed-en.xml \
http://localhost:4000/feed-fr.xml \
http://localhost:4000/fr/ \
http://localhost:4000/fr/architecture-conception/ \
http://localhost:4000/fr/contact/ \
http://localhost:4000/fr/projects/project-name \
http://localhost:4000/sitemaps.xml \
http://localhost:4000/team/ \
> /tmp/clean.css && \
cat /tmp/clean.css > assets/css/main.css && \
rm /tmp/clean.css
wc -l assets/css/main.css
