'use strict';

angular.module('classBrowserUHApp.navbar', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
        controller: 'NavBarCtrl'
    });
}])

.controller('NavBarCtrl', function($scope, $location) {
    $scope.isActive = function (viewLocation) {
        return viewLocation === $location.path();
    };
});