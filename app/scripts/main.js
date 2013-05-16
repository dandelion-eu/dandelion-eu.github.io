(function(){
    "use strict";


    $.get('dataApi.yaml')
        .success(function(data){
            var parsedData = jsyaml.load(data)
              , largeTitle = {
                    'parameters': false,
                    'fieldFunctions': false,
                    'filterFunctions': true
                };

            window.docsApp.section = {};
            window.docsApp.sectionData = {};
            window.docsApp.totalSection = Object.keys(parsedData).length;

            _.each(parsedData, function(section, sectionName){
                window.docsApp.sectionData[sectionName] = new Backbone.Collection();
                window.docsApp.section[sectionName] = new window.docsApp.SectionView(
                    {
                        el: $('#auto-'+sectionName),
                        collection: window.docsApp.sectionData[sectionName].add(section),
                        sectionName: sectionName,
                        largeTitle: largeTitle[sectionName]
                    }
                );
                window.docsApp.section[sectionName].render();
            })

        });

    $.get('examples.yaml')
        .success(function (data){
            var parsedData = jsyaml.load(data);
            window.docsApp.examples = new Backbone.Collection();
            window.docsApp.examples.add(parsedData);

            window.docsApp.docView = new window.docsApp.DocView(
                {
                    el: $('#doc-section'),
                    collection: window.docsApp.examples
                });
            window.docsApp.docView.render();
        });
})();