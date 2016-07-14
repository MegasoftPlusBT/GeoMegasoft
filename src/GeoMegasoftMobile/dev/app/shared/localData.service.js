/* globals _, ionic */
/*jshint -W083, -W069, -W041 */
(function() {
  'use strict';
  angular.module('starter.shared')
    .factory('LocalDataService', localDataService);

  localDataService.$inject = ['DbService', '$cordovaSQLite', '$window', '$q', '$ionicPlatform', 'WebAPIurl', '$http'];

  function localDataService(DbService, $cordovaSQLite, $window, $q, $ionicPlatform, WebAPIurl, $http) {
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

        var waterCounterInsertQuery = "INSERT INTO waterCounters (ReonId , VidKorId , KorisnikId, LokacijaId , UlicaId, Broilo , Aktive , Naziv , Ulica, Broj , SostojbaNova, Mesec,SlikaSostojba , HasBeenUpdatedLocally ) VALUES (?, ? , ?, ?, ?, ? , ?, ?, ?, ? , ?, ?,?,?)";
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
          }, function(error) {
            console.error(error);
            q.reject(error);
          });

        });

        return q.promise;
      }

      function CleanLocalReonData() {
        var q = $q.defer();
        $window.localStorage.removeItem("localReonId");


        $cordovaSQLite.execute($window.db, "DELETE FROM customers;").then(function(res1) {
          $cordovaSQLite.execute($window.db, "DELETE FROM waterCounters;").then(function(res2) {
            $cordovaSQLite.execute($window.db, "DELETE FROM LocalDataChanges;").then(function(res3) {
              q.resolve(res3);
            }, function(error) {
              q.reject(errror);
            });
          }, function(error) {
            q.reject(errror);
          });
        }, function(error) {
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

        //on the end clear local Data
        CleanLocalReonData().then(function(res) {
          q.resolve(res); //
        }, function(error) {
          q.reject(error);
        });

        return q.promise;
      }

      function SendUpdateWaterCounterStateToAPI(dataToSend) {

        var q = $q.defer();
        var data = {
          // "vidkorid": $stateParams.vidkorid,
          // "lokacijaID": $stateParams.lokacijaID,
          // "korisnikID": $stateParams.korisnikID,
          // "reonID": $stateParams.reonID,
          // "broilo": $stateParams.broilo,
          // "sostojbaStara": parseInt(vm.state.before),
          // "sostojbaNova": parseInt(vm.state.new),
          // "slikaSostojba": vm.state.slika,
          // "lat": lat,
          // "long": long
        };
        var newValue = parseInt(vm.state.new);
        var url = WebAPIurl + 'api/v1/watercounters/newstate';
        $http.defaults.headers.post['Authorization'] = "Bearer " + $window.localStorage['access_token'];
        $http.post(url, data).then(function(resp) {
          if (resp.data.isSucces === true) {
            console.log("Успешно зачувана состојба!");
          } else {
            console.error('Not successfull');
          }
        }, function(err) {
          if (err.status == 401 || err.status == 0) {
            console.error('Not successfull');
          } else {
            console.error('Not successfull');
          }
        });
      }

      function SendAddNewWaterCounterCallToAPI(dataToSend) {
        var q = $q.defer();
        var data = {
          // "Vidkorid": $stateParams.vidkorid,
          // "LokacijaID": $stateParams.lokacijaID,
          // "KorisnikID": $stateParams.korisnikID,
          // "ReonID": $stateParams.reonID,
          // "Broilo": vm.brShasija,
          // "Sostojba": parseInt(vm.state.new),
          // "SlikaSostojba": vm.state.slika,
          // "Lat": lat,
          // "Long": long
        };
        var url = WebAPIurl + 'api/v1/watercounters/newCounter';
        $http.defaults.headers.post['Authorization'] = "Bearer " + $window.localStorage['access_token'];
        $http.post(url, data).then(function(resp) {
          if (resp.data.isSucces === true) {
            //successfully sent to API
            console.log('successfully sent to API');

            q.resolve(true);
          } else {
            console.error('Not successfull');
            q.reject('Not successfull');
          }
        }, function(err) {
          if (err.status == 401 || err.status == 0) {
            console.error('Not successfull');
          } else {
            console.error('Not successfull');
          }
          q.reject('Not successfull');
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

      function addNewWaterCounterCallback(data, imeNaziv, brShasija) {
        // TODO CreateNewWaterCounter
        var q = $q.defer();
        var addNewWaterCounterToLocalChangesQuery = "INSERT INTO LocalDataChanges (ReonId , VidKorID , KorisnikId ,  LokacijaId ,  Broilo , SostojbaStara , SostojbaNova , SlikaSostojba , lat , long , DateCreated , TypeOfAPICall , IsSentToAPI ) VALUES (? , ? , ? ,  ? ,  ? , ? , ? , ? , ? , ? , ? , ? , ?)";
        var waterCounterInsertQuery = "INSERT INTO waterCounters (ReonId , VidKorId , KorisnikId, LokacijaId , UlicaId, Broilo , Aktive , Naziv , Ulica, Broj , SostojbaNova, Mesec,SlikaSostojba , HasBeenUpdatedLocally) VALUES (?, ? , ?, ?, ?, ? , ?, ?, ?, ? , ?, ?, ?, ?)";

        var slikaSostojbaValue = data.SlikaSostojba;
        if(slikaSostojbaValue == null){
          slikaSostojbaValue = null;
        }
        else{
          slikaSostojbaValue =  data.SlikaSostojba;
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
          slikaSostojbaValue,//SlikaSostojba text,
          1 //HasBeenUpdatedLocally integer
        ];

        var dataToSave = Object.keys(data).map(function(key) {
          return data[key];
        });

        $ionicPlatform.ready(function() {
          $cordovaSQLite.execute($window.db, addNewWaterCounterToLocalChangesQuery, dataToSave).then(function(res) {

            $cordovaSQLite.execute($window.db, waterCounterInsertQuery, itemToSaveInWaterCounters).then(function(result) {
              q.resolve(result);
            }, function(error) {
              console.error(error);
              q.reject(error);
            });

          }, function(err) {
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
        if(slikaSostojbaValue == null){
          slikaSostojbaValue = null;
        }
        else{
          slikaSostojbaValue = "'" + data.SlikaSostojba + "'";
        }

        var updateStateInWaterCountersQuery = "UPDATE `waterCounters` SET SostojbaNova='" + data.SostojbaNova + "', SlikaSostojba = "+slikaSostojbaValue+", HasBeenUpdatedLocally=1 WHERE Aktive = 1 AND VidKorId = " +
          data.VidKorID + " AND LokacijaId = " + data.LokacijaId +
          " AND KorisnikId =" + data.KorisnikId + " AND ReonId = " + data.ReonId + " AND Broilo = '" + data.Broilo + "'";

        var dataToSave = Object.keys(data).map(function(key) {
          return data[key];
        });

        $ionicPlatform.ready(function() {
          $cordovaSQLite.execute($window.db, newWaterCounterStateInsertQuery, dataToSave).then(function(res) {
            $cordovaSQLite.execute($window.db, updateStateInWaterCountersQuery, null).then(function(result) {
              q.resolve(result);
            }, function(error) {
              console.error(error);
              q.reject(error);
            });
          }, function(err) {
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
        //TODO search for newly create WaterCounters in localDb
        var q = $q.defer();
        var searchQuery = "SELECT * from waterCounters WHERE Aktive = 1 AND KorisnikId = " + korisnikId + " ORDER BY Naziv ";

        $ionicPlatform.ready(function() {
          $cordovaSQLite.execute($window.db, searchQuery).then(function(res) {
            var output = [];
            for (var i = 0; i < res.rows.length; i++) {
              output.push(res.rows.item(i));
            }
            q.resolve(output);
          }, function(err) {
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
