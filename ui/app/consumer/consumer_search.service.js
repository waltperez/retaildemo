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
        service.qtext = service.mlSearch.getText();
        service.page = service.mlSearch.getPage();
        service.results = data;
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

      service.clearSearch = function() {

      }

      service.startSearch = function() { service.isSearching = true; }

      service.searchTag = function(name,value,append) {
        if (!append) {
          service.tags = [];
        }
        service.tags.push({ name: name, value: value });
        service.mlSearch.clearAdditionalQueries();

        service.runSearch();
      }


      return service;

    }
})();
