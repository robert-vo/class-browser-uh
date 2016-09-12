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

    $scope.coreCategories = {
        availableOptions: [
            {categoryNumber: 1, categoryName: "I. Communication"},
            {categoryNumber: 2, categoryName : "II.	Mathematics"},
            {categoryNumber: 3, categoryName : "III.	Institutionally Designated Option: Math/Reasoning"},
            {categoryNumber: 4, categoryName : "IV.	American History"},
            {categoryNumber: 5, categoryName : "V.	Government"},
            {categoryNumber: 6, categoryName : "VI.	Humanities"},
            {categoryNumber: 7, categoryName : "VII.	Visual & Performing Arts"},
            {categoryNumber: 8, categoryName : "VIII.	Natural Sciences"},
            {categoryNumber: 9, categoryName : "IX.	Social & Behavioral Sciences"},
            {categoryNumber: 10, categoryName : "X.	Writing in the Disciplines"}]
    };

    $scope.populateCoreClasses = function() {
        console.log("User selected category number: " + $scope.coreCategory.categoryNumber);
        console.log("Populating Core Classes...");

        var url = $scope.apiUrl + '/core=' + $scope.coreCategory.categoryNumber;
        $http.get(url)
            .success(function (data) {
                var message = "Retrieved " + data.numberOfRows + " core classes.";
                console.log(message);
                console.log(data);
                $scope.resultSet = data.result;
                $scope.showDiv = true;
                $scope.numberOfRows = data.numberOfRows;
                $scope.message = message;
            })
            .error(function (data) {
                alert("Unable to retrieve the data.");
            });
    }
    });