const mongoose = require('mongoose');
const whatsAppMessagesRecord = mongoose.Schema(
    {
       createdBy: {
           type: mongoose.Types.ObjectId,
           ref:'user'
       },
        messageCount:{
           type: Number,
            default:0
        }
    },{timestamps:true});

module.exports = mongoose.model('whatsapp_messages_record',whatsAppMessagesRecord);