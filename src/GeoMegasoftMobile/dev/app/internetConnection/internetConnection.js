/* globals _,ionic */
/* jshint -W098 */
(function() {
  'use strict';

  angular.module('starter')
    .controller('InternetConnectionCtrl', InternetConnectionController);

  InternetConnectionController.$inject = ['$log', '$scope', '$interval', '$timeout', '$rootScope', '$q', '$state', '$ionicPopup',  '$ionicHistory', 'CordovaNetworkService'];

  function InternetConnectionController($log, $scope, $interval, $timeout, $rootScope, $q, $state, $ionicPopup,  $ionicHistory, CordovaNetworkService) {
    var vm = this;
    console.log('InternetConnectionController loaded');
    vm.message = "NO INTERNET MESSAGE HERE";
    $scope.$on("$destroy", ViewOnDestroy);
    vm.intervalPromise = undefined;

    function ViewOnDestroy(event) {
      if (vm.intervalPromise !== undefined) {
        $interval.cancel(vm.intervalPromise);
      }
      vm.intervalPromise = undefined;
    }

    $scope.$on('$ionicView.enter', function() {
      vm.intervalPromise = $interval(function() {
        //set interval to try and get content
        CheckInternetConnection();
      }, 4000);
    });

    function CheckInternetConnection() {
      vm.message = "...";
      CordovaNetworkService.isOnline().then(isOnlineSuccess).catch(isOnlineFail);
    }

    function isOnlineFail() {
      vm.message = "PLEASE CONNECT MESSAGE HERE";
    }

    function isOnlineSuccess(isConnected) {
      if (isConnected) {
        vm.message = "...";
        $state.go('main.gotodefault');
      }
    }

  }

})();
