const whatsAppChatDaddyController = require("../../controllers/whatsapp/techoverflow.whatsapp.controller");
const { uploadWhatsAppMedia, memoryUpload } = require("../../helper/uploader");

const express = require("express");
const router = express.Router();
const webHookRouter = express.Router();

router.route('/techoverflow-whatsapp-qr').get(whatsAppChatDaddyController.getChatDaddyQrCode)
router.route('/techoverflow-whatsapp-all-chats').get(whatsAppChatDaddyController.getAllChats)
router.route('/techoverflow-whatsapp-single-chat').get(whatsAppChatDaddyController.getSingleChat)
router.route('/techoverflow-whatsapp-all-contacts').get(whatsAppChatDaddyController.getAllContacts)
// router.route('/techoverflow-whatsapp-delete-contacts').get(whatsAppChatDaddyController.getAllContacts)
router.route('/techoverflow-whatsapp-check-contact').get(whatsAppChatDaddyController.checkWhatsAppResgister)

router.route('/techoverflow-whatsapp-send-message').post(uploadWhatsAppMedia('attachments').
    single('attachment'),
    whatsAppChatDaddyController.sendMessage)

router.route('/techoverflow-whatsapp-order-history').post(whatsAppChatDaddyController.getOrderHistory)

webHookRouter.route('/techoverflow-whatsapp-message-received').post(whatsAppChatDaddyController.ReceiveMessage)

router.route('/techoverflow-whatsapp-logout').post(whatsAppChatDaddyController.logout)

router.route('/techoverflow-allchatandcontact-withtag').post(whatsAppChatDaddyController.contactAndChatfindByTag)
router.route('/techoverflow-alltags').get(whatsAppChatDaddyController.getAllTags)
router.route('/techoverflow-deletetag').delete(whatsAppChatDaddyController.deleteTag)
router.route('/techoverflow-createtag').post(whatsAppChatDaddyController.createTag)


module.exports = router;
module.exports = { whatsappCDRouter: router, webHookRouter };
