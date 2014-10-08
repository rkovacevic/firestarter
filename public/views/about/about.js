'use strict';

angular.module('app.about', ['ngRoute'])

.config(function($routeProvider) {
    $routeProvider.when('/about', {
        templateUrl: '/views/about/about.html',
        controller: 'AboutCtrl'
    });
})

.controller('AboutCtrl',
    function() {

    }
);