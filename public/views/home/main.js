'use strict';

angular.module('app.home')

.controller('MainCtrl',
    function($scope, $rootScope, $q, $timeout, growl, Restangular, Users) {
        $scope.posts = null;

        var loadPosts = function(toDate) {
            Restangular.all('posts').getList({'toDate': toDate}).then(function(posts) {
                if ($scope.posts) posts = _.sortBy(_.flatten([$scope.posts, posts]), function(post) {
                    return -1 * moment(post.postedDate).valueOf();
                });
                $scope.posts = _.uniq(posts, '_id');

                $timeout(loadPosts, 5000);
            }, function() {
                growl.error('Error communicating with server');
            })
        }

        $scope.loadNextPage = function() {
            if (!$scope.posts) return;
            loadPosts(_.last($scope.posts).postedDate);
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
                $scope.posts = _.filter($scope.posts, function (post) {
                    return post.author._id != userToUnsubscribeFrom._id;
                });
                loadPosts();
            }, function(result) {
                growl.error('Error communicating with server');
            })
        }
    });