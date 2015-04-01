'use strict';

angular.module('ml.retail', [
    'ngRoute',
    'ui.bootstrap',
    'ml.common',
    'ml.search',
    'ml.search.tpls',
    'google-maps',
])
  .controller('appCtrl', [ 'userService', '$scope', '$location', function(userService, $scope, $location) {

    var ctrl = this;

    ctrl.logout = function() {
      console.log('logging out');
      userService.logout();
    };

    $scope.$watch(function() { return userService.user; }, function(newVal,oldVal) {
      if (newVal) {
        ctrl.username = newVal.username;
      } else {
        ctrl.username = null;
        $location.path('/').search('');
      }
    });

  }])
  .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {

    $locationProvider.html5Mode(true);

    $routeProvider
      .when('/splash', {
        templateUrl: '/home/splash.html',
        controller: 'splashCtrl as splashCtrl'
      })
      .when('/login', {
        templateUrl: '/user/login.html',
        controller: 'loginCtrl as ctrl'
      })
      .when('/marketer/dashboard', {
        templateUrl: '/marketer/dashboard.html',
        controller: 'marketerCtrl as markterCtrl'
      })
      .when('/analyst/dashboard', {
        templateUrl: '/analyst/dashboard.html',
        controller: 'analystDashboardCtrl'
      })
      .when('/manager/dashboard', {
        templateUrl: '/manager/dashboard.html',
        controller: 'managerDashboardCtrl'
      })
      .when('/loyalty/dashboard', {
        templateUrl: '/loyalty/dashboard.html',
        controller: 'loyaltyDashboardCtrl'
      })
      .when('/consumer/home', {
        templateUrl: '/consumer/consumer_home.html',
        controller: 'consumerHomeCtrl as consumerCtrl'
      })
      .when('/consumer/detail/:uri*', {
        templateUrl: '/consumer/product_detail.html',
        controller: 'productDetailCtrl as productDetails',
        resolve: {
          'productData': function($route, MLRest) {
            var uri = '/' + $route.current.params.uri;
            console.log('resolving ', uri)
            return MLRest.getDocument(uri, { format: 'json', transform: 'to-json'})
          }
        }
      })
      .otherwise({
        redirectTo: '/consumer/home'
      });
  }]);


angular.module('sample.common', [])
  .filter('object2Array', function() {
    'use strict';

    return function(input) {
      var out = [];
      for (var name in input) {
        input[name].__key = name;
        out.push(input[name]);
      }
      return out;
    };
});

/**!
 * The MIT License
 *
 * Copyright (c) 2010-2012 Google, Inc. http://angularjs.org
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * angular-google-maps
 * https://github.com/nlaplante/angular-google-maps
 *
 * @author Nicolas Laplante https://plus.google.com/108189012221374960701
 */

