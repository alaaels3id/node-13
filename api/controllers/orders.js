const mongoose = require('mongoose');
const Order = require('../../models/order');
const Product = require('../../models/product');

exports.orders_get_all = (req, res, next) => {
    Order.find().populate('product', '_id name').exec().then(docs => {
        const response = {
            count: docs.length,
            orders: docs.map(doc => {
                return {
                    _id: doc._id,
                    product: doc.product,
                    quantity: doc.quantity,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/api/orders/' + doc._id
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

exports.get_order_by_id = (req, res, next) => {
    const id = req.params.orderId;
    Order.findById({_id:id})
    .populate('product', '_id name price')
    .select('_id product quantity')
    .exec()
    .then(doc => {
        console.log(doc);
        if(!doc) return res.status(404).json({message: 'Order not found !!'});
        res.status(200).json({
            order: doc,
            request: {
                type: 'GET',
                description: 'Get All Orders',
                url: 'http://localhost:3000/api/orders/'
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(404).json({ message: 'No Valid entry data for this order ID' });
    });
};

exports.create_new_order = (req, res, next) => {
    Product.findById(req.body.productId)
    .then(result => {
        const order = new Order({
            _id: mongoose.Types.ObjectId(),
            quantity: req.body.quantity,
            product: req.body.productId
        });
        order.save().then(result => {
            console.log(result);
            res.status(201).json({
                message: "Order stored",
                createdOrder: {
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity
                },
                request: {
                    type: "GET",
                    url: "http://localhost:3000/api/orders/" + result._id
                }
            });
        });
    }).catch(err => {
        console.log(err);
        res.status(404).json({ error: "Product not found" });
    });
};

exports.delete_order_by_id = (req, res, next) => {
    const id = req.params.orderId;
    Order.remove({_id:id})
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