const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Mock database before requiring app
jest.mock('../../src/config/database', () => ({
    query: jest.fn(),
    on: jest.fn()
}));

const pool = require('../../src/config/database');
const request = require('supertest');
const app = require('../../src/app');

const SECRET = process.env.JWT_SECRET;

function adminToken() {
    return jwt.sign({ username: 'admin', role: 'admin' }, SECRET, { expiresIn: '1h' });
}

function userToken(username = 'user1', role = 'manufacturer') {
    return jwt.sign({ username, role }, SECRET, { expiresIn: '1h' });
}

afterEach(() => {
    jest.clearAllMocks();
});

describe('POST /auth/login', () => {
    it('returns 200 with token on valid credentials', async () => {
        const hash = await bcrypt.hash('password123', 4);
        pool.query.mockResolvedValue({
            rows: [{ username: 'admin', password: hash, role: 'admin' }]
        });

        const res = await request(app)
            .post('/auth/login')
            .send({ username: 'admin', password: 'password123' });

        expect(res.status).toBe(200);
        expect(res.body.token).toBeDefined();
        expect(res.body.user.username).toBe('admin');
        expect(res.body.user.role).toBe('admin');
    });

    it('returns 401 on wrong password', async () => {
        const hash = await bcrypt.hash('correctpass', 4);
        pool.query.mockResolvedValue({
            rows: [{ username: 'admin', password: hash, role: 'admin' }]
        });

        const res = await request(app)
            .post('/auth/login')
            .send({ username: 'admin', password: 'wrongpass' });

        expect(res.status).toBe(401);
        expect(res.body.error).toMatch(/Invalid/i);
    });

    it('returns 401 on nonexistent user', async () => {
        pool.query.mockResolvedValue({ rows: [] });

        const res = await request(app)
            .post('/auth/login')
            .send({ username: 'ghost', password: 'pass' });

        expect(res.status).toBe(401);
    });

    it('returns 400 on missing fields', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({});

        expect(res.status).toBe(400);
        expect(res.body.error).toContain('"username" is required');
    });

    it('returns 400 on missing password', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({ username: 'admin' });

        expect(res.status).toBe(400);
        expect(res.body.error).toContain('"password" is required');
    });
});

describe('GET /authAll', () => {
    it('returns 200 with accounts for admin', async () => {
        const mockRows = [{ username: 'admin', role: 'admin' }];
        pool.query.mockResolvedValue({ rows: mockRows });

        const res = await request(app)
            .get('/authAll')
            .set('Authorization', `Bearer ${adminToken()}`);

        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockRows);
    });

    it('returns 401 without token', async () => {
        const res = await request(app).get('/authAll');
        expect(res.status).toBe(401);
    });

    it('returns 403 for non-admin user', async () => {
        const res = await request(app)
            .get('/authAll')
            .set('Authorization', `Bearer ${userToken()}`);

        expect(res.status).toBe(403);
    });
});

describe('POST /addaccount', () => {
    it('returns 201 for admin with valid data', async () => {
        pool.query.mockResolvedValue({});

        const res = await request(app)
            .post('/addaccount')
            .set('Authorization', `Bearer ${adminToken()}`)
            .send({ username: 'newuser', password: 'pass123', role: 'supplier' });

        expect(res.status).toBe(201);
        expect(res.body.message).toMatch(/Account created/i);
    });

    it('returns 400 on missing role', async () => {
        const res = await request(app)
            .post('/addaccount')
            .set('Authorization', `Bearer ${adminToken()}`)
            .send({ username: 'newuser', password: 'pass' });

        expect(res.status).toBe(400);
        expect(res.body.error).toContain('"role" is required');
    });

    it('returns 401 without token', async () => {
        const res = await request(app)
            .post('/addaccount')
            .send({ username: 'x', password: 'y', role: 'z' });

        expect(res.status).toBe(401);
    });

    it('returns 403 for non-admin', async () => {
        const res = await request(app)
            .post('/addaccount')
            .set('Authorization', `Bearer ${userToken()}`)
            .send({ username: 'x', password: 'y', role: 'z' });

        expect(res.status).toBe(403);
    });
});

describe('POST /changepsw', () => {
    it('allows user to change own password', async () => {
        pool.query.mockResolvedValue({});

        const res = await request(app)
            .post('/changepsw')
            .set('Authorization', `Bearer ${userToken('user1', 'manufacturer')}`)
            .send({ username: 'user1', password: 'newpass' });

        expect(res.status).toBe(200);
        expect(res.body.message).toMatch(/Password updated/i);
    });

    it('returns 403 when non-admin tries to change another user password', async () => {
        const res = await request(app)
            .post('/changepsw')
            .set('Authorization', `Bearer ${userToken('user1', 'manufacturer')}`)
            .send({ username: 'otheruser', password: 'newpass' });

        expect(res.status).toBe(403);
    });

    it('allows admin to change any user password', async () => {
        pool.query.mockResolvedValue({});

        const res = await request(app)
            .post('/changepsw')
            .set('Authorization', `Bearer ${adminToken()}`)
            .send({ username: 'otheruser', password: 'newpass' });

        expect(res.status).toBe(200);
    });
});
