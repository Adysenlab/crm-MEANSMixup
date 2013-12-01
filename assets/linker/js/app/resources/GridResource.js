'use strict';


angular.module('crmApp')
  .factory('GridResource', ['$resource', function($resource) {
    return $resource(
      '/grid/:action/:id',
      { action: '@action', id: '@id' },
      {
        create: { method: 'POST', params: {arrayObj: '@id'} },
          saveGrid:{method:'PUT', params: {action:'saveGrid'}},
          getGrid: {method: 'GET',params: {action: 'getGrid'} }

      }
    );
  }]);
