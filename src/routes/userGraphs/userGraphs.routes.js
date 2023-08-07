const express = require('express')
const router = express.Router()
const userGraphsControllers = require('../../controllers/usergraphs/userGraphs.controller')

router.route('/graphs/create')
    .post(userGraphsControllers.createGraphsForUser)

router.route('/graphs')
    .get(userGraphsControllers.getAllMyGraphs)

router.route('/graphs')
    .patch(userGraphsControllers.updateStatus)

module.exports = router
