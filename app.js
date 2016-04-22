(function() {
  'use strict';

  angular
    .module('App', [])
    .controller('AppController', ['$scope', 'DataService',
      function($scope, DataService) {
        $scope.weather = {
          location : {},
          image: {}
        };

        $scope.currentLocation = {};

        $scope.getWeather = function() {

          if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(function(locationData) {

                DataService.getWeather(locationData, function(data, error) {
                  if(error){
                    console.log(error);
                  }
                  else {
                    $scope.weather = data;
                  }
                });
              });
          } else {
              console.log("Geolocation is not supported by this browser.");
          }
        }

        function getLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(data) {
                  $scope.currentLocation = data;
                });
            } else {
                console.log("Geolocation is not supported by this browser.");
            }
        }

        function init() {
          $scope.getWeather();
        }

        init();
      }
    ])
    .service('DataService', ['$http',
      function($http) {
        var _dataServiceFactory = {};

        function _getWeather(locationData, callback) {

          var url = 'https://simple-weather.p.mashape.com/weatherdata?lat=' + locationData.coords.latitude + '&lng=' + locationData.coords.longitude;

          $http({
            method: 'GET',
            url: url,
            headers: {
              'X-Mashape-Key': 'OpJyf5G4TEmshtcqkiM7ewzowsikp1dJvHcjsnRdYleSwddNKI',
              'Content-Type': 'application/x-www-form-urlencoded',
              'Accept': 'application/plain'
            }
          }).then(function(data) {

            var result = data.data.query.results.channel;

            if(callback) {
              var wData = {
                location: result.location,
                image: result.image
              }

              callback(wData);
            }
          });
        }

        _dataServiceFactory.getWeather = _getWeather;

        return _dataServiceFactory;
      }
    ]);

})();
