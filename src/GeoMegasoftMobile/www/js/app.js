(function() {
  'use strict';
  // Ionic Starter App

  // angular.module is a global place for creating, registering and retrieving Angular modules
  // 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
  // the 2nd parameter is an array of 'requires'
  // 'starter.services' is found in services.js
  // 'starter.controllers' is found in controllers.js
  angular.module('starter', [
    'ionic',
    'starter.constants',
    'starter.shared',
    //TODO add modules here
    'ngCordova'
  ]);
})();

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
      .state('main.login', {
        url: '/login/:message',
        cache: false,
        views: {
          'subview': {
            templateUrl: 'templates/login.html',
            controller: 'LoginCtrl as vm'
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
          url: '/results/:selectedRegion&:inputImePrezime&:inputLokacija',
        cache: false,
        views: {
          'subview': {
            templateUrl: 'templates/results.html',
            controller: 'ResultsCtrl as vm'
          }
        }
      })
      .state('main.userdetails', {
          url: '/userdetails/:vidkorid&:lokacijaID&:korisnikID&:reonID&:broilo&:selectedRegion',
        cache: false,
        views: {
          'subview': {
            templateUrl: 'templates/userDetails.html',
            controller: 'userDetailsCtrl as vm'
          }
        }
      })
      .state('main.editstate', {
          url: '/editstate/:vidkorid&:lokacijaID&:korisnikID&:reonID&:broilo&:selectedRegion',
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
    $urlRouterProvider.otherwise('/main/login/');
  }

})();

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
      var createCustomersTableQuery = "CREATE TABLE IF NOT EXISTS customers (ID integer, SifTipID integer, Naziv text, UlicaID integer,  Adresa text, Broj integer, Mesto text, Drzava text, Vlez text, Stan text, Naziv1 text ); ";
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

(function() {
    'use strict';
  angular.module('starter.shared', ['starter.constants','ngCordova','ionic']);

})();

// (function() {
//    'use strict';
//  angular.module('starter.constants', [])
//    .constant('WebAPIurl', 'http://localhost:16952/')
//    ;
// })();

(function () {
    'use strict';
    angular.module('starter.constants', [])
      .constant('WebAPIurl', 'http://geomegasoft.dev.haselt.net/')
    ;
})();


// FLAGS USED: //TODO follow these flags
// $window.localStorage['selected_search']
// $window.localStorage['access_token'] -- token is saved here
// New FLAGS
// $window.localStorage['localReonId'] - if it has value we have local data
// $window.localStorage['isInSynchronizationMode'] - if it has value we are synching right now
// SynchronizationMode will be ongoing on getReon View

// $window.localStorage['localDataMesec'] - if it has value we have local data
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

angular.module('starter.shared')
  .filter('rawHtml', function($sce) {
    return function(val) {
      val = val.replace('<script', '<div style="display:none"');
      return $sce.trustAsHtml(val);
    };
  });

/* globals _, ionic */
/*jshint -W083, -W069, -W041 */
(function () {
  'use strict';
  angular.module('starter.shared')
    .factory('LocalDataService', localDataService);

  localDataService.$inject = ['DbService', '$cordovaSQLite', '$window', '$q', '$ionicPlatform', 'WebAPIurl', '$http', 'CordovaNetworkService'];

  function localDataService(DbService, $cordovaSQLite, $window, $q, $ionicPlatform, WebAPIurl, $http, CordovaNetworkService) {
    var service = new Service();
    return service;

    function Service() {
      var self = this;


      // ------------------------------------------------------------------
      // begin: synchronization functions
      self.setReonFromAPI = SetReonFromAPICallback;
      self.uploadAllChangesToApi = UploadAllChangesToApiCallback;

      function SetReonFromAPICallback(dataFromAPI, selectedArea, selectedMonth) {
        var q = $q.defer();

        //TODO  check if has changes waiting..
        //TODO  clear if it does not
        var hasLocalData = $window.localStorage['localReonId'] != null || $window.localStorage['localReonId'] != undefined;
        if (hasLocalData) {
          // TODO chech if has unsynched changes, (maybe add a param, to delete data even if it has changes)
          CleanLocalReonData();
        }
        var waterCountersQueries = [];
        var customersQueries = [];

        var waterCountersToInsert = [];
        var customersToInsert = [];

        var waterCounterInsertQuery = "INSERT INTO waterCounters (ReonId , VidKorId , KorisnikId, LokacijaId , UlicaId, Broilo , Aktive , Naziv , Ulica, Broj , SostojbaNova, Mesec,SlikaSostojba , HasBeenUpdatedLocally ) VALUES (?, ? , ?, ?, ?, ? , ?, ?, ?, ? , ?, ?,?,?)";
        var customersInsertQuery = "INSERT INTO customers (ID , SifTipID , Naziv , UlicaID ,  Adresa , Broj , Mesto , Drzava , Vlez , Stan , Naziv1 ) VALUES (? , ?, ? , ?,  ? , ? , ? , ?, ? , ?, ? )";
        for (var i = 0; i < dataFromAPI.waterCounters.length; i++) {
          //dataFromAPI.waterCounters[i]
          $window.localStorage['localReonId'] = selectedArea;
          $window.localStorage['localDataMesec'] = selectedMonth;
          var waterCounterParameters = [
            dataFromAPI.waterCounters[i].reonId,
            dataFromAPI.waterCounters[i].vidKorID,
            dataFromAPI.waterCounters[i].korisnikId,
            dataFromAPI.waterCounters[i].lokacijaId,
            dataFromAPI.waterCounters[i].ulicaId,
            dataFromAPI.waterCounters[i].broilo,
            dataFromAPI.waterCounters[i].aktive,
            dataFromAPI.waterCounters[i].naziv,
            dataFromAPI.waterCounters[i].ulica,
            dataFromAPI.waterCounters[i].broj,
            dataFromAPI.waterCounters[i].sostojbaNova,
            dataFromAPI.waterCounters[i].mesec,
            null, //SlikaSostojba
            0 //HasBeenUpdatedLocally
          ];
          waterCountersToInsert.push(waterCounterParameters);
        }
        for (var j = 0; j < dataFromAPI.customers.length; j++) {
          //dataFromAPI.customers[j]
          var customerParameters = [
            dataFromAPI.customers[j].id,
            dataFromAPI.customers[j].sifTipID,
            dataFromAPI.customers[j].naziv,
            dataFromAPI.customers[j].ulicaID,
            dataFromAPI.customers[j].adresa,
            dataFromAPI.customers[j].broj,
            dataFromAPI.customers[j].mesto,
            dataFromAPI.customers[j].drzava,
            dataFromAPI.customers[j].vlez,
            dataFromAPI.customers[j].stan,
            dataFromAPI.customers[j].naziv1
          ];
          customersToInsert.push(customerParameters);
          // customersQueries.push([
          //   customersInsertQuery,
          //   customerParameters
          // ]);
        }

        $ionicPlatform.ready(function () {
          // $cordovaSQLite.execute($window.db, query, parameters)
          $cordovaSQLite.insertCollection($window.db, waterCounterInsertQuery,
            waterCountersToInsert).then(function (res) {
              //q.resolve(res);

              //TODO add another insertCollection call for the customers inside here
              $cordovaSQLite.insertCollection($window.db, customersInsertQuery,
                customersToInsert).then(function (resultCustomers) {
                  $window.localStorage['localReonId'] = selectedArea;
                  q.resolve(res);
                }, function (err) {
                  console.error(err);
                  q.reject(err);
                });
            }, function (error) {
              console.error(error);
              q.reject(error);
            });

        });

        return q.promise;
      }

      function CleanLocalReonData() {
        var q = $q.defer();
        $window.localStorage.removeItem("localReonId");
        $window.localStorage.removeItem("localDataMesec");

        $cordovaSQLite.execute($window.db, "DELETE FROM customers;").then(function (res1) {
          $cordovaSQLite.execute($window.db, "DELETE FROM waterCounters;").then(function (res2) {
            $cordovaSQLite.execute($window.db, "DELETE FROM LocalDataChanges;").then(function (res3) {
              q.resolve(res3);
            }, function (error) {
              q.reject(errror);
            });
          }, function (error) {
            q.reject(errror);
          });
        }, function (error) {
          q.reject(errror);
        });

        // DbService.query("DELETE FROM customers; DELETE FROM waterCounters; DELETE FROM LocalDataChanges; ", null).then(function() {
        //
        // }, function(errror) {
        //   q.reject(errror);
        // });

        return q.promise;
      }

      function UploadAllChangesToApiCallback() {
        var q = $q.defer();
        //TODO make calls one by one, verify update and clear from queue
        //in the meantime display ionicLoading
        var getAllChangesToUploadToAPI = "SELECT * FROM LocalDataChanges WHERE IsSentToAPI = 'false' ORDER BY LocalDataChangeId ASC";
        $ionicPlatform.ready(function () {
          $cordovaSQLite.execute($window.db, getAllChangesToUploadToAPI).then(function (res) {
            var listOfLocalChanges = [];
            for (var i = 0; i < res.rows.length; i++) {
              listOfLocalChanges.push(res.rows.item(i));
            }

            if (listOfLocalChanges.length == 0) {
              console.log('No local changes, we can go on and finish cleaningLocalData');
              //on the end clear local Data
              CleanLocalReonData().then(function (res) {
                q.resolve('noLocalChanges'); //
              }, function (error) {
                q.reject('couldNotReadDatabase');
              });
            } else {
              //we have API calls that we need to make
              var uniqueListOfLocalChanges = [];

              listOfLocalChanges.forEach(function (item) {
                var indexInUnique = uniqueListOfLocalChanges.findIndex(function (b) {
                  return b.Broilo == item.Broilo;
                });

                if (indexInUnique == -1) {
                  uniqueListOfLocalChanges.push(item);
                }
                else {
                  // Setting latest changes to send to API
                  uniqueListOfLocalChanges[indexInUnique].SostojbaNova = item.SostojbaNova;
                  uniqueListOfLocalChanges[indexInUnique].SlikaSostojba = item.SlikaSostojba;
                }
              });
              
              listOfLocalChanges = uniqueListOfLocalChanges;

              // begin: internetConnectionCheck
              CordovaNetworkService.isOnline().then(function (isConnected) {
                if (isConnected) {
                  console.log('we have internetConnection available');

                  // -------------
                  // call to ChainedPromisesFuction
                  // MakeAPICalls(listOfLocalChanges).then(function(resultApiCalls) {
                  //   q.resolve(resultApiCalls);
                  // }, function(errorAPICals) {
                  //   q.reject(errorAPICals);
                  // });

                  MakeAPICallsAsOne(listOfLocalChanges).then(function (resultApiCalls) {

                    CleanLocalReonData().then(function (res) {
                      q.resolve(resultApiCalls); //
                    }, function (error) {
                      q.reject('couldNotReadDatabase');
                    });

                  }, function (errorAPICals) {
                    q.reject(errorAPICals);
                  });


                  // -------------

                } else {
                  q.reject('noInternetConnection');
                }
              }).catch(function () {
                q.reject('noInternetConnection');
              });
              // end: internetConnectionCheck

            }
          }, function (err) {
            console.error(err);
            q.reject('couldNotReadDatabase');
          });
        });

        // //on the end clear local Data
        // CleanLocalReonData().then(function(res) {
        //   q.resolve(res); //
        // }, function(error) {
        //   q.reject(error);
        // });

        return q.promise;
      }

      function MakeAPICallsAsOne(listOfLocalChanges) {
        var q = $q.defer();
        var listToSend = listOfLocalChanges.map(function (dataToSend) {
          var typeOfAction = 1;
          if (dataToSend.TypeOfAPICall == "updateState") {
            typeOfAction = 0;
          }
          var data = {
            "Vidkorid": dataToSend.VidKorID,
            "LokacijaID": dataToSend.LokacijaId,
            "KorisnikID": dataToSend.KorisnikId,
            "ReonID": dataToSend.ReonId,
            "Broilo": dataToSend.Broilo,
            "SostojbaStara": parseInt(dataToSend.SostojbaStara),
            "SostojbaNova": parseInt(dataToSend.SostojbaNova),
            "SlikaSostojba": dataToSend.SlikaSostojba,
            "Lat": dataToSend.lat,
            "Long": dataToSend.long,
            "TypeOfAction": typeOfAction
          };
          return data;
        });


        var url = WebAPIurl + 'api/v1/watercounters/sync';
        $http.defaults.headers.post['Authorization'] = "Bearer " + $window.localStorage['access_token'];
        var mesecToSend = $window.localStorage['localDataMesec'];
        $http.post(url, { ItemsToSave: listToSend, Mesec: mesecToSend }).then(function (resp) {
          if (resp.data.isSucces === true) {
            console.log("Успешно зачувана состојба!");
            q.resolve("Успешно зачувана состојба!");
          } else {
            console.error('Not successfull');
            //q.reject("Неуспешен повик");
            q.resolve("Испратена состојба!");
          }
        }, function (err) {
          if (err.status == 401) {
            q.reject('NotAuthorized');
          } else {
            console.error('Not successfull', err);
            // q.reject('Not successfull');
            q.resolve("Испратена состојба!");
          }
        });
        return q.promise;
      }

      // end: synchronization functions
      // ------------------------------------------------------------------

      // ------------------------------------------------------------------
      // begin: local data functions // API replacements
      self.readCustomerInfo = readCustomerInfoCallback;
      self.searchWaterCounters = searchWaterCountersCallback;
      self.addNewWaterCounter = addNewWaterCounterCallback;
      self.updateWaterCounterState = updateWaterCounterStateCallback;
      self.getLastWaterCounterState = getLastWaterCounterStateCallback;
      self.searchWaterCountersByUserId = searchWaterCountersByUserIdCallback;

      function readCustomerInfoCallback(korisnikID) {
        // TODO GetCustomerInfoByWatterCounterId
        var q = $q.defer();

        //returns :
        //{
        //TipNaKorisnik
        //ShifraNaKorisnik
        //ImeNaziv
        //ShifraNaUlica
        //Adresa
        //KukenBroj
        //Vlez
        //Stan
        //Grad
        //}

        var getCustomerInfoQuery = "SELECT SifTipID, ID, Naziv, UlicaID, Adresa,  Broj, Mesto, Drzava, Vlez, Stan, Naziv1  FROM customers  WHERE ID=" + korisnikID;

        $ionicPlatform.ready(function () {
          $cordovaSQLite.execute($window.db, getCustomerInfoQuery).then(function (res) {
            var output = [];
            for (var i = 0; i < res.rows.length; i++) {
              output.push(res.rows.item(i));
            }
            q.resolve(output);
          }, function (err) {
            console.error(err);
            q.reject(err);
          });
        });

        return q.promise;
      }

      function searchWaterCountersCallback(firstLastName, location, radius, reionId) {
        var q = $q.defer();
        firstLastName = firstLastName.toUpperCase();
        location = location.toUpperCase();
        var searchQuery = "SELECT * from waterCounters WHERE Aktive = 1 ";

        if (location && location.length > 0) {
          searchQuery += "AND " +
            " ( upper(Ulica) like  '%" + location + "%' " +
            " or  upper(Broj) LIKE '%" + location + "%'" +
            "  or (upper(Ulica)+' '+upper(Broj) like '%" + location + "%' )) ";
        }

        if (firstLastName && firstLastName.length > 0) {
          searchQuery += " AND (upper(Naziv) like '%" + firstLastName + "%')";
        }

        searchQuery += " ORDER BY Naziv ";

        $ionicPlatform.ready(function () {
          $cordovaSQLite.execute($window.db, searchQuery).then(function (res) {
            var output = [];
            for (var i = 0; i < res.rows.length; i++) {
              output.push(res.rows.item(i));
            }
            q.resolve(output);
          }, function (err) {
            console.error(err);
            q.reject(err);
          });
        });

        return q.promise;
      }

      function addNewWaterCounterCallback(data, imeNaziv, brShasija) {
        // TODO CreateNewWaterCounter
        var q = $q.defer();
        var addNewWaterCounterToLocalChangesQuery = "INSERT INTO LocalDataChanges (ReonId , VidKorID , KorisnikId ,  LokacijaId ,  Broilo , SostojbaStara , SostojbaNova , SlikaSostojba , lat , long , DateCreated , TypeOfAPICall , IsSentToAPI ) VALUES (? , ? , ? ,  ? ,  ? , ? , ? , ? , ? , ? , ? , ? , ?)";
        var waterCounterInsertQuery = "INSERT INTO waterCounters (ReonId , VidKorId , KorisnikId, LokacijaId , UlicaId, Broilo , Aktive , Naziv , Ulica, Broj , SostojbaNova, Mesec,SlikaSostojba , HasBeenUpdatedLocally) VALUES (?, ? , ?, ?, ?, ? , ?, ?, ?, ? , ?, ?, ?, ?)";

        var slikaSostojbaValue = data.SlikaSostojba;
        if (slikaSostojbaValue == null) {
          slikaSostojbaValue = null;
        } else {
          slikaSostojbaValue = data.SlikaSostojba;
        }

        var itemToSaveInWaterCounters = [
          data.ReonId,
          data.VidKorID,
          data.KorisnikId,
          data.LokacijaId,
          null,
          brShasija,
          1,
          imeNaziv,
          null,
          null,
          data.SostojbaNova,
          data.null,
          slikaSostojbaValue, //SlikaSostojba text,
          1 //HasBeenUpdatedLocally integer
        ];

        var dataToSave = Object.keys(data).map(function (key) {
          return data[key];
        });

        $ionicPlatform.ready(function () {
          $cordovaSQLite.execute($window.db, addNewWaterCounterToLocalChangesQuery, dataToSave).then(function (res) {

            $cordovaSQLite.execute($window.db, waterCounterInsertQuery, itemToSaveInWaterCounters).then(function (result) {
              q.resolve(result);
            }, function (error) {
              console.error(error);
              q.reject(error);
            });

          }, function (err) {
            console.error(err);
            q.reject(err);
          });
        });

        return q.promise;
      }

      function updateWaterCounterStateCallback(data) {
        // TODO InsertNewStateForWaterCounter
        var q = $q.defer();
        var newWaterCounterStateInsertQuery = "INSERT INTO LocalDataChanges (ReonId , VidKorID , KorisnikId ,  LokacijaId ,  Broilo , SostojbaStara , SostojbaNova , SlikaSostojba , lat , long , DateCreated , TypeOfAPICall , IsSentToAPI ) VALUES (? , ? , ? ,  ? ,  ? , ? , ? , ? , ? , ? , ? , ? , ?)";

        var slikaSostojbaValue = data.SlikaSostojba;
        if (slikaSostojbaValue == null) {
          slikaSostojbaValue = null;
        } else {
          slikaSostojbaValue = "'" + data.SlikaSostojba + "'";
        }

        var updateStateInWaterCountersQuery = "UPDATE `waterCounters` SET SostojbaNova='" + data.SostojbaNova + "', SlikaSostojba = " + slikaSostojbaValue + ", HasBeenUpdatedLocally=1 WHERE Aktive = 1 AND VidKorId = " +
          data.VidKorID + " AND LokacijaId = " + data.LokacijaId +
          " AND KorisnikId =" + data.KorisnikId + " AND ReonId = " + data.ReonId + " AND Broilo = '" + data.Broilo + "'";

        var dataToSave = Object.keys(data).map(function (key) {
          return data[key];
        });

        $ionicPlatform.ready(function () {
          $cordovaSQLite.execute($window.db, newWaterCounterStateInsertQuery, dataToSave).then(function (res) {
            $cordovaSQLite.execute($window.db, updateStateInWaterCountersQuery, null).then(function (result) {
              q.resolve(result);
            }, function (error) {
              console.error(error);
              q.reject(error);
            });
          }, function (err) {
            console.log(err);
            q.reject(err);
          });
        });

        return q.promise;
      }

      function getLastWaterCounterStateCallback(vidkorid, lokacijaID, korisnikID, reonID, broilo) {
        var q = $q.defer();
        var searchQuery = "SELECT * from waterCounters WHERE Aktive = 1 AND VidKorId = " + vidkorid + " AND LokacijaId = " + lokacijaID +
          " AND KorisnikId =" + korisnikID + " AND ReonId = " + reonID + " AND Broilo = '" + broilo + "'";

        $ionicPlatform.ready(function () {
          $cordovaSQLite.execute($window.db, searchQuery).then(function (res) {
            var output = [];
            for (var i = 0; i < res.rows.length; i++) {
              output.push(res.rows.item(i));
            }
            q.resolve(output);
          }, function (err) {
            console.error(err);
            q.reject(err);
          });
        });

        return q.promise;
      }

      function searchWaterCountersByUserIdCallback(korisnikId) {
        //TODO search for newly create WaterCounters in localDb
        var q = $q.defer();
        var searchQuery = "SELECT * from waterCounters WHERE Aktive = 1 AND KorisnikId = " + korisnikId + " ORDER BY Naziv ";

        $ionicPlatform.ready(function () {
          $cordovaSQLite.execute($window.db, searchQuery).then(function (res) {
            var output = [];
            for (var i = 0; i < res.rows.length; i++) {
              output.push(res.rows.item(i));
            }
            q.resolve(output);
          }, function (err) {
            console.log(err);
            q.reject(err);
          });
        });

        return q.promise;
      }

      // end: local data functions // API replacements
      // ------------------------------------------------------------------

      // ------------------------------------------------------------------
      // begin: private functions
      //self._cleanLocalDatabase = cleanLocalDatabaseCallBack;

      // end: private functions
      // ------------------------------------------------------------------
    }
  }

})();

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

(function() {
  'use strict';

  angular.module('starter.shared')
    .factory('CordovaNetworkService', networkInfoService);

  // angular.module('starter.shared')
  //   .service('CordovaNetworkService', navigatorNetworkService);

  navigatorNetworkService.$inject = ['$rootScope', '$ionicPlatform', '$q'];

  function navigatorNetworkService($rootScope, $ionicPlatform, $q) {
    // Get Cordova's global Connection object or emulate a smilar one
    var Connection = window.Connection || {
      'ETHERNET': 'ethernet',
      'WIFI': 'wifi',
      'CELL_2G': 'cell_2g',
      'CELL_3G': 'cell_3g',
      'CELL_4G': 'cell_4g',
      'CELL': 'cell',
      'EDGE': 'edge',
      'UNKNOWN': 'unknown'
    };

    var asyncGetConnection = function() {
      var q = $q.defer();
      $ionicPlatform.ready(function() {
        if (navigator.connection) {
          q.resolve(navigator.connection);
        } else {
          q.reject('navigator.connection is not defined');
        }
      });
      return q.promise;
    };

    return {
      isOnline: function() {
        return asyncGetConnection().then(function(networkConnection) {
          var isConnected = false;

          switch (networkConnection.type) {
            case Connection.ETHERNET:
            case Connection.WIFI:
            case Connection.CELL_2G:
            case Connection.CELL_3G:
            case Connection.CELL_4G:
            case Connection.CELL:
              //console.log(Connection.WIFI);
              //console.log(networkConnection.type);
              isConnected = true;
              break;
          }
          return isConnected;
        });
      }
    };
  }

  networkInfoService.$inject = ['$cordovaNetwork', '$q', '$ionicPlatform', '$timeout'];

  function networkInfoService($cordovaNetwork, $q, $ionicPlatform, $timeout) {
    var service = new Service();
    return service;


    function Service() {
      var self = this;
      // self.isOnline = $cordovaNetwork.isOnline();
      self.isOnline = IsOnline;

      function IsOnline() {
        var q = $q.defer();
        //console.log('in isOnline');
        var timeoutPromise = $timeout(function() {
          q.reject(false); //aborts the request when timed out
          //console.log("Timed out");
        }, 2000);

        $ionicPlatform.ready(function() {
          if ($cordovaNetwork.isOnline()) {
            $timeout.cancel(timeoutPromise);
            q.resolve(true);
          } else {
            q.reject(false);
          }
        });
        return q.promise;
      }
    }

  }
})();

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


(function() {
  'use strict';
  angular.module('starter')
    .controller('editStateCtrl', editStateController);

  editStateController.$inject = ['$scope', '$state', '$timeout', '$stateParams', '$window', '$ionicLoading', 'CordovaNetworkService', '$ionicPopup', '$rootScope', '$cordovaCamera', '$http', '$location', 'WebAPIurl', '$cordovaGeolocation', 'LocalDataService'];

  function editStateController($scope, $state, $timeout, $stateParams, $window, $ionicLoading, CordovaNetworkService, $ionicPopup, $rootScope, $cordovaCamera, $http, $location, WebAPIurl, $cordovaGeolocation, LocalDataService) {
    var vm = this;
    initVariables();

    function initVariables() {
      vm.someArray = [];
      vm.newCounter = false;
      vm.HasBeenUpdatedLocally = false; //TODO check from localDB
    }

    $scope.$on('$ionicView.loaded', OnViewLoad);
    $scope.$on('$ionicView.beforeEnter', OnBeforeEnter);
    $scope.$on('$ionicView.afterLeave', onAfterLeave);

    function OnViewLoad() {
      vm.vidkorid = $stateParams.vidkorid;
      vm.lokacijaID = $stateParams.lokacijaID;
      vm.korisnikID = $stateParams.korisnikID;
      vm.reonID = $stateParams.reonID;
      vm.broilo = $stateParams.broilo;
      LocalDataService.getLastWaterCounterState(
        $stateParams.vidkorid,
        $stateParams.lokacijaID,
        $stateParams.korisnikID,
        $stateParams.reonID,
        $stateParams.broilo
      ).then(function(res) {
        console.log(res);
        vm.imeNaziv = res[0].Naziv;
        vm.broilo = res[0].Broilo;
        vm.state = {
          before: parseInt(res[0].SostojbaNova),
          slika: res[0].SlikaSostojba,
          mesec: res[0].Mesec
        };
        vm.HasBeenUpdatedLocally = res[0].HasBeenUpdatedLocally;
      }, function(err) {
        console.log(err);
      });
    }

    function OnBeforeEnter() {}

    function onAfterLeave() {}

    function submitSaveNewState() {
      if (vm.state.new == null || vm.state.new < vm.state.before) {
        $ionicPopup.alert({
          title: 'Новата состојба е невалидна',
          template: 'Внесете состојба поголема од претходната.'
        });
        return;
      }

      vm.errors = {
        required: ""
      };

      $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });

      var posOptions = {
        timeout: 3000,
        enableHighAccuracy: false
      };
      var latValue = "0";
      var longValue = "0";
      var result = $cordovaGeolocation
        .getCurrentPosition(posOptions)
        .then(function(position) {
          latValue = position.coords.latitude;
          longValue = position.coords.longitude;
        }, function(err) {
          // error
          //console.log(err);
        });
      $timeout(function() {
        var updatedWaterCounterStateData = {
          ReonId: $stateParams.reonID,
          VidKorID: $stateParams.vidkorid,
          KorisnikId: $stateParams.korisnikID,
          LokacijaId: $stateParams.lokacijaID,
          Broilo: $stateParams.broilo,
          SostojbaStara: parseInt(vm.state.before),
          SostojbaNova: parseInt(vm.state.new),
          SlikaSostojba: vm.state.slika,
          lat: latValue,
          long: longValue,
          DateCreated: (new Date()).toJSON(),
          TypeOfAPICall: 'updateState',
          IsSentToAPI: false
        };

        LocalDataService.updateWaterCounterState(updatedWaterCounterStateData).then(function(result) {
          $ionicLoading.hide();
          $ionicLoading.show({
            template: "Успешно зачувана состојба!",
            noBackdrop: true,
            duration: 2000
          });
          $timeout(function() {
            $ionicLoading.hide();
            $state.go("main.search", {
              'selecetedArea': $stateParams.reonID
            });
          }, 3000);
        }, function(error) {
          $ionicLoading.hide();
          vm.errors = {
            required: "грешка при зачувување."
          };
        });


      }, 1000);
    }

    function submitNewCounter() {
      console.log('create new counter');

      //TODO insert call
      //create new API call
      //on API create counter, and then set state
      //on success return to search

      $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });
      // console.log(vm.state.before + " " + vm.state.new);
      var posOptions = {
        timeout: 3000,
        enableHighAccuracy: false
      };
      var latValue = "0";
      var longValue = "0";
      var result = $cordovaGeolocation
        .getCurrentPosition(posOptions)
        .then(function(position) {
          latValue = position.coords.latitude;
          longValue = position.coords.longitude;
        }, function(err) {
          // error
          //console.log(err);
        });
      $timeout(function() {

        // var data = {
        //   "Vidkorid": $stateParams.vidkorid,
        //   "LokacijaID": $stateParams.lokacijaID,
        //   "KorisnikID": $stateParams.korisnikID,
        //   "ReonID": $stateParams.reonID,
        //   "Broilo": vm.brShasija,
        //   "Sostojba": parseInt(vm.state.new),
        //   "SlikaSostojba": vm.state.slika,
        //   "Lat": lat,
        //   "Long": long
        // };
        // var newValue = parseInt(vm.state.new);

        var updatedWaterCounterStateData = {
          ReonId: $stateParams.reonID,
          VidKorID: $stateParams.vidkorid,
          KorisnikId: $stateParams.korisnikID,
          LokacijaId: $stateParams.lokacijaID,
          Broilo: vm.brShasija,
          SostojbaStara: 0,
          SostojbaNova: parseInt(vm.state.new),
          SlikaSostojba: vm.state.slika,
          lat: latValue,
          long: longValue,
          DateCreated: (new Date()).toJSON(),
          TypeOfAPICall: 'newWaterCounter',
          IsSentToAPI: false
        };

        LocalDataService.addNewWaterCounter(updatedWaterCounterStateData,vm.imeNaziv,vm.brShasija).then(function(result) {
          $ionicLoading.hide();
          $ionicLoading.show({
            template: "Успешна промена!",
            noBackdrop: true,
            duration: 2000
          });
          $timeout(function() {
            $ionicLoading.hide();
            $state.go("main.search", {
              'selecetedArea': $stateParams.reonID
            });
          }, 3000);
        }, function(error) {
          $ionicLoading.hide();
          vm.errors = {
            required: "грешка при зачувување."
          };
        });



      }, 1000);

    }

    function validateNewCounter() {
      if (vm.state.new == null || vm.state.new < 1) {
        $ionicPopup.alert({
          title: 'Новата состојба е невалидна',
          template: 'Внесете валидна состојба'
        });
        return false;
      }
      if (vm.brShasija == null || vm.brShasija.length < 1) {
        $ionicPopup.alert({
          title: '',
          template: 'Внеси број на шасија.'
        });
        return false;
      }
    }
    vm.saveNewState = function() {
      if (vm.newCounter == true) {
        if (validateNewCounter() == false) {
          return;
        }
        //insert new counter and then save new state
        submitNewCounter();
      } else {
        submitSaveNewState();
      }
    };

    vm.removImage = function() {
      vm.state.slika = null;
    };
    vm.takePhoto = function() {
      var options = {
        quality: 75,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 300,
        targetHeight: 225,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false
      };

      $cordovaCamera.getPicture(options).then(function(imageData) {
        vm.state.slika = "data:image/jpeg;base64," + imageData;
      }, function(err) {
        //console.log("error taking photo", err);
      });
    };

    vm.choosePhoto = function() {
      var options = {
        quality: 75,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 300,
        targetHeight: 225,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false
      };

      $cordovaCamera.getPicture(options).then(function(imageData) {
        vm.state.slika = "data:image/jpeg;base64," + imageData;
      }, function(err) {
        //console.log("error choosing photo", err);
      });
    };

  }



})();

