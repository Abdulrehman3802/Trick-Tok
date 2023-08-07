const mongoose = require('mongoose')

const bugsReportingSchema = mongoose.Schema({
        description: {
            type: String
        },
        phoneNumber: {
            type: String,
        },
        imagePath: {
            type: String,
        },
        isActive: {              // 1:Active 2:Block 3:Deleted
            type: Number,
            default: 1,
        },
        createdBy: {
            type: mongoose.Types.ObjectId,
            ref : 'user'
        },
    },
    {timestamps: true}
)

module.exports = mongoose.model('bugs_reporting', bugsReportingSchema);
