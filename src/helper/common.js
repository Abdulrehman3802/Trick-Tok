const Tag = require("../models/tags/tag.model");
const BotModel = require("../models/bot/bot.model");

exports.getTagsIds = async (tags, user_id) => {
    let tagIds = [];
    if (tags) {
        //find all tags, exist in the database if they are not, then create them
        for (let tag of tags) {
            // console.log("Creating tag: -------> " + tag);
            let foundTag = await Tag.findOne({ tagName: tag, createdBy: user_id });
            if (foundTag) {
                tagIds.push(foundTag._id);
            }
            if (!foundTag) {
                let newTag = new Tag({ tagName: tag, createdBy: user_id });
                let tagRes = await newTag.save();
                if (tagRes) {
                    tagIds.push(tagRes._id);
                }
            }
        }
    }
    return tagIds;
};

exports.getBotID = async (botName, user_id) => {

    let botId = null;
    let bot = await BotModel.findOne({ name: botName, createdBy: user_id, isActive: 1 });
    if (bot) {
        botId = bot._id;
    } else {
        const Bot = await BotModel.create({ name: botName, createdBy: user_id });
        botId = Bot._id;
    }

    return botId;
};

exports.transformFile = (arr) => {

    const today = new Date().toDateString().replaceAll(' ', '_');
    // const uploadPath = path.join(__dirname, `/../../public/attachments/${today}`)
    const uploadPath = `attachments/${today}/`;
    console.log('Upload path: ---->  ' + uploadPath);

    arr.map(item => {
        return {
            originalName: item.originalname,
            mimeType: item.mimetype,
            fileName: item.filename,
            path: uploadPath + item.filename
        };
    });
};

exports.getInitialPath = (path) => {
    const today = new Date().toDateString().replaceAll(' ', '_');
    return `${path}/${today}/`;
};