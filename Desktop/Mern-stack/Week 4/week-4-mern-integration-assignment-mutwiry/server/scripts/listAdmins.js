const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/blog_db';

async function listAdmins() {
  try {
    await mongoose.connect(MONGODB_URI);
    const admins = await User.find({ role: 'admin' });
    if (admins.length === 0) {
      console.log('No admin users found.');
    } else {
      console.log('Admin users:');
      admins.forEach(admin => {
        console.log(`- ${admin.username} (${admin.email})`);
      });
    }
    await mongoose.disconnect();
  } catch (err) {
    console.error('Error listing admins:', err);
    process.exit(1);
  }
}

listAdmins(); 