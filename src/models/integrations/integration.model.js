const mongoose = require('mongoose')

const integrationSchema = mongoose.Schema({
    name: {
        type:String,
        unique: true,
        maxLength: 25,
        required: [true, 'name is required'],
        lowercase:true
    },

    image: {
        type:String,
        default: 'default.png'
    },
    isActive:{              // 1:Active 2:Block 3:Deleted
        type: Number,
        default: 1,
    }
}, { timestamps: true })


module.exports = mongoose.model('integration', integrationSchema);