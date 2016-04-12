(function() {
  'use strict';
  // Ionic Starter App

  // angular.module is a global place for creating, registering and retrieving Angular modules
  // 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
  // the 2nd parameter is an array of 'requires'
  // 'starter.services' is found in services.js
  // 'starter.controllers' is found in controllers.js
  angular.module('starter', [
    'ionic',
    'starter.constants',
    'starter.shared',
    //TODO add modules here
    'ngCordova'
  ]);
})();

/*globals  _ */
/*jshint -W083 */
(function() {
  'use strict';


  angular.module('starter')
    .config(starterRoutes);


  starterRoutes.$inject = ['$stateProvider', '$urlRouterProvider'];

  function starterRoutes($stateProvider, $urlRouterProvider) {
    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider
      .state('main', {
        url: '/main',
        cache: false,
        abstract: true,
        controller: 'MainCtrl as mainVm',
        // template: '<ion-nav-view name="subview"></ion-nav-view>'
        templateUrl: 'templates/menu.html'
      })
      .state('main.home', {
        url: '/home',
        cache: false,
        views: {
          'subview': {
            templateUrl: 'templates/home.html',
            controller: 'HomeCtrl as vm'
          }
        }
      })
      .state('main.getarea', {
        url: '/getarea',
        cache: false,
        views: {
          'subview': {
            templateUrl: 'templates/getarea.html',
            controller: 'GetAreaCtrl as vm'
          }
        }
      })
      .state('main.search', {
          url: '/search/:selecetedArea',
        cache: false,
        views: {
          'subview': {
            templateUrl: 'templates/search.html',
            controller: 'SearchCtrl as vm'
          }
        }
      })
      .state('main.results', {
          url: '/results/:selectedRegion&:inputImePrezime&:inputLokacija',
        cache: false,
        views: {
          'subview': {
            templateUrl: 'templates/results.html',
            controller: 'ResultsCtrl as vm'
          }
        }
      })
      .state('main.userdetails', {
          url: '/userdetails/:vidkorid&:lokacijaID&:korisnikID&:reonID&:broilo',
        cache: false,
        views: {
          'subview': {
            templateUrl: 'templates/userDetails.html',
            controller: 'userDetailsCtrl as vm'
          }
        }
      })
      .state('main.editstate', {
          url: '/editstate/:vidkorid&:lokacijaID&:korisnikID&:reonID&:broilo',
        cache: false,
        views: {
          'subview': {
            templateUrl: 'templates/editState.html',
            controller: 'editStateCtrl as vm'
          }
        }
      })
      .state('noInternetConnection', {
        url: '/noInternet',
        cache: false,
        abstract: false,
        controller: 'InternetConnectionCtrl as vm',
        templateUrl: 'templates/internetConnection.html'
      });




    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/main/home');
  }

})();

/*globals cordova, StatusBar */
/*jshint -W083 */
(function() {
  'use strict';
  window.db = null;

  angular.module('starter')
    .config(starterConfig)
    .run(starterRun)
    ;

  starterConfig.$inject = ['$compileProvider', '$ionicConfigProvider', '$logProvider'];

  function starterConfig($compileProvider, $ionicConfigProvider, $logProvider) {
    $ionicConfigProvider.navBar.alignTitle('center');
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|ghttps?|ms-appx|x-wmapp0):/);
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|file|blob|cdvfile):|data:image\//);
    $ionicConfigProvider.backButton.icon('ion-ios-arrow-left white-back-btn');
    $logProvider.debugEnabled(true);
  }

  starterRun.$inject = ['$ionicPlatform', '$window'];

  function starterRun($ionicPlatform, $window) {
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleLightContent();
      }
     
      // $ionicPlatform.registerBackButtonAction(function(e) {
      //   e.preventDefault();
      //   return false;
      // }, 101);

    });
  }


})();

(function() {
    'use strict';
  angular.module('starter.shared', ['starter.constants','ngCordova','ionic']);

})();

//(function() {
//    'use strict';
//  angular.module('starter.constants', [])
//    .constant('WebAPIurl', 'http://localhost:16952/')
//    ;
//})();

