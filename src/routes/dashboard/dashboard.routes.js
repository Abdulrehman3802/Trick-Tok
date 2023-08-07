const express = require('express');
const dashboardController = require('../../controllers/dashboard/dashboard.controller');
const router =express.Router();

router.route('/dashboard-stats').get(dashboardController.getDashboardStats);
router.route('/get-dashboard-stats').get(dashboardController.getDashboardStatsData);
router.route('/get-orders-stats').get(dashboardController.ordersReceivedStats);
//
// // Get All Graphs of Logged-in User
// router.route('/get-all-graphs:id').get(dashboardController.getAllGraphsOfUser);
// // Update Graphs of Logged-in User
// router.route('/update-graphs:id').post(dashboardController.updateGraphsOfUser);


// router.route('/get-Tags-stats').get(dashboardController.getTagsStatsData);
// router.route('/dashboard-new-connections').get(dashboardController.getNewConnectionCount);
// router.route('/dashboard-avg-response-time').get(dashboardController.getAverageResponseTime);
// router.route('/dashboard-get-tasks-added').get(dashboardController.getTasksAdded);

module.exports = router;
