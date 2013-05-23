(function () {
  "use strict";

  window.docsApp.ExampleView = Backbone.View.extend({
    el: $('#examples-wrapper'),
    exampleTemplate: '<div class="panel white">' +
      '<h4><%= title %></h4>' +
      '<p><%= description %></p>' +
      '<a class="example-link example-url" target="_blank" href="http://dandelion.eu/api/v1/<%= url %>"><%= url_name %></a>' +
      '<p class="small text-right"><i class="icon-tags"></i> ' +
      '<% for(i in tags) { %>' +
      '<% if(i != 0) { %>, <% } %><span class="filter-tag" data-tag="<%= tags[i] %>"><%= tags[i] %></span>' +
      '<% } %>' +
      '</p>' +
      '<div>',

    initialize: function () {
      this.filters = {};
      _.bindAll(this, 'render');
    },

    events: {
      'update': 'update',
      'click .filter-tag': 'updateFilter'
    },

    updateFilter: function (e) {
      window.docsApp.filterView.select($(e.target).data('tag'));
    },

    render: function () {
      var that = this
        , collection = _.filter(this.collection.models, function (el) {
          var filter = [];

          _.each(that.filters, function (v, k) {
            if (v)
              filter.push(k);
          });

          if (filter.length === 0)
            filter = _.map(that.filters, function (v, k) {
              return k;
            });

          return _.intersection(el.get('tags'), filter).length > 0;
        });

      that.$el.empty();

      _.each(collection, function (el) {
        var tags = el.get('tags')
          , data = {'url_name': window.docsApp.createPrettyUrl(el.get('url'), tags),
                    'url': encodeURI(el.get('url'))};

        that.$el.append(
          _.template(that.exampleTemplate, $.extend(el.toJSON(), data))
        );
      });
      return this;
    },

    update: function (filters) {
      this.filters = filters;
      this.render();
    }
  });

  window.docsApp.FilterView = Backbone.View.extend({
    el: $('#filter-wrapper'),
    exampleTemplate: '<label for="<%= name %>"><input type="checkbox" id="<%= name %>" style="margin-bottom: 0.5em;"><span class="custom checkbox"></span> <%= name %></label>',
    initialize: function () {
      var that = this;

      this.filters = {};

      _.bindAll(this, 'render');

      _.each(this.collection.models, function (el) {
        _.each(el.get('tags'), function (tag) {
          that.filters[tag] = false;
        });
      });

      this.render();
    },

    events: {
      'change input': 'change',
      'select': 'select'
    },

    select: function (tag) {
      $('#' + tag).parent().click();
    },

    change: function (e) {
      var target = e.target.id;
      this.filters[target] = !this.filters[target];
      window.docsApp.docView.update(this.filters);
    },

    render: function () {
      var that = this;
      _.each(this.filters, function (v, el) {
        that.$el.append(
          _.template(that.exampleTemplate, {'name': el})
        );
      });
      window.docsApp.docView.update(this.filters);
      return this;
    }
  });

  $.get('examples.yaml').success(function (data) {
    var parsedData = jsyaml.load(data);
    window.docsApp.examples = new Backbone.Collection();
    window.docsApp.examples.add(parsedData);

    window.docsApp.docView = new window.docsApp.ExampleView({
      collection: window.docsApp.examples
    });

    window.docsApp.filterView = new window.docsApp.FilterView({
      collection: window.docsApp.examples
    });

  });
})();