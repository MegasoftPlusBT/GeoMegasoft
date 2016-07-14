(function() {
  'use strict';

  angular.module('starter.shared')
    .factory('CordovaNetworkService', networkInfoService);

  // angular.module('starter.shared')
  //   .service('CordovaNetworkService', navigatorNetworkService);

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
