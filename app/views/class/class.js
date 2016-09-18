'use strict';

angular.module('classBrowserUHApp.class', ['ngRoute']).
config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/class', {
        templateUrl: 'views/class/class.html',
        controller: 'ClassCtrl'
    });
}]).
controller('ClassCtrl', ['$scope', '$http', '$q', function ($scope, $http, $q) {
    $scope.selectedCountLimit = 'count > 3';
    $scope.rowCollection = [];

    $scope.departments = {
        availableOptions: []
    };

    $scope.departments = $http.get('resources/subjects.json')
        .success(function (data) {
            return $scope.departments = data;
        })
        .error(function (data) {
            alert("Unable to find subjects.json.");
        });


    $scope.creditHours =
        $http.get('resources/creditHours.json')
            .success(function (data) {
                $scope.creditHours = data;
            })
            .error(function (data) {
                alert("Unable to find creditHours.json.");
            });

    $scope.coreCategories =
        $http.get('resources/coreCategories.json')
            .success(function (data) {
                $scope.coreCategories = data;
            })
            .error(function (data) {
                alert("Unable to find coreCategories.json.");
            });

    var generateMessage = function(model, type, objToPluck) {
        if(model == undefined || model.length == 0) {
            return "";
        }
        else {
            return "<b> " + type + "</b>: " + _.pluck(model, objToPluck).join(', ') + "<br>";
        }
    };


    $scope.populateClasses = function(){
        $scope.rowCollection = [];
        var apiUrl = buildApiUrlsFromModel($scope.departmentModel, $scope.creditHourModel, $scope.coreModel);
        console.log("Populating Classes...");

        $scope.numberOfRows = 0;
        for(var i = 0; i < apiUrl.length; i++) {
            console.log("Got URL: " + apiUrl[i]);
            $http
                .get(apiUrl[i])
                .success(function (data) {
                    $scope.numberOfRows += data.numberOfRows;
                    $scope.rowCollection = $scope.rowCollection.concat(data.result);
                    populateFields();
                })
                .error(function (data) {
                    alert("Unable to retrieve the data.");
                });
        }
    };

    var populateFields = function(){
        $scope.hasNoResults = false;
        console.log("In populate fields");
        console.log("Row Collection = " + $scope.rowCollection);
        if($scope.rowCollection.length > 0) {
            $scope.showDiv = true;

            $scope.numberOfRowsMessage = "Retrieved " + $scope.numberOfRows + " class";
            $scope.numberOfRowsMessage += $scope.numberOfRows == 1 ? " ." : "es.";

            if([$scope.departmentModel, $scope.creditHourModel, $scope.coreModel].allParametersUndefinedOrNull()) {
                $scope.parametersMessage = "No parameters were chosen, so all classes have been retrieved.";
            }
            else {
                $scope.parametersMessage = "";
                $scope.subjectMessage = generateMessage($scope.departmentModel, 'Subjects', 'departmentFullName');
                $scope.creditHoursMessage = generateMessage($scope.creditHourModel, 'Credit Hours', 'creditHours');
                $scope.coreMessage = generateMessage($scope.coreModel, 'Core Categories', 'categoryName');
                $scope.parametersMessage = $scope.subjectMessage +
                    $scope.creditHoursMessage +
                    $scope.coreMessage;
            }
        }
        else {
            $scope.hasNoResults = true;
        }
    };

    var isArrayIsUndefinedOrNull = function(arr) {
        return !(_.isUndefined(arr) || _.isNull(arr) || _.isEmpty(arr));
    };

    Array.prototype.allParametersUndefinedOrNull = function() {
        for(var i = 0; i < this.length; i++) {
            if(isArrayIsUndefinedOrNull(this[i])) {
                return false;
            }
        }
        return true;
    };

    var buildApiUrlsFromModel = function(department, creditHour, core) {
        console.log("Building API URL...");
        var baseUrl = $scope.apiUrl + '/information?';
        var allParametersFromScope = [department, creditHour, core];

        if(allParametersFromScope.allParametersUndefinedOrNull()) {
            console.log("All parameters are empty...");
            return [baseUrl];
        }

        console.log("User has selected some categories. Preparing API URL(s).");
        department = _.pluck(department, 'departmentName');
        creditHour = _.pluck(creditHour, 'creditHours');
        core = _.pluck(core, 'categoryNumber');

        console.log("dept " + department);
        console.log("crh " + creditHour);
        console.log("core " + core);

        var expandArrayValues = function(arr, parameter) {
            arr.forEach(function (part, index, arr) {
                arr[index] = parameter + "=" + part;
            });
        };

        if(isArrayIsUndefinedOrNull(department)) {
            expandArrayValues(department, 'department');
        }
        if(isArrayIsUndefinedOrNull(creditHour)) {
            expandArrayValues(creditHour, 'credit-hours');
        }
        if(isArrayIsUndefinedOrNull(core)) {
            expandArrayValues(core, 'core');
        }


        var appendApiUrl = function(arr) {
            arr.forEach(function (part, index, arr) {
                arr[index] = baseUrl + part;
            });
        };


        var allParameters = [department,creditHour,core].filter(nonEmpty).reduce(productAdd);

        appendApiUrl(allParameters);

        function nonEmpty(xs) {
            return xs.length > 0;
        }

        function productAdd(xs, ys) {
            return product(add, xs, ys);
        }

        function add(a, b) {
            return a + "&" + b;
        }

        function product(f, xs, ys) {
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

        console.log("Retrieved parameters from cartesian product: " + allParameters);
        return allParameters;
    };

    $scope.goBack = function() {
        console.log('Going back to class search page.');
        $scope.showDiv = false;
    };

    $scope.clearForms = function() {
        $scope.hasNoResults = false;
        console.log('Clearing forms and fields.');
        console.log($scope.departmentModel);
        console.log($scope.creditHourModel);
        console.log($scope.coreModel);
        $scope.departmentModel = undefined;
        $scope.creditHourModel = undefined;
        $scope.coreModel = undefined;
        $scope.parametersMessage = undefined;
        $scope.rowCollection = undefined;
    };

}]);