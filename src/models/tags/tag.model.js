const mongoose = require('mongoose')

const tagSchema = mongoose.Schema({
    tagName: {
        type: String,
        required:[true, "Tag name Required"]
        
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref : 'user'
    },
    isActive:{              // 1:Active 2:Block 3:Deleted
        type: Number,
        default: 1,
    },

}, { timestamps: true })

module.exports = mongoose.model('tag', tagSchema);
