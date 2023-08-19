const mongoose = require('mongoose');
const { Schema } = mongoose;

const starSchema = new Schema({
    scribble:{
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'Scribble'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true,
        immutable: true // doesn't change after creation
    }
})

module.exports = mongoose.model('Star', starSchema);