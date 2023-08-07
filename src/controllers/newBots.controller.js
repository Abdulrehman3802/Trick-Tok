const BotTemplateModel = require('../models/bot_templates.model');
const BotModel = require('../models/bot/bot.model');
const StaticBotTemplateModel = require('../models/bot/static-bot-templates.model');
const DraftBotTemplateModel = require('../models/draft_bot_templates.model')
const DraftBot = require('../models/bot/draft-bot.model')
const yaml = require('js-yaml');
const {getTagsIds, getBotID} = require("../helper/common");
const path = require("path");
const mongoose = require('mongoose');
const fs = require('fs');
const {BotsApi, KeywordsApi} = require("@chatdaddy/client");
const config = require('config')

const {
    createMessageFlowTemplate,
    createBotWithCD,
    updateActionOfBotTemplateWithCD
} = require("../helper/techoverflow.whatsapp.helper");

async function createTree(body, user_id) {
    let tree = {};

    tree.key = body.key;
    tree.text = body.text;
    tree.type = body.type;
    tree.label = body.label;
    tree.data = body.data;
    tree.icon = body.icon;
    tree.link = body.link;
    tree.message = body.message;
    tree.images = body.images ?? [];
    tree.audios = body.audios ?? [];
    tree.videos = body.videos ?? [];
    tree.stickers = body.stickers ?? [];
    tree.documents = body.documents ?? [];
    tree.voiceNotes = body.voiceNotes ?? [];
    tree.delay = body.delay ?? "";
    tree.products = body.products ?? [];
    tree.phoneNumber = body?.phoneNumber ?? '';
    tree.contactName = body?.contactName ?? '';
    tree.assignee = body.assignee;
    tree.notifyUsers = body?.notifyUsers ?? [];
    tree.webhooks = body?.webhooks ?? [];
    tree.tags = body?.tags ? await getTagsIds(body?.tags, user_id) : [];

    if (body.children.length > 0) {
        tree.children = await Promise.all(body.children.map(child => createTree(child, user_id)));
    } else {
        tree.children = [];
    }

    return tree;
}

