(function () {
    'use strict';
    angular.module('starter')
      .controller('editStateCtrl', editStateController);

    editStateController.$inject = ['$scope', '$state', '$timeout', '$stateParams', '$window', '$ionicLoading', 'CordovaNetworkService', '$ionicPopup', '$rootScope', '$cordovaCamera', '$http', '$location'];

    function editStateController($scope, $state, $timeout, $stateParams, $window, $ionicLoading, CordovaNetworkService, $ionicPopup, $rootScope, $cordovaCamera, $http, $location) {
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
            $http.get('http://localhost:16952/api/v1/watercounters/laststate', {
                headers: { 'Authorization': 'Bearer ' + $window.localStorage['access_token'] },
                params: { vidkorid: $stateParams.vidkorid, lokacijaID: $stateParams.lokacijaID, korisnikID: $stateParams.korisnikID, reonID: $stateParams.reonID, broilo: $stateParams.broilo }
            }).then(function (resp) {
                vm.state = {
                    before: parseInt(resp.data.sostojbaNova)
                };
            }, function (err) {
                if (err.status == 401) {
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
            console.log(vm.state.before + " " + vm.state.new);
            var data = {
                "vidkorid": $stateParams.vidkorid,
                "lokacijaID": $stateParams.lokacijaID,
                "korisnikID": $stateParams.korisnikID,
                "reonID": $stateParams.reonID,
                "broilo": $stateParams.broilo,
                "sostojbaStara": parseInt(vm.state.before),
                "sostojbaNova": parseInt(vm.state.new)
            };
            var newValue = parseInt(vm.state.new);
            if (newValue != undefined && !isNaN(newValue)) {
                $http.defaults.headers.post['Authorization'] = "Bearer " + $window.localStorage['access_token'];
                $http.post('http://localhost:16952/api/v1/watercounters/newstate', data).then(function (resp) {
                  
                    if (resp.data.isSucces === true)
                    {
                        $state.go("main.search", { 'selecetedArea': $stateParams.reonID });
                    }
                }, function (err) {
                    if (err.status == 401) {
                        $window.localStorage.clear();
                        $state.go("main.home");
                    } else {
                        vm.errors = {
                            required: "Nastana greska obidete se povtorno"
                        };
                    }                   
                })
            }
            else
            {
                vm.errors = {
                    required: "Poleto nova sostojba e zadolzitelno"
                };
            }
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
