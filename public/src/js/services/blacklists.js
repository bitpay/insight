'use strict';

angular.module('insight.blacklists')
  .factory('Blacklists',
    function get($resource, Api) {
        console.log("blacklists service start");

        return [
          {
              id:1,
              addr:"0r935lsfgferogerjgerg43g34",
              comment:"这是1的hash",
              time: (new Date().getMilliseconds())
          },
          {
              id:2,
              addr:"1r935lsfgferogerjgerg43g34",
              comment:"这是2的hash",
              time: (new Date().getMilliseconds())
          },
      ];
  });
