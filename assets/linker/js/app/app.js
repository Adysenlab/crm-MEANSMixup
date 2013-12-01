'use strict';
//var Application = Application || {};
////console.log('assets/js');
//Application.Services = angular.module('application.services', []);
//Application.Controllers = angular.module('application.controllers', []);
//Application.Filters = angular.module('application.filters', []);
//Application.Directives = angular.module('application.directives', []);
//Application.angulartable = angular.module('angular-table', []);
//angular.module('crmApp', ['ngResource', 'ngRoute', 'angular-table', 'ui.bootstrap', 'ngGrid', 'ngCookies', 'xeditable', 'btford.socket-io'])
//angular.module('crmApp', ['application.filters', 'application.services', 'application.directives',
//        'application.controllers', 'ngResource', 'ngRoute', 'angular-table', 'ui.bootstrap', 'ngGrid', 'ngCookies', 'xeditable', 'angularFileUpload', 'btford.socket-io'])

angular.module('crmApp', ['ngResource', 'ngRoute', 'angular-table', 'ui.bootstrap', 'ngGrid', 'ngCookies', 'xeditable','angularFileUpload',  'btford.socket-io'])



  .run(function(editableOptions,editableThemes) {
    //editableOptions.buttons = 'no',
    editableOptions.blur = 'ignore',
      // editableOptions.theme = 'bs3'; //'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
      editableOptions.theme = 'bs2';
    // overwrite submit button template
    //  editableThemes['default'].submitTpl = '<button type="submit">ok</button>';

  })
   // set up socket.io
    .run(function(socket) {
        // subscribe to the user model
        socket.get('/user/subscribe');

        socket.on('message', function(message) {
            console.log("Here's the message: ", message);
        });

        // forward any socket messages we might want onto the $rootScope
        socket.forward('userChange');
    })


  .config(['$routeProvider', '$locationProvider', '$httpProvider', function($routeProvider, $locationProvider, $httpProvider) {

    var access = routingConfig.accessLevels;

    $routeProvider
        // anon
        .when('/', {templateUrl: '/partials/login', controller: 'LoginCtrl', access: access.anon})

        .when('/home', {templateUrl: '/partials/home', controller: 'HomeCtrl', access: access.anon})

        .when('/login', {templateUrl: '/partials/login', controller: 'LoginCtrl', access: access.anon})
        .when('/logout', {templateUrl: '/partials/login', controller: 'LoginCtrl', access: access.user})

        //.when('/logout', {templateUrl: '/partials/login', controller: 'LogoutCtrl', access:  access.user})
        // .when('/view1', {templateUrl: '/partials/partial1', controller: 'MainCtrl',access:  access.anon})
        .when('/foodview', {templateUrl: '/partials/foodview', controller: 'FoodCtrl', access: access.anon})

        .when('/vendor', {templateUrl: '/partials/vendorview', controller: 'VendorCtrl', access: access.user})
        //using modal .when('/vendor/:VendorNumber', {templateUrl: '/partials/vendorviewedit', controller: 'VendorEditCtrl',access:  access.user})

        .when('/tenant', {templateUrl: '/partials/tenantview', controller: 'TenantCtrl', access: access.user})
        .when('/two', {templateUrl: '/partials/twoview', controller: 'TWOCtrl', access: access.user})
        .when('/two/:id', {templateUrl: '/partials/twoviewedit', controller: 'TWOEditCtrl', access: access.user})


        .when('/account', {templateUrl: '/partials/accountview', controller: 'AccountCtrl', access: access.user})
        .when('/account/:AccountID', {templateUrl: '/partials/accountviewedit', controller: 'AccountEditCtrl', access: access.user})

        .when('/daily', {templateUrl: '/partials/daily', controller: 'DailyCtrl', access: access.user})


        .when('/po', {templateUrl: '/partials/poview', controller: 'POCtrl', access: access.user})
        .when('/po/:id', {templateUrl: '/partials/poviewedit', controller: 'PoEditCtrl', access: access.user})

        .when('/template', {templateUrl: '/partials/templateview', controller: 'TemplateCtrl', access: access.user})
        .when('/template/:id', {templateUrl: '/partials/templateviewedit', controller: 'TemplateEditCtrl', access: access.user})


        .when('/upload', {templateUrl: '/partials/upload', controller: 'UploadCtrl', access: access.user})
        .when('/uploads/:id', {templateUrl: '/partials/upload', controller: 'UploadCtrl', access: access.user})


        // admin
        .when('/user', {templateUrl: '/partials/user', controller: 'UserCtrl', access: access.user  })
        .when('/user/:id', {templateUrl: '/partials/useredit', controller: 'UserEditCtrl', access: access.user  })


        .when('/404', {templateUrl: '/partials/404', controller: '', access: access.anon})
      .otherwise({redirectTo: '/404'});
    $locationProvider.html5Mode(true);



    var interceptor = ['$location', '$q', function($location, $q) {
      function success(response) {
        return response;
      }

      function error(response) {

        if (response.status === 401) {
          $location.path('/login');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }

      return function(promise) {
        return promise.then(success, error);
      };
    }];

    $httpProvider.responseInterceptors.push(interceptor);

  }])
  .run(['$rootScope', '$location', 'Auth', function($rootScope, $location, Auth) {

    $rootScope.$on('$routeChangeStart', function(event, next, current) {
      $rootScope.error = null;
      if (!Auth.authorize(next.access)) {
        if (Auth.isLoggedIn()) {
          $location.path('/');
        } else {
          $location.path('/login');
        }
      }
    });

    $rootScope.appInitialized = true;
  }])

  .factory('Food', ['$resource', function($resource) {
    return $resource(
      '/food/:action/:id',
      { action: '@action', id: '@id' },
      {
        findAll: { method: 'GET', isArray: true },   // same as query
        update: { method: 'PUT', params: { id: '@id' } }
      }
    );

  }])

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
  });


