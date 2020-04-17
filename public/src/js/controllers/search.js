'use strict';

angular.module('insight.search')
  .controller('SearchController',
    function ($scope, $rootScope, $routeParams, $location, $timeout, Global, Block, Transaction, Address, BlockHashValidator, TransactionHashValidator, AddressValidator, BlockByHeight) {
      $scope.global = Global;
      $scope.loading = false;

      var currentNetwork = $rootScope.network;

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
        var isBlockHash = BlockHashValidator.test(q, currentNetwork);
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
        };
        
        var fetchAndRedirectAddressSearch = function () {
          return Address.get({
            addrStr: q
          }, function () {
            _resetSearch();
            $location.path('address/' + q);
          }, badQueryLoadHandler);
        };

        var fetchAndRedirectBlockSearch = function () {
          return Block.get({
            blockHash: q
          }, function (res) {
            if(res.status === 404){
              return fetchAndRedirectTransactionSearch();
            }
            _resetSearch();
            $location.path('/block/' + q);
          }, badQueryLoadHandler);
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
