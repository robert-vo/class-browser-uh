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
        $scope.rowCollection = result.result;
        $scope.showResults = true;
        $scope.numberOfRows = result.numberOfRows;
    }

    function onError(err) {
        $scope.isError = true;
        $scope.errorMessage = "Unable to retrieve the departments. Please try again.";
    }

    function finallyDo() {
        $scope.isDataLoading = false;
    }

    $scope.populateDepartments = function() {
        $scope.isDataLoading = true;

        $rootScope.httpService
            .getData(url)
            .then(onSuccess)
            .catch(onError)
            .then(finallyDo);
    }
});