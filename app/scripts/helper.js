(function () {
  "use strict";

  window.docsApp = {};

  window.docsApp.createPrettyUrl = function (url, tags) {
    var brakeChar = '&#8203;'
      , parsedUrl;

    parsedUrl = url.replace(/\//g, "/" + brakeChar);
    _.each(tags, function (tag) {
      parsedUrl = parsedUrl.replace(tag, "<strong>" + tag + "</strong>", 'g');
    });
    return parsedUrl;
  };
})();