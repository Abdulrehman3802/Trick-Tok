const express = require('express');
const permissionController = require('../controllers/permission.controller')
const userAuth = require("../controllers/authorizations/user.auth");
const authAccessController = require("../controllers/authorizations/middlewares/user.access");
const permissionRouter = express.Router();

permissionRouter.route('/permission/add').post(userAuth.getUser,authAccessController.canAdd,permissionController.createPermission)
permissionRouter.route('/permission/allpermissions').get(userAuth.getUser,authAccessController.canView,permissionController.allPermissions)
permissionRouter.route('/permission/:id').patch(userAuth.getUser,authAccessController.canEdit,permissionController.updatePermission).delete(userAuth.getUser,authAccessController.canDelete,permissionController.deletePermission)

// Status Change
permissionRouter.route('/permission/change/:id').patch(userAuth.getUser,authAccessController.canEdit,permissionController.changePermissionStatus)

module.exports = permissionRouter;