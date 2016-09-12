'use strict';

angular.module('classBrowserUHApp', [
    'ngRoute',
    'classBrowserUHApp.version',
    'classBrowserUHApp.home',
    'classBrowserUHApp.class',
    'classBrowserUHApp.core',
    'classBrowserUHApp.department',
    'classBrowserUHApp.offeredclass',
    'classBrowserUHApp.navbar',
    'environment'
]).
config(function(envServiceProvider) {
    envServiceProvider.config({
        domains: {
            development: ['localhost'],
            production: ['aws.com']
        },
        vars: {
            development: {
                apiUrl: '//localhost:8080/api'
            },
            production: {
                apiUrl: '//aws.com'
            }
        }
    });
    envServiceProvider.check();
}).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');

    $routeProvider.otherwise({redirectTo: '/home'});
}]).
controller('EnvVarCtrl', ['$scope', 'envService', function($scope, envService) {
    $scope.environment = envService.get(); // store the current environment
    $scope.vars = envService.read('all');
    $scope.apiUrl = $scope.vars.apiUrl;
}]);