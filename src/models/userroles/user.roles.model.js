const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId;

const userRoleSchema = mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
    },
    roleId: {
        type: mongoose.Types.ObjectId,
        ref: 'role',
    },
    access: [{
        role: {
            type: ObjectId,
            ref: 'role_names',
            unique: false
        },
        _id: false,
        permissions: [{
            pid: {
                type: ObjectId,
                ref: 'permission_names',
                unique: false
            },
            _id: false,
            isActive: {type: Number, default: 1}
        }],
        isActive: {type: Number, default: 1},

    }],
    isActive: {              // 1:Active 2:Block 3:Deleted
        type: Number,
        default: 1,
    },

}, {timestamps: true})


module.exports = mongoose.model('user_role', userRoleSchema);
