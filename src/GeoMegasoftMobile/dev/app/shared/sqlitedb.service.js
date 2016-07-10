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
      self.DropCreateCustomersTable = DropCreateCustomersTableCallback;

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

    function DropCreateCustomersTableCallback() {
      var q = $q.defer();
      $ionicPlatform.ready(function() {
        $cordovaSQLite.execute(
          $window.db,
          "DROP TABLE IF EXISTS customers"
        ).then(function(result) {
          //console.log('ok', result);
          $cordovaSQLite.execute(
              $window.db, "CREATE TABLE IF NOT EXISTS customers (id integer primary key, data text)")
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
