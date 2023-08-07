const mongoose = require('mongoose')
const siteSchema = mongoose.Schema({
    //contain the path of image
    logo: {
        type: String,
        require: [true, 'logo must not be empty']
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref : 'user'
    },
    // include updated and created date
}, { timestamps: true })

const siteSetting = mongoose.model('siteSetting', siteSchema)
module.exports = siteSetting