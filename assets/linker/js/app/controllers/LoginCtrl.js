'use strict';

angular.module('crmApp')
  .controller('LoginCtrl', ['$rootScope', '$scope', '$location', '$window', 'Auth', '$log', function($rootScope, $scope, $location, $window, Auth, $log) {

    // do logout if routed to /logout
    if ($location.path() === '/logout') {
      Auth.logout(function() {
//        $log.debug('LoginCtrl::logout success');
      }, function() {
//        $log.debug('LoginCtrl::logout error');
      });
    }


    console.log('LoginCtrl');
    $scope.rememberme = false;
    $scope.username = 'MAT';
    $scope.password = '123456';

    $scope.login = function() {
      Auth.login({
          username: $scope.username,
          password: $scope.password,
          rememberme: $scope.rememberme
        }, function(res) {
          $location.path('/vendor');
        }, function(err) {
          $rootScope.error = 'Failed to login!';
        });
    };
//        $scope.loginOauth = function(provider) {
//            $window.location.href = '/auth/' + provider;
//        };
  }])






  .controller('AppCtrl', ['$rootScope', '$scope', '$location' , 'Auth',
    function($rootScope, $scope, $location, Auth) {
      console.log('AppCtrl');

      $scope.getUserRoleText = function(role) {
        return _.invert(Auth.userRoles)[role];
      };

      $scope.logout = function() {
        Auth.logout(function() {
          // console.log('auth logout ')
          // jrt
          //$location.path('/login');
          window.location.reload();//Full page reload FIXES problem with socket io cookie
        }, function() {
          $rootScope.error = 'Failed to logout';
        });
      };
    }]);
