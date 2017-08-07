'use strict';

angular.module('insight.blacklists').controller('BlacklistsController',
  function($scope, $rootScope, $routeParams, Blacklists) {
  // $scope.global = Global;
  // $scope.loading = false;

      console.log("blacklists controller start");
  $scope.list = function() {
    // $scope.loading = true;

      // $scope.blacklists = [
      //     {
      //         id:11,
      //         addr:"0r935lsfgferogerjgerg43g34",
      //         comment:"这是1的hash",
      //         time: new Date()
      //     },
      //     {
      //         id:12,
      //         addr:"1r935lsfgferogerjgerg43g34",
      //         comment:"这是2的hash",
      //         time: new Date()
      //     },
      // ];
      // Blacklists.setBlacklists();
      $scope.blacklists = Blacklists.getBlacklists();
    //   Blacklists.get({}, function(res) {
    //     // $scope.loading = false;
    //     $scope.blacklists = res.blacklists;
    //       console.log("blacklists controller got");
    //
    //       // $scope.pagination = res.pagination;
    // });
  };

  $scope.params = $routeParams;

});
