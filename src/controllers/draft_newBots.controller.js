const DraftBotTemplateModel = require('../models/draft_bot_templates.model');
const DraftBotModel = require('../models/bot/draft-bot.model');
const {getTagsIds, getBotID} = require("../helper/common");
async function getDraftBotID(botName,user_id){
    let botId = null;
    let bot = await DraftBotModel.findOne({ name: botName, createdBy: user_id, isActive: 1 });
    if (bot) {
        botId = bot._id;
    } else {
        const Bot = await DraftBotModel.create({ name: botName, createdBy: user_id });
        botId = Bot._id;
    }

    return botId;
}
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
                    path: uploadPath + file.filename,
                    originalName: file.originalname
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
        // console.log('Upload path: ---->  ' + uploadPath + '/' + req.file.filename);
        res.status(200).json({
            message: 'File Uploaded Successfully', data: uploadPath + req.file.filename
        });
    } else {
        res.status(400).json({
            message: 'File Upload Failed'
        });
    }

};
module.exports.createDraftBotTemplate = async (req, res) => {
    // console.log('--------------------  in Create New Action Controller -------------------');

    try {
        let body = req.body.tree;
        const botName = req.body?.botName;
        let updateId
        if(req.user_id){
             updateId = await DraftBotTemplateModel.findOne({createdBy:req.user_id,isCompleted:false})
        }

if(updateId){
    try {
        let body = req.body.tree;
        const botName = req.body?.botName;
        let botId = null;
        let id = updateId._id;
        if (botName) {
            // let getBotInformation = await BotTemplateModel.findById(id);
            let getBotInformation = await DraftBotTemplateModel.findOne({_id: id, createdBy: req.user_id});
            // let bot = await BotModel.findByIdAndUpdate(getBotInformation?.botId, {name: botName});
            // console.log('Filter ----------->  ', {_id: id, createdBy: req.user_id})
            let bot = await DraftBotModel.findOneAndUpdate({
                _id: getBotInformation?.botId,
                createdBy: req.user_id
            }, {name: botName}, {new: true});
            // console.log(bot, "------->")
            botId = await bot._id;

            let tree = await createTree(body, req.user_id);
            // Resolve all promises in children's array
            tree.children = await Promise.all(tree.children);

            const action = {botId, tree, createdBy: req.user_id,isCompleted:false};
            // console.log('action ------>  ', {botId, tree, createdBy: req.user_id})
            // const updatedResponse = await BotTemplateModel.findOneAndReplace(id, action, {new: true}).lean();
            const updatedResponse = await DraftBotTemplateModel.findOneAndReplace({
                _id: id,
                createdBy: req.user_id
            }, {...action}, {new: true}).lean();
            // console.log('updatedResponse ------>  ', updatedResponse)
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


}else{

        if (botName) {
            let botId = await getDraftBotID(botName, req.user_id);


            let tree = await createTree(body, req.user_id);
            // Resolve all promises in children's array
            tree.children = await Promise.all(tree.children);


            const template = {botId, tree, createdBy: req.user_id};
            const BotAction = await DraftBotTemplateModel.create(template);
            return res.status(201).json({
                data: {...BotAction.toObject()}
            });

        } else {
            console.log('Error');
            return res.status(404).json({
                message: 'Please Create Bot Name First (required)',
            });
        }
}


    } catch (err) {
        console.log('Error', err);
        return res.status(501).json({
            message: 'Internal Server Error', error: err.message
        });
    }
};
module.exports.getAllDraftBotTemplates = async (req, res) => {
    try {
        const BotAction = await DraftBotTemplateModel.findOne({createdBy: req.user_id, isCompleted:false});
        if (BotAction) {
            res.status(200).json({
                message: 'found',
                dataCount: BotAction.length,
                data: BotAction
            });
        } else {
            res.status(200).json({
                message: 'No Record Found',
                data: null
            });
        }
    } catch (e) {
        console.log('Error ', e);
        res.status(400).json({
            message: 'error',
        });
    }
};
