const mongoose = require('mongoose')
const { isEmail } = require('validator')
const ObjectId = mongoose.Types.ObjectId;

const signupValidationSchema = mongoose.Schema({

    fullname: {
        type: String,
        maxLength: 25,
        unique: false,
        required: [true, 'Fullname is required'],
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    companyname: {
        type: String,
    },
    phone:{
        type: String,
        unique: true,
        required:[true, 'Phone Number is required'],
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

module.exports = mongoose.model('signupvalidation', signupValidationSchema);
