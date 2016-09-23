'use strict';

angular.module('classBrowserUHApp.class', ['ngRoute']).
config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/class', {
        templateUrl: 'views/class/class.html',
        controller: 'ClassCtrl'
    });
}]).
controller('ClassCtrl', ['$scope', '$http', '$q', '$rootScope', '$parse', function ($scope, $http, $q, $rootScope, $parse) {
    $scope.rowCollection = [];

    var setScopeVariableFromJSON = function(filePath, scopeVariable) {
        $rootScope.httpService.getData(filePath).then(function(result) {
            $parse(scopeVariable).assign($scope, result);
        });
    };

    var initializeAllJSONAndScopeNames = function(name) {
        $rootScope.httpService.getData('resources/allScopeVariables.json').then(function(result) {
            $scope.allJSONAndScopeNames = result[name];
            $scope.allJSONAndScopeNames.forEach(function(e) {
                setScopeVariableFromJSON(e.path, e.scopeName);
            });
        });
    };

    initializeAllJSONAndScopeNames("class");

    var generateMessage = function(model, type, objToPluck) {
        if(model == undefined || model.length == 0) {
            return "";
        }
        else {
            return "<b> " + type + "</b>: " + _.pluck(model, objToPluck).join(', ') + "<br>";
        }
    };


    $scope.populateClasses = function(){
        $scope.isDataLoading = true;
        $scope.isError = false;
        $scope.hasNoResults = false;
        $scope.rowCollection = [];
        $scope.numberOfRows = 0;

        var apiUrl = buildApiUrlsFromModel($scope.departmentModel, $scope.creditHourModel, $scope.coreModel);

        for(var i = 0; i < apiUrl.length; i++) {
            console.log("Got URL: " + apiUrl[i]);
            $rootScope.httpService.getData(apiUrl[i])
                .then(function(result) {
                    $scope.numberOfRows += result.numberOfRows;
                    $scope.rowCollection = $scope.rowCollection.concat(result.result);
                    populateFields();
                })
                .catch(function(err) {
                    $scope.isError = true;
                    $scope.errorMessage = "Unable to populate classes for the class directory. Please try again later.";
                })
                .then(function() {
                    $scope.isDataLoading = false;
                });
        }
    };

    var populateFields = function(){

        if($scope.rowCollection.length > 0) {
            $scope.showResults = true;

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
        $scope.showResults = false;
    };

    $scope.clearForms = function() {
        var deleteModel = function() {
            [].slice.call(arguments).forEach(function(arg) {
                delete $scope[arg];
            });
        };

        $scope.hasNoResults = false;
        $scope.isError = false;

        deleteModel('departmentModel', 'creditHourModel', 'coreModel', 'parametersMessage', 'rowCollection');
    };

}]);