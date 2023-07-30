const mongoose = require('mongoose');
const { Schema } = mongoose;

const scribbleSchema = new Schema({
    title: {
        type: String,
        required: true,
        minlength: 3
    },
    description: {
        type: String,
        required: true
    },
    html: {
        type: String
    },
    css: {
        type: String
    },
    js: {
        type: String
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    forkedFrom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Scribble'
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true,
        immutable: true // doesn't change after creation
    },
    lastEditedAt: {
        type: Date,
        require: true,
        default: Date.now
    }
})

scribbleSchema.pre('save', function(next){
    this.lastEditedAt = new Date();
    next();
})

module.exports = mongoose.model('Scribble', scribbleSchema);