const Joi = require('joi');

const {checkEmptyString} = require('../utils/custom-validations')
// used when scribble is created initially or edited
const scribbleSchema = Joi.object({
    title : Joi.string().required().custom(checkEmptyString).min(3),
    description : Joi.string().required(),
})

// when you need to update code
const codeSchema = Joi.object().keys({
    key : Joi.string().valid("html","css","js").required(),
    body : Joi.string().required()
})

module.exports = {scribbleSchema , codeSchema}