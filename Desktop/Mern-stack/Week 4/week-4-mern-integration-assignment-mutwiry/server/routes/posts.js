const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Post = require('../models/Post');
const { auth } = require('../middleware/auth');
const Comment = require('../models/Comment');
const mongoose = require('mongoose');

// Get all posts with pagination
router.get('/', async (req, res) => {
  try {
    console.log('Fetching posts with query:', req.query); // Debug log
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .populate('author', 'username')
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments();

    console.log(`Found ${posts.length} posts`); // Debug log

    res.json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalPosts: total
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ 
      message: 'Error fetching posts',
      error: error.message 
    });
  }
});

// Get single post
router.get('/:id', async (req, res) => {
  try {
    console.log('Fetching post with ID:', req.params.id); // Debug log

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      console.log('Invalid post ID format:', req.params.id); // Debug log
      return res.status(400).json({ message: 'Invalid post ID format' });
    }

    const post = await Post.findById(req.params.id)
      .populate('author', 'username')
      .populate('category', 'name')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'username'
        }
      })
      .lean();

    if (!post) {
      console.log('Post not found:', req.params.id); // Debug log
      return res.status(404).json({ message: 'Post not found' });
    }

    console.log('Post found:', {
      id: post._id,
      title: post.title,
      commentsCount: post.comments ? post.comments.length : 0
    }); // Debug log

    res.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ 
      message: 'Error fetching post',
      error: error.message 
    });
  }
});

// Create post
router.post('/', auth, [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('content').trim().notEmpty().withMessage('Content is required'),
  body('category').isMongoId().withMessage('Valid category ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, category, tags, featuredImage } = req.body;

    // Log the request data
    console.log('Creating post with data:', {
      title,
      content,
      category,
      author: req.user._id,
      tags,
      featuredImage
    });

    const post = new Post({
      title,
      content,
      category,
      author: req.user._id,
      tags: tags || [],
      featuredImage
    });

    const savedPost = await post.save();
    console.log('Post created successfully:', savedPost);
    
    // Populate the author and category fields before sending response
    const populatedPost = await Post.findById(savedPost._id)
      .populate('author', 'username')
      .populate('category', 'name');

    res.status(201).json(populatedPost);
  } catch (error) {
    console.error('Error creating post:', error);
    
    // Handle specific Mongoose errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation Error',
        errors: Object.values(error.errors).map(e => e.message)
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        message: 'Duplicate Error',
        field: Object.keys(error.keyPattern)[0]
      });
    }

    res.status(500).json({
      message: 'Error creating post',
      error: error.message
    });
  }
});

// Update post
router.put('/:id', auth, [
  body('title').optional().trim().notEmpty(),
  body('content').optional().trim().notEmpty(),
  body('category').optional().isMongoId()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user is author or admin
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updates = Object.keys(req.body);
    updates.forEach(update => post[update] = req.body[update]);
    await post.save();

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete post
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user is author or admin
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await post.remove();
    res.json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add comment to post
router.post('/:id/comments', auth, [
  body('content').trim().notEmpty().withMessage('Comment content is required')
], async (req, res) => {
  try {
    console.log('Adding comment to post:', req.params.id); // Debug log

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = await post.addComment(req.user._id, req.body.content);
    
    // Populate the author field before sending response
    const populatedComment = await Comment.findById(comment._id)
      .populate('author', 'username');

    console.log('Comment added successfully:', {
      commentId: populatedComment._id,
      postId: post._id,
      author: populatedComment.author.username
    });

    res.status(201).json(populatedComment);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ 
      message: 'Error adding comment',
      error: error.message 
    });
  }
});

module.exports = router; 