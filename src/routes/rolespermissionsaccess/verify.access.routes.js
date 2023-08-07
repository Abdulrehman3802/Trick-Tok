const express = require('express');
const verifyAccessController = require("../../middlewares/verify.access.middleware");
const router = express.Router();

router.route('/role-permission/add').post(verifyAccessController.createUserRole);
router.route('/user-role/add').post(verifyAccessController.createRolePermissions);
router.route('/user-role/all').get(verifyAccessController.getAllRoles);



router.route('/user-role/assign').post(verifyAccessController.assignUserRoles);

module.exports = router;