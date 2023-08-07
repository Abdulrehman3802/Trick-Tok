const mongoose = require("mongoose");
const { isEmail } = require("validator");
const ObjectId = mongoose.Types.ObjectId;

const userSchema = mongoose.Schema(
  {
    fullname: {
      type: String,
      maxLength: 25,
      required: [true, "Name is required"],
      lowercase: true,
    },
    email: {
      type: String,
      lowercase: true,
      default: null,
    },
    phone: {
      type: String,
      required: [true, "phone number is required"],
      unique: true,
    },
    password: {
      type: String,
    },
    image: {
      type: String,
      default: "user.png",
    },
    companyname: {
      type: String,
      default: null,
    },
    companyemail: {
      type: String,
      lowercase: true,
      default: null,
    },
    companywebsite: {
      type: String,
      default: null,
    },
    teamname: {
      type: String,
      default: null,
    },
    roleId: {
      type: mongoose.Types.ObjectId,
      default: ObjectId("639c5f2c41242ec6fa26e3c6"),
      ref: "role",
    },
    subscriptionId: {
      type: mongoose.Types.ObjectId,
      default: ObjectId("63e27b2a0e7342456f91f064"),
      ref: "subscriptions",
    },
      userSubscriptionId: {
      type: mongoose.Types.ObjectId,
      default: null,
      ref: "user_subscriptions",
    },
    isActive: {
      // 1:Active 2:Block 3:Deleted
      type: Number,
      default: 1,
    },
      adminId: {
        type: String,
          default:null
      },
      chatDaddyId: {
        type: String,
          default:null
      },
    isFacebook: { type: Boolean, default: false },
    facebookId: { type: Number, default: 0 },
      type: {type:String, default:'user'}
  },
  { timestamps: true }
);

// userSchema.pre('save',async (req,res,next)=>{
//     console.log(this)
//     // const salt = await bcrypt.genSalt(12);
//     // const hashPassword = await bcrypt.hash(password, salt);
//     // req.body.password = hashPassword;
//
// })

module.exports = mongoose.model("user", userSchema);
