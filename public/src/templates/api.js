'use strict';

angular.module('insight.api')
  .factory('Service',
    function() {
      return {
        apiPrefix: '/BITCORE_SERVICE_PREFIX'
      }
    })
  .factory('Api',
    function() {
      return {
        apiPrefix: '/INSIGHT_API_PREFIX'
      }
    });
