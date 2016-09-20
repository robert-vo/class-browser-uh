'use strict';

angular.module('classBrowserUHApp.offeredClass', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/offeredClass', {
        templateUrl: 'views/offeredClass/offeredClass.html',
        controller: 'OfferedClassCtrl'
    });
}])
.controller('OfferedClassCtrl', ['$scope', '$http', '$q', '$rootScope', '$parse', '$window', function ($scope, $http, $q, $rootScope, $parse, $window) {
    var allJSONAndScopeNames = [
        {
            "path": "resources/terms.json",
            "scopeName": "terms",
            "modelName": "termModel",
            "parameter": "term"
        },
        {
            "path": "resources/format.json",
            "scopeName": "format",
            "modelName": "formatModel",
            "parameter": "format"
        },
        {
            "path": "resources/status.json",
            "scopeName": "status",
            "modelName": "statusModel",
            "parameter": "status"
        },
        {
            "path": "resources/session.json",
            "scopeName": "session",
            "modelName": "sessionModel",
            "parameter": "session"
        },
        {
            "path": "resources/subjects.json",
            "scopeName": "departments",
            "modelName": "departmentModel"
        },
        {
            "path": "resources/buildings.json",
            "scopeName": "buildings",
            "modelName": "buildingModel"
        },
        {
            "path": "resources/locations.json",
            "scopeName": "locations",
            "modelName": "locationModel"
        },
        {
            "path": "resources/component.json",
            "scopeName": "component",
            "modelName": "componentModel"
        },
        {
            "path": "resources/creditHours.json",
            "scopeName": "creditHours",
            "modelName": "creditHourModel"
        },
        {
            "path": "resources/weekendU.json",
            "scopeName": "weekendU",
            "modelName": "weekendUModel"
        },
        {
            "path": "resources/coreCategories.json",
            "scopeName": "coreCategories",
            "modelName": "coreCategoriesModel"
        },
        {
            "path": "resources/isCore.json",
            "scopeName": "isCore",
            "modelName": "isCoreModel"
        },
        {
            "path": "resources/syllabus.json",
            "scopeName": "syllabus",
            "modelName": "syllabusModel"
        },
        {
            "path": "resources/classDays.json",
            "scopeName": "classDays",
            "modelName": "classDaysModel"
        },
        {
            "path": "",
            "scopeName": "courseNumber",
            "modelName": "courseNumberModel"
        }
    ];

    var setScopeVariableFromJSON = function(filePath, scopeVariable) {
        $rootScope.httpService.getData(filePath).then(function(result) {
            $parse(scopeVariable).assign($scope, result);
        });
    };

    allJSONAndScopeNames.forEach(function(e) {
        setScopeVariableFromJSON(e.path, e.scopeName);
    });

    $scope.validValues = ['a', 'A','1','2', '3', '4', '5', '6', '7', '8', '9', '0'];

    $scope.deleteModel = function() {
        [].slice.call(arguments).forEach(function(arg) {
            delete $scope[arg];
        });
    };

    $scope.clearForms = function() {
        var clearFormDialogConfirmation = $window.confirm('Are you sure you want to clear the entire form?');

        if (clearFormDialogConfirmation) {
            allJSONAndScopeNames.forEach(function(e) {
                $scope.deleteModel(e.modelName);
            });
        }
    };

    $scope.findClasses = function(isValidForm) {
        if(isValidForm) {
            console.log("Finding classes...");
            $scope.showDiv = true;

            var types = {
                'get': function(prop) {
                    return Object.prototype.toString.call(prop);
                },
                'object': '[object Object]',
                'array': '[object Array]',
                'string': '[object String]',
                'boolean': '[object Boolean]',
                'number': '[object Number]'
            };

            var generateMessage = function(model, type, parameter, secondParameter) {
                if(model == undefined || model.length == 0) {
                    return "";
                }
                if(types.get(model) == types.object) {
                    return "<b>" + type + "</b>: " + model[parameter] + " " + model[secondParameter] + "<br>";
                }
                else {
                    return "<b> " + type + "</b>: " + _.pluck(model, parameter).join(', ') + "<br>";
                }
            };

            allJSONAndScopeNames.forEach(function(e) {
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
