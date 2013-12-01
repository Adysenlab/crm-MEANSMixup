'use strict'
//110 ,$upload
angular.module('crmApp')
.controller('TemplateEditCtrl', ['$rootScope', '$scope', '$location', '$http', '$routeParams', 'mongosailsHelper',
    '$q', 'lookupCache', 'lookupCacheAcct', '$timeout', '$filter', 'Template', 'lookupCacheTemplate',
    function ($rootScope, $scope, $location, $http, $routeParams, mongosailsHelper, $q, lookupCache, lookupCacheAcct, $timeout, $filter, Template, lookupCacheTemplate) {
        //  console.log('TemplateEditCtrl ')
        $scope.param = $routeParams.id;
        var type = 'info';
        //Template




        $scope.totalItems = 64;
        $scope.currentPage = 4;
        $scope.maxSize = 5;

        $scope.setPage = function (pageNo) {
            $scope.currentPage = pageNo;
        };

        $scope.bigTotalItems = 175;
        $scope.bigCurrentPage = 1;


       // console.log(' TemplateEditCtrl ', $scope.totalItems, $scope.currentPage, $scope.param);

        console.log(' TemplateEditCtrl ', $scope.totalItems);

        console.log(' TemplateEditCtrl2 ',  $scope.currentPage);
        $scope.statuses =
            ['create', 'approved', 'reject']
        ;
        $scope.removeDetail = function (index) {
            $scope.template1.Comments += ' deleted ';
            $scope.template1.details.splice(index, 1);
            $scope.subtot();
            $scope.$apply();
        };
        var acctPromise = lookupCacheAcct.getAccounts();
        acctPromise.then(function (cache) {
            $scope.account = cache.data;
            $scope.accountIndex = cache.combo;
            //          console.log('===========$scope.account ', $scope.account)

        })
            .catch(function (err) {
                console.error('accounts failed', err)
            });

        var templatesPromise = lookupCacheTemplate.getTemplates();
        templatesPromise.then(function (val) {
            if ($scope.param != 0) {
                $scope.templates = val.data;
                var po1 = _.find(val.data, function (po1) {
                    return po1.id == $scope.param;
                });

                $scope.template1 = po1;
                console.log('============$scope.template1 ', $scope.template1);
            } else {

                console.log('val', val)
                $scope.templates = val.data;

                console.log('templates', $scope.templates)

                $scope.template1 = {};
                $scope.template1.pcnt = 1;
                $scope.template1.Freight = 0;
                $scope.template1.Date = moment().format('MM/DD/YYYY');
                $scope.template1.VendorInvDate = moment().format('MM/DD/YYYY');

                $scope.template1.Status = 'create';
                $scope.template1.SubTotal = 0;
                $scope.template1.TaxAmount = 0;
                $scope.template1.POTotal = 0;
                $scope.template1.TaxPcnt = .0875;
                $scope.template1.details = [];
                console.log('======create======$scope.template1 ', $scope.template1);
            }


        })
            .catch(function (err) {
                console.error('template1 failed', err)
            });


        var vendorPromise = lookupCache.getVendors();
        vendorPromise.then(function (cache) {
            console.log('templateCtrl::inside lookup.then', cache)
            $scope.vendor = cache.data;
            $scope.vendorIndex = cache.combo;
        });

        $q.all([templatesPromise, vendorPromise, acctPromise])
            .then(function () {
                // lets delete added fields here
                if ($scope.param != 0) {
                    $scope.currentVendor = $scope.vendorIndex[$scope.template1.VendorID];
                    $scope.currentAccount = $scope.accountIndex[$scope.template1.AccountID];
                    $scope.currentAccountDetail = $scope.accountIndex[$scope.template1.AccountID];
                }
            });
        //} // end of edit

        $scope.showAccount = function (detail) {
            //console.log('showAccount ',detail.AccountID)//,$scope.account)
            var selected = [];
            if (detail.AccountID) {
                selected = $filter('filter')($scope.account, {AccountID: detail.AccountID});
                detail.AccountName = selected[0].Desc;
                // console.log('selected ',detail.AccountID,selected[0].Desc,selected)
            }
            return selected.length ? selected[0].Desc : 'Not set';
        };


        $scope.total = function () {

        };
        $scope.isClean = function () {
            return angular.equals($scope.template1, $scope.templateOrig);
        }
        $scope.isSaveDisabled = function () {
            return $scope.formUpload.$invalid;
        };

        $scope.setCurrentAccount = function (account) {
            $scope.template1.AccountID = account.AccountID;
            $scope.currentAccountDetail = account;//.AccountID;
            if ($scope.param != 0) {
                $scope.detail.AccountID = account.AccountID;
            }
        };
        $scope.setCurrentVendor = function (vendor) {
            $scope.template1.VendorID = vendor.VendorID;// combo
            console.log('in setCV ', $scope.template1.VendorID);
        };

        $scope.setCurrentAccountDetail = function (account) {

            $scope.detail.AccountID = account.AccountID;
            console.log('  $scope.detail.AccountID  ', $scope.detail.AccountID)

        };

        $scope.handleRowSelectionDetail = function (row) {
            console.log('  row  ', row)

        }

        // add detail item
        $scope.addDetailItem = function () {

            if (!angular.isArray($scope.template1.details)) {
                console.log('in detail create')
                $scope.template1.details = [];
            }
            $scope.inserted = {
                id: $scope.template1.details.length + 1,
                AccountID:$scope.template1.AccountID,
                Quantity: 1,
                Desc: null,
                UnitPrice: 1,
                Status: "create"

            };
            $scope.template1.details.push($scope.inserted);
        }


        $scope.saveDetail = function (data, index) {
            console.log('saveDetail ', data);
            // console.log('  index ', index)
            // dont tax if acct is flagged
            var taxamt = 0;
            var unitp = data.UnitPrice * 1
            var lineqty = data.Quantity * 1
            var lineTot = (unitp * lineqty);// keep tax sep
            var notax = lineTot;// keep tax sep

            if ($scope.template1.TaxPcnt != undefined) {
                taxamt = (  $scope.template1.TaxPcnt * lineTot);

                taxamt = (Math.round(taxamt * 100) / 100);
            }

            lineTot = (Math.round(lineTot * 100) / 100);// rounds
            lineTot += taxamt;
            console.log('  unitp  lineqty,  taxamt ,notax, lineTot', unitp, lineqty, taxamt, notax, lineTot);

            $scope.template1.details[index] = {'Quantity': lineqty, 'Desc': data.Desc, 'UnitPrice': unitp, 'AccountID': data.AccountID, 'AccountName': data.AccountName, 'LineItemTax': taxamt, 'LineItemTot': lineTot}

            console.log(' $scope.template1.details ', $scope.template1.details[index], $scope.template1.details[index].LineItemTot, $scope.template1.details[index].LineItemTax)
            var subt = 0;
            _.each($scope.template1.details, function (num) {
                // console.log('num ', num.UnitPrice, num)
                subt += num.UnitPrice * num.Quantity;

            })

            var taxt1 = (subt * ($scope.template1.TaxPcnt) ); //
            var taxt = (Math.round((taxt1) * 100) / 100); //
            var tot = (subt + taxt);

            $scope.template1.SubTotal = subt;
            $scope.template1.TaxAmount = taxt;

            var fgt = $scope.template1.Freight * 1;
            $scope.template1.Freight = fgt;
            var tt = tot + fgt;
            var tt2 = Math.round((tt * 100) / 100);
            $scope.template1.POTotal = tt;
            // $scope.$apply();
            // console.log(' Details: subt, taxt1  taxt, tot , frt,  $scope.template1.POTotal ,tt,tt2 ', subt, taxt1, taxt, tot, $scope.template1.Freight, tt, tt2);

        };

        $scope.subtot = function () {
            var subt = 0;
            _.each($scope.template1.details, function (num) {
                console.log('num ', num.UnitPrice, num)
                subt += num.UnitPrice * num.Quantity;

            })

            var taxt1 = (subt * ($scope.template1.TaxPcnt) ); //
            var taxt = (Math.round((taxt1) * 100) / 100); //
            var tot = (subt + taxt);
            $scope.template1.SubTotal = subt;
            $scope.template1.TaxAmount = taxt;
            var fgt = $scope.template1.Freight * 1;
            $scope.template1.Freight = fgt;
            var tt = tot + fgt;
            var tt2 = Math.round((tt * 100) / 100);
            $scope.template1.POTotal = tt;

            //console.log('subtots Details: subt, taxt1  taxt, tot , frt,  $scope.template1.POTotal ,tt,tt2 ', subt, taxt1, taxt, tot, $scope.template1.Freight, tt, tt2);
            //$scope.$apply();
        }

        $scope.addDetail = function () {

        }


        $scope.edit = function (row) {
            console.log(' You are about to delete ', row);
            alert(' You are about to delete ' + row)
        };

        $scope.save = function (success, error) {
            if ($scope.param == 0) {
                console.log('save create2 ', $scope.template1)
                var partVendor = {};
                partVendor.VendorID = $scope.currentVendor.VendorID;
                partVendor.CompanyName = $scope.currentVendor.CompanyName;
                $scope.template1.vendor = partVendor;// $scope.currentVendor; limit the fields stored
                $scope.template1.vendorName = $scope.currentVendor.CompanyName;
                $scope.template1.acctDesc = $scope.currentAccount.Desc;
                Template.create(( $scope.template1), function (success, error) {
                    //console.log('create success ', success, error, success.data);//, success.data.TenantID !==);
                    console.log('create success ', success,success.TenantID);//, success.data.TenantID !==);
                    //if (success.TemplateID !== 0) {
                      if (success) {
                            console.log('in succ', success);//.data.TemplateID)
                        var templatePromise = lookupCacheTemplate.resetTemplate();
                         templatesPromise.then(function (val) {
                        $location.path('/template');
                         })
                    }
                })
            } else {
                var id = $scope.template1.id;
             //   Template.updateWrapped(( $scope.template1));
                Template.update(( $scope.template1));
                var partVendor = {};
                partVendor.VendorID = $scope.currentVendor.VendorID;
                partVendor.CompanyName = $scope.currentVendor.CompanyName;
                $scope.template1.vendor = partVendor;// $scope.currentVendor; limit the fields stored
                $scope.template1.vendorName = $scope.currentVendor.CompanyName;
                $scope.template1.acctDesc = $scope.currentAccount.Desc;
                $location.path('/template');
            }
            console.log('end ');
        };

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
            //1  var templatePromise = lookupCachePO.resetPO();
            $location.path('/template');
        };


    }]);

