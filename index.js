'use strict';

var EventEmitter = require('events').EventEmitter;
var inherits = require('util').inherits;
var fs = require('fs');

var InsightUI = function(options) {
  EventEmitter.call(this);
  this.node = options.node;
  this.name = options.name;

  if (typeof options.apiPrefix !== 'undefined') {
    this.apiPrefix = options.apiPrefix;
  } else {
    this.apiPrefix = 'insight-api';
  }
  if (typeof options.routePrefix !== 'undefined') {
    this.routePrefix = options.routePrefix;
  } else {
    this.routePrefix = 'insight';
  }
};

inherits(InsightUI, EventEmitter);

InsightUI.dependencies = ['insight-api'];

InsightUI.prototype.start = function(callback) {
  this.indexFile = this.filterIndexHTML(fs.readFileSync(__dirname + '/public/index.html', {encoding: 'utf8'}));
  setImmediate(callback);
};

InsightUI.prototype.getRoutePrefix = function() {
  return this.routePrefix;
};

InsightUI.prototype.setupRoutes = function(app, express) {
  var self = this;

  app.use('/', function(req, res, next){
    if (req.headers.accept && req.headers.accept.indexOf('text/html') !== -1 &&
      req.headers["X-Requested-With"] !== 'XMLHttpRequest'
    ) {
      res.setHeader('Content-Type', 'text/html');
      res.send(self.indexFile);
    } else {
      express.static(__dirname + '/public')(req, res, next);
    }
  });
};

InsightUI.prototype.filterIndexHTML = function(data) {
  var transformed = data
    .replace(/apiPrefix = '\/api'/, "apiPrefix = '/" + this.apiPrefix + "'");

  if (this.routePrefix) {
    transformed = transformed.replace(/<base href=\"\/\"/, '<base href="/' + this.routePrefix + '/"');
  }

  return transformed;
};

InsightUI.prototype.stop = function(done) {
  setImmediate(done);
};

InsightUI.prototype.getPublishEvents = function() {
  return [];
};

InsightUI.prototype.getAPIMethods = function() {
  return [];
};


module.exports = InsightUI;
