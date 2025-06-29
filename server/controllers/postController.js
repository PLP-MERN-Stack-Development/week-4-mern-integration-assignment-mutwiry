const Post = require('../models/PostModel');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Fetch all posts
// @route   GET /api/posts
// @access  Public
exports.getPosts = asyncHandler(async (req, res) => {
    const posts = await Post.find({}).populate('category', 'name');
    res.status(200).json({success:true, count:posts.length, data:posts });
});

// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Public
exports.getPostById = asyncHandler(async (req, res, next) => {
    const post = await Post.findById(req.params.id).populate('category', 'name');
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
    const { title, content, category } = req.body;
    // Basic validation
    if (!title || !content || !category) {
      res.status(400);
      throw new Error('Please provide title, content, and category');
    }
    const post = await Post.create({ title, content, category });
    res.status(201).json({ success: true, data: post });
  });
  
  // @desc    Update a post
  // @route   PUT /api/posts/:id
  // @access  Private (for now, public)
  exports.updatePost = asyncHandler(async (req, res, next) => {
    let post = await Post.findById(req.params.id);
    if (!post) {
      res.status(404);
      throw new Error('Post not found');
    }
    post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ success: true, data: post });
  });

  // @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private (for now, public)
exports.deletePost = asyncHandler(async (req, res, next) => {
    const post = await Post.findById(req.params.id);
    if (!post) {
      res.status(404);
      throw new Error('Post not found');
    }
    await post.deleteOne(); // Use deleteOne() on the document
    res.status(200).json({ success: true, data: {} });
  });
  