import Post from '../models/PostModel.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// @desc    Fetch all posts with pagination
// @route   GET /api/posts
// @access  Public
export const getPosts = asyncHandler(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find({})
        .populate('categories', 'name')
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip);
        
    const count = await Post.countDocuments();
    
    res.status(200).json({ 
        success: true, 
        count: posts.length,
        totalCount: count,
        data: posts,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(count / limit),
            hasNextPage: page < Math.ceil(count / limit),
            hasPreviousPage: page > 1
        }
    });
});

// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Public
export const getPostById = asyncHandler(async (req, res, next) => {
    const post = await Post.findById(req.params.id).populate('categories', 'name');
    if (!post) {
      res.status(404);
      throw new Error('Post not found');
    }
    res.status(200).json({ success: true, data: post });
});

// @desc    Create new post
// @route   POST /api/posts
// @access  Private
export const createPost = asyncHandler(async (req, res) => {
    const { title, content, categories, featuredImage } = req.body;
    
    // Basic validation
    if (!title || !content || !categories || !Array.isArray(categories) || categories.length === 0) {
        res.status(400);
        throw new Error('Please provide title, content, and at least one category');
    }
    
    // Generate a base slug from the title
    const baseSlug = title.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '');
    
    let slug = baseSlug;
    let post;
    
    // Keep trying to create the post until we find a unique slug
    while (true) {
        try {
            post = await Post.create({ 
                title, 
                content, 
                categories,
                slug,
                featuredImage,
                user: req.user._id // Set the user from the authenticated request
            });
            break; // If we get here, the post was created successfully
        } catch (error) {
            // Check if the error is a duplicate key error (code 11000 is MongoDB's duplicate key error)
            if (error.code === 11000 && error.keyPattern && error.keyPattern.slug) {
                // Append a random string to make the slug unique
                slug = `${baseSlug}-${Math.random().toString(36).substring(2, 7)}`;
            } else {
                // If it's a different error, re-throw it
                throw error;
            }
        }
    }
    
    // Populate the user and categories before sending the response
    await post.populate('user', 'name email');
    await post.populate('categories', 'name');
    
    res.status(201).json({ 
        success: true, 
        data: post 
    });
});

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Private
export const updatePost = asyncHandler(async (req, res) => {
    let post = await Post.findById(req.params.id);
    
    if (!post) {
        res.status(404);
        throw new Error('Post not found');
    }
    
    // Make sure user is post owner or admin
    if (post.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(401);
        throw new Error('Not authorized to update this post');
    }
    
    // If updating categories, ensure it's an array with at least one category
    if (req.body.categories && (!Array.isArray(req.body.categories) || req.body.categories.length === 0)) {
        res.status(400);
        throw new Error('Categories must be a non-empty array');
    }
    
    // Update the post
    post = await Post.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        {
            new: true,
            runValidators: true
        }
    )
    .populate('categories', 'name')
    .populate('user', 'name email');
    
    res.status(200).json({ 
        success: true, 
        data: post 
    });
});

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private
export const deletePost = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
        res.status(404);
        throw new Error('Post not found');
    }
    
    // Make sure user is post owner or admin
    if (post.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(401);
        throw new Error('Not authorized to delete this post');
    }
    
    await post.remove();
    
    res.status(200).json({ 
        success: true, 
        data: {}
    });
});