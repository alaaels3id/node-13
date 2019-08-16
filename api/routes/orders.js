const express = require('express');
const OrderController = require('../controllers/orders');
const checkAuth = require('../../middleware/check-auth');

const router = express.Router();

// get all products
router.get('/', checkAuth, OrderController.orders_get_all);

// get order by id
router.get('/:orderId', checkAuth, OrderController.get_order_by_id);

// craete
router.post("/", checkAuth, OrderController.create_new_order);

// delete
router.delete('/:orderId', checkAuth, OrderController.delete_order_by_id);

module.exports = router;