(function () {

  'use strict';

  /*
   * Utility functions
   */

  /**
   * Check if 2 floating point numbers are equal
   *
   * @see http://stackoverflow.com/a/588014
   */
  function floatEqual (f1, f2) {
    return (Math.abs(f1 - f2) < 0.000001);
  }

  /*
   * Create the model in a self-contained class where map-specific logic is
   * done. This model will be used in the directive.
   */

  var MapModel = (function () {

    var _defaults = {
      zoom: 8,
      container: null,
    };

    /**
     *
     */
    function PrivateMapModel(opts) {

      var _instance = null,
      _markers = [],  // caches the instances of google.maps.Marker
      _handlers = [], // event handlers
      _windows = [],  // InfoWindow objects
      o = angular.extend({}, _defaults, opts),
      that = this,
      currentInfoWindow = null;

      this.center = opts.center;
      this.zoom = o.zoom;
      this.dragging = false;
      this.selector = o.container;
      this.markers = [];
      this.options = o;

      this.draw = function () {

        if (that.center === null) {
          // TODO log error
          return;
        }

        if (_instance === null) {

          // Create a new map instance

          console.log('creating map');
          _instance = new google.maps.Map(that.selector, that.options);

          google.maps.event.addListener(_instance, 'dragstart',

              function () {
                that.dragging = true;
              }
          );

          google.maps.event.addListener(_instance, 'idle',

              function () {
                that.dragging = false;
              }
          );

          google.maps.event.addListener(_instance, 'drag',

              function () {
                that.dragging = true;
              }
          );

          google.maps.event.addListener(_instance, 'zoom_changed',

              function () {
                that.zoom = _instance.getZoom();
                that.center = _instance.getCenter();
              }
          );

          google.maps.event.addListener(_instance, 'center_changed',

              function () {
                that.center = _instance.getCenter();
              }
          );

          // Attach additional event listeners if needed
          if (_handlers.length) {

            angular.forEach(_handlers, function (h) {

              google.maps.event.addListener(_instance,
                  h.on, h.handler);
            });
          }
        }
        else {

          // Refresh the existing instance
          google.maps.event.trigger(_instance, 'resize');

          var instanceCenter = _instance.getCenter();

          if (!floatEqual(instanceCenter.lat(), that.center.lat()) ||
              !floatEqual(instanceCenter.lng(), that.center.lng())) {_instance.setCenter(that.center);
          }

          if (_instance.getZoom() !== that.zoom) {
            _instance.setZoom(that.zoom);
          }
        }
      };

      this.fit = function () {
        if (_instance && _markers.length) {

          var bounds = new google.maps.LatLngBounds();

          angular.forEach(_markers, function (m) {
            bounds.extend(m.getPosition());
          });

          _instance.fitBounds(bounds);
        }
      };

      this.on = function(event, handler) {
        _handlers.push({
          'on': event,
          'handler': handler
        });
      };

      this.getMap = function() {
        return _instance;
      };

      this.addMarker = function (lat, lng, icon, infoWindowContent, label, url,
          thumbnail) {

        if (that.findMarker(lat, lng) !== null) {
          return;
        }

        var marker = new google.maps.Marker({
          position: new google.maps.LatLng(lat, lng),
          map: _instance,
          icon: icon
        });

        if (label) {

        }

        if (url) {

        }

        function showInfoWindow(content) {
          var infoWindow = new google.maps.InfoWindow({
            content: content
          });

          if (currentInfoWindow !== null) {
            currentInfoWindow.close();
          }
          infoWindow.open(_instance, marker);
          currentInfoWindow = infoWindow;
        }

        if (infoWindowContent !== null) {
          google.maps.event.addListener(marker, 'click', function() {
            if (typeof infoWindowContent === 'function') {
              infoWindowContent().then(function(res) {
                showInfoWindow(res);
              });
            } else {
              showInfoWindow(infoWindowContent);
            }
          });
        }

        // Cache marker
        _markers.unshift(marker);

        // Cache instance of our marker for scope purposes
        that.markers.unshift({
          'lat': lat,
          'lng': lng,
          'icon': icon,
          'infoWindowContent': infoWindowContent,
          'label': label,
          'url': url,
          'thumbnail': thumbnail
        });

        // Return marker instance
        return marker;
      };

      this.findMarker = function (lat, lng) {
        for (var i = 0; i < _markers.length; i++) {
          var pos = _markers[i].getPosition();

          if (floatEqual(pos.lat(), lat) && floatEqual(pos.lng(), lng)) {
            return _markers[i];
          }
        }

        return null;
      };

      this.findMarkerIndex = function (lat, lng) {
        for (var i = 0; i < _markers.length; i++) {
          var pos = _markers[i].getPosition();

          if (floatEqual(pos.lat(), lat) && floatEqual(pos.lng(), lng)) {
            return i;
          }
        }

        return -1;
      };

      this.addInfoWindow = function (lat, lng, html) {
        var win = new google.maps.InfoWindow({
          content: html,
          position: new google.maps.LatLng(lat, lng)
        });

        _windows.push(win);

        return win;
      };

      this.hasMarker = function (lat, lng) {
        return that.findMarker(lat, lng) !== null;
      };

      this.getMarkerInstances = function () {
        return _markers;
      };

      this.removeMarkers = function (markerInstances) {

        var s = this;

        angular.forEach(markerInstances, function (v) {
          var pos = v.getPosition(),
            lat = pos.lat(),
            lng = pos.lng(),
            index = s.findMarkerIndex(lat, lng);

          // Remove from local arrays
          _markers.splice(index, 1);
          s.markers.splice(index, 1);

          // Remove from map
          v.setMap(null);
        });
      };
    }

    // Done
    return PrivateMapModel;
  }());

  // End model

  // Start Angular directive

  var googleMapsModule = angular.module('google-maps', []);

  /**
   * Map directive
   */
  googleMapsModule.directive('googleMap', ['$log', '$timeout', '$filter', function ($log, $timeout) {

    return {
      restrict: 'ECA',
      priority: 100,
      transclude: true,
      template: '<div class="angular-google-map" ng-transclude></div>',
      replace: false,
      scope: {
        options: '=options', // required
        markers: '=markers', // optional
        latitude: '=latitude', // required
        longitude: '=longitude', // required
        refresh: '&refresh', // optional
        windows: '=windows', // optional
        events: '=events',
      },
      link: function (scope, element, attrs) {

        if (!angular.isDefined(scope.options)) {
          $log.error('angular-google-maps: map options property not set');
          return;
        }

        // Parse options
        var opts = angular.extend(scope.options, {
          container: element[0]
        });

        // Create our model
        var _m = new MapModel(opts);

        _m.on('drag', function () {

          var c = _m.center;

          $timeout(function () {

            scope.$apply(function () {
              scope.options.center.latitude = c.lat();
              scope.options.center.longitude = c.lng();
            });
          });
        });

        _m.on('zoom_changed', function () {

          if (scope.zoom !== _m.zoom) {

            $timeout(function () {

              scope.$apply(function () {
                scope.zoom = _m.zoom;
              });
            });
          }
        });

        _m.on('center_changed', function () {
          var c = _m.center;

          $timeout(function () {

            scope.$apply(function () {

              if (!_m.dragging) {
                scope.options.center.latitude = c.lat();
                scope.options.center.longitude = c.lng();
              }
            });
          });
        });


        if (angular.isDefined(scope.events)) {
          var eventName = null;
          var f = function() {
            scope.events[eventName].apply(scope, [_m, eventName, arguments]);
          };
          for (var e in scope.events) {
            eventName = e;
            if (scope.events.hasOwnProperty(eventName) && angular.isFunction(scope.events[eventName])) {
              _m.on(eventName, f);
            }
          }
        }

        if (attrs.markClick === 'true') {
          (function () {
            var cm = null;

            _m.on('click', function (e) {
              if (cm === null) {

                cm = {
                  latitude: e.latLng.lat(),
                  longitude: e.latLng.lng()
                };

                scope.markers.push(cm);
              }
              else {
                cm.latitude = e.latLng.lat();
                cm.longitude = e.latLng.lng();
              }


              $timeout(function () {
                scope.latitude = cm.latitude;
                scope.longitude = cm.longitude;
                scope.$apply();
              });
            });
          }());
        }

        // Put the map into the scope
        scope.map = _m;

        // Check if we need to refresh the map
        if (angular.isUndefined(scope.refresh())) {
          // No refresh property given; draw the map immediately
          _m.draw();
        }
        else {
          var hasDrawn = false;
          scope.$watch('refresh()', function (newValue, oldValue) {
            if (newValue && (!hasDrawn || !oldValue)) {
              _m.draw();
              hasDrawn = true;
            }
          });
        }

        // Markers
        scope.$watch('markers', function (newValue) {
          console.log('watched markers');
          $timeout(function () {

            angular.forEach(newValue, function (v) {
              if (!_m.hasMarker(v.latitude, v.longitude)) {
                _m.addMarker(v.latitude, v.longitude, v.icon, v.infoWindow);
              }
            });

            // Clear orphaned markers
            var orphaned = [];

            angular.forEach(_m.getMarkerInstances(), function (v) {
              // Check our scope if a marker with equal latitude and longitude.
              // If not found, then that marker has been removed form the scope.

              var pos = v.getPosition(),
                lat = pos.lat(),
                lng = pos.lng(),
                found = false;

              // Test against each marker in the scope
              for (var si = 0; si < scope.markers.length; si++) {

                var sm = scope.markers[si];

                if (floatEqual(sm.latitude, lat) && floatEqual(sm.longitude, lng)) {
                  // Map marker is present in scope too, don't remove
                  found = true;
                  break;
                }
              }

              // Marker in map has not been found in scope. Remove.
              if (!found) {
                orphaned.push(v);
              }
            });

            if (orphaned.length) {
              _m.removeMarkers(orphaned);
            }

            // Fit map when there are more than one marker.
            // This will change the map center coordinates
            if (attrs.fit === 'true' && newValue && newValue.length >= 1) {
              _m.fit();
            }
          });

        }, true);


        // Update map when center coordinates change
        scope.$watch('center', function (newValue, oldValue) {
          if (newValue === oldValue) {
            return;
          }

          if (!_m.dragging) {
            _m.center = new google.maps.LatLng(newValue.latitude,
                newValue.longitude);
            _m.draw();
          }
        }, true);

        scope.$watch('zoom', function (newValue, oldValue) {
          if (newValue === oldValue) {
            return;
          }

          _m.zoom = newValue;
          _m.draw();
        });
      }
    };
  }]);
}());

