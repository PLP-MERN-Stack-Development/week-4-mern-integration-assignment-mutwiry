// Post.js - Mongoose model for blog posts

const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Author is required']
  },
  featuredImage: {
    type: String
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  tags: [{
    type: String,
    trim: true
  }],
  slug: {
    type: String,
    unique: true,
    sparse: true // This allows null/undefined values while maintaining uniqueness for non-null values
  },
  excerpt: {
    type: String,
    maxlength: [200, 'Excerpt cannot be more than 200 characters']
  },
  isPublished: {
    type: Boolean,
    default: true // Changed to true by default
  },
  viewCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create slug from title before saving
postSchema.pre('save', function(next) {
  try {
    if (!this.isModified('title')) {
      return next();
    }
    
    // Generate a basic slug
    let slug = this.title
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
    
    // Add timestamp to ensure uniqueness
    slug = `${slug}-${Date.now()}`;
    
    this.slug = slug;
    next();
  } catch (error) {
    next(error);
  }
});

// Virtual for post URL
postSchema.virtual('url').get(function() {
  return `/posts/${this.slug}`;
});

// Method to add a comment
postSchema.methods.addComment = async function(userId, content) {
  try {
    const Comment = mongoose.model('Comment');
    const comment = new Comment({
      content,
      author: userId,
      post: this._id
    });
    
    await comment.save();
    this.comments.push(comment._id);
    await this.save();
    
    return comment;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

// Method to increment view count
postSchema.methods.incrementViewCount = function() {
  this.viewCount += 1;
  return this.save();
};

module.exports = mongoose.model('Post', postSchema); 