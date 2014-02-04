'use strict';

var path = require('path'),
    rootPath = path.normalize(__dirname + '/..');

var INSIGHT_NAME    = 'Insight Development',
    INSIGHT_ENV     = 'dev',
    INSIGHT_PORT    = '3000',
    INSIGHT_NETWORK = 'testnet';

var BITCOIND_PORT   = '18332';

switch(process.env.NODE_ENV) {
  case 'production':
    BITCOIND_PORT = '8333';
    INSIGHT_NAME  = 'Insight';
    INSIGHT_ENV   = 'prod';
    INSIGHT_PORT  = '3000';
  break;
  case 'test':
    INSIGHT_NAME = 'Insight Test';
    INSIGHT_ENV  = 'test';
    INSIGHT_PORT = '3301';
  break;
  default:
    // defined
  break;
}

module.exports = {
  root: rootPath,
  appName: INSIGHT_NAME,
  port: process.env.PORT || INSIGHT_PORT,
  db: 'mongodb://localhost/insight-' + INSIGHT_ENV,
  bitcoind: {
    protocol:  process.env.BITCOIND_PROTO || 'http',
    user: process.env.BITCOIND_USER || 'user',
    pass: process.env.BITCOIND_PASS || 'pass',
    host: process.env.BITCOIND_HOST || '127.0.0.1',
    port: process.env.BITCOIND_PORT || BITCOIND_PORT,
    p2pPort: process.env.BITCOIND_P2P_PORT || '18333',
    dataDir: process.env.BITCOIND_DATADIR || './testnet3',

    // DO NOT CHANGE THIS!
    disableAgent: true
  },
  network: process.env.INSIGHT_NETWORK || INSIGHT_NETWORK,
  disableP2pSync: false,
  disableHistoricSync: false,
};
