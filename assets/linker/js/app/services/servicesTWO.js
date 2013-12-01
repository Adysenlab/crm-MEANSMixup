'use strict';
angular.module('crmApp')
    .factory('lookupCacheTWO', function(TWO, comboHelper, $q) {
        var caches = {
            twos: {
                data: [],
                combo: [],
                deferred: null
            }
        };
        var populateCache = function(cacheName, Resource, comboProperty) {
            console.log('populating cache two:  '+cacheName);

            var thisCache = caches[cacheName];
            thisCache.deferred = $q.defer();
            Resource.findAll().$promise
                .then(function (response) {
                    console.log('two popcache response',response)
                    thisCache.data = response.data;// object not array
                //    thisCache.combo = comboHelper.buildIndex(thisCache.data, comboProperty);
                    //console.log('getting two data from server ', thisCache.data )
                    thisCache.deferred.resolve(thisCache);
                })
                .catch(function (err) {
                    console.error('lookupCache::populateVendor failed', err);
                    thisCache.deferred.reject(err);
                });
            return thisCache.deferred.promise;
        };
        var serviceAPI = {

            getTWOs: function() {
                //console.log('getting cache: getTWOs');


                var thisCache = caches.twos;
                if (thisCache.deferred === null) { // never been tried
                    populateCache('twos', TWO, 'TWOID');/* returns thisCache.deferred.promise */

                }
                return thisCache.deferred.promise;


            },

            resetTWO:function(){
                var thisCache = caches.twos;
                thisCache.deferred = null;
                populateCache('twos', TWO, 'TWOID');
                return thisCache.deferred.promise;
            }
        };
        return serviceAPI;
    })


