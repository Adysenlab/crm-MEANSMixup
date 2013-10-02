'use strict'

Application.Controllers.controller('MainCtrl', ['$scope', function($scope){
//	$scope.foo = 'booyah';
    $scope.foo =[];
    $scope.foo = [{'id':'booyah'},{'id':'gahead'},{'id':'bakobus'}];

    $scope.selectedRow = {};
    $scope.listOfNumbers = [];

    $scope.addRows = function(numberOfRowsToAdd) {
        var startIndex = $scope.listOfNumbers.length;
        var endIndex = $scope.listOfNumbers.length + numberOfRowsToAdd;

        for(var i = startIndex; i < endIndex; i++) {
            $scope.listOfNumbers.push({
                id: i,
                name: 'name ' + i,
                street: 'street ' + i
            });
        }
    };

    $scope.handleRowSelection = function(row) {
        $scope.selectedRow = row;
    };

    $scope.addRows(50);
    //    console.log('  $scope.listOfNumbers ',  $scope.listOfNumbers)
}]);

Application.Controllers.controller('HomeCtrl', ['$scope', function($scope){
    $scope.foo =[];
    $scope.foo = [{'id':'homebooyah'},{'id':'gahead'},{'id':'bakobus'}];

    console.log('assets/applcation HomeCtrl ',  $scope.foo)
}]);
