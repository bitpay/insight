'use strict';

angular.module('insight.system').controller('HeaderController',
  function($scope, $rootScope, $uibModal, getSocket, Global, Block, Status) {
    $scope.global = Global;

    // This allow us to do crafted logic by the network, such can be seen in BlockHash.test().
    $rootScope.network = 'testnet';
    Status.get({},
      function(status) {
        $rootScope.network = status.info && status.info.network || 'testnet';
    });

    $rootScope.currency = {
      factor: 1,
      bitstamp: 0,
      symbol: 'DASH'
    };

    $scope.menu = [{
      'title': 'Blocks',
      'link': 'blocks'
    }, {
      'title': 'Status',
      'link': 'status'
    }];

    $scope.openScannerModal = function() {
      var modalInstance = $uibModal.open({
        templateUrl: 'scannerModal.html',
        controller: 'ScannerController'
      });
    };

    var _getBlock = function(hash) {
      Block.get({
        blockHash: hash
      }, function(res) {
        $scope.totalBlocks = res.height;
      });
    };

    var socket = getSocket($scope);
    socket.on('connect', function() {
      socket.emit('subscribe', 'inv');

      socket.on('block', function(block) {
        var blockHash = block.toString();
        _getBlock(blockHash);
      });
    });

    $rootScope.isCollapsed = true;
  });
