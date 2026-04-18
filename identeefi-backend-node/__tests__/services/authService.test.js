const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Mock the database module before requiring the service
jest.mock('../../src/config/database', () => ({
    query: jest.fn(),
    on: jest.fn()
}));

const pool = require('../../src/config/database');
const authService = require('../../src/services/authService');

const SECRET = process.env.JWT_SECRET;

afterEach(() => {
    jest.clearAllMocks();
});

describe('authService.login', () => {
    it('returns token and user on valid credentials', async () => {
        const hash = await bcrypt.hash('password123', 4);
        pool.query.mockResolvedValue({
            rows: [{ username: 'admin', password: hash, role: 'admin' }]
        });

        const result = await authService.login('admin', 'password123');
        expect(result).not.toBeNull();
        expect(result.token).toBeDefined();
        expect(result.user.username).toBe('admin');
        expect(result.user.role).toBe('admin');

        // Verify the token is valid
        const decoded = jwt.verify(result.token, SECRET);
        expect(decoded.username).toBe('admin');
    });

    it('returns null when user does not exist', async () => {
        pool.query.mockResolvedValue({ rows: [] });
        const result = await authService.login('nonexistent', 'pass');
        expect(result).toBeNull();
    });

    it('returns null when password is wrong', async () => {
        const hash = await bcrypt.hash('correctpassword', 4);
        pool.query.mockResolvedValue({
            rows: [{ username: 'admin', password: hash, role: 'admin' }]
        });
        const result = await authService.login('admin', 'wrongpassword');
        expect(result).toBeNull();
    });

    it('queries with parameterized username', async () => {
        pool.query.mockResolvedValue({ rows: [] });
        await authService.login('testuser', 'pass');
        expect(pool.query).toHaveBeenCalledWith(
            expect.stringContaining('WHERE username = $1'),
            ['testuser']
        );
    });
});

describe('authService.createAccount', () => {
    it('inserts a hashed password (not plaintext)', async () => {
        pool.query.mockResolvedValue({});
        await authService.createAccount('newuser', 'mypassword', 'manufacturer');

        expect(pool.query).toHaveBeenCalledTimes(1);
        const [sql, params] = pool.query.mock.calls[0];
        expect(sql).toContain('INSERT INTO auth');
        expect(params[0]).toBe('newuser');
        // The stored password should be a bcrypt hash, not the plaintext
        expect(params[1]).not.toBe('mypassword');
        expect(params[1]).toMatch(/^\$2[aby]?\$/);
        expect(params[2]).toBe('manufacturer');
    });
});

describe('authService.changePassword', () => {
    it('updates with a hashed password', async () => {
        pool.query.mockResolvedValue({});
        await authService.changePassword('admin', 'newpass');

        const [sql, params] = pool.query.mock.calls[0];
        expect(sql).toContain('UPDATE auth SET password');
        expect(params[0]).not.toBe('newpass');
        expect(params[0]).toMatch(/^\$2[aby]?\$/);
        expect(params[1]).toBe('admin');
    });
});

describe('authService.getAllAccounts', () => {
    it('returns rows from query', async () => {
        const mockRows = [
            { username: 'admin', role: 'admin' },
            { username: 'user1', role: 'manufacturer' }
        ];
        pool.query.mockResolvedValue({ rows: mockRows });

        const rows = await authService.getAllAccounts();
        expect(rows).toEqual(mockRows);
        expect(pool.query).toHaveBeenCalledWith('SELECT username, role FROM auth');
    });
});
