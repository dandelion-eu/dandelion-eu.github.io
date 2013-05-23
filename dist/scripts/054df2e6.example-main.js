(function(){"use strict";window.docsApp={},window.docsApp.createPrettyUrl=function(t,e){var n,i="&#8203;";return n=t.replace(/\//g,"/"+i),_.each(e,function(t){n=n.replace(t,"<strong>"+t+"</strong>","g")}),n}})(),function(){"use strict";window.docsApp.ExampleView=Backbone.View.extend({el:$("#examples-wrapper"),exampleTemplate:'<div class="panel white"><h4><%= title %></h4><p><%= description %></p><a class="example-link example-url" href="<%= url %>"><%= url_name %></a><p class="small text-right"><i class="icon-tags"></i> <%= tags.join(", ") %></p><div>',initialize:function(){this.filters={},_.bindAll(this,"render")},events:{update:"update"},render:function(){var t=this,e=_.filter(this.collection.models,function(e){var n=[];return _.each(t.filters,function(t,e){t&&n.push(e)}),0===n.length&&(n=_.map(t.filters,function(t,e){return e})),_.intersection(e.get("tags"),n).length>0});return t.$el.empty(),_.each(e,function(e){var n=e.get("tags"),i={url_name:window.docsApp.createPrettyUrl(e.get("url"),n)};t.$el.append(_.template(t.exampleTemplate,$.extend(e.toJSON(),i)))}),this},update:function(t){this.filters=t,this.render()}}),window.docsApp.FilterView=Backbone.View.extend({el:$("#filter-wrapper"),exampleTemplate:'<label for="<%= name %>"><input type="checkbox" id="<%= name %>" style="display: none;"><span class="custom checkbox"></span> <%= name %></label>',initialize:function(){var t=this;this.filters={},_.bindAll(this,"render"),_.each(this.collection.models,function(e){_.each(e.get("tags"),function(e){t.filters[e]=!1})}),this.render()},events:{"change input":"change"},change:function(t){var e=t.target.id;this.filters[e]=!this.filters[e],window.docsApp.docView.update(this.filters)},render:function(){var t=this;return _.each(this.filters,function(e,n){t.$el.append(_.template(t.exampleTemplate,{name:n}))}),window.docsApp.docView.update(this.filters),this}}),$.get("examples.yaml").success(function(t){var e=jsyaml.load(t);window.docsApp.examples=new Backbone.Collection,window.docsApp.examples.add(e),window.docsApp.docView=new window.docsApp.ExampleView({collection:window.docsApp.examples}),new window.docsApp.FilterView({collection:window.docsApp.examples})})}();