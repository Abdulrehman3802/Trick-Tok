const Permission = require('../../../models/permissions.model');
const User = require('../../../models/user.model');
const Role = require('../../../models/role.model');
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;


module.exports.isAdmin = async (req, res, next) => {
    try {
        const admin = await User.findById(req.user_id).populate('roleId');
        // console.log(admin.roleId.role)
        // const admin = await User.aggregate([ {
        //             $match: { _id: req.user_id }
        //         },
        //         {
        //             $lookup: {
        //                 from: 'roles',
        //                 localField: 'roleId',
        //                 foreignField: '_id',
        //                 as: 'role'
        //             }
        // },
        // {
        //     $project: {
        //         'role.role': 1,
        //     }
        // }])
        // console.log(admin)
        if (admin.roleId.role === 'admin') {
            res.status(200).json({
                message: 'success',
                data: admin.roleId.role,
                isAdmin: true
            })
        }
        else {
            res.status(400).json({
                message: 'unauthorized',
                data: admin.roleId.role,
                isAdmin: false
            })
        }

    } catch (err) {
        console.log('Error', err.message);
        res.status(501).json({
            message: 'Internal Server Error',
            error: err.message
        })
    }
}

module.exports.canAdd = async (req, res, next) => {
    try {
        // Farhan Bhai Code
        // const permissionsList = await Role.aggregate([
        //     {
        //         $match: { _id: ObjectId("632a22ea981c3d628041c41b") }
        //     },
        //     {
        //         $lookup: {
        //             from: 'permissions',
        //             localField: 'permissionId',
        //             foreignField: '_id',
        //             as: 'permissions'
        //         }
        //     },
        //     {
        //         $project: {
        //             name: 1, 'permissions.permission': 1,
        //         }
        //     }
        // ]);
        //
        // res.status(200).json({
        //     message:'Success',
        //     data: permissionsList
        // })

        const user = await User.findById(req.user_id).populate('roleId');
        // const user = await User.findById(req.user_id).populate({
        //     path:'roleId',
        //     populate:[{
        //         path:'permissionId',
        //         populate: {
        //             model: 'permissions',
        //             // select: 'permission'
        //         }
        //     }]
        // });
        // console.log(user)
        let status = false;
        if (user) {
            const role = await Role.findById(user.roleId).populate('permissionId')
            // console.log(role)
            if (role) {
                for await (const permissions of role.permissionId) {
                    if (permissions.permission === "add_user") {
                        status = true
                        // next()
                        // res.status(200).json({
                        //     message: "Can Add",
                        //     canAdd: true,
                        //     data: permissions
                        // })
                    }
                }
            }
        }
        status === true ? next() : res.status(200).json({
            message: "Unauthorized, Permission Denied to Add",
            canAdd: false,
        })

    } catch (err) {
        console.log('Error', err.message);
        res.status(501).json({
            message: 'Internal Server Error',
            error: err.message
        })
    }
}

module.exports.canView = async (req, res, next) => {
    try {
        const user = await User.findById(req.user_id).populate('roleId');
        let status = false;
        if (user) {
            const role = await Role.findById(user.roleId).populate('permissionId')
            if (role) {
                for await (const permissions of role.permissionId) {
                    if (permissions.permission === "view_user") {
                        status = true
                        // res.status(200).json({
                        //     message: "Can View",
                        //     canView: true,
                        //     data: permissions
                        // })
                    }
                }
            }
        }
        status === true ? next() : res.status(200).json({
            message: "Unauthorized, Permission Denied to View",
            canView: false,
        })

    } catch (err) {
        console.log('Error', err.message);
        res.status(501).json({
            message: 'Internal Server Error',
            error: err.message
        })
    }
}


module.exports.canEdit = async (req, res, next) => {
    try {
        const user = await User.findById(req.user_id).populate('roleId');
        let status = false
        if (user) {
            const role = await Role.findById(user.roleId).populate('permissionId')
            if (role) {
                for await (const permissions of role.permissionId) {
                    if (permissions.permission === "edit_user") {
                        status = true
                        // next()
                        // res.status(200).json({
                        //     message: "Can Edit",
                        //     canEdit: true,
                        //     data: permissions
                        // })
                    }
                }
            }
        }
        status === true ? next() : res.status(200).json({
            message: "Unauthorized, Permission Denied to Edit",
            canEdit: false,
        })

    } catch (err) {
        console.log('Error', err.message);
        res.status(501).json({
            message: 'Internal Server Error',
            error: err.message
        })
    }
}


module.exports.canDelete = async (req, res, next) => {
    try {
        const user = await User.findById(req.user_id).populate('roleId');
        let status = false
        if (user) {
            const role = await Role.findById(user.roleId).populate('permissionId')
            for await (const permissions of role.permissionId) {
                if (permissions.permission === "delete_user") {
                    status = true
                    // next()
                    // res.status(200).json({
                    //     message: "Can Delete",
                    //     canDelete: true,
                    //     data: permissions
                    // })
                }
            }

        }
        status === true ? next() : res.status(200).json({
            message: "Unauthorized, Permission Denied to Delete",
            canDelete: false,
        })

    } catch (err) {
        console.log('Error', err.message);
        res.status(501).json({
            message: 'Internal Server Error',
            error: err.message
        })
    }
}