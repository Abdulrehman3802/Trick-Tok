const mongoose = require('mongoose');
const whatsAppMessages = mongoose.Schema(
    {
        data: {
            type:Object
        },
        createdBy: {
            type: mongoose.Types.ObjectId,
            ref : 'user'
        },
        isActive: {
            // 1:Active 2:Block 3:Deleted
            type: Number,
            default: 1,
        },
    }, { timestamps: true });

module.exports = mongoose.model('whatsapp_messages',whatsAppMessages);