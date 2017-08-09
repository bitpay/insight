'use strict';

angular.module('insight.login')
    .factory('Account', function () {
        var users = [{
            userId: 1,
            name: "admin",
            password: "123456",
            phone: 13645784152,
            message: "test messafe"
        }];

        var service = {};

        service.login = function (user) {
            //if this user already in the list, ignore it.
            for (i in users) {
                // console.log(typeof users[i].name,  typeof user.name);
                if (users[i].name == user.name && users[i].password == user.password) {
                    console.log('login user info OKOKOK:', users[i],user);
                    return true;
                }
            }

            // console.log(typeof users.name,  typeof user.name);
            // if (users[i].name == user.name && users[i].password == user.password) {
            //     console.log('login user info OKOKOK:', users[i],user);
            //     return true;
            // }
            return false;
        };

        return service;

    });