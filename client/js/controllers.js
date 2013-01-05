'use strict';

/* Controllers */


function MenuController($scope, $location) {
    $scope.list = [
                {name:'Счета', url:'#/accounts'},
                {name:'Статистика', url:'#/stats'},
                {name:'Транзакции', url:'#/transactions'},
                {name:'Настройки', url:'#/settings'}
                ];

    $scope.path = function() {
            return '#'+$location.path();
        }
}

function AccountsController($scope, $http) {
    $scope.reload_currencies = function() {
        $http({method: 'GET', url: '/api/currencies'}).
          success(function(data, status) {
            $scope.currency_list = data;
            $scope.currency = data[0].id;
          }).
          error(function(data, status) {
        });
      };

    $scope.reload_currencies();

    $scope.reload_accounts = function() {
        $http({method: 'GET', url: '/api/accounts'}).
          success(function(data, status) {
            $scope.accounts = data;
          }).
          error(function(data, status) {
        });
      }

    $scope.reload_accounts();

    $scope.add_block = false;
    $scope.start_balance = 0.0;


    $scope.add_account = function() {
        var cdata = {name: $scope.account_name,
                currency: $scope.currency,
                start_balance: $scope.start_balance};
        $http({method: 'POST', url: '/api/accounts', params: cdata}).
          success(function(data, status) {
            $scope.reload_accounts();
            $scope.start_balance = 0.0;
            $scope.account_name = '';
          }).
          error(function(data, status) {
        });
    }


    $scope.del_account = function(id) {
        $http({method: 'DELETE', url: '/api/accounts', params: {'id':id}}).
          success(function(data, status) {
            $scope.reload_accounts();
          }).
          error(function(data, status) {
        });
    }
}
