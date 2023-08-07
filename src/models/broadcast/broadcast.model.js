const mongoose = require('mongoose');

const broadcastSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    message: {
        type: mongoose.Types.ObjectId,
        ref: 'bot_templates',
        required: true,
    },
    contacts: [{
        type: String,
        required: true,
    }],
    // broadcastHour: [{
    //     weekdayName: String,
    //     from: Date,
    //     to: Date,
    //     isActive: Boolean
    // }],
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'user'
    },
    // replyTime: {
    //     type: Number,
    //     default: 60
    // },
    // channel: {
    //     type: String,
    //     max: 11,
    //     min: 11,
    // },
    // isRandomizeMessage: {
    //     type: Boolean,
    //     default: false
    // },
    // isTurboMode: {
    //     type: Boolean,
    //     default: false
    // },
    // isSimulateChatRead: {
    //     type: Boolean,
    //     default: false
    // },
    status: {
        type: String,
        enum: ['Inactive', 'Progress', 'Completed', 'Scheduled'],
        default: 'Progress'
    },
    isActive: {
        type: Number,
        default: 1

    }
})

module.exports = mongoose.model('broadcast', broadcastSchema);