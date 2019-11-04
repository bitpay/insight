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

        var fetchAndRedirectTransactionSearch = function(){
          return Transaction.get({
            txId: q
          }, function () {
            _resetSearch();
            $location.path('/tx/' + q);
          }, badQueryLoadHandler);
        };

        var fetchAndRedirectBlockHeightSearch = function () {
          return BlockByHeight.get({
            blockHeight: q
          }, function (hash) {
            _resetSearch();
            $location.path('/block/' + hash.blockHash);
          }, badQueryLoadHandler);
        }
        var fetchAndRedirectAddressSearch = function () {
          return Address.get({
            addrStr: q
          }, function () {
            _resetSearch();
            $location.path('address/' + q);
          }, badQueryLoadHandler);
        }
        var fetchAndRedirectBlockSearch = function () {
          // Block hashes are identified by expecting 10 trailing zeroes as prefix (see difficulty)
          // If we are in the 1/Inf case of a txhash starting with ten zeroes, we will fallback on tx
          return Block.get({
            blockHash: q
          }, function () {
            _resetSearch();
            $location.path('/block/' + q);
          }, fetchAndRedirectTransactionSearch);
        };

        if (isBlockHeight) {
          fetchAndRedirectBlockHeightSearch();
        } else if (isAddress) {
          fetchAndRedirectAddressSearch();
        } else if (isBlockHash) {
          fetchAndRedirectBlockSearch();
        } else if (isTransactionHash) {
          fetchAndRedirectTransactionSearch();
        } else {
          badQueryLoadHandler();
        }
      };

    });
