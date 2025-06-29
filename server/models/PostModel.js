const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    content: {
        type: String,
        required: true,
    },
    featuredImage: {
        type: String,
        default: 'default-post.jpg',
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    excerpt: {
        type: String,
        maxlength: [200, 'Excerpt cannot be more than 200 characters'],
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    tags: [String],
    isPublished: {
        type: Boolean,
        default: false,
    },
    viewCount: {
        type: Number,
        default: 0,
    },
    comments: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
            content: {
                type: String,
                required: true,
            },
            createdAt: {
                type: Date,
                default: Date.now,
            },
        },
    ],
}, {
    timestamps: true
});

module.exports = mongoose.model('Post', postSchema);
