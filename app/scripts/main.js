(function(){
    "use strict";
    var apiSectionClass = '.anchor'
      , exampleSelector = '.example-alert';

    //TODO add a link
    $(apiSectionClass).append('<span class="icon-link"></span>');
    $(exampleSelector).addClass('hidden');

    $.get('examples.yaml')
        .success(function (data){
            var parsedData = window.doc = jsyaml.load(data);
            window.docsApp.examples = new window.docsApp.Examples();
            window.docsApp.examples.add(parsedData);

            window.docsApp.docView = new window.docsApp.DocView(
                {
                    el: $('#doc-section'),
                    collection: window.docsApp.examples
                });
            window.docsApp.docView.render();
        });
})();