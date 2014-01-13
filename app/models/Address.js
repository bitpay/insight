'use strict';

require('classtool');


function spec() {
  var async           = require('async');
  var TransactionItem = require('./TransactionItem');
  var BitcoreAddress  = require('bitcore/Address').class();
  var BitcoreUtil     = require('bitcore/util/util');

  function Address(addrStr) {
    this.balanceSat        = 0;
    this.totalReceivedSat  = 0;
    this.totalSentSat      = 0;
    this.txApperances   = 0;

    // TODO store only txids? +index? +all?
    this.transactions   = [];

    var a = new BitcoreAddress(addrStr);
    try {
      a.validate();
      this.addrStr        = addrStr;
    } catch(e){
    }
  }


  Address.prototype.__defineGetter__('balance', function(){

console.log('#################### '+this.balanceSat);


    return this.balanceSat / BitcoreUtil.COIN;
  });

  Address.prototype.update = function(next) {

    if (! this.addrStr) {
      return next(new Error('Invalid or undefined address string'));
    }

    var that = this;
    async.series([
      // TODO TXout!
      //T
      function (cb) {
        TransactionItem.find({addr:that.addrStr}, function(err,txItems){
          if (err) return cb(err);

          txItems.forEach(function(txItem){

 // console.log(txItem.txid + ' : ' + txItem.value_sat);
            that.txApperances +=1;
            that.balanceSat += txItem.value_sat;

            that.transactions.push(txItem.txid);

            if (txItem.value_sat > 0)
              that.totalSentSat += txItem.value_sat;
            else
              that.totalReceivedSat += Math.abs(txItem.value_sat);
          });
          return cb();
        });
      }
    ], function (err) {
      return next(err);
    });
  };

  return Address;
}
module.defineClass(spec);


/**
 * Addr Schema Idea for moogose. Not used now.
 *
var AddressSchema = new Schema({

  // For now we keep this as short as possible
  // More fields will be propably added as we move
  // forward with the UX
  addr: {
    type: String,
    index: true,
    unique: true,
  },
  inputs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TransactionItem' //Edit: I'd put the schema. Silly me.
  }],
  output: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TransactionItem' //Edit: I'd put the schema. Silly me.
  }],
});


AddressSchema.statics.load = function(id, cb) {
  this.findOne({
    _id: id
  }).exec(cb);
};


AddressSchema.statics.fromAddr = function(hash, cb) {
  this.findOne({
    hash: hash,
  }).exec(cb);
};


AddressSchema.statics.fromAddrWithInfo = function(hash, cb) {
  this.fromHash(hash, function(err, addr) {
    if (err) return cb(err);
    if (!addr) { return cb(new Error('Addr not found')); }
// TODO
//    addr.getInfo(function(err) { return cb(err,addr); } );
  });
};

module.exports = mongoose.model('Address', AddressSchema);
*/

