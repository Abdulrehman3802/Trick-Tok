const mongoose = require('mongoose')

const userSubscriptions = mongoose.Schema({
    plan_name: {           // add_user // view_user // update_user // delete_user
        type: String,
        required:[true, "Plan Name Required"],
    },
    plan_type:{
        type: String,
        required:[true, "Plan Type Required"],
    },
    team_inbox:{
        type: mongoose.Types.ObjectId,
        ref:'go_pro_feature',
        default:'63c7c95ff9169cad198d934e'
    },
    whatsapp_shop:{
        type: mongoose.Types.ObjectId,
        ref:'go_pro_feature',
        default:'63c7c977f9169cad198d9353'

    },
    whatsapp_bot:{
        type: mongoose.Types.ObjectId,
        ref:'go_pro_feature',
        default:'63c7c99ef9169cad198d9358'

    },
    broadcast:{
        type: mongoose.Types.ObjectId,
        ref:'go_pro_feature',
        default:'63de3f00298e1969f9a92d73'

    },
    goProRecord:[],
    payment_status:{
        type: String,
        default:"unpaid",
        lowercase:true,
    },
    total_amount:{
        type: Number,
        default:0
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref : 'user'
    },
    payment_id: {
        type: String,
        default:null
    },
    isActive:{              // 1:Active 2:Block 3:Deleted
        type: Number,
        default: 3,
    }

}, { timestamps: true })



module.exports = mongoose.model('user_subscriptions', userSubscriptions);
