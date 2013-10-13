'use strict'
Application.Controllers.controller('VendorEditCtrl', ['$rootScope', '$scope', 'Vendor', '$location', '$http', '$routeParams', 'mongosailsHelper', 'Auth', 'Food', 'lookupCache',
    function($rootScope, $scope,Vendor,$location, $http,$routeParams,mongosailsHelper,Auth,lookupCache){
      $scope.param=  $routeParams.VendorNumber;
      if ($scope.param == 0) {
        $scope.mess = ': New Vendor'
      }
      else {
        $scope.mess = ':';
        $scope.vendor = Vendor.find1({id:$routeParams.VendorNumber});
      }

      $scope.cancel = function(){
        $location.path('/vendor');
      };

//$scope.save = function() {
//        console.log('in save  ', $scope.vendor)
//        var tmp = mongosailsHelper.deleteID($scope.vendor);
//        console.log('back  - ', tmp);
//        Vendor.update ({id:$scope.vendor.id},tmp ); // updates json without the id
//
//       $location.path('/vendor');
//    };
      $scope.save = function () {
        if ($scope.param==0) {
          console.log('save create ',$scope.vendor)
          Vendor.create(0, ( $scope.vendor), function (success, error) {
            if (success) {
              console.log('create success ',success);
              //var vendorPromise = lookupCache.resetVendors();
              var vendorPromise = lookupCache.pushVendor($scope.vendor);//success);
              $location.path('/vendor');
            }
          });
        } else {
          var id = $scope.vendor.id;
          console.log('uppdate success ', id);//success, error, success.data.POID);
          Vendor.update( {id:$scope.vendor.id}, $scope.vendor, function (success, error) {
            //console.log('success, error ',success, error)
            console.log('success ',success);
            if (success) {
              var vendorPromise = lookupCache.updateVendor($scope.vendor);
              // var vendorPromise = lookupCache.resetVendors();'success ',success,' s v ',
              $location.path('/vendor');
            }
          });
        }
      };

    }]);