angular.module('crmApp')
    .controller('TemplateCtrl', ['$rootScope', '$scope', 'Template', '$location', '$http', 'Auth', 'comboHelper' ,
    'Vendor' , '$q', 'lookupCache', 'lookupCacheTemplate', 'lookupCacheAcct','GridResource',
    function ($rootScope, $scope, PO, $location, $http, Auth, comboHelper, Vendor, $q, lookupCache, lookupCacheTemplate, lookupCacheAcct,GridResource) {
        console.log(' This is POCtrl 6')
        $scope.showGrid = true;
        $scope.setCurrentPO = [];
        $scope.navType = 'pills';

        var acctPromise = lookupCacheAcct.getAccounts();
        acctPromise.then(function (cache) {
            $scope.account = cache.data;
            $scope.accountIndex = cache.combo;
        })
            .catch(function (err) {
                console.error('accounts failed', err)
            });

        var templatePromise = lookupCacheTemplate.getTemplates();
        templatePromise.then(function (val) {
            $scope.template = val.data;

        })
            .catch(function (err) {
                console.error('template failed', err)
            });

        var vendorPromise = lookupCache.getVendors();
        vendorPromise.then(function (cache) {
            //  console.log('POCtrl::inside lookup.then', cache)
            $scope.vendor = cache.data;
            $scope.vendorIndex = cache.combo;

        });
        var gridPromise =
            GridResource.getGrid({'gridcol':$scope.exportcols,'user':$rootScope.user.username, 'gridname':'Template'}).$promise
                .then(function (response) {

                    //console.log('$scope.colDefs ',response.colDefs)
                    $scope.colDefs = response.colDefs;
                })
                .catch(function (err) {
                    console.error('catch::myDefs ', err);
                    $scope.colDefs = [
                        { field: 'edit', displayName: 'Edit', headerClass: 'Edit', width: '40', cellTemplate: editrowTemplate },
                        // { field: 'Status', displayName: 'Status', groupable: true, width: 70 },

                        { field: 'vendor.CompanyName', displayName: 'CompanyName', width: 175},
                        { field: 'name', displayName: 'name', width: 175},
                        { field: 'acctDesc', displayName: 'AcctDesc', groupable: true, width: 200},
                        { field: 'Date', displayName: 'Date', groupable: true, width: 100, cellFilter: "moment:'MM/DD/YYYY'"},
                        //{ field: 'vendorName', displayName: 'vendorName', groupable: true, width: 170 },
                        { field: 'POTotal', displayName: 'POTotal', width: 105, cellTemplate: greenTemplate},
                        { field: 'SubTotal', displayName: 'SubTotal', groupable: false, width: 95, cellTemplate: green2Template},
                        { field: 'TaxPcnt', displayName: 'TaxPcnt', width: 100, groupable: true, cellTemplate: green3Template },
                        { field: 'TaxAmount', displayName: 'TaxAmt', width: 80, cellTemplate: green2Template},
                        { field: 'Freight', displayName: 'Freight', groupable: true, width: 60, cellTemplate: green2Template},
                        { field: 'Comments', displayName: 'Comments', width: 175}
                        //{ field: 'VendorInvNum', displayName: 'VendorInvNum', width: 175},

                    ]

                });
        $q.all([templatePromise, vendorPromise, acctPromise,gridPromise])
            .then(function () {
                $scope.currentVendor = $scope.vendorIndex[$scope.template[0].VendorID];
                $scope.currentAccount = $scope.accountIndex[$scope.template[0].AccountID];

            });




        $scope.setCurrentPO = function (template) {
            $scope.currentVendor = $scope.vendorIndex[template.VendorID];
        };

        $scope.status = function (sval) {
            $scope.filterOptions.filterText = sval;
        }

        $scope.editrow = function (row) {
            // this is just an object
            $scope.currentPO = row;
            //console.log('in ed ', $scope.currentPO);
            $scope.setCurrentPO(row);
        }

        $scope.new = function (user) {
            $location.path('/template/0');
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

        $scope.addTemplate = function () {
            $scope.editableTemplate.$save();
            $scope.template.push($scope.editablePO);
            $scope.toggleForm();
        };

        $scope.deletevendor = function (row) {
            Template.delete({id: $scope.selectedRow.id});
            $scope.template.splice($scope.template.indexOf($scope.selectedRow), 1);

        };

        // console.log('PO ', $scope.po)
        var displayDateTemplate = ' <div style="width:75;text-align: left" class="ngCellText colt{{$index}}">{{row.getProperty(col.field)}}</div>';
        var editrowTemplate = '<div style="text-align:center;"  class="ngCellText"><a class="icon-edit edit" href="{{\'/template/\'+row.entity.id}}"></a></div>';
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
        var editpdfRptTemplate = '<a  ng-href="/uploads/template{{row.entity.PDF}}" target=\'_blank\' >template{{row.getProperty(col.field)}}</a>';
        $scope.filterOptions = {
            filterText: '',          //filteringText
            useExternalFilter: false
        };

        $scope.colDefs = [
            { field: 'edit', displayName: 'Edit', headerClass: 'Edit', width: '40', cellTemplate: editrowTemplate },
           // { field: 'Status', displayName: 'Status', groupable: true, width: 70 },

            { field: 'vendor.CompanyName', displayName: 'CompanyName', width: 175},
            { field: 'name', displayName: 'name', width: 175},
            { field: 'acctDesc', displayName: 'AcctDesc', groupable: true, width: 200},
            { field: 'Date', displayName: 'Date', groupable: true, width: 100, cellFilter: "moment:'MM/DD/YYYY'"},
            //{ field: 'vendorName', displayName: 'vendorName', groupable: true, width: 170 },
            { field: 'POTotal', displayName: 'POTotal', width: 105, cellTemplate: greenTemplate},
            { field: 'SubTotal', displayName: 'SubTotal', groupable: false, width: 95, cellTemplate: green2Template},
            { field: 'TaxPcnt', displayName: 'TaxPcnt', width: 100, groupable: true, cellTemplate: green3Template },
            { field: 'TaxAmount', displayName: 'TaxAmt', width: 80, cellTemplate: green2Template},
            { field: 'Freight', displayName: 'Freight', groupable: true, width: 60, cellTemplate: green2Template},
            { field: 'Comments', displayName: 'Comments', width: 175}
           //{ field: 'VendorInvNum', displayName: 'VendorInvNum', width: 175},

        ]
        $scope.save = function () {
            angular.forEach(Object.keys($scope.template[0]), function (key) {
                console.log('key ', key);
            });
        };

        $scope.gridOptions1 = {
            data: 'template',
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
            GridResource.saveGrid( {'gridcol':$scope.exportcols,'user':$rootScope.user.username, 'gridname':'Template'}, function(success, error) {
                if (success) {
                    console.log('saveGrid success ', success);
                    $scope.message_err='';
                }
            });
        };



    }]);
