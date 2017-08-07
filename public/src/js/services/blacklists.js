'use strict';

angular.module('insight.blacklists')
  .factory('Blacklists',
    function () {
        console.log("blacklists service start");

      var blacklists = [
          {
              id:21,
              addr:"0r935lsfgferogerjgerg43g34",
              comment:"这是1的hash",
              time: new Date()
          },
          {
              id:22,
              addr:"1r935lsfgferogerjgerg43g34",
              comment:"这是2的hash",
              time: new Date()
          }
      ];
      var service = {};

      service.getBlacklists = function() {
          return blacklists;
      }

      return service;
  });
