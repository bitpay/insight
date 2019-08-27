'use strict';

angular.module('insight.address')
  .factory('Address',
    function ($resource) {
      return $resource(window.apiPrefix + '/addr/:addrStr/?noTxList=1', {
        addrStr: '@addStr'
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
  .factory('AddressValidator',
    function () {
      return {
        test: function (addressStr) {

          return /^[XxYy][1-9A-Za-z][^OIl]{20,40}/.test(addressStr);
        }
      };
    });
