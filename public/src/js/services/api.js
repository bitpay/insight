'use strict';

angular.module('insight.api')
  .factory('Api',
    function() {
      return {
        apiPrefix: 'http://localhost:3001/api'
      }
    });
