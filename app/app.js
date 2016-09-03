'use strict';

// Declare app level module which depends on views, and components
angular.module('classBrowserUHApp', [
  'ngRoute',
  'classBrowserUHApp.view1',
  'classBrowserUHApp.view2',
  'classBrowserUHApp.version'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/view1'});
}]);
