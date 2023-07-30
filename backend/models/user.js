const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },

    createdAt: {
        type: 'Date',
        default: Date.now,
        immutable: true
    },
});

module.exports = mongoose.model('User', userSchema);