(function () {
    'use strict';
    angular.module('starter.constants', [])
      .constant('WebAPIurl', 'http://geomegasoft.dev.haselt.net/')
    ;
})();


(function() {
    'use strict';
angular.module('starter.shared')
  .factory('ContentDbService',contentDbService)
;

contentDbService.$inject = ['DbService'];
function contentDbService(DbService) {
  var service = new Service();
  return service;

  function Service(){
    var self = this;
    self.all = allCallback;
    self.getById = getByIdCallback;
    self.add = addCallback;
    self.remove = removeCallback;
    self.update = updateCallback;

    function allCallback() {
      return DbService.query("SELECT id, data FROM content")
        .then(function(result){
          return DbService.getAll(result);
        });
    }

    function getByIdCallback(Id) {
      var parameters = [Id];
      return DbService.query("SELECT id, data FROM content WHERE id = (?)", parameters)
        .then(function(result) {
          return DbService.getById(result);
        });
    }

    function addCallback(contentData) {
      var parameters = [contentData.id, contentData.data];
      return DbService.query("INSERT INTO content (id, data) VALUES (?,?)", parameters);
    }

    function removeCallback(contentData) {
      var parameters = [contentData.id];
      return DbService.query("DELETE FROM content WHERE id = (?)", parameters);
    }

    function updateCallback(origContentData, editContentData) {
      //console.log('origContentData',origContentData);
      //console.log('editContentData',editContentData);
      var parameters = [editContentData.id, editContentData.data, origContentData.id];
      return DbService.query("UPDATE content SET id = (?), data = (?) WHERE id = (?)", parameters);
    }
  }

}


})();

angular.module('starter.shared')
  .filter('rawHtml', function($sce) {
    return function(val) {
      val = val.replace('<script', '<div style="display:none"');
      return $sce.trustAsHtml(val);
    };
  });

(function() {
  'use strict';

  angular.module('starter.shared')
    .factory('NetworkInfoService', networkInfoService);

  angular.module('starter.shared')
    .service('CordovaNetworkService', navigatorNetworkService);

  navigatorNetworkService.$inject = ['$rootScope', '$ionicPlatform', '$q'];

  function navigatorNetworkService($rootScope, $ionicPlatform, $q) {
    // Get Cordova's global Connection object or emulate a smilar one
    var Connection = window.Connection || {
      'ETHERNET': 'ethernet',
      'WIFI': 'wifi',
      'CELL_2G': 'cell_2g',
      'CELL_3G': 'cell_3g',
      'CELL_4G': 'cell_4g',
      'CELL': 'cell',
      'EDGE': 'edge',
      'UNKNOWN': 'unknown'
    };

    var asyncGetConnection = function() {
      var q = $q.defer();
      $ionicPlatform.ready(function() {
        if (navigator.connection) {
          q.resolve(navigator.connection);
        } else {
          q.reject('navigator.connection is not defined');
        }
      });
      return q.promise;
    };

    return {
      isOnline: function() {
        return asyncGetConnection().then(function(networkConnection) {
          var isConnected = false;

          switch (networkConnection.type) {
            case Connection.ETHERNET:
            case Connection.WIFI:
            case Connection.CELL_2G:
            case Connection.CELL_3G:
            case Connection.CELL_4G:
            case Connection.CELL:
              //console.log(Connection.WIFI);
              //console.log(networkConnection.type);
              isConnected = true;
              break;
          }
          return isConnected;
        });
      }
    };
  }

  networkInfoService.$inject = ['$cordovaNetwork', '$q', '$ionicPlatform', '$timeout'];

  function networkInfoService($cordovaNetwork, $q, $ionicPlatform, $timeout) {
    var service = new Service();
    return service;


    function Service() {
      var self = this;
      // self.isOnline = $cordovaNetwork.isOnline();
      self.isOnline = IsOnline;

      function IsOnline() {
        var q = $q.defer();
        //console.log('in isOnline');
        var timeoutPromise = $timeout(function() {
          q.reject(false); //aborts the request when timed out
          //console.log("Timed out");
        }, 2000);

        $ionicPlatform.ready(function() {
          if ($cordovaNetwork.isOnline()) {
            $timeout.cancel(timeoutPromise);
            q.resolve(true);
          } else {
            q.reject(false);
          }
        });
        return q.promise;
      }
    }

  }
})();

