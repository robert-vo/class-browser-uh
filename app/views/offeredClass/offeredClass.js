'use strict';

angular.module('classBrowserUHApp.offeredClass', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/offeredClass', {
        templateUrl: 'views/offeredClass/offeredClass.html',
        controller: 'OfferedClassCtrl'
    });
}])
.controller('OfferedClassCtrl', ['$scope', '$http', '$q', '$rootScope', '$parse', '$window', function ($scope, $http, $q, $rootScope, $parse, $window) {
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


    initializeAllJSONAndScopeNames("offeredClass");

    $scope.validValues = ['a', 'A','1','2', '3', '4', '5', '6', '7', '8', '9', '0'];

    $scope.deleteModel = function() {
        [].slice.call(arguments).forEach(function(arg) {
            delete $scope[arg];
        });
    };

    $scope.clearForms = function() {
        var clearFormDialogConfirmation = $window.confirm('Are you sure you want to clear the entire form?');

        if (clearFormDialogConfirmation) {
            $scope.allJSONAndScopeNames.forEach(function(e) {
                $scope.deleteModel(e.modelName);
            });
        }
    };

    $scope.findClasses = function(isValidForm) {
        if(isValidForm) {
            console.log("Finding classes...");
            $scope.showDiv = true;

            var generateMessage = function(model, type, parameter, secondParameter) {
                if(model == undefined || model.length == 0) {
                    return "";
                }
                if($rootScope.types.get(model) == $rootScope.types.object) {
                    return "<b>" + type + "</b>: " + model[parameter] + " " + model[secondParameter] + "<br>";
                }
                else {
                    return "<b> " + type + "</b>: " + _.pluck(model, parameter).join(', ') + "<br>";
                }
            };

            $scope.allJSONAndScopeNames.forEach(function(e) {
                var obj = $scope.$eval(e.modelName);
                console.log(e.parameter + "=" + obj[e.parameter]);
            });

            $scope.parametersMessage = generateMessage($scope.termModel, 'Terms', 'semester', 'year');
        }
        else {
            alert("Please select a class term.");
        }
    };

    $scope.goBack = function() {
        console.log('Going back to offered class search page.');
        $scope.showDiv = false;
    };

}]);
