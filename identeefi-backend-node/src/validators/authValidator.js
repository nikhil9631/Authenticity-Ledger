const Joi = require('joi');

const loginSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
});

const addAccountSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
    role: Joi.string().required()
});

const changePasswordSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
});

module.exports = { loginSchema, addAccountSchema, changePasswordSchema };
