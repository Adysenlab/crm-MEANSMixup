'use strict';
angular.module('crmApp')
    .factory('Tenant', ['$resource', '$log', function ($resource, $log) {
        console.log('in fac Tenant')
        return $resource(
         '/tenant/:action/:id',
      {action: '@action', id: '@id' },
      {
        findAll: {method: 'GET', isArray: false},   // same as query
        find1: {method: 'GET', params: {id: '@id'}}


      }
    )
}]);