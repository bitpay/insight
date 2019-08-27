'use strict';

angular.module('insight.messages').controller('VerifyMessageController',
  function($scope, $http) {
  $scope.message = {
    address: '',
    signature: '',
    message: ''
  };
  $scope.verification = {
    status: 'unverified',  // ready|loading|verified|error
    result: null,
    error: null,
    address: ''
  };

  $scope.verifiable = function() {
    return ($scope.message.address
            && $scope.message.signature
            && $scope.message.message);
  };
  $scope.verify = function() {
    $scope.verification.status = 'loading';
    $scope.verification.address = $scope.message.address;

    var verify = function(data){
      if(typeof(data.data.result) === 'boolean') {
        if(data.data.result){
          $scope.verification.status = 'verified';
          $scope.verification.result = data.data.result;
        }else{
          $scope.verification.status = 'verified';
          $scope.verification.result = false;
        }
      }else {
        // API returned 200 but result was not true or false
        $scope.verification.status = 'error';
        $scope.verification.error = null;
      }
    };

    $http.post(window.apiPrefix + '/messages/verify', $scope.message)
      .then(verify)
      .catch(function(data){
        console.log('c',data);
      });
  };

  // Hide the verify status message on form change
  var unverify = function() {
    $scope.verification.status = 'unverified';
  };
  $scope.$watch('message.address', unverify);
  $scope.$watch('message.signature', unverify);
  $scope.$watch('message.message', unverify);
});
