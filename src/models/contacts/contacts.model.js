const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const contactSchema = mongoose.Schema({
    name: {
        type:String,
        maxLength: 30,
        required: [true, 'Name is required'],
        lowercase:true
    },
    phone_number:{
        type:String,
        required: [true, 'Number is required'],
        lowercase:true
    },
    tags:{
        type:[{
            type: mongoose.Types.ObjectId,
            default: null,
            ref: 'tag',
        }],
    },
    assignee: {
        type: mongoose.Types.ObjectId,
        default: null,
        ref: 'user',
    },
    messages_sent:{
        type:Number,
        default:0
    },
    messages_received:{
        type:Number,
        default:0
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref : 'user'
    },
    last_contact:{
        type:Date,
        default:Date.now()
    },
    isActive:{              // 1:Active 2:Block 3:Deleted
        type: Number,
        default: 1,
    }
}, { timestamps: true })


module.exports = mongoose.model('contacts', contactSchema);