/* jshint -W069, -W041 */
(function () {
  'use strict';
  angular.module('starter')
    .controller('GetAreaCtrl', GetAreaController);

  GetAreaController.$inject = ['$scope', '$state', '$timeout', '$stateParams', '$window', '$ionicLoading', 'CordovaNetworkService', '$ionicPopup', '$rootScope', '$http', 'WebAPIurl', 'WebAPIService', 'LocalDataService'];

  function GetAreaController($scope, $state, $timeout, $stateParams, $window, $ionicLoading, CordovaNetworkService, $ionicPopup, $rootScope, $http, WebAPIurl, WebAPIService, LocalDataService) {
    var vm = this;
    initVariables();
    vm.months =
      [
        { display: 1, value: "01" },
        { display: 2, value: "02" },
        { display: 3, value: "03" },
        { display: 4, value: "04" },
        { display: 5, value: "05" },
        { display: 6, value: "06" },
        { display: 7, value: "07" },
        { display: 8, value: "08" },
        { display: 9, value: "09" },
        { display: 10, value: "10" },
        { display: 11, value: "11" },
        { display: 12, value: "12" }
      ];
    vm.years = [2015, 2016, 2017, 2018, 2019, 2020, 2021]; //TODO, if it is not necessary remove 2015

    vm.selectedMonth = vm.months[0];
    vm.selectedYear = 2016;

    function initVariables() {
      vm.hasReonsList = false;
      vm.data = {
        selectArea: null,
        items: []
      };
    }

    $scope.$on('$ionicView.loaded', OnViewLoad);
    $scope.$on('$ionicView.beforeEnter', OnBeforeEnter);
    $scope.$on('$ionicView.afterLeave', onAfterLeave);

    vm.goToSearch = function () {

      if (vm.data.selectArea == null || vm.data.selectArea == undefined) {
        vm.errors = {
          required: "* Изберете реон"
        };
      } else {
        $state.go("main.search", {
          'selecetedArea': vm.data.selectArea
        });
        $window.localStorage['selected_search'] = vm.data.selectArea;
      }
    };

    vm.downloadReonData = function () {
      if (vm.data.selectArea == null) {
        vm.errors.required = "Одберете реон за преземање.";
        return;
      }

      if (($window.localStorage['localReonId'] != null && $window.localStorage['localReonId'] != undefined)) {
        vm.errors.required = "Недозволена акција, направете синхронизација.";
        return;
      }
      $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });

      WebAPIService.downladReonData(vm.data.selectArea, vm.selectedYear, vm.selectedMonth.value).then(function (data) {
        if(data.waterCounters == undefined || data.waterCounters == null || data.waterCounters.length == 0){
          vm.errors.required = "Не постојат броила за селектираните опции.";
          $ionicLoading.hide();
          return;
        }

        LocalDataService.setReonFromAPI(data, vm.data.selectArea, ""+vm.selectedYear+"/"+vm.selectedMonth.value).then(function (result) {
          console.log('Data is inserted in local DB');
          $ionicLoading.hide();
          $state.go("main.search", {
            'selecetedArea': $window.localStorage['localReonId']
          });
        }, function (err) {
          $ionicLoading.hide();
        });
      }, function (error) {
        $ionicLoading.hide();
      });
    };
    vm.synchronize = function () {

      if ($window.localStorage['localReonId'] == null && $window.localStorage['localReonId'] == undefined) {
        vm.errors.required = "Симнете податоци за реон";
        return;
      }

      $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });

      LocalDataService.uploadAllChangesToApi().then(function (result) {
        // console.log('all data is uploaded and cleared');
        vm.errors.required = "Успешно завршена синхронизација";
        $ionicLoading.hide();
      }, function (err) {
        if (err == "noInternetConnection") {
          vm.errors.required = "Поврзете се на интернет";
        }
        console.log('there was an error', err);
        $ionicLoading.hide();
      });
    };

    function OnViewLoad() {
      $stateParams.selecetedArea = vm.data.selectArea;
      getReonsList();
      vm.errors = {
        required: ""
      };
    }

    function getReonsList() {
      var url = WebAPIurl + 'api/v1/Reons/ReonList';
      $http.get(url, {
        headers: {
          'Authorization': 'Bearer ' + $window.localStorage['access_token']
        }
      }).then(function (resp) {
        //console.log('Success', resp);
        vm.data.items = resp.data.items;
        vm.hasReonsList = true;
        // For JSON responses, resp.data contains the result
      }, function (err) {
        if (err.status == 401) {
          $window.localStorage.clear();
          $state.go("main.login");
        } else {
          //conso.log(err.data.message);
        }
      });
    }

    function OnBeforeEnter() {
      // if($window.localStorage['localReonId'] != null && $window.localStorage['localReonId'] != undefined){
      //   $state.go("main.search", {
      //     'selecetedArea': $window.localStorage['localReonId']
      //   });
      //   $window.localStorage['selected_search'] = $window.localStorage['localReonId'];
      // }
    }

    function onAfterLeave() { }

  }



})();

