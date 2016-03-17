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
        url: '/search',
        cache: false,
        views: {
          'subview': {
            templateUrl: 'templates/search.html',
            controller: 'SearchCtrl as vm'
          }
        }
      })
      .state('main.results', {
        url: '/results',
        cache: false,
        views: {
          'subview': {
            templateUrl: 'templates/results.html',
            controller: 'ResultsCtrl as vm'
          }
        }
      })
      .state('main.userdetails', {
        url: '/userdetails',
        cache: false,
        views: {
          'subview': {
            templateUrl: 'templates/userDetails.html',
            controller: 'userDetailsCtrl as vm'
          }
        }
      })
      .state('main.editstate', {
        url: '/editstate',
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

  starterRun.$inject = ['$ionicPlatform', '$cordovaSQLite', '$window'];

  function starterRun($ionicPlatform, $cordovaSQLite, $window) {
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
      $window.dbname = "app.db.0.0.1.db";
      //$cordovaSQLite.deleteDB($window.dbname); // use this line to delete the DB

      $window.db = $cordovaSQLite.openDB($window.dbname);
      // $cordovaSQLite.execute($window.db, "CREATE TABLE IF NOT EXISTS content (id integer primary key, data text)");
      // $cordovaSQLite.execute($window.db, "CREATE TABLE IF NOT EXISTS localFiles (id integer primary key, data text)");

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

(function() {
    'use strict';
  angular.module('starter.constants', [])
    .constant('WebAPIurl','http://DOMAIN/api/')
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
    .factory('DbService', dbService);

  dbService.$inject = ['$cordovaSQLite', '$q', '$ionicPlatform', '$log', '$window'];

  function dbService($cordovaSQLite, $q, $ionicPlatform, $log, $window) {
    var service = new Service();
    return service;

    function Service() {
      /* jshint validthis: true */
      var self = this;
      self.query = queryCallback;
      self.getAll = getAllCallback;
      self.getById = getByIdCallback;
      self.DropCreateContentTable = DropCreateContentTableCallback;

      function getByIdCallback(result) {
        var output = null;
        output = angular.copy(result.rows.item(0));
        return output;
      }

      function getAllCallback(result) {
        var output = [];
        for (var i = 0; i < result.rows.length; i++) {
          output.push(result.rows.item(i));
        }
        return output;
      }

      function queryCallback(query, parameters) {
        parameters = parameters || [];
        var q = $q.defer();

        $ionicPlatform.ready(function() {
          $cordovaSQLite.execute($window.db, query, parameters)
            .then(function(result) {
              // $log.debug('result on sqlite service . query is: ' + query + 'and the params are:' + JSON.stringify(parameters), result);
              //$log.debug('result on sqlite service . query is: ' + query, result);
              q.resolve(result);
            }, function(error) {
              $log.debug('error on sqlite service . query is: ' + query + 'and the params are:' + JSON.stringify(parameters), JSON.stringify(error));

              console.warn('I found an error');
              console.warn(error);
              q.reject(error);
            });
        });
        return q.promise;
      }
    }

    function DropCreateContentTableCallback() {
      var q = $q.defer();
      $ionicPlatform.ready(function() {
        $cordovaSQLite.execute(
          $window.db,
          "DROP TABLE IF EXISTS content"
        ).then(function(result) {
          //console.log('ok', result);
          $cordovaSQLite.execute(
              $window.db, "CREATE TABLE IF NOT EXISTS content (id integer primary key, data text)")
            .then(function(resultCreate) {
              q.resolve(resultCreate);

            }, function(errorCreate) {
              console.warn('I found an error');
              console.warn(errorCreate);
              q.reject(errorCreate);
            });
        }, function(error) {
          console.warn('I found an error');
          console.warn(error);
          q.reject(error);
        });
      });

      return q.promise;
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

(function() {
  'use strict';
  angular.module('starter')
    .controller('editStateCtrl', editStateController);

  editStateController.$inject = ['$scope', '$state', '$timeout', '$stateParams', '$window', '$ionicLoading', 'CordovaNetworkService', '$ionicPopup', '$rootScope','$cordovaCamera'];

  function editStateController($scope, $state, $timeout, $stateParams, $window, $ionicLoading, CordovaNetworkService, $ionicPopup, $rootScope,$cordovaCamera) {
    var vm = this;
    initVariables();

    function initVariables() {
      vm.someArray = [];
    }

    $scope.$on('$ionicView.loaded', OnViewLoad);
    $scope.$on('$ionicView.beforeEnter', OnBeforeEnter);
    $scope.$on('$ionicView.afterLeave', onAfterLeave);

    function OnViewLoad() {}

    function OnBeforeEnter() {}

    function onAfterLeave() {}

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

(function() {
  'use strict';
  angular.module('starter')
    .controller('GetAreaCtrl', GetAreaController);

  GetAreaController.$inject = ['$scope', '$state', '$timeout', '$stateParams', '$window', '$ionicLoading', 'CordovaNetworkService', '$ionicPopup', '$rootScope'];

  function GetAreaController($scope, $state, $timeout, $stateParams, $window, $ionicLoading, CordovaNetworkService, $ionicPopup, $rootScope) {
    var vm = this;
    initVariables();

    function initVariables() {
      vm.someArray = [];
    }

    $scope.$on('$ionicView.loaded', OnViewLoad);
    $scope.$on('$ionicView.beforeEnter', OnBeforeEnter);
    $scope.$on('$ionicView.afterLeave', onAfterLeave);

    function OnViewLoad() {}

    function OnBeforeEnter() {}

    function onAfterLeave() {}

  }



})();

(function() {
  'use strict';
  angular.module('starter')
    .controller('HomeCtrl', HomeController);

  HomeController.$inject = ['$scope', '$state', '$timeout', '$stateParams', '$window', '$ionicLoading', 'CordovaNetworkService', '$ionicPopup', '$rootScope'];

  function HomeController($scope, $state, $timeout, $stateParams, $window, $ionicLoading, CordovaNetworkService, $ionicPopup, $rootScope) {
    var vm = this;
    initVariables();

    function initVariables() {
      vm.someArray = [];
    }

    $scope.$on('$ionicView.loaded', OnViewLoad);
    $scope.$on('$ionicView.beforeEnter', OnBeforeEnter);
    $scope.$on('$ionicView.afterLeave', onAfterLeave);

    function OnViewLoad() {}

    function OnBeforeEnter() {}

    function onAfterLeave() {}

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

(function() {
  'use strict';
  angular.module('starter')
    .controller('ResultsCtrl', ResultsController);

  ResultsController.$inject = ['$scope', '$state', '$timeout', '$stateParams', '$window', '$ionicLoading', 'CordovaNetworkService', '$ionicPopup', '$rootScope'];

  function ResultsController($scope, $state, $timeout, $stateParams, $window, $ionicLoading, CordovaNetworkService, $ionicPopup, $rootScope) {
    var vm = this;
    initVariables();

    function initVariables() {
      vm.someArray = [];
    }

    $scope.$on('$ionicView.loaded', OnViewLoad);
    $scope.$on('$ionicView.beforeEnter', OnBeforeEnter);
    $scope.$on('$ionicView.afterLeave', onAfterLeave);

    function OnViewLoad() {}

    function OnBeforeEnter() {}

    function onAfterLeave() {}

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

    function OnViewLoad() {}

    function OnBeforeEnter() {}

    function onAfterLeave() {}

  }



})();

(function() {
  'use strict';
  angular.module('starter')
    .controller('userDetailsCtrl', userDetailsController);

  userDetailsController.$inject = ['$scope', '$state', '$timeout', '$stateParams', '$window', '$ionicLoading', 'CordovaNetworkService', '$ionicPopup', '$rootScope'];

  function userDetailsController($scope, $state, $timeout, $stateParams, $window, $ionicLoading, CordovaNetworkService, $ionicPopup, $rootScope) {
    var vm = this;
    initVariables();

    function initVariables() {
      vm.someArray = [];
    }

    $scope.$on('$ionicView.loaded', OnViewLoad);
    $scope.$on('$ionicView.beforeEnter', OnBeforeEnter);
    $scope.$on('$ionicView.afterLeave', onAfterLeave);

    function OnViewLoad() {}

    function OnBeforeEnter() {}

    function onAfterLeave() {}

  }



})();

angular.module("starter").run(["$templateCache", function($templateCache) {$templateCache.put("./templates/editState.html","<ion-view class=\"hs-view-home has-header bar-calm\" view-title=\"ВНЕСИ СОСТОЈБА НА БРОИЛО\" content=\"\" scroll=false><ion-content class=has-header style=padding-top:30px; content=\"\" scroll=true><div class=\"row row-center\" style=height:70%;><div class=col><div class=list><div class=\"item item-input inputElement\"><input type=text placeholder=\"Претходна состојба\"></div><div class=\"item item-input inputElement\"><input type=text placeholder=\"Нова состојба\"></div><!--<ion-item class=\"item\">\r\n <div class=\"rowFull\">\r\n <div class=\"colFull col-80\">\r\n Направи фотографија од броило\r\n </div>\r\n <div class=\"colFull col-20\">\r\n <i class=\"icon ion-camera placeholder-icon\" style=\"font-size: 30px;\" ></i>\r\n</div>\r\n </div>\r\n <div class=\"rowFull\">\r\n <div class=\"colFull col-80\">\r\n Прикачи фотографија од броило\r\n </div>\r\n <div class=\"colFull col-20\">\r\n <i class=\"icon ion-camera placeholder-icon\" style=\"font-size: 30px;\" ng-click=\"vm.choosePhoto()\"></i>\r\n </div>\r\n </div>\r\n </ion-item>--><button class=\"button icon-right ion-camera\" style=\"width: 80%;text-align: center;margin-left: 10%;margin-bottom:20px;\" ng-click=vm.takePhoto()>Направи фотографија</button> <button class=\"button icon-right ion-image\" style=\"width: 80%;text-align: center;margin-left: 10%;\" ng-click=vm.choosePhoto()>Прикачи фотографија</button> <img ng-show=\"imgURI !== undefined\" ng-src={{imgURI}} style=\"text-align: center;max-height: 10%;max-width: 50%;margin-left: 30%;\"></div></div></div><div class=row><button class=\"submitButton button button-balanced\" ui-sref=main.results>ВНЕСИ</button></div></ion-content></ion-view>");
$templateCache.put("./templates/getarea.html","<ion-view class=\"hs-view-home has-header bar-calm\" title=\"ПРЕЗЕМИ ПОДАТОЦИ ЗА РЕОН\" overflow-scroll=false><ion-content class=has-header style=padding-top:20%; content=\"\" scroll=false><div class=\"row row-center\" style=max-height:70%;><div class=col><div class=list><select class=\"form-control incheck\"><option>Реон...</option><option>Реон1</option><option>Реон2</option><option>Реон3</option></select></div></div></div><div class=row><button class=\"submitButton button button-calm\" ui-sref=main.search>ПРЕЗЕМИ</button></div></ion-content></ion-view>");
$templateCache.put("./templates/home.html","<ion-view class=\"hs-view-home has-header bar-calm\" view-title=ЛОГИН content=\"\" scroll=false><ion-content class=has-header style=padding-top:30px; content=\"\" scroll=false><div class=\"row row-center\"><div class=col><div class=list><label class=\"item item-input inputElement\"><input type=text placeholder=\"Корисничко Име\"></label> <label class=\"item item-input inputElement\"><input type=password placeholder=Лозинка></label></div></div></div><div class=row><button class=\"submitButton button button-calm\" ui-sref=main.getarea>ЛОГИРАЈ СЕ</button></div></ion-content></ion-view>");
$templateCache.put("./templates/internetConnection.html","<ion-view view-title=\"\" class=hs-view-internetConnection><ion-content scroll=false class=white-bg><div class=card><div class=\"item item-text-wrap\">{{vm.message}}</div></div></ion-content></ion-view>");
$templateCache.put("./templates/menu.html","<ion-side-menus enable-menu-with-back-views=false><ion-side-menu-content><ion-nav-bar align-title=center class=\"bar-calm bar-header-with-logo never-hide-inline\"><ion-nav-back-button class=button-clear><i class=ion-android-arrow-back></i></ion-nav-back-button><ion-nav-title ng-click=\"mainVm.navigateToState(\'main.home\',{})\"><div class=page-title></div></ion-nav-title><ion-nav-buttons side=left><button class=\"button button-icon button-clear ion-navicon\" menu-toggle=left></button></ion-nav-buttons><ion-nav-buttons side=right></ion-nav-buttons></ion-nav-bar><ion-nav-view name=subview></ion-nav-view></ion-side-menu-content><ion-side-menu side=left><ion-header-bar class=bar-calm><h1 class=title></h1></ion-header-bar><ion-content class=side-menu-content><ion-list class=side-menu-list><ion-item menu-close=\"\" ui-sref=main.home>Home</ion-item><ion-item menu-close=\"\" ui-sref=main.home>Other</ion-item></ion-list></ion-content></ion-side-menu></ion-side-menus>");
$templateCache.put("./templates/results.html","<ion-view class=\"hs-view-home has-header\" view-title=\"РЕЗУЛТАТИ ОД ПРЕБАРУВАЊЕ\" overflow-scroll=true><ion-content scroll=true padding=false><ion-list><ion-item class=item-stable><div class=rowFull><div class=\"colFull col-80\">Име/Презиме/Адреса</div><div class=\"colFull col-20\" ui-sref=main.userdetails>БРОИЛО</div></div></ion-item><ion-item class=item-stable><div class=rowFull><div class=\"colFull col-80\">Име/Презиме/Адреса</div><div class=\"colFull col-20\" ui-sref=main.userdetails>БРОИЛО</div></div></ion-item><ion-item class=item-stable><div class=rowFull><div class=\"colFull col-80\">Име/Презиме/Адреса</div><div class=\"colFull col-20\" ui-sref=main.userdetails>БРОИЛО</div></div></ion-item><ion-item class=item-stable><div class=rowFull><div class=\"colFull col-80\">Име/Презиме/Адреса</div><div class=\"colFull col-20\" ui-sref=main.userdetails>БРОИЛО</div></div></ion-item><ion-item class=item-stable><div class=rowFull><div class=\"colFull col-80\">Име/Презиме/Адреса</div><div class=\"colFull col-20\" ui-sref=main.userdetails>БРОИЛО</div></div></ion-item><ion-item class=item-stable><div class=rowFull><div class=\"colFull col-80\">Име/Презиме/Адреса</div><div class=\"colFull col-20\" ui-sref=main.userdetails>БРОИЛО</div></div></ion-item><ion-item class=item-stable><div class=rowFull><div class=\"colFull col-80\">Име/Презиме/Адреса</div><div class=\"colFull col-20\" ui-sref=main.userdetails>БРОИЛО</div></div></ion-item><ion-item class=item-stable><div class=rowFull><div class=\"colFull col-80\">Име/Презиме/Адреса</div><div class=\"colFull col-20\" ui-sref=main.userdetails>БРОИЛО</div></div></ion-item><ion-item class=item-stable><div class=rowFull><div class=\"colFull col-80\">Име/Презиме/Адреса</div><div class=\"colFull col-20\" ui-sref=main.userdetails>БРОИЛО</div></div></ion-item><ion-item class=item-stable><div class=rowFull><div class=\"colFull col-80\">Име/Презиме/Адреса</div><div class=\"colFull col-20\" ui-sref=main.userdetails>БРОИЛО</div></div></ion-item><ion-item class=item-stable><div class=rowFull><div class=\"colFull col-80\">Име/Презиме/Адреса</div><div class=\"colFull col-20\" ui-sref=main.userdetails>БРОИЛО</div></div></ion-item><ion-item class=item-stable><div class=rowFull><div class=\"colFull col-80\">Име/Презиме/Адреса</div><div class=\"colFull col-20\" ui-sref=main.userdetails>БРОИЛО</div></div></ion-item><ion-item class=item-stable><div class=rowFull><div class=\"colFull col-80\">Име/Презиме/Адреса</div><div class=\"colFull col-20\" ui-sref=main.userdetails>БРОИЛО</div></div></ion-item></ion-list></ion-content></ion-view>");
$templateCache.put("./templates/search.html","<ion-view class=\"hs-view-home has-header bar-calm\" title=\"ПРЕБАРАЈ БРОИЛО\" overflow-scroll=false><ion-content class=has-header style=padding-top:30px; content=\"\" scroll=false><div class=\"row row-center\" style=max-height:70%;><div class=col><div class=list><div class=\"item item-input inputElement\"><input type=text placeholder=\"Корисник (Име/Презиме)\"></div><div class=\"item item-input inputElement\"><input type=text placeholder=\"Локација (Улица, Број ...)\"></div><select class=\"form-control incheck\"><option>Радиус од ...</option><option>Радиус 1</option><option>Радиус 2</option><option>Радиус 3</option></select></div></div></div><div class=row><button class=\"submitButton button button-calm\" ui-sref=main.results>БАРАЈ</button></div></ion-content></ion-view>");
$templateCache.put("./templates/userDetails.html","<ion-view class=\"hs-view-home has-header\" view-title=\"ПРИКАЖИ КОРИСНИК\" overflow-scroll=false><ion-content class=has-header style=padding-top:30px; content=\"\" scroll=false><div class=\"row row-center\" style=max-height:70%;><div class=col><ion-item class=item-stable style=max-height:70%><div class=rowFull>Тип на корисник</div><div class=rowFull>Шифра на корисник</div><div class=rowFull>Име/назив</div><div class=rowFull>Шифра на улица</div><div class=rowFull>Куќен број</div><div class=rowFull>Влез</div><div class=rowFull>Стан</div><div class=rowFull>Град</div></ion-item></div></div><div class=row><button class=\"submitButton button button-calm\" ui-sref=main.editstate>Внеси нова состојба</button></div><!--<button class=\"submitButton button button-calm\" ui-sref=\"main.editstate\">--></ion-content></ion-view>");}]);