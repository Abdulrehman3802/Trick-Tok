const mongoose = require('mongoose')
const { isEmail } = require('validator')
// const {validUrl} = require('valid-url')
const ObjectId = mongoose.Types.ObjectId;

const signupSchema = mongoose.Schema({

    fullname: {
        type: String,
        maxLength: 25,
        unique: false,
        required: [true, 'Username is required'],
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    email: {
        type: String,
        unique: true,
        validate: [isEmail, 'Invalid Email'],
        lowercase: true
    },

    roleId: {
        type: mongoose.Types.ObjectId,
        default: ObjectId('632a313914b1c23ec86c2a04'),
        ref: 'role',
    },

    isActive: {              // 1:Active 2:Block 3:Deleted
        type: Number,
        default: 1,
    }
}, { timestamps: true })

module.exports = mongoose.model('signup', signupSchema);
