import mongoose from 'mongoose';

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
    slug: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    excerpt: {
        type: String,
        maxlength: [200, 'Excerpt cannot be more than 200 characters'],
    },
    featuredImage: {
        type: String,
        default: 'default-post.jpg',
    },
    // Changed from 'author' to 'user' to match our auth system
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Please add at least one category'],
        validate: {
            validator: function(v) {
                return v && v.length > 0;
            },
            message: 'Please add at least one category'
        }
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
    meta: {
        views: {
            type: Number,
            default: 0
        },
        likes: {
            type: Number,
            default: 0
        },
        comments: {
            type: Number,
            default: 0
        }
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    publishedAt: {
        type: Date
    },
    lastEditedAt: {
        type: Date
    }
}, {
    timestamps: true,
    toJSON: { 
        virtuals: true,
        transform: function(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    },
    toObject: { 
        virtuals: true,
        transform: function(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    }
});

// Set publishedAt when status changes to 'published'
postSchema.pre('save', function(next) {
    if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
        this.publishedAt = new Date();
    }
    
    // Update lastEditedAt on any change
    if (this.isModified()) {
        this.lastEditedAt = new Date();
    }
    
    next();
});

// Virtual for post's URL
postSchema.virtual('url').get(function() {
    return `/posts/${this.slug}`;
});

// Virtual for comments (if you have a Comment model)
// postSchema.virtual('comments', {
//     ref: 'Comment',
//     localField: '_id',
//     foreignField: 'post',
//     justOne: false
// });

// Cascade delete comments when a post is deleted
// postSchema.pre('remove', async function(next) {
//     await this.model('Comment').deleteMany({ post: this._id });
//     next();
// });

// Indexes for better query performance
postSchema.index({ title: 'text', content: 'text' });
postSchema.index({ user: 1, status: 1 });
postSchema.index({ status: 1, publishedAt: -1 });

// Create and export the model
const Post = mongoose.model('Post', postSchema);
export default Post;