// Upload multiple file and return imagePath in response
module.exports.uploadMultipleFiles = async (req, res) => {
    // console.log('--------------------  in Upload Multiple File Controller -------------------');
    const today = new Date().toDateString().replaceAll(' ', '_');
    const uploadPath = `attachments/${today}/`;
    if (req.files) {
        res.status(200).json({
            message: 'File Uploaded Successfully',
            data: req.files.map((file) => {
                return {
                    originalName: file.originalname,
                    path: uploadPath + file.filename,
                    mimetype: file.mimetype,
                    type: file.mimetype.split('/')[0]
                }
            })
        });
    } else {
        res.status(400).json({
            message: 'Files Upload Failed'
        });
    }
}
module.exports.uploadFile = async (req, res) => {
    // console.log('--------------------  in Upload File Controller 2-------------------', req.body);
    const today = new Date().toDateString().replaceAll(' ', '_');
    // const uploadPath = path.join(__dirname, `/../../public/attachments/${today}`)
    const uploadPath = `attachments/${today}/`;
    if (req.file) {
        console.log('Upload path: ---->  ' + uploadPath + '/' + req.file.filename);
        res.status(200).json({
            message: 'File Uploaded Successfully', data: uploadPath + req.file.filename
        });
    } else {
        res.status(400).json({
            message: 'File Upload Failed'
        });
    }

};
module.exports.createNewBotTemplate = async (req, res) => {
    // console.log('--------------------  in Create New Action Controller -------------------');
    try {
        const draftBot = await DraftBot.findOne({createdBy: req.user_id, isActive: 1})
        const draftTemplate = await DraftBotTemplateModel.findOne({createdBy: req.user_id, isCompleted: false})
        if (draftBot || draftTemplate) {
            await DraftBot.findByIdAndUpdate({_id: draftBot._id}, {isActive: 3})
            await DraftBotTemplateModel.findByIdAndUpdate({_id: draftTemplate._id}, {isCompleted: true})
        }

        let body = req.body.tree;
        const botName = `${req.body?.botName}`;

        if (botName) {
            let botCreationResponse = await createBotWithCD(req, {name: `${botName}`})
            if (botCreationResponse) {
                // get status code from axios response
                const statusCode = botCreationResponse.statusCode
                if (statusCode === 500) {
                    return res.status(500).json({
                        message: 'Internal Server Error',
                        error: botCreationResponse
                    });
                }
            }
            if (botCreationResponse.data) {
                let treeJson = req.body
                let transformedTree = transformTree(req, treeJson)
                if(transformedTree.length>0){
                    transformedTree[0].message.buttons.push({
                            "text": "Powered by TrickTok",
                            "url": "https://www.tricktok.co"
                    })
                }
                const cdResponse = await updateActionOfBotTemplateWithCD(req, botCreationResponse.data.id, transformedTree, {name: `${botName}__${req.user_id}`})

                console.log(cdResponse)

                if (cdResponse) {
                    // get status code from axios response
                    const statusCode = cdResponse.statusCode
                    if (statusCode === 500) {
                        return res.status(500).json({
                            message: 'Internal Server Error',
                            error: cdResponse
                        });
                    }
                }

            }

            console.log('now saving template in our local db')

            let botId = await getBotID(botName, req.user_id);
            let tree = await createTree(body, req.user_id);
            // Resolve all promises in children's array
            tree.children = await Promise.all(tree.children);


            const template = {botId, tree, createdBy: req.user_id, chatDaddyFlowId: botCreationResponse.data.id};
            const BotAction = await BotTemplateModel.create(template);
            return res.status(201).json({
                data: {...BotAction.toObject()}
            });

        } else {
            console.log('Error');
            return res.status(404).json({
                message: 'Please Create Bot Name First (required)',
            });
        }


    } catch (err) {
        console.log('Error', err);
        return res.status(501).json({
            message: 'Internal Server Error', error: err.message
        });
    }

}
module.exports.getAllBotTemplates = async (req, res) => {
    try {
        const BotAction = await BotTemplateModel.findOne({createdBy: req.user_id, isCompleted: false});
        if (BotAction) {
            res.status(200).json({
                message: 'found',
                dataCount: BotAction.length,
                data: BotAction.reverse()
            });
        } else {
            res.status(200).json({
                message: 'No Record Found', data: []
            });
        }
    } catch (e) {
        console.log('Error ', e);
        res.status(400).json({
            message: 'error',
        });
    }
};
module.exports.updateBotTemplate = async (req, res) => {
    console.log('--------------------  in Update Action Controller 2-------------------', req.body);

    try {
        let body = req.body.tree;
        const botName = req.body?.botName;
        let botId = null;
        let id = req.params.id;
        if (botName) {
            // let getBotInformation = await BotTemplateModel.findById(id);
            let getBotInformation = await BotTemplateModel.findOne({_id: id, createdBy: req.user_id});
            // let bot = await BotModel.findByIdAndUpdate(getBotInformation?.botId, {name: botName});
            console.log('Filter ----------->  ', {_id: id, createdBy: req.user_id})
            let bot = await BotModel.findOneAndUpdate({
                _id: getBotInformation?.botId,
                createdBy: req.user_id
            }, {name: botName}, {new: true});
            console.log(bot, "------->")
            botId = await bot._id;

            let tree = await createTree(body, req.user_id);
            // Resolve all promises in children's array
            tree.children = await Promise.all(tree.children);

            const action = {botId, tree, createdBy: req.user_id};
            console.log('action ------>  ', {botId, tree, createdBy: req.user_id})
            // const updatedResponse = await BotTemplateModel.findOneAndReplace(id, action, {new: true}).lean();
            const updatedResponse = await BotTemplateModel.findOneAndReplace({
                _id: id,
                createdBy: req.user_id
            }, {...action}, {new: true}).lean();
            console.log('updatedResponse ------>  ', updatedResponse)
            if (updatedResponse) {
                return res.status(201).json({
                    data: {
                        ...updatedResponse
                    }
                });
            }
            return res.status(201).json({
                message: "Could Not Update",
                data: {}
            });

        } else {
            console.log('Error');
            return res.status(404).json({
                message: 'Bot not found or Bot Name is Not Provided',
            });
        }

    } catch (err) {
        console.log('Error', err);
        return res.status(501).json({
            message: 'Internal Server Error', error: err.message
        });
    }

};
module.exports.deleteBotTemplate = async (req, res) => {
    // console.log('--------------------  in Delete Action Controller -------------------');
    try {
        const id = req.params.id;
        // const deleteAction = await BotTemplateModel.findByIdAndDelete(id);
        const deleteAction = await BotTemplateModel.findOneAndUpdate({_id: id, createdBy: req.user_id}, {isActive: 3})
        if (deleteAction) {
            res.status(200).json({
                message: 'Deleted Successfully', data: deleteAction
            });
        } else {
            res.status(404).json({
                message: 'No Record Found', data: []
            });
        }
    } catch (e) {
        console.log('Error ', e);
        res.status(501).json({
            message: "Error Occurred"
        });
    }
};
module.exports.createBot = async (req, res) => {
    try {
        const bot = await BotModel.create({...req.body, createdBy: req.user_id});

        res.status(200).json({
            message: 'created Successfully',
            data: bot
        });

    } catch (err) {
        console.log('Error ', err);
        res.status(400).json({
            message: 'error',
        });
    }
};
module.exports.getAllBotsWithNameSearch = async (req, res) => {
    try {
        const page = req.body.page || 1
        const limit = req.body.limit || 10
        const letter = req.body?.letter

        const skip = page * limit - limit
        if (letter) {
            const Bots = await BotModel.find({
                "name": {"$regex": letter, "$options": "i"},
                createdBy: req.user_id,
                isActive: 1
            }).sort({_id: -1})
                .skip(skip).limit(limit)
            if (Bots) {
                res.status(200).json({
                    message: 'found Successfully',
                    dataCount: Bots?.length,
                    data: Bots
                });
            } else {
                res.status(200).json({
                    message: 'No Record Found', data: []
                });
            }
        } else {
            const Bots = await BotModel.find({
                createdBy: req.user_id,
                isActive: 1
            }).skip(skip).limit(limit)
            if (Bots) {
                res.status(200).json({
                    message: 'found Successfully',
                    dataCount: Bots?.length,
                    data: Bots
                });
            } else {
                res.status(200).json({
                    message: 'No Record Found', data: []
                });
            }
        }

    } catch (err) {
        console.log('Error ', err);
        res.status(400).json({
            message: 'error',
        });
    }
};

