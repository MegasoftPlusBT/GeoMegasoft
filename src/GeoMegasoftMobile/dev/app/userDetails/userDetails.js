(function () {
    'use strict';
    angular.module('starter')
      .controller('userDetailsCtrl', userDetailsController);

    userDetailsController.$inject = ['$scope', '$state', '$timeout', '$stateParams', '$window', '$ionicLoading', 'CordovaNetworkService', '$ionicPopup', '$rootScope', '$http'];

    function userDetailsController($scope, $state, $timeout, $stateParams, $window, $ionicLoading, CordovaNetworkService, $ionicPopup, $rootScope, $http) {
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

            $http.get('http://localhost:16952/api/v1/customers/customerinfo', {
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
            }, function (err) {
                if (err.status == 401) {
                    $window.localStorage.clear();
                }
                $state.go("main.home");
            })
        }

        function OnBeforeEnter() { }

        function onAfterLeave() { }

    }



})();
