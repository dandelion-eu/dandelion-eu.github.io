(function () {
  "use strict";

  window.docsApp.ExampleView = Backbone.View.extend({
    exampleTemplate: '<div class="panel white">' +
      '<h4><%= title %></h4>' +
      '<p><%= description %></p>' +
      '<a class="example-link example-url" href="<%= url %>"><%= url_name %></a>' +
      '<p class="small text-right"><i class="icon-tags"></i> <%= tags.join(", ") %></p>' +
      '<div>',
    initialize: function () {
      _.bindAll(this, 'render');
    },

    render: function () {
      var that = this;
      _.each(this.collection.models, function (el) {
        var data = {'url_name': window.docsApp.createPrettyUrl(el.get('url'), el.get('tags'))};

        that.$el.append(
           _.template(that.exampleTemplate, $.extend(el.toJSON(), data))
        );
      });
      return this;
    }
  });

  $.get('examples.yaml')
    .success(function (data) {
      var parsedData = jsyaml.load(data);
      window.docsApp.examples = new Backbone.Collection();
      window.docsApp.examples.add(parsedData);

      window.docsApp.docView = new window.docsApp.ExampleView(
        {
          el: $('#examples-wrapper'),
          collection: window.docsApp.examples
        });
      window.docsApp.docView.render();
    });
})();