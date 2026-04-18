const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const { uploadProfile, uploadProduct } = require('../middleware/upload');

// POST /upload/profile
router.post('/upload/profile', (req, res) => {
    uploadProfile(req, res, (err) => {
        if (!req.file) {
            return res.send('Please select an image to upload');
        } else if (err instanceof multer.MulterError) {
            return res.send(err);
        } else if (err) {
            return res.send(err);
        }
    });
});

// POST /upload/product
router.post('/upload/product', (req, res) => {
    uploadProduct(req, res, (err) => {
        if (!req.file) {
            return res.send('Please select an image to upload');
        } else if (err instanceof multer.MulterError) {
            return res.send(err);
        } else if (err) {
            return res.send(err);
        }
    });
});

// GET /file/profile/:fileName
router.get('/file/profile/:fileName', (req, res) => {
    const { fileName } = req.params;
    const filePath = path.join(__dirname, '../../public/uploads/profile', fileName);
    res.sendFile(filePath);
});

// GET /file/product/:fileName
router.get('/file/product/:fileName', (req, res) => {
    const { fileName } = req.params;
    const filePath = path.join(__dirname, '../../public/uploads/product', fileName);
    res.sendFile(filePath);
});

module.exports = router;
