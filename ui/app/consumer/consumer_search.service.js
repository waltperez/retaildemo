(function () {
    var app = angular.module('ml.retail');

    app.factory('consumerSearchService', ConsumerSearchService);

    ConsumerSearchService.$inject = ['MLSearchFactory'];
    function ConsumerSearchService(MLSearchFactory) {

      var service = {};

      // this will probably end up searching just products
      service.mlSearch = MLSearchFactory.newContext({ pageLength: 12 });

      service.fromParams = function() {
        service.mlSearch.fromParams().then(service.parseResults);
      }

      service.parseResults = function(data) {
        service.isSearching = false;
        service.results = data;
        service.qtext = service.mlSearch.getText();
        service.page = service.mlSearch.getPage();
      }

      service.searchText = function(t) {
        service.startSearch();
        service.mlSearch.setText(t).setPage(1);
        service.runSearch();
      }

      service.searchPage = function(n) {
        service.mlSearch.setPage(n);
        service.runSearch();
      }

      service.runSearch = function() {
        service.mlSearch.search().then(service.parseResults);
      }

      service.startSearch = function() { service.isSearching = true; }


      return service;

    }
})();
