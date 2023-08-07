const mongoose = require('mongoose');

const draftBotSchema = mongoose.Schema({
    name: {
        type: String,
        // unique: true,
        required: true
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'user'
    },
    startingActionId: {
        type: String,
        default: "init"
    },
    externalTemplate: {
        type: String,
        default: "abc-123-def-456-ghij"
    },
    templateIds: {
        type: String,
        default: "abc-123-def-456-ghij"
    },
    teamId: {
        type: Array,
        default: []
    },
    isActive: {              // 1:Active 2:Block 3:Deleted
        type: Number,
        default: 1,
    },

}, { timestamps: true });


module.exports = mongoose.model('draftBot', draftBotSchema);
