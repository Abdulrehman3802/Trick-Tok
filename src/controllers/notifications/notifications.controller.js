const NotificationModel = require('../../models/notification/notification.model')


module.exports.createNotification = async (req, res, next) => {
    try {

        let notificationResponse = await NotificationModel.create({
            ...req.body,
            createdBy: req.user_id
        });
        res.status(201).json({
            message: 'Notification Created Successfully',
            data: notificationResponse
        })
    } catch (err) {
        console.log('Error', err);
        res.status(501).json({
            message: 'Internal Server Error',
            error: err.message
        })
    }
}

module.exports.allNotifications = async (req, res, next) => {

    try {
        const notificationResponse = await NotificationModel.find({createdBy:req.user_id});
        if (notificationResponse.length > 0) {
            res.status(200).json({
                message: 'found',
                count: notificationResponse.length,
                data: notificationResponse
            })
        }
        else {
            res.status(200).json({
                message: 'No Record Found',
                data: []
            })
        }
    } catch (e) {
        console.log('Error ', e);
        res.status(400).json({
            message: 'error',
        })
    }
}


module.exports.updateStatus = async (req, res, next) => {
    console.log('----------------  In Update Status  -----------------')
    try {

        let notificationResponse = await NotificationModel.findOneAndUpdate({_id:req.params.id, createdBy:req.user_id}, { status: req.body.status })

        if (notificationResponse) {
            return res.status(200).json({
                message: "Successfully updated",
                status: req.body.status
            })
        } else {
            return res.status(404).json({
                message: `No Notification Found with user ${req.user_id}`
            })
        }

    } catch (e) {
        console.log('Error ', e)
        res.status(501).json({
            message: "Error Occurred"
        })
    }
}


