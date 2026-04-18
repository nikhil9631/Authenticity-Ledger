const jwt = require('jsonwebtoken');

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

describe('GET /profileAll', () => {
    it('returns 200 with profiles for admin', async () => {
        const mockRows = [
            { username: 'user1', name: 'User One', role: 'manufacturer' }
        ];
        pool.query.mockResolvedValue({ rows: mockRows });

        const res = await request(app)
            .get('/profileAll')
            .set('Authorization', `Bearer ${adminToken()}`);

        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockRows);
    });

    it('returns 401 without token', async () => {
        const res = await request(app).get('/profileAll');
        expect(res.status).toBe(401);
    });

    it('returns 403 for non-admin', async () => {
        const res = await request(app)
            .get('/profileAll')
            .set('Authorization', `Bearer ${userToken()}`);

        expect(res.status).toBe(403);
    });
});

describe('GET /profile/:username', () => {
    it('returns 200 with profile data for authenticated user', async () => {
        const mockRows = [{ username: 'user1', name: 'User One', role: 'manufacturer' }];
        pool.query.mockResolvedValue({ rows: mockRows });

        const res = await request(app)
            .get('/profile/user1')
            .set('Authorization', `Bearer ${userToken()}`);

        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockRows);
        expect(pool.query).toHaveBeenCalledWith(
            expect.stringContaining('WHERE username = $1'),
            ['user1']
        );
    });

    it('returns 401 without token', async () => {
        const res = await request(app).get('/profile/user1');
        expect(res.status).toBe(401);
    });

    it('returns empty array when user not found', async () => {
        pool.query.mockResolvedValue({ rows: [] });

        const res = await request(app)
            .get('/profile/nonexistent')
            .set('Authorization', `Bearer ${userToken()}`);

        expect(res.status).toBe(200);
        expect(res.body).toEqual([]);
    });
});

describe('POST /addprofile', () => {
    it('returns 201 for admin with valid data', async () => {
        pool.query.mockResolvedValue({});

        const res = await request(app)
            .post('/addprofile')
            .set('Authorization', `Bearer ${adminToken()}`)
            .send({
                username: 'newuser',
                name: 'New User',
                description: 'desc',
                website: 'https://example.com',
                location: 'NYC',
                image: 'photo.jpg',
                role: 'supplier'
            });

        expect(res.status).toBe(201);
        expect(res.body.message).toMatch(/Profile created/i);
    });

    it('returns 201 with only required fields', async () => {
        pool.query.mockResolvedValue({});

        const res = await request(app)
            .post('/addprofile')
            .set('Authorization', `Bearer ${adminToken()}`)
            .send({ username: 'u', role: 'retailer' });

        expect(res.status).toBe(201);
    });

    it('returns 400 when missing required field role', async () => {
        const res = await request(app)
            .post('/addprofile')
            .set('Authorization', `Bearer ${adminToken()}`)
            .send({ username: 'u' });

        expect(res.status).toBe(400);
        expect(res.body.error).toContain('"role" is required');
    });

    it('returns 403 for non-admin', async () => {
        const res = await request(app)
            .post('/addprofile')
            .set('Authorization', `Bearer ${userToken()}`)
            .send({ username: 'u', role: 'r' });

        expect(res.status).toBe(403);
    });
});
