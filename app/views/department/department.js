'use strict';

angular.module('classBrowserUHApp.department', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/department', {
        templateUrl: 'views/department/department.html',
        controller: 'DepartmentCtrl'
    });
}])

.controller('DepartmentCtrl', function($scope, $http, $rootScope) {
    var url = $scope.apiUrl + '/department';

    function onSuccess(result) {
        $scope.resultSet = result.result;
        $scope.showDiv = true;
        $scope.numberOfRows = result.numberOfRows;
    }

    function handleError(err) {
        alert(err);
    }

    function finallyDo() {
        $scope.isDataLoading = false;
    }

    $scope.populateDepartments = function() {
        $scope.isDataLoading = true;

        $rootScope.httpService
            .getData(url)
            .then(onSuccess)
            .catch(handleError)
            .then(finallyDo);
    }
});