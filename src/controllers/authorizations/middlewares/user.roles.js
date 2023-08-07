const Role = require('../../../models/role.model');
const User = require('../../../models/user.model');
const SignUp = require('../../../models/signup.model');
const UserRole = require('../../../models/userroles/user.roles.model')
const jwt_decode = require('jwt-decode');

const mongoose = require('mongoose')
;

module.exports.getRoles = async (req, res, next) => {
    try {
        const user = await SignUp.findById(req.user_id)
        console.log(user)
        const userRoles = await Role.findById(user.roleId)
        if (userRoles) {
            res.status(200).json({
                message: 'Found',
                data: userRoles
            })
            return userRoles.role
        } else {
            res.status(200).json({
                message: 'No Record Found',
                data: null
            })
        }
    } catch (e) {
        console.log('Error', e)
        res.status(501).json({
            message: 'Internal Server Error'
        })
    }
}

module.exports.assignRole = async (req, res, next) => {
    try {
        const findUser = await User.findByIdAndUpdate(req.params.id, req.body);
        if (findUser) {
            const user = await User.findById(req.params.id)
            res.status(200).json({
                message: "Role Assigned Successfully",
                data: user
            })
        } else {
            res.status(404).json({
                message: "No User Found",
                data: null
            })
        }
    } catch (err) {
        console.log('Error', err.message);
        res.status(500).json({
            message: 'Internal Server Error',
            error: err
        })
    }
}

module.exports.createUserRole = async (req, res, next) => {

    try {
        // let token = req.cookies.user_id
        // let decoded = jwt_decode(token);
        // // console.log(decoded);
        // const user_Id = decoded.user_id
        console.log(req.body)
        const user = await User.findById(req.body.userid)
        console.log(user);

        const role = user.roleId
        console.log(role);

        const role_access = await Role.findById({_id: role})
        console.log(role_access)
        // res.send(roleaccess)

        const userRole = await UserRole.create({
            userId: req.body.userid,
            roleId: role,
            access: role_access.access,
            isActive: 1
        });

        res.status(200).json({
            message: 'success',
            data: userRole
        })
        // console.log(userRole)

    } catch (e) {
        console.log('Error', e)
        res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}

module.exports.getUserRole = async (req, res, next) => {

    try {
        // let token = req.cookies.user_id
        // let decoded = jwt_decode(token);
        // console.log(decoded);
        // const user_Id = decoded.user_id
        // console.log(req.headers.userid)
        // console.log(user_Id)

        const userRoles = await UserRole.findOne({userId: req.headers.userid})
            .populate('roleId', 'name')
            .populate('access.role', 'name')
            .populate('access.permissions.pid', 'name')
            .lean()

        const access = userRoles.access
        // console.log("access -------->",access)
        const formattedAccess = {
            roleId: userRoles.roleId._id,
            userId: userRoles.userId,
            roleName: userRoles.roleId.name,
            roles: access.map(a => {
                return {
                    _id: a.role._id,
                    name: a.role.name,
                    isActive: a.isActive,
                    permissions: a.permissions.map(p => {
                        return {
                            _id: p.pid._id,
                            name: p.pid.name,
                            isActive: p.isActive,
                        }
                    })
                }
            })
        }
        // console.log('---->',formattedAccess)

        res.status(200).json({
            message: 'success',
            data: formattedAccess
        })
    } catch (e) {
        console.log('Error', e)
        res.status(500).json({
            message: 'Internal Server Error'
        })
    }

}

module.exports.updateUserRole = async (req, res, next) => {
 try {
     if (req.body?.roleId) {
         // const role = await UserRole.findOneAndUpdate({userId: req.body?.userId,
         //     'access.role':req.body?.roleId}, {'$set': {
         //     'access.$.isActive': 3,
         //     }},{
         //     new: true
         // })
         const role = await UserRole.findOneAndUpdate(
             {userId: req.body?.userId},
             {$set: {"access.$[el].isActive": req.body?.value,
                     "access.$[el].permissions.$[].isActive": req.body?.value}},
             {
                 arrayFilters: [{"el.role": req.body?.roleId}],
                 new: true
             }
         )
         res.json({
             status:'success',
             message:'role updated successfully',
             data: role
         });
     } else if (req.body?.pId) {
         const role = await UserRole.findOneAndUpdate(
             {userId: req.body?.userId},
             {$set: {"access.$[].permissions.$[el1].isActive": req.body?.value}},
             {
                 arrayFilters: [{"el1.pid": req.body?.pId}],
                 new: true
             }
         )
         let count = 0;
         let permissionsCount = 0

         for (const roleId of role?.access ){
             // console.log('In Role', roleId.role.toString())
             if(roleId?.role.toString()===req.body.role){
                 // console.log('In ------> Role:',roleId)
                 for (const permissions of roleId.permissions){
                     // console.log('--------->',permissions)
                     if(permissions.isActive===0){
                         console.log('Permissions is active',count, permissionsCount)
                         count++;
                     }
                     permissionsCount++;
                 }
             }
         }
         console.log('Permissions Outside is active',count, permissionsCount)

         if (count===permissionsCount){
             const roles=   await UserRole.findOneAndUpdate(
                 {userId: req.body?.userId},
                 {$set: {"access.$[el].isActive": 0,
                         "access.$[el].permissions.$[].isActive": 0}},
                 {
                     arrayFilters: [{"el.role": req.body?.role}],
                     new: true
                 }
             )
             res.json({
                 status: 'success',
                 message: 'permission updated successfully',
                 data: roles
             });
         }
         else {
           const roles=  await UserRole.findOneAndUpdate(
                 {userId: req.body?.userId},
                 {$set: {"access.$[el].isActive": 1}},
                 {
                     arrayFilters: [{"el.role": req.body?.role}],
                     new: true
                 }
             )
             res.json({
                 status: 'success',
                 message: 'permission updated successfully',
                 data: roles
             });
         }
     }
 }catch (err) {
     console.log('Error', err.message)
     res.status(500).json({
         message: 'Internal Server Error',
         error: err.message
     })
 }
}