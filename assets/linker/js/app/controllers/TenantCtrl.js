'use strict'
angular.module('crmApp')
.controller('TenantCtrl', ['$rootScope', '$scope', 'Tenant', '$location', '$http', 'Auth', 'lookupCache', 'lookupCacheTenant', '$modal', '$log','GridResource',
    function ($rootScope, $scope, Tenant, $location, $http, Auth, lookupCache, lookupCacheTenant, $modal, $log,GridResource) {
  console.log(' TenantCtrl ')
  $scope.myData = [];
  $scope.showGrid = true;
  $scope.mySelections = [];
  $scope.navType = 'pills';

  $scope.refresh = function () {
      lookupCacheTenant.resetTenants;

  }


  $scope.showPOS = function (row) {
    var poPromise = lookupCachePO.getPOs();
    poPromise.then(function (val) {
      var id = row.TenantID;//'13594';//
      console.log('id ', id)
      var events = _.filter(val.data, function (itm) {
        return itm.TenantID == id
      })
      $scope.pords = events;
      console.log('$scope.pords... ', $scope.pords)
    })
      .catch(function (err) {
        console.error('po failed', err)
      });
  }
//////////////////////
  var tenantPromise = lookupCacheTenant.getTenants();
  tenantPromise.then(function (cache) {
    console.log('TenantCtrl::inside lookup.then', cache)
    $scope.tenant = cache.data;
    console.log('$scope.tenant ',$scope.tenant)
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
    $scope.editableTenant = new Tenant();
  };

  $scope.addTenant = function () {
    $scope.editableTenant.$save();
    $scope.tenant.push($scope.editableTenant);
    $scope.toggleForm();
  };

  $scope.deletetenant = function (row) {
    Tenant.delete({id: $scope.selectedRow.id});
    $scope.tenant.splice($scope.tenant.indexOf($scope.selectedRow), 1);

  };

  $scope.popTenant = function (tenant1) {
    console.log('tenant  ', tenant1);// user[0]);//.id);

    if (tenant1 === 'new') {
      $scope.tenantitem = {};
      $scope.newtenant = 1;
    } else {
      $scope.newtenant = 0;
      $scope.tenantitem = tenant1;//Tenant.find1({id: $routeParams.TenantNumber});
    }
    var modalInstance = $modal.open({
      templateUrl: '/partials/myModalTenant',
      controller: ModalTenantCtrl,

      resolve: {
        tenantitem: function () {
          return $scope.tenantitem;
        }
      }
    });
    modalInstance.result.then(function (selectedItem) {
    //
    //      console.log('result back selectedItem',selectedItem);
    //      console.log('result back tenantitem',$scope.tenantitem);
    //      console.log('result back $scope.tenant',$scope.tenant);


      //dont use id as a switch if (id === 0) {
      // id should not be assigned when create new
      if ($scope.newtenant === 1) {
        console.log('save create ', $scope.tenantitem);
        Tenant.create(0, ( $scope.tenantitem), function (success, error) {
          if (success) {
            console.log('create success ', success, '---------', success.data);
            $scope.tenant.push(success.data);// this has real id
          }
        });

      } else {

        Tenant.update({id: $scope.tenantitem.id}, $scope.tenantitem, function (success, error) {
          console.log('uppdate success ', success);
          if (success) {
          }
        });
      }
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };
        GridResource.getGrid({'gridcol':$scope.exportcols,'user':$rootScope.user.username, 'gridname':'Tenant'}).$promise
            .then(function (response) {

                //console.log('$scope.colDefs ',response.colDefs)
                $scope.colDefs = response.colDefs;
            })
            .catch(function (err) {
                console.error('catch::myDefs ', err);
                $scope.colDefs = [



                        { field: 'edit', displayName: 'Edit', headerClass: 'Edit', width: '60', cellTemplate: editrowTemplatePop },
                        { field: 'findPOS', displayName: 'POS', headerClass: 'po', width: '60', cellTemplate: editrowTemplatePOS },


                        { field: 'TenantNumber', displayName: 'TenantNumber', groupable: true, width: 100, visible: true },
                        { field: 'CompanyName', displayName: 'CompanyName', groupable: false, width: 200},
                        { field: 'Floor', displayName: 'Floor', groupable: true, width: 200},
                        { field: 'Address', displayName: 'Address', groupable: true, width: 200 },
                        { field: 'City', displayName: 'City', groupable: true, width: 160 },
                        { field: 'State', displayName: 'State', groupable: true, width: 60 },
                        { field: 'ZipCode', displayName: 'ZipCode', width: 100 },

//    { field: 'Country', displayName: 'Country', width: 100, groupable: true },ilter stops working ig included
                        { field: 'Type', displayName: 'Type', width: 60 },
                        { field: 'CompanyAddition', displayName: 'CompanyAddition', width: 100, visible: false},// filter stops working ig included

                        { field: 'Terms', displayName: 'Terms', groupable: false, width: 200},
                        { field: 'Attn', displayName: 'Attn', groupable: false, width: 200},
                        { field: 'TaxExempt', displayName: 'TaxExempt', groupable: false, width: 200},

                        { field: 'contacts', displayName: 'contacts', groupable: false, width: 75, visible: false},
                        { field: 'invoices', displayName: 'invoices', groupable: false, width: 75, visible: false}


                    ]

            });

  var displayDateTemplate = ' <div style="width:75;text-align: left" class="ngCellText colt{{$index}}">{{row.getProperty(col.field)}}</div>';
  var editrowTemplate = '<div style="text-align:center;"  class="ngCellText"><a class="icon-edit edit" href="{{\'/tenant/\'+row.entity.id}}"></a></div>';
  var editrowTemplatePOS = '<div style="text-align:center;"  class="ngCellText"><i class="icon-edit edit" ng-click="showPOS(row.entity)"></i>';

  var editrowTemplatePop = '<div style="text-align:center;"  class="ngCellText"><i class="icon-edit edit" ng-click="popTenant(row.entity)"></i>';

// problem with the way records get saved out of order for filtering
  $scope.colDefs = [

    { field: 'edit', displayName: 'Edit', headerClass: 'Edit', width: '60', cellTemplate: editrowTemplatePop },
    { field: 'findPOS', displayName: 'POS', headerClass: 'po', width: '60', cellTemplate: editrowTemplatePOS },


    { field: 'TenantNumber', displayName: 'TenantNumber', groupable: true, width: 100, visible: true },
    { field: 'CompanyName', displayName: 'CompanyName', groupable: false, width: 200},
    { field: 'Floor', displayName: 'Floor', groupable: true, width: 200},
    { field: 'Address', displayName: 'Address', groupable: true, width: 200 },
    { field: 'City', displayName: 'City', groupable: true, width: 160 },
    { field: 'State', displayName: 'State', groupable: true, width: 60 },
    { field: 'ZipCode', displayName: 'ZipCode', width: 100 },

//    { field: 'Country', displayName: 'Country', width: 100, groupable: true },ilter stops working ig included
    { field: 'Type', displayName: 'Type', width: 60 },
    { field: 'CompanyAddition', displayName: 'CompanyAddition', width: 100, visible: false},// filter stops working ig included

    { field: 'Terms', displayName: 'Terms', groupable: false, width: 200},
     { field: 'Attn', displayName: 'Attn', groupable: false, width: 200},
    { field: 'TaxExempt', displayName: 'TaxExempt', groupable: false, width: 200},

    { field: 'contacts', displayName: 'contacts', groupable: false, width: 75, visible: false},
    { field: 'invoices', displayName: 'invoices', groupable: false, width: 75, visible: false}


  ]


//  console.log(' $scope.tenant ',  $scope.myData, $scope.tenant)
  $scope.save = function () {
    angular.forEach(Object.keys($scope.tenant[0]), function (key) {
      //    $scope.colDefs.push({ field: key });
      console.log('key ', key);
    });
  };


  $scope.filterOptions = {
    filterText: '',          //filteringText
    useExternalFilter: false
  };


  $scope.gridOptions1 = {
    data: 'tenant',
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

  };


  $scope.editPO = function (po) {


    console.log('this is when grid show pos for the tenant: edit po  ', po, po.id);
    $location.path('/po/' + po.id);

  }
        $scope.exportcols = [];// must be braces{} for object ; [] for array

        $scope.$on('ngGridEventColumns', function (newColumns) {
            //do work here to save the column information.
            $scope.exportcols = newColumns.targetScope.columns;
        });

        $scope.saveGrid = function (success, error) {
            GridResource.saveGrid( {'gridcol':$scope.exportcols,'user':$rootScope.user.username, 'gridname':'Tenant'}, function(success, error) {
                if (success) {
                    console.log('saveGrid success ', success);
                    $scope.message_err='';
                }
            });
        };
}]);

var ModalTenantCtrl = function ($scope, $modalInstance, tenantitem, Tenant) {
  console.log('ModalTenantCtrl ', tenantitem)
  $scope.tenant = tenantitem;
//  $scope.selected = {
//    item: $scope.items[0]
//  };

  $scope.ok = function () {
    //$modalInstance.close($scope.selected.item);
    $modalInstance.close($scope.tenant);///selected.item);
    console.log('$modalInstance ', $scope.tenant)
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };


}
