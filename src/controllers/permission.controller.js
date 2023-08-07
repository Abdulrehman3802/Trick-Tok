const Permissions = require('../models/permissions.model')

module.exports.createPermission = async (req, res, next) => {
    try {
        // console.log(req.body.permission)
        // const data = req.body.permission.split(',')

        const permission = await Permissions.create(req.body)
        res.status(201).json({
            message: 'Permission Created Successfully',
            data: permission
        })
    } catch (err) {
        console.log('Error', err);
        res.status(501).json({
            message: 'Internal Server Error'
        })
    }
}

module.exports.allPermissions = async (req, res, next) => {
    try {
        const permissions = await Permissions.find();
        if (permissions.length > 0) {
            res.status(200).json({
                message: 'found',
                data: permissions
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

module.exports.updatePermission = async (req, res, next) => {
    try {
        const id = req.params.id;
        const permission = req.body//.permission.split(',')
        const findPermission = await Permissions.findOneAndUpdate(id, permission, { new: true });
        if (findPermission) {
            // const updated = await Permissions.findById(id)
            res.status(200).json({
                message: 'Updated Successfully',
                data: findPermission
            })
        }
        else {
            res.status(404).json({
                message: 'No Record Found',
                data: []
            })
        }
    } catch (e) {
        console.log('Error ', e)
        res.status(501).json({
            message: "Error Occurred"
        })
    }
}

module.exports.deletePermission = async (req, res, next) => {
    try {
        const id = req.params.id;
        const deletePermission = await Permissions.findByIdAndUpdate(id, { isActive: 3 })
        if (deletePermission) {
            const deleted = await Permissions.findById(id)
            res.status(200).json({
                message: 'Deleted Successfully',
                data: deleted
            })
        }
        else {
            res.status(404).json({
                message: 'No Record Found',
                data: []
            })
        }
    } catch (e) {
        console.log('Error ', e)
        res.status(501).json({
            message: "Error Occurred"
        })
    }
}

module.exports.changePermissionStatus = async (req, res, next) => {
    try {
        const id = req.params.id;
        const changeStatus = await Permissions.findByIdAndUpdate(id, { isActive: req.body.status })
        if (changeStatus) {
            const showStatus = await Permissions.findById(id)
            res.status(200).json({
                message: "Permission Status Updated",
                data: showStatus
            })
        }
        else {
            res.status(404).json({
                message: 'No Record Found',
                data: []
            })
        }
    } catch (e) {
        console.log('Error ', e)
        res.status(501).json({
            message: "Error Occurred"
        })

    }
}