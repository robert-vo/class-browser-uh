'use strict';

angular.module('classBrowserUHApp.department', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/department', {
        templateUrl: 'views/department/department.html',
        controller: 'DepartmentCtrl'
    });
}])

.controller('DepartmentCtrl', [function() {

}]);