
'use strict'
//110 ,$upload
angular.module('crmApp')
    .controller('TWOEditCtrl', ['$rootScope', '$scope', '$location', '$http', '$routeParams', 'mongosailsHelper',
    '$q', 'lookupCache', 'lookupCacheTWO', 'lookupCacheAcct', '$timeout', '$filter', 'TWO','lookupCacheTenant','Tenantcategory','GridResource',
    function ($rootScope, $scope, $location, $http, $routeParams, mongosailsHelper, $q, lookupCache, lookupCacheTWO, lookupCacheAcct, $timeout, $filter, TWO,lookupCacheTenant,Tenantcategory,GridResource) {

        $scope.param = $routeParams.id;
        console.log('$scope.param ',$scope.param)
        var type = 'info';
        console.log(' TWOEditCtrl ', $scope.param);
        $scope.statuses =
            ['create', 'approved', 'reject']
        ;
        $scope.statusUpdate = function (stat) {
            $scope.two1.Status = stat
            console.log('$scope.two1.Status ', $scope.two1.Status)
            $scope.save();
        };


        $scope.checkName = function (data, id) {
            console.log('data, id', data, id)
            if (id === 2 && data !== 'awesome') {
                return "Username 2 should be `awesome`";
            }
        };

        $scope.removeDetail = function (index) {

            $scope.two1.Comments += ' deleted ';//+$scope.two1.details[index].AccountID;//+$scope.two1.details[index];
            $scope.two1.details.splice(index, 1);
            $scope.subtot();
            $scope.$apply();
        };

        $scope.thisisnotdup = null;
        if ($scope.param == 0) {
            $scope.mess = 'Create New TWO'
        }
        else {
            $scope.mess = 'Edit TWO ';
        }

        //var deferredtc = $q.defer();
        var tenantcatpromise =      Tenantcategory.findAll().$promise
            .then(function (response) {

                $scope.tenantcategory = response;//.data;// object not array
//                thisCache.combo = comboHelper.buildIndex(thisCache.data, comboProperty);
//                console.log('getting tenants data from server ', thisCache.data )
//                thisCache.deferred.resolve(thisCache);
                console.log('$scope.tenantcategory 1==========================',$scope.tenantcategory)
            })
            .catch(function (err) {
                console.error('lookupCache::populateVendor failed', err);
          //      deferredtc.reject(err);
            });



        var acctPromise = lookupCacheAcct.getAccounts();
        acctPromise.then(function (cache) {
            $scope.account = cache.data;
            $scope.accountIndex = cache.combo;
            console.log('===========$scope.account ', $scope.account)
            console.log('===========$scope.accountIndex ', $scope.accountIndex)
        })
            .catch(function (err) {
                console.error('accounts failed', err)
            });

        var tenantPromise = lookupCacheTenant.getTenants() ;
        tenantPromise.then(function (cache) {
            $scope.tenant = cache.data;
            $scope.tenantIndex = cache.combo;
            console.log('===========$scope.tenant ', $scope.tenant)
            console.log('===========$scope.tenantIndex ', $scope.tenantIndex)

        })
            .catch(function (err) {
                console.error('tenant failed', err)
            });

        var twoPromise = lookupCacheTWO.getTWOs();
        twoPromise.then(function (val) {

            if ($scope.param != 0) {
                $scope.two = val.data;
                var two1 = _.find(val.data, function (two1) {
                    return two1.id == $scope.param;
                });

                $scope.two1 = two1;
                console.log('============$scope.two ', $scope.two1);
            } else {

                //  this is a new two
                $scope.two1 = {};
                $scope.two1.pcnt = 1;
                $scope.two1.Freight = 0;
                $scope.two1.Date = moment().format('MM/DD/YYYY');
                $scope.two1.VendorInvDate = moment().format('MM/DD/YYYY');
                $scope.two1.Status = 'create';
                $scope.two1.SubTotal = 0;
                $scope.two1.TaxAmount = 0;
                $scope.two1.TWOTotal = 0;
                $scope.two1.TaxPcnt = .0875;
                $scope.two1.TenCatID='';
                $scope.two1.details = [];
                console.log('======create======$scope.two ', $scope.two1);
            }
        })
            .catch(function (err) {
                console.error('two failed', err)
            });

//        var vendorPromise = lookupCache.getVendors();
//        vendorPromise.then(function (cache) {
//            console.log('TWOCtrl::inside lookup.then', cache)
//            $scope.vendor = cache.data;
//            $scope.vendorIndex = cache.combo;
//        });

        $q.all([twoPromise, tenantcatpromise, acctPromise,tenantPromise])
            .then(function () {
                // lets delete added fields here
                //   return deferredtc.promise;
              console.log('$scope.tenantcategory 2==========================',$scope.param ,$scope.tenantcategory)

                if ($scope.param != 0) {
                    $scope.twoOrigAll = angular.copy($scope.two1);

                    console.log(' $scope.two1 ', $scope.two1)

                //    delete $scope.two1.vendorName;
                //    delete $scope.two1.acctDesc;
                //    delete $scope.two1.newValue;
                    $scope.twoOrig = angular.copy($scope.two1);// for valid state
                    //$scope.currentVendor = $scope.vendorIndex[$scope.two1.VendorID];
                    $scope.currentTenant = $scope.tenantIndex[$scope.two1.TenantID];
                    console.log('accountIndex ', $scope.accountIndex);
                    console.log('AccountID ', $scope.two1.AccountID);
                    //$scope.currentAccount = $scope.accountIndex[$scope.two1.AccountID];
                    // $scope.currentAccount =   $scope.tenantcategory[2];//
                    $scope.currentAccount = _.find($scope.tenantcategory , function (tc) {
                        return tc.TenantCategory == $scope.two1.AccountID;
                    });

                    console.log('currentAccount ', $scope.currentAccount);
                    console.log('in TenantID ', $scope.two1.TenantID);
                    console.log('currentAccount ', $scope.two1.AccountID);

                } else {

                    $scope.formUpload.$invalid = true;
                }

            });
        //} // end of edit

        $scope.showAccount = function (detail) {

            var selected = [];
            if (detail.AccountID) {
                selected = $filter('filter')($scope.account, {AccountID: detail.AccountID});
                detail.AccountName = selected[0].Desc;

            }
            return selected.length ? selected[0].Desc : 'Not set';
        };

        // selected = $filter('filter')($scope.services, {id: daily.SERVICE_ID});
        $scope.showTwoTenant = function (two) {
            // console.log('showTwoTenant ',two,two.TenantID)//,$scope.account)
            var selected = [];
            if (two.TenantID) {
                selected = $filter('filter')($scope.tenant, {TenantID: two.TenantID});
                two.CompanyName = selected[0].CompanyName;
            }
            return selected.length ? selected[0].CompanyName : 'Not set';
        };

        $scope.saveTwo = function (two) {
            console.log('saveTwo')
        };


        $scope.total = function () {

        };
        $scope.isClean = function () {
            return angular.equals($scope.two1, $scope.twoOrig);
        }
        $scope.isSaveDisabled = function () {
            return $scope.formUpload.$invalid;
        };




        $scope.setCurrentAccount = function (account) {
            console.log('account =================',account)
            console.log('$scope.detail =================',$scope.detail)
            $scope.two1.AccountID = account.TenantCategory;//AccountID;
      //      $scope.currentAccount = account;
        };
        $scope.setCurrentTenant = function (tenant) {
            $scope.two1.TenantID = tenant.TenantID;// combo
            console.log('in setCurrentTenant ', $scope.two1.TenantID);
        };

//        $scope.setCurrentVendor = function (vendor) {
//            $scope.po1.VendorID = vendor.VendorID;// combo
//
//
//
//            console.log('in setCV ', $scope.po1.VendorID);
//        };


        $scope.setCurrentAccountDetail = function (account) {
            // $scope.CurrentAccountDetail
            $scope.detail.AccountID = account.AccountID;

         //   console.log('  $scope.detail.AccountID  ', $scope.detail.AccountID)
        };

        $scope.handleRowSelectionDetail = function (row) {
            console.log('  row  ', row)

        }


        $scope.showTenCat = function (detail) {
            console.log('detail  ',detail);//,$scope.tenantcategory);
            console.log('detail.TenCatID ',detail.TenCatID);//,$scope.tenantcategory);
            var selected = [];
            if (detail.TenCatID) {
                selected = $filter('filter')($scope.tenantcategory, {TenantCategory: detail.TenCatID});

                console.log('selected ',detail.TenCatID,selected[0].Desc,selected)
            }
            return selected.length ? selected[0].Desc : 'Not set';
        };




        // add detail item
        $scope.addDetailItem = function () {
            console.log('in detail create',$scope.currentAccount)
            if (!angular.isArray($scope.two1.details)) {
                //console.log('in detail create')
                $scope.two1.details = [];
            }
            $scope.inserted = {
                id: $scope.two1.details.length + 1,
                TenCatID: $scope.currentAccount.TenantCategory,
               // addDetailItem
                UnitPrice:  $scope.currentAccount.Amt  ,
                Quantity: 1,
                Desc: null,

                Status: "create"

            };
            $scope.two1.details.push($scope.inserted);
        }

        $scope.addTwoItem = function () {
            console.log('in addTwoItem create')
            if (!angular.isArray($scope.two1.twos)) {
                console.log('in twos create')
                $scope.two1.twos = [];
            }
            $scope.insertedT = {
                id: $scope.two1.twos.length + 1
                , TenantID: ''
                , isNew: true

            };
            $scope.two1.twos.push($scope.insertedT);
            console.log('in addTwoItem post')
        }
        $scope.saveTwoDetail = function (data, index) {

            console.log('data saveTwoDetail',data)
            var tenantid = data.TenantID;
            angular.extend(data, {TenantID: data.TenantID});//
            console.log('saveDetail ', data);//$scope.currentAccountDetail)
            console.log('  index ', index)
            $scope.two1.twos[index] = {'TenantID': tenantid,'CompanyName':data.CompanyName};
            console.log(' twos ',data.TenantID,data.CompanyName);
        };

//   225line     $scope.setCurrentTenant = function (tenant) {
//            $scope.two1.TenantID = tenant.TenantID;// combo
//            console.log('in setCV ', $scope.two1.TenantID);
//        };
        $scope.saveDetail = function (data, index) {
            angular.extend(data, {AccountID: data.AccountID});//
            angular.extend(data, {TenCatID: data.TenCatID});//
            console.log('saveDetail ', data);//$scope.currentAccountDetail)
            console.log('  index ', index)
            // dont tax if acct is flagged
            var taxamt = 0;
            var unitp = data.UnitPrice * 1
            var lineqty = data.Quantity * 1
            var lineTot = (unitp * lineqty);// keep tax sep
            var notax = lineTot;// keep tax sep
            if ($scope.two1.TaxPcnt != undefined) {
                taxamt = (  $scope.two1.TaxPcnt * lineTot);
                taxamt = (Math.round(taxamt * 100) / 100);
            }

            lineTot = (Math.round(lineTot * 100) / 100);// rounds
            lineTot += taxamt;
            console.log('  unitp  lineqty,  taxamt ,notax, lineTot', unitp, lineqty, taxamt, notax, lineTot);

            $scope.two1.details[index] = {'Quantity': lineqty, 'Desc': data.Desc, 'UnitPrice': unitp, 'AccountID': data.AccountID, 'AccountName': data.AccountName, 'LineItemTax': taxamt, 'LineItemTot': lineTot,'TenCatID': data.TenCatID}
            console.log(' detail ',data.AccountID, 'AccountName', data.AccountName);

            console.log(' $scope.two1.details ', $scope.two1.details[index], $scope.two1.details[index].LineItemTot, $scope.two1.details[index].LineItemTax)
            //console.log(' $scope.two1.details ', $scope.two1.details[1], $scope.two1.details[1].LineItemTot, $scope.two1.details[1].LineItemTax)
            var subt = 0;
            _.each($scope.two1.details, function (num) {
                console.log('num ', num.UnitPrice, num)
                subt += num.UnitPrice * num.Quantity;

            })

            var taxt1 = (subt * ($scope.two1.TaxPcnt) ); //
            var taxt = (Math.round((taxt1) * 100) / 100); //
            var tot = (subt + taxt);

            $scope.two1.SubTotal = subt;
            $scope.two1.TaxAmount = taxt;
//
//            var fgt = $scope.two1.Freight * 1;
//            $scope.two1.Freight = fgt;
//            var tt = tot + fgt;
//            var tt2 = Math.round((tt * 100) / 100);
            $scope.two1.Total = tot;
            // $scope.$apply();
            console.log(' Details: subt, taxt1  taxt, tot , frt,  $scope.two1.TWOTotal ,tt,tt2 ', subt, taxt1, taxt, tot);//, $scope.two1.Freight, tt, tt2);

        };

        $scope.subtot = function () {
            var subt = 0;
            _.each($scope.two1.details, function (num) {
                console.log('num ', num.UnitPrice, num)
                subt += num.UnitPrice * num.Quantity;

            })

            var taxt1 = (subt * ($scope.two1.TaxPcnt) ); //
            var taxt = (Math.round((taxt1) * 100) / 100); //
            var tot = (subt + taxt);
            $scope.two1.SubTotal = subt;
            $scope.two1.TaxAmount = taxt;
//            var fgt = $scope.two1.Freight * 1;
//            $scope.two1.Freight = fgt;
//            var tt = tot + fgt;
//            var tt2 = Math.round((tt * 100) / 100);
            $scope.two1.Total = tot;

            //console.log('subtots Details: subt, taxt1  taxt, tot , frt,  $scope.two1.TWOTotal ,tt,tt2 ', subt, taxt1, taxt, tot, $scope.two1.Freight, tt, tt2);
            //$scope.$apply();
        }

        $scope.addDetail = function () {
//

        }


        $scope.edit = function (row) {
            console.log(' You are about to delete ', row);
            alert(' You are about to delete ' + row)

        };



        $scope.savepdf = function (rec) {
// dont plan to use
            console.log('pdfCreate create ', rec, $scope.two1);
            TWO.updatePDF(( $scope.two1), function (success, error) {

            });
        }


        $scope.save = function (success, error) {

            console.log('save create1 ', $scope.two1.TWOID,$scope.param)
            var partTenant = {};
            partTenant.TenantID = $scope.currentTenant.TenantID;
            partTenant.CompanyName = $scope.currentTenant.CompanyName;

            $scope.two1.tenant = partTenant;// $scope.currentVendor; limit the fields stored
            //$scope.two1.vendorName = $scope.currentVendor.CompanyName;
            if ($scope.currentAccount !== undefined)
                $scope.two1.acctDesc = $scope.currentAccount.Desc;
            if ($scope.param == 0) {
                console.log('save create2 ', $scope.two1)
                    TWO.create(( $scope.two1), function (success, error) {
                    console.log('create success ', success, error, success.data, success.data.TWOID);
                    if (success.data.TWOID !== 0) {
                        console.log('in succ', success.data.TWOID)
                        var twoPromise = lookupCacheTWO.resetTWO();// look to refactor
                        $location.path('/two/' + success.data.id);
           }
                });
            } else {

                var id = $scope.two1.id;
                console.log(' updateWrapped. ',$scope.currentAccount.Desc)
//                TWO.update(( $scope.two1));
                TWO.updateWrapped(( $scope.two1));
                $location.path('/two');
            }
            console.log('end ');
        };

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
            var twoPromise = lookupCacheTWO.resetTWO();

            $location.path('/two');

        };


        $scope.addContact = function () {

            $scope.vendor.contacts.push({'name': $scope.selContact});
        }

    }]);
