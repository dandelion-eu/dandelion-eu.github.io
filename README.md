# dandelion-eu.github.io

## DEV

Checkout this repo

* git checkout develop
* npm install
* bower install
* gem install zurb-foundation (you need [compass](http://compass-style.org/))
* npm install -g grunt-cli
* grunt server

Happy hacking on http://localhost:9000 ;)

## DEPLOY

* grunt build
* # commit all changes in the dist directory
* git push
* git subtree push --prefix dist origin master

For more doc to deploy on github-pages look at this [guide](https://github.com/yeoman/yeoman/wiki/Deployment)

## Notes

* [Foundation generator](http://pburke.de/yeoman-foundation-sass-luv)
