const mongoose = require("mongoose")

const whatsAppConnectedUser = mongoose.Schema({
    createdBy:{
        type: mongoose.Types.ObjectId,
        ref:'user',
    },
    isActive:{
        type: Number,
        default:1
    }
},{timestamps:true})


module.exports =mongoose.model('whatsapp_ultra_message_user_instance',whatsAppConnectedUser)