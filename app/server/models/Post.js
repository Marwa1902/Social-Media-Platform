// models/Post.js
const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    desc: {
        type: String,
        max: 500
    },
    attachments: [{ type: String }], // Array of attachment URLs or file paths
    likes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        default: []
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }]
}, { timestamps: true });

module.exports = mongoose.model("Post", PostSchema);
