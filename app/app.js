'use strict';

angular.module('classBrowserUHApp', [
    'ngRoute',
    'classBrowserUHApp.version',
    'classBrowserUHApp.home',
    'classBrowserUHApp.class',
    'classBrowserUHApp.core',
    'classBrowserUHApp.department',
    'classBrowserUHApp.offeredClass',
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
            development : ['localhost'],
            production: ['https://classbrowseruh.firebaseapp.com/#!/home',
                    'classbrowseruh.firebaseapp',
                    'firebaseapp',
                    'https://classbrowseruh.firebaseapp.com/#!/',
                    'classbrowseruh.firebaseapp.com',
                    'classbrowseruh.firebaseapp.com/',
                    'classbrowseruh.firebaseapp.com/#!/']
        },
        vars: {
            development: {
                apiUrl: '//localhost:8080/api'
            },
            production: {
                apiUrl: 'http://classbrowseruh.us-west-2.elasticbeanstalk.com/api'
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
    return {
        expandArrayValuesInPlace: function (arr, parameter) {
            arr.forEach(function (part, index, arr) {
                arr[index] = parameter + "=" + part;
            });
        },
        appendParametersToAPIUrl: function (arr, baseURL) {
            arr.forEach(function (part, index, arr) {
                arr[index] = baseURL + part;
            });
        }
    };
}).
factory('arrayService', function() {
    return {
        isArrayIsNotUndefinedOrNull: function(array) {
            return !(_.isUndefined(array) || _.isNull(array) || _.isEmpty(array));
        }
    }
}).
factory('httpService', function($http, $q) {
    return {
        getData: function(filePath) {
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: filePath,
                response: 'text',
                port: 443
            })
                .success(function(data){
                    defer.resolve(data);
                })
                .error(function() {
                    alert("Unable to populate fields.");
                });
            return defer.promise;
        }
    }
}).
run(function($rootScope, cartesianProductService, apiURLService, arrayService, httpService) {
    $rootScope.cartesianProductService = cartesianProductService;
    $rootScope.apiURLService = apiURLService;
    $rootScope.arrayService = arrayService;
    $rootScope.httpService = httpService;
    $rootScope.selectedCountLimit = 'count > 3';

    Array.prototype.allParametersUndefinedOrNull = function() {
        for(var i = 0; i < this.length; i++) {
            if($rootScope.arrayService.isArrayIsNotUndefinedOrNull(this[i])) {
                return false;
            }
        }
        return true;
    };
});