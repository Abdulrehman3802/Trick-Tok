const fetch = require("cross-fetch");
const whatsAppModel = require("../../models/whatsappverification/whatsappverification.model");
const keywordReplModel = require("../../models/keyword-reply/keyword-reply.model")
const userController = require("../user.controller");
const qrCode = require('qrcode-terminal');
const fs = require('fs');
const SESSION_FILE_PATH = '../../.wwebjs_auth/session.json';
const qr = require('qrcode-base64')
const config = require('config');
const whatsAppMessagesRecordModel = require("../../models/whatsapp/whatsapp.messages.record");
const userModel=require('../../models/user.model')
const signUpValidationModel = require('../../models/signupvalidation/signupvalidation.model')
const {Client, LocalAuth} = require('whatsapp-web.js');
const bot = require('../../models/bot/bot.model')
let sessionData = null;
if (fs.existsSync(SESSION_FILE_PATH)) {
    console.log('In Folder')
    sessionData = require(SESSION_FILE_PATH);
}

// Use the saved values
// const client = new Client({
//     puppeteer:{
//        args:['--no-sandbox']
//     }
// });

// const client = new Client({
//     authStrategy: new LegacySessionAuth({
//         session: sessionData // saved session object
//     })
// });

//
// const client = new Client({
//     authStrategy: new LocalAuth()
// });

const client = new Client({
    // session: sessionCfg,
    authStrategy: new LocalAuth({
        clientId: 'client-1',
    })
})

// console.log({
//     accessToken: config.get('Meta_WA_accessToken'),
//     senderPhoneNumberId: config.get('Meta_WA_SenderPhoneNumberId'),
//     WABA_ID: config.get('Meta_WA_wabaId'),
//     graphAPIVersion: "v15.0",
// })

const WhatsappCloudAPI = require("whatsappcloudapi_wrapper");
const request = require("request");
const offlineBotModel = require("../../models/offline bot/offlineBot");
const cron = require("node-cron");
const {openConnectionToAccount} = require("../../helper/techoverflow.whatsapp.helper");

const Whatsapp = new WhatsappCloudAPI({
    accessToken: config.get('Meta_WA_accessToken'),
    senderPhoneNumberId: config.get('Meta_WA_SenderPhoneNumberId'),
    WABA_ID: config.get('Meta_WA_wabaId'),
    graphAPIVersion: "v15.0",
});

let status = null;
// let client = null;

module.exports.generateToken = async (req, res) => {
    try {
        // console.log("Token");
        const data = await fetch("http://localhost:21465/api/mySession/THISISMYSECURETOKEN/generate-token", {
            method: "POST",
        });
        const resp = await data.json();
        req.data = resp.data;
        // console.log("====== Data ======", resp);
        res.json({
            resp,
        });
    } catch (err) {
        res.status(501).json({
            message: "Internal Server Error",
            error: err.message,
        });
    }
};

module.exports.startSession = async (req, res) => {
    try {
        const {authorization: token} = req.body.headers;
        // const {authorization: token} = req.headers;
        console.log(token);
        const data = await fetch("http://localhost:21465/api/mySession/start-session", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            //make sure to serialize your JSON body
            body: JSON.stringify({
                token,
            }),
        });

        const resp = await data.json();
        delete resp.client?.qrcode;
        // client = resp.client;

        // console.log("====== Data ======", client);
        res.json({
            resp,
        });
    } catch (err) {
        res.status(500).json({
            message: "Internal Server Error",
            error: err.message,
        });
    }
};

module.exports.generateQrCode = async (req, res) => {
    try {
        const {authorization: token} = req.headers;
        req.client = client;
        console.log("URL Code", client, req.client);
        const data = await fetch("http://localhost:21465/api/mySession/qrcode-session", {
            method: "POST",
            //make sure to serialize your JSON body
            body: JSON.stringify({
                token,
                client,
            }),
        });
        // res.writeHead(200, {
        //     'Content-Type': 'image/png',
        //     'Content-Length': img.length,
        // });
        console.log("Data =====>", data);
        const resp = await data.json();
        console.log("====== Data ======", resp);
        res.json({
            data,
        });
    } catch (err) {
        res.status(500).json({
            message: "Internal Server Error",
            error: err.message,
        });
    }
};

