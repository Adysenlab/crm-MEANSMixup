'use strict';


angular.module('application')
  .factory('Email', ['$resource', function ($resource) {
    //console.log('in Email  fac ')//,action,id)
    return $resource(
      //'/home/:action/:id',
      '/email/:action/:id',
      {action: '@action', id: '@id' },
      {
        //findAll: {method: 'GET', isArray: true},   // same as query
        //find1: {method: 'GET', params: {id: '@id'}},
        // stuffed:{method:'GET',isArray:true,params: {action:'stuffed'} },   //see PoController from sails  res.json(peos);
        //stuffed: {method: 'GET', params: {action: 'stuffed'} },   // see PoController from sails res.json({ data: peos });

        create: {method: 'POST', params: {id: '@id'} }         // post for create, put for update

        //   create:{method:'POST',params:{id:'create'}},         // post for create, put for update
        //update: {method: 'PUT', params: {id: '@id'} },
        //updateWrapped: {method: 'PUT', params:  { action: 'updateWrapped'} }


      }
    )
  }])