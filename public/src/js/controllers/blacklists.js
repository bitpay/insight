'use strict';

angular.module('insight.blacklists').controller('BlacklistsController',
  function ($scope, $rootScope, $routeParams, $http, Service, BlacklistService) {
    // $scope.global = Global;
    // $scope.loading = false;

    console.log("blacklists controller start");

    // $scope.blacklists = BlacklistService.list();
    $scope.list = function () {
      BlacklistService.get({}, function (res) {
        console.log('res', res)
        if (res.code === 0) {
          $scope.blacklists = res.data;
        }
      });
    }
    $scope.list();

    $scope.bedit = true;

    $scope.saveBlacklist = function () {
      // BlacklistService.save($scope.newblacklist);

      // console.log('$scope.newblacklist.addr=',$scope.newblacklist.addr)
      // console.log('$scope.newblacklist.comment=',$scope.newblacklist.comment)

      // console.log($scope.bedit,'SAVE: ',$scope.newblacklist)
      if ($scope.newblacklist === {}
        || $scope.newblacklist === undefined
        || $scope.newblacklist.addr === undefined
        || $scope.newblacklist.addr.length !== 34
      ) {
        $scope.bedit = true;
        return;
      }

      // $scope.status = 'loading';
      if (!$scope.bedit) {
        $http.patch(Service.apiPrefix + '/blacklist/' + $scope.newblacklist.addr,
          $scope.newblacklist)
          .success(function(data, status, headers, config) {
            if (data.code === 0) {
              $scope.list();
            }
            $scope.newblacklist = {}
          })
          .error(function(data, status, headers, config) {
          });

        // console.log("after edit list=", $scope.blacklists);
      } else {
        $http.post(Service.apiPrefix + '/blacklist', $scope.newblacklist)
          .success(function(data, status, headers, config) {
            if (data.code === 0) {
              $scope.list();
            }
            $scope.newblacklist = {}
          })
          .error(function(data, status, headers, config) {
          });
      }

      // $scope.newblacklist = {};
      $scope.bedit = true;
    };

    $scope.delete = function (hash) {
      // console.log('controller,delete hash=', hash)

      // console.log($scope.newblacklist != {})
      // console.log($scope.newblacklist)


      if ($scope.newblacklist != {}
        && $scope.newblacklist !== undefined
        && $scope.newblacklist.addr === hash) {
        $scope.newblacklist = {};
      }
      // BlacklistService.delete(id);
      $http.delete(Service.apiPrefix + '/blacklist/' + hash)
        .success(function(data, status, headers, config) {
          if (data.code === 0) {
            $scope.list();
          }
          $scope.newblacklist = {}
        })
        .error(function(data, status, headers, config) {
        });

      $scope.bedit = true;
      // $scope.blacklists = BlacklistService.list();
      // console.log("after dellete list=", $scope.blacklists);
    };

    // unused
    function parseParams (params) {
      var str = [];
      for (var o in params)
        str.push(encodeURIComponent(o) + "=" + encodeURIComponent(params[o]));
      return str.join("&");
    }

    $scope.edit = function (hash, bz) {
      $scope.newblacklist = {
        addr: hash,
        comment: bz
      };
      $scope.bedit = false;
      // $scope.blacklists = BlacklistService.list();
    };

    $scope.params = $routeParams;

  });
