const mongoose = require('mongoose');
const offlineBotSchema = mongoose.Schema({
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref : 'user'
    },
    messageFlow: {
        type: mongoose.Types.ObjectId,
        ref : 'bot_template'
    },
    onlineHours:[{
        weekdayName: {type:String,require:true},
      from: {type:Date,require:true},
        to: {type:Date,require:true},
        isActive: {type:Number,default:1}
    }],
    setTriggerTime:{
        type:String,
        enum:["OncePer","Infinite"],
        default:"OncePer"
    },
    duration:{
        type:Number,
        default:0
    },
    time:{
        type:String,
        enum:["Minutes","Hours","Days"],
        default:"Hours"
    },
    isActive:{              // 1:active  2:Block  3:Deleted
        type:Number,
        default:1
    }

}, { timestamps: true })


module.exports = mongoose.model('offlineBot', offlineBotSchema);
