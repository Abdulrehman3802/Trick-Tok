const ultramsg = require('ultramsg-whatsapp-api');
const config = require('config');
const whatsAppMessagesRecordModel = require("../../models/whatsapp/whatsapp.messages.record");
const whatsAppUltraMsgUserInstance = require("../../models/whatsapp-um/whatsapp.um.model")
const teamModel = require("../../models/team/team.model")


const instance_id = config.get('ULTRA_MESSAGE_INSTANCE_ID'); // Ultramsg.com instance id
const ultramsg_token = config.get('ULTRA_MESSAGE_TOKEN');   // Ultramsg.com token
const ultraMessageApi = new ultramsg(instance_id, ultramsg_token);

module.exports.getQR = async (req, res) => {
    try {
        const response = await ultraMessageApi
            .getInstanceQr()

        console.log('getInstanceQr: ', response)

        res
            .json({
                message: response
            })
    } catch (e) {
        console.log('getInstanceQr error: ', e)
        res
            .status(500)
            .json({
                message: 'Error getting instance',
                error: e
            })
    }
}

module.exports.getIsConnected = async (req, res) => {
    try {
        const userInstance = await whatsAppUltraMsgUserInstance.findOne({ createdBy: req.user_id });

        if (userInstance) {

            const response = await ultraMessageApi.getInstanceStatus();
            res
                .json({
                    message: response,
                    userData: userInstance
                })
        }
        else {
            const checkTeamValidation = await teamModel.findOne({
                teamMembers: {
                    $in: req.user_id
                }
            });
            if (checkTeamValidation) {
                const response = await ultraMessageApi.getInstanceStatus();
                res
                    .json({
                        message: response,
                        teamData: checkTeamValidation
                    })
            }
            else {
                const response = await ultraMessageApi.getInstanceStatus();
                res
                    .json({
                        message: response
                    })
            }
        }
    } catch (err) {
        res
            .status(500)
            .json({
                message: 'Error getting is connected',
                error: err
            })
    }
}

module.exports.getChats = async (req, res) => {
    try {
        // const userInstance = await whatsAppUltraMsgUserInstance.findOne({ createdBy: req.user_id });
        // console.log('User------>', userInstace, req.user_id);

        const response = await ultraMessageApi.getChats()
        res
            .json({
                message: response
            })
    } catch (err) {
        res
            .status(500)
            .json({
                message: 'Error getting chats',
                error: err
            })
    }
}

module.exports.getChatsMessages = async (req, res) => {
    try {
        console.log('In Get Chats');
        const userInstance = await whatsAppUltraMsgUserInstance.findOne({ createdBy: req.user_id });
        console.log('User------>', userInstance, req.user_id);
        const response = await ultraMessageApi.getChatsMessages(req.chatId)
        res
            .json({
                message: response
            })
    } catch (err) {
        res
            .status(500)
            .json({
                message: 'Error getting chats messages',
                error: err
            })
    }
}

module.exports.getChatsWithMessages = async (req, res) => {
    try {
        const userInstance = await whatsAppUltraMsgUserInstance.find();
        console.log(userInstance);
        if (userInstance.length === 0) {
            await whatsAppUltraMsgUserInstance.create({ createdBy: req.user_id });
        }
        const response = await ultraMessageApi.getChats()

        const chatMessages = response.map(async chat => {
            return {
                chat,
                messages: await ultraMessageApi.getChatsMessages(chat.id)
            }
        })

        const chatWithMessages = await Promise.all(chatMessages)

        res
            .json({
                message: chatWithMessages
            })
    } catch (err) {
        res
            .status(500)
            .json({
                message: 'Error getting chats messages',
                error: err
            })
    }
}

module.exports.sendChatMessage = async (req, res) => {
    try {

        const response = await ultraMessageApi.sendChatMessage(req.body.to, req.body.body)
        const msgCount = await whatsAppMessagesRecordModel.findOneAndUpdate({ createdBy: req.user_id }, {
            $inc: { messageCount: 1 }
        })
        // console.log('----->',msgCount, req.user_id)
        if (!msgCount) {
            await whatsAppMessagesRecordModel.create({
                createdBy: req.user_id,
                $inc: { messageCount: 1 }
            });
        }
        res
            .json({
                message: response
            })
    } catch (err) {
        res
            .status(500)
            .json({
                message: 'Error sending chat message',
                error: err
            })
    }
}

