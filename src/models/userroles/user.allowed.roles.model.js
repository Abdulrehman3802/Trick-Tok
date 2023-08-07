const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId;

const userAllowedRoleSchema = mongoose.Schema({
    name:{
        type:String,
        unique:true
    },
    permissionId:{
        type:[{
            pid:{
                type: mongoose.Types.ObjectId,
                ref: 'permission_names',
            },
            isActive: {
                type: Number,
                default: 1
            },
            _id: false,
        }],
        default:null,
    },
    isActive:{              // 1:Active 2:Block 3:Deleted
        type: Number,
        default: 1,
    },

}, { timestamps: true })



module.exports = mongoose.model('role_names', userAllowedRoleSchema);
