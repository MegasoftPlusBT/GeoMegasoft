/* globals _,ionic */
/* jshint -W098, -W069 */
(function () {
    'use strict';

    angular.module('starter')
      .controller('MainCtrl', MainController);

    MainController.$inject = ['$log', '$scope', '$interval', '$timeout', '$rootScope', '$q', '$state', '$ionicPopup', '$ionicHistory', '$window', '$stateParams'];

    function MainController($log, $scope, $interval, $timeout, $rootScope, $q, $state, $ionicPopup, $ionicHistory, $window, $stateParams) {
        var mainVm = this;
        mainVm.logo = '';

        $scope.$on("$destroy", ViewOnDestroy);

        function ViewOnDestroy(event) {

        }
        mainVm.check = function () {
            return $state.current.name == 'main.login';
        };

        mainVm.checkArea = function () {
            return $state.current.name != 'main.getarea';
        };

        mainVm.logOut = function () {
            $window.localStorage.clear();
            $state.go("main.login");
        };

        mainVm.navigateToState = function (name, params) {
            if (name === "main.login") {
                $ionicHistory.nextViewOptions({
                    disableBack: true
                });
            } else {
                $ionicHistory.nextViewOptions({
                    disableBack: false
                });
            }
            $state.go(name, params);
        };
        mainVm.search = function () {
            $state.go("main.search", { 'selecetedArea': $window.localStorage['selected_search'] });
        };
        mainVm.area = function () {
            $state.go("main.getarea");
        };
    }
})();
