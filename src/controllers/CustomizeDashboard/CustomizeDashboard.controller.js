const customizeDashboardModel = require('../../models/Customize-Dashboard/Customize-Dashboard.model')

exports.createDashBoard = async (req,res)=>{
    try {
        const dashboard = await customizeDashboardModel.create({
            ...req.body,
            createdBy: req.user_id
        })
        if(dashboard){
            res.status(200).json({
                message:"Successfully created",
                data: dashboard
            })
        }
        else{
            res.status(400).json({
                message:"Failure",
            })
        }
    }catch(e){
        console.log(e)
        res.status(500).json({
            message:"Internal Server Error",
            error: e.message
        })
    }
}

exports.updateDashBoard = async (req,res)=>{
    try {
        // const id = req.params.id
        const updatedDashboard = await customizeDashboardModel.findOneAndUpdate({createdBy:req.user_id, isActive:1},req.body,{new:true})
        if(updatedDashboard){
            res.status(200).json({
                message:"Successfully Updated",
                data: updatedDashboard
            })
        }
        else{
            res.status(400).json({
                message:"Failure Cannot Update",
            })
        }
    }catch(e){
        console.log(e)
        res.status(500).json({
            message:"Internal Server Error",
            error: e.message
        })
    }
}

exports.getDashBoardForUser = async (req,res)=>{
    try {
        // const id = req.params.id
        const dashboard = await customizeDashboardModel.findOne({ createdBy:req.user_id, isActive:1})
        if(dashboard){
            res.status(200).json({
                message:"Found",
                data: dashboard
            })
        }
        else{
            res.status(400).json({
                message:"No Record Found",
                data: null
            })
        }
    }catch(e){
        console.log(e)
        res.status(500).json({
            message:"Internal Server Error",
            error: e.message
        })
    }
}

exports.deleteDashBoard = async (req,res)=>{
    try {
        // const id = req.params.id
        const deletedDashboard = await customizeDashboardModel.findOneAndUpdate({createdBy:req.user_id}, {isActive:3},{new:true})
        if(deletedDashboard){
            res.status(200).json({
                message:"Successfully deleted",
                data: deletedDashboard
            })
        }
        else{
            res.status(400).json({
                message:"Failure Cannot delete",
            })
        }
    }catch(e){
        console.log(e)
        res.status(500).json({
            message:"Internal Server Error",
            error: e.message
        })
    }
}