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
        $http
            .get(apiUrl)
            .success(function (data) {
                $scope.rowCollection.add(data.result);
            })
            .error(function (data) {
                alert("Unable to retrieve the data.");
            });
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

        apiUrl.forEach(runPopulateClasses);

        if($scope.rowCollection.length > 0) {
            $scope.showDiv = true;
            $scope.subjectMessage = generateMessage($scope.departmentModel, 'subjects', 'departmentFullName');
            $scope.creditHoursMessage = generateMessage($scope.creditHourModel, 'credit hour', 'creditHours');
            $scope.coreMessage = generateMessage($scope.coreModel, 'core classes', 'categoryName');
        }
    };

    var buildApiUrlsFromModel = function(department, creditHour, core) {
        var baseUrl = $scope.apiUrl + '/information?';

        department = _.pluck(department, 'departmentName');
        creditHour = _.pluck(creditHour, 'creditHours');
        core = _.pluck(core, 'categoryNumber');

        console.log("dept " + department);
        console.log("crh " + creditHour);
        console.log("core " + core);

        var cartProduct = [];

        var allUrls = [];
        function cartesianProduct(arr)
        {
            return arr.reduce(function(a,b){
                return a.map(function(x){
                    return b.map(function(y){
                        return x.concat(y);
                    })
                }).reduce(function(a,b){ return a.concat(b) },[])
            }, [[]])
        }

        if(department != undefined) {
            cartProduct = cartesianProduct(department);
        }

        //
        // var a = cartesianProduct([[1, 2,3], [4, 5,6], [7, 8], [9,10]]);
        // console.log(a);
        //
        // console.log(cartesianProduct(allObjects));

        // http://localhost:8080/api/information?department=aas&credit_hours=2
        // department - A String that represents the department class(es) belong to.
        // credit-hours - An integer that represents the number of credit hours a class fulfills.
        // core - A String representing the core categories of a class.
        return allUrls;
        //department=aas&credit_hours=2';
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