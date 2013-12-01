'use strict'
angular.module('crmApp')

    .controller('TestngCtrl',['$scope' ,function ($scope){
    console.log(' TestngCtrl ')
    $scope.myDefs = [
        { field: 'name', displayName: 'Name Title', width: 140 },
        { field: 'age', displayName: 'age', width: 50 },

]

        $scope.myData = [{name: "Moroni", age: 50},
            {name: "Tiancum", age: 43},
            {name: "Jacob", age: 27},
            {name: "Nephi", age: 29},
            {name: "Enos", age: 34}];
        $scope.gridOptions = {
            data: 'myData',
            columnDefs: 'myDefs',
            enableColumnResize: true,
            enableColumnReordering: true,
            selectedItems: $scope.mySelections,
            headerRowHeight: 40,
            //pagingOptions: $scope.pagingOptions,
            enablePaging: true,
            enableRowSelection: true,
            multiSelect: false,
            enableRowReordering: false,
           // enablePinning: true,
            showGroupPanel: true,
            showFooter: false,
            showFilter: true,
            enableCellEdit: true,
            enableCellSelection: true,
            showColumnMenu: true,
            maintainColumnRatios: true,

            primaryKey: 'name',
            sortInfo: {fields:['name'], directions:['asc'] }
        }
}
]);