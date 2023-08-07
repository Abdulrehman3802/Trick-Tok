// const express = require('express');
// const router = express.Router();
// const whatsAppController = require('../../controllers/whatsapp/whatsapp.controller');

// router.route('/whatsapp-token').post(whatsAppController.generateToken);
// router.route('/whatsapp-start-session').post(whatsAppController.startSession);
// // router.route('/whatsapp-generate-qrcode').get(whatsAppController.generateQrCode);
// router.route('/whatsapp-status-session').post(whatsAppController.statusSession);
// router.route('/whatsapp-check-connection-session').post(whatsAppController.checkConnectionSession);
// router.route('/whatsapp-all-contacts').post(whatsAppController.getAllContacts);
// router.route('/whatsapp-all-chats').post(whatsAppController.getAllChats);
// router.route('/whatsapp-all-chats-with-messages').post(whatsAppController.getAllChats);

// module.exports = router;

const express = require("express");
const router = express.Router();
const whatsAppController = require("../../controllers/whatsapp/whatsapp.controller");
const whatsAppMessageController = require("../../controllers/dashboard/dashboard.controller");
const loginValidator = require("../../controllers/authorizations/user.auth")

router.route("/whatsapp-token").post(whatsAppController.generateToken);
router.route("/whatsapp-start-session").post(whatsAppController.startSession);
// router.route('/whatsapp-generate-qrcode').get(whatsAppController.generateQrCode);
router.route('/whatsapp-status-session').post(whatsAppController.statusSession);
router.route('/whatsapp-check-connection-session').post(whatsAppController.checkConnectionSession);
// router.route('/whatsapp-all-chats').post(whatsAppController.getAllChats);
router.route('/whatsapp-all-contacts').post(whatsAppController.getAllContacts);
router.route('/whatsapp-all-chats-with-messages').post(whatsAppController.getAllChatsWithMessages);
// router.route('/whatsapp-chat-by-id').post(whatsAppController.chatById);
// router.route('/whatsapp-send-message').post(whatsAppController.sendMessage);
router.route('/whatsapp-logout-session').post(whatsAppController.logoutSession);

router.route("/whatsapp-send-verification-text").post(whatsAppController.verificationWhatsAppText);
router.route("/whatsapp-confirm-verification-text").post(whatsAppController.confirmVerificationText);

router.route("/whatsapp-confirm-forgot-password-text").post(whatsAppController.forgotPasswordVerification);


router.route('/whatsapp-qrcode').get(whatsAppController.getQrCode)
router.route('/whatsapp-send-msg').post(whatsAppController.sendMessage)
router.route('/whatsapp-get-all-chats').get(whatsAppController.getAllChats)
router.route('/whatsapp-chat-by-id').post(whatsAppController.getChatById);
// router.route('/whatsapp_chatBy_keyword').post(whatsAppController.scriptedMessages)
router.route('/whatsapp-cloud-send-message').post(whatsAppController.whatsAppCloudSendMessage);
router.route('/whatsapp_chat_by_keyword').get(whatsAppController.scriptedMessagesGet);
router.route('/whatsapp_chat_by_keyword').post(whatsAppController.scriptedMessages);
router.route('/whatsapp/create').post(whatsAppMessageController.whatsappMessagesController)

router.route('/whatsapp/sent-messages-count').get(loginValidator.authenticateUser,whatsAppController.getSendMessagesCount)

module.exports = router;
