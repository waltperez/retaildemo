(function () {
    var app = angular.module('ml.retail');

    app.controller('productDetailCtrl', ProductDetailCtrl);

    ProductDetailCtrl.$injector = ['productData'];
    function ProductDetailCtrl(productData) {
      var ctrl = this;

      ctrl.data = productData.data;
    }
})();
