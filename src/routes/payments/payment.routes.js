const express = require("express");
const stripeController = require("../../controllers/payment/payment.controller");

const router = express.Router();
const webhookRouter = express.Router();



router
    .route("/checkout")
    .post(stripeController.checkout)

router
    .route("/stripe/product")
    .get(stripeController.getAllStripeProducts)
    .post(stripeController.createStripeProduct)
    .patch(stripeController.updateStripeProduct)

webhookRouter.route('/stripe-webhook').post(stripeController.stripeWebhookEndpoint)


module.exports = {paymentsRoutes:router,webhookRouter};
