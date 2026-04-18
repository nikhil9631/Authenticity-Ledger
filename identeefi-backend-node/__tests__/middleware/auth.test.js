const jwt = require('jsonwebtoken');
const { requireAuth, requireRole } = require('../../src/middleware/auth');

const SECRET = process.env.JWT_SECRET;

function mockExpress(authHeader) {
    const req = { headers: {} };
    if (authHeader !== undefined) {
        req.headers.authorization = authHeader;
    }
    const res = {
        statusCode: null,
        body: null,
        status(code) { this.statusCode = code; return this; },
        json(data) { this.body = data; return this; }
    };
    const next = jest.fn();
    return { req, res, next };
}

describe('requireAuth', () => {
    it('calls next and sets req.user for a valid token', () => {
        const token = jwt.sign({ username: 'admin', role: 'admin' }, SECRET, { expiresIn: '1h' });
        const { req, res, next } = mockExpress(`Bearer ${token}`);
        requireAuth(req, res, next);
        expect(next).toHaveBeenCalled();
        expect(req.user.username).toBe('admin');
        expect(req.user.role).toBe('admin');
    });

    it('returns 401 when no Authorization header is present', () => {
        const { req, res, next } = mockExpress(undefined);
        requireAuth(req, res, next);
        expect(next).not.toHaveBeenCalled();
        expect(res.statusCode).toBe(401);
        expect(res.body.error).toMatch(/Missing/i);
    });

    it('returns 401 for a malformed header (no Bearer prefix)', () => {
        const { req, res, next } = mockExpress('Token abc123');
        requireAuth(req, res, next);
        expect(next).not.toHaveBeenCalled();
        expect(res.statusCode).toBe(401);
    });

    it('returns 401 for an expired token', () => {
        const token = jwt.sign({ username: 'admin', role: 'admin' }, SECRET, { expiresIn: '0s' });
        const { req, res, next } = mockExpress(`Bearer ${token}`);
        // Small delay to ensure token is expired
        requireAuth(req, res, next);
        expect(next).not.toHaveBeenCalled();
        expect(res.statusCode).toBe(401);
        expect(res.body.error).toMatch(/Invalid or expired/i);
    });

    it('returns 401 for a token signed with wrong secret', () => {
        const token = jwt.sign({ username: 'admin' }, 'wrong-secret');
        const { req, res, next } = mockExpress(`Bearer ${token}`);
        requireAuth(req, res, next);
        expect(next).not.toHaveBeenCalled();
        expect(res.statusCode).toBe(401);
    });
});

describe('requireRole', () => {
    it('calls next when user role matches', () => {
        const { req, res, next } = mockExpress();
        req.user = { username: 'admin', role: 'admin' };
        requireRole('admin')(req, res, next);
        expect(next).toHaveBeenCalled();
    });

    it('calls next when user role matches one of multiple allowed roles', () => {
        const { req, res, next } = mockExpress();
        req.user = { username: 'mfr', role: 'manufacturer' };
        requireRole('manufacturer', 'admin')(req, res, next);
        expect(next).toHaveBeenCalled();
    });

    it('returns 403 when user role does not match', () => {
        const { req, res, next } = mockExpress();
        req.user = { username: 'user', role: 'retailer' };
        requireRole('admin')(req, res, next);
        expect(next).not.toHaveBeenCalled();
        expect(res.statusCode).toBe(403);
        expect(res.body.error).toBe('Forbidden');
    });

    it('returns 403 when req.user is missing', () => {
        const { req, res, next } = mockExpress();
        requireRole('admin')(req, res, next);
        expect(next).not.toHaveBeenCalled();
        expect(res.statusCode).toBe(403);
    });
});
