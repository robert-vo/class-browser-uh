'use strict';

angular.module('classBrowserUHApp.offeredclass', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/offeredclass', {
        templateUrl: 'views/offeredclass/offeredclass.html',
        controller: 'OfferedClassCtrl'
    });
}])

.controller('OfferedClassCtrl', ['$scope', '$http', '$q', '$rootScope', function ($scope, $http, $q, $rootScope) {

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
}]);