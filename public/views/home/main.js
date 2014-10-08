'use strict';

angular.module('app.home')

.controller('MainCtrl',
    function($scope, $rootScope, $q, growl, Restangular, Users) {
        $scope.posts = null;

        var loadPosts = function () {
            Restangular.all('posts').getList().then(function(posts) {
                $scope.posts = posts;
            }, function() {
                growl.error('Error communicating with server');
            })
        }

        $scope.$watch('user', function() {
            if ($scope.user == null) return;
            
            loadPosts();

            Restangular.all('users/suggested').getList().then(function(users) {
                $scope.suggestedUsers = users;
            }, function() {
                growl.error('Error communicating with server');
            })
        })
        
        $scope.post = function() {
            var deferred = $q.defer();
            Restangular.all('posts').post({ text: $scope.postText }).then(function(result) {
                if ($scope.posts == null) $scope.posts = [];
                $scope.posts.unshift(result);
                $scope.postText = null;
                $scope.postForm.$setPristine(true); 
                deferred.resolve();
            }, function(result) {
                deferred.reject({
                    postText: { message: 'Error submitting' }
                });
            });
            return deferred.promise;
        }

        $scope.subscribe = function(userToSubscribeTo) {
            Restangular.all('users/me/subscriptions').post(userToSubscribeTo)
            .then(function(result) {
                _.without($scope.suggestedUsers, userToSubscribeTo);
                $rootScope.user.subscriptions.push(userToSubscribeTo);
                loadPosts();
            }, function(result) {
                growl.error('Error communicating with server');
            })
        }

        $scope.unsubscribe = function(userToUnsubscribeFrom) {
            Restangular.one('users/me/subscriptions', userToUnsubscribeFrom._id).remove()
            .then(function(result) {
                _.without($rootScope.user.subscriptions, userToUnsubscribeFrom);
                $scope.suggestedUsers.push(userToUnsubscribeFrom);
                loadPosts();
            }, function(result) {
                growl.error('Error communicating with server');
            })
        }
    });