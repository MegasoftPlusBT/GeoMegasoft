(function() {
  'use strict';
  angular.module('starter')
    .controller('SearchCtrl', SearchController);

  SearchController.$inject = ['$scope', '$state', '$timeout', '$stateParams', '$window', '$ionicLoading', 'CordovaNetworkService', '$ionicPopup', '$rootScope'];

  function SearchController($scope, $state, $timeout, $stateParams, $window, $ionicLoading, CordovaNetworkService, $ionicPopup, $rootScope) {
    var vm = this;
    initVariables();

    function initVariables() {
      vm.someArray = [];
      vm.search = {
        imeprezime: '',
        lokacija: ''
      };
      vm.errors = {
        required: ""
      };
    }

    $scope.$on('$ionicView.loaded', OnViewLoad);
    $scope.$on('$ionicView.beforeEnter', OnBeforeEnter);
    $scope.$on('$ionicView.afterLeave', onAfterLeave);

    function OnViewLoad() {}

    vm.search = function() {
      if ($window.localStorage['localReonId'] == null || $window.localStorage['localReonId'] == undefined) {
        vm.errors.required = "Недозволена акција, преземете реон.";
        return;
      }

      $state.go('main.results', {
        selectedRegion: $window.localStorage['localReonId'],
        inputImePrezime: vm.search.imeprezime,
        inputLokacija: vm.search.lokacija
      });
    };

    function OnBeforeEnter() {}

    function onAfterLeave() {}

  }
})();
