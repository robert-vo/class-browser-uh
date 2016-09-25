'use strict';

angular.module('classBrowserUHApp').config(function (nyaBsConfigProvider) {
    var nyaSearchBoxMessages = {
        defaultNoneSelection: 'Nothing Selected',
        noSearchResult: 'No Search Results Found!',
        numberItemSelected: '%d Items Selected'
    };
    nyaBsConfigProvider.setLocalizedText('en-us', nyaSearchBoxMessages);
}).config(function (envServiceProvider) {
    envServiceProvider.config({
        domains: {
            development: ['localhost'],
            production: ['classbrowseruh.firebaseapp', 'robert-vo.github.io']
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
}).config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');
    $routeProvider.otherwise({redirectTo: '/home'});
}]);