module.exports.statusSession = async (req, res) => {
    try {
        const {authorization: token} = req.body.headers;
        // req.client = client;s
        const data = await fetch("http://localhost:21465/api/mySession/qrcode-session", {
            method: "POST",
            base64: true,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                token,
                client,
            }),
        });

        res.status(200).json({
            data,
        });
    } catch (err) {
        res.status(500).json({
            message: "Internal Server Error",
            error: err.message,
        });
    }
};

module.exports.checkConnectionSession = async (req, res) => {
    try {
        const {authorization: token} = req.body.headers;
        // console.log(token, req.body);
        // req.client = client;s
        const data = await fetch("http://localhost:21465/api/mySession/check-connection-session", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                token,
            }),
        });

        const checkConnectionSession = await data.json();
        // console.log("Data================>", checkConnectionSession);
        res.status(200).json({
            checkConnectionSession,
        });
    } catch (err) {
        res.status(500).json({
            message: "Internal Server Error",
            error: err.message,
        });
    }
};

// module.exports.getAllChats = async (req, res) => {
//     try {
//         const {authorization: token} = req.body.headers;
//         // console.log("Token");
//         const data = await fetch("http://localhost:21465/api/mySession/all-chats", {
//             method: "POST",
//             headers: {
//                 Accept: "application/json",
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//                 token,
//                 client,
//             }),
//         });
//         const allChats = await data.json();
//         res.status(200).json({
//             allChats,
//         });
//     } catch (err) {
//         res.status(501).json({
//             message: "Internal Server Error",
//             error: err.message,
//         });
//     }
// };

module.exports.getAllContacts = async (req, res) => {
    try {
        const {authorization: token} = req.body.headers;
        // console.log("Token");
        const data = await fetch("http://localhost:21465/api/mySession/all-contacts", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                token,
            }),
        });
        const allContacts = await data.json();

        res.status(200).json({
            allContacts,
        });
    } catch (err) {
        res.status(501).json({
            message: "Internal Server Error",
            error: err.message,
        });
    }
};

module.exports.getAllChatsWithMessages = async (req, res) => {
    try {
        const {authorization: token} = req.body.headers;
        console.log("Token ====", token);
        const data = await fetch("http://localhost:21465/api/mySession/all-chats-with-messages", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                token,
            }),
        });
        const allChatsWithMessages = await data.json();
        // console.log("All Chats=========", allChatsWithMessages);
        res.status(200).json({
            allChatsWithMessages,
        });
    } catch (err) {
        res.status(500).json({
            message: "Internal Server Error",
            error: err.message,
        });
    }
};

// module.exports.sendMessage = async (req, res) => {
//     try {
//         // console.log(req.body);
//         const {authorization: token} = req.body.config.headers;
//         const {phone, message} = req.body;
//         console.log("TOKEN MESSAGE NUMBER+============", token, phone, message);
//         const sendMsg = await fetch("http://localhost:21465/api/mySession/send-message", {
//             method: "POST",
//             headers: {
//                 Accept: "application/json",
//                 "Content-Type": "application/json",
//             },
//             //make sure to serialize your JSON body
//             body: JSON.stringify({
//                 token,
//                 phone,
//                 message,
//             }),
//         });
//         const msgResponse = await sendMsg.json();
//
//         res.status(201).json({
//             msgResponse,
//         });
//     } catch (err) {
//         res.status(500).json({
//             message: "Internal Server Error",
//             error: err.message,
//         });
//     }
// };

module.exports.logoutSession = async (req, res) => {
    try {
        const {authorization: token} = req.body.headers;
        const logout = await fetch("http://localhost:21465/api/mySession/logout-session", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            //make sure to serialize your JSON body
            body: JSON.stringify({
                token,
            }),
        });
        const logoutResponse = await logout.json();

        res.status(200).json({
            logoutResponse,
        });
    } catch (err) {
        res.status(500).json({
            message: "Internal Server Error",
            error: err.message,
        });
    }
};

