const mongoose = require('mongoose');

const reactionSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['like', 'love', 'haha', 'wow', 'sad', 'angry'],
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    target: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'onModel'
    },
    onModel: {
        type: String,
        required: true,
        enum: ['Post', 'Comment', 'Reply']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

reactionSchema.index({ target: 1, onModel: 1 });

module.exports = mongoose.model('Reaction', reactionSchema);
