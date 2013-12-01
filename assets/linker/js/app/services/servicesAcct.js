'use strict';
angular.module('crmApp')
  .factory('lookupCacheAcct', function(Account, comboHelper, $q) {
    var caches = {
      accounts: {
        data: [],
        combo: [],
        deferred: null
      }
    };
    // populateCache('vendors', Vendor, 'VenderID')
    var populateCache = function(cacheName, Resource, comboProperty) {
      console.log('populating cache:  '+cacheName);
      //console.log('populating Resource:  '+Resource);

      var thisCache = caches[cacheName];
      thisCache.deferred = $q.defer();
      Resource.findAllWrapped().$promise
        .then(function (response) {
          console.log('getting accts data from server')
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
//      get: function(cacheName, Resource, comboProperty) {
//        console.log('getting cache: '+cacheName);
//        var thisCache = caches[cacheName];
//        if (thisCache.deferred === null) { // never been tried
//          populateCache(cacheName, Resource, comboProperty);/* returns thisCache.deferred.promise */
//        }
//        return thisCache.deferred.promise;
//      },
      getAccounts: function() {
        console.log('getting cache: accounts');
        var thisCache = caches.accounts;
        if (thisCache.deferred === null) { // never been tried
          populateCache('accounts', Account, 'AccountID');/* returns thisCache.deferred.promise */
        }
        return thisCache.deferred.promise;
        // // returns promise to the cache.vendors object
        // return serviceAPI.get('vendors', Vendor, 'VenderID');
      }
    };
    return serviceAPI;
  })
