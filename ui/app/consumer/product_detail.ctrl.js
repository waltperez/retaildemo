(function () {
    var app = angular.module('ml.retail');

    app.controller('productDetailCtrl', ProductDetailCtrl);
    app.filter('limitRange', LimitRangeFilter);

    LimitRangeFilter.$injector = ['$filter'];
    function LimitRangeFilter($filter) {
      return function(items, begin, end) {
        console.log('limiting range', begin, end);
        return $filter('limitTo')(items, begin, end);
      }
    }

    ProductDetailCtrl.$injector = ['productData', 'consumerSearchService', '$location'];
    function ProductDetailCtrl(productData, consumerSearchService, $location) {
      var ctrl = this;

      ctrl.data = productData.data;
      ctrl.currentTab = 'description';
      ctrl.showTab = function(t) { ctrl.currentTab = t; }
      ctrl.reviews = { start: 1, end: 10, bucket: 10 }
      ctrl.mapOptions = {
        zoom: 8,
        minZoom: 1,
        center: new google.maps.LatLng('40.7903', '-73.9597'),
        mapTypeControl: false,
        streetViewControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      function updateShownReviews() {
        ctrl.reviews.shown = ctrl.data.reviews.slice(ctrl.reviews.start-1, ctrl.reviews.end);
        // build map markers
        var markers = [];
        for (var i = 0; i < ctrl.reviews.shown.length; i++) {
          var r = ctrl.reviews.shown[i];
          if (r.lat && r.lng) {
            markers.push({
                latitude: r.lat,
                longitude: r.lng
            });
          }
        }
        ctrl.reviews.markers = markers;
        console.log('markers', ctrl.reviews.markers);
      }

      if (ctrl.data.reviews.length) {
        ctrl.reviews.max = ctrl.data.reviews.length;
        updateShownReviews();
      }

      ctrl.advanceReviews = function(steps) {
        steps = steps || ctrl.reviews.bucket;
        ctrl.reviews.start = Math.max(1, ctrl.reviews.start + steps);
        ctrl.reviews.end = Math.min(ctrl.reviews.max, ctrl.reviews.end + steps);
        updateShownReviews();
      }

      ctrl.clickTag = function(feature) {
        consumerSearchService.searchTag(feature.name, feature.value, true);
        $location.path('/consumer/home');
      }

      ctrl.isFeatureSearch = function(feature) {
        for ( var i=0; i < consumerSearchService.searchTags.length; i++ ) {
          var f = consumerSearchService.searchTags[i];
          if (f.name === feature.name && f.value === feature.value) {
            return true;
          }
        }
        return false;
      }

      ctrl.imageStyle = {
        backgroundImage: 'url(' + ctrl.data.largeFrontImage + ')'
      }
    }
})();
