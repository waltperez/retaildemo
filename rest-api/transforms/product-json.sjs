function productJson(context, params, content)
{
    var node = content.root.firstChild;

    var jsonMap = {
      name: '/product/name/text()',
      sku: '/product/sku/text()',
      pid: '/product/productId/text()',
      price: '/product/regularPrice/text()',
      onSale: 'boolean(/product/onSale[text() = "true"])',
      salePrice: '/product/salePrice/text()',
      template: '/product/productTemplate/text()',
      inStoreAvailability: 'boolean(/product/inStoreAvailability[text() = "true"])',
      onlineAvailability: 'boolean(/product/onlineAvailability[text() = "true"])',
      summary: '/product/shortDescription/text()',
      summaryHtml: '/product/shortDescriptionHtml/text()',
      description: '/product/longDescription/text()',
      productImage: '/product/mediumImage/text()',
      largeFrontImage: '/product/largeFrontImage/text()',
      thumbnail: '/product/thumbnailImage/text()'

    }

    prod = mapJson(jsonMap, node);

    // map the features
    prod.features = [];
    var features = Array.prototype.slice.call(content.getElementsByTagName('detail'));
    for (var i = 0; i < features.length; i++) {
      var feature = features[i];
      prod.features.push(
        mapJson({ name: './name/text()', value: './value/text()'}, feature)
      );
    }


    return prod;
};

function mapJson(map,node) {
  var obj = {};
  for (var key in map) {
    obj[key] = node.xpath(map[key]);
  }
  return obj;
}

exports.transform = productJson;
