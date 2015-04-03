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
        service.mlSearch.setText('').setPage(1).clearAdditionalQueries();
      }

      service.startSearch = function() { service.isSearching = true; }

      service.searchTags = [];
      function buildSearchTags() {
        service.mlSearch.clearAdditionalQueries();
        for (var i=0; i < service.searchTags.length; i++) {
          var tag = service.searchTags[i];
          service.mlSearch.addAdditionalQuery({
            'container-query': {
              'element': {
                'name': 'detail'
              },
              'and-query': {
                'queries': [{
                  'word-query': {
                    'element': {
                      'name': 'name'
                    },
                    'text': tag.name
                  }},{
                  'word-query': {
                    'element': {
                      'name': 'value'
                    },
                    'text': tag.value
                  }
                }]
              }
            }
          });
        }
      }


      service.searchTag = function(name,value,append) {
        if (!append) {
          service.searchTags = [];
        }
        service.searchTags.push({ name: name, value: value });
        buildSearchTags();
        service.runSearch();
      }
      service.removeSearchTag = function(index) {
        service.searchTags.splice(index,1);
        buildSearchTags();
        service.runSearch();
      }


      return service;

    }
})();
