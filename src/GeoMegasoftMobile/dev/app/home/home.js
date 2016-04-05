(function () {
    'use strict';
    angular.module('starter')
      .controller('HomeCtrl', HomeController);

    HomeController.$inject = ['$scope', '$state', '$timeout', '$stateParams', '$window', '$ionicLoading', 'CordovaNetworkService', '$ionicPopup', '$rootScope'];

    function HomeController($scope, $state, $timeout, $stateParams, $window, $ionicLoading, CordovaNetworkService, $ionicPopup, $rootScope) {
        var vm = this;
        initVariables();

        function initVariables() {
            vm.someArray = [];
            vm.user = {};
        }

        $scope.$on('$ionicView.loaded', OnViewLoad);
        $scope.$on('$ionicView.beforeEnter', OnBeforeEnter);
        $scope.$on('$ionicView.afterLeave', onAfterLeave);

       
        function OnViewLoad() {
           
        }
        vm.login = function () {
            var user = vm.user.username;
            var pass = vm.user.password;
            if (user != null && user != undefined && pass != null && pass != undefined) {

                $state.go("main.getarea");
            }
        }

        function OnBeforeEnter() { }

        function onAfterLeave() { }

    }



})();
