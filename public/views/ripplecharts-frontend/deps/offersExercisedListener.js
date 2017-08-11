/* eslint semi: 0, no-extra-semi: 0 */
'use strict'
/**
 *  HOW-TO use this script...
 *
 *  Load it in Node.js or on a webpage after loading its dependencies.
 *  Then, initialize an OffersExercisedListener with (pretty much) the
 *  same options you use to query the offersExercised API route.
 *
 *  If you query the API route again with different options and want the
 *  OffersExercisedListener to be updated accordingly, simply call
 *  the instance's updateViewOpts() method with the new options.
 *
 *  To use multiple OffersExercisedListeners on a single page, simply
 *  initialize one instance per option set, save a reference to each,
 *  and call the stopListener() function for any that you wish to remove.
 *
 *  To create an OffersExercisedListener that listens for all offers exercised,
 *  intitialize one with no view options and it will call the display function
 *  each time it hears an offer exercised.
 */

/**
 *  createOffersExercisedListener listens to the live transaction feed,
 *  parses offersExercised events, and passes the parsed data to the
 *  given displayFn
 *
 *  Available options include:
 *  {
 *    base: {currency: 'XRP'},
 *    trade: {currency: 'USD', issuer: 'rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B'},
 *
 *    reduce: true/false, // optional, defaults to false if timeIncrement
        is not set
 *    timeIncrement: (any of the following: 'all', 'none', 'year', 'month',
        'day', 'hour', 'minute', 'second') // optional
 *    timeMultiple: positive integer // optional, defaults to 1
 *
 *    openTime: a momentjs-readable value // optional, defaults to now
 *    incompleteApiRow: if the last timeIncrement returned by the API is
 *    incomplete, that row can be passed in here to be completed by
 *    the live feed listener
 *  }
 */

/**
 * formatReduceResult
 */

function formatReduceResult(result) {
  return {
    startTime: result.startTime,
    openTime: result.openTime === Infinity ?
      null : moment.unix(result.openTime).format(),
    closeTime: result.closeTime ?
      moment.unix(result.closeTime).format() : null,
    baseVolume: result.curr1Volume,
    counterVolume: result.curr2Volume,
    count: result.numTrades,
    open: result.open,
    close: result.close,
    high: result.high,
    low: result.low,
    vwap: result.volumeWeightedAvg
  }
}

/**
 *  offersExercisedReduce
 */

function offersExercisedReduce(values, rereduce) {
  var stats

  if (!rereduce) {

    var firstTime = values[0][7] // unix timestamp
    var firstPrice = values[0][2] // exchange rate

    // initial values
    stats = {
      openTime: firstTime,
      closeTime: firstTime,

      open: firstPrice,
      close: firstPrice,
      high: firstPrice,
      low: firstPrice,

      curr1Volume: 0,
      curr2Volume: 0,
      numTrades: 0
    }

    values.forEach(function(trade) {
      var time = trade[7] // unix timestamp
      var price = trade[2] // exchange rate

      if (time < stats.openTime) {
        stats.openTime = time
        stats.open = price
      }

      if (stats.closeTime < time) {
        stats.closeTime = time
        stats.close = price
      }

      if (price > stats.high) {
        stats.high = price
      }

      if (price < stats.low) {
        stats.low = price
      }

      stats.curr1Volume += trade[0]
      stats.curr2Volume += trade[1]
      stats.numTrades++
    })

    stats.volumeWeightedAvg = stats.curr2Volume / stats.curr1Volume
    return stats

  } else {
    stats = values[0]
    if (typeof stats.openTime === 'string') {
      stats.openTime = moment.utc(stats.openTime).unix()
    }

    if (typeof stats.closeTime === 'string') {
      stats.closeTime = moment.utc(stats.closeTime).unix()
    }

    values.forEach(function(segment, index) {
      // skip values[0]
      if (index === 0) {
        return
      }

      if (typeof segment.openTime === 'string') {
        segment.openTime = moment.utc(segment.openTime).unix()
      }

      if (typeof segment.closeTime === 'string') {
        segment.closeTime = moment.utc(segment.closeTime).unix()
      }


      if (!stats.open || segment.openTime < stats.openTime) {
        stats.openTime = segment.openTime
        stats.open = segment.open
      }
      if (!stats.close || stats.closeTime < segment.closeTime) {
        stats.closeTime = segment.closeTime
        stats.close = segment.close
      }

      if (!stats.high || segment.high > stats.high) {
        stats.high = segment.high
      }

      if (!stats.low || segment.low < stats.low) {
        stats.low = segment.low
      }

      stats.curr1Volume += segment.curr1Volume
      stats.curr2Volume += segment.curr2Volume
      stats.numTrades += segment.numTrades
    })

    stats.volumeWeightedAvg = stats.curr2Volume / stats.curr1Volume
    return stats
  }
}


