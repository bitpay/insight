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

    // open add dialog----------------------------------------
    $scope.addMode = function () {
      $scope.isAdd = true;
    };

    // click dialog's add btn
    $scope.doAdd = function () {
      if (!$scope.newblacklist || !$scope.newblacklist.addr) {
        $scope.newblacklist = {addr:'please input address'}
      } else if ($scope.newblacklist.addr.length !== 34) {
        // TODO 还需要验证地址的有效性
        $scope.newblacklist.addr = 'invalid address'
      } else {
        $scope.isAdd = false;
        $scope.saveBlacklist($scope.newblacklist);
      }
    };

    // click dialog's cancel btn
    $scope.cancelAdd = function () {
      $scope.newblacklist.addr = ''
      $scope.newblacklist.comment = ''
      $scope.isAdd = false;
    };

    // click edit btn----------------------------------------
    $scope.editMode = function () {
      $scope.bedit = false;
    };

    // open edit dialog
    $scope.openEdit = function (addr, comment) {
      console.log('edit ',addr,'with cmt:',comment);
      $scope.editblacklist = {
        addr: addr,
        comment: comment
      };
      $scope.isEdit = true;
      console.log('edit ',$scope.editblacklist,'with switch:',$scope.isEdit);
    }

    // click dialog edit btn
    $scope.doEdit = function () {
      $scope.saveBlacklist($scope.editblacklist);
      $scope.isEdit = false;
    }

    // click dialog's cancel btn
    $scope.cancelEdit = function () {
      $scope.editblacklist.addr = ''
      $scope.editblacklist.comment = ''
      $scope.isEdit = false;
    };

    // click cancel btn----------------------------------------
    $scope.cancelMode = function () {
      $scope.bedit = true;
    };

    $scope.checked = [];
    $scope.selectAll = function () {
      if (!$scope.select_all) {
        $scope.checked = [];
        angular.forEach($scope.blacklists, function (i) {
          i.checked = true;
          $scope.checked.push(i.addr);
        })
      } else {
        angular.forEach($scope.blacklists, function (i) {
          i.checked = false;
          $scope.checked = [];
        })
      }
      // console.log('Achecked:',$scope.checked);
    };
    $scope.selectOne = function (addr) {
      var index = $scope.checked.indexOf(addr);
      if (index === -1) {
        $scope.checked.push(addr);
      } else if (index !== -1) {
        $scope.checked.splice(index, 1);
      }

      if ($scope.blacklists.length === $scope.checked.length) {
        $scope.select_all = true;
      } else {
        $scope.select_all = false;
      }
      // console.log('1checked:',$scope.checked);
    }

    // click delete btn
    $scope.delMode = function () {
      // console.log('$scope.checked=',$scope.checked)
      if (!$scope.checked || $scope.checked.length === 0) {
        return;
      }
      $scope.isDel = true
    }
    // click dialog delete btn
    $scope.doDel = function (ok) {

      if (!ok) {
        $scope.isDel = false
        return;
      }

      $http.delete(Service.apiPrefix + '/blacklist/list/' + JSON.stringify($scope.checked))
        .success(function(data, status, headers, config) {
          if (data.code === 0) {
            $scope.list();
          }
        })
        .error(function(data, status, headers, config) {
        });

      $scope.isDel = false
    }

    $scope.saveBlacklist = function (blacklist) {
      // BlacklistService.save($scope.newblacklist);

      // console.log('$scope.newblacklist.addr=',$scope.newblacklist.addr)
      // console.log('$scope.newblacklist.comment=',$scope.newblacklist.comment)

      // console.log($scope.bedit,'SAVE: ',$scope.newblacklist)

      // $scope.status = 'loading';
      if (!$scope.bedit) {
        $http.patch(Service.apiPrefix + '/blacklist/' + blacklist.addr,
          blacklist)
          .success(function(data, status, headers, config) {
            if (data.code === 0) {
              $scope.list();
            }
            $scope.editblacklist = {}
          })
          .error(function(data, status, headers, config) {
          });

        // console.log("after edit list=", $scope.blacklists);
      } else {
        $http.post(Service.apiPrefix + '/blacklist', blacklist)
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

    // form delete.(old)
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

    // form eitd.(old)
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
