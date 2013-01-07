'use strict';


// Declare app level module which depends on filters, and services
angular.module('fin', ['fin.filters', 'fin.services', 'fin.directives']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/accounts', {templateUrl: 'partials/accounts.html', controller: AccountsController});
    $routeProvider.when('/settings', {templateUrl: 'partials/settings.html', controller: CategoriesController});
    $routeProvider.when('/transactions', {templateUrl: 'partials/transactions.html', controller: TransactionsController});
    $routeProvider.otherwise({redirectTo: '/accounts'});
  }]);