module.exports.getBotByID = async (req, res) => {
    // console.log('--------------------  in Get Bot By ID Controller -------------------');
    try {
        let response = {};
        const id = req.params.id;

        const bot = await BotModel.findOne({_id: id, createdBy: req.user_id, isActive: 1});
        if (bot) {
            response.name = bot.name;
            response.id = bot._id;
            response.startActionId = bot.startingActionId;
            response.tree = {};
            // GET ALL Bot Templates of the current Bot
            const BotActions = await BotTemplateModel.find({botId: id, createdBy: req.user_id});
            if (BotActions) {
                response.tree = BotActions;
                response.tree = response.tree.map(action => {
                    const actionObject = action.toObject();
                    return {...actionObject,};
                });
            }
            res.status(200).json({
                message: 'found Successfully',
                data: response
            });
        } else {
            res.status(404).json({
                message: 'No Record Found', data: []
            });
        }
    } catch (err) {
        console.log('Error ', err);
        res.status(501).json({
            message: "Error Occurred"
        });
    }
};
module.exports.deleteBot = async (req, res) => {
    try {
        const id = req.params.id;
        console.log('id  -----------> ', id);
        // let botData = await BotModel.findByIdAndDelete(id);
        let botData = await BotModel.findOneAndUpdate({_id: id, createdBy: req.user_id}, {isActive: 3});
        if (botData) {
            res.status(200).json({
                message: 'Deleted Successfully'
            });
        } else {
            res.status(404).json({
                message: 'No Record Found'
            });
        }
    } catch (e) {
        console.log('Error ', e);
        res.status(501).json({
            message: "Error Occurred"
        });
    }
};
module.exports.updateBot = async (req, res) => {
    try {
        const id = req.params.id;
        // console.log('--------------------  in Update Bot Controller -------------------', id);
        // const updatedBot = await BotModel.findByIdAndUpdate(id, req.body, {new: true});
        const updateBot = await BotModel.findOneAndUpdate({_id: id, createdBy: req.user_id}, req.body, {new: true});
        // console.log(updateBot);
        if (updateBot) {
            res.status(200).json({
                message: 'Bot Updated Successfully'
            });
        } else {
            res.status(404).json({
                message: 'No Record Found', data: []
            });
        }
    } catch (e) {
        console.log('Error ', e);
        res.status(501).json({
            message: "Error Occurred"
        });
    }
};
module.exports.importTemplatesFromYaml = async (req, res) => {
    // console.log('---------------------------- In importTemplatesFromYaml Controller  ------------------------------------');
    try {

        if (req.file) {
            const doc = await yaml.load(req.file.buffer.toString('utf-8'));
            if (doc) {
                console.log('doc <----------------------------', doc);
                let botId = await getBotID(doc[0]?.name);
                let tree = {};

                let botTemplates = doc[0].actions.map(async singleTree => {

                    tree = await createTree(singleTree, req.user_id);
                    tree.children = await Promise.all(tree.children);

                    return {botId, tree, createdBy: req.user_id};
                });

                botTemplates = await Promise.all(botTemplates);

                let response = await BotTemplateModel.insertMany(botTemplates);
                if (response) {
                    res.status(200).json({
                        message: 'Bot Template Created Successfully',
                        dataCount: response?.length,
                        data: response
                    });
                } else {
                    res.status(500).json({
                        message: 'Could not create bot template'
                    });
                }

            } else {
                res.status(404).json({
                    message: 'Document is Empty', data: []
                });
            }
        } else {
            res.status(404).json({
                message: 'No file found'
            });
        }

    } catch (err) {
        console.log('Error ', err);
        res.status(501).json({
            message: "Error Occurred in Exception Handler"
        });
    }
};
module.exports.addStaticTemplate = async (req, res) => {
    console.log({
        category: 'education',
        imagePath: `images/botTemplates/education.jpg`,
        filePath: `src/assets/bot-template-files/Education (EN) Updated.yaml`,

    });
    try {
        const template = await StaticBotTemplateModel.create({
            title: 'Education Template title',
            description: 'This is a description of the Education Template',
            category: 'Education',
            imagePath: `images/botTemplates/education.jpg`,
            filePath: `src/assets/bot-template-files/Education (EN) Updated.yaml`,
            createdBy: req.user_id
        });

        res.status(201).json({
            message: 'template Created Successfully',
            data: template
        });
    } catch (err) {
        console.log('Error', err);
        res.status(501).json({
            message: 'Internal Server Error',
            error: err.message
        });
    }
};
module.exports.installStaticTemplate = async (req, res) => {

    try {

        // const staticBotTemplates = await StaticBotTemplateModel.findById(req.params.id);
        const staticBotTemplates = await StaticBotTemplateModel.findOne({_id: req.params.id})

        console.log('staticBotTemplates Path --->   ', path.join(process.cwd(), `/${staticBotTemplates?.filePath}`));

        // Read Images from file with filePath
        let ymlContent = fs.readFileSync(path.join(process.cwd(), `/${staticBotTemplates?.filePath}`), 'utf8');
        const doc = await yaml.load(ymlContent);

        if (doc) {
            let botId = await getBotID(doc[0]?.name);
            let tree = {};
            let botTemplates = doc[0].actions.map(async singleTree => {

                tree = await createTree(singleTree, req.user_id);
                tree.children = await Promise.all(tree.children);
                return {botId, tree, createdBy: req.user_id};
            });

            botTemplates = await Promise.all(botTemplates);

            let response = await BotTemplateModel.insertMany(botTemplates);
            if (response) {
                res.status(200).json({
                    message: 'Bot && Bot Template (MessageFlows) Installed Successfully',
                    data: response
                });
            } else {
                res.status(500).json({
                    message: 'Could not create bot template'
                });
            }

        } else {
            res.status(404).json({
                message: 'Document is Empty', data: []
            });
        }

    } catch (e) {
        console.log('Error ', e.message);
        res.status(400).json({
            message: 'Error at server',
        });
    }
};
module.exports.deleteBotBulk = async (req, res) => {
    console.log('---------------------------- In deleteBotBulk Controller  ------------------------------------');
    try {
        const arrayOfBotIds = req.body.ids;

        // await BotModel.deleteMany({ _id: arrayOfBotIds });
        await BotModel.deleteMany({_id: {$in: arrayOfBotIds}, createdBy: req.user_id});
        await BotTemplateModel.updateMany({botId: {$in: arrayOfBotIds}}, {isActive: 3});

        res.status(200).json({
            message: 'Bots and associated templates deleted successfully',
        });
    } catch (err) {
        console.log('Error ', err);
        res.status(400).json({
            message: 'Error at server',
            data: err,
        });
    }
};
module.exports.getAllStaticTemplates = async (req, res) => {
    try {

        const staticBotTemplates = await StaticBotTemplateModel
            .find()
            .select('title description category imagePath _id, createdBy, updatedBy');

        if (staticBotTemplates.length > 0) {
            res.status(200).json({
                message: 'found',
                data: staticBotTemplates
            });
        } else {
            res.status(200).json({
                message: 'No Record Found',
                data: []
            });
        }
    } catch (e) {
        console.log('Error ', e);
        res.status(400).json({
            message: 'error',
        });
    }
};

