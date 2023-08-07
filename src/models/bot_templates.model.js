const mongoose = require("mongoose");


const tagSchema = mongoose.Schema({
    name: String,
});
const attachmentSchema = mongoose.Schema({
    originalName: { type: String },
    mimeType: { type: String },
    fileName: { type: String },
    path: { type: String },

});

const buttonSchema = mongoose.Schema({
    key: { type: String },
    label: { type: String },
    data: { type: String },
    icon: { type: String },
    link: { type: String },
    phone_number: { type: String },
    children: { type: [this] }
});

const messageSchema = mongoose.Schema({
    text: { type: String },
    buttons: { type: [buttonSchema] },
    images: { type: [attachmentSchema] },
    audios: { type: [attachmentSchema] },
    videos: { type: [attachmentSchema] },
    stickers: { type: [attachmentSchema] },
    documents: { type: [attachmentSchema] },
    voiceNotes: { type: [attachmentSchema] },
    delay: { type: String },
    products: { type: [String] },
    phoneNumber: { type: String },
    contactName: { type: String }
});


const botActionSchema = mongoose.Schema({

    name: { type: String },
    botId: {
        type: mongoose.Types.ObjectId,
        ref: 'bot'
    },
    assignee: { type: String },
    notifyUsers: { type: [String] },
    webhooks: { type: [String] },
    tags: {
        type: [{
            type: mongoose.Types.ObjectId,
            default: null,
            ref: 'tag',
        }],
    },
    message: { type: messageSchema }

}, { timestamps: true });


const treeSchema = mongoose.Schema({
    key: { type: String },
    text: { type: String },
    type: { type: String },
    delays: { type: String },
    label: { type: String },
    data: { type: String },
    icon: { type: String },
    link: { type: String },
    message: { type: String },
    images: {
        type: [{
            originalName: { type: String },
            path: { type: String }
        }], default: []
    },
    audios: {
        type: [{
            originalName: { type: String },
            path: { type: String }
        }], default: []
    },
    videos: {
        type: [{
            originalName: { type: String },
            path: { type: String }
        }], default: []
    },
    stickers: {
        type: [{
            originalName: { type: String },
            path: { type: String }
        }], default: []
    },
    documents: {
        type: [{
            originalName: { type: String },
            path: { type: String }
        }], default: []
    },
    voiceNotes: {
        type: [{
            originalName: { type: String },
            path: { type: String }
        }],
        default: []
    },
    delay: { type: String },
    products: { type: [String], default: [] },
    phoneNumber: { type: String },
    contactName: { type: String },
    assignee: { type: String },
    notifyUsers: { type: [String], default: [] },
    webhooks: { type: [String], default: [] },
    tags: {
        type: [{
            type: mongoose.Types.ObjectId, default: null, ref: 'tag',
        }],
    },
    children: { type: [this], default: [] }
});
const newBotActionSchema = mongoose.Schema({
    name: { type: String },
    botId: {
        type: mongoose.Types.ObjectId, ref: 'bot'
    },
    tree: { type: treeSchema },
    chatDaddyFlowId :{
        type: String
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'user'
    },
    isActive: {
        type: Number,
        default: 1
    }
}, { timestamps: true });


module.exports = mongoose.model('bot_templates', newBotActionSchema);
