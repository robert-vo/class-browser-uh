'use strict';

angular.module('classBrowserUHApp.core', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/core', {
        templateUrl: 'views/core/core.html',
        controller: 'CoreCtrl'
    });
}])
.controller('CoreCtrl', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {

    $scope.rowCollection = [];
    $scope.message = "";
    $scope.messageTwo = "";

     $rootScope.httpService.getData('resources/coreCategories.json').then(function(result) {
         $scope.coreCategories = result;
    });

    $scope.populateCoreClasses = function(){

        var apiUrl = $scope.apiUrl + '/core=' + $scope.coreCategory.categoryNumber;

        console.log("User selected category number: " + $scope.coreCategory.categoryNumber);
        console.log("Populating Core Classes...");

        $http
            .get(apiUrl)
            .success(function (data) {
                $scope.message = generateFirstMessage(data.result[0].core_title, data.numberOfRows);
                $scope.messageTwo = generateSecondMessage(data.result[0].core_title, data.result[0].hours_required);
                $scope.rowCollection = data.result;
                $scope.showDiv = true;
            })
            .error(function (data) {
                alert("Unable to retrieve the data.");
            });
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