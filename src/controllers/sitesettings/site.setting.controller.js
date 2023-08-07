// requiring Schema
const siteSetting = require("../../models/sitesettings/site.setting.model")
// function to add logo
exports.addLogo = async (req, res) => {
    try {
        const today = new Date().toDateString().replaceAll(' ', '_')
        const uploadPath = `images/logo/${today}/`
        if (req.file) {

            const logo = await siteSetting.create({
                ...req.body,
                logo: uploadPath + req.file.filename,
            })
            return res.status(200).json({
                status: 'Success',
                message: `logo uploaded with file name ${req.file.filename}`
            })
        }
        else {
            return res.status(400).json({
                status: 'Fail',
                message: `logo not uploaded`,
            })
        }
    } catch (e) {
        console.log(e);
        res.status(400).json({
            status: 'Fail',
            message: `logo not uploaded`,
            error: e
        })
    }
}
//Function to update logo if needed
exports.updateLogo = async (req, res) => {
    try {
        // accept file from req
        const today = new Date().toDateString().replaceAll(' ', '_')
        const uploadPath = `images/logo/${today}/`
        // getting id to change logo from req
        const id = req.params.id
        //finding and updating logo
        if (req.file) {

            const Ulogo = await siteSetting.findByIdAndUpdate(id, { logo: uploadPath + req.file.filename }, { new: true })
            res.status(200).json({
                status: 'Success',
                message: `logo update with file name ${req.file.filename}`
            })
        }
        else {
            res.status(400).json({
                status: 'Fail',
                message: `logo not updated`,
            })
        }
    } catch (e) {
        console.log(e);
        res.status(400).json({
            status: 'Fail',
            message: `logo not updated`,
            error: e
        })
    }

}