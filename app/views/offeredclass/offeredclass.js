'use strict';

angular.module('classBrowserUHApp.offeredclass', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/offeredclass', {
        templateUrl: 'views/offeredclass/offeredclass.html',
        controller: 'OfferedClassCtrl'
    });
}])

.controller('OfferedClassCtrl', ['$scope', '$http', '$q', '$rootScope', function ($scope, $http, $q, $rootScope) {

    $rootScope.httpService.getData('resources/format.json').then(function(result) {
        $scope.format = result;
    });

    $rootScope.httpService.getData('resources/terms.json').then(function(result) {
        $scope.terms = result;
    });

    $scope.status = {
        availableOptions: [
            {
                status: "Open"
            },
            {
                status: "Closed"
            }
        ]
    };

    $scope.session = {
        availableOptions: [
            {
                session: 1,
                sessionTitle: "Regular Academic Session"
            },
            {
                session: 2,
                sessionTitle: "Session 2"
            },
            {
                session: 3,
                sessionTitle: "Session 3"
            },
            {
                session: 4,
                sessionTitle: "Session 4"
            },
            {
                session: 5,
                sessionTitle: "Session 5"
            },
            {
                session: 6,
                sessionTitle: "Session 6"
            },
            {
                session: "MIN",
                sessionTitle: "Mini Session"
            }
        ]
    }
}]);