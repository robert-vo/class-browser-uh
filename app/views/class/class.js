'use strict';

angular.module('classBrowserUHApp.class', ['ngRoute']).
config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/class', {
        templateUrl: 'views/class/class.html',
        controller: 'ClassCtrl'
    });
}]).
controller('ClassCtrl', ['$scope', '$http', '$q', '$rootScope', function ($scope, $http, $q, $rootScope) {
    $scope.rowCollection = [];
    $scope.isDataLoading = true;
    $rootScope.httpService.getData('resources/subjects.json').then(function(result) {
        $scope.departments = result;
    });

    $rootScope.httpService.getData('resources/creditHours.json').then(function(result) {
        $scope.creditHours = result;
    });

    $rootScope.httpService.getData('resources/coreCategories.json').then(function(result) {
        $scope.coreCategories = result;
    });

    var generateMessage = function(model, type, objToPluck) {
        if(model == undefined || model.length == 0) {
            return "";
        }
        else {
            return "<b> " + type + "</b>: " + _.pluck(model, objToPluck).join(', ') + "<br>";
        }
    };


    $scope.populateClasses = function(){
        $scope.rowCollection = [];
        var apiUrl = buildApiUrlsFromModel($scope.departmentModel, $scope.creditHourModel, $scope.coreModel);
        console.log("Populating Classes...");

        $scope.numberOfRows = 0;
        for(var i = 0; i < apiUrl.length; i++) {
            console.log("Got URL: " + apiUrl[i]);
            $rootScope.httpService.getData(apiUrl[i]).then(function(result) {
                $scope.numberOfRows += result.numberOfRows;
                $scope.rowCollection = $scope.rowCollection.concat(result.result);
                populateFields();
            });
        }
    };

    var populateFields = function(){
        $scope.hasNoResults = false;

        if($scope.rowCollection.length > 0) {
            $scope.showDiv = true;

            $scope.numberOfRowsMessage = "Retrieved " + $scope.numberOfRows + " class";
            $scope.numberOfRowsMessage += $scope.numberOfRows == 1 ? "." : "es.";

            if([$scope.departmentModel, $scope.creditHourModel, $scope.coreModel].allParametersUndefinedOrNull()) {
                $scope.parametersMessage = "No parameters were chosen, so all classes have been retrieved.";
            }
            else {
                $scope.parametersMessage = "";
                $scope.subjectMessage = generateMessage($scope.departmentModel, 'Subjects', 'departmentFullName');
                $scope.creditHoursMessage = generateMessage($scope.creditHourModel, 'Credit Hours', 'creditHours');
                $scope.coreMessage = generateMessage($scope.coreModel, 'Core Categories', 'categoryName');
                $scope.parametersMessage = $scope.subjectMessage +
                    $scope.creditHoursMessage +
                    $scope.coreMessage;
            }
        }
        else {
            $scope.hasNoResults = true;
        }
    };


    var buildApiUrlsFromModel = function(department, creditHour, core) {
        console.log("Building API URL...");
        var baseUrl = $scope.apiUrl + '/information?';
        var allParametersFromScope = [department, creditHour, core];

        if(allParametersFromScope.allParametersUndefinedOrNull()) {
            console.log("All parameters are empty...");
            return [baseUrl];
        }

        console.log("User has selected some categories. Preparing API URL(s).");
        department = _.pluck(department, 'departmentName');
        creditHour = _.pluck(creditHour, 'creditHours');
        core = _.pluck(core, 'categoryNumber');


        if($rootScope.arrayService.isArrayIsNotUndefinedOrNull(department)) {
            $rootScope.apiURLService.expandArrayValuesInPlace(department, 'department');
        }
        if($rootScope.arrayService.isArrayIsNotUndefinedOrNull(creditHour)) {
            $rootScope.apiURLService.expandArrayValuesInPlace(creditHour, 'credit-hours');
        }
        if($rootScope.arrayService.isArrayIsNotUndefinedOrNull(core)) {
            $rootScope.apiURLService.expandArrayValuesInPlace(core, 'core');
        }

        var allParameters = [department,creditHour,core]
            .filter($rootScope.cartesianProductService.nonEmpty)
            .reduce($rootScope.cartesianProductService.productAdd);

        $rootScope.apiURLService.appendParametersToAPIUrl(allParameters, baseUrl);

        return allParameters;
    };

    $scope.goBack = function() {
        console.log('Going back to class search page.');
        $scope.showDiv = false;
    };

    $scope.clearForms = function() {
        var deleteModel = function() {
            [].slice.call(arguments).forEach(function(arg) {
                delete $scope[arg];
            });
        };

        $scope.hasNoResults = false;
        console.log('Clearing forms and fields.');

        deleteModel('departmentModel', 'creditHourModel', 'coreModel', 'parametersMessage', 'rowCollection');
    };

}]);