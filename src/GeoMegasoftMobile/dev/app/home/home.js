(function () {
    'use strict';
    angular.module('starter')
      .controller('HomeCtrl', HomeController);

    HomeController.$inject = ['$scope', '$state', '$timeout', '$stateParams', '$window', '$ionicLoading', 'CordovaNetworkService', '$ionicPopup', '$rootScope', '$http'];

    function HomeController($scope, $state, $timeout, $stateParams, $window, $ionicLoading, CordovaNetworkService, $ionicPopup, $rootScope, $http) {
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
                 
                $http.post('http://localhost:16952/token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {                    
                   
                    $window.localStorage['access_token'] = response.access_token;
                    $window.localStorage['token_type'] = response.token_type;
                    $state.go("main.getarea");
                    
                }).error(function (err, status) {
                    vm.errors = {
                        required: err.error
                    };
                });               
            }
        }

        function OnBeforeEnter() { }

        function onAfterLeave() { }

    }



})();
