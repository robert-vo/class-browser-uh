'use strict';

angular.module('classBrowserUHApp').
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
        getData: function(url) {
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: url,
                response: 'text',
                port: 443
            })
                .success(function(data){
                    defer.resolve(data);
                })
                .error(function() {
                    return defer.$$reject("Unable to populate the fields.");
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

    $rootScope.types = {
        'get': function(prop) {
            return Object.prototype.toString.call(prop);
        },
        'object': '[object Object]',
        'array': '[object Array]',
        'string': '[object String]',
        'boolean': '[object Boolean]',
        'number': '[object Number]'
    };
});