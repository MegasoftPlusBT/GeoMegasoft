(function () {
    'use strict';
    angular.module('starter')
      .controller('editStateCtrl', editStateController);

    editStateController.$inject = ['$scope', '$state', '$timeout', '$stateParams', '$window', '$ionicLoading', 'CordovaNetworkService', '$ionicPopup', '$rootScope', '$cordovaCamera', '$http', '$location', 'WebAPIurl', '$cordovaGeolocation'];

    function editStateController($scope, $state, $timeout, $stateParams, $window, $ionicLoading, CordovaNetworkService, $ionicPopup, $rootScope, $cordovaCamera, $http, $location, WebAPIurl, $cordovaGeolocation) {
        var vm = this;
        initVariables();

        function initVariables() {
            vm.someArray = [];
        }

        $scope.$on('$ionicView.loaded', OnViewLoad);
        $scope.$on('$ionicView.beforeEnter', OnBeforeEnter);
        $scope.$on('$ionicView.afterLeave', onAfterLeave);

        function OnViewLoad() {
            vm.vidkorid = $stateParams.vidkorid;
            vm.lokacijaID = $stateParams.lokacijaID;
            vm.korisnikID = $stateParams.korisnikID;
            vm.reonID = $stateParams.reonID;
            vm.broilo = $stateParams.broilo;
            var url = WebAPIurl + 'api/v1/watercounters/laststate';
            $http.get(url, {
                headers: { 'Authorization': 'Bearer ' + $window.localStorage['access_token'] },
                params: { vidkorid: $stateParams.vidkorid, lokacijaID: $stateParams.lokacijaID, korisnikID: $stateParams.korisnikID, reonID: $stateParams.reonID, broilo: $stateParams.broilo }
            }).then(function (resp) {
                vm.state = {
                    before: parseInt(resp.data.sostojbaNova),
                    slika: resp.data.slikaSostojba,
                    mesec: resp.data.mesec
                };

            }, function (err) {
                if (err.status == 401 || err.status == 0) {
                    $window.localStorage.clear();
                    $state.go("main.home");
                } else {
                    conso.log(err.data.message);
                }
            })
        }

        function OnBeforeEnter() { }

        function onAfterLeave() { }


        vm.saveNewState = function () {
            // console.log(vm.state.before + " " + vm.state.new);
            var posOptions = { timeout: 3000, enableHighAccuracy: false };
            var lat = "0";
            var long = "0";
            var result = $cordovaGeolocation
                .getCurrentPosition(posOptions)
                .then(function (position) {
                    lat = position.coords.latitude;
                    long = position.coords.longitude;
                }, function (err) {
                    // error
                    console.log(err);
                });
            $timeout(function () {
                var data = {
                    "vidkorid": $stateParams.vidkorid,
                    "lokacijaID": $stateParams.lokacijaID,
                    "korisnikID": $stateParams.korisnikID,
                    "reonID": $stateParams.reonID,
                    "broilo": $stateParams.broilo,
                    "sostojbaStara": parseInt(vm.state.before),
                    "sostojbaNova": parseInt(vm.state.new),
                    "slikaSostojba": vm.state.slika,
                    "lat": lat,
                    "long": long
                };
                var newValue = parseInt(vm.state.new);
                var url = WebAPIurl + 'api/v1/watercounters/newstate';
                $http.defaults.headers.post['Authorization'] = "Bearer " + $window.localStorage['access_token'];
                $http.post(url, data).then(function (resp) {
                    if (resp.data.isSucces === true) {                       
                        $ionicLoading.show({ template: "Новата состојба е зачувана!", noBackdrop: true, duration: 2000 });
                        $timeout(function () {
                            $state.go("main.search", { 'selecetedArea': $stateParams.reonID });
                        }, 3000);
                    }
                    else {
                        vm.errors = {
                            required: "* " + resp.data.message
                        };
                    }
                }, function (err) {
                    if (err.status == 401 || err.status == 0) {
                        $window.localStorage.clear();
                        $state.go("main.home");
                    } else {
                        vm.errors = {
                            required: "* " + err.data.exceptionMessage
                        };
                    }
                })

            }, 1000);

        };
        vm.removImage = function () {
            vm.state.slika = null;
        };
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
                vm.state.slika = "data:image/jpeg;base64," + imageData;
            }, function (err) {
                console.log("error taking photo", err);
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
                vm.state.slika = "data:image/jpeg;base64," + imageData;
            }, function (err) {
                console.log("error choosing photo", err);
            });
        }

    }



})();
