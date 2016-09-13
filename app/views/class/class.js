'use strict';

angular.module('classBrowserUHApp.class', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/class', {
        templateUrl: 'views/class/class.html',
        controller: 'ClassCtrl'
    });
}]).
controller('ClassCtrl', ['$scope', '$http', function ($scope, $http) {

        $scope.rowCollection = [];

        $scope.departments = {
            availableOptions: [
                {departmentAbbreviation: "abc", departmentFullName: "d"},
                {departmentAbbreviation: "q23w", departmentFullName: "Mathematics"},
                {departmentAbbreviation: "q23w", departmentFullName: "Life and Physical Sciences"},
                {departmentAbbreviation: "q23w", departmentFullName: "Language, Philosophy & Culture"},
                {departmentAbbreviation: "q23w", departmentFullName: "Creative Arts"},
                {departmentAbbreviation: "q23w", departmentFullName: "American History"},
                {departmentAbbreviation: "q23w", departmentFullName: "Government/Political Science"},
                {departmentAbbreviation: "q23w", departmentFullName: "Social & Behavioral Sciences"},
                {departmentAbbreviation: "q23w", departmentFullName: "Mathematics/Reasoning"},
                {departmentAbbreviation: "q23w", departmentFullName: "Writing in the Disciplines"}
            ]
        };

        $scope.creditHours = {
            availableOptions: [
                {creditHours: 1},
                {creditHours: 1.5},
                {creditHours: 2},
                {creditHours: 3},
                {creditHours: 4},
                {creditHours: 5},
                {creditHours: 6},
                {creditHours: 7},
                {creditHours: 8},
                {creditHours: 9},
                {creditHours: 10}
            ]
        };

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

        $scope.populateClasses = function(){

            var apiUrl = $scope.apiUrl + '/information?';

            // http://localhost:8080/api/information?department=aas&credit_hours=2
            // department - A String that represents the department class(es) belong to.
            // credit-hours - An integer that represents the number of credit hours a class fulfills.
            // core - A String representing the core categories of a class.

            // console.log("User selected department: " + $scope.department);
            // console.log("User selected credit-hours: " + $scope.creditHours);
            // console.log("User selected core: " + $scope.core);
            console.log("Populating Classes...");

            $http
                .get(apiUrl)
                .success(function (data) {
                    $scope.rowCollection = data.result;
                    $scope.showDiv = true;
                    console.log(data);
                })
                .error(function (data) {
                    alert("Unable to retrieve the data.");
                });
        };
    }]);