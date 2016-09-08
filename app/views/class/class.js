'use strict';

angular.module('classBrowserUHApp.class', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/class', {
        templateUrl: 'views/class/class.html',
        controller: 'ClassCtrl'
    });
}])

.controller('ClassCtrl', [function() {

}]);