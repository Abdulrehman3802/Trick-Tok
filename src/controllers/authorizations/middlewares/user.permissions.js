const Permission = require('../../../models/permissions.model');
const User = require('../../../models/user.model');
const Role = require('../../../models/role.model');

module.exports.getPermissions=async (req,res,next)=>{
    try{
        const user = await User.findById(req.user_id)

        const userRoles= await Role.findById(user.roleId)
        const userPermissions = await Permission.find({_id:{$in:userRoles.permissionId}})
        if(userPermissions) {
            res.status(200).json({
                message: 'Found',
                data: userPermissions
            })
            return userPermissions
        }
        else{
            res.status(200).json({
                message: 'No Record Found',
                data: null
            })
        }
    }catch (e) {
        console.log('Error',e)
        res.status(501).json({
            message:'Internal Server Error'
        })
    }
}