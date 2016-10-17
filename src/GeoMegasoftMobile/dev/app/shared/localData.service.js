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
                var indexInUnique = -1;
                uniqueListOfLocalChanges.map(function (broilo, indexOfBroilo) {
                  if(broilo.Broilo == item.Broilo){
                  	indexInUnique = indexOfBroilo;
                  }
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
