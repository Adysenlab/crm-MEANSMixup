'use strict';

angular.module('crmApp')
  .factory('PO',  ['$resource', '$log', function($resource, $log){
    console.log('in PO  fac ')//,action,id)
    return $resource(
      '/po/:action/:id',
      {action: '@action', id: '@id' },
      {
        pdfCREATE: {method: 'PUT' , params: {id: '@id'} },
        findAll: {method: 'GET', isArray: true},   // same as query
        find1: {method: 'GET', params: {id: '@id'}},
        stuffed: {method: 'GET', params: {action: 'stuffed'} },   // see PoController from sails res.json({ data: peos });
        findAllWrapped: { method: 'GET', params: { action: 'findAllWrapped'} },
        create:{method:'POST', params:{action:'create'}},         // post for create, put for update,params: {id:'@id'} this forces action for sails controller
        createDefault:{method:'POST'},         // auto post object built in sails rest service
        update: {method: 'PUT', params: {id: '@id'} },
       // pdfCREATE: {method: 'POST', params:  { action: 'pdfCREATE'} },
        //updatePdf: {method: 'PUT', params:  { action: 'updatePdf'} },
        updatePDF: {method: 'PUT', params:  { action:'updatePDF'} },
        updateWrapped: {method: 'PUT', params:  { action:'updateWrapped'} },
        saveGrid:{method:'PUT', params: {action:'saveGrid'}},
        getGrid: {method: 'GET',params: {action: 'getGrid'} },// params: {id: '@id'},isArray: false},
        createGrid: { method: 'POST', params: {id: '@id'} }

        // updateWrapped: {method: 'PUT' }

      }
    )
}]);