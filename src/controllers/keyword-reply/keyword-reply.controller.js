const keywordReplyModel = require('../../models/keyword-reply/keyword-reply.model')
const whatsAppMessage = require('../../models/whatsapp/whatsapp.messages.model')
const userModel = require('../../models/user.model')
const newBotActionSchema = require('../../models/bot_templates.model');
const config = require('config');
const WhatsappCloudAPI = require("whatsappcloudapi_wrapper");
const {createKeywordReply, updateKeywordReply} = require("../newBots.controller");
const {KeywordsApi} = require("@chatdaddy/client");
// whatsAppCloudAPI
const Whatsapp = new WhatsappCloudAPI({
    accessToken: config.get('Meta_WA_accessToken'),
    senderPhoneNumberId: config.get('Meta_WA_SenderPhoneNumberId'),
    WABA_ID: config.get('Meta_WA_wabaId'),
    graphAPIVersion: "v15.0",
});
// Bulk delete  keyword replies from bom by sending ids
exports.deleteBulk = async (req, res) => {
    try {
        const userId = req.user_id;
        const keywords = await keywordReplyModel.find({_id: req.body.ids, createdBy: userId, isActive: 1});
        if (keywords) {
            // console.log("Ids List", req.body.ids);
            const ids = req.body.ids;
            console.log(ids);
            const keyword = await keywordReplyModel.updateMany({
                _id: {$in: ids},
                createdBy: userId
            }, {$set: {isActive: 3}}, {multi: true});
            if (keyword) {
                return res.status(200).json({
                    message: "Successfully Deleted",
                });
            } else {
                return res.status(404).json({
                    message: "Couldn't find Keywords"
                });
            }
        }

    } catch (err) {
        console.log("Error", err);
        res.status(501).json({
            message: "Internal Server Error",
        });
    }
}

// Create Keyword
// function formatDate(date) {
//     var hours = date.getUTCHours();
//     var minutes = date.getUTCMinutes();
//     var offsetHours = date.getTimezoneOffset() / 60;
//     var offsetMinutes = date.getTimezoneOffset() % 60;
//
//     return (hours + offsetHours).toString().padStart(2, '0') +
//         ':' + minutes.toString().padStart(2, '0') +
//         (offsetHours >= 0 ? '+' : '+') +
//         offsetHours.toString().padStart(2, '0') +
//         ':' + offsetMinutes.toString().padStart(2, '0');
// }
function formatDate(date) {
    var hours = date.getUTCHours();
    var minutes = date.getUTCMinutes();
    var offsetHours = -date.getTimezoneOffset() / 60;
    var offsetMinutes = -date.getTimezoneOffset() % 60;

    return (hours + offsetHours).toString().padStart(2, '0') +
        ':' + minutes.toString().padStart(2, '0') +
        (offsetHours >= 0 ? '+' : '-') +
        Math.abs(offsetHours).toString().padStart(2, '0') +
        ':' + Math.abs(offsetMinutes).toString().padStart(2, '0');
}


