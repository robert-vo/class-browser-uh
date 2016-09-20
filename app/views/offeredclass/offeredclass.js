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
            "path": "resources/format.json",
            "scopeName": "format"
        },
        {
            "path": "resources/terms.json",
            "scopeName": "terms"
        },
        {
            "path": "resources/status.json",
            "scopeName": "status"
        },
        {
            "path": "resources/session.json",
            "scopeName": "session"
        },
        {
            "path": "resources/subjects.json",
            "scopeName": "departments"
        },
        {
            "path": "resources/buildings.json",
            "scopeName": "buildings"
        },
        {
            "path": "resources/locations.json",
            "scopeName": "locations"
        },
        {
            "path": "resources/component.json",
            "scopeName": "component"
        },
        {
            "path": "resources/creditHours.json",
            "scopeName": "creditHours"
        },
        {
            "path": "resources/weekendU.json",
            "scopeName": "weekendU"
        },
        {
            "path": "resources/coreCategories.json",
            "scopeName": "coreCategories"
        }
    ];

    var deleteModel = function() {
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
        deleteModel('weekendUModel', 'coreModel');
    };

}]);