angular.module('crmApp')
.controller('TWOCtrl', ['$rootScope', '$scope', 'TWO', '$location', '$http', 'Auth', 'comboHelper' ,
    'Vendor' , '$q', 'lookupCache', 'lookupCacheTWO', 'lookupCacheAcct','GridResource',
    function ($rootScope, $scope, TWO, $location, $http, Auth, comboHelper, Vendor, $q, lookupCache, lookupCacheTWO, lookupCacheAcct,GridResource) {
        console.log(' This is TWOCtrl 6')
        //$scope.myData = [];
        $scope.showGrid = true;
        $scope.setCurrentTWO = [];
        $scope.navType = 'pills';


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

        var twoPromise = lookupCacheTWO.getTWOs();
        twoPromise.then(function (val) {
            $scope.two = val.data;
            console.log('$scope.two ', $scope.two)
        })
            .catch(function (err) {
                console.error('two = failed', err)
            });

        var vendorPromise = lookupCache.getVendors();
        vendorPromise.then(function (cache) {
            console.log('TWOCtrl::inside lookup.then', cache)
            $scope.vendor = cache.data;
            $scope.vendorIndex = cache.combo;

        });
        var gridPromise =  GridResource.getGrid({'gridcol':$scope.exportcols,'user':$rootScope.user.username, 'gridname':'TWO'}).$promise
            .then(function (response) {

                //console.log('$scope.colDefs ',response.colDefs)
                $scope.colDefs = response.colDefs;
            })
            .catch(function (err) {
                console.error('catch::myDefs ', err);

                $scope.colDefs = [
                    // { field: 'id', displayName: 'TWO#', groupable: false, width: 220 },
                    { field: 'id', displayName: 'TWO Edit', groupable: false, width: 60  ,cellTemplate:editrowTWO1},
                    { field: 'poObj', displayName: 'PO Edit', groupable: false, width: 120 ,cellTemplate:editrowPO2A},
                    //{ field: 'poObj', displayName: 'POID3', groupable: false, width: 70 ,cellTemplate:editrowPO3},
                    // { field: 'PDF', displayName: 'Inv', groupable: false, width: 70, cellTemplate: editpdfTemplate },
                    //1* { field: 'edit', displayName: 'Edit', headerClass: 'Edit', width: '40', cellTemplate: editrowTemplate },
                    { field: 'Status', displayName: 'Status', groupable: true, width: 70 },
                    // { field: 'acctDesc', displayName: 'AcctDesc', groupable: true, width: 200},
                    { field: 'Date', displayName: 'Date', groupable: true, width: 100, cellFilter: "moment:'MM/DD/YYYY'"},
                    { field: 'TenantID', displayName: 'TenantID', groupable: false, width: 90 },

                    { field: 'CompanyName', displayName: 'CompanyName', groupable: true, width: 170 },
                    { field: 'POTotal', displayName: 'TWOTotal', width: 105, cellTemplate: greenTemplate},
                    { field: 'SubTotal', displayName: 'SubTotal', groupable: false, width: 95, cellTemplate: green2Template},
                    { field: 'TaxPcnt', displayName: 'TaxPcnt', width: 100, groupable: true, cellTemplate: green3Template },
                    { field: 'TaxAmount', displayName: 'TaxAmt', width: 80, cellTemplate: green2Template},
                    { field: 'Freight', displayName: 'Freight', groupable: true, width: 60, cellTemplate: green2Template},
                    { field: 'Comments', displayName: 'Comments', width: 175},
                    { field: 'VendorInvNum', displayName: 'VendorInvNum', width: 175},

                    { field: 'vendor.CompanyName', displayName: 'VendorName', width: 175}
                ]
            });
        $q.all([twoPromise, vendorPromise, acctPromise,gridPromise])
            .then(function () {



            });
        $scope.setCurrentTWO = function (two) {
            console.log('currentTWO  ', two);
            console.log('two.VendorNumber  ',two.VendorID);
            $scope.currentVendor = $scope.vendorIndex[two.VendorID];
        };

        $scope.status = function (sval) {
            console.log('in ed ', sval);
            $scope.filterOptions.filterText = sval;
        }

        $scope.editrow = function (row) {
            // this is just an object
            $scope.currentTWO = row;
            console.log('in ed ', $scope.currentTWO);
            $scope.setCurrentTWO(row);
        }

        $scope.new = function (user) {
            $location.path('/two/0');
        };




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

        $scope.addTWO = function () {
            $scope.editableTWO.$save();
            $scope.two.push($scope.editableTWO);
            $scope.toggleForm();
        };

        $scope.deletevendor = function (row) {
            TWO.delete({id: $scope.selectedRow.id});
            $scope.two.splice($scope.two.indexOf($scope.selectedRow), 1);

        };

        console.log('TWO ', $scope.two)
        var editrowPO1 = '<div style="text-align:center;"  class="ngCellText"><a class="icon-edit edit" href="{{\'/po/\'+row.entity.poObj}}"></a></div>';
        var editrowPO2 = '<a  ng-href="/po/{{row.entity.poObj}}" target=\'_blank\' >{{row.getProperty(col.field)}}</a>';
        var editrowPO2A = '<a ng-href="{{\'/po/\'+row.entity.poObj}}" >{{row.entity.poObj}}</a>';// ng-href="/po/{{row.entity.poObj}}"
        var editrowPO3 = '<div style="text-align:center;"  class="ngCellText"><a class="icon-edit edit" ng-href="{{\'/po/\'+row.entity.poObj}}"></a></div>';// this works



        //var editrowPO3 = '<a  ng-href="/po/{{row.entity.poObj}}" target=\'_blank\' >poObj{{row.getProperty(col.field)}}</a>';

        var editrowTWO1 = '<div style="text-align:center;"  class="ngCellText"><a class="icon-edit edit" href="{{\'/two/\'+row.entity.id}}"></a></div>';


        var displayDateTemplate = ' <div style="width:75;text-align: left" class="ngCellText colt{{$index}}">{{row.getProperty(col.field)}}</div>';
        var editrowTemplate = '<div style="text-align:center;"  class="ngCellText"><a class="icon-edit edit" href="{{\'/two/\'+row.entity.id}}"></a></div>';

        var editrowTemplate2 = '<i class="icon-edit edit" ng-click="editrow(row.entity)"></i>';  // in use
        var editrowTemplate3 = '<div style="text-align:center;"  class="ngCellText"><i class="icon-edit edit" ng-click="editrow(row.entity)"></i></div>';

        var displayNumTemplate = ' <div style="width:90%;text-align: right" class="ngCellText colt{{$index}}">{{row.getProperty(col.field)}}</div>';
        var displayCurTemplate = ' <div style="width:90%;text-align: right" class="ngCellText colt{{$index}}">{{row.getProperty(col.field)|currency}}</div>';
        var greenTemplate = '<div ng-class="{green: row.getProperty(col.field) }">' +
            '<div style="text-align:right;"  class="ngCellText">{{row.getProperty(col.field)|currency}}</div></div>';
        var green2Template = '<div ng-class="{green2: row.getProperty(col.field) }">' +
            '<div style="text-align:right;"  class="ngCellText">{{row.getProperty(col.field)|currency}}</div></div>';

        var green3Template = '<div ng-class="{green2: row.getProperty(col.field) }">' +
            '<div style="text-align:right;"  class="ngCellText">{{row.getProperty(col.field)}}</div></div>';
        var editpdfTemplate = '<a  ng-href="/uploads/{{row.entity.PDF}}" target=\'_blank\' >{{row.getProperty(col.field)}}</a>';
        var editpdfRptTemplate = '<a  ng-href="/uploads/two{{row.entity.PDF}}" target=\'_blank\' >two{{row.getProperty(col.field)}}</a>';

        $scope.filterOptions = {
            filterText: 'create',          //filteringText
            useExternalFilter: false
        };

        $scope.colDefs = [
           // { field: 'id', displayName: 'TWO#', groupable: false, width: 220 },
            { field: 'id', displayName: 'TWO Edit', groupable: false, width: 60  ,cellTemplate:editrowTWO1},
            { field: 'poObj', displayName: 'PO Edit', groupable: false, width: 120 ,cellTemplate:editrowPO2A},
            //{ field: 'poObj', displayName: 'POID3', groupable: false, width: 70 ,cellTemplate:editrowPO3},
            // { field: 'PDF', displayName: 'Inv', groupable: false, width: 70, cellTemplate: editpdfTemplate },
           //1* { field: 'edit', displayName: 'Edit', headerClass: 'Edit', width: '40', cellTemplate: editrowTemplate },
            { field: 'Status', displayName: 'Status', groupable: true, width: 70 },
            // { field: 'acctDesc', displayName: 'AcctDesc', groupable: true, width: 200},
            { field: 'Date', displayName: 'Date', groupable: true, width: 100, cellFilter: "moment:'MM/DD/YYYY'"},
            { field: 'TenantID', displayName: 'TenantID', groupable: false, width: 90 },

            { field: 'CompanyName', displayName: 'CompanyName', groupable: true, width: 170 },
            { field: 'POTotal', displayName: 'TWOTotal', width: 105, cellTemplate: greenTemplate},
            { field: 'SubTotal', displayName: 'SubTotal', groupable: false, width: 95, cellTemplate: green2Template},
            { field: 'TaxPcnt', displayName: 'TaxPcnt', width: 100, groupable: true, cellTemplate: green3Template },
            { field: 'TaxAmount', displayName: 'TaxAmt', width: 80, cellTemplate: green2Template},
            { field: 'Freight', displayName: 'Freight', groupable: true, width: 60, cellTemplate: green2Template},
            { field: 'Comments', displayName: 'Comments', width: 175},
            { field: 'VendorInvNum', displayName: 'VendorInvNum', width: 175},

            { field: 'vendor.CompanyName', displayName: 'VendorName', width: 175}
        ]

        $scope.save = function () {
            angular.forEach(Object.keys($scope.two[0]), function (key) {

                console.log('key ', key);
            });
        };


        $scope.gridOptions1 = {
            data: 'two',
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

        $scope.exportcols = [];// must be braces{} for object ; [] for array

        $scope.$on('ngGridEventColumns', function (newColumns) {
            //do work here to save the column information.
            $scope.exportcols = newColumns.targetScope.columns;
        });


        $scope.saveGrid = function (success, error) {
            GridResource.saveGrid( {'gridcol':$scope.exportcols,'user':$rootScope.user.username, 'gridname':'TWO'}, function(success, error) {
                if (success) {
                    console.log('saveGrid success ', success);
                    $scope.message_err='';
                }
            });
        };

    }]);



      


