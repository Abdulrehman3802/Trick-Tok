const userRoleModel = require('../models/userroles/user.roles.model');
const userRolePermissionsModel = require('../models/userrolespermissions/user.roles.permission.model');
const userAllowRolesModel = require('../models/userroles/user.allowed.roles.model');


module.exports.createUserRole = async (req, res) => {
    try {
        const userRole = await userAllowRolesModel.create({name: req.body.name});
        const permissions = await userAllowRolesModel.findByIdAndUpdate(userRole._id,
            {
                $push: {"permissionId": req.body.permissionId}
            });
        const roles = await userAllowRolesModel.findById(userRole._id);
        return res.status(201).json({
            status: 'success',
            message: 'Role created successfully',
            data: roles
        });
    } catch (err) {
        res.status(500).json({
            message: 'Internal Server Error',
            error: err.message
        });
    }
}

module.exports.getAllRoles = async (req, res) => {
    try {
        const allUserRoles = await userRoleModel.find().populate('permissionId.pid',
            {name: 1, _id: 1});
        return res.status(200).json({
            status: 'success',
            message: 'Roles retrieved successfully',
            data: allUserRoles
        });
    } catch (err) {
        res.status(500).json({
            message: 'Internal Server Error',
            error: err.message
        });
    }
}

module.exports.createRolePermissions = async (req, res) => {
    try {
        const whatsAppPermissions = await userRolePermissionsModel.insertMany(req.body);
        return res.status(201).json({
            status: 'success',
            message: 'Permissions created successfully',
            data: whatsAppPermissions
        });
    } catch (err) {
        res.status(500).json({
            message: 'Internal Server Error',
            error: err.message
        });
    }
}

module.exports.assignUserRoles = async (req, res) => {
    try {
        const user =req?.cookies?.user_id;
        console.log("User: " ,user)
        const role = await userAllowRolesModel.create({userId:user,...req.body})
        res.status(200).json({
            status:'success',
            message: 'Roles assigned successfully',
            data: role
        })
    } catch (err) {
        res.status(500).json({
            message: 'Internal Server Error',
            error: err.message
        });
    }
}