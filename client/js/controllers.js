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

function AccountsController($scope) {
    $scope.accounts = [
                        {id:0, name:"Наличные", currency:"uah", value:154.24},
                        {id:1, name:"Карта", currency:"usd", value:600.0},
                      ]

    $scope.add_block = false;

    $scope.currency = 'uah';
    $scope.currency_list = ['usd', 'uah'];
}
