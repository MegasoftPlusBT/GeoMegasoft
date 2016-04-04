/*globals  _ */
/*jshint -W083 */
(function() {
  'use strict';


  angular.module('starter')
    .config(starterRoutes);


  starterRoutes.$inject = ['$stateProvider', '$urlRouterProvider'];

  function starterRoutes($stateProvider, $urlRouterProvider) {
    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider
      .state('main', {
        url: '/main',
        cache: false,
        abstract: true,
        controller: 'MainCtrl as mainVm',
        // template: '<ion-nav-view name="subview"></ion-nav-view>'
        templateUrl: 'templates/menu.html'
      })
      .state('main.home', {
        url: '/home',
        cache: false,
        views: {
          'subview': {
            templateUrl: 'templates/home.html',
            controller: 'HomeCtrl as vm'
          }
        }
      })
      .state('main.getarea', {
        url: '/getarea',
        cache: false,
        views: {
          'subview': {
            templateUrl: 'templates/getarea.html',
            controller: 'GetAreaCtrl as vm'
          }
        }
      })
      .state('main.search', {
          url: '/search/:selecetedArea',
        cache: false,
        views: {
          'subview': {
            templateUrl: 'templates/search.html',
            controller: 'SearchCtrl as vm'
          }
        }
      })
      .state('main.results', {
          url: '/results/:vidkorid&:selectedRegion&:inputImePrezime&:inputLokacija',
        cache: false,
        views: {
          'subview': {
            templateUrl: 'templates/results.html',
            controller: 'ResultsCtrl as vm'
          }
        }
      })
      .state('main.userdetails', {
          url: '/userdetails/:vidkorid&:lokacijaID&:korisnikID&:reonID&:broilo',
        cache: false,
        views: {
          'subview': {
            templateUrl: 'templates/userDetails.html',
            controller: 'userDetailsCtrl as vm'
          }
        }
      })
      .state('main.editstate', {
          url: '/editstate/:vidkorid&:lokacijaID&:korisnikID&:reonID&:broilo',
        cache: false,
        views: {
          'subview': {
            templateUrl: 'templates/editState.html',
            controller: 'editStateCtrl as vm'
          }
        }
      })
      .state('noInternetConnection', {
        url: '/noInternet',
        cache: false,
        abstract: false,
        controller: 'InternetConnectionCtrl as vm',
        templateUrl: 'templates/internetConnection.html'
      });




    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/main/home');
  }

})();
