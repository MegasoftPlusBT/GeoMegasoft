/* globals _,ionic */
/* jshint -W098 */
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
            console.log($state.current);
            return $state.current.name == 'main.home';
        }
        mainVm.navigateToState = function (name, params) {
            if (name === "main.home") {
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