/* jshint -W098, -W069, -W041 */
(function() {
  'use strict';
  angular.module('starter')
    .controller('LoginCtrl', LoginController);

  LoginController.$inject = ['$scope', '$state', '$timeout', '$stateParams', '$window', '$ionicLoading', 'CordovaNetworkService', '$ionicPopup', '$rootScope', '$http', 'WebAPIurl', 'LoginAPIService'];

  function LoginController($scope, $state, $timeout, $stateParams, $window, $ionicLoading, CordovaNetworkService, $ionicPopup, $rootScope, $http, WebAPIurl, LoginAPIService) {
    var vm = this;
    initVariables();

    function initVariables() {
      vm.someArray = [];
      vm.user = {};
    }

    $scope.$on('$ionicView.loaded', OnViewLoad);
    $scope.$on('$ionicView.beforeEnter', OnBeforeEnter);
    $scope.$on('$ionicView.afterLeave', onAfterLeave);


    function OnViewLoad() {
      //check if already logged in
      //check if has reon
      if($window.localStorage['access_token'] != null && $window.localStorage['access_token'] != undefined){
        $state.go("main.search", {
          'selecetedArea': $window.localStorage['localReonId']
        });
      }
    }

    vm.login = function() {
      var user = vm.user.username;
      var pass = vm.user.password;
      if (user != null && user != undefined && pass != null && pass != undefined) {
        LoginAPIService.login(user, pass).then(function() {
          $state.go("main.search", {
            'selecetedArea': $window.localStorage['localReonId']
          });
        }, function(error) {
          vm.errors = {
            required: error
          };
        });
      }
    };

    function OnBeforeEnter() {
      if ($stateParams.message != null && $stateParams.message.length > 0) {
        vm.errors = {
          required: "* " + $stateParams.message
        };
      }
    }

    function onAfterLeave() {}

  }
})();