/**
 *  offersExercisedMap is, with three exceptions, the same as the
 *  map function used in the CouchDB view offersExercised
 *
 *  the only exceptions are 'emit' as a parameter, emit only
 *  being called once, and the line that parses the exchange_rate
 */

function offersExercisedMap(doc, emit) {
  var unix = moment.utc(doc.close_time_timestamp).unix()

  doc.transactions.forEach(function(tx) {
    if (tx.metaData.TransactionResult !== 'tesSUCCESS') {
      return
    }

    if (tx.TransactionType !== 'Payment' &&
        tx.TransactionType !== 'OfferCreate') {
      return
    }

    tx.metaData.AffectedNodes.forEach(function(affNode) {
      var node = affNode.ModifiedNode || affNode.DeletedNode

      if (!node || node.LedgerEntryType !== 'Offer') {
        return
      }

      if (!node.PreviousFields ||
          !node.PreviousFields.TakerPays ||
          !node.PreviousFields.TakerGets) {
        return
      }

      var counterparty = node.FinalFields.Account
      var exchangeRate
      var payCurr
      var payAmnt
      var getCurr
      var getAmnt

      if (typeof node.PreviousFields.TakerPays === 'object') {
        payCurr = [
          node.PreviousFields.TakerPays.currency,
          node.PreviousFields.TakerPays.issuer
        ]
        payAmnt = node.PreviousFields.TakerPays.value -
          node.FinalFields.TakerPays.value

      } else {
        payCurr = ['XRP']
        payAmnt = (node.PreviousFields.TakerPays -
                   node.FinalFields.TakerPays) / 1000000.0
      }

      if (typeof node.PreviousFields.TakerGets === 'object') {
        getCurr = [
          node.PreviousFields.TakerGets.currency,
          node.PreviousFields.TakerGets.issuer
        ]

        getAmnt = node.PreviousFields.TakerGets.value -
          node.FinalFields.TakerGets.value
      } else {
        getCurr = ['XRP']
        getAmnt = (node.PreviousFields.TakerGets -
          node.FinalFields.TakerGets) / 1000000.0
      }

      exchangeRate = getAmnt / payAmnt

      emit([payCurr, getCurr], [
        payAmnt, // base amount
        getAmnt, // counter amount
        exchangeRate, // rate
        tx.Account, // taker
        counterparty, // provider
        counterparty, // buyer
        tx.Account, // seller
        unix, // time
        tx.hash
      ])
    })
  })
}

/**
 *  createTxProcessor
 */

function createTxProcessor(viewOpts, resultHandler) {

  function txProcessor(txData) {

    var txContainer = {
      close_time_timestamp: (new Date()).getTime(),
      transactions: [txData.transaction]
    }

    txContainer.transactions[0].metaData = txData.meta

    // use the map function to parse txContainer data
    offersExercisedMap(txContainer, function(k, v) {
      var key = k
      var value = v

      if (viewOpts.counter) {
        // return if trade doesn't match either currency in the pair
        if ((viewOpts.counter.currency !== k[0][0] ||
             viewOpts.counter.issuer !== k[0][1]) &&
            (viewOpts.counter.currency !== k[1][0] ||
             viewOpts.counter.issuer !== k[1][1])) {
          return
        }
      }

      if (viewOpts.base) {
        // return if base doesn't match either currency in the pair
        if ((viewOpts.base.currency !== k[0][0] ||
             viewOpts.base.issuer !== k[0][1]) &&
            (viewOpts.base.currency !== k[1][0] ||
             viewOpts.base.issuer !== k[1][1])) {
          return
        }
      }

      // Flip the currencies if necessary
      if (viewOpts.base.currency === k[1][0] &&
          viewOpts.base.issuer === k[1][1]) {
        key = [k[1], k[0]]
        value = [
          v[1], // base amount
          v[0], // counter amount
          1 / v[2], // rate
          v[3], // taker
          v[4], // provider
          v[6], // buyer
          v[5], // seller
          v[7], // time
          v[8]  // hash
        ]
      }

      if (!viewOpts.reduce) {
        resultHandler({
          key: key,
          value: value
        })

      } else {
        resultHandler(offersExercisedReduce([value], false))
      }
    })
  }

  return txProcessor
}

/**
 * offersExercisedListener
 */

function OffersExercisedListener(opts, displayFn) {
  var self = this

  self.displayFn = displayFn

  // Wrapper to call the displayFn and update the openTime and closeTime
  self.finishedInterval = function() {

    // send to display
    self.displayFn(formatReduceResult(self.storedResults), true)

    // reset the stored results
    var startTime = moment.utc(self.storedResults.startTime)
      .add(self.viewOpts.timeMultiple, self.viewOpts.timeIncrement)
    self.resetStored([startTime.format()])
  }

  // setup this instance based on the given opts
  self.updateViewOpts(opts)
};

/**
 *  updateViewOpts updates the viewOpts, resets the stored results
 *  and resets the txProcessor and transaction listener
 */

