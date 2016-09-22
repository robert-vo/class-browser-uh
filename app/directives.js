'use strict';

angular.module('classBrowserUHApp').
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
directive('navBar', function() {
    return {
        restrict: 'E',
        templateUrl: 'views/navbar/navbar.html',
        controller: 'NavBarCtrl'
    };
}).
directive('courseNumberValidator', function () {
    return {
        scope: {
            validValues: '=validValues'
        },
        link: function (scope, elm, attrs) {
            elm.bind('keypress', function(e){
                var char = String.fromCharCode(e.which||e.charCode||e.keyCode), matches = [];
                angular.forEach(scope.validValues, function(value, key){
                    if(char === value) matches.push(char);
                }, matches);
                if(matches.length == 0){
                    e.preventDefault();
                    return false;
                }
            });
        }
    }
});