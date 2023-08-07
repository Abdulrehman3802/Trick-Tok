const express = require('express');
const orderController = require('../../controllers/order/order.controller')
// const userAuth = require("../controllers/authorizations/user.auth");
// const authAccessController = require("../controllers/authorizations/middlewares/user.access");
const orderRouter = express.Router();


orderRouter
    .route('/orders')
    .post(orderController.createOrder)

orderRouter
    .route('/getAllOrdersWithFilters')
    .post(orderController.getAllOrdersWithFilters)

orderRouter
    .route('/getAllOrdersWithPipeline')
    .post(orderController.getAllOrdersWithPipeline)

orderRouter
    .route('/order/:id')
    .patch(orderController.updateOrder)
    .get(orderController.viewOneOrder)
    .delete(orderController.deleteOrder)

// Testing pagination
// orderRouter
//     .route('/ordersPagination')
//     .get(orderController.ordersPagination)
// orderRouter
//     .route('/ordersNameSearch')
//     .get(orderController.ordersNameSearch)
orderRouter
    .route('/allorders')
    .get(orderController.getAllOrdersWithFilters)
// orderRouter
//     .route('/filterOrders')
//     .get(orderController.orderFilters)

module.exports = orderRouter;