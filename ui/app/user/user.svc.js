(function () {
  'use strict';

  var app = angular.module('ml.retail');

  app.service('userService', UserService);


  UserService.$inject = ['$http', '$rootScope'];
  function UserService($http, $rootScope) {
    var service = {};
    service.user = null;

    service.login = function(role,username) {
      service.user = { role: role, username: username };
    };

    service.logout = function() {
      service.user = null;
    };

    return service;
  }

})();
