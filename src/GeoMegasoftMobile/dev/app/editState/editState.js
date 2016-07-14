
(function() {
  'use strict';
  angular.module('starter')
    .controller('editStateCtrl', editStateController);

  editStateController.$inject = ['$scope', '$state', '$timeout', '$stateParams', '$window', '$ionicLoading', 'CordovaNetworkService', '$ionicPopup', '$rootScope', '$cordovaCamera', '$http', '$location', 'WebAPIurl', '$cordovaGeolocation', 'LocalDataService'];

  function editStateController($scope, $state, $timeout, $stateParams, $window, $ionicLoading, CordovaNetworkService, $ionicPopup, $rootScope, $cordovaCamera, $http, $location, WebAPIurl, $cordovaGeolocation, LocalDataService) {
    var vm = this;
    initVariables();

    function initVariables() {
      vm.someArray = [];
      vm.newCounter = false;
      vm.HasBeenUpdatedLocally = false; //TODO check from localDB
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
      LocalDataService.getLastWaterCounterState(
        $stateParams.vidkorid,
        $stateParams.lokacijaID,
        $stateParams.korisnikID,
        $stateParams.reonID,
        $stateParams.broilo
      ).then(function(res) {
        console.log(res);
        vm.imeNaziv = res[0].Naziv;
        vm.broilo = res[0].Broilo;
        vm.state = {
          before: parseInt(res[0].SostojbaNova),
          slika: res[0].SlikaSostojba,
          mesec: res[0].Mesec
        };
        vm.HasBeenUpdatedLocally = res[0].HasBeenUpdatedLocally;
      }, function(err) {
        console.log(err);
      });
    }

    function OnBeforeEnter() {}

    function onAfterLeave() {}

    function submitSaveNewState() {
      if (vm.state.new == null || vm.state.new < vm.state.before) {
        $ionicPopup.alert({
          title: 'Новата состојба е невалидна',
          template: 'Внесете состојба поголема од претходната.'
        });
        return;
      }

      vm.errors = {
        required: ""
      };

      $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });

      var posOptions = {
        timeout: 3000,
        enableHighAccuracy: false
      };
      var latValue = "0";
      var longValue = "0";
      var result = $cordovaGeolocation
        .getCurrentPosition(posOptions)
        .then(function(position) {
          latValue = position.coords.latitude;
          longValue = position.coords.longitude;
        }, function(err) {
          // error
          //console.log(err);
        });
      $timeout(function() {
        var updatedWaterCounterStateData = {
          ReonId: $stateParams.reonID,
          VidKorID: $stateParams.vidkorid,
          KorisnikId: $stateParams.korisnikID,
          LokacijaId: $stateParams.lokacijaID,
          Broilo: $stateParams.broilo,
          SostojbaStara: parseInt(vm.state.before),
          SostojbaNova: parseInt(vm.state.new),
          SlikaSostojba: vm.state.slika,
          lat: latValue,
          long: longValue,
          DateCreated: (new Date()).toJSON(),
          TypeOfAPICall: 'updateState',
          IsSentToAPI: false
        };

        LocalDataService.updateWaterCounterState(updatedWaterCounterStateData).then(function(result) {
          $ionicLoading.hide();
          $ionicLoading.show({
            template: "Успешно зачувана состојба!",
            noBackdrop: true,
            duration: 2000
          });
          $timeout(function() {
            $ionicLoading.hide();
            $state.go("main.search", {
              'selecetedArea': $stateParams.reonID
            });
          }, 3000);
        }, function(error) {
          $ionicLoading.hide();
          vm.errors = {
            required: "грешка при зачувување."
          };
        });


      }, 1000);
    }

    function submitNewCounter() {
      console.log('create new counter');

      //TODO insert call
      //create new API call
      //on API create counter, and then set state
      //on success return to search

      $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });
      // console.log(vm.state.before + " " + vm.state.new);
      var posOptions = {
        timeout: 3000,
        enableHighAccuracy: false
      };
      var latValue = "0";
      var longValue = "0";
      var result = $cordovaGeolocation
        .getCurrentPosition(posOptions)
        .then(function(position) {
          latValue = position.coords.latitude;
          longValue = position.coords.longitude;
        }, function(err) {
          // error
          //console.log(err);
        });
      $timeout(function() {

        // var data = {
        //   "Vidkorid": $stateParams.vidkorid,
        //   "LokacijaID": $stateParams.lokacijaID,
        //   "KorisnikID": $stateParams.korisnikID,
        //   "ReonID": $stateParams.reonID,
        //   "Broilo": vm.brShasija,
        //   "Sostojba": parseInt(vm.state.new),
        //   "SlikaSostojba": vm.state.slika,
        //   "Lat": lat,
        //   "Long": long
        // };
        // var newValue = parseInt(vm.state.new);

        var updatedWaterCounterStateData = {
          ReonId: $stateParams.reonID,
          VidKorID: $stateParams.vidkorid,
          KorisnikId: $stateParams.korisnikID,
          LokacijaId: $stateParams.lokacijaID,
          Broilo: $stateParams.broilo,
          SostojbaStara: 0,
          SostojbaNova: parseInt(vm.state.new),
          SlikaSostojba: vm.state.slika,
          lat: latValue,
          long: longValue,
          DateCreated: (new Date()).toJSON(),
          TypeOfAPICall: 'newWaterCounter',
          IsSentToAPI: false
        };

        LocalDataService.addNewWaterCounter(updatedWaterCounterStateData,vm.imeNaziv,vm.brShasija).then(function(result) {
          $ionicLoading.hide();
          $ionicLoading.show({
            template: "Успешна промена!",
            noBackdrop: true,
            duration: 2000
          });
          $timeout(function() {
            $ionicLoading.hide();
            $state.go("main.search", {
              'selecetedArea': $stateParams.reonID
            });
          }, 3000);
        }, function(error) {
          $ionicLoading.hide();
          vm.errors = {
            required: "грешка при зачувување."
          };
        });



      }, 1000);

    }

    function validateNewCounter() {
      if (vm.state.new == null || vm.state.new < 1) {
        $ionicPopup.alert({
          title: 'Новата состојба е невалидна',
          template: 'Внесете валидна состојба'
        });
        return false;
      }
      if (vm.brShasija == null || vm.brShasija.length < 1) {
        $ionicPopup.alert({
          title: '',
          template: 'Внеси број на шасија.'
        });
        return false;
      }
    }
    vm.saveNewState = function() {
      if (vm.newCounter == true) {
        if (validateNewCounter() == false) {
          return;
        }
        //insert new counter and then save new state
        submitNewCounter();
      } else {
        submitSaveNewState();
      }
    };

    vm.removImage = function() {
      vm.state.slika = null;
    };
    vm.takePhoto = function() {
      var options = {
        quality: 75,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 300,
        targetHeight: 225,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false
      };

      $cordovaCamera.getPicture(options).then(function(imageData) {
        vm.state.slika = "data:image/jpeg;base64," + imageData;
      }, function(err) {
        //console.log("error taking photo", err);
      });
    };

    vm.choosePhoto = function() {
      var options = {
        quality: 75,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 300,
        targetHeight: 225,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false
      };

      $cordovaCamera.getPicture(options).then(function(imageData) {
        vm.state.slika = "data:image/jpeg;base64," + imageData;
      }, function(err) {
        //console.log("error choosing photo", err);
      });
    };

  }



})();
