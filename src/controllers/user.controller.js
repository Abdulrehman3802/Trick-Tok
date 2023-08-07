const User = require("../models/user.model");
const signup = require("../models/signup.model");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const signupValidationModel = require("../models/signupvalidation/signupvalidation.model");

const customizeDashboard = require("../models/Customize-Dashboard/Customize-Dashboard.model");

const {createChatDaddyAccount, deleteChatDaddyAccount} = require("../helper/techoverflow.whatsapp.helper");
const axios = require("axios").default;


let validUrl = function (url) {
    let urlRegex = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;
    return urlRegex.test(url);
};
let validateEmail = function (email) {
    let re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
};

module.exports.validateNumber = async (req, res) => {
    try {
        const number = await User.findOne({phone: req.body.phonenumber});
        if (number) {
            return res.status(200).json({
                message: "Phone number already exists",
                validate: false,
            });
        } else {
            return res.status(200).json({
                validate: true,
                message: "Phone number not found",
            });
        }
    } catch (err) {
        console.log("Error", err.message);
        res.status(500).json({
            message: "Internal Server Error",
            data: err.message,
        });
    }
};

module.exports.addUser = async (req,phone) => {
    try {
        let user = await signupValidationModel.findOne({phone});
        // const salt = await bcrypt.genSalt(12);
        // const hashedPassword = await bcrypt.hash(user?.password, salt);

        if (user) {
            // Create Chat Daddy Account
            // const chatDaddyAccountResponse = await createChatDaddyAccount(req,user?.fullname);
            // console.log('Chat Daddy Account Response', chatDaddyAccountResponse)

            const newUser = await User.create({
                phone: phone,
                password: user.password,
                fullname: user.fullname,
                companyname: user.companyname,
                // chatDaddyId:chatDaddyAccountResponse.accountId
            });
            let data = {}
            let dashboard = await customizeDashboard.create({
                ...data,
                createdBy: newUser._id,
            })
            if(!dashboard){
                return {
                    code: 500,
                    status: "fail",
                    error: "error creating Dashboard",
                };
            }
            if (newUser) {
                await signupValidationModel.deleteOne({phone});
                return {
                    code: 201,
                    status: "success",
                    message: "user created successfully",
                    data: newUser,
                };
            } else {
                return {
                    code: 500,
                    status: "fail",
                    error: "error creating user",
                };
            }
        } else {
            return {
                code: 404,
                message: "No User Found",
            };
        }
    } catch (err) {
        console.log("Error ============>", err.message);
        return {
            code: 500,
            message: "Internal Server Error",
            error: err.message,
        };
    }
};

module.exports.createUser = async (req, res, next) => {
    // console.log('---------------------------->   In Create   <----------------------------')

    try {
        // const phone = req.body.phonenumber;
        // const userExist = await User.findOne({phone});
        // if (userExist) {
        //     res.status(200).json({
        //         message: "user already exist",
        //         data: userExist,
        //         exist: true,
        //     });
        // } else {
        //     if (req.body?.roleId) {
        //         req.body.roleId = mongoose.Types.ObjectId(req.body.roleId);
        //     }
        //     const salt = await bcrypt.genSalt(12);
        //     req.body.password = await bcrypt.hash(req.body.password, salt);
        //
        //     const user = await User.create(req.body);
        //
        //     res.status(201).json({
        //         message: "User Created Successfully",
        //         data: user,
        //     });
        // }
        const chatDaddyAccountResponse = await createChatDaddyAccount(req,res);
        console.log('Chat Daddy Account Response', chatDaddyAccountResponse)
        res.json(chatDaddyAccountResponse)
    } catch (err) {
        console.log("Error", err.message);
        res.status(501).json({
            message: "Internal Server Error",
            data: err.message,
        });
    }
};

module.exports.createUserWithFacebook = async (req, res, next) => {
    try {
        const phone = req.body.phonenumber;
        const userExist = await User.findOne({phone});
        if (userExist) {
            res.status(200).json({
                message: "Number already Registered",
                data: userExist,
                exist: true,
            });
        } else {
            if (req.body?.roleId) {
                req.body.roleId = mongoose.Types.ObjectId(req.body.roleId);
            }
            req.body.isFacebook = true;
            const user = await User.create(req.body);

            res.status(201).json({
                message: "User Created Successfully",
                status: 'success',
                data: user,
            });
        }
    } catch (err) {
        console.log("Error", err.message);
        res.status(500).json({
            message: "Internal Server Error",
            data: err.message,
        });
    }
};

module.exports.updateCredentials = async (req, res, next) => {
    try {
        const id = req.user_id;

        if (req.body.email) {
            const email = validateEmail(req.body.email);
            if (!email) {
                return res.status(400).json({
                    message: "Invalid Email",
                    data: null,
                });
            }
        }
        if (req.body.companyemail) {
            const companyemail = validateEmail(req.body.companyemail);
            if (!companyemail) {
                return res.status(400).json({
                    message: "Invalid Email",
                    data: null,
                });
            }
        }

        if (req.body.companywebsite) {
            const companywebsite = validUrl(req.body.companywebsite);
            if (!companywebsite) {
                return res.status(400).json({
                    message: "Invalid Url",
                    data: null,
                });
            }
        }

        const update = await signup.findByIdAndUpdate(id, req.body, {new: true});
        res.status(201).json({
            message: "Successfully Updated",
            data: update,
        });
    } catch (err) {
        console.log("Error", err.message);
        return res.status(501).json({
            message: "Internal Server Error",
            data: err.message,
        });
    }
};

