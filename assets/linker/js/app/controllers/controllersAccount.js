'use strict'
Application.Controllers.controller('AccountEditCtrl', ['$rootScope', '$scope', 'Account','$location', '$http', '$routeParams','mongosailsHelper','Auth','lookupCacheAcct',
    function($rootScope, $scope,Account,$location, $http,$routeParams,mongosailsHelper,Auth,lookupCacheAcct){
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

Application.Controllers.controller('AccountCtrl', ['$rootScope', '$scope', 'Account','$location', '$http','Auth','lookupCacheAcct','lookupCachePO' ,function($rootScope, $scope,Account,$location, $http,Auth,lookupCacheAcct,lookupCachePO){
    console.log(' Account ')

  $scope.new = function (account) {
    //$location.path('/vendor/'+row.id);
    $location.path('/account/0');
  };

    $scope.myData = [];
    $scope.showGrid = true;
    $scope.mySelections = [];
    $scope.navType = 'pills';


  $scope.refresh = function () {
    lookupCache.resetAccounts;

  }

  $scope.editPO = function (po) {
    //console.log(' edit po  ',po,po.PONumber);//POID);
    console.log(' edit po  ',po,po.id);//POID);
    $location.path('/po/'+ po.id);//POID);//$rootScope.userid);
  };
  $scope.editrow = function (row) {
    console.log('find pos ',row)
    var poPromise = lookupCachePO.getPOs();
    poPromise.then(function (val) {
      var id = row.AccountID;//'13594';//
      console.log('id ', id)
      var events = _.filter(val.data, function (itm) {
        return itm.AccountID == id
      })
      $scope.pords = events;
      console.log('$scope.pords... ', $scope.pords)
    })
      .catch(function (err) {
        console.error('po failed', err)
      });

  }
//////////////////////
    var acctPromise = lookupCacheAcct.getAccounts();
    acctPromise.then(function (cache) {
      $scope.account = cache.data;
      $scope.accountIndex = cache.combo;
      console.log(' $scope.account ', $scope.account)
    })
      .catch(function (err) {
        console.error('accounts failed', err)
    });

    $scope.prevRow ='';
    $scope.selectedRow = {};
    $scope.isFormActive = false;
    $scope.toggleForm = function(){
        if ($scope.isFormActive){
            $scope.isFormActive = false;
            return;
        }
        $scope.isFormActive = true;
        $scope.editableVendor = new Vendor();
    };

    $scope.addVendor = function(){
        $scope.editableVendor.$save();
        $scope.vendor.push($scope.editableVendor);
        $scope.toggleForm();
    };

    $scope.deletevendor =  function(row) {
        Vendor.delete ({id:$scope.selectedRow.id});
        $scope.vendor.splice( $scope.vendor.indexOf( $scope.selectedRow) ,1) ;

    };

  var displayDateTemplate = ' <div style="width:75;text-align: left" class="ngCellText colt{{$index}}">{{row.getProperty(col.field)}}</div>';
  var editrowTemplate = '<div style="text-align:center;"  class="ngCellText"><a class="icon-edit edit" href="{{\'/vendor/\'+row.entity.id}}"></a></div>';
  var editrowTemplatePOS = '<div style="text-align:center;"  class="ngCellText"><i class="icon-edit edit" ng-click="editrow(row.entity)"></i>';


  $scope.filterOptions = {
    filterText: '',          //filteringText
    useExternalFilter: false
  };

  $scope.colDefs = [
    { field: 'edit', displayName: 'Edit', headerClass: 'Edit', width: '60', cellTemplate: editrowTemplate },
    { field: 'findPOS', displayName: 'po\'s', headerClass: 'po', width: '60', cellTemplate: editrowTemplatePOS },

    { field: 'AccountID', displayName: 'AccountID', groupable: false, width: 60, visible:true },
    { field: 'Desc', displayName: 'Desc', groupable: false, width: 200},
    { field: 'Budget', displayName: 'Budget',groupable: false, width: 75},
    { field: 'Actual', displayName: 'Actual', groupable: false, width: 75},
    { field: 'PrevYearBudget', displayName: 'PrevYearBudget' , groupable: false, width: 75},
    { field: 'PrevYearActual', displayName: 'PrevYearActual' , groupable: false, width: 75},
    { field: 'CategoryID', displayName: 'CategoryID' , groupable: false, width: 75},
    { field: 'SubCategoryID', displayName: 'SubCategoryID' , groupable: false, width: 75}

  ]

//  console.log(' $scope.vendor ',  $scope.myData, $scope.vendor)
    $scope.save = function(){
        angular.forEach(Object.keys($scope.vendor[0]), function(key){
            //    $scope.colDefs.push({ field: key });
            console.log('key ',key);
        });
    };


  $scope.gridOptions1 = {


    data: 'account',
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

  $scope.changeGrid = function (row){
    $scope.colDefs = $scope.colDefs2;
//     $scope.colDefs.pop();
//    $scope.colDefs[1].visible=false;
//    $scope.colDefs[1].visible=false;


  }



//    angular.forEach(Object.keys($scope.myData[0]), function(key){
//        // $scope.colDefs.push({ field: key });
//        console.log('key ',key);
//    });
//    $scope.$watch('myData', function() {
//            $scope.colDefs = [];
//
//            angular.forEach(Object.keys($scope.myData[0]), function(key){
//                // $scope.colDefs.push({ field: key });
//                console.log('key ',key);
//            });
//        }
//    );
//        console.log(' $scope.vendor ', $scope.vendor)
//            $scope.myDefs = [
//                    { field: 'VendorNumber', displayName: 'VendorNumber', headerClass: 'Edit', width: '60', cellTemplate: editrowTemplate },
//                    { field: 'CompanyName', displayName: 'CompanyName', groupable: false, width: 60 },
//                    { field: 'Address', displayName: 'Address', groupable: false, width: '200px'}
//]
//        $scope.myData = $scope.vendor;
//        $scope.gridOptions1.columnDefs= 'myDefs';

//    $scope.gridOptions1 = {
//        data: 'myData',
//        multiSelect: false,
//        //primaryKey: 'ID',
//        //filterOptions: $scope.filterOptions,
//        beforeSelectionChange: self.selectionchanging,
//        //columnDefs: 'colDefs',
//        selectedItems: $scope.selections,
//        enableRowReordering: false,
//        showGroupPanel: true,
//        showColumnMenu: true,
//        //groups: ['SeasonCode', 'Vendor']
//        // enablePinning: true,
//        maintainColumnRatios: false,
//        groups: [],
//        //plugins: [new ngGridCsvExportPlugin(csvOpts)],
//        showFooter: true,
//        enableColumnResize: true,
//        enableColumnReordering: true,
//        //sortInfo: $scope.sortInfo
//    };


//
//
//    $scope.handleRowSelection = function(row) {
//        if ($scope.prevRow !== '')
//            //&   && (1===1)) check for ngDirty on form
//        {
//            Vendor.update ({id:$scope.prevRow.id},{quantity:$scope.prevRow.quantity});
//            console.log('update ');
//        }
//        $scope.selectedRow = row;
//        console.log('row ',row)
//        $scope.prevRow = row;
//    };
//
//
//    $scope.handleRowSelectionDetail = function(row) {
//    };

//
//    $scope.savedetail = function(){
//
//        console.log(' $scope.food ', $scope.food)
//        $scope.selectedRow.Details.Vendor='jrt';
//        Vendor.update ({id:$scope.selectedRow.id},{quantity:$scope.selectedRow.quantity,Details:$scope.selectedRow.Details.Vendor});
//       };

}]);



