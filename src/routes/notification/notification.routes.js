const express = require("express");
const NotificationController = require("../../controllers/notifications/notifications.controller");
const router = express.Router();

router
    .route("/notification/addNotification")
    .post(NotificationController.createNotification);

router
    .route("/notification/allNotifications/")
    .get(NotificationController.allNotifications);

router
    .route("/notification/updateNotificationStatus/:id")
    .patch(NotificationController.updateStatus);

module.exports = router;
