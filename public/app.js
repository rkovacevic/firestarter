'use strict';

angular.module('app', [
    'ngRoute',
    'restangular',
    'angular-growl',
    'app.home',
    'app.users',
    'app.about'
]).
config(function($routeProvider, $locationProvider, growlProvider, RestangularProvider) {
    $routeProvider.otherwise({
        redirectTo: '/'
    });
    $locationProvider.html5Mode(true);

    growlProvider.globalTimeToLive(3000);
    growlProvider.globalDisableCountDown(true);

    RestangularProvider.setBaseUrl('/api');

    RestangularProvider.addElementTransformer('users', true, function(user) {
        user.addRestangularMethod('login', 'post', 'login');
        user.addRestangularMethod('logout', 'post', 'logout');
        return user;
    });
}).
run(function($rootScope, $location, Users) {
    // $rootScope.isCurrentView = function(viewName) {
    //     var currentLocation = $location.path();
    //     if (viewName.length === 0 && currentLocation.length != 1) return false;
    //     return _(currentLocation).startsWith('/' + viewName).value();
    // };

    // $rootScope.loading = true;

    Users.getUser().then(function (user) {
        $rootScope.user = user;
        $rootScope.loading = false;
    }, function () { $rootScope.loading = false; });

    $rootScope.logout = function () {
        $rootScope.user = null;
        Users.logout();
    }
});