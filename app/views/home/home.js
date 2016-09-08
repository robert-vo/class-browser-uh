'use strict';

angular.module('classBrowserUHApp.home', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/home', {
        templateUrl: 'views/home/home.html',
        controller: 'HomeCtrl'
    });
}])

.controller('HomeCtrl', [function() {

}]);