const express = require('express');
const tagsController = require('../../controllers/tags/tag.controller')
// const userAuth = require("../controllers/authorizations/user.auth");
// const authAccessController = require("../controllers/authorizations/middlewares/user.access");
const tagsRouter = express.Router();


tagsRouter.route('/test').get(tagsController.getAllTagsCD)

tagsRouter
    .route('/tags')
    .post(tagsController.createTag)
    .get(tagsController.activeTags)

//This route was alltags and got replaced with Search. Get method changed to Post
tagsRouter
    .route('/getAllTagsWithSearch')
    .post(tagsController.allTagsWithSearch)

tagsRouter
    .route('/tag/:id')
    .patch(tagsController.updateTag)
    .get(tagsController.viewOneTag)
    .delete(tagsController.deleteTag)

tagsRouter.route('/tagsbyname')
    .get(tagsController.getTagsByName)



module.exports = tagsRouter;