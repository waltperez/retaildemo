(function () {

    var app = angular.module('ml.retail')
    app.controller('consumerHomeCtrl', ConsumerHomeCtrl);

    ConsumerHomeCtrl.$injector = ['consumerSearchService', '$scope'];
    function ConsumerHomeCtrl(consumerSearchService, $scope) {
        var ctrl = this;
        ctrl.mlSearch = consumerSearchService.mlSearch;
        ctrl.searchService = consumerSearchService;
        ctrl.page = ctrl.mlSearch.getPage();

        ctrl.removeSearchTag = function(index) {
          consumerSearchService.removeSearchTag(index);
        }


        $scope.$watch(function() { return consumerSearchService.isSearching; }, function(newVal,oldVal) {
          ctrl.isSearching = newVal;
        });

        $scope.$watch(function() { return consumerSearchService.results; }, function(newVal, oldVal) {
          ctrl.qtext = consumerSearchService.qtext;
          ctrl.page = ctrl.mlSearch.getPage();
          ctrl.results = consumerSearchService.results;
        });

        ctrl.search = function() {

            console.log('searching page %s', ctrl.page);
            ctrl.mlSearch
              .setPage(ctrl.page);

            consumerSearchService.runSearch();
        }


      ctrl.toggleFacet = function(facetName, value) {
        ctrl.mlSearch.toggleFacet( facetName, value )

        consumerSearchService.runSearch();
      }

    }

})();
