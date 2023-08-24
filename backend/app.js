const express = require('express');
const mongoose = require('mongoose');

const userRoutes = require('./routes/user-routes');
const scribbleRoutes = require('./routes/scribble-routes');
const delayMiddleware = require('./middlewares/delay-middleware-test')

const app = express();
const PORT = 8000;
const DB_NAME = "code-scribble";
const LOCAL_MONGODB_URI = "mongodb://127.0.0.1:27017/";

// middleware to accept request from any origin , change * to URL of frontend
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE , PUT');

    next();
})

// parse incoming request body
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

async function main() {
    await mongoose.connect(LOCAL_MONGODB_URI + DB_NAME);
}

// call main function to connnect to mongodb
main().catch(err => console.log(err));

// middleware to purposefully delay response for testing purposes
// app.use(delayMiddleware);

app.use('/api/users',userRoutes);
app.use('/api/scribbles',scribbleRoutes);


// error handling middleware
app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    console.log(err);

    res.status(err.code || 500)
        .json({ message: err.message || 'An unknow error occured' });
})

app.listen(PORT, () => console.log("Server running on PORT : ", PORT));