Application.Controllers.controller('VendorCtrl', ['$rootScope', '$scope', 'Vendor', '$location', '$http', 'Auth', 'lookupCache', 'lookupCachePO', function ($rootScope, $scope, Vendor, $location, $http, Auth, lookupCache, lookupCachePO) {

  $scope.myData = [];
  $scope.showGrid = true;
  $scope.mySelections = [];
  $scope.navType = 'pills';


  $scope.refresh = function () {
    lookupCache.resetVendors;

  }
  $scope.editrow = function (row) {
    var poPromise = lookupCachePO.getPOs();
    poPromise.then(function (val) {
//   13594 vendorid   $scope.po = val.data;
      var id = row.VendorID;//'13594';//
      console.log('id ', id)
      var events = _.filter(val.data, function (itm) {
        return itm.VendorID == id

      })

      //console.log('events... ',events)
      $scope.pords = events;
      console.log('$scope.pords... ', $scope.pords)
    })
      .catch(function (err) {
        console.error('po failed', err)
      });

  }
//////////////////////


  $scope.new = function (user) {
    //$location.path('/vendor/'+row.id);
    $location.path('/vendor/0');
  };


  console.log('Vendor1')
  var vendorPromise = lookupCache.getVendors();
  vendorPromise.then(function (cache) {
    console.log('VendorCtrl::inside lookup.then', cache)
    $scope.vendor = cache.data;
    console.log('11111')
  });

  $scope.prevRow = '';
  $scope.selectedRow = {};
  $scope.isFormActive = false;
  $scope.toggleForm = function () {
    if ($scope.isFormActive) {
      $scope.isFormActive = false;
      return;
    }
    $scope.isFormActive = true;
    $scope.editableVendor = new Vendor();
  };


/////////////////////////


  var vendorPromise = lookupCache.getVendors();
  vendorPromise.then(function (cache) {
    // console.log('VendorCtrl::inside lookup.then', cache)
    $scope.vendor = cache.data;

  });

  $scope.prevRow = '';
  $scope.selectedRow = {};
  $scope.isFormActive = false;

  $scope.toggleForm = function () {
    if ($scope.isFormActive) {
      $scope.isFormActive = false;
      return;
    }
    $scope.isFormActive = true;
    $scope.editableVendor = new Vendor();
  };

  $scope.addVendor = function () {
    $scope.editableVendor.$save();
    $scope.vendor.push($scope.editableVendor);
    $scope.toggleForm();
  };

  $scope.deletevendor = function (row) {
    Vendor.delete({id: $scope.selectedRow.id});
    $scope.vendor.splice($scope.vendor.indexOf($scope.selectedRow), 1);
  };


  //   var editrowTemplatex = '<i class="icon-edit edit" ng-click="openDialog(row.entity)"></i>';
  // this does edit in html
  // var editrowTemplate = '<a class="icon-edit edit" href="{{\'#/vendor/\'+row.entity.id}}">{{row.entity.id}}</a>';
  //var editrowTemplate = '<a class="icon-edit edit" href="{{\'#/vendor/\'+row.entity.id}}"></a>';
  // this does edit in js
  //  $scope.filteringText = '';
  var displayDateTemplate = ' <div style="width:75;text-align: left" class="ngCellText colt{{$index}}">{{row.getProperty(col.field)}}</div>';
  var editrowTemplate = '<a class="icon-edit edit" href="{{\'/vendor/\'+row.entity.id}}"></a>';

  var editrowTemplatePOS = '<i class="icon-edit edit" ng-click="editrow(row.entity)"></i>';


  $scope.filterOptions = {
    filterText: '',   //filteringText
    useExternalFilter: false
  };


  $scope.colDefs = [
    { field: 'edit', displayName: 'Edit', headerClass: 'Edit', width: '60', cellTemplate: editrowTemplate },
    { field: 'findPOS', displayName: 'po\'s', headerClass: 'po', width: '60', cellTemplate: editrowTemplatePOS },
    { field: 'VendorNumber', displayName: 'VendorNumber', groupable: false, width: 60 },
    { field: 'CompanyName', displayName: 'CompanyName', groupable: false, width: 200},
    { field: 'Address', displayName: 'Address', groupable: true, width: 200 },
    { field: 'State', displayName: 'State', groupable: true, width: 60 },
    { field: 'ZipCode', displayName: 'ZipCode', width: 100 },
    //        { field: 'DateofLoss', displayName: 'Date of Loss', width: 100  }, //   cellFilter: " moment:'dddd'" hh:mm a ddd Do not display currency symbol},
    { field: 'Country', displayName: 'Country', width: 100, groupable: true },
    { field: 'Type', displayName: 'Type', width: 60 },
    { field: 'CompanyAddition', displayName: 'CompanyAddition', groupable: true, width: 20},
    { field: 'AccountID', displayName: 'AccountID', groupable: false, width: 200},
    { field: 'VendorAccountId', displayName: 'VendorAccountId', groupable: false, width: 75},
    { field: 'contacts', displayName: 'contacts', groupable: false, width: 75, visible: false}
  ]
//  $scope.save = function(){
//    angular.forEach(Object.keys($scope.vendor[0]), function(key){
//      //    $scope.colDefs.push({ field: key });
//      console.log('key ',key);
//    });
//  };


  $scope.gridOptions1 = {

    data: 'vendor',
    multiSelect: false,
    primaryKey: 'ID',
    filterOptions: $scope.filterOptions,
    beforeSelectionChange: self.selectionchanging,
    columnDefs: 'colDefs',
    selectedItems: $scope.selections,
    enableRowReordering: false,
    showGroupPanel: true,
    showColumnMenu: true,
    maintainColumnRatios: true,
    groups: [],
    //plugins: [new ngGridCsvExportPlugin(csvOpts)],
    showFooter: true,
    //enableColumnResize: true,
//      sortInfo: {fields:['VendorNumber'], directions:['asc']}
    enableColumnReordering: true
    // sortInfo: $scope.sortInfo
  };


}]);



