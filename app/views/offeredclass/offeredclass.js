'use strict';

angular.module('classBrowserUHApp.offeredclass', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/offeredclass', {
        templateUrl: 'views/offeredclass/offeredclass.html',
        controller: 'OfferedClassCtrl'
    });
}])

.controller('OfferedClassCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.format = [
        'Online',
        'Face to Face',
        'Hybrid'
    ];

    $scope.options = [
        'Alpha',
        'Bravo',
        'Charlie',
        'Delta',
        'Echo',
        'Fox',
        'Golf'
    ];

    //validate
    $scope.terms = {
        availableOptions: [
            {
                termID: 1970,
                year: 2015,
                semester: "Fall"
            },
            {
                termID: 1980,
                year: 2016,
                semester: "Springeruhgfd"
            }
        ]
    }


}]);