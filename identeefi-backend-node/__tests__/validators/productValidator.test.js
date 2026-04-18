const { addProductSchema } = require('../../src/validators/productValidator');

describe('addProductSchema', () => {
    it('accepts valid product', () => {
        const { error } = addProductSchema.validate({
            serialNumber: 'SN-001',
            name: 'Classic Handbag',
            brand: 'Chanel'
        });
        expect(error).toBeUndefined();
    });

    it('rejects missing serialNumber', () => {
        const { error } = addProductSchema.validate({ name: 'Bag', brand: 'Chanel' });
        expect(error).toBeDefined();
        expect(error.details[0].path).toContain('serialNumber');
    });

    it('rejects missing name', () => {
        const { error } = addProductSchema.validate({ serialNumber: 'SN-001', brand: 'Chanel' });
        expect(error).toBeDefined();
        expect(error.details[0].path).toContain('name');
    });

    it('rejects missing brand', () => {
        const { error } = addProductSchema.validate({ serialNumber: 'SN-001', name: 'Bag' });
        expect(error).toBeDefined();
        expect(error.details[0].path).toContain('brand');
    });

    it('rejects empty body', () => {
        const { error } = addProductSchema.validate({});
        expect(error).toBeDefined();
        expect(error.details.length).toBe(3);
    });

    it('strips unknown fields', () => {
        const { value } = addProductSchema.validate(
            { serialNumber: 'SN-001', name: 'Bag', brand: 'Chanel', extra: 'junk' },
            { stripUnknown: true }
        );
        expect(value.extra).toBeUndefined();
        expect(value.serialNumber).toBe('SN-001');
    });
});
