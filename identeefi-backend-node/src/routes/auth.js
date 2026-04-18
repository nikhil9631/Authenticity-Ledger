const express = require('express');
const router = express.Router();
const { requireAuth, requireRole } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { loginSchema, addAccountSchema, changePasswordSchema } = require('../validators/authValidator');
const authService = require('../services/authService');

// POST /auth/login
router.post('/auth/login', validate(loginSchema), async (req, res) => {
    try {
        const { username, password } = req.body;
        const result = await authService.login(username, password);
        if (!result) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        return res.json(result);
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ error: 'Login failed' });
    }
});

// GET /authAll
router.get('/authAll', requireAuth, requireRole('admin'), async (req, res) => {
    try {
        const rows = await authService.getAllAccounts();
        res.header('Access-Control-Allow-Credentials', true);
        res.json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Failed to fetch accounts' });
    }
});

// POST /addaccount
router.post('/addaccount', requireAuth, requireRole('admin'), validate(addAccountSchema), async (req, res) => {
    try {
        const { username, password, role } = req.body;
        await authService.createAccount(username, password, role);
        res.status(201).json({ message: 'Account created' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Failed to create account' });
    }
});

// POST /changepsw
router.post('/changepsw', requireAuth, validate(changePasswordSchema), async (req, res) => {
    const { username, password } = req.body;
    if (req.user.username !== username && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden' });
    }
    try {
        await authService.changePassword(username, password);
        res.json({ message: 'Password updated' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Failed to update password' });
    }
});

module.exports = router;
