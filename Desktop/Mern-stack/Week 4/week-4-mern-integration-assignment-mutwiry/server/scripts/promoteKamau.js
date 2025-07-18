const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/blog_db';

async function promoteKamau() {
  try {
    await mongoose.connect(MONGODB_URI);
    const user = await User.findOneAndUpdate(
      { username: 'kamau200' },
      { $set: { role: 'admin' } },
      { new: true }
    );
    if (user) {
      console.log(`User '${user.username}' promoted to admin.`);
    } else {
      console.log('User kamau200 not found.');
    }
    await mongoose.disconnect();
  } catch (err) {
    console.error('Error promoting user:', err);
    process.exit(1);
  }
}

promoteKamau(); 