(function(){

    var Datagem = function(datagem, api){
        this.fieldTemplate = _.template('<tr><td><%= field %></td><td><%= type %></td><td><%= doc %></td><td></td><td><%= example %></td></tr>');
        this.subfieldTemplate = _.template(
          '<tr><td>↳ <%= field %></td><td><%= type %></td><td><%= doc %></td><td><a href="<%= links_to.uri %>"><%= links_to.label %></a></td><td><%= example %></td></tr>'
        );
        this.datagem = datagem;
        this.api = api;

        return this;
    };

    Datagem.prototype.schemaCallback = function(data) {
        var that = this
          , $table = $('#tbody-datagem')
          , yamlFile = this.datagem + 'Docs.yaml';

        $.get(yamlFile).success(function (yamlData) {
            var parsedData = jsyaml.load(yamlData) || {};
            _.chain(Object.keys(data))
                .sortBy(function(key){
                  var idx = _.indexOf(Object.keys(parsedData), key);
                  return (idx != -1) ? idx : 9999;
                }).each(function(key) {
                    var val = data[key];
                    $table.append(that.fieldTemplate({
                        field: key,
                        type: _.isObject(val) ? 'Composite' : val,
                        doc: key in parsedData ? parsedData[key]['description'] : '',
                        example: key in parsedData ? parsedData[key]['example'] : ''
                    }));

                    if (_.isObject(val)) {
                        var subfields = (key in parsedData && 'subfields' in parsedData[key]) ? parsedData[key].subfields : {};
                        _.chain(Object.keys(val)).sortBy(function(sub_key){
                            var idx = _.indexOf(Object.keys(subfields), sub_key);
                            return (idx != -1) ? idx : 9999;
                        }).each(function(sub_key){
                            var sub_val = val[sub_key];
                            $table.append(that.subfieldTemplate({
                                field: key + "." + sub_key,
                                type: sub_val,
                                doc: sub_key in subfields ? subfields[sub_key]['description'] : '',
                                links_to: sub_key in subfields && subfields[sub_key]['links_to'] ? subfields[sub_key]['links_to'] : '',
                                example: sub_key in subfields ? subfields[sub_key]['example'] : ''
                            }));
                        });
                    }
                  });
        });
    };

    Datagem.prototype.loadSchema = function() {
        var that = this
          , apiUrl = 'http://localhost:8000/api/v1/datagem/' + this.datagem + '/' + this.api + '.json';

        $.ajax({
            url: apiUrl,
            dataType: 'jsonp'
        }).success(function(data) {
            that.schemaCallback(data);
        });
    };

    window.docsApp.Datagem = Datagem;

})();
