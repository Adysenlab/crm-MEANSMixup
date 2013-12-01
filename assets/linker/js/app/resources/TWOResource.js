'use strict';
angular.module('crmApp')
  .factory('TWO',  ['$resource', '$log', function($resource, $log){
    console.log('in two  fac ')//,action,id)
    return $resource(
      '/two/:action/:id',
      {action: '@action', id: '@id' },
      {
        findAll: {method: 'GET', isArray: false},   // same as query
        find1: {method: 'GET', params: {id: '@id'}},
        //  stuffed:{method:'GET',isArray:true,params: {action:'stuffed'} },   //see PoController from sails  res.json(peos);
        stuffed: {method: 'GET', params: {action: 'stuffed'} },   // see PoController from sails res.json({ data: peos });
        create:{method:'POST', params:{action:'create'}},         // post for create, put for update,params: {id:'@id'} this forces action for sails controller
        createDefault:{method:'POST'},         // auto post object built in sails rest service
        //  create:{method:'POST',params:{id:'create'}},         // post for create, put for update
        update: {method: 'PUT', params: {id: '@id'} },
        //  updateWrapped: {method: 'PUT', params:  {id: '@id'}}//{ action: 'updateWrapped'} }
        updateWrapped: {method: 'PUT', params:  { action: 'updateWrapped'} }

      }
    )
}]);