module.exports.sendImageMessage = async (req, res) => {
    try {
        console.log(req.file)
        const today = new Date().toDateString().replaceAll(' ', '_');
        console.log(`${config.get('BACKEND_BASE_URL')}/assets/images/${today}/${req.file.filename}`)
        //
        // const response = await ultraMessageApi.sendImageMessage(req.body.to,
        //     'Image',
        //     `${config.get('BACKEND_BASE_URL')}/assets/images/${today}/${req.file.filename}`)

        const response = await ultraMessageApi.sendImageMessage(req.body.to,
            'Image',
            `http://192.46.209.63:81/api/assets/images/bugsReports/Thu_Jan_05_2023/Screenshot_20230104_085545png_1672935293311.png`);
        const msgCount = await whatsAppMessagesRecordModel.findOneAndUpdate({ createdBy: req.user_id }, {
            $inc: { messageCount: 1 }
        })

        if (!msgCount) {
            await whatsAppMessagesRecordModel.create({
                createdBy: req.user_id,
                $inc: { messageCount: 1 }
            });
        }
        res
            .json({
                message: response
            })
    } catch (err) {
        res
            .status(500)
            .json({
                message: 'Error sending chat message',
                error: err
            })
    }
}

module.exports.sendDocumentMessage = async (req, res) => {
    try {
        // console.log(req.file)
        const today = new Date().toDateString().replaceAll(' ', '_');
        console.log(`${config.get('BACKEND_BASE_URL')}/assets/images/${today}/${req.file.filename}`)
        //
        // const response = await ultraMessageApi.sendImageMessage(req.body.to,
        //     'Image',
        //     `${config.get('BACKEND_BASE_URL')}/assets/images/${today}/${req.file.filename}`)

        const response = await ultraMessageApi.sendDocumentMessage(req.body.to,
            'CSV',
            `https://file-example.s3-accelerate.amazonaws.com/documents/cv.pdf`);
        const msgCount = await whatsAppMessagesRecordModel.findOneAndUpdate({ createdBy: req.user_id }, {
            $inc: { messageCount: 1 }
        })

        if (!msgCount) {
            await whatsAppMessagesRecordModel.create({
                createdBy: req.user_id,
                $inc: { messageCount: 1 }
            });
        }
        res
            .json({
                message: response
            })
    } catch (err) {
        res
            .status(500)
            .json({
                message: 'Error sending chat message',
                error: err
            })
    }
}

module.exports.sendAudioMessage = async (req, res) => {
    try {
        // console.log(req.file)
        const today = new Date().toDateString().replaceAll(' ', '_');
        console.log(`${config.get('BACKEND_BASE_URL')}/assets/images/${today}/${req.file.filename}`)
        //
        // const response = await ultraMessageApi.sendImageMessage(req.body.to,
        //     'Image',
        //     `${config.get('BACKEND_BASE_URL')}/assets/images/${today}/${req.file.filename}`)

        const response = await ultraMessageApi.sendDocumentMessage(req.body.to,
            'CSV',
            `https://file-example.s3-accelerate.amazonaws.com/documents/cv.pdf`);
        const msgCount = await whatsAppMessagesRecordModel.findOneAndUpdate({ createdBy: req.user_id }, {
            $inc: { messageCount: 1 }
        })

        if (!msgCount) {
            await whatsAppMessagesRecordModel.create({
                createdBy: req.user_id,
                $inc: { messageCount: 1 }
            });
        }
        res
            .json({
                message: response
            })
    } catch (err) {
        res
            .status(500)
            .json({
                message: 'Error sending chat message',
                error: err
            })
    }
}

module.exports.logOut = async (req, res) => {
    try {

        await whatsAppUltraMsgUserInstance.deleteMany();
        const response = await ultraMessageApi.sendInstanceLogout();
        console.log(response);
        res
            .json({
                message: response
            })
    } catch (err) {
        res
            .status(500)
            .json({
                message: 'Error Logging out',
                error: err
            })
    }
}