// module.exports.chatById = async (req, res) => {
//   try {
//     // const { authorization: token } = req.body.headers;
//     const { token, phone } = req.body;
//     console.log("TOken ====", token, phone);
//     const logout = await fetch(`http://localhost:21465/api/mySession/chat-by-id/${phone}?isGroup=false`, {
//       method: "POST",
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//       },
//       //make sure to serialize your JSON body
//       body: JSON.stringify({
//         token,
//       }),
//     });
//     const logoutResponse = await logout.json();
//
//     res.status(200).json({
//       logoutResponse,
//     });
//   } catch (err) {
//     res.status(500).json({
//       message: "Internal Server Error",
//       error: err.message,
//     });
//   }
// };

module.exports.verificationWhatsAppText = async (req, res) => {
    try {
        const {phone} = req.body;
        const checkValidUser = await userModel.findOne({ phone: phone, isActive:1, type: 'user'})
        const checkInValidUser = await signUpValidationModel.findOne({ phone: phone, isActive:1})

        if(checkValidUser || checkInValidUser) {
            const randomText = Math.floor(Math.random() * 90000) + 10000;

            const request = require('request');
            const options = {
                'method': 'POST',
                'url': `https://graph.facebook.com/v15.0/${config.get('Meta_WA_SenderPhoneNumberId')}/messages`,
                'headers': {
                    'Authorization': `Bearer ${config.get('Meta_WA_accessToken')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "messaging_product": "whatsapp",
                    "recipient_type": "individual",
                    "to": phone,
                    "type": "template",
                    "template": {
                        "name": "tricktok_signup_otp",
                        "language": {
                            "code": "en_US"
                        },
                        "components": [
                            {
                                "type": "body",
                                "parameters": [
                                    {
                                        "type": "text",
                                        "text": randomText
                                    },
                                ]
                            }
                        ]
                    }
                })

            };
            const sendMessage = await new Promise((resolve, reject) => {
                request(options, function (error, response) {
                    if (error) {
                        console.log(error)
                        reject(null)
                    }
                    console.log(response?.body);
                    resolve(response?.body)
                });
            })

            // const sendMessage = await Whatsapp.sendSimpleButtons({
            //     recipientPhone: phone,
            //     message: `Use the following code to verify your number \n ${randomText}`,
            //     listOfButtons: [
            //         {
            //             id: "speak_to_human",
            //             title: "TrickTok",
            //         },
            //     ],
            // });

            // const sendMessage = await Whatsapp.sendText({
            //     message: `Use the following code to verify your number \n ${randomText}`,
            //     recipientPhone: phone,
            // });

            if (sendMessage) {
                const phoneExists = await whatsAppModel.findOne({phone});
                if (!phoneExists) {
                    const whatsAppCode = await whatsAppModel.create({code: randomText, phone: phone});
                    if (whatsAppCode) {
                        res.status(200).json({
                            status: "success",
                            data: sendMessage,
                            code: whatsAppCode,
                            randomText,
                        });
                    }
                } else {
                    const whatsAppCode = await whatsAppModel.updateOne(
                        {phone},
                        {$set: {code: randomText}},
                        {
                            multi: true,
                            new: true,
                        }
                    );
                    if (whatsAppCode) {
                        const whatsAppData = await whatsAppModel.findOne({phone});
                        res.status(200).json({
                            status: "success",
                            data: sendMessage,
                            code: whatsAppData,
                            randomText,
                        });
                    }
                }
            } else {
                res.status(400).json({
                    message: "Error while sending message",
                });
            }
        }else {
            res.status(404).json({
                message: "User Does Not Exist",
                status:'failed'
            });
        }
    } catch (err) {
        res.status(500).json({
            message: "Internal Server Error",
            error: err.message,
            err,
        });
    }
};

module.exports.confirmVerificationText = async (req, res) => {
    try {
        const {code} = req.body;
        if (req.body?.isFacebook) {
            const confirmVerification = await whatsAppModel.findOne({code: code});
            if (confirmVerification && confirmVerification?.phone === req.body.phone) {
                res.status(200).json({
                    status: "success",
                    message: "Token Success",
                    validate: true,
                });
            } else {
                res.status(200).json({
                    status: "failed",
                    message: "Invalid token",
                    validate: false,
                });
            }
        } else {
            const confirmVerification = await whatsAppModel.findOne({code: code});
            if (confirmVerification && confirmVerification?.phone === req.body.phone) {
                const newUserRes = await userController.addUser(req,confirmVerification?.phone);

                const statusCode = newUserRes?.code;
                delete newUserRes?.code;
                if (statusCode === 201) {
                    await whatsAppModel.deleteOne({code: code});
                    res.status(statusCode).json({
                        newUserRes,
                        status: "success",
                    });
                }
            } else {
                res.status(200).json({
                    message: "invalid code",
                    status: "failed",
                });
            }
        }
    } catch (err) {
        res.status(500).json({
            message: "Internal Server Error",
            error: err.message,
            err,
        });
    }
};

module.exports.forgotPasswordVerification = async (req, res) => {
    try {
        const confirmVerification = await whatsAppModel.findOne({code: req.body.code});
        if (confirmVerification && confirmVerification?.phone === req.body.phone) {
            await whatsAppModel.deleteOne({code: req.body.code});
            res.status(200).json({
                message: "code match",
                status: "success",
            });
        } else {
            res.status(200).json({
                message: "invalid code",
                status: "failed",
            });
        }
    } catch (err) {
        res.status(500).json({
            message: "Internal Server Error",
            error: err.message,
        });
    }
};


// ---------------------------------------------------------------------------------------------------
// WhatsApp WeB JS Library

module.exports.getQrCode = async (req, res) => {

    client.on('qr', async (qrcode) => {
        qrCode.generate(qrcode, {small: true});

        const img = await qr.drawImg(qrcode, {
            typeNumber: 4,
            errorCorrectLevel: 'M',
            size: 500
        });
        // console.log(img);
        req.socketio.emit('qr', img);
        // res.send('Successfully connected')

    });
    req.socketio.on('get-chats', () => {
        console.log('In chats');
        req.socketio.emit('chats', client.getChats());
    })


    client.on('ready', async () => {
        // console.log('Client is ready!', client.info);
        // const allChats = await client.getChats();
        // console.log(allChats);

        req.socketio.emit('ready');
        // res.send('Successfully connected')
    });
    client.on('authenticated', (session) => {
        console.log('Session is ready!', session);

    });
    // client.on('message', async (msg) => {
    //
    //     if (msg.body === 'ping') {
    //         await client.sendMessage(msg.from, 'pong');
    //         console.log('Msg', msg.from)
    //         await msg.reply('pong');
    //
    //
    //     }
    //     // console.log('Chat', chat);
    //     // const c= await client.getChatById({chatId:msg.id.id})
    // });

    await client.initialize();


}

module.exports.sendMessage = async (req, res) => {
    try {

        const newMsg = await client.sendMessage(req.body?.Id, req.body.message)
        if (newMsg) {
            res.send(newMsg);
        } else {
            res.send('Failed to send message')
        }
    } catch (err) {
        res.status(500).json({
            message: "Internal Server Error",
            error: err.message,
        });
    }
}

module.exports.getAllChats = async (req, res) => {
    try {
        console.log('client: ', client.info)

        const chats = await client.getChats()
        if (chats) {
            res.send(chats);
        } else {
            res.send('Failed to Fetch chat')
        }
    } catch (err) {
        res.status(500).json({
            message: "Internal Server Error",
            error: err.message,
            err
        });
    }
}

module.exports.getChatById = async (req, res) => {
    try {
        const chatId = req.body.chatId
        const singleChat = await client.getChatById(chatId);
        console.log('----------->', singleChat);
        if (singleChat) {
            const msgs = await singleChat.fetchMessages({limit: 10});
            res.send(msgs);
        } else {
            res.send('Failed to Fetch chat')
        }
    } catch (err) {
        res.status(500).json({
            message: "Internal Server Error",
            error: err.message,
            err
        });
    }
}

module.exports.receiveMessage = async (req, res) => {
    const msg = await client.getChatById(req.body.chatId);
    const msgs = await msg.fetchMessages({limit: 10});
    res.send(msgs);
}
// For Keyword reply GET request Only for webhook configuration and verify token checking
module.exports.scriptedMessagesGet = async (req, res) => {
    try {
        console.log('GET: Someone is pinging me!');

        let mode = req.query['hub.mode'];
        let token = req.query['hub.verify_token'];
        let challenge = req.query['hub.challenge'];

        if (
            mode &&
            token &&
            mode === 'subscribe' &&
            config.get('Meta_WA_VerifyToken') === token
        ) {
            return res.status(200).send(challenge);
        } else {
            return res.status(403).end();
        }
    } catch (error) {
        console.error({error});
        return res.status(500).end();
    }
};
// For Keyword reply POST request Need webhook to be configured
module.exports.scriptedMessages = async (req, res) => {

    console.log('-------------------> API HIT <-------------------------')
    try {

        let data = Whatsapp.parseMessage(req.body);
        if (data?.isMessage) {
            let incomingMessage = data.message; // extract the message object
            let recipientPhone = incomingMessage.from.phone; // extract the phone number of sender
            let recipientName = incomingMessage.from.name;
            let typeOfMsg = incomingMessage.type; // extract the type of message (some are text, others are images, others are responses to buttons etc...)
            let message_id = incomingMessage.message_id;
            // Taking ALl keywords from DB which has condition of start with
            const wordStartWith = await keywordReplModel.find({condition: 'Message Start With'}).select({
                keyword: 1,
                bot: 1
            }).populate({
                path: 'messageflow',
                model: 'bot_template'
            })
            // Taking ALl keywords from DB which has condition of Contain word
            const wordContain = await keywordReplModel.find({condition: 'Message Contain Text'}).select({
                keyword: 1,
                bot: 1
            }).populate({
                path: 'messageflow',
                model: 'bot_template'
            })
            // Taking ALl keywords from DB which has condition of Exactly same
            const wordExactly = await keywordReplModel.find({condition: 'Message Exactly Is'}).select({
                keyword: 1,
                bot: 1
            }).populate({
                path: 'messageflow',
                model: 'bot_template'
            })
// Now the message sending logic starts
            if (typeOfMsg === 'text_message') {
                // start with keyword
                wordStartWith.map(async e => {
                    console.log("--> going", e.messageflow)
                    if (incomingMessage.text.body.startsWith(e.keyword)) {
                        await Whatsapp.sendText({
                            message: `Hey ${recipientName} \nYou are speaking to Mr.Mentor.\nThis is startwith reply`,
                            recipientPhone: recipientPhone,
                        })
                    }
                })
                // exactly keyword
                wordExactly.map(async e => {
                    if (incomingMessage.text.body === (e.keyword)) {
                        await Whatsapp.sendText({
                            message: `Hey ${recipientName}\nYou are speaking to Mr.Mentor.\nThis is Exact keyword  reply`,
                            recipientPhone: recipientPhone,
                        })
                    }
                })
                // contain keyword
                wordContain.map(async e => {

                    if (incomingMessage.text.body.includes(e.keyword)) {
                        await Whatsapp.sendText({
                            message: `Hey ${recipientName}\nYou are speaking to Mr.Mentor.\nThis is include keyword  reply`,
                            recipientPhone: recipientPhone,
                        })
                    }
                })
            }
            // This code is for sending buttons through wtsp
            //     if (incomingMessage.text.body.startsWith('Hi')) {
            //         await Whatsapp.sendSimpleButtons({
            //             message: `Hey ${recipientName}, \nYou are speaking to Mr.Mentor.\nThis is startwith reply`,
            //             recipientPhone: recipientPhone,
            //             listOfButtons: [
            //                 {
            //                     title: 'See document',
            //                     id: 'document',
            //                 },
            //                 {
            //                     title: 'Listen audio',
            //                     id: 'audio',
            //                 },
            //                 {
            //                     title: 'see video',
            //                     id: 'video',
            //                 },
            //
            //             ],
            //         })
            //     }

        // This code is for checking  buttons id if match sends the regarding thing i.e.  document, picture, video, audio  through wtsp
            if (typeOfMsg === 'simple_button_message') {
                let button_id = incomingMessage.button_reply.id;
                //Checking for Document
                if (button_id === 'document') {
                    await Whatsapp.sendDocument({
                        recipientPhone: recipientPhone,
                        caption: 'Mr.Shop here is your Documentation',
                        file_path: 'D:\\JAVASCRIPT\\tft_main\\tricktok-clone-frontend(TO)\\Backend\\public\\attachments\\invoice_ABDULREHMAN.pdf'
                    })
                }
                // Checking for Image
                if (button_id === 'image') {
                    await Whatsapp.sendImage({
                        recipientPhone: recipientPhone,
                        caption: 'Mr.Shop here is your Image',
                        file_path: '../../../public/attachments/abc.png',
                        file_name: 'abc'
                    })
                }
                //check for Video
                if (button_id === 'video') {
                    await Whatsapp.sendVideo(
                        {
                            recipientPhone: recipientPhone,
                            caption: 'video',
                            url: 'https://media.istockphoto.com/id/629173080/video/subway-escalator-moving-downstairs.mp4?s=mp4-640x640-is&k=20&c=sXx5MYwqACl6-9ZKbfHRl7ITWNhwrh7G1VuNNtgUk5g=',
                            // file_path: 'face.avi',
                            // file_name:'face'
                        }
                    )

                }
                // Checking for Audio
                if (button_id === 'audio') {
                    var request = require('request');
                    var options = {
                        'method': 'POST',
                        'url': `https://graph.facebook.com/v15.0/${config.get('Meta_WA_SenderPhoneNumberId')}/messages`,
                        'headers': {
                            'Authorization': `Bearer ${config.get('Meta_WA_accessToken')}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            "messaging_product": "whatsapp",
                            "recipient_type": "individual",
                            "to": recipientPhone,
                            "type": "audio",
                            "audio": {
                                "link": "https://www.computerhope.com/jargon/m/example.mp3"
                            }
                        })

                    };
                    request(options, function (error, response) {
                        if (error) throw new Error(error);
                        console.log(response.body);
                    });
                }
            }
            await Whatsapp.markMessageAsRead({
                message_id
            })
        }
        res.send({
            message: 'Message received',
        })

    } catch (err) {
        console.log(err);
        res.send({message: 'Error', err: err})
    }
}

module.exports.whatsAppCloudSendMessage = async (req, res) => {
    try {
        const msgResponse = await Whatsapp.sendSimpleButtons({
            recipientPhone: req.body.phone,
            message: req.body.message,
            listOfButtons: [
                {
                    id: "speak_to_human",
                    title: "TrickTok",
                },
            ],
        })

        res.send({
            message: 'Message sent',
            msgResponse
        })
    } catch (err) {
        console.log(err);
        res.send({message: 'Error', err: err})
    }
}


module.exports.getSendMessagesCount = async (req, res) => {
    try {
        // console.log(req.user_id)
        const messagesCount = await whatsAppMessagesRecordModel.findOne({createdBy: req.user_id})
            .select({messageCount: 1})
        if (messagesCount) {
            res.status(200).json({
                status: 'success',
                data: messagesCount
            })
        } else {
            res.status(200).json({
                status: 'empty',
                data: 0
            })
        }

    } catch (err) {
        res.status(500).json({
            message: 'Internal Server Error',
            error: err.message
        })
    }
}