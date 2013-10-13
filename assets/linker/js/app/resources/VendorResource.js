'use strict';

//angular.module('addicaidMeetingsApp')
//  .factory('CommentResource', ['$resource', '$log', function($resource, $log) {
//    return $resource(
//      '/api/comment/:action', {
//        action: '@action'
//      }, {
//        create: {
//          method: 'POST',
//          params: { action: 'create' }
//        }
//      });
//  }]);
angular.module('application')
  .factory('Vendor', ['$resource', '$log', function ($resource, $log) {
console.log('in fac vendor')
    return $resource(
      '/vendor/:action/:id',
      {action: '@action', id: '@id' },
      {
        findAll: {method: 'GET', isArray: true},   // same as query
        findAllWrapped: {method: 'GET', params: { action: 'findAllWrapped'} },
        find1: {method: 'GET', params: {id: '@id'}},
        update: {method: 'PUT', params: {id: '@id'} },
        create: {method: 'POST', params: {id: '@id'} }
        //upsert: {method: 'PUT', params: {id: '@id'} }
      }
    )
  }]);