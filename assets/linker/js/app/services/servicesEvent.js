'use strict';
angular.module('crmApp')
  .factory('lookupCacheEvent', function(EventResource, comboHelper, $q) {
    var caches = {
      events: {
        data: [],
        combo: [],
        deferred: null
      }
    };

    var populateCache = function(cacheName, Resource, comboProperty) {
      console.log('populating cache:  ' + cacheName);


      var thisCache = caches[cacheName];
      thisCache.deferred = $q.defer();
      Resource.findAll().$promise
        .then(function(response) {
          console.log('getting Events data from server');
          thisCache.data = response.data;
         // thisCache.combo = comboHelper.buildIndex(thisCache.data, comboProperty);
          thisCache.deferred.resolve(thisCache);
        })
        .catch (function(err) {
          console.error('lookupCache::populateEvent failed', err);
          thisCache.deferred.reject(err);
        });
      return thisCache.deferred.promise;
    };
    var serviceAPI = {
      getEvents: function() {
        console.log('getting cache: Events');
        var thisCache = caches.events;


        if (thisCache.deferred === null) { // never been tried
          populateCache('events', EventResource, 'ID');/* returns thisCache.deferred.promise */
        }
        return thisCache.deferred.promise;
        // // returns promise to the cache.vendors object
        // return serviceAPI.get('vendors', VendorResource, 'VenderID');
      }
    };
    return serviceAPI;
  });
