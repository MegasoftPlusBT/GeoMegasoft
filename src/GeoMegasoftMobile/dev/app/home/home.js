(function() {
  'use strict';
  angular.module('starter')
    .controller('HomeCtrl', HomeController);

  HomeController.$inject = ['$scope', '$state', '$timeout', '$stateParams', '$window', '$ionicLoading', 'CordovaNetworkService', '$ionicPopup', '$rootScope'];

  function HomeController($scope, $state, $timeout, $stateParams, $window, $ionicLoading, CordovaNetworkService, $ionicPopup, $rootScope) {
    var vm = this;
    initVariables();

    function initVariables() {
      vm.someArray = [];
    }

    $scope.$on('$ionicView.loaded', OnViewLoad);
    $scope.$on('$ionicView.beforeEnter', OnBeforeEnter);
    $scope.$on('$ionicView.afterLeave', onAfterLeave);

    function OnViewLoad() {}

    function OnBeforeEnter() {}

    function onAfterLeave() {}

  }



})();
