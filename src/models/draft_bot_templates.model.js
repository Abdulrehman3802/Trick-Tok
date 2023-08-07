const mongoose = require("mongoose");

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

const DraftBotActionSchema = mongoose.Schema({
    name: { type: String },
    botId: {
        type: mongoose.Types.ObjectId, ref: 'bot'
    },
    tree: { type: treeSchema },
    isCompleted:{
        type:Boolean,
        default: false
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

module.exports = mongoose.model('draft_bot_template', DraftBotActionSchema);