(function () {

    var app = angular.module('ml.retail')
    app.controller('consumerHomeCtrl', ConsumerHomeCtrl);

    ConsumerHomeCtrl.$injector = ['consumerSearchService', '$scope'];
    function ConsumerHomeCtrl(consumerSearchService, $scope) {
        var ctrl = this;
        ctrl.mlSearch = consumerSearchService.mlSearch;
        ctrl.page = ctrl.mlSearch.getPage();


        $scope.$watch(function() { return consumerSearchService.isSearching; }, function(newVal,oldVal) {
          ctrl.isSearching = newVal;
        });

        $scope.$watch(function() { return consumerSearchService.results; }, function(newVal, oldVal) {
          ctrl.page = ctrl.mlSearch.getPage();
          ctrl.results = consumerSearchService.results;
        });

        ctrl.search = function() {

            console.log('searching page %s', ctrl.page);
            ctrl.mlSearch
              .setPage(ctrl.page);

            consumerSearchService.runSearch();
        }


      ctrl.toggleFacet = function(facetName, value) {
        ctrl.mlSearch.toggleFacet( facetName, value )

        consumerSearchService.runSearch();
      }

    }

})();

(function () {
    var app = angular.module('ml.retail');

    app.factory('consumerSearchService', ConsumerSearchService);

    ConsumerSearchService.$inject = ['MLSearchFactory'];
    function ConsumerSearchService(MLSearchFactory) {

      var service = {};

      // this will probably end up searching just products
      service.mlSearch = MLSearchFactory.newContext({ pageLength: 12 });

      service.fromParams = function() {
        service.mlSearch.fromParams().then(service.parseResults);
      }

      service.parseResults = function(data) {
        service.isSearching = false;
        service.results = data;
        service.qtext = service.mlSearch.getText();
        service.page = service.mlSearch.getPage();
      }

      service.searchText = function(t) {
        service.startSearch();
        service.mlSearch.setText(t).setPage(1);
        service.runSearch();
      }

      service.searchPage = function(n) {
        service.mlSearch.setPage(n);
        service.runSearch();
      }

      service.runSearch = function() {
        service.mlSearch.search().then(service.parseResults);
      }

      service.startSearch = function() { service.isSearching = true; }


      return service;

    }
})();

