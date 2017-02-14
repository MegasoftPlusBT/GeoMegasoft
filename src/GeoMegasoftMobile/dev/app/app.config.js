/*globals cordova, StatusBar */
/*jshint -W083 */
(function() {
  'use strict';
  window.db = null;

  angular.module('starter')
    .config(starterConfig)
    .run(starterRun);

  starterConfig.$inject = ['$compileProvider', '$ionicConfigProvider', '$logProvider'];

  function starterConfig($compileProvider, $ionicConfigProvider, $logProvider) {
    $ionicConfigProvider.navBar.alignTitle('center');
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|ghttps?|ms-appx|x-wmapp0):/);
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|file|blob|cdvfile):|data:image\//);
    $ionicConfigProvider.backButton.icon('ion-ios-arrow-left white-back-btn');
    $logProvider.debugEnabled(true);
  }

  starterRun.$inject = ['$ionicPlatform', '$window', '$cordovaSQLite'];

  function starterRun($ionicPlatform, $window, $cordovaSQLite) {
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

      $window.db = $cordovaSQLite.openDB({
        name: "geoMegaSoft.db",
        location: 'default'
      });
      var createCustomersTableQuery = "CREATE TABLE IF NOT EXISTS customers (ID integer, SifTipID integer, Naziv text, UlicaID integer,  Adresa text, Broj integer, Mesto text, Drzava text, Vlez text, Stan text); ";
      var createWaterCountersTableQuery = "CREATE TABLE IF NOT EXISTS waterCounters (ReonId integer, VidKorId integer, KorisnikId integer, LokacijaId integer, UlicaId integer, Broilo text, Aktive int, Naziv text, Ulica text, Broj text, SostojbaNova text, Mesec text, SlikaSostojba text, HasBeenUpdatedLocally integer); ";
      var createLocalChangesTableQuery = "CREATE TABLE IF NOT EXISTS LocalDataChanges (LocalDataChangeId  integer primary key,ReonId integer, VidKorID integer, KorisnikId integer,  LokacijaId integer,  Broilo text, SostojbaStara text, SostojbaNova text, SlikaSostojba text, lat text, long text, DateCreated text, TypeOfAPICall text, IsSentToAPI text ); ";
      $cordovaSQLite.execute($window.db, createCustomersTableQuery);
      $cordovaSQLite.execute($window.db,  createWaterCountersTableQuery);
      $cordovaSQLite.execute($window.db, createLocalChangesTableQuery);
      //UlicaId in waterCounters in nullable
      //Aktive in waterCounters is boolean, but saved as integer (0 and 1)

    });
  }


})();
