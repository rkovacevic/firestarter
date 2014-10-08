'use strict';

angular.module('app.home', ['ngRoute', 'ui.bootstrap', 'rk.forms', 'angularMoment'])

.config(function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: '/views/home/home.html',
        controller: 'HomeCtrl'
    });
})

.controller('HomeCtrl',
    function($scope, $rootScope, $q, growl, Users) {
        $scope.loginUser = {};
        $scope.registerUser = {};

        $scope.login = function() {
            var deferred = $q.defer();
            Users.login($scope.loginUser).then(function(result) {
                $rootScope.user = result;
                deferred.resolve();
            }, function(result) {
                deferred.reject({
                    password: {
                        message: 'Incorrect credentials'
                    }
                });
            });
            return deferred.promise;
        }

        $scope.register = function() {
            var deferred = $q.defer();

            if ($scope.registerUser.password.length < 8) deferred.reject({
                password: { message: 'Too short'}
            });

            if ($scope.registerUser.password != $scope.registerUser.repeatPassword) deferred.reject({
                repeatPassword: { message: 'Passwords don\'t match'}
            });

            Users.create($scope.registerUser).then(function(result) {
                $rootScope.user = result;
                deferred.resolve();
            }, function(result) {
                deferred.reject(result.data);
            });
            return deferred.promise;
        }

        $scope.sendNewPassword = function() {
            growl.error('Not implemented yet');
            var deferred = $q.defer();
            deferred.reject({});
            return deferred.promise;
        }
    }
);