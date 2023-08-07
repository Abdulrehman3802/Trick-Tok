const TeamModel = require("../../models/team/team.model");
const UserGraphsModel = require("../../models/UserGraph/UserGraphs");


module.exports.createGraphsForUser = async (req, res) => {
    try {

        let graphs = [
            {
                title: "Message Sent",
                status: true,
            },
            {
                title: "Avg Team Response  Time",
                status: true,
            },
            {
                title: "Tasks Added",
                status: true,
            },
            {
                title: "Tasks Solved",
                status: true,
            },
            {
                title: "New Connections",
                status: true,
            },
            {
                title: "Payments Received",
                status: true,
            },
            {
                title: "Order Received",
                status: true,
            },
            {
                title: "Avg Reply Rate",
                status: true,
            },
            {
                title: "Contacts Tagged",
                status: true,
            },
            {
                title: "Message Flows Sent",
                status: true
            },
            {
                title: "Avg Message Flow Reply Rate",
                status: true
            }
        ]
        const userGraphs = await UserGraphsModel.create(
            {
                graphs: graphs,
                createdBy: req.user_id,
                userId: req.user_id
            });

        res.status(201).json({
            message: "User Graphs Created Successfully",
            data: userGraphs,
        });
    } catch (err) {
        console.log("Error", err);
        res.status(501).json({
            message: "Internal Server Error",
            error: err.message,
        });
    }
};

module.exports.getAllMyGraphs = async (req, res) => {
    try {
        const userGraphs = await UserGraphsModel.find({userId: req.user_id})

        if (userGraphs.length > 0) {
            res.status(200).json({
                message: "found",
                data: userGraphs,
            });
        } else {
            res.status(200).json({
                message: "No Record Found",
                data: [],
            });
        }
    } catch (e) {
        console.log("Error ", e);
        res.status(400).json({
            message: "error",
        });
    }
};

module.exports.updateStatus = async (req, res) => {
    try {
        let response = await UserGraphsModel
            .findOneAndReplace(
                {userId: req.user_id,},
                {
                    graphs: req.body.graphs,
                    isActive: 1,
                    userId: req.user_id,
                    createdBy: req.user_id
                },
                {new: true})
        ;
        if (response) {
            return res.status(200).json({
                message: "Successfully updated",
            });
        } else {
            return res.status(404).json({
                message: `No Graphs Found`,
            });
        }
    } catch (e) {
        console.log("Error ", e);
        res.status(501).json({
            message: "Error Occurred",
        });
    }
};

