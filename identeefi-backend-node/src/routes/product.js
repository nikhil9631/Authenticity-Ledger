const express = require('express');
const router = express.Router();
const { requireAuth, requireRole } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { addProductSchema } = require('../validators/productValidator');
const productService = require('../services/productService');

// GET /product/serialNumber
router.get('/product/serialNumber', async (req, res) => {
    try {
        const rows = await productService.getSerialNumbers();
        res.json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Failed to fetch product serial numbers' });
    }
});

// POST /addproduct
router.post('/addproduct', requireAuth, requireRole('manufacturer', 'admin'), validate(addProductSchema), async (req, res) => {
    try {
        const { serialNumber, name, brand } = req.body;
        await productService.addProduct(serialNumber, name, brand);
        res.status(201).json({ message: 'Product added' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Failed to add product' });
    }
});

module.exports = router;
