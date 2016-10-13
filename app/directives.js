'use strict';

angular.module('classBrowserUHApp').directive('pageSelect', function () {
    return {
        restrict: 'E',
        template: '<input type="text" class="select-page" ng-model="inputPage" ng-change="selectPage(inputPage)">',
        link: function (scope, element, attrs) {
            scope.$watch('currentPage', function (c) {
                scope.inputPage = c;
            });
        }
    }
}).directive('navBar', function () {
    return {
        restrict: 'E',
        templateUrl: 'views/navbar/navbar.html',
        controller: 'NavBarCtrl'
    };
}).directive('loadingIcon', function() {
    return {
        restrict: 'E',
        require: '^mdProgressCircular',
        template: '<md-progress-circular style="display: block; margin: 0 auto;" ng-if="isDataLoading" md-mode="indeterminate"></md-progress-circular>'
    };
}).directive('errorMessageBox', function () {
    return {
        restrict: 'E',
        replace: true,
        template: '<div id="errorBox" ng-if="isError"><br><div class="alert alert-danger"> <p><strong>Error!</strong> {{errorMessage}}</p></div></div>'
    };
}).directive('warningMessageBox', function () {
    return {
        restrict: 'E',
        template: '<br> <div class="alert alert-warning" ng-show="hasNoResults"> <p><strong>Warning!</strong></p> <p>{{warningMessage}}</p> </div>'
    };
}).directive('courseNumberValidator', function () {
    return {
        scope: {
            validValues: '=validValues'
        },
        link: function (scope, elm, attrs) {
            elm.bind('keypress', function (e) {
                var char = String.fromCharCode(e.which || e.charCode || e.keyCode), matches = [];
                angular.forEach(scope.validValues, function (value, key) {
                    if (char === value) matches.push(char);
                }, matches);
                if (matches.length == 0) {
                    e.preventDefault();
                    return false;
                }
            });
        }
    }
});