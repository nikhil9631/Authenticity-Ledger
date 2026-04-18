const jwt = require('jsonwebtoken');

jest.mock('../../src/config/database', () => ({
    query: jest.fn(),
    on: jest.fn()
}));

const pool = require('../../src/config/database');
const request = require('supertest');
const app = require('../../src/app');

const SECRET = process.env.JWT_SECRET;

function manufacturerToken() {
    return jwt.sign({ username: 'mfr1', role: 'manufacturer' }, SECRET, { expiresIn: '1h' });
}

function adminToken() {
    return jwt.sign({ username: 'admin', role: 'admin' }, SECRET, { expiresIn: '1h' });
}

function retailerToken() {
    return jwt.sign({ username: 'ret1', role: 'retailer' }, SECRET, { expiresIn: '1h' });
}

afterEach(() => {
    jest.clearAllMocks();
});

describe('GET /product/serialNumber', () => {
    it('returns 200 with serial numbers (public endpoint)', async () => {
        const mockRows = [{ serialnumber: 'SN-001' }, { serialnumber: 'SN-002' }];
        pool.query.mockResolvedValue({ rows: mockRows });

        const res = await request(app).get('/product/serialNumber');
        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockRows);
    });

    it('returns 500 on database error', async () => {
        pool.query.mockRejectedValue(new Error('DB down'));

        const res = await request(app).get('/product/serialNumber');
        expect(res.status).toBe(500);
        expect(res.body.error).toMatch(/Failed/i);
    });
});

describe('POST /addproduct', () => {
    it('returns 201 for manufacturer with valid data', async () => {
        pool.query.mockResolvedValue({});

        const res = await request(app)
            .post('/addproduct')
            .set('Authorization', `Bearer ${manufacturerToken()}`)
            .send({ serialNumber: 'SN-999', name: 'Test Bag', brand: 'Chanel' });

        expect(res.status).toBe(201);
        expect(res.body.message).toMatch(/Product added/i);
    });

    it('returns 201 for admin with valid data', async () => {
        pool.query.mockResolvedValue({});

        const res = await request(app)
            .post('/addproduct')
            .set('Authorization', `Bearer ${adminToken()}`)
            .send({ serialNumber: 'SN-998', name: 'Another Bag', brand: 'Chanel' });

        expect(res.status).toBe(201);
    });

    it('returns 403 for retailer', async () => {
        const res = await request(app)
            .post('/addproduct')
            .set('Authorization', `Bearer ${retailerToken()}`)
            .send({ serialNumber: 'SN-997', name: 'Bag', brand: 'Chanel' });

        expect(res.status).toBe(403);
    });

    it('returns 400 on missing serialNumber', async () => {
        const res = await request(app)
            .post('/addproduct')
            .set('Authorization', `Bearer ${manufacturerToken()}`)
            .send({ name: 'Bag', brand: 'Chanel' });

        expect(res.status).toBe(400);
        expect(res.body.error).toContain('"serialNumber" is required');
    });

    it('returns 401 without auth token', async () => {
        const res = await request(app)
            .post('/addproduct')
            .send({ serialNumber: 'SN-996', name: 'Bag', brand: 'Chanel' });

        expect(res.status).toBe(401);
    });
});
