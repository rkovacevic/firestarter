'use strict';

angular.module('app.users', ['restangular']).

factory('Users', function(Restangular) {

    var usersPath = Restangular.all('users');
    var userPromise = Restangular.one('users', 'me').get();

    return {
        getUser: function () {
            return userPromise;
        },
        create: function (user) {
            return usersPath.post(user);
        },
        login: function (login) {
            userPromise = usersPath.login(login);
            return userPromise;
        },
        logout: function () {
            userPromise = null;
            return usersPath.logout();
        }
    }
});