const { addProfileSchema } = require('../../src/validators/profileValidator');

describe('addProfileSchema', () => {
    it('accepts valid profile with all fields', () => {
        const { error } = addProfileSchema.validate({
            username: 'user1',
            name: 'Test User',
            description: 'A description',
            website: 'https://example.com',
            location: 'NYC',
            image: 'photo.jpg',
            role: 'manufacturer'
        });
        expect(error).toBeUndefined();
    });

    it('accepts profile with only required fields', () => {
        const { error } = addProfileSchema.validate({ username: 'user1', role: 'supplier' });
        expect(error).toBeUndefined();
    });

    it('allows empty strings for optional fields', () => {
        const { error } = addProfileSchema.validate({
            username: 'user1',
            name: '',
            description: '',
            website: '',
            location: '',
            image: '',
            role: 'retailer'
        });
        expect(error).toBeUndefined();
    });

    it('allows null for optional fields', () => {
        const { error } = addProfileSchema.validate({
            username: 'user1',
            name: null,
            role: 'admin'
        });
        expect(error).toBeUndefined();
    });

    it('rejects missing username', () => {
        const { error } = addProfileSchema.validate({ role: 'admin' });
        expect(error).toBeDefined();
        expect(error.details[0].path).toContain('username');
    });

    it('rejects missing role', () => {
        const { error } = addProfileSchema.validate({ username: 'user1' });
        expect(error).toBeDefined();
        expect(error.details[0].path).toContain('role');
    });
});
