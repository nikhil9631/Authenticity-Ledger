const express = require('express');
const router = express.Router();
const pool = require('../config/database');

router.get('/health', async (req, res) => {
    const status = { status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() };
    try {
        await pool.query('SELECT 1');
        status.database = 'connected';
    } catch (err) {
        status.status = 'degraded';
        status.database = 'disconnected';
    }
    const code = status.status === 'ok' ? 200 : 503;
    res.status(code).json(status);
});

module.exports = router;
