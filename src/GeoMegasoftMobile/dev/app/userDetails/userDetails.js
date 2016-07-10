/* jshint -W098, -W069, -W040 */
(function() {
  'use strict';
  angular.module('starter')
    .controller('userDetailsCtrl', userDetailsController);

  userDetailsController.$inject = ['$scope', '$state', '$timeout', '$stateParams', '$window', '$ionicLoading', 'CordovaNetworkService', '$ionicPopup', '$rootScope', '$http', 'WebAPIurl', 'LocalDataService'];

  function userDetailsController($scope, $state, $timeout, $stateParams, $window, $ionicLoading, CordovaNetworkService, $ionicPopup, $rootScope, $http, WebAPIurl, LocalDataService) {
    var vm = this;
    initVariables();

    function initVariables() {
      vm.someArray = [];
    }

    $scope.$on('$ionicView.loaded', OnViewLoad);
    $scope.$on('$ionicView.beforeEnter', OnBeforeEnter);
    $scope.$on('$ionicView.afterLeave', onAfterLeave);

    function OnViewLoad() {
      vm.vidkorID = $stateParams.vidkorid;
      vm.lokacijaID = $stateParams.lokacijaID;
      vm.korisnikID = $stateParams.korisnikID;
      vm.reonID = $stateParams.reonID;
      vm.broilo = $stateParams.broilo;

      LocalDataService.readCustomerInfo($stateParams.korisnikID).then(
          function(res) {
            vm.tipNaKorisnik = res[0].SifTipID;
            vm.shifraNaKorisnik = res[0].ID;
            vm.imeNaziv = res[0].Naziv;
            vm.shifraNaUlica = res[0].UlicaID;
            vm.kukenBroj = res[0].Broj;
            vm.vlez = res[0].Vlez;
            vm.stan = res[0].Stan;
            vm.grad = res[0].Grad;
            vm.adresa = res[0].Adresa;
            //TODO search water counters for this customer
            //vm.items = res[0].WaterCounters;
          },
          function(err) {
            //error
            console.log(err);
          }
        )
        // var url = WebAPIurl + 'api/v1/customers/customerinfo';
        // $http.get(url, {
        //     headers: { 'Authorization': 'Bearer ' + $window.localStorage['access_token'] },
        //     params: { korisnikID: $stateParams.korisnikID }
        // }).then(function (resp) {
        //     vm.tipNaKorisnik = resp.data.tipNaKorisnik;
        //     vm.shifraNaKorisnik = resp.data.shifraNaKorisnik;
        //     vm.imeNaziv = resp.data.imeNaziv;
        //     vm.shifraNaUlica = resp.data.shifraNaUlica;
        //     vm.kukenBroj = resp.data.kukenBroj;
        //     vm.vlez = resp.data.vlez;
        //     vm.stan = resp.data.stan;
        //     vm.grad = resp.data.grad;
        //     vm.adresa=resp.data.adresa;
        //     vm.items = resp.data.waterCounters;
        // }, function (err) {
        //     if (err.status == 401 || err.status == 0) {
        //         $window.localStorage.clear();
        //     }
        //     $state.go("main.login",{message:"Проверете ја интернет конекцијата"},null);
        // });
    }

    function OnBeforeEnter() {
      $ionicLoading.hide();
    }

    function onAfterLeave() {}

    vm.getItemClass = function(item) {
      var newClass = '';
      if (vm.broilo == item.broilo) {
        newClass = 'selectedItem';
      }
      return "item-stable " + newClass;
    };

    vm.navigateToUserDetails = function(item) {
      var data = {
        vidkorid: item.vidKorID,
        lokacijaID: item.lokacijaID,
        korisnikID: item.korisnikID,
        reonID: item.reonID,
        broilo: item.broilo
      };
      $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0,
        duration: 2000
      });
      $timeout(function() {
        $state.go('main.userdetails', data, null);
      }, 2000);
    };
  }



})();
