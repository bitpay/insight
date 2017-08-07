'use strict';


angular.module('insight.blacklists')
    .factory('Blacklists',
        function () {
            console.log("blacklists service start");
            var k = 'blacklist';

            var data = [
                {
                    k: "blacklist.user.1",
                    id: 31,
                    addr: "0r935lsfgferogerjgerg43g34",
                    comment: "这是1的hash",
                    time: new Date()
                },
                {
                    k: "blacklist.user.2",
                    id: 32,
                    addr: "1r935lsfgferogerjgerg43g34",
                    comment: "这是2的hash",
                    time: new Date()
                }
            ];
            var service = {};

            service.getBlacklists = function () {
                // $http.get('js/blacklist.json')
                //     .success(function (Data) {
                //         // $scope.names = Data;
                //         console.info(Data);
                //         return Data;
                //     });
                return data;
                // ldb.find(k, function (key, value) {
                //     if (key === null) {
                //         console.log("find Over @", value, " arr=", blacklists);
                //         return blacklists;
                //     }
                //     if (key.startsWith(k)) {
                //         blacklists.push(JSON.parse(value));
                //     }
                //     // console.log(arr.length, ':find ok: ', arr);
                // });
            };

            service.setBlacklists = function () {
                console.log('Blacklists service set start');
                ldb.put(data[0].k, data[0]);
                ldb.put(data[1].k, data[1]);
            }

            return service;
        });
