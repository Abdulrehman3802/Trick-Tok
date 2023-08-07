const offlineBot = require('../../models/offline bot/offlineBot')
module.exports.createOfflineBot = async (req, res, next) => {
    try {
        // console.log(req.body)
        // req.body.to=new Date(req.body.onlineHours[0].to).toISOString();
        // req.body.from=new Date(req.body.onlineHours[0].from).toISOString();
        const convertHoursToISO = req.body.onlineHours;
        const onlineHours = convertHoursToISO.map(hour =>{
            return{
                weekdayName: hour.weekdayName,
                to:new Date(hour.to).toISOString(),
                from:new Date(hour.from).toISOString(),
                isActive:hour.isActive===true?1:0
            }
        })
        // console.log('------>',onlineHours)
        const Bot = await offlineBot.create(
            {
                onlineHours:onlineHours,
                ...req.body,
                createdBy: req.user_id
            })
        if (Bot) {
            return res.status(201).json({
                message: 'Created Successfully',
                data: Bot
            })
        }
        else {
            return res.status(404).json({
                message: 'Something went wrong',
                err: true
            })
        }

    } catch (err) {
        console.log('Error', err);
        return res.status(501).json({
            message: 'Internal Server Error',
            err: err
        })
    }
}

module.exports.updateOfflineBot = async (req, res, next) => {
    try {
        const id = req.params.id
        const Bot = await offlineBot.findOneAndUpdate({_id:id,createdBy:req.user_id}, req.body, { new: true });
        if (Bot) {
            return res.status(201).json({
                message: 'updated Successfully',
                data: Bot
            })
        }
        else {
            return res.status(404).json({
                message: 'Cannot find bot according to user',
                err: true,
            })
        }

    } catch (err) {
        console.log('Error', err);
        return res.status(501).json({
            message: 'Internal Server Error',
            err: err
        })
    }
}

module.exports.findOfflineBots = async (req, res, next) => {
    try {

        const Bot = await offlineBot.find({ createdBy: req.user_id ,isActive:1})
        if (Bot) {
            return res.status(201).json({
                message: 'Request Successful',
                data: Bot.reverse()
            })
        }
        else {
            return res.status(404).json({
                message: 'Something went wrong',
                err: true
            })
        }

    } catch (err) {
        console.log('Error', err);
        return res.status(501).json({
            message: 'Internal Server Error',
            err: err
        })
    }
}

module.exports.findoneOfflineBot = async (req, res, next) => {
    try {
        const id = req.params.id
        const Bot = await offlineBot.findById(id)
        if (Bot) {
            return res.status(201).json({
                message: 'Request Successful',
                data: Bot
            })
        }
        else {
            return res.status(404).json({
                message: 'Something went wrong',
                err: true
            })
        }

    } catch (err) {
        console.log('Error', err);
        return res.status(501).json({
            message: 'Internal Server Error',
            err: err
        })
    }
}

module.exports.deleteOfflineBot = async (req, res, next) => {
    try {
        const id = req.params.id;
        const Bot = await offlineBot.findOneAndUpdate({_id:id,createdBy:req.user_id}, { isActive: 3 }, { new: true });

        if (Bot) {
            return res.status(201).json({
                message: 'Successfully Deleted',
                data: Bot
            })
        }
        else {
            return res.status(404).json({
                message: 'cannot find any bot with criteria',
                err: true
            })
        }

    } catch (err) {
        console.log('Error', err);
        return res.status(501).json({
            message: 'Internal Server Error',
            err: err
        })
    }
}