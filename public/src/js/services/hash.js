'use strict';

angular.module('insight.hash')
  .factory('HashValidator',
    function () {
      return {
        test64: function (hashStr) {
          return typeof hashStr === 'string' && /^(0x)?[0-9a-f]{64}$/i.test(hashStr);
        },
        test66: function (hashStr) {
          return typeof hashStr === 'string' && /^(0x)?[0-9a-f]{66}$/i.test(hashStr);
        }
      };
    });
