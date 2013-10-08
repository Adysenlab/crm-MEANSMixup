'use strict'

Application.Controllers.controller('HomeCtrl', ['$scope', 'Email', function ($scope, Email) {
  $scope.foo = [];
  $scope.foo = [
    {'id': 'homebooyah'},
    {'id': 'gahead'},
    {'id': 'bakobus'}
  ];
  // $scope.mess = 'Please send us a message'
  //console.log(' assets js home ', $scope.foo)
  $scope.form = {};
  $scope.submit = function () {
    console.log('save create ', $scope.form)

    Email.create(0, ( $scope.form), function (success, error) {
      //console.log('create success ', success, error, success.data.POID);
//      if (success.data.POID !== 0) {
//        var poPromise = lookupCachePO.resetPO();// look to refactor
//        $location.path('/po');
//      }
      // console.log('create success ', success, error);
      if (success) {
        // console.log ('status ',status.status);
//        //$location.path('/froiprint');
        $scope.mess = ' - Thanks for the email. We will respond asap'
      } else
        console.log ('failed ');
    })


  }


}]);