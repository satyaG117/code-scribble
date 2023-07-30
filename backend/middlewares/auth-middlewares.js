const jwt = require('jsonwebtoken')

const HttpError = require('../utils/HttpError');

const SECRET_KEY = 's12kez90Yo0qpo33#77@Zzx[0_0]{zxaZ';

module.exports.isLoggedIn = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        next();
    }

    try {
        const token = req.headers.authorization.split(' ')[1]; // authorization : 'Bearer <token>'
        console.log(token);
        if (!token) {
            throw new Error('No session detected');
        }

        const payload = jwt.verify(token, SECRET_KEY);
        console.log(payload);
        
        // extract data to be used later
        req.userData = { userId: payload.userId, userEmail: payload.email };
        return next();
    } catch (err) {
        console.log("LOGIN CHECK : ",err);
        return next(new HttpError(401, 'Token verification failed'))
    }
}