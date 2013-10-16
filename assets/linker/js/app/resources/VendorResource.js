'use strict';

angular.module('crmApp')
  .factory('VendorResource', ['$resource', function($resource) {
    return $resource(
      '/vendor/:action/:id', {
        action: '@action',
        id: '@id'
      }, {
        findAll: { method: 'GET', isArray: true },   // same as query
        findAllWrapped: { method: 'GET', params: { action: 'findAllWrapped'} },
        find1: { method: 'GET', params: {id: '@id'} },
        update: { method: 'PUT', params: {id: '@id'} },
        create: { method: 'POST', params: {id: '@id'} }
//        upsert: { method: 'PUT', params: {id: '@id'} }
      }
    );
  }]);
