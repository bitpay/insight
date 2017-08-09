'use strict';

angular.module('insight.login').controller('loginController',
    function($scope, $rootScope, $routeParams, $location,Account) {
    $scope.isLogin = function () {
        console.log('insight.logi loginController isLogin:', $rootScope.isLogin);
        return $rootScope.isLogin;
    }
//依赖注入的内容 作用域 本地 账户信息 弹出提示 状态值
    $scope.login = function () {
      
       if ($scope.user && $scope.user.name && $scope.user.password) { //如果用户和用户名及密码都是正确的
           $rootScope.isLogin = Account.login($scope.user);
           console.log('login user info:', $scope.user.name,  $scope.user.password);
           if ($rootScope.isLogin) {
               $location.path('/home');
           }
        }
        else {
            //SweetAlert.swal("", "请重新输入用户名或密码", "warning");
        }
    }
})