/* globals _,ionic */
/* jshint -W098 */
(function() {
  'use strict';

  angular.module('starter')
    .controller('InternetConnectionCtrl', InternetConnectionController);

  InternetConnectionController.$inject = ['$log', '$scope', '$interval', '$timeout', '$rootScope', '$q', '$state', '$ionicPopup',  '$ionicHistory', 'CordovaNetworkService'];

  function InternetConnectionController($log, $scope, $interval, $timeout, $rootScope, $q, $state, $ionicPopup,  $ionicHistory, CordovaNetworkService) {
    var vm = this;
    vm.message = "NO INTERNET MESSAGE HERE";
    $scope.$on("$destroy", ViewOnDestroy);
    vm.intervalPromise = undefined;

    function ViewOnDestroy(event) {
      if (vm.intervalPromise !== undefined) {
        $interval.cancel(vm.intervalPromise);
      }
      vm.intervalPromise = undefined;
    }

    $scope.$on('$ionicView.enter', function() {
      vm.intervalPromise = $interval(function() {
        //set interval to try and get content
        CheckInternetConnection();
      }, 4000);
    });

    function CheckInternetConnection() {
      vm.message = "...";
      CordovaNetworkService.isOnline().then(isOnlineSuccess).catch(isOnlineFail);
    }

    function isOnlineFail() {
      vm.message = "PLEASE CONNECT MESSAGE HERE";
    }

    function isOnlineSuccess(isConnected) {
      if (isConnected) {
        vm.message = "...";
        $state.go('main.gotodefault');
      }
    }

  }

})();

