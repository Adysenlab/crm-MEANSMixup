'use strict';
angular.module('crmApp')
    .factory('Tenantcategory', ['$resource', '$log', function ($resource, $log) {
        console.log('in fac Tenantcategory')
        return $resource(
         '/tenantcategory/:action/:id',
      {action: '@action', id: '@id' },
      {
        findAll: {method: 'GET', isArray: true},   // same as query
        find1: {method: 'GET', params: {id: '@id'}}


      }
    )
}]);