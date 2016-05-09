(function () {
    'use strict';
    angular.module('starter')
      .controller('userDetailsCtrl', userDetailsController);

    userDetailsController.$inject = ['$scope', '$state', '$timeout', '$stateParams', '$window', '$ionicLoading', 'CordovaNetworkService', '$ionicPopup', '$rootScope', '$http', 'WebAPIurl'];

    function userDetailsController($scope, $state, $timeout, $stateParams, $window, $ionicLoading, CordovaNetworkService, $ionicPopup, $rootScope, $http, WebAPIurl) {
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
            var url = WebAPIurl + 'api/v1/customers/customerinfo';
            $http.get(url, {
                headers: { 'Authorization': 'Bearer ' + $window.localStorage['access_token'] },
                params: { korisnikID: $stateParams.korisnikID }
            }).then(function (resp) {
                vm.tipNaKorisnik = resp.data.tipNaKorisnik;
                vm.shifraNaKorisnik = resp.data.shifraNaKorisnik;
                vm.imeNaziv = resp.data.imeNaziv;
                vm.shifraNaUlica = resp.data.shifraNaUlica;
                vm.kukenBroj = resp.data.kukenBroj;
                vm.vlez = resp.data.vlez;
                vm.stan = resp.data.stan;
                vm.grad = resp.data.grad;
                vm.adresa=resp.data.adresa;
            }, function (err) {
                if (err.status == 401 || err.status == 0) {
                    $window.localStorage.clear();
                }
                $state.go("main.home");
            })
        }

        function OnBeforeEnter() { }

        function onAfterLeave() { }

    }



})();
