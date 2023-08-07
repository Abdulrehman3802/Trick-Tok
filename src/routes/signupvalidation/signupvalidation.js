const express = require('express');
const signUpValidationController = require('../../controllers/signupvalidation/signupvalidation.controller')

const router = express.Router()

router.route('/signup-validate-user').post(signUpValidationController.validateUser)

router.route('/signup-validation').post(signUpValidationController.signUpValidation)

router.route('/validate-token').post(signUpValidationController.signUpValidateToken)

module.exports = router