module.exports.getUser = async (req, res, next) => {
    try {
        const user_id = req.params.id;
        const user = await User.findById(user_id);
        res.status(200).json({
            message: "Success",
            data: user,
        });
    } catch (err) {
        console.log("Error", err);
        res.status(501).json({
            message: "Internal Server Error",
        });
    }
};

module.exports.updateUser = async (req, res, next) => {
    try {
        const user_id = req.params.id;
        const user = await User.findByIdAndUpdate(user_id, req.body);
        console.log(user);
        const updateUser = await User.findById(user.id);
        console.log("User Response ---------> ", updateUser, req.body);
        res.status(200).json({
            message: "Updated Successfully",
            data: updateUser,
        });
    } catch (err) {
        console.log("Error", err);
        res.status(501).json({
            message: "Internal Server Error",
        });
    }
};

module.exports.deleteUser = async (req, res, next) => {
    try {
        const user_id = req.params.id;
        let user;

        if (req.params.id !== "null") {
            const getUser = await User.findById(user_id);
            if(getUser?.chatDaddyId){
            await deleteChatDaddyAccount(req, getUser?.chatDaddyId);
            }
            user = await User.findByIdAndUpdate(user_id, {isActive: 3});
            res.status(200).json({
                message: "Successfully Deleted",
            });
        } else {
            // console.log("Ids List", req.body);
            console.log("Ids List", req.body.ids[0]);
            // const ids = JSON.parse(req.body.ids);
            const ids = req.body.ids;
            // console.log("Ids List", typeof ids);
            for await (const id of ids){
                const getUser = await User.findById(id);
                if(getUser?.chatDaddyId){
                    await deleteChatDaddyAccount(req, getUser?.chatDaddyId);
                }
            }
            user = await User.updateMany({_id: {$in: ids}}, {$set: {isActive: 3}}, {multi: true});

            res.status(200).json({
                message: "Successfully Deleted",
            });
        }

        // if (user) {
        //   res.status(200).json({
        //     message: "Successfully Deleted",
        //   });
        // } else {
        //   res.status(404).json({
        //     message: "Record Not Found",
        //     data: null,
        //   });
        // }
    } catch (err) {
        console.log("Error", err);
        res.status(501).json({
            message: "Internal Server Error",
        });
    }
};

module.exports.editProfile = async (req, res, next) => {
    try {
        if (req.body.roleId) {
            req.body.roleId = mongoose.Types.ObjectId(req.body.roleId);
        }
        if (req.file) {
            const today = new Date().toDateString().replaceAll(' ', '_')
            const uploadPath = `images/profile/${today}/`
            req.body.image = uploadPath + req.file.filename;

            // const { image } = req.files;
            // const path = `${__dirname}/../../public/images/` + image.name;
            // req.body.image = `${image.name}`;
            // await image.mv(path);
        }
        if (req.body?.password) {
            const salt = await bcrypt.genSalt(12);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }
        await User.findByIdAndUpdate(req.user_id, req.body);
        const updateUser = await User.findById(req.user_id);
        res.status(200).json({
            message: "Success",
            data: updateUser,
        });
    } catch (e) {
        console.log(e);
    }
};

module.exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({isActive: {$ne: 3},type:"user"}, {
            fullname: 1,
            image: 1,
            isActive: 1
        }).populate({
            path:"subscriptionId",
            select:"plan_name plan_type payment_status payment_id"
    });

        if (users?.length > 0) {
            res.status(200).json({
                message: "Found Successfully",
                data: users,
            });
        }
        else{
            res.status(404).json({
                message: "No Record Found",
                data: null,
            });
        }
    } catch (err) {
        console.log("Error", err.message);
        res.status(500).json({
            message: "Internal Server Error",
            error: err.message,
        });
    }
};

// Reset Password

module.exports.resetPassword = async (req, res, next) => {
    try {
        const phonenumber = req.body.phonenumber;
        // const newPassword = req.body.newPassword;
        const confirmPassword = req.body.confirmPassword;

        const salt = await bcrypt.genSalt(12);
        // if (newPassword === confirmPassword) {
        const password = await bcrypt.hash(confirmPassword, salt);
        if (password) {
            const data = await User.findOneAndUpdate({phone: phonenumber}, {password: password}, {new: true});
            console.log(data, password, req.body.confirmPassword)
            res.status(200).json({
                message: "Updated Successfully",
            });
        } else {
            res.status(400).json({
                message: "Something went wrong",
            });
        }
        // } else {
        //   res.status(409).json({
        //     message: "Password doesn't match",
        //   });
        // }
    } catch (err) {
        console.log("Error", err);
        res.status(501).json({
            message: "Internal Server Error",
        });
    }
};
