const BugsReportingModel = require('../../models/bugsreporting/bugs.model')
const UserModel = require('../../models/user.model')
module.exports.addNewBugReport = async (req, res) => {
    try {
        const today = new Date().toDateString().replaceAll(' ', '_')
        const uploadPath = `images/bugsReports/${today}/`
        let imagePath = ''
        
        console.log("🚀 ~ file: bugsReporting.controller.js:10 ~ module.exports.addNewBugReport= ~ req.file", req.file)
        if (req.file) {
            imagePath = uploadPath + req?.file?.filename;
        }

        let BugsReportingResponse = await BugsReportingModel.create({
            imagePath,
            ...req.body,
            createdBy: req.user_id
        })
        if (BugsReportingResponse) {
            res.status(200).json({
                message: 'Bug Report Created Successfully',
                data: BugsReportingResponse
            })
        } else {
            res.status(404).json({
                message: 'Body Parameter Error',
                data: []
            })
        }
    } catch (err) {
        console.log('Error', err);
        res.status(501).json({
            message: 'Internal Server Error',
            error: err.message
        })
    }
}

module.exports.getAllBugReports = async (req, res) => {
    try {

        const BugsReportingResponse = await BugsReportingModel.find()
        // const BugsReportingResponse = await BugsReportingModel.aggregate([
        //     {
        //         $lookup: {
        //             from: "users",
        //             localField: "userId",
        //             foreignField: "_id",
        //             as: "user"
        //         }
        //     },
        //     {
        //         $project: {
        //             description: 1,
        //             phoneNumber: 1,
        //             imagePath: 1,
        //             userId: 1,
        //             isActive: 1,
        //             createdAt: 1,
        //             updatedAt: 1,
        //             fullname: {$arrayElemAt: ["$user.fullname", 0]}
        //         }
        //     }
        // ]);

        if (BugsReportingResponse.length > 0) {
            res.status(200).json({
                message: 'found successfully bugs reporting list',
                data: BugsReportingResponse
            })
        } else {
            res.status(200).json({
                message: 'No Record Found',
                data: []
            })
        }
    } catch (e) {
        console.log('Error ', e);
        res.status(400).json({
            message: 'Internal Server Error',
        })
    }
}

module.exports.deleteBugReportByID = async (req, res, next) => {
    try {
        const id = req.params.id;
        const BugsReportingResponse = await BugsReportingModel.findByIdAndDelete(id);
        if (BugsReportingResponse) {
            res.status(200).json({
                message: 'Deleted Successfully',
                data: BugsReportingResponse
            })
        } else {
            res.status(404).json({
                message: 'No Record Found',
                data: []
            })
        }
    } catch (e) {
        console.log('Error ', e)
        res.status(501).json({
            message: "Internal Server Error",
        })
    }
}
