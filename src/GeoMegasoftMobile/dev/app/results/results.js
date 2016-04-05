(function() {
  'use strict';
  angular.module('starter')
    .controller('ResultsCtrl', ResultsController);

  ResultsController.$inject = ['$scope', '$state', '$timeout', '$stateParams', '$window', '$ionicLoading', 'CordovaNetworkService', '$ionicPopup', '$rootScope', '$http'];

  function ResultsController($scope, $state, $timeout, $stateParams, $window, $ionicLoading, CordovaNetworkService, $ionicPopup, $rootScope, $http) {
    var vm = this;
    initVariables();

    function initVariables() {
      vm.someArray = [];
    }

    $scope.$on('$ionicView.loaded', OnViewLoad);
    $scope.$on('$ionicView.beforeEnter', OnBeforeEnter);
    $scope.$on('$ionicView.afterLeave', onAfterLeave);

    function OnViewLoad() {
        $scope.regionId = $stateParams.selectedRegion;
        $scope.imePrezime = $stateParams.inputImePrezime;
        $scope.lokacija = $stateParams.inputLokacija;
        var searchParameters = {
            "firstLastName": $stateParams.inputImePrezime,
            "location": $stateParams.inputLokacija,
            "radius": 0,
            "reionId": parseInt($stateParams.selectedRegion)
        };
        $http.post('http://localhost:16952/api/v1/watercounters/search', searchParameters).then(function (resp) {            
            vm.items = resp.data.items;
        }, function (err) {
        })
    }

    function OnBeforeEnter() {}

    function onAfterLeave() {}

  }



})();
