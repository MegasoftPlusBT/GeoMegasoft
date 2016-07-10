/* jshint -W069, -W041 */
(function() {
  'use strict';
  angular.module('starter.shared')
    .factory('LoginAPIService', loginAPIService);

  loginAPIService.$inject = ['$http', 'WebAPIurl', '$window'];

  function loginAPIService($http, WebAPIurl, $window) {
    var service = new Service();
    return service;

    function Service() {
      var self = this;
      self.login = loginCallback;

      function loginCallback(user, pass) {
        var data = "grant_type=password&username=" + user + "&password=" + pass;
        var url = WebAPIurl + 'token';
        return $http.post(url, data, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).success(function(response) {
          $window.localStorage['access_token'] = response.access_token;
          $window.localStorage['token_type'] = response.token_type;
        }).error(function(err, status) {
          $window.localStorage.removeItem('access_token');
          $window.localStorage.removeItem('token_type');

          if (err != null)
            return "* " + err.error;
          else
            return "* Проверете ја интернет конекцијата";
        });
      }

    }
  }

})();
