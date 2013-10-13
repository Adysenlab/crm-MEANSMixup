/**
 * Created with JetBrains WebStorm.
 * User: John
 * Date: 8/12/13
 * Time: 6:22 PM
 * To change this template use File | Settings | File Templates.
 */

//angular.module('angular-client-side-auth')
//    .controller('LoginCtrl',
//        ['$rootScope', '$scope', '$location', '$window', 'Auth', function($rootScope, $scope, $location, $window, Auth) {
//
//            $scope.rememberme = false;// true;
//            $scope.username='JRT';
//            $scope.password='123';
//            $scope.login = function() {
//                //  alert(scope.username);//.uppercase());
//                //console.log('$scope.username ',$scope.usernamec;
//                Auth.login({
//
//                        username:  $scope.username.toUpperCase(),
//                        password: $scope.password,
//                        adjusterid :$scope.adjusterid,
//                        rememberme: $scope.rememberme
//                    },
//                    function(res) {
//                        $location.path('/');
//                    },
//                    function(err) {
//                        $rootScope.error = "Failed to login";
//                    });
//                //  alert(scope.username);//.uppercase());
//            };
//
//            $scope.loginOauth = function(provider) {
//                $window.location.href = '/auth/' + provider;
//            };
//        }]);

Application.Controllers.controller('LoginCtrl', ['$rootScope', '$scope', '$location', '$window', 'Auth', function($rootScope, $scope, $location, $window, Auth) {

    console.log(' LoginCtrl ') //,$routeParams.VendorNumber)
        $scope.rememberme = false;// true;
        $scope.username='MAT';
        $scope.password='123456';
        $scope.login = function() {

            Auth.login({
                    username:  $scope.username,//.toUpperCase(),
                    password: $scope.password,
                   // adjusterid :$scope.adjusterid,
                    rememberme: $scope.rememberme
                },
                function(res) {
                    //$location.path('/');
                  console.log('in logged')
                  $location.path('/vendor');
                },
                function(err) {
                    $rootScope.error = "Failed to login!";
                });
            //  alert(scope.username);//.uppercase());
        };

//        $scope.loginOauth = function(provider) {
//            $window.location.href = '/auth/' + provider;
//        };
    }]);


Application.Controllers.controller('LogoutCtrl', ['$rootScope', '$scope', '$location', '$window', 'Auth', function($rootScope, $scope, $location, $window, Auth) {

      Auth.logout(function(){},function(){});// fake out sucess fail
      $scope.rememberme = false;// true;
      $scope.username='MAT';//'JRT';
      $scope.password='123456',//brm901';//123';
      $scope.login = function() {
        //  alert(scope.username);//.uppercase());  //console.log('$scope.username ',$scope.usernamec;
        Auth.login({

            username:  $scope.username.toUpperCase(),
            password: $scope.password,
            adjusterid :$scope.adjusterid,
            rememberme: $scope.rememberme
          },
          function(res) {
            //$location.path('/');
            $location.path('/vendor');
          },
          function(err) {
            $rootScope.error = "Failed to login";
          });

      };

      $scope.loginOauth = function(provider) {
        $window.location.href = '/auth/' + provider;
      };
    }]);







Application.Controllers.controller('AppCtrl', ['$rootScope', '$scope', '$location' ,'Auth',
    function($rootScope, $scope, $location, Auth) {
        //console.log(' AppCtrl ') //,$routeParams.VendorNumber)

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
                    $rootScope.error = "Failed to logout";
                });
            };
        }]);