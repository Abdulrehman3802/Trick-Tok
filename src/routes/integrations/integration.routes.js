const express = require('express');
const integrationController = require('../../controllers/integrations/integration.controller')
const integrationRouter = express.Router();
const userAuth = require('../../controllers/authorizations/user.auth')
const authAccessController = require('../../controllers/authorizations/middlewares/user.access')

    // Add Integration
integrationRouter
    .route('/integration/add')
    .post(userAuth.getUser,authAccessController.canAdd,integrationController.createIntegration)


integrationRouter
    // View All Integration
    .route('/integration/all')
    .get(userAuth.getUser,authAccessController.canView,integrationController.getAllIntegrations)


integrationRouter
        .route('/integration/:id')
        //View One Integration
        .get(userAuth.getUser,authAccessController.canView,integrationController.getIntegration)
        //Edit Integration
        .patch(userAuth.getUser,authAccessController.canEdit,integrationController.updateIntegration)
        //Delete Integration
        .delete(userAuth.getUser,authAccessController.canDelete,integrationController.deleteIntegration)

module.exports = integrationRouter