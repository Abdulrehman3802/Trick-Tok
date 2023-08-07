const mongoose = require("mongoose");

const userGraphsSchema = mongoose.Schema(
    {
        graphs: [
            {
                title: {
                    type: String,
                },
                status: {
                    type: Boolean
                },
            }
        ],
        userId: {
            type: mongoose.Types.ObjectId,
            ref : 'user'
        },
        createdBy: {
            type: mongoose.Types.ObjectId,
            ref : 'user'
        },
        isActive: {
            // 1: Active 2: Block 3: Deleted
            type: Number,
            default: 1,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("graph", userGraphsSchema);
