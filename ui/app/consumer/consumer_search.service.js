(function () {
    var app = angular.module('ml.retail');

    app.factory('consumerSearchService', ConsumerSearchService);

    ConsumerSearchService.$inject = ['MLSearchFactory'];
    function ConsumerSearchService(MLSearchFactory) {

      var service = {};

      // this will probably end up searching just products
      service.mlSearch = MLSearchFactory.newContext({});

      service.fromParams = function() {
        service.mlSearch.fromParams().then(service.parseResults);
      }

      service.parseResults = function(data) {
        service.results = data;
        service.qtext = service.mlSearch.getText();
        service.page = service.mlSearch.getPage();
      }

      return service;

    }
})();
