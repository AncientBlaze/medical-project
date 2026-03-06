import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import { MONGO_URI, DEMO_ADMIN_EMAIL, DEMO_ADMIN_PASSWORD } from './constants.js';
import User from '../models/User.js';

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Ensure demo admin user exists
    const existing = await User.findOne({ email: DEMO_ADMIN_EMAIL });
    if (!existing) {
      const hashed = await bcryptjs.hash(DEMO_ADMIN_PASSWORD, 10);
      await new User({
        name: 'Admin',
        email: DEMO_ADMIN_EMAIL,
        password: hashed,
        phone: '+1 (800) 123-4567',
        isAdmin: true
      }).save();
      console.log(`✅ Demo admin user created (email: ${DEMO_ADMIN_EMAIL} / pass: ${DEMO_ADMIN_PASSWORD})`);
    } else {
      console.log('✅ Demo admin user already exists');
    }
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};
