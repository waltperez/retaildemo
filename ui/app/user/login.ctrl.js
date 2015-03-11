(function () {
  'use strict';
    var app = angular.module('ml.retail');

    app.controller('loginCtrl', LoginCtrl);

    LoginCtrl.$inject = ['$http', '$scope'];
    function LoginCtrl($http, $scope) {
      var ctrl = this;

      ctrl.users = {
        'marketer': { label: 'Marketer', desc: 'Manages marketing and promotional campaigns - including social media' },
        'analyst': { label: 'Analyst', desc: 'Analyzes sales performance, site performance, etc' },
        'loyalty': { label: 'Customer Loyalty Manager', desc: 'Maintains customer loyalty via rewards, social campaigns, targetted cross-selling, etc' },
        'manager': { label: 'Store Manager', desc: 'Manages operations of the retail store' }
      };

      $scope.$watch('ctrl.username', function(newVal, oldVal) {
        if (newVal) {
          ctrl.userdesc = ctrl.users[newVal].desc;
          ctrl.userlabel = ctrl.users[newVal].label;
        } else {
          ctrl.userdesc = ctrl.userlabel = null;
        }
      });
    }
})();
