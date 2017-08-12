'use strict';

var TRANSACTION_DISPLAYED = 6;
var BLOCKS_DISPLAYED = 8;

angular.module('insight.system').controller('IndexController',
  function($scope, Global, getSocket, Blocks,Status,TransactionsByBlock) {
    $scope.global = Global;
    var blockHash =[];
    var number = 0;
    var _getBlocks = function() {
      Blocks.get({
        limit: BLOCKS_DISPLAYED
      }, function(res) {
        $scope.blocks = res.blocks;
        res.blocks.forEach(function(block) {
          blockHash.push(block.hash);
        });
        $scope.blocksLength = res.length;
        _getcurData(blockHash);
      });
    };

    var socket = getSocket($scope);

    var _getcurData = function(){
            
        TransactionsByBlock.get({
          block:blockHash[number]
      }, function(data) {
        _loadData(data);
      });
    }
       
    var _loadData=function(data){
      number +=1;

      data.txs.forEach(function(tx) {
        $scope.txs.push(tx);
      });
     if (parseInt($scope.txs.length, 10) >= parseInt(TRANSACTION_DISPLAYED, 10)) {
        $scope.txs = $scope.txs.splice(0, TRANSACTION_DISPLAYED);
      }else{
        _getcurData();
      }
    }


    var _startSocket = function() { 

      //_getcurData();
     /* socket.emit('subscribe', 'inv');
      socket.on('tx', function(tx) {
        $scope.txs.unshift(tx);
        if (parseInt($scope.txs.length, 10) >= parseInt(TRANSACTION_DISPLAYED, 10)) {
          $scope.txs = $scope.txs.splice(0, TRANSACTION_DISPLAYED);
        }
      });

      socket.on('block', function() {
        _getBlocks();
      });*/
    };

    socket.on('connect', function() {
      //_startSocket();
    });



    $scope.humanSince = function(time) {
      var m = moment.unix(time);
      return m.max().fromNow();
    };

    $scope.index = function() {
      _getBlocks();
      _startSocket();
    };

    $scope.txs = [];
    $scope.blocks = [];
  });
