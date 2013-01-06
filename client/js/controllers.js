'use strict';

/* Controllers */

var update_accounts = [];
var update_categories = [];

function reload_accounts($http) {
    function _reload_accounts() {
            $http({method: 'GET', url: '/api/accounts'}).
              success(function(data, status) {
                for (var i=0; i<update_accounts.length;i++) {
                    update_accounts[i].accounts = data;
                    if (update_accounts[i].account_out == null) {
                        update_accounts[i].account_out = data[0].id;
                    }
                    if (update_accounts[i].account_in == null) {
                        update_accounts[i].account_in = data[0].id;
                    }
                }
              }).
              error(function(data, status) {
            });
    }
    return _reload_accounts;
}

function reload_categories($http, update_current) {
    function _reload_categories() {
        $http({method: 'GET', url: '/api/categories'}).
          success(function(data, status) {
            for (var i=0; i<update_categories.length;i++) {
                update_categories[i].categories_list = data;
                if (update_categories[i].isNullCategory()) {
                    if (update_current) {
                        update_current(update_categories[i]);
                    } else {
                        update_categories[i].category = data[0].id;
                    }
                }
            }
          }).
          error(function(data, status) {
        });
      };
    return _reload_categories;
}

function MenuController($scope, $location) {
    $scope.list = [
                {name:'Счета', url:'#/accounts'},
                {name:'Статистика', url:'#/stats'},
                {name:'Транзакции', url:'#/transactions'},
                {name:'Настройки', url:'#/settings'}
                ];

    $scope.path = function() {
            return '#' + $location.path();
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

    update_accounts.push($scope);
    $scope.reload_accounts = reload_accounts($http);
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


function CategoriesController($scope, $http) {
    $scope.isNullCategory = function() {
        return $scope.category == null;
    }
    
    update_categories.push($scope);
    $scope.reload_categories = reload_categories($http);
    $scope.reload_categories();

    $scope.category_type = "outcome";
    $scope.category_name = '';
    $scope.category_types = [{name:"Расход", value:"outcome"},
                             {name:"Доход", value:"income"}];

    $scope.add = function() {
        var cdata = {name: $scope.category_name,
                     type: $scope.category_type};
        $http({method: 'POST', url: '/api/categories', params: cdata}).
          success(function(data, status) {
            $scope.reload_categories();
            $scope.category_name = '';
          }).
          error(function(data, status) {
        });
    }


    $scope.del = function(id) {
        $http({method: 'DELETE', url: '/api/categories', params: {'id':id}}).
          success(function(data, status) {
            $scope.reload_categories();
          }).
          error(function(data, status) {
        });
    }

}

function AddTransactionWidgetController($scope, $http) {
    $scope.categories_list = [];
    update_accounts.push($scope);
    $scope.reload_accounts = reload_accounts($http);
    $scope.reload_accounts();
    $scope.value = 0;

    $scope.get_categories = function(type) {
        return $scope.categories_list.filter(function(i) {return i.ctype == type});
    }

    $scope.current_type = 'outcome';
    
    $scope.isNullCategory = function() {
        return eval("null==$scope.category_"+$scope.current_type);
    }

    $scope.reset_category = function() {
        if ($scope.get_categories($scope.current_type).length) {
            eval("$scope.category_"+$scope.current_type+ " = $scope.get_categories($scope.current_type)[0].id");
        }
    }
    
    update_categories.push($scope);

    $scope.reload_categories = reload_categories($http, 
        function(scope) {
            if (scope.get_categories(scope.current_type).length) {
                eval("scope.category_"+scope.current_type+ " = scope.get_categories(scope.current_type)[0].id");
                scope.category = null;
            }
        });

    $scope.reload_categories();


    var date = new Date();
    $scope.dateItem = date.getTime();
}

