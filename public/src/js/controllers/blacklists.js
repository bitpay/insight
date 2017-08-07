'use strict';

angular.module('insight.blacklists').controller('BlacklistsController',
    function ($scope, $rootScope, $routeParams, BlacklistService) {
        // $scope.global = Global;
        // $scope.loading = false;

        console.log("blacklists controller start");

        $scope.blacklists = BlacklistService.list();
        $scope.bedit = true;

        $scope.saveBlacklist = function () {
            $scope.addBlackBtn = !$scope.addBlackBtn;
            BlacklistService.save($scope.newblacklist);
            $scope.newblacklist = {};
            $scope.bedit = true;
        };

        $scope.delete = function (id) {
            if ($scope.newblacklist.id == id) $scope.newblacklist = {};
            BlacklistService.delete(id);
            $scope.bedit = true;
            $scope.blacklists = BlacklistService.list();
            console.log("after dellete list=",$scope.blacklists);
        };

        $scope.edit = function (id) {
            $scope.newblacklist = angular.copy(BlacklistService.get(id));
            $scope.bedit = false;
            $scope.blacklists = BlacklistService.list();
            console.log("after edit list=",$scope.blacklists);
        };

        $scope.params = $routeParams;

    });
