'use strict'
angular.module('crmApp')
.controller('HomeCtrl', ['$scope', 'Email', function ($scope, Email) {

    $scope.filters = {};

    $scope.table_properties = {
      client_status: ["Morning", "Afternoon","Evening"]
    };
    $scope.color = 'green';
    $scope.survey= [
      {name:'color',
        options:['red', 'green', 'blue'],
        userChoice:'blue'}];
      $scope.form = {};
    $scope.submit = function () {
      console.log('save create ', $scope.form)

      Email.create(0, ( $scope.form), function (success, error) {

        if (success) {
          $scope.mess = ' - Thanks for the email. We will respond asap'
        } else
          console.log ('failed ');
      })
    }
  }]);