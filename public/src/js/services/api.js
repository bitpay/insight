'use strict';

angular.module('insight.api')
  .factory('Service',
    function() {
      return {
        apiPrefix: '/bitcore-service'
      }
    })
  .factory('Api',
    function() {
      return {
        apiPrefix: '/insight-api'
      }
    });
