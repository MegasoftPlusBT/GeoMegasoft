(function () {
    'use strict';
    angular.module('starter')
      .controller('HomeCtrl', HomeController);

    HomeController.$inject = ['$scope', '$state', '$timeout', '$stateParams', '$window', '$ionicLoading', 'CordovaNetworkService', '$ionicPopup', '$rootScope', '$http', 'WebAPIurl'];

    function HomeController($scope, $state, $timeout, $stateParams, $window, $ionicLoading, CordovaNetworkService, $ionicPopup, $rootScope, $http, WebAPIurl) {
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
                var data = "grant_type=password&username=" + user + "&password=" + pass;
                var url = WebAPIurl + 'token';
                $http.post(url, data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {

                    $window.localStorage['access_token'] = response.access_token;
                    $window.localStorage['token_type'] = response.token_type;
                    $state.go("main.getarea");

                }).error(function (err, status) {
                    if (err != null)
                        vm.errors = {
                            required: err.error
                        };
                    else
                        vm.errors = {
                            required: "Проверете ја интернет конекцијата"
                        };
                });
            }
        }

        function OnBeforeEnter() { }

        function onAfterLeave() { }

    }



})();
