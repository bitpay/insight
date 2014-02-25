'use strict';

var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env,
    db,
    port,
    b_port,
    p2p_port;

if (process.env.INSIGHT_NETWORK === 'livenet') {
  env = 'livenet';
  db = './db';
  port = '3000';
  b_port = '8332';
  p2p_port = '8333';
}
else {
  env = 'testnet';
  db = './db/testnet',
  port = '3001',
  b_port = '18332',
  p2p_port = '18333';
}

switch(process.env.NODE_ENV) {
  case 'production':
    env += '';
    break;
  case 'test':
    env += ' - test environment';
    break;
  default:
    env += ' - development';
    break;
}

var dataDir = process.env.BITCOIND_DATADIR;
var isWin = /^win/.test(process.platform);
var isMac = /^darwin/.test(process.platform);
var isLinux = /^linux/.test(process.platform);
if (!dataDir) {
  if (isWin) dataDir = '%APPDATA%\\Bitcoin\\';
  if (isMac) dataDir = process.env.HOME + '/Library/Application Support/Bitcoin/';
  if (isLinux) dataDir = process.env.HOME + '/.bitcoin/';
}
dataDir += process.env.INSIGHT_NETWORK === 'testnet' ? 'testnet3' : '';

module.exports = {
  root: rootPath,
  appName: 'Insight ' + env,
  apiPrefix: '/api',
  port: port,
  leveldb: db,
  bitcoind: {
    protocol:  process.env.BITCOIND_PROTO || 'http',
    user: process.env.BITCOIND_USER || 'user',
    pass: process.env.BITCOIND_PASS || 'pass',
    host: process.env.BITCOIND_HOST || '127.0.0.1',
    port: b_port,
    p2pPort: p2p_port,
    dataDir: dataDir,
    // DO NOT CHANGE THIS!
    disableAgent: true
  },
  network: process.env.INSIGHT_NETWORK || 'testnet',
  disableP2pSync: false,
  disableHistoricSync: false,
  poolMatchFile: './etc/minersPoolStrings.json',

  // Time to refresh the currency rate. In minutes
  currencyRefresh: 10
  , keys: {
      segmentio: process.env.INSIGHT_SEGMENTIO_KEY
    }
};
