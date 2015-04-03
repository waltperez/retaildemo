(function () {
    var app = angular.module('ml.retail');

    app.directive('consumerSubnav', ConsumerSubnav);

    ConsumerSubnav.$injector = ['consumerSearchService']
    function ConsumerSubnav(consumerSearchService) {
      return {
        restrict: 'E',
        replace: true,
        link: function(scope) {
          scope.searchText = '';
          scope.doSearch = function() {
            if (scope.searchForm.$valid) {
              consumerSearchService.searchText(scope.searchText);
              scope.searchText = '';
            } else {
              console.log('invalid');
            }
          }
        },
        templateUrl: '/consumer/consumer_subnav.html'
      }
    }
})();
