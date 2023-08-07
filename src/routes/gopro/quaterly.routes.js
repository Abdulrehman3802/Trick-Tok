const express = require('express');
const quarterlyRouter = express.Router();
const authController = require('../../controllers/authorizations/user.auth')
const quarterlyController = require('../../controllers/gopro/quaterly.controller')
// authController.getUser from all routes for testing
quarterlyRouter
    .route('/quaterly')
    .post(quarterlyController.createPlan)
    .get(quarterlyController.viewPlan);

quarterlyRouter
    .route('/quaterly/one')
    .get(quarterlyController.viewOnePlan)
    .patch(quarterlyController.updateOnePlan);



module.exports = quarterlyRouter;