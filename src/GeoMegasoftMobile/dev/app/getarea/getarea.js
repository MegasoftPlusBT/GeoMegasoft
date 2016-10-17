/* jshint -W069, -W041 */
(function () {
  'use strict';
  angular.module('starter')
    .controller('GetAreaCtrl', GetAreaController);

  GetAreaController.$inject = ['$scope', '$state', '$timeout', '$stateParams', '$window', '$ionicLoading', 'CordovaNetworkService', '$ionicPopup', '$rootScope', '$http', 'WebAPIurl', 'WebAPIService', 'LocalDataService'];

  function GetAreaController($scope, $state, $timeout, $stateParams, $window, $ionicLoading, CordovaNetworkService, $ionicPopup, $rootScope, $http, WebAPIurl, WebAPIService, LocalDataService) {
    var vm = this;
    initVariables();
    vm.months =
      [
        { display: 1, value: "01" },
        { display: 2, value: "02" },
        { display: 3, value: "03" },
        { display: 4, value: "04" },
        { display: 5, value: "05" },
        { display: 6, value: "06" },
        { display: 7, value: "07" },
        { display: 8, value: "08" },
        { display: 9, value: "09" },
        { display: 10, value: "10" },
        { display: 11, value: "11" },
        { display: 12, value: "12" }
      ];
    vm.years = [2015, 2016, 2017, 2018, 2019, 2020, 2021]; //TODO, if it is not necessary remove 2015

    vm.selectedMonth = vm.months[0];
    vm.selectedYear = 2016;

    function initVariables() {
      vm.hasReonsList = false;
      vm.data = {
        selectArea: null,
        items: []
      };
    }

    $scope.$on('$ionicView.loaded', OnViewLoad);
    $scope.$on('$ionicView.beforeEnter', OnBeforeEnter);
    $scope.$on('$ionicView.afterLeave', onAfterLeave);

    vm.goToSearch = function () {

      if (vm.data.selectArea == null || vm.data.selectArea == undefined) {
        vm.errors = {
          required: "* Изберете реон"
        };
        vm.successMessage = "";
      } else {
        $state.go("main.search", {
          'selecetedArea': vm.data.selectArea
        });
        $window.localStorage['selected_search'] = vm.data.selectArea;
      }
    };

    vm.downloadReonData = function () {
      if (vm.data.selectArea == null) {
        vm.errors.required = "Одберете реон за преземање.";
        vm.successMessage = "";
        return;
      }

      if (($window.localStorage['localReonId'] != null && $window.localStorage['localReonId'] != undefined)) {
        vm.errors.required = "Недозволена акција, направете синхронизација.";
        vm.successMessage = "";
        return;
      }
      $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });

      WebAPIService.downladReonData(vm.data.selectArea, vm.selectedYear, vm.selectedMonth.value).then(function (data) {
        if(data.waterCounters == undefined || data.waterCounters == null || data.waterCounters.length == 0){
          vm.errors.required = "Не постојат броила за селектираните опции.";
          vm.successMessage = "";
          $ionicLoading.hide();
          return;
        }

        LocalDataService.setReonFromAPI(data, vm.data.selectArea, ""+vm.selectedYear+"/"+vm.selectedMonth.value).then(function (result) {
          console.log('Data is inserted in local DB');
          $ionicLoading.hide();
          $state.go("main.search", {
            'selecetedArea': $window.localStorage['localReonId']
          });
        }, function (err) {
          $ionicLoading.hide();
        });
      }, function (error) {
        $ionicLoading.hide();
      });
    };
    vm.synchronize = function () {

      if ($window.localStorage['localReonId'] == null && $window.localStorage['localReonId'] == undefined) {
        vm.errors.required = "Симнете податоци за реон";
        vm.successMessage = "";
        return;
      }

      $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });

      LocalDataService.uploadAllChangesToApi().then(function (result) {
        // console.log('all data is uploaded and cleared');
        vm.errors.required = "";
        vm.successMessage = "Успешно завршена синхронизација";
        $ionicLoading.hide();
      }, function (err) {
        if (err == "noInternetConnection") {
          vm.errors.required = "Поврзете се на интернет";
          vm.successMessage = "";
        }
        console.log('there was an error', err);
        $ionicLoading.hide();
      });
    };

    function OnViewLoad() {
      $stateParams.selecetedArea = vm.data.selectArea;
      getReonsList();
      vm.errors = {
        required: ""
      };
      vm.successMessage = "";
    }

    function getReonsList() {
      var url = WebAPIurl + 'api/v1/Reons/ReonList';
      $http.get(url, {
        headers: {
          'Authorization': 'Bearer ' + $window.localStorage['access_token']
        }
      }).then(function (resp) {
        //console.log('Success', resp);
        vm.data.items = resp.data.items;
        vm.hasReonsList = true;
        // For JSON responses, resp.data contains the result
      }, function (err) {
        if (err.status == 401) {
          $window.localStorage.clear();
          $state.go("main.login");
        } else {
          //conso.log(err.data.message);
        }
      });
    }

    function OnBeforeEnter() {
      // if($window.localStorage['localReonId'] != null && $window.localStorage['localReonId'] != undefined){
      //   $state.go("main.search", {
      //     'selecetedArea': $window.localStorage['localReonId']
      //   });
      //   $window.localStorage['selected_search'] = $window.localStorage['localReonId'];
      // }
    }

    function onAfterLeave() { }

  }



})();
