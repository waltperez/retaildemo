'use strict';

angular.module('ml.retail', [
    'ngRoute',
    'ui.bootstrap',
    'ml.common',
    'ml.search',
    'ml.search.tpls',
    'google-maps',
])
  .controller('appCtrl', [ 'userService', '$scope', '$location', function(userService, $scope, $location) {

    var ctrl = this;

    ctrl.logout = function() {
      console.log('logging out');
      userService.logout();
    };

    $scope.$watch(function() { return userService.user; }, function(newVal,oldVal) {
      if (newVal) {
        ctrl.username = newVal.username;
      } else {
        ctrl.username = null;
        $location.path('/').search('');
      }
    });

  }])
  .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {

    $locationProvider.html5Mode(true);

    $routeProvider
      .when('/splash', {
        templateUrl: '/home/splash.html',
        controller: 'splashCtrl as splashCtrl'
      })
      .when('/login', {
        templateUrl: '/user/login.html',
        controller: 'loginCtrl as ctrl'
      })
      .when('/marketer/dashboard', {
        templateUrl: '/marketer/dashboard.html',
        controller: 'marketerCtrl as markterCtrl'
      })
      .when('/analyst/dashboard', {
        templateUrl: '/analyst/dashboard.html',
        controller: 'analystDashboardCtrl'
      })
      .when('/manager/dashboard', {
        templateUrl: '/manager/dashboard.html',
        controller: 'managerDashboardCtrl'
      })
      .when('/loyalty/dashboard', {
        templateUrl: '/loyalty/dashboard.html',
        controller: 'loyaltyDashboardCtrl'
      })
      .when('/consumer/home', {
        templateUrl: '/consumer/consumer_home.html',
        controller: 'consumerHomeCtrl as consumerCtrl'
      })
      .when('/consumer/detail/:uri*', {
        templateUrl: '/consumer/product_detail.html',
        controller: 'productDetailCtrl as productDetails',
        resolve: {
          'productData': function($route, MLRest) {
            var uri = '/' + $route.current.params.uri;
            console.log('resolving ', uri)
            return MLRest.getDocument(uri, { format: 'json', transform: 'product-json'})
          }
        }
      })
      .otherwise({
        redirectTo: '/consumer/home'
      });
  }]);
