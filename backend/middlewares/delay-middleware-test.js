const delayMiddleware = (req, res, next) => {
    setTimeout(() => {
        next();
    }, 1000);
};

module.exports = delayMiddleware;