/* globals _, ionic */
/*jshint -W083 */
(function() {
  'use strict';
  angular.module('starter.shared')
    .factory('AppDataService', appDataService);

  appDataService.$inject = [];

  function appDataService() {
    var service = new Service();
    return service;

    function Service() {
      var self = this;

    }
  }

})();
