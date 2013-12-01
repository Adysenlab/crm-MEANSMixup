'use strict';
angular.module('crmApp')
  .factory('Auth', function($http, $rootScope, $cookieStore, $log) {
    /* jshint bitwise:false */

    var accessLevels = routingConfig.accessLevels;
    var userRoles = routingConfig.userRoles;

    $rootScope.user = $cookieStore.get('user') || { username: '', role: userRoles.public };// ,adjusterid:''};

    // $rootScope.user = {"id" : 1, "username" : "user", "password" : "123", "role" : 4    };


    console.log('i $rootScope.user = ', $rootScope.user);

        $cookieStore.remove('user');

        $rootScope.accessLevels = accessLevels;
        $rootScope.userRoles = userRoles;

        return {
            authorize: function (accessLevel, role) {
                if (role === undefined)
                    role = $rootScope.user.role;
                return accessLevel & role;
            },
            isLoggedIn: function (user) {
                if (user === undefined)
                    user = $rootScope.user;
                return user.role === userRoles.user || user.role === userRoles.admin;
            },
            register: function (user, success, error) {
                $http.post('/register', user).success(success).error(error);
            },
            login: function (user, success, error) {
                $http.post('/login', user).success(function (user) {
                    $rootScope.user = user;

                    console.log ('login user ',user)
                    success(user);
                }).error(error);
            },
      logout: function(success, error) {
        console.log('logging out');
        $http.get('/logout')
          .success(function() {
            $rootScope.user.username = '';
            $rootScope.user.role = userRoles.public;
            success();
          })
          .error(function() {
            console.error('error in logout');
            error();
          });
      },
            accessLevels: accessLevels,
            userRoles: userRoles
        };
    })
    .factory('comboHelper', function () {
        var buildIndex = function (source, property) {
            var tempArray = [];
            for (var i = 0, len = source.length; i < len; ++i) {
                tempArray[source[i][property]] = source[i];
                //tempArray[source[i]['VendorID']] = source[i];
            }


            return tempArray;
        };
        return {
            buildIndex: buildIndex
        };
    })
    .factory('lookupCache', function(Vendor, comboHelper, $q) {
        var caches = {
            vendors: {
                data: [],
                combo: [],
                deferred: null
            }
        };


        // populateCache('vendors', Vendor, 'VenderID')
        var populateCache = function(cacheName, Resource, comboProperty) {
            console.log('populating cache:  '+cacheName);
            var thisCache = caches[cacheName];
            thisCache.deferred = $q.defer();
            Resource.findAllWrapped().$promise
                .then(function (response) {
                    console.log('getting vendor data from server')

                    thisCache.data = response.data;
                    thisCache.combo = comboHelper.buildIndex(thisCache.data, comboProperty);
                    thisCache.deferred.resolve(thisCache);
                })
                .catch(function (err) {
                    console.error('lookupCache::populateVendor failed', err);
                    thisCache.deferred.reject(err);
                });
            return thisCache.deferred.promise;
        };

        var serviceAPI = {

            getVendors: function() {
                console.log('getting cache: vendors');
                var thisCache = caches.vendors;
                if (thisCache.deferred === null) { // never been tried
                    populateCache('vendors', Vendor, 'VendorID');/* returns thisCache.deferred.promise */
                }
                return thisCache.deferred.promise;
                // // returns promise to the cache.vendors object
                // return serviceAPI.get('vendors', Vendor, 'VenderID');



            },
            pushVendor: function(vendor) {

                var thisCache = caches.vendors;
                console.log('push vendor:',vendor);

                thisCache.data.push(vendor);
                console.log('thisCache vendor:',thisCache);
                return thisCache.deferred.promise;
            },

            updateVendor: function(vendor) {

                var thisCache = caches.vendors;
                console.log('updateVendor :',vendor);//,'--',vendor);

                var idx = 0;

                //  var match = _.detect(thisCache.data, function (itm) {
                var match = _.find(thisCache.data, function (itm) {
                    return itm.id === vendor.id || ++idx == thisCache.data.length && (idx = -1);
                })

                console.log('idx ',idx,' match ',match)
                thisCache.data[idx]=vendor; // this works also ???

                return thisCache.deferred.promise;
                // // returns promise to the cache.vendors object //return serviceAPI.get('vendors', Vendor, 'VenderID');
            },
            resetVendors:function(){

                var thisCache = caches.vendors;
                thisCache.deferred = null;
                var vendorPromise = serviceAPI.getVendors();
                vendorPromise.then(function(cache) {
                    //populateCache('vendors', Vendor, 'VendorID');
                    //console.log('in v reset')
                    return thisCache.deferred.promise;
                })
            }
        };
        return serviceAPI;
    })