/* globals _,ionic */
/* jshint -W098, -W069 */
(function () {
    'use strict';

    angular.module('starter')
      .controller('MainCtrl', MainController);

    MainController.$inject = ['$log', '$scope', '$interval', '$timeout', '$rootScope', '$q', '$state', '$ionicPopup', '$ionicHistory', '$window', '$stateParams'];

    function MainController($log, $scope, $interval, $timeout, $rootScope, $q, $state, $ionicPopup, $ionicHistory, $window, $stateParams) {
        var mainVm = this;
        mainVm.logo = '';

        $scope.$on("$destroy", ViewOnDestroy);

        function ViewOnDestroy(event) {

        }
        mainVm.check = function () {
            return $state.current.name == 'main.login';
        };

        mainVm.checkArea = function () {
            return $state.current.name != 'main.getarea';
        };

        mainVm.logOut = function () {
            $window.localStorage.removeItem('access_token');
            $state.go("main.login");
        };

        mainVm.navigateToState = function (name, params) {
            if (name === "main.login") {
                $ionicHistory.nextViewOptions({
                    disableBack: true
                });
            } else {
                $ionicHistory.nextViewOptions({
                    disableBack: false
                });
            }
            $state.go(name, params);
        };
        mainVm.search = function () {
            $state.go("main.search", { 'selecetedArea': $window.localStorage['selected_search'] });
        };
        mainVm.area = function () {
            $state.go("main.getarea");
        };
    }
})();

