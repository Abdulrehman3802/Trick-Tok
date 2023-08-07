const express = require("express");
const routeController = require("../controllers/role.controller");
const userAuth = require("../controllers/authorizations/user.auth");
const authAccessController = require("../controllers/authorizations/middlewares/user.access");
const roleRouter = express.Router();

roleRouter.route("/addrole").post(routeController.createRole);
roleRouter.route("/allroles").get(routeController.allRoles);
roleRouter
  .route("/role/:id")
  .patch(userAuth.getUser, authAccessController.canEdit, routeController.updateRole)
  .delete(userAuth.getUser, authAccessController.canDelete, routeController.deleteRole);

roleRouter.route("/updateActive").patch( routeController.updateActive);

//FOR SETTING UP ROLE STATUS 
//FOR SETTING UP ROLE STATUS TRUE /FALSE
roleRouter.route("/updateStatus").patch( routeController.updateStatus);
//FOR GETTING  ROLES WHICH STATUS ARE TRUE
roleRouter.route("/getTrue").get(userAuth.getUser, routeController.getTrue);

// Status Change
roleRouter.route("/role/change/:id").patch(routeController.changePermissionStatus);

module.exports = roleRouter;
