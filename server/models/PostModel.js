const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    content: {
        type: String,
        required: [true, 'Please add content'],
    },
    featuredImage: {
        type: String,
        default: null,
        validate: {
            validator: (v) => {
                return /^https?:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}(\/[a-zA-Z0-9.-]+)*$/.test(v);
            },
            message: (props) => `${props.value} is not a valid image URL!`
        }
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
        default: null
    },
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    }],
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'draft',
    },
    tags: [{
        type: String,
        trim: true,
    }],
    viewCount: {
        type: Number,
        default: 0,
    },
    commentCount: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for post's URL
postSchema.virtual('url').get(function() {
    return `/posts/${this.slug}`;
});

// Create slug from the title before saving
postSchema.pre('save', function (next) {
    if (this.isModified('title')) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
    next();
});

// Cascade delete comments when a post is deleted
postSchema.pre('remove', async function (next) {
    await this.model('Comment').deleteMany({ post: this._id });
    next();
});

// Reverse populate with virtuals
postSchema.virtual('comments', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'post',
    justOne: false,
});

// Indexes
postSchema.index({ title: 'text', content: 'text' });

// Create and export the model
const Post = mongoose.model('Post', postSchema);
module.exports = Post;
