
'use strict'
angular.module('crmApp')
.controller('VendorEditCtrl', ['$rootScope', '$scope', 'Vendor', '$location', '$http', '$routeParams', 'mongosailsHelper', 'Auth', 'lookupCache',
  function ($rootScope, $scope, Vendor, $location, $http, $routeParams, mongosailsHelper, Auth, lookupCache) {
    $scope.param = $routeParams.VendorNumber;
    if ($scope.param == 0) {
      $scope.mess = ': New Vendor'
    }
    else {
      $scope.mess = ':';
      $scope.vendor = Vendor.find1({id: $routeParams.VendorNumber});
    }

    $scope.cancel = function () {
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
      if ($scope.param == 0) {
        console.log('save create ', $scope.vendor)
        Vendor.create(0, ( $scope.vendor), function (success, error) {
          if (success) {
            console.log('create success ', success);
            //var vendorPromise = lookupCache.resetVendors();
            var vendorPromise = lookupCache.pushVendor($scope.vendor);//success);
            $location.path('/vendor');
          }
        });
      } else {
        var id = $scope.vendor.id;
        console.log('uppdate success ', id);//success, error, success.data.POID);
        Vendor.update({id: $scope.vendor.id}, $scope.vendor, function (success, error) {
          //console.log('success, error ',success, error)
          console.log('success ', success);
          if (success) {
            var vendorPromise = lookupCache.updateVendor($scope.vendor);
            // var vendorPromise = lookupCache.resetVendors();'success ',success,' s v ',
            $location.path('/vendor');
          }
        });
      }
    };

  }]);

