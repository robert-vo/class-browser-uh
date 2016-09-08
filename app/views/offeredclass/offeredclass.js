'use strict';

angular.module('classBrowserUHApp.offeredclass', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/offeredclass', {
        templateUrl: 'views/offeredclass/offeredclass.html',
        controller: 'OfferedClassCtrl'
    });
}])

.controller('OfferedClassCtrl', [function() {

}]);