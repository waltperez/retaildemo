function product-json(context, params, content)
{
    /**
    var prod = new NodeBuilder();
    prod.startDocument();
    **/

    var prod = {};

    prod.name = content.getElementsByTagName('name').item(0).textContent;


    return prod;
};

exports.transform = product-json;
