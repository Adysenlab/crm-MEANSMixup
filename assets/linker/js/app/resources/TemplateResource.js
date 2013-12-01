'use strict';


angular.module('crmApp')
.factory('Template', ['$resource', function($resource){
  return $resource(
    '/template/:action/:id',
    {action:'@action', id:'@id' },
    {
      findAll:{method:'GET',isArray:true},   // same as query
    //  findAllWrapped: {method: 'GET', params: { action: 'findAllWrapped'} },
      find1: {method:'GET',params: {id:'@id'}} ,
      create: {method: 'POST', params: {id: '@id'} },         // post for create, put for update
      update:{method:'PUT',params: {id:'@id'} },
      upsert:  {method:'PUT',params: {id:'@id'} }
    }
  )
}]);
