'use strict'
Application.Controllers.controller('VendorEditCtrl', ['$rootScope', '$scope', 'Vendor','$location', '$http', '$routeParams','mongosailsHelper','Auth','lookupCache','$q',
    function($rootScope, $scope,Vendor,$location, $http,$routeParams,mongosailsHelper,Auth,lookupCache,$q){
      $scope.param='';
//      var termKey = "id";
//
//      $scope.$watch(function () {
//        return $location.search();
//      }, function () {
//        $scope.param = $location.search()[termKey] ;
//        console.log('$scope.param ' , $scope.param)
//      });
//
//      $scope.$watch('param', function (param) {
//        $location.search(termKey, param);
//
//        $scope.zip = param;//'07999';
//        $scope.fetch();
//      });
//      $scope.fetch = function () {
//
//        //progressbar.start();
//       // console.log('fetch ', $scope.x);
//
//        console.log('$scope.param',$scope.param)
//        if ($scope.param === undefined) $scope.param = '0';
//
//        //Users.find1({id: $scope.zip, di: $scope.miles, first: $scope.first, last: $scope.last, practice: $scope.practice, specialty: $scope.specialty}, function (res) {
//
//          console.log('res ', res);//.length);//,Users);
////          $scope.dentists = res;
////          progressbar.complete();
////          $scope.loading = false;
//        }, function (err) {
//          //$rootScope.error = "Failed to fetch users.";
//          //$scope.loading = false;
//        };
//


//
//      var deferred = Q.defer();
//      var vendorlist;
//      Vendor.find({
//      }).sort('VendorNumber ASC').done(function (err, vendors) {
//          if (err) {
//            deferred.reject(err);
//            return next(err);
//          } else {
//            vendorlist = vendors;//.toArray()
//            //deferred.resolve(res.json(vendorlist));
//            deferred.resolve(vendorlist);
//            console.log('Vendor.find with filter... ', vendorlist[10]);//, res.json(vendorlist[10]));
//          }
//        });

//      var deferred = $q.defer();
//      //var idPromise;
//      var idPromise=  $routeParams.id(function (err, id)
//      {
//          if (err) {
//            deferred.reject(err);
//            return next(err);
//          } else {
//            idPromise = id;
//            deferred.resolve(idPromise);
//            console.log('promise ... ',idPromise);
//          }
//        });
//
//

      console.log(' VendorEditCtrl ',$scope.param );//,$routeParams.VendorNumber)


//    if ($routeParams.VendorNumber) {
//        console.log('in find1 ')
//        $scope.vendor = Vendor.find1({id:$routeParams.VendorNumber});
//        //console.log('in find1 - a  ', $scope.vendor)
//    }

           $scope.$watch('param', function (param) {

             if ($scope.param == 0) {
               $scope.mess = 'New Vendor'
             }
             else {
               $scope.mess = ':';
               $scope.vendor = Vendor.find1({id:$routeParams.VendorNumber});
             }


           });



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

        if ($scope.param == 0) {
          console.log('save create ',$scope.vendor)
          Vendor.create(0, ( $scope.vendor), function (success, error) {
            //console.log('create success ', success, error, success.data.POID);
            if (success.data.VendorID !== 0) {
              var vendorPromise = lookupCachePO.resetVendor();// look to refactor
              $location.path('/vendor');
            }
          });
        } else {
          var id = $scope.vendor.id;
          console.log('uppdate success ', id);//success, error, success.data.POID);
          Vendor.update( {id:$scope.vendor.id}, $scope.vendor, function (success, error) {
            console.log('success, error ',success, error)
            if (success) {
              var vendorPromise = lookupCache.resetVendors();
              $location.path('/vendor');
            }
            });


        }
      };


}]);






