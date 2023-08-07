const mongoose = require('mongoose')

const staticBotTemplateSchema = mongoose.Schema({
    title: {
        type: String
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref : 'user'
    },
    description: {
        type: String
    },
    category: {
        type: String
    },
    filePath: {
        type: String,
    },
    imagePath: {
        type: String,
    },
    isActive: {              // 1:Active 2:Block 3:Deleted
        type: Number,
        default: 1,
    },
}, { timestamps: true })


module.exports = mongoose.model('static_bot_template', staticBotTemplateSchema);
