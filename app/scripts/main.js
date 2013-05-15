(function(){
    "use strict";
    var apiSectionClass = '.api-section-title';

    $(apiSectionClass).append('<span class="icon-link"></span>')

    $.get('examples.yaml')
        .success(function (data){
            console.log('reading example done');
            window.doc = jsyaml.load(data);
        });
    
})();