'use strict';

angular.module('classBrowserUHApp.offeredclass', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/offeredclass', {
        templateUrl: 'views/offeredclass/offeredclass.html',
        controller: 'OfferedClassCtrl'
    });
}])
.controller('OfferedClassCtrl', ['$scope', '$http', '$q', '$rootScope', function ($scope, $http, $q, $rootScope) {
    var deleteModel = function() {
        [].slice.call(arguments).forEach(function(arg) {
            delete $scope[arg];
        });
    };

    $rootScope.httpService.getData('resources/format.json').then(function(result) {
        $scope.format = result;
    });

    $rootScope.httpService.getData('resources/terms.json').then(function(result) {
        $scope.terms = result;
    });

    $rootScope.httpService.getData('resources/status.json').then(function(result) {
        $scope.status = result;
    });

    $rootScope.httpService.getData('resources/session.json').then(function(result) {
        $scope.session = result;
    });

    $rootScope.httpService.getData('resources/subjects.json').then(function(result) {
        $scope.departments = result;
    });

    $rootScope.httpService.getData('resources/buildings.json').then(function(result) {
        $scope.buildings = result;
    });

    $rootScope.httpService.getData('resources/locations.json').then(function(result) {
        $scope.locations = result;
    });

    $rootScope.httpService.getData('resources/component.json').then(function(result) {
        $scope.component = result;
    });

    $rootScope.httpService.getData('resources/creditHours.json').then(function(result) {
        $scope.creditHours = result;
    });

    $rootScope.httpService.getData('resources/coreCategories.json').then(function(result) {
        $scope.coreCategories = result;
    });

    $rootScope.httpService.getData('resources/weekendU.json').then(function(result) {
        $scope.weekendU = result;
    });

    $scope.clearForms = function() {
        deleteModel('weekendUModel', 'coreModel');
    };

}]);
