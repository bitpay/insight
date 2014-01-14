'use strict';

require('classtool');


function spec() {
  var mongoose        = require('mongoose');
  var util            = require('util');
  var RpcClient       = require('bitcore/RpcClient').class();
  var networks        = require('bitcore/networks');
  var async           = require('async');
  var config          = require('../config/config');
  var Block           = require('../app/models/Block');
  var Transaction     = require('../app/models/Transaction');
  var TransactionItem = require('../app/models/TransactionItem');
  var CONCURRENCY     = 1;

  function Sync(config) {
    this.tx_count   =0;
    this.network = config.networkName === 'testnet' ? networks.testnet: networks.livenet;
  }

  var progress_bar = function(string, current, total) {
    console.log(util.format('\t%s %d/%d [%d%%]', string, current, total, parseInt(100 * current / total)));
  };

  Sync.prototype.getNextBlock = function(blockHash, cb) {
    var that = this;
    if (!blockHash) {
      return cb();
    }
    this.rpc.getBlock(blockHash, function(err, blockInfo) {
      if (err) return cb(err);
      if (blockInfo.result.height % 1000 === 0) {
        var h = blockInfo.result.height,
        d = blockInfo.result.confirmations;
        progress_bar(util.format('Height [txs:%d]',that.tx_count), h, h + d);
      }

      that.storeBlock(blockInfo.result, function(err, existed) {
          
        if (!err) {
          var txs = blockInfo.result.tx;
          that.storeTxs(txs, function(err) {
            if (!err) 
              return that.getNextBlock(blockInfo.result.nextblockhash, cb);
          });
        }
        else {
          if (err.toString().match(/E11000/)) 
            return that.getNextBlock(blockInfo.result.nextblockhash, cb);
          else 
            return cb(err);
        }
      });
    });
  };

  Sync.prototype.storeBlock = function(block, cb) {
    Block.create(block, cb);
  };

  Sync.prototype.storeTxs = function(txids, cb) {
    var that=this;
    Transaction.createFromArray(txids, function(err) {
      if (err) return cb(err);

      async.forEachLimit(txids, CONCURRENCY, function(txid, next) {

        // This will trigger an RPC call
        Transaction.explodeTransactionItems( txid, function(err) {
          that.tx_count++;
          next(err);
        });
      },
      function(err) {
        return cb();
      });
    });
  };

  Sync.prototype.syncBlocks = function( cb) {
    var that = this;
    var genesisHash = this.network.genesisBlock.hash.reverse().toString('hex');

    console.log('Syncing Blocks... ' );

    Block.findOne(
    { 'fromP2P':{$in:[null, false]} },
    {},
    {
      sort: {
        'time': - 1
      }
    },
    function(err, block) {
      if (err) return cb(err);

      var nextHash = block && block.hash ? block.hash: genesisHash;

      console.log('\tStarting at hash: ' + nextHash);
      return that.getNextBlock(nextHash, cb);
    });
  };

  // This is not currently used. Transactions are represented by txid only
  // in mongodb
  Sync.prototype.syncTXs = function(cb) {

    var that = this;

    console.log('Syncing TXs...');

    Transaction.find({
      blockhash: null
    },
    function(err, txs) {
      if (err) return cb(err);

      var read = 0;
      var pull = 0;
      var write = 0;
      var total = txs.length;
      console.log('\tneed to pull %d txs', total);

      if (!total) return cb();

      async.each(txs, function(tx, next) {
        if (!tx.txid) {
          console.log('NO TXID skipping...', tx);
          return next();
        }

        if (read++ % 1000 === 0) progress_bar('read', read, total);

        that.rpc.getRawTransaction(tx.txid, 1, function(err, txInfo) {

          if (pull++ % 1000 === 0) progress_bar('\tpull', pull, total);

          if (!err && txInfo) {
            Transaction.update({
              txid: tx.txid
            },
            txInfo.result, function(err) {
              if (err) return next(err);

              if (write++ % 1000 === 0) progress_bar('\t\twrite', write, total);

              return next();
            });
          }
          else return next();
        });
      },
      function(err) {
        if (err) return cb(err);
        return cb(err);
      });
    });
  };


  // Not used
  Sync.prototype.processTXs = function(reindex, cb) {

    var that = this;

    console.log('Syncing TXs...');

    var filter = reindex ? {} : { processed: false } ;

    Transaction.find(filter, function(err, txs) {
      if (err) return cb(err);

      var read = 0,
        pull   = 0,
        proc   = 0,
        total  = txs.length;

      console.log('\tneed to pull %d txs', total);

      if (!total) return cb();


      async.forEachLimit(txs, CONCURRENCY, function(tx, next) {
          if (read++ % 1000 === 0) progress_bar('read', read, total);

          if (!tx.txid) {
            console.log('NO TXID skipping...', tx);
            return next();
          }

          // This will trigger an RPC call
          Transaction.explodeTransactionItems( tx.txid, function(err) {
            if (proc++ % 1000 === 0) progress_bar('\tproc', pull, total);
            next(err);
          });
        },
        cb);
    });
  };

  Sync.prototype.init = function(opts) {
    this.rpc = new RpcClient(config.bitcoind);


    if (!(opts && opts.skip_db_connection)) {
      mongoose.connect(config.db, {server: {auto_reconnect: true}} );
    }

    this.db = mongoose.connection;

    this.db.on('error', function(err) {
        console.log('connection error:' + err);
        moogose.disconnect();
    });

    this.db.on('disconnect', function(err) {
        console.log('disconnect:' + err);
        mongoose.connect(config.db, {server: {auto_reconnect: true}} );
    });


  };

  Sync.prototype.import_history = function(opts, next) {

    var that = this;

    var retry_attemps = 100;
    var retry_secs    = 2;

    this.db.once('open', function() {
      async.series([
      function(cb) {
        if (opts.destroy) {
          console.log('Deleting Blocks...');
          that.db.collections.blocks.drop(cb);
        } else {
          cb();
        }
      },
      function(cb) {
        if (opts.destroy) {
          console.log('Deleting TXs...');
          that.db.collections.transactions.drop(cb);
        } else {
          cb();
        }
      },
      function(cb) {
        if (opts.destroy) {
          console.log('Deleting TXItems...');
          that.db.collections.transactionitems.drop(cb);
        } else {
          cb();
        }
      },
 
      function(cb) {
        function sync() {
          that.syncBlocks( function(err) {


            if (err && err.message.match(/ECONNREFUSED/) && retry_attemps--){
              setTimeout(function() {
                console.log("Retrying in %d secs ", retry_secs);
                sync();
              }, retry_secs * 1000);
            }
            else  
              return next(err); 
          });
        }

        if (!opts.skip_blocks) {
          sync();
        }
      },
/* Exploding happens on block insertion
      function(cb) {
        if (! opts.skip_txs) {
          that.processTXs(opts.reindex, cb);
        }
        else {
          return cb();
        }
      }
*/
/* We dont sync any contents from TXs, only their IDs are stored 
      function(cb) {
        if (! opts.skip_txs) {
          that.syncTXs(opts.reindex, cb);
        }
        else {
          return cb();
        }
      }
*/
      ], function(err) {
          return next(err);
      });
    });
  };

  Sync.prototype.close = function() {
    console.log("closing connection");
    this.db.close();
  };
  return Sync;
}
module.defineClass(spec);

