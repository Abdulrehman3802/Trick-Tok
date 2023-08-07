const mongoose = require('mongoose')

const userRolePermissionSchema = mongoose.Schema({
    name: {           // add_user // view_user // update_user // delete_user
        type: String,
        required:[true, "Permission Name Required"],
    },
    isActive:{              // 1:Active 2:Block 3:Deleted
        type: Number,
        default: 1,
    }

}, { timestamps: true })



module.exports = mongoose.model('permission_names', userRolePermissionSchema);
