const { loginSchema, addAccountSchema, changePasswordSchema } = require('../../src/validators/authValidator');

describe('loginSchema', () => {
    it('accepts valid username and password', () => {
        const { error } = loginSchema.validate({ username: 'admin', password: 'secret123' });
        expect(error).toBeUndefined();
    });

    it('rejects missing username', () => {
        const { error } = loginSchema.validate({ password: 'secret123' });
        expect(error).toBeDefined();
        expect(error.details[0].path).toContain('username');
    });

    it('rejects missing password', () => {
        const { error } = loginSchema.validate({ username: 'admin' });
        expect(error).toBeDefined();
        expect(error.details[0].path).toContain('password');
    });

    it('rejects empty body', () => {
        const { error } = loginSchema.validate({});
        expect(error).toBeDefined();
        expect(error.details.length).toBe(2);
    });

    it('strips unknown fields', () => {
        const { value } = loginSchema.validate(
            { username: 'admin', password: 'secret', extra: 'field' },
            { stripUnknown: true }
        );
        expect(value.extra).toBeUndefined();
    });
});

describe('addAccountSchema', () => {
    it('accepts valid username, password and role', () => {
        const { error } = addAccountSchema.validate({ username: 'user1', password: 'pass', role: 'manufacturer' });
        expect(error).toBeUndefined();
    });

    it('rejects missing role', () => {
        const { error } = addAccountSchema.validate({ username: 'user1', password: 'pass' });
        expect(error).toBeDefined();
        expect(error.details[0].path).toContain('role');
    });

    it('rejects completely empty body', () => {
        const { error } = addAccountSchema.validate({});
        expect(error).toBeDefined();
        expect(error.details.length).toBe(3);
    });
});

describe('changePasswordSchema', () => {
    it('accepts valid username and password', () => {
        const { error } = changePasswordSchema.validate({ username: 'admin', password: 'newpass' });
        expect(error).toBeUndefined();
    });

    it('rejects missing password', () => {
        const { error } = changePasswordSchema.validate({ username: 'admin' });
        expect(error).toBeDefined();
    });

    it('rejects non-string values', () => {
        const { error } = changePasswordSchema.validate({ username: 123, password: 'pass' });
        expect(error).toBeDefined();
    });
});
