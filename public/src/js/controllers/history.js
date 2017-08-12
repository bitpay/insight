'use strict';

angular.module('insight.history').controller('HistoryController',
  function ($scope, $rootScope, $routeParams, HistoryService) {
    console.log("historys controller start");
    // $scope.historys = HistoryService.list();
    $scope.datashow20170811145006 = true;
    $scope.list = function () {
      HistoryService.get({}, function (res) {
        // console.log('tp::',typeof res.data,'res', res.data)
        if (res.code === 0) {
          //$scope.histories = res.data;
        }
      });
    }
    $scope.list();
    $scope.histories = [
        {
            "import_time":"20170811145006",
            "user":[
                {
                    "id":"history.blacklist.20170811-145006.muv8WgxDydvKB82JZhLcyX1dsmyAmkFKhR",
                    "addr":"muv8WgxDydvKB82JZhLcyX1dsmyAmkFKhR",
                    "comment":"nkbjb",
                    "txsnum":2,
                    "time":"20170811-145006"
                },
                {
                    "id":"history.blacklist.20170811-145219.muv8WgxDydvKB82JZhLcyX1dsmyAmkFKhR",
                    "addr":"muv8WgxDydvKB82JZhLcyX1dsmyAmkFKhR",
                    "comment":"nkbjb",
                    "txsnum":2,
                    "time":"20170811-145219"
                },
                {
                    "id":"history.blacklist.20170811-165334.muv8WgxDydvKB82JZhLcyX1dsmyAmkFKhR",
                    "addr":"muv8WgxDydvKB82JZhLcyX1dsmyAmkFKhR",
                    "comment":"nkbjb",
                    "txsnum":2,
                    "time":"20170811-165334"
                },
                {
                    "id":"history.blacklist.20170811-165341.muv8WgxDydvKB82JZhLcyX1dsmyAmkFKhR",
                    "addr":"muv8WgxDydvKB82JZhLcyX1dsmyAmkFKhR",
                    "comment":"nkbjb",
                    "txsnum":2,
                    "time":"20170811-165341"
                },
                {
                    "id":"history.blacklist.20170811-183227.muv8WgxDydvKB82JZhLcyX1dsmyAmkFKhR",
                    "addr":"muv8WgxDydvKB82JZhLcyX1dsmyAmkFKhR",
                    "comment":"nkbjb",
                    "txsnum":2,
                    "time":"20170811-183227"
                },
                {
                    "id":"history.blacklist.20170811-183427.muv8WgxDydvKB82JZhLcyX1dsmyAmkFKhR",
                    "addr":"muv8WgxDydvKB82JZhLcyX1dsmyAmkFKhR",
                    "comment":"nkbjb",
                    "txsnum":2,
                    "time":"20170811-183427"
                }
            ],
            "txsnum":2,
            "limitpage":5
        },
        {
            "import_time":"20170811183827",
            "user":[
                {
                    "id":"history.blacklist.20170811-183827.muv8WgxDydvKB82JZhLcyX1dsmyAmkFKhR",
                    "addr":"muv8WgxDydvKB82JZhLcyX1dsmyAmkFKhR",
                    "comment":"nkbjb",
                    "txsnum":2,
                    "time":"20170811-183827"
                }, {
                    "id":"history.blacklist.20170811-183827.muv8WgxDydvKB82JZhLcyX1dsmyAmkFKhR",
                    "addr":"muv8WgxDydvKB82JZhLcyX1dsmyAmkFKhR",
                    "comment":"nkbjb",
                    "txsnum":2,
                    "time":"20170811-183827"
                }, {
                    "id":"history.blacklist.20170811-183827.muv8WgxDydvKB82JZhLcyX1dsmyAmkFKhR",
                    "addr":"muv8WgxDydvKB82JZhLcyX1dsmyAmkFKhR",
                    "comment":"nkbjb",
                    "txsnum":2,
                    "time":"20170811-183827"
                }, {
                    "id":"history.blacklist.20170811-183827.muv8WgxDydvKB82JZhLcyX1dsmyAmkFKhR",
                    "addr":"muv8WgxDydvKB82JZhLcyX1dsmyAmkFKhR",
                    "comment":"nkbjb",
                    "txsnum":2,
                    "time":"20170811-183827"
                }, {
                    "id":"history.blacklist.20170811-183827.muv8WgxDydvKB82JZhLcyX1dsmyAmkFKhR",
                    "addr":"muv8WgxDydvKB82JZhLcyX1dsmyAmkFKhR",
                    "comment":"nkbjb",
                    "txsnum":2,
                    "time":"20170811-183827"
                }, {
                    "id":"history.blacklist.20170811-183827.muv8WgxDydvKB82JZhLcyX1dsmyAmkFKhR",
                    "addr":"muv8WgxDydvKB82JZhLcyX1dsmyAmkFKhR",
                    "comment":"nkbjb",
                    "txsnum":2,
                    "time":"20170811-183827"
                }, {
                    "id":"history.blacklist.20170811-183827.muv8WgxDydvKB82JZhLcyX1dsmyAmkFKhR",
                    "addr":"muv8WgxDydvKB82JZhLcyX1dsmyAmkFKhR",
                    "comment":"nkbjb",
                    "txsnum":2,
                    "time":"20170811-183827"
                }, {
                    "id":"history.blacklist.20170811-183827.muv8WgxDydvKB82JZhLcyX1dsmyAmkFKhR",
                    "addr":"muv8WgxDydvKB82JZhLcyX1dsmyAmkFKhR",
                    "comment":"nkbjb",
                    "txsnum":2,
                    "time":"20170811-183827"
                }, {
                    "id":"history.blacklist.20170811-183827.muv8WgxDydvKB82JZhLcyX1dsmyAmkFKhR",
                    "addr":"muv8WgxDydvKB82JZhLcyX1dsmyAmkFKhR",
                    "comment":"nkbjb",
                    "txsnum":2,
                    "time":"20170811-183827"
                }, {
                    "id":"history.blacklist.20170811-183827.muv8WgxDydvKB82JZhLcyX1dsmyAmkFKhR",
                    "addr":"muv8WgxDydvKB82JZhLcyX1dsmyAmkFKhR",
                    "comment":"nkbjb",
                    "txsnum":2,
                    "time":"20170811-183827"
                }
            ],
            "txsnum":2,
            "limitpage":5
        }
    ]

    $scope.histories.forEach(function(history,index){
      $scope["datashow"+history.import_time]=true;
      history.idnum=index;
    })
 $scope.records = [
    "菜鸟教程1",
    "菜鸟教程2",
    "菜鸟教程3",
    "菜鸟教程4",
  ]

    $scope.params = $routeParams;
    $scope.expand = function(showDiv,num,id){
        $scope["datashow"+showDiv] =!$scope["datashow"+showDiv];
        $scope.histories[id].limitpage=num;
    }

    console.log($scope);
  });
