const express = require('express')
const CustomizeDashboardRouter = express.Router()
const CustomizeDashboardController = require('../../controllers/CustomizeDashboard/CustomizeDashboard.controller')

CustomizeDashboardRouter
    .route('/create-dashboard')
    .post(CustomizeDashboardController.createDashBoard)
CustomizeDashboardRouter
    .route('/dashboard')
    .patch(CustomizeDashboardController.updateDashBoard)
    .get(CustomizeDashboardController.getDashBoardForUser)
    .delete(CustomizeDashboardController.deleteDashBoard)
module.exports = CustomizeDashboardRouter
