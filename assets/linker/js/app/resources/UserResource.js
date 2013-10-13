'use strict';


//  angular.module('application')
//      .factory('User', ['$resource', '$log', function($resource, $log) {
//  return $resource(
//    '/user/:action/:id',
//    {action:'@action', id:'@id' },
//      }, {
//        register: {
//          method: 'POST',
//          params: { action: 'register' }
//        },
//        login: {
//          method: 'POST',
//          params: { action: 'login' }
//        },
//        logout: {
//          method: 'GET',
//          params: { action: 'logout' }
//        },
//        checkLogin: {
//          method: 'GET',
//          params: { action: 'checkLogin' }
//        }
//      });
//  }]);
angular.module('application')
.factory('User', ['$resource', function($resource){
  console.log('in user fac ')//,action,id)
  return $resource(
    '/user/:action/:id',
    {action:'@action', id:'@id' },
    {
      findAll:{method:'GET',isArray:false},   // same as query
      find1: {method:'GET',params: {id:'@id'}} ,
      create:{method:'POST', params:{action:'create'}},         // post for create, put for update,params: {id:'@id'} this forces action for sails controller
      createDefault:{method:'POST'},         // auto post object built in sails rest service

      update:{method:'PUT',params: {id:'@id'} },
      remove :{method:'DELETE',params: {id:'@id'} },
      destroy :{method:'DELETE',params: {id:'@id'} },
      delete: {  method: 'DELETE',  isArray:true, params: {    id1:"@id"  }}
    }
  )
}])


