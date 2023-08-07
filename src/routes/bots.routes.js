const express = require('express')

const botActionsController = require('../controllers/bots.controller')
const userAuth = require('../controllers/authorizations/user.auth')
const authAccessController = require('../controllers/authorizations/middlewares/user.access')
const {upload, memoryUpload} = require("../helper/uploader");
const router = express.Router()

// router.route('/addAction').post(userAuth.getUser, authAccessController.canAdd, botActionsController.addNewAction)

// Get All Bots
router.route('/bots')
    .get(botActionsController.getAllBots)
    .post(botActionsController.createBot)
// Get all Bot Templates
router.route('/bots/allBotTemplates').get(botActionsController.getAllBotTemplates)
// Create new Bot Template with Multiple attachments(optional)
router.route('/bots/createTemplate')
    .post(upload('attachments').fields([
        {
            name: 'videos',
        },
        {
            name: 'images',
        },
        {
            name: 'audios',
        },
        {
            name: 'documents',
        },
        {
            name: 'voiceNotes',
        },
        {
            name: 'stickers', // maxCount: 1
        },
    ]), botActionsController.createNewBotTemplate)
// Import Bot Templates from yaml file
router.route('/bots/importYaml')
    .post(memoryUpload.single('yaml_file'), botActionsController.importTemplatesFromYaml)

router.route('/bots/addStaticTemplate').post(botActionsController.addStaticTemplate)

router.route('/bots/getAllStaticTemplates').get(botActionsController.getAllStaticTemplates)

router.route('/bots/installStaticTemplate/:id').post(botActionsController.installStaticTemplate)
// Delete bulk bots
router.route('/bots/deleteBotBulk')
    .delete(botActionsController.deleteBotBulk)

// Update Bot Template by ID
router.route('/bots/updateTemplate/:id')
    .patch(upload('attachments').fields([
        {
            name: 'videos',
        },
        {
            name: 'images',
        },
        {
            name: 'audios',
        },
        {
            name: 'documents',
        },
        {
            name: 'voiceNotes',
        },
        {
            name: 'stickers', // maxCount: 1
        },
    ]), botActionsController.updateBotTemplate)

// Delete Bot Template by ID
router.route('/bots/deleteTemplate/:id').delete(botActionsController.deleteBotTemplate)
// Get Only Bot by ID
router.route('/bots/:id').get(botActionsController.getBotByID)
//Delete Bot by ID
router.route('/bots/:id').delete(botActionsController.deleteBot)
// Update Bot by ID
router.route('/bots/:id').patch(botActionsController.updateBot)

module.exports = router
