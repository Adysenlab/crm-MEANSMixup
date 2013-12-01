'use strict';
angular.module('crmApp')
  .factory('lookupCacheTemplate', function(Template, comboHelper, $q) {
    var caches = {
      templates: {
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

          thisCache.data = response;//.data;
          thisCache.combo = comboHelper.buildIndex(thisCache.data, comboProperty);
          console.log('getting Templates data from server ', thisCache.data )
          thisCache.deferred.resolve(thisCache);
        })
        .catch(function (err) {
          console.error('lookupCache::populateVendor failed', err);
          thisCache.deferred.reject(err);
        });
      return thisCache.deferred.promise;
    };
    var serviceAPI = {
      getTemplates: function() {
        console.log('getting cache: Templates');
        var thisCache = caches.templates;
        if (thisCache.deferred === null) { // never been tried
          populateCache('templates', Template, 'TemplateID');/* returns thisCache.deferred.promise */
        }
        return thisCache.deferred.promise;

      },

        resetTemplate:function(){
            var thisCache = caches.templates;
            thisCache.deferred = null;
            populateCache('templates', Template, 'TemaplateID');
            return thisCache.deferred.promise;
        }
    };
    return serviceAPI;
  })
