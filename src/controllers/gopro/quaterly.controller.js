const Quaterly = require("../../models/gopro/quaterly.model");

module.exports.createPlan=async (req,res,next)=>{
    try{
        let mini = req.body.mini ?? 19
        let pro = req.body.pro ?? 99
        let max = req.body.max ?? 249
        if (req.body.mini || req.body.pro || req.body.max) {
            console.log(req.body)
            console.log('=========? 0', req.body?.pro ?? 399 * 12)
            const quaterlyPlan = await Quaterly.create({
                ...req.body,
                mini_quaterly: mini  * 3 ,
                pro_quaterly: pro  * 3 ,
                max_quaterly: max * 3 ,
            })
            return res.status(201).json({
                message:'Quaterly Plan Created Successfully',
                data: quaterlyPlan
            })
        }
        const quaterlyPlan = await Quaterly.create(req.body)
        return res.status(201).json({
            message:'Quaterly Plan Created Successfully',
            data: quaterlyPlan
        })

    }catch(err){
        console.log('Error', err);
        res.status(501).json({
            message:'Internal Server Error'
        })
    }
}

module.exports.viewPlan=async (req,res,next)=>{
    try {
        const quaterlyPlan = await Quaterly.find();
        return res.status(200).json({
            message: 'found',
            data: quaterlyPlan
        })
    }catch (e){
        console.log('Error ', e);
        return res.status(400).json({
            message: 'error',
        })
    }
}

module.exports.viewOnePlan=async (req,res,next)=>{
    try {
        const quaterlyPlan = await Quaterly.findById("6377b28ce8473d72a8583c06");
        return res.status(200).json({
            message: 'found',
            data: quaterlyPlan
        })
    }catch (e){
        console.log('Error ', e);
        res.status(400).json({
            message: 'error',
        })
    }
}

module.exports.updateOnePlan=async (req,res,next)=>{
    try {
        let mini = req.body.mini ?? 19
        let pro = req.body.pro ?? 99
        let max = req.body.max ?? 249

        const quaterlyPlan = await Quaterly.findByIdAndUpdate("6377b28ce8473d72a8583c06", {
            ...req.body,
            mini_quaterly: mini * 3,
            pro_quaterly: pro * 3 ,
            max_quaterly: max  * 3 ,
        }, {new: true});
        // if(roles.length>0){
        return res.status(200).json({
            message: 'found',
            data: quaterlyPlan
        })
    }catch (e){
        console.log('Error ', e);
        res.status(400).json({
            message: 'error',
            data: e
        })
    }
}