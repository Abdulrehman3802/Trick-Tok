const express = require('express');
const yearlyRouter = express.Router();
const authController = require('../../controllers/authorizations/user.auth')
const yearlyController = require('../../controllers/gopro/yearly.controller')
// authController.getUser removed from all routes for testing
yearlyRouter
    .route('/yearly')
    .post(yearlyController.createPlan)
    .get(yearlyController.viewPlan);

yearlyRouter
    .route('/yearly/one')
    .get(yearlyController.viewOnePlan)
    .patch(yearlyController.updateOnePlan);



module.exports = yearlyRouter;