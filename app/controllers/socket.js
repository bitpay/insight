'use strict';

// server-side socket behaviour
// io is a variable already taken in express
var ios = null;

module.exports.init = function(app, io_ext) {
  ios = io_ext;
  ios.set('log level', 1); // reduce logging
  ios.sockets.on('connection', function(socket) {
    socket.on('subscribe', function(topic) {
      socket.join(topic);
    });
  });
};

module.exports.broadcast_tx = function(tx) {
  if (ios) ios.sockets.in('inv').emit('tx', tx);
};

module.exports.broadcast_block = function(block) {
  if (ios) ios.sockets.in('inv').emit('block', block);
};

module.exports.broadcast_address_tx = function(address, tx) {
 if (ios) ios.sockets.in(address).emit(address, tx);
};

module.exports.broadcastSyncInfo = function(historicSync) {
 if (ios)  ios.sockets.in('sync').emit('status', historicSync);
};
