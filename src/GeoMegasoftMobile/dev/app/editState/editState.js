(function () {
    'use strict';
    angular.module('starter')
      .controller('editStateCtrl', editStateController);

    editStateController.$inject = ['$scope', '$state', '$timeout', '$stateParams', '$window', '$ionicLoading', 'CordovaNetworkService', '$ionicPopup', '$rootScope', '$cordovaCamera', '$http'];

    function editStateController($scope, $state, $timeout, $stateParams, $window, $ionicLoading, CordovaNetworkService, $ionicPopup, $rootScope, $cordovaCamera, $http) {
        var vm = this;
        initVariables();

        function initVariables() {
            vm.someArray = [];
        }

        $scope.$on('$ionicView.loaded', OnViewLoad);
        $scope.$on('$ionicView.beforeEnter', OnBeforeEnter);
        $scope.$on('$ionicView.afterLeave', onAfterLeave);

        function OnViewLoad() {
            $scope.vidkorid = $stateParams.vidkorid;
            $scope.lokacijaID = $stateParams.lokacijaID;
            $scope.korisnikID = $stateParams.korisnikID;
            $scope.reonID = $stateParams.reonID;
            $scope.broilo = $stateParams.broilo;
            $http.get('http://localhost:16952/api/v1/watercounters/laststate', {
                params: { vidkorid: $stateParams.vidkorid, lokacijaID: $stateParams.lokacijaID, korisnikID: $stateParams.korisnikID, reonID: $stateParams.reonID, broilo: $stateParams.broilo }
            }).then(function (resp) {
                $scope.state = {
                    before: resp.data.sostojbaNova
                };
            }, function (err) {
            })
        }

        function OnBeforeEnter() { }

        function onAfterLeave() { }

        vm.takePhoto = function () {
            var options = {
                quality: 75,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 300,
                targetHeight: 300,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
            };

            $cordovaCamera.getPicture(options).then(function (imageData) {
                $scope.imgURI = "data:image/jpeg;base64," + imageData;
            }, function (err) {
                console.log("error taking photo", err);
                // An error occured. Show a message to the user
            });
        }
        vm.choosePhoto = function () {
            var options = {
                quality: 75,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 300,
                targetHeight: 300,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
            };

            $cordovaCamera.getPicture(options).then(function (imageData) {
                $scope.imgURI = "data:image/jpeg;base64," + imageData;
            }, function (err) {
                console.log("error choosing photo", err);
                // An error occured. Show a message to the user
            });
        }

    }



})();
