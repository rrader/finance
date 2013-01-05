'use strict';

/* Controllers */


function MenuController($scope, $location) {
    $scope.list = [
                {'name':'Счета', 'url':'#/accounts'},
                {name:'Статистика', 'url':'#/stats'},
                {name:'Транзакции', 'url':'#/transactions'},
                {name:'Настройки', 'url':'#/settings'}
                ];
    $scope.path = function() {
            return '#'+$location.path();
        }
}

function MyCtrl1() {}
MyCtrl1.$inject = [];


function MyCtrl2() {
}
MyCtrl2.$inject = [];
