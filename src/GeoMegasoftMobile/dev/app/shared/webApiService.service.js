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
