const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId;

const roleSchema = mongoose.Schema({
    name: {
        type: String,
        unique:true
    },
    access:[{
        role:{
            type: ObjectId,
            ref: 'role_names',
            unique:false
        },
        _id: false,
        permissions:[{
            pid:{
                type: ObjectId,
                ref: 'permission_names',
                unique:false
            },
            _id: false,
            isActive: {type:Number, default:1}
        }],
        isActive: {type:Number, default:1},

    }],
    isActive:{              // 1:Active 2:Block 3:Deleted
        type: Number,
        default: 1,
    },
    //  FOR KEEPING RECORD THAT ADMIN CAN SET TRUE OR FALSE TO IT

}, { timestamps: true ,strict:false})



module.exports = mongoose.model('role', roleSchema);
