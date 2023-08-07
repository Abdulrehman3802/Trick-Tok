const Integration = require("../../models/integrations/integration.model");

module.exports.createIntegration=async (req,res)=>{
    try{
        // console.log('In Create')
        if(req.files){
            const {image}=req.files
            const path = `${__dirname}/../../../public/images/integrations/` + image.name
            req.body.image=`${image.name}`
            await image.mv(path)
        }
    // Creating Integration
        const integration = await Integration.create(req.body);

        res.status(201).json({
            message:'Integration Created Successfully',
            data:integration
        })
    }catch(err){
        console.log('Error', err.message);
        res.status(501).json({
            message:'Internal Server Error',
            data:err.message
        })
    }
}

module.exports.getAllIntegrations=async (req,res)=> {
    try {
        // get all integration
        const integrations = await Integration.find();
        if (integrations?.length > 0) {
            res.status(200).json({
                message: 'Found Successfully',
                data: integrations
            })
        }
    } catch (err) {
        console.log('Error', err.message)
        res.status(501).json({
            message: 'Internal Server Error',
            error: err.message
        })
    }
}

module.exports.getIntegration=async (req,res)=> {
    try {
        //get one integration
        const integration_id = req.params.id;
        const integration = await Integration.findById(integration_id);
        res.status(200).json({
            message: 'Success',
            data: integration
        })
    } catch (err) {
        console.log('Error', err);
        res.status(501).json({
            message: 'Internal Server Error'
        })
    }
}

module.exports.updateIntegration=async (req,res)=>{
        try{
            const integration_id = req.params.id;

            if(req.files){
                const {image}=req.files
                const path = `${__dirname}/../../../public/images/integrations/` + image.name
                req.body.image=`${image.name}`
                await image.mv(path)
            }
            //updating integration
            await Integration.findByIdAndUpdate(integration_id,req.body)
            res.status(200).json({
                message:'Updated Successfully'
            })

        }catch(err){
            console.log('Error', err);
            res.status(501).json({
                message:'Internal Server Error'
            })
        }
}

module.exports.deleteIntegration=async (req,res)=>{
    try{
        const integration_id = req.params.id;
        // Deleting Integration (Setting isActive to 3)
        const integration = await Integration.findByIdAndUpdate(integration_id,{isActive:3})
        if(integration) {
            res.status(200).json({
                message: 'Successfully Deleted'
            })
        }else{
            res.status(404).json({
                message: 'Record Not Found',
                data: null
            })
        }

    }catch(err){
        console.log('Error', err);
        res.status(501).json({
            message:'Internal Server Error'
        })
    }
}

