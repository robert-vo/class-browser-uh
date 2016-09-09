'use strict';

// Declare app level module which depends on views, and components
angular.module('classBrowserUHApp', [
    'ngRoute',
    'classBrowserUHApp.version',
    'classBrowserUHApp.home',
    'classBrowserUHApp.class',
    'classBrowserUHApp.core',
    'classBrowserUHApp.department',
    'classBrowserUHApp.offeredclass',
    'classBrowserUHApp.navbar'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');

    $routeProvider.otherwise({redirectTo: '/home'});

    $(document).click(function () {
        $('.navbar-collapse').collapse('hide');
    });
}]);
