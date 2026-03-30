import express from 'express';
import bcryptjs from 'bcryptjs';
import twilio from 'twilio';

import { generateToken, extractToken, verifyToken } from '../utils/token.js';
import User from '../models/User.js';

const router = express.Router();

if (!process.env.TWILIO_SID || !process.env.TWILIO_AUTH_TOKEN) {
  throw new Error('Twilio env not configured');
}

const client = twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required' });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: 'Invalid email or password' });

    const valid = await bcryptjs.compare(password, user.password);
    if (!valid)
      return res.status(401).json({ message: 'Invalid email or password' });

    // // 🔒 Optional: require phone verification
    // if (!user.isVerified) {
    //   return res.status(403).json({ message: 'Please verify your phone via OTP' });
    // }

    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin
      }
    });
  } catch (err) {
    console.error('Login error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password || !phone)
      return res.status(400).json({ message: 'All fields are required' });

    if (!/^\+\d{10,15}$/.test(phone))
      return res.status(400).json({ message: 'Invalid phone format (+91XXXXXXXXXX)' });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(409).json({ message: 'Email already registered' });

    const hashed = await bcryptjs.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashed,
      phone
    });

    await newUser.save();

    res.status(201).json({
      message: 'Signup successful. Please verify phone via OTP.'
    });
  } catch (err) {
    console.error('Signup error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/send-otp', async (req, res) => {
  try {
    let { phone } = req.body;

    if (!phone)
      return res.status(400).json({ message: 'Phone is required' });

    // 🧹 Remove spaces, dashes etc
    phone = phone.replace(/\D/g, '');

    // 🇮🇳 If 10 digit → assume India (+91)
    if (phone.length === 10) {
      phone = `+91${phone}`;
    }
    // 🌍 If starts with country code but no "+"
    else if (phone.length > 10 && !phone.startsWith('+')) {
      phone = `+${phone}`;
    }

    // ✅ Final validation (E.164 format)
    if (!/^\+\d{10,15}$/.test(phone)) {
      return res.status(400).json({ message: 'Invalid phone format' });
    }

    const user = await User.findOne({ phone });
    if (!user)
      return res.status(404).json({ message: 'User not found. Please signup first.' });

    // ⛔ Cooldown (30 sec)
    if (user.otpSentAt && Date.now() - user.otpSentAt < 30 * 1000) {
      return res.status(429).json({ message: 'Wait before requesting another OTP' });
    }

    const otp = generateOTP();

    user.otp = await bcryptjs.hash(otp, 10);
    user.otpExpires = new Date(Date.now() + 5 * 60 * 1000);
    user.otpSentAt = Date.now();

    await user.save();
    // 📩 Send SMS
    await client.messages.create({
      body: `Your OTP is ${otp}`,
      from: process.env.TWILIO_PHONE,
      to: phone
    });

    res.json({ message: 'OTP sent successfully' });

  } catch (err) {
    console.error('Send OTP error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/verify-otp', async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp)
      return res.status(400).json({ message: 'Phone and OTP required' });

    const user = await User.findOne({ phone });

    if (!user)
      return res.status(404).json({ message: 'User not found' });

    if (!user.otp || !user.otpExpires)
      return res.status(400).json({ message: 'No OTP found' });

    if (user.otpExpires < new Date())
      return res.status(400).json({ message: 'OTP expired' });

    const isMatch = await bcryptjs.compare(otp, user.otp);

    if (!isMatch)
      return res.status(400).json({ message: 'Invalid OTP' });

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save();

    const token = generateToken(user);

    res.json({
      message: 'OTP verified successfully',
      token,
      user: {
        id: user._id,
        phone: user.phone,
        isAdmin: user.isAdmin
      }
    });

  } catch (err) {
    console.error('Verify OTP error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/verify', async (req, res) => {
  try {
    const token = extractToken(req.headers.authorization);

    if (!token)
      return res.status(401).json({ message: 'No token provided' });

    const decoded = verifyToken(token);

    if (!decoded)
      return res.status(401).json({ message: 'Invalid token' });

    const user = await User.findById(decoded.id);

    if (!user)
      return res.status(404).json({ message: 'User not found' });

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin
      }
    });

  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

export default router;