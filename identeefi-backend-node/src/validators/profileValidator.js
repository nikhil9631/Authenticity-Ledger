const Joi = require('joi');

const addProfileSchema = Joi.object({
    username: Joi.string().required(),
    name: Joi.string().allow('', null).optional(),
    description: Joi.string().allow('', null).optional(),
    website: Joi.string().allow('', null).optional(),
    location: Joi.string().allow('', null).optional(),
    image: Joi.string().allow('', null).optional(),
    role: Joi.string().required()
});

module.exports = { addProfileSchema };
