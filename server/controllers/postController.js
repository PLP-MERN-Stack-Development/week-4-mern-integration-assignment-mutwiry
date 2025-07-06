import mongoose from 'mongoose';
import slugify from 'slugify';
import Post from '../models/PostModel.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// @desc    Fetch all posts with pagination
// @route   GET /api/posts
// @access  Public
export const getPosts = asyncHandler(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build the filter object
    const filter = {};
    if (req.query.keyword) {
        const keyword = {
            $regex: req.query.keyword,
            $options: 'i', // Case-insensitive
        };
        filter.$or = [
            { title: keyword },
            { content: keyword }
        ];
    }

    // Get total count with filters applied
    const totalCount = await Post.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / limit);

    const posts = await Post.find(filter)
        .populate('categories', 'name')
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip);
    
    res.status(200).json({ 
        success: true, 
        count: posts.length,
        totalCount,
        data: posts,
        pagination: {
            currentPage: page,
            totalPages,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1
        }
    });
});

// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Public
export const getPostById = asyncHandler(async (req, res, next) => {
    const postId = req.params.id;
    console.log('Fetching post with ID:', postId);
    
    // Validate post ID format
    if (!mongoose.Types.ObjectId.isValid(postId)) {
        console.error('Invalid post ID format:', postId);
        res.status(400);
        throw new Error('Invalid post ID format');
    }
    
    try {
        const post = await Post.findById(postId)
            .populate('categories', 'name')
            .populate('user', 'name email');
            
        if (!post) {
            console.error('Post not found with ID:', postId);
            res.status(404);
            throw new Error('Post not found');
        }
        
        console.log('Successfully found post:', {
            id: post._id,
            title: post.title,
            categories: post.categories
        });
        
        res.status(200).json({ 
            success: true, 
            data: post 
        });
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500);
        throw new Error('Server error while fetching post');
    }
});

