(function () {
    var app = angular.module('ml.retail');

    app.controller('productDetailCtrl', ProductDetailCtrl);

    ProductDetailCtrl.$injector = ['productData', 'consumerSearchService', '$location'];
    function ProductDetailCtrl(productData, consumerSearchService, $location) {
      var ctrl = this;

      ctrl.data = productData.data;
      ctrl.currentTab = 'description';
      ctrl.showTab = function(t) { ctrl.currentTab = t; }

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
