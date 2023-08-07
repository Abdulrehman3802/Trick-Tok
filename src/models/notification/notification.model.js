const mongoose = require('mongoose')


const notificationSchema = mongoose.Schema({
    name: {
        type: String
    },
    status: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref : 'user'
    },
    isActive: {              // 1:Active 2:Block 3:Deleted
        type: Number,
        default: 1,
    }

}, { timestamps: true })



module.exports = mongoose.model('notifications', notificationSchema);
