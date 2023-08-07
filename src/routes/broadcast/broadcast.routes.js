const express = require('express')
const broadcastController = require('../../controllers/broadcast/broadcast.controller')
const broadcastRoutes = express.Router()
const { upload } = require("../../helper/uploader");
broadcastRoutes
    .route('/createBroadcast')
    .post(upload('attachments').single('csv'), broadcastController.createCDBroadCast)
    // .post(upload('attachments').single('csv'), broadcastController.createBroadcast)

//These two routes have been replaced by getBroadcastsWithNameSearch

broadcastRoutes
    .route('/allBroadcasts')
    .get(broadcastController.getBroadcastsWithNameSearch)
//
// broadcastRoutes
//     .route('/searchBroadcasts')
//     .get(broadcastController.searchBroadcasts)

broadcastRoutes
    .route('/getBroadcastsWithNameSearch')
    .post(broadcastController.getBroadcastsWithNameSearch)

broadcastRoutes
    .route('/deleteBulkBroadcasts')
    .delete(broadcastController.deleteBulk)
broadcastRoutes
    .route('/Broadcasts/:id')
    .get(broadcastController.findOneBroadcast)
    .patch(broadcastController.updateBroadcast)
    // .delete(broadcastController.deleteBroadcast)

module.exports = broadcastRoutes