module.exports.createMessageFlow = async (req, res) => {

    try {
        const botsApi = new BotsApi({
            accessToken: req.chatDaddyToken
        })

        const messageFlow = await botsApi.botsCreate({
            botsCreateRequest: {
                name: req.params.id
            }
        })
            .then(r => {
                res
                    .status(200)
                    .json({messageFlow: r})
            })
            .catch(e => {
                console.log(e.response.data)
                res
                    .status(500)
                    .json({error: e.response.data})
            });
    } catch (e) {
        res
            .status(500)
            .json({e})
    }
}
module.exports.createMessageFlowTemplateWithCD = async (req, res) => {
    try {
        let bot = {
            name: req.body.botName,
        }
        let botCreationResponse = await createBotWithCD(req, bot)
        if (botCreationResponse) {
            let treeJson = req.body
            let transformedTree = transformTree(req, treeJson)
            let messageFlowTemplateResponseTemplate = await updateActionOfBotTemplateWithCD(req, botCreationResponse.data.id, transformedTree, bot)
            if (messageFlowTemplateResponseTemplate.data) {
                res.status(200).json({
                    message: 'Bot && Bot Template (MessageFlows) Created Successfully',
                    messageFlowTemplateResponseTemplate: messageFlowTemplateResponseTemplate.data,
                })
            }
        }
    } catch (e) {
        res.status(500).json({message: 'Error at server', error: e.message})
    }
}

