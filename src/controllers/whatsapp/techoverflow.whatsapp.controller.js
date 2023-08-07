// Chat Daddy API

const {
    openConnectionToAccount, getOrderHistory, getAccountState, getAllChats, getSingleChat, sendMessage, logout,
    getAllContacts, getPaginateContacts, checkWhatsAppResgister, getTags, getChatsAndContacts, deleteTag, createTags,
    createTag, getAllTagsCD, createTagChatDaddy
} = require("../../helper/techoverflow.whatsapp.helper");
const qrCode = require('qrcode-terminal');
const whatsAppMessagesRecordModel = require("../../models/whatsapp/whatsapp.messages.record");
const subscriptionModel = require("../../models/subscriptions/subscription.model");
const userModel = require("../../models/user.model");

module.exports.getChatDaddyQrCode = async (req, res) => {
    try {
        // console.log(req.query.chatDaddyId);

        const getMessageCount = await whatsAppMessagesRecordModel.findOne({
            createdBy: req.user_id,
        })
        // const checkUserSubscription = await subscriptionModel.findOne({createdBy: req.user_id})
        const checkUserSubscription = await userModel.findById(req.user_id).populate('subscriptionId')

        // if (getMessageCount?.messageCount ?? 0 >= 500) {
        if ((getMessageCount?.messageCount && getMessageCount?.messageCount >= 500) ||
            (checkUserSubscription &&checkUserSubscription.subscriptionId?.payment_status === 'unpaid')) {
            res.status(200).json({
                message: 'Limit Of Messages is Exceeded',
                useWhatsApp: false,
            })
        } else {
            const response = await getAccountState(req);
            if (response?.status === "failed") {
                res.status(200).json({
                    message: response.message,
                    status: response.status
                })
            } else {
                // console.log(response?.data?.stateInfo?.qr)
                // qrCode.generate(response?.data?.stateInfo?.qr)
                res.status(200).json({
                    message: "Record Fetched Successfully",
                    data: response
                })
            }
        }

    } catch (err) {
        console.log('error--->', err)
        res.status(500).json({
            message: 'Internal Server Error',
            error: err
        })
    }
}

module.exports.getAllChats = async (req, res) => {
    try {
        const chatsResponse = await getAllChats(req)
        if (chatsResponse) {
            res.status(200).json({
                message: "Chats Found Successfully",
                status: 'success',
                data: chatsResponse
            })
        } else {
            res.status(404).json({
                message: "No Chats Found",
                status: 'failed',
                data: []
            })
        }
    } catch (err) {
        console.log('error--->', err)
        res.status(500).json({
            message: 'Internal Server Error',
            error: err
        })
    }
}

module.exports.getSingleChat = async (req, res) => {
    try {
        const chatsResponse = await getSingleChat(req)
        if (chatsResponse) {
            res.status(200).json({
                message: "Chats Found Successfully",
                status: 'success',
                data: chatsResponse
            })
        } else {
            res.status(200).json({
                message: "No Chats Found",
                status: 'failed',
                data: []
            })
        }
    } catch (err) {
        console.log('error--->', err)
        res.status(500).json({
            message: 'Internal Server Error',
            error: err
        })
    }
}

module.exports.sendMessage = async (req, res) => {
    try {
        const message = await sendMessage(req);
        // console.log("in controller-->", message)
        if (message) {
            res.status(200).json({
                message: "Message sent successfully",
                status: 'success',
                data: message
            })
        } else {
            res.status(500).json({
                message: "Something went wrong! Error while sending message",
                status: 'failed',
            })
        }
    } catch (err) {
        console.log('error--->', err)
        res.status(500).json({
            message: 'Internal Server Error',
            error: err
        })
    }
}

module.exports.getOrderHistory = async (req, res) => {
    try {
        const orderHistory = await getOrderHistory(req);
        if (orderHistory) {
            const orders = orderHistory?.data?.map((order) => {
                return {
                    orderNumber: order.orderId,
                    customer: order.phoneNumber,
                    date: new Date(order?.params?.orderDate),
                    orderStatus: order.status,
                    paymentStatus: order?.paymentStatus || 'N/A',
                    amount: `${order?.params?.subTotal} ${order?.params?.currency}`,
                    deliveryDate: order?.datetime,
                    messageStatus: Object.entries(order?.waResponse).length === 0 ? 'N/A' : order?.waResponse,

                }
            })
            res.status(200).json({
                message: "Order History fetched successfully",
                status: 'success',
                orders
            })
        } else {
            res.status(500).json({
                message: "Something went wrong! Error fetching order history",
                status: 'failed',
            })
        }
    } catch (err) {
        console.log('error--->', err)
        res.status(500).json({
            message: 'Internal Server Error',
            error: err
        })
    }
}

