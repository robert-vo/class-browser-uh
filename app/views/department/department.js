'use strict';

angular.module('classBrowserUHApp.department', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/department', {
        templateUrl: 'views/department/department.html',
        controller: 'DepartmentCtrl'
    });
}])

.controller('DepartmentCtrl', function($scope, $http) {
    var url = 'http://localhost:8080/api/department';

    $scope.rowCollection = [];
    $scope.numberOfRows = 0;

    $scope.populateDepartments = function() {
        console.log("Populating departments...");

        $http.get(url)
            .success(function(data) {
                console.log("Retrieved " + data.numberOfRows + " departments.");
                console.log(data);
                $scope.rowCollection = data.result;
                $scope.showDiv = true;
                $scope.numberOfRows = data.numberOfRows;
            })
            .error(function(data) {
                alert("Unable to retrieve the data.");
            });
    }
});