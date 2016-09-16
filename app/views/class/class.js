'use strict';

angular.module('classBrowserUHApp.class', ['ngRoute']).
config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/class', {
        templateUrl: 'views/class/class.html',
        controller: 'ClassCtrl'
    });
}]).
controller('ClassCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.selectedCountLimit = 'count > 3';
    $scope.rowCollection = [];

    $scope.departments = {
        availableOptions: []
    };


    var populateDepartments = function() {
        var url = $scope.apiUrl + '/department';
        $http.get(url)
            .success(function (data) {
                console.log("Retrieved " + data.numberOfRows + " departments.");
                console.log(data);
                $scope.departments.availableOptions = data.result;
            })
            .error(function (data) {
                alert("Unable to retrieve the data.");
            })
    };

    populateDepartments();

    $scope.creditHours = {
        availableOptions: [
            {creditHours: 1},
            {creditHours: 1.5},
            {creditHours: 2},
            {creditHours: 3},
            {creditHours: 4},
            {creditHours: 5},
            {creditHours: 6},
            {creditHours: 7},
            {creditHours: 8},
            {creditHours: 9},
            {creditHours: 10}
        ]
    };

    $scope.coreCategories = {
        availableOptions: [
            {categoryNumber: 1, categoryName: "Communication"},
            {categoryNumber: 2, categoryName : "Mathematics"},
            {categoryNumber: 3, categoryName : "Life and Physical Sciences"},
            {categoryNumber: 4, categoryName : "Language, Philosophy & Culture"},
            {categoryNumber: 5, categoryName : "Creative Arts"},
            {categoryNumber: 6, categoryName : "American History"},
            {categoryNumber: 7, categoryName : "Government/Political Science"},
            {categoryNumber: 8, categoryName : "Social & Behavioral Sciences"},
            {categoryNumber: 9, categoryName : "Mathematics/Reasoning"},
            {categoryNumber: 10, categoryName : "Writing in the Disciplines"}
        ]
    };

    var runPopulateClasses = function(apiUrl) {
        console.log("Given URL: " + apiUrl);

        for(var i = 0; i < apiUrl.length; i++) {
            console.log("Got URL: " +apiUrl[i]);

            // Simple GET request example:
            $http({
                method: 'GET',
                url: apiUrl[i]
            }).then(function successCallback(response) {
                console.log("Response: " + response);
                // this callback will be called asynchronously
                // when the response is available
            }, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
        }

        // apiUrl.forEach(function (url) {
        //     console.log(url);
        //     $http
        //         .get(url)
        //         .success(function (data) {
        //             console.log("Data retrieved is: " + data);
        //             $scope.rowCollection.push(data.result);
        //             console.log($scope.rowCollection);
        //         })
        //         .error(function (data) {
        //             alert("Unable to retrieve the data.");
        //         });
        // });

        console.log("New rowCollection = " + $scope.rowCollection);
    };

    var generateMessage = function(model, type, objToPluck) {
        if(model == undefined || model.length == 0) {
            return "You have selected zero " + type + ". Searching for all " + type + ".";
        }
        else {
            return "You have selected " + _.pluck(model, objToPluck).join(', ') + " as your " + type + ".";
        }
    };


    $scope.populateClasses = function(){
        $scope.rowCollection = [];
        var apiUrl = buildApiUrlsFromModel($scope.departmentModel, $scope.creditHourModel, $scope.coreModel);
        console.log("Populating Classes...");

        console.log("Retrieved api URLs: " + apiUrl);

        for(var i = 0; i < apiUrl.length; i++) {
            console.log("Got URL: " + apiUrl[i]);
            $http
                .get(apiUrl[i])
                .success(function (data) {
                    console.log("Data retrieved is: " + data);
                    $scope.rowCollection = $scope.rowCollection.concat(data.result);
                    console.log($scope.rowCollection);
                    populateFields();
                })
                .error(function (data) {
                    alert("Unable to retrieve the data.");
                });
        }

        console.log("showdiv = " + $scope.showDiv);
        // console.log("Result is: " + $scope.rowCollection);
        console.log("Flattened: " + _.flatten($scope.rowCollection));
        console.log("Length: " + $scope.rowCollection.length);


    };

    var populateFields = function(){
        console.log("In populate fields");
        console.log("Row Collection = " + $scope.rowCollection);
        if($scope.rowCollection.length > 0) {
            $scope.showDiv = true;
            $scope.subjectMessage = generateMessage($scope.departmentModel, 'subjects', 'departmentFullName');
            $scope.creditHoursMessage = generateMessage($scope.creditHourModel, 'credit hour', 'creditHours');
            $scope.coreMessage = generateMessage($scope.coreModel, 'core classes', 'categoryName');
        }
    };

    var isArrayIsUndefinedOrNull = function(arr) {
        return !(_.isUndefined(arr) || _.isNull(arr) || _.isEmpty(arr));
    };

    var buildApiUrlsFromModel = function(department, creditHour, core) {
        console.log("Building API URL...");
        var baseUrl = $scope.apiUrl + '/information?';
        var allParametersFromScope = [department, creditHour, core];

        Array.prototype.allParametersUndefinedOrNull = function() {
            for(var i = 0; i < this.length; i++) {
                if(isArrayIsUndefinedOrNull(this[i])) {
                    return false;
                }
            }
            return true;
        };

        if(allParametersFromScope.allParametersUndefinedOrNull()) {
            console.log("All parameters are empty...");
            return [baseUrl];
        }

        console.log("User has selected some categories. Preparing API URL.");
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
        console.log('going back');
        $scope.showDiv = false;
    };

    $scope.clearForms = function() {
        console.log('clearing forms...');
        console.log($scope.departmentModel);
        console.log($scope.creditHourModel);
        console.log($scope.coreModel);
        $scope.departmentModel = undefined;
        $scope.creditHourModel = undefined;
        $scope.coreModel = undefined;
    };

}]);