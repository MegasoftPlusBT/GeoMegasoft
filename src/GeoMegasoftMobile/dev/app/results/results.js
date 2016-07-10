(function() {
  'use strict';
  angular.module('starter')
    .controller('ResultsCtrl', ResultsController);

  ResultsController.$inject = ['$scope', '$state', '$timeout', '$stateParams', '$window', '$ionicLoading', 'CordovaNetworkService', '$ionicPopup', '$rootScope', '$http', 'WebAPIurl', 'LocalDataService'];

  function ResultsController($scope, $state, $timeout, $stateParams, $window, $ionicLoading, CordovaNetworkService, $ionicPopup, $rootScope, $http, WebAPIurl, LocalDataService) {
    var vm = this;
    initVariables();

    function initVariables() {
      vm.someArray = [];
    }

    $scope.$on('$ionicView.loaded', OnViewLoad);
    $scope.$on('$ionicView.beforeEnter', OnBeforeEnter);
    $scope.$on('$ionicView.afterLeave', onAfterLeave);

    function OnViewLoad() {
      $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });
      $scope.regionId = $stateParams.selectedRegion;
      $scope.imePrezime = $stateParams.inputImePrezime;
      $scope.lokacija = $stateParams.inputLokacija;
      // var searchParameters = {
      //     "firstLastName": $stateParams.inputImePrezime,
      //     "location": $stateParams.inputLokacija,
      //     "radius": 0,
      //     "reionId": parseInt($stateParams.selectedRegion)
      // };
      // vm.items = [1];
      // var url = WebAPIurl + 'api/v1/watercounters/search';
      // $http.defaults.headers.post['Authorization'] = "Bearer " + $window.localStorage['access_token'];
      // $http.post(url, searchParameters).then(function (resp) {
      //     $ionicLoading.hide();
      //     vm.items = resp.data.items;
      // }, function (err) {
      //   $window.localStorage.clear();
      //   $ionicLoading.hide();
      //   $state.go("main.login",{message:"Проверете ја интернет конекцијата"},null);
      // });

      vm.items = [1];
      LocalDataService.searchWaterCounters($stateParams.inputImePrezime, $stateParams.inputLokacija, 0, parseInt($stateParams.selectedRegion)).then(
        function(searchResult) {
          vm.items = searchResult;
          $ionicLoading.hide();
        },
        function(error) {
          $ionicLoading.hide();
          console.log('no items found');
        }
      );
    }

    vm.openDetails = function(item) {
      $state.go('main.userdetails', {
        vidkorid: item.VidKorId,
        lokacijaID: item.LokacijaId,
        korisnikID: item.KorisnikId,
        reonID: item.ReonId,
        broilo: item.Broilo
      });
    };

    function OnBeforeEnter() {}

    function onAfterLeave() {}

  }
})();
