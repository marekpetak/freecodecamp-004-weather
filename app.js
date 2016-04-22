(function() {
  'use strict';

  angular
    .module('App', [])
    .controller('AppController', ['$scope', 'DataService',
      function($scope, DataService) {
        $scope.quote = {
          text: 'empty text',
          author: 'empty'
        };

        $scope.newQuote = function() {
            DataService.getQuote(function(data, error) {
              if(error){
                console.log(error);
              }
              else {
                $scope.quote = data;
              }
            });
        }

        function init() {
          $scope.newQuote();
        }

        init();
      }
    ])
    .service('DataService', ['$http',
      function($http) {
        var _dataServiceFactory = {};

        function _getQuote(callback) {

          $http({
            method: 'GET',
            url: 'https://andruxnet-random-famous-quotes.p.mashape.com/?cat=',
            headers: {
              'X-Mashape-Key': 'OpJyf5G4TEmshtcqkiM7ewzowsikp1dJvHcjsnRdYleSwddNKI',
              'Content-Type': 'application/x-www-form-urlencoded',
              'Accept': 'application/json'
            }
          }).then(function(data) {

            if(callback) {
              var quote = {
                text: data.data.quote,
                author: data.data.author
              }

              callback(quote);
            }
          });
        }

        _dataServiceFactory.getQuote = _getQuote;

        return _dataServiceFactory;
      }
    ]);

})();