module.exports.logout = async (req, res) => {
    try {
        const logoutResponse = await logout(req);
        if (logoutResponse) {
            res.status(200).json({
                message: "Logout Successfully",
                status: 'success',
                data: logoutResponse
            })
        } else {
            res.status(500).json({
                message: "Something went wrong! Error while Logging Out",
                status: 'failed',
            })
        }
    } catch (err) {
        console.log('error--->', err)
        res.status(500).json({
            message: 'Internal Server Error',
            error: err
        })
    }
}


module.exports.getAllContacts = async (req, res, next) => {
    try {
        const allContacts = await getPaginateContacts(req);
        if (allContacts) {
            res.status(200).json({
                message: 'Contacts Fetched Successfully',
                status: 'success',
                contactsCount: allContacts?.contacts.length,
                data: allContacts
            })
        } else {
            res.status(200).json({
                message: 'No Contacts Found',
                status: 'success',
                data: []
            })
        }
    } catch (err) {
        console.log('error--->', err)
        res.status(500).json({
            message: 'Internal Server Error',
            error: err
        })
    }
}

module.exports.checkWhatsAppResgister = async (req, res, next) => {
    try {
        const existence = await checkWhatsAppResgister(req)
        console.log(existence)
        if (existence) {
            res.status(200).json({
                status: 'success',
                data: existence
            })
        } else {
            res.status(200).json({
                message: 'Does Not Exist',
                status: 'success',
                data: []
            })
        }
    } catch (err) {
        console.log('error--->', err)
        res.status(500).json({
            message: 'Internal Server Error',
            error: err
        })
    }
}

module.exports.getAllTags = async (req, res) => {
    try {
        const allTags = await getAllTagsCD(req, res)
        if (allTags) {
            return res.status(200).json({
                message: 'Success',
                count: allTags.tags.length,
                tags: allTags.tags
            })
        } else {
            return res.status(400).json({
                message: 'fail',
                data: null
            })
        }
    } catch (err) {
        // console.log("in controller---->",err)
        return res.status(500).json({
            message: 'Internal Server Error',
            data: err.message
        })
    }
}

module.exports.deleteTag = async (req, res) => {
    try {
        const Tag = await deleteTag(req, res)
        if (Tag) {
            return res.status(200).json({
                message: 'Successfully deleted',
                chatDaddyResponse: Tag
            })
        } else {
            return res.status(400).json({
                message: 'fail',
                data: null
            })
        }
    } catch (err) {
        // console.log("in controller---->",err)
        return res.status(500).json({
            message: 'Internal Server Error',
            data: err.message
        })
    }
}

module.exports.createTag = async (req, res) => {
    try {
        const Tag = await createTagChatDaddy(req, res)
        if (Tag) {
            return res.status(200).json({
                message: 'Successfully created',
            })
        } else {
            return res.status(400).json({
                message: 'fail',
                data: null
            })
        }
    } catch (err) {
        // console.log("in controller---->",err)
        return res.status(500).json({
            message: 'Internal Server Error',
            data: err.message
        })
    }
}

module.exports.contactAndChatfindByTag = async (req, res) => {
    try {
        const tag = req.body.tags
        if (tag) {
            const allChats = await getChatsAndContacts(req, tag)
            console.log("in controller of search by tag---> ", allChats)
            if (allChats.length > 0) {
                return res.status(200).json({
                    status: 'success',
                    count: allChats.length,
                    data: allChats
                })
            } else {
                return res.status(200).json({
                    status: 'fail',
                    Message: "No chats and contacts found",
                    data: null
                })
            }
        }
    } catch (err) {
        // console.log("in controller---->",err)
        return res.status(500).json({
            message: 'Internal Server Error',
            data: err.message
        })
    }
}
module.exports.ReceiveMessage = async (req, res) => {
    try {
        console.log('WebHook Received')
        // const getChats = await getAllChats();
        global.io
            .of('/api')
            .emit('ReceiveMessage', () => {
                console.log('Socket Received')
            })

        res.send('Webhook')
    } catch (err) {
        console.log('error--->', err)
        res.status(500).json({
            message: 'Internal Server Error',
            error: err
        })
    }
}
