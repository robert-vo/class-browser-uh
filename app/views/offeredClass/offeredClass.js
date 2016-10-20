'use strict';

angular.module('classBrowserUHApp.offeredClass', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/offeredClass', {
        templateUrl: 'views/offeredClass/offeredClass.html',
        controller: 'OfferedClassCtrl'
    });
}])
.controller('OfferedClassCtrl', ['$scope', '$http', '$q', '$rootScope', '$parse', '$window', '$mdDialog', function ($scope, $http, $q, $rootScope, $parse, $window, $mdDialog) {
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
        $rootScope.showConfirmAndReturnPromise().then(function() {
            clearAllModels();
            $scope.deleteModel('warningMessage', 'hasNoResults', 'isError');
        }, function() {
            console.log("Not deleting...")
        });
    };

    $scope.findClasses = function(isValidForm) {
        if(isValidForm) {
            $scope.isDataLoading = true;
            $scope.hasNoResults = false;
            $scope.isError = false;
            $scope.parametersMessage = generateMessageForAllModels();

            var setRowCollectionFromData = function(data) {
                $scope.rowCollection = [];
                $scope.numberOfRows = 0;
                data.forEach(function(aRow) {
                    $scope.numberOfRows += aRow.numberOfRows;
                    $scope.rowCollection = $scope.rowCollection.concat(aRow.result);
                });
            };

            var onError = function(err) {
                console.log('Unable to get the data given error: ' + err);
                $scope.isError = true;
                $scope.errorMessage = "An error has occurred while trying to retrieve the classes. Please try again later.";
            };

            var finallyDo = function() {
                $scope.isDataLoading = false;

                if($scope.numberOfRows == 0 && !$scope.isError) {
                    $scope.hasNoResults = true;
                    $scope.warningMessage = "There are no classes found with the categories you have selected. Please try again.";
                }
                else if(!$scope.isError) {
                    $scope.showResults = true;
                }
            };

            getAllData()
                .then(setRowCollectionFromData)
                .catch(onError)
                .finally(finallyDo);
        }
        else {
            $scope.showNoTermSelectedAlert();
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
    };

    $scope.selectTestModels = function() {
        clearAllModels();
        $scope.termModel = {"term": 2000, "year": 2016, "semester": "Fall"};
        $scope.formatModel = [{"format": "Hybrid", "isOrNot": "Is"}, {"format": "Face to Face", "isOrNot": "Not"}];
        $scope.statusModel = {"status": "Closed"};
        $scope.sessionModel = [{"session": 4, "sessionTitle": "Session 4"}, {
            "session": 2,
            "sessionTitle": "Session 2"
        }];
        $scope.subjectModel = [{"subject": "AFSC", "subjectFullName": "Air Force Science"}, {
            "subject": "ARAB",
            "subjectFullName": "Arabic"
        }];
        $scope.buildingModel = [{"buildingID": 517, "building": "A", "buildingName": "Cullen Performance Hall"}];
        $scope.locationModel = [{"location": "UH-Sugar Land"}, {"location": "UH-San Antonio-Conrad Hilton"}, {"location": "UH"}];
        $scope.componentModel = [{"component": "LEC", "componentName": "Lecture"}];
        $scope.creditHourModel = [{"credit-hours": 4}];
        $scope.weekendUModel = {"weekendU": "No"};
        $scope.coreCategoriesModel = [{"categoryNumber": 2, "categoryName": "Mathematics"}];
        $scope.isCoreModel = {"is-core": "No"};
        $scope.syllabusModel = {"syllabus": "No"};
        $scope.classDaysModel = [{"day": "Monday", "isOrNot": "Is"}, {
            "day": "Sunday",
            "isOrNot": "Is"
        }, {"day": "Tuesday", "isOrNot": "Not"}];
        $scope.courseNumberModel = {"courseNumber": 2410};
    };

    $scope.selectTestModelsTwo = function() {
        clearAllModels();
        $scope.termModel = {"term": 2000, "year": 2016, "semester": "Fall"};
        $scope.weekendUModel = {"weekendU": "Yes"};


    };

    $scope.selectTestModelsThree = function() {
        clearAllModels();
        $scope.termModel = {"term": 2000, "year": 2016, "semester": "Fall"};
        $scope.isCoreModel = {"is-core": "Yes"};
        $scope.formatModel = [{"format": "Online", "isOrNot": "Is"}];
    };

    $scope.selectTestModelsOneClassResult = function() {
        clearAllModels();
        $scope.termModel = {"term": 2000, "year": 2016, "semester": "Fall"};
        $scope.formatModel = [{"format": "Online", "isOrNot": "Is"}];
        $scope.sessionModel = [{"session": 6, "sessionTitle": "Session 6"}];
        $scope.subjectModel = [{"subject": "SOC", "subjectFullName": "Sociology"}];

    };

    var clearAllModels = function() {
        $scope.allJSONAndScopeNames.forEach(function(e) {
            $scope.deleteModel(e.modelName);
        });
    };

    $scope.getSyllabus = function(syllabus) {
        if(syllabus == 'Unavailable') {
            return "N/A";
        }
        else {
            return "<a href=" + syllabus + " target=_blank>Syllabus</a>";
        }
    };

    $scope.scrollToTermField = function() {
        $('html, body').animate({scrollTop: $('#terms').offset().top}, 'slow');
    };

    $scope.showNoTermSelectedAlert = function(ev) {
        var title = "Warning!";
        var description = "A term needs to be selected. Please select a term.";
        var okay = "Ok";
        $mdDialog.show(
            $mdDialog.alert()
                .parent(angular.element(document.querySelector('#popupContainer')))
                .clickOutsideToClose(true)
                .title(title)
                .textContent(description)
                .ariaLabel('Term Dialog')
                .ok(okay)
                .targetEvent(ev)
        ).then(function() {
            $scope.scrollToTermField();
        });
    };

    $scope.getClassDaysMessage = function(classDaysForAClass) {
        var allClassDays = $scope.classDays.dayAbbreviations;

        return allClassDays
                .filter(function(aClassDay) {
                    return classDaysForAClass[aClassDay.classDay];
                })
                .map(function(aClassDay) {
                    return aClassDay.classDayAbbreviation;
                })
                .join("");
    };

    $scope.getCoreCategoriesMessage = function(coreCategories) {
        return coreCategories
                .filter(function(aCoreCategory) {
                    return aCoreCategory.length != 0;
                })
                .map(function(aCoreCategory) {
                    return $scope.coreCategories.availableOptions[aCoreCategory - 1].categoryName;
                })
                .join(", ") || "Not a core class.";
    };

    $scope.displayDetailedOfferedClass = function(aClass) {
        $scope.displayDetailed = true;
        $scope.detailedClass = aClass;
        $scope.detailedOfferedClassMessage = aClass.classTitle;
    };

    $scope.exitDisplayDetailedOfferedClass = function() {
        $scope.displayDetailed = false;
        $scope.detailedClass = undefined;
    };

    $scope.getClassDaysAndMeetingTimesMessage = function(days, startTime, endTime) {
        var daysMessage = $scope.getClassDaysMessage(days);
        var timesMessage = $scope.getMeetingTimesMessage(startTime, endTime);
        return daysMessage && timesMessage ? daysMessage + " " + timesMessage : "TBA";
    };

    $scope.getSeatInformationMessage = function(status, seatInformation) {
        return status + " (" + seatInformation.seatsTaken + "/" +
            seatInformation.seatsTotal + ")";
    };

    $scope.getMeetingTimesMessage = function(startTime, endTime) {
        if(startTime == "" && endTime == "") {
            return "";
        }
        else {
            var newStartTime = convertClassTimeToAMPM(startTime);
            var newEndTime = convertClassTimeToAMPM(endTime);
            return newStartTime + " - " + newEndTime;
        }
    };

    var convertClassTimeToAMPM = function(time) {
        var hours = parseInt(time.substr(0, 2));
        var minutes = time.substr(3, 2);
        var isPM = false;

        if(hours >= 12) {
            isPM = true;

            if(hours >= 13) {
                hours = hours - 12;
            }
        }

        var baseTime = hours + ":" + minutes;

        return isPM ? baseTime + "P.M." : baseTime + "A.M.";
    };

    $scope.getMeetingDatesMessage = function(startDate, endDate) {
        return startDate.replace("-", "/") + " to " + endDate.replace("-", "/");
    };

    $scope.toggleScroll = function() {
        $scope.check = !$scope.check;
    };

    $scope.validateChoice = function($event, option, model) {
        console.log("model length = " + model.length);
        model.forEach(function(e) {
            console.log(e);
        });
        console.log("new option: " + option.format + " hi " + option.isOrNot);
        if(model.length >= 4 && !modelIncludesOption(option, model)) {
            $event.stopPropagation();
            console.log("Not updated");
        }
        else if(model.length >= 4 && modelIncludesOption(option, model)) {
            console.log("length greater than 4, but it should be deselected");
        }
        else {
            console.log("new option " + option);
            console.log("Model updated" + model);
        }
    };

    var modelIncludesOption = function(option, model) {
        var includes = false;
        model.forEach(function(e) {
            if(e.format == option.format && e.isOrNot == option.isOrNot) {
                includes = true;
            }
        });
        return includes;
    };


    $scope.showDetailedClass = function(ev, aClass) {
        $mdDialog.show({
            controller: DialogController,
            templateUrl: 'views/templates/dialog.template.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true,
            locals: {
                aClass: aClass
            },
            fullscreen: true
        });
    };

    function DialogController($scope, $mdDialog, aClass) {
        $scope.aClass = aClass;

        $scope.hide = function() {
            $mdDialog.hide();
        };

        $scope.cancel = function() {
            $mdDialog.cancel();
        };
    }
}]);