(function() {
  'use strict';
  angular.module('starter')
    .controller('ResultsCtrl', ResultsController);

  ResultsController.$inject = ['$scope', '$state', '$timeout', '$stateParams', '$window', '$ionicLoading', 'CordovaNetworkService', '$ionicPopup', '$rootScope', '$http', 'WebAPIurl', 'LocalDataService'];

  function ResultsController($scope, $state, $timeout, $stateParams, $window, $ionicLoading, CordovaNetworkService, $ionicPopup, $rootScope, $http, WebAPIurl, LocalDataService) {
    var vm = this;
    initVariables();

    function initVariables() {
      vm.someArray = [];
    }

    $scope.$on('$ionicView.loaded', OnViewLoad);
    $scope.$on('$ionicView.beforeEnter', OnBeforeEnter);
    $scope.$on('$ionicView.afterLeave', onAfterLeave);

    function OnViewLoad() {
      $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });
      $scope.regionId = $stateParams.selectedRegion;
      $scope.imePrezime = $stateParams.inputImePrezime;
      $scope.lokacija = $stateParams.inputLokacija;
      // var searchParameters = {
      //     "firstLastName": $stateParams.inputImePrezime,
      //     "location": $stateParams.inputLokacija,
      //     "radius": 0,
      //     "reionId": parseInt($stateParams.selectedRegion)
      // };
      // vm.items = [1];
      // var url = WebAPIurl + 'api/v1/watercounters/search';
      // $http.defaults.headers.post['Authorization'] = "Bearer " + $window.localStorage['access_token'];
      // $http.post(url, searchParameters).then(function (resp) {
      //     $ionicLoading.hide();
      //     vm.items = resp.data.items;
      // }, function (err) {
      //   $window.localStorage.clear();
      //   $ionicLoading.hide();
      //   $state.go("main.login",{message:"Проверете ја интернет конекцијата"},null);
      // });

      vm.items = [1];
      LocalDataService.searchWaterCounters($stateParams.inputImePrezime, $stateParams.inputLokacija, 0, parseInt($stateParams.selectedRegion)).then(
        function(searchResult) {
          vm.items = searchResult;
          $ionicLoading.hide();
        },
        function(error) {
          $ionicLoading.hide();
          console.log('no items found');
        }
      );
    }

    vm.openDetails = function(item) {
      $state.go('main.userdetails', {
        vidkorid: item.VidKorId,
        lokacijaID: item.LokacijaId,
        korisnikID: item.KorisnikId,
        reonID: item.ReonId,
        broilo: item.Broilo
      });
    };

    function OnBeforeEnter() {}

    function onAfterLeave() {}

  }
})();

(function() {
  'use strict';
  angular.module('starter')
    .controller('SearchCtrl', SearchController);

  SearchController.$inject = ['$scope', '$state', '$timeout', '$stateParams', '$window', '$ionicLoading', 'CordovaNetworkService', '$ionicPopup', '$rootScope'];

  function SearchController($scope, $state, $timeout, $stateParams, $window, $ionicLoading, CordovaNetworkService, $ionicPopup, $rootScope) {
    var vm = this;
    initVariables();

    function initVariables() {
      vm.someArray = [];
      vm.search = {
        imeprezime: '',
        lokacija: ''
      };
      vm.errors = {
        required: ""
      };
    }

    $scope.$on('$ionicView.loaded', OnViewLoad);
    $scope.$on('$ionicView.beforeEnter', OnBeforeEnter);
    $scope.$on('$ionicView.afterLeave', onAfterLeave);

    function OnViewLoad() {}

    vm.search = function() {
      if ($window.localStorage['localReonId'] == null || $window.localStorage['localReonId'] == undefined) {
        vm.errors.required = "Недозволена акција, преземете реон.";
        return;
      }

      $state.go('main.results', {
        selectedRegion: $window.localStorage['localReonId'],
        inputImePrezime: vm.search.imeprezime,
        inputLokacija: vm.search.lokacija
      });
    };

    function OnBeforeEnter() {}

    function onAfterLeave() {}

  }
})();

