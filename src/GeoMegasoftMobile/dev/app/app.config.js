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
