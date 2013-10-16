'use strict';

angular.module('crmApp')
  .factory('EventResource', ['$resource', function($resource) {
    return $resource(
      '/event/:action/:id',
      { action: '@action', id: '@id' },
      {
        findAll: { method: 'GET', isArray: false}, // same as query
        find1: { method: 'GET', params: {id: '@id'} } ,
        create: { method: 'POST', params: {action: 'create'} }, // post for create, put for update,params: {id:'@id'} this forces action for sails controller
        createDefault: { method: 'POST'}, // auto post object built in sails rest service

        update: { method: 'PUT', params: {id: '@id'} },

        destroy: { method: 'DELETE', params: {id: '@id'} }
      }
    );
  }]);


