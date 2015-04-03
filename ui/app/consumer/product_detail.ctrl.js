(function () {
    var app = angular.module('ml.retail');

    app.controller('productDetailCtrl', ProductDetailCtrl);

    ProductDetailCtrl.$injector = ['productData'];
    function ProductDetailCtrl(productData) {
      var ctrl = this;

      ctrl.data = productData.data;
      ctrl.currentTab = 'description';
      ctrl.showTab = function(t) { ctrl.currentTab = t; }

      ctrl.imageStyle = {
        backgroundImage: 'url(' + ctrl.data.largeFrontImage + ')'
      }
    }
})();
