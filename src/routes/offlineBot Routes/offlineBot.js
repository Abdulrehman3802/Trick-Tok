const express = require('express')
const offlineController = require('../../controllers/offline Bot/offlineBot.controller')



const offlineBOt_router = express.Router()
offlineBOt_router
    .route('/createofflineBot')
    .post(offlineController.createOfflineBot);
offlineBOt_router
    .route('/offlineBot/:id')
    .patch( offlineController.updateOfflineBot)
    .get(offlineController.findoneOfflineBot)
    .delete( offlineController.deleteOfflineBot)
offlineBOt_router
    .route('/findallofflineBots')
    .get( offlineController.findOfflineBots);

module.exports = offlineBOt_router