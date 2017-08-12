'use strict';

angular.module('insight.login').controller('loginController',
  function ($scope, $rootScope, $routeParams, $location, Account) {
    console.log('$routeParams=',$routeParams)
    $scope.isLogin = function () {
      console.log('insight.logi loginController isLogin:', $rootScope.isLogin);
      return $rootScope.isLogin;
    }
    //依赖注入的内容 作用域 本地 账户信息 弹出提示 状态值
    $scope.login = function () {

      console.log('login user info:', $scope.user.name, $scope.user.password);
      if ($scope.user && $scope.user.name && $scope.user.password) {
        Account.get({
          name: $scope.user.name,
          password: $scope.user.password
        }, function(res) {
          console.log('res',res)
          $rootScope.isLogin = res.code === 0;
          if ($rootScope.isLogin) {
            $location.path('/home');
          } else {
            $scope.user.name = '';
            $scope.user.password = '';
          }
        });

      }
      else {
        //SweetAlert.swal("", "请重新输入用户名或密码", "warning");
      }
    }
  })