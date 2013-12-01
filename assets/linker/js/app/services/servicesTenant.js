'use strict';
angular.module('crmApp')
    .factory('lookupCacheTenant', function(Tenant, comboHelper, $q) {
        var caches = {
            tenants: {
                data: [],
                combo: [],
                deferred: null
            }
        };
        var populateCache = function(cacheName, Resource, comboProperty) {
            console.log('populating cache:  '+cacheName);

            var thisCache = caches[cacheName];
            thisCache.deferred = $q.defer();
            Resource.findAll().$promise
                .then(function (response) {

                    thisCache.data = response.data;// object not array
                    thisCache.combo = comboHelper.buildIndex(thisCache.data, comboProperty);
                    console.log('getting tenants data from server ', thisCache.data )
                    thisCache.deferred.resolve(thisCache);
                })
                .catch(function (err) {
                    console.error('lookupCache::populateVendor failed', err);
                    thisCache.deferred.reject(err);
                });
            return thisCache.deferred.promise;
        };
        var serviceAPI = {
            getTenants: function() {
                console.log('getting cache: tenants');
                var thisCache = caches.tenants;
                if (thisCache.deferred === null) { // never been tried
                    populateCache('tenants', Tenant, 'TenantID');/* returns thisCache.deferred.promise */
                }
                return thisCache.deferred.promise;

            },

            resettenant:function(){
                var thisCache = caches.tenants;
                thisCache.deferred = null;
                populateCache('tenants', Tenant, 'TenantID');
                return thisCache.deferred.promise;
            }
        };
        return serviceAPI;
    })


