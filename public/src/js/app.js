'use strict';

angular.module('insight',[
  'ngAnimate',
  'ngResource',
  'ngRoute',
  'ngProgress',
  'ui.bootstrap',
  'ui.route',
  'monospaced.qrcode',
  'insight.system',
  'insight.socket',
  'insight.blocks',
  'insight.transactions',
  'insight.address',
  'insight.search',
  'insight.status',
  'insight.connection',
  'insight.currency'
]);

angular.module('insight.system', []);
angular.module('insight.socket', []);
angular.module('insight.blocks', []);
angular.module('insight.transactions', []);
angular.module('insight.address', []);
angular.module('insight.search', []);
angular.module('insight.status', []);
angular.module('insight.connection', []);
angular.module('insight.currency', []);

$(document).on('click', '*[data-action=launch-scanner]', function() {
  $('#scanner-modal').modal();
  $('#reader-div').html5_qrcode(function(data){
    // do something when code is read
    var str = (data.indexOf('bitcoin:') === 0) ? data.substring(8) : data;

    $('#search').val( str );
    $('#search').focus();
    $('#scanner-modal').modal('hide');

    $('form[data-ng-submit="search()"]').submit();

  }, function(error){
    //show read errors 
  }, function(videoError){
    //the video stream could be opened
  });
});
