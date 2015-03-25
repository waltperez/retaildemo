(function () {

    var app = angular.module('ml.retail')
    app.controller('consumerHomeCtrl', ConsumerHomeCtrl);

    ConsumerHomeCtrl.$injector = ['consumerSearchService', '$scope'];
    function ConsumerHomeCtrl(consumerSearchService, $scope) {
        var ctrl = this;
        ctrl.isSearching = consumerSearchService.mlSearch;


        $scope.$watch(function() { return consumerSearchService.isSearching}, function(newVal,oldVal) {
          ctrl.isSearching = newVal;
        });
    }

})();
