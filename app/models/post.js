var mongoose = require('mongoose');

var postSchema = mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    postedDate: {
        type: Date,
        default: Date.now
    },
    hidden: {
        type: Boolean,
        default: false 
    }
});

module.exports = mongoose.model('Post', postSchema);