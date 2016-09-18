'use strict';

angular.module('classBrowserUHApp.offeredclass', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/offeredclass', {
        templateUrl: 'views/offeredclass/offeredclass.html',
        controller: 'OfferedClassCtrl'
    });
}])

.controller('OfferedClassCtrl', ['$scope', '$http', '$q', function ($scope, $http, $q) {
    var getData = function(filePath) {
        var defer = $q.defer();
        $http
            .get(filePath)
            .success(function(data){
                defer.resolve(data);
            })
            .error(function() {
                alert("Unable to populate fields.");
            });
        return defer.promise;
    };

    $scope.format = [
        'Online',
        'Face to Face',
        'Hybrid'
    ];

    getData('resources/terms.json').then(function(result) {
        $scope.terms = result;
    });


}]);