const Joi = require('joi');

const addProductSchema = Joi.object({
    serialNumber: Joi.string().required(),
    name: Joi.string().required(),
    brand: Joi.string().required()
});

module.exports = { addProductSchema };
