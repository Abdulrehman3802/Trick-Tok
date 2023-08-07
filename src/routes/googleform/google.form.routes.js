const express = require('express');
const router = express.Router();
const googleFormController = require('../../controllers/googleforms/google.form.controller');

router.route('/googleform').get(googleFormController.getFormsResponses);

module.exports = router;