'use strict'

Application.Controllers.controller('MainCtrl', ['$scope', function ($scope) {
  console.log(' MainCtrl js home ')
//  $scope.foo = [];
//  $scope.foo = [
//    {'id': 'booyah'},
//    {'id': 'gahead'},
//    {'id': 'bakobus'}
 // ];

  $scope.selectedRow = {};
  $scope.listOfNumbers = [];

  $scope.addRows = function (numberOfRowsToAdd) {
    var startIndex = $scope.listOfNumbers.length;
    var endIndex = $scope.listOfNumbers.length + numberOfRowsToAdd;

    for (var i = startIndex; i < endIndex; i++) {
      $scope.listOfNumbers.push({
        id: i,
        name: 'name ' + i,
        street: 'street ' + i
      });
    }
  };

  $scope.handleRowSelection = function (row) {
    $scope.selectedRow = row;
  };

  $scope.addRows(50);
  //    console.log('  $scope.listOfNumbers ',  $scope.listOfNumbers)
}]);

 Application.Controllers.controller('HomeCtrl', ['$scope', 'Email', function ($scope, Email) {
//    $scope.foo = [];
//    $scope.foo = [
//      {'id': 'homebooyah'},
//      {'id': 'gahead'},
//      {'id': 'bakobus'}
//    ];
   $scope.filters = {};

   $scope.table_properties = {
     client_status: ["Morning", "Afternoon","Evening"]
   };
   $scope.color = 'green';
   $scope.survey= [
     {name:'color',
       options:['red', 'green', 'blue'],
       userChoice:'blue'}];
   //http://plnkr.co/edit/LxVHpG8yhCpdCCixoodf?p=preview

   // use http://jsfiddle.net/NphY9/1/


    // $scope.mess = 'Please send us a message'
    //console.log(' assets js home ', $scope.foo)
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

  Application.Controllers.controller('navController', ['$scope', function ($scope) {

  console.log(' navController js home ')
}]);


Application.Controllers.controller('MainCtrl2', ['$rootScope', '$scope', 'Food', function ($rootScope, $scope, Food) {
  console.log(' MainCtrl2 js home ')
  $scope.food = Food.query();

  $scope.isFormActive = false;

  $scope.toggleForm = function () {
    if ($scope.isFormActive) {
      $scope.isFormActive = false;
      return;
    }

    $scope.isFormActive = true;
    $scope.editableFood = new Food();
  };

  $scope.addFood = function () {
    $scope.editableFood.$save();
    $scope.food.push($scope.editableFood);
    $scope.toggleForm();
  };
  console.log('food ', $scope.food)


}]);


Application.Controllers.controller('FoodCtrl', ['$rootScope', '$scope', 'Food', '$location', '$http', 'Auth' , function ($rootScope, $scope, Food, $location, $http, Auth) {
  console.log(' FoodCtrl ')
  $scope.tabs = [
    { title: "Dynamic Title 1", content: "Dynamic content 1" },
    { title: "Dynamic Title 2", content: "Dynamic content 2", disabled: true }
  ];

  $scope.alertMe = function () {
    setTimeout(function () {
      alert("You've selected the alert tab!");
    });
  };
  $scope.navType = 'pills';


//    $scope.food = Food.query();//    // this is  a get isArray=true from sails
  $scope.food = Food.findAll();//    // this is our own custom method
  $scope.prevRow = '';

  $scope.selectedRow = {};
  $scope.isFormActive = false;

  $scope.toggleForm = function () {
    if ($scope.isFormActive) {
      $scope.isFormActive = false;
      return;
    }

    $scope.isFormActive = true;
    $scope.editableFood = new Food();
  };

  $scope.addFood = function () {
    $scope.editableFood.$save();
    $scope.food.push($scope.editableFood);
    $scope.toggleForm();
  };

  $scope.deleteFood = function (row) {
    Food.delete({id: $scope.selectedRow.id});
    $scope.food.splice($scope.food.indexOf($scope.selectedRow), 1);
    // on success
    //  $scope.food. push($scope.editableFood);
    //  $scope.toggleForm();
  };

  console.log('food ', $scope.food)

  $scope.handleRowSelection = function (row) {
    if ($scope.prevRow !== '')
    //&   && (1===1)) check for ngDirty on form
    {
      Food.update({id: $scope.prevRow.id}, {quantity: $scope.prevRow.quantity });
      console.log('update 2 fields');
    }
    $scope.selectedRow = row;
    console.log('row ', row)
    $scope.prevRow = row;
  };


  $scope.handleRowSelectionDetail = function (row) {
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
  $scope.save = function () {

    console.log(' $scope.food ', $scope.food)

    Food.update({id: $scope.selectedRow.id}, {quantity: $scope.selectedRow.quantity});
    // bad $scope.selectedRow.update();


    // not works   $scope.selectedRow.$save();
    //  $scope.food.push($scope.editableFood);
    //  $scope.toggleForm();
  };

  $scope.savedetail = function () {

    console.log(' $scope.food ', $scope.food)
    $scope.selectedRow.Details.Vendor = 'jrt';
    Food.update({id: $scope.selectedRow.id}, {quantity: $scope.selectedRow.quantity, Details: $scope.selectedRow.Details.Vendor});
  };

}]);

//angular.module('angular-client-side-auth')
//    .controller('AdminCtrl',

