const mongoose = require("mongoose");
const config = require("config");
const MONGO_URI = config.get("MONGO_URI")

module.exports.connectDB=()=>{
    mongoose.connect(MONGO_URI,{
        useNewUrlParser:true
    }).then(()=>{
        console.log('Database Connected');
    }).catch(err=>{
        console.log('Error ', err);
    })
}
