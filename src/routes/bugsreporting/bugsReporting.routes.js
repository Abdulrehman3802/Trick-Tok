const express = require("express");
const bugsReportingController = require("../../controllers/bugsreporting/bugsReporting.controller");
const {upload} = require("../../helper/uploader");
// const userAuth = require("../../controllers/authorizations/user.auth");
// const authAccessController = require("../../controllers/authorizations/middlewares/user.access");
const router = express.Router();


router
    .route("/bugReports")
    .post(upload('images/bugsReports').single('bugImage'), bugsReportingController.addNewBugReport)
    .get(bugsReportingController.getAllBugReports)

router
    .route("/bugReports/:id")
    .delete(bugsReportingController.deleteBugReportByID)


module.exports = router;
