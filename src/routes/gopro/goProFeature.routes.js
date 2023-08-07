const express = require('express');
const router = express.Router();
// const authController = require('../../controllers/authorizations/user.auth')
const goProFeaturesController = require('../../controllers/gopro/goProFeature.controller')
// authController.getUser from all routes for testing
router
    .route('/gopro')
    .post(goProFeaturesController.createGoProFeature)
    .get(goProFeaturesController.getAllGoProFeature)
    .patch(goProFeaturesController.updateGoProFeatures)

router
    .route('/gopro/:id')
    .get(goProFeaturesController.getOneGoProFeature)
    .patch(goProFeaturesController.updateOneGoProFeature);



module.exports = router;
