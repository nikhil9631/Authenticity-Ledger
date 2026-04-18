function validate(schema, source = 'body') {
    return (req, res, next) => {
        const { error, value } = schema.validate(req[source], {
            abortEarly: false,
            stripUnknown: true
        });
        if (error) {
            const details = error.details.map(d => d.message);
            return res.status(400).json({ error: details.join('; ') });
        }
        req[source] = value;
        return next();
    };
}

module.exports = validate;
