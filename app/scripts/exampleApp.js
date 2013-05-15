(function(){
    "use strict";
    window.docsApp = {};

    window.docsApp.Examples = Backbone.Collection.extend({
    });

    window.docsApp.DocView = Backbone.View.extend({
        exampleTemplate: '<li><a title="<%= title %>" target="_blank" href="http://dandelion.eu/api/v1/<%=url%>"><%= prettyUrl %></a></li>',

        initialize: function(){
            _.bindAll(this, 'getElByTag');
            this.exampleContainer = '.example-alert';
            this.examples = this.$el.find(this.exampleContainer);
            this.allTags = $.map(this.examples, function(el){
                return $(el).data('example');
            });
            console.log(this.allTags);

        },

        getElByTag: function(tag){
          return $(this.$el.find('[data-example='+tag+']'));
        },

        renderExample: function(example){
          var context = {
            url: encodeURI(example.get('url')),
            prettyUrl: example.get('url'),
            title: example.get('title', '')
          };
          return _.template(this.exampleTemplate, context);
        },

        render: function(){
            var that = this;
            _.each(this.allTags, function(tag){
                var example = that.collection.where({featured: tag})
                  , $tagEl;
                if (example.length > 0){
                    $tagEl = that.getElByTag(tag);
                    $tagEl.removeClass('hidden');
                    $tagEl.find('ul').append(that.renderExample(example[0]));
                }
            });
            return this;
        }
    })

})();