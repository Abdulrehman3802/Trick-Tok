const express = require("express");
const router = express.Router();
const whatsappUMController = require('../../controllers/whatsapp/whatsapp-um.controller')
const { upload } = require("../../helper/uploader");

router.get('/qr', whatsappUMController.getQR)
router.get('/is-connected', whatsappUMController.getIsConnected)
router.get('/chats', whatsappUMController.getChats)
router.get('/chats-with-messages', whatsappUMController.getChatsWithMessages)
router.post('/send-chat-message', whatsappUMController.sendChatMessage)
router.get('/logout', whatsappUMController.logOut)


router.post('/send-image-message', upload('images').single('file'), whatsappUMController.sendImageMessage)
router.post('/send-document-message', upload('documents').single('file'), whatsappUMController.sendDocumentMessage)
router.post('/send-audio-message', upload('audio').single('file'), whatsappUMController.sendAudioMessage)

module.exports = router;