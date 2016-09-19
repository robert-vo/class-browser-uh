'use strict';

angular.module('classBrowserUHApp.offeredclass', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/offeredclass', {
        templateUrl: 'views/offeredclass/offeredclass.html',
        controller: 'OfferedClassCtrl'
    });
}])

.controller('OfferedClassCtrl', ['$scope', '$http', '$q', '$rootScope', function ($scope, $http, $q, $rootScope) {
    $scope.format = [
        'Online',
        'Face to Face',
        'Hybrid'
    ];

    $rootScope.httpService.getData('resources/terms.json').then(function(result) {
        $scope.terms = result;
    });

}]);