(function () {
    var app = angular.module('ml.retail');

    app.directive('consumerSubnav', ConsumerSubnav);

    ConsumerSubnav.$injector = ['consumerSearchService']
    function ConsumerSubnav(consumerSearchService) {
      return {
        restrict: 'E',
        replace: true,
        link: function(scope) {
          scope.searchText = '';
          scope.doSearch = function() {
            if (scope.searchForm.$valid) {
              consumerSearchService.searchText(scope.searchText);
            } else {
              console.log('invalid');
            }
          }
        },
        templateUrl: '/consumer/consumer_subnav.html'
      }
    }
})();

(function () {
    var app = angular.module('ml.retail');

    app.controller('productDetailCtrl', ProductDetailCtrl);

    ProductDetailCtrl.$injector = ['productData'];
    function ProductDetailCtrl(productData) {
      var ctrl = this;

      ctrl.data = productData;
    }
})();

(function () {

  'use strict';

  var app = angular.module('ml.retail');

  app
    .controller('splashCtrl', SplashCtrl)
    .directive('splashChart', SplashChartDirective);

  SplashCtrl.$inject = ['$scope'];
  function SplashCtrl($scope) {

    var ctrl = this;

    ctrl.chartOptions = {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Stacked column chart'
        },
        xAxis: {
            categories: ['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas']
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Total fruit consumption'
            }
        },
        tooltip: {
            pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
            shared: true
        },
        plotOptions: {
            column: {
                stacking: 'percent'
            }
        },
        series: [{
            name: 'John',
            data: [5, 3, 4, 7, 2]
        }, {
            name: 'Jane',
            data: [2, 2, 3, 2, 1]
        }, {
            name: 'Joe',
            data: [3, 4, 4, 2, 5]
        }]
    };

    console.log('chart options', ctrl.chartOptions);

  }

  function SplashChartDirective() {
    return {
      restrict: 'A',
      scope: {
        'chartOptions': '=',
        'chartData': '='
      },
      link: function(scope,ele) {
        console.log('splash chart', scope.chartOptions);
        scope.chart = ele.highcharts(scope.chartOptions);


      }
    };
  }


})();