function generateUUID() {
    return Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36);
}

let attachmentFilters = [
    "images",
    "videos",
    "audios",
    "stickers",
    "voiceNotes",
    "documents"
]

function mapAttachmentTypes(type) {
    switch (type) {
        case 'documents':
            return 'document'
        case 'images':
            return 'image';
        case 'videos':
            return 'video';
        case 'audios':
        case 'voiceNotes':
            return 'audio';
        default:
            return type;
    }
}

function mapMimeTypes(mimeType) {
    switch (mimeType) {
        case 'application/octet-stream':
            return 'audio/ogg';
        default:
            return mimeType
    }
}

function transformTree(req, json) {
    console.log('tree   ----> ', json)
    let actions = [];
    let count = 0

    function recursiveMapping(node, parentId) {
        ++count
        // const att = [...
        //         Object.entries(node).filter(a => attachmentFilters.includes(a[0])).reduce((acc, [key, value]) => {
        //             if (value.length) {
        //                 acc.attachements = [...acc.attachements, ...value.map(item => ({
        //                     filename: item.originalName,
        //                     url: `${req.protocol}://${req.get('host')}/${item.path}`,
        //                     mimetype: item.mimetype,
        //                     type: item.type
        //                 }))];
        //             }
        //             return acc;
        //         }, {attachements: []})
        //     ]

        let currentNode = {
            id: `action_${node.label.replace(/\s/g, '_')}_${count}`,
            // id: `action_${node.label.replace(/\s/g, '_')}`,
            name: node.label,
            message: {
                text: node.text,
                buttons: [],
                ...Object.entries(node).filter(a => attachmentFilters.includes(a[0])).reduce((acc, [key, value]) => {
                    if (value.length) {
                        acc.attachments = [...acc.attachments, ...value.map(item => ({
                            filename: item.originalName,
                            // url: `${req.protocol}://${req.get('host')}/api/${item.path}`,
                            url: `${config.get('BACKEND_BASE_URL')}assets/${item.path}`,
                            mimetype: mapMimeTypes(item.mimetype),
                            type: mapAttachmentTypes(key)
                        }))];
                    }
                    return acc;
                }, {attachments: []})
            },
            webhooks: node.webhooks,
            notifyUsers: node.notifyUsers,
            tags: node.tags
        };

        /**
         * Handling for sending Contact Card as attachment because CD accepts it as a attachment.
         */

        // if (node.phoneNumber && node.contactName) {
        //     currentNode.message.attachments.push({
        //
        //     })
        // }

        /**
         * End of handling contact card
         */

        if (currentNode.message.attachments?.length === 0) {
            delete currentNode.message.attachments
        }

        if (!actions.length) {
            currentNode.id = 'init';
        }

        if (!node.link) {
            actions.push(currentNode);
        }

        if (parentId) {
            let parentNode = actions.find(action => action.id === parentId);
            let triggerActionId = ''

            if (!node.link) {
                triggerActionId = currentNode.id
            }

            parentNode.message.buttons.push({
                text: node.label,
                triggerActionId: triggerActionId,
                url: node?.link ?? '',
                phoneNumber: node.phoneNumber
            });
        }

        node.children.forEach(childNode => {
            console.log({childNode})
            recursiveMapping(childNode, currentNode.id);
        });
    }

    recursiveMapping(json.tree, null);

    return actions;
}

