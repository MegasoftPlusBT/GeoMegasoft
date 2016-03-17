/* globals _,ionic */
/* jshint -W098 */
(function() {
  'use strict';

  angular.module('starter')
    .controller('MainCtrl', MainController);

  MainController.$inject = ['$log', '$scope', '$interval', '$timeout', '$rootScope', '$q', '$state', '$ionicPopup', '$ionicHistory', '$window'];

  function MainController($log, $scope, $interval, $timeout, $rootScope, $q, $state, $ionicPopup, $ionicHistory, $window) {
    var mainVm = this;
    mainVm.logo = '';

    $scope.$on("$destroy", ViewOnDestroy);

    function ViewOnDestroy(event) {

    }

    mainVm.navigateToState = function(name, params) {
      if (name === "main.home") {
        $ionicHistory.nextViewOptions({
          disableBack: true
        });
      } else {
        $ionicHistory.nextViewOptions({
          disableBack: false
        });
      }
      $state.go(name, params);
    };


  }

})();
