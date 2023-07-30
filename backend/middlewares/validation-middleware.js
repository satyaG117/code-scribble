const HttpError = require('../utils/HttpError');

module.exports.validateInputs = (schema) => {
    return (req, res, next) => {
        try {
            const { error } = schema.validate(req.body);
            if (error) {
                console.log(error)
                throw new Error('Invalid input');
            } else {
                //if no errors found then proceed
                next();
            }
        } catch (err) {
            return next(new HttpError(400, "Invalid input"));
        }
    }
}