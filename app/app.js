'use strict';

angular.module('classBrowserUHApp', [
    'ngRoute',
    'classBrowserUHApp.version',
    'classBrowserUHApp.home',
    'classBrowserUHApp.class',
    'classBrowserUHApp.core',
    'classBrowserUHApp.department',
    'classBrowserUHApp.offeredClass',
    'classBrowserUHApp.navbar',
    'environment',
    'smart-table',
    'nya.bootstrap.select',
    'ngSanitize'
]).controller('EnvVarCtrl', ['$scope', 'envService', function ($scope, envService) {
    $scope.environment = envService.get();
    $scope.vars = envService.read('all');
    $scope.apiUrl = $scope.vars.apiUrl;
}]);