(function() {
  'use strict';
  angular.module('starter.shared')
    .factory('WebService', webService);

  webService.$inject = ['$http', 'WebPortalAPIurl'];

  function webService($http, WebPortalAPIurl) {
    var service = new Service();
    return service;

    function Service() {
      var self = this;
      self.get = getContentCallback;

      function getContentCallback(pairCode) {
        var requestUrl = WebPortalAPIurl + 'something/';

        return $http({
            method: "get",
            url: requestUrl,
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache',
            },
            data: ''
          })
          .then(onGetSuccessCallback, onGetFailCallback);

        function onGetSuccessCallback(response) {
          ////console.log('webService response:\r\n',JSON.stringify(response));
          if (response.data.status === "success") {
            var data = response.data;
            if (data === null) {
              return null;
            }

            return data;
          } else {
            //console.log(response);
            return {};
          }
          //return checkError(response);
        }

        function onGetFailCallback(error) {
          //console.log(error);
          return [];
        }
      }
    }
  }

})();

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
                         $state.go("main.search", { 'selecetedArea': $stateParams.reonID });
                    }
                    else {
                        vm.errors = {
                            required: resp.data.message
                        };
                    }
                }, function (err) {
                    if (err.status == 401) {
                        $window.localStorage.clear();
                        $state.go("main.home");
                    } else {
                        vm.errors = {
                            required: err.data.exceptionMessage
                        };
                    }
                })

            }, 3000);

            
            
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

(function () {
    'use strict';
    angular.module('starter')
      .controller('GetAreaCtrl', GetAreaController);

    GetAreaController.$inject = ['$scope', '$state', '$timeout', '$stateParams', '$window', '$ionicLoading', 'CordovaNetworkService', '$ionicPopup', '$rootScope', '$http', 'WebAPIurl'];

    function GetAreaController($scope, $state, $timeout, $stateParams, $window, $ionicLoading, CordovaNetworkService, $ionicPopup, $rootScope, $http, WebAPIurl) {
        var vm = this;
        initVariables();

        function initVariables() {
            vm.someArray = [];
        }



        $scope.$on('$ionicView.loaded', OnViewLoad);
        $scope.$on('$ionicView.beforeEnter', OnBeforeEnter);
        $scope.$on('$ionicView.afterLeave', onAfterLeave);

        vm.goToSearch = function () {

            if (vm.data.selectArea == null || vm.data.selectArea == undefined) {
                vm.errors = {
                    required: "Изберете реон"
                };
            }
            else {
                $state.go("main.search", { 'selecetedArea': vm.data.selectArea });
            }
        };
        function OnViewLoad() {
            var url = WebAPIurl + 'api/v1/Reons';
            vm.data =
                    {
                        selectArea: null,
                        items: []
                    };
            $http.get(url, {
                headers: { 'Authorization': 'Bearer ' + $window.localStorage['access_token'] }
            }).then(function (resp) {
                //console.log('Success', resp);
                vm.data.items = resp.data.items;
                // For JSON responses, resp.data contains the result
            }, function (err) {
                //err = Object {data: Object, status: 401, config: Object, statusText: "Unauthorized"
                if (err.status == 401) {
                    $window.localStorage.clear();
                } else {
                    conso.log(err.data.message);
                }
                $state.go("main.home");
            })
            $stateParams.selecetedArea = vm.data.selectArea;
        }

        function OnBeforeEnter() {

        }

        function onAfterLeave() { }

    }



})();

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

