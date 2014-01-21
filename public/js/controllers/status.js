'use strict';

angular.module('insight.status').controller('StatusController',
  function ($scope, $routeParams, $location, $rootScope, Global, Status, Sync) {
  $scope.global = Global;

  $scope.getStatus = function(q) {
    Status.get({
     q: 'get' + q
    }, function(d) {
      $rootScope.infoError = null;
      angular.extend($scope, d);
    }, function(e) {
      if (e.status === 503) {
        $rootScope.infoError = 'Backend Error. ' + e.data;
      }
      else {
        $rootScope.infoError = 'Unknown error:' + e.data;
      }
    });
  };

  $scope.getSync = function() {
    Sync.get({}, function(sync) {
      $rootScope.syncError = null;

      if (sync.blocksToSync > sync.syncedBlocks ) {
        sync.message = 'Blocks to sync: ' +  (sync.blocksToSync -  sync.syncedBlocks);
      }
      else {
        sync.message = 'On sync';
      }
      sync.tooltip = 'Skipped blocks:' + sync.skipped_blocks;


      $scope.sync = sync;
    }, function(e) {
      $rootScope.syncError = 'Could not get sync information' + e;
    });
  };
});