/* jshint -W098, -W069, -W040 */
(function() {
  'use strict';
  angular.module('starter')
    .controller('userDetailsCtrl', userDetailsController);

  userDetailsController.$inject = ['$scope', '$state', '$timeout', '$stateParams', '$window', '$ionicLoading', 'CordovaNetworkService', '$ionicPopup', '$rootScope', '$http', 'WebAPIurl', 'LocalDataService'];

  function userDetailsController($scope, $state, $timeout, $stateParams, $window, $ionicLoading, CordovaNetworkService, $ionicPopup, $rootScope, $http, WebAPIurl, LocalDataService) {
    var vm = this;
    initVariables();

    function initVariables() {
      vm.someArray = [];
    }

    $scope.$on('$ionicView.loaded', OnViewLoad);
    $scope.$on('$ionicView.beforeEnter', OnBeforeEnter);
    $scope.$on('$ionicView.afterLeave', onAfterLeave);

    function OnViewLoad() {
      vm.vidkorID = $stateParams.vidkorid;
      vm.lokacijaID = $stateParams.lokacijaID;
      vm.korisnikID = $stateParams.korisnikID;
      vm.reonID = $stateParams.reonID;
      vm.broilo = $stateParams.broilo;

      $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0,
        duration: 2000
      });

      LocalDataService.readCustomerInfo($stateParams.korisnikID).then(
        function(res) {
          if (res[0].SifTipID == 5)
            vm.tipNaKorisnik = "Физичко лице";
          else
            vm.tipNaKorisnik = "Правно лице";

          vm.shifraNaKorisnik = res[0].ID;
          vm.imeNaziv = res[0].Naziv;
          vm.shifraNaUlica = res[0].UlicaID;
          vm.kukenBroj = res[0].Broj;
          vm.vlez = res[0].Vlez;
          vm.stan = res[0].Stan;
          vm.grad = res[0].Grad;
          vm.adresa = res[0].Adresa;
          vm.ulica = res[0].Ulica;

          LocalDataService.searchWaterCountersByUserId(vm.shifraNaKorisnik).then(
            function(searchResult) {
              vm.items = searchResult;
              $ionicLoading.hide();
            },
            function(error) {
              $ionicLoading.hide();
              console.log('no items found');
            });

          //TODO search water counters for this customer
          //vm.items = res[0].WaterCounters;
        },
        function(err) {
          //error
          console.log(err);
        }
      );
      // var url = WebAPIurl + 'api/v1/customers/customerinfo';
      // $http.get(url, {
      //     headers: { 'Authorization': 'Bearer ' + $window.localStorage['access_token'] },
      //     params: { korisnikID: $stateParams.korisnikID }
      // }).then(function (resp) {
      //     vm.tipNaKorisnik = resp.data.tipNaKorisnik;
      //     vm.shifraNaKorisnik = resp.data.shifraNaKorisnik;
      //     vm.imeNaziv = resp.data.imeNaziv;
      //     vm.shifraNaUlica = resp.data.shifraNaUlica;
      //     vm.kukenBroj = resp.data.kukenBroj;
      //     vm.vlez = resp.data.vlez;
      //     vm.stan = resp.data.stan;
      //     vm.grad = resp.data.grad;
      //     vm.adresa=resp.data.adresa;
      //     vm.items = resp.data.waterCounters;
      // }, function (err) {
      //     if (err.status == 401 || err.status == 0) {
      //         $window.localStorage.clear();
      //     }
      //     $state.go("main.login",{message:"Проверете ја интернет конекцијата"},null);
      // });
    }

    function OnBeforeEnter() {
      $ionicLoading.hide();
    }

    function onAfterLeave() {}

    vm.getItemClass = function(item) {
      var newClass = '';
      if (vm.broilo == item.Broilo) {
        newClass = 'selectedItem';
      }
      return "item-stable " + newClass;
    };

    vm.navigateToUserDetails = function(item) {
      var data = {
        vidkorid: item.VidKorId,
        lokacijaID: item.LokacijaId,
        korisnikID: item.KorisnikId,
        reonID: item.ReonId,
        broilo: item.Broilo
      };
      $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0,
        duration: 2000
      });
      $timeout(function() {
        $state.go('main.userdetails', data, null);
      }, 2000);
    };
  }



})();

