const mongoose = require('mongoose')

const KeywordSchema = mongoose.Schema({

    condition: {
        type: String,
        required: true,
        enum: ['Message Contain Text', 'Message Contain Phrase', 'Message Exactly Is', 'Message Start With'],
        default: 'Message Exactly Is',
    },
    keyword: {
        type: String,
        required: true,
    },
    bot: {
        type: mongoose.Types.ObjectId,
        require: true,
        ref: 'bot',
        default: null
    },
    isTimeSync: {
        type: Boolean,
        default: false,
    },
    days: [
        {
            weekdayName: String,
            from: String,
            to: String,
            isActive: Number
        }
    ],
    setTriggerTime: {
        type: String,
        enum: ['Once per', 'Infinite'],
        default: 'Once per day'
    },
    triggerTimeDuration: {
        type: Date,
        default: null
    },
    isStimulatedChatRead: {
        type: Boolean,
        default: false
    },
    isKeywordReplyGroupChat:{
        type: Boolean,
        default: false
    },

    createdBy: {
        type: mongoose.Types.ObjectId,
        ref : 'user'
    },
    chatDaddyFlowId: {
        type: String,
        default:null
    },
    isActive: {
        type: Number,
        default: 1
    }

})

module.exports = mongoose.model('keyword_reply', KeywordSchema);
