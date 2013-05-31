(function(){

    var Datagem = function(datagem, api){
        this.fieldTemplate = _.template('<tr><td><%= field %></td><td><%= type %></td><td><%= doc %></td></td></tr>');
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
            _.each(data, function(val, key){
                $table.append(that.fieldTemplate({
                    field: key,
                    type: _.isObject(val) ? 'Composite' : val,
                    doc: key in parsedData ? parsedData[key] : ''
                }));
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