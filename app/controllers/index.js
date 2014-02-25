'use strict';

var _getVersion = function() {
  var pjson = require('../../package.json');
  return pjson.version;
};

exports.render = function(req, res) {
  var version = _getVersion();
  res.send('insight API v' + version);
};

exports.version = function(req, res) {
  var version = _getVersion();
  res.json({ version: version });
};

