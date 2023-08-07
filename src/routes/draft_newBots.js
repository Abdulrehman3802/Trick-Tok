const express = require('express')

const DraftBotActionsController = require('../controllers/draft_newBots.controller')
const Draft_Bot_template_router = express.Router()

// Create a new Bot Template
Draft_Bot_template_router
    .route('/bots/create-draft-template')
    .post(DraftBotActionsController.createDraftBotTemplate)

// Get all Bot Templates
Draft_Bot_template_router
    .route('/bots/pending-draft-template')
    .get(DraftBotActionsController.getAllDraftBotTemplates)



module.exports = Draft_Bot_template_router
