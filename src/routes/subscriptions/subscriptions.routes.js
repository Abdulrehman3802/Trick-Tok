const express = require('express');
const subscriptionController = require('../../controllers/subscriptions/subscriptions.controller')
const subscriptionRouter = express.Router();
const getUserSubscriptionRouter = express.Router();

subscriptionRouter.route('/subscription/add').post(subscriptionController.createSubscription);
subscriptionRouter.route('/subscription/update-status').patch(subscriptionController.updateSubscriptionStatus);
getUserSubscriptionRouter.route('/subscription/get-user-subscription').get(subscriptionController.getUserSubscription);

module.exports = {subscriptionRouter,getUserSubscriptionRouter};