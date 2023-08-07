const mongoose = require('mongoose');

const generateLinkSchema = mongoose.Schema({
    referralCode:{
        type:String,
        required: [true, 'Code is required'],
    },
    invitee:{
        type: mongoose.Types.ObjectId,
    },
    counter:{
        type: Number,
    },
    inviteRoleId: {
        type: mongoose.Types.ObjectId,
        ref: 'role',
    },
    visited:{
        type:Boolean,
        default: false
    },
    isActive:{              // 1:Active 2:Block 3:Deleted
        type: Number,
        default: 1,
    },
}, {timeStamps :true})

function arrayLimit(val) {
    return val.length <= 3;
}

module.exports = mongoose.model('invitation-links', generateLinkSchema);
