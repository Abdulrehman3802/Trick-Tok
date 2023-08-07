const signUpValidation = require("../../models/signupvalidation/signupvalidation.model");
const User = require("../../models/user.model");
const bcrypt = require("bcrypt");

module.exports.signUpValidation = async (req, res) => {
  try {
    const userExist = await signUpValidation.findOne({ phone: req.body.phone });
    const userRegistered = await User.findOne({ phone: req.body.phone });

    if (!userExist && !userRegistered) {
      const salt = await bcrypt.genSalt(12);
      req.body.password = await bcrypt.hash(req.body.password, salt);

      const newSignup = await signUpValidation.create(req.body);
      res.status(201).json({
        status: "success",
        message: "user created successfully",
        data: newSignup,
      });
    } else {
      res.status(400).json({
        message: "user already exists!",
        status: "fail",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};
module.exports.signUpValidateToken = async (req, res) => {
  try {
    const validateToken = await signUpValidation.findById(req.body.id);
    if (validateToken === req.body.token) {
      await signUpValidation.findByIdAndDelete(validateToken?._id);
      res.status(200).json({
        message: "success",
        data: validateToken,
      });
    } else {
      res.status(404).json({
        message: "invalid token or user",
        data: null,
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

// module.exports.validateUser = async (req, res)=>{
//     try{
//         const userExist = await signUpValidation.findOne({phone: req.body.phone});
//         if(userExist){
//             if(userExist?.password === req.body.password){
//                 res.status(401).json({
//                     message:'user must verify token',
//                     data:userExist
//                 });
//             }
//             else {
//                 res.status(401).json({
//                     message: 'invalid number or password',
//                     data: null
//                 });
//             }
//         }
//         else {
//             res.status(404).json({
//                 message: 'user not found',
//                 data: null
//             });
//         }

//     }catch (err) {
//         res.status(500).json({
//             message: "Internal Server Error",
//             error: err.message
//         })
//     }
// }

module.exports.validateUser = async (req, res) => {
  try {

    const userExist = await signUpValidation.findOne({ phone: req.body.phonenumber });

    if (userExist) {
      const user = await bcrypt.compare(req.body.password, userExist.password);
      if (user) {
        res.status(200).json({
          status: "fail",
          message: "user must verify token",
          data: userExist,
        });
      } else {
        res.status(200).json({
          status: "invalid_credentials",
          message: "Invalid username or password",
          data: userExist,
        });
      }
    } else {
      res.status(200).json({
        status: "success",
        message: "user is verified",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};