module.exports.updateMessageFlow = async (req, res) => {
    console.log(req.params)

    try {
        const botsApi = new BotsApi({
            accessToken: req.chatDaddyToken
        })

        const messageFlow = await botsApi.botsPatch({
            id: req.params.id,
            botPatch: {
                startingActionId: 'init',
                name: 'muaazpk_test1',
                actions: [
                    {
                        id: "action_message2btn1_3",
                        name: "Message #3",
                        message: {
                            text: "test message 3",
                            buttons: [
                                {
                                    text: "button 3",
                                    triggerActionId: "",
                                    url: "https://www.google.com",
                                    phoneNumber: ""
                                }
                            ]
                        },
                        webhooks: [],
                        notifyUsers: [],
                        tags: []
                    },
                    {
                        id: "action_testbtn1_2",
                        name: "Message #2",
                        message: {
                            text: "test message 2",
                            buttons: [
                                {
                                    text: "message 2 btn 1",
                                    triggerActionId: "action_message2btn1_3",
                                    url: "",
                                    phoneNumber: ""
                                }
                            ]
                        },
                        webhooks: [],
                        notifyUsers: [],
                        tags: []
                    },
                    {
                        id: "init",
                        name: "Start123",
                        message: {
                            text: "test message 1",
                            buttons: [
                                {
                                    text: "test btn 1",
                                    triggerActionId: "action_testbtn1_2",
                                    url: "",
                                    phoneNumber: ""
                                },
                                {
                                    text: "call me",
                                    triggerActionId: "",
                                    url: "",
                                    phoneNumber: "+923374666439"
                                }
                            ]
                        },
                        webhooks: [],
                        notifyUsers: [],
                        tags: []
                    }
                ],
            }
        })
            .then(r => {
                res
                    .status(200)
                    .json({messageFlow: r.data})
            })
            .catch(e => {
                console.log(e.response.data)
                res
                    .status(500)
                    .json({error: e.response.data})
            });
    } catch (e) {
        res
            .status(500)
            .json({e})
    }
}

module.exports.getMessageFlowById = async (req, res) => {

    try {
        const botsApi = new BotsApi({
            accessToken: req.chatDaddyToken
        })

        const messageFlow = await botsApi.botsGets({
            sortBy: 'updatedAt',
            order: 'DESC'
        })
            .then(r => {
                res
                    .status(200)
                    .json({messageFlow: r.data})
            })
            .catch(e => {
                console.log(e)
                res
                    .status(500)
                    .json({error: e.response.data})
            });
    } catch (e) {
        res
            .status(500)
            .json({e})
    }
}

