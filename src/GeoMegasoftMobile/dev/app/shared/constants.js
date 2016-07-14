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
