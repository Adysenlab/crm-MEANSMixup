'use strict'
/**
 * The application file bootstraps the angular app by  initializing the main module and
 * creating namespaces and moduled for controllers, filters, services, and directives.
 */

var Application = Application || {};
//console.log('assets/js');
Application.Services = angular.module('application.services', []);
Application.Controllers = angular.module('application.controllers', []);
Application.Filters = angular.module('application.filters', []);
Application.Directives = angular.module('application.directives', []);
//Application.angulartable = angular.module('angular-table', []);

//angular.module('angular-client-side-auth', ['ngCookies','angular-client-side-auth.filters' ,'ui' , 'ngGrid','ui.bootstrap','ExperimentsModule','angular-table']) 'application.constants',

angular.module('application', ['application.filters', 'application.services', 'application.directives',
    'application.controllers','ngResource','ngRoute','angular-table','ui.bootstrap','ngGrid','ngCookies'])

  .config(['$routeProvider', '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider) {

    var access = routingConfig.accessLevels;

    $routeProvider
      // user
      .when('/', {templateUrl: '/partials/home', controller: 'HomeCtrl', access:     access.user})
      .when('/home', {templateUrl: '/partials/home', controller: 'HomeCtrl', access:     access.user})
      .when('/logout', {templateUrl: '/partials/login', controller: 'LogoutCtrl', access:  access.user})
      .when('/vendor', {templateUrl: '/partials/vendorview', controller: 'VendorCtrl',access:  access.user})
      .when('/vendor/:VendorNumber', {templateUrl: '/partials/vendorviewedit', controller: 'VendorEditCtrl',access:  access.user})
     .when('/contact', {templateUrl: '/partials/poview', controller: 'POCtrl',access:  access.user})
      .when('/contact/:id', {templateUrl: '/partials/poviewedit', controller: 'PoEditCtrl',access:  access.user})

      // admin
      .when('/user',  {templateUrl:'/partials/user',controller: 'UserCtrl',access: access.user  })
      .when('/user/:id',  {templateUrl:'/partials/useredit',controller: 'UserEditCtrl',access: access.user  })
      .when('/test',  {templateUrl:'/partials/test',controller: 'UserCtrl',access: access.user  })

      // anon
      .when('/foodview', {templateUrl: '/partials/foodview', controller: 'FoodCtrl',access:  access.anon})
      .when('/login', {templateUrl: '/partials/login', controller: 'LoginCtrl', access:  access.anon})

      .when('/404', {templateUrl: '/partials/404', controller:'', access:  access.anon})
      .otherwise({redirectTo: '/404'});
    $locationProvider.html5Mode(true);



    var interceptor = ['$location', '$q', function($location, $q) {
      function success(response) {
        return response;
      }

      function error(response) {

        if(response.status === 401) {
          $location.path('/login');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }

      return function(promise) {
        return promise.then(success, error);
      }
    }];

    $httpProvider.responseInterceptors.push(interceptor);

  }])
  .run(function ($rootScope) {
    $rootScope.hello = function () {
   //   console.log('hello');
    }
  })
  .run(function ($rootScope) {
    $rootScope.weAreHere = function (isThisIt) {
      var locationString = new String(location.pathname);// hash OR pathname;
      return lcocationString == isThisIt;
    }
  })
  .run(['$rootScope', '$location', 'Auth', function ($rootScope, $location, Auth) {

    $rootScope.$on("$routeChangeStart", function (event, next, current) {
      $rootScope.error = null;
      if (!Auth.authorize(next.access)) {
        if(Auth.isLoggedIn()) $location.path('/');
        else                  $location.path('/login');
      }
    });

    $rootScope.appInitialized = true;
  }])

  .factory('Food', ['$resource', function($resource){
    return $resource(
      '/food/:action/:id',
      {action:'@action', id:'@id' },
      {
        findAll:{method:'GET',isArray:true},   // same as query
        update:{method:'PUT',params: {id:'@id'} }
      }
    )

  }])

    //Clip.find({colA: { '>': '1' }}).sort('name DESC').done(function(err, allClips) {
    // Error handling
  .factory('Vendor', ['$resource', function($resource){
    return $resource(
      '/vendor/:action/:id',
      {action:'@action', id:'@id' },
      {
        findAll:{method:'GET',isArray:true},   // same as query
        findAllWrapped: {method: 'GET', params: { action: 'findAllWrapped'} },
        find1: {method:'GET',params: {id:'@id'}} ,
        update:{method:'PUT',params: {id:'@id'} },
        create: {method: 'POST', params: {id: '@id'} }
      }
    )
  }])
  .factory('Account', ['$resource', function($resource){
    return $resource(
      '/account/:action/:id',
      {action:'@action', id:'@id' },
      {
        findAll:{method:'GET',isArray:true},   // same as query
        findAllWrapped: {method: 'GET', params: { action: 'findAllWrapped'} },
        find1: {method:'GET',params: {id:'@id'}} ,
        update:{method:'PUT',params: {id:'@id'} },
        create: {method: 'POST', params: {id: '@id'} }        // post for create, put for update
      //  upsert:  {method:'PUT',params: {id:'@id'} }
      }
    )
  }])

  .factory('PO', ['$resource', function ($resource) {
    console.log('in PO  fac ')//,action,id)
    return $resource(
      '/po/:action/:id',
      {action: '@action', id: '@id' },
      {
        findAll: {method: 'GET', isArray: true},   // same as query
        find1: {method: 'GET', params: {id: '@id'}},
        // stuffed:{method:'GET',isArray:true,params: {action:'stuffed'} },   //see PoController from sails  res.json(peos);
        stuffed: {method: 'GET', params: {action: 'stuffed'} },   // see PoController from sails res.json({ data: peos });

        create: {method: 'POST', params: {id: '@id'} },         // post for create, put for update

        //   create:{method:'POST',params:{id:'create'}},         // post for create, put for update
        update: {method: 'PUT', params: {id: '@id'} },
//        updateWrapped: {method: 'PUT', params:  {id: '@id'}}//{ action: 'updateWrapped'} }
        updateWrapped: {method: 'PUT', params:  { action: 'updateWrapped'} }


      }
    )
  }])

  .factory('User', ['$resource', function($resource){
        console.log('in user fac ')//,action,id)
    return $resource(
      '/user/:action/:id',
      {action:'@action', id:'@id' },
      {
        findAll:{method:'GET',isArray:true},   // same as query
        find1: {method:'GET',params: {id:'@id'}} ,
        create:{method:'POST',params: {id:'@id'} },         // post for create, put for update
     //   create:{method:'POST',params:{id:'create'}},         // post for create, put for update
        update:{method:'PUT',params: {id:'@id'} }
      }
    )
  }])
    /*
     .factory('Users', ['$resource', '$q', function ($resource, $q) {
     return $resource(
     '/users/:action/:id/distance/:di/first/:first/last/:last/practice/:practice/specialty/:specialty',
     {action:'@action', id:'@id',di:'@di' ,first:'first',last:'last',practice:'practice',specialty:'specialty'},
     {
     findAll: {method: 'GET', isArray: true},   // same as query
     find1: {method:'GET',params: {id:'@id',di:'@di', first: '@first',last:'@last',practice:'@practice',specialty:'@specialty'},isArray:true} ,
     //find1: {method:'GET',params: {id:'@id',di:'@di'},isArray:true} ,
     //find1: {method: 'GET', params: {id: '@id', di: '@di', first: '@first', last: '@last', practice: '@practice', specialty: '@specialty' }, isArray: true},
     update: {method: 'PUT', params: {id: '@id'} }
     }
     )
     }])



     .factory('Users', ['$resource',  '$rootScope', function($resource,$rootScope){
     return $resource(
     '/user/:action/:id',
     {action:'@action', id:'@id' },
     {

     //                getAll: function(success, error) {
     //                    $http.get('/users').success(success).error(error);
     //                },
     //                edit: function(success, error) {
     //                    console.log('in edit ',$rootScope.userid)
     //                    $http.get('/users/522b37313c90da1603283820').success(success).error(error);
     //                },
     findAll:{method:'GET',isArray:true},   // same as query
     find1: {method:'GET',params: {id:'@id'}} ,
     update:{method:'PUT',params: {id:'@id'} },
     upsert:  {method:'PUT',params: {id:'@id'} }
     }
     )
     }])*/
//    .factory('masHelper', function($rootScope) {
//
//        var buildIndex = function(source, property) {
//            var tempArray = [];
//            for(var i = 0, len = source.length; i < len; ++i) {
//                tempArray[source[i][property]] = source[i];
//            }
//            return tempArray;
//        };
//
//        return {
//            buildIndex: buildIndex
//        };
//    })
//    .factory('mongoHelper', function($rootScope) {
//
//        var buildIndex = function(source) {
//            var tmp = angular.copy(source);//.vendor);
//            delete tmp.id;
//            // delete tmp('id');// alt
//            return tmp;
//        };
//
//        return {
//            buildIndex: buildIndex
//        };
//    })

  .factory('mongosailsHelper', function($rootScope) {
    var deleteID = function(source) {
      // console.log(' del ', source)
      var tmp = angular.copy(source);//.vendor);
      delete tmp.id;

      // delete tmp('id');// alt
      // console.log(' del ', tmp)
      return tmp;
    };
    return {
      deleteID: deleteID
    };
  })

;

