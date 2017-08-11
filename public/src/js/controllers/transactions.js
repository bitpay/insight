'use strict';

angular.module('insight.transactions').controller('transactionsController',
function($scope, $rootScope, $routeParams, $location, Global, Transaction, TransactionsByBlock, TransactionsByAddress) {
  $scope.global = Global;
  $scope.loading = false;
  $scope.loadedBy = null;
  $scope.youShow=true;
  $scope.zuoShow=true;

 
  $scope.searchAddr = "2NCRHyeRjyo1bUiZXLLymapcPxLDrrXY5Gn";

  $scope.searchByAddr = function(){
    $scope.searchAddr = $scope.searchAddr;
     _byAddress();
  }

  $scope.lookTX = function(imgstr){

    console.log(imgstr);
    if(imgstr==="you"){
     $scope.youShow=!$scope.youShow;
    }else if(imgstr==="you-g"){
     $scope.youShow=!$scope.youShow;
    }else if(imgstr==="zuo"){
     $scope.zuoShow=!$scope.zuoShow;
    }else{
     $scope.zuoShow=!$scope.zuoShow;
    }
     $scope.txdirection =imgstr;
     $scope.stime=undefined;
     $scope.txs=[];
     pageNum = 0;
      _byAddress();
  }

/* $scope.searchByDate = function(){
   var date= _formatTimestamp(new Date())+" 00:00:00";
   $scope.stime = Math.round((new Date(date)).getTime()/1000);
   $scope.etime = Math.round((new Date()).getTime()/1000);
    $scope.txs=[];
    pageNum = 0;
    $scope.txdirection=undefined;
    _byAddress();
  }*/

 $scope.$watch('dt', function(newValue, oldValue) {
    if (newValue !== oldValue) {
       $scope.stime = Math.round((new Date(_formatTimestamp(newValue)+" 00:00:00")).getTime()/1000);
       $scope.etime = Math.round((new Date(_formatTimestamp(newValue)+" 23:59:59")).getTime()/1000);
       $scope.txs=[];
       $scope.dateval = _formatTimestamp(newValue);
       console.log($scope.stime,$scope.etime);
       $scope.txdirection=undefined;
       pageNum = 0;
       _byAddress();
    }
  });

  $scope.openCalendar = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened = true;
  };


   //Datepicker
  var _formatTimestamp = function (date) {
    var yyyy = date.getUTCFullYear().toString();
    var mm = (date.getUTCMonth() + 1).toString(); // getMonth() is zero-based
    var dd  = date.getUTCDate().toString();

    return yyyy + '-' + (mm[1] ? mm : '0' + mm[0]) + '-' + (dd[1] ? dd : '0' + dd[0]); //padding
  };

  $scope.dateval = _formatTimestamp(new Date());
  var pageNum = 0;
  var pagesTotal = 1;
  var COIN = 100000000;

  var _aggregateItems = function(items) {
    if (!items) return [];

    var l = items.length;

    var ret = [];
    var tmp = {};
    var u = 0;

    for(var i=0; i < l; i++) {

      var notAddr = false;
      // non standard input
      if (items[i].scriptSig && !items[i].addr) {
        items[i].addr = 'Unparsed address [' + u++ + ']';
        items[i].notAddr = true;
        notAddr = true;
      }

      // non standard output
      if (items[i].scriptPubKey && !items[i].scriptPubKey.addresses) {
        items[i].scriptPubKey.addresses = ['Unparsed address [' + u++ + ']'];
        items[i].notAddr = true;
        notAddr = true;
      }

      // multiple addr at output
      if (items[i].scriptPubKey && items[i].scriptPubKey.addresses.length > 1) {
        items[i].addr = items[i].scriptPubKey.addresses.join(',');
        ret.push(items[i]);
        continue;
      }

      var addr = items[i].addr || (items[i].scriptPubKey && items[i].scriptPubKey.addresses[0]);

      if (!tmp[addr]) {
        tmp[addr] = {};
        tmp[addr].valueSat = 0;
        tmp[addr].count = 0;
        tmp[addr].addr = addr;
        tmp[addr].items = [];
      }
      tmp[addr].isSpent = items[i].spentTxId;

      tmp[addr].doubleSpentTxID = tmp[addr].doubleSpentTxID   || items[i].doubleSpentTxID;
      tmp[addr].doubleSpentIndex = tmp[addr].doubleSpentIndex || items[i].doubleSpentIndex;
      tmp[addr].dbError = tmp[addr].dbError || items[i].dbError;
      tmp[addr].valueSat += Math.round(items[i].value * COIN);
      tmp[addr].items.push(items[i]);
      tmp[addr].notAddr = notAddr;

      if (items[i].unconfirmedInput)
        tmp[addr].unconfirmedInput = true;

      tmp[addr].count++;
    }

    angular.forEach(tmp, function(v) {
      v.value    = v.value || parseInt(v.valueSat) / COIN;
      ret.push(v);
    });
    return ret;
  };

  var _processTX = function(tx) {
    tx.vinSimple = _aggregateItems(tx.vin);
    tx.voutSimple = _aggregateItems(tx.vout);
  };

  var _paginate = function(data) {
    $scope.loading = false;

    pagesTotal = data.pagesTotal;
    pageNum += 1;
    data.txs.forEach(function(tx) {
        _processTX(tx);
        $scope.txs.push(tx);
    });
  };

  var _TxByDate = function(data){
      $scope.loading = false;
      pagesTotal = data.pagesTotal;
      pageNum += 1;
      var txCount = 0;
      data.txs.forEach(function(tx) {
        if(tx.blocktime>$scope.stime&&tx.blocktime<$scope.etime){
              txCount +=1;
              //console.log(JSON.stringify(tx))
              _processTX(tx);
              $scope.txs.push(tx);
          }
      })
      if(txCount<10&&pageNum<Math.round(pagesTotal/10)){
        _byAddress();
      }
  }
  var _Txdirection = function(data){
     var txs= [];
      $scope.loading = false;
      pagesTotal = data.pagesTotal;
      pageNum += 1;
      var txCount = 0;
      var account= $routeParams.addrStr;
      if($scope.txdirection==="you"){
        if(JSON.stringify(tx.vin).indexOf(account) != -1){
          _processTX(tx);
          $scope.txs.push(tx);
        }           
      }else if($scope.txdirection==="zuo"){
         if(JSON.stringify(tx.vout).indexOf(account) != -1){
          _processTX(tx);
          $scope.txs.push(tx);
        }    
      }else{
        _processTX(tx);
        $scope.txs.push(tx);
      }
  }

  var _byBlock = function() {
    TransactionsByBlock.get({
      block: $routeParams.blockHash,
      pageNum: pageNum
    }, function(data) {
      _paginate(data);
    });
  };

  var _byAddress = function () {
    var address = $routeParams.addrStr;
    if(address===undefined){
      address = $scope.searchAddr;
    }
    TransactionsByAddress.get({
      address: address,
      pageNum: pageNum
    }, function(data) {
      if($scope.stime!=undefined||$scope.etime!=undefined){
        _TxByDate(data);
      }else if($scope.txdirection!=undefined){
        _Txdirection(data);
      }else{
        _paginate(data);
      }

    });
  };

  var _findTx = function(txid) {
    Transaction.get({
      txId: txid
    }, function(tx) {
      $rootScope.titleDetail = tx.txid.substring(0,7) + '...';
      $rootScope.flashMessage = null;
      $scope.tx = tx;
      _processTX(tx);
      $scope.txs.unshift(tx);
    }, function(e) {
      if (e.status === 400) {
        $rootScope.flashMessage = 'Invalid Transaction ID: ' + $routeParams.txId;
      }
      else if (e.status === 503) {
        $rootScope.flashMessage = 'Backend Error. ' + e.data;
      }
      else {
        $rootScope.flashMessage = 'Transaction Not Found';
      }

      $location.path('/');
    });
  };

  $scope.findThis = function() {
    _findTx($routeParams.txId);
  };

  //Initial load
  $scope.load = function(from) {
    $scope.loadedBy = from;
    $scope.loadMore();
  };

  //Load more transactions for pagination
  $scope.loadMore = function() {
    if (pageNum < pagesTotal && !$scope.loading) {
      $scope.loading = true;

      if ($scope.loadedBy === 'address') {
        _byAddress();
      }
      else {
        _byBlock();
      }
    }
  };

  // Highlighted txout
  if ($routeParams.v_type == '>' || $routeParams.v_type == '<') {
    $scope.from_vin = $routeParams.v_type == '<' ? true : false;
    $scope.from_vout = $routeParams.v_type == '>' ? true : false;
    $scope.v_index = parseInt($routeParams.v_index);
    $scope.itemsExpanded = true;
  }
  
  //Init without txs
  $scope.txs = [];

  $scope.$on('tx', function(event, txid) {
    _findTx(txid);
  });

});

angular.module('insight.transactions').controller('SendRawTransactionController',
  function($scope, $http, Api) {
  $scope.transaction = '';
  $scope.status = 'ready';  // ready|loading|sent|error
  $scope.txid = '';
  $scope.error = null;

  $scope.formValid = function() {
    return !!$scope.transaction;
  };
  $scope.send = function() {
    var postData = {
      rawtx: $scope.transaction
    };
    $scope.status = 'loading';
    $http.post(Api.apiPrefix + '/tx/send', postData)
      .success(function(data, status, headers, config) {
        if(typeof(data.txid) != 'string') {
          // API returned 200 but the format is not known
          $scope.status = 'error';
          $scope.error = 'The transaction was sent but no transaction id was got back';
          return;
        }

        $scope.status = 'sent';
        $scope.txid = data.txid;
      })
      .error(function(data, status, headers, config) {
        $scope.status = 'error';
        if(data) {
          $scope.error = data;
        } else {
          $scope.error = "No error message given (connection error?)"
        }
      });
  };
});
