'use strict';

angular.module('insight.blocks')
  .factory('Block',
    function ($resource) {
      return $resource(window.apiPrefix + '/block/:blockHash', {
        blockHash: '@blockHash'
      }, {
        get: {
          method: 'GET',
          interceptor: {
            response: function (res) {
              return res.data;
            },
            responseError: function (res) {
              if (res.status === 404) {
                return res;
              }
            }
          }
        }
      });
    })
  .factory('Blocks',
    function ($resource) {
      return $resource(window.apiPrefix + '/blocks');
    })
  .factory('BlockHashValidator',
    function (HashValidator) {
      return {
        test: function (blockHashStr, network) {
          // Cir. 2014, difficulty implies at least 10 trailing zeroes. See https://github.com/dashevo/insight-ui/pull/52
          // On testnet, we still keep it at 4 (a single micro aws achieves it)
          var expectedBlockHashTrailingZeroes = (network==='testnet' || network === undefined) ? '0000' : '0000000000';
          return HashValidator.test64(blockHashStr) && blockHashStr.startsWith(expectedBlockHashTrailingZeroes) ||
            (HashValidator.test66(blockHashStr) && blockHashStr.startsWith('0x'+expectedBlockHashTrailingZeroes));
        }
      };
    })
  .factory('BlockByHeight',
    function ($resource) {
      return $resource(window.apiPrefix + '/block-index/:blockHeight');
    });
