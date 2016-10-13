/* jshint -W069, -W041 */
(function() {
  'use strict';
  angular.module('starter.shared')
    .factory('WebAPIService', webAPIService);

  webAPIService.$inject = ['$http', 'WebAPIurl', '$window', '$state'];

  function webAPIService($http, WebAPIurl, $window, $state) {
    var service = new Service();
    return service;

    function Service() {
      var self = this;
      self.downladReonData = downladReonDataCallback;
      self.sendData = sendDataCallback;

      function downladReonDataCallback(reonId, selectedYear, selectedMonth) {
        // TODO add code to download data from online API service and add it to the database
        var url = WebAPIurl + 'api/v1/Reons/ReonData?ReonId=' + reonId;
        return $http.get(url, {
          headers: {
            'Authorization': 'Bearer ' + $window.localStorage['access_token']
          },
          params: {
            ReonId: reonId,
            Year: selectedYear,
            Month: selectedMonth
          }
        }).then(function(resp) {
          var data = {};
          data.customers = resp.data.customers;
          data.waterCounters = resp.data.waterCounters;
          return data;
        }, function(err) {
          if (err.status == 401 || err.status == 0) {
            $window.localStorage.clear();
          }
          
          $state.go("main.login", {
            message: "Проверете ја интернет конекцијата"
          }, null);
        });
      }

      function sendDataCallback() {
        // TODO add code to send the local data changes to the online API service, and clean the local DATA
      }
    }
  }

})();
