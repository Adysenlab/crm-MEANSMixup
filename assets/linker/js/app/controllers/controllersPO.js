'use strict'
Application.Controllers.controller('PoEditCtrl', ['$rootScope', '$scope', '$location', '$http', '$routeParams', 'mongosailsHelper',
  '$q', 'lookupCache', 'lookupCachePO', 'lookupCacheAcct', '$timeout', 'PO',
  function ($rootScope, $scope, $location, $http, $routeParams, mongosailsHelper, $q, lookupCache, lookupCachePO, lookupCacheAcct, $timeout, PO) {
    // PO comes from app  .factory('PO', ['$resource', function ($resource) {
    //var param = $routeParams.id;//POID;
    $scope.param = $routeParams.id;//POID;
    $scope.thisisnotdup=null;
    //if ( (param==0) || (param===' 0') )
    if ($scope.param == 0) {
      $scope.mess = 'Create New PO'
    }
    else {
      $scope.mess = 'Edit PO ';
    }

    console.log('start :', $scope.param  + ':', $scope.mess)
    var acctPromise = lookupCacheAcct.getAccounts();
    acctPromise.then(function (cache) {
      $scope.account = cache.data;
      $scope.accountIndex = cache.combo;
      //console.log('$scope.accounts ', $scope.account)
      //console.log('$scope.accountIndex ', $scope.accountIndex)
    })
      .catch(function (err) {
        console.error('accounts failed', err)
      });

    var poPromise = lookupCachePO.getPOs();
    poPromise.then(function (val) {
      //  console.log('====val',val);
      // val = all pos retured by promise
      // find does the param match
      if ($scope.param != 0) {
      $scope.po = val.data;
      var po1 = _.find(val.data, function (po1) {
        return po1.id == $scope.param ;
      });

      $scope.po1 = po1;
      //if (param!==0) $scope.mess ='Edit PO '+ $scope.po1.POID;
      //console.log('param mess ',param,$scope.mess)
      console.log('============$scope.po ', $scope.po1);

      } else
      {

        $scope.po1={};
        $scope.po1.Freight=0;
     //   $scope.po1.details={};

//        $scope.po1.details.push({'Quantity': $scope.detail.qty * 1, 'Desc': $scope.detail.desc, 'UnitPrice': $scope.detail.unitprice * 1,
//          'AccountID': $scope.currentAccountDetail.AccountID, 'AccountName': $scope.currentAccountDetail.Desc, 'LineItemTax': taxamt, 'LineItemTot': lineTot});
        $scope.po1.SubTotal = 0;
        $scope.po1.TaxAmount = 0;
        $scope.po1.POTotal = 0;
        $scope.po1.TaxPcnt =.0875;
        $scope.po1.details = [];
     //   $scope.po1.details.push({'Quantity':0, 'Desc': 'test', 'UnitPrice':0,
     //     'AccountID': 0, 'AccountName': 'test', 'LineItemTax': 0, 'LineItemTot': 0});

        console.log('======create======$scope.po ', $scope.po1);


      }


    })
      .catch(function (err) {
        console.error('po failed', err)
      });

    var vendorPromise = lookupCache.getVendors();
    vendorPromise.then(function (cache) {
      console.log('POCtrl::inside lookup.then', cache)
      $scope.vendor = cache.data;
      $scope.vendorIndex = cache.combo;
    });

    $q.all([poPromise, vendorPromise, acctPromise])
      .then(function () {
        // lets delete added fields here
        if ($scope.param!=0){
        $scope.poOrigAll = angular.copy($scope.po1);

      delete $scope.po1.vendorName;
      delete $scope.po1.acctDesc;
      delete $scope.po1.newValue;


        $scope.poOrig = angular.copy($scope.po1);// for valid state
        //console.log('po poOrig :: ', $scope.poOrig)
        //console.log('po after delete 3 :: ', $scope.po1)
        $scope.currentVendor = $scope.vendorIndex[$scope.po1.VendorID];
        $scope.currentAccount = $scope.accountIndex[$scope.po1.AccountID];
        $scope.currentAccountDetail = $scope.accountIndex[$scope.po1.AccountID];
        //scope.detail.AccountID =  $scope.accountIndex[$scope.po1.AccountID];
        //console.log('currentVendor:: ', $scope.currentVendor)
        // console.log('currentAccount:: ', $scope.currentAccount)
        $scope.myForm.$invalid = false;
        $scope.checkV();
      } else {
//          $scope.po1={};
//          $scope.po1.details={};

          $scope.myForm.$invalid = true;
        }




        //console.log('the total vals ',$scope.po1.Freight ,$scope.po1.TaxAmount, $scope.po1.SubTotal)

        // var s1 = ($scope.po1.Freight * 1) + ($scope.po1.TaxAmount * 1) + ($scope.po1.SubTotal * 1);
        // console.log('the total ', s1)
        // $scope.po1.POTotal = s1;


        //replaceByValue('POType','82','PO');// this is an example if we wanted to use client side replace of codes
        //   $scope.mess ='Create New PO '
        // } else
        // {
        // }

      });
    //} // end of edit
    $scope.checkV = function () {
      var VendorInvNum = $scope.po1.VendorInvNum;
     console.log('VendorInvNum:: ',VendorInvNum)
 //     $rootScope.error = "This is a good vendorInvNum"
//      var match = _.find($scope.po, function (itm) {
//        console.log('Find VendorInvNum:: ',VendorInvNum)
//        $rootScope.error = "Another PO exists with this VendorInvNum!";
//        // alert('err ',$rootScope.error)
//        return itm.VendorInvNum == VendorInvNum;
//
//      })
     //$rootScope.error = null;
      $scope.thisisnotdup='1';
      var ct = 0;
      angular.forEach($scope.po, function (s,err) {
        ct += 1;
        //        console.log('s ', ct + ':', s.VendorInvNum)
        $rootScope.error = null;
        // checck all but current
        if ((s.VendorInvNum == VendorInvNum) && (s.POID != $scope.po1.POID)  )
        {
          // alert('Another PO exists with this VendorInvNum: ' + ct)
          //$rootScope.error = "Another PO "+ s.VendorInvNum+" exists with this VendorInvNum!";
          $scope.thisisnotdup=null;
          $rootScope.error = "Failed to login!"+err;
          console.log('loop VendorInvNum:: ', ct + ':', s.VendorInvNum,$rootScope.error );

        }
      })
     //

    console.log('  $scope.thisisnotdup',  $scope.thisisnotdup);


    }
    $scope.total = function () {
      //      // not use anymore
      //      console.log('s1 ')
      //      //  return s1
      //      var tot = 0;
      //      var tax = 0;
      //      var ext = 0;
      //      angular.forEach($scope.po1.details, function (s) {
      //        ext = s.LineItemTot;// (s.Quantity) * (s.UnitPrice);
      //        tax = s.LineItemTax;// (s.Quantity) * (s.UnitPrice);
      //        tax += tax;
      //        ext += ext;
      //      });
      //      ;
      //      $scope.po1.SubTotal = ext;//tot;
      //      $scope.po1.TaxAmount = tax;
      //      tot = ext + tax + $scope.po1.Freight;
      //      return tot;
    };
    $scope.isClean = function () {
      return angular.equals($scope.po1, $scope.poOrig);
    }
    $scope.isSaveDisabled = function () {
      return $scope.myForm.$invalid;
    };

    $scope.setCurrentAccount = function (account) {
      $scope.po1.AccountID = account.AccountID;
      $scope.currentAccountDetail = account;//.AccountID;
      if ($scope.param!=0){
      $scope.detail.AccountID = account.AccountID;
      }
    };
    $scope.setCurrentVendor = function (vendor) {
      $scope.po1.VendorID = vendor.VendorID;// combo
      //console.log('in setCV ', $scope.po1.VendorID);
    };

    $scope.setCurrentAccountDetail = function (account) {
// $scope.CurrentAccountDetail
      $scope.detail.AccountID = account.AccountID;
      console.log('  $scope.detail.AccountID  ', $scope.detail.AccountID)

    };

    $scope.handleRowSelectionDetail = function (row) {
      console.log('  row  ', row)

    }

    $scope.addDetail = function () {
      console.log('aaddDetail ', $scope.currentAccountDetail)
      // console.log('id  ',  $scope.currentAccountDetail.AccountID)
      // = account.AccountID;
      //alert($scope.selContact);
      //   $scope.vendor.contacts.push($scope.color);//selContact);
      //console.log('a ', !angular.isArray($scope.po1.details))
      if (!angular.isArray($scope.po1.details)) {
        console.log('in detail create')
        $scope.po1.details = [];
      }
      console.log('  $scope.po1.TaxPcnt ', $scope.po1);// $scope.po1.TaxPcnt)
      // dont tax if acct is flagged
      var taxamt = 0;
      if ($scope.po1.TaxPcnt != undefined) {
        taxamt = (  ($scope.po1.TaxPcnt) * ($scope.detail.unitprice * $scope.detail.qty));
        taxamt = (Math.round(taxamt * 100) / 100);
      }

      var lineTot = ($scope.detail.unitprice * $scope.detail.qty);// keep tax sep
      lineTot = (Math.round(lineTot * 100) / 100);// rounds
      // * 1 casts the value as number
      $scope.po1.details.push({'Quantity': $scope.detail.qty * 1, 'Desc': $scope.detail.desc, 'UnitPrice': $scope.detail.unitprice * 1,
        'AccountID': $scope.currentAccountDetail.AccountID, 'AccountName': $scope.currentAccountDetail.Desc, 'LineItemTax': taxamt, 'LineItemTot': lineTot});
      var subt = (Math.round(($scope.po1.SubTotal + lineTot) * 100) / 100); //
      var taxt = (Math.round(($scope.po1.TaxAmount + taxamt) * 100) / 100); //
      var tot = (Math.round(($scope.po1.POTotal + subt + taxt) * 100) / 100); //
      console.log('  subt  taxt, tot , frt', subt, taxt, tot,$scope.po1.Freight);
      $scope.po1.SubTotal = subt;
      $scope.po1.TaxAmount = taxt;
      $scope.po1.POTotal = tot + $scope.po1.Freight;


    }
    $scope.edit = function (row) {
      console.log(' You are about to delete ', row);
      alert(' You are about to delete ' + row)
//      $location.path('/user/'+ $rootScope.userid);
//      User.find1(function (res) {
//        console.log('controllerUser res ', res);
//
//        $scope.loading = false;
//      }, function (err) {
//        $rootScope.error = "Failed to fetch users.";
//        $scope.loading = false;
//      });
    };


    $scope.save = function () {
      //console.log('in sav ')
//      var s1 = ($scope.po1.Freight * 1) + ($scope.po1.TaxAmount * 1) + ($scope.po1.SubTotal * 1);
//      console.log('the total ', s1)
//      $scope.po1.POTotal = s1;
      //$scope.checkV();
      if ($scope.param == 0) {
          console.log('save create ',$scope.po1)
          PO.create(0, ( $scope.po1), function (success, error) {
          //console.log('create success ', success, error, success.data.POID);
          if (success.data.POID !== 0) {
            var poPromise = lookupCachePO.resetPO();// look to refactor
            $location.path('/po');
          }
        });
      } else {
        var id = $scope.po1.id;
        ////delete $scope.po.id; // if i delete update does not work      //console.log('back  - ',$scope.po1,id);
        //this stoped working // PO.updateWrapped(({id: id}, $scope.po1)); //$scope.po or tmp updates json without the id
        PO.update(({id: id}, $scope.po1)); // updates json without the id    // console.log(' $scope.poOrig.newValue;:: ',  $scope.poOrig.newValue)
        // place values back from poview
        // store object vendor
        var partVendor = {};
        partVendor.VendorID=$scope.currentVendor.VendorID;
        partVendor.CompanyName=$scope.currentVendor.CompanyName;

        $scope.po1.vendor = partVendor;// $scope.currentVendor; limit the fields stored

        $scope.po1.vendorName = $scope.currentVendor.CompanyName;
        $scope.po1.acctDesc = $scope.currentAccount.Desc;
        $scope.po1.newValue = 'test';//  $scope.poOrig.newValue; // just for test
        $location.path('/po');
      }
    };
//
//    $scope.create = function (success, error) {
//      // console.log('in create po')
//      // $scope.new = {};
//      // $scope.new.PONumber=111111;
//      // $scope.new.POID=111111;
//      // var id = $scope.po1.id;
//      // $scope.po.push($scope.new);//{'username':'fillname'});
//      // $scope.po.push({'PONumber':'111111'});
//      // PO.create(  $scope.new ); // updates json without the id
//      // var s = '/po/create?PONumber='+$scope.po1.new+'&POID='+$scope.po1.new+'&AccountID='+$scope.currentAccount.AccountID+'&VendorID=' + $scope.currentVendor.VendorID+'&Comments=' + $scope.po1.Comments;
//      // create?username='+$scope.user.username+'&name='+$scope.user.name+'&email='+$scope.user.email+'&password='+$scope.user.password+'&role=4';//+$scope.user.role;
//      // console.log('po create ',s);
//
//// this works!
////      $http.post(s,   $scope.new).success(function(newpo){
////        if (newpo.POID!==0) {
////          console.log ('success ',newpo);
////          //  $location.path('/froiprint');
////          var poPromise = lookupCachePO.resetPO();
////          $location.path('/po');
////        } }).error(error);
////     console.log('this is best  PO.create ', $scope.po1)
//
//      PO.create(0, ( $scope.po1), function (success, error) {
//        //  console.log ('success ',success,error,success.data.POID);
//        if (success.data.POID !== 0) {
//          var poPromise = lookupCachePO.resetPO();// look to refactor
//          $location.path('/po');
//        }
//      });
//    };
////    $scope.save = function () {
////      //var tmp = angular.copy($scope.vendor);  // delete tmp.id; or   // delete tmp('id');// alt
////      //Vendor.update ({id:$scope.vendor.id},{Address:$scope.vendor.Address,City:$scope.vendor.City} ); // updates address & city
////      //Vendor.update ({id:$scope.vendor.id},{vendor:$scope.vendor});// this will embed 'vendor... in documnet
////      //Vendor.update ( {id:$scope.vendor.id} );// this does nothhing
////
////       // console.log('in save  updateWrapped ', $scope.currentAccount)
////
////      $scope.tmp = '';
////      //  $scope.po=$scope.po.slice(0,$scope.po.length-3);
////      //   var a= $scope.po.toArray().splice(0,18);
////      //$scope.po .slice(0,tmp.length-3);
////     // console.log('b4  - ',$scope.po.id);
////
////    //  var tmp = mongosailsHelper.deleteID($scope.po);// object id becomes a new field id
////      // var tmp = mongosailsHelper.deleteID(a);// object id becomes a new field id
////
////      //  delete tmp.vendorName;//      delete tmp.acctDesc;//      delete tmp.newValue;//      delete $scope.po.vendorName;//      delete $scope.po.acctDesc;//      delete $scope.po.newValue;
////      var id = $scope.po1.id;
////      //   delete $scope.po.id; // if i delete update does not work
////
////     // I can use default update or updateWrapped but in either case I must not delete id
////      console.log('back  - ',$scope.po1,id);
////      // PO.updateWrapped(({id: id}, $scope.po)); //$scope.po or tmp updates json without the id
////
////      //delete $scope.po.id; // if i delete update does not work
////      PO.update(({id: id},  $scope.po1)); // updates json without the id
////      console.log(' $scope.poOrig.newValue;:: ',  $scope.poOrig.newValue)
////
////      // place values back from poview
////      $scope.po1.vendorName =   $scope.currentVendor.CompanyName;
////      $scope.po1.acctDesc =  $scope.currentAccount.Desc;
////      $scope.po1.newValue =    $scope.poOrig.newValue; // just for test
////
////      $location.path('/po');
////    };
//

////////////////////////////// date

    // var DatepickerDemoCtrl = function ($scope, $timeout) {
    $scope.today = function () {
      $scope.dt = new Date();
    };
    $scope.today();

    $scope.showWeeks = true;
    $scope.toggleWeeks = function () {
      $scope.showWeeks = !$scope.showWeeks;
    };

    $scope.clear = function () {
      $scope.dt = null;
    };

    // Disable weekend selection
    $scope.disabled = function (date, mode) {
      return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    };

    $scope.toggleMin = function () {
      $scope.minDate = ( $scope.minDate ) ? null : new Date();
    };
    $scope.toggleMin();

    $scope.open = function () {
      console.log('open')
      $timeout(function () {
        $scope.opened = true;
      });
    };
    $scope.open2 = function () {
      console.log('open2')
      $timeout(function () {
        $scope.opened2 = true;
      });
    };

    $scope.dateOptions = {
      'year-format': "'yy'",
      'starting-day': 1
    };


//////////////////////////////////////

    $scope.cancel = function () {
//      alert('cancel '+$scope.poOrigAll.acctDesc)
//      console.log('in cancel ')
//      //$scope.po1 = angular.copy($scope.poOrig);
////      $scope.po1.vendorName =   $scope.poOrigAll..CompanyName;
////      $scope.po1.acctDesc =  $scope.currentAccount.Desc;
////      $scope.po1.newValue =    $scope.poOrig.newValue; // just for test
////      $scope.po1.Freight=$scope.poOrigAll.Freight;
////     console.log('$scope.poOrigAll;',$scope.poOrigAll)
//      $scope.po1 =$scope.poOrigAll;
//
//      // place values back from poview
//      $scope.po1.vendorName =   $scope.poOrigAll.vendorName;
//      $scope.po1.acctDesc =  $scope.poOrigAll.acctDesc;
//      $scope.po1.newValue =    $scope.poOrig.newValue; // just for test
//
//
      var poPromise = lookupCachePO.resetPO();

      $location.path('/po');
// $location.path('/vendor');
// cancel not refreshing data properly
// $location.path('/');
    };


    $scope.addContact = function () {
      //if($scope.selTeamMember) {
      // $scope.editableFood.$save();
      // $scope.food.push($scope.editableFood);
      //    $scope.vendor.contacts.push('jrt');//$scope.selContact);
      alert($scope.selContact);
      //   $scope.vendor.contacts.push($scope.color);//selContact);
      $scope.vendor.contacts.push({'name': $scope.selContact});
      // $scope.vendor.contacts.push($scope.selContact);
      // $scope.selContact = undefined;
    }

  }]);

