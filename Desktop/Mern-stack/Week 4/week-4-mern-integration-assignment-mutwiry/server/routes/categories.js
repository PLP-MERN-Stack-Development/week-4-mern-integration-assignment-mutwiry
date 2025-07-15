import express from "express";
import {
  getAllCategories,
  createCategory
} from "../controllers/categoriesController.js";

const router = express.Router();

// GET all categories
router.get("/", getAllCategories);

// POST create category
router.post("/", createCategory);

export default router;
