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
        $scope.unitsIcon = "wi-celsius"

        $scope.currentLocation = {};

        $scope.changeUnits = function() {
          $scope.unitsIcon = $scope.unitsIcon === "wi-celsius" ? "wi-fahrenheit" : "wi-celsius";
        }

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
    .service('DataService', ['$http', 'Icons',
      function($http, Icons) {
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
                image: result.image,
                current: result.item.condition

              }

              wData.icon = Icons.getStatusIcon(result.item.condition.code).icon;

              callback(wData);
            }
          });
        }

        _dataServiceFactory.getWeather = _getWeather;

        return _dataServiceFactory;
      }
    ]).
    factory('Icons', [
      function() {

        var _iconsFactory = {};

        var _statuses = [
          {	id:	0	, icon:	"wi-tornado"	},
          {	id:	1	, icon:	null	}, //tropical storm
          {	id:	2	, icon:	"wi-huricane"	},
          {	id:	3	, icon:	null	}, //severe thunderstorms
          {	id:	4	, icon:	"wi-thunderstorm"	},
          {	id:	5	, icon:	null	}, //mixed rain and snow
          {	id:	6	, icon:	null	}, //mixed rain and sleet
          {	id:	7	, icon:	null	}, //mixed snow and sleet
          {	id:	8	, icon:	null	}, //freezing drizzle
          {	id:	9	, icon:	"wi-sprinkle"	}, //drizzle
          {	id:	10	, icon:	null	}, //freezing rain
          {	id:	11	, icon:	"wi-showers"	},
          {	id:	12	, icon:	"wi-showers"	},
          {	id:	13	, icon:	null	}, //snow fluries
          {	id:	14	, icon:	null	}, //light snow showers
          {	id:	15	, icon:	null	}, // blowing snow
          {	id:	16	, icon:	"wi-snow"	},
          {	id:	17	, icon:	"wi-hail"	},
          {	id:	18	, icon:	"wi-sleet"	},
          {	id:	19	, icon:	"wi-dust"	},
          {	id:	20	, icon:	"wi-fog"	},
          {	id:	21	, icon:	"wi-day-haze"	},
          {	id:	22	, icon:	"wi-smoke"	},
          {	id:	23	, icon:	null	}, //blustery
          {	id:	24	, icon:	"wi-windy"	},
          {	id:	25	, icon:	null	}, //cold
          {	id:	26	, icon:	"wi-cloudy"	},
          {	id:	27	, icon:	"wi-night-cloudy-high"	},
          {	id:	28	, icon:	"wi-day-cloudy-high"	},
          {	id:	29	, icon:	"wi-night-alt-partly-cloudy"	},
          {	id:	30	, icon:	"wi-day-sunny-overcast"	},
          {	id:	31	, icon:	"wi-night-clear"	},
          {	id:	32	, icon:	"wi-day-sunny"	},
          {	id:	33	, icon:	null	}, //fair (night)
          {	id:	34	, icon:	null	}, //fair (day)
          {	id:	35	, icon:	null	}, //mixed rain and hail
          {	id:	36	, icon:	"wi-hot"	},
          {	id:	37	, icon:	"wi-thunderstorm"	}, //isolated thunderstorms
          {	id:	38	, icon:	"wi-thunderstorm"	}, // scattered thunderstorms
          {	id:	39	, icon:	"wi-thunderstorm"	}, // scattered thunderstorms
          {	id:	40	, icon:	"wi-showers"	},
          {	id:	41	, icon:	"wi-snow"	}, //heavy snow
          {	id:	42	, icon:	"wi-snow"	}, //snow showers
          {	id:	43	, icon:	"wi-snow"	}, //heavy snow
          {	id:	44	, icon:	"wi-day-sunny-overcast"	}, //partly cloudy
          {	id:	45	, icon:	null	}, //thundershowers
          {	id:	46	, icon:	"wi-snow"	}, //snow showers
          {	id:	47	, icon:	null	}, //isolated thundershowers
          {	id:	3200	, icon:	null	} //unvailable
        ];

        function _getStatusIcon(statusId) {
          return _statuses.filter(function(val) {
            return val.id == statusId;
          })[0];
        };

        _iconsFactory.getStatusIcon = _getStatusIcon;

        return _iconsFactory;
      }
    ]);
})();
