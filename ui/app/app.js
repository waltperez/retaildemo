
angular.module('sample', [
    'ngRoute',
    'ui.bootstrap',
    'http-auth-interceptor',
    'ng.httpLoader',
    'ml.common',
    'ml.search',
    'ml.search.tpls',
    'google-maps',
])
  .config(['$routeProvider', '$locationProvider', 'mlMapsProvider', function ($routeProvider, $locationProvider) {

    'use strict';

    $locationProvider.html5Mode(true);

    $routeProvider
      .when('/', {
        templateUrl: '/home/splash.html',
        controller: 'SplashCtrl'
      })
      .when('/login', {
        templateUrl: '/user/login.html',
        controller: 'LoginCtrl'
      })
      .when('/user1/dashboard', {
        templateUrl: '/user1/dashboard.html',
        controller: 'User1DashboardCtrl'
      })
      .when('/user2/dashboard', {
        templateUrl: '/user2/dashboard.html',
        controller: 'User2DashboardCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);
