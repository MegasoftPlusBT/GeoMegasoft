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
            $scope.vidkorID = $stateParams.vidkorid;
            $scope.lokacijaID = $stateParams.lokacijaID;
            $scope.korisnikID = $stateParams.korisnikID;
            $scope.reonID = $stateParams.reonID;
            $scope.broilo = $stateParams.broilo;

            var data =
                {

                }
            $http.get('http://localhost:16952/api/v1/customers/customerinfo',{
                params: { korisnikID: $stateParams.korisnikID }}).then(function (resp) {
                    $scope.tipNaKorisnik = resp.data.tipNaKorisnik;
                    $scope.shifraNaKorisnik = resp.data.shifraNaKorisnik;
                    $scope.imeNaziv = resp.data.imeNaziv;
                    $scope.shifraNaUlica = resp.data.shifraNaUlica;
                    $scope.kukenBroj = resp.data.kukenBroj;
                    $scope.vlez = resp.data.vlez;
                    $scope.stan = resp.data.stan;
                    $scope.grad = resp.data.grad;
            }, function (err) {
            })
            $scope.go = function () {
                //$location.path(path);
                console.log("Tuka sum");
            };
        }
       
        function OnBeforeEnter() { }

        function onAfterLeave() { }

    }



})();
