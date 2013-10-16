'use strict';


angular.module('crmApp')
  .factory('EmailResource', ['$resource', function($resource) {
    return $resource(
      '/email/:action/:id',
      { action: '@action', id: '@id' },
      {
        create: { method: 'POST', params: {id: '@id'} }
      }
    );
  }]);
