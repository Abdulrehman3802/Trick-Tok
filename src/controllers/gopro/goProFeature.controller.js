const GoProFeatureModel = require("../../models/gopro/goProFeatures.model");
const whatsAppModel = require("../../models/whatsappverification/whatsappverification.model");

module.exports.createGoProFeature = async (req, res, next) => {
    try {
        const feature = await GoProFeatureModel.create(req.body)
        if (feature) {
            return res.status(201).json({
                message: 'Go Pro Feature Created Successfully',
                data: feature
            })
        }

    } catch (err) {
        console.log('Error', err);
        return res.status(501).json({
            message: 'Internal Server Error'
        })
    }
}

module.exports.getAllGoProFeature = async (req, res, next) => {
    try {
        const features = await GoProFeatureModel.find();
        if (features) {
            return res.status(200).json({
                message: 'found',
                data: features
            })
        } else {
            return res.status(404).json({
                message: 'No Record Found',
                data: features
            })
        }

    } catch (e) {
        console.log('Error ', e);
        return res.status(400).json({
            message: 'error',
        })
    }
}

module.exports.getOneGoProFeature = async (req, res, next) => {
    try {
        const id = req.params.id
        console.log(id)
        const feature = await GoProFeatureModel.findById(id);
        return res.status(200).json({
            message: 'found',
            data: feature
        })
    } catch (e) {
        console.log('Error ', e);
        res.status(400).json({
            message: 'error',
        })
    }
}

module.exports.updateOneGoProFeature = async (req, res) => {
    try {
        const id = req.params.id

        const tab = await GoProFeatureModel.findByIdAndUpdate(id, req.body, {new: true});
        return res.status(200).json({
            message: 'found',
            data: tab
        })
    } catch (e) {
        console.log('Error ', e);
        res.status(400).json({
            message: 'error',
            data: e
        })
    }
}

module.exports.updateGoProFeatures = async (req, res) => {
    try {

        const body = req.body.data
        let response = []
        body.forEach(el => {
            let res =  GoProFeatureModel.updateOne({_id: el._id}, {$set: {features: el.features}}, {
                multi: true,
                new: true
            });
            response.push(res);
        })
        response = await Promise.all(response)
        return res.status(200).json({
            message: 'found',
            data: response
        })


        // const body = req.body.data;
        // let ids = body.map(el => el._id)
        // let features = body.map(el => el.features);
        // console.log('ids ------->', ids, 'features ------->', features)
        // const response = await GoProFeatureModel.updateMany(
        //     { _id: { $in: body.map(el => el._id) } },
        //     { $set: { features: body.map(el => el.features) } }
        // );
        // return res.status(200).json({
        //     message: "found",
        //     data: response
        // });



    } catch (e) {
        console.log('Error ', e);
        res.status(400).json({
            message: 'error',
            data: e
        })
    }
}
