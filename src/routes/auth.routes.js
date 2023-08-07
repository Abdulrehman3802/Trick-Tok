const express = require('express');
const authRouter = express.Router();
const authController = require('../controllers/authorizations/user.auth')
const roleHelpers = require('../controllers/authorizations/middlewares/user.roles')
const permissionHelpers = require('../controllers/authorizations/middlewares/user.permissions')
const authAccessController = require('../controllers/authorizations/middlewares/user.access')
const passport = require('passport')

//LOGIN WITH EMAIL PASSWORD
authRouter.route('/auth/login').post(authController.login);

//LOGIN WITH PHONE NUMBER AND PASSWORD
authRouter.route('/auth/login-with-phone').post(authController.loginWithPhone);
authRouter.route('/auth/login-with-facebook').post(authController.loginValidateWithFacebook);


authRouter.route('/auth/logout').get(authController.logout);
authRouter.route('/auth/roles').get(authController.getUser, roleHelpers.getRoles);
authRouter.route('/auth/permissions').get(authController.getUser, permissionHelpers.getPermissions);

authRouter.route('/auth/admin').get(authController.getUser, authAccessController.isAdmin)
// Assigning & Changing Roles & Permission
authRouter.route('/auth/permission/:id').post(authController.getUser, authAccessController.canEdit, roleHelpers.assignRole)

authRouter.route('/auth/google').get(passport.authenticate('google', { scope: ['email', 'profile'] }))
authRouter
    .route('/google/callback')
    .get(passport.authenticate('google', { successRedirect: '/protected', failureRedirect: 'auth/failure' }));

authRouter.route('/auth/facebook').get(passport.authenticate('facebook'));

authRouter.route('/facebook/callback').get(passport.authenticate('facebook', {
    successRedirect: '/protected',
    failureRedirect: 'auth/failure'
}));

authRouter.route('/auth/failure').get(authController.failureRedirectController)


authRouter.route('/auth/admin-login').post(authController.adminLogin)

authRouter.get('/protected', (req, res) => {
    res.status(200).json({
        message: "Login Success",
        isLoggedIn: true
    })
})
module.exports = authRouter;