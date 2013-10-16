'use strict';

angular.module('crmApp')
  .controller('FoodCtrl', ['$rootScope', '$scope', 'Food', '$location', '$http', 'Auth' , function($rootScope, $scope, Food, $location, $http, Auth) {
    console.log(' FoodCtrl ');
    $scope.tabs = [
      { title: 'Dynamic Title 1', content: 'Dynamic content 1' },
      { title: 'Dynamic Title 2', content: 'Dynamic content 2', disabled: true }
    ];

    $scope.alertMe = function() {
      setTimeout(function() {
        alert('You\'ve selected the alert tab!');
      });
    };
    $scope.navType = 'pills';


//    $scope.food = Food.query();//    // this is  a get isArray=true from sails
    $scope.food = Food.findAll();//    // this is our own custom method
    $scope.prevRow = '';

    $scope.selectedRow = {};
    $scope.isFormActive = false;

    $scope.toggleForm = function() {
      if ($scope.isFormActive) {
        $scope.isFormActive = false;
        return;
      }

      $scope.isFormActive = true;
      $scope.editableFood = new Food();
    };

    $scope.addFood = function() {
      $scope.editableFood.$save();
      $scope.food.push($scope.editableFood);
      $scope.toggleForm();
    };

    $scope.deleteFood = function(row) {
      Food.delete({id: $scope.selectedRow.id});
      $scope.food.splice($scope.food.indexOf($scope.selectedRow), 1);
      // on success
      //  $scope.food. push($scope.editableFood);
      //  $scope.toggleForm();
    };

    console.log('food ', $scope.food);

    $scope.handleRowSelection = function(row) {
      if ($scope.prevRow !== '')
      //&   && (1===1)) check for ngDirty on form
      {
        Food.update({id: $scope.prevRow.id}, {quantity: $scope.prevRow.quantity });
        console.log('update 2 fields');
      }
      $scope.selectedRow = row;
      console.log('row ', row);
      $scope.prevRow = row;
    };


    $scope.handleRowSelectionDetail = function(row) {
//        if ($scope.prevRow !== '')
//        //&   && (1===1)) check for ngDirty on form
//        {
//            Food.update ({id:$scope.prevRow.id},{quantity:$scope.prevRow.quantity});
//            console.log('update ');
//        }
//        $scope.selectedRow = row;
//        console.log('row ',row)
//        $scope.prevRow = row;
    };
    $scope.save = function() {

      console.log(' $scope.food ', $scope.food);

      Food.update({id: $scope.selectedRow.id}, {quantity: $scope.selectedRow.quantity});
      // bad $scope.selectedRow.update();


      // not works   $scope.selectedRow.$save();
      //  $scope.food.push($scope.editableFood);
      //  $scope.toggleForm();
    };

    $scope.savedetail = function() {

      console.log(' $scope.food ', $scope.food);
      $scope.selectedRow.Details.Vendor = 'jrt';
      Food.update({id: $scope.selectedRow.id}, {quantity: $scope.selectedRow.quantity, Details: $scope.selectedRow.Details.Vendor});
    };

  }]);