Application.Controllers.controller('VendorCtrl', ['$rootScope', '$scope', 'Vendor','$location', '$http','Auth','lookupCache', function($rootScope, $scope,Vendor,$location, $http,Auth,lookupCache){
    console.log(' VendorCtrl ')

  $scope.new = function (user) {
    //$location.path('/vendor/'+row.id);
    $location.path('/vendor/0');
  };
    $scope.testRoute = function(success, error) {
        console.log ('testRoute ');//,status.status);
        $http.post('/meetings/10/11/12',   $scope.colors).success(function(status){
                    if (status.status='success') {
                       console.log ('status ',status.status);
                        //  $location.path('/froiprint');
                    } }).error(error);
    }

    $scope.myData = [];
    $scope.showGrid = true;
    $scope.mySelections = [];
    $scope.navType = 'pills';

  console.log('Vendor1')
  var vendorPromise = lookupCache.getVendors();
  vendorPromise.then(function(cache) {
    console.log('VendorCtrl::inside lookup.then', cache)
    $scope.vendor = cache.data;
    console.log('11111')
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


   //   var editrowTemplatex = '<i class="icon-edit edit" ng-click="openDialog(row.entity)"></i>';
   // this does edit in html
  // var editrowTemplate = '<a class="icon-edit edit" href="{{\'#/vendor/\'+row.entity.id}}">{{row.entity.id}}</a>';
  //var editrowTemplate = '<a class="icon-edit edit" href="{{\'#/vendor/\'+row.entity.id}}"></a>';
  var displayDateTemplate = ' <div style="width:75;text-align: left" class="ngCellText colt{{$index}}">{{row.getProperty(col.field)}}</div>';
  var editrowTemplate = '<a class="icon-edit edit" href="{{\'/vendor/\'+row.entity.id}}"></a>';


  // this does edit in js
  //   var editrowTemplate = '<i class="icon-edit edit" ng-click="editrow(row.entity)"></i>';


//  $scope.filteringText = '';
  $scope.filterOptions = {
    filterText: '',          //filteringText
    useExternalFilter: false
  };

  $scope.colDefs = [
    { field: 'edit', displayName: 'Edit', headerClass: 'Edit', width: '60', cellTemplate: editrowTemplate },
    { field: 'VendorNumber', displayName: 'VendorNumber', groupable: false, width: 60 },
    { field: 'CompanyName', displayName: 'CompanyName', groupable: false, width: 200},
    { field: 'Address', displayName: 'Address', groupable: true, width: 200 },
    { field: 'State', displayName: 'State', groupable: true, width: 60 },
    { field: 'ZipCode', displayName: 'ZipCode', width: 100 },
    //        { field: 'DateofLoss', displayName: 'Date of Loss', width: 100  }, //   cellFilter: " moment:'dddd'" hh:mm a ddd Do not display currency symbol},
//    { field: 'Country', displayName: 'Country', width: 100, groupable: true },
//    { field: 'Type', displayName: 'Type', width: 60 },
//    { field: 'CompanyAddition', displayName: 'CompanyAddition', groupable: true, width: 20},
//    { field: 'AccountID', displayName: 'AccountID', groupable: false, width: 200},
//    { field: 'VendorAccountId', displayName: 'VendorAccountId', groupable: false, width: 75},
//    { field: 'contacts', displayName: 'contacts', groupable: false, width: 75, visible: false}
  ]




//  console.log(' $scope.vendor ',  $scope.myData, $scope.vendor)
    $scope.save = function(){
        angular.forEach(Object.keys($scope.vendor[0]), function(key){
            //    $scope.colDefs.push({ field: key });
            console.log('key ',key);
        });
    };


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

  $scope.changeGrid = function (row){
    $scope.colDefs = $scope.colDefs2;
//     $scope.colDefs.pop();
//    $scope.colDefs[1].visible=false;
//    $scope.colDefs[1].visible=false;


  }

  $scope.editrow = function (row){
    // im using the html href
        alert (row)
        $location.path('/vendor/'+row.id);// 5206742a1e8a8530c80c172b');

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



