
angular.module('ml.retail', [
    'ngRoute',
    'ui.bootstrap',
    'ml.common',
    'ml.search',
    'ml.search.tpls',
    'google-maps',
])
  .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {

    'use strict';

    $locationProvider.html5Mode(true);

    $routeProvider
      .when('/', {
        templateUrl: '/home/splash.html',
        controller: 'splashCtrl as splashCtrl'
      })
      .when('/login', {
        templateUrl: '/user/login.html',
        controller: 'loginCtrl as ctrl'
      })
      .when('/marketer/dashboard', {
        templateUrl: '/marketer/dashboard.html',
        controller: 'marketerDashboardCtrl'
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
      .otherwise({
        redirectTo: '/'
      });
  }]);
