'use strict';

angular.module('classBrowserUHApp.core', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/core', {
        templateUrl: 'views/core/core.html',
        controller: 'CoreCtrl'
    });
}])
.controller('CoreCtrl', function($scope, $http) {

    $scope.resultSet = [];
    $scope.numberOfRows = 0;
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
            {categoryNumber: 9, categoryName : "Government/Political Science"},
            {categoryNumber: 10, categoryName : "Writing in the Disciplines"}],
        selectedOption: {
                categoryNumber: 1, categoryName: "I. Communication"
        }
    };

    $scope.populateCoreClasses = function() {
        console.log("User selected category number: " + $scope.coreCategory.categoryNumber);
        console.log("Populating Core Classes...");

        var url = $scope.apiUrl + '/core=' + $scope.coreCategory.categoryNumber;
        $http.get(url)
            .success(function (data) {
                var message = "Retrieved " + data.numberOfRows +
                    " classes that fall under the " + data.result[0].core_title + " category.";
                var messageTwo = "The " + data.result[0].core_title + " core category requires " +
                    data.result[0].hours_required + " hours to be taken to fulfill the core requirement.";
                console.log(message);
                console.log(data);
                $scope.resultSet = data.result;
                $scope.showDiv = true;
                $scope.numberOfRows = data.numberOfRows;
                $scope.message = message;
                $scope.messageTwo = messageTwo;
            })
            .error(function (data) {
                alert("Unable to retrieve the data.");
            });
    }
    });