exports.createKeyword = async (req, res) => {
    try {
        // console.log('------>', req.body);
        let triggerType = null;
        if (req.body.condition === "Message Contain Text") {
            triggerType = "contains";
        }
        if (req.body.condition === "Message Contain Phrase") {
            triggerType = "containsPhrase";
        }
        if (req.body.condition === "Message Start With") {
            triggerType = "startsWith";
        }
        if (req.body.condition === "Message Exactly Is") {
            triggerType = "keywordIs";
        }
        let keywords = [{
            text: req.body.keyword,
            createdAt: new Date().toISOString(),
        }]

        const executionFrames = req.body.days.map(days => {
            if (days.isActive) {
                return {
                    day: days.weekdayName,
                    startTime: `${days.from}${req.body.timezoneString}`,
                    endTime: `${days.to}${req.body.timezoneString}`
                }
            }
        })

        const user = await userModel.findById(req.user_id)

        const botTemplate = await newBotActionSchema.findOne({
            botId: req.body.message
        })

        const keywordActionCreateRequestObj = [{
            // accountIds:["acc_474921ae-f00b-4641-99_d21f"],
            accountIds: [user.chatDaddyId],
            sendTyping: true,
            enableOnGroupChats: true,
            triggerType,
            keywords,
            flowIds: [
                botTemplate.chatDaddyFlowId
            ],
            delay: 0,
            executionFrames
        }]

        const response = await createKeywordReply(req, res, keywordActionCreateRequestObj)

        let date = null;
        let keyword = null;
        if (req.body.setTriggerTime === 'Infinite') {
            delete req.body.timeLimit;
            delete req.body.triggerType;
            keyword = await keywordReplyModel.create({
                ...req.body,
                createdBy: req.user_id,
                bot: req.body.message,
                chatDaddyFlowId: response?.keywords?.triggerId
            });
        } else {
            if (req.body.setTriggerTime === 'Once per') {
                if (req.body?.triggerType === 'Hour') {
                    const hours = req.body?.timeLimit;
                    date = new Date();
                    date.setHours(date.getHours() + hours);
                    console.log(date);

                } else if (req.body?.triggerType === 'Minutes') {
                    const minutes = req.body?.timeLimit;
                    date = new Date();
                    date.setMinutes(date.getMinutes() + minutes);
                    console.log(date);

                } else {
                    const days = req.body?.timeLimit;
                    date = new Date();
                    date.setDate(date.getDate() + days);
                    console.log(date);

                }
            }
            keyword = await keywordReplyModel.create({
                ...req.body,
                triggerTimeDuration: date,
                createdBy: req.user_id,
                bot: req.body.message,
                chatDaddyFlowId: response[0]?.id
            });
        }
        if (keyword) {
            return res.status(201).json({
                message: 'Success',
                data: keyword,
                cd: response
            });
        } else {
            return res.status(500).json({
                message: 'Something Went Wrong, Error while creating keyword',
            })
        }

    } catch (e) {
        console.log("Error ---->", e);
        return res.status(500).json({
            message: 'Internal Server Error',
        })

    }
}
// Get ALl keywords that you created and active on time
exports.getAllKeywords = async (req, res) => {
    try {
        const id = req.user_id
        const page = req.body.page
        const limit = req.body.limit

        const skip = page * limit - limit
        const key = await keywordReplyModel.find({createdBy: id, isActive: 1}).sort({_id: -1}).skip(skip).limit(limit)
        if (key) {
            // console.log("----->",key)
            return res.status(201).json({
                message: 'Success',
                count: key?.length,
                data: key
            });
        } else {
            return res.status(500).json({
                message: "can't find keyword according to this User",
            })
        }

    } catch (e) {
        console.log("Error ---->", e);
        return res.status(500).json({
            message: 'Internal Server Error',
        })

    }
}
// Get All keywords that are searched in the bar
exports.searchKeywords = async (req, res) => {
    try {
        const id = req.user_id
        const letter = req.body.letter
        const page = req.body.page
        const limit = req.body.limit

        const skip = page * limit - limit
        const key = await keywordReplyModel.find({
            createdBy: id,
            isActive: 1,
            "keyword": {"$regex": letter, "$options": "i"}
        }).skip(skip).limit(limit)
        if (key) {
            // console.log("----->",key)
            return res.status(201).json({
                message: 'Success',
                count: key?.length,
                data: key
            });
        } else {
            return res.status(500).json({
                message: "can't find keyword according to this User",
            })
        }

    } catch (e) {
        console.log("Error ---->", e);
        return res.status(500).json({
            message: 'Internal Server Error',
        })

    }
}

// Get one keyword object from the DB only which you created
exports.getOneKeyword = async (req, res) => {
    try {
        const key = await keywordReplyModel.findOne({_id: req.params.id, createdBy: req.user_id});
        if (key) {
            return res.status(201).json({
                message: 'Success',
                data: key
            });
        } else {
            return res.status(404).json({
                message: "can't find keyword according to this User",
                data: null
            })
        }

    } catch (e) {
        console.log("Error ---->", e);
        return res.status(500).json({
            message: 'Internal Server Error',
        })

    }
}
// Update keyword object from the DB only which you created
exports.UpdateKeyword = async (req, res) => {
    try {
        const body = req.body
        const id = req.params.id
        const key = await keywordReplyModel.findOneAndUpdate({_id: id, createdBy: req.user_id}, body, {new: true});

        const user = await userModel.findById(req.user_id)

        // await  updateKeywordReply(req,res)
        if (key) {
            return res.status(201).json({
                message: 'Successfully Updated',
                data: key
            });
        } else {
            return res.status(404).json({
                message: "can't find keyword according to this User",
            })
        }

    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Internal Server Error',
        })

    }
}
// delete one keyword object from the DB only which you created
exports.deleteKeyword = async (req, res) => {
    try {
        const id = req.params.id
        const key = await keywordReplyModel.findOneAndUpdate({
            _id: id,
            createdBy: req.user_id
        }, {isActive: 3}, {new: true});
        if (key) {
            return res.status(201).json({
                message: 'Successfully Deleted',
                data: key
            });
        } else {
            return res.status(404).json({
                message: "can't find keyword according to this User",
            })
        }

    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Internal Server Error',
        })

    }
}
//Send Message according to those keywords that on other DB which name is whatsAppMessage message
exports.whatsAppMessageFromKeyword = async (req, res) => {
    try {
        const key = req.body.keyword
        const msg = await whatsAppMessage.find({
            isActive: 1,
            createdBy: req.user_id,
            'data.fromMe': false
        }).select({"data.body": 1, "data.from": 1})
        msg.forEach(e => {
            console.log(e.data.from)
            console.log(e.data.body.includes(key))
            if (e.data.body.includes(key)) {
                Whatsapp.sendText({
                    message: 'Hello😀 This is TrickTok \n Replied after checking keyword from WhatsApp Message',
                    recipientPhone: e.data.from
                })
                    .then(() => {
                        res.status(200).json({
                            message: 'success',
                        })
                    })
                    .catch(err => console.log(err))

            }
        })


    } catch (err) {
        console.log('---->', err.message)
        res.status(500).json({
            message: 'keyword not found',
        })
    }
}
