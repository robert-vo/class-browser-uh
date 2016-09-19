'use strict';

angular.module('classBrowserUHApp.offeredclass', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/offeredclass', {
        templateUrl: 'views/offeredclass/offeredclass.html',
        controller: 'OfferedClassCtrl'
    });
}])

.controller('OfferedClassCtrl', ['$scope', '$http', '$q', '$rootScope', function ($scope, $http, $q, $rootScope) {

    $scope.format = {
        availableOptions: [
        {formatType: 'Online', isOrNot: 'Is'},
        {formatType: 'Not Online', isOrNot: 'Not'},
        {formatType: 'Not Face to Face', isOrNot: 'Not'},
        {formatType: 'Face to Face', isOrNot: 'Is'},
        {formatType: 'Not Hybrid', isOrNot: 'Not'},
        {formatType: 'Hybrid', isOrNot: 'Is'}
    ]
    };

    $rootScope.httpService.getData('resources/terms.json').then(function(result) {
        $scope.terms = result;
    });

}]);