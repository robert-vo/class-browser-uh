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
            $scope.isDataLoading = true;
            $scope.isError = false;
            $scope.hasNoResults = false;

            console.log("Finding classes...");
            $scope.showResults = true;

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

            // $scope.parametersMessage = generateMessage($scope.termModel, 'Terms', 'semester', 'year');
            $scope.parametersMessage = generateMessageForAllModels();
        }
        else {
            alert("Please select a class term.");
        }
    };

    var generateMessageForAllModels = function() {
        var message = "";
        $scope.allJSONAndScopeNames.forEach(function(e) {
            if($scope.$eval(e.modelName) != undefined) {
                message += "<b>" + e.uiParameter + "</b>: ";
                var apiParameter = e.apiParameter;
                var modelValue = $scope.$eval(e.modelName);

                if($rootScope.types.get(modelValue) === $rootScope.types.array) {

                    for(var i = 0; i < modelValue.length; i++) {
                        console.log(modelValue[i]);
                        modelValue[i] = modelValue[i][apiParameter];
                    }
                    var allParameterValuesForGivenmodel = modelValue.join(", ");
                    message += allParameterValuesForGivenmodel;
                }
                else {
                    message += $scope.$eval(e.modelName)[apiParameter];
                }
                message += "<br>";
            }
            else {
                message += e.modelName + " is undefined<br>";
            }
        });
        return message;
    };

    $scope.goBack = function() {
        console.log('Going back to offered class search page.');
        $scope.showResults = false;

        $scope.allJSONAndScopeNames.forEach(function(e) {
            $scope.deleteModel(e.modelName);
        });

        $scope.deleteModel('parametersMessage');

    };


    $scope.termModel = {"term":2000,"year":2016,"semester":"Fall"};
    $scope.formatModel = [{"format":"Hybrid","isOrNot":"Is"},{"format":"Face to Face","isOrNot":"Not"}];
    $scope.statusModel = {"status":"Closed"};
    $scope.sessionModel = [{"session":4,"sessionTitle":"Session 4"},{"session":2,"sessionTitle":"Session 2"}];
    $scope.departmentModel = [{"departmentName":"AFSC","departmentFullName":"Air Force Science"},{"departmentName":"ARAB","departmentFullName":"Arabic"}];
    $scope.buildingModel = [{"buildingID":517,"buildingAbbreviation":"A","buildingName":"Cullen Performance Hall"}];
    $scope.locationModel = [{"location":"UH-Sugar Land"},{"location":"UH-San Antonio-Conrad Hilton"},{"location":"UH"}];
    $scope.componentModel = [{"component":"LEC","componentName":"Lecture"}];
    $scope.creditHourModel = [{"creditHours":4}];
    $scope.weekendUModel = {"weekendU":"No"};
    $scope.coreCategoriesModel = [{"categoryNumber":2,"categoryName":"Mathematics"}];
    $scope.isCoreModel = {"core":"No"};
    $scope.syllabusModel = {"syllabus":"No"};
    $scope.classDaysModel = [{"day":"Monday","isOrNot":"Is"},{"day":"Sunday","isOrNot":"Is"},{"day":"Tuesday","isOrNot":"Not"}];
    $scope.courseNumberModel = 2410;

}]);
