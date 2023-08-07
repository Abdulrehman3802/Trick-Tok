const express = require('express')

const teamController = require('../../controllers/team/team.controller')
const router = express.Router()

// router.route('/addAction').post(userAuth.getUser, authAccessController.canAdd, teamController.addNewAction)
 
// Create Team
router.route('/team').post(teamController.CreateTeam)
// ------------- Chat Daddy --------------------------------
router.route('/team/me').get(teamController.myTeam)
// ------------- Chat Daddy --------------------------------

// Get Only Team by ID
router.route('/team/:id').get(teamController.getTeamById)
// Update Team by ID
router.route('/team/:id').patch(teamController.updateStatus)
//Delete Team by ID
router.route('/team/:id').delete(teamController.deleteTeam)

//Add Team Member to Team
router.route('/team/:teamId/add-team-member').patch(teamController.AddTeamMember)
//Remove Team Member from Team
router.route('/team/:teamId/remove-team-member').patch(teamController.RemoveTeamMember)
// Get All Team
router.route('/team').get(teamController.getAllTeams)





router.route('/team/my-team/:id').get(teamController.getMyTeam)

module.exports = router
