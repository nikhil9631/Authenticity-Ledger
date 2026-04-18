const client = require('../config/database');

async function getAllProfiles() {
    const data = await client.query('SELECT * FROM profile');
    return data.rows;
}

async function getProfileByUsername(username) {
    const data = await client.query(
        'SELECT * FROM profile WHERE username = $1',
        [username]
    );
    return data.rows;
}

async function createProfile(username, name, description, website, location, image, role) {
    await client.query(
        'INSERT INTO profile (username, name, description, website, location, image, role) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [username, name, description, website, location, image, role]
    );
}

module.exports = { getAllProfiles, getProfileByUsername, createProfile };
