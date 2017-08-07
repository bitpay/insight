'use strict';

angular.module('insight.blacklists')
    .factory('BlacklistService',
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
            };

            //to create unique blacklist id
            var uid = 1;

            //blacklists array to hold list of all blacklists
            var blacklists = [];

            //save method create a new blacklist if not already exists
            //else update the existing object
            service.save = function (blacklist) {
                if (blacklist.id == null) {
                    //if this blacklist already in the list, ignore it.
                    for (i in blacklists) {
                        if (blacklists[i].addr == blacklist.addr) {
                            return;
                        }
                    }
                    //if this is new blacklist, add it in blacklists array
                    blacklist.id = uid++;
                    blacklist.time = new Date();
                    blacklists.push(blacklist);
                } else {
                    //for existing blacklist, find this blacklist using id
                    //and update it.
                    for (i in blacklists) {
                        if (blacklists[i].id == blacklist.id) {
                            blacklist.time = new Date();
                            blacklists[i] = blacklist;
                        }
                    }
                }

            };

            //simply search blacklists list for given id
            //and returns the blacklist object if found
            service.get = function (id) {
                for (i in blacklists) {
                    if (blacklists[i].id == id) {
                        return blacklists[i];
                    }
                }

            };

            //iterate through blacklists list and delete 
            //blacklist if found
            service.delete = function (id) {
                for (i in blacklists) {
                    if (blacklists[i].id == id) {
                        blacklists.splice(i, 1);
                    }

                    if (blacklists[i].id > id) {
                        blacklists[i].id = blacklists[i].id-1;
                    }
                }
                uid--;
            };

            //simply returns the blacklists list
            service.list = function () {
                return blacklists;
            };

            return service;
        });
