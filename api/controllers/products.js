const Product = require('../../models/product');
const mongoose = require('mongoose');

exports.get_all_products = (req, res, next) => {
    Product.find()
    .select('_id name price productImage')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            products: docs.map(doc => {
                return {
                    _id: doc._id,
                    name: doc.name,
                    price: doc.price,
                    productImage: doc.productImage,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/api/products/' + doc._id
                    }
                }
            })
        };
        console.log(response);
        res.status(200).json(response);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
    });
};

exports.create_new_product = (req, res, next) => {
    const product = new Product({ 
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    product.save()
    .then(result => {
        console.log(result);
        res.status(201).json({ 
            message: 'product created', 
            createdProduct: {
                _id: result._id,
                name: result.name,
                price: result.price,
                productImage: result.productImage,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/api/products/' + result._id
                }
            } 
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
    });
};

exports.get_product_by_id = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
    .select('_id name price productImage')
    .exec()
    .then(doc => {
        console.log(doc);
        res.status(200).json({
            product: doc,
            request: {
                type: 'GET',
                description: 'Get All Products',
                url: 'http://localhost:3000/api/products/'
            }
        }); 
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ message: 'No Valid entry data for this product ID' });
    });
};

exports.update_product = (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    
    for (const ops of req.body) { updateOps[ops.propName] = ops.value; }

    Product.update({_id:id},{ $set:updateOps })
    .exec().then(result => {
        console.log(result);
        res.status(200).json({
            message: 'Product Updated Successfully',
            request: {
                type: 'GET',
                url: 'http://localhost:3000/api/products/' + id
            }
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
    });
};

exports.delete_product_by_id = (req, res, next) => {
    const id = req.params.productId;
    Product.remove({_id:id})
    .exec()
    .then(result => {
        console.log(result);
        res.status(200).json(result);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error:err});
    });
};