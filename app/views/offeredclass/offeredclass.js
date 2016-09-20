'use strict';

angular.module('classBrowserUHApp.offeredclass', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/offeredclass', {
        templateUrl: 'views/offeredclass/offeredclass.html',
        controller: 'OfferedClassCtrl'
    });
}])
.controller('OfferedClassCtrl', ['$scope', '$http', '$q', '$rootScope', '$parse', function ($scope, $http, $q, $rootScope, $parse) {
    var allJSONAndScopeNames = [
        {
            "path": "resources/terms.json",
            "scopeName": "terms",
            "modelName": "termModel"
        },
        {
            "path": "resources/format.json",
            "scopeName": "format",
            "modelName": "formatModel"
        },
        {
            "path": "resources/status.json",
            "scopeName": "status",
            "modelName": "statusModel"
        },
        {
            "path": "resources/session.json",
            "scopeName": "session",
            "modelName": "sessionModel"
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
            "modelName": "coreModel"
        }
    ];

    $scope.deleteModel = function() {
        [].slice.call(arguments).forEach(function(arg) {
            delete $scope[arg];
        });
    };

    var setScopeVariableFromJSON = function(filePath, scopeVariable) {
        $rootScope.httpService.getData(filePath).then(function(result) {
            $parse(scopeVariable).assign($scope, result);
        });
    };

    allJSONAndScopeNames.forEach(function(e) {
       setScopeVariableFromJSON(e.path, e.scopeName);
    });

    $scope.clearForms = function() {
        allJSONAndScopeNames.forEach(function(e) {
           $scope.deleteModel(e.modelName);
        });
    };

}]);
