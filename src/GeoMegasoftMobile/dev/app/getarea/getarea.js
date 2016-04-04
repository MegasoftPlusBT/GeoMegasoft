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

        function OnViewLoad() {
            $scope.data =
                    {
                        selectArea: null,
                        items: []
                    };
            $http.get('http://localhost:16952/api/v1/Reons').then(function (resp) {
                //console.log('Success', resp);
                $scope.data.items = resp.data.items;
                // For JSON responses, resp.data contains the result
            }, function (err) {
                //console.error('ERR', err);
                $scope.jsonData = err;
                // err.status will contain the status code
            })
            $stateParams.selecetedArea = $scope.data.selectArea;
        }
       
        function OnBeforeEnter() {

        }

        function onAfterLeave() { }
        
    }



})();
