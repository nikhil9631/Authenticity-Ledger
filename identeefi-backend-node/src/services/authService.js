const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const client = require('../config/database');

const BCRYPT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 10;

async function login(username, password) {
    const data = await client.query(
        'SELECT username, password, role FROM auth WHERE username = $1',
        [username]
    );
    if (data.rows.length === 0) {
        return null;
    }
    const account = data.rows[0];
    const ok = await bcrypt.compare(password, account.password);
    if (!ok) {
        return null;
    }
    const token = jwt.sign(
        { username: account.username, role: account.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );
    return {
        token,
        user: { username: account.username, role: account.role }
    };
}

async function createAccount(username, password, role) {
    const passwordHash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
    await client.query(
        'INSERT INTO auth (username, password, role) VALUES ($1, $2, $3)',
        [username, passwordHash, role]
    );
}

async function changePassword(username, password) {
    const passwordHash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
    await client.query(
        'UPDATE auth SET password = $1 WHERE username = $2',
        [passwordHash, username]
    );
}

async function getAllAccounts() {
    const data = await client.query('SELECT username, role FROM auth');
    return data.rows;
}

module.exports = { login, createAccount, changePassword, getAllAccounts };
