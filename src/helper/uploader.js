const multer = require('multer');
const path = require('path');
const fs = require('fs');


// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//
//         const today = new Date().toDateString().replaceAll(' ', '_')
//         const uploadPath = path.join(__dirname, `/../../public/images/attachments/${today}`)
//         if (!fs.existsSync(uploadPath)) {
//             fs.mkdirSync(uploadPath);
//         }
//
//         cb(null, uploadPath);
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.originalname.split('.').join('') +"_"+ Date.now()  + path.extname(file.originalname))
//     }
// })

const storageWithPath = (dirPath) => {
    return multer.diskStorage({
        destination: (req, file, cb) => {
            const today = new Date().toDateString().replaceAll(' ', '_');
            const uploadPath = path.join(__dirname, `/../../public/${dirPath}/${today}`);
            // console.log('Upload path: ---->  ' + uploadPath)
            if (!fs.existsSync(uploadPath)) {
                try {
                    fs.mkdirSync(uploadPath);
                } catch (err) {
                    // Handle the error here
                    console.error('error',err);
                }
            }
            cb(null, uploadPath);
        },
        filename: (req, file, cb) => {

            cb(null, file.originalname.replaceAll(' ', '_').split('.').join('') + "_" + Date.now() + path.extname(file.originalname));
        }
    });
};

const storageWithWhatsAppPath = (dirPath) => {
    return multer.diskStorage({
        destination: (req, file, cb) => {
            const today = new Date().toDateString().replaceAll(' ', '_');
            const uploadPath = path.join(__dirname, `/../../public/${dirPath}/${today}`);
            // console.log('Upload path: ---->  ' + uploadPath)
            if (!fs.existsSync(uploadPath)) {
                try {
                    fs.mkdirSync(uploadPath);
                } catch (err) {
                    // Handle the error here
                    console.error('error',err);
                }
            }
            cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
            while (file.originalname.indexOf(" ") !== -1) {
                file.originalname = file.originalname.replaceAll(" ", "");
            }
            cb(null, file.originalname.split('.').join('') + "_" + Date.now() + path.extname(file.originalname));
        }
    });
};

const memoryStorage = multer.memoryStorage({
    destination: function (req, file, callback) {
        console.log('---------------------------- In memory Storage  ------------------------------------');
        callback(null, '/../../public/temp');
    }
});

const upload = (dirPath) => multer({ storage: storageWithPath(dirPath) });
const uploadWhatsAppMedia = (dirPath) => multer({ storage: storageWithWhatsAppPath(dirPath) });
const memoryUpload = multer({ storage: memoryStorage });

module.exports = { upload, memoryUpload , uploadWhatsAppMedia};
