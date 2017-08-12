'use strict';

angular.module('insight.history')
    .factory('HistoryService',
      function ($resource, Service) {
        console.log("Service:", Service.apiPrefix)
        return $resource(Service.apiPrefix + '/history/histories');
      });