Application.Controllers.controller('POCtrl', ['$rootScope', '$scope', 'PO', '$location', '$http', 'Auth', 'comboHelper' ,
  'Vendor' , '$q', 'lookupCache', 'lookupCachePO', 'lookupCacheAcct',
  function ($rootScope, $scope, PO, $location, $http, Auth, comboHelper, Vendor, $q, lookupCache, lookupCachePO, lookupCacheAcct) {
    //console.log(' This is POCtrl 6')
    //$scope.myData = [];
    $scope.showGrid = true;
    $scope.setCurrentPO = [];
    $scope.navType = 'pills';

    //$scope.po = PO.stuffed();// findAll();//    // this is our own custom method
    //var poPromise = PO.stuffed().$promise; // this works but below is cache
    //,'Account',   $scope.acct = Account.findAll();//
    //console.log('$scope.acct ', $scope.acct)
    var acctPromise = lookupCacheAcct.getAccounts();
    acctPromise.then(function (cache) {
      $scope.account = cache.data;
      $scope.accountIndex = cache.combo;
      //console.log('$scope.accounts ', $scope.account)
      //console.log('$scope.accountIndex ', $scope.accountIndex)
    })
      .catch(function (err) {
        console.error('accounts failed', err)
      });

    var poPromise = lookupCachePO.getPOs();
    poPromise.then(function (val) {
      $scope.po = val.data;
      // console.log('$scope.po ', $scope.po)
    })
      .catch(function (err) {
        console.error('po failed', err)
      });

    var vendorPromise = lookupCache.getVendors();
    vendorPromise.then(function (cache) {
      console.log('POCtrl::inside lookup.then', cache)
      $scope.vendor = cache.data;
      $scope.vendorIndex = cache.combo;

    });

    $q.all([poPromise, vendorPromise, acctPromise])
      .then(function () {
        $scope.currentVendor = $scope.vendorIndex[$scope.po[0].VendorID];
        $scope.currentAccount = $scope.accountIndex[$scope.po[0].AccountID];
        console.log('currentVendor:: ', $scope.currentVendor)
        console.log('currentAccount:: ', $scope.currentAccount)
        replaceByValue('POType', '82', 'PO');// this is an example if we wanted to use client side replace of codes
      });
    $scope.setCurrentPO = function (po) {
      console.log('currentPO  ', po);
      console.log('po.VendorNumber  ', po.VendorID);
      $scope.currentVendor = $scope.vendorIndex[po.VendorID];
    };

    $scope.editrow = function (row) {
      // this is just an object
      $scope.currentPO = row;
      console.log('in ed ', $scope.currentPO);
      $scope.setCurrentPO(row);
    }

    $scope.new = function (user) {
      //   $rootScope.userid = 0;//user.id;
      //$scope.po.push({'POID':0});
      // console.log('  controllerUser \ $rootScope.userid  ', $rootScope.userid);
      $location.path('/po/0');
    };

    /**
     * The function searches over the array by certain field value,
     * this can be enhanced with underscore but serves as a good example
     * and replaces occurences with the parameter provided.
     *
     * @param string field Name of the object field to compare
     * @param string oldvalue Value to compare against
     * @param string newvalue Value to replace mathes with
     */
    function replaceByValue(field, oldvalue, newvalue) {
      for (var k = 0; k < $scope.po.length; ++k) {
        if (oldvalue == $scope.po[k][field]) {
          // $scope.po[k][field] = newvalue ; //an example of replace but it will fup the update
          $scope.po[k].newValue = $scope.po[k][field] + '/' + oldvalue + '/' + newvalue; // add to row
        }
      }
      // return  $scope.po;
    }

//    $scope.editrow = function (row) {
//      alert(row)
//      $location.path('/vendor/' + row.id);// 5206742a1e8a8530c80c172b');
//
//    }

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

    $scope.addPO = function () {
      $scope.editablePO.$save();
      $scope.po.push($scope.editablePO);
      $scope.toggleForm();
    };

    $scope.deletevendor = function (row) {
      PO.delete({id: $scope.selectedRow.id});
      $scope.po.splice($scope.po.indexOf($scope.selectedRow), 1);

    };

    console.log('PO ', $scope.po)

    //$scope.myData = $scope.po;

    //   var editrowTemplatex = '<i class="icon-edit edit" ng-click="openDialog(row.entity)"></i>';
    // this does edit in html
    // var editrowTemplate = '<a class="icon-edit edit" href="{{\'#/vendor/\'+row.entity.id}}">{{row.entity.id}}</a>';
    //var editrowTemplate = '<a class="icon-edit edit" href="{{\'#/vendor/\'+row.entity.id}}"></a>';
    var displayDateTemplate = ' <div style="width:75;text-align: left" class="ngCellText colt{{$index}}">{{row.getProperty(col.field)}}</div>';
    var editrowTemplate = '<div style="text-align:center;"  class="ngCellText"><a class="icon-edit edit" href="{{\'/po/\'+row.entity.id}}"></a></div>';


    var editrowTemplate2 = '<i class="icon-edit edit" ng-click="editrow(row.entity)"></i>';  // in use
    var editrowTemplate3 = '<div style="text-align:center;"  class="ngCellText"><i class="icon-edit edit" ng-click="editrow(row.entity)"></i></div>';
//    var editrowTemplate3=  '<div style="text-align:center;"  class="ngCellText"><i class="icon-edit edit" ng-click="editrow(row.entity)"></div></i>';


    var displayNumTemplate = ' <div style="width:90%;text-align: right" class="ngCellText colt{{$index}}">{{row.getProperty(col.field)}}</div>';
    var displayCurTemplate = ' <div style="width:90%;text-align: right" class="ngCellText colt{{$index}}">{{row.getProperty(col.field)|currency}}</div>';
    var greenTemplate = '<div ng-class="{green: row.getProperty(col.field) }">' +
      '<div style="text-align:right;"  class="ngCellText">{{row.getProperty(col.field)|currency}}</div></div>';
    var green2Template = '<div ng-class="{green2: row.getProperty(col.field) }">' +
      '<div style="text-align:right;"  class="ngCellText">{{row.getProperty(col.field)|currency}}</div></div>';

    var green3Template = '<div ng-class="{green2: row.getProperty(col.field) }">' +
      '<div style="text-align:right;"  class="ngCellText">{{row.getProperty(col.field)}}</div></div>';

    // this does edit in js
    //   var editrowTemplate = '<i class="icon-edit edit" ng-click="editrow(row.entity)"></i>';
//  { field: 'POTotal', displayName: 'POTotal', groupable: false, width: 125,cellFilter:'money',cellClass:'right'},

//  { field: 'Date', displayName: 'Date', groupable: true, width: 200, cellFilter: "moment:'MM/DD/YYYY'",cellTemplate:displayDateTemplate},
//  $scope.filteringText = '';
    $scope.filterOptions = {
      filterText: '',          //filteringText
      useExternalFilter: false
    };

    $scope.colDefs = [
      { field: 'edit', displayName: 'Edit', headerClass: 'Edit', width: '40', cellTemplate: editrowTemplate },
      { field: 'PONumber', displayName: 'PO#', groupable: false, width: 70 },
      { field: 'acctDesc', displayName: 'AcctDesc', groupable: true, width: 200},
      { field: 'Date', displayName: 'Date', groupable: true, width: 100, cellFilter: "moment:'MM/DD/YYYY'"},
      { field: 'vendorName', displayName: 'vendorName', groupable: true, width: 170 },
      //{ field: 'POType', displayName: 'Type', groupable: true, width: 60 },
      { field: 'newValue', displayName: 'newValue', groupable: true, width: 120 },

      //        { field: 'DateofLoss', displayName: 'Date of Loss', width: 100  }, //   cellFilter: " moment:'dddd'" hh:mm a ddd Do not display currency symbol},
      { field: 'TaxPcnt', displayName: 'TaxPcnt', width: 100, groupable: true, cellTemplate: green3Template },

      { field: 'SubTotal', displayName: 'SubTotal', groupable: false, width: 95, cellTemplate: green2Template},
      { field: 'TaxAmount', displayName: 'TaxAmt', width: 80, cellTemplate: green2Template},
      { field: 'Freight', displayName: 'Freight', groupable: true, width: 60, cellTemplate: green2Template},
      { field: 'POTotal', displayName: 'POTotal', width: 105, cellTemplate: greenTemplate},
      { field: 'Comments', displayName: 'Comments', width: 175},
      { field: 'VendorInvNum', displayName: 'VendorInvNum', width: 175},
      { field: 'vendor', displayName: 'Vendor', width: 175},
      { field: 'vendor.CompanyName', displayName: 'CompName', width: 175}


    ]

//    "Comments" : null,
//    "EdiFlag" : null,
//    "TenantFlag" : false,
//    "VendorInvNum" : null,
//    "VendorInvDate" : null,
//    "details" : []
//
//


    $scope.save = function () {
      angular.forEach(Object.keys($scope.po[0]), function (key) {
        //    $scope.colDefs.push({ field: key });
        console.log('key ', key);
      });
    };

// make first row selected
//    $scope.$on('ngGridEventData', function(){
//      // this will force selection of first row
//      $scope.gridOptions1.selectRow(0, true);
//    });
//
    //  $scope.gridOptions1.groups = [];
    $scope.gridOptions1 = {
      data: 'po',
      multiSelect: false,
      // primaryKey: 'ID',
      filterOptions: $scope.filterOptions,
      // beforeSelectionChange: self.selectionchanging,
      columnDefs: 'colDefs',
      selectedItems: $scope.mySelections,
      showGroupPanel: true,
      showColumnMenu: true,
      maintainColumnRatios: true, //f
      groups: [],
      //plugins: [new ngGridCsvExportPlugin(csvOpts)],
      showFooter: true,
      //enableColumnResize: true,
//
      enableColumnReordering: true,
      enableCellSelection: true,
      enableRowSelection: true,
      afterSelectionChange: function (data) {
        $scope.currentVendor = $scope.vendorIndex[data.entity.VendorID];
      }
    };

    // sortInfo: {fields:['VendorNumber'], directions:['asc']}, sortInfo: $scope.sortInfo ,afterSelectionChange: $scope.afterSelectionChange
//
//    $scope.changeGrid = function (row) {
//      $scope.colDefs = $scope.colDefs2;
//    }

//    $scope.afterSelectionChange = function () {
//      console.log('xx $scope.mySelections[0]',$scope.mySelections)
//      //$scope.setCurrentPO($scope.mySelections[0]);
//
//    };
  }]);