angular.module("starter").run(["$templateCache", function($templateCache) {$templateCache.put("./templates/editState.html","<ion-view class=\"hs-view-home has-header bar-calm\" view-title=Состојба content=\"\" scroll=false><ion-content class=has-header style=padding-top:10px; content=\"\" scroll=true><div style=\"margin-left: 10%;margin-top: 20px;margin-bottom: 20px;color: red;margin-right: 10%;\" ng-if=\"vm.HasBeenUpdatedLocally == 1\" ng-hide=vm.newCounter><p>Внимание, за ова броило имате внесено податок за овој месец.</p></div><div class=\"row row-center\" style=\"width:80%;margin-left: 10%; margin-right: 10%;\"><div class=col><ion-item class=item-stable style=max-height:70%><div class=rowFull><b>Име/назив</b> :{{vm.imeNaziv}}</div><div class=rowFull><b>Броило</b>: {{vm.broilo}}</div><div class=rowFull><b>Стара состојба</b>: {{vm.state.before}}<ion-checkbox ng-model=vm.newCounter class=new-counter-checkbox></ion-checkbox></div><div class=rowFull><b>Месец</b>: {{vm.state.mesec}}</div></ion-item></div></div><div class=\"row row-center\"><div class=col><div class=list><div class=\"item item-input inputElement\" ng-show=vm.newCounter><input ng-model=vm.brShasija type=text placeholder=\"Број на шасија\"></div><div class=\"item item-input inputElement\"><input ng-model=vm.state.new type=number min=1 placeholder=\"Нова состојба\" required=\"\"></div><input type=hidden ng-model=vm.state.slika><div style=\"margin-left: 10%; color:red\"><p>{{vm.errors.required}}</p></div><button class=\"button icon-right ion-camera\" style=\"width: 80%;text-align: center;margin-left: 10%;margin-bottom:20px;\" ng-click=vm.takePhoto()>Направи фотографија</button> <button class=\"button icon-right ion-image\" style=\"width: 80%;text-align: center;margin-left: 10%;\" ng-click=vm.choosePhoto()>Прикачи фотографија</button><p>{{errorMessage}}</p></div></div></div><div class=\"row row-center\" ng-if=\"vm.state.slika !== undefined&&vm.state.slika!=null\"><div class=\"col col-75\"><div class=list><div class=\"item item-thumbnail-left\" href=# style=margin-left:13.25%><img ng-show=\"vm.state.slika !== undefined\" ng-src={{vm.state.slika}}><h2>{{vm.state.mesec}}</h2></div></div></div><div class=\"col col-25\"><div class=list><button class=\"button button-positive\" ng-click=vm.removImage()><i class=\"icon ion-android-close\"></i></button></div></div></div><div class=\"row row-center\"><div class=col><div class=list><button class=\"submitButton button button-balanced\" ng-click=vm.saveNewState()><!--ui-sref=\"main.results\">-->ВНЕСИ</button></div></div></div></ion-content></ion-view>");
$templateCache.put("./templates/getarea.html","<ion-view class=\"hs-view-home has-header bar-calm\" title=Реони overflow-scroll=false><ion-content class=has-header style=padding-top:20%; content=\"\" scroll=false><div class=\"row row-center\" style=max-height:70%;><div class=col><div class=list><select name=selectArea id=selectArea ng-model=vm.data.selectArea class=\"form-control incheck\"><option value=\"\">Реон...</option><!--not selected / blank option--><option ng-repeat=\"option in vm.data.items\" value={{option.reonID}}>{{option.reonID}} - {{option.zabeleska}}</option></select><br></div></div></div><div class=\"row row-center\" style=max-height:70%;><div class=col><div class=list><label class=\"item item-input item-select form-control\"><div class=input-label style=\"height: 100%;height: 100%;line-height: 100%;padding: 14px 7px;margin: auto 0;\">Месец</div><select ng-options=\"month.display for month in vm.months\" ng-model=vm.selectedMonth></select></label> <label class=\"item item-input item-select form-control\"><div class=input-label style=\"height: 100%;height: 100%;line-height: 100%;padding: 14px 7px;margin: auto 0;\">Година</div><select ng-options=\"year for year in vm.years\" ng-model=vm.selectedYear></select></label></div></div></div><div class=row><button class=\"submitButton button button-calm\" ng-click=vm.downloadReonData() ng-enabled=vm.hasReonsList>Преземи податоци</button></div><div class=row><button class=\"submitButton button button-energized\" ng-click=vm.synchronize()>Синхронизирај</button></div><div class=row><div style=\"margin-left: 10%; margin-top:20px;color:red\"><p>{{vm.errors.required}}</p></div></div></ion-content></ion-view>");
$templateCache.put("./templates/internetConnection.html","<ion-view view-title=\"\" class=hs-view-internetConnection><ion-content scroll=false class=white-bg><div class=card><div class=\"item item-text-wrap\">{{vm.message}}</div></div></ion-content></ion-view>");
$templateCache.put("./templates/login.html","<ion-view class=\"hs-view-home has-header bar-calm\" view-title=Логин content=\"\" scroll=false><ion-content class=has-header style=padding-top:30px; content=\"\" scroll=false><div class=\"row row-center\"><div class=col><div class=list><label class=\"item item-input inputElement\"><input type=text ng-model=vm.user.username placeholder=\"Корисничко Име\"></label> <label class=\"item item-input inputElement\"><input type=password ng-model=vm.user.password placeholder=Лозинка></label><div style=\"margin-left: 10%; color: red\"><p>{{vm.errors.required}}</p></div></div></div></div><div class=row><button class=\"submitButton button button-calm\" ng-click=vm.login()>ЛОГИРАЈ СЕ</button></div></ion-content></ion-view>");
$templateCache.put("./templates/menu.html","<ion-side-menus enable-menu-with-back-views=false><ion-side-menu-content><ion-nav-bar align-title=center class=\"bar-calm bar-header-with-logo never-hide-inline\"><ion-nav-back-button class=button-clear><i class=ion-android-arrow-back ng-if=\"mainVm.checkArea() && !mainVm.check()\"></i></ion-nav-back-button><ion-nav-title ng-click=\"mainVm.navigateToState(\'main.login\',{})\"><div class=page-title></div></ion-nav-title><ion-nav-buttons side=left><!--<button class=\"button button-icon button-clear ion-navicon\" menu-toggle=\"left\" ng-if=\"!mainVm.check()\"></button>--><button class=\"button icon ion-log-out\" ng-click=mainVm.logOut() ng-if=!mainVm.checkArea()></button></ion-nav-buttons><ion-nav-buttons side=right><button class=\"button icon ion-home\" ng-click=mainVm.area() ng-if=!mainVm.check()></button> <button class=\"button icon ion-search\" ng-click=mainVm.search() ng-if=!mainVm.check()></button></ion-nav-buttons></ion-nav-bar><ion-nav-view name=subview></ion-nav-view></ion-side-menu-content></ion-side-menus>");
$templateCache.put("./templates/results.html","<ion-view class=\"hs-view-home has-header\" view-title=Резултати overflow-scroll=true><ion-content scroll=true padding=false><ion-list ng-repeat=\"item in vm.items\"><ion-item class=item-stable><div class=rowFull><div class=\"colFull col-75\" ng-click=vm.openDetails(item)><div class=row><p class=nameheader>{{item.Naziv}}</p></div><div class=row ng-if=item.ulica><p class=nameheader>{{item.Ulica}} / {{item.Broj}}</p></div></div><div class=\"colFull col-25\" ng-click=vm.openDetails(item)><div class=row>{{item.Broilo}}</div><div class=row>{{item.NovaSostojba}}</div></div></div></ion-item></ion-list><div ng-if=!vm.items.length><div class=\"row row-center\"><h3>* Нема резултати</h3></div></div></ion-content></ion-view>");
$templateCache.put("./templates/search.html","<ion-view class=\"hs-view-home has-header bar-calm\" title=Пребарување overflow-scroll=false><ion-content class=has-header style=padding-top:30px; content=\"\" scroll=false><div class=\"row row-center\" style=max-height:70%;><div class=col><div class=list><div class=\"item item-input inputElement\"><input ng-model=vm.search.imeprezime type=text placeholder=\"Корисник (Име/Презиме)\"></div><div class=\"item item-input inputElement\"><input ng-model=vm.search.lokacija type=text placeholder=\"Локација (Улица, Број ...)\"></div></div></div></div><div class=row><button class=\"submitButton button button-calm\" ng-click=vm.search()>БАРАЈ</button></div><div class=row><div style=\"margin-left: 10%;color:red\"><p>{{vm.errors.required}}</p></div></div></ion-content></ion-view>");
$templateCache.put("./templates/userDetails.html","<ion-view class=\"hs-view-home has-header\" view-title=Корисник overflow-scroll=true><ion-content class=has-header style=padding-top:30px; content=\"\" scroll=true><div class=\"row row-center\" style=max-height:70%;><div class=col><ion-item class=item-stable style=max-height:70%><div class=rowFull><b>Тип на Корисник</b>: {{vm.tipNaKorisnik}}</div><div class=rowFull><b>Шифра на корисник</b>: {{vm.shifraNaKorisnik}}</div><div class=rowFull><b>Име/назив</b> :{{vm.imeNaziv}}</div><div class=rowFull><b>Улица</b>: {{vm.adresa}}</div><div class=rowFull><b>Куќен број</b>: {{vm.kukenBroj}}</div><div class=rowFull><b>Влез</b>: {{vm.vlez}}</div><div class=rowFull><b>Стан</b>: {{vm.stan}}</div><!--<div class=\"rowFull\">\r\n <b>Град</b>: {{vm.grad}}\r\n </div>--></ion-item></div></div><ion-list><ion-item ng-class=vm.getItemClass(item) ng-repeat=\"item in vm.items\"><div class=rowFull><div class=\"colFull col-75\" ng-click=vm.navigateToUserDetails(item)><div class=row><p class=nameheader>{{item.Naziv}}</p></div><div class=row ng-if=item.ulica><p class=nameheader>{{item.Ulica}} / {{item.Broj}}</p></div></div><div class=\"colFull col-25\" ng-click=vm.navigateToUserDetails(item)><div class=row>{{item.Broilo}}</div><div class=row>{{item.NovaSostojba}}</div></div></div></ion-item></ion-list><div class=row><button class=\"submitButton button button-calm\" ui-sref=\"main.editstate({vidkorid: vm.vidkorID, lokacijaID: vm.lokacijaID, korisnikID: vm.korisnikID, reonID: vm.reonID, broilo: vm.broilo, selectedRegion: vm.reonID})\">Внеси нова состојба</button></div></ion-content></ion-view>");}]);