// module.exports.createKeywordReply = async (req, res) => {
module.exports.createKeywordReply = async (req, res, keywordActionCreateRequestObj) => {

    try {
        const keywordsApi = new KeywordsApi({
            accessToken: req.chatDaddyToken
        })
        console.dir(keywordActionCreateRequestObj)
        const keywordReply = await keywordsApi.createTrigger({
            keywordActionCreateRequestObj: keywordActionCreateRequestObj
            // [
            //     {
            //         accountIds: req.body.accountIds,
            //         enabled: true,
            //         flowIds: req.body.flowIds,
            //         sendTyping: true,
            //         keywords: [
            //             {
            //                 text: 'Hello'
            //             }
            //         ],
            //         triggerType: 'keywordIs',
            //     }
            // ]
        })
            .then(r => {
                console.dir(r.data)
                return r.data
                // res
                //     .status(200)
                //     .json({keywordReply: r.data})
            })
            .catch(e => {
                console.log(e.response.data)
                return e.response.data
                // console.log(e)
                // res
                //     .status(500)
                //     .json({error: e.response.data})
            });
        return keywordReply
    } catch (e) {
        res
            .status(500)
            .json({e})
    }
}

const createKeywordReply = async (req, res) => {

    try {
        const keywordsApi = new KeywordsApi({
            accessToken: req.chatDaddyToken
        })

        const keywordReply = await keywordsApi.createTrigger({
            keywordActionCreateRequestObj: [
                {
                    accountIds: req.body.accountIds,
                    enabled: true,
                    flowIds: req.body.flowIds,
                    sendTyping: true,
                    keywords: [
                        {
                            text: 'Hello'
                        }
                    ],
                    triggerType: 'keywordIs',
                }
            ]
        })
            .then(r => {
                res
                    .status(200)
                    .json({keywordReply: r.data})
            })
            .catch(e => {
                console.log(e)
                res
                    .status(500)
                    .json({error: e.response.data})
            });
    } catch (e) {
        res
            .status(500)
            .json({e})
    }
}

module.exports.getKeywordReplies = async (req, res) => {
    try {
        const keywordsApi = new KeywordsApi({
            accessToken: req.chatDaddyToken
        })

        const keywordReply = await keywordsApi.getTriggers({})
            .then(r => {
                res
                    .status(200)
                    .json({keywordReply: r.data})
            })
            .catch(e => {
                console.log(e)
                res
                    .status(500)
                    .json({error: e.response.data})
            });
    } catch (e) {
        res
            .status(500)
            .json({e})
    }
}

module.exports.updateKeywordReply = async (req, res) => {
    try {
        const keywordsApi = new KeywordsApi({
            accessToken: req.chatDaddyToken
        })

        const keywordReply = await keywordsApi.editTrigger({
            keywordActionEditRequestObj: [
                {
                    id: req.body.id,
                    delay: req.body.delay,
                    executionFrames: req.body.executionFrames
                }
            ]
        })
            .then(r => {
                res
                    .status(200)
                    .json({keywordReply: r.data})
            })
            .catch(e => {
                console.log(e)
                res
                    .status(500)
                    .json({error: e.response.data})
            });
    } catch (e) {
        res
            .status(500)
            .json({e})
    }
}


const updateKeywordReply = async (req, res) => {
    try {
        const keywordsApi = new KeywordsApi({
            accessToken: req.chatDaddyToken
        })

        const keywordReply = await keywordsApi.editTrigger({
            keywordActionEditRequestObj: [
                {
                    id: req.body.id,
                    delay: req.body.delay,
                    executionFrames: req.body.executionFrames
                }
            ]
        })
            .then(r => {
                res
                    .status(200)
                    .json({keywordReply: r.data})
            })
            .catch(e => {
                console.log(e)
                res
                    .status(500)
                    .json({error: e.response.data})
            });
    } catch (e) {
        res
            .status(500)
            .json({e})
    }
}

// module.exports.searchBots = async (req, res) => {
//     try {
//         const letter = req.body.letter
//         const page = req.body.page
//         const limit = req.body.limit
//
//         const skip = page * limit - limit
//         const Bots = await BotModel.find({createdBy: req.user_id, isActive: 1, "name": {"$regex": letter, "$options": "i"}}).skip(skip).limit(limit)
//         if (Bots) {
//             res.status(200).json({
//                 message: 'found Successfully',
//                 dataCount: Bots?.length,
//                 data: Bots
//             });
//         } else {
//             res.status(200).json({
//                 message: 'No Record Found', data: []
//             });
//         }
//     } catch (err) {
//         console.log('Error ', err);
//         res.status(400).json({
//             message: 'error',
//         });
//     }
// };
