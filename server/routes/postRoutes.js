const express = require('express');
const router = express.Router();

const Post = require('../models/PostModel');
const {getPosts, getPost, createPost, updatePost, deletePost} = require('../controllers/postController');
 
router.route('/').get(getPosts).post(createPost);
router.route('/:id').get(getPost).put(updatePost).delete(deletePost);

module.exports = router;
