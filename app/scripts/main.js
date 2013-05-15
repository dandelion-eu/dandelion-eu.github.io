(function(){
    "use strict";
    var apiSectionClass = '.api-section-title'
      , exampleSelector = '.example-alert';

    //TODO add a link
    $(apiSectionClass).append('<span class="icon-link"></span>');
    $(exampleSelector).addClass('hidden');

    console.debug('reading example done');
    $.get('examples.yaml')
        .success(function (data){
            var parsedData = window.doc = jsyaml.load(data);
            console.debug('data readed ',parsedData);
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