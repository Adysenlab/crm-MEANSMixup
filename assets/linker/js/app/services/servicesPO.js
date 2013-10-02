'use strict';

angular.module('application')
  //.factory('checkUniqueValue' ,function (id, property, value) {
//customersFactory.checkUniqueValue = function (id, property, value) {
//
//  console.log('fac ',PO)
//    var ct=0;
//    if (!id) id = 0;
//    angular.forEach(PO, function (s,err) {
//      ct += 1;
//      console.log('s ', ct + ':', s.VendorInvNum)
//      $rootScope.error = null;
//      // checck all but current
//      if ((s.VendorInvNum == property) && (s.POID != id))
//      {
//        $scope.thisisnotdup=null;
//        $rootScope.error = "Failed to login!"+err;
//        console.log('loop VendorInvNum:: ', ct + ':', s.VendorInvNum,$rootScope.error );
//        return true;
//      }
//    })
//    //
//    //      return $http.get(serviceBase + 'checkUnique/' + id + '?property=' + property + '&value=' + escape(value)).then(
//    //        function (results) {
//    //          return results.data.status;
//    //        });
//  })
  .factory('lookupCachePO', function(PO, comboHelper, $q) {
    var caches = {
      pos: {
        data: [],
        combo: [],
        deferred: null
      }
    };
    var deferred2 = null;

    // populateCache('vendors', Vendor, 'VenderID')
    var populateCache = function(cacheName, Resource, comboProperty) {
      console.log('populating cache:  '+cacheName);
      var thisCache = caches[cacheName];
      thisCache.deferred = $q.defer();
      Resource.stuffed().$promise
        .then(function (response) {
          //console.log('getting po data from server')

          thisCache.data = response.data;
          thisCache.combo = comboHelper.buildIndex(thisCache.data, comboProperty);
          thisCache.deferred.resolve(thisCache);
        })
        .catch(function (err) {
          console.error('lookupCache::populatePO failed', err);
          thisCache.deferred.reject(err);
        });
      return thisCache.deferred.promise;
    };

    var serviceAPI = {
//      get: function(cacheName, Resource, comboProperty) {
//        console.log('getting cache: '+cacheName);
//        var thisCache = caches[cacheName];
//        if (thisCache.deferred === null) { // never been tried
//          populateCache(cacheName, Resource, comboProperty);/* returns thisCache.deferred.promise */
//        }
//        return thisCache.deferred.promise;
//      },
      getPOs: function() {
        console.log('-------------------------------------------------------------------------------------');
        console.log('getting cache: getPOs');
        var thisCache = caches.pos;
        if (thisCache.deferred === null) { // never been tried
          populateCache('pos', PO, 'POID');/* returns thisCache.deferred.promise */
        }
        return thisCache.deferred.promise;
        // // returns promise to the cache.vendors object
        // return serviceAPI.get('vendors', Vendor, 'VenderID');
      },
      resetPO:function(){
        var thisCache = caches.pos;
          thisCache.deferred = null;
        populateCache('pos', PO, 'POID');
        return thisCache.deferred.promise;
      },

      checkUniqueValue: function (id,vendorid, vendorinvno, value) {
        console.log('=====id-key-prop=======checkUniqueValue:1: ',id,vendorid,vendorinvno )
        deferred2 = $q.defer();
        if (!vendorid) vendorid = 0;
        var poPromise= serviceAPI.getPOs();
        poPromise.then(function (val) {

          var find1 = false;
          find1 = _.find(val.data, function (rec) {
            return ((rec.VendorID == vendorid) && (rec.VendorInvNum == vendorinvno) && (rec.POID != id) )//id))
          });
          deferred2.resolve(!find1); // send the opposite because true=fail

//          var ct = 0;
//          var keepGoing = true;
//          angular.forEach(val.data, function (s,err) {
//            ct += 1;
//            if(keepGoing) {
//            if ((s.VendorID == vendorid) && (s.VendorInvNum == vendorinvno) && (s.POID != id) )//id))
//            {
//              // alert('Another PO exists with this VendorInvNum: ' + ct)
//              console.log('loop VendorInvNum:: ', ct + ':', s.VendorInvNum);//,$rootScope.error );
//              //deferred2.resolve(false);
//              keepGoing = false;
//            }
//            }
//          })
//       deferred2.resolve(keepGoing); // only set this 1 time. if keepgoing then no dups found

        }) .catch(function (err) {
            console.error('po failed', err)
            deferred2.resolve(false);
          });
        return deferred2.promise;

      }
    };
      return serviceAPI;
  })

