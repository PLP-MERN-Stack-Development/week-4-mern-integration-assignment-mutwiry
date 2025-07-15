import express from "express";
import {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost
} from "../controllers/postsController.js";

const router = express.Router();

// GET all posts
router.get("/", getAllPosts);

// GET single post by ID
router.get("/:id", getPostById);

// POST create new post
router.post("/", createPost);

// PUT update existing post
router.put("/:id", updatePost);

// DELETE remove post
router.delete("/:id", deletePost);

export default router;
