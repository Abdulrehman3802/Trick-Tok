const express = require('express')
const generateLinkRouter = express.Router();
const generateLinkController = require('../../controllers/generate-link/generate-link.controller');

generateLinkRouter.route('/invitelink').post(generateLinkController.invitationLink);
generateLinkRouter.route('/validatelink').post(generateLinkController.linkValidation);

generateLinkRouter.route('/generate-invitation').post(generateLinkController.generateInvitation)
generateLinkRouter.route('/accept-visit-invitation/:referralCode').post(generateLinkController.acceptVisitInvitation)

generateLinkRouter.route('/get-team-name/:referralCode').get(generateLinkController.getTeamName)


module.exports = generateLinkRouter;
