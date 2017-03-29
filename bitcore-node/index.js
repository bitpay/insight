'use strict';

var BaseService = require('./service');
var inherits = require('util').inherits;
var fs = require('fs');
var pkg = require('../package');

var InsightUI = function(options) {
  BaseService.call(this, options);
  if (typeof options.apiPrefix !== 'undefined') {
    this.apiPrefix = options.apiPrefix;
  } else {
    this.apiPrefix = pkg.insightConfig.apiPrefix;
  }
  if (typeof options.routePrefix !== 'undefined') {
    this.routePrefix = options.routePrefix;
  } else {
    this.routePrefix = pkg.insightConfig.routePrefix;
  }
};

InsightUI.dependencies = ['insight-api'];

inherits(InsightUI, BaseService);

InsightUI.prototype.start = function(callback) {
  this.indexFile = this.filterIndexHTML(fs.readFileSync(__dirname + '/../public/index.html', {encoding: 'utf8'}));
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
      express.static(__dirname + '/../public')(req, res, next);
    }
  });
};

InsightUI.prototype.filterIndexHTML = function(data) {
  if (this.routePrefix) {
    transformed = transformed.replace(/<base href=\"\/\"/, '<base href="/' + this.routePrefix + '/"');
  }

  return transformed;
};

module.exports = InsightUI;
