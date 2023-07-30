const Joi = require('joi');

const {checkEmptyString} = require('../utils/custom-validations')

const loginSchema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().custom(checkEmptyString).min(6),
});

const signupSchema = loginSchema.keys({
    name: Joi.string().required().custom(checkEmptyString)
});

module.exports = {loginSchema , signupSchema}