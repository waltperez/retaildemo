(function () {

    var app = angular.module('ml.retail')
    app.controller('consumerHomeCtrl', ConsumerHomeCtrl);

    ConsumerHomeCtrl.$injector = ['consumerSearchService', '$scope','$http'];
    function ConsumerHomeCtrl(consumerSearchService, $scope, $http) {
        var ctrl = this;
        ctrl.mlSearch = consumerSearchService.mlSearch;
        ctrl.searchService = consumerSearchService;
        ctrl.page = ctrl.mlSearch.getPage();

        ctrl.removeSearchTag = function(index) {
          consumerSearchService.removeSearchTag(index);
        }
      $scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
      ctrl.getTypeaheadValues = function($viewValue) {
        var someOutput = "";//return something
        alert("hi");
        $http({
          method: 'GET',
          url: 'api/v1/person?name__icontains=' + $viewValue
        }).error(function (data) {
          console.error(data);
        }).success(function (data) {
          console.log(data);//Do whatever you want
        });
        return someOutput;
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
