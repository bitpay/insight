'use strict';

angular.module('insight.api')
  .factory('Api',
    function() {
      return {
        prefix: '/insight-api'
      }
    });
