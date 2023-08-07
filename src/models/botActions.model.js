const mongoose = require("mongoose")


const tagSchema = mongoose.Schema({
    name: String,
});
const attachmentSchema = mongoose.Schema({
    fieldname: {type: String},
    originalname: {type: String},
    mimetype: {type: String},
    destination: {type: String},
    filename: {type: String},
    path: {type: String},
    size: {type: Number},
})


const buttonSchema = mongoose.Schema({
    key: {type: String},
    data: {type: String},
    icon: {type: String},
    label: {type: String},
    link: {type: String},
    phone_number: {type: String},
    children: {type: [this]}
})

const messageSchema = mongoose.Schema({
    text: {type: String},
    buttons: {type: [buttonSchema]},
    attachments: {
        // type: [{
        //     fieldname: {type: String},
        //     originalname: {type: String},
        //     encoding: {type: String},
        //     mimetype: {type: String},
        //     destination: {type: String},
        //     filename: {type: String},
        //     path: {type: String},
        //     size: {type: Number}
        // }]
        type: [attachmentSchema]
    },
    delay: {type: String},
    products: {type: [String]}

})


const botActionSchema = mongoose.Schema({

    botId: {
        type: mongoose.Types.ObjectId,
        ref: 'bots'
    },
    name: {type: String},
    assignee: {type: String},
    notifyUsers: {type: [String]},
    webhooks: {type: [String]},
    tags: {type: [tagSchema]},
    message: {type: messageSchema}

}, {timestamps: true})


module.exports = mongoose.model('bot_templates', botActionSchema);
