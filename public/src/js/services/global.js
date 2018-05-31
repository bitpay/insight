'use strict';

//Global service for global variables
angular.module('insight.system')
  .factory('Global',[
    function() {
      return {
        get: function () {
          return null;
        }
      }
    }
  ])
  .factory('Version',
    function($resource) {
      return $resource(window.apiPrefix + '/version');
  });
