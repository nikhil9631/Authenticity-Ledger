const Joi = require('joi');
const validate = require('../../src/middleware/validate');

// Helper to create mock req/res/next
function mockExpress(body = {}, source = 'body') {
    const req = { [source]: body };
    const res = {
        statusCode: null,
        body: null,
        status(code) { this.statusCode = code; return this; },
        json(data) { this.body = data; return this; }
    };
    const next = jest.fn();
    return { req, res, next };
}

const testSchema = Joi.object({
    name: Joi.string().required(),
    age: Joi.number().integer().optional()
});

describe('validate middleware', () => {
    it('calls next() when body is valid', () => {
        const { req, res, next } = mockExpress({ name: 'Alice', age: 30 });
        validate(testSchema)(req, res, next);
        expect(next).toHaveBeenCalled();
    });

    it('replaces req.body with validated (stripped) value', () => {
        const { req, res, next } = mockExpress({ name: 'Alice', extra: 'junk' });
        validate(testSchema)(req, res, next);
        expect(req.body.name).toBe('Alice');
        expect(req.body.extra).toBeUndefined();
    });

    it('returns 400 with error details on invalid body', () => {
        const { req, res, next } = mockExpress({});
        validate(testSchema)(req, res, next);
        expect(next).not.toHaveBeenCalled();
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toContain('"name" is required');
    });

    it('reports all errors at once (abortEarly: false)', () => {
        const schema = Joi.object({
            a: Joi.string().required(),
            b: Joi.string().required()
        });
        const { req, res, next } = mockExpress({});
        validate(schema)(req, res, next);
        expect(res.body.error).toContain('"a" is required');
        expect(res.body.error).toContain('"b" is required');
    });

    it('works with params source', () => {
        const paramSchema = Joi.object({ id: Joi.string().required() });
        const req = { params: { id: '123' } };
        const res = { status() { return this; }, json() { return this; } };
        const next = jest.fn();
        validate(paramSchema, 'params')(req, res, next);
        expect(next).toHaveBeenCalled();
        expect(req.params.id).toBe('123');
    });
});