(function () {

  var app = angular.module('ml.retail');

  app.controller('marketerCtrl', MarketerCtrl);

  function MarketerCtrl() {

  }

})();

(function () {
  'use strict';
    var app = angular.module('ml.retail');

    app.controller('loginCtrl', LoginCtrl);

    LoginCtrl.$inject = ['userService', '$scope', '$location'];
    function LoginCtrl(userService, $scope, $location) {
      var ctrl = this;

      ctrl.users = {
        'marketer': { label: 'Marketer', desc: 'Manages marketing and promotional campaigns - including social media', name: 'John Marketer' },
        'analyst': { label: 'Analyst', desc: 'Analyzes sales performance, site performance, etc', name: 'Susie Analyst'},
        'loyalty': { label: 'Customer Loyalty Manager', desc: 'Maintains customer loyalty via rewards, social campaigns, targetted cross-selling, etc', name: 'Tom Loyalty' },
        'manager': { label: 'Store Manager', desc: 'Manages operations of the retail store', name: 'Jane Boss'}
      };

      $scope.$watch('ctrl.username', function(newVal, oldVal) {
        if (newVal) {
          ctrl.userdesc = ctrl.users[newVal].desc;
          ctrl.userlabel = ctrl.users[newVal].label;
        } else {
          ctrl.userdesc = ctrl.userlabel = null;
        }
      });

      ctrl.login = function() {
        userService.login(ctrl.username, ctrl.users[ctrl.username].name);
        $location.path('/' + ctrl.username + '/dashboard').search('');
      };
    }
})();

(function () {
  'use strict';

  var app = angular.module('ml.retail');

  app.service('userService', UserService);


  UserService.$inject = ['$http', '$rootScope'];
  function UserService($http, $rootScope) {
    var service = {};
    service.user = null;

    service.login = function(role,username) {
      service.user = { role: role, username: username };
    };

    service.logout = function() {
      service.user = null;
    };

    return service;
  }

})();


