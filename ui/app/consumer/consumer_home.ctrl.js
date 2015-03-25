(function () {

    var app = angular.module('ml.retail')
    app.controller('consumerHomeCtrl', ConsumerHomeCtrl);

    ConsumerHomeCtrl.$injector = ['consumerSearchService', '$scope'];
    function ConsumerHomeCtrl(consumerSearchService, $scope) {
        var ctrl = this;

        $scope.$watch(function() { return consumerSearchService.results}, function(newVal,oldVal) {

        });
    }

})();
