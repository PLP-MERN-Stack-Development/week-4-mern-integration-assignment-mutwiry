const Post = require('../models/PostModel');
const asyncHandler = require('../utils/asyncHandler');
const path = require('path');

// @desc    Get all posts with pagination
// @route   GET /api/posts
// @access  Public
exports.getPosts = asyncHandler(async (req, res, next) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Get total count of documents
        const total = await Post.countDocuments();
        
        // Get paginated posts with category population
        const posts = await Post.find({})
            .populate('categories', 'name')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // Calculate pagination metadata
        const totalPages = Math.ceil(total / limit);
        const hasNextPage = page < totalPages;
        const hasPreviousPage = page > 1;

        // Send response with pagination metadata
        res.status(200).json({
            success: true,
            count: posts.length,
            total,
            totalPages,
            currentPage: page,
            hasNextPage,
            hasPreviousPage,
            data: posts.map(post => ({
                ...post.toObject(),
                featuredImage: post.featuredImage ? 
                    `${req.protocol}://${req.get('host')}/${post.featuredImage.replace(/\\/g, '/')}` : 
                    null
            }))
        });

    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to load posts. Please try again later.',
            error: error.message
        });
    }
});

// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Public
exports.getPost = asyncHandler(async (req, res, next) => {
    const post = await Post.findById(req.params.id).populate('categories', 'name');
    
    if (!post) {
        res.status(404);
        throw new Error('Post not found');
    }

    // Convert to object to modify the response
    const postObject = post.toObject();
    
    // Add full URL to the featured image
    if (postObject.featuredImage) {
        postObject.featuredImage = `${req.protocol}://${req.get('host')}/${postObject.featuredImage.replace(/\\/g, '/')}`;
    }

    res.status(200).json({
        success: true,
        data: postObject
    });
});

// @desc    Create new post
// @route   POST /api/posts
// @access  Private (for now, public)
exports.createPost = asyncHandler(async (req, res, next) => {
  req.body.author = req.user.id;

  if (req.file) {
    req.body.featuredImage = req.file.path.replace('public/', '');
  }

  const post = await Post.create(req.body);

  res.status(201).json({
    success: true,
    data: post,
  });
});

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Private
exports.updatePost = asyncHandler(async (req, res, next) => {
  let post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).json({ success: false, message: 'Post not found' });
  }

  // Make sure user is post owner
  if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(401).json({ success: false, message: 'Not authorized to update this post' });
  }

  if (req.file) {
    req.body.featuredImage = req.file.path.replace('public/', '');
  }

  post = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: post });
});

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private
exports.deletePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).json({ success: false, message: 'Post not found' });
  }

  // Make sure user is post owner
  if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(401).json({ success: false, message: 'Not authorized to delete this post' });
  }

  // You might want to delete the associated image from the filesystem here

  await post.remove();

  res.status(200).json({ success: true, data: {} });
});