/* globals _,ionic */
/* jshint -W098 */
(function() {
  'use strict';

  angular.module('starter')
    .controller('InternetConnectionCtrl', InternetConnectionController);

  InternetConnectionController.$inject = ['$log', '$scope', '$interval', '$timeout', '$rootScope', '$q', '$state', '$ionicPopup',  '$ionicHistory', 'CordovaNetworkService'];

  function InternetConnectionController($log, $scope, $interval, $timeout, $rootScope, $q, $state, $ionicPopup,  $ionicHistory, CordovaNetworkService) {
    var vm = this;
    console.log('InternetConnectionController loaded');
    vm.message = "NO INTERNET MESSAGE HERE";
    $scope.$on("$destroy", ViewOnDestroy);
    vm.intervalPromise = undefined;

    function ViewOnDestroy(event) {
      if (vm.intervalPromise !== undefined) {
        $interval.cancel(vm.intervalPromise);
      }
      vm.intervalPromise = undefined;
    }

    $scope.$on('$ionicView.enter', function() {
      vm.intervalPromise = $interval(function() {
        //set interval to try and get content
        CheckInternetConnection();
      }, 4000);
    });

    function CheckInternetConnection() {
      vm.message = "...";
      CordovaNetworkService.isOnline().then(isOnlineSuccess).catch(isOnlineFail);
    }

    function isOnlineFail() {
      vm.message = "PLEASE CONNECT MESSAGE HERE";
    }

    function isOnlineSuccess(isConnected) {
      if (isConnected) {
        vm.message = "...";
        $state.go('main.gotodefault');
      }
    }

  }

})();

