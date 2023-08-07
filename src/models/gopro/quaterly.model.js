const mongoose = require('mongoose')

const quaterlySchema = mongoose.Schema({
    mini: {
        type: Number,
        required:[true, "Price for mini plan is Required"],
        default: 29,
    },
    pro: {
        type: Number,
        required:[true, "Price for pro plan is Required"],
        default: 129,
    },
    max: {
        type: Number,
        required:[true, "Price for max plan is Required"],
        default: 399,
    },
    add_phone: {
        type: Number,
        required: [true, "Price for additional phone is Required"],
        default: 59
    },
    add_seat: {
        type: Number,
        required: [true, "Price for additional seats is Required"],
        default: 46
    },
    mini_quaterly: {
        type: Number,
        default: 228
    },
    pro_quaterly: {
        type: Number,
        default: 1188
    },
    max_quaterly: {
        type: Number,
        default: 2988
    },
    isActive:{
        type: Number,
        default: 1,
    }

}, { timestamps: true })



module.exports = mongoose.model('quaterly', quaterlySchema);