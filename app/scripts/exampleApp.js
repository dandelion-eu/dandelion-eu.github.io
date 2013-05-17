(function(){
    "use strict";
    window.docsApp = {};

    window.docsApp.fixAnchors = function(){
        var apiSectionClass = '.anchor'
          , exampleSelector = '.example-alert';
        $(apiSectionClass).append('<span class="icon-link"></span>');
        $(exampleSelector).addClass('hidden');
    };

    window.docsApp.checkLocationFragment = function(){
        if ('hash' in window.location) {
            var elementName = window.location.hash.replace('#', '')
              , elementToScroll = document.querySelector('[name=' + elementName + ']');
            elementToScroll.scrollIntoView();
        }
    };

    window.docsApp.totalSection = 0;
    window.docsApp.sectionRender = $.Deferred()
        .done(function(){
            window.docsApp.fixAnchors();
        });

    window.docsApp.createPrettyUrl = function(url, tags){
        var brakeChar = '&#8203;'
          , paramsRegEx = /(\$\w+)/g
          , parsedUrl;
        parsedUrl = url.replace(/\//g, "/"+brakeChar);
        _.each(tags, function(tag){
            parsedUrl = parsedUrl.replace(tag, "<strong>" + tag + "</strong>", 'g');
        });
        return parsedUrl;
    };

    window.docsApp.SectionView = Backbone.View.extend({
        template: _.template($('#api-section-template').html()),
        initialize: function(data){
            var that = this;
            _.bindAll(this, 'render', 'afterRender');
            this.sectionName = data.sectionName;
            this.largeTitle = data.largeTitle;
            this.render = _.wrap(this.render, function(render) {
                render();
                that.afterRender();
                return that;
            });
        },
        afterRender: function(){
            window.docsApp.totalSection -= 1;
            if (window.docsApp.totalSection <= 0)
                window.docsApp.sectionRender.resolve();
        },
        render: function(){
            var that = this;
            _.each(this.collection.models, function(model){
                var cleanSectionRegEx = /[\$_]/g
                  , cleanTagRegEx = /\$/g
                  , context = {
                    'section': model.get('name'),
                    'fatherSection': that.sectionName,
                    'cleanSection': model.get('name').replace(cleanSectionRegEx, ''),
                    'grammar': model.get('grammar'),
                    'description': model.get('description'),
                    'sectionTag': model.get('name').replace(cleanTagRegEx, ''),
                    'largeTitle': that.largeTitle
                };
                that.$el.append(that.template(context));
            });
            return this;
        }

    });

    window.docsApp.DocView = Backbone.View.extend({
        exampleTemplate: '<li><a class="example-link" title="<%= title %>" target="_blank" href="http://dandelion.eu/api/v1/<%=url%>"><%= prettyUrl %></a></li>',

        initialize: function(){
            var that = this;

            _.bindAll(this, 'getElByTag', 'render', 'afterRender');

            this.exampleContainer = '.example-alert';
            this.examples = this.$el.find(this.exampleContainer);
            this.allTags = $.map(this.examples, function(el){
                return $(el).data('example');
            });

            this.render = _.wrap(this.render, function(render) {
                render();
                that.afterRender();
                return that;
            });
        },

        afterRender: function(){
            window.docsApp.checkLocationFragment();
        },

        getElByTag: function(tag){
          return $(this.$el.find('[data-example='+tag+']'));
        },

        renderExample: function(example){
          var context = {
            url: encodeURI(example.get('url')),
            prettyUrl: window.docsApp.createPrettyUrl(example.get('url'), example.get('tags')),
            title: example.get('title', '')
          };
          return _.template(this.exampleTemplate, context);
        },

        render: function(){
            var that = this;
            _.each(this.allTags, function(tag){
                var example = that.collection.where({featured: tag})
                  , $tagEl
                  , $tagList;
                if (example.length > 0){
                    $tagEl = that.getElByTag(tag);
                    $tagEl.removeClass('hidden');
                    $tagList = $tagEl.find('ul')
                    for (var i=example.length; i--;)
                        $tagList.append(that.renderExample(example[i]));
                }
            });
            return this;
        }
    })

})();