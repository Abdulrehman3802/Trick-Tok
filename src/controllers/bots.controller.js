const BotTemplateModel = require('../models/bot_templates.model');
const mongoose = require('mongoose');
const BotModel = require('../models/bot/bot.model');
const StaticBotTemplateModel = require('../models/bot/static-bot-templates.model');
const Tag = require("../models/tags/tag.model");
const yaml = require('js-yaml');
const { getTagsIds, getBotID } = require("../helper/common");
const path = require("path");
const TeamModel = require("../models/team/team.model");
const fs = require('fs');
const {BotsApi} = require("@chatdaddy/client");

module.exports.createNewBotTemplate = async (req, res) => {
    console.log('--------------------  in Create New Action Controller 2-------------------', req.body);

    try {
        let body = req.body;
        // console.log(body)
        // console.log("---------> tags", JSON.parse(body.tags), '-------> tags', body.tags);
        let botTemplate = {};
        botTemplate.message = {};
        botTemplate.message.images = [];
        botTemplate.message.audios = [];
        botTemplate.message.videos = [];
        botTemplate.message.documents = [];
        botTemplate.message.stickers = [];
        botTemplate.message.voiceNotes = [];
        botTemplate.message.phoneNumber = '';
        botTemplate.message.contactName = '';
        const botName = body.botName;
        // delete body.botName;

        const today = new Date().toDateString().replaceAll(' ', '_');
        // const uploadPath = path.join(__dirname, `/../../public/attachments/${today}`)
        const uploadPath = `attachments/${today}/`;
        console.log('Upload path: ---->  ' + uploadPath);

        if (botName) {
            let botId = await getBotID(botName);
            console.log('----------> ', req.file, '===========> ', req.file);
            if (Object.keys(req.files).length > 0) {
                botTemplate.message.images = req.files?.images?.map(item => {
                    return {
                        originalName: item.originalname,
                        mimeType: item.mimetype,
                        fileName: item.filename,
                        path: uploadPath + item.filename
                    };
                });
                botTemplate.message.audios = req.files?.audios?.map(item => {
                    return {
                        originalName: item.originalname,
                        mimeType: item.mimetype,
                        fileName: item.filename,
                        path: uploadPath + item.filename
                    };
                });
                botTemplate.message.videos = req.files?.videos?.map(item => {
                    return {
                        originalName: item.originalname,
                        mimeType: item.mimetype,
                        fileName: item.filename,
                        path: uploadPath + item.filename
                    };
                });
                botTemplate.message.documents = req.files?.documents?.map(item => {
                    return {
                        originalName: item.originalname,
                        mimeType: item.mimetype,
                        fileName: item.filename,
                        path: uploadPath + item.filename
                    };
                });
                botTemplate.message.stickers = req.files?.stickers?.map(item => {
                    return {
                        originalName: item.originalname,
                        mimeType: item.mimetype,
                        fileName: item.filename,
                        path: uploadPath + item.filename
                    };
                });
                botTemplate.message.voiceNotes = req.files?.voiceNotes?.map(item => {
                    return {
                        originalName: item.originalname,
                        mimeType: item.mimetype,
                        fileName: item.filename,
                        path: uploadPath + item.filename
                    };
                });
            }


            botTemplate.tags = body?.tags ? await getTagsIds(JSON.parse(body?.tags)) : [];
            botTemplate.name = body?.templateName;
            botTemplate.assignee = body.assignee;
            botTemplate.notifyUsers = body?.notifyUsers ? JSON.parse(body.notifyUsers) : [];
            botTemplate.webhooks = body?.webhooks ? JSON.parse(body?.webhooks) : [];
            botTemplate.message.text = body?.messageText;
            botTemplate.message.buttons = body.buttons ? JSON.parse(body.buttons) : [];
            botTemplate.message.delay = body?.delays ?? "";
            botTemplate.message.products = body.products ? JSON.parse(body.products) : [];
            botTemplate.message.phoneNumber = body?.phoneNumber ?? '';
            botTemplate.message.contactName = body?.contactName ?? '';

            const action = {
                ...botTemplate,
                botId: botId,
            };


            const BotAction = await BotTemplateModel.create(action);

            return res.status(201).json({
                data: {
                    ...BotAction.toObject(),
                }
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
};

module.exports.getAllBotTemplates = async (req, res) => {
    try {
        const BotAction = await BotTemplateModel.find();
        if (BotAction.length > 0) {
            res.status(200).json({
                message: 'found', data: BotAction
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
        let body = req.body;
        console.log(body);
        let id = req.params.id;
        // console.log(body)
        // console.log("---------> tags", JSON.parse(body.tags), '-------> tags', body.tags);
        let botTemplate = {};
        botTemplate.message = {};
        botTemplate.message.images = [];
        botTemplate.message.audios = [];
        botTemplate.message.videos = [];
        botTemplate.message.documents = [];
        botTemplate.message.stickers = [];
        botTemplate.message.voiceNotes = [];
        botTemplate.message.phoneNumber = '';
        botTemplate.message.contactName = '';
        const botName = body.botName;
        // delete body.botName;

        const today = new Date().toDateString().replaceAll(' ', '_');
        // const uploadPath = path.join(__dirname, `/../../public/attachments/${today}`)
        const uploadPath = `attachments/${today}/`;
        console.log('Upload path: ---->  ' + uploadPath);

        if (botName) {
            let botId = null;
            let getBotInformation = await BotTemplateModel.findById(id);
            console.log('getBotInformation', getBotInformation);
            let bot = await BotModel.findByIdAndUpdate(getBotInformation?.botId, { name: botName });
            if (!bot) {
                return res.status(404).json({
                    message: 'Bot Name Could Not update',
                });
            }
            botId = bot._id;

            if (Object.keys(req.files).length > 0) {
                botTemplate.message.images = req.files?.images?.map(item => {
                    return {
                        originalName: item.originalname,
                        mimeType: item.mimetype,
                        fileName: item.filename,
                        path: uploadPath + item.filename
                    };
                });
                botTemplate.message.audios = req.files?.audios?.map(item => {
                    return {
                        originalName: item.originalname,
                        mimeType: item.mimetype,
                        fileName: item.filename,
                        path: uploadPath + item.filename
                    };
                });
                botTemplate.message.videos = req.files?.videos?.map(item => {
                    return {
                        originalName: item.originalname,
                        mimeType: item.mimetype,
                        fileName: item.filename,
                        path: uploadPath + item.filename
                    };
                });
                botTemplate.message.documents = req.files?.documents?.map(item => {
                    return {
                        originalName: item.originalname,
                        mimeType: item.mimetype,
                        fileName: item.filename,
                        path: uploadPath + item.filename
                    };
                });
                botTemplate.message.stickers = req.files?.stickers?.map(item => {
                    return {
                        originalName: item.originalname,
                        mimeType: item.mimetype,
                        fileName: item.filename,
                        path: uploadPath + item.filename
                    };
                });
                botTemplate.message.voiceNotes = req.files?.voiceNotes?.map(item => {
                    return {
                        originalName: item.originalname,
                        mimeType: item.mimetype,
                        fileName: item.filename,
                        path: uploadPath + item.filename
                    };
                });
            }

            botTemplate.tags = body?.tags ? await getTagsIds(JSON.parse(body?.tags)) : [];
            botTemplate.name = body?.templateName;
            botTemplate.assignee = body.assignee;
            botTemplate.notifyUsers = body?.notifyUsers ? JSON.parse(body.notifyUsers) : [];
            botTemplate.webhooks = body?.webhooks ? JSON.parse(body?.webhooks) : [];
            botTemplate.message.text = body?.messageText;
            botTemplate.message.buttons = body.buttons ? JSON.parse(body.buttons) : [];
            botTemplate.message.delay = body?.delays ?? "";
            botTemplate.message.products = body.products ? JSON.parse(body.products) : [];
            botTemplate.message.phoneNumber = body?.phoneNumber ?? '';
            botTemplate.message.contactName = body?.contactName ?? '';

            const action = {
                ...botTemplate,
                botId: botId,
            };
            // console.log(botTemplate)
            const updatedResponse = await BotTemplateModel.findOneAndReplace(id, action, { new: true }).lean();
            if (updatedResponse) {
                return res.status(201).json({
                    data: {
                        ...updatedResponse
                    }
                });
            }
            return res.status(201).json({
                message: "Not Updated",
                data: {}
            });

        } else {
            console.log('Error');
            return res.status(404).json({
                message: 'Bot not found',
            });
        }
        return res.status(404).json({
            message: 'Please Provide Bot Name',
        });

    } catch (err) {
        console.log('Error', err);
        return res.status(501).json({
            message: 'Internal Server Error', error: err.message
        });
    }

};
module.exports.deleteBotTemplate = async (req, res) => {
    try {
        const id = req.params.id;
        const deleteAction = await BotTemplateModel.findByIdAndDelete(id);
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

module.exports.createBot = async (req, res, next) => {
    try {
        const bot = await BotModel.create(req.body);

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

module.exports.getAllBots = async (req, res, next) => {
    try {
        const Bots = await BotModel.find();
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
    } catch (err) {
        console.log('Error ', err);
        res.status(400).json({
            message: 'error',
        });
    }
};
module.exports.getBotByID = async (req, res) => {
    console.log('--------------------------------------------------------------')
    console.log('req.params.id', req.params.id);
    try {
        let response = {};
        const id = req.params.id;
        const Bot = await BotModel.findById(id);
        if (Bot) {
            response.name = Bot.name;
            response.id = Bot._id;
            response.startActionId = Bot.startingActionId;
            response.actions = {};
            // GET ALL Bot Templates of the current Bot
            const BotActions = await BotTemplateModel.find({ botId: id });
            if (BotActions) {
                response.actions = BotActions;
                response.actions = response.actions.map(action => {
                    const actionObject = action.toObject();
                    return {
                        ...actionObject,
                        messageId: actionObject.message._id,
                        ...actionObject.message,
                    };
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
        const botData = await BotModel.findByIdAndDelete(id);
        if (botData) {
            res.status(200).json({
                message: 'Deleted Successfully', data: botData
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
module.exports.updateBot = async (req, res) => {
    try {
        const id = req.params.id;
        const updatedBot = await BotModel.findByIdAndUpdate(id, req.body);
        if (updatedBot) {
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
    console.log('---------------------------- In importTemplatesFromYaml Controller  ------------------------------------');
    try {

        if (req.file) {
            const doc = await yaml.load(req.file.buffer.toString('utf-8'));
            if (doc) {
                let botId = await getBotID(doc[0]?.name);
                let botTemplate = {};
                botTemplate.message = {};
                botTemplate.message.attachments = [];
                let botTemplates = doc[0].actions.map(async action => {

                    botTemplate.tags = action?.tags ? await getTagsIds(action?.tags) : [];
                    botTemplate.name = action?.name ?? "No Name";
                    botTemplate.assignee = action?.assignee ?? '';
                    botTemplate.notifyUsers = action?.notifyUsers ?? [];
                    botTemplate.webhooks = action?.webhooks ?? [];
                    botTemplate.message.text = action?.message.text ?? "";
                    botTemplate.message.buttons = action?.message.buttons ?? [];
                    botTemplate.message.delay = action?.delays ?? '';
                    botTemplate.message.products = action?.products ?? [];

                    return { botId, ...botTemplate };
                });

                botTemplates = await Promise.all(botTemplates);

                let response = await BotTemplateModel.insertMany(botTemplates);
                if (response) {
                    res.status(200).json({
                        message: 'Bot Template Created Successfully', data: response
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
        filPath: `public/images/botTemplates/education.jpg`,
        imagePath: `src/assets/bot-template-files/abc.yaml`,
    });
    try {
        const template = await StaticBotTemplateModel.create({
            title: 'Education Template title',
            description: 'Lorem Ips incorrectly google Trans informed',
            category: 'Education',
            imagePath: `public/images/botTemplates/education.jpg`,
            filePath: `src/assets/bot-template-files/abc.yaml`,
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

        const staticBotTemplates = await StaticBotTemplateModel.findById(req.params.id);

        // console.log('staticBotTemplates', staticBotTemplates.filePath, '---->', `${__dirname}/${filePath}`)

        // Read Images from file with filePath
        let ymlContent = fs.readFileSync(path.join(__dirname, `/../../${staticBotTemplates?.filePath}`), 'utf8');
        console.log('staticBotTemplates', path.join(process.cwd(), `/../../${staticBotTemplates?.filePath}`), ymlContent);
        const doc = await yaml.load(ymlContent);

        if (doc) {
            let botId = await getBotID(doc[0]?.name);
            let botTemplate = {};
            botTemplate.message = {};
            botTemplate.message.attachments = [];
            let botTemplates = doc[0].actions.map(async action => {

                botTemplate.tags = action?.tags ? await getTagsIds(action?.tags) : [];
                botTemplate.name = action?.name ?? "No Name";
                botTemplate.assignee = action?.assignee ?? '';
                botTemplate.notifyUsers = action?.notifyUsers ?? [];
                botTemplate.webhooks = action?.webhooks ?? [];
                botTemplate.message.text = action?.message.text ?? "";
                botTemplate.message.buttons = action?.message.buttons ?? [];
                botTemplate.message.delay = action?.delays ?? '';
                botTemplate.message.products = action?.products ?? [];

                return { botId, ...botTemplate };
            });

            botTemplates = await Promise.all(botTemplates);

            let response = await BotTemplateModel.insertMany(botTemplates);
            if (response) {
                res.status(200).json({
                    message: 'Bot Template Created Successfully', data: response
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
        console.log('Error ', e);
        res.status(400).json({
            message: 'error at server',

        });
    }
};

module.exports.deleteBotBulk = async (req, res) => {
    try {
        const arrayOfBotIds = req.body.ids;

        await BotModel.deleteMany({ _id: arrayOfBotIds });

        res.status(200).json({
            message: 'Bot Deleted Successfully ',
        });

    } catch (err) {
        console.log('Error ', err);
        res.status(400).json({
            message: 'error at server',
            data: err
        });
    }
};


module.exports.getAllStaticTemplates = async (req, res) => {
    try {

        const staticBotTemplates = await StaticBotTemplateModel.find().select('title description category imagePath _id');

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

module.exports.getTemplates = async (req, res) => {
    res.status(200).json({
        message: 'Success',
    });
};
