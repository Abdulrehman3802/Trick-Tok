const mongoose = require('mongoose')

const subscriptionSchema = mongoose.Schema({
    plan_name: {           // add_user // view_user // update_user // delete_user
        type: String,
        required:[true, "Plan Name Required"],
    },
    plan_type:{
        type: String,
        required:[true, "Plan Type Required"],
    },
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



module.exports = mongoose.model('subscriptions', subscriptionSchema);
