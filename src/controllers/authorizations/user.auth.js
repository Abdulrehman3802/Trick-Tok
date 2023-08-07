const User = require("../../models/user.model");
const jwt = require("jsonwebtoken");
const offlineBotCronJob = require("../cronjobs/cron.job")
const bcrypt = require("bcrypt")
const config = require('config');

module.exports.authenticateUser = async (req, res, next) => {
  try {
    const token = req.headers?.authorization?.split(" ")?.[1] ?? "";
    if (token) {
      // console.log('------>', token)
      const decode = jwt.verify(token, config.get('JWT_SECRET_TOKEN'));
      // console.log('Decode: ', !!decode)
      if (decode) {
        req.user_id = decode.user_id;
        global.user_id=decode.user_id;
        if(decode?.type){
          // console.log('Decode: ',decode.type)
          req.user_type=decode.type;
        }
        next();
      }
      else {
        res.status(401).json({
          status: 'failed',
          message: 'User is not logged. Invalid Token',
          isLoggedIn: false
        })
      }
    } else {
      res.status(401).json({
        status: 'failed',
        message: 'User is not logged In',
        isLoggedIn: false
      })
    }
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      // If the token is expired, return a response to the client indicating that the token has expired
      res.status(401).json({
        status: 'failed',
        message: 'Token expired',
        isLoggedIn: false
      });
    } else {
      res.status(500).json({
        status: 'failed',
        message: err.message === "invalid signature" ? "Your Token is Invalid" : err,
        isLoggedIn: false
      });
    }
  }
}

async function isLoggedIn(req) {
  try {
    const token = req.headers?.authorization?.split(" ")?.[1] ?? "";
    if (token) {
      // console.log('------>', token)
      const decode = jwt.verify(token, config.get('JWT_SECRET_TOKEN'));
      return !!decode;
    } else {
      return false;
    }
  } catch (err) {
    console.log('Error on Login token----> ', err.message)
  }
  // const token = req.headers?.authorization?.split(" ")?.[1] ?? "";
  //
  // if (token) {
  //   return token;
  // }
  // else {
  //   return false;
  // }
}

