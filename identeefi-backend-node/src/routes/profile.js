const express = require('express');
const router = express.Router();
const { requireAuth, requireRole } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { addProfileSchema } = require('../validators/profileValidator');
const profileService = require('../services/profileService');

// GET /profileAll
router.get('/profileAll', requireAuth, requireRole('admin'), async (req, res) => {
    try {
        const rows = await profileService.getAllProfiles();
        res.header('Access-Control-Allow-Credentials', true);
        res.json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Failed to fetch profiles' });
    }
});

// GET /profile/:username
router.get('/profile/:username', requireAuth, async (req, res) => {
    try {
        const rows = await profileService.getProfileByUsername(req.params.username);
        res.json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});

// POST /addprofile
router.post('/addprofile', requireAuth, requireRole('admin'), validate(addProfileSchema), async (req, res) => {
    try {
        const { username, name, description, website, location, image, role } = req.body;
        await profileService.createProfile(username, name, description, website, location, image, role);
        res.status(201).json({ message: 'Profile created' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Failed to create profile' });
    }
});

module.exports = router;
