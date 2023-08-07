const mongoose = require("mongoose");

const teamSchema = mongoose.Schema(
    {
        teamName: {
            type: String,
            maxLength: 25,
            default:null
        },
        teamAdmin: {
            type: mongoose.Types.ObjectId,
            required: [true, "Team Admin's ID is required"],
        },
        teamMembers: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'user',
                maxlength: 3
            }
        ],
        teamMail: {
            type: String,
            default: null
        },
        teamWebsite: {
            type: String,
            default: null
        },
        teamOrganization: {
            type: String,
            default: null
        },
        createdBy: {
            type: mongoose.Types.ObjectId,
            ref : 'user'
        },
        isActive: {
            // 1:Active 2:Block 3:Deleted
            type: Number,
            default: 1,
        },
        chatDaddyId: {
            type: String,
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("team", teamSchema);
