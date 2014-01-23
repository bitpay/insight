#! /usr/bin/env node

'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var SYNC_VERSION = '0.1';
var program = require('commander');
var HistoricSync = require('../lib/HistoricSync').class();
var async = require('async');

program
  .version(SYNC_VERSION)
  .option('-N --network [livenet]', 'Set bitcoin network [testnet]', 'testnet')
  .option('-S --smart', 'genesis stored? uptoexisting = 1', 1)
  .option('-D --destroy', 'Remove current DB (and start from there)', 0)
  .option('-R --reverse', 'Sync backwards', 0)
  .option('-U --uptoexisting', 'Sync only until an existing block is found', 0)
  .parse(process.argv);

var historicSync = new HistoricSync({
  networkName: program.network
});

/*  TODO: Sure?
if (program.remove) {

}
*/
async.series([
  function(cb) {
    historicSync.init(program, cb);
  },
  function(cb) {

    if (program.smart) {
      historicSync.smartImport(cb);
    }
    else {
      historicSync.importHistory({
        destroy: program.destroy,
        reverse: program.reverse,
        upToExisting: program.uptoexisting,
      }, cb);
    }
  },
  ],
  function(err) {
    historicSync.close();
    if (err) {
      console.log('CRITICAL ERROR: ', historicSync.info());
    }
    else {
      console.log('Finished.\n Status:\n', historicSync.info());
    }
});