/*
  Library to use (close to) fluent-style notation to build structured MarkLogic queries..

  This:

    {
      'or-query': {
        'queries': [
          {
            'range-constraint-query': {
              'constraint-name': 'PublishedDate',
              'range-operator': 'LE',
              'value': new Date().toISOString(),
              'range-option': ['score-function=reciprocal','slope-factor=50']
            }
          },
          {
            'and-query': {
              'queries': []
            }
          }
        ]
      }
    }

  Becomes:

    qb.orQuery(
      qb.rangeConstraintQuery(
        'PublishedDate', 'LE', new Date().toISOString(),
        ['score-function=reciprocal','slope-factor=50']
      ),
      qb.andQuery()
    )

  This:

    {
      'or-query': {
        'queries': [{
          'geospatial-constraint-query': {
            'constraint-name': 'meridian-geo',
            'box': [
              bounds
            ]
          }
        },{
          'geospatial-constraint-query': {
            'constraint-name': 'connect-geo',
            'box': [
              bounds
            ]
          }
        }]
      }
    }

  Becomes:

    qb.orQuery(
      qb.geospatialConstraintQuery('meridian-geo', [bounds]),
      qb.geospatialConstraintQuery('connect-geo', [bounds]),
    )

*/

(function() {
  'use strict';

  angular.module('sample.common')
    .factory('MLSampleQueryBuilder', [function() {
      var andQuery = function () {
        if (arguments.length === 1 && angular.isArray(arguments[0])) {
          return {
            'and-query': {
              'queries': arguments[0]
            }
          };
        } else {
          return {
            'and-query': {
              'queries': Array.prototype.slice.call(arguments)
            }
          };
        }
      };
      return {
        andQuery: andQuery,
        boostQuery: function (matchingQuery, boostingQuery) {
          if (matchingQuery) {
            return {
              'boost-query': {
                'matching-query': matchingQuery,
                'boosting-query': boostingQuery
              }
            };
          } else {
            return {
              'boost-query': {
                'matching-query': andQuery(),
                'boosting-query': boostingQuery
              }
            };
          }
        },
        collectionConstraintQuery: function (constraintName, uris) {
          return {
            'collection-constraint-query': {
              'constraint-name': constraintName,
              'uri': Array.isArray(uris) ? uris : [ uris ]
            }
          };
        },
        customConstraintQuery: function (constraintName, terms) {
          return {
            'custom-constraint-query': {
              'constraint-name': constraintName,
              'text': terms
            }
          };
        },
        customGeospatialConstraintQuery: function (constraintName, annotation, box) {
          return {
            'custom-constraint-query': {
              'constraint-name': constraintName,
              'annotation': annotation,
              'box': box
            }
          };
        },
        documentQuery: function (uris) {
          return {
            'document-query': {
              'uri': Array.isArray(uris) ? uris : [ uris ]
            }
          };
        },
        geospatialConstraintQuery: function (constraintName, boxes) {
          return {
            'geospatial-constraint-query': {
              'constraint-name': constraintName,
              'box': boxes
            }
          };
        },
        operatorState: function (operatorName, stateName) {
          return {
            'operator-state': {
              'operator-name': operatorName,
              'state-name': stateName
            }
          };
        },
        orQuery: function () {
          if (arguments.length === 1 && angular.isArray(arguments[0])) {
            return {
              'or-query': {
                'queries': arguments[0]
              }
            };
          } else {
            return {
              'or-query': {
                'queries': Array.prototype.slice.call(arguments)
              }
            };
          }
        },
        propertiesQuery: function (query) {
          return {
            'properties-query': query
          };
        },
        rangeConstraintQuery: function (constraintName, rangeOperator, value, rangeOptions) {
          if (!rangeOptions) {
            rangeOptions = [];
          }
          if (!rangeOperator) {
            rangeOperator = 'EQ';
          }
          return {
            'range-constraint-query': {
              'constraint-name': constraintName,
              'range-operator': rangeOperator,
              'value': value,
              'range-option': rangeOptions
            }
          };
        },
        structuredQuery: function() {
          if (arguments.length === 1 && angular.isArray(arguments[0])) {
            return {
              'query': {
                'queries': arguments[0]
              }
            };
          } else {
            return {
              'query': {
                'queries': Array.prototype.slice.call(arguments)
              }
            };
          }
        },
        termQuery: function (terms, weight) {
          if (weight) {
            return {
              'term-query': {
                'text': terms,
                'weight': weight
              }
            };
          } else {
            return {
              'term-query': {
                'text': terms
              }
            };
          }
        },
        textQuery: function (text) {
          return {
            'qtext': text
          };
        }
      };
    }]);
}());
