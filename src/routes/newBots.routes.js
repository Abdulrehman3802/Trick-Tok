const express = require('express')

const botActionsController = require('../controllers/newBots.controller')
// const userAuth = require('../controllers/authorizations/user.auth')
// const authAccessController = require('../controllers/authorizations/middlewares/user.access')
const {upload, memoryUpload} = require("../helper/uploader");
const router = express.Router()

// router.route('/addAction').post(userAuth.getUser, authAccessController.canAdd, botActionsController.addNewAction)
router
    .route('/bots/cd-create-message-flow')
    .patch(botActionsController.createMessageFlowTemplateWithCD)

//Create New Bots and Get All Bots
router.route('/bots')
    .post(botActionsController.createBot)   // Create New Bot

router
    .route('/bots/getAllBotsWithNameSearch')
    .post(botActionsController.getAllBotsWithNameSearch)// Get All Bots

// Upload Image to get Public URL of Image
router.route('/bots/upload')
    .post(upload('attachments').single('file'), botActionsController.uploadFile)

// Upload Multiple images to get Public URLs of Images
router.route('/bots/uploadMultipleFiles')
    .post(upload('attachments').array('files'), botActionsController.uploadMultipleFiles)


// Get all Bot Templates
router.route('/bots/allBotTemplates')
    .get(botActionsController.getAllBotTemplates)

// Create a new Bot Template
router.route('/bots/createTemplate')
    .post(botActionsController.createNewBotTemplate)

//Add Static Templates
router.route('/bots/addStaticTemplate')
    .post(botActionsController.addStaticTemplate)

// Get all Static Templates
router.route('/bots/getAllStaticTemplates')
    .get(botActionsController.getAllStaticTemplates)

// Delete bulk bots
router.route('/bots/deleteBotBulk')
    .delete(botActionsController.deleteBotBulk)

// Import Bot Templates from yaml file
router.route('/bots/importYaml')
    .post(memoryUpload.single('yaml_file'), botActionsController.importTemplatesFromYaml)

//Install Static Templates from Template Library
router.route('/bots/installStaticTemplate/:id')
    .post(botActionsController.installStaticTemplate)


// Update Bot Template by ID
router.route('/bots/updateTemplate/:id')
    .patch(botActionsController.updateBotTemplate)

// Delete Bot Template by ID
router.route('/bots/deleteTemplate/:id')
    .delete(botActionsController.deleteBotTemplate)

// Get Only Bot by ID
router.route('/bots/:id')
    .get(botActionsController.getBotByID)

//Delete Bot by ID
router.route('/bots/:id')
    .delete(botActionsController.deleteBot)

// Update Bot by ID
router.route('/bots/:id')
    .patch(botActionsController.updateBot)

router.route('/cd-bots/:id')
    .post(botActionsController.createMessageFlow)
    .get(botActionsController.getMessageFlowById)
    .patch(botActionsController.updateMessageFlow)

router.route('/cd-kw')
    .post(botActionsController.createKeywordReply)
    .get(botActionsController.getKeywordReplies)
    .patch(botActionsController.updateKeywordReply)





// router.route('/bots') // getAllBotsWithNameSearch replaced this routes
// .get(botActionsController.getAllBots)

module.exports = router
