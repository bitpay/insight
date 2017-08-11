'use strict';

angular.module('insight.history').controller('HistoryController',
  function ($scope, $rootScope, $routeParams, HistoryService) {
    console.log("historys controller start");

    // $scope.historys = HistoryService.list();
    $scope.list = function () {
      HistoryService.get({}, function (res) {
        console.log('res', res)
        if (res.code === 0) {
          $scope.histories = res.data;
        }
      });
    }
    $scope.list();

    $scope.params = $routeParams;

  });
