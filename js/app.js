'use strict';
var app = angular.module('app', ['ngRoute', 'services', 'controllers', 'directives','ngCookies','ui.bootstrap','readMore','angular-timeline','moment-picker']);

/**
 * app config route
 ***************************/

app.config(['$routeProvider',
    function($routeProvider) {
        var path = 'views/';
        $routeProvider.
            when('/Home', {
                templateUrl: path + 'Home.html',
                controller: 'masterCtrl'
            }).
            otherwise({
                redirectTo: '/Home',
            });
    }
]);
