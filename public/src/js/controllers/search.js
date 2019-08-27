'use strict';
// var isValidBlockHash = require('../utils/isValidBlockHash');
// var isValidAddress = require('../utils/isValidAddress');
// var isValidTransactionHash = require('../utils/isValidTransactionHash');
angular.module('insight.search')
  .controller('SearchController',
    function ($scope, $routeParams, $location, $timeout, Global, Block, Transaction, Address, BlockHashValidator, TransactionHashValidator, AddressValidator, BlockByHeight) {
      $scope.global = Global;
      $scope.loading = false;

      var _badQuery = function () {
        $scope.badQuery = true;

        $timeout(function () {
          $scope.badQuery = false;
        }, 2000);
      };

      var _resetSearch = function () {
        $scope.q = '';
        $scope.loading = false;
      };

      $scope.search = function () {
        var q = $scope.q;
        console.log('$scope.search - scope.q', $scope.q);
        console.log('$scope.search - scope', $scope);
        $scope.badQuery = false;
        $scope.loading = true;

        var isBlockHeight = isFinite(q);
        var isBlockHash = BlockHashValidator.test(q);
        var isTransactionHash = TransactionHashValidator.test(q);
        var isAddress = AddressValidator.test(q);

        var badQueryLoadHandler = function () {
          $scope.loading = false;
          _badQuery();
        };
        if (isBlockHeight) {
          BlockByHeight.get({
            blockHeight: q
          }, function (hash) {
            _resetSearch();
            $location.path('/block/' + hash.blockHash);
          }, badQueryLoadHandler);
        } else if (isAddress) {
          Address.get({
            addrStr: q
          }, function () {
            _resetSearch();
            $location.path('address/' + q);
          }, badQueryLoadHandler);

        } else if (isBlockHash) {
          Block.get({
            blockHash: q
          }, function () {
            _resetSearch();
            $location.path('/block/' + q);
          }, badQueryLoadHandler);
        } else if (isTransactionHash) {
          Transaction.get({
            txId: q
          }, function () {
            _resetSearch();
            $location.path('/tx/' + q);
          }, badQueryLoadHandler);
        } else {
          console.log('Query not identified');
          console.log(q);
          badQueryLoadHandler();
        }
      };

    });
