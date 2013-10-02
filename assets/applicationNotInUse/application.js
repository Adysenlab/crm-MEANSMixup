'use strict'
/**
* The application file bootstraps the angular app by  initializing the main module and 
* creating namespaces and moduled for controllers, filters, services, and directives. 
*/

var Application = Application || {};

Application.Constants = angular.module('application.constants', []);
Application.Services = angular.module('application.services', []);
Application.Controllers = angular.module('application.controllers', []);
Application.Filters = angular.module('application.filters', []);
Application.Directives = angular.module('application.directives', []);
//Application.angulartable = angular.module('angular-table', []);


angular.module('application', ['application.filters', 'application.services', 'application.directives', 'application.constants', 'application.controllers','angular-table']).
//angular.module('application', ['application.filters', 'application.services', 'application.directives', 'application.constants', 'application.controllers']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.
 //   when('/', {templateUrl: 'home',controller:'HomeCtrl'}).
        console.log('$routeProvider ',$routeProvider)
      when('/',
        {
            templateUrl:    '/partials/home',
            controller:     'HomeCtrl'

        }).
      when('/view1', {templateUrl: 'partials/partial1',controller:'MainCtrl'}).
      when('#/view1', {templateUrl: 'partials/partial1',controller:'MainCtrl'}).

        when('/view2', {templateUrl: 'partials/partial2'}).
        when('/#view2', {templateUrl: 'partials/partial2'}).
        when('#/view2', {templateUrl: 'partials/partial2'}).
        when('view2', {templateUrl: 'partials/partial2'}).
          when('#view2', {templateUrl: 'partials/partial2'}).

    //  when('/remotepartial', {templateUrl: '/template/find/test'}).
      otherwise({templateUrl: 'error404'});
  }]);

