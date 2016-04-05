(function () {
    'use strict';
    angular.module('starter')
      .controller('GetAreaCtrl', GetAreaController);

    GetAreaController.$inject = ['$scope', '$state', '$timeout', '$stateParams', '$window', '$ionicLoading', 'CordovaNetworkService', '$ionicPopup', '$rootScope', '$http'];

    function GetAreaController($scope, $state, $timeout, $stateParams, $window, $ionicLoading, CordovaNetworkService, $ionicPopup, $rootScope, $http) {
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
                    required: "Izberete reon"
                };
            }
            else
            {
                $state.go("main.search", { 'selecetedArea': vm.data.selectArea });
            }
        };
        function OnViewLoad() {
            vm.data =
                    {
                        selectArea: null,
                        items: []
                    };
            $http.get('http://localhost:16952/api/v1/Reons').then(function (resp) {
                //console.log('Success', resp);
                vm.data.items = resp.data.items;
                // For JSON responses, resp.data contains the result
            }, function (err) {
            })
            $stateParams.selecetedArea = vm.data.selectArea;
        }

        function OnBeforeEnter() {

        }

        function onAfterLeave() { }

    }



})();
