'use strict';

angular.module('classBrowserUHApp.offeredClass', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/offeredClass', {
        templateUrl: 'views/offeredClass/offeredClass.html',
        controller: 'OfferedClassCtrl'
    });
}])
.controller('OfferedClassCtrl', ['$scope', '$http', '$q', '$rootScope', '$parse', '$window', function ($scope, $http, $q, $rootScope, $parse, $window) {
    var setScopeVariableFromJSON = function(filePath, scopeVariable) {
        $rootScope.httpService.getData(filePath).then(function(result) {
            $parse(scopeVariable).assign($scope, result);
        });
    };

    var initializeAllJSONAndScopeNames = function(name) {
        $rootScope.httpService.getData('resources/allScopeVariables.json').then(function(result) {
            $scope.allJSONAndScopeNames = result[name];
            $scope.allJSONAndScopeNames.forEach(function(e) {
                setScopeVariableFromJSON(e.path, e.scopeName);
            });
        });
    };

    initializeAllJSONAndScopeNames("offeredClass");

    $scope.validValues = ['A','1','2', '3', '4', '5', '6', '7', '8', '9', '0'];

    $scope.deleteModel = function() {
        [].slice.call(arguments).forEach(function(arg) {
            delete $scope[arg];
        });
    };

    $scope.clearForms = function() {
        var clearFormDialogConfirmation = $window.confirm('Are you sure you want to clear the entire form?');

        if (clearFormDialogConfirmation) {
            $scope.allJSONAndScopeNames.forEach(function(e) {
                $scope.deleteModel(e.modelName);
            });
        }
    };

    $scope.findClasses = function(isValidForm) {
        if(isValidForm) {
            $scope.isDataLoading = true;
            $scope.isError = false;
            $scope.hasNoResults = false;

            $scope.showResults = true;
            $scope.parametersMessage = generateMessageForAllModels();

            getAllData().then(function(data) {
                $scope.rowCollection = data.result;
            }, function(err) {
                console.log('Unable to get the data given error: ' + err);
            });

            $scope.isDataLoading = false;
        }
        else {
            alert("Please select a class term.");
        }
    };

    var getAllData = function() {
        var apiURLs = getAllAPIUrls();
        var promises = [];

        _.each(apiURLs, function(apiURL) {
            promises.push($rootScope.httpService.getData(apiURL));
        });

        return $q.all(promises);
    };

    var generateBaseURL = function() {
        var baseURLWithoutTerm = $scope.apiUrl + "/classes/term=";
        baseURLWithoutTerm += $scope.$eval('termModel')['term'];
        baseURLWithoutTerm += "?";
        return baseURLWithoutTerm;
    };

    var generateAllParameters = function() {
        var allParameters = [];
        $scope.allJSONAndScopeNames.forEach(function(aScopeVariable) {
            if(aScopeVariable.modelName != 'termModel') {
                var modelValue = $scope.$eval(aScopeVariable.modelName);
                if (modelValue != undefined) {
                    if (isNotArray(modelValue)) {
                        modelValue = [modelValue];
                    }

                    var currentParameters = [];
                    modelValue.forEach(function (aModel) {
                        if (aModel["isOrNot"] != undefined) {
                            currentParameters.push(aModel[aScopeVariable.apiParameterValueFromModel].split(" ").join("-") +
                                "=" + (aModel["isOrNot"] == "Is"));
                        }
                        else {
                            currentParameters.push(aScopeVariable.apiParameterInEndpoint + "=" + aModel[aScopeVariable.apiParameterValueFromModel]);
                        }
                    });
                    allParameters.push(currentParameters);
                }
            }
        });
        return allParameters;
    };

    var getAllAPIUrls = function() {
        var baseURL = generateBaseURL();
        var allParameters = generateAllParameters();
        var allAPIUrls = allParameters
            .reduce($rootScope.cartesianProductService.productAdd, [""]);

        return $rootScope.apiURLService.appendParametersAndReturnAPIUrls(allAPIUrls, baseURL);
    };

    var generateMessageForAllModels = function() {
        var message = "";

        $scope.allJSONAndScopeNames.forEach(function(aScopeVariable) {
            if($scope.$eval(aScopeVariable.modelName) != undefined) {
                var modelValue = $scope.$eval(aScopeVariable.modelName);
                var allDisplayParameters = aScopeVariable.displayParameters.split(", ");
                var allMessagesForModel = getAllMessagesForModelAndParameters(modelValue, allDisplayParameters);

                message += "<b>" + aScopeVariable.uiParameter + "</b>: ";
                message += allMessagesForModel.join(", ");
                message += "<br>";
            }
        });

        return message;
    };

    var isNotArray = function(models) {
        return $rootScope.types.get(models) !== $rootScope.types.array;
    };

    var getAllMessagesForModelAndParameters = function(models, parameters) {
        if(isNotArray(models)) {
            models = [models];
        }

        var allMessages = [];
        models.forEach(function(model) {
            var aMessageForModel = "";
            parameters.forEach(function(parameter) {
                aMessageForModel = aMessageForModel + model[parameter] + " ";
            });
            allMessages.push(aMessageForModel.trim());
        });
        return allMessages;
    };

    $scope.goBack = function() {
        console.log('Going back to offered class search page.');
        $scope.showResults = false;

        $scope.allJSONAndScopeNames.forEach(function(e) {
            $scope.deleteModel(e.modelName);
        });

        $scope.deleteModel('parametersMessage');

    };


    $scope.termModel = {"term":2000,"year":2016,"semester":"Fall"};
    $scope.formatModel = [{"format":"Hybrid","isOrNot":"Is"},{"format":"Face to Face","isOrNot":"Not"}];
    $scope.statusModel = {"status":"Closed"};
    $scope.sessionModel = [{"session":4,"sessionTitle":"Session 4"},{"session":2,"sessionTitle":"Session 2"}];
    $scope.subjectModel = [{"subject":"AFSC","subjectFullName":"Air Force Science"},{"subject":"ARAB","subjectFullName":"Arabic"}];
    $scope.buildingModel = [{"buildingID":517,"building":"A","buildingName":"Cullen Performance Hall"}];
    $scope.locationModel = [{"location":"UH-Sugar Land"},{"location":"UH-San Antonio-Conrad Hilton"},{"location":"UH"}];
    $scope.componentModel = [{"component":"LEC","componentName":"Lecture"}];
    $scope.creditHourModel = [{"credit-hours":4}];
    $scope.weekendUModel = {"weekendU":"No"};
    $scope.coreCategoriesModel = [{"categoryNumber":2,"categoryName":"Mathematics"}];
    $scope.isCoreModel = {"is-core":"No"};
    $scope.syllabusModel = {"syllabus":"No"};
    $scope.classDaysModel = [{"day":"Monday","isOrNot":"Is"},{"day":"Sunday","isOrNot":"Is"},{"day":"Tuesday","isOrNot":"Not"}];
    $scope.courseNumberModel = {"courseNumber": 2410};

}]);
