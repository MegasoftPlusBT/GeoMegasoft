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
