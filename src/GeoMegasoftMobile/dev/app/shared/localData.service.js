/* globals _, ionic */
/*jshint -W083, -W069, -W041 */
(function() {
  'use strict';
  angular.module('starter.shared')
    .factory('LocalDataService', localDataService);

  localDataService.$inject = ['DbService', '$cordovaSQLite', '$window', '$q', '$ionicPlatform'];

  function localDataService(DbService, $cordovaSQLite, $window, $q, $ionicPlatform) {
    var service = new Service();
    return service;

    function Service() {
      var self = this;


      // ------------------------------------------------------------------
      // begin: synchronization functions
      self.setReonFromAPI = SetReonFromAPICallback;
      self.uploadAllChangesToApi = UploadAllChangesToApiCallback;

      function SetReonFromAPICallback(dataFromAPI, selectedArea) {
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

        var waterCounterInsertQuery = "INSERT INTO waterCounters (ReonId , VidKorId , KorisnikId, LokacijaId , UlicaId, Broilo , Aktive , Naziv , Ulica, Broj , SostojbaNova, Mesec) VALUES (?, ? , ?, ?, ?, ? , ?, ?, ?, ? , ?, ?)";
        var customersInsertQuery = "INSERT INTO customers (ID , SifTipID , Naziv , UlicaID ,  Adresa , Broj , Mesto , Drzava , Vlez , Stan , Naziv1 ) VALUES (? , ?, ? , ?,  ? , ? , ? , ?, ? , ?, ? )";
        for (var i = 0; i < dataFromAPI.waterCounters.length; i++) {
          //dataFromAPI.waterCounters[i]
          $window.localStorage['localReonId'] = selectedArea;
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
            dataFromAPI.waterCounters[i].mesec
          ];
          waterCountersToInsert.push(waterCounterParameters);
          // waterCountersQueries.push(
          //   [waterCounterInsertQuery,
          //     waterCounterParameters
          //   ]);
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

        $ionicPlatform.ready(function() {
          // $cordovaSQLite.execute($window.db, query, parameters)
          $cordovaSQLite.insertCollection($window.db, waterCounterInsertQuery,
            waterCountersToInsert).then(function(res) {
            //q.resolve(res);

            //TODO add another insertCollection call for the customers inside here
            $cordovaSQLite.insertCollection($window.db, customersInsertQuery,
              customersToInsert).then(function(resultCustomers) {
              $window.localStorage['localReonId'] = selectedArea;
              q.resolve(res);
            }, function(err) {
              console.error(err);
              q.reject(err);
            });
          }, function(err) {
            console.error(err);
            q.reject(err);
          });

        });

        return q.promise;
      }

      function CleanLocalReonData() {
        var q = $q.defer();
        $window.localStorage.removeItem("localReonId");
        DbService.query("DELETE FROM customers; DELETE FROM waterCounters; DELETE FROM LocalDataChanges; ", null).then(function() {
          q.resolve();
        }, function(errror) {
          q.reject(errror);
        });

        return q.promise;
      }

      function UploadAllChangesToApiCallback() {
        var q = $q.defer();
        //TODO make calls one by one, verify update and clear from queue
        //in the meantime display ionicLoading

        //on the end clear local Data
        CleanLocalReonData().then(function(res) {
          q.resolve(res); //
        }, function(error) {
          q.reject(error);
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
        //WaterCounters (array of WaterCounter Item: { VidKorID,KorisnikID, LokacijaID, UlicaID, ReonID, Broilo,Aktive,Naziv, Ulica, Broj, NovaSostojba })
        //}

        var getCustomerInfoQuery = "SELECT SifTipID, ID, Naziv, UlicaID, Adresa,  Broj, Mesto, Drzava, Vlez, Stan, Naziv1  FROM customers  WHERE ID=" + korisnikID;

        $ionicPlatform.ready(function() {
          $cordovaSQLite.execute($window.db, getCustomerInfoQuery).then(function(res) {
            var output = [];
            for (var i = 0; i < res.rows.length; i++) {
              output.push(res.rows.item(i));
            }
            q.resolve(output);
          }, function(err) {
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
        // not necessary params locally
        // TODO SearchWaterCounters:
        // returns:
        // {
        //    VidKorID
        //    KorisnikID
        //    LokacijaID
        //    UlicaID
        //    ReonID
        //    Broilo
        //    Aktive
        //    Naziv
        //    Ulica
        //    Broj
        //    NovaSostojba
        // }

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

        $ionicPlatform.ready(function() {
          $cordovaSQLite.execute($window.db, searchQuery).then(function(res) {
            var output = [];
            for (var i = 0; i < res.rows.length; i++) {
              output.push(res.rows.item(i));
            }
            q.resolve(output);
          }, function(err) {
            console.error(err);
            q.reject(err);
          });
        });

        return q.promise;
      }

      function addNewWaterCounterCallback(vidkorid, lokacijaID, korisnikID, reonID, broilo, sostojba, slikaSostojba, lat, long) {
        // TODO CreateNewWaterCounter

        // returns
        // {
        //IsSuccess
        //Message
        // }
      }

      function updateWaterCounterStateCallback(vidkorid, lokacijaID, korisnikID, reonID, broilo, sostojbaStara, sostojbaNova, slikaSostojba, lat, long) {
        // TODO InsertNewStateForWaterCounter

        // returns
        // {
        //IsSuccess
        //Message
        // }
      }

      function getLastWaterCounterStateCallback(vidkorid, lokacijaID, korisnikID, reonID, broilo) {
        // TODO GetLastStateOfWaterCounter
        var q = $q.defer();
        // returns
        // {
        //   ReonId,
        //   VidKorID,
        //   KorisnikId,
        //   LokacijaId,
        //   UlicaId,
        //   Broilo,
        //   Aktive,
        //   Naziv,
        //   Ulica,
        //   Broj,
        //   SostojbaNova,
        //   Mesec
        // }

        var searchQuery = "SELECT * from waterCounters WHERE Aktive = 1 AND VidKorId = " + vidkorid + " AND LokacijaId = " + lokacijaID +
          " AND KorisnikId =" + korisnikID + " AND ReonId = " + reonID + " AND Broilo = '" + broilo + "'";

        $ionicPlatform.ready(function() {
          $cordovaSQLite.execute($window.db, searchQuery).then(function(res) {
            var output = [];
            for (var i = 0; i < res.rows.length; i++) {
              output.push(res.rows.item(i));
            }
            q.resolve(output);
          }, function(err) {
            console.error(err);
            q.reject(err);
          });
        });

        return q.promise;
      }

      function searchWaterCountersByUserIdCallback(korisnikId) {
        var q = $q.defer();
        var searchQuery = "SELECT * from waterCounters WHERE Aktive = 1 AND KorisnikId = "+ korisnikId + " ORDER BY Naziv ";

        $ionicPlatform.ready(function() {
          $cordovaSQLite.execute($window.db, searchQuery).then(function(res) {
            var output = [];
            for (var i = 0; i < res.rows.length; i++) {
              output.push(res.rows.item(i));
            }
            q.resolve(output);
          }, function(err) {
            console.error(err);
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
