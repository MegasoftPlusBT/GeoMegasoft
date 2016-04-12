(function () {
    'use strict';
    angular.module('starter')
      .controller('GetAreaCtrl', GetAreaController);

    GetAreaController.$inject = ['$scope', '$state', '$timeout', '$stateParams', '$window', '$ionicLoading', 'CordovaNetworkService', '$ionicPopup', '$rootScope', '$http', 'WebAPIurl'];

    function GetAreaController($scope, $state, $timeout, $stateParams, $window, $ionicLoading, CordovaNetworkService, $ionicPopup, $rootScope, $http, WebAPIurl) {
        var vm = this;
        initVariables();

        function initVariables() {
            vm.someArray = [];
        }



        $scope.$on('$ionicView.loaded', OnViewLoad);
        $scope.$on('$ionicView.beforeEnter', OnBeforeEnter);
        $scope.$on('$ionicView.afterLeave', onAfterLeave);

        vm.goToSearch = function () {

            if (vm.data.selectArea == null || vm.data.selectArea == undefined) {
                vm.errors = {
                    required: "* Изберете реон"
                };
            }
            else {
                $state.go("main.search", { 'selecetedArea': vm.data.selectArea });
            }
        };
        function OnViewLoad() {
            var url = WebAPIurl + 'api/v1/Reons';
            vm.data =
                    {
                        selectArea: null,
                        items: []
                    };
            $http.get(url, {
                headers: { 'Authorization': 'Bearer ' + $window.localStorage['access_token'] }
            }).then(function (resp) {
                //console.log('Success', resp);
                vm.data.items = resp.data.items;
                // For JSON responses, resp.data contains the result
            }, function (err) {
                if (err.status == 401 || err.status == 0) {
                    $window.localStorage.clear();
                } else {
                    conso.log(err.data.message);
                }
                $state.go("main.home");
            })
            $stateParams.selecetedArea = vm.data.selectArea;
        }

        function OnBeforeEnter() {

        }

        function onAfterLeave() { }

    }



})();