// @desc    Create new post
// @route   POST /api/posts
// @access  Private
export const createPost = asyncHandler(async (req, res) => {
    try {
        console.log('Received create post request with body:', req.body);
        console.log('Authenticated user:', req.user);
        
        const { title, content, category } = req.body;
        const featuredImage = req.body.featuredImage || '';
        
        // Basic validation
        if (!title || !title.trim()) {
            console.log('Validation failed: Missing title');
            res.status(400);
            throw new Error('Please provide a title');
        }
        
        if (!content || !content.trim()) {
            console.log('Validation failed: Missing content');
            res.status(400);
            throw new Error('Please provide content');
        }
        
        if (!category) {
            console.log('Validation failed: Missing category');
            res.status(400);
            throw new Error('Please select a category');
        }
        
        // Ensure category is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(category)) {
            console.log('Validation failed: Invalid category ID format');
            res.status(400);
            throw new Error('Invalid category ID');
        }
        
        // Import the Category model
        const Category = mongoose.model('Category');
        
        // Ensure we have a category
        if (!category) {
            // Try to find or create a default category
            console.log('No category provided. Looking for default category...');
            let defaultCategory = await Category.findOne({ name: 'Uncategorized' });
            
            if (!defaultCategory) {
                console.log('Creating default category...');
                try {
                    defaultCategory = await Category.create({
                        name: 'Uncategorized',
                        description: 'Default category for uncategorized posts'
                    });
                    console.log('Created default category:', defaultCategory);
                } catch (err) {
                    console.error('Error creating default category:', err);
                    throw new Error('Failed to create default category');
                }
            }
            
            category = defaultCategory._id;
        }

        // Convert single category to array if needed
        const categoryArray = Array.isArray(category) ? category : [category];
        
        // Validate and convert category IDs
        const categories = [];
        for (const cat of categoryArray) {
            let categoryId = cat._id ? cat._id : cat; // Handle both object and string IDs
            
            // Skip if categoryId is not provided
            if (!categoryId) continue;
            
            // Check if the category ID is valid
            if (!mongoose.Types.ObjectId.isValid(categoryId)) {
                console.error(`Invalid category ID format: ${categoryId}`);
                throw new Error(`Invalid category ID format: ${categoryId}`);
            }
            
            // Try to find the category
            let category = await Category.findById(categoryId);
            
            // If category doesn't exist, create it
            if (!category) {
                console.log(`Category ${categoryId} not found. Creating a new category...`);
                try {
                    // Try to get category name from the request or use a meaningful default
                    const categoryName = cat.name || 'Uncategorized';
                    category = await Category.create({
                        _id: categoryId, // Use the provided ID
                        name: categoryName,
                        description: `Auto-created category (${categoryName})`,
                        createdBy: req.user._id // Add the current user as the creator
                    });
                    console.log(`Created new category:`, category);
                } catch (err) {
                    console.error('Error creating category:', err);
                    // If creation fails (e.g., duplicate key), try to find it again
                    category = await Category.findById(categoryId);
                    if (!category) {
                        throw new Error(`Failed to create/find category: ${categoryId}`);
                    }
                }
            }
            
            categories.push(category._id);
        }
        
        console.log('Processed categories:', categories);
        
        // Create a new post object with the data
        const postData = {
            title: title ? title.trim() : '',
            content: content ? content.trim() : '',
            categories: categories,
            featuredImage: featuredImage ? featuredImage.trim() : '',
            user: req.user._id,
            status: 'draft',
            meta: {
                views: 0,
                likes: 0,
                comments: 0
            },
            slug: slugify(title, { lower: true, strict: true })
        };
        
        console.log('Creating post with data:', postData);
        
        // Log the post data for debugging
        console.log('Post data before save:', {
            ...postData,
            categories: postData.categories.map(cat => cat.toString())
        });
        
        console.log('Post data before save:', {
            ...postData,
            categories: postData.categories.map(cat => cat.toString())
        });
        
        // Generate a base slug from the title
        const baseSlug = title.toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, '');
        
        let slug = baseSlug;
        let post;
        let attempt = 0;
        const maxAttempts = 5;
        
        console.log('Post data before save:', { ...postData, slug });
        
        // Keep trying to create the post until we find a unique slug
        while (attempt < maxAttempts) {
            attempt++;
            try {
                console.log(`Attempt ${attempt} to create post with slug: ${slug}`);
                
                // Create a new post with the current slug
                const postToCreate = { ...postData, slug };
                
                // Save the post to the database
                const post = await Post.create(postToCreate);
                
                // Populate the categories for the response
                const populatedPost = await Post.findById(post._id)
                    .populate('categories', 'name');
                
                console.log('Post created successfully:', populatedPost);
                res.status(201).json({
                    success: true,
                    message: 'Post created successfully',
                    data: populatedPost
                });
                return;
                
            } catch (error) {
                // Check if the error is a duplicate key error (code 11000 is MongoDB's duplicate key error)
                if (error.code === 11000 && error.keyPattern && error.keyPattern.slug) {
                    // Append a random string to make the slug unique
                    slug = `${baseSlug}-${Math.random().toString(36).substring(2, 7)}`;
                    continue; // Try again with the new slug
                } else {
                    // Log the error and rethrow it
                    console.error('Error creating post:', error);
                    res.status(500);
                    throw new Error('Failed to create post. Please try again.');
                }
            }
        }
        
        // If we get here, we've exceeded the maximum number of attempts
        console.error(`Failed to create post after ${maxAttempts} attempts`);
        res.status(500);
        throw new Error('Failed to create post after multiple attempts. Please try again.');
        
    } catch (error) {
        console.error('Error in createPost controller:', error);
        // If the error already has a status code, use it; otherwise, default to 500
        if (!res.statusCode || res.statusCode === 200) {
            res.status(500);
        }
        throw error; // This will be caught by the asyncHandler
    }
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
    
    // Prepare update data
    const updateData = { ...req.body };
    
    // If there's a new image, update it, otherwise keep the existing one
    if (req.body.featuredImage === '') {
      delete updateData.featuredImage; // Don't update if empty string
    }
    
    // Update the post
    post = await Post.findByIdAndUpdate(
        req.params.id,
        { $set: updateData },
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