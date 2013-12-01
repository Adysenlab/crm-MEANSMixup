'use strict'
//110 ,$upload
angular.module('crmApp')
    .controller('PoEditCtrl', ['$rootScope', '$scope', '$location', '$http', '$routeParams', 'mongosailsHelper',
    '$q', 'lookupCache', 'lookupCachePO', 'lookupCacheAcct', '$timeout', '$filter', 'PO', 'Template', 'lookupCacheTemplate','lookupCacheTenant',
    function ($rootScope, $scope, $location, $http, $routeParams, mongosailsHelper, $q, lookupCache, lookupCachePO, lookupCacheAcct, $timeout, $filter, PO, Template, lookupCacheTemplate,lookupCacheTenant) {
        //..console.log('PoEditCtrl Auth', $rootScope.user)
        $rootScope.user.username=='MAT' ? $scope.isDisabled=false : $scope.isDisabled=true;

        console.log(' $rootScope.user  $scope.isDisabled ', $rootScope.user.username, $scope.isDisabled)

    //        var currentAnswerStatus = (answered == 'yes' ? true : false);
        $scope.param = $routeParams.id;
        //var value = Math.floor((100*100)+1);
        var type = 'info';
     //   var userPromise = lookupCacheUser.getUsers();
//        userPromise.then(function (cache) {
//            $scope.users = cache.data;
//            //$scope.accountIndex = cache.combo;
//            //console.log(' $scope.account ', $scope.account)
//        })
//            .catch(function (err) {
//                console.error('users', err)
//            });

        $scope.onFileSelect = function ($files) {

            if ($scope.po1.POID !== undefined) {
                console.log('$scope.po1.POID; ', $scope.param, $scope.po1.POID);
                console.log('$files ', $files);//.length,$files);
                $scope.myModelObj = $scope.po1.POID;
                //$files: an array of files selected, each file has name, size, and type.
                $scope.selectedFiles = $files;
                for (var i = 0; i < $files.length; i++) {

                    var $file = $files[i];
                    $http.uploadFile({


                      //// internal test
                     url: 'http://localhost:8002/uploadf',
                     //url: 'http://sample3.gtz.com:8002/uploadf',
                        data: {myObj: $scope.myModelObj},
                        file: $file
                    }).progress(function (evt) {

                            console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
                            $scope.po1.pcnt = 'percent: ' + parseInt(100.0 * evt.loaded / evt.total);
                            $scope.$apply(); // need this for display
                        }).then(function (data, status, headers, config) {
                            // file is uploaded successfully
                            //console.log(data);
                            $scope.po1.PDF = $scope.po1.POID + '.pdf';
                            $scope.$apply();
                            console.log('$scope.po1.PDF ', $scope.po1.PDF)
                        });
                }
            } else {
                alert('please save po before attaching scans')
            }

        }

//
//// this uses https://github.com/logicbomb/lvlFileUpload
//    $scope.progress = function(percentDone) {
//      console.log("progress: " + percentDone + "%");
//    };
//
//    $scope.done = function(files, data) {
//      console.log("upload complete");
//      console.log("data: " + JSON.stringify(data));
//      writeFiles(files);
//    };
//
//    $scope.getData = function(files) {
//      //this data will be sent to the server with the files
//      return {msg: "from the client", date: new Date() , poid:  $scope.po1.POID};
//    };
//
//    $scope.error = function(files, type, msg) {
//      console.log("Upload error: " + msg);
//      console.log("Error type:" + type);
//      writeFiles(files);
//    }
//
//    function writeFiles(files)
//    {
//      console.log('Files')
//      for (var i = 0; i < files.length; i++) {
//        console.log('\t' + files[i].name);
//        $scope.po1.PDF =  $scope.po1.POID+'.pdf';
//      }
//    }
//

        console.log(' PoEditCtrl ', $scope.param);

//    $scope.statuses = [
//      { name: 'create'},
//      { name: 'approved'},
//      { name: 'reject'}
//    ];
        $scope.statuses =
            ['create', 'approved', 'reject']
        ;

        $scope.statusUpdate = function (stat) {


            $scope.po1.Status = stat
            console.log('$scope.po1.Status ', $scope.po1.Status)
            $scope.save();
        };

//        $scope.approve = function () {
//            $scope.po1.Status = 'approved';
//            console.log('$scope.po1.Status ', $scope.po1.Status)
//        };
//        $scope.reject = function () {
//
//            $scope.po1.Status = 'reject';
//            console.log('$scope.po1.Status ', $scope.po1.Status);
//        };

//    $scope.templates =
//      ['att','400690','test2']
//
        $scope.setTemplate = function (template) {
//      if (template='att')
//      {
//        $scope.currentVendor='001943';
//      $scope.po1.VendorID='001943';
//        $scope.currentVendor = $scope.vendorIndex[$scope.po1.VendorID];
//      }
//
            //    $scope.po1={};
//        $scope.po1=template;
//        console.log('set_Template.details ')
            $scope.po1.AccountID = template.AccountID;
            $scope.currentAccount = template.AccountID;
            $scope.currentAccount = $scope.accountIndex[$scope.po1.AccountID];
            $scope.po1.Comments = template.Comments;
            $scope.po1.VendorID = template.VendorID;
            $scope.currentVendor = template.VendorID;
            $scope.currentVendor = $scope.vendorIndex[$scope.po1.VendorID];
            $scope.po1.SubTotal =  template.SubTotal;
            $scope.po1.TaxAmount =  template.TaxAmount;
            $scope.po1.POTotal =  template.POTotal;
            $scope.po1.TaxPcnt =  template.TaxPcnt;
            $scope.po1.Freight =  template.Freight;


            if ($scope.po1.AccountID==400690) {
                $scope.twoEnabled=true;

            } else  $scope.twoEnabled=false
            console.log('  $scope.twoEnabled',  $scope.twoEnabled)

            $scope.po1.details = [];
            console.log('template.details ', template.details)
            //.each(template.details, function(val){
            _.each(template.details, function (val, key, list) {

                //console.log('val ',val)
                //console.log('key ',key)
                //console.log('list ',list)
                $scope.po1.details.push(val);//template.details[i]);

            });
//       $scope.po1.details.push(template.details[0]);

        };


        ////////////////////

        $scope.checkName = function (data, id) {
            console.log('data, id', data, id)
            if (id === 2 && data !== 'awesome') {
                return "Username 2 should be `awesome`";
            }
        };


        // selected = $filter('filter')($scope.account, {AccountID: detail.AccountID});
        // detail.AccountName=selected[0].Desc;
        // remove user
        $scope.removeDetail = function (index) {

            //  alert('del '+index+' '+$scope.po1.details[index])
            $scope.po1.Comments += ' deleted ';//+$scope.po1.details[index].AccountID;//+$scope.po1.details[index];

            $scope.po1.details.splice(index, 1);
            // console.log('$scope.po1.Comments ',$scope.po1.Comments)
            $scope.subtot();
            $scope.$apply();

            //  po1.Comments
            //  $scope.save();
            //  var filtered = $filter('filter')($scope.po1.details, { AccountID: $scope.po1.details[index].AccountID } );
            //  console.log('f ',filtered)
            //  if (filtered.length) {
            //    filtered[0].isDeleted = true;
            //  }

        };

        $scope.removeDetail2 = function (index) {

            $scope.po1.twos.splice(index, 1);
            $scope.$apply();
        };
        //////////////////////////////////////////////
        $scope.thisisnotdup = null;
        //if ( (param==0) || (param===' 0') )
        if ($scope.param == 0) {
            $scope.mess = 'Create New PO'
        }
        else {
            $scope.mess = 'Edit PO ';
        }

        console.log('start :', $scope.param + ':', $scope.mess)
        var acctPromise = lookupCacheAcct.getAccounts();
        acctPromise.then(function (cache) {
            $scope.account = cache.data;
            $scope.accountIndex = cache.combo;
            console.log('===========$scope.account ', $scope.account)

        })
            .catch(function (err) {
                console.error('accounts failed', err)
            });

        var tenantPromise = lookupCacheTenant.getTenants();
        tenantPromise.then(function (cache) {
            $scope.tenant = cache.data;

            console.log('===========$scope.tenant ', $scope.tenant)

        })
            .catch(function (err) {
                console.error('tenant failed', err)
           });

        var poPromise = lookupCachePO.getPOs();
        poPromise.then(function (val) {
            // val = all pos retured by promise
            // find does the param match
            if ($scope.param != 0) {
                $scope.po = val.data;
                var po1 = _.find(val.data, function (po1) {
                    return po1.id == $scope.param;
                });

                $scope.po1 = po1;
                console.log('============$scope.po ', $scope.po1);
            } else {

                //  this is a new po
                var templatesPromise = lookupCacheTemplate.getTemplates();
                templatesPromise.then(function (val) {
                    console.log('val', val)
                    $scope.templates = val.data;

                    console.log('templates', $scope.templates)

                    $scope.po1 = {};
                    $scope.po1.pcnt = 1;
                    $scope.po1.Freight = 0;
//   $scope.po1.details={};
//        $scope.po1.details.push({'Quantity': $scope.detail.qty * 1, 'Desc': $scope.detail.desc, 'UnitPrice': $scope.detail.unitprice * 1,
//          'AccountID': $scope.currentAccountDetail.AccountID, 'AccountName': $scope.currentAccountDetail.Desc, 'LineItemTax': taxamt, 'LineItemTot': lineTot});
                    $scope.po1.Date = moment().format('MM/DD/YYYY');
                    $scope.po1.VendorInvDate = moment().format('MM/DD/YYYY');

                    $scope.po1.Status = 'create';
                    //$scope.po1.AccountID = '400690';// just to test two
                    $scope.po1.SubTotal = 0;
                    $scope.po1.TaxAmount = 0;
                    $scope.po1.POTotal = 0;
                    $scope.po1.TaxPcnt = .0875;
                    $scope.po1.details = [];
                    //   $scope.po1.details.push({'Quantity':0, 'Desc': 'test', 'UnitPrice':0,
                    //     'AccountID': 0, 'AccountName': 'test', 'LineItemTax': 0, 'LineItemTot': 0});
                    console.log('======create======$scope.po ', $scope.po1);
                })

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

        $q.all([poPromise, vendorPromise, acctPromise,tenantPromise])
            .then(function () {
                // lets delete added fields here
                if ($scope.param != 0) {
                    $scope.poOrigAll = angular.copy($scope.po1);

                    console.log(' $scope.po1 ', $scope.po1)

                    delete $scope.po1.vendorName;
                    delete $scope.po1.acctDesc;
                    delete $scope.po1.newValue;


                    $scope.poOrig = angular.copy($scope.po1);// for valid state
                    //console.log('po poOrig :: ', $scope.poOrig)
                    //console.log('po after delete 3 :: ', $scope.po1)
                    $scope.currentVendor = $scope.vendorIndex[$scope.po1.VendorID];
                    $scope.currentAccount = $scope.accountIndex[$scope.po1.AccountID];
                    $scope.currentAccountDetail = $scope.accountIndex[$scope.po1.AccountID];

                    console.log('in pom ', $scope.po1.AccountID);
                    if ($scope.po1.AccountID==400690) {
                        $scope.twoEnabled=true;

                    } else  $scope.twoEnabled=false

                    //$scope.currentStatus = $scope.accountIndex[$scope.po1.AccountID];

                    //scope.detail.AccountID =  $scope.accountIndex[$scope.po1.AccountID];
                    //console.log('currentVendor:: ', $scope.currentVendor)
                    // console.log('currentAccount:: ', $scope.currentAccount)
                    $scope.formUpload.$invalid = false;
                    $scope.checkV();
                } else {
//          $scope.po1={};
//          $scope.po1.details={};

                    $scope.formUpload.$invalid = true;
                }

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

        // selected = $filter('filter')($scope.services, {id: daily.SERVICE_ID});
        $scope.showTwoTenant = function (two) {
       // console.log('showTwoTenant ',two,two.TenantID)//,$scope.account)
            var selected = [];
            if (two.TenantID) {
                selected = $filter('filter')($scope.tenant, {TenantID: two.TenantID});
                two.CompanyName = selected[0].CompanyName;
            }
            //if (selected.length>0)
            return selected.length ? selected[0].CompanyName : 'Not set';
        };

        $scope.saveTwo = function (two) {

            console.log('two')
        };


        $scope.checkV = function () {
            var VendorInvNum = $scope.po1.VendorInvNum;
            console.log('VendorInvNum:: ', VendorInvNum)
            //     $rootScope.error = "This is a good vendorInvNum"
//      var match = _.find($scope.po, function (itm) {
//        console.log('Find VendorInvNum:: ',VendorInvNum)
//        $rootScope.error = "Another PO exists with this VendorInvNum!";
//        // alert('err ',$rootScope.error)
//        return itm.VendorInvNum == VendorInvNum;
//
//      })
            //$rootScope.error = null;
            $scope.thisisnotdup = '1';
            var ct = 0;
            angular.forEach($scope.po, function (s, err) {
                ct += 1;
                //        console.log('s ', ct + ':', s.VendorInvNum)
                $rootScope.error = null;
                // checck all but current
                if ((s.VendorInvNum == VendorInvNum) && (s.POID != $scope.po1.POID)) {
                    // alert('Another PO exists with this VendorInvNum: ' + ct)
                    //$rootScope.error = "Another PO "+ s.VendorInvNum+" exists with this VendorInvNum!";
                    $scope.thisisnotdup = null;
                    $rootScope.error = "Failed to login!" + err;
                    console.log('loop VendorInvNum:: ', ct + ':', s.VendorInvNum, $rootScope.error);

                }
            })
            //

            console.log('  $scope.thisisnotdup', $scope.thisisnotdup);

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
            return $scope.formUpload.$invalid;
        };

        $scope.setCurrentAccount = function (account) {
            $scope.po1.AccountID = account.AccountID;
            $scope.currentAccountDetail = account;//.AccountID;
            if ($scope.param != 0) {
                $scope.detail.AccountID = account.AccountID;
                $scope.detail.AccountName = account.AccountName;//777
                $scope.twoEnabled=false;



            } else
            {
                // we are in create mode 400690 = Tenant Charges
                if (account.AccountID==400690) {
                    $scope.twoEnabled=true;
                    $scope.po1.twos = [];
                }

            }
        };
        $scope.setCurrentVendor = function (vendor) {
            $scope.po1.VendorID = vendor.VendorID;// combo



            console.log('in setCV ', $scope.po1.VendorID);
        };

        $scope.setCurrentAccountDetail = function (account) {
            // $scope.CurrentAccountDetail
            $scope.detail.AccountID = account.AccountID;

            console.log('  $scope.detail.AccountID  ', $scope.detail.AccountID)
        };

        $scope.handleRowSelectionDetail = function (row) {
            console.log('  row  ', row)

        }

        // add detail item
        $scope.addDetailItem = function () {

            if (!angular.isArray($scope.po1.details)) {
                console.log('in detail create')
                $scope.po1.details = [];
            }
            $scope.inserted = {
                id: $scope.po1.details.length + 1,
                AccountID:$scope.po1.AccountID,
                Quantity: 1,
                Desc: null,
                UnitPrice: 1,
                Status: "create"

            };
            $scope.po1.details.push($scope.inserted);
        }
//        $scope.inserted = {
//            id: $scope.users.length+1,
//            name: '',
//            status: null,
//            group: null
//        };
//        $scope.users.push($scope.inserted);
//    };
        // add addTwoItem item
        $scope.addTwoItem = function () {
            console.log('in addTwoItem create')

            if (!angular.isArray($scope.po1.twos)) {
                console.log('in twos create')
                $scope.po1.twos = [];
            }
            $scope.inserted = {
                id: $scope.po1.twos.length + 1
              // ,TenantID:'000110540'//$scope.po1.VendorID
               , TenantID: ''
                , Desc:''

            };
            $scope.po1.twos.push($scope.inserted);

            console.log('in addTwoItem post')
        }
        $scope.saveTwoDetail = function (data, index) {
            //$scope.user not updated yet
            //angular.extend(data, {id: id});
            //alert('in save ',index)
            console.log('data saveTwoDetail',data)
            var tenantid = data.TenantID;
           //angular.extend(data, {TenantID: data.TenantID,'TwoID':data.TwoID});//
            angular.extend(data, {TenantID: data.TenantID});//
            console.log('saveDetail ', data);//$scope.currentAccountDetail)
            console.log('  index ', index)

         //   $scope.po1.twos[index] = {'TenantID': tenantid,'CompanyName':data.CompanyName,'Description':data.Description,'TwoID':data.TwoID};
            // since TwoID is readonly I got this as a work
            $scope.po1.twos[index] = {'TenantID': tenantid,'CompanyName':data.CompanyName,'Description':data.Description,'TwoID':$scope.po1.twos[index].TwoID};
            //console.log(' twos ',data.TenantID,data.CompanyName);



        };


        $scope.saveDetail = function (data, index) {
            angular.extend(data, {AccountID: data.AccountID});//
            console.log('saveDetail ', data);//$scope.currentAccountDetail)
            console.log('  index ', index)
            // dont tax if acct is flagged
            var taxamt = 0;
            var unitp = data.UnitPrice * 1
            var lineqty = data.Quantity * 1
            var lineTot = (unitp * lineqty);// keep tax sep
            var notax = lineTot;// keep tax sep
            if ($scope.po1.TaxPcnt != undefined) {
                taxamt = (  $scope.po1.TaxPcnt * lineTot);
                taxamt = (Math.round(taxamt * 100) / 100);
            }

            lineTot = (Math.round(lineTot * 100) / 100);// rounds
            lineTot += taxamt;
            console.log('  unitp  lineqty,  taxamt ,notax, lineTot', unitp, lineqty, taxamt, notax, lineTot);

            $scope.po1.details[index] = {'Quantity': lineqty, 'Desc': data.Desc, 'UnitPrice': unitp, 'AccountID': data.AccountID, 'AccountName': data.AccountName, 'LineItemTax': taxamt, 'LineItemTot': lineTot}
            console.log(' detail ',data.AccountID, 'AccountName', data.AccountName);

            console.log(' $scope.po1.details ', $scope.po1.details[index], $scope.po1.details[index].LineItemTot, $scope.po1.details[index].LineItemTax)
            //console.log(' $scope.po1.details ', $scope.po1.details[1], $scope.po1.details[1].LineItemTot, $scope.po1.details[1].LineItemTax)
            var subt = 0;
            _.each($scope.po1.details, function (num) {
                console.log('num ', num.UnitPrice, num)
                subt += num.UnitPrice * num.Quantity;

            })

            var taxt1 = (subt * ($scope.po1.TaxPcnt) ); //
            var taxt = (Math.round((taxt1) * 100) / 100); //
            var tot = (subt + taxt);

            $scope.po1.SubTotal = subt;
            $scope.po1.TaxAmount = taxt;

            var fgt = $scope.po1.Freight * 1;
            $scope.po1.Freight = fgt;
            var tt = tot + fgt;
            var tt2 = Math.round((tt * 100) / 100);
            $scope.po1.POTotal = tt;
            // $scope.$apply();
            console.log(' Details: subt, taxt1  taxt, tot , frt,  $scope.po1.POTotal ,tt,tt2 ', subt, taxt1, taxt, tot, $scope.po1.Freight, tt, tt2);

        };

        $scope.subtot = function () {
            var subt = 0;
            _.each($scope.po1.details, function (num) {
                console.log('num ', num.UnitPrice, num)
                subt += num.UnitPrice * num.Quantity;

            })

            var taxt1 = (subt * ($scope.po1.TaxPcnt) ); //
            var taxt = (Math.round((taxt1) * 100) / 100); //
            var tot = (subt + taxt);
            $scope.po1.SubTotal = subt;
            $scope.po1.TaxAmount = taxt;
            var fgt = $scope.po1.Freight * 1;
            $scope.po1.Freight = fgt;
            var tt = tot + fgt;
            var tt2 = Math.round((tt * 100) / 100);
            $scope.po1.POTotal = tt;

            console.log('subtots Details: subt, taxt1  taxt, tot , frt,  $scope.po1.POTotal ,tt,tt2 ', subt, taxt1, taxt, tot, $scope.po1.Freight, tt, tt2);
            //$scope.$apply();
        }

        $scope.addDetail = function () {
//
//      console.log('aaddDetail ', $scope.currentAccountDetail)
//      // console.log('id  ',  $scope.currentAccountDetail.AccountID)
//      // = account.AccountID;
//      //alert($scope.selContact);
//      //   $scope.vendor.contacts.push($scope.color);//selContact);
//      //console.log('a ', !angular.isArray($scope.po1.details))
//      if (!angular.isArray($scope.po1.details)) {
//        console.log('in detail create')
//        $scope.po1.details = [];
//      }
//      console.log('  $scope.po1.TaxPcnt ', $scope.po1);// $scope.po1.TaxPcnt)
//      // dont tax if acct is flagged
//      var taxamt = 0;
//      if ($scope.po1.TaxPcnt != undefined) {
//        taxamt = (  ($scope.po1.TaxPcnt) * ($scope.detail.unitprice * $scope.detail.qty));
//        taxamt = (Math.round(taxamt * 100) / 100);
//      }
//
//      var lineTot = ($scope.detail.unitprice * $scope.detail.qty);// keep tax sep
//      lineTot = (Math.round(lineTot * 100) / 100);// rounds
//      // * 1 casts the value as number
//      $scope.po1.details.push({'Quantity': $scope.detail.qty * 1, 'Desc': $scope.detail.desc, 'UnitPrice': $scope.detail.unitprice * 1,
//        'AccountID': $scope.currentAccountDetail.AccountID, 'AccountName': $scope.currentAccountDetail.Desc, 'LineItemTax': taxamt, 'LineItemTot': lineTot});
//      var subt = (Math.round(($scope.po1.SubTotal + lineTot) * 100) / 100); //
//      var taxt = (Math.round(($scope.po1.TaxAmount + taxamt) * 100) / 100); //
//      var tot = (Math.round(($scope.po1.POTotal + subt + taxt) * 100) / 100); //
//      console.log('  subt  taxt, tot , frt', subt, taxt, tot,$scope.po1.Freight);
//      $scope.po1.SubTotal = subt;
//      $scope.po1.TaxAmount = taxt;
//      $scope.po1.POTotal = tot + $scope.po1.Freight;
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


//    $scope.onFileSelect = function($files) {
//      // lets do upload first
//
//      console.log('onFileSelect ',onFileSelect);
//      for (var i = 0; i < $files.length; i++) {
//        var $file = $files[i];
//        console.log($file);
//        $http.uploadFile({
//          url: '/upload', //upload.php script, node.js route, or servlet uplaod url)
//          data: {myObj: $scope.myModelObj},
//          file: $file
//        }).then(function(data, status, headers, config) {
//            // file is uploaded successfully
//            console.log(data);
//            // });
//            if (status.status='success') {
//              // console.log ('status ',status.status);
//              //$location.path('/casprint');
//            } }).error(error);
//      }
//    }
        //  PO.updateWrapped(( $scope.po1)); // changed to test pdfCreate

        $scope.savepdf = function (rec) {
// dont plan to use
            console.log('pdfCreate create ', rec, $scope.po1);
            PO.updatePDF(( $scope.po1), function (success, error) {

            });
        }

        //save
        //      var s1 = ($scope.po1.Freight * 1) + ($scope.po1.TaxAmount * 1) + ($scope.po1.SubTotal * 1);
//      console.log('the total ', s1)
//      $scope.po1.POTotal = s1;
//      $scope.checkV();
//      console.log('$files ',$files);
//      for (var i = 0; i < $files.length; i++) {
//        var $file = $files[i];
//        console.log($file);
//        $http.uploadFile({
//          url: '/upload', //upload.php script, node.js route, or servlet uplaod url)
//          data: {myObj: $scope.myModelObj},
//          file: $file
//        }).then(function(data, status, headers, config) {
//            // file is uploaded successfully
//            console.log(data);
//            // });
//            if (status.status='success') {
//              // console.log ('status ',status.status);
//              //$location.path('/casprint');
//            } }).error(error);
//      }
        $scope.save = function (success, error) {

             console.log('save create1 ', $scope.po1.POID,$scope.param)
            if ($scope.param == 0) {
                console.log('save create2 ', $scope.po1)
                var partVendor = {};
                partVendor.VendorID = $scope.currentVendor.VendorID;
                partVendor.CompanyName = $scope.currentVendor.CompanyName;

                $scope.po1.vendor = partVendor;// $scope.currentVendor; limit the fields stored
                $scope.po1.vendorName = $scope.currentVendor.CompanyName;
                $scope.po1.acctDesc = $scope.currentAccount.Desc;
                //console.log('$scope.po1.vendor ',$scope.po1.vendor)

                PO.create(( $scope.po1), function (success, error) {
                    console.log('create success ', success, error, success.data, success.data.POID);
                    if (success.data.POID !== 0) {
                        console.log('in succ', success.data.POID)

                        // var poPromise = lookupCachePO.resetPO();// look to refactor
                        var poPromise = lookupCachePO.resetPO();// look to refactor

//console.log('partVendor.VendorID ',partVendor.VendorID ,'  partVendor.CompanyName ', partVendor.CompanyName,'scope.po1.vendorName ',$scope.po1.vendorName)
                        $location.path('/po/' + success.data.id);

//            $location.path('/po');


                        //   if ($scope.po1.POID !== undefined){
                        //     $location.path('/po/'+$scope.po1.id);
                        //   }
                        //          $scope.po1.POID=success.data.POID;
                        //          $scope.param=success.data.POID;
//            console.log('create  $scope.po1.POID ', $scope.po1.POID);
                    }
                });
            } else {

                //      console.log('save with poid')
                var id = $scope.po1.id;
                //// delete $scope.po.id; // if i delete update does not work      //console.log('back  - ',$scope.po1,id);
                //   this stoped working // PO.updateWrapped(({id: id}, $scope.po1)); //$scope.po or tmp updates json without the id
                //   PO.update(({id: id}, $scope.po1)); // updates json without the id
                //   PO.updateWrapped(( $scope.po1)); // changed to test pdfCreate updatePdf
                console.log(' updatePdf. ')
                PO.updateWrapped(( $scope.po1));
                // place values back from poview
                // store object vendor
                var partVendor = {};
                partVendor.VendorID = $scope.currentVendor.VendorID;
                partVendor.CompanyName = $scope.currentVendor.CompanyName;
                $scope.po1.vendor = partVendor;// $scope.currentVendor; limit the fields stored
                $scope.po1.vendorName = $scope.currentVendor.CompanyName;
                $scope.po1.acctDesc = $scope.currentAccount.Desc;
                // $scope.po1.newValue = 'test';//  $scope.poOrig.newValue; // just for test
                //console.log(' $scope.po1.POID. ',$scope.po1.POID)
             // RESEET

                $location.path('/po');
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

angular.module('crmApp')
    .controller('POCtrl', ['$rootScope', '$scope', 'PO', '$location', '$http', 'Auth', 'comboHelper' ,
    'Vendor' , '$q', 'lookupCache', 'lookupCachePO', 'lookupCacheAcct',
    function ($rootScope, $scope, PO, $location, $http, Auth, comboHelper, Vendor, $q, lookupCache, lookupCachePO, lookupCacheAcct) {
        console.log(' This is POCtrl 6')
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

                $scope.filterOptions.filterText='create';
                console.log('$scope.filterOptions.filterText ',$scope.filterOptions.filterText)
             //   $scope.gridOptions1.filterOptions.filterText='create';
            });
        $scope.setCurrentPO = function (po) {
            console.log('currentPO  ', po);
            console.log('po.VendorNumber  ', po.VendorID);
            $scope.currentVendor = $scope.vendorIndex[po.VendorID];
        };

        $scope.status = function (sval) {
            console.log('in ed ', sval);
            $scope.filterOptions.filterText = sval;
        }

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
        var editpdfTemplate = '<a  ng-href="/uploads/{{row.entity.PDF}}" target=\'_blank\' >{{row.getProperty(col.field)}}</a>';
        var editpdfRptTemplate = '<a  ng-href="/uploads/po{{row.entity.PDF}}" target=\'_blank\' >po{{row.getProperty(col.field)}}</a>';
        //   var editpdfTemplate = '<a class="icon-edit edit" ng-href="/uploads/{{row.entity.PDF}}" target=\'_blank\' >{{row.getProperty(col.field)}}</a>';

        // this does edit in js
        //   var editrowTemplate = '<i class="icon-edit edit" ng-click="editrow(row.entity)"></i>';
//  { field: 'POTotal', displayName: 'POTotal', groupable: false, width: 125,cellFilter:'money',cellClass:'right'},

//  { field: 'Date', displayName: 'Date', groupable: true, width: 200, cellFilter: "moment:'MM/DD/YYYY'",cellTemplate:displayDateTemplate},
//  $scope.filteringText = '';
        $scope.filterOptions = {
            filterText: 'create',          //filteringText
            useExternalFilter: false
        };

        $scope.colDefs = [
            { field: 'PONumber', displayName: 'PO#', groupable: false, width: 70 },
            { field: 'PDF', displayName: 'Inv', groupable: false, width: 70, cellTemplate: editpdfTemplate },
            { field: 'PDF', displayName: 'PO', groupable: false, width: 85, cellTemplate: editpdfRptTemplate },
            { field: 'edit', displayName: 'Edit', headerClass: 'Edit', width: '40', cellTemplate: editrowTemplate },
            { field: 'Status', displayName: 'Status', groupable: true, width: 70 },
            { field: 'acctDesc', displayName: 'AcctDesc', groupable: true, width: 200},
            { field: 'Date', displayName: 'Date', groupable: true, width: 100, cellFilter: "moment:'MM/DD/YYYY'"},
            { field: 'vendorName', displayName: 'vendorName', groupable: true, width: 170 },
            //{ field: 'POType', displayName: 'Type', groupable: true, width: 60 },
            //{ field: 'newValue', displayName: 'newValue', groupable: true, width: 120 },

            //        { field: 'DateofLoss', displayName: 'Date of Loss', width: 100  }, //   cellFilter: " moment:'dddd'" hh:mm a ddd Do not display currency symbol},
            { field: 'POTotal', displayName: 'POTotal', width: 105, cellTemplate: greenTemplate},
            { field: 'SubTotal', displayName: 'SubTotal', groupable: false, width: 95, cellTemplate: green2Template},
            { field: 'TaxPcnt', displayName: 'TaxPcnt', width: 100, groupable: true, cellTemplate: green3Template },
            { field: 'TaxAmount', displayName: 'TaxAmt', width: 80, cellTemplate: green2Template},
            { field: 'Freight', displayName: 'Freight', groupable: true, width: 60, cellTemplate: green2Template},
            { field: 'Comments', displayName: 'Comments', width: 175},
            { field: 'VendorInvNum', displayName: 'VendorInvNum', width: 175},
            { field: 'vendor', displayName: 'Vendor', width: 175},
            { field: 'vendor.CompanyName', displayName: 'CompName', width: 175}
        ]
// console.log('$scope.colDefs ',$scope.colDefs)
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



