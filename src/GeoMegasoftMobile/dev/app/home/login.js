/* jshint -W098, -W069, -W041 */
(function() {
  'use strict';
  angular.module('starter')
    .controller('LoginCtrl', LoginController);

  LoginController.$inject = ['$scope', '$state', '$timeout', '$stateParams', '$window', '$ionicLoading', 'CordovaNetworkService', '$ionicPopup', '$rootScope', '$http', 'WebAPIurl', 'LoginAPIService'];

  function LoginController($scope, $state, $timeout, $stateParams, $window, $ionicLoading, CordovaNetworkService, $ionicPopup, $rootScope, $http, WebAPIurl, LoginAPIService) {
    var vm = this;
    initVariables();

    function initVariables() {
      vm.someArray = [];
      vm.user = {};
    }

    $scope.$on('$ionicView.loaded', OnViewLoad);
    $scope.$on('$ionicView.beforeEnter', OnBeforeEnter);
    $scope.$on('$ionicView.afterLeave', onAfterLeave);


    function OnViewLoad() {
      //check if already logged in
      //check if has reon
      if($window.localStorage['access_token'] != null && $window.localStorage['access_token'] != undefined){
        $state.go("main.getarea");
      }
    }

    vm.login = function() {
      var user = vm.user.username;
      var pass = vm.user.password;
      if (user != null && user != undefined && pass != null && pass != undefined) {
        LoginAPIService.login(user, pass).then(function() {
          $state.go("main.getarea");
        }, function(error) {
          vm.errors = {
            required: error
          };
        });
      }
    };

    function OnBeforeEnter() {
      if ($stateParams.message != null && $stateParams.message.length > 0) {
        vm.errors = {
          required: "* " + $stateParams.message
        };
      }
    }

    function onAfterLeave() {}

  }
})();