module.exports.loginWithPhone = async (req, res, next) => {
  try {
    const checkToken = await isLoggedIn(req);
    // console.log("Login ===== ", req.body.phonenumber, req.body.password, checkToken);
    if (!checkToken) {
      const userPhone = await User.findOne({ phone: req.body.phonenumber });

      if (userPhone) {
        const user = await bcrypt.compare(req.body.password, userPhone.password);
        // console.log(userPhone)
        if (userPhone.isActive === 1 && user && userPhone.type === 'user') {
          // res.cookie("user_id", userEmail._id, {maxAge: 3600000});
          const token = await jwt.sign({ user_id: userPhone._id }, config.get('JWT_SECRET_TOKEN'), {
            expiresIn: "10h",
          });
          // res.cookie("user_id", token, { maxAge: 10800000 });
          req.user_id =userPhone._id;
          // console.log('User',req.user_id)
          // await offlineBotCronJob.offlineBotAutomation(req,res,next)
          res.status(200).json({
            message: "User Found",
            data: userPhone,
            validate: true,
            token,
          });
          // next()
        } else {
          res.status(403).json({
            message: "Cannot Find User",
            validate: false,
          });
        }
      } else {
        res.status(403).json({
          message: "Incorrect Email Or Password",
          validate: false,
        });
      }
    } else {
      res.status(200).json({
        message: "Already Logged In",
      });
      // next()
    }
  } catch (e) {
    console.log("Error ", e);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports.loginValidateWithFacebook = async (req, res) => {
  try {
    // console.log("Login ===== ", req.body.facebookId);
    // const checkToken = await isLoggedIn(req);
    // if (!checkToken) {
    const user = await User.findOne({ facebookId: req.body.facebookId });

    if (user) {
      // console.log("User", user);
      if (user?.isActive === 1 && user?.phone) {
        // res.cookie("user_id", userEmail._id, {maxAge: 3600000});
        const token = await jwt.sign({ user_id: user._id }, process.env.JWT_SECRET_TOKEN, {
          expiresIn: "1h",
        });
        res.cookie("user_id", token, { maxAge: 3600000 });

        res.status(200).json({
          message: "User Found",
          data: user,
          validate: true,
          token,
        });
        // next()
      } else {
        res.status(200).json({
          message: "Cannot Find User",
          validate: false,
        });
      }
    } else {
      res.status(200).json({
        message: "Incorrect Email Or Password",
        validate: false,
      });
    }
    // } else {
    //   res.status(200).json({
    //     message: "Already Logged In",
    //   });
    // next()
    // }
  } catch (e) {
    console.log("Error ", e);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const checkToken = await isLoggedIn(req);
    if (!checkToken) {
      const userEmail = await User.findOne({ email: req.body.email });
      // console.log(userEmail)
      if (userEmail) {
        const user = await bcrypt.compare(req.body.password, userEmail.password);
        // console.log(user)
        if (userEmail.isActive === 1 && user) {
          // res.cookie("user_id", userEmail._id, {maxAge: 3600000});
          const token = await jwt.sign({ user_id: userEmail._id }, process.env.JWT_SECRET_TOKEN, {
            expiresIn: "1h",
          });
          res.cookie("user_id", token, { maxAge: 3600000 });

          res.status(200).json({
            message: "User Found",
            data: userEmail,
            validate: true,
            token,
          });
          next();
        } else {
          res.status(403).json({
            message: "Incorrect Email Or Password",
            validate: false,
          });
        }
      } else {
        res.status(403).json({
          message: "Incorrect Email Or Password",
          validate: false,
        });
      }
    } else {
      res.status(200).json({
        message: "Already Logged In",
      });
      next();
    }
  } catch (e) {
    console.log("Error ", e);
    res.status(501).json({
      message: "Internal Server Error",
    });
  }
};

module.exports.getUser = async (req, res, next) => {
  try {
    const checkToken = await isLoggedIn(req);
    if (!checkToken) {
      res.status(403).json({
        message: "Login Again",
        isLoggedIn: false,
      });
    } else {
      jwt.verify(checkToken, process.env.JWT_SECRET_TOKEN, function (err, decoded) {
        if (err) {
          res.status(500).json({
            message: "Token Expired Please Login Again",
            isLoggedIn: false,
          });
        } else {
          req.user_id = decoded.user_id;
          next();
        }
      });
    }
  } catch (e) {
    console.log("Error ", e);
    res.status(501).json({
      message: "Internal Server Error",
    });
  }
};

module.exports.logout = async (req, res, next) => {
  const checkToken = await isLoggedIn(req);
  if (!checkToken) {
    res.status(403).json({
      message: "Login Again",
      isLoggedIn: false,
    });
  } else {
    res.clearCookie("user_id");
    res.status(200).json({
      message: "Logout Successfully",
    });
  }
};

module.exports.failureRedirectController = async (req, res) => {
  res.status(403).json({
    message: "Something Went Wrong",
    isLoggedIn: false,
  });
};

module.exports.adminLogin = async (req, res) => {
  try {
    const checkToken = await isLoggedIn(req);
    // console.log("Login ===== ", req.body.phonenumber, req.body.password, checkToken);
    if (!checkToken) {
      const adminUser = await User.findOne({ type: req.body.username.toLowerCase() });

      if (adminUser) {
        const user = await bcrypt.compare(req.body.password, adminUser.password);
        // console.log(user)
        if (adminUser.isActive === 1 && user && adminUser?.type === 'admin') {
          // res.cookie("user_id", userEmail._id, {maxAge: 3600000});
          const token = await jwt.sign({ user_id: adminUser._id , type:'admin'}, config.get('JWT_SECRET_TOKEN'), {
            expiresIn: "10h",
          });
          // res.cookie("user_id", token, { maxAge: 10800000 });
          req.user_id =adminUser._id;
          // console.log('User',req.user_id)
          // await offlineBotCronJob.offlineBotAutomation(req,res,next)
          res.status(200).json({
            message: "User Found",
            data: adminUser,
            validate: true,
            token,
            isLoggedIn: true,
          });
          // next()
        } else {
          res.status(403).json({
            message: "Cannot Find User",
            validate: false,
          });
        }
      } else {
        res.status(403).json({
          message: "Incorrect Email Or Password",
          validate: false,
        });
      }
    } else {
      res.status(200).json({
        message: "Already Logged In",
      });
      // next()
    }
  } catch (e) {
    console.log("Error ", e);
    res.status(500).json({
      message: "Internal Server Error",
      error: e.message
    });
  }
  //   if (req.body.username.toLowerCase() === "admin" && req.body.password === 'Eu2TrickTok#$') {
  //     const token = await jwt.sign({ user_id: req.body.username }, process.env.JWT_SECRET_TOKEN, {
  //       expiresIn: "3h",
  //     });
  //     // res.cookie("user_id", token, { maxAge: 3600000 });
  //     res.status(200).json({
  //       isLoggedIn: true,
  //       message: "success",
  //       token
  //     })
  //   }
  //   else {
  //     res.status(200).json({
  //       isLoggedIn: false,
  //       message: "Invalid username or password",
  //     })
  //   }
  //
  // } catch (err) {
  //   console.log('Error: ' + err.message);
  //   res.status(500).json({
  //     message: "Internal Server Error",
  //   });
  // }
}
