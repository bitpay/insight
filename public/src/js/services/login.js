'use strict';

angular.module('insight.login').factory('Account', function () {
    var authService = {
        userId:1,
        name:"admin",
        password:123456,
        phone:13645784152,
        message:"test messafe"
    };

    signIn = function (user) {
        if(user.name=="admin"&&user.password==123456){
            return authService;
        }else{

        }
        /*return $http
            .post('/login', credentials)
            .then(function (res) {
                Session.create(res.data.id, res.data.user.id,
                    res.data.user.role);
                return res.data.user;
            });*/
    };
});