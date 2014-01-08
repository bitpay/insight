'use strict';

module.exports = function(app) {

  //Home route
  var index = require('../app/controllers/index');
  app.get('/', index.render);

  //Block routes
  var blocks = require('../app/controllers/blocks');
  app.get('/block/:blockHash', blocks.show);
  app.param('blockHash', blocks.block);

  var transactions = require('../app/controllers/transactions');
  app.get('/tx/:txid', transactions.show);
 
  app.param('txid', transactions.transaction);
  
};
