(function(){
    "use strict";
    var apiSectionClass = '.anchor'
      , exampleSelector = '.example-alert';

    //TODO add a link
    $(apiSectionClass).append('<span class="icon-link"></span>');
    $(exampleSelector).addClass('hidden');

    $.get('dataApi.yaml')
        .success(function(data){
            var parsedData = jsyaml.load(data)
              , parametersSection = '#auto-parameters';


        })
    $.get('examples.yaml')
        .success(function (data){
            var parsedData = jsyaml.load(data);
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