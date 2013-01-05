'use strict';


// Declare app level module which depends on filters, and services
angular.module('fin', ['fin.filters', 'fin.services', 'fin.directives']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/accounts', {templateUrl: 'partials/accounts.html', controller: AccountsController});
    // $routeProvider.when('/info', {templateUrl: 'partials/info.html', controller: MyCtrl2});
    $routeProvider.otherwise({redirectTo: '/info'});
  }]);
