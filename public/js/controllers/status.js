'use strict';

angular.module('insight.status').controller('StatusController',
function($scope, $routeParams, $location, Global, Status, Sync, get_socket) {
  $scope.global = Global;

  $scope.getStatus = function(q) {
    Status.get({
      q: 'get' + q
    },
    function(d) {
      $scope.loaded = 1;
      angular.extend($scope, d);
    },
    function(e) {
      $scope.error = 'API ERROR: ' + e.data;
    });
  };

  var on_sync_update = function(sync) {
console.log('[status.js.21:sync:]',sync); //TODO
    $scope.sync = sync;
  };

  $scope.getSync = function() {
    Sync.get({},
    function(sync) {
      on_sync_update(sync);
    },
    function(e) {
      var err = 'Could not get sync information' + e.toString();
console.log('[status.js.30:err:]',err); //TODO
      $scope.sync = { error: err };
    });
  };

  var socket = get_socket($scope);
  socket.emit('subscribe', 'sync');
  socket.on('status', function(sync) {
    on_sync_update(sync);
  });

});

