const Role = require('../models/role.model')
const mongoose = require('mongoose')

module.exports.createRole = async (req, res, next) => {
    try {

        const role = await Role.create(req.body)

        res.status(201).json({
            message: 'Role Created Successfully',
            data: role
        })
    } catch (err) {
        console.log('Error', err);
        res.status(501).json({
            message: 'Internal Server Error',
            error: err.message
        })
    }
}

module.exports.allRoles = async (req, res, next) => {
    try {
        console.log(req.query.isAdmin)
        if (req?.query.isAdmin === '0') {
            const roles = await Role.find({isActive: 1});

            if (roles.length > 0) {
                res.status(200).json({
                    message: 'found',
                    data: roles
                })
            } else {
                res.status(200).json({
                    message: 'No Record Found',
                    data: []
                })
            }
        } else {
            const roles = await Role.find().select({name:1,isActive:1,status:1});

            if (roles.length > 0) {
                res.status(200).json({
                    message: 'found',
                    data: roles
                })
            } else {
                res.status(200).json({
                    message: 'No Record Found',
                    data: []
                })
            }
        }
    } catch (e) {
        console.log('Error ', e);
        res.status(400).json({
            message: 'error',
        })
    }
}
module.exports.updateActive = async (req, res, next) => {
    try {
        await Role.updateMany({}, {isActive: 0}, {new: true})
        let roleResponse = await Role.findByIdAndUpdate(req.body._id, {isActive: req.body.isActive}, {new: true})
        if (roleResponse) {
            return res.status(200).json({
                message: "Successfully updated"
            })
        } else {
            return res.status(404).json({
                message: `No Role Found with id ${req.body.id}`
            })
        }

    } catch (e) {
        console.log('Error ', e)
        res.status(501).json({
            message: "Error Occurred"
        })
    }
}
// SET STATUS TRUE USING ID (ONLY ADMIN CAN DO)
module.exports.updateStatus = async (req, res, next) => {
    try {
        let roleResponse = await Role.findByIdAndUpdate(req.body._id, {isActive: req.body.status===false ? 3 : 1})

        if (roleResponse) {
            return res.status(200).json({
                message: "Successfully updated"
            })
        } else {
            return res.status(404).json({
                message: `No Role Found with id ${req.body.id}`
            })
        }

    } catch (e) {
        console.log('Error ', e)
        res.status(501).json({
            message: "Error Occurred"
        })
    }
}
// GET ALL ROLES THAT IS TRUE AT THE TIME (DEFAULTY ALL ARE TRUE)
module.exports.getTrue = async (req, res, next) => {
    try {
        const trueRoles = await Role.find({status: true})
        if (trueRoles) {

            res.status(200).json({
                message: "Successfully requested",
                roles: trueRoles
            })
        } else {
            res.status(501).json({
                message: "Error Occurred"
            })
        }

    } catch (e) {
        console.log('Error ', e)
        res.status(501).json({
            message: "Error Occurred"
        })
    }
}


module.exports.updateRole = async (req, res, next) => {
    try {
        const id = req.params.id;
        const updateRole = await Role.findByIdAndUpdate(id, req.body)
        if (updateRole) {
            res.status(200).json({
                message: 'Updated Successfully',
                data: updateRole
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
            message: "Error Occurred"
        })
    }
}

module.exports.deleteRole = async (req, res, next) => {
    try {
        const id = req.params.id;
        const updateRole = await Role.findByIdAndUpdate(id, {isActive: 0})
        if (updateRole) {
            res.status(200).json({
                message: 'Deleted Successfully',
                data: updateRole
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
            message: "Error Occurred"
        })
    }
}


module.exports.changePermissionStatus = async (req, res, next) => {
    try {
        const id = req.params.id;
        const changeStatus = await Role.findByIdAndUpdate(id, {isActive: req.body.status})
        if (changeStatus) {
            const showStatus = await Role.findById(id)
            res.status(200).json({
                message: "Role Status Updated",
                data: showStatus
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
            message: "Error Occurred"
        })

    }
}