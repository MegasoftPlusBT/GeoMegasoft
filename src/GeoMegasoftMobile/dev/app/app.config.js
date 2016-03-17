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