angular.module('crmApp')
.controller('VendorCtrl', ['$rootScope', '$scope', 'Vendor', '$location', '$http', 'Auth', 'lookupCache', 'lookupCachePO', '$modal', '$log','GridResource','$q', function ($rootScope, $scope, Vendor, $location, $http, Auth, lookupCache, lookupCachePO, $modal, $log,GridResource,$q) {
//  crmApp.Controllers.controller('VendorCtrl', ['$rootScope', '$scope', 'Vendor', '$location', '$http', 'Auth', 'lookupCache', 'lookupCachePO', '$modal', '$log','PO', function ($rootScope, $scope, Vendor, $location, $http, Auth, lookupCache, lookupCachePO, $modal, $log,PO) {
  console.log(' VendorCtrl ')


  $scope.myData = [];
  $scope.showGrid = true;
  $scope.mySelections = [];
  $scope.navType = 'pills';


  $scope.refresh = function () {
    lookupCache.resetVendors;

  }


  // };

  $scope.showPOS = function (row) {
    // console.log('row ',row)
    var poPromise = lookupCachePO.getPOs();
    poPromise.then(function (val) {
      var id = row.VendorID;//'13594';//
      console.log('id ', id)
      var events = _.filter(val.data, function (itm) {
        return itm.VendorID == id
      })
      $scope.pords = events;
      console.log('$scope.pords... ', $scope.pords)
    })
      .catch(function (err) {
        console.error('po failed', err)
      });
  }
//////////////////////
  var vendorPromise = lookupCache.getVendors();
  vendorPromise.then(function (cache) {
    console.log('VendorCtrl::inside lookup.then', cache)
    $scope.vendor = cache.data;
    console.log('11111', $scope.vendor)
  });

        var gridPromise =
            GridResource.getGrid({'gridcol':$scope.exportcols,'user':$rootScope.user.username, 'gridname':'Vendor'}).$promise
                .then(function (response) {

                    //console.log('$scope.colDefs ',response.colDefs)
                    $scope.colDefs = response.colDefs;
                })
                .catch(function (err) {
                    console.error('catch::myDefs ', err);
                    $scope.colDefs = [

                        { field: 'edit', displayName: 'Edit', headerClass: 'Edit', width: '60', cellTemplate: editrowTemplatePop },
                        { field: 'findPOS', displayName: 'POS', headerClass: 'po', width: '60', cellTemplate: editrowTemplatePOS },


                        { field: 'VendorNumber', displayName: 'VendorNumber', groupable: true, width: 100, visible: true },
                        { field: 'CompanyName', displayName: 'CompanyName', groupable: false, width: 200},

                        { field: 'Address', displayName: 'Address', groupable: true, width: 200 },
                        { field: 'City', displayName: 'City', groupable: true, width: 160 },
                        { field: 'State', displayName: 'State', groupable: true, width: 60 },
                        { field: 'ZipCode', displayName: 'ZipCode', width: 100 },

//    { field: 'Country', displayName: 'Country', width: 100, groupable: true },ilter stops working ig included
                        { field: 'Type', displayName: 'Type', width: 60 },
//   { field: 'CompanyAddition', displayName: 'CompanyAddition', width: 100 ,visible:false},// filter stops working ig included

                        { field: 'AccountID', displayName: 'AccountID', groupable: false, width: 200},
                        { field: 'VendorAccountId', displayName: 'VendorAccountId', groupable: false, width: 75},
                        { field: 'contacts', displayName: 'contacts', groupable: false, width: 75, visible: false}

                    ]

                });
        $q.all([vendorPromise,gridPromise])
            .then(function () {
             // $scope.currentVendor = $scope.vendorIndex[$scope.template[0].VendorID];
             //   $scope.currentAccount = $scope.accountIndex[$scope.template[0].AccountID];

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


  $scope.popVendor = function (vendor1) {
    console.log('vendor  ', vendor1);// user[0]);//.id);

    if(vendor1==='new'){
      $scope.vendoritem ={};
      $scope.newvendor=1;
    } else
    {
      $scope.newvendor=0;
    $scope.vendoritem = vendor1;//Vendor.find1({id: $routeParams.VendorNumber});
    }
      var modalInstance = $modal.open({
      templateUrl: '/partials/myModalVendor',
      controller: ModalVendorCtrl,

      resolve: {
        vendoritem: function () {
          return $scope.vendoritem;
        }
      }
    });
    modalInstance.result.then(function (selectedItem) {
      //$scope.selected = selectedItem;
      console.log('result back selectedItem',selectedItem);
      console.log('result back vendoritem',$scope.vendoritem);
      console.log('result back $scope.vendor',$scope.vendor);


      //dont use id as a switch if (id === 0) {
      // id should not be assigned when create new
      if(  $scope.newvendor===1){
        console.log('save create ', $scope.vendoritem);
        Vendor.create(0, ( $scope.vendoritem), function (success, error) {
          if (success) {
            console.log('create success ', success,'---------',success.data);
            $scope.vendor.push(success.data);// this has real id
          }
        });

      } else {

      Vendor.update({id: $scope.vendoritem.id}, $scope.vendoritem, function (success, error) {
        console.log('uppdate success ', success);
        if (success) {
        }
      });
      }
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };




  //   var editrowTemplatex = '<i class="icon-edit edit" ng-click="openDialog(row.entity)"></i>';
  // this does edit in html
  // var editrowTemplate = '<a class="icon-edit edit" href="{{\'#/vendor/\'+row.entity.id}}">{{row.entity.id}}</a>';
  //var editrowTemplate = '<a class="icon-edit edit" href="{{\'#/vendor/\'+row.entity.id}}"></a>';
//{ field: 'edit', displayName: 'Edit', headerClass: 'Edit', width: '60', cellTemplate: editrowTemplate },
  //{ field: 'findPOS', displayName: 'POS', headerClass: 'po', width: '60', cellTemplate: editrowTemplatePOS },
  //{ field: 'findPOS', displayName: 'POPop', headerClass: 'po', width: '60', cellTemplate: editrowTemplateX },
  var displayDateTemplate = ' <div style="width:75;text-align: left" class="ngCellText colt{{$index}}">{{row.getProperty(col.field)}}</div>';
  var editrowTemplate = '<div style="text-align:center;"  class="ngCellText"><a class="icon-edit edit" href="{{\'/vendor/\'+row.entity.id}}"></a></div>';
  var editrowTemplatePOS = '<div style="text-align:center;"  class="ngCellText"><i class="icon-edit edit" ng-click="showPOS(row.entity)"></i>';

  var editrowTemplatePop = '<div style="text-align:center;"  class="ngCellText"><i class="icon-edit edit" ng-click="popVendor(row.entity)"></i>';

// problem with the way records get saved out of order for filtering
  $scope.colDefs = [

    { field: 'edit', displayName: 'Edit', headerClass: 'Edit', width: '60', cellTemplate: editrowTemplatePop },
    { field: 'findPOS', displayName: 'POS', headerClass: 'po', width: '60', cellTemplate: editrowTemplatePOS },


    { field: 'VendorNumber', displayName: 'VendorNumber', groupable: true, width: 100, visible: true },
    { field: 'CompanyName', displayName: 'CompanyName', groupable: false, width: 200},

    { field: 'Address', displayName: 'Address', groupable: true, width: 200 },
    { field: 'City', displayName: 'City', groupable: true, width: 160 },
    { field: 'State', displayName: 'State', groupable: true, width: 60 },
    { field: 'ZipCode', displayName: 'ZipCode', width: 100 },

//    { field: 'Country', displayName: 'Country', width: 100, groupable: true },ilter stops working ig included
    { field: 'Type', displayName: 'Type', width: 60 },
//   { field: 'CompanyAddition', displayName: 'CompanyAddition', width: 100 ,visible:false},// filter stops working ig included

    { field: 'AccountID', displayName: 'AccountID', groupable: false, width: 200},
    { field: 'VendorAccountId', displayName: 'VendorAccountId', groupable: false, width: 75},
    { field: 'contacts', displayName: 'contacts', groupable: false, width: 75, visible: false}

  ]


//  console.log(' $scope.vendor ',  $scope.myData, $scope.vendor)
  $scope.save = function () {
    angular.forEach(Object.keys($scope.vendor[0]), function (key) {
      //    $scope.colDefs.push({ field: key });
      console.log('key ', key);
    });
  };

//  $scope.filterOptions = {
//    filterText: '13594',          //filteringText
//    useExternalFilter: false
//  };
  $scope.filterOptions = {
    filterText: '',          //filteringText
    useExternalFilter: false
  };


  $scope.gridOptions1 = {
    data: 'vendor',
    multiSelect: false,
    //1primaryKey: 'ID',
    filterOptions: $scope.filterOptions,
    //1beforeSelectionChange: self.selectionchanging,
    columnDefs: 'colDefs',
    selectedItems: $scope.selections,
    enableColumnReordering: true,
    //enableRowReordering: true,// 1false
    showGroupPanel: true,
    showColumnMenu: true,
    maintainColumnRatios: true,
    groups: [],
    //plugins: [new ngGridCsvExportPlugin(csvOpts)],
    showFooter: true,
    enableCellSelection: true,
    enableRowSelection: true
//    afterSelectionChange: function (data) {
//      $scope.currentVendor = $scope.vendorIndex[data.entity.VendorID];
//    }
   // sortInfo: $scope.sortInfo
  };
//
//  $scope.gridOptions1 = {
//    data: 'po',
//    multiSelect: false,
//    // primaryKey: 'ID',
//    filterOptions: $scope.filterOptions,
//    // beforeSelectionChange: self.selectionchanging,
//    columnDefs: 'colDefs',
//    selectedItems: $scope.mySelections,
//    enableColumnReordering: true,
//    showGroupPanel: true,
//    showColumnMenu: true,
//    maintainColumnRatios: true, //f
//    groups: [],
//    //plugins: [new ngGridCsvExportPlugin(csvOpts)],
//    showFooter: true,
//    //enableColumnResize: true,
////
//
//    enableCellSelection: true,
//    enableRowSelection: true,
//    afterSelectionChange: function (data) {
//      $scope.currentVendor = $scope.vendorIndex[data.entity.VendorID];
//    }
//  };


  $scope.changeGrid = function (row) {
    $scope.colDefs = $scope.colDefs2;
//     $scope.colDefs.pop();
//    $scope.colDefs[1].visible=false;
//    $scope.colDefs[1].visible=false;


  }

  $scope.editPO = function (po) {


    console.log('this is when grid show pos for the vendor: edit po  ', po, po.id);
    $location.path('/po/' + po.id);
//    PO.find1(function (res) {
//      $scope.loading = false;
//    }, function (err) {
//      $rootScope.error = "Failed to fetch users.";
//      $scope.loading = false;
//    });
  }

        $scope.exportcols = [];// must be braces{} for object ; [] for array

        $scope.$on('ngGridEventColumns', function (newColumns) {
            //do work here to save the column information.
            $scope.exportcols = newColumns.targetScope.columns;
        });


        $scope.saveGrid = function (success, error) {
            GridResource.saveGrid( {'gridcol':$scope.exportcols,'user':$rootScope.user.username, 'gridname':'Vendor'}, function(success, error) {
                if (success) {
                    console.log('saveGrid success ', success);
                    $scope.message_err='';
                }
            });
        };

    }]);

var ModalVendorCtrl = function ($scope, $modalInstance, vendoritem,Vendor) {
console.log('ModalVendorCtrl ',vendoritem)
  $scope.vendor = vendoritem;
//  $scope.selected = {
//    item: $scope.items[0]
//  };

  $scope.ok = function () {
    //$modalInstance.close($scope.selected.item);
   $modalInstance.close($scope.vendor);///selected.item);
    console.log('$modalInstance ',$scope.vendor)
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

}


