'use strict';

angular.module('classBrowserUHApp.core', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/core', {
        templateUrl: 'views/core/core.html',
        controller: 'CoreCtrl'
    });
}])
.controller('CoreCtrl', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {

    $rootScope.httpService.getData('resources/coreCategories.json').then(function(result) {
        $scope.coreCategories = result;
    });

    $scope.populateCoreClasses = function(){
        $scope.isDataLoading = true;
        $scope.isError = false;
        var apiUrl = $scope.apiUrl + '/core=' + $scope.coreCategory.categoryNumber;
        $rootScope.httpService.getData(apiUrl).then(onSuccess).catch(onError).then(finallyDo);
    };

    var onSuccess = function onSuccess(result) {
        $scope.message = generateFirstMessage($scope.coreCategory.categoryName, result.numberOfRows);
        $scope.messageTwo = generateSecondMessage($scope.coreCategory.categoryName, result.result[0].hours_required);
        $scope.rowCollection = result.result;
        $scope.showResults = true;
    };

    var onError = function onError(err) {
        $scope.isError = true;
        $scope.errorMessage = "Unable to retrieve the core classes. Please try again.";
    };

    var finallyDo = function finallyDo() {
        $scope.isDataLoading = false;
    };

    var generateFirstMessage = function(coreTitle, numberOfRows) {
        return "Retrieved " + numberOfRows +
            " classes that fall under the " + coreTitle + " category.";
    };

    var generateSecondMessage = function(coreTitle, hoursRequired) {
        return "The " + coreTitle + " core category requires " +
            hoursRequired + " hours to be taken to fulfill the core requirement.";
    };

}]);