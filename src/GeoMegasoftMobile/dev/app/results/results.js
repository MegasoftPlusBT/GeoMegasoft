(function () {
    'use strict';
    angular.module('starter')
      .controller('ResultsCtrl', ResultsController);

    ResultsController.$inject = ['$scope', '$state', '$timeout', '$stateParams', '$window', '$ionicLoading', 'CordovaNetworkService', '$ionicPopup', '$rootScope', '$http', 'WebAPIurl'];

    function ResultsController($scope, $state, $timeout, $stateParams, $window, $ionicLoading, CordovaNetworkService, $ionicPopup, $rootScope, $http, WebAPIurl) {
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

            var url = WebAPIurl + 'api/v1/watercounters/search';
            $http.defaults.headers.post['Authorization'] = "Bearer " + $window.localStorage['access_token'];
            $http.post(url, searchParameters).then(function (resp) {
                vm.items = resp.data.items;
            }, function (err) {
                if (err.status == 401) {
                    $window.localStorage.clear();
                    $state.go("main.home");
                } else {
                    if (err.data != null) {
                        conso.log(err.data.message);
                    }
                    $state.go("main.home");
                }
            })
        }

        function OnBeforeEnter() { }

        function onAfterLeave() { }

    }



})();
