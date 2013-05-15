(function(){
    "use strict";
    window.docsApp = {};

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

    window.docsApp.Examples = Backbone.Collection.extend({
    });

    window.docsApp.SectionView = Backbone.View.extend({


    });

    window.docsApp.DocView = Backbone.View.extend({
        exampleTemplate: '<li><a class="example-link" title="<%= title %>" target="_blank" href="http://dandelion.eu/api/v1/<%=url%>"><%= prettyUrl %></a></li>',

        initialize: function(){
            _.bindAll(this, 'getElByTag');
            this.exampleContainer = '.example-alert';
            this.examples = this.$el.find(this.exampleContainer);
            this.allTags = $.map(this.examples, function(el){
                return $(el).data('example');
            });
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