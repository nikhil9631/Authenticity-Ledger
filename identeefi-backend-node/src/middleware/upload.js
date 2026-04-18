const multer = require('multer');
const path = require('path');

const storageProduct = multer.diskStorage({
    destination: path.join(__dirname, '../../public/uploads/product'),
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const storageProfile = multer.diskStorage({
    destination: path.join(__dirname, '../../public/uploads/profile'),
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const uploadProfile = multer({ storage: storageProfile }).single('image');
const uploadProduct = multer({ storage: storageProduct }).single('image');

module.exports = { uploadProfile, uploadProduct };
