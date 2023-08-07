const mongoose = require('mongoose')

const yearlySchema = mongoose.Schema({
    mini: {
        type: Number,
        required:[true, "Price for mini plan is Required"],
        default: 19,
    },
    pro: {
        type: Number,
        required:[true, "Price for pro plan is Required"],
        default: 99,
    },
    max: {
        type: Number,
        required:[true, "Price for max plan is Required"],
        default: 249,
    },
    add_phone: {
        type: Number,
        required: [true, "Price for max plan is Required"],
        default: 29
    },
    add_seat: {
        type: Number,
        required: [true, "Price for max plan is Required"],
        default: 29
    },
    mini_yearly: {
        type: Number,
        default: 228
    },
    pro_yearly: {
        type: Number,
        default: 1188
    },
    max_yearly: {
        type: Number,
        default: 2988
    },
    isActive:{              // 1:Active 2:Block 3:Deleted
        type: Number,
        default: 1,
    }

}, { timestamps: true })



module.exports = mongoose.model('yearly', yearlySchema);