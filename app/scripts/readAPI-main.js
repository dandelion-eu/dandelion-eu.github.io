(function () {
  "use strict";

  var promise = $.Deferred();

  $(document).on('click', 'a', function (event) {
    var locationHost = window.location.host
      , locationDomain = locationHost.substr(locationHost.indexOf("."))
      , a = new RegExp('(' + locationDomain + '/|javascript:|mailto:)');

    if ((this.href !== '') && (!a.test(this.href))) {
      event.preventDefault();
      event.stopPropagation();
      window.open(this.href, '_blank');
    }
  });

  var documentation = $.get('dataApi.yaml').pipe(function (data) {
    var parsedData = jsyaml.load(data)
      , largeTitle = {
        'parameters': false,
        'fieldFunctions': false,
        'filterFunctions': true
      };

    window.docsApp.section = {};
    window.docsApp.sectionData = {};
    window.docsApp.totalSection = Object.keys(parsedData).length;

    _.each(parsedData, function (section, sectionName) {
      window.docsApp.sectionData[sectionName] = new Backbone.Collection();
      window.docsApp.section[sectionName] = new window.docsApp.SectionView(
        {
          el: $('#auto-' + sectionName),
          collection: window.docsApp.sectionData[sectionName].add(section),
          sectionName: sectionName,
          largeTitle: largeTitle[sectionName]
        }
      );
      window.docsApp.section[sectionName].render();
    });

    return {};

  }, function () {});

  var example = $.get('examples.yaml');

  $.when(example, documentation).done(function (data) {
    window.docsApp.examples = new Backbone.Collection();
    window.docsApp.examples.add(jsyaml.load(data[0]));
    window.docsApp.docView = new window.docsApp.DocView(
      {
        el: $('#doc-section'),
        collection: window.docsApp.examples
      });
    window.docsApp.docView.render();
  });

  (function () {
    var uv = document.createElement('script');
    uv.type = 'text/javascript';
    uv.async = true;
    uv.src = '//widget.uservoice.com/NnWIU9R68OpZsf3hvDbjAg.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(uv, s)
  })();

  var UserVoice = window.UserVoice || [];
  UserVoice.push(['showTab', 'classic_widget', {
    mode: 'feedback',
    primary_color: '#252525',
    link_color: '#aecf42',
    forum_id: 197822,
    tab_label: 'Feedback',
    tab_color: '#252525',
    tab_position: 'middle-left',
    tab_inverted: false
  }]);
})();