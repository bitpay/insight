'use strict';

module.exports = {
  db: 'mongodb://localhost/insight-test',
  app: {
    name: 'Insight - Prod'
  },
  port: '3301',
  bitcoind: {
    protocol:  process.env.BITCOIND_PROTO  ||  'http',
    user: process.env.BITCOIND_USER  || 'user',
    pass: process.env.BITCOIND_PASS  || 'pass',
    host: process.env.BITCOIND_HOST  || '127.0.0.1',
    port: process.env.BITCOIND_PORT  || '18332',
    p2p_port: process.env.BITCOIND_P2P_PORT  || '18333',
    disableAgent: true,
 
  },
  network: 'testnet',
};
