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

    $scope.populateClasses = function(){
        $scope.isDataLoading = true;
        $scope.isError = false;
        $scope.hasNoResults = false;
        $scope.rowCollection = [];
        $scope.numberOfRows = 0;

        var apiURLs = buildApiUrlsFromModel($scope.departmentModel, $scope.creditHourModel, $scope.coreModel);

        _.each(apiURLs, function(apiURL) {
            $rootScope.httpService.getData(apiURL)
                .then(appendResults)
                .then(populateFields)
                .catch(onError)
                .then(finallyDo)
            }
        );
    };

    var buildApiUrlsFromModel = function(department, creditHour, core) {
        var baseUrl = $scope.apiUrl + '/information?';
        var allParametersFromScope = [
            {
                model: department,
                parameterToPluck: 'departmentName',
                apiParameter: 'department'
            },
            {
                model: creditHour,
                parameterToPluck: 'creditHours',
                apiParameter: 'credit-hours'
            },
            {
                model: core,
                parameterToPluck: 'categoryNumber',
                apiParameter: 'core'
            }
        ];

        return generateApiURLsFromModel(allParametersFromScope, baseUrl);
    };

    var generateApiURLsFromModel = function(allParametersFromScope, baseUrl) {
        allParametersFromScope.forEach(function(part, index, arr) {
            var apiParameter = part.apiParameter;
            arr[index] = _.pluck(part.model, part.parameterToPluck);
            checkArrayAndExpandInPlace(arr[index], apiParameter);
        });

        var allAPIUrls = allParametersFromScope
            .filter($rootScope.cartesianProductService.nonEmpty)
            .reduce($rootScope.cartesianProductService.productAdd, [""]);

        return $rootScope.apiURLService.appendParametersAndReturnAPIUrls(allAPIUrls, baseUrl);
    };

    var checkArrayAndExpandInPlace = function(arrayValue, apiParameter) {
        if(!$rootScope.arrayService.isArrayUndefinedOrNull(arrayValue)) {
            $rootScope.apiURLService.appendParameterEqualsValueInPlace(arrayValue, apiParameter);
        }
    };

    var appendResults = function(result) {
        $scope.numberOfRows += result.numberOfRows;
        $scope.rowCollection = $scope.rowCollection.concat(result.result);
    };

    var generateMessage = function(model, type, objToPluck) {
        if(model == undefined || model.length == 0) {
            return "";
        }
        else {
            return "<b> " + type + "</b>: " + _.pluck(model, objToPluck).join(', ') + "<br>";
        }
    };

    var populateFields = function(){
        if($scope.rowCollection.length > 0) {
            $scope.showResults = true;
            $scope.hasNoResults = false;

            $scope.numberOfRowsMessage = "Retrieved " + $scope.numberOfRows + " class";
            $scope.numberOfRowsMessage += $scope.numberOfRows == 1 ? "." : "es.";

            if ([$scope.departmentModel, $scope.creditHourModel, $scope.coreModel].allParametersUndefinedOrNull()) {
                $scope.parametersMessage = "No parameters were chosen, so all classes have been retrieved.";
            }
            else {
                $scope.subjectMessage = generateMessage($scope.departmentModel, 'Subjects', 'departmentFullName');
                $scope.creditHoursMessage = generateMessage($scope.creditHourModel, 'Credit Hours', 'creditHours');
                $scope.coreMessage = generateMessage($scope.coreModel, 'Core Categories', 'categoryName');
                $scope.parametersMessage = $scope.subjectMessage +
                    $scope.creditHoursMessage +
                    $scope.coreMessage;
            }
        }
    };

    var onError = function(err) {
        $scope.isError = true;
        $scope.errorMessage = "Unable to populate classes for the class directory. Please try again later.";
    };

    var finallyDo = function() {
        $scope.isDataLoading = false;
        if($scope.rowCollection.length == 0 && !$scope.isError) {
            $scope.hasNoResults = true;
            $scope.warningMessage = "There are no classes found with the categories you have specified. Please try again.";
        }
    };

    var deleteModel = function() {
        [].slice.call(arguments).forEach(function(arg) {
            delete $scope[arg];
        });
    };

    $scope.goBack = function() {
        console.log('Going back to class search page.');
        deleteModel('hasNoResults', 'isError', 'isDataLoading', 'showResults');
    };

    $scope.clearForms = function() {
        deleteModel('departmentModel', 'creditHourModel', 'coreModel',
            'parametersMessage', 'rowCollection', 'hasNoResults', 'isError',
            'isDataLoading');
    };

}]);