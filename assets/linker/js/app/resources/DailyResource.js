'use strict';


angular.module('crmApp')
  .factory('DailyResource', ['$resource', function($resource) {
    return $resource(
      '/daily/:action/:id',
      { action: '@action', id: '@id' },
      {
        create: { method: 'POST', params: {arrayObj: '@id'} }
      }
    );
  }]);
