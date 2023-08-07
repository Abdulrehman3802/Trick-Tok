const express = require('express')
const controller = require('../../controllers/keyword-reply/keyword-reply.controller')
const keywordRouter = express.Router()

keywordRouter
    .route('/keywords')
    .get(controller.getAllKeywords)

keywordRouter
    .route('/searchKeywords')
    .get(controller.searchKeywords)

keywordRouter
    .route('/keyword/:id')
    .get( controller.getOneKeyword)
    .patch( controller.UpdateKeyword)
    // .delete(controller.deleteKeyword)



keywordRouter
    .route('/deleteBulkKeyword')
    .delete( controller.deleteBulk)

keywordRouter
    .route('/creteKeyword')
    .post( controller.createKeyword)

keywordRouter
    .route('/msg-to-keyword')
    .post( controller.whatsAppMessageFromKeyword)

module.exports = keywordRouter