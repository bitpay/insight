'use strict';

angular.module('insight.login')
  .factory('Account',
    function ($resource, Service) {
      console.log("Service:", Service.apiPrefix)
      return $resource(Service.apiPrefix + '/user');
    });
