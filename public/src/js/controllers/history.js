'use strict';

angular.module('insight.history').controller('HistoryController',
  function ($scope, $rootScope, $routeParams, HistoryService) {
    console.log("historys controller start");

      //Datepicker
      var _formatTimestamp = function (date) {
          var yyyy = date.getUTCFullYear().toString();
          var mm = (date.getUTCMonth() + 1).toString(); // getMonth() is zero-based
          var dd  = date.getUTCDate().toString();

          return yyyy + '-' + (mm[1] ? mm : '0' + mm[0]) + '-' + (dd[1] ? dd : '0' + dd[0]); //padding
      };

      $scope.dateval = _formatTimestamp(new Date());

      $scope.$watch('dt', function(newValue, oldValue) {
          if (newValue !== oldValue) {
              $location.path('/blocks-date/' + _formatTimestamp(newValue));
          }
      });

    // $scope.historys = HistoryService.list();
    $scope.list = function () {
      HistoryService.get({}, function (res) {
        // console.log('tp::',typeof res.data,'res', res.data)
          res = {"code":0,"msg":"Success","data":[{"import_time":"20170811-145006","user":[{"id":"history.blacklist.20170811-145006.muv8WgxDydvKB82JZhLcyX1dsmyAmkFKhR","addr":"muv8WgxDydvKB82JZhLcyX1dsmyAmkFKhR","comment":"nkbjb","txsnum":2,"time":"20170811-145006"}],"txsnum":2},{"import_time":"20170811-145219","user":[{"id":"history.blacklist.20170811-145219.muv8WgxDydvKB82JZhLcyX1dsmyAmkFKhR","addr":"muv8WgxDydvKB82JZhLcyX1dsmyAmkFKhR","comment":"nkbjb","txsnum":2,"time":"20170811-145219"}],"txsnum":2},{"import_time":"20170811-165334","user":[{"id":"history.blacklist.20170811-165334.muv8WgxDydvKB82JZhLcyX1dsmyAmkFKhR","addr":"muv8WgxDydvKB82JZhLcyX1dsmyAmkFKhR","comment":"nkbjb","txsnum":2,"time":"20170811-165334"}],"txsnum":2},{"import_time":"20170811-165341","user":[{"id":"history.blacklist.20170811-165341.muv8WgxDydvKB82JZhLcyX1dsmyAmkFKhR","addr":"muv8WgxDydvKB82JZhLcyX1dsmyAmkFKhR","comment":"nkbjb","txsnum":2,"time":"20170811-165341"}],"txsnum":2},{"import_time":"20170811-183227","user":[{"id":"history.blacklist.20170811-183227.muv8WgxDydvKB82JZhLcyX1dsmyAmkFKhR","addr":"muv8WgxDydvKB82JZhLcyX1dsmyAmkFKhR","comment":"nkbjb","txsnum":2,"time":"20170811-183227"}],"txsnum":2},{"import_time":"20170811-183427","user":[{"id":"history.blacklist.20170811-183427.muv8WgxDydvKB82JZhLcyX1dsmyAmkFKhR","addr":"muv8WgxDydvKB82JZhLcyX1dsmyAmkFKhR","comment":"nkbjb","txsnum":2,"time":"20170811-183427"}],"txsnum":2},{"import_time":"20170811-183627","user":[{"id":"history.blacklist.20170811-183627.muv8WgxDydvKB82JZhLcyX1dsmyAmkFKhR","addr":"muv8WgxDydvKB82JZhLcyX1dsmyAmkFKhR","comment":"nkbjb","txsnum":2,"time":"20170811-183627"}],"txsnum":2},{"import_time":"20170811-183827","user":[{"id":"history.blacklist.20170811-183827.muv8WgxDydvKB82JZhLcyX1dsmyAmkFKhR","addr":"muv8WgxDydvKB82JZhLcyX1dsmyAmkFKhR","comment":"nkbjb","txsnum":2,"time":"20170811-183827"}],"txsnum":2},{"import_time":"20170811-184027","user":[{"id":"history.blacklist.20170811-184027.muv8WgxDydvKB82JZhLcyX1dsmyAmkFKhR","addr":"muv8WgxDydvKB82JZhLcyX1dsmyAmkFKhR","comment":"nkbjb","txsnum":2,"time":"20170811-184027"}],"txsnum":2},{"import_time":"20170811-184227","user":[{"id":"history.blacklist.20170811-184227.muv8WgxDydvKB82JZhLcyX1dsmyAmkFKhR","addr":"muv8WgxDydvKB82JZhLcyX1dsmyAmkFKhR","comment":"nkbjb","txsnum":2,"time":"20170811-184227"}],"txsnum":2},{"import_time":"20170811-184427","user":[{"id":"history.blacklist.20170811-184427.muv8WgxDydvKB82JZhLcyX1dsmyAmkFKhR","addr":"muv8WgxDydvKB82JZhLcyX1dsmyAmkFKhR","comment":"nkbjb","txsnum":2,"time":"20170811-184427"}],"txsnum":2},{"import_time":"20170811-184627","user":[{"id":"history.blacklist.20170811-184627.muv8WgxDydvKB82JZhLcyX1dsmyAmkFKhR","addr":"muv8WgxDydvKB82JZhLcyX1dsmyAmkFKhR","comment":"nkbjb","txsnum":2,"time":"20170811-184627"}],"txsnum":2}]}
        if (res.code === 0) {
          $scope.histories = res.data;
          console.log($scope.histories)
        }
      });
    }
    $scope.list();

    $scope.params = $routeParams;

  });
