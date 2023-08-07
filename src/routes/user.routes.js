const express = require("express");
const userController = require("../controllers/user.controller");
const userRoleController = require('../controllers/authorizations/middlewares/user.roles')
const userRouter = express.Router();

const userAuth = require("../controllers/authorizations/user.auth");
const authAccessController = require("../controllers/authorizations/middlewares/user.access");
const { upload } = require("../helper/uploader");
userRouter.route("/signup").post(userController.createUser);
//RESET PASSWORD
userRouter.route("/reset").patch(userController.resetPassword);

// userRouter.route("/adduser").post(userAuth.getUser, authAccessController.canAdd, userController.createUser);
userRouter.route("/adduser").post(userController.createUser);
userRouter.route("/add-user-with-facebook").post(userController.createUserWithFacebook);
userRouter.route("/validate-number").post(userController.validateNumber);

userRouter.route("/updateCred").patch(userAuth.getUser, userController.updateCredentials);

// userRouter.route('/adduser').post(userAuth.getUser,authController.canAdd)

userRouter.route("/user/editprofile").patch(userAuth.getUser, upload('images/profile').single('image'), userController.editProfile);
// userRouter.route('/user/all').get(userAuth.getUser,authAccessController.canView,userController.getAllUsers)
userRouter.route("/user/all").get(userController.getAllUsers);

// userRouter.route('/user/:id').get(userAuth.getUser, authAccessController.canView, userController.getUser).patch(userAuth.getUser, authAccessController.canEdit, userController.updateUser).delete(userAuth.getUser, authAccessController.canDelete, userController.deleteUser)
userRouter
    .route("/user/user-role")
    .get(userRoleController.getUserRole)
    .post(userRoleController.createUserRole)
    .patch(userRoleController.updateUserRole)

userRouter.route("/user/:id").get(userController.getUser).patch(userController.updateUser).delete(userController.deleteUser);



module.exports = userRouter;
