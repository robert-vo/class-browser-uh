'use strict';

angular.module('classBrowserUHApp.core', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/core', {
        templateUrl: 'views/core/core.html',
        controller: 'CoreCtrl'
    });
}])
.controller('CoreCtrl', ['$scope', '$http', function ($scope, $http) {

    $scope.rowCollection = [];
    $scope.message = "";
    $scope.messageTwo = "";
    $scope.coreCategories = {
        availableOptions: [
            {categoryNumber: 1, categoryName: "Communication"},
            {categoryNumber: 2, categoryName : "Mathematics"},
            {categoryNumber: 3, categoryName : "Life and Physical Sciences"},
            {categoryNumber: 4, categoryName : "Language, Philosophy & Culture"},
            {categoryNumber: 5, categoryName : "Creative Arts"},
            {categoryNumber: 6, categoryName : "American History"},
            {categoryNumber: 7, categoryName : "Government/Political Science"},
            {categoryNumber: 8, categoryName : "Social & Behavioral Sciences"},
            {categoryNumber: 9, categoryName : "Mathematics/Reasoning"},
            {categoryNumber: 10, categoryName : "Writing in the Disciplines"}
        ]
    };

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