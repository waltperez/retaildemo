(function () {
  'use strict';
    var app = angular.module('ml.retail');

    app.controller('loginCtrl', LoginCtrl);

    LoginCtrl.$inject = ['userService', '$scope', '$location'];
    function LoginCtrl(userService, $scope, $location) {
      var ctrl = this;

      ctrl.users = {
        'marketer': { label: 'Marketer', desc: 'Manages marketing and promotional campaigns - including social media', name: 'John Marketer' },
        'analyst': { label: 'Analyst', desc: 'Analyzes sales performance, site performance, etc', name: 'Susie Analyst'},
        'loyalty': { label: 'Customer Loyalty Manager', desc: 'Maintains customer loyalty via rewards, social campaigns, targetted cross-selling, etc', name: 'Tom Loyalty' },
        'manager': { label: 'Store Manager', desc: 'Manages operations of the retail store', name: 'Jane Boss'}
      };

      $scope.$watch('ctrl.username', function(newVal, oldVal) {
        if (newVal) {
          ctrl.userdesc = ctrl.users[newVal].desc;
          ctrl.userlabel = ctrl.users[newVal].label;
        } else {
          ctrl.userdesc = ctrl.userlabel = null;
        }
      });

      ctrl.login = function() {
        userService.login(ctrl.username, ctrl.users[ctrl.username].name);
        $location.path('/' + ctrl.username + '/dashboard').search('');
      };
    }
})();
