import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from '../server/models/CategoryModel.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

const listCategories = async () => {
  try {
    await connectDB();
    const categories = await Category.find({});
    
    if (categories.length === 0) {
      console.log('No categories found in the database.');
      console.log('Creating default categories...');
      
      const defaultCategories = [
        { name: 'Technology', description: 'Posts about technology' },
        { name: 'Lifestyle', description: 'Lifestyle related posts' },
        { name: 'Travel', description: 'Travel experiences and guides' },
        { name: 'Food', description: 'Food and recipes' },
        { name: 'Health', description: 'Health and wellness' }
      ];
      
      const createdCategories = await Category.insertMany(defaultCategories);
      console.log('Created default categories:', createdCategories);
    } else {
      console.log('Categories in database:');
      console.log(JSON.stringify(categories, null, 2));
    }
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
};

listCategories();
