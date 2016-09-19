'use strict';

angular.module('classBrowserUHApp', [
    'ngRoute',
    'classBrowserUHApp.version',
    'classBrowserUHApp.home',
    'classBrowserUHApp.class',
    'classBrowserUHApp.core',
    'classBrowserUHApp.department',
    'classBrowserUHApp.offeredclass',
    'classBrowserUHApp.navbar',
    'environment',
    'smart-table',
    'nya.bootstrap.select',
    'ngSanitize'
]).
config(function(nyaBsConfigProvider) {
    var nyaSearchBoxMessages = {
        defaultNoneSelection: 'Nothing Selected',
        noSearchResult: 'No Search Results Found!',
        numberItemSelected: '%d Items Selected'
    };
    nyaBsConfigProvider.setLocalizedText('en-us', nyaSearchBoxMessages);
}).
config(function(envServiceProvider) {
    envServiceProvider.config({
        domains: {
            development: ['localhost'],
            production: ['aws.com']
        },
        vars: {
            development: {
                apiUrl: '//localhost:8080/api'
            },
            production: {
                apiUrl: '//classbrowseruh.us-west-2.elasticbeanstalk.com/api'
            }
        }
    });
    envServiceProvider.check();
}).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');
    $routeProvider.otherwise({redirectTo: '/home'});
}]).
controller('EnvVarCtrl', ['$scope', 'envService', function($scope, envService) {
    $scope.environment = envService.get();
    $scope.vars = envService.read('all');
    $scope.apiUrl = $scope.vars.apiUrl;
}]).
directive('pageSelect', function() {
    return {
        restrict: 'E',
        template: '<input type="text" class="select-page" ng-model="inputPage" ng-change="selectPage(inputPage)">',
        link: function(scope, element, attrs) {
            scope.$watch('currentPage', function(c) {
                scope.inputPage = c;
            });
        }
    }
}).
factory('cartesianProductService', function() {
    var allFunctions = {
        nonEmpty: function(arr) {
            return arr.length > 0;
        },
        productAdd: function(xs, ys) {
            return allFunctions.product(allFunctions.add, xs, ys);
        },
        add: function(a, b) {
            return a + "&" + b;
        },
        product: function(f, xs, ys) {
            var zs = [];

            var m = xs.length;
            var n = ys.length;

            for (var i = 0; i < m; i++) {
                var x = xs[i];

                for (var j = 0; j < n; j++)
                    zs.push(f(x, ys[j]));
            }

            return zs;
        }
    };
    return allFunctions;
}).
factory('apiURLService', function() {
    var allFunctions = {
        expandArrayValues: function(arr, parameter) {
            arr.forEach(function (part, index, arr) {
                arr[index] = parameter + "=" + part;
            });
        },
        appendParametersToAPIUrl: function(arr, baseURL) {
            arr.forEach(function (part, index, arr) {
                arr[index] = baseURL + part;
            });
        }
    };
    return allFunctions;
})
.
run(function($rootScope, cartesianProductService, apiURLService) {
    $rootScope.cartesianProductService = cartesianProductService;
    $rootScope.apiURLService = apiURLService
});