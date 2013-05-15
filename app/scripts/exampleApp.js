(function(){
    "use strict";
    window.docsApp = {};

    window.docsApp.createPrettyUrl = function(url){
        var brakeChar = '&#8203;'
          , parsedUrl;
        parsedUrl = url.replace(/\//g, "/"+brakeChar);
        parsedUrl = parsedUrl.replace(/(\$\w+)/g, "<strong>\$1</strong>");
        return parsedUrl;
    };

    window.docsApp.Examples = Backbone.Collection.extend({
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
            prettyUrl: window.docsApp.createPrettyUrl(example.get('url')),
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