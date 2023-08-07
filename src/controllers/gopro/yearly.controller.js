const Yearly = require("../../models/gopro/yearly.model");

module.exports.createPlan = async (req, res, next) => {
    try {
        let mini = req.body.mini ?? 19
        let pro = req.body.pro ?? 99
        let max = req.body.max ?? 249
        if (req.body.mini || req.body.pro || req.body.max) {
            const yearlyPlan = await Yearly.create({
                ...req.body,
                mini_yearly: mini * 12,
                pro_yearly: pro * 12,
                max_yearly: max * 12,
            })
            return res.status(201).json({
                message: 'Yearly Plan Created Successfully',
                data: yearlyPlan
            })
        }
        const yearlyPlan = await Yearly.create(req.body)
        return res.status(201).json({
            message: 'Yearly Plan Created Successfully',
            data: yearlyPlan
        })

    } catch (err) {
        console.log('Error', err);
        res.status(501).json({
            message: 'Internal Server Error'
        })
    }
}

module.exports.viewPlan = async (req, res, next) => {
    try {
        const roles = await Yearly.find();
        return res.status(200).json({
            message: 'found',
            data: roles
        })
    } catch (e) {
        console.log('Error ', e);
        return res.status(400).json({
            message: 'error',
        })
    }
}

module.exports.viewOnePlan = async (req, res, next) => {
    try {
        const roles = await Yearly.findById("63774e047dd8d0e93e4271c6");
        // if(roles.length>0){
        return res.status(200).json({
            message: 'found',
            data: roles
        })
    } catch (e) {
        console.log('Error ', e);
        res.status(400).json({
            message: 'error',
        })
    }
}

module.exports.updateOnePlan = async (req, res, next) => {
    try {
        let mini = req.body.mini ?? 19
        let pro = req.body.pro ?? 99
        let max = req.body.max ?? 249

        const yearlyPlan = await Yearly.findByIdAndUpdate("63774e047dd8d0e93e4271c6", {
            ...req.body,
            mini_yearly: mini * 12,
            pro_yearly: pro * 12,
            max_yearly: max * 12,
        }, {new: true});

        console.log(yearlyPlan)
        return res.status(200).json({
            message: 'found',
            data: yearlyPlan
        })
    } catch (e) {
        console.log('Error ', e);
        res.status(400).json({
            message: 'error',
            data: e
        })
    }
}