OffersExercisedListener.prototype.updateViewOpts = function(newOpts) {
  var self = this

  function setNext() {
    self.interval = setInterval(function() {
      self.finishedInterval()
    },
    moment.duration(self.viewOpts.timeMultiple,
                    self.viewOpts.timeIncrement)
    .asMilliseconds())
  }

  function subscribe() {
    var request = {
      command: 'subscribe',
      streams: ['transactions']
    }

    return remote.connection.request(request)
  }

  function parseViewOpts(opts) {
    // TODO validate opts more thoroughly

    opts.openTime = moment.utc(opts.openTime).toArray().slice(0, 6)

    if (opts.timeIncrement) {
      opts.reduce = true

      if (!opts.timeMultiple) {
        opts.timeMultiple = 1
      }
    }

    if (!opts.base || !opts.counter) {
      opts.reduce = false

    } else if (opts.base && opts.base.issuer === '') {
      delete opts.base.issuer

    } else if (opts.counter && opts.counter.issuer === '') {
      delete opts.counter.issuer
    }

    return opts
  }

  function update() {
    self.stopListener()
    self.viewOpts = parseViewOpts(newOpts)

    // If timeIncrement is set, setup an interval to call the displayFn,
    // otherwise, pass the displayFn directly to createTxProcessor()
    if (!self.viewOpts.timeIncrement) {
      self.txProcessor = createTxProcessor(self.viewOpts,
                                               self.displayFn)

    } else {

      // if there isnt a row, start time will be set to now
      self.resetStored(self.viewOpts.incompleteApiRow || [])

      // create regular listener
      self.txProcessor = createTxProcessor(self.viewOpts,
        function(reducedTrade) {
          self.storedResults = offersExercisedReduce([
            self.storedResults,
            reducedTrade
          ], true)

          // Call displayFn every time a new trade comes in,
          // as well as after the interval
          self.displayFn(formatReduceResult(self.storedResults))
        })


      // handle first interval
      var endTime = moment.utc(self.storedResults.startTime)
        .add(self.viewOpts.timeMultiple, self.viewOpts.timeIncrement)
      var remainder = endTime.diff(moment.utc())

      // if its more than 24 days, it will overflow
      // the set timeout function. just assume no one
      // will keep the browser open that long
      if (remainder > 2073600000) {
        return
      }

      // If there is time left in the first timeIncrement, wait until that
      // is finished to start the interval
      if (remainder > 0) {
        self.timeout = setTimeout(function() {
          self.finishedInterval()
          setNext(self)

        }, remainder)

      } else {
        self.finishedInterval()
        setNext()
      }
    }

    // add transaction listener
    remote.connection.on('transaction', self.txProcessor)
  }

  function connect() {
    remote.connect()
    .then(update)
    .then(subscribe)
    .catch(function(e) {
      console.log(e)
      if (e.name === 'DisconnectedError') {
        console.log('attempting reconnect')
        connect()
      }
    })
  }

  connect()
};


OffersExercisedListener.prototype.resetStored = function(d, merge) {

  function formatRow(row) {
    var open = row.openTime || row[9]
    var close = row.closeTime || row[10]

    if (typeof open === 'string') {
      open = moment.utc(open).unix()
    }

    if (typeof close === 'string') {
      close = moment.utc(close).unix()
    }

    return {
      startTime: moment.utc(row.startTime || row.time || row[0]).format(),
      curr1Volume: row.baseVolume || row[1] || 0.0,
      curr2Volume: row.counterVolume || row[2] || 0.0,
      numTrades: row.count || row[3] || 0,
      open: row.open || row[4] || 0.0,
      high: row.high || row[5] || 0.0,
      low: row.low || row[6] || 0.0,
      close: row.close || row[7] || 0.0,
      volumeWeightedAvg: row.vwap || row[8] || 0.0,
      openTime: open || Infinity,
      closeTime: close || 0
    }
  }

  var formattedRow = formatRow(d || [])
  var start = this.storedResults ?
    moment.utc(this.storedResults.startTime) : null

  if (merge &&
      this.storedResults &&
      !start.diff(formattedRow.startTime)) {
    this.storedResults = offersExercisedReduce([
      this.storedResults,
      formattedRow
    ], true)
    // console.log('merged')

  } else if (merge &&
             this.storedResults &&
             start.diff(formattedRow.startTime) > 0) {
    // console.log('older')

  } else {
    this.storedResults = formattedRow
  }

  this.storedResults.curr1VwavNumerator =
    this.storedResults.volumeWeightedAvg * this.storedResults.curr1Volume
};

/**
 *  stopListener resets the OffersExercisedListener
 */


OffersExercisedListener.prototype.stopListener = function() {

  var self = this
  self.storedResults = {}

  if (self.interval) {
    clearInterval(self.interval)
  }

  if (self.timeout) {
    clearTimeout(self.timeout)
  }

  if (self.check) {
    clearInterval(self.check)
  }

  if (self.txProcessor) {
    remote.connection.removeListener('transaction', self.txProcessor)
  }
};


