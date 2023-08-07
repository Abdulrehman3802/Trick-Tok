const mongoose = require('mongoose')

const customizeDashboardSchema = mongoose.Schema({
    MessageSent:{
        type:Boolean,
        default:true
    },
    AvgTeamResponseTime:{
        type:Boolean,
        default:true
    },
    TasksAdded:{
        type:Boolean,
        default:true
    },
    TasksSolved:{
        type:Boolean,
        default:true
    },
    NewConnections:{
        type:Boolean,
        default:true
    },
    PaymentsReceived:{
        type:Boolean,
        default:true
    },
    OrderReceived:{
        type:Boolean,
        default:true
    },
    AvgReplyRate:{
        type:Boolean,
        default:true
    },
    ContactsTagged:{
        type:Boolean,
        default:true
    },
    MessageFlowsSent:{
        type:Boolean,
        default:true
    },
    AvgMessageFlowReplyRate:{
        type:Boolean,
        default:true
    },
    isActive:{
        type:Number,
        default:1
    },
    createdBy:{
        type: mongoose.Types.ObjectId,
        required:true
    }

})

module.exports = mongoose.model('customizeDashboard', customizeDashboardSchema);