//  .factory('comboHelper1', function ($q) {
//    var deferred = $q.defer();
//    return {
//      buildIndex: function (source, property) {
//        var tempArray = [];
//      for (var i = 0, len = source.length; i < len; ++i) {
//        tempArray[source[i][property]] = source[i];
//      }
//        deferred.resolve(tempArray);
//        return deferred.promise;
//      }
//    };
//  })
//
//.factory('comboHelper2', function($q) {
//
//  var buildIndex = function(source, property) {
//    var deferred = $q.defer();
//
//    var tempArray = [];
//      for (var i = 0, len = source.length; i < len; ++i) {
//        tempArray[source[i][property]] = source[i];
//      }
//    console.log('tempArray', tempArray)
//        deferred.resolve(tempArray);
//    return deferred.promise;
//  };
//
//    return {
//      buildIndex: buildIndex
//    };
//  })

//
//
//  .factory('comboHelper', function($q, $timeout) {
//
//    var buildIndex = function(source, property) {
//      var deferred = $q.defer();
//
//      $timeout(function() {
//        //deferred.resolve(['Hello', 'world']);
//
//        var tempArray = [];
//        for (var i = 0, len = source.length; i < len; ++i) {
//          tempArray[source[i][property]] = source[i];
//        }
//        deferred.resolve(tempArray);
//        console.log('tempArray ',tempArray)
//      }, 2000);
//
//      return deferred.promise;
//    };
//    console.log('buildIndex',{   buildIndex: buildIndex })
//    return {
//      buildIndex: buildIndex
//    };
//
//  })



//  .factory('comboHelper', ['$q', function ($q) {
//    var comboHelper = {};
//    var deferred1 = null;
//    comboHelper.buildIndex = function (source, property) {
//      if (deferred1 === null) {
//        comboHelper.init(source, property);
//      }
//      return deferred1.promise;
//    }
//    //}
//    comboHelper.init = function (source, property) {
//      // comboHelper.Code1 = {};
//      console.log('source.length', source.length)
//      deferred1 = $q.defer();
//      var tempArray = [];
//      for (var i = 0, len = source.length; i < len; ++i) {
//        tempArray[source[i][property]] = source[i];
//      }
//      console.log('tempArray', tempArray)
//      return  deferred1.resolve(tempArray);
//
//    };
//    //return {data: comboHelper};
//    return comboHelper;
//
//  }])


    .factory('masCrud', ['socket', '$q', function (socket, $q) {
        var masCrud = {};
        var deferred1 = null;
        var deferred2 = null;
        masCrud.postDaily = function (currentDaily) {
            //  return name.split("").reverse().join("");

            currentDaily.DAILY_ID = 0;
            //console.log('dds ', currentDaily.DAILY_DETAIL_ID);
            socket.emit('senddaily', currentDaily);
            socket.on('responsedaily', function (obj) {

                if (currentDaily.DAILY_DETAIL_ID === 'new') {
                    //console.log('in new')
                    currentDaily.DAILY_DETAIL_ID = obj.result;
                }
                return    currentDaily;
            });
        }

        masCrud.getClaims = function () {
            if (deferred1 === null) {
                masCrud.initClaims();
            }
            return deferred1.promise;
        }
        masCrud.resetClaims = function () {
            // when login as dif user
            // alert('in reset');
            deferred1 = null;
        }
        masCrud.initClaims = function () {
            //console.log('in 22 init');
            masCrud.claims = {};
            deferred1 = $q.defer();
            setTimeout(function () {
                socket.emit('getclaims', {});
                socket.on('initclaims', function (obj) {
                    masCrud.claims = obj.Claims;
                    //   console.log()
                    deferred1.resolve(masCrud.claims);
                });
            }, 1000);
            return deferred1.promise;
        }

        return masCrud;
    }])


    .factory('serviceCodes', ['socket', '$q', function (socket, $q) {
        var serviceCodes = {};
        var deferred1 = null;
        var deferred2 = null;
        var deferred3 = null;

        serviceCodes.getCode1 = function () {
            if (deferred1 === null) {
                serviceCodes.init();
            }
            return deferred1.promise;
        }
        serviceCodes.getCode2 = function () {
            if (deferred2 === null) {
                serviceCodes.init();
            }
            return deferred2.promise;
        }
        serviceCodes.getCode3 = function () {
            if (deferred3 === null) {
                serviceCodes.init();
            }
            return deferred3.promise;
        }


        serviceCodes.init = function () {
            serviceCodes.Code1 = {};
            deferred1 = $q.defer();
            deferred2 = $q.defer();
            deferred3 = $q.defer();
            setTimeout(function () {
                // since this fn executes async in a future turn of the event loop, we need to wrap
                // our code into an $apply call so that the model changes are properly observed.
                //console.log('in init');
                socket.emit('getcodeTypes', {});
                socket.on('initcode1', function (obj) {
                    serviceCodes.Code1 = obj.Code1;
                    deferred1.resolve(serviceCodes.Code1);

                });

                socket.emit('getcodeService', {});
                socket.on('initcode2', function (obj) {
                    serviceCodes.Code2 = obj.Code2;
                    deferred2.resolve(serviceCodes.Code2);

                });

                socket.emit('getcodeExpense', {});
                socket.on('initcode3', function (obj) {
                    serviceCodes.Code3 = obj.Code3;
                    deferred3.resolve(serviceCodes.Code3);

        });
      }, 1000);
      //   return deferred.promise;
    };

    return serviceCodes;
  }]);
