const mongoose = require("mongoose")

const whatsAppVerificationSchema = mongoose.Schema({
    phone: {type: String},
    code: {type: String},

}, { timestamps: true })


module.exports = mongoose.model('whatsapp_verification', whatsAppVerificationSchema);