/* globals _,ionic */
/* jshint -W098 */
(function() {
  'use strict';

  angular.module('starter')
    .controller('MainCtrl', MainController);

  MainController.$inject = ['$log', '$scope', '$interval', '$timeout', '$rootScope', '$q', '$state', '$ionicPopup', '$ionicHistory', '$window'];

  function MainController($log, $scope, $interval, $timeout, $rootScope, $q, $state, $ionicPopup, $ionicHistory, $window) {
    var mainVm = this;
    mainVm.logo = '';

    $scope.$on("$destroy", ViewOnDestroy);

    function ViewOnDestroy(event) {

    }

    mainVm.navigateToState = function(name, params) {
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


  }

})();

(function () {
    'use strict';
    angular.module('starter')
      .controller('ResultsCtrl', ResultsController);

    ResultsController.$inject = ['$scope', '$state', '$timeout', '$stateParams', '$window', '$ionicLoading', 'CordovaNetworkService', '$ionicPopup', '$rootScope', '$http', 'WebAPIurl'];

    function ResultsController($scope, $state, $timeout, $stateParams, $window, $ionicLoading, CordovaNetworkService, $ionicPopup, $rootScope, $http, WebAPIurl) {
        var vm = this;
        initVariables();

        function initVariables() {
            vm.someArray = [];
        }

        $scope.$on('$ionicView.loaded', OnViewLoad);
        $scope.$on('$ionicView.beforeEnter', OnBeforeEnter);
        $scope.$on('$ionicView.afterLeave', onAfterLeave);

        function OnViewLoad() {
            $scope.regionId = $stateParams.selectedRegion;
            $scope.imePrezime = $stateParams.inputImePrezime;
            $scope.lokacija = $stateParams.inputLokacija;
            var searchParameters = {
                "firstLastName": $stateParams.inputImePrezime,
                "location": $stateParams.inputLokacija,
                "radius": 0,
                "reionId": parseInt($stateParams.selectedRegion)
            };

            var url = WebAPIurl + 'api/v1/watercounters/search';
            $http.defaults.headers.post['Authorization'] = "Bearer " + $window.localStorage['access_token'];
            $http.post(url, searchParameters).then(function (resp) {
                vm.items = resp.data.items;
            }, function (err) {
                if (err.status == 401) {
                    $window.localStorage.clear();
                    $state.go("main.home");
                } else {
                    if (err.data != null) {
                        conso.log(err.data.message);
                    }
                    $state.go("main.home");
                }
            })
        }

        function OnBeforeEnter() { }

        function onAfterLeave() { }

    }



})();

(function() {
  'use strict';
  angular.module('starter')
    .controller('SearchCtrl', SearchController);

  SearchController.$inject = ['$scope', '$state', '$timeout', '$stateParams', '$window', '$ionicLoading', 'CordovaNetworkService', '$ionicPopup', '$rootScope'];

  function SearchController($scope, $state, $timeout, $stateParams, $window, $ionicLoading, CordovaNetworkService, $ionicPopup, $rootScope) {
    var vm = this;
    initVariables();

    function initVariables() {
      vm.someArray = [];
    }

    $scope.$on('$ionicView.loaded', OnViewLoad);
    $scope.$on('$ionicView.beforeEnter', OnBeforeEnter);
    $scope.$on('$ionicView.afterLeave', onAfterLeave);

    function OnViewLoad() {
        $scope.region = $stateParams.selecetedArea;
        console.log($stateParams);
    }

    function OnBeforeEnter() {}

    function onAfterLeave() {}

  }



})();

(function () {
    'use strict';
    angular.module('starter')
      .controller('userDetailsCtrl', userDetailsController);

    userDetailsController.$inject = ['$scope', '$state', '$timeout', '$stateParams', '$window', '$ionicLoading', 'CordovaNetworkService', '$ionicPopup', '$rootScope', '$http', 'WebAPIurl'];

    function userDetailsController($scope, $state, $timeout, $stateParams, $window, $ionicLoading, CordovaNetworkService, $ionicPopup, $rootScope, $http, WebAPIurl) {
        var vm = this;
        initVariables();

        function initVariables() {
            vm.someArray = [];
        }

        $scope.$on('$ionicView.loaded', OnViewLoad);
        $scope.$on('$ionicView.beforeEnter', OnBeforeEnter);
        $scope.$on('$ionicView.afterLeave', onAfterLeave);
     
        function OnViewLoad() {
            vm.vidkorID = $stateParams.vidkorid;
            vm.lokacijaID = $stateParams.lokacijaID;
            vm.korisnikID = $stateParams.korisnikID;
            vm.reonID = $stateParams.reonID;
            vm.broilo = $stateParams.broilo;
            var url = WebAPIurl + 'api/v1/customers/customerinfo';
            $http.get(url, {
                headers: { 'Authorization': 'Bearer ' + $window.localStorage['access_token'] },
                params: { korisnikID: $stateParams.korisnikID }
            }).then(function (resp) {
                vm.tipNaKorisnik = resp.data.tipNaKorisnik;
                vm.shifraNaKorisnik = resp.data.shifraNaKorisnik;
                vm.imeNaziv = resp.data.imeNaziv;
                vm.shifraNaUlica = resp.data.shifraNaUlica;
                vm.kukenBroj = resp.data.kukenBroj;
                vm.vlez = resp.data.vlez;
                vm.stan = resp.data.stan;
                vm.grad = resp.data.grad;
                vm.adresa=resp.data.adresa;
            }, function (err) {
                if (err.status == 401) {
                    $window.localStorage.clear();
                }
                $state.go("main.home");
            })
        }

        function OnBeforeEnter() { }

        function onAfterLeave() { }

    }



})();

angular.module("starter").run(["$templateCache", function($templateCache) {$templateCache.put("./templates/editState.html","<ion-view class=\"hs-view-home has-header bar-calm\" view-title=\"ВНЕСИ СОСТОЈБА НА БРОИЛО\" content=\"\" scroll=false><ion-content class=has-header style=padding-top:30px; content=\"\" scroll=true><div class=\"row row-center\" style=height:70%;><div class=col><div class=list><div class=\"item item-input inputElement\"><input ng-model=vm.state.before type=number min=1 placeholder=\"Претходна состојба\" readonly=\"\"></div><div class=\"item item-input inputElement\"><input ng-model=vm.state.new type=number min=1 placeholder=\"Нова состојба\" required=\"\"></div><input type=hidden ng-model=vm.state.slika><div style=\"margin-left: 10%;\"><p>{{vm.errors.required}}</p></div><!--<ion-item class=\"item\">\r\n <div class=\"rowFull\">\r\n <div class=\"colFull col-80\">\r\n Направи фотографија од броило\r\n </div>\r\n <div class=\"colFull col-20\">\r\n <i class=\"icon ion-camera placeholder-icon\" style=\"font-size: 30px;\" ></i>\r\n </div>\r\n </div>\r\n <div class=\"rowFull\">\r\n <div class=\"colFull col-80\">\r\n Прикачи фотографија од броило\r\n </div>\r\n <div class=\"colFull col-20\">\r\n <i class=\"icon ion-camera placeholder-icon\" style=\"font-size: 30px;\" ng-click=\"vm.choosePhoto()\"></i>\r\n </div>\r\n </div>\r\n </ion-item>--><button class=\"button icon-right ion-camera\" style=\"width: 80%;text-align: center;margin-left: 10%;margin-bottom:20px;\" ng-click=vm.takePhoto()>Направи фотографија</button> <button class=\"button icon-right ion-image\" style=\"width: 80%;text-align: center;margin-left: 10%;\" ng-click=vm.choosePhoto()>Прикачи фотографија</button><p>{{errorMessage}}</p></div></div></div><div class=\"row row-center\" ng-if=\"vm.state.slika !== undefined&&vm.state.slika!=null\"><div class=\"col col-75\"><a class=\"item item-thumbnail-left\" href=# style=margin-left:15%><img ng-show=\"vm.state.slika !== undefined\" ng-src={{vm.state.slika}}><h2>{{vm.state.mesec}}</h2></a></div><div class=col><button class=\"button button-positive\" ng-click=vm.removImage()><i class=\"icon ion-android-close\"></i></button></div></div><div class=row><button class=\"submitButton button button-balanced\" ng-click=vm.saveNewState()><!--ui-sref=\"main.results\">-->ВНЕСИ</button></div></ion-content></ion-view>");
$templateCache.put("./templates/getarea.html","<ion-view class=\"hs-view-home has-header bar-calm\" title=\"ПРЕЗЕМИ ПОДАТОЦИ ЗА РЕОН\" overflow-scroll=false><ion-content class=has-header style=padding-top:20%; content=\"\" scroll=false><div class=\"row row-center\" style=max-height:70%;><div class=col><div class=list><!--<select class=\"form-control incheck\">\r\n <option>Реон...</option>\r\n <option>Реон1</option>\r\n <option>Реон2</option>\r\n <option>Реон3</option>\r\n </select>--><select name=selectArea id=selectArea ng-model=vm.data.selectArea class=\"form-control incheck\"><option value=\"\">Реон...</option><!--not selected / blank option--><option ng-repeat=\"option in vm.data.items\" value={{option.reonID}}>{{option.zabeleska}}</option></select><br><div style=\"margin-left: 10%;\"><p>{{vm.errors.required}}</p></div></div></div></div><div class=row><button class=\"submitButton button button-calm\" ng-click=vm.goToSearch()>ПРЕЗЕМИ</button></div></ion-content></ion-view>");
$templateCache.put("./templates/home.html","<ion-view class=\"hs-view-home has-header bar-calm\" view-title=ЛОГИН content=\"\" scroll=false><ion-content class=has-header style=padding-top:30px; content=\"\" scroll=false><div class=\"row row-center\"><div class=col><div class=list><label class=\"item item-input inputElement\"><input type=text ng-model=vm.user.username placeholder=\"Корисничко Име\"></label> <label class=\"item item-input inputElement\"><input type=password ng-model=vm.user.password placeholder=Лозинка></label><div style=\"margin-left: 10%;\"><p>{{vm.errors.required}}</p></div></div></div></div><div class=row><button class=\"submitButton button button-calm\" ng-click=vm.login()>ЛОГИРАЈ СЕ</button></div></ion-content></ion-view>");
$templateCache.put("./templates/internetConnection.html","<ion-view view-title=\"\" class=hs-view-internetConnection><ion-content scroll=false class=white-bg><div class=card><div class=\"item item-text-wrap\">{{vm.message}}</div></div></ion-content></ion-view>");
$templateCache.put("./templates/menu.html","<ion-side-menus enable-menu-with-back-views=false><ion-side-menu-content><ion-nav-bar align-title=center class=\"bar-calm bar-header-with-logo never-hide-inline\"><ion-nav-back-button class=button-clear><i class=ion-android-arrow-back></i></ion-nav-back-button><ion-nav-title ng-click=\"mainVm.navigateToState(\'main.home\',{})\"><div class=page-title></div></ion-nav-title><ion-nav-buttons side=left><button class=\"button button-icon button-clear ion-navicon\" menu-toggle=left></button></ion-nav-buttons><ion-nav-buttons side=right></ion-nav-buttons></ion-nav-bar><ion-nav-view name=subview></ion-nav-view></ion-side-menu-content><ion-side-menu side=left><ion-header-bar class=bar-calm><h1 class=title></h1></ion-header-bar><ion-content class=side-menu-content><ion-list class=side-menu-list><ion-item menu-close=\"\" ui-sref=main.home>Home</ion-item><ion-item menu-close=\"\" ui-sref=main.home>Other</ion-item></ion-list></ion-content></ion-side-menu></ion-side-menus>");
$templateCache.put("./templates/results.html","<ion-view class=\"hs-view-home has-header\" view-title=\"РЕЗУЛТАТИ ОД ПРЕБАРУВАЊЕ\" overflow-scroll=true><ion-content scroll=true padding=false><ion-list ng-repeat=\"item in vm.items\"><ion-item class=item-stable><div class=rowFull><div class=\"colFull col-80\" ui-sref=\"main.userdetails({vidkorid: item.vidKorID, lokacijaID: item.lokacijaID, korisnikID: item.korisnikID, reonID: item.reonID, broilo: item.broilo})\"><div class=row>{{item.naziv}}</div><div class=row>{{item.ulica}}/ {{item.broj}}</div></div><div class=\"colFull col-25\" ui-sref=\"main.userdetails({vidkorid: item.vidKorID, lokacijaID: item.lokacijaID, korisnikID: item.korisnikID, reonID: item.reonID, broilo: item.broilo})\"><div class=row>{{item.broilo}}</div><div class=row>/{{item.novaSostojba}}</div></div></div></ion-item></ion-list></ion-content></ion-view>");
$templateCache.put("./templates/search.html","<ion-view class=\"hs-view-home has-header bar-calm\" title=\"ПРЕБАРАЈ БРОИЛО\" overflow-scroll=false><ion-content class=has-header style=padding-top:30px; content=\"\" scroll=false><div class=\"row row-center\" style=max-height:70%;><div class=col><div class=list><div class=\"item item-input inputElement\"><input ng-model=search.imeprezime type=text placeholder=\"Корисник (Име/Презиме)\"></div><div class=\"item item-input inputElement\"><input ng-model=search.lokacija type=text placeholder=\"Локација (Улица, Број ...)\"></div><select class=\"form-control incheck\"><option>Радиус од ...</option><option>Радиус 1</option><option>Радиус 2</option><option>Радиус 3</option></select></div></div></div><div class=row><button class=\"submitButton button button-calm\" ui-sref=main.results({selectedRegion:region,inputImePrezime:search.imeprezime,inputLokacija:search.lokacija})>БАРАЈ</button></div></ion-content></ion-view>");
$templateCache.put("./templates/userDetails.html","<ion-view class=\"hs-view-home has-header\" view-title=\"ПРИКАЖИ КОРИСНИК\" overflow-scroll=false><ion-content class=has-header style=padding-top:30px; content=\"\" scroll=false><div class=\"row row-center\" style=max-height:70%;><div class=col><ion-item class=item-stable style=max-height:70%><div class=rowFull><b>Тип на Корисник</b>: {{vm.tipNaKorisnik}}</div><div class=rowFull><b>Шифра на корисник</b>: {{vm.shifraNaKorisnik}}</div><div class=rowFull><b>Име/назив</b> :{{vm.imeNaziv}}</div><div class=rowFull><b>Улица</b>: {{vm.adresa}}</div><div class=rowFull><b>Куќен број</b>: {{vm.kukenBroj}}</div><div class=rowFull><b>Влез</b>: {{vm.vlez}}</div><div class=rowFull><b>Стан</b>: {{vm.stan}}</div><div class=rowFull><b>Град</b>: {{vm.grad}}</div></ion-item></div></div><div class=row><button class=\"submitButton button button-calm\" ui-sref=\"main.editstate({vidkorid: vm.vidkorID, lokacijaID: vm.lokacijaID, korisnikID: vm.korisnikID, reonID: vm.reonID, broilo: vm.broilo})\">Внеси нова состојба</button></div><!--<button class=\"submitButton button button-calm\" ui-sref=\"main.editstate\">--></ion-content></ion-view>");}]);