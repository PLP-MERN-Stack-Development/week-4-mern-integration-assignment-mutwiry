const Post = require('../models/PostModel');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Fetch all posts
// @route   GET /api/posts
// @access  Public
exports.getPosts = asyncHandler(async (req, res) => {
    const posts = await Post.find({}).populate('categories', 'name');
    res.status(200).json({success:true, count:posts.length, data:posts });
});

// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Public
exports.getPostById = asyncHandler(async (req, res, next) => {
    const post = await Post.findById(req.params.id).populate('categories', 'name');
    if (!post) {
      res.status(404);
      throw new Error('Post not found');
    }
    res.status(200).json({ success: true, data: post });
});

// @desc    Create new post
// @route   POST /api/posts
// @access  Private (for now, public)
exports.createPost = asyncHandler(async (req, res, next) => {
    const { title, content, categories } = req.body;
    
    // Basic validation
    if (!title || !content || !categories || !Array.isArray(categories) || categories.length === 0) {
      res.status(400);
      throw new Error('Please provide title, content, and at least one category');
    }
    
    const post = await Post.create({ 
        title, 
        content, 
        categories,
        // We're not setting author for now since we don't have authentication
        // It will be set to null as per our model
        slug: title.toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, '')
    });
    
    res.status(201).json({ success: true, data: post });
});

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Private
exports.updatePost = asyncHandler(async (req, res, next) => {
    let post = await Post.findById(req.params.id);
    if (!post) {
      res.status(404);
      throw new Error('Post not found');
    }
    
    // If updating categories, ensure it's an array with at least one category
    if (req.body.categories && (!Array.isArray(req.body.categories) || req.body.categories.length === 0)) {
      res.status(400);
      throw new Error('Categories must be a non-empty array');
    }
    
    post = await Post.findByIdAndUpdate(
      req.params.id, 
      { $set: req.body },
      {
        new: true,
        runValidators: true
      }
    ).populate('categories', 'name');
    
    res.status(200).json({ success: true, data: post });
});

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private
exports.deletePost = asyncHandler(async (req, res, next) => {
    const post = await Post.findById(req.params.id);
    if (!post) {
      res.status(404);
      throw new Error('Post not found');
    }
    
    await post.remove();
    res.status(200).json({ success: true, data: {} });
});