import Category from './CategoryModel.js';
import Post from './PostModel.js';
import User from './UserModel.js';

// Export all models as named exports
export { Category, Post, User };

// Also set up the models on the mongoose instance
// This ensures that models can be accessed via mongoose.model('ModelName')
// which is sometimes needed by plugins and other libraries
const models = { Category, Post, User };

export default models;
